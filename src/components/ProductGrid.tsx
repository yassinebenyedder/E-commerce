'use client';

import { useState, useEffect } from 'react';
import ProductCard, { Product } from './ProductCard';

interface ProductGridProps {
  title?: string;
  category?: string;
  limit?: number;
  search?: string;
  priceRange?: string;
  sortBy?: string;
}

export default function ProductGrid({ 
  title, 
  category,
  limit,
  search,
  priceRange,
  sortBy
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (limit) params.append('limit', limit.toString());
        if (search) params.append('search', search);
        if (priceRange) params.append('priceRange', priceRange);
        if (sortBy) params.append('sortBy', sortBy);
        
        const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products);
          setError(null);
        } else {
          setError(data.error || 'Échec du chargement des produits');
        }
      } catch (err) {
        setError('Échec du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, limit, search, priceRange, sortBy]);

  if (loading) {
    return (
      <section className="py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            {title && (
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">{title}</h2>
            )}
            <p className="text-xl md:text-2xl font-semibold text-gray-800 max-w-xl mx-auto px-4 sm:px-0">
              Découvrez nos produits exceptionnels
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-2 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {title && (
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">{title}</h2>
            )}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
              <p className="text-red-600 mb-2 sm:mb-4 text-sm sm:text-base">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {title && (
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">{title}</h2>
            )}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sm:p-8">
              <div className="text-gray-400 mb-2 sm:mb-4">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Aucun Produit Trouvé</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {category ? `Aucun produit trouvé dans la catégorie "${category}".` : 'Aucun produit disponible pour le moment.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          {title && (
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">{title}</h2>
          )}
          <p className="text-xl md:text-2xl font-semibold text-gray-800 max-w-xl mx-auto px-4 sm:px-0">
            Découvrez nos produits exceptionnels
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}