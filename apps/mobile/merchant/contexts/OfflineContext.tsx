import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

interface OfflineContextType {
    isOffline: boolean;
}

const OfflineContext = createContext<OfflineContextType>({ isOffline: false });

export const useOffline = () => useContext(OfflineContext);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((status) => {
            setIsOffline(status.isConnected === false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <OfflineContext.Provider value={{ isOffline }}>
            {children}
        </OfflineContext.Provider>
    );
}
