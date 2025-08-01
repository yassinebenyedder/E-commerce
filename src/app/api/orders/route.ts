import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Order from '@/models/Order';
import Product from '@/models/Product';

// Interface for product variant
interface IVariant {
  _id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  sku?: string;
  inStock: boolean;
  stockQuantity: number;
  isDefault: boolean;
}

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
    const { firstName, lastName, email, phone, address } = customerInfo;
    if (!firstName || !lastName || !email || !phone || !address) {
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
      clientAddress: address,
      products: orderProducts,
      total,
      status: 'pending'
    });

    const savedOrder = await order.save();

    // After order is successfully created, update inventory quantities
    for (const item of items) {
      const { productId, variantId, quantity } = item;
      
      const product = await Product.findById(productId);
      if (!product) continue;

      if (variantId && product.variants) {
        // Update variant stock quantity
        const variant = product.variants.id(variantId);
        if (variant) {
          variant.stockQuantity = Math.max(0, variant.stockQuantity - quantity);
          variant.inStock = variant.stockQuantity > 0;
        }
      } else if (product.variants && product.variants.length > 0) {
        // Update default variant stock if no specific variant
        const defaultVariant = product.variants.find((v: IVariant) => v.isDefault) || product.variants[0];
        if (defaultVariant) {
          defaultVariant.stockQuantity = Math.max(0, defaultVariant.stockQuantity - quantity);
          defaultVariant.inStock = defaultVariant.stockQuantity > 0;
        }
      }

      // Update product-level inStock status based on all variants
      if (product.variants && product.variants.length > 0) {
        product.inStock = product.variants.some((v: IVariant) => v.inStock);
      }

      await product.save();
    }

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
