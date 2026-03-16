import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GeoService } from '../geo/geo.service';
import { DeliveryStatus } from '@prisma/client';

@Injectable()
export class RoutingService {
  private readonly logger = new Logger(RoutingService.name);

  constructor(
    private prisma: PrismaService,
    private geoService: GeoService,
  ) {}

  /**
   * Calculates the optimal route for a batch of deliveries using a greedy TSP (Nearest Neighbor) approach.
   * Returns the ordered array of deliveries.
   */
  async optimizeBatch(riderId: string) {
    // Fetch active deliveries for the rider
    const deliveries = await this.prisma.delivery.findMany({
      where: {
        riderId,
        status: {
          in: [
            DeliveryStatus.ASSIGNED,
            DeliveryStatus.ACCEPTED,
            DeliveryStatus.PICKED_UP,
          ],
        },
      },
      include: {
        order: {
          include: { store: true },
        },
      },
    });

    if (deliveries.length <= 1) {
      // Nothing to optimize if 1 or 0 deliveries
      return deliveries;
    }

    const rider = await this.prisma.rider.findUnique({
      where: { id: riderId },
    });
    if (!rider || !rider.latitude || !rider.longitude) {
      this.logger.warn(
        `Cannot optimize route for rider ${riderId} - no location data`,
      );
      return deliveries; // Return unoptimized
    }

    let currentLocation = { lat: rider.latitude, lng: rider.longitude };
    const unvisited = [...deliveries];
    const routeSequence: typeof deliveries = [];

    // Greedy TSP: Find the nearest next stop
    while (unvisited.length > 0) {
      let nearestIndex = 0;
      let minDistance = Number.MAX_VALUE;

      for (let i = 0; i < unvisited.length; i++) {
        const delivery = unvisited[i];
        let targetLocation;

        // If not picked up, next stop is the store. Otherwise, next stop is the delivery address.
        if (
          delivery.status === DeliveryStatus.ASSIGNED ||
          delivery.status === DeliveryStatus.ACCEPTED
        ) {
          // We need store lat/lng. Using 0,0 fallback if missing for compilation
          targetLocation = {
            lat: (delivery.order.store as any).lat || 0,
            lng: (delivery.order.store as any).lng || 0,
          };
        } else {
          // We need destination lat/lng. Using 0,0 fallback
          targetLocation = {
            lat: (delivery.order as any).destLat || 0,
            lng: (delivery.order as any).destLng || 0,
          };
        }

        const dist = this.geoService.calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          targetLocation.lat,
          targetLocation.lng,
        );

        if (dist < minDistance) {
          minDistance = dist;
          nearestIndex = i;
        }
      }

      const nextStop = unvisited.splice(nearestIndex, 1)[0];
      routeSequence.push(nextStop);

      // Update current location to this stop's location
      if (
        nextStop.status === DeliveryStatus.ASSIGNED ||
        nextStop.status === DeliveryStatus.ACCEPTED
      ) {
        currentLocation = {
          lat: (nextStop.order.store as any).lat || 0,
          lng: (nextStop.order.store as any).lng || 0,
        };
      } else {
        currentLocation = {
          lat: (nextStop.order as any).destLat || 0,
          lng: (nextStop.order as any).destLng || 0,
        };
      }
    }

    // Save sequence to DB
    await this.prisma.$transaction(
      routeSequence.map((delivery, index) =>
        this.prisma.delivery.update({
          where: { id: delivery.id },
          data: { sequence: index + 1 },
        }),
      ),
    );

    return routeSequence;
  }
}
