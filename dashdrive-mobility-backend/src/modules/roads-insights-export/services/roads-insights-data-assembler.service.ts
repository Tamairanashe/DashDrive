import { Injectable } from '@nestjs/common';
import { RoadsExportDto } from '../dto/roads-export.dto';
import { RoadsExportContext } from '../types/export-context.type';
import { RoadsInsightsStaticMapService } from './roads-insights-static-map.service';

@Injectable()
export class RoadsInsightsDataAssemblerService {
  constructor(
    private readonly staticMap: RoadsInsightsStaticMapService,
  ) {}

  async assemble(dto: RoadsExportDto, user: { id: string }): Promise<RoadsExportContext> {
    const summary = dto.includeKpis
      ? {
          activeCongestedSegments: 24,
          averageCorridorSpeedKph: 31,
          routesBelowSla: 8,
          highRiskIntersections: 6,
        }
      : null;

    const analytics = dto.includeAnalytics
      ? {
          travelTimeTrend: [
            { label: '06:00', value: 18 },
            { label: '07:00', value: 22 },
            { label: '08:00', value: 31 },
            { label: '09:00', value: 29 },
            { label: '10:00', value: 25 },
            { label: '11:00', value: 21 },
          ],
        }
      : null;

    const tables = dto.includeTables
      ? {
          topDelayedRoads: [
            {
              roadName: 'Samora Machel Avenue',
              zone: 'CBD',
              averageSpeedKph: 18,
              delayMinutes: 16,
              speedLimitKph: 60,
              incidentCount: 4,
              reliabilityScore: 52,
              status: 'error',
            },
            {
              roadName: 'Borrowdale Road',
              zone: 'North',
              averageSpeedKph: 24,
              delayMinutes: 11,
              speedLimitKph: 60,
              incidentCount: 2,
              reliabilityScore: 64,
              status: 'warning',
            },
          ],
          routePerformance: [
            {
              routeName: 'CBD → Airport',
              origin: 'CBD',
              destination: 'Airport',
              etaMinutes: 34,
              actualAverageMinutes: 31,
              varianceMinutes: 9,
              reliabilityScore: 62,
              routeStatus: 'neutral',
            },
            {
              routeName: 'CBD → Avondale',
              origin: 'CBD',
              destination: 'Avondale',
              etaMinutes: 21,
              actualAverageMinutes: 19,
              varianceMinutes: 4,
              reliabilityScore: 81,
              routeStatus: 'preferred',
            },
          ],
        }
      : null;

    const mapImage = dto.includeMapSnapshot
      ? await this.staticMap.render({
          center: { lat: -17.8292, lng: 31.0522 },
          zoom: 12,
          width: 1200,
          height: 700,
          routes: [
            {
              color: '0x1677ff',
              weight: 5,
              path: [
                { lat: -17.83, lng: 31.04 },
                { lat: -17.85, lng: 31.08 },
                { lat: -17.89, lng: 31.12 },
              ],
            },
          ],
          incidents: [
            {
              color: 'red',
              label: 'I',
              position: { lat: -17.826, lng: 31.048 },
            },
          ],
        })
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
      mapImage: mapImage
        ? {
            source: 'server_render' as const,
            mimeType: 'image/png',
            buffer: mapImage,
          }
        : null,
    };
  }
}
