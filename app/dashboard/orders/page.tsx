'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  ShoppingBag, Search, ArrowLeft, RefreshCw,
  MessageCircle, Clock, CheckCircle, Truck, XCircle,
  Phone, Filter
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/app/lib/format';

interface Order {
  id: string;
  client_name: string;
  client_phone: string;
  product_name: string;
  product_id: string;
  quantity: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  created_at: string;
  notes?: string;
}

const statusConfig = {
  pending:   { label: 'En attente',  color: 'bg-amber-500/20 text-amber-400',   icon: Clock },
  confirmed: { label: 'Confirmée',   color: 'bg-blue-500/20 text-blue-400',     icon: CheckCircle },
  delivered: { label: 'Livrée',      color: 'bg-emerald-500/20 text-emerald-400', icon: Truck },
  cancelled: { label: 'Annulée',     color: 'bg-red-500/20 text-red-400',       icon: XCircle },
};

function OrdersContent() {
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientFilter = searchParams.get('client');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(clientFilter || '');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !isAdmin) router.push('/auth/login');
  }, [authLoading, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) fetchOrders();
  }, [isAdmin]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleWhatsApp = (phone: string, clientName: string) => {
    const message = `Bonjour ${clientName}, votre commande chez Fleur Sucrée est confirmée ! Merci de votre confiance. 🌹`;
    const url = `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.client_phone?.includes(searchQuery) ||
      order.product_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total_price || 0), 0);

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-bold text-white">Gestion des commandes</h1>
            </div>
            <p className="text-gray-400 ml-8">
              {orders.length} commande{orders.length !== 1 ? 's' : ''} · Revenus: <span className="text-emerald-400 font-bold">{formatPrice(totalRevenue)}</span>
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors text-sm self-start"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher client, produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'all', label: 'Toutes' },
              { id: 'pending', label: 'En attente' },
              { id: 'confirmed', label: 'Confirmées' },
              { id: 'delivered', label: 'Livrées' },
              { id: 'cancelled', label: 'Annulées' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setStatusFilter(id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  statusFilter === id
                    ? 'bg-rose-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-800/50 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">Aucune commande trouvée</p>
            <p className="text-gray-500 mt-2">
              Les commandes apparaîtront ici dès que des clients commandent via WhatsApp
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <div key={order.id} className="bg-gray-800/50 rounded-xl border border-gray-700 p-5 hover:border-rose-500/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Info commande */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-600/20 to-pink-600/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-rose-500/20">
                        <ShoppingBag className="h-6 w-6 text-rose-400" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">{order.product_name}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          <span className="text-gray-400 text-sm flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" /> {order.client_name} · {order.client_phone}
                          </span>
                          <span className="text-gray-500 text-sm">
                            Qté: {order.quantity} · <span className="text-rose-400 font-bold">{formatPrice(order.total_price)}</span>
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(order.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Statut + Actions */}
                    <div className="flex flex-col sm:items-end gap-3">
                      {/* Badge statut */}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${status.color}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {status.label}
                      </span>

                      {/* Changer statut */}
                      <div className="flex flex-wrap gap-1">
                        {order.status !== 'confirmed' && (
                          <button
                            onClick={() => updateStatus(order.id, 'confirmed')}
                            className="px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded text-xs font-medium transition-colors"
                          >
                            Confirmer
                          </button>
                        )}
                        {order.status !== 'delivered' && (
                          <button
                            onClick={() => updateStatus(order.id, 'delivered')}
                            className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded text-xs font-medium transition-colors"
                          >
                            Livré
                          </button>
                        )}
                        {order.status !== 'cancelled' && (
                          <button
                            onClick={() => updateStatus(order.id, 'cancelled')}
                            className="px-2 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-xs font-medium transition-colors"
                          >
                            Annuler
                          </button>
                        )}
                        <button
                          onClick={() => handleWhatsApp(order.client_phone, order.client_name)}
                          className="px-2 py-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <MessageCircle className="h-3 w-3" /> WA
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
