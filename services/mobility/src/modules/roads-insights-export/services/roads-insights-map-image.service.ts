// src/modules/roads-insights-export/services/roads-insights-map-image.service.ts

import { Injectable } from '@nestjs/common';
import { RoadsExportDto } from '../dto/roads-export.dto';
import { GoogleMapsService } from '../../../providers/google-maps/google-maps.service';

@Injectable()
export class RoadsInsightsMapImageService {
  constructor(private readonly googleMaps: GoogleMapsService) {}

  async resolveImage(dto: RoadsExportDto): Promise<any> {
    if (dto.mapSnapshotBase64) {
      const base64Data = dto.mapSnapshotBase64.replace(/^data:image\/\w+;base64,/, '');
      return {
        source: 'client_snapshot',
        mimeType: 'image/png',
        buffer: Buffer.from(base64Data, 'base64'),
      };
    }

    // Fallback: server-rendered static map with overlays
    const isHarare = dto.filters?.cityId === 'harare';
    const center = isHarare ? '-17.8252,31.0335' : 'Harare';
    
    // Example: Add markers for hypothetical incidents
    const markers = isHarare ? [
      'color:red|label:1|-17.8312,31.0435',
      'color:red|label:2|-17.8182,31.0235',
      'color:orange|label:W|-17.8252,31.0535',
    ] : [];

    // Example: Add a sample path for a "high traffic" sector
    const paths = isHarare ? [
      'color:0xff0000ff|weight:5|-17.8252,31.0335|-17.8312,31.0335|-17.8312,31.0435'
    ] : [];

    const buffer = await this.googleMaps.getStaticMap({
      center,
      zoom: 14,
      size: '1024x768',
      markers,
      paths,
    });

    return {
      source: 'static_maps_api',
      mimeType: 'image/png',
      buffer,
    };
  }
}
