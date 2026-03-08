import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { VerificationStatus } from '@prisma/client';

@Injectable()
export class VerificationService {
  constructor(private prisma: PrismaService) {}

  async getPendingRiders() {
    return this.prisma.rider.findMany({
      where: { verificationStatus: VerificationStatus.PENDING },
      orderBy: { createdAt: 'desc' },
    });
  }

  async verifyRider(riderId: string, status: VerificationStatus, note?: string) {
    const rider = await this.prisma.rider.findUnique({ where: { id: riderId } });
    if (!rider) throw new NotFoundException('Rider not found');

    return this.prisma.rider.update({
      where: { id: riderId },
      data: { 
        verificationStatus: status,
        // In a real app, we'd log the note/adminId in a history table
      },
    });
  }
}
