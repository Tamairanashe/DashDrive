-- ==========================================
-- SCHEMA UPDATE & AUTO-PROFILE TRIGGER
-- ==========================================

-- 1. Fix missing column in users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS name TEXT;

-- 2. Auto-profile function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Unnamed Manager'),
    'manager'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
