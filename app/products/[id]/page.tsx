'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, Star, Heart, 
  ShoppingBag, Package, Check, 
  Info, Leaf, Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/app/lib/format';
import { useAuth } from '@/context/AuthContext';

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
      console.error('Error fetching product details:', err);
      setError(err.message || 'Impossible de charger les détails du produit.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-white">Chargement des détails de l&apos;élixir...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="text-center max-w-md bg-gray-850 p-8 rounded-2xl border border-gray-800 shadow-xl">
          <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Erreur de chargement</h2>
          <p className="text-gray-400 mb-6">{error || 'Le produit demandé n’existe pas.'}</p>
          <Button 
            onClick={() => router.push('/products')}
            className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/products')}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 group transition-colors"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Retour aux produits
        </button>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-gray-800/20 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl">
          
          {/* Images Section */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-700">
              <img
                src={product.images?.[activeImage] || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== window.location.origin + '/placeholder.jpg') {
                    target.src = '/placeholder.jpg';
                  }
                }}
              />
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider shadow-lg">
                  {product.category}
                </span>
              </div>

              {/* Discount Badge */}
              {discountPercentage > 0 && (
                <div className="absolute top-4 right-4">
                  <span className="bg-rose-600 text-white font-bold px-3 py-1.5 rounded-full text-xs shadow-lg">
                    -{discountPercentage}%
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto py-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === idx ? 'border-rose-500 scale-105' : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {/* Rating and Favorite */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating) 
                            ? 'fill-amber-400' 
                            : 'text-gray-600'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-white font-bold ml-2">{product.rating}</span>
                </div>

                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 rounded-full border transition-all ${
                    isFavorite 
                      ? 'bg-rose-500/10 border-rose-500 text-rose-500' 
                      : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Title & Info */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">{product.name}</h1>
              
              <div className="flex items-baseline gap-4 mt-4">
                <span className="text-3xl font-extrabold text-rose-400">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>

              <div className="border-t border-gray-700/60 my-6"></div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Description</h3>
                <p className="text-gray-300 leading-relaxed text-base">{product.description}</p>
              </div>

              {/* Ingredients */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
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

              {/* Stock status */}
              <div className="mt-6 flex items-center gap-2">
                <span className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Disponibilité :</span>
                {product.stock > 0 ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-sm bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <Check className="h-4 w-4" /> En Stock ({product.stock} unités)
                  </span>
                ) : (
                  <span className="text-red-400 font-bold flex items-center gap-1 text-sm bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                    Rupture de Stock
                  </span>
                )}
              </div>
            </div>

            {/* Actions Section */}
            <div className="space-y-4 pt-6 border-t border-gray-700/60">
              <div className="flex items-center gap-4">
                {/* Quantity selector */}
                {product.stock > 0 && (
                  <div className="flex items-center border border-gray-700 rounded-xl bg-gray-900/50 p-1">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-3 py-2 text-gray-400 hover:text-white font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 text-white font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      className="px-3 py-2 text-gray-400 hover:text-white font-bold"
                    >
                      +
                    </button>
                  </div>
                )}

                {/* Add to cart Button */}
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`flex-1 py-4 font-bold rounded-xl shadow-lg transition-all duration-300 ${
                    addedToCart 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="h-5 w-5 mr-2 animate-bounce" /> Ajouté !
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5 mr-2" /> Ajouter au Panier
                    </>
                  )}
                </Button>
              </div>

              {/* VIP / Signature service details */}
              <div className="bg-rose-950/10 border border-rose-900/20 rounded-2xl p-4 flex gap-3 items-start">
                <Sparkles className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-rose-300 uppercase tracking-wider">Service Signature Fleur Sucrée</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Chaque boîte est préparée à la main et parfumée avec nos essences de prestige. Livraison sécurisée et discrète.
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
