import { useQuery } from '@tanstack/react-query';

export type ZoneType = 'operational' | 'surge' | 'restricted' | 'priority' | 'merchant' | 'fleet' | 'corridor';
export type ZoneStatus = 'draft' | 'published' | 'scheduled' | 'archived';
export type ServiceType = 'Ride' | 'Food' | 'Parcel' | 'City-to-City';

export interface ZoneCoordinate {
  lat: number;
  lng: number;
}

export interface Zone {
  id: string;
  name: string;
  description?: string;
  cityId: string;
  cityName: string;
  serviceType: ServiceType;
  zoneType: ZoneType;
  status: ZoneStatus;
  geometry: ZoneCoordinate[];
  priority: number;
  schedule?: string;
  restrictionType?: string;
  farePolicyId?: string;
  surgePolicyId?: string;
  dispatchPolicyId?: string;
  fleetOperatorId?: string;
  createdBy: string;
  updatedBy: string;
  publishedAt?: string;
  version: number;
  // New Operational Metrics
  metrics?: {
    totalTrips: number;
    activeDrivers: number;
    activeCouriers: number;
    demandLevel: 'low' | 'medium' | 'high';
    supplyLevel: 'low' | 'medium' | 'high';
    hasSurge: boolean;
    hasExtraFare: boolean;
    lastUpdated: string;
  };
}

const MOCK_ZONES: Zone[] = [
  {
    id: 'zone-1',
    name: 'San Francisco CBD',
    description: 'Core downtown operational area',
    cityId: 'sf',
    cityName: 'San Francisco',
    serviceType: 'Ride',
    zoneType: 'operational',
    status: 'published',
    geometry: [
      { lat: 37.795, lng: -122.415 },
      { lat: 37.795, lng: -122.395 },
      { lat: 37.780, lng: -122.395 },
      { lat: 37.780, lng: -122.415 },
    ],
    priority: 1,
    farePolicyId: 'fp-standard',
    dispatchPolicyId: 'dp-standard',
    createdBy: 'admin@dashdrive.com',
    updatedBy: 'admin@dashdrive.com',
    publishedAt: '2026-03-01T10:00:00Z',
    version: 1,
    metrics: {
      totalTrips: 1240,
      activeDrivers: 45,
      activeCouriers: 0,
      demandLevel: 'high',
      supplyLevel: 'medium',
      hasSurge: false,
      hasExtraFare: true,
      lastUpdated: '2026-03-27T08:30:00Z'
    }
  },
  {
    id: 'zone-2',
    name: 'SFO Airport Restricted',
    description: 'No pickup allowed without permit',
    cityId: 'sf',
    cityName: 'San Francisco',
    serviceType: 'Ride',
    zoneType: 'restricted',
    status: 'published',
    restrictionType: 'no_pickup',
    geometry: [
      { lat: 37.625, lng: -122.395 },
      { lat: 37.625, lng: -122.375 },
      { lat: 37.610, lng: -122.375 },
      { lat: 37.610, lng: -122.395 },
    ],
    priority: 10,
    createdBy: 'admin@dashdrive.com',
    updatedBy: 'admin@dashdrive.com',
    publishedAt: '2026-03-05T10:00:00Z',
    version: 2,
    metrics: {
      totalTrips: 450,
      activeDrivers: 12,
      activeCouriers: 0,
      demandLevel: 'low',
      supplyLevel: 'low',
      hasSurge: false,
      hasExtraFare: false,
      lastUpdated: '2026-03-27T09:15:00Z'
    }
  },
  {
    id: 'zone-3',
    name: 'Mission District Food Surge',
    description: 'High demand food delivery surge area',
    cityId: 'sf',
    cityName: 'San Francisco',
    serviceType: 'Food',
    zoneType: 'surge',
    status: 'scheduled',
    schedule: 'Friday-Sunday 18:00-22:00',
    geometry: [
      { lat: 37.765, lng: -122.425 },
      { lat: 37.765, lng: -122.405 },
      { lat: 37.750, lng: -122.405 },
      { lat: 37.750, lng: -122.425 },
    ],
    priority: 5,
    surgePolicyId: 'sp-weekend-dinner',
    createdBy: 'ops@dashdrive.com',
    updatedBy: 'ops@dashdrive.com',
    version: 1,
    metrics: {
      totalTrips: 890,
      activeDrivers: 0,
      activeCouriers: 32,
      demandLevel: 'high',
      supplyLevel: 'low',
      hasSurge: true,
      hasExtraFare: false,
      lastUpdated: '2026-03-27T09:45:00Z'
    }
  }
];

export function useZones(cityId?: string, serviceType?: string) {
  return useQuery({
    queryKey: ['zones', cityId, serviceType],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      let filtered = [...MOCK_ZONES];
      if (cityId && cityId !== 'all') {
        filtered = filtered.filter(z => z.cityId === cityId);
      }
      if (serviceType && serviceType !== 'all') {
        filtered = filtered.filter(z => z.serviceType === serviceType);
      }
      return filtered;
    }
  });
}
