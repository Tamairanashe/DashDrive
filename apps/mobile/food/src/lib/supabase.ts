import { createClient } from "@supabase/supabase-js";

// These should be configured in your environment variables
// Expo automatically loads .env files into process.env if they start with EXPO_PUBLIC_
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://your-project-url.supabase.co";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "YOUR_ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
