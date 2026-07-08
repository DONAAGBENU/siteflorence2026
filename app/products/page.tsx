'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { 
  Filter, Search, Star, Heart, 
  Sparkles, Package, ShoppingBag,
  User, Settings, LogOut, Camera,
  Shield, MessageCircle, Plus, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/app/lib/format';

const WHATSAPP_ADMIN = '+22890582547';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  rating: number;
  ingredients: string[];
  stock: number;
  created_at: string;
}

export default function ProductsPage() {
  const { user, logout, updateProfile } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const [profileData, setProfileData] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: ''
  });

  const categories = [
    { id: 'all', name: 'Tous les produits' },
    { id: 'premium', name: 'Premium' },
    { id: 'signature', name: 'Signature' },
    { id: 'gourmet', name: 'Gourmet' },
    { id: 'luxe', name: 'Luxe' }
  ];

  useEffect(() => {
    fetchProducts();
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        avatar: user.avatar || ''
      }));
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      category: product.category,
      stock: product.stock,
    });
    setAddedItems(prev => [...prev, product.id]);
    setTimeout(() => {
      setAddedItems(prev => prev.filter(id => id !== product.id));
    }, 2000);
  };

  const handleOrder = (product: Product) => {
    if (!user) {
      router.push(`/auth/login?redirect=/products`);
      return;
    }
    const message = `Bonjour ! Je voudrais commander :\n\n• ${product.name}\nPrix: ${formatPrice(product.price)}\n\nNom: ${user.name}\nTéléphone: ${user.phone}`;
    const url = `https://wa.me/${WHATSAPP_ADMIN.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleUpdateProfile = async () => {
    try {
      if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
        alert('Les nouveaux mots de passe ne correspondent pas');
        return;
      }
      const updateData: any = {};
      if (profileData.name) updateData.name = profileData.name;
      if (profileData.newPassword) updateData.password = profileData.newPassword;
      if (profileData.avatar) updateData.avatar = profileData.avatar;
      await updateProfile(updateData);
      alert('Profil mis à jour avec succès!');
      setShowProfile(false);
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      alert('Erreur lors de la mise à jour du profil');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData(prev => ({ ...prev, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-white">Chargement des élixirs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-12">
      {/* Header avec profil */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-500/10 backdrop-blur-sm px-4 py-2 rounded-full mb-3">
              <Sparkles className="h-4 w-4 text-rose-400" />
              <span className="text-sm font-bold text-rose-400">Collection Exclusif</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
              Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Élixirs</span> d&apos;Exception
            </h1>
            <p className="text-lg sm:text-xl text-gray-300">
              Découvrez notre collection exclusive · Prix en FCFA
            </p>
          </div>
          
          {/* Bouton profil / connexion */}
          <div className="w-full sm:w-auto">
            {user ? (
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3 bg-gray-800/50 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-700 hover:border-rose-500/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.phone}</p>
                    </div>
                  </div>
                </button>
                
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-gray-800/90 backdrop-blur-lg rounded-xl border border-gray-700 shadow-2xl z-50">
                    <div className="p-6">
                      <div className="flex flex-col items-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 flex items-center justify-center border-2 border-rose-500 mb-3">
                          <User className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white">{user.name}</h3>
                        <p className="text-gray-400 text-sm">{user.phone}</p>
                      </div>
                      
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Nom complet"
                          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                        />
                        <Button
                          onClick={handleUpdateProfile}
                          className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-sm py-2"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Mettre à jour
                        </Button>
                        <Button
                          onClick={logout}
                          variant="outline"
                          className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 text-sm py-2"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Déconnexion
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3 w-full sm:w-auto">
                <Link href="/auth/register" className="flex-1 sm:flex-initial">
                  <Button className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
                    S&apos;inscrire
                  </Button>
                </Link>
                <Link href="/auth/login" className="flex-1 sm:flex-initial">
                  <Button variant="outline" className="w-full border-rose-500 text-rose-400">
                    Se connecter
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="space-y-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bannière connexion requise pour commander */}
      {!user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl px-6 py-4 flex items-center gap-4">
            <Shield className="h-6 w-6 text-amber-400 flex-shrink-0" />
            <p className="text-amber-300 text-sm">
              <strong>Connexion requise pour commander.</strong> Vous pouvez parcourir les produits librement, mais vous devez vous connecter pour passer une commande.
            </p>
            <Link href="/auth/login" className="ml-auto flex-shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg text-sm transition-colors">
              Se connecter
            </Link>
          </div>
        </div>
      )}

      {/* Grille de produits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-rose-500/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col"
              >
                {/* Image */}
                <Link href={`/products/${product.id}`} className="relative h-52 overflow-hidden block flex-shrink-0">
                  <img
                    src={product.images?.[0] || '/placeholder.jpg'}
                    alt={product.name}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.jpg'; }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-gradient-to-r from-amber-500/90 to-amber-600/90 text-gray-900 px-2 py-0.5 rounded-full text-xs font-bold">
                      {product.category}
                    </span>
                  </div>

                  {/* Favori */}
                  <button
                    onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-gray-900/80 backdrop-blur-sm hover:bg-rose-500/20 transition-colors"
                  >
                    <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-300'}`} />
                  </button>

                  {/* Stock badge */}
                  {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-red-500/90 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                        Plus que {product.stock} !
                      </span>
                    </div>
                  )}
                </Link>

                {/* Contenu */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="text-lg font-bold text-white hover:text-rose-400 transition-colors">{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-white">{product.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                    {product.description}
                  </p>

                  {/* Prix */}
                  <div className="mb-4">
                    <span className="text-xl font-bold text-rose-400">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Boutons d'action */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Ajouter au panier */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addedItems.includes(product.id)}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-medium text-sm transition-all ${
                        addedItems.includes(product.id)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }`}
                    >
                      {addedItems.includes(product.id) ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Ajouté
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Panier
                        </>
                      )}
                    </button>

                    {/* Commander */}
                    <button
                      onClick={() => handleOrder(product)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-sm bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Commander
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">Aucun produit trouvé.</p>
            <p className="text-gray-500 mt-2">Essayez de modifier vos filtres de recherche.</p>
          </div>
        )}
      </div>

      {/* CTA non-connectés */}
      {!user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="bg-gradient-to-r from-rose-600/20 to-pink-600/20 rounded-2xl p-8 text-center border border-rose-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">Créez votre compte gratuit</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Rejoignez notre communauté pour commander, gérer vos favoris et suivre vos livraisons.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
                  Créer un compte
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" className="border-rose-500 text-rose-400">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}