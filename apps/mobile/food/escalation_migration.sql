-- Migration for Role-Based Escalation Policy
ALTER TABLE public.stores 
ADD COLUMN IF NOT EXISTS escalation_roles text[] DEFAULT ARRAY['manager', 'owner'],
ADD COLUMN IF NOT EXISTS escalation_enabled boolean DEFAULT true;

-- Ensure profiles has the role column with correct constraints
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role text DEFAULT 'staff'
CHECK (role IN ('owner', 'manager', 'staff'));

-- Create push tokens table with role if not exists
CREATE TABLE IF NOT EXISTS public.user_push_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  store_id uuid REFERENCES public.stores(id),
  role text CHECK (role IN ('owner', 'manager', 'staff')),
  expo_push_token text NOT NULL,
  created_at timestamp DEFAULT now()
);
