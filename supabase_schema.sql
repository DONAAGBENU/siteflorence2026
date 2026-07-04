-- ==========================================
-- SUPABASE SCHEMA INITIALIZATION SCRIPT
-- ==========================================
-- This script sets up the database tables and storage bucket policies
-- required for Fleur Sucrée / siteflorence2026.
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
