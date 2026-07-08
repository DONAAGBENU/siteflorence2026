'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Star, Heart, 
  ShoppingBag, Package, Check, 
  Info, Leaf, Sparkles, MessageCircle, Plus, Minus, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/app/lib/format';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const WHATSAPP_ADMIN = '+22890582547';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  images: string[];
  category: string;
  rating: number;
  ingredients: string[];
  stock: number;
  is_active: boolean;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error: dbError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (dbError) throw dbError;
      if (!data) throw new Error('Produit non trouvé');
      setProduct(data);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger les détails du produit.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      category: product.category,
      stock: product.stock,
    }, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleOrder = () => {
    if (!user) {
      router.push(`/auth/login?redirect=/products/${id}`);
      return;
    }
    if (!product) return;
    const message = `Bonjour ! Je voudrais commander :\n\n• ${product.name} (x${quantity})\nPrix unitaire: ${formatPrice(product.price)}\nTotal: ${formatPrice(product.price * quantity)}\n\nNom: ${user.name}\nTéléphone: ${user.phone}`;
    const url = `https://wa.me/${WHATSAPP_ADMIN.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-white">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
          <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Produit introuvable</h2>
          <p className="text-gray-400 mb-6">{error || 'Ce produit n\'existe pas.'}</p>
          <Button 
            onClick={() => router.push('/products')}
            className="bg-gradient-to-r from-rose-600 to-pink-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour aux produits
          </Button>
        </div>
      </div>
    );
  }

  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Retour */}
        <button
          onClick={() => router.push('/products')}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 group transition-colors"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Retour aux produits
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-gray-800/20 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-gray-700/50 shadow-2xl">
          
          {/* Section Images */}
          <div className="space-y-4">
            {/* Image principale */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-700 shadow-xl">
              <img
                src={product.images?.[activeImage] || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.jpg'; }}
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4">
                <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider shadow-lg">
                  {product.category}
                </span>
              </div>
              {discountPercentage > 0 && (
                <div className="absolute top-4 right-4">
                  <span className="bg-rose-600 text-white font-bold px-3 py-1.5 rounded-full text-xs shadow-lg">
                    -{discountPercentage}%
                  </span>
                </div>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <div className="absolute bottom-4 left-4">
                  <span className="bg-orange-500/90 text-white font-bold px-3 py-1 rounded-full text-xs">
                    Plus que {product.stock} disponibles !
                  </span>
                </div>
              )}
            </div>

            {/* Miniatures */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === idx ? 'border-rose-500 ring-2 ring-rose-500/30 scale-105' : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Garantie */}
            <div className="bg-gray-800/50 rounded-xl p-4 flex items-center gap-3 border border-gray-700">
              <Shield className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-white text-sm font-semibold">Commande 100% sécurisée</p>
                <p className="text-gray-400 text-xs">via WhatsApp avec l'administrateur</p>
              </div>
            </div>
          </div>

          {/* Section Détails */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {/* Note */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`}
                    />
                  ))}
                  <span className="text-white font-bold ml-2">{product.rating}/5</span>
                </div>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 rounded-full border transition-all ${
                    isFavorite 
                      ? 'bg-rose-500/10 border-rose-500 text-rose-500' 
                      : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:text-white'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Nom */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">{product.name}</h1>
              
              {/* Prix */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-extrabold text-rose-400">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>

              {/* Stock */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                    <Check className="h-4 w-4" /> En stock — {product.stock} unité{product.stock > 1 ? 's' : ''} disponible{product.stock > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="inline-flex items-center text-red-400 font-bold text-sm bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
                    Rupture de stock
                  </span>
                )}
              </div>

              <hr className="border-gray-700/60 mb-6" />

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" /> Description
                </h3>
                <p className="text-gray-300 leading-relaxed">{product.description}</p>
              </div>

              {/* Ingrédients */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-emerald-400" /> Ingrédients
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ing, idx) => (
                      <span 
                        key={idx} 
                        className="bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-gray-700/60">
              {/* Sélecteur quantité */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm font-medium">Quantité :</span>
                  <div className="flex items-center border border-gray-700 rounded-xl bg-gray-900/50 overflow-hidden">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors font-bold"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-5 py-2.5 text-white font-bold border-x border-gray-700">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      className="px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors font-bold"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-rose-400 font-bold">
                    = {formatPrice(product.price * quantity)}
                  </span>
                </div>
              )}

              {/* Boutons principaux */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Ajouter au panier */}
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`py-4 font-bold rounded-xl shadow-lg transition-all duration-300 ${
                    addedToCart 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="h-5 w-5 mr-2 animate-bounce" /> Ajouté !
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5 mr-2" /> Ajouter au panier
                    </>
                  )}
                </Button>

                {/* Commander */}
                <Button
                  onClick={handleOrder}
                  disabled={product.stock <= 0}
                  className="py-4 font-bold rounded-xl shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all hover:scale-[1.02] active:scale-95"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  {user ? 'Commander maintenant' : 'Se connecter pour commander'}
                </Button>
              </div>

              {/* Message si non connecté */}
              {!user && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3">
                  <Shield className="h-5 w-5 text-amber-400 flex-shrink-0" />
                  <p className="text-amber-300 text-sm">
                    Vous devez être connecté pour passer une commande. Cliquez sur "Commander" pour vous connecter automatiquement.
                  </p>
                </div>
              )}

              {/* Badge signature */}
              <div className="bg-rose-950/10 border border-rose-900/20 rounded-2xl p-4 flex gap-3 items-start">
                <Sparkles className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-rose-300 uppercase tracking-wider">Service Signature Fleur Sucrée</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Chaque produit est préparé à la main avec nos essences de prestige. Livraison sécurisée et discrète.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
