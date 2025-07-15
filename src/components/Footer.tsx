import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ShopHub</h3>
            <p className="text-gray-400">
              Votre boutique en ligne pour des produits incroyables à des prix imbattables.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Produits</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors">Catégories</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">À Propos</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Service Client</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contactez-nous</Link></li>
              <li><a href="/shipping" className="hover:text-white transition-colors">Infos Livraison</a></li>
              <li><a href="/returns" className="hover:text-white transition-colors">Retours</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Suivez-nous</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 ShopHub. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
