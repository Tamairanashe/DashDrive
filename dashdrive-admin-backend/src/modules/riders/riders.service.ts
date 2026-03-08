import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RidersService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string) {
    const where: any = {};
    if (status === 'ONLINE') {
      where.isOnline = true;
    } else if (status === 'OFFLINE') {
      where.isOnline = false;
    }

    return this.prisma.rider.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const rider = await this.prisma.rider.findUnique({
      where: { id },
      include: {
        Delivery: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!rider) {
      throw new NotFoundException(`Rider with ID ${id} not found`);
    }

    return rider;
  }

  async updateStatus(id: string, isActive: boolean) {
    return this.prisma.rider.update({
      where: { id },
      data: { isActive },
    });
  }
}
