'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Filter, Search, Star, Heart, 
  Sparkles, Package, ShoppingBag
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
}

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'Tous les produits' },
    { id: 'premium', name: 'Premium' },
    { id: 'signature', name: 'Signature' },
    { id: 'gourmet', name: 'Gourmet' },
    { id: 'luxe', name: 'Luxe' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-white">Chargement des produits...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-rose-500/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-rose-400" />
            <span className="text-sm font-bold text-rose-400">Collection Exclusif</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Élixirs</span> d&apos;Exception
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez notre collection exclusive de produits naturels conçus pour sublimer votre intimité
          </p>
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
                        // Voir détails
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

      {/* CTA pour les non-connectés */}
      {!user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="bg-gradient-to-r from-rose-600/20 to-pink-600/20 rounded-2xl p-8 text-center border border-rose-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Accédez à des fonctionnalités exclusives
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Créez un compte gratuit pour enregistrer vos favoris, suivre vos commandes et recevoir nos offres spéciales.
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