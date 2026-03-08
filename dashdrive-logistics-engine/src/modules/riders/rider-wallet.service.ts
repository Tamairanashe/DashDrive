import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RiderWalletService {
    constructor(private prisma: PrismaService) { }

    async getWalletSummary(riderId: string) {
        const rider = await (this.prisma.rider as any).findUnique({
            where: { id: riderId },
            select: {
                rideCredits: true,
                reservedCredits: true,
            },
        });

        if (!rider) throw new NotFoundException('Rider not found');

        // Calculate today's earnings (simplified for demo)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const deliveries = await this.prisma.delivery.findMany({
            where: {
                riderId,
                status: 'DELIVERED',
                deliveredAt: { gte: today },
            },
            select: { deliveryFee: true },
        });

        const todayEarnings = deliveries.reduce((sum, d) => sum + (d.deliveryFee || 0), 0);

        // Get suggested package (Starter if low, otherwise Basic)
        const suggestedPackage = await (this.prisma as any).creditPackage.findFirst({
            where: { isActive: true },
            orderBy: { price: rider.rideCredits < 5 ? 'asc' : 'desc' },
        });

        return {
            rideCredits: rider.rideCredits,
            reservedCredits: rider.reservedCredits,
            todayEarnings,
            todayTrips: deliveries.length,
            suggestedPackage,
        };
    }

    async getTransactionHistory(riderId: string, page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;

        const [transactions, total] = await Promise.all([
            (this.prisma as any).creditTransaction.findMany({
                where: { riderId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            (this.prisma as any).creditTransaction.count({
                where: { riderId },
            }),
        ]);

        return {
            transactions,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
            },
        };
    }

    async recharge(riderId: string, packageId: string) {
        const pkg = await (this.prisma as any).creditPackage.findUnique({
            where: { id: packageId, isActive: true },
        });

        if (!pkg) throw new NotFoundException('Credit package not found');

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + pkg.expiresInDays);

        return this.prisma.$transaction(async (tx) => {
            // Update rider credits
            const updatedRider = await (tx.rider as any).update({
                where: { id: riderId },
                data: {
                    rideCredits: { increment: pkg.credits },
                },
            });

            // Create transaction record
            const transaction = await (tx as any).creditTransaction.create({
                data: {
                    riderId,
                    amount: pkg.price,
                    credits: pkg.credits,
                    type: 'PURCHASE' as any,
                    expiresAt,
                },
            });

            return {
                newBalance: updatedRider.rideCredits,
                transaction,
            };
        });
    }
}
