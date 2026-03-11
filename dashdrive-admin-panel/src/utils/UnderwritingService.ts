import { LoanApplication, ApplicationService } from './ApplicationService';

export interface UnderwritingDecision {
  applicationId: string;
  decision: 'approved' | 'rejected' | 'counter';
  riskScore: number;
  reason?: string;
  approvedAmount?: number;
  approvedApr?: number;
  approvedTermMonths?: number;
  underwriterId: string;
  timestamp: string;
}

export class UnderwritingService {
  /**
   * Performs automated underwriting based on risk scoring and policy rules
   */
  static async performAutomatedUnderwriting(app: LoanApplication): Promise<UnderwritingDecision> {
    // In a real system, this would call credit bureaus and internal scoring models
    let riskScore = 75; // Baseline

    // Vehicle Policy Rule
    if (app.productType.toLowerCase().includes('vehicle')) {
      const vehicleCost = app.vehicleCost || 0;
      const downPayment = app.downPaymentAmount || 0;
      if (vehicleCost > 0 && (downPayment / vehicleCost) < 0.5) {
        return {
          applicationId: app.id,
          decision: 'rejected',
          riskScore: 30,
          reason: 'Insufficient down payment for vehicle finance policy.',
          underwriterId: 'SYSTEM_RULES',
          timestamp: new Date().toISOString()
        };
      }
    }

    const decision: 'approved' | 'rejected' | 'counter' = riskScore > 70 ? 'approved' : 'counter';

    const underwritersDecision: UnderwritingDecision = {
      applicationId: app.id,
      decision,
      riskScore,
      approvedAmount: app.requestedAmount,
      approvedApr: 11.5,
      approvedTermMonths: 36,
      underwriterId: 'AUTO_ADJUDICATOR',
      timestamp: new Date().toISOString()
    };

    // Update the application status through ApplicationService
    ApplicationService.setDecision(app.id, decision, {
      status: decision === 'approved' ? 'approved' : 'underwriting',
      approvedAmount: underwritersDecision.approvedAmount,
      approvedApr: underwritersDecision.approvedApr,
      approvedTermMonths: underwritersDecision.approvedTermMonths,
      underwriterId: underwritersDecision.underwriterId
    });

    return underwritersDecision;
  }
}
