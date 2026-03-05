import { Controller, Post, Body, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('zones')
@Controller('zones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ZonesController {
    constructor(private readonly zonesService: ZonesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new operational zone' })
    create(@Body() data: any) {
        return this.zonesService.createZone(data);
    }

    @Get()
    @ApiOperation({ summary: 'Get all active operational zones' })
    findAll(@Query('countryCode') countryCode?: string) {
        return this.zonesService.getActiveZones(countryCode);
    }

    @Get(':id/heatmap')
    @ApiOperation({ summary: 'Get supply/demand heatmap data for a zone' })
    getHeatmap(@Param('id') id: string) {
        return this.zonesService.getZoneHeatmapMetrics(id);
    }

    @Patch(':id/surge')
    @ApiOperation({ summary: 'Update surge multiplier for a zone' })
    setSurge(@Param('id') id: string, @Body('multiplier') multiplier: number) {
        return this.zonesService.setSurgeMultiplier(id, multiplier);
    }
}
