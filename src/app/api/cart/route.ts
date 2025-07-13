import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Product from '@/models/Product';

// Cart item interface
interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  addedAt: Date;
}

// In-memory cart storage (in production, use database or session storage)
const cartStorage: { [sessionId: string]: CartItem[] } = {};

// Generate session ID (in production, use proper session management)
function getSessionId(request: NextRequest): string {
  return request.headers.get('x-session-id') || 'default-session';
}

// GET /api/cart - Get cart items
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const sessionId = getSessionId(request);
    const cartItems = cartStorage[sessionId] || [];
    
    if (cartItems.length === 0) {
      return NextResponse.json({
        success: true,
        cart: {
          items: [],
          total: 0,
          itemCount: 0
        }
      });
    }
    
    // Fetch product details for cart items
    const populatedItems = [];
    let total = 0;
    let itemCount = 0;
    
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      
      let variant = null;
      let price = 0;
      
      if (item.variantId && product.variants) {
        variant = product.variants.id(item.variantId);
        if (variant) {
          price = variant.price;
        }
      } else if (product.variants && product.variants.length > 0) {
        // Use default variant if no specific variant selected
        variant = product.variants.find((v: { isDefault: boolean }) => v.isDefault) || product.variants[0];
        price = variant.price;
      }
      
      if (price > 0) {
        const itemTotal = price * item.quantity;
        total += itemTotal;
        itemCount += item.quantity;
        
        populatedItems.push({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          addedAt: item.addedAt,
          product: {
            _id: product._id,
            name: product.name,
            image: product.image,
            category: product.category
          },
          variant: variant ? {
            _id: variant._id,
            name: variant.name,
            price: variant.price,
            inStock: variant.inStock
          } : null,
          price,
          itemTotal
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      cart: {
        items: populatedItems,
        total: Math.round(total * 100) / 100, // Round to 2 decimal places
        itemCount
      }
    });
    
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { productId, variantId, quantity = 1 } = body;
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Validate quantity
    if (quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }
    
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Verify variant if specified
    let variant = null;
    if (variantId) {
      if (!product.variants) {
        return NextResponse.json(
          { success: false, error: 'Product has no variants' },
          { status: 400 }
        );
      }
      variant = product.variants.id(variantId);
      if (!variant) {
        return NextResponse.json(
          { success: false, error: 'Variant not found' },
          { status: 404 }
        );
      }
      if (!variant.inStock) {
        return NextResponse.json(
          { success: false, error: 'Variant is out of stock' },
          { status: 400 }
        );
      }
      if (variant.stockQuantity <= 0) {
        return NextResponse.json(
          { success: false, error: 'Variant is out of stock' },
          { status: 400 }
        );
      }
      if (quantity > variant.stockQuantity) {
        return NextResponse.json(
          { success: false, error: `Only ${variant.stockQuantity} items available in stock` },
          { status: 400 }
        );
      }
    } else if (product.variants && product.variants.length > 0) {
      // Use default variant if no variant specified
      variant = product.variants.find((v: { isDefault: boolean }) => v.isDefault) || product.variants[0];
      if (!variant.inStock || variant.stockQuantity <= 0) {
        return NextResponse.json(
          { success: false, error: 'Product is out of stock' },
          { status: 400 }
        );
      }
      if (quantity > variant.stockQuantity) {
        return NextResponse.json(
          { success: false, error: `Only ${variant.stockQuantity} items available in stock` },
          { status: 400 }
        );
      }
    } else {
      // Product without variants - check product-level stock
      if (product.inStock === false) {
        return NextResponse.json(
          { success: false, error: 'Product is out of stock' },
          { status: 400 }
        );
      }
    }
    
    const sessionId = getSessionId(request);
    if (!cartStorage[sessionId]) {
      cartStorage[sessionId] = [];
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cartStorage[sessionId].findIndex(item =>
      item.productId === productId && item.variantId === variantId
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity - check if new total exceeds stock
      const newTotalQuantity = cartStorage[sessionId][existingItemIndex].quantity + quantity;
      const maxStock = variant ? variant.stockQuantity : Infinity;
      
      if (variant && newTotalQuantity > maxStock) {
        return NextResponse.json(
          { success: false, error: `Cannot add ${quantity} more items. Only ${maxStock} total available, you already have ${cartStorage[sessionId][existingItemIndex].quantity} in cart.` },
          { status: 400 }
        );
      }
      
      cartStorage[sessionId][existingItemIndex].quantity = newTotalQuantity;
    } else {
      // Add new item
      cartStorage[sessionId].push({
        productId,
        variantId,
        quantity,
        addedAt: new Date()
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Item added to cart successfully'
    });
    
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, variantId, quantity } = body;
    
    if (!productId || quantity < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    const sessionId = getSessionId(request);
    if (!cartStorage[sessionId]) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }
    
    const itemIndex = cartStorage[sessionId].findIndex(item =>
      item.productId === productId && item.variantId === variantId
    );
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }
    
    if (quantity === 0) {
      // Remove item
      cartStorage[sessionId].splice(itemIndex, 1);
    } else {
      // Update quantity
      cartStorage[sessionId][itemIndex].quantity = quantity;
    }
    
    return NextResponse.json({
      success: true,
      message: 'Cart updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear cart or remove specific item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const variantId = searchParams.get('variantId');
    
    const sessionId = getSessionId(request);
    
    if (!productId) {
      // Clear entire cart
      cartStorage[sessionId] = [];
    } else {
      // Remove specific item
      if (!cartStorage[sessionId]) {
        return NextResponse.json(
          { success: false, error: 'Cart not found' },
          { status: 404 }
        );
      }
      
      const itemIndex = cartStorage[sessionId].findIndex(item =>
        item.productId === productId && 
        (variantId ? item.variantId === variantId : !item.variantId)
      );
      
      if (itemIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Item not found in cart' },
          { status: 404 }
        );
      }
      
      cartStorage[sessionId].splice(itemIndex, 1);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Item removed successfully'
    });
    
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}
