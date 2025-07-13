import Link from 'next/link';
import { ShoppingBag, Users, Award, Truck } from 'lucide-react';

const features = [
  {
    icon: ShoppingBag,
    title: 'Produits de Qualité',
    description: 'Nous sélectionnons soigneusement chaque produit dans notre boutique pour garantir la plus haute qualité et la meilleure valeur pour nos clients.',
  },
  {
    icon: Users,
    title: 'Client d\'Abord',
    description: 'Votre satisfaction est notre priorité. Nous offrons un service client exceptionnel et un support à chaque étape.',
  },
  {
    icon: Award,
    title: 'Marques de Confiance',
    description: 'Nous nous associons avec des marques reconnues et des fournisseurs vérifiés pour vous apporter des produits authentiques et fiables.',
  },
  {
    icon: Truck,
    title: 'Livraison Rapide',
    description: 'Livraison rapide et sécurisée partout en Tunisie. La plupart des commandes sont expédiées sous 24 heures et arrivent en 2-5 jours ouvrables.',
  },
];

const stats = [
  { label: 'Clients Satisfaits', value: '50 000+' },
  { label: 'Produits Vendus', value: '200 000+' },
  { label: 'Pays Desservis', value: '25+' },
  { label: 'Années d\'Expérience', value: '8+' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              À Propos de ShopHub
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Votre partenaire de confiance pour le shopping en ligne, vous offrant des produits de qualité 
              et un service exceptionnel depuis 2016.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Notre Histoire
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Fondé en 2016, ShopHub a commencé comme une petite place de marché en ligne avec une mission simple : 
                    rendre les produits de qualité accessibles à tous. Ce qui a commencé comme un projet passionné par 
                    une équipe d&apos;enthousiastes du e-commerce est devenu une plateforme de confiance servant des clients dans le monde entier.
                  </p>
                  <p>
                    Nous croyons que le shopping devrait être pratique, fiable et agréable. C&apos;est pourquoi nous avons 
                    construit une plateforme qui combine une technologie de pointe avec un service client personnalisé, 
                    garantissant que chaque interaction avec ShopHub dépasse vos attentes.
                  </p>
                  <p>
                    Aujourd&apos;hui, nous sommes fiers d&apos;être la destination de choix pour des milliers de clients qui nous font confiance 
                    pour leurs besoins de shopping, des essentiels quotidiens aux trouvailles pour occasions spéciales.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Notre Mission</h3>
                <p className="text-gray-600 mb-6">
                  Révolutionner le shopping en ligne en offrant une expérience client exceptionnelle, 
                  proposant des produits de haute qualité à des prix compétitifs, et en construisant des relations durables 
                  avec nos clients et partenaires.
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Notre Vision</h3>
                <p className="text-gray-600">
                  Devenir la plateforme e-commerce la plus fiable et centrée sur le client au monde, 
                  où chacun peut découvrir, acheter et profiter de produits qui améliorent sa vie.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Notre Impact en Chiffres
              </h2>
              <p className="text-gray-600">
                Ces chiffres représentent la confiance que nos clients nous accordent chaque jour.
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pourquoi Choisir ShopHub ?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Nous nous engageons à vous offrir la meilleure expérience de shopping possible. 
                Voici ce qui nous distingue de la concurrence.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à Commencer vos Achats ?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de clients satisfaits qui ont fait de ShopHub leur destination shopping préférée. 
              Découvrez des produits extraordinaires et des offres imbattables aujourd&apos;hui !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 inline-block"
              >
                Parcourir les Produits
              </Link>
              <Link
                href="/contact"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors duration-200 inline-block"
              >
                Contactez-nous
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
