'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Heart, Sparkles, Star, CheckCircle, 
  ChevronRight, Instagram, Facebook, 
  Package, Award, Clock, Users, Globe,
  Mail, X
} from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/Header';



// ============ PRODUCT CARD 3D ============
const ProductCard3D = ({ product, onAddToCart }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative h-[480px] sm:h-[520px] lg:h-[500px] perspective-1000">
      <div 
        className={`relative w-full h-full preserve-3d transition-all duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FACE AVANT */}
        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-50 via-rose-50/50 to-pink-50 rounded-3xl shadow-xl overflow-hidden border border-rose-100 flex flex-col">
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent ${isHovered ? 'animate-shimmer' : ''}`}></div>
          
          {/* IMAGE AVEC EFFETS */}
          <div className="relative h-40 sm:h-48 overflow-hidden flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            
            {/* BADGE */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
              <div className="bg-gradient-to-r from-rose-500/90 to-pink-600/90 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                Qualité Premium
              </div>
            </div>
          </div>

          {/* CONTENU */}
          <div className="p-3 sm:p-4 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-1 sm:mb-2">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 line-clamp-1">{product.name}</h3>
              <button className="text-rose-600 hover:text-rose-800 transition-colors flex-shrink-0">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
            
            <p className="text-gray-700 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{product.description}</p>
            
            {/* ÉTOILES */}
            <div className="flex items-center gap-0.5 sm:gap-1 mb-2 sm:mb-3">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(product.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                />
              ))}
              <span className="text-[10px] sm:text-xs font-bold text-gray-700">{product.rating}</span>
            </div>

            {/* PRIX EN FCFA */}
            <div className="mb-2 sm:mb-3">
              <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-rose-700 to-pink-700 bg-clip-text text-transparent">
                {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] sm:text-xs text-gray-500 line-through ml-1 sm:ml-2">{product.originalPrice}</span>
              )}
              <div className="text-[8px] sm:text-[10px] text-gray-500 mt-0.5">Prix en FCFA</div>
            </div>

            {/* BOUTON 3D */}
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                window.location.href = `/order?product=${product.id}`;
              }}
              className="relative w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white py-2 sm:py-2.5 rounded-xl font-bold overflow-hidden group hover:shadow-lg transition-shadow text-xs sm:text-sm mt-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
                <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Commander
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-rose-700 to-pink-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>

            {/* INDICATEUR FLIP */}
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 text-[8px] sm:text-[10px] text-gray-500">
              👆 Détails
            </div>
          </div>
        </div>

        {/* FACE ARRIÈRE - DÉTAILS */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-gray-800 via-rose-800 to-pink-800 rounded-3xl shadow-2xl p-3 sm:p-4 lg:p-6 text-gray-100 flex flex-col">
          <h4 className="text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3 lg:mb-4 text-white">Détails du produit</h4>
          
          <div className="space-y-2 sm:space-y-3 lg:space-y-4 mb-3 sm:mb-4 lg:mb-6 flex-grow overflow-y-auto">
            {product.ingredients.map((ingredient: string, idx: number) => (
              <div key={idx} className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 text-xs sm:text-sm lg:text-base">
                <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-rose-400 flex-shrink-0" />
                <span className="line-clamp-1">{ingredient}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 sm:space-y-2 lg:space-y-3 mb-3 sm:mb-4">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-pink-300 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs lg:text-sm">Qualité premium</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-amber-300 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs lg:text-sm">Ingrédients naturels</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Award className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-emerald-300 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs lg:text-sm">Production artisanale</span>
            </div>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
            className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 lg:bottom-6 lg:left-6 lg:right-6 bg-white/10 hover:bg-white/20 text-white py-1.5 sm:py-2 rounded-lg transition-colors backdrop-blur-sm text-xs sm:text-sm"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ PROGRESS BAR ============
const ProgressBar = ({ value, max = 100, label }: any) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-sm font-bold text-white">{value}/{max}</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-rose-600 to-pink-600 rounded-full transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// ============ COMPONENT NOTIFICATION ============
const Notification = ({ message, type = 'success', onClose }: { message: string, type?: string, onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-24 right-6 z-50 animate-fade-in ${
      type === 'success' 
        ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
        : 'bg-gradient-to-r from-rose-500 to-pink-500'
    } text-white px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm border border-white/20 max-w-md`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {type === 'success' ? (
            <CheckCircle className="h-6 w-6" />
          ) : (
            <X className="h-6 w-6" />
          )}
          <div>
            <p className="font-bold">{type === 'success' ? 'Succès !' : 'Erreur'}</p>
            <p className="text-sm opacity-90">{message}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// ============ COMPOSANT PRINCIPAL ============
export default function Home() {
  const { totalItems, addToCart, toggleCart } = useCart();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // PRODUITS BIO AVEC IMAGES UNSPLASH
 // ============ PRODUITS FLEUR SUCRÉE + BIO ============
const localProducts = [
  // Nouveaux produits Fleur Sucrée
  {
    id: 1, 
    name: 'Huile de Rose Premium',
    description: 'Huile essentielle de rose précieuse pour une peau éclatante',
    price: '45 499 FCFA',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80',
    rating: 4.9, 
    category: 'signature',
    ingredients: ['Huile de Rose', 'Vitamine E', 'Antioxydants', 'Extrait de Pétales']
  },
  
  {
    id: 2, 
    name: 'Crème de Vanille',
    description: 'Crème hydratante à la vanille de Madagascar pour une peau douce',
    price: '32 999 FCFA',
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80',
    rating: 4.8, 
    category: 'luxe',
    ingredients: ['Extrait de Vanille', 'Beurre de Karité', 'Aloe Vera', 'Hyaluronique']
  },
  
  {
    id: 3, 
    name: 'Eau de Fleur d&apos;Oranger',
    description: 'Eau florale rafraîchissante pour tonifier et apaiser la peau',
    price: '24 999 FCFA', 
    originalPrice: '29 999 FCFA',
    image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=800&q=80',
    rating: 4.7, 
    category: 'signature',
    ingredients: ['Fleur d\'Oranger', 'Eau déminéralisée', 'Extrait de Camomille', 'Vitamine C']
  },
  
  {
    id: 4, 
    name: 'Sérum à la Lavande',
    description: 'Sérum régénérant à la lavande pour une peau revitalisée',
    price: '38 499 FCFA',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    rating: 4.9, 
    category: 'premium',
    ingredients: ['Huile de Lavande', 'Acide Hyaluronique', 'Peptides', 'Antioxydants']
  },
  
  // Anciens produits Bio
  {
    id: 5, 
    name: 'Miel Bio Pur',
    description: 'Miel 100% naturel récolté dans les montagnes africaines',
    price: '32 499 FCFA',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=800&q=80',
    rating: 4.8, 
    category: 'signature',
    ingredients: ['Miel Brut', 'Propolis', 'Gelée Royale', 'Pollen Frais']
  },
  
  {
    id: 6, 
    name: 'Huile de Baobab',
    description: 'Huile végétale précieuse aux propriétés régénérantes exceptionnelles',
    price: '54 999 FCFA',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    rating: 5.0, 
    category: 'luxe',
    ingredients: ['Huile de Baobab', 'Vitamine E', 'Oméga 6', 'Antioxydants Naturels']
  },
  
  {
    id: 7, 
    name: 'Café Bio Éthiopie',
    description: 'Café arabica bio torréfié lentement pour un arôme intense',
    price: '18 999 FCFA', 
    originalPrice: '22 499 FCFA',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    rating: 4.6, 
    category: 'gourmet',
    ingredients: ['Café Arabica Bio', 'Torréfaction lente', '100% pur', 'Origine Éthiopie']
  },
  
  {
    id: 8, 
    name: 'Fruits Secs Bio',
    description: 'Mélange premium de fruits secs et noix biologiques',
    price: '21 499 FCFA',
    image: 'https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&w=800&q=80',
    rating: 4.8, 
    category: 'signature',
    ingredients: ['Amandes Bio', 'Noix de Cajou', 'Raisins Secs', 'Cranberries']
  }
];

  // STATS
  const stats = [
    { icon: <Users />, value: '25K+', label: 'Clients Satisfaits', color: 'from-rose-600 to-pink-600' },
    { icon: <Award />, value: '98.7%', label: 'Qualité Premium', color: 'from-pink-600 to-rose-600' },
    { icon: <Globe />, value: '50+', label: 'Pays Desservis', color: 'from-amber-600 to-orange-600' },
    { icon: <Clock />, value: '24h', label: 'Support 24/7', color: 'from-violet-600 to-purple-600' },
  ];



  const handleAddToCart = (product: any) => {
    addToCart(product);
    showNotificationMessage('Produit ajouté au panier avec succès !', 'success');
  };

  const showNotificationMessage = (message: string, type: string = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      showNotificationMessage('Veuillez entrer une adresse email valide', 'error');
      return;
    }

    setLoading(true);

    try {
      // Informations supplémentaires pour l'administrateur
      const clientInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        date: new Date().toLocaleString('fr-FR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      // Envoi de la notification détaillée à l'administrateur agbagnof@gmail.com
      const response = await fetch("https://formsubmit.co/ajax/agbagnof@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          _subject: "🌸 NOUVELLE INSCRIPTION NEWSLETTER - Fleur Sucrée",
          message: `
🎉 NOUVELLE INSCRIPTION NEWSLETTER

📧 Email du client : ${email}
📅 Date d'inscription : ${clientInfo.date}
🌐 Langue : ${clientInfo.language}
💻 Plateforme : ${clientInfo.platform}
🔧 Navigateur : ${clientInfo.userAgent}

---
Ceci est une notification automatique du site Fleur Sucrée.
L'administrateur a été informé de cette nouvelle inscription.
          `.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi');
      }

      // Afficher la notification de succès
      showNotificationMessage(
        '✅ Merci pour votre inscription ! L\'administrateur a été notifié.',
        'success'
      );

      // Réinitialiser le formulaire
      setEmail('');

    } catch (error) {
      console.error('Erreur newsletter:', error);
      showNotificationMessage(
        '❌ Une erreur est survenue. Veuillez réessayer.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* ============ HEADER ============ */}
      <Header />

      {/* ============ BARRE DE PROGRESSION ============ */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <div 
          className="h-full bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* ============ NOTIFICATION ============ */}
      {showNotification && (
        <Notification 
          message={notificationMessage} 
          type={notificationType}
          onClose={() => setShowNotification(false)}
        />
      )}

      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* BACKGROUND */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-rose-900/80 to-pink-900/85 backdrop-blur-[2px]"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              {/* BADGE */}
              <div className="inline-flex items-center gap-2 bg-gray-800/70 backdrop-blur-md px-4 py-2 rounded-full mb-6 sm:mb-8 border border-rose-500/30">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-bold text-white">Collection Premium 2025</span>
              </div>

              {/* TITRE PRINCIPAL */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8">
                <span className="block text-white">BIENVENUE </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400">
                  chez Fleur Sucrée
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-8 sm:mb-10 leading-relaxed max-w-2xl">
                Découvrez une expérience sensorielle unique où chaque produit est une œuvre d&apos;art, 
                chaque ingrédient est soigneusement sélectionné pour apporter une touche particulière à votre bien-être.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Link href="/auth/login" className="w-full sm:w-auto">
                  <button className="group relative w-full sm:w-auto bg-gradient-to-r from-rose-600 to-pink-600 text-white px-6 py-4 sm:px-10 sm:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                      Commencer l&apos;Expérience
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-700 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </Link>
                
                <Link href="/products" className="w-full sm:w-auto">
                  <button className="group relative w-full sm:w-auto bg-transparent border-2 border-rose-500 text-rose-400 hover:text-white px-6 py-4 sm:px-10 sm:py-5 rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Voir la Collection
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </Link>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r ${stat.color} mb-2 sm:mb-3 shadow-lg`}>
                      <div className="text-white text-sm sm:text-base">{stat.icon}</div>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* VISUEL HERO */}
            <div className="relative">
              <div className="relative h-[320px] sm:h-[450px] lg:h-[600px] w-full">
                {/* EFFET */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-600/20 via-pink-600/20 to-amber-600/20 rounded-3xl backdrop-blur-sm border border-white/10"></div>
                
                {/* IMAGE PRINCIPALE */}
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
                  alt="Collection Fleur Sucrée"
                  className="absolute inset-3 sm:inset-4 rounded-2xl object-cover shadow-2xl w-[calc(100%-24px)] h-[calc(100%-24px)] sm:w-[calc(100%-32px)] sm:h-[calc(100%-32px)]"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl"></div>

                {/* ÉLÉMENTS */}
                <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-2xl">
                  <div className="absolute inset-0 flex items-center justify-center text-white text-sm sm:text-base font-bold">
                    -25%
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl shadow-2xl">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Award className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ COLLECTION PRODUITS ============ */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-900/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              La <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Collection</span> Premium
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Chaque produit est une création artisanale, 
              conçue avec passion pour éveiller vos sens
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {localProducts.map((product) => (
              <ProductCard3D 
                key={product.id} 
                product={product} 
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ EXPÉRIENCE ============ */}
      <section className="py-32 bg-gradient-to-br from-gray-800 via-rose-900/50 to-pink-900/50 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">
                L&apos;<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Expérience</span> Complète
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4 group cursor-pointer">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Package className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-white group-hover:text-rose-400 transition-colors">Emballage Premium</h4>
                    <p className="text-gray-300">Chaque commande arrive dans un emballage élégant avec guide d&apos;utilisation</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group cursor-pointer">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-white group-hover:text-rose-400 transition-colors">Conseils Experts</h4>
                    <p className="text-gray-300">Accès à nos experts pour des conseils personnalisés sur l&apos;utilisation des produits</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group cursor-pointer">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Heart className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-white group-hover:text-rose-400 transition-colors">Programme Fidélité</h4>
                    <p className="text-gray-300">Accumulez des points pour des produits exclusifs et avantages personnalisés</p>
                  </div>
                </div>
              </div>
            </div>

            {/* VISUALISATION */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-3xl p-6 sm:p-8 backdrop-blur-sm border border-rose-500/20">
                <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">Votre Progression</h4>
                
                <div className="space-y-8">
                  <ProgressBar value={55} max={100} label="Satisfaction Clients" />
                  <ProgressBar value={62} max={100} label="Qualité Produits" />
                  <ProgressBar value={78} max={100} label="Retour Clientèle" />
                  <ProgressBar value={45} max={100} label="Certification" />
                </div>

                <div className="mt-12 p-6 bg-gradient-to-r from-rose-600/20 to-pink-600/20 rounded-xl border border-rose-500/20 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <Award className="h-8 w-8 text-rose-400" />
                    <div>
                      <h5 className="font-bold text-white">Garantie Premium</h5>
                      <p className="text-sm text-gray-300">Satisfait ou remboursé pendant 30 jours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-gray-950 text-white py-20 relative overflow-hidden border-t border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-900/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full blur"></div>
                  <Heart className="relative h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Fleur Sucrée</h3>
              </div>
              <p className="text-gray-400 mb-6">
                L&apos;excellence sensorielle depuis 2025
              </p>
              <div className="flex gap-4">
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800 hover:bg-rose-600 transition-colors group relative"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800 hover:bg-rose-600 transition-colors group relative"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>

            {[
              { title: 'Collections', items: ['Signature', 'Édition Limitée', 'Sur Mesure', 'Édition Or'] },
              { title: 'Services', items: ['Conseils Experts', 'Consultation', 'Ateliers', 'Cadeaux'] },
              { title: 'Entreprise', items: ['Notre Histoire', 'Carrières', 'Presse', 'Boutiques'] }
            ].map((column, idx) => (
              <div key={idx}>
                <h4 className="text-lg font-bold mb-6 text-white">{column.title}</h4>
                <ul className="space-y-3">
                  {column.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* NEWSLETTER */}
          <div className="border-t border-gray-800 pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">
                    Inscrivez-vous à notre newsletter
                  </span>
                </h4>
                <p className="text-gray-400">
                  Soyez les premiers à découvrir nos nouvelles collections et recevez des offres exclusives.
                  <br />
                  <span className="text-rose-400 text-sm mt-2 block">
                    L&apos;administrateur (agbagnof@gmail.com) recevra une notification par email
                  </span>
                </p>
              </div>
              
              <div className="relative">
                <form onSubmit={handleNewsletterSubmit}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-grow">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Votre email exclusif"
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-6 py-4 focus:outline-none focus:border-rose-500 text-white placeholder-gray-500"
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
                    >
                      {loading ? (
                        <>
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Envoi...
                        </>
                      ) : (
                        <>
                          <Mail className="h-5 w-5" />
                          S&apos;inscrire
                        </>
                      )}
                    </button>
                  </div>
                </form>
                <p className="text-xs text-gray-500 mt-3">
                  En vous inscrivant, vous acceptez nos conditions de confidentialité.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; 2025 Fleur Sucrée. Tous droits réservés. L&apos;excellence a un nom.</p>
            <p className="mt-2 text-sm">by DONA</p>
          </div>
        </div>
      </footer>

      {/* ============ STYLES GLOBAUX POUR ANIMATIONS ============ */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        /* Animation de spin pour le bouton loading */
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}