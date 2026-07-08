'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  Settings, Moon, Sun, Globe, ArrowLeft, CheckCircle, Save
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

export default function SettingsPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) router.push('/auth/login');
  }, [authLoading, isAdmin, router]);

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-white">Paramètres</h1>
          </div>
          <p className="text-gray-400 ml-8">Personnalisez l&apos;apparence et la langue du tableau de bord</p>
        </div>

        <div className="space-y-6">
          {/* Thème */}
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5 text-rose-400" />
              ) : (
                <Sun className="h-5 w-5 text-amber-400" />
              )}
              <h2 className="text-lg font-bold text-white">Thème de l&apos;interface</h2>
            </div>
            <p className="text-gray-400 text-sm mb-4">Choisissez le thème qui vous convient le mieux</p>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Sombre */}
              <button
                onClick={() => setTheme('dark')}
                className={`relative p-5 rounded-xl border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-rose-500 bg-rose-500/10'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-900/50'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-10 bg-gray-950 rounded-lg border border-gray-800 flex items-center justify-center">
                    <Moon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">Sombre</p>
                    <p className="text-gray-400 text-xs">Mode nuit</p>
                  </div>
                  {theme === 'dark' && (
                    <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-rose-400" />
                  )}
                </div>
              </button>

              {/* Clair */}
              <button
                onClick={() => setTheme('light')}
                className={`relative p-5 rounded-xl border-2 transition-all ${
                  theme === 'light'
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-900/50'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-10 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                    <Sun className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">Clair</p>
                    <p className="text-gray-400 text-xs">Mode jour</p>
                  </div>
                  {theme === 'light' && (
                    <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-amber-400" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Langue */}
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-bold text-white">Langue de l&apos;interface</h2>
            </div>
            <p className="text-gray-400 text-sm mb-4">Sélectionnez la langue d&apos;affichage</p>

            <div className="grid grid-cols-2 gap-4">
              {/* Français */}
              <button
                onClick={() => setLanguage('fr')}
                className={`relative p-5 rounded-xl border-2 transition-all ${
                  language === 'fr'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-900/50'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="text-3xl">🇫🇷</div>
                  <div className="text-center">
                    <p className="text-white font-semibold">Français</p>
                    <p className="text-gray-400 text-xs">French</p>
                  </div>
                  {language === 'fr' && (
                    <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-blue-400" />
                  )}
                </div>
              </button>

              {/* English */}
              <button
                onClick={() => setLanguage('en')}
                className={`relative p-5 rounded-xl border-2 transition-all ${
                  language === 'en'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-900/50'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="text-3xl">🇬🇧</div>
                  <div className="text-center">
                    <p className="text-white font-semibold">English</p>
                    <p className="text-gray-400 text-xs">Anglais</p>
                  </div>
                  {language === 'en' && (
                    <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-blue-400" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* À propos */}
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Informations</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Version</span>
                <span className="text-white font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">WhatsApp Admin</span>
                <span className="text-white font-medium">+22890582547</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Devise</span>
                <span className="text-white font-medium">FCFA (Franc CFA)</span>
              </div>
            </div>
          </div>

          {/* Sauvegarder */}
          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all ${
              saved
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white hover:scale-[1.01]'
            }`}
          >
            {saved ? (
              <>
                <CheckCircle className="h-5 w-5" />
                Paramètres sauvegardés !
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Sauvegarder les paramètres
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
