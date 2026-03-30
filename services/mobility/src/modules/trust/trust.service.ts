import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TrustService {
  private readonly logger = new Logger(TrustService.name);

  constructor(private prisma: PrismaService) {}

  async logCancellation(dto: {
    rideId: string;
    cancelledByType: 'user' | 'driver';
    cancelledById: string;
    reason?: string;
    statusAtCancel: string;
  }) {
    const fee = this.calculateCancellationFee(dto.statusAtCancel, dto.cancelledByType);
    const compensation = dto.cancelledByType === 'user' ? fee * 0.75 : 0;

    return this.prisma.rideCancellation.create({
      data: {
        ride_id: dto.rideId,
        cancelled_by_type: dto.cancelledByType,
        cancelled_by_id: dto.cancelledById,
        reason: dto.reason,
        fee_amount: fee,
        driver_compensation: compensation,
        status_at_cancel: dto.statusAtCancel,
      },
    });
  }

  private calculateCancellationFee(status: string, type: string): number {
    if (type === 'driver') return 0; // Drivers are penalized via score, not immediate fee for now

    switch (status) {
      case 'requested': return 0;
      case 'driver_selected': return 0.5;
      case 'driver_arriving': return 2.0;
      case 'driver_arrived': return 5.0;
      default: return 0;
    }
  }

  async updateDriverReliability(driverId: string, action: 'completion' | 'cancellation' | 'acceptance') {
    const metrics = await this.prisma.driverReliability.findUnique({
      where: { driver_id: driverId },
    });

    if (!metrics) {
      return this.prisma.driverReliability.create({
        data: {
          driver_id: driverId,
          total_trips_requested: 1,
          trips_accepted: action === 'acceptance' ? 1 : 0,
          trips_completed: action === 'completion' ? 1 : 0,
          cancellations_count: action === 'cancellation' ? 1 : 0,
        },
      });
    }

    const data: any = {
      total_trips_requested: metrics.total_trips_requested + (action === 'acceptance' ? 1 : 0),
      trips_accepted: metrics.trips_accepted + (action === 'acceptance' ? 1 : 0),
      trips_completed: metrics.trips_completed + (action === 'completion' ? 1 : 0),
      cancellations_count: metrics.cancellations_count + (action === 'cancellation' ? 1 : 0),
    };

    // Recalculate Score
    const acceptanceRate = data.trips_accepted / (data.total_trips_requested || 1);
    const completionRate = data.trips_completed / (data.trips_accepted || 1);
    const cancelRate = data.cancellations_count / (data.trips_accepted || 1);
    
    // Simplified formula: (completionRate * 0.6) + (acceptanceRate * 0.4) - (cancelRate * 0.5)
    data.current_reliability_score = Math.max(0, (completionRate * 0.6) + (acceptanceRate * 0.4) - (cancelRate * 0.5));

    return this.prisma.driverReliability.update({
      where: { driver_id: driverId },
      data,
    });
  }
}
