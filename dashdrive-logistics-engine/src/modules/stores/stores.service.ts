import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StoresService {
    constructor(private prisma: PrismaService) { }

    async create(merchantId: string, data: {
        name: string;
        address: string;
        city: string;
        currency: string;
        timezone: string;
        taxRate?: number;
        estimatedPrepTime?: number;
        cuisineTypes?: string[];
        isPromoted?: boolean;
    }) {
        return this.prisma.store.create({
            data: {
                ...data,
                merchantId,
            },
        });
    }

    async findAll(merchantId: string) {
        return this.prisma.store.findMany({
            where: { merchantId, isActive: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, merchantId: string) {
        return this.prisma.store.findFirst({
            where: { id, merchantId },
        });
    }

    async update(id: string, merchantId: string, data: any) {
        return this.prisma.store.update({
            where: { id, merchantId },
            data,
        });
    }
}
