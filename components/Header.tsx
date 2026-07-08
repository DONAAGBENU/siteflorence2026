'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { 
  ShoppingBag, Heart, Menu, X, 
  User, LogOut, Settings, Home,
  Shield, Minus, Plus, Trash2, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/app/lib/format';

const WHATSAPP_ADMIN = '+22890582547';

export const Header = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems, items, isCartOpen, toggleCart, closeCart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  const navigation = [
    { name: 'Élixirs', href: '/products' },
    { name: 'Notre Histoire', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    router.push('/');
  };

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;
    const productList = items.map(item =>
      `• ${item.product.name} x${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`
    ).join('\n');
    const message = `Bonjour ! Je voudrais commander :\n\n${productList}\n\nTotal: ${formatPrice(totalPrice)}\n\nNom: ${user?.name || 'Client'}\nTéléphone: ${user?.phone || ''}`;
    const url = `https://wa.me/${WHATSAPP_ADMIN.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-900/95 backdrop-blur-xl shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <Heart className="relative h-9 w-9 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                Fleur Sucrée
              </h1>
              <p className="text-xs text-gray-400">L&apos;excellence sensorielle</p>
            </div>
          </Link>

          {/* Navigation desktop */}
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

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Utilisateur desktop */}
            {user ? (
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="w-7 h-7 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full flex items-center justify-center">
                    {user.role === 'admin' ? (
                      <Shield className="h-4 w-4 text-white" />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span className="text-white text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-gray-800 rounded-xl border border-gray-700 shadow-2xl z-50">
                    <div className="p-2">
                      {isAdmin && (
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Shield className="h-4 w-4" /> Dashboard Admin
                        </Link>
                      )}
                      <Link
                        href="/products"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Home className="h-4 w-4" /> Mes commandes
                      </Link>
                      <hr className="border-gray-700 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all text-sm"
              >
                <User className="h-4 w-4" /> Connexion
              </Link>
            )}

            {/* Panier */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
              aria-label="Panier"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Menu mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white bg-gray-800/50 rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-800 bg-gray-900/98 backdrop-blur-xl px-4 py-4">
            <nav className="space-y-2 mb-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            {user ? (
              <div className="space-y-2 pt-4 border-t border-gray-800">
                {isAdmin && (
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-amber-400 hover:bg-gray-800 rounded-lg">
                    <Shield className="h-4 w-4" /> Dashboard
                  </Link>
                )}
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-gray-800 rounded-lg">
                  <LogOut className="h-4 w-4" /> Déconnexion
                </button>
              </div>
            ) : (
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg font-medium">
                <User className="h-4 w-4" /> Connexion
              </Link>
            )}
          </div>
        )}
      </header>

      {/* ======== CART DRAWER ======== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <div className="relative ml-auto w-full max-w-md bg-gray-900 border-l border-gray-800 shadow-2xl flex flex-col h-full animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-rose-400" />
                <h2 className="text-xl font-bold text-white">Votre Panier</h2>
                {totalItems > 0 && (
                  <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-sm rounded-full font-bold">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <ShoppingBag className="h-16 w-16 text-gray-700 mb-4" />
                  <p className="text-xl font-bold text-gray-400 mb-2">Votre panier est vide</p>
                  <p className="text-gray-500 mb-6">Ajoutez des produits pour commencer</p>
                  <Link
                    href="/products"
                    onClick={closeCart}
                    className="px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-medium hover:from-rose-700 hover:to-pink-700 transition-all"
                  >
                    Voir les produits
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-rose-500/30 transition-colors">
                      {/* Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                        {item.product.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-rose-400" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{item.product.name}</p>
                        <p className="text-rose-400 font-bold text-sm">{formatPrice(item.product.price)}</p>
                        
                        {/* Quantité */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                          >
                            <Minus className="h-3 w-3 text-white" />
                          </button>
                          <span className="text-white font-medium text-sm w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                          >
                            <Plus className="h-3 w-3 text-white" />
                          </button>
                          <span className="ml-auto text-sm font-bold text-white">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>

                      {/* Supprimer */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="flex-shrink-0 p-1.5 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer avec total + commande */}
            {items.length > 0 && (
              <div className="px-6 py-6 border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total</span>
                  <span className="text-2xl font-bold text-white">{formatPrice(totalPrice)}</span>
                </div>
                
                {user ? (
                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Commander via WhatsApp
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={closeCart}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg transition-all"
                  >
                    <User className="h-5 w-5" />
                    Connexion pour commander
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};