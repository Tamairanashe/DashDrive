import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { notificationService } from '../services/notificationService';

export type UserRole = 'owner' | 'manager' | 'staff';

interface UserProfile {
    id: string;
    role: UserRole;
    name: string;
    store_id?: string;
    push_token?: string;
}

interface AuthState {
    user: UserProfile | null;
    loading: boolean;
    setUser: (user: UserProfile | null) => void;
    setLoading: (loading: boolean) => void;
    hasRole: (roles: UserRole[]) => boolean;
    updatePushToken: (token: string) => Promise<void>;
    registerPushNotifications: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    loading: true,
    setUser: (user) => {
        set({ user, loading: false });
        if (user) {
            get().registerPushNotifications();
        }
    },
    setLoading: (loading) => set({ loading }),
    hasRole: (roles) => {
        const user = get().user;
        if (!user) return false;
        return roles.includes(user.role);
    },
    updatePushToken: async (token) => {
        const user = get().user;
        if (!user) return;

        const { error } = await supabase
            .from('users')
            .update({ push_token: token })
            .eq('id', user.id);

        if (error) {
            console.error('Error updating push token in DB:', error);
        } else {
            console.log('Push token persisted to Supabase');
            set({ user: { ...user, push_token: token } });
        }
    },
    registerPushNotifications: async () => {
        const token = await notificationService.registerForPushNotificationsAsync();
        if (token) {
            await get().updatePushToken(token);
        }
    }
}));
