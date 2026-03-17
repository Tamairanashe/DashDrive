import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommissionService {
  private readonly logger = new Logger(CommissionService.name);

  // Configurable commission rates per provider (aligned with Platform Backend BillingService)
  private readonly commissionRates: Record<string, number> = {
    ecocash: 0.025,     // 2.5% processing fee
    innbucks: 0.02,     // 2% processing fee
    mukuru: 0.03,       // 3% processing fee
    paynow: 0.015,      // 1.5% processing fee
    manual: 0,          // No processing fee for manual
  };

  /**
   * Records a commission from a payout.
   * Uses tx parameter to allow running inside a transaction from WebhookService.
   */
  async recordCommission(tx: Prisma.TransactionClient, data: {
    payoutId: string;
    provider: string;
    amount: number;
  }) {
    const rate = this.commissionRates[data.provider.toLowerCase()] ?? 0.02;
    const commissionAmount = Math.round(data.amount * rate * 100) / 100;

    this.logger.log(
      `Recording commission for provider ${data.provider}: $${commissionAmount} (${rate * 100}% of $${data.amount})`
    );

    const billingCycle = new Date().toISOString().substring(0, 7);

    return tx.fintechCommission.create({
      data: {
        payoutId: data.payoutId,
        provider: data.provider,
        billingCycle,
        commissionAmount,
        status: 'PENDING',
      },
    });
  }

  /**
   * Returns the commission rate for a given provider.
   */
  getRate(provider: string): number {
    return this.commissionRates[provider.toLowerCase()] ?? 0.02;
  }

  /**
   * Returns all configured commission rates.
   */
  getAllRates(): Record<string, number> {
    return { ...this.commissionRates };
  }
}
