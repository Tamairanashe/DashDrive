import { prisma } from '../lib/prisma';
import { Decimal } from 'decimal.js';

export class LoanService {
  /**
   * Submit a loan application.
   */
  async applyForLoan(userId: string, productId: string, amount: number) {
    return await prisma.loanApplication.create({
      data: {
        user_id: userId,
        loan_product_id: productId,
        requested_amount: new Decimal(amount),
        status: 'pending',
      },
    });
  }

  /**
   * Disburse a loan to a user's wallet.
   */
  async disburseLoan(applicationId: string) {
    const application = await prisma.loanApplication.findUnique({
      where: { id: applicationId },
      include: { product: true },
    });

    if (!application || application.status !== 'approved') {
      throw new Error('Application not found or not approved');
    }

    const principal = application.requested_amount;
    const interest = principal.mul(application.product.interest_rate).div(100);
    const totalPayable = principal.add(interest);

    return await prisma.$transaction(async (tx) => {
      // 1. Create Loan record
      const loan = await tx.loan.create({
        data: {
          user_id: application.user_id,
          loan_product_id: application.loan_product_id,
          principal_amount: principal,
          interest_amount: interest,
          total_payable: totalPayable,
          status: 'active',
          due_date: new Date(Date.now() + application.product.repayment_period_days * 24 * 60 * 60 * 1000),
        },
      });

      // 2. Update Application status
      await tx.loanApplication.update({
        where: { id: applicationId },
        data: { status: 'disbursed' },
      });

      return loan;
    });
  }
}

export const loanService = new LoanService();
