'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Edit, Trash2, Eye, Plus,
  Package, Search, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  is_active: boolean;
  created_at: string;
}

export default function ProductsDashboardPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAdmin) {
    router.push('/auth/login');
    return null;
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, category, stock, is_active, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        throw error;
      }

      console.log('Products fetched:', data);
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error.message || error);
      // Afficher une erreur plus spécifique
      alert('Erreur de connexion à la base de données. Vérifiez votre connexion internet ou contactez l\'administrateur.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      console.log('Deleting product:', id);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }
      
      // Rafraîchir la liste
      fetchProducts();
      alert('Produit supprimé avec succès!');
    } catch (error: any) {
      console.error('Error deleting product:', error.message || error);
      alert('Erreur lors de la suppression: ' + (error.message || 'Erreur inconnue'));
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-white">Chargement des produits...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Gestion des produits</h1>
            <p className="text-gray-400">
              {products.length} produit{products.length !== 1 ? 's' : ''} au total
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button
              onClick={() => router.push('/dashboard/products/add')}
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau produit
            </Button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
            />
          </div>
        </div>

        {/* Tableau des produits */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/50">
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-300">Produit</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-300">Catégorie</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-300">Prix</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-300">Stock</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-300">Statut</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-800/30">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{product.name}</p>
                          <p className="text-sm text-gray-400">
                            Créé le {new Date(product.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-lg font-bold text-rose-400">{product.price.toFixed(2)}€</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          product.stock > 50 
                            ? 'bg-green-500/20 text-green-400' 
                            : product.stock > 10
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {product.stock} unités
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.is_active 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {product.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/products/edit/${product.id}`)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/products/${product.id}`)}
                          className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg"
                          title="Voir en détail"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">
              {searchQuery ? 'Aucun produit trouvé' : 'Aucun produit disponible'}
            </p>
            <p className="text-gray-500">
              {searchQuery ? 'Essayez de modifier votre recherche' : 'Commencez par ajouter un produit'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}