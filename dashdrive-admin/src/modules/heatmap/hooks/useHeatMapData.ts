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

export function useHeatMapData(isLive: boolean) {
  return useQuery({
    queryKey: ['heatmap', 'zones'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      // Simulate slight metric jitter on each poll
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
    },
    refetchInterval: isLive ? 3000 : false,
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
