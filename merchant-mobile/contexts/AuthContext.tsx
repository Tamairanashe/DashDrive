import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Merchant, Store, AuthResponse } from '../types/auth';
import api from '../services/api';
import { useRouter, useSegments } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

interface AuthContextType {
    merchant: Merchant | null;
    store: Store | null;
    isLoading: boolean;
    signIn: (response: AuthResponse) => Promise<void>;
    signOut: () => Promise<void>;
    updateStore: (store: Store) => void;
    registerPushToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [merchant, setMerchant] = useState<Merchant | null>(null);
    const [store, setStore] = useState<Store | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        loadStorageData();
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!merchant && !inAuthGroup) {
            router.replace('/(auth)/login');
        } else if (merchant && inAuthGroup) {
            router.replace('/(tabs)');
        }
    }, [merchant, segments, isLoading]);

    async function loadStorageData() {
        try {
            const token = await SecureStore.getItemAsync('access_token');
            const savedMerchant = await SecureStore.getItemAsync('merchant');
            const savedStore = await SecureStore.getItemAsync('store');

            if (token && savedMerchant) {
                setMerchant(JSON.parse(savedMerchant));
                if (savedStore) setStore(JSON.parse(savedStore));
                // Automatically register for push notifications on app load if logged in
                registerPushToken();
            }
        } catch (e) {
            console.error('Failed to load auth data', e);
        } finally {
            setIsLoading(false);
        }
    }

    const signIn = async (response: AuthResponse) => {
        await SecureStore.setItemAsync('access_token', response.access_token);
        await SecureStore.setItemAsync('merchant', JSON.stringify(response.merchant));
        if (response.store) {
            await SecureStore.setItemAsync('store', JSON.stringify(response.store));
            setStore(response.store);
        }
        setMerchant(response.merchant);

        // Register for push notifications after sign in
        registerPushToken();
    };

    const signOut = async () => {
        await SecureStore.deleteItemAsync('access_token');
        await SecureStore.deleteItemAsync('merchant');
        await SecureStore.deleteItemAsync('store');
        setMerchant(null);
        setStore(null);
    };

    const updateStore = (newStore: Store) => {
        setStore(newStore);
        SecureStore.setItemAsync('store', JSON.stringify(newStore));
    };

    const registerPushToken = async () => {
        try {
            const token = await registerForPushNotificationsAsync();
            if (token) {
                await api.patch('/merchants/push-token', { pushToken: token });
                console.log('Push token registered successfully');
            }
        } catch (error) {
            console.error('Error registering push token:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ merchant, store, isLoading, signIn, signOut, updateStore, registerPushToken }}>
            {children}
        </AuthContext.Provider>
    );
}

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas?.projectId,
        })).data;
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
