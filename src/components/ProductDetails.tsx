'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface ProductVariant {
  _id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockQuantity: number;
  isDefault: boolean;
}

interface Product {
  _id: string;
  name: string;
  basePrice?: number;
  image: string;
  category: string;
  isOnSale?: boolean;
  variants?: ProductVariant[];
  description?: string;
  inStock?: boolean;
}

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.find(v => v.isDefault) || product.variants?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const currentPrice = selectedVariant?.price || product.basePrice || 0;
  const currentOriginalPrice = selectedVariant?.originalPrice;
  const currentStock = selectedVariant?.stockQuantity || 0;
  const isInStock = selectedVariant ? (selectedVariant.inStock && currentStock > 0) : product.inStock !== false;
  
  const discountPercentage = currentOriginalPrice 
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : 0;

  const productImages = [
    product.image,
    product.image,
    product.image,
  ];

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= currentStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product._id || !isInStock || currentStock <= 0 || quantity <= 0 || quantity > currentStock) {
      return;
    }
    
    try {
      setIsAddingToCart(true);
      await addToCart(product._id, selectedVariant?._id, quantity);
      setQuantity(1);
    } catch (error) {
      // Silent error handling - cart context manages errors
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
            <Image
              src={productImages[selectedImageIndex]}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
              unoptimized={product.image.endsWith('.svg')}
            />
          </div>

          {/* Image Thumbnails */}
          {productImages.length > 1 && (
            <div className="flex space-x-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImageIndex === index 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} vue ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized={image.endsWith('.svg')}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{product.name}</h1>
          </div>

          {/* Price */}
          <div className="space-y-4">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                {currentPrice.toFixed(2)} TND
              </span>
              {currentOriginalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {currentOriginalPrice.toFixed(2)} TND
                </span>
              )}
              {product.isOnSale && discountPercentage > 0 && (
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${(isInStock && currentStock > 0) ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className={`text-sm font-medium ${(isInStock && currentStock > 0) ? 'text-green-600' : 'text-red-600'}`}>
                {(isInStock && currentStock > 0) ? `En Stock (${currentStock} disponible)` : 'Rupture de Stock'}
              </span>
            </div>
          </div>

          {/* Variant Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Sélectionner une Option</h3>
              <div className="grid grid-cols-1 gap-3">
                {product.variants?.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVariant(variant)}
                    className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                      selectedVariant?.name === variant.name
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } ${!variant.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!variant.inStock}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-gray-900 text-lg">{variant.name}</span>
                        {!variant.inStock && (
                          <span className="block text-sm text-red-600 mt-1">Rupture de stock</span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-gray-900">{variant.price.toFixed(2)} TND</span>
                        {variant.originalPrice && (
                          <span className="block text-sm text-gray-500 line-through">
                            {variant.originalPrice.toFixed(2)} TND
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-4">Quantité</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4 text-black" />
                  </button>
                  <span className="px-4 py-2 text-center min-w-[60px] text-black">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= currentStock}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!isInStock || currentStock <= 0 || isAddingToCart}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>
                {isAddingToCart 
                  ? 'Ajout en cours...' 
                  : (!isInStock || currentStock <= 0) 
                    ? 'Rupture de Stock' 
                    : 'Ajouter au Panier'}
              </span>
            </button>
          </div>

          {/* Description */}
          {product.description && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Product Details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h3>
            <dl className="grid grid-cols-1 gap-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Category</dt>
                <dd className="text-sm font-medium text-gray-900">{product.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Availability</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {isInStock ? 'En Stock' : 'Rupture de Stock'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { Product, ProductVariant };
