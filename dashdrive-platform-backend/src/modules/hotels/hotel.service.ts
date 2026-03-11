import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HotelService {
  constructor(private prisma: PrismaService) {}

  async searchHotels(city: string, checkIn: string, checkOut: string, guests: number = 1) {
    // In-memory mock until DB migration
    const mockHotels = [
      { id: 'h-1', name: 'DashDrive Grand Hotel', city, starRating: 5, pricePerNight: 120, imageUrl: null },
      { id: 'h-2', name: 'City Center Inn', city, starRating: 3, pricePerNight: 45, imageUrl: null },
      { id: 'h-3', name: 'Sunset Business Suites', city, starRating: 4, pricePerNight: 85, imageUrl: null },
    ];
    return { hotels: mockHotels, checkIn, checkOut, guests };
  }

  async getRoomTypes(hotelId: string) {
    return [
      { id: 'rt-1', hotelId, name: 'Standard', maxGuests: 2, bedType: 'double', pricePerNight: 45, totalRooms: 20, isActive: true },
      { id: 'rt-2', hotelId, name: 'Deluxe', maxGuests: 2, bedType: 'queen', pricePerNight: 85, totalRooms: 10, isActive: true },
      { id: 'rt-3', hotelId, name: 'Suite', maxGuests: 4, bedType: 'king', pricePerNight: 150, totalRooms: 5, isActive: true },
    ];
  }

  async bookRoom(data: {
    userId: string; roomTypeId: string;
    checkIn: string; checkOut: string; guests: number;
  }) {
    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);
    const totalNights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const pricePerNight = 85; // Would come from DB lookup
    return {
      id: `booking-${Date.now()}`,
      userId: data.userId,
      roomTypeId: data.roomTypeId,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests,
      totalNights,
      pricePerNight,
      totalPrice: totalNights * pricePerNight,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: new Date(),
    };
  }

  async cancelBooking(bookingId: string) {
    return { id: bookingId, status: 'cancelled', cancelledAt: new Date() };
  }
}
