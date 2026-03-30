import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Store } from '@prisma/client';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string, type?: string): Promise<Store[]> {
    const where: any = {};
    if (status === 'PENDING') {
      where.isActive = false;
    } else if (status === 'ACTIVE') {
      where.isActive = true;
    }

    if (type) {
      where.Merchant = {
        type: type as any,
      };
    }

    return this.prisma.store.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        address: true,
        isActive: true,
        createdAt: true,
        Merchant: {
          select: {
            storeName: true,
            type: true,
          }
        }
      }
    }) as any;
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.prisma.store.findUnique({
      where: { id },
      include: {
        Merchant: true,
      }
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    return store;
  }

  async updateStatus(id: string, isActive: boolean): Promise<Store> {
    const store = await this.prisma.store.findUnique({ where: { id } });
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    return this.prisma.store.update({
      where: { id },
      data: { isActive },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.store.update({
      where: { id },
      data,
    });
  }
}
