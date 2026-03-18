import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BatchSettlementService {
  private readonly logger = new Logger(BatchSettlementService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Settles payments for a batch of deliveries.
   * Drivers get a base fee per delivery + a "Batch Bonus" for efficiency.
   */
  async settleBatch(courierId: string, deliveryIds: string[]) {
    this.logger.log(`Settling batch for courier ${courierId} with ${deliveryIds.length} deliveries`);

    const result = await this.prisma.$transaction(async (tx) => {
      let totalDriverEarnings = 0;
      const commissionRate = 0.15; // 15% Platform Commission

      for (const deliveryId of deliveryIds) {
        const delivery = await (tx as any).delivery.findUnique({
          where: { id: deliveryId },
          include: { order: true },
        });

        if (!delivery || !delivery.order) continue;

        const orderTotal = Number(delivery.order.total_price);
        const platformFee = orderTotal * commissionRate;
        const driverShare = orderTotal - platformFee;

        totalDriverEarnings += driverShare;

        // Mark delivery as settled
        await (tx as any).delivery.update({
          where: { id: deliveryId },
          data: { status: 'completed' },
        });

        await (tx as any).order.update({
          where: { id: delivery.order_id },
          data: { status: 'completed' },
        });
      }

      // Add Batch Bonus (e.g. $1 per extra order beyond the first)
      const batchBonus = deliveryIds.length > 1 ? (deliveryIds.length - 1) * 1.5 : 0;
      totalDriverEarnings += batchBonus;

      // Update Driver Wallet (Assuming DriverWallet exists and is linked)
      await tx.driverWallet.update({
        where: { driverProfileId: courierId },
        data: {
          balance: { increment: totalDriverEarnings },
        },
      });

      return { totalEarnings: totalDriverEarnings, bonus: batchBonus };
    });

    return result;
  }
}
