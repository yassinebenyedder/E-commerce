import { MapPin, Phone, Mail, Clock, MessageCircle, Headphones } from 'lucide-react';

const contactMethods = [
  {
    icon: Phone,
    title: 'Support Téléphonique',
    description: 'Parlez directement avec notre équipe de service client',
    detail: '+216 123 456 789',
    availability: 'Lun-Ven: 9h - 18h',
  },
  {
    icon: Mail,
    title: 'Support Email',
    description: 'Envoyez-nous un email et nous répondrons sous 24 heures',
    detail: 'support@shophub.tn',
    availability: 'Disponible 24h/24',
  },
  {
    icon: MessageCircle,
    title: 'Chat en Direct',
    description: 'Obtenez de l\'aide instantanée avec notre chat en direct',
    detail: 'Chattez avec nous maintenant',
    availability: 'Lun-Ven: 8h - 20h',
  },
  {
    icon: Headphones,
    title: 'Centre d\'Aide',
    description: 'Parcourez notre FAQ complète et nos guides',
    detail: 'Visiter le Centre d\'Aide',
    availability: 'Disponible 24h/24',
  },
];

const offices = [
  {
    city: 'Tunis',
    address: '123 Avenue Habib Bourguiba, Bureau 100',
    postalCode: 'Tunis 1000, Tunisie',
    phone: '+216 123 456 789',
    type: 'Siège Social',
  },
  {
    city: 'Sfax',
    address: '456 Avenue Hedi Chaker, Étage 3',
    postalCode: 'Sfax 3000, Tunisie',
    phone: '+216 234 567 890',
    type: 'Bureau Régional Sud',
  },
  {
    city: 'Sousse',
    address: '789 Place des Affaires, Bureau 200',
    postalCode: 'Sousse 4000, Tunisie',
    phone: '+216 345 678 901',
    type: 'Bureau Régional Centre',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contactez-nous
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Nous sommes là pour vous aider ! Contactez notre équipe de service client amicale 
              pour toute question, préoccupation ou commentaire.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Contact Methods */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Comment Pouvons-nous Vous Aider ?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choisissez la méthode de contact qui vous convient le mieux. Notre équipe est prête à vous aider 
                avec les commandes, les retours, les questions sur les produits, et plus encore.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <method.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {method.description}
                  </p>
                  <p className="text-blue-600 font-medium mb-2">
                    {method.detail}
                  </p>
                  <p className="text-xs text-gray-500">
                    {method.availability}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Form and Info */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="john.doe@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order Support</option>
                    <option value="return">Returns & Exchanges</option>
                    <option value="product">Product Information</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Questions</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    placeholder="Please describe how we can help you..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Quick Contact Info
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Address</p>
                      <p className="text-gray-600">123 Commerce Street, Suite 100</p>
                      <p className="text-gray-600">New York, NY 10001</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">support@shophub.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Business Hours</p>
                      <p className="text-gray-600">Monday - Friday: 9 AM - 6 PM EST</p>
                      <p className="text-gray-600">Saturday: 10 AM - 4 PM EST</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Frequently Asked Questions
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Find quick answers to common questions in our comprehensive FAQ section.
                </p>
                <button className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors">
                  Visit FAQ Center →
                </button>
              </div>
            </div>
          </section>

          {/* Office Locations */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Locations
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Visit us at one of our office locations or reach out to the team nearest you.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {offices.map((office, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {office.city}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium mb-3">
                    {office.type}
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    {office.address}
                  </p>
                  <p className="text-gray-600 text-sm mb-3">
                    {office.postalCode}
                  </p>
                  <p className="text-gray-900 font-medium">
                    {office.phone}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
