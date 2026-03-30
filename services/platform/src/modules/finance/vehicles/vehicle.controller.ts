import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ApiKeyGuard } from '../../core/auth/api-key.guard';

@Controller('api/finance/vehicles')
@UseGuards(ApiKeyGuard)
export class VehicleController {
  constructor(private prisma: PrismaService) {}

  @Get('catalog')
  async getCatalog() {
    return this.prisma.vehicle.findMany();
  }

  @Post('apply')
  async apply(@Body() data: any) {
    return this.prisma.vehicleFinanceApplication.create({
      data: {
        driver_id: data.driverId,
        vehicle_id: data.vehicleId,
        down_payment: data.downPayment,
        status: 'pending',
      },
    });
  }
}
