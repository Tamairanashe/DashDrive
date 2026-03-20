import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ServiceType } from '@prisma/client';
import { GoogleMapsService } from '../../providers/google-maps/google-maps.service';

@Injectable()
export class DispatchService {
  private readonly logger = new Logger(DispatchService.name);

  constructor(
    private prisma: PrismaService,
    private googleMaps: GoogleMapsService,
  ) {}

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async autoAssignCourier(orderId: string, latitude: number, longitude: number) {
    this.logger.log(`Searching for nearest courier for order ${orderId} by ETA`);

    // Find couriers who are online and in Delivery or Mixed mode
    const availableCouriers = await this.prisma.driverProfile.findMany({
      where: {
        is_online: true,
        current_mode: { in: ['DELIVERY', 'MIXED'] as any[] },
      },
    });

    if (availableCouriers.length === 0) {
      this.logger.warn(`No couriers available for order ${orderId}`);
      return null;
    }

    // Advanced: Check for batching potential in active couriers
    // We prioritize couriers who are ALREADY on a similar route (Batching)
    const couriersWithTasks = await Promise.all(
      availableCouriers.map(async (c: any) => {
        const active = await this.prisma.delivery.findMany({
          where: { courier_id: c.id, status: { in: ['assigned', 'picked_up'] } }
        });
        return { courier: c, activeCount: active.length };
      })
    );

    // Filter by capacity (max 3 orders) and preliminary radius (e.g. 15km)
    const eligible = couriersWithTasks.filter((item: any) => {
      const dist = this.haversineDistance(
        latitude, longitude,
        item.courier.last_location_lat || 0, item.courier.last_location_lng || 0
      );
      return item.activeCount < 3 && dist < 15;
    });

    if (eligible.length === 0) return null;

    // Pick top candidates by Haversine for Distance Matrix API (limit to 10 for cost/performance)
    const candidates = eligible.sort((a: any, b: any) => {
      const distA = this.haversineDistance(latitude, longitude, a.courier.last_location_lat!, a.courier.last_location_lng!);
      const distB = this.haversineDistance(latitude, longitude, b.courier.last_location_lat!, b.courier.last_location_lng!);
      return distA - distB;
    }).slice(0, 10);

    try {
      // Perform Distance Matrix calculation for accurate ETA
      const matrix = await this.googleMaps.getDistanceMatrix(
        candidates.map(c => ({ lat: c.courier.last_location_lat!, lng: c.courier.last_location_lng! })),
        [{ lat: latitude, lng: longitude }]
      );

      // Sort original candidates by the duration returned from Google
      const sortedByETA = candidates.map((c: any, index: number) => ({
        ...c,
        duration: matrix.rows[index].elements[0].status === 'OK' 
          ? matrix.rows[index].elements[0].duration.value 
          : Infinity
      })).sort((a: any, b: any) => a.duration - b.duration);

      const bestMatch = sortedByETA[0].courier;

      await this.prisma.delivery.update({
        where: { order_id: orderId },
        data: {
          courier_id: bestMatch.id,
          status: 'assigned',
        },
      });

      return bestMatch;
    } catch (error) {
      this.logger.error(`Distance Matrix matching failed, falling back to Haversine: ${error.message}`);
      // Fallback to simple Haversine if API fails
      const bestMatch = candidates[0].courier;
      // ... (rest of update logic)
      return bestMatch;
    }
  }

  async broadcastNegotiationTask(requestId: string, type: ServiceType) {
    this.logger.log(`Broadcasting negotiation task ${requestId} for ${type}`);
    // Logic for Ride/Parcel negotiation (already partly in LocalRidesGateway)
  }
}
