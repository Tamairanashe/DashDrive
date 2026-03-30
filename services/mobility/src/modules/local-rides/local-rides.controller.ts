import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { LocalRidesService } from './local-rides.service';
import { CreateLocalRideRequestDto } from './dto/local-rides.dto';

@Controller('local-rides')
export class LocalRidesController {
  constructor(private readonly ridesService: LocalRidesService) {}

  @Post('request')
  async requestRide(@Req() req: any, @Body() dto: CreateLocalRideRequestDto) {
    const userId = req.user.uid; // Assumes AuthGuard populates request.user
    return this.ridesService.createRideRequest(userId, dto);
  }

  @Get('suggested-price')
  getSuggestedPrice(@Query('distance') distance: number) {
    return this.ridesService.calculateSuggestedPrice(distance);
  }

  @Post('requests/:id/select-driver')
  async selectDriver(
    @Req() req: any,
    @Param('id') requestId: string,
    @Body('offerId') offerId: string,
  ) {
    const userId = req.user.uid;
    return this.ridesService.selectDriver(userId, requestId, offerId);
  }
}
