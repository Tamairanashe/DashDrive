import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ApiKeyGuard } from '../../core/auth/api-key.guard';

@Controller('api/insurance/policies')
@UseGuards(ApiKeyGuard)
export class PolicyController {
  constructor(private prisma: PrismaService) {}

  @Get('products')
  async getProducts() {
    return this.prisma.insuranceProduct.findMany({
      include: { provider: true }
    });
  }

  @Post('purchase')
  async purchase(@Body() data: any) {
    return this.prisma.policy.create({
      data: {
        user_id: data.userId,
        product_id: data.productId,
        premium: data.premium,
        coverage_amount: data.coverage,
        status: 'active',
        start_date: new Date(),
        end_date: data.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Default 1 year
      },
    });
  }

  @Get(':id')
  async getPolicy(@Param('id') id: string) {
    return this.prisma.policy.findUnique({
      where: { id },
      include: { product: true }
    });
  }
}
