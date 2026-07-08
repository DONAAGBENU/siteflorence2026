'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  Package, Users, ShoppingBag, Settings, 
  Upload, Image as ImageIcon, PlusCircle,
  BarChart, Shield, LogOut, Home, TrendingUp,
  ArrowUpRight, Clock, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/app/lib/format';

interface ActivityItem {
  id: string;
  type: 'product' | 'user' | 'order';
  title: string;
  subtitle: string;
  name: string;
  time: string;
}

export default function DashboardPage() {
  const { user, isAdmin, logout, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/auth/login');
    }
  }, [loading, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      // Compter les produits
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Compter les commandes + revenus
      const { data: ordersData, count: orderCount } = await supabase
        .from('orders')
        .select('total_price', { count: 'exact' });

      const totalRevenue = ordersData?.reduce((sum, o) => sum + (o.total_price || 0), 0) || 0;

      // Compter les clients
      const { count: clientCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalProducts: productCount || 0,
        totalUsers: clientCount || 0,
        totalOrders: orderCount || 0,
        revenue: totalRevenue
      });

      // Activité récente — derniers produits ajoutés
      const { data: recentProducts } = await supabase
        .from('products')
        .select('id, name, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      // Activité récente — derniers clients
      const { data: recentClients } = await supabase
        .from('clients')
        .select('id, name, phone, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      // Activité récente — dernières commandes
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('id, client_name, product_name, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      const activities: ActivityItem[] = [
        ...(recentProducts || []).map(p => ({
          id: p.id,
          type: 'product' as const,
          title: 'Nouveau produit ajouté',
          subtitle: p.name,
          name: p.name,
          time: new Date(p.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
        })),
        ...(recentClients || []).map(c => ({
          id: c.id,
          type: 'user' as const,
          title: 'Nouveau client inscrit',
          subtitle: c.phone,
          name: c.name || c.phone,
          time: new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
        })),
        ...(recentOrders || []).map(o => ({
          id: o.id,
          type: 'order' as const,
          title: 'Nouvelle commande',
          subtitle: o.product_name,
          name: o.client_name,
          time: new Date(o.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
        })),
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6);

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <div className="text-white">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const activityIcon = (type: string) => {
    if (type === 'product') return <Package className="h-5 w-5 text-rose-400" />;
    if (type === 'user') return <Users className="h-5 w-5 text-blue-400" />;
    return <ShoppingBag className="h-5 w-5 text-emerald-400" />;
  };

  const activityBg = (type: string) => {
    if (type === 'product') return 'bg-rose-500/20';
    if (type === 'user') return 'bg-blue-500/20';
    return 'bg-emerald-500/20';
  };

  const activityColor = (type: string) => {
    if (type === 'product') return 'text-rose-400';
    if (type === 'user') return 'text-blue-400';
    return 'text-emerald-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between bg-gray-900/90 backdrop-blur-md border-b border-gray-800 px-4 sm:px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400 bg-clip-text text-transparent text-lg">
            Fleur Sucrée
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen w-64 bg-gray-900/95 backdrop-blur-lg border-r border-gray-800 z-40 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white">Admin Panel</h2>
                <p className="text-xs text-gray-400">{user?.phone}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {[
                { href: '/dashboard', icon: BarChart, label: 'Tableau de bord', active: true },
                { href: '/dashboard/products', icon: Package, label: 'Produits' },
                { href: '/dashboard/users', icon: Users, label: 'Utilisateurs' },
                { href: '/dashboard/orders', icon: ShoppingBag, label: 'Commandes' },
                { href: '/dashboard/products/upload', icon: Upload, label: 'Upload images' },
                { href: '/dashboard/settings', icon: Settings, label: 'Paramètres' },
              ].map(({ href, icon: Icon, label, active }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'text-white bg-rose-600/20 border border-rose-500/20'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-2">
            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <Home className="h-5 w-5" />
              Site public
            </Link>
            <Button
              onClick={() => { setSidebarOpen(false); logout(); }}
              variant="outline"
              className="w-full border-rose-500 text-rose-500 hover:bg-rose-500/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 p-4 sm:p-8">
        <div className="max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Bienvenue, {user?.name} 👑
              </h1>
              <p className="text-gray-400">
                Gérez votre boutique Fleur Sucrée depuis ce tableau de bord
              </p>
            </div>
            <button
              onClick={fetchStats}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </button>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: 'Produits', value: stats.totalProducts.toString(),
                icon: Package, color: 'from-rose-600/20 to-pink-600/20', border: 'border-rose-500/20', iconColor: 'text-rose-400',
                href: '/dashboard/products'
              },
              {
                label: 'Clients', value: stats.totalUsers.toString(),
                icon: Users, color: 'from-blue-600/20 to-cyan-600/20', border: 'border-blue-500/20', iconColor: 'text-blue-400',
                href: '/dashboard/users'
              },
              {
                label: 'Commandes', value: stats.totalOrders.toString(),
                icon: ShoppingBag, color: 'from-emerald-600/20 to-green-600/20', border: 'border-emerald-500/20', iconColor: 'text-emerald-400',
                href: '/dashboard/orders'
              },
              {
                label: 'Revenus', value: formatPrice(stats.revenue),
                icon: BarChart, color: 'from-amber-600/20 to-orange-600/20', border: 'border-amber-500/20', iconColor: 'text-amber-400',
                href: '/dashboard/orders'
              },
            ].map(({ label, value, icon: Icon, color, border, iconColor, href }) => (
              <Link key={label} href={href}>
                <div className={`bg-gradient-to-br ${color} rounded-xl p-6 border ${border} hover:scale-[1.02] transition-all cursor-pointer`}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-400 text-sm">{label}</p>
                    <Icon className={`h-8 w-8 ${iconColor}`} />
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {statsLoading ? '...' : value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className={`h-3 w-3 ${iconColor}`} />
                    <span className={`text-xs ${iconColor}`}>Voir tout</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Actions rapides */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/dashboard/products/add"
                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white p-6 rounded-lg flex items-center justify-between transition-all hover:scale-[1.02]"
              >
                <div>
                  <PlusCircle className="h-8 w-8 mb-2" />
                  <h3 className="font-bold">Ajouter un produit</h3>
                  <p className="text-sm text-rose-200">Créer un nouvel élixir</p>
                </div>
                <div className="text-3xl">+</div>
              </Link>

              <Link
                href="/dashboard/products/upload"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-6 rounded-lg flex items-center justify-between transition-all hover:scale-[1.02]"
              >
                <div>
                  <Upload className="h-8 w-8 mb-2" />
                  <h3 className="font-bold">Upload images</h3>
                  <p className="text-sm text-blue-200">Ajouter des photos</p>
                </div>
                <ImageIcon className="h-8 w-8" />
              </Link>

              <Link
                href="/dashboard/orders"
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white p-6 rounded-lg flex items-center justify-between transition-all hover:scale-[1.02]"
              >
                <div>
                  <ShoppingBag className="h-8 w-8 mb-2" />
                  <h3 className="font-bold">Voir commandes</h3>
                  <p className="text-sm text-emerald-200">Gérer les achats</p>
                </div>
                <div className="text-3xl">📦</div>
              </Link>
            </div>
          </div>

          {/* Activité récente LIVE */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Activité récente</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-emerald-400 text-xs font-medium">Live</span>
              </div>
            </div>
            
            {statsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-800/50 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Clock className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>Aucune activité récente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${activityBg(activity.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                        {activityIcon(activity.type)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{activity.title}</p>
                        <p className="text-sm text-gray-400">{activity.subtitle}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" /> {activity.time}
                        </p>
                      </div>
                    </div>
                    <span className={`${activityColor(activity.type)} font-medium text-sm hidden sm:block`}>
                      {activity.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}