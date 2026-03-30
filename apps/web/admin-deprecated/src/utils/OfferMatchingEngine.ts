export interface UserProfile {
  id: string;
  name: string;
  type: 'Driver' | 'Customer';
  earnings: number; // Monthly
  rating: number; // 0-5
  tripVolume: number; // Total trips
  accountAgeMonths: number;
  location: string;
  creditScore: number;
  fraudFlags?: number;
}

export interface MatchingThresholds {
  minEarnings?: number;
  minRating?: number;
  minAccountAge?: number;
  supportedLocations?: string[];
  userType?: 'Driver' | 'Customer' | 'Both';
  minCreditScore?: number;
}

export interface FinancialProduct {
  id: string;
  name: string;
  provider: string;
  type: 'Loan' | 'Insurance' | 'Credit';
  interestRate?: number;
  maxAmount?: number;
  thresholds: MatchingThresholds;
  partnerPriority: number; // 1-10 (10 highest)
  revenuePotential: number; // 1-10 (10 highest)
  approvalProbability: number; // 0-1 (e.g., 0.85)
  estimatedCommission: number; // $ value
}

export interface EngineConfig {
  weights: {
    approvalProbability: number; // e.g., 0.4
    commissionValue: number;    // e.g., 0.2
    userRelevance: number;       // e.g., 0.2
    partnerPriority: number;     // e.g., 0.2
  };
  riskThreshold: number; // 0-100 (exclude users with high fraud flags)
}

export interface MatchingResult {
  product: FinancialProduct;
  score: number; // 0-100
  matchReason: string;
  isEligible: boolean;
  scoreBreakdown?: {
    approval: number;
    revenue: number;
    relevance: number;
  };
}

export const DEFAULT_ENGINE_CONFIG: EngineConfig = {
  weights: {
    approvalProbability: 40,
    commissionValue: 20,
    userRelevance: 20,
    partnerPriority: 20
  },
  riskThreshold: 80
};

export class OfferMatchingEngine {
  /**
   * Calculates a match score for a product based on user profile and engine configuration.
   */
  static calculateScore(user: UserProfile, product: FinancialProduct, config: EngineConfig = DEFAULT_ENGINE_CONFIG): number {
    const { weights } = config;
    
    // 1. Approval Probability Score (scaled to matching weight)
    const approvalScore = product.approvalProbability * weights.approvalProbability;

    // 2. Revenue/Commission Score
    // Normalize commission: Assuming $100 is a "high" commission for scoring
    const commissionScore = Math.min((product.estimatedCommission / 100) * weights.commissionValue, weights.commissionValue);

    // 3. User Relevance Score (based on earnings and rating matching thresholds)
    let relevanceFactor = 0.5; // Base relevance
    if (product.thresholds.minEarnings && user.earnings >= product.thresholds.minEarnings) relevanceFactor += 0.25;
    if (product.thresholds.minRating && user.rating >= product.thresholds.minRating) relevanceFactor += 0.25;
    const relevanceScore = relevanceFactor * weights.userRelevance;

    // 4. Partner Priority Score
    const priorityScore = (product.partnerPriority / 10) * weights.partnerPriority;

    const totalScore = approvalScore + commissionScore + relevanceScore + priorityScore;
    
    // Normalize to 0-100 based on sum of weights
    const weightSum = weights.approvalProbability + weights.commissionValue + weights.userRelevance + weights.partnerPriority;
    return Math.round((totalScore / weightSum) * 100);
  }

  /**
   * Checks hard eligibility thresholds
   */
  static checkEligibility(user: UserProfile, product: FinancialProduct, config: EngineConfig = DEFAULT_ENGINE_CONFIG): { eligible: boolean; reason?: string } {
    const { thresholds } = product;

    // Risk Check
    if (user.fraudFlags && user.fraudFlags > (100 - config.riskThreshold)) {
      return { eligible: false, reason: 'Risk Threshold Exceeded' };
    }

    if (thresholds.userType !== 'Both' && thresholds.userType !== user.type) {
      return { eligible: false, reason: `Only available for ${thresholds.userType}s` };
    }

    if (thresholds.minEarnings && user.earnings < thresholds.minEarnings) {
      return { eligible: false, reason: `Earnings below $${thresholds.minEarnings}` };
    }

    if (thresholds.minRating && user.rating < thresholds.minRating) {
      return { eligible: false, reason: `Rating below ${thresholds.minRating}` };
    }

    if (thresholds.minAccountAge && user.accountAgeMonths < thresholds.minAccountAge) {
      return { eligible: false, reason: `Account too new (min ${thresholds.minAccountAge} months)` };
    }

    if (thresholds.minCreditScore && user.creditScore < thresholds.minCreditScore) {
        return { eligible: false, reason: `Credit score below ${thresholds.minCreditScore}` };
    }

    if (thresholds.supportedLocations && thresholds.supportedLocations.length > 0) {
      if (!thresholds.supportedLocations.includes(user.location)) {
        return { eligible: false, reason: `Not supported in ${user.location}` };
      }
    }

    return { eligible: true };
  }

  /**
   * Ranks all available products for a user
   */
  static rankOffers(user: UserProfile, products: FinancialProduct[], config: EngineConfig = DEFAULT_ENGINE_CONFIG): MatchingResult[] {
    const results: MatchingResult[] = products.map(product => {
      const eligibility = this.checkEligibility(user, product, config);
      const score = this.calculateScore(user, product, config);

      let matchReason = '';
      if (score > 80) matchReason = 'High Match Confidence';
      else if (score > 60) matchReason = 'Good Opportunity';
      else if (score > 40) matchReason = 'Fair Match';
      else matchReason = 'Low Conversion Probability';

      return {
        product,
        score,
        isEligible: eligibility.eligible,
        matchReason: eligibility.eligible ? matchReason : (eligibility.reason || 'Ineligible')
      };
    });

    return results.sort((a, b) => {
      if (a.isEligible && !b.isEligible) return -1;
      if (!a.isEligible && b.isEligible) return 1;
      return b.score - a.score;
    });
  }
}

