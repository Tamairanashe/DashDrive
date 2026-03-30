import { useMemo } from "react";
import { useSLASettings } from "../store/useSLASettings";

interface Metrics {
    in_progress_count: number;
    avg_prep_min: number; // from RPC (minutes)
    new_count: number;
}

/**
 * Enterprise Kitchen Load Predictor
 * Calculates operational pressure based on active orders and historical prep velocity.
 */
export const useKitchenLoadPredictor = (metrics: Metrics) => {
    const { warningMinutes } = useSLASettings();

    const prediction = useMemo(() => {
        if (!metrics) return null;

        const { in_progress_count, avg_prep_min, new_count } = metrics;

        // Load Score Formula: (Active Prep Volume * Historical Speed) / SLA Tolerance
        // Score < 0.7: Healthy
        // Score 0.7 - 1.0: Busy
        // Score > 1.0: Overload Risk
        const loadScore =
            (in_progress_count * (avg_prep_min || 1)) /
            (warningMinutes || 10);

        let status: "healthy" | "busy" | "overload" = "healthy";
        let message = "Kitchen running smoothly";

        if (loadScore >= 1) {
            status = "overload";
            message = "⚠️ Overload risk: SLA breaches likely";
        } else if (loadScore >= 0.7) {
            status = "busy";
            message = "🍳 Kitchen getting busy";
        }

        // Secondary Wave Detection: Building queue
        if (new_count >= 5 && status !== "overload") {
            status = "busy";
            message = "📦 Order queue building up";
        }

        return {
            loadScore: Number(loadScore.toFixed(2)),
            status,
            message,
            // Predictive ETA factor for individual orders
            loadFactor: Math.max(1, loadScore)
        };
    }, [metrics, warningMinutes]);

    return prediction;
};
