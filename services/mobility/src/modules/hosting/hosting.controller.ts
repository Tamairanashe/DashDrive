import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { HostingService } from './hosting.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Hosting')
@Controller('hosting')
export class HostingController {
  constructor(private readonly hostingService: HostingService) {}

  @Post('availability/:vehicleId')
  @ApiOperation({ summary: 'Set vehicle availability (block/unblock dates)' })
  setAvailability(
    @Param('vehicleId') vehicleId: string,
    @Body() data: { startDate: Date; endDate: Date; isAvailable: boolean; reason?: string },
  ) {
    return this.hostingService.setAvailability(vehicleId, data);
  }

  @Get('availability/:vehicleId')
  @ApiOperation({ summary: 'Get vehicle availability records' })
  getAvailability(@Param('vehicleId') vehicleId: string) {
    return this.hostingService.getAvailability(vehicleId);
  }

  @Post('pricing/:vehicleId')
  @ApiOperation({ summary: 'Set pricing rules (discounts/boosts)' })
  setPricingRule(
    @Param('vehicleId') vehicleId: string,
    @Body() data: { type: string; value: number; isPercentage: boolean },
  ) {
    return this.hostingService.setPricingRule(vehicleId, data);
  }

  @Patch('vehicle/:vehicleId')
  @ApiOperation({ summary: 'Update vehicle settings (transmission, features, etc.)' })
  updateVehicle(@Param('vehicleId') vehicleId: string, @Body() data: any) {
    return this.hostingService.updateVehicleSettings(vehicleId, data);
  }

  @Get('dashboard/:hostId')
  @ApiOperation({ summary: 'Get host dashboard overview' })
  getDashboard(@Param('hostId') hostId: string) {
    return this.hostingService.getHostDashboard(hostId);
  }
}
