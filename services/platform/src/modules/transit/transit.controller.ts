import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransitService } from './transit.service';

@Controller('transit')
export class TransitController {
  constructor(private readonly transitService: TransitService) {}

  @Get('routes')
  getRoutes() {
    return this.transitService.getRoutes();
  }

  @Get('routes/:id/stops')
  getRouteStops(@Param('id') id: string) {
    return this.transitService.getRouteStops(id);
  }

  @Get('products')
  getProducts() {
    return this.transitService.getProducts();
  }

  @Post('pass/purchase')
  purchasePass(@Body() data: { userId: string; productId: string }) {
    return this.transitService.purchasePass(data);
  }

  @Post('trip')
  recordTrip(@Body() data: { userId: string; routeId: string; boardStop: string; alightStop?: string; passId?: string }) {
    return this.transitService.recordTrip(data);
  }
}
