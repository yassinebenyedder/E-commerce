'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types
interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  addedAt: Date;
  product: {
    _id: string;
    name: string;
    image: string;
    category: string;
  };
  variant?: {
    _id: string;
    name: string;
    price: number;
    inStock: boolean;
  } | null;
  price: number;
  itemTotal: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
}

// Actions
type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: { items: CartItem[]; total: number; itemCount: number } }
  | { type: 'CLEAR_CART' };

// Initial state
const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
  error: null,
};

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        itemCount: action.payload.itemCount,
        isLoading: false,
        error: null,
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
        isLoading: false,
        error: null,
      };
    
    default:
      return state;
  }
}

// Context
interface CartContextType extends CartState {
  addToCart: (productId: string, variantId?: string, quantity?: number) => Promise<void>;
  updateCartItem: (productId: string, variantId: string | undefined, quantity: number) => Promise<void>;
  removeFromCart: (productId: string, variantId?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Generate session ID for cart
function getSessionId(): string {
  if (typeof window === 'undefined') return 'default-session';
  
  let sessionId = localStorage.getItem('cart-session-id');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('cart-session-id', sessionId);
  }
  return sessionId;
}

// Provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch('/api/cart', {
        headers: {
          'x-session-id': getSessionId(),
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      const data = await response.json();
      if (data.success) {
        dispatch({
          type: 'SET_CART',
          payload: data.cart,
        });
      } else {
        throw new Error(data.error || 'Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to fetch cart',
      });
    }
  };

  // Add item to cart
  const addToCart = async (productId: string, variantId?: string, quantity = 1) => {
    // Validate quantity
    if (quantity <= 0) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Quantity must be greater than 0',
      });
      return;
    }
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': getSessionId(),
        },
        body: JSON.stringify({ productId, variantId, quantity }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add item to cart');
      }
      
      // Refresh cart after adding
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to add item to cart',
      });
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId: string, variantId: string | undefined, quantity: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': getSessionId(),
        },
        body: JSON.stringify({ productId, variantId, quantity }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update cart item');
      }
      
      // Refresh cart after updating
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart item:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to update cart item',
      });
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: string, variantId?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const params = new URLSearchParams({ productId });
      if (variantId) params.append('variantId', variantId);
      
      const response = await fetch(`/api/cart?${params}`, {
        method: 'DELETE',
        headers: {
          'x-session-id': getSessionId(),
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove item from cart');
      }
      
      // Refresh cart after removing
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to remove item from cart',
      });
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'x-session-id': getSessionId(),
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to clear cart');
      }
      
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to clear cart',
      });
    }
  };

  // Load cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const contextValue: CartContextType = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

// Hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export type { CartItem };
