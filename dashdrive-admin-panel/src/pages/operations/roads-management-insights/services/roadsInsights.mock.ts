// src/pages/operations/roads-management-insights/services/roadsInsights.mock.ts

import {
  RoadsSummaryResponse,
  RoadsMapResponse,
  RoadsRoadDetailsResponse,
  RoadsRouteCompareResponse,
  RoadsSafetyResponse,
  RoadsAnalyticsResponse,
  RoadsSavedViewsResponse,
} from '../types/roadsInsights.types';

export const roadsSummaryMock: RoadsSummaryResponse = {
  kpis: {
    activeCongestedSegments: 24,
    averageCorridorSpeedKph: 31,
    routesBelowSla: 8,
    highRiskIntersections: 6,
    openIncidents: 11,
    networkReliabilityIndex: 78,
  },
  overview: {
    networkHealthScore: 74,
    mostCongestedCorridors: [
      { id: 'c1', name: 'Samora Machel Corridor', value: 'Critical', status: 'error' },
      { id: 'c2', name: 'Borrowdale Road', value: 'High', status: 'warning' },
      { id: 'c3', name: 'Seke Road', value: 'High', status: 'warning' },
    ],
    worstRoutes: [
      { id: 'r1', name: 'CBD → Avondale', value: '18 min delay', status: 'error' },
      { id: 'r2', name: 'CBD → Airport', value: '12 min delay', status: 'warning' },
    ],
    openIncidentsSummary: {
      total: 11,
      critical: 2,
      high: 3,
      medium: 4,
      low: 2,
    },
    coverageWarnings: [
      'Speed-limit data unavailable on some peripheral roads.',
      'Live traffic visibility is partially delayed for one corridor.',
    ],
    recommendations: [
      {
        id: 'rec1',
        title: 'Prioritize alternate routing for airport corridor',
        description: 'ETA instability has exceeded threshold for 3 consecutive windows.',
        actionType: 'prioritize',
      },
      {
        id: 'rec2',
        title: 'Monitor incident cluster near CBD',
        description: 'Repeated medium-to-high severity disruptions detected in the last 24 hours.',
        actionType: 'monitor',
      },
    ],
  },
};

export const roadsMapMock: RoadsMapResponse = {
  mapData: {
    center: { lat: -17.8292, lng: 31.0522 },
    zoom: 12,
    roads: [
      {
        id: 'road-1',
        name: 'Samora Machel Avenue',
        classification: 'arterial',
        path: [
          { lat: -17.825, lng: 31.03 },
          { lat: -17.826, lng: 31.04 },
          { lat: -17.827, lng: 31.05 },
        ],
        congestionLevel: 'critical',
        reliabilityScore: 52,
        averageSpeedKph: 18,
        postedSpeedLimitKph: 60,
      },
      {
        id: 'road-2',
        name: 'Borrowdale Road',
        classification: 'primary',
        path: [
          { lat: -17.81, lng: 31.08 },
          { lat: -17.80, lng: 31.09 },
          { lat: -17.79, lng: 31.10 },
        ],
        congestionLevel: 'high',
        reliabilityScore: 64,
        averageSpeedKph: 24,
        postedSpeedLimitKph: 60,
      },
    ],
    corridors: [
      {
        id: 'corridor-1',
        name: 'CBD–Airport Corridor',
        path: [
          { lat: -17.83, lng: 31.04 },
          { lat: -17.86, lng: 31.10 },
        ],
        congestionLevel: 'high',
        reliabilityScore: 61,
        averageDelayMinutes: 14,
      },
    ],
    incidents: [
      {
        id: 'incident-1',
        title: 'Multi-vehicle obstruction',
        type: 'collision',
        severity: 'high',
        lat: -17.826,
        lng: 31.048,
        roadSegmentId: 'road-1',
        status: 'active',
        startedAt: '2026-03-21T08:15:00Z',
        estimatedClearAt: '2026-03-21T10:00:00Z',
      },
    ],
    routes: [
      {
        id: 'route-1',
        name: 'CBD to Airport Primary',
        path: [
          { lat: -17.83, lng: 31.04 },
          { lat: -17.85, lng: 31.08 },
          { lat: -17.89, lng: 31.12 },
        ],
        etaMinutes: 34,
        distanceKm: 17.2,
        reliabilityScore: 62,
        isPrimary: true,
        delayMinutes: 11,
      },
      {
        id: 'route-2',
        name: 'CBD to Airport Alternate',
        path: [
          { lat: -17.83, lng: 31.04 },
          { lat: -17.84, lng: 31.06 },
          { lat: -17.88, lng: 31.11 },
        ],
        etaMinutes: 29,
        distanceKm: 18.1,
        reliabilityScore: 74,
        isPrimary: false,
        delayMinutes: 6,
      },
    ],
    riskZones: [
      {
        id: 'risk-1',
        name: 'CBD Incident Cluster',
        polygon: [
          { lat: -17.828, lng: 31.045 },
          { lat: -17.824, lng: 31.050 },
          { lat: -17.829, lng: 31.056 },
          { lat: -17.833, lng: 31.049 },
        ],
        riskScore: 82,
        severity: 'high',
      },
    ],
    vehicleTraces: [
      {
        id: 'trace-1',
        vehicleId: 'DRV-204',
        path: [
          { lat: -17.83, lng: 31.03 },
          { lat: -17.829, lng: 31.04 },
          { lat: -17.827, lng: 31.05 },
        ],
        currentLat: -17.827,
        currentLng: 31.05,
        speedKph: 22,
      },
    ],
  },
};

export const roadDetailsMock: RoadsRoadDetailsResponse = {
  data: {
    roadId: 'road-1',
    roadName: 'Samora Machel Avenue',
    classification: 'arterial',
    city: 'Harare',
    zone: 'CBD',
    postedSpeedLimitKph: 60,
    currentAverageSpeedKph: 18,
    congestionLevel: 'critical',
    reliabilityScore: 52,
    incidentCount24h: 4,
    incidentCount7d: 19,
    incidentCount30d: 67,
    recommendation: 'Temporarily deprioritize this corridor for standard dispatch during peak periods.',
    relatedRoutes: [
      { id: 'route-1', name: 'CBD to Airport Primary', reliabilityScore: 62, etaMinutes: 34 },
      { id: 'route-3', name: 'CBD Inner Loop', reliabilityScore: 58, etaMinutes: 19 },
    ],
  },
};

export const routeCompareMock: RoadsRouteCompareResponse = {
  data: {
    query: {
      origin: 'CBD',
      destination: 'Airport',
      departureTime: '2026-03-21T09:00:00Z',
      serviceType: 'ride_hailing',
      trafficMode: 'traffic_aware_optimal',
      compareAlternates: true,
    },
    routes: [
      {
        id: 'route-1',
        name: 'Primary Route',
        etaMinutes: 34,
        distanceKm: 17.2,
        reliabilityScore: 62,
        delayMinutes: 11,
        isPrimary: true,
      },
      {
        id: 'route-2',
        name: 'Alternate Route A',
        etaMinutes: 29,
        distanceKm: 18.1,
        reliabilityScore: 74,
        delayMinutes: 6,
      },
    ],
    historicalAverageEtaMinutes: 25,
    recommendedRouteId: 'route-2',
  },
};

export const roadsSafetyMock: RoadsSafetyResponse = {
  data: {
    highRiskIntersections: [
      { id: 'i1', name: 'Samora Machel × Julius Nyerere', score: 88 },
      { id: 'i2', name: 'Borrowdale × Harare Drive', score: 79 },
    ],
    overspeedSegments: [
      { id: 'os1', roadName: 'Airport Road Southbound', gapKph: 21 },
      { id: 'os2', roadName: 'Borrowdale Road Northbound', gapKph: 14 },
    ],
    incidentClusters: [
      { id: 'cl1', name: 'CBD Core Cluster', incidents: 14 },
      { id: 'cl2', name: 'Airport Link Cluster', incidents: 9 },
    ],
    recommendations: [
      'Increase live monitoring on CBD core intersections during peak hours.',
      'Flag overspeed-prone segments for route compliance review.',
    ],
  },
};

export const roadsAnalyticsMock: RoadsAnalyticsResponse = {
  panel: {
    travelTimeTrend: [
      { label: '06:00', value: 18 },
      { label: '07:00', value: 22 },
      { label: '08:00', value: 31 },
      { label: '09:00', value: 29 },
    ],
    delayDistribution: [
      { label: '0-5m', value: 12 },
      { label: '6-10m', value: 18 },
      { label: '11-15m', value: 9 },
      { label: '16m+', value: 5 },
    ],
    corridorRanking: [
      { id: 'c1', name: 'CBD–Airport Corridor', score: 61 },
      { id: 'c2', name: 'Borrowdale Corridor', score: 68 },
      { id: 'c3', name: 'Avondale Corridor', score: 76 },
    ],
    reliabilityByHour: [
      { day: 'Mon', hour: '08:00', value: 62 },
      { day: 'Mon', hour: '09:00', value: 58 },
      { day: 'Tue', hour: '08:00', value: 66 },
      { day: 'Tue', hour: '09:00', value: 60 },
    ],
    serviceImpactSummary: [
      { serviceType: 'ride_hailing', impactedRoutes: 8, delayMinutes: 11 },
      { serviceType: 'parcel_delivery', impactedRoutes: 5, delayMinutes: 14 },
      { serviceType: 'food_delivery', impactedRoutes: 6, delayMinutes: 8 },
    ],
  },
  trends: {
    travelTimeTrend: [
      { label: 'Mon', value: 24 },
      { label: 'Tue', value: 27 },
      { label: 'Wed', value: 23 },
      { label: 'Thu', value: 29 },
      { label: 'Fri', value: 31 },
    ],
    congestionByHour: [
      { label: '06:00', value: 22 },
      { label: '07:00', value: 45 },
      { label: '08:00', value: 78 },
      { label: '09:00', value: 70 },
    ],
    reliabilityByCorridor: [
      { corridorId: 'c1', corridorName: 'CBD–Airport', reliabilityScore: 61 },
      { corridorId: 'c2', corridorName: 'Borrowdale', reliabilityScore: 68 },
      { corridorId: 'c3', corridorName: 'Avondale', reliabilityScore: 76 },
    ],
  },
  tables: {
    topDelayedRoads: [
      {
        id: 'td1',
        roadName: 'Samora Machel Avenue',
        zone: 'CBD',
        averageSpeedKph: 18,
        delayMinutes: 16,
        speedLimitKph: 60,
        incidentCount: 4,
        reliabilityScore: 52,
        status: 'error',
      },
      {
        id: 'td2',
        roadName: 'Borrowdale Road',
        zone: 'North',
        averageSpeedKph: 24,
        delayMinutes: 11,
        speedLimitKph: 60,
        incidentCount: 2,
        reliabilityScore: 64,
        status: 'warning',
      },
    ],
    routePerformance: [
      {
        id: 'rp1',
        routeName: 'CBD → Airport',
        origin: 'CBD',
        destination: 'Airport',
        etaMinutes: 34,
        actualAverageMinutes: 31,
        varianceMinutes: 9,
        reliabilityScore: 62,
        routeStatus: 'neutral',
      },
      {
        id: 'rp2',
        routeName: 'CBD → Avondale',
        origin: 'CBD',
        destination: 'Avondale',
        etaMinutes: 21,
        actualAverageMinutes: 19,
        varianceMinutes: 4,
        reliabilityScore: 81,
        routeStatus: 'preferred',
      },
    ],
  },
};

export const roadsSavedViewsMock: RoadsSavedViewsResponse = {
  items: [
    {
      id: 'sv1',
      name: 'Live Congestion Monitor',
      description: 'Shows traffic, incidents, corridors, and live road pressure.',
      filters: {
        mode: 'live',
        cityId: 'harare',
      },
      layers: {
        traffic: true,
        congestion: true,
        incidents: true,
        speedLimits: false,
        routeReliability: true,
        riskZones: false,
        corridors: true,
        vehicleTraces: false,
      },
    },
    {
      id: 'sv2',
      name: 'Safety Risk View',
      description: 'Focuses on incidents, risk zones, and overspeed patterns.',
      filters: {
        mode: 'historical',
        cityId: 'harare',
      },
      layers: {
        traffic: false,
        congestion: false,
        incidents: true,
        speedLimits: true,
        routeReliability: false,
        riskZones: true,
        corridors: true,
        vehicleTraces: false,
      },
    },
  ],
};
