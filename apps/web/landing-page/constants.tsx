
import { VehicleCategory, CityCoverage, Merchant } from './types';

export const VEHICLE_CATEGORIES: VehicleCategory[] = [
  { id: 'v1', name: 'Ride', icon: '🚗', description: 'Everyday rides' },
  { id: 'v2', name: 'Comfort', icon: '✨', description: 'Newer cars, top drivers' },
  { id: 'v3', name: 'Intercity', icon: '🛣️', description: 'Travel between cities' },
  { id: 'v4', name: 'Courier', icon: '📦', description: 'Small package delivery' },
  { id: 'v5', name: 'Moto', icon: '🏍️', description: 'Beat the traffic' },
  { id: 'v6', name: 'Freight', icon: '🚚', description: 'Moving heavy loads' },
];

export const CITIES: CityCoverage[] = [
  { id: 'c1', name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=400', driversOnline: 1240 },
  { id: 'c2', name: 'London', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=400', driversOnline: 850 },
  { id: 'c3', name: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=400', driversOnline: 2100 },
  { id: 'c4', name: 'Singapore', image: 'https://images.unsplash.com/photo-1525625239514-75bba0d7b031?auto=format&fit=crop&q=80&w=400', driversOnline: 940 },
];

// Added MERCHANTS to resolve the import error in MerchantGrid.tsx
export const MERCHANTS: Merchant[] = [
  {
    id: 'm1',
    name: 'AutoCare Pro',
    logo: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=400',
    category: 'Maintenance',
    offer: '15% Off Service'
  },
  {
    id: 'm2',
    name: 'ChargeNet',
    logo: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=400',
    category: 'EV Charging',
    offer: 'Free First Charge'
  },
  {
    id: 'm3',
    name: 'DashDrive Insurance',
    logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400',
    category: 'Protection',
    offer: 'Daily Trip Cover'
  }
];
