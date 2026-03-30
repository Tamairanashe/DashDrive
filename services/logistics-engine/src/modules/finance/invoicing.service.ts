import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletOwnerType, LedgerType } from '@prisma/client';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class InvoicingService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
  ) {}

  async generateMerchantStatement(
    merchantId: string,
    startDate: Date,
    endDate: Date,
  ) {
    // Find merchant wallet
    const wallet = await this.prisma.wallet.findFirst({
      where: { ownerId: merchantId, ownerType: WalletOwnerType.MERCHANT },
    });

    if (!wallet) throw new NotFoundException('Merchant wallet not found');

    // Fetch ledger entries for period
    const entries = await this.prisma.ledgerEntry.findMany({
      where: {
        walletId: wallet.id,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Aggregate
    let totalEarnings = 0; // Credits from orders
    let totalWithdrawals = 0; // Debits for payouts

    entries.forEach((entry) => {
      if (
        entry.type === LedgerType.CREDIT &&
        entry.description?.includes('Payout')
      ) {
        totalEarnings += entry.amount;
      } else if (
        entry.type === LedgerType.DEBIT &&
        entry.description?.toLowerCase().includes('withdrawal')
      ) {
        totalWithdrawals += entry.amount;
      }
    });

    return {
      merchantId,
      walletId: wallet.id,
      currency: wallet.currency,
      currentBalance: wallet.balance,
      period: { start: startDate, end: endDate },
      summary: {
        totalEarnings,
        totalWithdrawals,
        netChange: totalEarnings - totalWithdrawals,
      },
      transactions: entries,
    };
  }
}
