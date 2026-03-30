import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export class CreateBannerDto {
  title: string;
  imageUrl: string;
  vertical: string;
  targetUrl?: string;
  displayOrder?: number;
}

export class CreateContentBlockDto {
  title: string;
  type: string;
  vertical: string;
  items: any[];
  displayOrder?: number;
}

@Injectable()
export class CmsService {
  constructor(private prisma: PrismaService) {}

  // --- Banners ---
  async createBanner(data: CreateBannerDto) {
    return this.prisma.appBanner.create({ data });
  }

  async getBanners(vertical?: string) {
    const where = vertical ? { vertical, isActive: true } : {};
    return this.prisma.appBanner.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });
  }

  async updateBanner(id: string, data: Partial<CreateBannerDto>) {
    return this.prisma.appBanner.update({ where: { id }, data });
  }

  async deleteBanner(id: string) {
    return this.prisma.appBanner.delete({ where: { id } });
  }

  // --- Content Blocks ---
  async createContentBlock(data: CreateContentBlockDto) {
    return this.prisma.contentBlock.create({
      data: {
        title: data.title,
        type: data.type,
        vertical: data.vertical,
        items: data.items,
        displayOrder: data.displayOrder || 0,
      },
    });
  }

  async getContentBlocks(vertical?: string) {
    const where = vertical ? { vertical, isActive: true } : {};
    return this.prisma.contentBlock.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });
  }

  async updateContentBlock(id: string, data: Partial<CreateContentBlockDto>) {
    return this.prisma.contentBlock.update({ where: { id }, data });
  }

  async deleteContentBlock(id: string) {
    return this.prisma.contentBlock.delete({ where: { id } });
  }

  // --- Public Aggregated Endpoint for Mobile Apps ---
  async getHomeFeed(vertical: string) {
    const banners = await this.getBanners(vertical);
    const blocks = await this.getContentBlocks(vertical);

    return {
      vertical,
      banners,
      contentBlocks: blocks,
    };
  }
}
