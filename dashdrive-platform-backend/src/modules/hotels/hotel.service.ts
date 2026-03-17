import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HotelService {
  constructor(private prisma: PrismaService) {}

  async searchHotels(city: string, checkIn: string, checkOut: string, guests: number = 1) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const hotels = await (this.prisma as any).hotel.findMany({
      where: {
        city: { contains: city, mode: 'insensitive' },
        isActive: true,
      },
      include: {
        roomTypes: {
          where: {
            isActive: true,
            maxGuests: { gte: guests }
          }
        }
      }
    });

    // Filter hotels with available rooms for the requested dates
    const results = [];
    for (const hotel of hotels) {
      const availableRooms = [];
      for (const rt of hotel.roomTypes) {
        const overlapping = await (this.prisma as any).hotelBooking.count({
          where: {
            roomTypeId: rt.id,
            status: { not: 'cancelled' },
            checkIn: { lt: checkOutDate },
            checkOut: { gt: checkInDate },
          }
        });
        if (overlapping < rt.totalInventory) {
          availableRooms.push({ ...rt, availableCount: rt.totalInventory - overlapping });
        }
      }
      if (availableRooms.length > 0) {
        results.push({ ...hotel, roomTypes: availableRooms });
      }
    }

    return { hotels: results, checkIn, checkOut, guests };
  }

  async getRoomTypes(hotelId: string) {
    return (this.prisma as any).hotelRoomType.findMany({
      where: { hotelId, isActive: true },
    });
  }

  async bookRoom(data: {
    userId: string;
    roomTypeId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  }) {
    return (this.prisma as any).$transaction(async (tx: any) => {
      // 1. Validate room type
      const roomType = await tx.hotelRoomType.findUnique({
        where: { id: data.roomTypeId },
        include: { hotel: true }
      });
      if (!roomType) throw new NotFoundException('Room type not found');

      const checkInDate = new Date(data.checkIn);
      const checkOutDate = new Date(data.checkOut);
      const totalNights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      if (totalNights <= 0) throw new BadRequestException('Check-out must be after check-in');

      // 2. Check real availability
      const overlapping = await tx.hotelBooking.count({
        where: {
          roomTypeId: data.roomTypeId,
          status: { not: 'cancelled' },
          checkIn: { lt: checkOutDate },
          checkOut: { gt: checkInDate },
        }
      });

      if (overlapping >= roomType.totalInventory) {
        throw new BadRequestException('No rooms available for selected dates');
      }

      const totalPrice = Number(roomType.pricePerNight) * totalNights;

      // 3. Check wallet and deduct
      const wallet = await tx.wallet.findUnique({ where: { user_id: data.userId } });
      if (!wallet || Number(wallet.balance) < totalPrice) {
        throw new BadRequestException('Insufficient wallet balance');
      }

      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: totalPrice } }
      });

      await tx.walletTransaction.create({
        data: {
          wallet_id: wallet.id,
          type: 'payment',
          amount: totalPrice,
          description: `Hotel Booking: ${roomType.hotel.name} - ${roomType.name} (${totalNights} nights)`,
          reference: `HTL-${Date.now()}`,
          status: 'completed'
        }
      });

      // 4. Create booking
      return tx.hotelBooking.create({
        data: {
          userId: data.userId,
          roomTypeId: data.roomTypeId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests: data.guests,
          totalPrice,
          status: 'confirmed',
          paymentStatus: 'paid',
        },
        include: {
          roomType: { include: { hotel: true } }
        }
      });
    }, { timeout: 15000 });
  }

  async cancelBooking(bookingId: string, userId?: string) {
    return (this.prisma as any).$transaction(async (tx: any) => {
      const booking = await tx.hotelBooking.findUnique({
        where: { id: bookingId },
        include: { roomType: true }
      });

      if (!booking) throw new NotFoundException('Booking not found');
      if (booking.status === 'cancelled') throw new BadRequestException('Booking already cancelled');

      // Refund to wallet
      const wallet = await tx.wallet.findUnique({ where: { user_id: booking.userId } });
      if (wallet) {
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: Number(booking.totalPrice) } }
        });

        await tx.walletTransaction.create({
          data: {
            wallet_id: wallet.id,
            type: 'credit',
            amount: Number(booking.totalPrice),
            description: `Hotel Refund: Booking ${bookingId.substring(0, 8)}`,
            reference: `HTL-REFUND-${Date.now()}`,
            status: 'completed'
          }
        });
      }

      return tx.hotelBooking.update({
        where: { id: bookingId },
        data: { status: 'cancelled', paymentStatus: 'refunded' }
      });
    }, { timeout: 15000 });
  }
}
