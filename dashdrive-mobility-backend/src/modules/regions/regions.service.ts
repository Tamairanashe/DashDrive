import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RegionsService {
  constructor(private prisma: PrismaService) {}

  async getAllRegions() {
    return this.prisma.marketRegion.findMany({
      include: { cities: true },
    });
  }

  async getCity(slug: string) {
    return this.prisma.city.findUnique({
      where: { slug },
      include: { region: true },
    });
  }

  async createRegion(data: { name: string; countryCode: string; currency: string }) {
    return this.prisma.marketRegion.create({ data });
  }

  async createCity(regionId: string, data: { name: string; slug: string; latitude: number; longitude: number }) {
    return this.prisma.city.create({
      data: {
        ...data,
        regionId,
      },
    });
  }
}
