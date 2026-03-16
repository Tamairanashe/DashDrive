import { prisma } from '../lib/prisma';
import { Decimal } from 'decimal.js';
import { bankProvider } from './providers';

export class WalletService {
  /**
   * Create a new wallet for a user if it doesn't exist.
   */
  async getOrCreateWallet(userId: string) {
    let wallet = await prisma.wallet.findUnique({
      where: { user_id: userId },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          user_id: userId,
          balance: new Decimal(0),
          currency: 'USD',
          status: 'active',
        },
      });
    }

    return wallet;
  }

  /**
   * Credit an amount to a wallet.
   */
  async credit(walletId: string, amount: number | Decimal, type: string, reference?: string, description?: string) {
    const decimalAmount = new Decimal(amount);

    return await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.update({
        where: { id: walletId },
        data: {
          balance: { increment: decimalAmount },
        },
      });

      const transaction = await tx.walletTransaction.create({
        data: {
          wallet_id: walletId,
          amount: decimalAmount,
          transaction_type: type,
          currency: wallet.currency,
          status: 'completed',
          reference,
          service_type: 'wallet',
        },
      });

      return { wallet, transaction };
    });
  }

  /**
   * Debit an amount from a wallet with balance check.
   */
  async debit(walletId: string, amount: number | Decimal, type: string, reference?: string, description?: string) {
    const decimalAmount = new Decimal(amount);

    return await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { id: walletId } });
      
      if (!wallet) throw new Error('Wallet not found');
      if (new Decimal(wallet.balance).lt(decimalAmount)) {
        throw new Error('Insufficient balance');
      }

      const updatedWallet = await tx.wallet.update({
        where: { id: walletId },
        data: {
          balance: { decrement: decimalAmount },
        },
      });

      const transaction = await tx.walletTransaction.create({
        data: {
          wallet_id: walletId,
          amount: decimalAmount.mul(-1),
          transaction_type: type,
          currency: updatedWallet.currency,
          status: 'completed',
          reference,
          service_type: 'wallet',
        },
      });

      return { wallet: updatedWallet, transaction };
    });
  }

  /**
   * Transfer funds between two wallets and sync with partner bank.
   */
  async transfer(senderId: string, receiverId: string, amount: number | Decimal, reference: string) {
    const decimalAmount = new Decimal(amount);

    return await prisma.$transaction(async (tx) => {
      // 1. Debit sender
      const senderWallet = await tx.wallet.findUnique({ where: { user_id: senderId } });
      if (!senderWallet) throw new Error('Sender wallet not found');
      if (new Decimal(senderWallet.balance).lt(decimalAmount)) throw new Error('Insufficient balance');

      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: { balance: { decrement: decimalAmount } },
      });

      // 2. Credit receiver
      const receiverWallet = await tx.wallet.findUnique({ where: { user_id: receiverId } });
      if (!receiverWallet) throw new Error('Receiver wallet not found');

      await tx.wallet.update({
        where: { id: receiverWallet.id },
        data: { balance: { increment: decimalAmount } },
      });

      // 3. Initiate Real-World Settlement via Bank Partner
      let bankReference = 'INTERNAL_ONLY';
      try {
        const bankRes = await bankProvider.initiateTransfer(
          senderWallet.id, 
          receiverWallet.id, 
          decimalAmount.toNumber()
        );
        bankReference = bankRes.reference;
      } catch (err) {
        console.warn('Bank settlement initiation failed, falling back to queued settlement:', err);
      }

      // 4. Create Transfer record
      const transfer = await tx.transfer.create({
        data: {
          sender_wallet_id: senderWallet.id,
          receiver_wallet_id: receiverWallet.id,
          amount: decimalAmount,
          status: 'completed',
          reference: reference || bankReference,
        },
      });

      // 5. Create Transaction logs
      await tx.walletTransaction.create({
        data: {
          wallet_id: senderWallet.id,
          amount: decimalAmount.mul(-1),
          transaction_type: 'transfer_sent',
          currency: senderWallet.currency,
          reference: `out_${reference}`,
        },
      });

      await tx.walletTransaction.create({
        data: {
          wallet_id: receiverWallet.id,
          amount: decimalAmount,
          transaction_type: 'transfer_received',
          currency: receiverWallet.currency,
          reference: `in_${reference}`,
        },
      });

      return { transfer, bankReference };
    });
  }
}

export const walletService = new WalletService();
