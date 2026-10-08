'use client';

import { Header } from '@/components/Header';
import { 
  Heart, Sparkles, Award, Globe, Leaf, 
  Clock, Users, ChevronRight, Flower2
} from 'lucide-react';

export default function AboutPage() {
  const timeline = [
    {
      year: '2020',
      title: 'La Vision',
      description: 'Née d\'une passion pour les bienfaits de la nature, Fleur Sucrée voit le jour à Florence avec une mission : créer des élixirs naturels exceptionnels.',
      icon: <Heart className="h-6 w-6" />
    },
    {
      year: '2021',
      title: 'Premiers Élixirs',
      description: 'Lancement de notre première collection signature avec des huiles essentielles précieuses et des eaux florales rares.',
      icon: <Sparkles className="h-6 w-6" />
    },
    {
      year: '2023',
      title: 'Expansion Internationale',
      description: 'Ouverture vers l\'Europe et l\'Afrique, touchant des milliers de clients avec nos produits premium.',
      icon: <Globe className="h-6 w-6" />
    },
    {
      year: '2025',
      title: 'Excellence Reconnue',
      description: 'Plus de 25 000 clients satisfaits et des certifications de qualité qui attestent de notre engagement.',
      icon: <Award className="h-6 w-6" />
    }
  ];

  const values = [
    {
      icon: <Leaf className="h-8 w-8" />,
      title: '100% Naturel',
      description: 'Tous nos ingrédients sont soigneusement sélectionnés pour leur pureté et leur qualité exceptionnelle.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Artisanal',
      description: 'Chaque produit est fabriqué à la main avec passion et expertise dans nos ateliers de Florence.'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Durabilité',
      description: 'Nous respectons l\'environnement à chaque étape, de la récolte à l\'emballage éco-responsable.'
    },
    {
      icon: <Flower2 className="h-8 w-8" />,
      title: 'Innovation',
      description: 'Nous combinons traditions ancestrales et techniques modernes pour des produits uniques.'
    }
  ];

  const stats = [
    { value: '25K+', label: 'Clients Satisfaits' },
    { value: '50+', label: 'Pays Desservis' },
    { value: '98.7%', label: 'Satisfaction' },
    { value: '1000+', label: 'Produits Vendus' }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-rose-900/30 to-pink-900/30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gray-800/70 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-rose-500/30">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-bold text-white">Notre Histoire</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
              L'Excellence <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Naturelle</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Découvrez l'histoire de Fleur Sucrée, une passion pour les élixirs naturels 
              qui a transformé le bien-être de milliers de personnes à travers le monde.
            </p>
          </div>
        </div>
      </section>

      {/* Notre Mission */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Mission</span>
              </h2>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Chez Fleur Sucrée, nous croyons que la nature regorge de trésors insoupçonnés. 
                Notre mission est de créer des élixirs naturels premium qui éveillent vos sens 
                et transforment votre bien-être quotidien.
              </p>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Chaque produit est le résultat d'une recherche approfondie, d'une sélection 
                rigoureuse des ingrédients et d'un savoir-faire artisanal transmis de génération en génération.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-2xl p-6 border border-rose-500/20">
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-rose-600/20 to-pink-600/20 rounded-3xl p-8 backdrop-blur-sm border border-rose-500/20">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                  alt="Atelier Fleur Sucrée"
                  className="rounded-2xl w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Parcours</span>
            </h2>
            <p className="text-gray-300 text-lg">
              Une histoire de passion et d'engagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-900/30 rounded-2xl p-6 backdrop-blur-sm border border-rose-500/20 h-full">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 mb-4">
                    <div className="text-white">{item.icon}</div>
                  </div>
                  <div className="text-2xl font-bold text-rose-400 mb-2">{item.year}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
                
                {idx < timeline.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="h-6 w-6 text-rose-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Valeurs</span>
            </h2>
            <p className="text-gray-300 text-lg">
              Ce qui guide chaque décision chez Fleur Sucrée
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-2xl p-8 backdrop-blur-sm border border-rose-500/20 hover:border-rose-500/40 transition-all duration-300 group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">{value.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Engagement */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-rose-600/20 to-pink-600/20 rounded-3xl p-8 lg:p-12 backdrop-blur-sm border border-rose-500/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Engagement</span>
                </h2>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  Chez Fleur Sucrée, nous nous engageons à offrir des produits de la plus haute qualité, 
                  tout en respectant l'environnement et en soutenant les communautés locales.
                </p>
                <ul className="space-y-4">
                  {[
                    'Ingrédients 100% naturels et certifiés',
                    'Tests dermatologiques validés',
                    'Emballages éco-responsables',
                    'Support client 24/7',
                    'Garantie satisfait ou remboursé 30 jours'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-300">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80"
                  alt="Produits Fleur Sucrée"
                  className="rounded-2xl w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}