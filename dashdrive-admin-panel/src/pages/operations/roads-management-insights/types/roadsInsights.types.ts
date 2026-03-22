// src/pages/operations/roads-management-insights/types/roadsInsights.types.ts

export type RoadsMode = 'live' | 'historical';

export type RoadsInsightTabKey =
  | 'overview'
  | 'roadDetails'
  | 'routes'
  | 'safety'
  | 'analytics';

export type CongestionLevel = 'low' | 'medium' | 'high' | 'critical';

export type HealthStatus = 'success' | 'warning' | 'error' | 'default';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type RouteTrafficMode =
  | 'traffic_unaware'
  | 'traffic_aware'
  | 'traffic_aware_optimal';

export interface RoadsFilters {
  dateRange?: [string, string];
  cityId?: string;
  zoneId?: string;
  roadType?: string[];
  serviceType?: string[];
  severity?: SeverityLevel[];
  incidentStatus?: string[];
  mode?: RoadsMode;
}

export interface RoadsMapLayers {
  traffic: boolean;
  congestion: boolean;
  incidents: boolean;
  speedLimits: boolean;
  routeReliability: boolean;
  riskZones: boolean;
  corridors: boolean;
  vehicleTraces: boolean;
}

export interface RoadsSelectionState {
  selectedRoadId?: string;
  selectedIncidentId?: string;
  selectedRouteId?: string;
  selectedCorridorId?: string;
}

export interface RoadsPageState {
  filters: RoadsFilters;
  layers: RoadsMapLayers;
  activeTab: RoadsInsightTabKey;
  selection: RoadsSelectionState;
  savedViewId?: string;
  modals: {
    exportOpen: boolean;
    coverageWarningOpen: boolean;
    routeCompareOpen: boolean;
  };
  drawers: {
    savedViewsOpen: boolean;
    incidentDetailsOpen: boolean;
  };
}

export interface TrendMetric {
  value: number;
  label?: string;
}

export interface RoadsKpiItem {
  title: string;
  value: string | number;
  trend?: TrendMetric;
  status?: HealthStatus;
  tooltip?: string;
}

export interface RoadsKpiSummary {
  activeCongestedSegments: number;
  averageCorridorSpeedKph: number;
  routesBelowSla: number;
  highRiskIntersections: number;
  openIncidents: number;
  networkReliabilityIndex: number;
}

export interface RoadSegmentMapItem {
  id: string;
  name: string;
  classification: string;
  path: Array<{ lat: number; lng: number }>;
  congestionLevel: CongestionLevel;
  reliabilityScore: number;
  averageSpeedKph?: number;
  postedSpeedLimitKph?: number;
  zoneId?: string;
  cityId?: string;
}

export interface CorridorMapItem {
  id: string;
  name: string;
  path: Array<{ lat: number; lng: number }>;
  congestionLevel: CongestionLevel;
  reliabilityScore: number;
  averageDelayMinutes?: number;
}

export interface IncidentMapItem {
  id: string;
  title: string;
  type: string;
  severity: SeverityLevel;
  lat: number;
  lng: number;
  roadSegmentId?: string;
  status: string;
  startedAt: string;
  estimatedClearAt?: string;
}

export interface RouteMapItem {
  id: string;
  name: string;
  path: Array<{ lat: number; lng: number }>;
  etaMinutes: number;
  distanceKm: number;
  reliabilityScore: number;
  isPrimary?: boolean;
  delayMinutes?: number;
}

export interface RiskZoneMapItem {
  id: string;
  name: string;
  polygon: Array<{ lat: number; lng: number }>;
  riskScore: number;
  severity: SeverityLevel;
}

export interface VehicleTraceMapItem {
  id: string;
  vehicleId: string;
  path: Array<{ lat: number; lng: number }>;
  currentLat: number;
  currentLng: number;
  speedKph?: number;
}

export interface RoadsMapData {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  roads: RoadSegmentMapItem[];
  corridors: CorridorMapItem[];
  incidents: IncidentMapItem[];
  routes: RouteMapItem[];
  riskZones: RiskZoneMapItem[];
  vehicleTraces: VehicleTraceMapItem[];
}

export interface OverviewRecommendation {
  id: string;
  title: string;
  description: string;
  actionType?: 'monitor' | 'avoid' | 'prioritize' | 'review';
}

export interface OverviewListItem {
  id: string;
  name: string;
  value: number | string;
  status?: HealthStatus;
}

export interface RoadsOverviewData {
  networkHealthScore: number;
  mostCongestedCorridors: OverviewListItem[];
  worstRoutes: OverviewListItem[];
  openIncidentsSummary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  coverageWarnings: string[];
  recommendations: OverviewRecommendation[];
}

export interface RelatedRouteItem {
  id: string;
  name: string;
  reliabilityScore: number;
  etaMinutes?: number;
}

export interface RoadDetailsData {
  roadId: string;
  roadName: string;
  classification: string;
  city: string;
  zone: string;
  postedSpeedLimitKph?: number;
  currentAverageSpeedKph?: number;
  congestionLevel?: CongestionLevel;
  reliabilityScore?: number;
  incidentCount24h?: number;
  incidentCount7d?: number;
  incidentCount30d?: number;
  recommendation?: string;
  relatedRoutes?: RelatedRouteItem[];
}

export interface RouteSearchInput {
  origin?: string;
  destination?: string;
  departureTime?: string;
  serviceType?: string;
  trafficMode?: RouteTrafficMode;
  compareAlternates?: boolean;
}

export interface RouteOption {
  id: string;
  name: string;
  etaMinutes: number;
  distanceKm: number;
  reliabilityScore: number;
  delayMinutes?: number;
  isPrimary?: boolean;
}

export interface RouteAnalysisData {
  query: RouteSearchInput;
  routes: RouteOption[];
  historicalAverageEtaMinutes?: number;
  recommendedRouteId?: string;
}

export interface RoadsSafetyItem {
  id: string;
  name: string;
  score: number;
}

export interface RoadsSafetyData {
  highRiskIntersections: RoadsSafetyItem[];
  overspeedSegments: Array<{
    id: string;
    roadName: string;
    gapKph: number;
  }>;
  incidentClusters: Array<{
    id: string;
    name: string;
    incidents: number;
  }>;
  recommendations: string[];
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface HeatBlockPoint {
  day: string;
  hour: string;
  value: number;
}

export interface RoadsPanelAnalyticsData {
  travelTimeTrend: ChartPoint[];
  delayDistribution: ChartPoint[];
  corridorRanking: Array<{
    id: string;
    name: string;
    score: number;
  }>;
  reliabilityByHour: HeatBlockPoint[];
  serviceImpactSummary: Array<{
    serviceType: string;
    impactedRoutes: number;
    delayMinutes: number;
  }>;
}

export interface RoadsTrendChartsData {
  travelTimeTrend: ChartPoint[];
  congestionByHour: ChartPoint[];
  reliabilityByCorridor: Array<{
    corridorId: string;
    corridorName: string;
    reliabilityScore: number;
  }>;
}

export interface TopDelayedRoadRow {
  id: string;
  roadName: string;
  zone: string;
  averageSpeedKph: number;
  delayMinutes: number;
  speedLimitKph?: number;
  incidentCount: number;
  reliabilityScore: number;
  status: HealthStatus;
}

export interface RoutePerformanceRow {
  id: string;
  routeName: string;
  origin: string;
  destination: string;
  etaMinutes: number;
  actualAverageMinutes: number;
  varianceMinutes: number;
  reliabilityScore: number;
  routeStatus: 'preferred' | 'blocked' | 'neutral';
}

export interface RoadsTablesData {
  topDelayedRoads: TopDelayedRoadRow[];
  routePerformance: RoutePerformanceRow[];
}

export interface SavedViewItem {
  id: string;
  name: string;
  description?: string;
  filters: RoadsFilters;
  layers: RoadsMapLayers;
  isFavorite?: boolean;
  createdAt?: string;
}

export interface RoadsSummaryResponse {
  kpis: RoadsKpiSummary;
  overview: RoadsOverviewData;
}

export interface RoadsMapResponse {
  mapData: RoadsMapData;
}

export interface RoadsRoadDetailsResponse {
  data: RoadDetailsData;
}

export interface RoadsRouteCompareResponse {
  data: RouteAnalysisData;
}

export interface RoadsSafetyResponse {
  data: RoadsSafetyData;
}

export interface RoadsAnalyticsResponse {
  panel: RoadsPanelAnalyticsData;
  trends: RoadsTrendChartsData;
  tables: RoadsTablesData;
}

export interface RoadsSavedViewsResponse {
  items: SavedViewItem[];
}
