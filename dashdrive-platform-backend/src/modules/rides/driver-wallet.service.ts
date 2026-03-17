import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DriverWalletService {
  constructor(private prisma: PrismaService) {}

  // --- Driver Wallet ---
  async getDriverWallet(driverProfileId: string) {
    let wallet = await (this.prisma as any).driverWallet.findUnique({
      where: { driverProfileId },
      include: { transactions: { orderBy: { created_at: 'desc' }, take: 10 } }
    });

    if (!wallet) {
      wallet = await (this.prisma as any).driverWallet.create({
        data: { driverProfileId, balance: 0, currency: 'USD' },
        include: { transactions: [] }
      });
    }

    return wallet;
  }

  async topUp(driverProfileId: string, amount: number) {
    return (this.prisma as any).$transaction(async (tx: any) => {
      const wallet = await this.getOrCreateWallet(tx, driverProfileId);

      const updatedWallet = await tx.driverWallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: amount } }
      });

      await tx.driverWalletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'topup',
          amount,
          description: `Wallet top-up: $${amount}`,
          reference: `DTU-${Date.now()}`,
          status: 'completed'
        }
      });

      return updatedWallet;
    }, { timeout: 15000 });
  }

  // --- Ride Bundles ---
  async getRideBundles() {
    return (this.prisma as any).rideBundle.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    });
  }

  async purchaseBundle(driverProfileId: string, bundleId: string) {
    return (this.prisma as any).$transaction(async (tx: any) => {
      const bundle = await tx.rideBundle.findUnique({ where: { id: bundleId } });
      if (!bundle || !bundle.isActive) throw new NotFoundException('Bundle not found or inactive');

      const wallet = await this.getOrCreateWallet(tx, driverProfileId);
      const price = Number(bundle.price);

      if (Number(wallet.balance) < price) {
        throw new BadRequestException(`Insufficient balance. Need $${price}, have $${wallet.balance}`);
      }

      // Debit wallet
      await tx.driverWallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: price } }
      });

      await tx.driverWalletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'bundle_purchase',
          amount: price,
          description: `Bundle: ${bundle.name} (${bundle.rideCount} rides)`,
          reference: `BDL-${Date.now()}`,
          status: 'completed'
        }
      });

      // Create active purchase
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + bundle.validityDays);

      return tx.driverBundlePurchase.create({
        data: {
          driverProfileId,
          bundleId,
          ridesRemaining: bundle.rideCount,
          ridesUsed: 0,
          validUntil,
          status: 'active'
        },
        include: { bundle: true }
      });
    }, { timeout: 15000 });
  }

  async getActiveBundles(driverProfileId: string) {
    return (this.prisma as any).driverBundlePurchase.findMany({
      where: {
        driverProfileId,
        status: 'active',
        ridesRemaining: { gt: 0 },
        validUntil: { gt: new Date() }
      },
      include: { bundle: true },
      orderBy: { validUntil: 'asc' }
    });
  }

  async hasActiveCredits(driverProfileId: string): Promise<boolean> {
    const activeBundles = await this.getActiveBundles(driverProfileId);
    return activeBundles.length > 0;
  }

  async deductRideCredit(driverProfileId: string): Promise<boolean> {
    const activeBundles = await this.getActiveBundles(driverProfileId);

    if (activeBundles.length === 0) {
      return false; // No active credits
    }

    // Deduct from the earliest-expiring bundle first (FIFO)
    const bundle = activeBundles[0];

    await (this.prisma as any).driverBundlePurchase.update({
      where: { id: bundle.id },
      data: {
        ridesRemaining: { decrement: 1 },
        ridesUsed: { increment: 1 },
        status: bundle.ridesRemaining <= 1 ? 'exhausted' : 'active'
      }
    });

    return true;
  }

  // --- Private Helpers ---
  private async getOrCreateWallet(tx: any, driverProfileId: string) {
    let wallet = await tx.driverWallet.findUnique({
      where: { driverProfileId }
    });

    if (!wallet) {
      wallet = await tx.driverWallet.create({
        data: { driverProfileId, balance: 0, currency: 'USD' }
      });
    }

    return wallet;
  }
}
