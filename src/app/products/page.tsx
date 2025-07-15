'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ProductGrid from '@/components/ProductGrid';

interface Category {
  _id: string;
  title: string;
  image: string;
  description: string;
  isActive: boolean;
  order: number;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Get current filter values from URL
  const searchQuery = searchParams.get('search');
  const selectedCategory = searchParams.get('category') || '';
  const selectedPriceRange = searchParams.get('priceRange') || '';
  const selectedSortBy = searchParams.get('sortBy') || '';

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  // Update URL params when filters change
  const updateFilters = (newFilters: { [key: string]: string }) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    router.push(`/products?${params.toString()}`);
  };

  const handleCategoryChange = (category: string) => {
    updateFilters({ category, priceRange: selectedPriceRange, sortBy: selectedSortBy });
  };

  const handlePriceRangeChange = (priceRange: string) => {
    updateFilters({ category: selectedCategory, priceRange, sortBy: selectedSortBy });
  };

  const handleSortByChange = (sortBy: string) => {
    updateFilters({ category: selectedCategory, priceRange: selectedPriceRange, sortBy });
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    params.delete('priceRange');
    params.delete('sortBy');
    router.push(`/products?${params.toString()}`);
  };

  const hasActiveFilters = selectedCategory || selectedPriceRange || selectedSortBy;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {searchQuery ? `Résultats de recherche pour "${searchQuery}"` : 'Tous les Produits'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            {searchQuery 
              ? `Affichage des résultats pour "${searchQuery}". Trouvez les produits parfaits qui correspondent à votre recherche.`
              : ''
            }
          </p>
        </div>

        {/* Filter and Sort Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Toutes les Catégories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.title}>
                    {category.title}
                  </option>
                ))}
              </select>
              
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedPriceRange}
                onChange={(e) => handlePriceRangeChange(e.target.value)}
              >
                <option value="">Tous les Prix</option>
                <option value="0-25">0 - 25 TND</option>
                <option value="25-50">25 - 50 TND</option>
                <option value="50-100">50 - 100 TND</option>
                <option value="100">100+ TND</option>
              </select>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Effacer les Filtres
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Trier par:</span>
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedSortBy}
                onChange={(e) => handleSortByChange(e.target.value)}
              >
                <option value="">Vedette</option>
                <option value="price-low">Prix: Croissant</option>
                <option value="price-high">Prix: Décroissant</option>
                <option value="newest">Plus Récent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Filtres actifs:</span>
              {selectedCategory && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Catégorie: {selectedCategory}
                </span>
              )}
              {selectedPriceRange && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Prix: {selectedPriceRange.replace('-', ' - ')} TND
                  {selectedPriceRange === '100' && '+'}
                </span>
              )}
              {selectedSortBy && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Tri: {selectedSortBy === 'price-low' ? 'Prix: Croissant' : 
                         selectedSortBy === 'price-high' ? 'Prix: Décroissant' : 
                         selectedSortBy === 'newest' ? 'Plus Récent' : 'Vedette'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <ProductGrid 
          title={searchQuery ? `Résultats de recherche pour "${searchQuery}"` : 'Tous les Produits'}
          search={searchQuery || undefined}
          category={selectedCategory || undefined}
          priceRange={selectedPriceRange || undefined}
          sortBy={selectedSortBy || undefined}
        />
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement des produits...</p>
      </div>
    </div>}>
      <ProductsContent />
    </Suspense>
  );
}
