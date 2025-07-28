'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CheckoutModal from '@/components/CheckoutModal';

export default function CartPage() {
  const { items, total, itemCount, updateCartItem, removeFromCart, isLoading, error } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleQuantityChange = async (productId: string, variantId: string | undefined, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateCartItem(productId, variantId, newQuantity);
  };

  const handleRemoveItem = async (productId: string, variantId?: string) => {
    await removeFromCart(productId, variantId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto h-24 w-24 text-gray-400" />
              <h2 className="mt-4 text-2xl font-bold text-gray-900">Votre panier est vide</h2>
              <p className="mt-2 text-gray-600">Commencez à magasiner pour ajouter des articles à votre panier.</p>
              <Link
                href="/products"
                className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continuer les Achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continuer les Achats
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Panier d&apos;Achat</h1>
          <p className="text-gray-600 mt-1">{itemCount} {itemCount === 1 ? 'article' : 'articles'} dans votre panier</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId || 'default'}`} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        unoptimized={item.product.image.endsWith('.svg')}
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.productId}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">{item.product.category}</p>
                    {item.variant && (
                      <p className="text-sm text-gray-600 mt-1">Variant: {item.variant.name}</p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.variantId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4 text-black" />
                          </button>
                          <span className="px-4 py-2 text-center min-w-[60px] text-black">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.variantId, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4 text-black" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.productId, item.variantId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{item.itemTotal.toFixed(2)} TND</p>
                        <p className="text-sm text-gray-500">{item.price.toFixed(2)} TND chacun</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Résumé de Commande</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total ({itemCount} {itemCount === 1 ? 'article' : 'articles'})</span>
                  <span>{total.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison {itemCount >= 2 ? '(Gratuite pour 2+ articles)' : ''}</span>
                  <span>{itemCount >= 2 ? 'Gratuite' : '5.00 TND'}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span className="text-black">Total</span>
                    <span>{(total + (itemCount >= 2 ? 0 : 5)).toFixed(2)} TND</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Procéder au Paiement
              </button>

              <div className="mt-4 text-center">
                <Link
                  href="/products"
                  className="text-blue-600 hover:text-blue-700 text-sm transition-colors duration-200"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          cartItems={items}
        />
      )}
    </div>
  );
}
