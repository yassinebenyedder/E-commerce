import Link from 'next/link';


const stats = [
  { label: 'Livraison Rapide', value: '24-48 heures' },
  { label: 'Service Client', value: '24/7' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              ✨ À propos de Ben Yedder Parfums ✨
            </h1>
          </div>
        </section>

        {/* Ben Yedder Parfums Story Section */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Left: Main Story */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg p-8 flex flex-col h-full justify-center">
                <div className="flex items-center mb-4">
                  <span className="text-3xl md:text-4xl mr-3">🌹</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-pink-700">L&apos;Art du Parfum</h2>
                </div>
                <p className="text-gray-700 text-lg mb-4">
                  Né d’une passion pour l’art du parfum, <span className="font-semibold text-pink-700">Ben Yedder Parfums</span> est plus qu’une simple boutique en ligne : c’est une invitation à voyager à travers les senteurs.
                </p>
                <p className="text-gray-700 text-lg mb-4">
                  Nous nous spécialisons dans la création de parfums composés raffinés et de musk d’exception, élaborés avec soin pour offrir une expérience olfactive unique. Notre mission est simple : rendre le luxe accessible, tout en préservant la qualité et l’authenticité.
                </p>
                <p className="text-gray-700 text-lg mb-4">
                  Chaque parfum est soigneusement préparé pour garantir une longue tenue, une qualité exceptionnelle, et une expérience qui dépasse vos attentes.
                </p>
              </div>
              {/* Right: Features Highlights */}
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4 bg-white rounded-xl shadow p-4">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <div className="font-semibold text-pink-700 mb-1">Promotions exclusives & Packs avantageux</div>
                    <div className="text-gray-700 text-base">Profitez régulièrement d’offres spéciales et de combinaisons de parfums à prix réduits, idéales pour découvrir de nouvelles senteurs ou pour offrir.</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-white rounded-xl shadow p-4">
                  <span className="text-2xl">🛍️</span>
                  <div>
                    <div className="font-semibold text-pink-700 mb-1">Livraison rapide et fiable partout en Tunisie</div>
                    <div className="text-gray-700 text-base">Nous nous engageons à vous livrer vos commandes dans les meilleurs délais, afin que vous profitiez de vos parfums sans attendre.</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-white rounded-xl shadow p-4">
                  <span className="text-2xl">🔄</span>
                  <div>
                    <div className="font-semibold text-pink-700 mb-1">Service d’échange garanti</div>
                    <div className="text-gray-700 text-base">Votre satisfaction est notre priorité. Si le parfum ne correspond pas à vos attentes, nous offrons la possibilité de le remplacer afin que vous trouviez celui qui vous convient parfaitement.</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-white rounded-xl shadow p-4">
                  <span className="text-2xl">✨</span>
                  <div>
                    <div className="font-semibold text-pink-700 mb-1">Signature olfactive</div>
                    <div className="text-gray-700 text-base">Chaque fragrance est pensée pour refléter la personnalité de celui ou celle qui la porte, et devenir une véritable signature olfactive.</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-white rounded-xl shadow p-4">
                  <span className="text-2xl">🌹✨</span>
                  <div>
                    <div className="font-semibold text-pink-700 mb-1">Bienvenue dans notre univers</div>
                    <div className="text-gray-700 text-base">Bienvenue dans notre univers, où chaque goutte raconte une histoire, et où votre parfum devient votre identité.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nos Services
              </h2>
              <p className="text-gray-600">
                Des chiffres qui témoignent de notre engagement envers la qualité et le service.
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

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à Commencer vos Achats ?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Découvrez notre sélection de produits de qualité et profitez d&apos;une expérience shopping 
              simple et sécurisée. Commandez dès aujourd&apos;hui !
            </p>
            <div className="flex justify-center">
              <Link
                href="/products"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 inline-block"
              >
                Parcourir les Produits
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
