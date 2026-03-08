import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InventoryService {
    constructor(private prisma: PrismaService) { }

    async adjustStock(merchantId: string, data: {
        productId: string;
        variantId?: string;
        change: number;
        reason: string;
    }) {
        // 1. Verify existence and ownership
        if (data.variantId) {
            const variant = await this.prisma.productVariant.findUnique({
                where: { id: data.variantId },
                include: { product: true }
            });
            if (!variant || variant.product.merchantId !== merchantId) {
                throw new NotFoundException('Variant not found or unauthorized');
            }
        } else {
            const product = await this.prisma.product.findUnique({
                where: { id: data.productId }
            });
            if (!product || product.merchantId !== merchantId) {
                throw new NotFoundException('Product not found or unauthorized');
            }
        }

        // 2. Log the change
        await this.prisma.inventoryLog.create({
            data: {
                productId: data.productId,
                variantId: data.variantId,
                change: data.change,
                reason: data.reason,
                merchantId,
            },
        });

        // 3. Update actual stock
        if (data.variantId) {
            return this.prisma.productVariant.update({
                where: { id: data.variantId },
                data: {
                    stock: { increment: data.change },
                },
            });
        } else {
            return this.prisma.product.update({
                where: { id: data.productId },
                data: {
                    stock: { increment: data.change },
                },
            });
        }
    }

    async getLogs(merchantId: string, productId?: string) {
        return this.prisma.inventoryLog.findMany({
            where: {
                merchantId,
                ...(productId && { productId }),
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }

    async syncFromExternal(data: { item_id: string; is_available: boolean }) {
        try {
            return await this.prisma.product.update({
                where: { id: data.item_id },
                data: {
                    isActive: data.is_available,
                    stock: data.is_available ? 100 : 0
                }
            });
        } catch (e) {
            return { status: 'ignored', message: 'Item not found in logistics engine' };
        }
    }
}
