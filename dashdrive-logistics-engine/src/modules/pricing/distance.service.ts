import { Injectable, Logger } from '@nestjs/common';
import { getDistance } from 'geolib';

@Injectable()
export class DistanceCalculatorService {
  private readonly logger = new Logger(DistanceCalculatorService.name);

  /**
   * Calculates the direct distance between two coordinates in kilometers.
   * In a production scenario, this should ideally call the Google Maps Distance Matrix API
   * or Mapbox/OSRM to get real driving distance. For MVP, we use the Haversine formula via geolib.
   */
  async calculateRouteDistance(
    pickup: { lat: number; lng: number },
    dropoff: { lat: number; lng: number },
  ): Promise<{ distanceKm: number; estimatedTimeMin: number }> {
    try {
      const distanceMeters = getDistance(
        { latitude: pickup.lat, longitude: pickup.lng },
        { latitude: dropoff.lat, longitude: dropoff.lng },
      );

      // Convert straight-line distance to a rough driving distance approximation (+30%)
      const distanceKm = (distanceMeters / 1000) * 1.3;

      // Rough ETA estimation: Assuming an average city speed of 30 km/h
      const estimatedTimeMin = Math.ceil((distanceKm / 30) * 60) + 5; // +5 mins buffer for pickup/dropoff

      this.logger.debug(
        `Calculated Distance: ${distanceKm.toFixed(2)} km | ETA: ${estimatedTimeMin} mins`,
      );

      return { distanceKm, estimatedTimeMin };
    } catch (error) {
      this.logger.error(
        `Error calculating distance: ${(error as Error).message}`,
      );
      // Safe fallback
      return { distanceKm: 5.0, estimatedTimeMin: 15 };
    }
  }
}
