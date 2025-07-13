import { NextRequest, NextResponse } from 'next/server';

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

// PUT /api/cart/[itemId] - Update cart item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { quantity } = await request.json();
    const sessionId = getSessionId(request);
    const { itemId } = await params;
    
    if (!cartStorage[sessionId]) {
      cartStorage[sessionId] = [];
    }
    
    // Find item by creating a unique ID from productId and variantId
    const cartItems = cartStorage[sessionId];
    const itemIndex = cartItems.findIndex(item => {
      const currentItemId = item.variantId 
        ? `${item.productId}-${item.variantId}` 
        : item.productId;
      return currentItemId === itemId;
    });
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cartItems.splice(itemIndex, 1);
    } else {
      // Update quantity
      cartItems[itemIndex].quantity = quantity;
    }
    
    return NextResponse.json({
      success: true,
      message: quantity <= 0 ? 'Item removed from cart' : 'Cart updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[itemId] - Remove item from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const sessionId = getSessionId(request);
    const { itemId } = await params;
    
    if (!cartStorage[sessionId]) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }
    
    const cartItems = cartStorage[sessionId];
    const itemIndex = cartItems.findIndex(item => {
      const currentItemId = item.variantId 
        ? `${item.productId}-${item.variantId}` 
        : item.productId;
      return currentItemId === itemId;
    });
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }
    
    cartItems.splice(itemIndex, 1);
    
    return NextResponse.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
    
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
}
