'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

interface Category {
  _id: string;
  title: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
}

export default function CategoryShortcuts() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.success) {
          // Get first 3 active categories
          const activeCategories = data.categories
            .filter((cat: Category) => cat.isActive)
            .slice(0, 3);
          setCategories(activeCategories);
        }
      } catch {
        // Silently handle error - component will show no categories
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explorez nos Catégories
          </h2>
          <p className="text-lg text-gray-600">
            Découvrez nos meilleures sélections par catégorie
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {categories.map((category, index) => {
            // Fallback gradient colors for categories without images
            const gradients = [
              'from-blue-500 to-purple-600',
              'from-emerald-500 to-teal-600',
              'from-orange-500 to-red-600'
            ];
            
            const hasImage = category.image && category.image.trim() !== '';
            
            return (
              <Link
                key={category._id}
                href={`/products?category=${encodeURIComponent(category.title)}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-h-[120px] md:min-h-[140px]">
                  {hasImage ? (
                    <Image
                      src={category.image}
                      alt={category.title}
                      width={400}
                      height={140}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className={`absolute inset-0 w-full h-full bg-gradient-to-r ${gradients[index % 3]} group-hover:opacity-90 transition-opacity duration-300`} />
                  )}
                  
                  {/* Only a subtle gradient at the bottom for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  <div className="relative p-4 md:p-6 text-white min-h-[120px] md:min-h-[140px] flex flex-col justify-between z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-semibold mb-2 drop-shadow-lg">
                          {category.title}
                        </h3>
                        <p className="text-white text-opacity-90 text-sm overflow-hidden drop-shadow-md" style={{ 
                          display: '-webkit-box', 
                          WebkitLineClamp: 2, 
                          WebkitBoxOrient: 'vertical' 
                        }}>
                          {category.description}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-white group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0 ml-4 drop-shadow-lg" />
                    </div>
                    <div className="mt-3 md:mt-4 flex items-center text-xs md:text-sm text-white text-opacity-90">
                      <span className="drop-shadow-md">Voir tous les produits</span>
                      <ChevronRight className="h-3 w-3 md:h-4 md:w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300 drop-shadow-md" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Categories Button */}
        <div className="text-center">
          <Link
            href="/categories"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
          >
            Voir toutes les catégories
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
