import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

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

  // Messaging
  async createMessage(data: {
    senderId: string;
    receiverId: string;
    listingId?: string;
    messageText: string;
  }) {
    return this.prisma.message.create({
      data: {
        sender_id: data.senderId,
        receiver_id: data.receiverId,
        listing_id: data.listingId,
        message_text: data.messageText,
      },
    });
  }

  // --- Retail & Unified Unification ---

  async getStores(category?: string) {
    return (this.prisma as any).marketplaceStore.findMany({
      where: category ? { category } : {},
      include: { categories: true }
    });
  }

  async getStoreProducts(storeId: string) {
    return (this.prisma as any).marketplaceProduct.findMany({
      where: { storeId, isActive: true },
      include: { category: true }
    });
  }

  async createMarketplaceOrder(userId: string, storeId: string, items: { productId: string, quantity: number }[], instructions?: string) {
    return (this.prisma as any).$transaction(async (tx: any) => {
      // 1. Get products to calculate price
      const productIds = items.map(i => i.productId);
      const products = await tx.marketplaceProduct.findMany({
        where: { id: { in: productIds } }
      });

      let totalAmount = 0;
      const orderItemsData = items.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        const price = Number(product.price);
        totalAmount += price * item.quantity;
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price
        };
      });

      // 2. Create Order
      const order = await tx.marketplaceOrder.create({
        data: {
          userId,
          storeId,
          totalAmount,
          instructions,
          status: 'pending',
          items: {
            create: orderItemsData
          }
        },
        include: { items: true }
      });

      return order;
    });
  }

  async searchMarketplace(query: string) {
    const [listings, products, stores] = await Promise.all([
      this.prisma.listing.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 10
      }),
      (this.prisma as any).marketplaceProduct.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 10,
        include: { store: true }
      }),
      (this.prisma as any).marketplaceStore.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 10
      })
    ]);

    return {
      listings: listings.map(l => ({ ...l, type: 'STAY' })),
      products: products.map(p => ({ ...p, type: 'PRODUCT' })),
      stores: stores.map(s => ({ ...s, type: 'STORE' }))
    };
  }
}
