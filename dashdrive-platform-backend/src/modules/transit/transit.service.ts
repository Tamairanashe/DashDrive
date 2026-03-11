import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TransitService {
  constructor(private prisma: PrismaService) {}

  async getRoutes() {
    return [
      { id: 'tr-1', name: 'CBD Express', routeNumber: 'R01', type: 'bus', startPoint: 'Downtown', endPoint: 'Airport', fare: 1.50 },
      { id: 'tr-2', name: 'Metro Line 1', routeNumber: 'M01', type: 'train', startPoint: 'Central Station', endPoint: 'Eastlands', fare: 2.00 },
      { id: 'tr-3', name: 'Lakeside Commuter', routeNumber: 'R05', type: 'minibus', startPoint: 'Lake Avenue', endPoint: 'Industrial Zone', fare: 0.80 },
    ];
  }

  async getRouteStops(routeId: string) {
    return [
      { id: 's-1', routeId, name: 'Central Station', stopOrder: 1, latitude: -17.8292, longitude: 31.0522 },
      { id: 's-2', routeId, name: 'Market Square', stopOrder: 2, latitude: -17.8312, longitude: 31.0480 },
      { id: 's-3', routeId, name: 'University', stopOrder: 3, latitude: -17.7840, longitude: 31.0530 },
      { id: 's-4', routeId, name: 'Airport Terminal', stopOrder: 4, latitude: -17.9180, longitude: 31.0920 },
    ];
  }

  async purchasePass(data: { userId: string; passType: string; routeIds?: string[] }) {
    const pricing: Record<string, { price: number; days: number }> = {
      daily: { price: 3, days: 1 },
      weekly: { price: 15, days: 7 },
      monthly: { price: 50, days: 30 },
    };
    const plan = pricing[data.passType] || pricing.daily;
    const now = new Date();
    return {
      id: `pass-${Date.now()}`,
      userId: data.userId,
      passType: data.passType,
      routeIds: data.routeIds || [],
      validFrom: now,
      validUntil: new Date(now.getTime() + plan.days * 86400000),
      price: plan.price,
      qrCode: `PASS-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      status: 'active',
    };
  }

  async recordTrip(data: { userId: string; routeId: string; boardStop: string; alightStop?: string; passId?: string }) {
    return {
      id: `trip-${Date.now()}`,
      ...data,
      fare: data.passId ? 0 : 1.50,
      paymentMethod: data.passId ? 'pass' : 'wallet',
      createdAt: new Date(),
    };
  }
}
