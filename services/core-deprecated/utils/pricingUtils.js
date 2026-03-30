/**
 * pricingUtils.ts - Demand-Aware Pricing Engine
 */

interface MarketCondition {
    activeDrivers: number;
    pendingRequests: number;
    baseRate: number; // Base rate per KM
    isRushHour: boolean;
}

/**
 * Calculates a recommended fare based on real-time market liquidity.
 * Implementated for Module C: Market-Aware Fare Floor Control.
 */
export const getRecommendedFare = (distanceKm: number, condition: MarketCondition): number => {
    let multiplier = 1.0;

    // 1. Demand/Supply Ratio (Liquidity)
    const liquidityRatio = condition.activeDrivers / (condition.pendingRequests || 1);

    if (liquidityRatio < 0.5) {
        // High Demand / Low Supply
        multiplier = 1.8;
    } else if (liquidityRatio < 1.0) {
        multiplier = 1.4;
    } else if (liquidityRatio > 2.0) {
        // Over-supply, drop to floor rate
        multiplier = 0.9;
    }

    // 2. Rush Hour Multiplier
    if (condition.isRushHour) {
        multiplier = Math.max(multiplier, 1.5);
    }

    const rawFare = distanceKm * condition.baseRate * multiplier;

    // Ensure we never drop below the absolute floor rate
    const absoluteFloor = 5.00; // Minimum fare
    return Math.max(rawFare, absoluteFloor);
};

export const calculateCommission = (finalFare: number): number => {
    // Brand Guide Rule: Flat 10% platform fee
    return finalFare * 0.10;
};
