-- Add service types to trips, stores, and orders

-- 1. Update trips table (Transport: Rides & Parcels)
ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'ride'; -- 'ride', 'parcel'
ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb; -- Service specific details

-- 2. Update stores table (Commerce: Food, Mart, Shopping)
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'food'; -- 'food', 'mart', 'shopping'
UPDATE public.stores SET type = 'food' WHERE type IS NULL;

-- 3. Update orders table (Commerce tracking)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'food'; -- 'food', 'mart', 'shopping'
UPDATE public.orders SET type = 'food' WHERE type IS NULL;
