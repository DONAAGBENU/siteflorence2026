'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { 
  Star, Heart, Award, ShoppingBag, Sparkles,
  ChevronRight, Quote, CheckCircle, Users
} from 'lucide-react';

export default function ExperiencesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const experiences = [
    {
      id: 1,
      name: 'Huile de Rose Premium',
      category: 'signature',
      price: '45 499 FCFA',
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviews: 342,
      description: 'Huile essentielle de rose précieuse pour une peau éclatante',
      benefits: ['Hydratation intense', 'Éclat naturel', 'Anti-âge']
    },
    {
      id: 2,
      name: 'Crème de Vanille',
      category: 'luxe',
      price: '32 999 FCFA',
      image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviews: 287,
      description: 'Crème hydratante à la vanille de Madagascar',
      benefits: ['Douceur extrême', 'Parfum envoûtant', 'Nutrition profonde']
    },
    {
      id: 3,
      name: 'Eau de Fleur d\'Oranger',
      category: 'signature',
      price: '24 999 FCFA',
      image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      reviews: 198,
      description: 'Eau florale rafraîchissante pour tonifier la peau',
      benefits: ['Apaisement', 'Fraîcheur', 'Tonicité']
    },
    {
      id: 4,
      name: 'Sérum à la Lavande',
      category: 'premium',
      price: '38 499 FCFA',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviews: 423,
      description: 'Sérum régénérant à la lavande premium',
      benefits: ['Régénération', 'Détente', 'Éclat']
    },
    {
      id: 5,
      name: 'Miel Bio Pur',
      category: 'signature',
      price: '32 499 FCFA',
      image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviews: 156,
      description: 'Miel 100% naturel des montagnes africaines',
      benefits: ['Énergie', 'Immunité', 'Goût pur']
    },
    {
      id: 6,
      name: 'Huile de Baobab',
      category: 'luxe',
      price: '54 999 FCFA',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      reviews: 512,
      description: 'Huile végétale précieuse aux propriétés régénérantes',
      benefits: ['Anti-âge', 'Élasticité', 'Nourrissant']
    }
  ];

  const testimonials = [
    {
      name: 'Marie L.',
      location: 'Paris, France',
      rating: 5,
      text: 'L\'huile de rose a transformé ma routine beauté. Ma peau n\'a jamais été aussi éclatante !',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
    },
    {
      name: 'Sophie M.',
      location: 'Lyon, France',
      rating: 5,
      text: 'J\'adore la crème de vanille. Le parfum est divin et ma peau est incroyablement douce.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80'
    },
    {
      name: 'Aminata D.',
      location: 'Dakar, Sénégal',
      rating: 5,
      text: 'L\'huile de baobab est un miracle. En quelques semaines, ma peau est visiblement plus jeune.',
      image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=100&q=80'
    },
    {
      name: 'Claire B.',
      location: 'Bruxelles, Belgique',
      rating: 5,
      text: 'Le sérum à la lavande m\'aide à me détendre le soir. C\'est mon rituel de bien-être préféré.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'
    }
  ];

  const categories = [
    { id: 'all', name: 'Tous' },
    { id: 'signature', name: 'Signature' },
    { id: 'luxe', name: 'Luxe' },
    { id: 'premium', name: 'Premium' }
  ];

  const filteredExperiences = selectedCategory === 'all' 
    ? experiences 
    : experiences.filter(exp => exp.category === selectedCategory);

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
              <span className="text-sm font-bold text-white">Expériences Premium</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
              Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Expériences</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Découvrez nos élixirs naturels premium, conçus pour transformer votre bien-être 
              et éveiller vos sens à chaque utilisation.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExperiences.map((exp) => (
              <div key={exp.id} className="group">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-3xl overflow-hidden border border-rose-500/20 hover:border-rose-500/40 transition-all duration-300 group-hover:scale-105">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        Premium
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(exp.rating) 
                                ? 'text-amber-500 fill-amber-500' 
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-400 ml-2">({exp.reviews})</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{exp.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{exp.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {exp.benefits.map((benefit, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-rose-600/20 text-rose-400 rounded-full text-xs"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">
                          {exp.price}
                        </span>
                      </div>
                      <Button
                        onClick={() => window.location.href = `/order?product=${exp.id}`}
                        className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 hover:scale-105"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Commander
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gray-900/70 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-rose-500/30">
              <Quote className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-bold text-white">Témoignages</span>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-4">
              Ce que disent nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Clients</span>
            </h2>
            <p className="text-gray-300 text-lg">
              Des milliers de clients satisfaits nous font confiance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900/50 to-gray-900/30 rounded-2xl p-6 backdrop-blur-sm border border-rose-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>

                <p className="text-gray-300 text-sm leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-rose-600/20 to-pink-600/20 rounded-3xl p-8 lg:p-12 backdrop-blur-sm border border-rose-500/20 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Prêt à découvrir l'excellence ?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de clients satisfaits et transformez votre routine bien-être
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.href = '/products'}
                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
              >
                <ShoppingBag className="h-5 w-5" />
                Découvrir la Collection
              </Button>
              <Button
                onClick={() => window.location.href = '/contact'}
                variant="outline"
                className="border-2 border-rose-500 text-rose-400 hover:bg-rose-600 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
              >
                Nous Contacter
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}