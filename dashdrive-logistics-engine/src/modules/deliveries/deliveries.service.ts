import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PricingService, PricingQuoteDto } from '../pricing/pricing.service';
import { DispatchService } from '../dispatch/dispatch.service';
import { Merchant, OrderStatus } from '@prisma/client';

@Injectable()
export class DeliveriesService {
    private readonly logger = new Logger(DeliveriesService.name);

    constructor(
        private prisma: PrismaService,
        private pricingService: PricingService,
        private dispatchService: DispatchService,
    ) { }

    async getQuote(dto: PricingQuoteDto) {
        return this.pricingService.getDeliveryQuote(dto);
    }

    async createDelivery(merchant: Merchant, body: any) {
        const {
            pickup_address,
            dropoff_address,
            pickup_lat,
            pickup_lng,
            dropoff_lat,
            dropoff_lng,
            customer_name,
            customer_phone,
            package_size,
            delivery_type,
            external_reference,
        } = body;

        // 1. Get Country Code from Merchant
        const merchantWithCountry = await this.prisma.merchant.findUnique({
            where: { id: merchant.id },
            include: { country: true, stores: true },
        });

        if (!merchantWithCountry) {
            throw new NotFoundException('Merchant record not found.');
        }

        // Use the first store for now as a "virtual store" for the enterprise API
        const store = merchantWithCountry.stores[0];
        if (!store) {
            throw new NotFoundException('Merchant has no active stores. Please create one in the dashboard.');
        }

        // 2. Get Quote to calculate costs
        const quote = await this.pricingService.getDeliveryQuote({
            countryCode: merchantWithCountry.country.code,
            pickup_lat,
            pickup_lng,
            dropoff_lat,
            dropoff_lng,
            package_size,
            delivery_type,
            merchantPlan: 'ENTERPRISE', // Defaulting API users to Enterprise mods for now
        });

        // 3. Create the Order (Enterprise API creates orders that skip the cart flow)
        // We use a unique order number for transparency
        const orderNumber = `EXT-${Math.random().toString(36).substring(7).toUpperCase()}`;

        const order = await this.prisma.order.create({
            data: {
                storeId: store.id,
                merchantId: merchant.id,
                orderNumber,
                status: OrderStatus.READY, // API orders skip PENDING/CONFIRMED and go straight to READY for dispatch
                currency: merchantWithCountry.country.currency,
                subtotal: quote.price, // Enterprise API doesn't usually track individual items
                totalAmount: quote.price,
                deliveryFee: quote.price,
                customerName: customer_name,
                customerPhone: customer_phone,
                deliveryAddress: dropoff_address,
            }
        });

        // 4. Trigger Dispatch Flow
        await this.dispatchService.startDispatchFlow(order.id);

        return {
            order_id: order.id,
            tracking_number: order.orderNumber,
            status: order.status,
            price: quote.price,
            estimated_arrival: quote.estimated_time,
            currency: order.currency,
            tracking_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/track/${order.id}`,
        };
    }

    async getPublicStatus(orderId: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { delivery: { include: { rider: true } } }
        });

        if (!order) throw new NotFoundException('Delivery not found');

        return {
            id: order.id,
            tracking_number: order.orderNumber,
            status: order.status,
            delivery: order.delivery ? {
                status: order.delivery.status,
                rider: order.delivery.rider ? {
                    name: order.delivery.rider.name,
                    vehicle: order.delivery.rider.vehicleType,
                    lat: order.delivery.rider.latitude,
                    lng: order.delivery.rider.longitude,
                } : null,
            } : null,
        };
    }

    async getDeliveryStatus(merchant: Merchant, orderId: string) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, merchantId: merchant.id },
            include: { delivery: { include: { rider: true } } }
        });

        if (!order) throw new NotFoundException('Delivery not found');

        return {
            id: order.id,
            tracking_number: order.orderNumber,
            status: order.status,
            delivery: order.delivery ? {
                status: order.delivery.status,
                rider: order.delivery.rider ? {
                    name: order.delivery.rider.name,
                    phone: order.delivery.rider.phone,
                    lat: order.delivery.rider.latitude,
                    lng: order.delivery.rider.longitude,
                } : null,
            } : null,
        };
    }
}
