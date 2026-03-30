import React, { createContext, useContext, useState, useCallback } from 'react';
import { StyleSheet, View as RNView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toast, ToastType } from '../components/feedback/Toast';
import { Spacing } from '../constants/Spacing';

interface ToastData {
    id: string;
    message: string;
    type: ToastType;
}

interface FeedbackContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const useFeedback = () => {
    const context = useContext(FeedbackContext);
    if (!context) throw new Error('useFeedback must be used within FeedbackProvider');
    return context;
};

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastData[]>([]);
    const insets = useSafeAreaInsets();

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <FeedbackContext.Provider value={{ showToast }}>
            {children}
            <RNView style={[styles.container, { bottom: insets.bottom + Spacing.xl }]}>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </RNView>
        </FeedbackContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: Spacing.lg,
        right: Spacing.lg,
        zIndex: 10000,
    },
});
