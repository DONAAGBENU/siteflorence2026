'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/components/CartContext';
import { 
  ShoppingBag, Heart, Menu, X, 
  User, LogOut, Settings, Home,
  Shield, ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Header = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  const navigation = [
    { name: 'Élixirs', href: '/products' },
    { name: 'Expériences', href: '/experiences' },
    { name: 'Notre Histoire', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-900/95 backdrop-blur-xl shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        {/* Logo du premier code avec design amélioré du deuxième */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
            <Heart className="relative h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              Fleur Sucrée
            </h1>
            <p className="text-xs text-gray-400">L&apos;excellence sensorielle</p>
          </div>
        </Link>

        {/* Navigation desktop - du deuxième code */}
        <nav className="hidden lg:flex items-center gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative px-4 py-2 text-gray-300 hover:text-white font-medium group transition-colors"
            >
              <span className="relative z-10">{item.name}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600/10 to-pink-600/10 rounded-lg transform scale-0 group-hover:scale-100 transition-transform"></div>
            </Link>
          ))}
        </nav>

        {/* Actions - Fusion des deux codes */}
        <div className="flex items-center gap-4">
          {/* Menu utilisateur - du deuxième code */}
          {user ? (
            <div className="relative hidden lg:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full flex items-center justify-center">
                  {user.role === 'admin' ? (
                    <Shield className="h-4 w-4 text-white" />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
                <span className="text-sm text-gray-300 hidden md:inline">
                  {user.name}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.phone}</p>
                    {isAdmin && (
                      <div className="inline-flex items-center gap-1 mt-1 px-2 py-1 bg-rose-500/20 rounded-full">
                        <Shield className="h-3 w-3 text-rose-400" />
                        <span className="text-xs text-rose-400">Administrateur</span>
                      </div>
                    )}
                  </div>
                  
                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Mon profil
                  </Link>
                  
                  {isAdmin && (
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Tableau de bord
                    </Link>
                  )}
                  
                  <Link
                    href="/"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    <Home className="h-4 w-4" />
                    Accueil
                  </Link>
                  
                  <div className="border-t border-gray-800 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="outline" className="border-gray-700 text-gray-300">
                  Connexion
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
                  Inscription
                </Button>
              </Link>
            </div>
          )}

          {/* Boutons d'actions - fusion des deux codes */}
          <div className="flex items-center gap-3">
            {/* Favoris - du premier code */}
            <button className="text-gray-600 hover:text-rose-400 transition-colors relative hidden md:block">
              <Heart size={24} />
            </button>

            {/* Panier - fusion des deux codes */}
            <button
              onClick={toggleCart}
              className="relative group bg-gradient-to-r from-rose-600 to-pink-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden md:inline">Panier</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-rose-700 text-sm font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Menu mobile - du deuxième code */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-gray-300" />
            ) : (
              <Menu className="h-5 w-5 text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile - du deuxième code */}
      {mobileMenuOpen && (
        <div className="lg:hidden pb-4 px-4 border-t border-gray-800 pt-4">
          <div className="flex flex-col gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Options mobile pour utilisateur non connecté */}
            {!user && (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Inscription
                </Link>
              </>
            )}

            {/* Options mobile pour utilisateur connecté */}
            {user && (
              <>
                <div className="px-4 py-3 border-b border-gray-800">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.phone}</p>
                </div>
                <Link
                  href="/profile"
                  className="px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mon profil
                </Link>
                {isAdmin && (
                  <Link
                    href="/dashboard"
                    className="px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tableau de bord
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors text-left"
                >
                  Déconnexion
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};