// ────────────────────────────────────────────────────────────────
// Heat Map — Comprehensive Mock Data (Harare, Zimbabwe)
// ────────────────────────────────────────────────────────────────

import type {
  HeatMapZone,
  HeatMapAlert,
  KPIMetric,
  RecommendedAction,
  RevenueZone,
  SupplyResponse,
  DriverMarker,
  H3HexCell,
  CompareResult,
} from './types';

// ── Cities ───────────────────────────────────────────────────
export const CITIES = [
  { id: 'harare', name: 'Harare', lat: -17.8252, lng: 31.0335 },
  { id: 'bulawayo', name: 'Bulawayo', lat: -20.1325, lng: 28.6266 },
  { id: 'mutare', name: 'Mutare', lat: -18.9707, lng: 32.6709 },
  { id: 'lusaka', name: 'Lusaka', lat: -15.3875, lng: 28.3228 },
];

// ── Trend generator ──────────────────────────────────────────
function genTrend(base: number, variance: number, points = 24) {
  return Array.from({ length: points }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    value: Math.max(0, Math.round(base + (Math.random() - 0.5) * variance)),
  }));
}

function genHistory(metrics: string[], rangeLabel: string) {
  return metrics.map((metric) => {
    const current = Math.round(Math.random() * 300 + 50);
    const previous = Math.round(current * (0.7 + Math.random() * 0.6));
    return rangeLabel === 'todayVsYesterday'
      ? { metric, today: current, yesterday: previous }
      : { metric, current, previous };
  });
}

// ── Zone polygon helpers ────────────────────────────────────
function makePolygon(centerLat: number, centerLng: number, sizeKm = 1.5): { lat: number; lng: number }[] {
  const d = sizeKm / 111; // rough lat/lng offset for km
  return [
    { lat: centerLat + d, lng: centerLng - d },
    { lat: centerLat + d, lng: centerLng + d },
    { lat: centerLat - d, lng: centerLng + d },
    { lat: centerLat - d, lng: centerLng - d },
  ];
}

// ── Zones ────────────────────────────────────────────────────
const zoneSeeds: {
  id: string; name: string; lat: number; lng: number; status: HeatMapZone['status'];
  demand: number; idleSupply: number; busySupply: number; avgETA: number; cancelRate: number;
  surgeMultiplier: number | null; traffic: string; weather: string;
}[] = [
  { id: 'cbd', name: 'CBD', lat: -17.8292, lng: 31.0522, status: 'critical', demand: 342, idleSupply: 24, busySupply: 89, avgETA: 12.4, cancelRate: 8.2, surgeMultiplier: 1.5, traffic: 'Heavy congestion on Sam Nujoma St', weather: 'Clear skies' },
  { id: 'borrowdale', name: 'Borrowdale', lat: -17.7632, lng: 31.0854, status: 'elevated', demand: 187, idleSupply: 38, busySupply: 52, avgETA: 7.8, cancelRate: 4.1, surgeMultiplier: null, traffic: 'Moderate on Borrowdale Rd', weather: 'Clear skies' },
  { id: 'avondale', name: 'Avondale', lat: -17.7928, lng: 31.0289, status: 'elevated', demand: 156, idleSupply: 22, busySupply: 41, avgETA: 9.2, cancelRate: 5.3, surgeMultiplier: 1.2, traffic: 'Light traffic', weather: 'Partly cloudy' },
  { id: 'mt-pleasant', name: 'Mt Pleasant', lat: -17.7683, lng: 31.0457, status: 'healthy', demand: 98, idleSupply: 45, busySupply: 32, avgETA: 5.1, cancelRate: 2.4, surgeMultiplier: null, traffic: 'Normal flow', weather: 'Clear skies' },
  { id: 'eastlea', name: 'Eastlea', lat: -17.8312, lng: 31.0681, status: 'healthy', demand: 72, idleSupply: 33, busySupply: 21, avgETA: 4.8, cancelRate: 1.9, surgeMultiplier: null, traffic: 'Normal flow', weather: 'Clear skies' },
  { id: 'mbare', name: 'Mbare', lat: -17.8541, lng: 31.0403, status: 'critical', demand: 256, idleSupply: 11, busySupply: 65, avgETA: 14.6, cancelRate: 11.3, surgeMultiplier: 2.0, traffic: 'Heavy — market day congestion', weather: 'Light rain' },
  { id: 'airport', name: 'RG Mugabe Airport', lat: -17.9318, lng: 31.0928, status: 'elevated', demand: 124, idleSupply: 18, busySupply: 28, avgETA: 8.9, cancelRate: 3.7, surgeMultiplier: 1.3, traffic: 'Airport access road moderate', weather: 'Clear skies' },
  { id: 'chitungwiza', name: 'Chitungwiza', lat: -18.0127, lng: 31.0756, status: 'healthy', demand: 89, idleSupply: 41, busySupply: 18, avgETA: 6.2, cancelRate: 3.1, surgeMultiplier: null, traffic: 'Light traffic', weather: 'Clear skies' },
  { id: 'highfield', name: 'Highfield', lat: -17.8672, lng: 31.0148, status: 'elevated', demand: 134, idleSupply: 19, busySupply: 44, avgETA: 10.1, cancelRate: 6.8, surgeMultiplier: null, traffic: 'Moderate congestion', weather: 'Clear skies' },
  { id: 'malbereign', name: 'Malbereign', lat: -17.8389, lng: 30.9914, status: 'healthy', demand: 64, idleSupply: 29, busySupply: 15, avgETA: 4.5, cancelRate: 1.5, surgeMultiplier: null, traffic: 'Normal flow', weather: 'Clear skies' },
];

const histMetrics = ['Demand', 'Supply', 'ETA', 'Cancel Rate', 'Revenue'];

export const MOCK_ZONES: HeatMapZone[] = zoneSeeds.map((z) => {
  const fulfilRate = Math.round((1 - z.cancelRate / 100) * 100 * 10) / 10;
  const ratio = Math.round((z.demand / Math.max(z.idleSupply + z.busySupply, 1)) * 10) / 10;
  const imbalance = Math.min(100, Math.round(ratio * 15));
  const revenueBase = Math.round(z.demand * 4.5 + Math.random() * 200);
  return {
    id: z.id,
    name: z.name,
    city: 'Harare',
    serviceType: 'All' as const,
    status: z.status,
    lat: z.lat,
    lng: z.lng,
    polygon: makePolygon(z.lat, z.lng, z.name === 'RG Mugabe Airport' ? 2.5 : 1.5),
    metrics: {
      activeDemand: z.demand,
      idleSupply: z.idleSupply,
      busySupply: z.busySupply,
      avgETA: z.avgETA,
      pickupETA: Math.round(z.avgETA * 0.7 * 10) / 10,
      cancelRate: z.cancelRate,
      acceptanceRate: Math.round((100 - z.cancelRate * 1.2) * 10) / 10,
      fulfillmentRate: fulfilRate,
      revenue: revenueBase,
      demandSupplyRatio: ratio,
      imbalanceScore: imbalance,
      surgeMultiplier: z.surgeMultiplier,
      surgeExpiresAt: z.surgeMultiplier ? new Date(Date.now() + 1800000).toISOString() : null,
    },
    lastUpdated: new Date(Date.now() - Math.random() * 30000).toISOString(),
    contextInsights: {
      traffic: z.traffic,
      weather: z.weather,
      nearbyEvents: z.id === 'cbd' ? 'HICC Conference — 2,000 attendees expected' : z.id === 'airport' ? 'International arrivals peak 14:00–16:00' : null,
      restaurantBacklog: z.id === 'avondale' ? '12 orders pending avg 8 min delay' : null,
      routePressure: z.id === 'chitungwiza' ? 'Seke Rd bottleneck adding 6 min avg' : null,
    },
    historyComparison: {
      todayVsYesterday: genHistory(histMetrics, 'todayVsYesterday') as any,
      last7VsPrev7: genHistory(histMetrics, 'last7VsPrev7') as any,
      thisMonthVsLast: genHistory(histMetrics, 'thisMonthVsLast') as any,
    },
    trendData: {
      demand: genTrend(z.demand, z.demand * 0.4),
      supply: genTrend(z.idleSupply + z.busySupply, 30),
      eta: genTrend(z.avgETA, 5),
      cancels: genTrend(z.cancelRate, 4),
      revenue: genTrend(z.demand * 4.5, 200),
    },
  };
});

// ── KPI Metrics ──────────────────────────────────────────────
export function buildKPIMetrics(zones: HeatMapZone[]): KPIMetric[] {
  if (zones.length === 0) {
    return [
      { id: 'total-requests', label: 'Total Requests', value: '0', trend: 'flat', trendValue: '0%', trendIsGood: true, icon: 'activity', color: 'blue' },
      { id: 'idle-supply', label: 'Idle Supply', value: '0', trend: 'flat', trendValue: '0%', trendIsGood: true, icon: 'users', color: 'green' },
      { id: 'avg-eta', label: 'Avg ETA', value: '0m', trend: 'flat', trendValue: '0m', trendIsGood: true, icon: 'clock', color: 'amber' },
      { id: 'cancel-rate', label: 'Cancel Rate', value: '0%', trend: 'flat', trendValue: '0%', trendIsGood: true, icon: 'x-circle', color: 'rose' },
      { id: 'fulfillment', label: 'Fulfillment', value: '0%', trend: 'flat', trendValue: '0%', trendIsGood: true, icon: 'check-circle', color: 'emerald' },
      { id: 'surge-zones', label: 'Surge Zones', value: '0', trend: 'flat', trendValue: '0 active', trendIsGood: true, icon: 'zap', color: 'violet' },
      { id: 'revenue-density', label: 'Revenue', value: '$0.0k', trend: 'flat', trendValue: '0%', trendIsGood: true, icon: 'dollar-sign', color: 'cyan' },
      { id: 'top-hot-zone', label: 'Hottest Zone', value: 'N/A', trend: 'flat', trendValue: 'Score 0', trendIsGood: true, icon: 'flame', color: 'red' },
    ];
  }

  const totalDemand = zones.reduce((s, z) => s + z.metrics.activeDemand, 0);
  const totalIdle = zones.reduce((s, z) => s + z.metrics.idleSupply, 0);
  const avgEta = Math.round((zones.reduce((s, z) => s + z.metrics.avgETA, 0) / zones.length) * 10) / 10;
  const avgCancel = Math.round((zones.reduce((s, z) => s + z.metrics.cancelRate, 0) / zones.length) * 10) / 10;
  const avgFulfill = Math.round((zones.reduce((s, z) => s + z.metrics.fulfillmentRate, 0) / zones.length) * 10) / 10;
  const surgeCount = zones.filter((z) => z.metrics.surgeMultiplier !== null).length;
  const totalRevenue = zones.reduce((s, z) => s + z.metrics.revenue, 0);
  const hottest = zones.reduce((a, b) => (a.metrics.imbalanceScore > b.metrics.imbalanceScore ? a : b));

  return [
    { id: 'total-requests', label: 'Total Requests', value: totalDemand.toLocaleString(), trend: 'up', trendValue: '+12%', trendIsGood: true, icon: 'activity', color: 'blue' },
    { id: 'idle-supply', label: 'Idle Supply', value: totalIdle, trend: 'down', trendValue: '-8%', trendIsGood: false, icon: 'users', color: 'green' },
    { id: 'avg-eta', label: 'Avg ETA', value: `${avgEta}m`, trend: 'up', trendValue: '+1.2m', trendIsGood: false, icon: 'clock', color: 'amber' },
    { id: 'cancel-rate', label: 'Cancel Rate', value: `${avgCancel}%`, trend: 'up', trendValue: '+0.8%', trendIsGood: false, icon: 'x-circle', color: 'rose' },
    { id: 'fulfillment', label: 'Fulfillment', value: `${avgFulfill}%`, trend: 'down', trendValue: '-1.1%', trendIsGood: false, icon: 'check-circle', color: 'emerald' },
    { id: 'surge-zones', label: 'Surge Zones', value: surgeCount, trend: 'up', trendValue: `${surgeCount} active`, trendIsGood: false, icon: 'zap', color: 'violet' },
    { id: 'revenue-density', label: 'Revenue', value: `$${(totalRevenue / 1000).toFixed(1)}k`, trend: 'up', trendValue: '+6%', trendIsGood: true, icon: 'dollar-sign', color: 'cyan' },
    { id: 'top-hot-zone', label: 'Hottest Zone', value: hottest.name, trend: 'up', trendValue: `Score ${hottest.metrics.imbalanceScore}`, trendIsGood: false, icon: 'flame', color: 'red' },
  ];
}

// ── Alerts ───────────────────────────────────────────────────
export const MOCK_ALERTS: HeatMapAlert[] = [
  {
    id: 'alert-1', severity: 'critical', zone: 'CBD', zoneId: 'cbd',
    summary: 'Severe supply-demand imbalance',
    detail: 'Demand exceeds supply by 6x. Average ETA has risen to 12.4 min.',
    detectedAt: new Date(Date.now() - 180000).toISOString(),
    status: 'active',
    recommendedAction: 'Apply 1.5x surge and notify 120 nearby drivers',
    metric: 'Imbalance Score', metricValue: 87,
  },
  {
    id: 'alert-2', severity: 'critical', zone: 'Mbare', zoneId: 'mbare',
    summary: 'Extreme supply shortage',
    detail: 'Only 11 idle drivers for 256 active requests. Cancel rate at 11.3%.',
    detectedAt: new Date(Date.now() - 420000).toISOString(),
    status: 'active',
    recommendedAction: 'Apply 2.0x surge and redirect fleet from Malbereign',
    metric: 'Cancel Rate', metricValue: 11.3,
  },
  {
    id: 'alert-3', severity: 'severe', zone: 'Avondale', zoneId: 'avondale',
    summary: 'Food delivery backlog rising',
    detail: '12 orders pending with avg 8 min prep delay. Courier supply thin.',
    detectedAt: new Date(Date.now() - 600000).toISOString(),
    status: 'active',
    recommendedAction: 'Notify food couriers in Mt Pleasant and Borrowdale',
    metric: 'ETA', metricValue: 9.2,
  },
  {
    id: 'alert-4', severity: 'warning', zone: 'Highfield', zoneId: 'highfield',
    summary: 'Rising cancellation cluster',
    detail: 'Cancel rate at 6.8%, up from 3.2% baseline.',
    detectedAt: new Date(Date.now() - 900000).toISOString(),
    status: 'active',
    recommendedAction: 'Investigate driver acceptance patterns',
    metric: 'Cancels', metricValue: 6.8,
  },
  {
    id: 'alert-5', severity: 'warning', zone: 'RG Mugabe Airport', zoneId: 'airport',
    summary: 'Airport arrivals spike expected',
    detail: 'International arrivals peak 14:00–16:00. Pre-position supply.',
    detectedAt: new Date(Date.now() - 300000).toISOString(),
    status: 'active',
    recommendedAction: 'Send incentive to 30 drivers near Chitungwiza',
    metric: 'Demand', metricValue: 124,
  },
  {
    id: 'alert-6', severity: 'info', zone: 'Mt Pleasant', zoneId: 'mt-pleasant',
    summary: 'Supply well balanced',
    detail: 'Healthy zone — 45 idle / 32 busy, ETA 5.1 min.',
    detectedAt: new Date(Date.now() - 120000).toISOString(),
    status: 'active',
    recommendedAction: 'No action required — consider reallocating surplus to CBD',
  },
];

// ── Recommended Actions ──────────────────────────────────────
export const MOCK_RECOMMENDED_ACTIONS: RecommendedAction[] = [
  { id: 'ra-1', title: 'Apply 1.5x surge in CBD', description: 'Demand is 6x supply. Surge will attract nearby idle drivers and moderate demand.', zone: 'CBD', zoneId: 'cbd', actionType: 'surge', priority: 'high', estimatedImpact: '+35 drivers within 15 min' },
  { id: 'ra-2', title: 'Notify 120 drivers near CBD', description: 'Send push notification to idle drivers in Mt Pleasant, Avondale, and Eastlea to head towards CBD.', zone: 'CBD', zoneId: 'cbd', actionType: 'notify', priority: 'high', estimatedImpact: 'ETA reduction by ~3 min' },
  { id: 'ra-3', title: 'Expand dispatch radius in Avondale', description: 'Current 3km radius too narrow for food delivery demand. Expand to 5km.', zone: 'Avondale', zoneId: 'avondale', actionType: 'dispatch', priority: 'medium', estimatedImpact: '+18% order fulfillment' },
  { id: 'ra-4', title: 'Investigate Seke Rd congestion', description: 'Road bottleneck adding 6 min to Chitungwiza routes. Consider rerouting.', zone: 'Chitungwiza', zoneId: 'chitungwiza', actionType: 'investigate', priority: 'medium', estimatedImpact: 'ETA improvement for 89 pending requests' },
  { id: 'ra-5', title: 'Offer $2 incentive for Mbare pickups', description: 'High cancel rate (11.3%) driven by driver reluctance. Incentive may improve acceptance.', zone: 'Mbare', zoneId: 'mbare', actionType: 'incentive', priority: 'high', estimatedImpact: 'Cancel rate drop to ~6%' },
];

// ── Revenue Zones ────────────────────────────────────────────
export const MOCK_REVENUE_ZONES: RevenueZone[] = [
  { id: 'cbd', name: 'CBD', revenue: 14820, trips: 342, gmv: 18540, trend: 'up', trendPercent: 12 },
  { id: 'borrowdale', name: 'Borrowdale', revenue: 9460, trips: 187, gmv: 12300, trend: 'up', trendPercent: 8 },
  { id: 'mbare', name: 'Mbare', revenue: 7340, trips: 256, gmv: 8920, trend: 'down', trendPercent: -3 },
  { id: 'avondale', name: 'Avondale', revenue: 6180, trips: 156, gmv: 7890, trend: 'up', trendPercent: 5 },
  { id: 'airport', name: 'RG Mugabe Airport', revenue: 5920, trips: 124, gmv: 8100, trend: 'up', trendPercent: 15 },
];

// ── Supply Response ──────────────────────────────────────────
export const MOCK_SUPPLY_RESPONSES: SupplyResponse[] = [
  { zoneId: 'cbd', zoneName: 'CBD', driversNotified: 143, driversMoving: 28, supplyChangePct: 18, lastActionTime: new Date(Date.now() - 900000).toISOString(), actionType: 'Surge 1.5x + Notify' },
  { zoneId: 'mbare', zoneName: 'Mbare', driversNotified: 87, driversMoving: 12, supplyChangePct: 9, lastActionTime: new Date(Date.now() - 600000).toISOString(), actionType: 'Surge 2.0x' },
];

// ── Driver Markers ───────────────────────────────────────────
export function generateDriverMarkers(zones: HeatMapZone[]): DriverMarker[] {
  const markers: DriverMarker[] = [];
  const services: HeatMapZone['serviceType'][] = ['Ride Hailing', 'Food Delivery', 'Parcel Delivery'];

  zones.forEach((zone) => {
    const totalDrivers = zone.metrics.idleSupply + zone.metrics.busySupply;
    for (let i = 0; i < totalDrivers; i++) {
      const isIdle = i < zone.metrics.idleSupply;
      markers.push({
        id: `${zone.id}-drv-${i}`,
        lat: zone.lat + (Math.random() - 0.5) * 0.025,
        lng: zone.lng + (Math.random() - 0.5) * 0.025,
        status: isIdle ? 'idle' : Math.random() > 0.3 ? 'busy' : 'en-route',
        serviceType: services[Math.floor(Math.random() * services.length)],
      });
    }
  });

  return markers;
}

// ── H3 Hex Cells (simulated) ─────────────────────────────────
export function generateH3Cells(zones: HeatMapZone[], layer: string): H3HexCell[] {
  const cells: H3HexCell[] = [];

  zones.forEach((zone) => {
    // Generate hex cells around zone center
    const count = Math.floor(8 + Math.random() * 12);
    for (let i = 0; i < count; i++) {
      let intensity = 0;
      switch (layer) {
        case 'imbalance': intensity = zone.metrics.imbalanceScore / 100; break;
        case 'demand': intensity = Math.min(1, zone.metrics.activeDemand / 350); break;
        case 'supply': intensity = Math.min(1, (zone.metrics.idleSupply + zone.metrics.busySupply) / 150); break;
        case 'eta': intensity = Math.min(1, zone.metrics.avgETA / 15); break;
        case 'cancels': intensity = Math.min(1, zone.metrics.cancelRate / 12); break;
        case 'surge': intensity = zone.metrics.surgeMultiplier ? zone.metrics.surgeMultiplier / 2.5 : 0; break;
        case 'revenue': intensity = Math.min(1, zone.metrics.revenue / 15000); break;
        case 'traffic': intensity = zone.contextInsights.traffic.includes('Heavy') ? 0.9 : zone.contextInsights.traffic.includes('Moderate') ? 0.5 : 0.2; break;
      }
      // Add some variance per cell
      intensity = Math.min(1, Math.max(0, intensity + (Math.random() - 0.5) * 0.3));

      cells.push({
        h3Index: `8a${zone.id}${i.toString(16).padStart(4, '0')}`,
        value: intensity,
        lat: zone.lat + (Math.random() - 0.5) * 0.03,
        lng: zone.lng + (Math.random() - 0.5) * 0.03,
      });
    }
  });

  return cells;
}

// ── Compare mock result ─────────────────────────────────────
export function generateCompareResult(zoneAId: string, zoneBId: string, zones: HeatMapZone[]): CompareResult | null {
  const a = zones.find((z) => z.id === zoneAId);
  const b = zones.find((z) => z.id === zoneBId);
  if (!a || !b) return null;

  const details = [
    { metric: 'Demand', a: a.metrics.activeDemand, b: b.metrics.activeDemand, diff: 0, pctChange: 0 },
    { metric: 'ETA', a: a.metrics.avgETA, b: b.metrics.avgETA, diff: 0, pctChange: 0 },
    { metric: 'Supply', a: a.metrics.idleSupply + a.metrics.busySupply, b: b.metrics.idleSupply + b.metrics.busySupply, diff: 0, pctChange: 0 },
    { metric: 'Cancel Rate', a: a.metrics.cancelRate, b: b.metrics.cancelRate, diff: 0, pctChange: 0 },
    { metric: 'Revenue', a: a.metrics.revenue, b: b.metrics.revenue, diff: 0, pctChange: 0 },
    { metric: 'Fulfillment', a: a.metrics.fulfillmentRate, b: b.metrics.fulfillmentRate, diff: 0, pctChange: 0 },
  ].map((d) => ({
    ...d,
    diff: Math.round((d.a - d.b) * 10) / 10,
    pctChange: Math.round(((d.a - d.b) / Math.max(d.b, 1)) * 1000) / 10,
  }));

  const demandDiff = details[0].pctChange;
  const etaDiff = details[1].pctChange;
  const supplyDiff = details[2].pctChange;

  let recommendation = '';
  if (demandDiff > 20) recommendation += `${a.name} demand is ${Math.abs(demandDiff)}% higher than ${b.name}. `;
  if (etaDiff > 20) recommendation += `ETA is ${Math.abs(etaDiff)}% worse in ${a.name}. `;
  if (supplyDiff < -10) recommendation += `Supply is ${Math.abs(supplyDiff)}% lower in ${a.name}. `;
  if (!recommendation) recommendation = `Both zones are performing similarly across key metrics.`;
  recommendation += demandDiff > 30 ? `Recommendation: Apply Surge + Notify Drivers in ${a.name}.` : '';

  return {
    zoneA: { name: a.name, value: a.metrics.activeDemand },
    zoneB: { name: b.name, value: b.metrics.activeDemand },
    difference: details[0].diff,
    percentChange: details[0].pctChange,
    recommendation,
    details,
  };
}

// ── Search support ──────────────────────────────────────────
export const SEARCH_SUGGESTIONS = [
  'highest demand',
  'low supply',
  'high ETA',
  'food hotspots',
  'parcel demand',
  'surge zones',
  'CBD',
  'Borrowdale',
  'Mbare',
  'Harare to Bulawayo',
];

// Smart search scoring
export function searchZones(query: string, zones: HeatMapZone[]): HeatMapZone[] {
  const q = query.toLowerCase().trim();
  if (!q) return zones;

  // Intent-based search
  if (q.includes('highest demand') || q.includes('high demand')) {
    return [...zones].sort((a, b) => b.metrics.activeDemand - a.metrics.activeDemand);
  }
  if (q.includes('low supply') || q.includes('supply shortage')) {
    return [...zones].sort((a, b) => a.metrics.idleSupply - b.metrics.idleSupply);
  }
  if (q.includes('high eta') || q.includes('slow')) {
    return [...zones].sort((a, b) => b.metrics.avgETA - a.metrics.avgETA);
  }
  if (q.includes('surge')) {
    return zones.filter((z) => z.metrics.surgeMultiplier !== null);
  }
  if (q.includes('food')) {
    return zones.filter((z) => z.contextInsights.restaurantBacklog !== null);
  }
  if (q.includes('cancel')) {
    return [...zones].sort((a, b) => b.metrics.cancelRate - a.metrics.cancelRate);
  }

  // Name-based search
  return zones.filter((z) =>
    z.name.toLowerCase().includes(q) || z.id.includes(q) || z.city.toLowerCase().includes(q)
  );
}
