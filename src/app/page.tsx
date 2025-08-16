import SimpleHero from '@/components/SimpleHero';
import ProductGrid from '@/components/ProductGrid';
import CategoryShortcuts from '@/components/CategoryShortcuts';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleHero />
      <CategoryShortcuts />
      <div id="products">
        <ProductGrid limit={8} sortBy="newest" />
      </div>
    </div>
  );
}
