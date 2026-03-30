// ────────────────────────────────────────────────────────────────
// Heat Map — Data Hook
// ────────────────────────────────────────────────────────────────

import { useQuery } from '@tanstack/react-query';
import {
  MOCK_ZONES,
  MOCK_ALERTS,
  MOCK_RECOMMENDED_ACTIONS,
  MOCK_REVENUE_ZONES,
  MOCK_SUPPLY_RESPONSES,
  buildKPIMetrics,
  generateDriverMarkers,
  generateH3Cells,
  searchZones,
  generateCompareResult,
} from '../mockData';
import type { HeatMapZone, HeatMapLayerId } from '../types';

export function useHeatMapData(isLive: boolean, city: string, service: string, layer: string, search: string) {
  return useQuery({
    queryKey: ['heatmap', 'zones', city, service, layer, search],
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          city,
          service,
          layer,
          search,
        });
        const response = await fetch(`/api/admin/operations/heatmap?${params.toString()}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        // Backend returns { success: true, data: { zones: [...] } }
        const rawZones = result.data?.zones || [];
        
        // Map backend flat metrics to frontend nested structure
        return rawZones.map((z: any) => ({
          id: z.id,
          name: z.name,
          city: z.city || city,
          serviceType: z.serviceType || 'All',
          status: z.status || (z.demand > z.supply * 3 ? 'critical' : z.demand > z.supply * 2 ? 'elevated' : 'healthy'),
          lat: z.lat,
          lng: z.lng,
          polygon: z.polygon || [],
          metrics: {
            activeDemand: z.demand || 0,
            idleSupply: z.supply || 0,
            busySupply: Math.floor((z.supply || 0) * 0.4),
            avgETA: z.eta || 0,
            pickupETA: Math.round((z.eta || 0) * 0.7 * 10) / 10,
            cancelRate: z.cancelRate || 0,
            acceptanceRate: 100 - (z.cancelRate || 0),
            fulfillmentRate: 100 - (z.cancelRate || 0),
            revenue: z.revenue || 0,
            demandSupplyRatio: Math.round((z.demand || 0) / Math.max(z.supply || 1, 1) * 10) / 10,
            imbalanceScore: Math.min(100, Math.round(((z.demand || 0) / Math.max(z.supply || 1, 1)) * 15)),
            surgeMultiplier: z.surgeMultiplier || (z.demand > z.supply * 3 ? 1.5 : null),
            surgeExpiresAt: null,
          },
          lastUpdated: new Date().toISOString(),
          contextInsights: z.contextInsights || {
            traffic: 'Normal flow',
            weather: 'Clear skies',
            nearbyEvents: null,
            restaurantBacklog: null,
            routePressure: null,
          },
          historyComparison: z.historyComparison || {
            todayVsYesterday: [],
            last7VsPrev7: [],
            thisMonthVsLast: [],
          },
          trendData: z.trendData || {
            demand: [],
            supply: [],
            eta: [],
            cancels: [],
            revenue: [],
          },
        }));
      } catch (error) {
        console.error('HeatMap API Error, falling back to mock:', error);
        await new Promise((r) => setTimeout(r, 600));
        // Fallback to mock with jitter
        return MOCK_ZONES.map((z) => ({
          ...z,
          metrics: {
            ...z.metrics,
            activeDemand: z.metrics.activeDemand + Math.floor((Math.random() - 0.5) * 10),
            idleSupply: Math.max(0, z.metrics.idleSupply + Math.floor((Math.random() - 0.5) * 4)),
            avgETA: Math.round((z.metrics.avgETA + (Math.random() - 0.5) * 0.6) * 10) / 10,
          },
          lastUpdated: new Date().toISOString(),
        }));
      }
    },
    refetchInterval: isLive ? 5000 : false,
    staleTime: 2000,
  });
}

export function useHeatMapAlerts() {
  return useQuery({
    queryKey: ['heatmap', 'alerts'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return MOCK_ALERTS;
    },
  });
}

export function useHeatMapKPIs(zones: HeatMapZone[]) {
  return buildKPIMetrics(zones);
}

export function useRecommendedActions() {
  return useQuery({
    queryKey: ['heatmap', 'actions'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return MOCK_RECOMMENDED_ACTIONS;
    },
  });
}

export function useRevenueZones() {
  return useQuery({
    queryKey: ['heatmap', 'revenue'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return MOCK_REVENUE_ZONES;
    },
  });
}

export function useSupplyResponses() {
  return useQuery({
    queryKey: ['heatmap', 'supply-responses'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return MOCK_SUPPLY_RESPONSES;
    },
  });
}

export { generateDriverMarkers, generateH3Cells, searchZones, generateCompareResult };
export type { HeatMapZone, HeatMapLayerId };
