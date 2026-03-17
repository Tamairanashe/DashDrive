import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async createVehicle(data: Prisma.VehicleCreateInput) {
    return this.prisma.vehicle.create({ data });
  }

  async findAll(filters: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: Prisma.VehicleWhereInput = {
      isActive: true,
      ...(filters.category && { category: filters.category }),
      ...(filters.location && { location: { contains: filters.location, mode: 'insensitive' } }),
      pricePerDay: {
        ...(filters.minPrice && { gte: filters.minPrice }),
        ...(filters.maxPrice && { lte: filters.maxPrice }),
      },
    };

    // If dates are provided, filter out vehicles that are blocked or booked
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);

      where.AND = [
        {
          // Not blocked in calendar
          availability: {
            none: {
              isAvailable: false,
              OR: [
                { startDate: { lte: end }, endDate: { gte: start } },
              ],
            },
          },
        },
        {
          // No overlapping confirmed/requested trips
          trips: {
            none: {
              status: { in: ['requested', 'confirmed', 'active'] },
              OR: [
                { startDate: { lte: end }, endDate: { gte: start } },
              ],
            },
          },
        },
      ];
    }

    const vehicles = await this.prisma.vehicle.findMany({
      where,
      include: {
        host: { select: { id: true, email: true } },
        pricingRules: { where: { isActive: true } },
      },
    });

    // Apply dynamic pricing to search results
    return vehicles.map(v => {
      let finalPrice = v.pricePerDay.toNumber();
      // Simple logic: if search is for 7+ days, apply weekly discount in preview
      if (filters.startDate && filters.endDate) {
        const diff = Math.abs(new Date(filters.endDate).getTime() - new Date(filters.startDate).getTime());
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days >= 7) {
          const weeklyDiscount = v.pricingRules.find(r => r.type === 'weekly_discount');
          if (weeklyDiscount) {
            const discount = weeklyDiscount.isPercentage 
              ? (finalPrice * (weeklyDiscount.value.toNumber() / 100))
              : (weeklyDiscount.value.toNumber() / days);
            finalPrice -= discount;
          }
        }
      }
      return { ...v, displayPrice: finalPrice };
    });
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        host: { select: { id: true, email: true, phone: true } },
        availability: true,
        pricingRules: true,
        _count: { select: { trips: true } },
      },
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  async update(id: string, data: Prisma.VehicleUpdateInput) {
    return this.prisma.vehicle.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.vehicle.delete({ where: { id } });
  }
}
