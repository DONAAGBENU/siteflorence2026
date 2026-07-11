'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getDashboardOrders, updateDashboardOrderStatus, type DashboardOrder, type DashboardOrderStatus } from '@/lib/dashboard-supabase';

const defaultOrders: DashboardOrder[] = [
  { id: 'ORD-1001', customer: 'Komi', total: 12500, status: 'En attente', date: '2026-07-10' },
  { id: 'ORD-1002', customer: 'Afi', total: 28700, status: 'Confirmée', date: '2026-07-09' },
  { id: 'ORD-1003', customer: 'Mina', total: 6400, status: 'Livrée', date: '2026-07-08' },
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

          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="flex flex-col gap-3 rounded-xl border border-gray-800 bg-gray-800/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-white">{order.id}</p>
                  <p className="text-sm text-gray-400">Client : {order.customer}</p>
                  <p className="text-sm text-gray-400">Date : {order.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-semibold text-emerald-400">{order.total.toLocaleString('fr-FR')} FCFA</p>
                  <select
                    value={order.status}
                    onChange={(event) => updateStatus(order.id, event.target.value as DashboardOrderStatus)}
                    className="rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 outline-none"
                  >
                    <option value="En attente">En attente</option>
                    <option value="Confirmée">Confirmée</option>
                    <option value="Livrée">Livrée</option>
                  </select>
                  <button className="rounded-xl bg-emerald-600 px-3 py-2 text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Valider
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
