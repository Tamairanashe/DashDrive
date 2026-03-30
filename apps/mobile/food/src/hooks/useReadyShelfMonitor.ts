import { useMemo } from "react";

interface Metrics {
    ready_count: number;
    in_progress_count: number;
    avg_prep_min: number;
    avg_ready_wait_min: number;
}

/**
 * Enterprise Ready Shelf Congestion Monitor
 * Diagnoses pickup bottlenecks and shelf density in real-time.
 */
export const useReadyShelfMonitor = (metrics: Metrics) => {
    return useMemo(() => {
        if (!metrics) return null;

        const { ready_count, in_progress_count, avg_prep_min, avg_ready_wait_min } = metrics;

        let status: "normal" | "building" | "congested" | "critical" = "normal";
        let message = "Shelf flow is healthy";

        // Thresholds: Building (5), Congested (10), Critical (15) or Stale Food High risk (> 20 mins)
        if (ready_count >= 15 || avg_ready_wait_min >= 20) {
            status = "critical";
            message = ready_count >= 15 ? "🚨 Pickup congestion critical — drivers delayed" : "🧪 Cold food risk: High shelf wait time";
        } else if (ready_count >= 10 || avg_ready_wait_min >= 15) {
            status = "congested";
            message = "⚠️ Ready shelf congested";
        } else if (ready_count >= 5) {
            status = "building";
            message = "📦 Orders accumulating on shelf";
        }

        // High-IQ Diagnosis: Is the bottleneck Logistics or Kitchen?
        // Rule: More orders ready than being cooked + Kitchen is fast = LOGISTICS ISSUE
        const bottleneck: "logistics" | "kitchen" =
            ready_count > in_progress_count && avg_prep_min < 15
                ? "logistics"
                : "kitchen";

        return {
            status,
            message,
            readyCount: ready_count,
            avgWaitMin: avg_ready_wait_min,
            bottleneck,
        };
    }, [metrics]);
};
