// src/modules/roads-insights-export/services/roads-insights-static-map.service.ts
import { Injectable } from '@nestjs/common';

type LatLng = { lat: number; lng: number };

type StaticMapInput = {
  center: LatLng;
  zoom: number;
  width: number;
  height: number;
  routes?: Array<{
    color: string;
    weight?: number;
    path: LatLng[];
  }>;
  incidents?: Array<{
    color: string;
    label?: string;
    position: LatLng;
  }>;
  polygons?: Array<{
    color: string;
    fillColor?: string;
    weight?: number;
    path: LatLng[];
  }>;
};

@Injectable()
export class RoadsInsightsStaticMapService {
  async render(input: StaticMapInput): Promise<Buffer> {
    const url = this.buildUrl(input);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Static map render failed with ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  private buildUrl(input: StaticMapInput): string {
    const params = new URLSearchParams({
      center: `${input.center.lat},${input.center.lng}`,
      zoom: String(input.zoom),
      size: `${input.width}x${input.height}`,
      scale: '2',
      maptype: 'roadmap',
      key: process.env.GOOGLE_MAPS_STATIC_API_KEY || '',
    });

    for (const route of input.routes ?? []) {
      const path = [
        `color:${route.color}`,
        `weight:${route.weight ?? 5}`,
        ...route.path.map((p) => `${p.lat},${p.lng}`),
      ].join('|');
      params.append('path', path);
    }

    for (const polygon of input.polygons ?? []) {
      const path = [
        `color:${polygon.color}`,
        `fillcolor:${polygon.fillColor ?? '0x00000000'}`,
        `weight:${polygon.weight ?? 2}`,
        ...polygon.path.map((p) => `${p.lat},${p.lng}`),
      ].join('|');
      params.append('path', path);
    }

    for (const incident of input.incidents ?? []) {
      const marker = [
        `color:${incident.color}`,
        incident.label ? `label:${incident.label}` : null,
        `${incident.position.lat},${incident.position.lng}`,
      ]
        .filter(Boolean)
        .join('|');

      params.append('markers', marker);
    }

    return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
  }
}
