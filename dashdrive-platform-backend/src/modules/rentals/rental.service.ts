import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RentalService {
  constructor(private prisma: PrismaService) {}

  async searchVehicles(city: string, category?: string) {
    const fleet = [
      { id: 'rf-1', make: 'Toyota', model: 'Corolla', year: 2024, category: 'sedan', pricePerDay: 35, status: 'available' },
      { id: 'rf-2', make: 'Honda', model: 'CR-V', year: 2025, category: 'suv', pricePerDay: 55, status: 'available' },
      { id: 'rf-3', make: 'Mercedes', model: 'E-Class', year: 2025, category: 'luxury', pricePerDay: 120, status: 'available' },
      { id: 'rf-4', make: 'Toyota', model: 'HiAce', year: 2023, category: 'van', pricePerDay: 75, status: 'available' },
    ];
    return category ? fleet.filter(v => v.category === category) : fleet;
  }

  async bookVehicle(data: {
    userId: string; vehicleId: string;
    pickupLocation: string; dropoffLocation: string;
    pickupDate: string; dropoffDate: string;
    insuranceType?: string;
  }) {
    const pickupDate = new Date(data.pickupDate);
    const dropoffDate = new Date(data.dropoffDate);
    const totalDays = Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));
    const dailyRate = 55;
    const insuranceCost = data.insuranceType === 'premium' ? 15 * totalDays : data.insuranceType === 'standard' ? 8 * totalDays : 0;
    return {
      id: `rental-${Date.now()}`,
      userId: data.userId,
      vehicleId: data.vehicleId,
      totalDays,
      dailyRate,
      insuranceCost,
      totalPrice: (totalDays * dailyRate) + insuranceCost,
      status: 'confirmed',
      createdAt: new Date(),
    };
  }

  async returnVehicle(bookingId: string, data: { mileage: number; fuelLevel: number; damageNotes?: string }) {
    return {
      id: bookingId,
      status: 'returned',
      returnInspection: {
        mileage: data.mileage,
        fuelLevel: data.fuelLevel,
        damageNotes: data.damageNotes || 'None',
        inspectedAt: new Date(),
      },
    };
  }
}
