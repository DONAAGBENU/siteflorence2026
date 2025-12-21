'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { 
  Filter, Search, Star, Heart, 
  Sparkles, Package, ShoppingBag,
  User, Settings, LogOut, Camera,
  Shield, Lock, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showProfile, setShowProfile] = useState(false);
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
      
      // Réinitialiser les champs de mot de passe
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

    // Simuler un téléchargement (dans un vrai projet, uploader vers Supabase Storage)
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData(prev => ({
        ...prev,
        avatar: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-white">Chargement des produits...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-12">
      {/* Header avec profil */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-500/10 backdrop-blur-sm px-4 py-2 rounded-full mb-3">
              <Sparkles className="h-4 w-4 text-rose-400" />
              <span className="text-sm font-bold text-rose-400">Collection Exclusif</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-2">
              Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Élixirs</span> d&apos;Exception
            </h1>
            <p className="text-xl text-gray-300">
              Découvrez notre collection exclusive
            </p>
          </div>
          
          {/* Bouton profil */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-700 hover:border-rose-500/50 transition-colors"
              >
                <div className="relative">
                  {profileData.avatar ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={profileData.avatar}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.phone}</p>
                </div>
              </button>
              
              {/* Menu profil */}
              {showProfile && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800/90 backdrop-blur-lg rounded-xl border border-gray-700 shadow-2xl z-50">
                  <div className="p-6">
                    {/* Photo de profil */}
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative mb-4">
                        {profileData.avatar ? (
                          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-rose-500">
                            <Image
                              src={profileData.avatar}
                              alt={user.name}
                              width={80}
                              height={80}
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 flex items-center justify-center border-2 border-rose-500">
                            <User className="h-8 w-8 text-white" />
                          </div>
                        )}
                        <label className="absolute bottom-0 right-0 bg-rose-600 p-2 rounded-full cursor-pointer hover:bg-rose-700">
                          <Camera className="h-4 w-4 text-white" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <h3 className="text-lg font-bold text-white">{user.name}</h3>
                      <p className="text-gray-400">{user.phone}</p>
                    </div>
                    
                    {/* Formulaire de mise à jour */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          value={profileData.newPassword}
                          onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                          placeholder="Laisser vide pour ne pas changer"
                          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                        />
                      </div>
                      
                      {profileData.newPassword && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirmer le nouveau mot de passe
                          </label>
                          <input
                            type="password"
                            value={profileData.confirmPassword}
                            onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                          />
                        </div>
                      )}
                      
                      <Button
                        onClick={handleUpdateProfile}
                        className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Mettre à jour le profil
                      </Button>
                      
                      <Button
                        onClick={logout}
                        variant="outline"
                        className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Se déconnecter
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
                  S&apos;inscrire
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" className="border-rose-500 text-rose-400">
                  Se connecter
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="space-y-6">
          {/* Barre de recherche */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Catégories */}
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
                <div className="flex items-center gap-2">
                  {selectedCategory === category.id && <Filter className="h-4 w-4" />}
                  {category.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-rose-500/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Image du produit */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Badge catégorie */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-gradient-to-r from-amber-500/90 to-amber-600/90 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                      {product.category}
                    </div>
                  </div>
                  
                  {/* Bouton favori */}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-900/80 backdrop-blur-sm hover:bg-rose-500/20 transition-colors"
                  >
                    <Heart className={`h-5 w-5 ${favorites.includes(product.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-300'}`} />
                  </button>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-white">{product.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Prix */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-rose-400">
                        {product.price.toFixed(2)}€
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.originalPrice.toFixed(2)}€
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                      onClick={() => {
                        window.location.href = `/products/${product.id}`;
                      }}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Détails
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
                      onClick={() => {
                        // Ajouter au panier
                      }}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
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

      {/* Section pour les non-connectés */}
      {!user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="bg-gradient-to-r from-rose-600/20 to-pink-600/20 rounded-2xl p-8 text-center border border-rose-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Accédez à votre espace personnel
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Créez un compte gratuit pour gérer votre profil, enregistrer vos favoris et suivre vos commandes.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
                  Créer un compte gratuit
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