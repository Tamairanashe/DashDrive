import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PricingService } from '../pricing/pricing.service';
import { GeoService } from '../geo/geo.service';
import { DispatchGateway } from '../dispatch/dispatch.gateway';
import { CreateNegotiatedTripDto } from './dto/create-negotiated-trip.dto';
import {
  OrderStatus,
  OfferStatus,
  DispatchAttemptStatus,
} from '@prisma/client';
import { generateOrderNumber } from '../../common/utils/order-number.util';

@Injectable()
export class NegotiationService {
  private readonly logger = new Logger(NegotiationService.name);

  constructor(
    private prisma: PrismaService,
    private pricingService: PricingService,
    private geoService: GeoService,
    private dispatchGateway: DispatchGateway,
  ) {}

  async createNegotiatedTrip(dto: CreateNegotiatedTripDto) {
    // 1. Validate Bid against Minimum Price Floor
    const quote = await this.pricingService.getNegotiationQuote({
      countryCode: dto.countryCode,
      pickup_lat: dto.pickup_lat,
      pickup_lng: dto.pickup_lng,
      dropoff_lat: dto.dropoff_lat,
      dropoff_lng: dto.dropoff_lng,
      package_size: 'MEDIUM', // Default for rides
      delivery_type: 'STANDARD',
      vertical: dto.vertical,
    });

    if (dto.rider_bid < quote.minimum_price) {
      throw new BadRequestException(
        `Bid too low. Minimum allowed price is ${quote.minimum_price}`,
      );
    }

    // 2. Resolve Country and Currency
    const country = await this.prisma.country.findUnique({
      where: { code: dto.countryCode },
    });
    if (!country) throw new BadRequestException('Invalid country code');

    // 3. Resolve or Create System Store for the Vertical
    // For simplicity in this step, we'll try to find a store named 'System [Vertical]'
    // or fallback to a hardcoded UUID if we were in a seeded environment.
    // Here we'll look for a system merchant first.
    let systemMerchant = await this.prisma.merchant.findFirst({
      where: { email: 'system@dashdrive.com' },
    });

    if (!systemMerchant) {
      // Fallback for demo/dev: use first merchant or create one
      systemMerchant =
        (await this.prisma.merchant.findFirst()) ||
        (await this.prisma.merchant.create({
          data: {
            email: 'system@dashdrive.com',
            passwordHash: 'SYSTEM_PROTECTED',
            storeName: 'DashDrive System',
            countryId: country.id,
          },
        }));
    }

    let systemStore = await this.prisma.store.findFirst({
      where: {
        merchantId: systemMerchant.id,
        name: `DashDrive ${dto.vertical}`,
      },
    });

    if (!systemStore) {
      systemStore = await this.prisma.store.create({
        data: {
          merchantId: systemMerchant.id,
          name: `DashDrive ${dto.vertical}`,
          address: 'System',
          city: 'System',
          currency: country.currency,
          timezone: country.timezone,
          latitude: -17.8248,
          longitude: 31.053,
        },
      });
    }

    // 4. Create Order & DeliveryOffer
    const order = await this.prisma.order.create({
      data: {
        storeId: systemStore.id,
        merchantId: systemMerchant.id,
        orderNumber: generateOrderNumber(),
        status: OrderStatus.PENDING,
        currency: country.currency,
        subtotal: dto.rider_bid,
        totalAmount: dto.rider_bid,
        deliveryFee: 0,
        customerName: 'Guest User',
        customerPhone: '00000000',
        deliveryAddress: dto.destination,
        deliveryOffer: {
          create: {
            proposedFee: dto.rider_bid,
            currency: country.currency,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 mins
            status: OfferStatus.OPEN,
          },
        },
      },
      include: { deliveryOffer: true },
    });

    if (!order.deliveryOffer) {
      throw new Error('Failed to create delivery offer');
    }

    this.logger.log(
      `Negotiated ${dto.vertical} trip created: ${order.orderNumber} with bid ${dto.rider_bid}`,
    );

    // Broadcast to nearby drivers
    await this.broadcastNegotiatedTrip(
      order.id,
      dto.pickup_lat,
      dto.pickup_lng,
    );

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      suggestedPrice: quote.suggested_price,
      minPrice: quote.minimum_price,
      bid: dto.rider_bid,
      offerId: order.deliveryOffer.id,
      vertical: dto.vertical,
      status: 'OPEN',
    };
  }

  async broadcastNegotiatedTrip(orderId: string, lat: number, lng: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { deliveryOffer: true, items: true },
    });

    if (!order || !order.deliveryOffer) return;

    // 1. Find nearby riders (within 5km)
    const nearbyRiderIds = await this.geoService.findNearbyRiders(lat, lng, 5);

    // 2. Filter online and active riders
    const availableRiders = await this.prisma.rider.findMany({
      where: {
        id: { in: nearbyRiderIds },
        isOnline: true,
        isActive: true,
      },
    });

    // 3. Emit request to each rider
    for (const rider of availableRiders) {
      this.dispatchGateway.emitDeliveryRequest(rider.id, {
        type: 'NEGOTIATION',
        orderId: order.id,
        offerId: order.deliveryOffer.id,
        pickup: order.items[0]?.name || 'Ride', // Using item name if any, else generic
        dropoff: order.deliveryAddress,
        riderBid: order.deliveryOffer.proposedFee,
        vertical: order.items[0]?.name === 'PARCEL' ? 'PARCEL' : 'RIDE',
      });
    }

    this.logger.log(
      `Broadcasted trip ${order.orderNumber} to ${availableRiders.length} riders`,
    );
  }

  async submitCounterOffer(
    riderId: string,
    offerId: string,
    bidAmount: number,
  ) {
    const offer = await this.prisma.deliveryOffer.findUnique({
      where: { id: offerId },
      include: { order: true },
    });

    if (!offer || offer.status !== OfferStatus.OPEN) {
      throw new BadRequestException('Offer is no longer open or not found');
    }

    // Create RiderBid
    await this.prisma.riderBid.create({
      data: {
        offerId,
        riderId,
        bidAmount,
      },
    });

    this.logger.log(
      `Rider ${riderId} countered with ${bidAmount} for offer ${offerId}`,
    );
    // Notify the rider/customer (via some other gateway or event if needed)
  }

  async acceptNegotiatedOffer(orderId: string, bidId: string) {
    const bid = await this.prisma.riderBid.findUnique({
      where: { id: bidId },
      include: { offer: true },
    });

    if (!bid || bid.offer.status !== OfferStatus.OPEN) {
      throw new BadRequestException('Bid or Offer not found/active');
    }

    const riderId = bid.riderId;
    const finalPrice = bid.bidAmount;

    // Transactional update: Accept bid, Close offer, Update Order, Create Delivery
    await this.prisma.$transaction([
      this.prisma.deliveryOffer.update({
        where: { id: bid.offerId },
        data: { status: OfferStatus.ACCEPTED },
      }),
      this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.ASSIGNED_TO_RIDER,
          subtotal: finalPrice,
          totalAmount: finalPrice,
        },
      }),
      this.prisma.delivery.create({
        data: {
          orderId,
          riderId,
          status: 'ASSIGNED',
          deliveryFee: finalPrice, // In this model, the full bid is the delivery fee
        },
      }),
    ]);

    this.logger.log(
      `Ride ${orderId} accepted with rider ${riderId} at price ${finalPrice}`,
    );
    return { status: 'ACCEPTED', riderId, finalPrice };
  }
}
