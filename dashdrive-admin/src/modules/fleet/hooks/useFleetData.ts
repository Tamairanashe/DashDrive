import { useQuery } from '@tanstack/react-query';

export type ServiceType = 'Ride' | 'Food' | 'Parcel' | 'City-to-City';
export type DriverStatus = 'Idle' | 'Busy' | 'En Route' | 'Offline' | 'Issue';

export interface CurrentJob {
  id: string;
  type: ServiceType;
  pickupLocation: string;
  dropoffLocation: string;
  status: string;
}

export interface DriverLocation {
  id: string;
  name: string;
  status: DriverStatus;
  serviceType: ServiceType;
  lat: number;
  lng: number;
  vehicle: string;
  fleetOperator: string;
  rating: number;
  tripsToday: number;
  acceptanceRate: number;
  cancellationRate: number;
  earningsToday: number;
  lastUpdated: string;
  speed: number;
  heading: number;
  locationAccuracy: number;
  avatarUrl: string;
  currentJob?: CurrentJob;
  issues?: string[];
  zoneId?: string;
}

let mockDrivers: DriverLocation[] | null = null;

const generateMockDrivers = (): DriverLocation[] => {
  const baseLat = 37.7749;
  const baseLng = -122.4194;
  
  if (!mockDrivers) {
    mockDrivers = Array.from({ length: 150 }).map((_, i) => {
      const statusRand = Math.random();
      let status: DriverStatus = 'Offline';
      if (statusRand > 0.8) status = 'Busy';
      else if (statusRand > 0.5) status = 'En Route';
      else if (statusRand > 0.1) status = 'Idle';
      else status = 'Issue';

      const serviceRand = Math.random();
      let serviceType: ServiceType = 'Ride';
      if (serviceRand > 0.7) serviceType = 'Food';
      else if (serviceRand > 0.4) serviceType = 'Parcel';
      else if (serviceRand > 0.95) serviceType = 'City-to-City';

      let currentJob: CurrentJob | undefined;
      if (status === 'Busy' || status === 'En Route') {
        currentJob = {
          id: `JOB-${10000 + i}`,
          type: serviceType,
          pickupLocation: '123 Market St',
          dropoffLocation: '456 Mission St',
          status: status === 'En Route' ? 'Heading to Pickup' : 'In Progress',
        };
      }

      const issues: string[] = [];
      if (status === 'Issue') {
        if (Math.random() > 0.5) issues.push('Inactive > 10 min');
        else issues.push('Off-route behavior');
      }

      const zones = ['zone_1', 'zone_2', 'zone_3', 'zone_4', 'zone_5', 'downtown', 'airport'];
      const zoneId = zones[Math.floor(Math.random() * zones.length)];

      return {
        id: `DRV-${1000 + i}`,
        name: `Driver ${i + 1}`,
        status,
        serviceType,
        lat: baseLat + (Math.random() - 0.5) * 0.15,
        lng: baseLng + (Math.random() - 0.5) * 0.15,
        vehicle: i % 3 === 0 ? 'Toyota Prius' : i % 2 === 0 ? 'Honda Accord' : 'Delivery Scooter',
        fleetOperator: i % 4 === 0 ? 'Alpha Fleet' : 'Independent',
        rating: 4.0 + Math.random(),
        tripsToday: Math.floor(Math.random() * 20),
        acceptanceRate: 80 + Math.floor(Math.random() * 20),
        cancellationRate: Math.floor(Math.random() * 10),
        earningsToday: Math.floor(Math.random() * 200),
        lastUpdated: new Date(Date.now() - Math.random() * 60000).toISOString(),
        speed: status === 'Busy' || status === 'En Route' ? Math.floor(Math.random() * 45) + 10 : 0,
        heading: Math.floor(Math.random() * 360),
        locationAccuracy: Math.floor(Math.random() * 10) + 2,
        avatarUrl: `https://i.pravatar.cc/150?u=DRV-${1000 + i}`,
        currentJob,
        issues: issues.length > 0 ? issues : undefined,
        zoneId,
      };
    });
  } else {
    // Simulate movement
    mockDrivers = mockDrivers.map(driver => {
      if (driver.status !== 'Offline' && driver.status !== 'Idle') {
        driver.lat += (Math.random() - 0.5) * 0.002;
        driver.lng += (Math.random() - 0.5) * 0.002;
        driver.heading = (driver.heading + (Math.random() - 0.5) * 20) % 360;
        driver.speed = Math.floor(Math.random() * 45) + 10;
      } else {
        driver.speed = 0;
      }
      driver.lastUpdated = new Date().toISOString();
      return { ...driver };
    });
  }
  
  return mockDrivers;
};

export function useFleetData(isLive: boolean = true) {
  return useQuery({
    queryKey: ['fleet', 'drivers'],
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return generateMockDrivers();
    },
    refetchInterval: isLive ? 3000 : false, // Faster refetch for live feel
  });
}
