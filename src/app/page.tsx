import SimpleHero from '@/components/SimpleHero';
import ProductGrid from '@/components/ProductGrid';
import CategoryShortcuts from '@/components/CategoryShortcuts';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleHero />
      <CategoryShortcuts />
      <div id="products">
        <ProductGrid limit={8} sortBy="newest" />
      </div>
  <div className="w-full mt-12 mb-0 bg-blue-50 py-8 px-4 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <p className="text-lg font-semibold text-gray-800 mb-4">Vous voulez voir plus de produits ?</p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Cliquez ici pour découvrir tous nos produits
          </Link>
        </div>
      </div>
    </div>
  );
}
