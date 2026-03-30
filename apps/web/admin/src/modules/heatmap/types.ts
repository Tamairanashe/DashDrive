// ────────────────────────────────────────────────────────────────
// Heat Map — Domain Types
// ────────────────────────────────────────────────────────────────

export type HeatMapServiceType = 'All' | 'Ride Hailing' | 'Food Delivery' | 'Parcel Delivery' | 'City to City';

export type HeatMapLayerId =
  | 'imbalance'
  | 'demand'
  | 'supply'
  | 'eta'
  | 'cancels'
  | 'surge'
  | 'revenue'
  | 'traffic';

export const LAYER_META: Record<HeatMapLayerId, { label: string; color: string; description: string }> = {
  imbalance: { label: 'Imbalance', color: '#8b5cf6', description: 'Demand vs supply gap' },
  demand:    { label: 'Demand',    color: '#ef4444', description: 'Request intensity' },
  supply:    { label: 'Supply',    color: '#22c55e', description: 'Driver/courier density' },
  eta:       { label: 'ETA',       color: '#f59e0b', description: 'Avg pickup time pressure' },
  cancels:   { label: 'Cancels',   color: '#ec4899', description: 'Cancellation hotspots' },
  surge:     { label: 'Surge',     color: '#6366f1', description: 'Active surge zones' },
  revenue:   { label: 'Revenue',   color: '#06b6d4', description: 'Revenue density' },
  traffic:   { label: 'Traffic',   color: '#78716c', description: 'Road congestion impact' },
};

export type DateRangePreset =
  | 'realtime'
  | 'today'
  | 'yesterday'
  | 'last7'
  | 'last30'
  | 'thisMonth'
  | 'lastMonth'
  | 'custom';

export type LiveMode = 'live' | 'history';

export type AlertSeverity = 'critical' | 'severe' | 'warning' | 'info';

export interface HeatMapAlert {
  id: string;
  severity: AlertSeverity;
  zone: string;
  zoneId: string;
  summary: string;
  detail: string;
  detectedAt: string;
  status: 'active' | 'acknowledged' | 'resolved';
  recommendedAction: string;
  metric?: string;
  metricValue?: number;
}

export interface ZoneMetrics {
  activeDemand: number;
  idleSupply: number;
  busySupply: number;
  avgETA: number;
  pickupETA: number;
  cancelRate: number;
  acceptanceRate: number;
  fulfillmentRate: number;
  revenue: number;
  demandSupplyRatio: number;
  imbalanceScore: number;
  surgeMultiplier: number | null;
  surgeExpiresAt: string | null;
}

export interface HeatMapZone {
  id: string;
  name: string;
  city: string;
  serviceType: HeatMapServiceType;
  status: 'healthy' | 'elevated' | 'critical' | 'inactive';
  lat: number;
  lng: number;
  polygon: { lat: number; lng: number }[];
  metrics: ZoneMetrics;
  lastUpdated: string;
  contextInsights: {
    traffic: string;
    weather: string;
    nearbyEvents: string | null;
    restaurantBacklog: string | null;
    routePressure: string | null;
  };
  // Historical comparison
  historyComparison: {
    todayVsYesterday: { metric: string; today: number; yesterday: number }[];
    last7VsPrev7: { metric: string; current: number; previous: number }[];
    thisMonthVsLast: { metric: string; current: number; previous: number }[];
  };
  // Mini trend data for charts
  trendData: {
    demand: { time: string; value: number }[];
    supply: { time: string; value: number }[];
    eta: { time: string; value: number }[];
    cancels: { time: string; value: number }[];
    revenue: { time: string; value: number }[];
  };
}

export interface KPIMetric {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  trend: 'up' | 'down' | 'flat';
  trendValue: string;
  trendIsGood: boolean;
  icon: string;
  color: string;
}

export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  zone: string;
  zoneId: string;
  actionType: 'surge' | 'notify' | 'dispatch' | 'investigate' | 'incentive';
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: string;
}

export interface RevenueZone {
  id: string;
  name: string;
  revenue: number;
  trips: number;
  gmv: number;
  trend: 'up' | 'down' | 'flat';
  trendPercent: number;
}

export interface SupplyResponse {
  zoneId: string;
  zoneName: string;
  driversNotified: number;
  driversMoving: number;
  supplyChangePct: number;
  lastActionTime: string;
  actionType: string;
}

export interface CompareConfig {
  type: 'zone-vs-zone' | 'same-zone-vs-date' | 'multi-zone' | 'period';
  zoneA: string | null;
  zoneB: string | null;
  metric: HeatMapLayerId;
  primaryRange: DateRangePreset;
  compareTo: 'previous' | 'yesterday' | 'lastWeek' | 'lastMonth' | 'custom';
  visualization: 'side-by-side' | 'table' | 'chart' | 'overlay';
}

export interface CompareResult {
  zoneA: { name: string; value: number };
  zoneB: { name: string; value: number };
  difference: number;
  percentChange: number;
  recommendation: string;
  details: { metric: string; a: number; b: number; diff: number; pctChange: number }[];
}

export interface SurgeConfig {
  zoneId: string;
  zoneName: string;
  multiplier: number;
  durationMinutes: number;
  services: HeatMapServiceType[];
}

export interface NotifyConfig {
  zoneId: string;
  zoneName: string;
  message: string;
  channels: ('push' | 'sms' | 'in-app')[];
  eligibleDrivers: number;
}

// H3 hex cell for deck.gl overlay
export interface H3HexCell {
  h3Index: string;
  value: number; // 0–1 normalized intensity
  lat: number;
  lng: number;
}

export interface DriverMarker {
  id: string;
  lat: number;
  lng: number;
  status: 'idle' | 'busy' | 'en-route';
  serviceType: HeatMapServiceType;
}

export type CompareType = CompareConfig['type'];
export type CompareVisualization = CompareConfig['visualization'];
