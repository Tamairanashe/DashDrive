import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GeoService } from '../geo/geo.service';
import { DeliveryStatus } from '@prisma/client';
import { GoogleMapsService } from '../../common/providers/google-maps/google-maps.service';

@Injectable()
export class RoutingService {
  private readonly logger = new Logger(RoutingService.name);

  constructor(
    private prisma: PrismaService,
    private geoService: GeoService,
    private googleMaps: GoogleMapsService,
  ) {}

  /**
   * Calculates the optimal route for a batch of deliveries using Google Maps Routes API.
   * Falls back to Greedy TSP if Google Maps is unavailable or fails.
   */
  async optimizeBatch(riderId: string) {
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

    if (deliveries.length <= 1) return deliveries;

    const rider = await this.prisma.rider.findUnique({ where: { id: riderId } });
    if (!rider || !rider.latitude || !rider.longitude) {
      this.logger.warn(`No location for rider ${riderId}`);
      return deliveries;
    }

    const origin = { lat: rider.latitude, lng: rider.longitude };
    
    // Map deliveries to their current target location
    const waypoints = deliveries.map(d => {
      if (d.status === DeliveryStatus.ASSIGNED || d.status === DeliveryStatus.ACCEPTED) {
        return {
          lat: (d.order.store as any).latitude || (d.order.store as any).lat || 0,
          lng: (d.order.store as any).longitude || (d.order.store as any).lng || 0,
        };
      } else {
        return {
          lat: (d.order as any).destLat || (d.order as any).latitude || 0,
          lng: (d.order as any).destLng || (d.order as any).longitude || 0,
        };
      }
    });

    try {
      const result = await this.googleMaps.optimizeRoute(origin, waypoints);
      
      // Reorder deliveries based on Google's optimized waypoint order
      // result.optimizedOrder is an array of indices into our waypoints/deliveries array
      const optimizedDeliveries = result.optimizedOrder.map(index => deliveries[index]);
      
      // Handle the case where Google's optimized order might be shorter than waypoint list
      // (Google returns indices of waypoints EXCEPT origin/destination if specified separately)
      // Our implementation in GoogleMapsService uses destination = waypoints[last] if not provided.
      
      await this.prisma.$transaction(
        optimizedDeliveries.map((delivery, index) =>
          this.prisma.delivery.update({
            where: { id: delivery.id },
            data: { sequence: index + 1 },
          }),
        ),
      );

      return optimizedDeliveries;
    } catch (error) {
      this.logger.error(`Google Route Optimization failed, falling back to Greedy: ${error.message}`);
      return this.greedyOptimize(rider, deliveries);
    }
  }

  private async greedyOptimize(rider: any, deliveries: any[]) {
    let currentLocation = { lat: rider.latitude, lng: rider.longitude };
    const unvisited = [...deliveries];
    const routeSequence: any[] = [];

    while (unvisited.length > 0) {
      let nearestIndex = 0;
      let minDistance = Number.MAX_VALUE;

      for (let i = 0; i < unvisited.length; i++) {
        const delivery = unvisited[i];
        const target = this.getDeliveryTarget(delivery);

        const dist = this.geoService.calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          target.lat,
          target.lng,
        );

        if (dist < minDistance) {
          minDistance = dist;
          nearestIndex = i;
        }
      }

      const nextStop = unvisited.splice(nearestIndex, 1)[0];
      routeSequence.push(nextStop);
      currentLocation = this.getDeliveryTarget(nextStop);
    }

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

  private getDeliveryTarget(delivery: any) {
    if (delivery.status === DeliveryStatus.ASSIGNED || delivery.status === DeliveryStatus.ACCEPTED) {
      return {
        lat: (delivery.order.store as any).latitude || (delivery.order.store as any).lat || 0,
        lng: (delivery.order.store as any).longitude || (delivery.order.store as any).lng || 0,
      };
    } else {
      return {
        lat: (delivery.order as any).destLat || (delivery.order as any).latitude || 0,
        lng: (delivery.order as any).destLng || (delivery.order as any).longitude || 0,
      };
    }
  }
}
