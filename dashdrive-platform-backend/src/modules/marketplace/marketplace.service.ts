import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MarketplaceService {
  constructor(private prisma: PrismaService) {}

  // Listings
  async createListing(data: Prisma.ListingCreateInput) {
    return this.prisma.listing.create({
      data,
      include: {
        location: true,
        photos: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    });
  }

  async getListings(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ListingWhereUniqueInput;
    where?: Prisma.ListingWhereInput;
    orderBy?: Prisma.ListingOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.listing.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        location: true,
        photos: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    });
  }

  async getListing(id: string) {
    return this.prisma.listing.findUnique({
      where: { id },
      include: {
        location: true,
        photos: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
        host: {
          select: {
            id: true,
            email: true,
            status: true,
            created_at: true,
          },
        },
      },
    });
  }

  // Bookings
  async checkAvailability(listingId: string, checkIn: Date, checkOut: Date): Promise<boolean> {
    const overlappingBookings = await this.prisma.booking.findFirst({
      where: {
        listing_id: listingId,
        status: { in: ['confirmed', 'pending'] },
        OR: [
          {
            check_in: { lte: checkIn },
            check_out: { gt: checkIn },
          },
          {
            check_in: { lt: checkOut },
            check_out: { gte: checkOut },
          },
          {
            check_in: { gte: checkIn },
            check_out: { lte: checkOut },
          },
        ],
      },
    });

    return !overlappingBookings;
  }

  async calculatePrice(listingId: string, checkIn: Date, checkOut: Date) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) throw new Error('Listing not found');

    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const nightlyPrice = Number(listing.price_per_night);
    const cleaningFee = listing.cleaning_fee ? Number(listing.cleaning_fee) : 0;
    
    // Service fee calculation (e.g., 10%)
    const serviceFee = nights * nightlyPrice * 0.1;
    
    const totalPrice = (nights * nightlyPrice) + cleaningFee + serviceFee;

    return {
      nights,
      nightlyPrice,
      cleaningFee,
      serviceFee,
      totalPrice,
    };
  }

  async createBooking(data: { listing_id: string; guest_id: string; check_in: string; check_out: string }) {
    const checkIn = new Date(data.check_in);
    const checkOut = new Date(data.check_out);

    const isAvailable = await this.checkAvailability(data.listing_id, checkIn, checkOut);
    if (!isAvailable) {
      throw new Error('Listing is not available for the selected dates');
    }

    const priceDetails = await this.calculatePrice(data.listing_id, checkIn, checkOut);

    return this.prisma.booking.create({
      data: {
        listing_id: data.listing_id,
        guest_id: data.guest_id,
        check_in: checkIn,
        check_out: checkOut,
        total_price: priceDetails.totalPrice,
        status: 'pending',
      },
    });
  }

  async processPayment(bookingId: string, userId: string, paymentMethod: string) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { listing: true },
      });

      if (!booking) throw new Error('Booking not found');
      if (booking.status !== 'pending') throw new Error('Booking is not in pending status');

      // If payment method is wallet, we'd normally call WalletService.
      // For this MVP, we'll simulate the transaction or directly update tables.
      // In a real scenario, we'd inject WalletService.
      
      const payment = await tx.marketplacePayment.create({
        data: {
          booking_id: bookingId,
          amount: booking.total_price,
          status: 'completed',
          payment_method: paymentMethod,
        },
      });

      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'confirmed' },
      });

      return { booking: updatedBooking, payment };
    });
  }

  async getUserBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { guest_id: userId },
      include: {
        listing: {
          include: {
            location: true,
          },
        },
      },
    });
  }

  // Reviews
  async createReview(data: Prisma.ReviewCreateInput) {
    return this.prisma.review.create({
      data,
    });
  }

  async getListingReviews(listingId: string) {
    return this.prisma.review.findMany({
      where: {
        booking: {
          listing_id: listingId,
        },
      },
      include: {
        reviewer: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }
}
