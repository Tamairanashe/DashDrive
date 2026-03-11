import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FuelService {
  constructor(private prisma: PrismaService) {}

  async getNearbyStations(lat: number, lng: number, radiusKm: number = 10) {
    return [
      { id: 'fs-1', name: 'DashFuel Central', distance: 1.2, address: '15 Main St', fuelTypes: ['Petrol', 'Diesel'], isActive: true },
      { id: 'fs-2', name: 'Highway Energy Station', distance: 3.8, address: '200 Highway Rd', fuelTypes: ['Petrol', 'Diesel', 'LPG'], isActive: true },
      { id: 'fs-3', name: 'Green Charge Point', distance: 5.1, address: '88 Electric Ave', fuelTypes: ['Electric'], isActive: true },
    ];
  }

  async getStationFuelTypes(stationId: string) {
    return [
      { id: 'ft-1', stationId, name: 'Petrol 93', pricePerUnit: 1.45, unit: 'litre', isAvailable: true },
      { id: 'ft-2', stationId, name: 'Petrol 95', pricePerUnit: 1.58, unit: 'litre', isAvailable: true },
      { id: 'ft-3', stationId, name: 'Diesel 50ppm', pricePerUnit: 1.62, unit: 'litre', isAvailable: true },
    ];
  }

  async orderFuel(data: {
    userId: string; stationId: string; fuelTypeId: string;
    quantity: number; orderType: 'self' | 'delivery';
  }) {
    const pricePerUnit = 1.58;
    return {
      id: `fuel-${Date.now()}`,
      userId: data.userId,
      stationId: data.stationId,
      fuelTypeId: data.fuelTypeId,
      quantity: data.quantity,
      totalPrice: Math.round(data.quantity * pricePerUnit * 100) / 100,
      orderType: data.orderType,
      status: 'confirmed',
      paymentMethod: 'wallet',
      createdAt: new Date(),
    };
  }
}
