export interface Policy {
  id: string;
  leadId?: string;
  borrowerId: string;
  productId: string;
  productName: string;
  premiumAmount: number;
  coverageLimit: number;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  inceptionDate: string;
  expiryDate: string;
}

export interface InsuranceClaim {
  id: string;
  policyId: string;
  claimType: string;
  description: string;
  incidentDate: string;
  estimatedPayout: number;
  status: 'submitted' | 'review' | 'approved' | 'paid' | 'denied';
  filed_at: string;
}

export class PolicyService {
  private static policies: Map<string, Policy> = new Map();
  private static claims: Map<string, InsuranceClaim> = new Map();

  static issuePolicy(params: Omit<Policy, 'id' | 'status' | 'inceptionDate' | 'expiryDate'>): Policy {
    const policy: Policy = {
      ...params,
      id: `POL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: 'active',
      inceptionDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 31536000000).toISOString(), // 1 year later
    };
    this.policies.set(policy.id, policy);
    return policy;
  }

  static getPolicy(id: string): Policy | undefined {
    return this.policies.get(id);
  }

  static submitClaim(claim: Omit<InsuranceClaim, 'id' | 'status' | 'filed_at'>): InsuranceClaim {
    const newClaim: InsuranceClaim = {
      ...claim,
      id: `CLM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: 'submitted',
      filed_at: new Date().toISOString(),
    };
    this.claims.set(newClaim.id, newClaim);
    return newClaim;
  }

  static listPolicies(): Policy[] {
    return Array.from(this.policies.values());
  }

  static listClaims(): InsuranceClaim[] {
    return Array.from(this.claims.values());
  }
}
