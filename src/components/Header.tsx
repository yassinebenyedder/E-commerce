'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface Category {
  _id: string;
  title: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
}

export default function Header() {
  const { itemCount } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDesktopCategories, setShowDesktopCategories] = useState(false);
  const [showMobileCategoriesExpanded, setShowMobileCategoriesExpanded] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.success) {
          const activeCategories = data.categories.filter((cat: Category) => cat.isActive);
          setAllCategories(activeCategories);
          // Show first 3 categories by default in mobile menu
          setCategories(activeCategories.slice(0, 3));
        }
      } catch {
        // Silently handle error - header will show no categories
      }
    };

    fetchCategories();
  }, []);

  // Handle categories dropdown hover
  const handleCategoriesMouseEnter = () => {
    setShowDesktopCategories(true);
  };

  const handleCategoriesMouseLeave = () => {
    setShowDesktopCategories(false);
  };

  const toggleMobileCategoriesExpanded = () => {
    setShowMobileCategoriesExpanded(!showMobileCategoriesExpanded);
    if (!showMobileCategoriesExpanded) {
      setCategories(allCategories); // Show all categories
    } else {
      setCategories(allCategories.slice(0, 3)); // Show only first 3
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowMobileSearch(false);
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
    setShowMobileCategoriesExpanded(false);
  }, [router]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMobileMenu) {
        const target = event.target as HTMLElement;
        // Check if click is outside the mobile menu and hamburger button
        if (!target.closest('.mobile-menu') && !target.closest('.hamburger-button')) {
          setShowMobileMenu(false);
        }
      }
      if (showDesktopCategories) {
        const target = event.target as HTMLElement;
        if (!target.closest('.categories-dropdown')) {
          setShowDesktopCategories(false);
        }
      }
    };

    if (showMobileMenu || showDesktopCategories) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showMobileMenu, showDesktopCategories]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
              Ben Yedder
            </Link>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
              Accueil
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-gray-900 transition-colors">
              Produits
            </Link>
            
            {/* Categories Dropdown */}
            <div 
              className="relative categories-dropdown"
              onMouseEnter={handleCategoriesMouseEnter}
              onMouseLeave={handleCategoriesMouseLeave}
            >
              <button
                className="flex items-center text-gray-700 hover:text-gray-900 transition-colors py-2"
              >
                Catégories
                <ChevronRight className={`ml-1 h-4 w-4 transition-transform ${showDesktopCategories ? 'rotate-90' : ''}`} />
              </button>
              
              {showDesktopCategories && (
                <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <Link
                      href="/products"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      Tous les Produits
                    </Link>
                    <div className="border-t border-gray-100 my-2"></div>
                    {allCategories.length > 0 ? (
                      allCategories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/products?category=${encodeURIComponent(category.title)}`}
                          className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          <span>{category.title}</span>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 text-sm">
                        Aucune catégorie disponible
                      </div>
                    )}
                    <div className="border-t border-gray-100 my-2"></div>
                    <Link
                      href="/categories"
                      className="block px-4 py-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm"
                    >
                      Voir Toutes les Catégories
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <Link href="/about" className="text-gray-700 hover:text-gray-900 transition-colors">
              À Propos
            </Link>
          </nav>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </form>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search icon for mobile */}
            <button 
              onClick={() => setShowMobileSearch(true)}
              className="lg:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Shopping cart */}
            <Link href="/cart" className="p-2 text-gray-700 hover:text-gray-900 transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors hamburger-button"
            >
              {showMobileMenu ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="relative z-50 md:hidden bg-white border-t border-gray-200 shadow-lg mobile-menu">
            <div className="px-4 py-2 space-y-1 max-h-96 overflow-y-auto">
              <Link 
                href="/" 
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Accueil
              </Link>
              <Link 
                href="/products" 
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Tous les Produits
              </Link>
              
              {/* Categories Section */}
              <div className="pt-2">
                <div className="px-3 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Catégories
                </div>
                <div className="space-y-1">
                  {categories.map((category, index) => (
                    <div
                      key={category._id}
                      className={`transition-all duration-300 ease-in-out ${
                        index >= 3 && !showMobileCategoriesExpanded 
                          ? 'opacity-0 max-h-0 overflow-hidden' 
                          : 'opacity-100 max-h-20'
                      }`}
                    >
                      <Link
                        href={`/products?category=${encodeURIComponent(category.title)}`}
                        className="flex items-center justify-between px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <span>{category.title}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ))}
                </div>
                {allCategories.length === 0 && (
                  <div className="px-3 py-2 text-gray-500 text-sm">
                    Aucune catégorie disponible
                  </div>
                )}
                {allCategories.length > 3 && (
                  <button
                    onClick={toggleMobileCategoriesExpanded}
                    className="flex items-center justify-between w-full px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors text-sm mt-2"
                  >
                    <span>
                      {showMobileCategoriesExpanded ? 'Voir Moins' : `Voir Toutes les Catégories (${allCategories.length})`}
                    </span>
                    <div className={`transition-transform duration-300 ${showMobileCategoriesExpanded ? 'rotate-90' : ''}`}>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </button>
                )}
                {allCategories.length <= 3 && allCategories.length > 0 && (
                  <Link 
                    href="/categories" 
                    className="block px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors text-sm mt-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Page des Catégories
                  </Link>
                )}
              </div>
              
              <Link 
                href="/about" 
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                À Propos
              </Link>
            </div>
          </div>
      )}

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={() => setShowMobileSearch(false)}
        >
          <div 
            className="bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-black">Rechercher des Produits</h2>
              <button 
                onClick={() => setShowMobileSearch(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
                autoFocus
              />
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
