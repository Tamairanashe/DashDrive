import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ApiKeyGuard } from '../../core/auth/api-key.guard';
import { InsuranceService } from './insurance.service';

@Controller('api/insurance/claims')
@UseGuards(ApiKeyGuard)
export class ClaimController {
  constructor(
    private readonly insuranceService: InsuranceService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('submit')
  async submit(@Body() data: any) {
    return this.insuranceService.submitClaim(data);
  }

  @Get('my-claims/:userId')
  async getMyClaims(@Param('userId') userId: string) {
    return this.prisma.claim.findMany({
      where: { user_id: userId },
      include: { policy: true },
    });
  }

  @Get(':id')
  async getClaim(@Param('id') id: string) {
    return this.prisma.claim.findUnique({
      where: { id },
    });
  }
}
