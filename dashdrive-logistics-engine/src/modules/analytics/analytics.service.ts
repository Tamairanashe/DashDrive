import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    private async validateStoreOwnership(merchantId: string, storeId: string) {
        const store = await this.prisma.store.findFirst({
            where: { id: storeId, merchantId }
        });
        if (!store) throw new ForbiddenException('Store not found or unauthorized');
    }

    private getDateFilter(startDate?: string, endDate?: string) {
        if (!startDate && !endDate) return {};

        return {
            createdAt: {
                gte: startDate ? new Date(startDate) : undefined,
                lte: endDate ? new Date(endDate) : undefined,
            },
        };
    }

    async getDashboardMetrics(merchantId: string, storeId?: string, startDate?: string, endDate?: string) {
        if (storeId) await this.validateStoreOwnership(merchantId, storeId);

        const dateFilter = this.getDateFilter(startDate, endDate);
        const where = {
            merchantId,
            ...(storeId && { storeId }),
            ...dateFilter
        };

        const [totalOrders, revenue, pendingOrders] = await Promise.all([
            this.prisma.order.count({ where }),
            this.prisma.order.aggregate({
                where: { ...where, status: OrderStatus.DELIVERED },
                _sum: { totalAmount: true },
            }),
            this.prisma.order.count({
                where: { ...where, status: OrderStatus.PENDING },
            }),
        ]);

        return {
            totalOrders,
            totalRevenue: revenue._sum.totalAmount || 0,
            pendingOrders,
        };
    }

    async getSalesOverTime(merchantId: string, storeId?: string, startDate?: string, endDate?: string) {
        if (storeId) await this.validateStoreOwnership(merchantId, storeId);

        const storeFilter = storeId ? `AND "storeId" = '${storeId}'` : '';
        const startFilter = startDate ? `AND "createdAt" >= '${startDate}'` : '';
        const endFilter = endDate ? `AND "createdAt" <= '${endDate}'` : '';

        // PostgreSQL specific date grouping for daily trends
        const sales = await this.prisma.$queryRawUnsafe(`
        SELECT 
            DATE_TRUNC('day', "createdAt") as date,
            SUM("totalAmount") as revenue,
            COUNT(id) as count
        FROM "Order"
        WHERE "merchantId" = '${merchantId}'
        AND "status" = 'DELIVERED'
        ${storeFilter}
        ${startFilter}
        ${endFilter}
        GROUP BY 1
        ORDER BY 1 ASC
    `);

        return sales;
    }

    async getTopProducts(merchantId: string, storeId?: string) {
        if (storeId) await this.validateStoreOwnership(merchantId, storeId);

        const result = await this.prisma.orderItem.groupBy({
            by: ['productId', 'name'],
            where: {
                order: {
                    merchantId,
                    ...(storeId && { storeId }),
                    status: OrderStatus.DELIVERED
                }
            },
            _sum: { quantity: true, totalPrice: true },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: 10,
        });

        return result.map((item) => ({
            productId: item.productId,
            name: item.name,
            totalSold: item._sum.quantity,
            revenue: item._sum.totalPrice,
        }));
    }

    async getRevenueByCurrency(merchantId: string, storeId?: string) {
        if (storeId) await this.validateStoreOwnership(merchantId, storeId);

        const result = await this.prisma.order.groupBy({
            by: ['currency'],
            where: {
                merchantId,
                ...(storeId && { storeId }),
                status: OrderStatus.DELIVERED,
            },
            _sum: { totalAmount: true },
        });

        return result.map(r => ({
            currency: r.currency,
            amount: r._sum.totalAmount || 0
        }));
    }

    async getOrderStatusBreakdown(merchantId: string, storeId?: string) {
        if (storeId) await this.validateStoreOwnership(merchantId, storeId);

        const counts = await this.prisma.order.groupBy({
            by: ['status'],
            where: {
                merchantId,
                ...(storeId && { storeId })
            },
            _count: { id: true }
        });

        return counts.map(c => ({
            status: c.status,
            count: c._count.id
        }));
    }

    async getCountryPerformance(merchantId: string) {
        const performance = await this.prisma.$queryRawUnsafe(`
            SELECT 
                c.name as "countryName",
                c.code as "countryCode",
                COUNT(o.id) as "totalOrders",
                SUM(o."totalAmount") as "totalRevenue",
                o.currency
            FROM "Order" o
            JOIN "Store" s ON o."storeId" = s.id
            JOIN "Country" c ON s."currency" = c.currency -- Crude join, ideally store has countryId
            WHERE o."merchantId" = '${merchantId}'
            AND o."status" = 'DELIVERED'
            GROUP BY c.name, c.code, o.currency
            ORDER BY "totalRevenue" DESC
        `);

        return performance;
    }

    async getMobileTodayStats(merchantId: string, storeId?: string) {
        if (storeId) await this.validateStoreOwnership(merchantId, storeId);

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const whereToday = {
            merchantId,
            ...(storeId && { storeId }),
            createdAt: { gte: startOfDay, lte: endOfDay },
        };

        const [
            todayRevenue,
            todayOrdersCount,
            pendingOrdersCount,
            lowStockCount,
            recentOrders,
        ] = await Promise.all([
            this.prisma.order.aggregate({
                where: { ...whereToday, status: OrderStatus.DELIVERED },
                _sum: { totalAmount: true },
            }),
            this.prisma.order.count({ where: whereToday }),
            this.prisma.order.count({
                where: { ...whereToday, status: OrderStatus.PENDING },
            }),
            (this.prisma.$queryRaw<any[]>`
                    SELECT COUNT(*) as count 
                    FROM "Product" 
                    WHERE "merchantId" = ${merchantId}
                    ${storeId ? `AND "storeId" = '${storeId}'` : ''}
                    AND "stock" <= "lowStockThreshold"
                    AND "isActive" = true
                `).then(res => Number((res as any)[0].count)),
            this.prisma.order.findMany({
                where: {
                    merchantId,
                    ...(storeId && { storeId }),
                    status: { in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY] },
                },
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { items: true },
            }),
        ]);

        return {
            revenue: todayRevenue._sum.totalAmount || 0,
            todayOrders: todayOrdersCount,
            pendingOrders: pendingOrdersCount,
            lowStockAlerts: lowStockCount,
            recentOrders,
        };
    }

    // --- Global Admin Analytics ---

    async getGlobalPlatformStats() {
        const [totalOrders, totalRiders, totalMerchants, totalStores] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.rider.count({ where: { isActive: true } }),
            this.prisma.merchant.count(),
            this.prisma.store.count({ where: { isActive: true } }),
        ]);

        return {
            totalOrders,
            activeRiders: totalRiders,
            totalMerchants,
            activeStores: totalStores,
            activeUsers: totalOrders * 0.8, // Approximation based on orders for now
        };
    }

    async getGlobalFinancials() {
        const [gmv, revenue, escrow] = await Promise.all([
            this.prisma.order.aggregate({
                where: { status: OrderStatus.DELIVERED },
                _sum: { totalAmount: true },
            }),
            this.prisma.order.aggregate({
                where: { status: OrderStatus.DELIVERED },
                _sum: { deliveryFee: true }, // Simplified: using deliveryFee as platform rev proxy
            }),
            this.prisma.wallet.aggregate({
                where: { ownerType: 'PLATFORM' },
                _sum: { balance: true }
            })
        ]);

        return {
            totalGMV: gmv._sum.totalAmount || 0,
            netRevenue: revenue._sum.deliveryFee || 0,
            escrowHolding: escrow._sum.balance || 0,
            lastMonthGrowth: 12.5, // Seeded value
        };
    }

    async getDemandIntensity(timezone?: string) {
        // Returns order counts grouped by zone/area
        const intensity: any[] = await this.prisma.$queryRaw`
            SELECT 
                s.city,
                COUNT(o.id)::int as "orderCount",
                SUM(o."totalAmount")::float as "totalValue"
            FROM "Order" o
            JOIN "Store" s ON o."storeId" = s.id
            WHERE o."status" IN ('PENDING', 'CONFIRMED', 'PREPARING', 'READY')
            GROUP BY s.city
        `;
        return intensity;
    }
}
