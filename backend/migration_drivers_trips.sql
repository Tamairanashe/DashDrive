-- 1. Create drivers table
CREATE TABLE IF NOT EXISTS public.drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id TEXT UNIQUE NOT NULL, -- e.g. 'PILOT-342'
    name TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    status TEXT NOT NULL DEFAULT 'offline', -- 'online', 'offline', 'busy'
    speed DOUBLE PRECISION DEFAULT 0,
    battery INTEGER DEFAULT 100,
    heading INTEGER DEFAULT 0,
    altitude DOUBLE PRECISION DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create trips table
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id TEXT UNIQUE NOT NULL, -- e.g. 'TRIP-ABC123'
    rider_id UUID NOT NULL, -- Linked to users.id
    driver_id UUID REFERENCES public.drivers(id), -- Null if negotiating
    origin JSONB NOT NULL, -- { address: string, lat: number, lng: number }
    destination JSONB NOT NULL, -- { address: string, lat: number, lng: number }
    initial_offer DECIMAL(10,2) NOT NULL,
    current_price DECIMAL(10,2) NOT NULL,
    final_price DECIMAL(10,2),
    status TEXT NOT NULL DEFAULT 'negotiating', -- 'negotiating', 'matched', 'cancelled', 'completed'
    negotiation_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- 4. Simple policies (Public read for simulation demo, Service Role write)
DROP POLICY IF EXISTS "Allow public read for drivers" ON public.drivers;
CREATE POLICY "Allow public read for drivers" ON public.drivers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role write for drivers" ON public.drivers;
CREATE POLICY "Allow service role write for drivers" ON public.drivers FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow public read for trips" ON public.trips;
CREATE POLICY "Allow public read for trips" ON public.trips FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role write for trips" ON public.trips;
CREATE POLICY "Allow service role write for trips" ON public.trips FOR ALL USING (auth.role() = 'service_role');

-- 5. Enable Realtime (Idempotent)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'drivers'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.drivers;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'trips'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.trips;
    END IF;
END $$;

-- 6. Seed initial drivers in Harare
INSERT INTO public.drivers (external_id, name, latitude, longitude, status, battery, heading, altitude)
VALUES 
('PILOT-342', 'John Smith', -17.824858, 31.053028, 'online', 85, 180, 12),
('PILOT-882', 'Sarah Johnson', -17.8216, 31.0492, 'online', 92, 45, 8),
('PILOT-112', 'Farai Munashe', -17.8300, 31.0600, 'busy', 78, 270, 15)
ON CONFLICT (external_id) DO NOTHING;
