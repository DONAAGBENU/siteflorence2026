'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Heart, Sparkles, Flame, Star, CheckCircle, 
  ChevronRight, Instagram, Facebook, Moon, Sun, 
  Package, Gem, Award, Clock, Users, Leaf,
  Play, Pause, Volume2, Gift, ShieldCheck, Globe,
  Mail, X, ExternalLink
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';

// ============ PARTICLE BACKGROUND ============
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{
      x: number; y: number; size: number; speedX: number; speedY: number; color: string;
    }> = [];

    const colors = [
      'rgba(244, 114, 182, 0.15)',
      'rgba(236, 72, 153, 0.15)',
      'rgba(217, 70, 239, 0.15)',
      'rgba(249, 168, 212, 0.15)'
    ];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 0.3 - 0.15,
        speedY: Math.random() * 0.3 - 0.15,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.2 }} />
  );
};

// ============ PRODUCT CARD 3D ============
const ProductCard3D = ({ product, onAddToCart }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative h-[500px] perspective-1000">
      <div 
        className={`relative w-full h-full preserve-3d transition-all duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FACE AVANT */}
        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-50 via-rose-50/50 to-pink-50 rounded-3xl shadow-xl overflow-hidden border border-rose-100">
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent ${isHovered ? 'animate-shimmer' : ''}`}></div>
          
          {/* IMAGE AVEC EFFETS */}
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            
            {/* BADGE FLOTTANT */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
              <div className="bg-gradient-to-r from-emerald-500/90 to-green-600/90 text-gray-900 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                <Leaf className="h-3 w-3" />
                100% Bio
              </div>
            </div>
          </div>

          {/* CONTENU */}
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-2 sm:mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{product.name}</h3>
              <button className="text-rose-600 hover:text-rose-800 transition-colors">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
            
            <p className="text-gray-700 text-sm sm:text-base mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-none">{product.description}</p>
            
            {/* ÉTOILES ANIMÉES */}
            <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${i < Math.floor(product.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'} 
                    ${isHovered ? 'animate-bounce' : ''}`}
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
              <span className="text-xs sm:text-sm font-bold text-gray-700">{product.rating}</span>
            </div>

            {/* PRIX EN FCFA */}
            <div className="mb-4 sm:mb-6">
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent">
                {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs sm:text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
              )}
              <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">Prix en FCFA</div>
            </div>

            {/* BOUTON 3D */}
            <button 
              onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
              className="relative w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-2.5 sm:py-3 rounded-xl font-bold overflow-hidden group hover:shadow-lg transition-shadow text-sm sm:text-base"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                Ajouter au panier
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>

            {/* INDICATEUR FLIP */}
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-[10px] sm:text-xs text-gray-500">
              👆 Cliquer pour voir les détails
            </div>
          </div>
        </div>

        {/* FACE ARRIÈRE - DÉTAILS */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-gray-800 via-emerald-800 to-green-800 rounded-3xl shadow-2xl p-4 sm:p-6 text-gray-100">
          <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Détails du produit</h4>
          
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            {product.ingredients.map((ingredient: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
                <span>{ingredient}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 sm:space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-300" />
              <span className="text-xs sm:text-sm">Certifié bio & éthique</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Leaf className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-300" />
              <span className="text-xs sm:text-sm">Ingrédients 100% naturels</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-300" />
              <span className="text-xs sm:text-sm">Production locale</span>
            </div>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
            className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors backdrop-blur-sm text-sm"
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
  const percentage = (value / max) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-sm font-bold text-white">{value}/{max}</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-600 to-green-600 rounded-full transition-all duration-1000"
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
  const [darkMode, setDarkMode] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // État pour les liens sociaux (vous pouvez les remplacer par vos propres liens)
  const [socialLinks, setSocialLinks] = useState({
    instagram: '#', // Remplacez par votre lien Instagram
    facebook: '#'   // Remplacez par votre lien Facebook
  });

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
 // ============ PRODUITS BIO ============
const localProducts = [
  
  {
    id: 2, 
    name: 'Miel Bio Pur',
    description: 'Miel 100% naturel récolté dans les montagnes africaines',
    price: '32 499 FCFA',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=800&q=80',
    rating: 4.8, 
    category: 'signature',
    ingredients: ['Miel Brut', 'Propolis', 'Gelée Royale', 'Pollen Frais']
  },
  
  {
    id: 4, 
    name: 'Huile de Baobab',
    description: 'Huile végétale précieuse aux propriétés régénérantes exceptionnelles',
    price: '54 999 FCFA',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    rating: 5.0, 
    category: 'luxe',
    ingredients: ['Huile de Baobab', 'Vitamine E', 'Oméga 6', 'Antioxydants Naturels']
  },
  {
    id: 5, 
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
    id: 6, 
    name: 'Fruits Secs Bio',
    description: 'Mélange premium de fruits secs et noix biologiques',
    price: '21 499 FCFA',
    image: 'https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&w=800&q=80',
    rating: 4.8, 
    category: 'signature',
    ingredients: ['Amandes Bio', 'Noix de Cajou', 'Raisins Secs', 'Cranberries']
  },
  
  
];

  // STATS
  const stats = [
    { icon: <Users />, value: '25K+', label: 'Clients Satisfaits', color: 'from-blue-600 to-cyan-600' },
    { icon: <Award />, value: '98.7%', label: 'Produits Bio', color: 'from-emerald-600 to-green-600' },
    { icon: <Globe />, value: '50+', label: 'Pays Desservis', color: 'from-violet-600 to-purple-600' },
    { icon: <Clock />, value: '24h', label: 'Support 24/7', color: 'from-amber-600 to-orange-600' },
  ];

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setAudioPlaying(!audioPlaying);
    }
  };

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
      // Envoi de la notification réelle à l'administrateur agbagnof@gmail.com
      const response = await fetch("https://formsubmit.co/ajax/agbagnof@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          _subject: "Nouvelle inscription newsletter - Fleur Sucrée",
          message: `Un client s'est inscrit à la newsletter.\nEmail du client : ${email}\nDate : ${new Date().toLocaleString()}`
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi');
      }

      // Afficher la notification de succès
      showNotificationMessage(
        'Merci pour votre inscription ! L\'administrateur a été notifié.',
        'success'
      );

      // Réinitialiser le formulaire
      setEmail('');

    } catch (error) {
      showNotificationMessage(
        'Une erreur est survenue. Veuillez réessayer.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-500 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-gray-100 via-emerald-50/50 to-amber-50/50'}`}>
      {/* ============ BARRE DE PROGRESSION FLOTTANTE ============ */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <div 
          className="h-full bg-gradient-to-r from-emerald-600 via-green-600 to-amber-600 transition-all duration-300"
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

      {/* ============ AUDIO AMBIANT ============ */}
      <audio ref={audioRef} loop>
        <source src="https://assets.mixkit.co/music/preview/mixkit-dreamy-ambient-lullaby-583.mp3" type="audio/mpeg" />
      </audio>

      {/* ============ HEADER ULTRA PREMIUM ============ */}
      <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-900/95 backdrop-blur-xl shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* LOGO ANIMÉ AVEC EFFET FLOTTANT */}
            <div className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <Leaf className="relative h-8 w-8 sm:h-10 sm:w-10 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-amber-400 bg-clip-text text-transparent">
                  Fleur Sucrée
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-400">Produits Bio d&apos;Excellence</p>
              </div>
            </div>

            {/* ACTIONS AVEC EFFETS */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* BOUTON AUDIO FLOTTANT */}
              <button 
                onClick={toggleAudio}
                className="p-1.5 sm:p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm transition-colors animate-float-slow"
              >
                {audioPlaying ? 
                  <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" /> : 
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                }
              </button>

              {/* BOUTON DARK MODE FLOTTANT */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 sm:p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm transition-colors animate-float-reverse"
              >
                {darkMode ? 
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" /> : 
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
                }
              </button>

              {/* PANIER ULTRA PREMIUM AVEC EFFET FLOTTANT */}
              <button 
                onClick={toggleCart}
                className="relative group animate-float"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full blur-md opacity-0 group-hover:opacity-70 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-emerald-600 to-green-600 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-full font-bold flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                    <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Panier</span>
                    {totalItems > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-white text-emerald-700 text-xs sm:text-sm font-bold rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center shadow-lg animate-pulse">
                        {totalItems}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ============ HERO SECTION ULTRA PREMIUM ============ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* BACKGROUND AVEC IMAGE PRODUITS BIO */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-emerald-900/80 to-green-900/85 backdrop-blur-[2px]"></div>
          </div>
        </div>
        
        {/* PARTICLES BACKGROUND FLOTTANTES */}
        <ParticleBackground />
        
        {/* EFFETS VISUELS FLOTTANTS */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-600/15 to-green-600/15 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-amber-600/15 to-orange-600/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              {/* BADGE ANIMÉ FLOTTANT */}
              <div className="inline-flex items-center gap-2 bg-gray-800/70 backdrop-blur-md px-4 py-2 rounded-full mb-6 sm:mb-8 border border-emerald-500/30 animate-float">
                <Sparkles className="h-4 w-4 text-amber-400 animate-spin-slow" />
                <span className="text-sm font-bold text-white">Collection Bio 2025</span>
              </div>

              {/* TITRE PRINCIPAL AVEC DÉGRADÉ ANIMÉ */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8">
                <span className="block text-white">BIENVENUE </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-amber-400 animate-gradient">
                  dans l&apos;univers du naturel
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-8 sm:mb-10 leading-relaxed max-w-2xl">
                Découvrez une expérience sensorielle inégalée où chaque produit est une œuvre d&apos;art biologique, 
                chaque ingrédient est soigneusement sélectionné dans le respect de la nature, et chaque détail est pensé 
                pour apporter une touche particulière à votre bien-être.
              </p>

              {/* CTA PREMIUM AVEC EFFETS FLOTTANTS */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Link href="/auth/login" className="w-full sm:w-auto">
                  <button className="group relative w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-4 sm:px-10 sm:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 overflow-hidden animate-float-slow">
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <Leaf className="h-5 w-5 sm:h-6 sm:w-6 animate-pulse" />
                      Commencer l&apos;Expérience
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </button>
                </Link>
                
                <Link href="/products" className="w-full sm:w-auto">
                  <button className="group relative w-full sm:w-auto bg-transparent border-2 border-emerald-500 text-emerald-400 hover:text-white px-6 py-4 sm:px-10 sm:py-5 rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Voir la Collection
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </button>
                </Link>
              </div>

              {/* STATS AVEC ICÔNES FLOTTANTES */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r ${stat.color} mb-2 sm:mb-3 shadow-lg animate-float`} style={{ animationDelay: `${idx * 0.5}s` }}>
                      <div className="text-white text-sm sm:text-base">{stat.icon}</div>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ============ VISUEL HERO 3D FLOTTANT ============ */}
            <div className="relative">
              <div className="relative h-[320px] sm:h-[450px] lg:h-[600px] w-full">
                {/* EFFET 3D FLOTTANT */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-green-600/20 to-amber-600/20 rounded-3xl backdrop-blur-sm border border-white/10"></div>
                
                {/* IMAGE PRINCIPALE AVEC EFFET FLOTTANT - PRODUITS BIO */}
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
                  alt="Collection Fleur Sucrée Bio"
                  className="absolute inset-3 sm:inset-4 rounded-2xl object-cover shadow-2xl animate-float-slow w-[calc(100%-24px)] h-[calc(100%-24px)] sm:w-[calc(100%-32px)] sm:h-[calc(100%-32px)]"
                />

                {/* OVERLAY ANIMÉ */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl"></div>

                {/* ============ ÉLÉMENTS FLOTTANTS ============ */}
                {/* Élément flottant -25% */}
                <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-2xl animate-float-slow">
                  <div className="absolute inset-0 flex items-center justify-center text-white text-sm sm:text-base font-bold">
                    -25%
                  </div>
                </div>

                {/* Élément flottant Award */}
                <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl shadow-2xl animate-float-reverse">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Award className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                </div>

                {/* Nouvel élément flottant Gem */}
                <div className="hidden sm:flex absolute top-1/4 -left-8 w-16 h-16 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl shadow-2xl animate-float" style={{ animationDelay: '1s' }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Gem className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Nouvel élément flottant Sparkles */}
                <div className="hidden sm:flex absolute bottom-1/3 -right-8 w-20 h-20 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl shadow-2xl animate-float-reverse" style={{ animationDelay: '1.5s' }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ COLLECTION PRODUITS 3D ============ */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-900/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              La <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">Collection</span> Bio
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Chaque produit est une symphonie de saveurs et de bienfaits, 
              créée par nos experts en agriculture biologique
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
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

      {/* ============ EXPÉRIENCE IMMERSIVE ============ */}
      <section className="py-32 bg-gradient-to-br from-gray-800 via-emerald-900/50 to-green-900/50 text-white relative overflow-hidden">
        {/* EFFETS SPÉCIAUX FLOTTANTS */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-shimmer-slow"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent animate-shimmer-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">
                L&apos;<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">Expérience</span> Complète
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4 group cursor-pointer">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-float-slow">
                      <Package className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors">Emballage Écologique</h4>
                    <p className="text-gray-300">Chaque commande arrive dans un emballage 100% biodégradable avec guide d&apos;utilisation</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group cursor-pointer">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: '0.5s' }}>
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors">Conseils Experts</h4>
                    <p className="text-gray-300">Accès à nos experts pour des conseils personnalisés sur l&apos;utilisation des produits bio</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group cursor-pointer">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-float-reverse">
                      <Gift className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors">Programme Fidélité Bio</h4>
                    <p className="text-gray-300">Accumulez des points pour des produits exclusifs et soutenez l&apos;agriculture durable</p>
                  </div>
                </div>
              </div>
            </div>

            {/* VISUALISATION INTERACTIVE */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-3xl p-6 sm:p-8 backdrop-blur-sm border border-emerald-500/20 animate-fade-in">
                <h4 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">Votre Progression Bio</h4>
                
                <div className="space-y-8">
                  <ProgressBar value={55} label="Satisfaction Clients" />
                  <ProgressBar value={62} label="Qualité Produits" />
                  <ProgressBar value={78} label="Retour Clientèle" />
                  <ProgressBar value={45} label="Certification Bio" />
                </div>

                <div className="mt-12 p-6 bg-gradient-to-r from-emerald-600/20 to-green-600/20 rounded-xl border border-emerald-500/20 backdrop-blur-sm animate-pulse-slow">
                  <div className="flex items-center gap-4">
                    <ShieldCheck className="h-8 w-8 text-emerald-400" />
                    <div>
                      <h5 className="font-bold text-white">Garantie Bio</h5>
                      <p className="text-sm text-gray-300">Satisfait ou remboursé pendant 30 jours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ULTIME ============ */}
      <footer className="bg-gray-950 text-white py-20 relative overflow-hidden border-t border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-900/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full blur"></div>
                  <Leaf className="relative h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Fleur Sucrée</h3>
              </div>
              <p className="text-gray-400 mb-6">
                L&apos;excellence biologique depuis 2025
              </p>
              <div className="flex gap-4">
                {/* Instagram - Remplacez le href par votre lien */}
                <a 
                  href={socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800 hover:bg-emerald-600 transition-colors animate-float-slow group relative"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    @votreinstagram
                  </span>
                </a>
                {/* Facebook - Remplacez le href par votre lien */}
                <a 
                  href={socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800 hover:bg-emerald-600 transition-colors animate-float-reverse group relative"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    /votrefacebook
                  </span>
                </a>
              </div>
            </div>

            {[
              { title: 'Collections', items: ['Signature Bio', 'Édition Limitée', 'Sur Mesure', 'Édition Or'] },
              { title: 'Services', items: ['Conseils Experts', 'Consultation', 'Ateliers Bio', 'Cadeaux'] },
              { title: 'Entreprise', items: ['Notre Histoire', 'Carrières', 'Presse', 'Boutiques'] }
            ].map((column, idx) => (
              <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 0.2}s` }}>
                <h4 className="text-lg font-bold mb-6 text-white">{column.title}</h4>
                <ul className="space-y-3">
                  {column.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* NEWSLETTER FONCTIONNELLE */}
          <div className="border-t border-gray-800 pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">
                    Inscrivez-vous à notre newsletter
                  </span>
                </h4>
                <p className="text-gray-400">
                  Soyez les premiers à découvrir nos nouvelles collections bio et recevez des offres exclusives.
                  <br />
                  <span className="text-emerald-400 text-sm mt-2 block">
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
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-6 py-4 focus:outline-none focus:border-emerald-500 text-white placeholder-gray-500"
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 animate-pulse-slow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
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
                  <br />
                  
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; 2025 Fleur Sucrée. Tous droits réservés. L&apos;excellence biologique a un nom.</p>
           <>by DONA</>
          </div>
        </div>
      </footer>

      {/* ============ STYLES GLOBAUX POUR ANIMATIONS ============ */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-5deg); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes shimmer-slow {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 7s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-shimmer-slow {
          animation: shimmer-slow 3s infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
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