-- Create menu_items table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT,
    is_available BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Allow public read for menu items
CREATE POLICY "Allow public read for menu_items" ON public.menu_items FOR SELECT USING (true);

-- Allow service role and managers to manage menu items
CREATE POLICY "Allow management for menu_items" ON public.menu_items FOR ALL USING (
    auth.role() = 'service_role' OR 
    EXISTS (
        select 1 from users 
        where users.id = auth.uid() 
        and users.role in ('owner', 'manager')
    )
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;

-- Seed some initial menu items (optional but helpful for demo)
-- INSERT INTO public.menu_items (store_id, name, price, category) VALUES 
-- ('YOUR_STORE_ID', 'Classic Burger', 12.99, 'Main'),
-- ('YOUR_STORE_ID', 'French Fries', 4.50, 'Sides'),
-- ('YOUR_STORE_ID', 'Ice Cold Soda', 2.25, 'Drinks');
