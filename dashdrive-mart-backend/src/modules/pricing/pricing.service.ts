import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OfferStatus } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PricingService {
    constructor(private prisma: PrismaService) { }

    async createOffer(orderId: string, proposedFee: number) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) throw new NotFoundException('Order not found');

        // 2-minute window for bidding
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

        return this.prisma.deliveryOffer.create({
            data: {
                orderId,
                proposedFee,
                currency: order.currency,
                expiresAt,
                status: OfferStatus.OPEN,
            },
        });
    }

    async submitBid(offerId: string, riderId: string, bidAmount: number) {
        const offer = await this.prisma.deliveryOffer.findUnique({
            where: { id: offerId },
        });

        if (!offer) throw new NotFoundException('Offer not found');
        if (offer.status !== OfferStatus.OPEN) {
            throw new BadRequestException('Offer is no longer open for bidding');
        }
        if (new Date() > offer.expiresAt) {
            await this.prisma.deliveryOffer.update({
                where: { id: offerId },
                data: { status: OfferStatus.EXPIRED },
            });
            throw new BadRequestException('Offer has expired');
        }

        return this.prisma.riderBid.create({
            data: {
                offerId,
                riderId,
                bidAmount,
            },
            include: {
                rider: true,
            },
        });
    }

    async getOfferBids(offerId: string) {
        const offer = await this.prisma.deliveryOffer.findUnique({
            where: { id: offerId },
            include: {
                bids: {
                    include: {
                        rider: true,
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });

        if (!offer) throw new NotFoundException('Offer not found');
        return offer.bids;
    }

    async acceptBid(bidId: string) {
        const bid = await this.prisma.riderBid.findUnique({
            where: { id: bidId },
            include: {
                offer: true,
            },
        });

        if (!bid) throw new NotFoundException('Bid not found');
        if (bid.offer.status !== OfferStatus.OPEN) {
            throw new BadRequestException('Offer is no longer open');
        }

        // Update offer status
        await this.prisma.deliveryOffer.update({
            where: { id: bid.offerId },
            data: { status: OfferStatus.ACCEPTED },
        });

        // Update or create delivery with accepted rider and fee
        return this.prisma.delivery.upsert({
            where: { orderId: bid.offer.orderId },
            update: {
                riderId: bid.riderId,
                deliveryFee: bid.bidAmount,
                status: 'ASSIGNED',
            },
            create: {
                orderId: bid.offer.orderId,
                riderId: bid.riderId,
                deliveryFee: bid.bidAmount,
                status: 'ASSIGNED',
            },
        });
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async expireOffers() {
        return this.prisma.deliveryOffer.updateMany({
            where: {
                expiresAt: { lt: new Date() },
                status: OfferStatus.OPEN,
            },
            data: { status: OfferStatus.EXPIRED },
        });
    }
}
