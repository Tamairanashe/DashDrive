import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(
    merchantId: string,
    data: {
      storeId: string;
      name: string;
    },
  ) {
    // Verify store ownership
    const store = await this.prisma.store.findFirst({
      where: { id: data.storeId, merchantId },
    });

    if (!store) {
      throw new ForbiddenException('Unauthorized store access');
    }

    return this.prisma.category.create({
      data: {
        ...data,
        merchantId,
      },
    });
  }

  async findAll(merchantId: string, storeId?: string) {
    return this.prisma.category.findMany({
      where: {
        merchantId,
        ...(storeId && { storeId }),
      },
      include: {
        products: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, merchantId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, merchantId },
      include: { products: true },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, merchantId: string, data: any) {
    const category = await this.findOne(id, merchantId);
    return this.prisma.category.update({
      where: { id: category.id },
      data,
    });
  }

  async remove(id: string, merchantId: string) {
    const category = await this.findOne(id, merchantId);
    return this.prisma.category.delete({
      where: { id: category.id },
    });
  }
}
