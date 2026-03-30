import { EnrichedLead } from './EnrichmentService';

export interface FinancierCriteria {
  financierId: string;
  name: string;
  supportedProductTypes: string[];
  minTrustScore: number;
  minIncome: number;
  maxLeadAmount: number;
  priority: number; // 1-10
}

export interface RoutingResult {
  lead: EnrichedLead;
  eligibleFinanciers: string[]; // List of IDs
  routingTier: 'Exclusive' | 'Distributed' | 'Open';
  timestamp: string;
}

export class LeadRoutingEngine {
  /**
   * Decides which financiers receive a lead based on enrichment data
   */
  static routeLead(lead: EnrichedLead, financiers: FinancierCriteria[]): RoutingResult {
    const eligible = financiers.filter(f => {
      // 1. Product Type Check
      if (!f.supportedProductTypes.includes(lead.productType)) return false;

      // 2. Trust Score Check
      if (lead.score < f.minTrustScore) return false;

      // 3. Income Check
      if (lead.internalStats.monthlyEarnings < f.minIncome) return false;

      // 4. Amount Check
      if (lead.requestedAmount > f.maxLeadAmount) return false;

      // 5. Vehicle Policy Hard Validation (New)
      if (lead.productType.toLowerCase().includes('vehicle')) {
        const vehicleCost = lead.vehicleCost || 0;
        const downPayment = lead.downPaymentAmount || 0;
        if (vehicleCost > 0 && (downPayment / vehicleCost) < 0.5) {
          return false;
        }
      }

      return true;
    });

    // Determine Routing Tier based on trust score
    let tier: RoutingResult['routingTier'] = 'Open';
    if (lead.score > 85) tier = 'Exclusive';
    else if (lead.score > 65) tier = 'Distributed';

    // If Exclusive, we might only pick the top 3 by priority
    let finalFinanciers = eligible.sort((a, b) => b.priority - a.priority);
    
    if (tier === 'Exclusive') {
      finalFinanciers = finalFinanciers.slice(0, 3);
    } else if (tier === 'Distributed') {
      finalFinanciers = finalFinanciers.slice(0, 10);
    }

    return {
      lead,
      eligibleFinanciers: finalFinanciers.map(f => f.financierId),
      routingTier: tier,
      timestamp: new Date().toISOString()
    };
  }
}
