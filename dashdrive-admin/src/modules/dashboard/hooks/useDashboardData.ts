import { useQuery } from '@tanstack/react-query';

// Mock types
export interface DashboardMetrics {
  activeDrivers: { value: number; trend: number };
  ongoingRides: { value: number; trend: number };
  revenueToday: { value: number; trend: number };
  criticalAlerts: { value: number; trend: number };
}

export interface RideVolumeData {
  time: string;
  today: number;
  yesterday: number;
}

export interface Alert {
  id: string;
  type: 'SOS' | 'Accident' | 'Delay' | 'System';
  message: string;
  time: string;
  status: 'Open' | 'Resolved';
}

// Mock API calls
const fetchMetrics = async (): Promise<DashboardMetrics> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({
      activeDrivers: { value: 1248, trend: 12 },
      ongoingRides: { value: 432, trend: 5 },
      revenueToday: { value: 84500, trend: -2 },
      criticalAlerts: { value: 3, trend: 0 },
    }), 800);
  });
};

const fetchRideVolume = async (): Promise<RideVolumeData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([
      { time: '00:00', today: 120, yesterday: 90 },
      { time: '04:00', today: 80, yesterday: 75 },
      { time: '08:00', today: 450, yesterday: 420 },
      { time: '12:00', today: 380, yesterday: 390 },
      { time: '16:00', today: 520, yesterday: 480 },
      { time: '20:00', today: 310, yesterday: 330 },
      { time: '23:59', today: 150, yesterday: 140 },
    ]), 1000);
  });
};

const fetchRecentAlerts = async (): Promise<Alert[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([
      { id: 'ALT-101', type: 'SOS', message: 'Driver reported passenger issue', time: '10 mins ago', status: 'Open' },
      { id: 'ALT-102', type: 'Accident', message: 'Collision reported in Zone A', time: '25 mins ago', status: 'Open' },
      { id: 'ALT-103', type: 'System', message: 'Payment gateway latency high', time: '1 hour ago', status: 'Resolved' },
      { id: 'ALT-104', type: 'Delay', message: 'Ride #8829 delayed by 45 mins', time: '2 hours ago', status: 'Open' },
    ]), 900);
  });
};

// Hooks
export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: fetchMetrics,
  });
}

export function useRideVolume() {
  return useQuery({
    queryKey: ['dashboard', 'rideVolume'],
    queryFn: fetchRideVolume,
  });
}

export function useRecentAlerts() {
  return useQuery({
    queryKey: ['dashboard', 'recentAlerts'],
    queryFn: fetchRecentAlerts,
  });
}
