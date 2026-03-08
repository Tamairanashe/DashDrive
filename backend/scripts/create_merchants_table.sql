-- DASHDRIVE MERCHANT PROFILE TABLE
-- Links Supabase Auth Users to Merchant Profiles

-- 0. Ensure uuid-ossp is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Merchants Table
CREATE TABLE IF NOT EXISTS public.merchants (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    store_name TEXT NOT NULL,
    phone TEXT,
    type TEXT DEFAULT 'MART', -- 'MART', 'FOOD', 'SHOPPING'
    country_code TEXT DEFAULT 'ZW',
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    logo_url TEXT,
    business_license_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add RLS (Row Level Security)
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;

-- Clients/Owners can see their own profile
CREATE POLICY "Merchants can view own profile" 
ON public.merchants FOR SELECT 
USING (auth.uid() = id);

-- Clients/Owners can update their own profile
CREATE POLICY "Merchants can update own profile" 
ON public.merchants FOR UPDATE 
USING (auth.uid() = id);

-- 3. Trigger for Updated At
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_merchants_updated_at
BEFORE UPDATE ON public.merchants
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- 4. Unified Indexing
CREATE INDEX IF NOT EXISTS idx_merchants_email ON public.merchants(email);
CREATE INDEX IF NOT EXISTS idx_merchants_role ON public.merchants(role_id);
