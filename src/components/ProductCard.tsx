'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

interface ProductVariant {
  _id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  sku?: string;
  inStock: boolean;
  stockQuantity: number;
  isDefault: boolean;
}

interface Product {
  _id?: string;
  id?: number;
  name: string;
  basePrice?: number; // From database
  price?: number; // For backward compatibility
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  isOnSale?: boolean;
  variants?: ProductVariant[];
  description?: string;
  inStock?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Calculate display price and price range for variants
  const hasVariants = product.variants && product.variants.length > 0;
  const defaultVariant = hasVariants ? product.variants?.find(v => v.isDefault) || product.variants?.[0] : null;
  const displayPrice = defaultVariant?.price || product.basePrice || product.price || 0;
  const originalPrice = defaultVariant?.originalPrice || product.originalPrice;
  
  const priceRange = product.variants && product.variants.length > 1 
    ? {
        min: Math.min(...product.variants.map(v => v.price)),
        max: Math.max(...product.variants.map(v => v.price))
      }
    : null;

  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;

  const productId = product._id || product.id;
  const isInStock = hasVariants ? (defaultVariant?.inStock ?? true) : (product.inStock !== false);
  const stockQuantity = hasVariants ? (defaultVariant?.stockQuantity ?? 0) : 0;
  const hasStock = hasVariants ? (isInStock && stockQuantity > 0) : isInStock;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!productId || !hasStock) return;
    
    try {
      setIsAddingToCart(true);
      await addToCart(productId.toString(), defaultVariant?._id, 1);
    } catch {
      // Silent error handling
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      <Link href={`/products/${productId}`} className="block relative">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized={product.image.endsWith('.svg')}
          />
          {product.isOnSale && (
            <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-red-500 text-white px-1 py-0.5 sm:px-2 sm:py-1 rounded-md text-xs sm:text-sm font-semibold z-10">
              -{discountPercentage}%
            </div>
          )}
        </div>
      </Link>

      <button 
        className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 sm:p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 z-20"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <div className="p-2 sm:p-4">
        <p className="text-xs sm:text-sm text-gray-500 mb-1">{product.category}</p>
        
        <Link href={`/products/${productId}`}>
          <h3 className="font-semibold text-gray-900 mb-2 sm:mb-4 line-clamp-2 h-8 sm:h-12 text-sm sm:text-base hover:text-blue-600 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>

        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 sm:space-x-2">
              {priceRange ? (
                <span className="text-sm sm:text-lg font-bold text-gray-900">
                  {priceRange.min.toFixed(2)} - {priceRange.max.toFixed(2)} DT
                </span>
              ) : (
                <span className="text-sm sm:text-lg font-bold text-gray-900">
                  {displayPrice.toFixed(2)} DT
                </span>
              )}
            </div>
            
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 sm:p-2 rounded-lg transition-colors duration-200 group/btn disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!hasStock || isAddingToCart}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform duration-200" />
            </button>
          </div>

          {!hasStock && (
            <p className="text-xs sm:text-sm text-red-600">Rupture de stock</p>
          )}
        </div>
      </div>
    </div>
  );
}

export type { Product, ProductVariant };
