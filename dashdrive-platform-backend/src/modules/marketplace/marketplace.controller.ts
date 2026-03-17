import { Controller, Get, Post, Body, Param, Query, Put, Delete } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { Prisma } from '@prisma/client';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post('listings')
  createListing(@Body() data: Prisma.ListingCreateInput) {
    return this.marketplaceService.createListing(data);
  }

  @Get('listings')
  getListings(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('city') city?: string,
    @Query('propertyType') propertyType?: string,
  ) {
    const where: Prisma.ListingWhereInput = {};
    if (city) {
      where.location = {
        city: {
          contains: city,
          mode: 'insensitive' as Prisma.QueryMode,
        },
      };
    }
    if (propertyType) {
      where.property_type = propertyType;
    }

    return this.marketplaceService.getListings({
      skip,
      take,
      where,
    });
  }

  @Get('listings/:id')
  getListing(@Param('id') id: string) {
    return this.marketplaceService.getListing(id);
  }

  @Get('listings/:id/price')
  getPricePreview(
    @Param('id') id: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    return this.marketplaceService.calculatePrice(id, new Date(checkIn), new Date(checkOut));
  }

  @Get('listings/:id/availability')
  getAvailability(
    @Param('id') id: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    return this.marketplaceService.checkAvailability(id, new Date(checkIn), new Date(checkOut));
  }

  @Post('messages')
  createMessage(@Body() data: { senderId: string; receiverId: string; listingId?: string; messageText: string }) {
    return this.marketplaceService.createMessage(data);
  }

  // --- Retail & Search ---

  @Get('stores')
  getStores(@Body('category') category?: string) {
    return this.marketplaceService.getStores(category);
  }

  @Get('stores/:id/products')
  getStoreProducts(@Param('id') id: string) {
    return this.marketplaceService.getStoreProducts(id);
  }

  @Get('search')
  search(@Body('q') query: string) {
    return this.marketplaceService.searchMarketplace(query);
  }

  @Post('orders')
  createOrder(@Body() data: { userId: string; storeId: string; items: { productId: string; quantity: number }[]; instructions?: string }) {
    return this.marketplaceService.createMarketplaceOrder(data.userId, data.storeId, data.items, data.instructions);
  }

  @Post('bookings')
  createBooking(@Body() data: { listing_id: string; guest_id: string; check_in: string; check_out: string }) {
    return this.marketplaceService.createBooking(data);
  }

  @Post('bookings/:id/confirm')
  confirmBooking(
    @Param('id') id: string,
    @Body() data: { userId: string; paymentMethod: string },
  ) {
    return this.marketplaceService.processPayment(id, data.userId, data.paymentMethod);
  }

  @Get('users/:userId/bookings')
  getUserBookings(@Param('userId') userId: string) {
    return this.marketplaceService.getUserBookings(userId);
  }

  @Post('reviews')
  createReview(@Body() data: Prisma.ReviewCreateInput) {
    return this.marketplaceService.createReview(data);
  }

  @Get('listings/:id/reviews')
  getListingReviews(@Param('id') id: string) {
    return this.marketplaceService.getListingReviews(id);
  }
}
