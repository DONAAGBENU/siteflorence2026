-- ==========================================
-- SUPABASE SCHEMA INITIALIZATION SCRIPT
-- ==========================================
-- Paste this entire script into your Supabase SQL Editor and run it.

-- ------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    phone TEXT,
    name TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'client')),
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only"
ON public.profiles FOR INSERT
WITH CHECK (true);


-- ------------------------------------------
-- 2. TRIGGER FOR NEW USERS (AUTH.USERS -> PUBLIC.PROFILES)
-- ------------------------------------------
-- Automatically creates a profile entry when a new user registers in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, phone, name, role)
  VALUES (
    new.id,
    new.phone,
    COALESCE(new.raw_user_meta_data->>'name', ''),
    'client'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ------------------------------------------
-- 3. PRODUCTS TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    category TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    rating NUMERIC DEFAULT 4.5,
    ingredients TEXT[] DEFAULT '{}'::text[],
    images TEXT[] DEFAULT '{}'::text[],
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public access to active products" ON public.products;
DROP POLICY IF EXISTS "Allow anonymous read all" ON public.products;
DROP POLICY IF EXISTS "Allow anonymous insert products" ON public.products;
DROP POLICY IF EXISTS "Allow anonymous update products" ON public.products;
DROP POLICY IF EXISTS "Allow anonymous delete products" ON public.products;

-- Create policies for products
-- Since the admin dashboard uses cookie-based auth, browser calls are anonymous.
-- We must allow anon operations or define proper policies.
CREATE POLICY "Allow anonymous read all"
ON public.products FOR SELECT
USING (true);

CREATE POLICY "Allow anonymous insert products"
ON public.products FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow anonymous update products"
ON public.products FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow anonymous delete products"
ON public.products FOR DELETE
TO anon, authenticated
USING (true);


-- ------------------------------------------
-- 4. STORAGE BUCKET & STORAGE POLICIES
-- ------------------------------------------
-- Create the product-images storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for the product-images storage bucket
DROP POLICY IF EXISTS "Public access to product-images" ON storage.objects;
DROP POLICY IF EXISTS "Anon/Authenticated uploads to product-images" ON storage.objects;
DROP POLICY IF EXISTS "Anon/Authenticated updates to product-images" ON storage.objects;
DROP POLICY IF EXISTS "Anon/Authenticated deletes on product-images" ON storage.objects;

CREATE POLICY "Public access to product-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Anon/Authenticated uploads to product-images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anon/Authenticated updates to product-images"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Anon/Authenticated deletes on product-images"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'product-images');

-- ------------------------------------------
-- 5. DASHBOARD TABLES
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.dashboard_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
    status TEXT NOT NULL DEFAULT 'Actif' CHECK (status IN ('Actif', 'En attente', 'Bloqué')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.dashboard_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer TEXT NOT NULL,
    total NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'En attente' CHECK (status IN ('En attente', 'Confirmée', 'Livrée')),
    date TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.dashboard_settings (
    id TEXT PRIMARY KEY,
    shop_name TEXT NOT NULL DEFAULT 'Fleur Sucrée',
    contact_email TEXT NOT NULL DEFAULT 'contact@fleursucree.com',
    whatsapp TEXT NOT NULL DEFAULT '+22890000000',
    delivery_time TEXT NOT NULL DEFAULT '24h',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.dashboard_settings (id, shop_name, contact_email, whatsapp, delivery_time)
VALUES ('main', 'Fleur Sucrée', 'contact@fleursucree.com', '+22890000000', '24h')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.dashboard_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read dashboard users" ON public.dashboard_users;
DROP POLICY IF EXISTS "Allow insert dashboard users" ON public.dashboard_users;
DROP POLICY IF EXISTS "Allow update dashboard users" ON public.dashboard_users;
DROP POLICY IF EXISTS "Allow read dashboard orders" ON public.dashboard_orders;
DROP POLICY IF EXISTS "Allow insert dashboard orders" ON public.dashboard_orders;
DROP POLICY IF EXISTS "Allow update dashboard orders" ON public.dashboard_orders;
DROP POLICY IF EXISTS "Allow read dashboard settings" ON public.dashboard_settings;
DROP POLICY IF EXISTS "Allow upsert dashboard settings" ON public.dashboard_settings;

CREATE POLICY "Allow read dashboard users"
ON public.dashboard_users FOR SELECT
USING (true);

CREATE POLICY "Allow insert dashboard users"
ON public.dashboard_users FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow update dashboard users"
ON public.dashboard_users FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow read dashboard orders"
ON public.dashboard_orders FOR SELECT
USING (true);

CREATE POLICY "Allow insert dashboard orders"
ON public.dashboard_orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow update dashboard orders"
ON public.dashboard_orders FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow read dashboard settings"
ON public.dashboard_settings FOR SELECT
USING (true);

CREATE POLICY "Allow upsert dashboard settings"
ON public.dashboard_settings FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow update dashboard settings"
ON public.dashboard_settings FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);
