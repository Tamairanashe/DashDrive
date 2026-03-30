import { useMemo } from "react";

/**
 * Monitors the time an order has spent in the 'ready' status.
 * Returns classification (Normal, Warning, Delayed) and wait duration.
 */
export const usePickupDelayMonitor = (order: { status: string; ready_at?: string }) => {
    return useMemo(() => {
        if (order.status !== "ready" || !order.ready_at) {
            return { delayed: false, warning: false, minutes: 0 };
        }

        const readyTime = new Date(order.ready_at).getTime();
        if (isNaN(readyTime)) {
            return { delayed: false, warning: false, minutes: 0 };
        }

        const minutes = (Date.now() - readyTime) / 60000;

        return {
            delayed: minutes >= 20, // Critical threshold
            warning: minutes >= 10 && minutes < 20, // Warning threshold
            minutes: Math.floor(minutes),
        };
    }, [order.status, order.ready_at]);
};
