import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateReviewDto) {
        const store = await this.prisma.store.findUnique({
            where: { id: data.storeId },
        });

        if (!store) {
            throw new NotFoundException('Store not found');
        }

        return this.prisma.$transaction(async (tx) => {
            const review = await tx.review.create({
                data: {
                    storeId: data.storeId,
                    rating: data.rating,
                    comment: data.comment,
                    customerId: data.customerId,
                },
            });

            // Update store average rating
            const stats = await tx.review.aggregate({
                where: { storeId: data.storeId },
                _avg: { rating: true },
                _count: { id: true },
            });

            await tx.store.update({
                where: { id: data.storeId },
                data: {
                    rating: stats._avg.rating || 0,
                    reviewCount: stats._count.id,
                },
            });

            return review;
        });
    }

    async findAllForStore(storeId: string) {
        return this.prisma.review.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
