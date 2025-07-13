import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Order from '@/models/Order';
import Product from '@/models/Product';

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { customerInfo, items, total } = body;

    // Validation
    if (!customerInfo || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: customerInfo, items' },
        { status: 400 }
      );
    }

    // Validate customer info
    const { firstName, lastName, email, phone, address, city, postalCode, country } = customerInfo;
    if (!firstName || !lastName || !email || !phone || !address || !city || !postalCode || !country) {
      return NextResponse.json(
        { success: false, error: 'Missing required customer information' },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Validate products and prepare order items
    const orderProducts = [];

    for (const item of items) {
      const { productId, variantId, quantity, price } = item;
      
      if (!productId || !quantity || quantity < 1) {
        return NextResponse.json(
          { success: false, error: 'Invalid product data' },
          { status: 400 }
        );
      }

      // Verify product exists
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product with ID ${productId} not found` },
          { status: 404 }
        );
      }

      // Check if variant exists if specified
      let variant = null;
      if (variantId && product.variants) {
        variant = product.variants.id(variantId);
        if (!variant) {
          return NextResponse.json(
            { success: false, error: `Variant with ID ${variantId} not found` },
            { status: 404 }
          );
        }
        if (!variant.inStock) {
          return NextResponse.json(
            { success: false, error: `Variant ${variant.name} is out of stock` },
            { status: 400 }
          );
        }
      }

      orderProducts.push({
        productId,
        name: product.name,
        price: price,
        quantity,
        image: product.image,
        variant: variant ? {
          variantId: variant._id,
          name: variant.name
        } : null
      });
    }

    // Create new order
    const order = new Order({
      orderNumber,
      clientName: `${firstName} ${lastName}`,
      clientEmail: email,
      clientPhone: phone,
      clientAddress: `${address}, ${city}, ${postalCode}, ${country}`,
      products: orderProducts,
      total,
      status: 'pending'
    });

    const savedOrder = await order.save();

    return NextResponse.json({
      success: true,
      orderId: orderNumber,
      order: savedOrder,
      message: 'Order created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
