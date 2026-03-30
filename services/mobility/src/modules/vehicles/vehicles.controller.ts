import { Controller, Get, Post, Body, Param, Query, Patch, Delete } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  create(@Body() data: any) {
    return this.vehiclesService.createVehicle(data);
  }

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('location') location?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.vehiclesService.findAll({
      category,
      location,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.vehiclesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}
