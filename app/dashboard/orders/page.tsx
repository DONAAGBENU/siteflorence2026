'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, CheckCircle2, MessageCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getDashboardOrders, updateDashboardOrderStatus, type DashboardOrder, type DashboardOrderStatus } from '@/lib/dashboard-supabase';

const defaultOrders: DashboardOrder[] = [
  { id: 'ORD-1001', customer: 'Komi', total: 12500, status: 'En attente', date: '2026-07-10', phone: '+22890123456', address: 'Lomé, Deckon', items: 'Miel Bio Pur (x1)' },
  { id: 'ORD-1002', customer: 'Afi', total: 28700, status: 'Confirmée', date: '2026-07-09', phone: '+22891234567', address: 'Lomé, Totsi', items: 'Huile de Baobab (x1)' },
  { id: 'ORD-1003', customer: 'Mina', total: 6400, status: 'Livrée', date: '2026-07-08', phone: '+22892345678', address: 'Lomé, Adidogomé', items: 'Fruits Secs Bio (x1)' },
];

export default function OrdersPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<DashboardOrder[]>(defaultOrders);
  const [filter, setFilter] = useState<'Tous' | DashboardOrderStatus>('Tous');

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace('/auth/login');
      return;
    }

    const loadOrders = async () => {
      const refreshed = await getDashboardOrders();
      setOrders(refreshed.length > 0 ? refreshed : defaultOrders);
    };

    loadOrders();
  }, [loading, isAdmin, router]);

  const filteredOrders = useMemo(() => {
    if (filter === 'Tous') return orders;
    return orders.filter((order) => order.status === filter);
  }, [filter, orders]);

  const updateStatus = async (id: string, status: DashboardOrderStatus) => {
    const updated = await updateDashboardOrderStatus(id, status);
    if (updated) {
      setOrders((current) => current.map((order) => (order.id === id ? { ...order, status } : order)));
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Chargement...</div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4 sm:p-8 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-sm text-gray-400">Gestion</p>
            <h1 className="text-3xl font-bold">Commandes</h1>
          </div>
        </div>

        <div className="bg-gray-900/70 rounded-2xl border border-gray-800 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Suivi des commandes</h2>
                <p className="text-sm text-gray-400">Mettez à jour le statut en un clic</p>
              </div>
            </div>
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as 'Tous' | DashboardOrderStatus)}
              className="rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
            >
              <option value="Tous">Tous</option>
              <option value="En attente">En attente</option>
              <option value="Confirmée">Confirmée</option>
              <option value="Livrée">Livrée</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="flex flex-col gap-4 rounded-xl border border-gray-800 bg-gray-800/60 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-lg">{order.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      order.status === 'En attente' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      order.status === 'Confirmée' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-gray-300 font-medium">Client : <span className="text-white">{order.customer}</span></p>
                    {order.phone && (
                      <p className="text-sm text-gray-300">Tél : <span className="text-white">{order.phone}</span></p>
                    )}
                    {order.address && (
                      <p className="text-sm text-gray-400">Adresse : <span className="text-gray-300">{order.address}</span></p>
                    )}
                    {order.items && (
                      <p className="text-sm text-gray-400 mt-2 bg-gray-900/50 p-2.5 rounded-lg border border-gray-700/50">
                        📦 <span className="text-gray-200 font-medium">{order.items}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-500 pt-1">Date de commande : {order.date}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 items-end justify-between self-stretch">
                  <p className="text-xl font-bold text-emerald-400">{order.total.toLocaleString('fr-FR')} FCFA</p>
                  
                  <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                    {order.phone && (
                      <a 
                        href={`https://wa.me/${order.phone.replace(/[^0-9+]/g, '')}?text=Bonjour%20${encodeURIComponent(order.customer)},%20concernant%20votre%20commande%20${order.id}...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 px-3 py-2 text-sm flex items-center gap-2 text-white font-medium shadow-md shadow-emerald-950/20"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </a>
                    )}
                    
                    <select
                      value={order.status}
                      onChange={(event) => updateStatus(order.id, event.target.value as DashboardOrderStatus)}
                      className="rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none text-white cursor-pointer"
                    >
                      <option value="En attente">En attente</option>
                      <option value="Confirmée">Confirmée</option>
                      <option value="Livrée">Livrée</option>
                    </select>

                    <button 
                      onClick={() => updateStatus(order.id, 'Confirmée')}
                      disabled={order.status === 'Confirmée' || order.status === 'Livrée'}
                      className="rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:hover:bg-rose-600 px-3 py-2 text-sm flex items-center gap-1.5 font-medium transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Valider
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
