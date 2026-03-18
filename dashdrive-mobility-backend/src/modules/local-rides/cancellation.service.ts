import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TrustService } from '../trust/trust.service';
import { LocalRidesGateway } from './local-rides.gateway';

@Injectable()
export class CancellationService {
  private readonly logger = new Logger(CancellationService.name);

  constructor(
    private prisma: PrismaService,
    private trustService: TrustService,
    private gateway: LocalRidesGateway,
  ) {}

  async handleDriverCancellation(rideId: string, driverId: string, reason?: string) {
    const ride = await this.prisma.localRide.findUnique({
      where: { id: rideId },
      include: { request: true },
    });

    if (!ride) throw new Error('Ride not found');

    // 1. Log the cancellation and penalize driver
    await this.trustService.logCancellation({
      rideId,
      cancelledByType: 'driver',
      cancelledById: driverId,
      reason,
      statusAtCancel: ride.status,
    });

    await this.trustService.updateDriverReliability(driverId, 'cancellation');

    // 2. Logic based on status
    if (ride.status === 'en_route' || ride.status === 'driver_selected') {
      // Re-open the request for other drivers
      await this.prisma.localRideRequest.update({
        where: { id: ride.request_id },
        data: { status: 'requested' },
      });

      // Cleanup the active ride
      await this.prisma.localRide.delete({ where: { id: rideId } });

      // 3. Notify user and broadcast to nearby drivers again
      this.gateway.server.to(`ride_${ride.request_id}`).emit('driver_cancelled', {
        message: 'Your driver cancelled. Re-matching you with a new one...',
      });

      // Simplified re-broadcast
      this.gateway.server.emit('new_ride_request', ride.request);
    }
  }

  async handleUserCancellation(rideId: string, userId: string, reason?: string) {
    // Similar logic for user cancellation with fee handling
    // ...
  }
}
