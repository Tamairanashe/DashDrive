import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommissionService {
  private readonly logger = new Logger(CommissionService.name);

  /**
   * Records a commission from a payout. 
   * Uses tx parameter to allow running inside a transaction from WebhookService.
   */
  async recordCommission(tx: Prisma.TransactionClient, data: {
    payoutId: string;
    provider: string;
    amount: number;
  }) {
    this.logger.log(`Recording commission for provider ${data.provider} from payout ${data.payoutId}`);

    const billingCycle = new Date().toISOString().substring(0, 7); // YYYY-MM

    return tx.fintechCommission.create({
      data: {
        payoutId: data.payoutId,
        provider: data.provider,
        billingCycle,
        commissionAmount: data.amount, // Real logic would apply commission rates
        status: 'PENDING',
      },
    });
  }
}
