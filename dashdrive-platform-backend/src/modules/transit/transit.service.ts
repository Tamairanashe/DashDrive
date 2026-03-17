import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// import { TransitPassType } from '@prisma/client';
type TransitPassType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'STUDENT';

@Injectable()
export class TransitService {
  constructor(private prisma: PrismaService) {}

  async getRoutes() {
    return (this.prisma as any).transitRoute.findMany({
      where: { isActive: true },
      include: { stops: { include: { stop: true }, orderBy: { stopOrder: 'asc' } } },
    });
  }

  async getRouteStops(routeId: string) {
    const routeStops = await (this.prisma as any).routeStop.findMany({
      where: { routeId },
      include: { stop: true },
      orderBy: { stopOrder: 'asc' },
    });
    return routeStops.map((rs) => rs.stop);
  }

  async purchasePass(data: { userId: string; productId: string }) {
    return (this.prisma as any).$transaction(async (tx: any) => {
      // 1. Get product for pricing and duration
      const product = await tx.transitProduct.findUnique({
        where: { id: data.productId, isActive: true }
      });
      if (!product) throw new NotFoundException('Transit product not found or inactive');

      const price = Number(product.price);
      const now = new Date();
      const validUntil = new Date(now.getTime() + product.durationDays * 86400000);

      // 2. Verify user and wallet
      const user = await tx.user.findUnique({
        where: { id: data.userId },
        include: { wallet: true },
      });

      if (!user) throw new NotFoundException('User not found');
      if (!user.wallet) throw new Error('User does not have a wallet');
      
      if (Number(user.wallet.balance) < price) {
        throw new Error('Insufficient wallet balance');
      }

      // 3. Deduct balance
      const wallet = await tx.wallet.update({
        where: { id: user.wallet.id },
        data: { balance: { decrement: price } },
      });

      // 4. Record Transaction
      await tx.walletTransaction.create({
        data: {
          wallet_id: wallet.id,
          type: 'payment',
          amount: price,
          description: `Transit Pass: ${product.name}`,
          reference: `TP-${Date.now()}-${data.userId.substring(0, 4)}`,
          status: 'completed'
        },
      });

      // 5. Create pass with secure QR
      const secureCode = `DASH-${product.type}-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

      return tx.transitPass.create({
        data: {
          userId: data.userId,
          productId: product.id,
          type: product.type,
          validUntil,
          qrCode: secureCode,
          isActive: true
        },
        include: { product: true }
      });
    }, { timeout: 15000 });
  }

  async getProducts() {
    return (this.prisma as any).transitProduct.findMany({
      where: { isActive: true }
    });
  }

  async recordTrip(data: { userId: string; routeId: string; boardStop: string; alightStop?: string; passId?: string }) {
    const route = await (this.prisma as any).transitRoute.findUnique({ where: { id: data.routeId } });
    if (!route) throw new NotFoundException('Route not found');

    let fare = route.baseFare;
    if (data.passId) {
      const pass = await (this.prisma as any).transitPass.findUnique({ 
        where: { id: data.passId },
        include: { product: true }
      });
      if (pass && pass.isActive && pass.validUntil > new Date()) {
        fare = 0; // Covered by pass
      }
    }

    return (this.prisma as any).transitTrip.create({
      data: {
        userId: data.userId,
        routeId: data.routeId,
        boardStopId: data.boardStop,
        alightStopId: data.alightStop,
        passId: data.passId,
        fare,
      },
      include: {
        route: true,
        boardStop: true,
        alightStop: true,
        pass: { include: { product: true } }
      },
    });
  }
}
