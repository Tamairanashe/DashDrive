import { useEffect, useState, useCallback } from 'react';

/**
 * A hook to handle real-time updates via WebSockets (simulated for now).
 * In production, this would connect to the DashDrive Mart Backend Gateway.
 */
export function useRealTime<T>(eventName: string, initialData: T) {
    const [data, setData] = useState<T>(initialData);
    const [isConnected, setIsConnected] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const emit = useCallback((event: string, payload: any) => {
        console.log(`[RealTime] Emitting ${event}:`, payload);
        // Simulate sending to server
    }, []);

    useEffect(() => {
        // Simulate connection
        const connectTimer = setTimeout(() => setIsConnected(true), 1000);

        // Simulation: Randomly trigger events based on eventName
        const interval = setInterval(() => {
            if (eventName === 'orders') {
                // Occasionally simulate a new order arrived or status changed
                setLastUpdated(new Date());
            }
        }, 15000);

        return () => {
            clearTimeout(connectTimer);
            clearInterval(interval);
        };
    }, [eventName]);

    return { data, setData, isConnected, lastUpdated, emit };
}
