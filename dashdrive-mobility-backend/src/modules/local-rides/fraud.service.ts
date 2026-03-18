import { Injectable } from '@nestjs/common';
import { DriverLocationDto } from './dto/local-rides.dto';

@Injectable()
export class FraudService {
  private lastLocations: Map<string, { lat: number, lng: number, time: number }> = new Map();

  checkVelocity(driverId: string, newLocation: DriverLocationDto): boolean {
    const last = this.lastLocations.get(driverId);
    const now = Date.now();
    
    if (last) {
      const distance = this.calculateDistance(last.lat, last.lng, newLocation.lat, newLocation.lng);
      const hours = (now - last.time) / (1000 * 60 * 60);
      const speed = distance / hours;

      if (speed > 180) { // Suspicious speed > 180 km/h
        return true;
      }
    }

    this.lastLocations.set(driverId, { ...newLocation, time: now });
    return false;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
