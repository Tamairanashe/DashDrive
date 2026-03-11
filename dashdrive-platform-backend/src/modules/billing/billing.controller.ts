import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiKeyGuard } from '../core/auth/api-key.guard';

@Controller('api/billing')
@UseGuards(ApiKeyGuard)
export class BillingController {
  constructor(private prisma: PrismaService) {}

  @Get('transactions')
  async getTransactions() {
    return this.prisma.transaction.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  @Post('process-payment')
  async processPayment(@Body() data: any) {
    return this.prisma.transaction.create({
      data: {
        reference_id: data.referenceId,
        type: data.type,
        amount: data.amount,
        status: 'completed',
        created_at: new Date(),
      },
    });
  }
}
