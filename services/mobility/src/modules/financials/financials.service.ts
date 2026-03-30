import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FinancialsService {
  constructor(private prisma: PrismaService) {}

  async getEarningsHistory(hostId: string) {
    return this.prisma.hostEarning.findMany({
      where: { hostProfile: { userId: hostId } },
      orderBy: { created_at: 'desc' },
      include: { trip: { include: { vehicle: true } } },
    });
  }

  async addEarning(data: {
    hostId: string;
    tripId?: string;
    amount: number;
    type: string;
    status?: string;
  }) {
    const hostProfile = await this.prisma.hostProfile.findUnique({
      where: { userId: data.hostId },
    });

    if (!hostProfile) throw new NotFoundException('Host profile not found');

    return this.prisma.hostEarning.create({
      data: {
        hostProfileId: hostProfile.id,
        tripId: data.tripId,
        amount: new Prisma.Decimal(data.amount),
        type: data.type,
        status: data.status || 'pending',
      },
    });
  }

  async getFinancialSummary(hostId: string) {
    const earnings = await this.prisma.hostEarning.findMany({
      where: { hostProfile: { userId: hostId } },
    });

    const total = earnings.reduce((sum, e) => sum + e.amount.toNumber(), 0);
    const pending = earnings
      .filter((e) => e.status === 'pending')
      .reduce((sum, e) => sum + e.amount.toNumber(), 0);
    const paid = earnings
      .filter((e) => e.status === 'paid_out')
      .reduce((sum, e) => sum + e.amount.toNumber(), 0);

    return {
      totalEarnings: total,
      pendingPayouts: pending,
      paidOut: paid,
      transactionCount: earnings.length,
    };
  }
}
