import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FuelService {
  constructor(private prisma: PrismaService) {}

  async getNearbyStations(lat: number, lng: number, radiusKm: number = 10) {
    // Simple bounding box filtering for MVP, can be enhanced with PostGIS if available
    const stations = await (this.prisma as any).fuelStation.findMany({
      where: {
        isActive: true,
        latitude: { gte: lat - 0.1, lte: lat + 0.1 },
        longitude: { gte: lng - 0.1, lte: lng + 0.1 },
      },
      include: { fuelTypes: true }
    });
    
    return stations;
  }

  async getStationFuelTypes(stationId: string) {
    return (this.prisma as any).fuelType.findMany({
      where: { stationId, isAvailable: true }
    });
  }

  async orderFuel(data: {
    userId: string; stationId: string; fuelTypeId: string;
    quantity: number; orderType: 'self' | 'delivery';
  }) {
    return (this.prisma as any).$transaction(async (tx: any) => {
      // 1. Get fuel type for price
      const fuelType = await tx.fuelType.findUnique({
        where: { id: data.fuelTypeId }
      });
      if (!fuelType) throw new Error('Fuel type not found');

      const totalPrice = Number(fuelType.pricePerUnit) * data.quantity;

      // 2. Check Wallet balance
      const wallet = await tx.wallet.findUnique({
        where: { user_id: data.userId }
      });

      if (!wallet || Number(wallet.balance) < totalPrice) {
        throw new Error('Insufficient wallet balance');
      }

      // 3. Deduct from wallet
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: totalPrice } }
      });

      // 4. Record transaction
      await tx.walletTransaction.create({
        data: {
          wallet_id: wallet.id,
          type: 'debit',
          amount: totalPrice,
          description: `Fuel Purchase: ${fuelType.name} at ${data.stationId}`,
          status: 'completed'
        }
      });

      // 5. Create Fuel Order
      return tx.fuelOrder.create({
        data: {
          userId: data.userId,
          stationId: data.stationId,
          fuelTypeId: data.fuelTypeId,
          quantity: data.quantity,
          totalPrice,
          orderType: data.orderType,
          status: 'confirmed'
        }
      });
    }, { timeout: 15000 });
  }
}
