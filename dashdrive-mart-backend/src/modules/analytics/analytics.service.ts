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
}
