// Admin Authentication Store
import { useEffect, useState } from "react";

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: "super_admin" | "admin" | "moderator";
    avatar?: string;
    lastLogin: string;
}

interface AdminAuthState {
    user: AdminUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// Mock admin credentials for development
const MOCK_ADMINS = [
    {
        id: "admin-001",
        email: "admin@dashdrive.com",
        password: "admin123",
        name: "System Admin",
        role: "super_admin" as const,
        avatar: undefined,
    },
    {
        id: "admin-002",
        email: "moderator@dashdrive.com",
        password: "mod123",
        name: "Content Moderator",
        role: "moderator" as const,
        avatar: undefined,
    },
];

let authState: AdminAuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
};

const listeners = new Set<() => void>();

const notifyListeners = () => {
    listeners.forEach((listener) => listener());
};

// Actions
export const adminLogin = async (
    email: string,
    password: string
): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const admin = MOCK_ADMINS.find(
        (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );

    if (admin) {
        const { password: _, ...userWithoutPassword } = admin;
        authState = {
            user: {
                ...userWithoutPassword,
                lastLogin: new Date().toISOString(),
            },
            isAuthenticated: true,
            isLoading: false,
        };
        notifyListeners();
        return { success: true };
    }

    return { success: false, error: "Invalid email or password" };
};

export const adminLogout = () => {
    authState = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
    };
    notifyListeners();
};

export const checkAdminSession = () => {
    // In a real app, this would check for a valid token/session
    // For now, just mark as not loading
    authState = {
        ...authState,
        isLoading: false,
    };
    notifyListeners();
};

// Hook
export const useAdminAuth = () => {
    const [state, setState] = useState(authState);

    useEffect(() => {
        const listener = () => {
            setState({ ...authState });
        };
        listeners.add(listener);

        // Check session on mount
        if (authState.isLoading) {
            checkAdminSession();
        }

        return () => {
            listeners.delete(listener);
        };
    }, []);

    return {
        ...state,
        login: adminLogin,
        logout: adminLogout,
    };
};
