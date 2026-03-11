import { Injectable, Logger } from '@nestjs/common';
import { FintechProductType } from '@prisma/client';

export interface UserProfile {
  id: string;
  name: string;
  type: 'Driver' | 'Customer';
  earnings: number;
  rating: number;
  tripVolume: number;
  accountAgeMonths: number;
  location: string;
  creditScore: number;
  fraudFlags?: number;
}

export interface FinancialProduct {
  id: string;
  name: string;
  provider: string;
  type: FintechProductType;
  thresholds: {
    minEarnings?: number;
    minRating?: number;
    minAccountAge?: number;
    supportedLocations?: string[];
    userType?: 'Driver' | 'Customer' | 'Both';
    minCreditScore?: number;
  };
  partnerPriority: number;
  revenuePotential: number;
  approvalProbability: number;
  estimatedCommission: number;
}

export interface EngineConfig {
  weights: {
    approvalProbability: number;
    commissionValue: number;
    userRelevance: number;
    partnerPriority: number;
  };
  riskThreshold: number;
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

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  calculateScore(user: UserProfile, product: FinancialProduct, config: EngineConfig = DEFAULT_ENGINE_CONFIG): number {
    const { weights } = config;
    
    const approvalScore = product.approvalProbability * weights.approvalProbability;
    const commissionScore = Math.min((product.estimatedCommission / 100) * weights.commissionValue, weights.commissionValue);

    let relevanceFactor = 0.5;
    if (product.thresholds.minEarnings && user.earnings >= product.thresholds.minEarnings) relevanceFactor += 0.25;
    if (product.thresholds.minRating && user.rating >= product.thresholds.minRating) relevanceFactor += 0.25;
    const relevanceScore = relevanceFactor * weights.userRelevance;

    const priorityScore = (product.partnerPriority / 10) * weights.partnerPriority;

    const totalScore = approvalScore + commissionScore + relevanceScore + priorityScore;
    const weightSum = weights.approvalProbability + weights.commissionValue + weights.userRelevance + weights.partnerPriority;
    
    return Math.round((totalScore / weightSum) * 100);
  }

  checkEligibility(user: UserProfile, product: FinancialProduct, config: EngineConfig = DEFAULT_ENGINE_CONFIG): { eligible: boolean; reason?: string } {
    const { thresholds } = product;

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

    return { eligible: true };
  }

  rankOffers(user: UserProfile, products: FinancialProduct[], config: EngineConfig = DEFAULT_ENGINE_CONFIG) {
    const results = products.map(product => {
      const eligibility = this.checkEligibility(user, product, config);
      const score = this.calculateScore(user, product, config);

      return {
        product,
        score,
        isEligible: eligibility.eligible,
        matchReason: eligibility.eligible ? (score > 80 ? 'High Match Confidence' : score > 50 ? 'Good Opportunity' : 'Fair Match') : (eligibility.reason || 'Ineligible')
      };
    });

    return results.sort((a, b) => {
      if (a.isEligible && !b.isEligible) return -1;
      if (!a.isEligible && b.isEligible) return 1;
      return b.score - a.score;
    });
  }
}
