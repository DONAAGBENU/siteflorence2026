'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export type UserRole = 'admin' | 'client';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (phone: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  updateProfile: (data: { name?: string; password?: string; avatar?: string }) => Promise<void>;
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

  // Initialiser les admins
  const adminUsers = [
    { phone: '+22897852652', password: 'FLORENCE12345', name: 'FLORENCE', role: 'admin' as UserRole }
  ];

  useEffect(() => {
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      await checkUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      // Vérifier les cookies d'abord (pour les sessions simulées)
      const isAdmin = document.cookie.includes('is_admin=1');
      const adminPhone = getCookie('admin_phone');
      const isClient = document.cookie.includes('is_client=1');
      const clientPhone = getCookie('client_phone');
      
      if (isAdmin && adminPhone) {
        const adminUser = adminUsers.find(u => u.phone === adminPhone);
        if (adminUser) {
          setUser({
            id: `admin-${Date.now()}`,
            phone: adminUser.phone,
            name: adminUser.name,
            role: 'admin',
            createdAt: new Date()
          });
          setLoading(false);
          return;
        }
      }
      
      if (isClient && clientPhone) {
        const clientName = getCookie('client_name') || clientPhone;
        setUser({
          id: `client-${Date.now()}`,
          phone: decodeURIComponent(clientPhone),
          name: decodeURIComponent(clientName),
          role: 'client',
          createdAt: new Date()
        });
        setLoading(false);
        return;
      }

      // Vérifier session Supabase (si utilisée plus tard)
      const session = await supabase.auth.getSession();
      if (session.data.session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.data.session.user.id)
          .single();

        if (profile) {
          setUser({
            id: profile.id,
            phone: profile.phone,
            name: profile.name,
            role: profile.role,
            avatar: profile.avatar,
            createdAt: new Date(profile.created_at)
          });
        }
      }
    } catch (error) {
      console.error('Erreur vérification utilisateur:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone: string, password: string) => {
    setLoading(true);
    try {
      const cleanPhone = phone.trim();
      
      // Vérifier si c'est un admin
      const adminUser = adminUsers.find(u => u.phone === cleanPhone && u.password === password);

      if (adminUser) {
        // Admin
        const admin: User = {
          id: `admin-${Date.now()}`,
          phone: adminUser.phone,
          name: adminUser.name,
          role: 'admin',
          createdAt: new Date()
        };

        setUser(admin);
        setCookie('is_admin', '1', 24);
        setCookie('admin_phone', encodeURIComponent(adminUser.phone), 24);
        router.push('/dashboard');
      } else {
        // Client
        const clientUser: User = {
          id: `client-${Date.now()}`,
          phone: cleanPhone,
          name: cleanPhone,
          role: 'client',
          createdAt: new Date()
        };

        setUser(clientUser);
        setCookie('is_client', '1', 24);
        setCookie('client_phone', encodeURIComponent(cleanPhone), 24);
        setCookie('client_name', encodeURIComponent(cleanPhone), 24);
        router.push('/products');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const register = async (phone: string, password: string, name: string) => {
    setLoading(true);
    try {
      const cleanPhone = phone.trim();
      
      if (!cleanPhone.startsWith('+')) {
        throw new Error('Le numéro doit commencer par + (ex: +228XXXXXXXXX)');
      }

      // Créer l'utilisateur client
      const clientUser: User = {
        id: `client-${Date.now()}`,
        phone: cleanPhone,
        name: name || cleanPhone,
        role: 'client',
        createdAt: new Date()
      };

      setUser(clientUser);
      setCookie('is_client', '1', 24);
      setCookie('client_phone', encodeURIComponent(cleanPhone), 24);
      setCookie('client_name', encodeURIComponent(name || cleanPhone), 24);
      setCookie('client_password', encodeURIComponent(password), 24);
      
      // Rediriger directement vers /products
      router.push('/products');
      
    } catch (error: any) {
      throw new Error(error.message || 'Erreur d\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: { name?: string; password?: string; avatar?: string }): Promise<void> => {
    try {
      if (data.name && user) {
        setCookie('client_name', encodeURIComponent(data.name), 24);
        
        // Mettre à jour l'état local
        setUser({
          ...user,
          name: data.name,
          avatar: data.avatar || user.avatar
        });
      }
      
      if (data.password) {
        setCookie('client_password', encodeURIComponent(data.password), 24);
      }
      
      if (data.avatar && user && !data.name) {
        setUser({
          ...user,
          avatar: data.avatar
        });
      }
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour');
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      deleteCookie('is_admin');
      deleteCookie('admin_phone');
      deleteCookie('is_client');
      deleteCookie('client_phone');
      deleteCookie('client_name');
      deleteCookie('client_password');
      router.push('/auth/login');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  // Fonctions utilitaires pour les cookies
  const setCookie = (name: string, value: string, hours: number) => {
    const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  };

  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue || null;
    }
    return null;
  };

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAdmin,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};