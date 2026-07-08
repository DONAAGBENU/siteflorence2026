'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  Users, Search, Phone, MessageCircle, 
  ArrowLeft, Calendar, ShoppingBag, RefreshCw,
  UserCheck, Shield
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Client {
  id: string;
  name: string;
  phone: string;
  created_at: string;
  order_count?: number;
}

export default function UsersPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !isAdmin) router.push('/auth/login');
  }, [authLoading, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) fetchClients();
  }, [isAdmin]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Compter les commandes par client
      const clientsWithOrders = await Promise.all(
        (data || []).map(async (client) => {
          const { count } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('client_phone', client.phone);
          return { ...client, order_count: count || 0 };
        })
      );

      setClients(clientsWithOrders);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone?.includes(searchQuery)
  );

  const handleWhatsApp = (phone: string, name: string) => {
    const message = `Bonjour ${name}, nous vous contactons de la boutique Fleur Sucrée. Comment pouvons-nous vous aider ?`;
    const url = `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-bold text-white">Gestion des clients</h1>
            </div>
            <p className="text-gray-400 ml-8">
              {clients.length} client{clients.length !== 1 ? 's' : ''} enregistré{clients.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={fetchClients}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
        </div>

        {/* Recherche */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>
        </div>

        {/* Tableau */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-800/50 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-20">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">
              {searchQuery ? 'Aucun client trouvé' : 'Aucun client enregistré'}
            </p>
            <p className="text-gray-500 mt-2">
              {searchQuery ? 'Modifiez votre recherche' : 'Les clients apparaîtront ici lorsqu\'ils s\'inscriront'}
            </p>
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900/50">
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-300">Client</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-300">Téléphone</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-300">Inscription</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-300">Commandes</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <UserCheck className="h-5 w-5 text-white" />
                          </div>
                          <p className="font-medium text-white">{client.name || 'Sans nom'}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">{client.phone}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Calendar className="h-4 w-4" />
                          {new Date(client.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          (client.order_count || 0) > 0
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {client.order_count} commande{(client.order_count || 0) > 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleWhatsApp(client.phone, client.name)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors text-xs font-medium"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            WhatsApp
                          </button>
                          <Link
                            href={`/dashboard/orders?client=${client.phone}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors text-xs font-medium"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            Commandes
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
