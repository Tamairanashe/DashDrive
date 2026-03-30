import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class BusinessHoursService {
  constructor(private prisma: PrismaService) {}

  async getHours(storeId: string) {
    return this.prisma.businessHours.findMany({
      where: { storeId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async updateHours(storeId: string, hours: any[]) {
    // Upsert logic for each day
    const updates = hours.map((h) =>
      this.prisma.businessHours.upsert({
        where: {
          storeId_dayOfWeek: {
            storeId,
            dayOfWeek: h.dayOfWeek,
          },
        },
        update: {
          openTime: h.openTime,
          closeTime: h.closeTime,
          isOpen: h.isOpen,
        },
        create: {
          storeId,
          dayOfWeek: h.dayOfWeek,
          openTime: h.openTime,
          closeTime: h.closeTime,
          isOpen: h.isOpen,
        },
      }),
    );

    return this.prisma.$transaction(updates);
  }
}
