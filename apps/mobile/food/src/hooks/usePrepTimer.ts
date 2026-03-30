import { useEffect, useState } from "react";

/**
 * Efficient Kitchen Timer Hook
 * Calculates duration since an order was accepted/started.
 */
export const usePrepTimer = (
    status: string,
    createdAt: string,
    acceptedAt?: string
) => {
    const [minutes, setMinutes] = useState(0);

    useEffect(() => {
        // Only track time if order is currently "in_progress"
        if (status !== "in_progress") {
            setMinutes(0);
            return;
        }

        const getStartTime = () => {
            if (acceptedAt) return new Date(acceptedAt).getTime();
            return new Date(createdAt).getTime(); // safe fallback
        };

        const update = () => {
            const start = getStartTime();
            const now = Date.now();
            const diff = Math.floor((now - start) / 60000); // return in minutes
            setMinutes(Math.max(0, diff)); // ensure no negative time
        };

        update();
        const interval = setInterval(update, 15000); // efficient refresh (every 15s)

        return () => clearInterval(interval);
    }, [status, createdAt, acceptedAt]);

    return minutes;
};
