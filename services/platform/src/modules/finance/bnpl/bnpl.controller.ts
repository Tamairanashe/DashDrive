import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ApiKeyGuard } from '../../core/auth/api-key.guard';

@Controller('api/finance/bnpl')
@UseGuards(ApiKeyGuard)
export class BnplController {
  constructor(private prisma: PrismaService) {}

  @Get('accounts/:userId')
  async getAccount(@Param('userId') userId: string) {
    return this.prisma.bnplAccount.findUnique({
      where: { user_id: userId },
    });
  }

  @Post('transactions')
  async createTransaction(@Body() data: any) {
    return this.prisma.bnplTransaction.create({
      data: {
        account_id: data.accountId,
        amount: data.amount,
        merchant: data.merchant,
        status: 'active',
      },
    });
  }
}
