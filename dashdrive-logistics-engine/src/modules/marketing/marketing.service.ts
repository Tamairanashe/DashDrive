import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DiscountType } from '@prisma/client';

@Injectable()
export class MarketingService {
    constructor(private prisma: PrismaService) { }

    private async validateStoreOwnership(merchantId: string, storeId: string) {
        const store = await this.prisma.store.findFirst({
            where: { id: storeId, merchantId },
        });
        if (!store) throw new ForbiddenException('Store not found or unauthorized');
    }

    async getMarketingStats(merchantId: string, storeId?: string) {
        if (storeId) await this.validateStoreOwnership(merchantId, storeId);

        const where = {
            merchantId,
            ...(storeId && { storeId }),
        };

        const [totalPromotions, activeCoupons, featuredItemsCount] = await Promise.all([
            this.prisma.promotion.count({ where }),
            this.prisma.coupon.count({ where: { ...where, isActive: true } }),
            this.prisma.featuredItem.count({ where: { ...where, isActive: true } }),
        ]);

        // Mocking some data for the frontend based on the UI requirements
        // In a real scenario, we'd calculate these from orders/redemptions
        return {
            totalRedemptions: 1284, // Mock
            promoSales: 8432.0, // Mock
            newCustomers: 342, // Mock
            clickRate: 4.2, // Mock
            stats: {
                totalPromotions,
                activeCoupons,
                featuredItemsCount,
            },
        };
    }

    async getCampaignImpact(merchantId: string, storeId?: string) {
        // This would ideally be a complex query joining orders and promotions
        // For now, providing mock data to match the UI expectations
        return [
            { name: 'Jan', redemptions: 400, sales: 2400 },
            { name: 'Feb', redemptions: 300, sales: 1398 },
            { name: 'Mar', redemptions: 200, sales: 9800 },
            { name: 'Apr', redemptions: 278, sales: 3908 },
            { name: 'May', redemptions: 189, sales: 4800 },
            { name: 'Jun', redemptions: 239, sales: 3800 },
        ];
    }

    async getFeaturedItems(merchantId: string, storeId?: string) {
        if (storeId) await this.validateStoreOwnership(merchantId, storeId);

        return this.prisma.featuredItem.findMany({
            where: {
                merchantId,
                ...(storeId && { storeId }),
                isActive: true,
            },
            include: {
                product: true,
            },
        });
    }

    async createPromotion(merchantId: string, data: any) {
        await this.validateStoreOwnership(merchantId, data.storeId);
        return this.prisma.promotion.create({
            data: {
                ...data,
                merchantId,
            },
        });
    }

    async createCoupon(merchantId: string, data: any) {
        await this.validateStoreOwnership(merchantId, data.storeId);
        return this.prisma.coupon.create({
            data: {
                ...data,
                merchantId,
            },
        });
    }

    async createFeaturedItem(merchantId: string, data: any) {
        await this.validateStoreOwnership(merchantId, data.storeId);
        return this.prisma.featuredItem.create({
            data: {
                ...data,
                merchantId,
            },
        });
    }

    async getPromotions(merchantId: string, storeId?: string) {
        return this.prisma.promotion.findMany({
            where: {
                merchantId,
                ...(storeId && { storeId }),
            },
        });
    }

    async getCoupons(merchantId: string, storeId?: string) {
        return this.prisma.coupon.findMany({
            where: {
                merchantId,
                ...(storeId && { storeId }),
            },
        });
    }

    async createCampaign(merchantId: string, data: any) {
        return this.prisma.campaign.create({
            data: {
                ...data,
                merchantId,
            },
        });
    }

    async getCampaigns(merchantId: string) {
        return this.prisma.campaign.findMany({
            where: { merchantId },
            include: {
                promotions: true,
                coupons: true,
            },
        });
    }

    async validateCoupon(code: string, storeId: string, orderAmount: number) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { code },
        });

        if (!coupon || !coupon.isActive) {
            throw new NotFoundException('Invalid or inactive coupon');
        }

        if (coupon.storeId !== storeId) {
            throw new ForbiddenException('Coupon not valid for this store');
        }

        const now = new Date();
        if (now < coupon.startDate || now > coupon.endDate) {
            throw new ForbiddenException('Coupon has expired or is not yet active');
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            throw new ForbiddenException('Coupon usage limit reached');
        }

        if (orderAmount < coupon.minOrderAmount) {
            throw new ForbiddenException(`Minimum order amount of ${coupon.minOrderAmount} required`);
        }

        let discount = 0;
        if (coupon.discountType === DiscountType.PERCENTAGE) {
            discount = (orderAmount * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
                discount = coupon.maxDiscountAmount;
            }
        } else {
            discount = coupon.discountValue;
        }

        return {
            couponId: coupon.id,
            discountAmount: discount,
            code: coupon.code,
        };
    }
}

