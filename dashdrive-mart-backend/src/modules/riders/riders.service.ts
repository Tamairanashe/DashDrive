import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RidersService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        name: string;
        phone: string;
        vehicleType: string;
        countryCode: string;
        email?: string;
    }) {
        return this.prisma.rider.create({
            data,
        });
    }

    async setOnlineStatus(riderId: string, isOnline: boolean) {
        return this.prisma.rider.update({
            where: { id: riderId },
            data: { isOnline },
        });
    }

    async getAvailableRiders(countryCode: string) {
        return this.prisma.rider.findMany({
            where: {
                isOnline: true,
                isActive: true,
                countryCode,
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.rider.findUnique({
            where: { id },
        });
    }
}
