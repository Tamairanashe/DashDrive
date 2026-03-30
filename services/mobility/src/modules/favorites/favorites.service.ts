import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async toggleFavorite(userId: string, vehicleId: string) {
    const existing = await this.prisma.favorite.findFirst({
      where: { userId, vehicleId },
    });

    if (existing) {
      return this.prisma.favorite.delete({ where: { id: existing.id } });
    }

    return this.prisma.favorite.create({
      data: { userId, vehicleId },
    });
  }

  async getFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { vehicle: true },
    });
  }
}
