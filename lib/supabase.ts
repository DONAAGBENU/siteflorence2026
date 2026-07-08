import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseKey.length > 20
);

const createFallbackClient = (): SupabaseClient => {
  const fallbackResponse = {
    data: null,
    error: { message: 'Supabase is not configured.' }
  };

  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === 'auth') {
          return {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({
              data: { subscription: { unsubscribe: () => undefined } }
            }),
            signOut: async () => ({ error: null }),
            signInWithPassword: async () => ({
              data: { user: null, session: null },
              error: { message: 'Supabase is not configured.' }
            })
          };
        }

        if (prop === 'storage') {
          return {
            from: () => ({
              upload: async () => fallbackResponse,
              getPublicUrl: () => ({ data: { publicUrl: '' } })
            })
          };
        }

        if (prop === 'from') {
          return () => ({
            select: async () => ({ data: [], error: null }),
            insert: async () => ({ data: [], error: null }),
            update: async () => ({ data: [], error: null }),
            delete: async () => ({ data: [], error: null })
          });
        }

        return () => undefined;
      }
    }
  ) as unknown as SupabaseClient;
};

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : createFallbackClient();

export const isSupabaseAvailable = isSupabaseConfigured;

export default supabase;