import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Product from '@/models/Product';
import Cart from '@/models/Cart';
import { randomBytes } from 'crypto';



// Generate or get session ID from cookies, set if missing
function getOrSetSessionId(request: NextRequest): { sessionId: string; responseCookie?: string } {
  const cookie = request.cookies.get('session_id');
  if (cookie && cookie.value) {
    return { sessionId: cookie.value };
  }
  // Generate a secure random session ID
  const sessionId = randomBytes(16).toString('hex');
  // Set cookie for 30 days
  const cookieStr = `session_id=${sessionId}; Path=/; HttpOnly; Max-Age=${60 * 60 * 24 * 30}`;
  return { sessionId, responseCookie: cookieStr };
}

// GET /api/cart - Get cart items
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { sessionId, responseCookie } = getOrSetSessionId(request);
  const cartDoc = await Cart.findOne({ sessionId });
    const cartItems = cartDoc ? cartDoc.items : [];
    if (!cartItems || cartItems.length === 0) {
      const res = NextResponse.json({
        success: true,
        cart: { items: [], total: 0, itemCount: 0 }
      });
      if (responseCookie) res.headers.set('Set-Cookie', responseCookie);
      return res;
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
        if (variant) price = variant.price;
      } else if (product.variants && product.variants.length > 0) {
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
    const res = NextResponse.json({
      success: true,
      cart: {
        items: populatedItems,
        total: Math.round(total * 100) / 100,
        itemCount
      }
    });
    if (responseCookie) res.headers.set('Set-Cookie', responseCookie);
    return res;
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
    const { sessionId, responseCookie } = getOrSetSessionId(request);
    const body = await request.json();
    const { productId, variantId, quantity = 1 } = body;
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }
    if (quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
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
      if (product.inStock === false) {
        return NextResponse.json(
          { success: false, error: 'Product is out of stock' },
          { status: 400 }
        );
      }
    }
    let cartDoc = await Cart.findOne({ sessionId });
    if (!cartDoc) {
      cartDoc = await Cart.create({ sessionId, items: [] });
    }
    // Check if item already exists in cart
    const existingItemIndex = cartDoc.items.findIndex((item: typeof cartDoc.items[0]) =>
      item.productId === productId && item.variantId === variantId
    );
    if (existingItemIndex >= 0) {
      const newTotalQuantity = cartDoc.items[existingItemIndex].quantity + quantity;
      const maxStock = variant ? variant.stockQuantity : Infinity;
      if (variant && newTotalQuantity > maxStock) {
        return NextResponse.json(
          { success: false, error: `Cannot add ${quantity} more items. Only ${maxStock} total available, you already have ${cartDoc.items[existingItemIndex].quantity} in cart.` },
          { status: 400 }
        );
      }
      cartDoc.items[existingItemIndex].quantity = newTotalQuantity;
    } else {
      cartDoc.items.push({
        productId,
        variantId,
        quantity,
        addedAt: new Date()
      });
    }
    await cartDoc.save();
    const res = NextResponse.json({
      success: true,
      message: 'Item added to cart successfully'
    });
    if (responseCookie) res.headers.set('Set-Cookie', responseCookie);
    return res;
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
    await connectDB();
    const { sessionId, responseCookie } = getOrSetSessionId(request);
    const body = await request.json();
    const { productId, variantId, quantity } = body;
    if (!productId || quantity < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }
  const cartDoc = await Cart.findOne({ sessionId });
    if (!cartDoc) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }
    const itemIndex = cartDoc.items.findIndex((item: typeof cartDoc.items[0]) =>
      item.productId === productId && item.variantId === variantId
    );
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }
    if (quantity === 0) {
      cartDoc.items.splice(itemIndex, 1);
    } else {
      cartDoc.items[itemIndex].quantity = quantity;
    }
    await cartDoc.save();
    const res = NextResponse.json({
      success: true,
      message: 'Cart updated successfully'
    });
    if (responseCookie) res.headers.set('Set-Cookie', responseCookie);
    return res;
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
    await connectDB();
    const { sessionId, responseCookie } = getOrSetSessionId(request);
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const variantId = searchParams.get('variantId');
  const cartDoc = await Cart.findOne({ sessionId });
    if (!cartDoc) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }
    if (!productId) {
      // Clear entire cart
      cartDoc.items = [];
    } else {
      const itemIndex = cartDoc.items.findIndex((item: typeof cartDoc.items[0]) =>
        item.productId === productId && (variantId ? item.variantId === variantId : !item.variantId)
      );
      if (itemIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Item not found in cart' },
          { status: 404 }
        );
      }
      cartDoc.items.splice(itemIndex, 1);
    }
    await cartDoc.save();
    const res = NextResponse.json({
      success: true,
      message: 'Item removed successfully'
    });
    if (responseCookie) res.headers.set('Set-Cookie', responseCookie);
    return res;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}
