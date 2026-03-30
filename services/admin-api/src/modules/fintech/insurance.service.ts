import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InsuranceService {
  constructor(private prisma: PrismaService) {}

  async createPolicy(policyType: string, rideId: string, coverageAmount: number) {
    // Integrate with external insurers like SafeStep
    return {
      policy_id: `POL_${Date.now()}`,
      status: 'active',
      type: policyType,
      ride_id: rideId,
      coverage_amount: coverageAmount,
    };
  }

  async fileClaim(policyId: string, description: string) {
    return {
      claim_id: `CLM_${Date.now()}`,
      status: 'under_review',
      policy_id: policyId,
      description,
    };
  }
}
