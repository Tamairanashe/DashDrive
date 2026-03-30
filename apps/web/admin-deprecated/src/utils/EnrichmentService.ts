export interface RawLeadRequest {
  userId: string;
  userType: 'driver' | 'customer';
  productType: string;
  requestedAmount: number;
  purpose: string;
  monthlyIncome: number;
  city: string;
  vehicleCost?: number;
  downPaymentAmount?: number;
}

export interface EnrichedLead extends RawLeadRequest {
  leadId: string;
  timestamp: string;
  internalStats: {
    rating: number;
    totalTrips?: number;
    monthlyEarnings: number;
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    accountAgeMonths: number;
    verificationStatus: 'Verified' | 'Pending' | 'Flagged';
  };
  score: number; // DashDrive Trust Score (0-100)
}

export class EnrichmentService {
  /**
   * Hydrates a raw lead request with internal DashDrive data
   */
  static async enrichLead(request: RawLeadRequest): Promise<EnrichedLead> {
    // In a real system, this would query DBs/APIs for driver/customer stats
    // We'll mock this for now
    
    const mockStats = {
      rating: 4.5 + Math.random() * 0.5,
      totalTrips: request.userType === 'driver' ? 500 + Math.floor(Math.random() * 2000) : undefined,
      monthlyEarnings: request.monthlyIncome * (0.8 + Math.random() * 0.4),
      tier: this.determineTier(request.monthlyIncome),
      accountAgeMonths: 6 + Math.floor(Math.random() * 36),
      verificationStatus: 'Verified' as const
    };

    // Mock vehicle costs for specific products
    const vehicleCost = request.productType.toLowerCase().includes('vehicle') 
      ? request.vehicleCost || 15000 + Math.floor(Math.random() * 20000) 
      : undefined;
    
    const downPaymentAmount = vehicleCost 
      ? request.downPaymentAmount || Math.floor(vehicleCost * (0.3 + Math.random() * 0.4)) 
      : undefined;

    const trustScore = this.calculateTrustScore(mockStats, { 
      ...request, 
      vehicleCost, 
      downPaymentAmount 
    });

    return {
      ...request,
      vehicleCost,
      downPaymentAmount,
      leadId: `LEAD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      internalStats: mockStats,
      score: trustScore
    };
  }

  private static determineTier(income: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' {
    if (income > 5000) return 'Platinum';
    if (income > 2500) return 'Gold';
    if (income > 1000) return 'Silver';
    return 'Bronze';
  }

  private static calculateTrustScore(stats: any, request: RawLeadRequest): number {
    let score = 50; // Base score

    // Income to Request ratio
    const ratio = request.requestedAmount / stats.monthlyEarnings;
    if (ratio < 2) score += 20;
    else if (ratio < 5) score += 10;
    else score -= 10;

    // Rating boost
    if (stats.rating > 4.8) score += 15;
    else if (stats.rating > 4.5) score += 10;

    // Tenure boost
    if (stats.accountAgeMonths > 24) score += 10;
    else if (stats.accountAgeMonths > 12) score += 5;

    // Tier bonus
    if (stats.tier === 'Platinum') score += 10;
    if (stats.tier === 'Gold') score += 5;

    // Down Payment Factor (New)
    if (request.vehicleCost && request.downPaymentAmount) {
      const dpRatio = request.downPaymentAmount / request.vehicleCost;
      if (dpRatio >= 0.5) score += 15;
      else if (dpRatio >= 0.3) score += 5;
      else score -= 20; // Critical penalty for low down payment
    }

    return Math.min(Math.max(score, 0), 100);
  }
}
