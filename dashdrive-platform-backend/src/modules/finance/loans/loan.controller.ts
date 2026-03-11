import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ApiKeyGuard } from '../../core/auth/api-key.guard';

@Controller('api/finance/loans')
@UseGuards(ApiKeyGuard)
export class LoanController {
  constructor(private prisma: PrismaService) {}

  @Get('products')
  async getProducts() {
    return this.prisma.loanProduct.findMany();
  }

  @Post('apply')
  async apply(@Body() data: any) {
    return this.prisma.application.create({
      data: {
        borrower_id: data.borrowerId,
        product_id: data.productId,
        requested_amount: data.amount,
        status: 'submitted',
      },
    });
  }

  @Get('applications')
  async getApplications() {
    return this.prisma.application.findMany({
      include: {
        product: true,
        borrower: true,
      },
    });
  }
}
