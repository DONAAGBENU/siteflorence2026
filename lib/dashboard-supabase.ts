import { supabase, isSupabaseAvailable } from '@/lib/supabase';

export type DashboardUserRole = 'admin' | 'client';
export type DashboardUserStatus = 'Actif' | 'En attente' | 'Bloqué';

export type DashboardUser = {
  id: string;
  name: string;
  phone: string;
  role: DashboardUserRole;
  status: DashboardUserStatus;
  created_at?: string;
  updated_at?: string;
};

export type DashboardOrderStatus = 'En attente' | 'Confirmée' | 'Livrée';

export type DashboardOrder = {
  id: string;
  customer: string;
  total: number;
  status: DashboardOrderStatus;
  date: string;
  phone?: string;
  address?: string;
  items?: string;
  created_at?: string;
  updated_at?: string;
};

export type DashboardSettings = {
  id: string;
  shop_name: string;
  contact_email: string;
  whatsapp: string;
  delivery_time: string;
  updated_at?: string;
};

const STORAGE_KEYS = {
  users: 'dashboard-users',
  orders: 'dashboard-orders',
  settings: 'dashboard-settings',
};

const readLocalStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeLocalStorage = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const buildUserPayload = (user: Partial<DashboardUser>) => ({
  name: user.name,
  phone: user.phone,
  role: user.role,
  status: user.status,
});

const buildOrderPayload = (order: Partial<DashboardOrder>) => ({
  customer: order.customer,
  total: order.total,
  status: order.status,
  date: order.date,
  phone: order.phone,
  address: order.address,
  items: order.items,
});

export const getDashboardUsers = async (): Promise<DashboardUser[]> => {
  if (!isSupabaseAvailable) {
    return readLocalStorage<DashboardUser[]>(STORAGE_KEYS.users, []);
  }

  try {
    const { data, error } = await supabase
      .from('dashboard_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const users = (data || []) as DashboardUser[];
    writeLocalStorage(STORAGE_KEYS.users, users);
    return users;
  } catch {
    return readLocalStorage<DashboardUser[]>(STORAGE_KEYS.users, []);
  }
};

export const createDashboardUser = async (user: Partial<DashboardUser>): Promise<DashboardUser> => {
  const fallback: DashboardUser = {
    id: `${Date.now()}`,
    name: user.name || 'Nouvel utilisateur',
    phone: user.phone || '',
    role: (user.role as DashboardUserRole) || 'client',
    status: (user.status as DashboardUserStatus) || 'Actif',
  };

  if (!isSupabaseAvailable) {
    const current = readLocalStorage<DashboardUser[]>(STORAGE_KEYS.users, []);
    const next = [fallback, ...current];
    writeLocalStorage(STORAGE_KEYS.users, next);
    return fallback;
  }

  try {
    const { data, error } = await supabase.from('dashboard_users').insert(buildUserPayload(fallback)).select('*').single();

    if (error) throw error;
    const created = data as DashboardUser;
    const current = readLocalStorage<DashboardUser[]>(STORAGE_KEYS.users, []);
    writeLocalStorage(STORAGE_KEYS.users, [created, ...current]);
    return created;
  } catch {
    const current = readLocalStorage<DashboardUser[]>(STORAGE_KEYS.users, []);
    const next = [fallback, ...current];
    writeLocalStorage(STORAGE_KEYS.users, next);
    return fallback;
  }
};

export const getDashboardOrders = async (): Promise<DashboardOrder[]> => {
  if (!isSupabaseAvailable) {
    return readLocalStorage<DashboardOrder[]>(STORAGE_KEYS.orders, []);
  }

  try {
    const { data, error } = await supabase
      .from('dashboard_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const orders = (data || []) as DashboardOrder[];
    writeLocalStorage(STORAGE_KEYS.orders, orders);
    return orders;
  } catch {
    return readLocalStorage<DashboardOrder[]>(STORAGE_KEYS.orders, []);
  }
};

export const createDashboardOrder = async (order: Partial<DashboardOrder>): Promise<DashboardOrder> => {
  const fallback: DashboardOrder = {
    id: `ORD-${Date.now()}`,
    customer: order.customer || 'Client Anonyme',
    total: order.total || 0,
    status: (order.status as DashboardOrderStatus) || 'En attente',
    date: order.date || new Date().toISOString().split('T')[0],
    phone: order.phone || '',
    address: order.address || '',
    items: order.items || '',
  };

  if (!isSupabaseAvailable) {
    const current = readLocalStorage<DashboardOrder[]>(STORAGE_KEYS.orders, []);
    const next = [fallback, ...current];
    writeLocalStorage(STORAGE_KEYS.orders, next);
    return fallback;
  }

  try {
    const { data, error } = await supabase.from('dashboard_orders').insert(buildOrderPayload(order)).select('*').single();

    if (error) throw error;
    const created = data as DashboardOrder;
    const current = readLocalStorage<DashboardOrder[]>(STORAGE_KEYS.orders, []);
    writeLocalStorage(STORAGE_KEYS.orders, [created, ...current]);
    return created;
  } catch (err) {
    console.error('Error creating dashboard order in Supabase:', err);
    const current = readLocalStorage<DashboardOrder[]>(STORAGE_KEYS.orders, []);
    const next = [fallback, ...current];
    writeLocalStorage(STORAGE_KEYS.orders, next);
    return fallback;
  }
};

export const updateDashboardOrderStatus = async (id: string, status: DashboardOrderStatus): Promise<DashboardOrder | null> => {
  if (!isSupabaseAvailable) {
    const current = readLocalStorage<DashboardOrder[]>(STORAGE_KEYS.orders, []);
    const next = current.map((order) => (order.id === id ? { ...order, status } : order));
    writeLocalStorage(STORAGE_KEYS.orders, next);
    return next.find((order) => order.id === id) || null;
  }

  try {
    const { data, error } = await supabase.from('dashboard_orders').update({ status }).eq('id', id).select('*').single();

    if (error) throw error;
    const current = readLocalStorage<DashboardOrder[]>(STORAGE_KEYS.orders, []);
    const next = current.map((order) => (order.id === id ? { ...order, status } : order));
    writeLocalStorage(STORAGE_KEYS.orders, next);
    return data as DashboardOrder;
  } catch {
    const current = readLocalStorage<DashboardOrder[]>(STORAGE_KEYS.orders, []);
    const next = current.map((order) => (order.id === id ? { ...order, status } : order));
    writeLocalStorage(STORAGE_KEYS.orders, next);
    return next.find((order) => order.id === id) || null;
  }
};

export const getDashboardSettings = async (): Promise<DashboardSettings> => {
  if (!isSupabaseAvailable) {
    return readLocalStorage<DashboardSettings>(STORAGE_KEYS.settings, {
      id: 'main',
      shop_name: 'Fleur Sucrée',
      contact_email: 'contact@fleursucree.com',
      whatsapp: '+22890000000',
      delivery_time: '24h',
    });
  }

  try {
    const { data, error } = await supabase.from('dashboard_settings').select('*').eq('id', 'main').maybeSingle();

    if (error) throw error;

    if (data) {
      writeLocalStorage(STORAGE_KEYS.settings, data);
      return data as DashboardSettings;
    }

    const fallback = {
      id: 'main',
      shop_name: 'Fleur Sucrée',
      contact_email: 'contact@fleursucree.com',
      whatsapp: '+22890000000',
      delivery_time: '24h',
    };
    writeLocalStorage(STORAGE_KEYS.settings, fallback);
    return fallback;
  } catch {
    return readLocalStorage<DashboardSettings>(STORAGE_KEYS.settings, {
      id: 'main',
      shop_name: 'Fleur Sucrée',
      contact_email: 'contact@fleursucree.com',
      whatsapp: '+22890000000',
      delivery_time: '24h',
    });
  }
};

export const saveDashboardSettings = async (settings: Partial<DashboardSettings>): Promise<DashboardSettings> => {
  const payload = {
    id: 'main',
    shop_name: settings.shop_name || 'Fleur Sucrée',
    contact_email: settings.contact_email || 'contact@fleursucree.com',
    whatsapp: settings.whatsapp || '+22890000000',
    delivery_time: settings.delivery_time || '24h',
  };

  if (!isSupabaseAvailable) {
    writeLocalStorage(STORAGE_KEYS.settings, payload);
    return payload;
  }

  try {
    const { data, error } = await supabase.from('dashboard_settings').upsert(payload, { onConflict: 'id' }).select('*').single();

    if (error) throw error;
    writeLocalStorage(STORAGE_KEYS.settings, data);
    return data as DashboardSettings;
  } catch {
    writeLocalStorage(STORAGE_KEYS.settings, payload);
    return payload;
  }
};

export const getDashboardStats = async () => {
  const [users, orders] = await Promise.all([getDashboardUsers(), getDashboardOrders()]);
  const totalProducts = 12;
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  return {
    totalProducts,
    totalUsers: users.length,
    totalOrders: orders.length,
    revenue,
  };
};
