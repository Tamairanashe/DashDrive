// src/modules/roads-insights-export/services/roads-insights-data-assembler.service.ts

import { Injectable } from '@nestjs/common';
import { RoadsExportDto } from '../dto/roads-export.dto';
import { RoadsExportContext } from '../types/export-context.type';
import { RoadsInsightsMapImageService } from './roads-insights-map-image.service';

@Injectable()
export class RoadsInsightsDataAssemblerService {
  constructor(
    private readonly mapImageService: RoadsInsightsMapImageService,
  ) {}

  async assemble(dto: RoadsExportDto, user: { id: string }): Promise<RoadsExportContext> {
    // In a real app, we'd fetch actual data from other services here
    // based on dto.filters and dto.tables
    
    const summary = dto.includeKpis ? {
      totalRoads: 42,
      activeIncidents: 12,
      avgSpeedKph: 35.4,
      avgCongestionLevel: 0.28,
    } : null;

    const analytics = dto.includeAnalytics ? {
      volumeTrend: [100, 120, 110, 130, 140],
      congestionTrend: [0.2, 0.25, 0.22, 0.3, 0.28],
    } : null;

    const tables = dto.includeTables ? {
      topDelayedRoads: [
        { roadName: 'Samora Machel Ave', zone: 'Harare CBD', averageSpeedKph: 12, delayMinutes: 15, reliabilityScore: 0.65, status: 'delayed' },
        { roadName: 'Enterprise Rd', zone: 'Newlands', averageSpeedKph: 45, delayMinutes: 5, reliabilityScore: 0.88, status: 'flowing' },
      ]
    } : null;

    const mapImage = dto.includeMapSnapshot
      ? await this.mapImageService.resolveImage(dto)
      : null;

    return {
      meta: {
        title: dto.title,
        format: dto.format,
        generatedAt: new Date().toISOString(),
        requestedBy: user.id,
      },
      filters: dto.includeActiveFilters ? dto.filters : null,
      layers: dto.includeEnabledLayers ? dto.layers : null,
      summary,
      analytics,
      tables,
      mapImage,
    };
  }
}
