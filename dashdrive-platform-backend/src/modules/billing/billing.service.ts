import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  // Configurable commission rates per vertical (percentage)
  private readonly commissionRates: Record<string, number> = {
    ride: 0.20,        // 20% on rides
    delivery: 0.15,    // 15% on deliveries
    hotel: 0.12,       // 12% on hotel bookings
    fuel: 0.05,        // 5% on fuel orders
    transit: 0.10,     // 10% on transit passes
    marketplace: 0.18, // 18% on marketplace orders
    insurance: 0.08,   // 8% on insurance premiums
    rental: 0.15,      // 15% on car rentals
  };

  constructor(private prisma: PrismaService) {}

  async getCommissionRate(vertical: string): Promise<number> {
    return this.commissionRates[vertical.toLowerCase()] ?? 0.10;
  }

  async calculateCommission(vertical: string, amount: number): Promise<number> {
    const rate = await this.getCommissionRate(vertical);
    return Math.round(amount * rate * 100) / 100; // Round to 2 decimal places
  }

  async recordTransaction(data: {
    referenceId: string;
    type: string;
    amount: number;
    vertical?: string;
  }) {
    const commission = data.vertical
      ? await this.calculateCommission(data.vertical, data.amount)
      : 0;

    return (this.prisma as any).$transaction(async (tx: any) => {
      // Record the billing transaction
      const transaction = await tx.transaction.create({
        data: {
          reference_id: data.referenceId || null,
          type: data.type,
          amount: data.amount,
          status: 'completed',
          created_at: new Date(),
        },
      });

      // If there's a vertical, record the commission
      if (data.vertical && commission > 0) {
        await tx.transaction.create({
          data: {
            reference_id: null,
            type: 'commission',
            amount: commission,
            status: 'pending',
            created_at: new Date(),
          },
        });
      }

      return {
        transaction,
        commission: { amount: commission, rate: this.commissionRates[data.vertical?.toLowerCase() ?? ''] ?? 0 },
      };
    }, { timeout: 15000 });
  }

  async getRevenueSummary(billingCycle?: string) {
    const cycle = billingCycle || new Date().toISOString().substring(0, 7); // YYYY-MM
    const startDate = new Date(`${cycle}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        created_at: { gte: startDate, lt: endDate },
        status: 'completed',
      },
    });

    const commissions = await this.prisma.transaction.findMany({
      where: {
        created_at: { gte: startDate, lt: endDate },
        type: 'commission',
      },
    });

    const totalRevenue = transactions
      .filter(t => t.type !== 'commission')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const totalCommission = commissions.reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      billingCycle: cycle,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalCommission: Math.round(totalCommission * 100) / 100,
      netPayout: Math.round((totalRevenue - totalCommission) * 100) / 100,
      transactionCount: transactions.length,
      rates: this.commissionRates,
    };
  }

  async settlePayouts(billingCycle?: string) {
    const cycle = billingCycle || new Date().toISOString().substring(0, 7);
    const startDate = new Date(`${cycle}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Mark all pending commissions as settled
    const result = await this.prisma.transaction.updateMany({
      where: {
        type: 'commission',
        status: 'pending',
        created_at: { gte: startDate, lt: endDate },
      },
      data: { status: 'settled' },
    });

    this.logger.log(`Settled ${result.count} commission records for ${cycle}`);

    return {
      billingCycle: cycle,
      settledCount: result.count,
      settledAt: new Date().toISOString(),
    };
  }
}
