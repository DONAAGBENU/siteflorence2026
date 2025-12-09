'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export type UserRole = 'admin' | 'client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialiser les admins (emails et mots de passe fournis)
  const adminUsers = [
    { email: 'donaagbenu2000@gmail.com', password: 'AGBENUDONATIEN2000', name: 'Donatien Admin', role: 'admin' as UserRole },
    { email: 'agbagnof@gmail.com', password: 'FLORENCE12345', name: 'Florence Admin', role: 'admin' as UserRole }
  ];

  useEffect(() => {
    // Vérifier la session au chargement
    const checkUser = async () => {
      try {
        const session = await supabase.auth.getSession();
        
        if (session.data.session?.user) {
          // Récupérer les infos utilisateur depuis la table profiles
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.data.session.user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              name: profile.name,
              role: profile.role,
              avatar: profile.avatar,
              createdAt: new Date(profile.created_at)
            });
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
            avatar: profile.avatar,
            createdAt: new Date(profile.created_at)
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Vérifier si c'est un admin
      const adminUser = adminUsers.find(u => u.email === email && u.password === password);

      if (adminUser) {
        // Simuler la connexion admin en local (on ne force pas supabase)
        const admin: User = {
          id: `admin-${Date.now()}`,
          email: adminUser.email,
          name: adminUser.name,
          role: 'admin',
          createdAt: new Date()
        };

        setUser(admin);
        // Définir un cookie non-httpOnly pour que le middleware (côté serveur)
        // puisse reconnaître l'admin lors des requêtes vers les routes protégées.
        try {
          document.cookie = `is_admin=1; max-age=${60 * 60}; path=/`;
          document.cookie = `admin_email=${encodeURIComponent(adminUser.email)}; max-age=${60 * 60}; path=/`;
        } catch (e) {
          // ignore in non-browser env
        }
        router.push('/dashboard');
      } else {
        // Pour les clients : accepter n'importe quel email/mot de passe et créer une session locale
        const clientUser: User = {
          id: `guest-${Date.now()}`,
          email,
          name: email.split('@')[0],
          role: 'client',
          createdAt: new Date()
        };

        setUser(clientUser);
        router.push('/products');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (response.error) throw response.error;

      if (response.data.user) {
        // Créer le profil utilisateur
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: response.data.user.id,
            email,
            name,
            role: 'client',
            created_at: new Date().toISOString()
          });

        if (profileError) throw profileError;

        router.push('/auth/login?registered=true');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Erreur d\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      try {
        document.cookie = 'is_admin=; max-age=0; path=/';
        document.cookie = 'admin_email=; max-age=0; path=/';
      } catch (e) {}
      router.push('/auth/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};