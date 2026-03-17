import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { InspectionsService } from './inspections.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Inspections')
@Controller('inspections')
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @Post(':tripId')
  @ApiOperation({ summary: 'Create a trip inspection (check-in/out)' })
  create(
    @Param('tripId') tripId: string,
    @Body() data: { type: string; odometerReading: number; fuelLevel: number; photos: string[]; notes?: string },
  ) {
    return this.inspectionsService.createInspection(tripId, data);
  }

  @Get(':tripId')
  @ApiOperation({ summary: 'Get all inspections for a trip' })
  getTripInspections(@Param('tripId') tripId: string) {
    return this.inspectionsService.getTripInspections(tripId);
  }
}
