import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletOwnerType, LedgerType } from '@prisma/client';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class WalletService {
  private readonly FINANCE_BACKEND_URL = process.env.FINANCE_BACKEND_URL || 'http://localhost:3001';

  constructor(private prisma: PrismaService) {}

  async createWallet(ownerId: string, ownerType: WalletOwnerType, currency: string = 'USD') {
    return (this.prisma.wallet as any).create({
      data: {
        id: `WLT-${Date.now()}`,
        ownerId,
        ownerType,
        currency,
        balance: 0,
      },
    });
  }

  async getBalance(walletId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
    });
    if (!wallet) throw new BadRequestException('Wallet not found');
    return wallet;
  }

  async credit(walletId: string, amount: number, reason: string, referenceId?: string) {
    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { id: walletId } });
      if (!wallet) throw new BadRequestException('Wallet not found');

      // 1. Create Ledger Entry (Immutable record)
      await (tx.ledgerEntry as any).create({
        data: {
          id: `LEDGER-${Date.now()}`,
          walletId,
          amount,
          type: LedgerType.CREDIT,
          description: reason,
          referenceId,
        },
      });

      // 2. Update Wallet Balance (Read-model optimization)
      return tx.wallet.update({
        where: { id: walletId },
        data: { balance: { increment: amount } },
      });
    });
  }

  async debit(walletId: string, amount: number, reason: string, referenceId?: string) {
    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { id: walletId } });
      if (!wallet) throw new BadRequestException('Wallet not found');
      if (wallet.balance < amount) throw new BadRequestException('Insufficient funds');

      // 1. Create Ledger Entry
      await (tx.ledgerEntry as any).create({
        data: {
          id: `LEDGER-${Date.now()}`,
          walletId,
          amount,
          type: LedgerType.DEBIT,
          description: reason,
          referenceId,
        },
      });

      // 2. Update Wallet Balance
      return tx.wallet.update({
        where: { id: walletId },
        data: { balance: { decrement: amount } },
      });
    });
  }

  async transfer(fromWalletId: string, toWalletId: string, amount: number, reason: string = 'Transfer') {
    const result = await this.prisma.$transaction(async (tx) => {
      const from = await tx.wallet.findUnique({ where: { id: fromWalletId } });
      const to = await tx.wallet.findUnique({ where: { id: toWalletId } });

      if (!from || !to) throw new BadRequestException('One or both wallets not found');
      if (from.balance < amount) throw new BadRequestException('Insufficient funds');
      if (from.currency !== to.currency) throw new BadRequestException('Currency mismatch');

      const referenceId = `TX-${Date.now()}-${crypto.randomUUID().substring(0, 8)}`;

      // Debit From
      await (tx.ledgerEntry as any).create({
        data: { 
          id: `LEDGER-${Date.now()}-1`,
          walletId: fromWalletId, 
          amount, 
          type: LedgerType.DEBIT, 
          description: `${reason} to ${toWalletId}`, 
          referenceId 
        },
      });
      await tx.wallet.update({
        where: { id: fromWalletId },
        data: { balance: { decrement: amount } },
      });

      // Credit To
      await (tx.ledgerEntry as any).create({
        data: { 
          id: `LEDGER-${Date.now()}-2`,
          walletId: toWalletId, 
          amount, 
          type: LedgerType.CREDIT, 
          description: `${reason} from ${fromWalletId}`, 
          referenceId 
        },
      });
      await tx.wallet.update({
        where: { id: toWalletId },
        data: { balance: { increment: amount } },
      });

      return { success: true, referenceId, amount, currency: from.currency, fromOwnerId: from.ownerId, toOwnerId: to.ownerId };
    });

    // Post-Transfer Hook: Notify Finance Backend for Official Bank Settlement
    try {
      await axios.post(`${this.FINANCE_BACKEND_URL}/wallets/transfer`, {
        sender_id: result.fromOwnerId,
        receiver_id: result.toOwnerId,
        amount: result.amount,
        reference: result.referenceId
      });
      console.log(`Bank settlement initiated for transfer ${result.referenceId}`);
    } catch (err) {
      console.warn(`Bank settlement failed to initiate for ${result.referenceId}. Transaction is still valid internally.`, err.message);
      // In a real production app, we would queue this for retry or alert support
    }

    return result;
  }

  async findWalletByIdentifier(identifier: string, currency: string = 'USD') {
    // 1. Check Riders (Drivers)
    const rider = await this.prisma.rider.findFirst({
      where: {
        OR: [
          { phone: identifier },
          { email: identifier },
        ],
      },
    });

    if (rider) {
      const wallet = await this.prisma.wallet.findUnique({
        where: {
          ownerType_ownerId_currency: {
            ownerType: WalletOwnerType.RIDER,
            ownerId: rider.id,
            currency,
          },
        },
      });

      if (wallet) {
        return {
          walletId: wallet.id,
          name: rider.name,
          type: 'RIDER',
          ownerId: rider.id,
        };
      }
    }

    // 2. Check Merchants
    const merchant = await this.prisma.merchant.findFirst({
      where: {
        OR: [
          { phone: identifier },
          { email: identifier },
        ],
      },
    });

    if (merchant) {
      const wallet = await this.prisma.wallet.findUnique({
        where: {
          ownerType_ownerId_currency: {
            ownerType: WalletOwnerType.MERCHANT,
            ownerId: merchant.id,
            currency,
          },
        },
      });

      if (wallet) {
        return {
          walletId: wallet.id,
          name: merchant.storeName,
          type: 'MERCHANT',
          ownerId: merchant.id,
        };
      }
    }

    // 3. Fallback: Check Orders for Customers
    // In this system, regular users are often identified by their order history
    const order = await this.prisma.order.findFirst({
      where: {
        OR: [
          { customerPhone: identifier },
          { customerName: identifier },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    if (order && order.customerPhone) {
      const wallet = await this.prisma.wallet.findUnique({
        where: {
          ownerType_ownerId_currency: {
            ownerType: WalletOwnerType.CUSTOMER,
            ownerId: order.customerPhone, // Assuming phone as ID for customers
            currency,
          },
        },
      });

      if (wallet) {
        return {
          walletId: wallet.id,
          name: order.customerName || 'Customer',
          type: 'CUSTOMER',
          ownerId: order.customerPhone,
        };
      }
    }

    throw new BadRequestException('Recipient wallet not found for this currency');
  }

  async getLedger(walletId: string) {
    return this.prisma.ledgerEntry.findMany({
      where: { walletId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
