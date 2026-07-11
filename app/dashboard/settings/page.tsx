'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, Save, MessageCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getDashboardSettings, saveDashboardSettings, type DashboardSettings } from '@/lib/dashboard-supabase';

type SettingsForm = {
  shopName: string;
  contactEmail: string;
  whatsapp: string;
  deliveryTime: string;
};

const defaultSettings: SettingsForm = {
  shopName: 'Fleur Sucrée',
  contactEmail: 'contact@fleursucree.com',
  whatsapp: '+22890000000',
  deliveryTime: '24h',
};

export default function SettingsPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<SettingsForm>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace('/auth/login');
      return;
    }

    const loadSettings = async () => {
      const settings = await getDashboardSettings();
      setForm({
        shopName: settings.shop_name || defaultSettings.shopName,
        contactEmail: settings.contact_email || defaultSettings.contactEmail,
        whatsapp: settings.whatsapp || defaultSettings.whatsapp,
        deliveryTime: settings.delivery_time || defaultSettings.deliveryTime,
      });
    };

    loadSettings();
  }, [loading, isAdmin, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const savedSettings = await saveDashboardSettings({
      shop_name: form.shopName,
      contact_email: form.contactEmail,
      whatsapp: form.whatsapp,
      delivery_time: form.deliveryTime,
    });
    setForm({
      shopName: savedSettings.shop_name || form.shopName,
      contactEmail: savedSettings.contact_email || form.contactEmail,
      whatsapp: savedSettings.whatsapp || form.whatsapp,
      deliveryTime: savedSettings.delivery_time || form.deliveryTime,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Chargement...</div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4 sm:p-8 text-white">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-sm text-gray-400">Configuration</p>
            <h1 className="text-3xl font-bold">Paramètres</h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="bg-gray-900/70 rounded-2xl border border-gray-800 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Informations de la boutique</h2>
                <p className="text-sm text-gray-400">Ajustez les valeurs visibles par les clients</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-gray-400">Nom de la boutique</label>
                <input
                  value={form.shopName}
                  onChange={(event) => setForm({ ...form, shopName: event.target.value })}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-400">Email de contact</label>
                <input
                  value={form.contactEmail}
                  onChange={(event) => setForm({ ...form, contactEmail: event.target.value })}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-400">WhatsApp</label>
                <input
                  value={form.whatsapp}
                  onChange={(event) => setForm({ ...form, whatsapp: event.target.value })}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-400">Délai de livraison</label>
                <input
                  value={form.deliveryTime}
                  onChange={(event) => setForm({ ...form, deliveryTime: event.target.value })}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
                />
              </div>
              <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-2 font-semibold text-white">
                <Save className="h-4 w-4" />
                Enregistrer les paramètres
              </button>
              {saved && <p className="text-sm text-emerald-400">Paramètres enregistrés avec succès.</p>}
            </form>
          </section>

          <section className="bg-gray-900/70 rounded-2xl border border-gray-800 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Aperçu rapide</h2>
                <p className="text-sm text-gray-400">Les clients verront ces informations</p>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-gray-800/70 p-4 space-y-3">
              <p className="text-xl font-semibold">{form.shopName}</p>
              <p className="text-sm text-gray-400">Email : {form.contactEmail}</p>
              <p className="text-sm text-gray-400">WhatsApp : {form.whatsapp}</p>
              <p className="text-sm text-gray-400">Livraison : {form.deliveryTime}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
