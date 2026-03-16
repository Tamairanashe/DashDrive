import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SeatLockService } from './seat-lock.service';

@Injectable()
export class EventBookingService {
  constructor(
    private prisma: PrismaService,
    private seatLockService: SeatLockService,
  ) {}

  async listEvents() {
    return await (this.prisma as any).event.findMany({
      include: {
        _count: {
          select: { seats: true },
        },
      },
    });
  }

  async getEventSeats(eventId: string) {
    return await (this.prisma as any).seat.findMany({
      where: { event_id: eventId },
    });
  }

  async reserveSeat(eventId: string, seatId: string, userId: string) {
    // 1. Check if seat exists and is available in DB
    const seat = await (this.prisma as any).seat.findUnique({
      where: { id: seatId },
    });

    if (!seat || seat.event_id !== eventId) {
      throw new NotFoundException('Seat not found for this event');
    }

    if (seat.status !== 'available') {
      throw new ConflictException('Seat is already sold');
    }

    // 2. Attempt to lock in Redis (Atomic)
    const lockAcquired = await this.seatLockService.lockSeat(eventId, seatId, userId);
    
    if (!lockAcquired) {
      throw new ConflictException('Seat is currently being reserved by another user');
    }

    // 3. Create a temporary reservation in DB
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // 5 minute window

    const reservation = await (this.prisma as any).reservation.create({
      data: {
        user_id: userId,
        event_id: eventId,
        seat_id: seatId,
        expires_at: expiresAt,
        status: 'pending',
      },
    });

    return {
      message: 'Seat locked for 5 minutes',
      reservationId: reservation.id,
      expiresAt,
    };
  }

  async confirmBooking(reservationId: string, userId: string) {
    const reservation = await (this.prisma as any).reservation.findUnique({
      where: { id: reservationId },
      include: { seat: true },
    });

    if (!reservation || reservation.user_id !== userId) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.status !== 'pending') {
      throw new ConflictException('Reservation is no longer active');
    }

    if (new Date() > reservation.expires_at) {
      throw new ConflictException('Reservation has expired');
    }

    // Start Transaction
    return await this.prisma.$transaction(async (tx) => {
      // 1. Mark seat as SOLD
      await (tx as any).seat.update({
        where: { id: reservation.seat_id },
        data: { status: 'sold' },
      });

      // 2. Update reservation status
      await (tx as any).reservation.update({
        where: { id: reservation.id },
        data: { status: 'completed' },
      });

      // 3. Generate Ticket
      const ticket = await (tx as any).ticket.create({
        data: {
          reservation_id: reservation.id,
          seat_id: reservation.seat_id,
          qr_code: `TKT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        },
      });

      // 4. Release Redis Lock
      await this.seatLockService.releaseLock(reservation.event_id, reservation.seat_id);

      return ticket;
    });
  }
}
