// src/pages/operations/roads-management-insights/services/roadsInsights.transformers.ts

import type {
  ChartPoint,
  CongestionLevel,
  HealthStatus,
  IncidentMapItem,
  RiskZoneMapItem,
  RoadDetailsData,
  RoadsAnalyticsResponse,
  RoadsMapResponse,
  RoadsRoadDetailsResponse,
  RoadsRouteCompareResponse,
  RoadsSafetyResponse,
  RoadsSummaryResponse,
  RouteOption,
  SeverityLevel,
  TopDelayedRoadRow,
  VehicleTraceMapItem,
} from '../types/roadsInsights.types';

const fallbackNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return fallback;
};

const fallbackString = (value: unknown, fallback = ''): string => {
  return typeof value === 'string' ? value : fallback;
};

const normalizeSeverity = (value: unknown): SeverityLevel => {
  const allowed: SeverityLevel[] = ['low', 'medium', 'high', 'critical'];
  return allowed.includes(value as SeverityLevel) ? (value as SeverityLevel) : 'low';
};

const normalizeCongestion = (value: unknown): CongestionLevel => {
  const allowed: CongestionLevel[] = ['low', 'medium', 'high', 'critical'];
  return allowed.includes(value as CongestionLevel) ? (value as CongestionLevel) : 'low';
};

const normalizeHealthStatus = (value: unknown): HealthStatus => {
  const allowed: HealthStatus[] = ['success', 'warning', 'error', 'default'];
  return allowed.includes(value as HealthStatus) ? (value as HealthStatus) : 'default';
};

const normalizeChartPoint = (point: unknown): ChartPoint => {
  const p = (point ?? {}) as Partial<ChartPoint>;
  return {
    label: fallbackString(p.label, 'Unknown'),
    value: fallbackNumber(p.value),
  };
};

export const normalizeSummaryResponse = (
  response: RoadsSummaryResponse,
): RoadsSummaryResponse => {
  return {
    kpis: {
      activeCongestedSegments: fallbackNumber(response?.kpis?.activeCongestedSegments),
      averageCorridorSpeedKph: fallbackNumber(response?.kpis?.averageCorridorSpeedKph),
      routesBelowSla: fallbackNumber(response?.kpis?.routesBelowSla),
      highRiskIntersections: fallbackNumber(response?.kpis?.highRiskIntersections),
      openIncidents: fallbackNumber(response?.kpis?.openIncidents),
      networkReliabilityIndex: fallbackNumber(response?.kpis?.networkReliabilityIndex),
    },
    overview: {
      networkHealthScore: fallbackNumber(response?.overview?.networkHealthScore),
      mostCongestedCorridors: (response?.overview?.mostCongestedCorridors ?? []).map((item) => ({
        id: fallbackString(item.id, crypto.randomUUID?.() ?? `${Math.random()}`),
        name: fallbackString(item.name, 'Unknown Corridor'),
        value: typeof item.value === 'string' || typeof item.value === 'number' ? item.value : '—',
        status: normalizeHealthStatus(item.status),
      })),
      worstRoutes: (response?.overview?.worstRoutes ?? []).map((item) => ({
        id: fallbackString(item.id, crypto.randomUUID?.() ?? `${Math.random()}`),
        name: fallbackString(item.name, 'Unknown Route'),
        value: typeof item.value === 'string' || typeof item.value === 'number' ? item.value : '—',
        status: normalizeHealthStatus(item.status),
      })),
      openIncidentsSummary: {
        total: fallbackNumber(response?.overview?.openIncidentsSummary?.total),
        critical: fallbackNumber(response?.overview?.openIncidentsSummary?.critical),
        high: fallbackNumber(response?.overview?.openIncidentsSummary?.high),
        medium: fallbackNumber(response?.overview?.openIncidentsSummary?.medium),
        low: fallbackNumber(response?.overview?.openIncidentsSummary?.low),
      },
      coverageWarnings: (response?.overview?.coverageWarnings ?? []).map((item) =>
        fallbackString(item),
      ),
      recommendations: (response?.overview?.recommendations ?? []).map((item) => ({
        id: fallbackString(item.id, crypto.randomUUID?.() ?? `${Math.random()}`),
        title: fallbackString(item.title, 'Recommendation'),
        description: fallbackString(item.description),
        actionType: item.actionType,
      })),
    },
  };
};

export const normalizeMapResponse = (response: RoadsMapResponse): RoadsMapResponse => {
  return {
    mapData: {
      center: {
        lat: fallbackNumber(response?.mapData?.center?.lat),
        lng: fallbackNumber(response?.mapData?.center?.lng),
      },
      zoom: fallbackNumber(response?.mapData?.zoom, 12),
      roads: (response?.mapData?.roads ?? []).map((road) => ({
        ...road,
        id: fallbackString(road.id, crypto.randomUUID?.() ?? `${Math.random()}`),
        name: fallbackString(road.name, 'Unnamed Road'),
        classification: fallbackString(road.classification, 'unknown'),
        path: (road.path ?? []).map((point) => ({
          lat: fallbackNumber(point.lat),
          lng: fallbackNumber(point.lng),
        })),
        congestionLevel: normalizeCongestion(road.congestionLevel),
        reliabilityScore: fallbackNumber(road.reliabilityScore),
        averageSpeedKph: fallbackNumber(road.averageSpeedKph),
        postedSpeedLimitKph: fallbackNumber(road.postedSpeedLimitKph),
      })),
      corridors: (response?.mapData?.corridors ?? []).map((corridor) => ({
        ...corridor,
        id: fallbackString(corridor.id, crypto.randomUUID?.() ?? `${Math.random()}`),
        name: fallbackString(corridor.name, 'Unnamed Corridor'),
        path: (corridor.path ?? []).map((point) => ({
          lat: fallbackNumber(point.lat),
          lng: fallbackNumber(point.lng),
        })),
        congestionLevel: normalizeCongestion(corridor.congestionLevel),
        reliabilityScore: fallbackNumber(corridor.reliabilityScore),
        averageDelayMinutes: fallbackNumber(corridor.averageDelayMinutes),
      })),
      incidents: (response?.mapData?.incidents ?? []).map(
        (incident): IncidentMapItem => ({
          ...incident,
          id: fallbackString(incident.id, crypto.randomUUID?.() ?? `${Math.random()}`),
          title: fallbackString(incident.title, 'Incident'),
          type: fallbackString(incident.type, 'unknown'),
          severity: normalizeSeverity(incident.severity),
          lat: fallbackNumber(incident.lat),
          lng: fallbackNumber(incident.lng),
          status: fallbackString(incident.status, 'unknown'),
          startedAt: fallbackString(incident.startedAt),
          estimatedClearAt: incident.estimatedClearAt,
        }),
      ),
      routes: (response?.mapData?.routes ?? []).map((route) => ({
        ...route,
        id: fallbackString(route.id, crypto.randomUUID?.() ?? `${Math.random()}`),
        name: fallbackString(route.name, 'Unnamed Route'),
        path: (route.path ?? []).map((point) => ({
          lat: fallbackNumber(point.lat),
          lng: fallbackNumber(point.lng),
        })),
        etaMinutes: fallbackNumber(route.etaMinutes),
        distanceKm: fallbackNumber(route.distanceKm),
        reliabilityScore: fallbackNumber(route.reliabilityScore),
        delayMinutes: fallbackNumber(route.delayMinutes),
        isPrimary: Boolean(route.isPrimary),
      })),
      riskZones: (response?.mapData?.riskZones ?? []).map(
        (zone): RiskZoneMapItem => ({
          ...zone,
          id: fallbackString(zone.id, crypto.randomUUID?.() ?? `${Math.random()}`),
          name: fallbackString(zone.name, 'Risk Zone'),
          polygon: (zone.polygon ?? []).map((point) => ({
            lat: fallbackNumber(point.lat),
            lng: fallbackNumber(point.lng),
          })),
          riskScore: fallbackNumber(zone.riskScore),
          severity: normalizeSeverity(zone.severity),
        }),
      ),
      vehicleTraces: (response?.mapData?.vehicleTraces ?? []).map(
        (trace): VehicleTraceMapItem => ({
          ...trace,
          id: fallbackString(trace.id, crypto.randomUUID?.() ?? `${Math.random()}`),
          vehicleId: fallbackString(trace.vehicleId, 'unknown'),
          path: (trace.path ?? []).map((point) => ({
            lat: fallbackNumber(point.lat),
            lng: fallbackNumber(point.lng),
          })),
          currentLat: fallbackNumber(trace.currentLat),
          currentLng: fallbackNumber(trace.currentLng),
          speedKph: fallbackNumber(trace.speedKph),
        }),
      ),
    },
  };
};

export const normalizeRoadDetailsResponse = (
  response: RoadsRoadDetailsResponse,
): RoadsRoadDetailsResponse => {
  const data = response?.data ?? ({} as Partial<RoadDetailsData>);
  return {
    data: {
      roadId: fallbackString(data.roadId),
      roadName: fallbackString(data.roadName, 'Unnamed Road'),
      classification: fallbackString(data.classification, 'unknown'),
      city: fallbackString(data.city, 'Unknown City'),
      zone: fallbackString(data.zone, 'Unknown Zone'),
      postedSpeedLimitKph: fallbackNumber(data.postedSpeedLimitKph),
      currentAverageSpeedKph: fallbackNumber(data.currentAverageSpeedKph),
      congestionLevel: normalizeCongestion(data.congestionLevel),
      reliabilityScore: fallbackNumber(data.reliabilityScore),
      incidentCount24h: fallbackNumber(data.incidentCount24h),
      incidentCount7d: fallbackNumber(data.incidentCount7d),
      incidentCount30d: fallbackNumber(data.incidentCount30d),
      recommendation: fallbackString(data.recommendation),
      relatedRoutes: (data.relatedRoutes ?? []).map((route) => ({
        id: fallbackString(route.id, crypto.randomUUID?.() ?? `${Math.random()}`),
        name: fallbackString(route.name, 'Related Route'),
        reliabilityScore: fallbackNumber(route.reliabilityScore),
        etaMinutes: fallbackNumber(route.etaMinutes),
      })),
    },
  };
};

export const normalizeRouteCompareResponse = (
  response: RoadsRouteCompareResponse,
): RoadsRouteCompareResponse => {
  return {
    data: {
      query: {
        origin: fallbackString(response?.data?.query?.origin),
        destination: fallbackString(response?.data?.query?.destination),
        departureTime: fallbackString(response?.data?.query?.departureTime),
        serviceType: fallbackString(response?.data?.query?.serviceType),
        trafficMode: response?.data?.query?.trafficMode,
        compareAlternates: Boolean(response?.data?.query?.compareAlternates),
      },
      routes: (response?.data?.routes ?? []).map(
        (route): RouteOption => ({
          id: fallbackString(route.id, crypto.randomUUID?.() ?? `${Math.random()}`),
          name: fallbackString(route.name, 'Route'),
          etaMinutes: fallbackNumber(route.etaMinutes),
          distanceKm: fallbackNumber(route.distanceKm),
          reliabilityScore: fallbackNumber(route.reliabilityScore),
          delayMinutes: fallbackNumber(route.delayMinutes),
          isPrimary: Boolean(route.isPrimary),
        }),
      ),
      historicalAverageEtaMinutes: fallbackNumber(response?.data?.historicalAverageEtaMinutes),
      recommendedRouteId: fallbackString(response?.data?.recommendedRouteId),
    },
  };
};

export const normalizeSafetyResponse = (
  response: RoadsSafetyResponse,
): RoadsSafetyResponse => {
  return {
    data: {
      highRiskIntersections: (response?.data?.highRiskIntersections ?? []).map((item) => ({
        id: fallbackString(item.id, crypto.randomUUID?.() ?? `${Math.random()}`),
        name: fallbackString(item.name, 'Intersection'),
        score: fallbackNumber(item.score),
      })),
      overspeedSegments: (response?.data?.overspeedSegments ?? []).map((item) => ({
        id: fallbackString(item.id, crypto.randomUUID?.() ?? `${Math.random()}`),
        roadName: fallbackString(item.roadName, 'Road'),
        gapKph: fallbackNumber(item.gapKph),
      })),
      incidentClusters: (response?.data?.incidentClusters ?? []).map((item) => ({
        id: fallbackString(item.id, crypto.randomUUID?.() ?? `${Math.random()}`),
        name: fallbackString(item.name, 'Cluster'),
        incidents: fallbackNumber(item.incidents),
      })),
      recommendations: (response?.data?.recommendations ?? []).map((item) =>
        fallbackString(item),
      ),
    },
  };
};

export const normalizeAnalyticsResponse = (
  response: RoadsAnalyticsResponse,
): RoadsAnalyticsResponse => {
  return {
    panel: {
      travelTimeTrend: (response?.panel?.travelTimeTrend ?? []).map(normalizeChartPoint),
      delayDistribution: (response?.panel?.delayDistribution ?? []).map(normalizeChartPoint),
      corridorRanking: (response?.panel?.corridorRanking ?? []).map((item) => ({
        id: fallbackString(item.id, crypto.randomUUID?.() ?? `${Math.random()}`),
        name: fallbackString(item.name, 'Corridor'),
        score: fallbackNumber(item.score),
      })),
      reliabilityByHour: (response?.panel?.reliabilityByHour ?? []).map((item) => ({
        day: fallbackString(item.day, 'Unknown'),
        hour: fallbackString(item.hour, '00:00'),
        value: fallbackNumber(item.value),
      })),
      serviceImpactSummary: (response?.panel?.serviceImpactSummary ?? []).map((item) => ({
        serviceType: fallbackString(item.serviceType, 'unknown'),
        impactedRoutes: fallbackNumber(item.impactedRoutes),
        delayMinutes: fallbackNumber(item.delayMinutes),
      })),
    },
    trends: {
      travelTimeTrend: (response?.trends?.travelTimeTrend ?? []).map(normalizeChartPoint),
      congestionByHour: (response?.trends?.congestionByHour ?? []).map(normalizeChartPoint),
      reliabilityByCorridor: (response?.trends?.reliabilityByCorridor ?? []).map((item) => ({
        corridorId: fallbackString(item.corridorId, crypto.randomUUID?.() ?? `${Math.random()}`),
        corridorName: fallbackString(item.corridorName, 'Corridor'),
        reliabilityScore: fallbackNumber(item.reliabilityScore),
      })),
    },
    tables: {
      topDelayedRoads: (response?.tables?.topDelayedRoads ?? []).map(
        (item): TopDelayedRoadRow => ({
          id: fallbackString(item.id, crypto.randomUUID?.() ?? `${Math.random()}`),
          roadName: fallbackString(item.roadName, 'Road'),
          zone: fallbackString(item.zone, 'Unknown'),
          averageSpeedKph: fallbackNumber(item.averageSpeedKph),
          delayMinutes: fallbackNumber(item.delayMinutes),
          speedLimitKph: fallbackNumber(item.speedLimitKph),
          incidentCount: fallbackNumber(item.incidentCount),
          reliabilityScore: fallbackNumber(item.reliabilityScore),
          status: normalizeHealthStatus(item.status),
        }),
      ),
      routePerformance: (response?.tables?.routePerformance ?? []).map((item) => ({
        id: fallbackString(item.id, crypto.randomUUID?.() ?? `${Math.random()}`),
        routeName: fallbackString(item.routeName, 'Route'),
        origin: fallbackString(item.origin, 'Unknown'),
        destination: fallbackString(item.destination, 'Unknown'),
        etaMinutes: fallbackNumber(item.etaMinutes),
        actualAverageMinutes: fallbackNumber(item.actualAverageMinutes),
        varianceMinutes: fallbackNumber(item.varianceMinutes),
        reliabilityScore: fallbackNumber(item.reliabilityScore),
        routeStatus: item.routeStatus ?? 'neutral',
      })),
    },
  };
};
