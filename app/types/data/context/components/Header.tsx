'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Heart, Menu, X, Instagram, Facebook 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();

  const navigation = [
    { name: 'Élixirs', href: '/products' },
    { name: 'Expériences', href: '/experiences' },
    { name: 'Sur Mesure', href: '/custom' },
    { name: 'Univers', href: '/universe' },
    { name: 'Conciergerie', href: '/concierge' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-900/95 backdrop-blur-xl shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <Heart className="relative h-10 w-10 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                  Fleurure Sucrée
                </h1>
                <p className="text-xs text-gray-400">L&apos;excellence sensorielle</p>
              </div>
            </Link>
          </div>

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
          <div className="flex items-center gap-4">
            {/* Menu mobile */}
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

            {/* Panier */}
            <Button
              onClick={toggleCart}
              className="relative"
            >
              <ShoppingBag className="h-5 w-5" />
              Panier
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-rose-700 text-sm font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4">
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
              <div className="flex gap-4 px-4 pt-4">
                <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};