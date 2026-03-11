import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ApiKeyGuard } from '../../core/auth/api-key.guard';

@Controller('api/insurance/claims')
@UseGuards(ApiKeyGuard)
export class ClaimController {
  constructor(private prisma: PrismaService) {}

  @Post('submit')
  async submit(@Body() data: any) {
    return this.prisma.claim.create({
      data: {
        policy_id: data.policyId,
        user_id: data.userId,
        incident_type: data.incidentType,
        description: data.description,
        status: 'submitted',
      },
    });
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
