'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  Package, Users, ShoppingBag, Settings, 
  Upload, Image as ImageIcon, PlusCircle,
  BarChart, Shield, LogOut, Home
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { user, isAdmin, logout, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0
  });

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/auth/login');
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900/80 backdrop-blur-lg border-r border-gray-800">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">Admin Panel</h2>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-white bg-rose-600/20 rounded-lg"
            >
              <BarChart className="h-5 w-5" />
              Tableau de bord
            </Link>
            <Link
              href="/dashboard/products"
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <Package className="h-5 w-5" />
              Produits
            </Link>
            <Link
              href="/dashboard/users"
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <Users className="h-5 w-5" />
              Utilisateurs
            </Link>
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              Commandes
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <Settings className="h-5 w-5" />
              Paramètres
            </Link>
          </nav>

          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <Home className="h-5 w-5" />
              Site public
            </Link>
            <Button
              onClick={logout}
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
      <div className="ml-64 p-8">
        <div className="max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Bienvenue, {user?.name} 👑
            </h1>
            <p className="text-gray-400">
              Gérez votre boutique Fleur Sucrée depuis ce tableau de bord
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-rose-600/20 to-pink-600/20 rounded-xl p-6 border border-rose-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Produits</p>
                  <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
                </div>
                <Package className="h-10 w-10 text-rose-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl p-6 border border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Utilisateurs</p>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <Users className="h-10 w-10 text-blue-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 rounded-xl p-6 border border-emerald-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Commandes</p>
                  <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
                </div>
                <ShoppingBag className="h-10 w-10 text-emerald-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-xl p-6 border border-amber-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Revenus</p>
                  <p className="text-3xl font-bold text-white">{stats.revenue}€</p>
                </div>
                <BarChart className="h-10 w-10 text-amber-400" />
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/dashboard/products/add"
                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white p-6 rounded-lg flex items-center justify-between transition-all hover:scale-105"
              >
                <div>
                  <PlusCircle className="h-8 w-8 mb-2" />
                  <h3 className="font-bold">Ajouter un produit</h3>
                  <p className="text-sm text-rose-200">Créer un nouvel produit</p>
                </div>
                <div className="text-3xl">+</div>
              </Link>

              <Link
                href="/dashboard/products/upload"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-6 rounded-lg flex items-center justify-between transition-all hover:scale-105"
              >
                <div>
                  <Upload className="h-8 w-8 mb-2" />
                  <h3 className="font-bold">Upload images</h3>
                  <p className="text-sm text-blue-200">Ajouter des photos</p>
                </div>
                <div className="text-3xl">
                  <ImageIcon className="h-8 w-8" />
                </div>
              </Link>

              <Link
                href="/dashboard/orders"
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white p-6 rounded-lg flex items-center justify-between transition-all hover:scale-105"
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

          {/* Recent activity */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Activité récente</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-rose-500/20 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Nouveau produit ajouté</p>
                    <p className="text-sm text-gray-400">Il y a 2 heures</p>
                  </div>
                </div>
                <span className="text-rose-400 font-medium">Élixir Passion</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Nouvel utilisateur</p>
                    <p className="text-sm text-gray-400">Il y a 5 heures</p>
                  </div>
                </div>
                <span className="text-blue-400 font-medium">Marie Dupont</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}