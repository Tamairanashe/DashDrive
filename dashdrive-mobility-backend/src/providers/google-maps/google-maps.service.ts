import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, TravelMode, UnitSystem } from '@googlemaps/google-maps-services-js';
import axios from 'axios';

// ── Types for Routes API v2 ──────────────────────────────
export interface WaypointV2 {
  location?: { latLng: { latitude: number; longitude: number } };
  address?: string;
  placeId?: string;
}

export interface RoutesV2Request {
  origin: WaypointV2 | { lat: number; lng: number } | string;
  destination: WaypointV2 | { lat: number; lng: number } | string;
  travelMode?: 'DRIVE' | 'BICYCLE' | 'WALK' | 'TWO_WHEELER';
  computeAlternativeRoutes?: boolean;
  routingPreference?: 'TRAFFIC_UNAWARE' | 'TRAFFIC_AWARE' | 'TRAFFIC_AWARE_OPTIMAL';
  avoidTolls?: boolean;
  avoidHighways?: boolean;
  units?: 'METRIC' | 'IMPERIAL';
}

export interface RouteV2Result {
  routeIndex: number;
  distanceMeters: number;
  duration: string;          // e.g. "6000s"
  durationSeconds: number;
  polyline: string;          // encoded polyline
  fuelConsumptionMicroliters?: number;
  fuelLiters?: number;
  fuelGallons?: number;
  estimatedFuelCostUSD?: number;
}

export interface ComputeRoutesV2Response {
  primary: RouteV2Result;
  alternatives: RouteV2Result[];
  allRoutes: RouteV2Result[];
}

@Injectable()
export class GoogleMapsService {
  private client: Client;
  private apiKey: string;
  private readonly logger = new Logger(GoogleMapsService.name);

  private static readonly ROUTES_API_URL = 'https://routes.googleapis.com/v1/computeRoutes';
  private static readonly ROUTES_V2_API_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes';
  
  private static readonly FIELD_MASK = [
    'routes.duration',
    'routes.distanceMeters',
    'routes.polyline.encodedPolyline',
  ].join(',');

  // Average fuel price estimate (USD per gallon)
  private static readonly AVG_FUEL_PRICE_PER_GALLON = 3.50;

  constructor(private configService: ConfigService) {
    this.client = new Client({});
    this.apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY')?.trim() || '';
  }

  // ── Modern Routes API v2 ─────────────────────────────────
  
  private toWaypoint(point: WaypointV2 | { lat: number; lng: number } | string): WaypointV2 {
    if (typeof point === 'string') {
      return { address: point };
    }
    if ('lat' in point && 'lng' in point) {
      return { location: { latLng: { latitude: point.lat, longitude: point.lng } } };
    }
    return point;
  }

  async computeRoutesV2(request: RoutesV2Request): Promise<ComputeRoutesV2Response> {
    const {
      origin,
      destination,
      travelMode = 'DRIVE',
      computeAlternativeRoutes = true,
      routingPreference = 'TRAFFIC_AWARE_OPTIMAL',
      avoidTolls = false,
      avoidHighways = false,
      units = 'METRIC',
    } = request;

    const body = {
      origin: this.toWaypoint(origin),
      destination: this.toWaypoint(destination),
      travelMode,
      routingPreference,
      computeAlternativeRoutes,
      routeModifiers: {
        avoidTolls,
        avoidHighways,
        avoidFerries: false,
      },
      languageCode: 'en-US',
      units,
    };

    try {
      const logOrigin = typeof origin === 'string' ? origin : ('lat' in origin ? `${origin.lat},${origin.lng}` : 'address' in origin ? origin.address : 'complex waypoint');
      this.logger.log(`Computing routes from ${logOrigin}`);

      const response = await axios.post(GoogleMapsService.ROUTES_V2_API_URL, body, {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': GoogleMapsService.FIELD_MASK,
        },
      });

      const routes = response.data.routes || [];
      if (routes.length === 0) {
        throw new Error('Routes API returned no routes');
      }

      const parsed: RouteV2Result[] = routes.map((route: any, index: number) => {
        const durationStr: string = route.duration || '0s';
        const durationSec = parseInt(durationStr.replace('s', ''), 10) || 0;
        
        // Basic estimates if real fuel data is restricted
        const distanceKm = (route.distanceMeters || 0) / 1000;
        const estimatedLiters = distanceKm * 0.08; // 8L/100km avg
        const fuelGallons = estimatedLiters * 0.264172;
        const estimatedFuelCostUSD = fuelGallons * GoogleMapsService.AVG_FUEL_PRICE_PER_GALLON;

        return {
          routeIndex: index,
          distanceMeters: route.distanceMeters || 0,
          duration: durationStr,
          durationSeconds: durationSec,
          polyline: route.polyline?.encodedPolyline || '',
          fuelLiters: parseFloat(estimatedLiters.toFixed(2)),
          fuelGallons: parseFloat(fuelGallons.toFixed(2)),
          estimatedFuelCostUSD: parseFloat(estimatedFuelCostUSD.toFixed(2)),
        };
      });

      return {
        primary: parsed[0],
        alternatives: parsed.slice(1),
        allRoutes: parsed,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(`Routes API error: ${error.response?.status} — ${JSON.stringify(error.response?.data)}`);
      } else {
        this.logger.error(`Routes API error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Simple method matching the user's demonstrated curl request
   */
  async computeRoutesSimple(origin: string, destination: string) {
    const body = {
      origin: { address: origin },
      destination: { address: destination }
    };

    const response = await axios.post(GoogleMapsService.ROUTES_V2_API_URL, body, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': this.apiKey,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters',
      },
    });

    return response.data;
  }

  // ── Legacy Directions API (kept for backward compat) ─────
  async computeRoute(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    mode: TravelMode = TravelMode.driving,
  ) {
    try {
      const response = await this.client.directions({
        params: {
          origin: origin,
          destination: destination,
          mode: mode,
          key: this.apiKey,
        },
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Google Maps API error: ${response.data.status}`);
      }

      const route = response.data.routes[0];
      const leg = route.legs[0];

      return {
        distanceMeters: leg.distance.value,
        durationSeconds: leg.duration.value,
        polyline: route.overview_polyline.points,
        startAddress: leg.start_address,
        endAddress: leg.end_address,
      };
    } catch (error) {
      this.logger.error(`Failed to compute route: ${error.message}`);
      throw error;
    }
  }

  async getDistanceMatrix(
    origins: { lat: number; lng: number }[],
    destinations: { lat: number; lng: number }[],
    mode: TravelMode = TravelMode.driving,
  ) {
    try {
      const response = await this.client.distancematrix({
        params: {
          origins: origins,
          destinations: destinations,
          mode: mode,
          key: this.apiKey,
        },
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Google Maps Distance Matrix error: ${response.data.status}`);
      }

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get distance matrix: ${error.message}`);
      throw error;
    }
  }

  async getStaticMap(params: {
    center?: string;
    zoom?: number;
    size?: string;
    maptype?: string;
    markers?: string[];
    paths?: string[];
  }): Promise<Buffer> {
    const { center, zoom = 12, size = '600x400', maptype = 'roadmap', markers = [], paths = [] } = params;
    
    let url = `https://maps.googleapis.com/maps/api/staticmap?size=${size}&maptype=${maptype}&key=${this.apiKey}`;
    
    if (center) {
      url += `&center=${encodeURIComponent(center)}`;
    }
    
    if (zoom) {
      url += `&zoom=${zoom}`;
    }

    if (markers.length > 0) {
      markers.forEach(marker => {
        url += `&markers=${encodeURIComponent(marker)}`;
      });
    }

    if (paths.length > 0) {
      paths.forEach(path => {
        url += `&path=${encodeURIComponent(path)}`;
      });
    }

    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return Buffer.from(response.data);
    } catch (error) {
      this.logger.error(`Failed to fetch static map: ${error.message}`);
      throw error;
    }
  }
}

