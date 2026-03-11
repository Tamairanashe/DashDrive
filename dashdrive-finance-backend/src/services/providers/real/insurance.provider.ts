import { BaseProvider } from '../base.provider';
import { InsuranceProviderPlugin } from '../interfaces';

export class RealInsuranceProvider extends BaseProvider implements InsuranceProviderPlugin {
  name = 'ProductionInsurance';

  constructor() {
    super(process.env.INSURANCE_API_URL || 'https://api.testinsurance.com', process.env.INSURANCE_API_KEY || '');
  }

  async quotePolicy(userId: string, productType: string, amount: number) {
    return this.post<{ quoteId: string; premium: number }>('/quotes', {
      userId,
      productType,
      amount,
    });
  }

  async issuePolicy(quoteId: string) {
    return this.post<{ policyNumber: string; expiresAt: Date }>(`/quotes/${quoteId}/issue`);
  }

  async fileClaim(policyNumber: string, amount: number) {
    return this.post<{ claimId: string; status: string }>('/claims', {
      policyNumber,
      amount,
    });
  }
}
