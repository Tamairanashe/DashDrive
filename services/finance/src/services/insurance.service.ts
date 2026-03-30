import { prisma } from '../lib/prisma';
import { insuranceProvider } from './providers';
import { Decimal } from 'decimal.js';

export class InsuranceService {
  /**
   * Purchase an insurance policy for a user.
   */
  async purchasePolicy(userId: string, productId: string, serviceReference: string) {
    const product = await prisma.insuranceProduct.findUnique({ where: { id: productId } });
    if (!product) throw new Error('Insurance product not found');

    // 1. Get quote from external provider
    const quote = await insuranceProvider.quotePolicy(userId, product.service_type, product.coverage_amount.toNumber());

    // 2. Issue policy externally
    const issued = await insuranceProvider.issuePolicy(quote.quoteId);

    // 3. Save policy locally
    return await prisma.insurancePolicy.create({
      data: {
        user_id: userId,
        product_id: productId,
        service_reference: serviceReference,
        premium: new Decimal(quote.premium),
        coverage_amount: product.coverage_amount,
        status: 'active',
        expires_at: issued.expiresAt,
      },
    });
  }

  /**
   * Submit an insurance claim.
   */
  async submitClaim(policyId: string, amount: number) {
    const policy = await prisma.insurancePolicy.findUnique({ where: { id: policyId } });
    if (!policy) throw new Error('Policy not found');

    // 1. File claim externally
    const externalClaim = await insuranceProvider.fileClaim(policy.id, amount); // Using policy.id as a mock policy number

    // 2. Create local claim record
    return await prisma.insuranceClaim.create({
      data: {
        policy_id: policyId,
        user_id: policy.user_id,
        claim_amount: new Decimal(amount),
        status: externalClaim.status,
      },
    });
  }
}

export const insuranceService = new InsuranceService();
