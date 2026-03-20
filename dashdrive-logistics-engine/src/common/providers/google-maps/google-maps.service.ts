import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, TravelMode } from '@googlemaps/google-maps-services-js';

@Injectable()
export class GoogleMapsService {
  private client: Client;
  private apiKey: string;
  private readonly logger = new Logger(GoogleMapsService.name);

  constructor(private configService: ConfigService) {
    this.client = new Client({});
    this.apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY')?.trim() || '';
  }

  async optimizeRoute(
    origin: { lat: number; lng: number },
    waypoints: { lat: number; lng: number }[],
    destination?: { lat: number; lng: number },
  ) {
    try {
      // Use directions API with waypoint optimization
      const response = await this.client.directions({
        params: {
          origin: origin,
          destination: destination || waypoints[waypoints.length - 1],
          waypoints: waypoints,
          optimize: true,
          mode: TravelMode.driving,
          key: this.apiKey,
        },
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Google Maps API error: ${response.data.status}`);
      }

      const route = response.data.routes[0];
      return {
        optimizedOrder: route.waypoint_order, // Index of optimized waypoints
        polyline: route.overview_polyline.points,
        legs: route.legs,
      };
    } catch (error) {
      this.logger.error(`Failed to optimize route: ${error.message}`);
      throw error;
    }
  }

  async computeDistanceMatrix(
    origins: { lat: number; lng: number }[],
    destinations: { lat: number; lng: number }[],
  ) {
    try {
      const response = await this.client.distancematrix({
        params: {
          origins: origins,
          destinations: destinations,
          key: this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Distance matrix failed: ${error.message}`);
      throw error;
    }
  }
}
