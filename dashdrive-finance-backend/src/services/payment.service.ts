import { prisma } from '../lib/prisma';
import { walletService } from './wallet.service';
import { bankProvider } from './providers';
import { Decimal } from 'decimal.js';

export class PaymentService {
  /**
   * Process a wallet top-up via an external provider.
   */
  async topup(userId: string, amount: number, paymentMethodId: string) {
    const wallet = await walletService.getOrCreateWallet(userId);
    const method = await prisma.paymentMethod.findUnique({ where: { id: paymentMethodId } });
    if (!method) throw new Error('Payment method not found');

    // 1. Initiate with external provider
    const externalResponse = await bankProvider.initiateTopup(wallet.id, amount, method.type);

    // 2. Create Topup record
    return await prisma.walletTopup.create({
      data: {
        user_id: userId,
        wallet_id: wallet.id,
        payment_method_id: paymentMethodId,
        amount: new Decimal(amount),
        status: externalResponse.status,
        reference: externalResponse.reference,
      },
    });
  }

  /**
   * Process a payment to a merchant from a user's wallet.
   */
  async payMerchant(userId: string, merchantId: string, amount: number) {
    const wallet = await walletService.getOrCreateWallet(userId);

    return await prisma.$transaction(async (tx) => {
      // 1. Debit user wallet
      const debitResult = await walletService.debit(
        wallet.id,
        amount,
        'payment',
        `mch_${Date.now()}`,
        `Payment to merchant ${merchantId}`
      );

      // 2. Create merchant transaction
      const merchantTx = await tx.merchantTransaction.create({
        data: {
          merchant_id: merchantId,
          user_id: userId,
          amount: new Decimal(amount),
          status: 'completed',
          reference: debitResult.transaction.reference,
        },
      });

      return merchantTx;
    });
  }

  /**
   * Settle merchant funds.
   */
  async settleMerchant(merchantId: string, amount: number) {
    return await prisma.merchantSettlement.create({
      data: {
        merchant_id: merchantId,
        amount: new Decimal(amount),
        status: 'pending',
        settlement_date: new Date(),
      },
    });
  }
}

export const paymentService = new PaymentService();
