import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    let wallet = await this.prisma.wallet.findUnique({
      where: { user_id: userId },
      include: { transactions: { orderBy: { created_at: 'desc' }, take: 10 } }
    });

    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: {
          user_id: userId,
          balance: 0,
          currency: 'USD',
          status: 'active'
        },
        include: { transactions: true }
      });
    }

    return wallet;
  }

  async creditWallet(userId: string, amount: number, description: string, reference?: string) {
    return (this.prisma as any).$transaction(async (tx: any) => {
      const wallet = await this.getWallet(userId);
      
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { increment: amount },
        }
      });

      await tx.walletTransaction.create({
        data: {
          wallet_id: wallet.id,
          type: 'credit',
          amount: amount,
          description,
          reference,
          status: 'completed'
        }
      });

      return updatedWallet;
    }, { timeout: 15000 });
  }

  async debitWallet(userId: string, amount: number, description: string, reference?: string) {
    return (this.prisma as any).$transaction(async (tx: any) => {
      const wallet = await this.getWallet(userId);
      
      if (wallet.balance.lessThan(amount)) {
        throw new BadRequestException('Insufficient wallet balance');
      }

      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: amount },
        }
      });

      await tx.walletTransaction.create({
        data: {
          wallet_id: wallet.id,
          type: 'debit',
          amount: amount,
          description,
          reference,
          status: 'completed'
        }
      });

      return updatedWallet;
    }, { timeout: 15000 });
  }

  async transfer(senderId: string, receiverId: string, amount: number) {
    return (this.prisma as any).$transaction(async (tx: any) => {
      const senderWallet = await this.getWallet(senderId);
      const receiverWallet = await this.getWallet(receiverId);

      if (senderWallet.balance.lessThan(amount)) {
        throw new BadRequestException('Insufficient balance for transfer');
      }

      const reference = `TRF-${Date.now()}`;

      // Debit Sender
      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: { balance: { decrement: amount } }
      });

      await tx.walletTransaction.create({
        data: {
          wallet_id: senderWallet.id,
          type: 'transfer',
          amount: amount,
          description: `Transfer to user ${receiverId}`,
          reference,
          status: 'completed'
        }
      });

      // Credit Receiver
      await tx.wallet.update({
        where: { id: receiverWallet.id },
        data: { balance: { increment: amount } }
      });

      await tx.walletTransaction.create({
        data: {
          wallet_id: receiverWallet.id,
          type: 'transfer',
          amount: amount,
          description: `Transfer from user ${senderId}`,
          reference: `${reference}-REC`,
          status: 'completed'
        }
      });

      return tx.transfer.create({
        data: {
          sender_id: senderId,
          receiver_id: receiverId,
          amount,
          reference,
          status: 'completed'
        }
      });
    }, { timeout: 15000 });
  }
}
