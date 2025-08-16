'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Promotion {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  order: number;
}

export default function SimpleHero() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch('/api/promotions');
        const data = await response.json();
        
        if (data.success && data.promotions.length > 0) {
          const sortedPromotions = data.promotions.sort((a: Promotion, b: Promotion) => a.order - b.order);
          setPromotions(sortedPromotions);
        }
      } catch {
        // Silent error handling - component will show fallback hero
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  useEffect(() => {
    if (promotions.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotions.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [promotions.length]);

  if (loading) {
    return (
      <div className="w-full overflow-hidden py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-[150px] sm:h-[220px] md:h-[300px] lg:h-[400px] bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl shadow-2xl flex items-center justify-center animate-pulse">
            <div className="text-gray-500 text-xl font-medium">Chargement des promotions...</div>
          </div>
        </div>
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="w-full overflow-hidden py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-[150px] sm:h-[220px] md:h-[300px] lg:h-[400px] bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl shadow-2xl flex items-center justify-center">
            <div className="text-white text-center px-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Bienvenue chez ShopHub</h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">Découvrez des produits incroyables et des offres exceptionnelles</p>
              <Link
                href="/categories"
                className="inline-block bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Commencer vos Achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentPromo = promotions[currentSlide];

  return (
    <div className="relative w-full overflow-hidden py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          href={currentPromo.ctaLink}
          className="block w-full h-[150px] sm:h-[220px] md:h-[300px] lg:h-[400px] rounded-2xl shadow-2xl overflow-hidden relative cursor-pointer group transition-transform hover:scale-[1.02] duration-300"
          style={{
            backgroundImage: `url(${currentPromo.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
        </Link>
      </div>

      {promotions.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length)}
            className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg border-2 border-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % promotions.length)}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg border-2 border-white"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </div>
  );
}
