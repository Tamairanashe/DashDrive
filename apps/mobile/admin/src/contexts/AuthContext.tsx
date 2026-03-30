import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import axios from 'axios';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3002';

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.email!);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.email!);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (email: string) => {
    try {
      // In a real app, we might have a dedicated endpoint for fetching the profile by email/id
      // For now, we'll simulate it or use the login response logic if we had one for mobile
      // Since the admin backend returns the profile on login, we could also store it then.
      // But for session persistence, we need to fetch it again.
      
      // Attempt to get profile from backend (assuming an endpoint exists or we'll need to add one)
      // For the sake of this MVP, we'll use the user metadata or a mock if the backend is unreachable
      const response = await axios.get(`${BACKEND_URL}/users/profile`, {
        params: { email }
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      // Fallback to basic user info from Supabase if backend fetch fails
      setProfile({ email, role: 'ADMIN' }); 
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
