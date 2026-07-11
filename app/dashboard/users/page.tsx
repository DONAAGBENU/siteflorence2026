'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, ShieldCheck, UserPlus, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createDashboardUser, getDashboardUsers, type DashboardUser, type DashboardUserRole } from '@/lib/dashboard-supabase';

const defaultUsers: DashboardUser[] = [
  {
    id: '1',
    name: 'FLORENCE',
    phone: '+22897852652',
    role: 'admin',
    status: 'Actif',
  },
  {
    id: '2',
    name: 'Komi',
    phone: '+22890000001',
    role: 'client',
    status: 'Actif',
  },
  {
    id: '3',
    name: 'Afi',
    phone: '+22890000002',
    role: 'client',
    status: 'En attente',
  },
];

export default function UsersPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<DashboardUser[]>(defaultUsers);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', role: 'client' as DashboardUserRole });

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace('/auth/login');
      return;
    }

    const loadUsers = async () => {
      const refreshed = await getDashboardUsers();
      setUsers(refreshed.length > 0 ? refreshed : defaultUsers);
    };

    loadUsers();
  }, [loading, isAdmin, router]);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase();
    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    });
  }, [search, users]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;

    const created = await createDashboardUser({
      name: form.name.trim(),
      phone: form.phone.trim(),
      role: form.role,
      status: 'Actif',
    });

    setUsers((current) => [created, ...current]);
    setForm({ name: '', phone: '', role: 'client' });
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Chargement...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4 sm:p-8 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-sm text-gray-400">Gestion</p>
            <h1 className="text-3xl font-bold">Utilisateurs</h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="bg-gray-900/70 rounded-2xl border border-gray-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold">Liste des utilisateurs</h2>
                  <p className="text-sm text-gray-400">Recherche et suivi rapide</p>
                </div>
              </div>
              <span className="text-sm text-gray-400">{filteredUsers.length} résultats</span>
            </div>

            <label className="flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800/70 px-3 py-2 mb-4">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un utilisateur"
                className="w-full bg-transparent outline-none text-sm"
              />
            </label>

            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-800/60 p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white">{user.name}</p>
                      {user.role === 'admin' && <ShieldCheck className="h-4 w-4 text-amber-400" />}
                    </div>
                    <p className="text-sm text-gray-400">{user.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-300">{user.role === 'admin' ? 'Admin' : 'Client'}</p>
                    <p className="text-xs text-emerald-400">{user.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gray-900/70 rounded-2xl border border-gray-800 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Ajouter un utilisateur</h2>
                <p className="text-sm text-gray-400">Créer un accès rapide</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-gray-400">Nom</label>
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
                  placeholder="Nom complet"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-400">Téléphone</label>
                <input
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
                  placeholder="+228XXXXXXXX"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-400">Rôle</label>
                <select
                  value={form.role}
                  onChange={(event) => setForm({ ...form, role: event.target.value as DashboardUserRole })}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 font-semibold text-white">
                Enregistrer l’utilisateur
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
