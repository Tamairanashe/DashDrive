import React from 'react';
import { 
    CarOutlined, 
    ThunderboltOutlined, 
    GlobalOutlined, 
    EnvironmentOutlined, 
    TeamOutlined 
} from '@ant-design/icons';
import { ServiceDefinition, Zone, WeatherCluster, TrafficCluster, EventCluster, ServiceAsset, DemandPoint } from '../types';

export const LOCATION_COORDS: Record<string, { lat: number, lng: number }> = {
  'Harare': { lat: -17.8248, lng: 31.0530 },
  'Bulawayo': { lat: -20.1465, lng: 28.5833 },
  'Johannesburg': { lat: -26.2041, lng: 28.0473 },
  'Cape Town': { lat: -33.9249, lng: 18.4241 },
  'Lagos': { lat: 6.5244, lng: 3.3792 },
  'Abuja': { lat: 9.0765, lng: 7.3986 }
};

export const LOCATION_DATA: any = {
  'Zimbabwe': { regions: { 'Mashonaland': ['Harare'], 'Matabeleland': ['Bulawayo'] } },
  'Nigeria': { regions: { 'Lagos State': ['Lagos'], 'FCT': ['Abuja'] } },
  'South Africa': { regions: { 'Gauteng': ['Johannesburg'], 'Western Cape': ['Cape Town'] } }
};

export const SERVICE_TYPES: ServiceDefinition[] = [
    { id: 'ride', name: 'Ride Hailing', icon: React.createElement(CarOutlined), kpiName: 'Active Bids', color: '#3b82f6' },
    { id: 'food', name: 'Food Delivery', icon: React.createElement(ThunderboltOutlined), kpiName: 'Active Orders', color: '#f97316' },
    { id: 'mart', name: 'Mart Delivery', icon: React.createElement(GlobalOutlined), kpiName: 'Active Carts', color: '#10b981' },
    { id: 'parcel', name: 'Parcel Delivery', icon: React.createElement(EnvironmentOutlined), kpiName: 'Active Deliveries', color: '#8b5cf6' },
    { id: 'shopping', name: 'Shopping', icon: React.createElement(TeamOutlined), kpiName: 'Active Trips', color: '#ec4899' },
];

export const MOCK_ZONES: Zone[] = [
    { id: 'z1', name: 'CBD Terminal', lat: -17.8248, lng: 31.0530, demand: 'high', drivers: 8, orders: 120, waitTime: '12 min', surge: 1.8, prevOrders: 105, prevDemand: 'medium' },
    { id: 'z2', name: 'Westgate Mall', lat: -17.7800, lng: 31.0000, demand: 'medium', drivers: 25, orders: 40, waitTime: '4 min', surge: 1.1, prevOrders: 45, prevDemand: 'medium' },
    { id: 'z3', name: 'Airport Plaza', lat: -17.9333, lng: 31.0833, demand: 'critical', drivers: 2, orders: 65, waitTime: '22 min', surge: 2.5, prevOrders: 40, prevDemand: 'high' },
    { id: 'z4', name: 'Avondale Village', lat: -17.8000, lng: 31.0333, demand: 'low', drivers: 35, orders: 15, waitTime: '2 min', surge: 1.0, prevOrders: 18, prevDemand: 'low' },
];

export const MOCK_RAIN_CLUSTERS: WeatherCluster[] = [
    { 
        id: 'r1', 
        points: [{lat: -17.8100, lng: 31.0400}, {lat: -17.8200, lng: 31.0600}, {lat: -17.8400, lng: 31.0500}], 
        intensity: 'Heavy Storm', 
        impact: '+35% Demand' 
    }
];

export const MOCK_TRAFFIC_CLUSTERS: TrafficCluster[] = [
    { id: 't1', path: [{lat: -17.8200, lng: 31.0200}, {lat: -17.8200, lng: 31.0800}], level: 'Gridlock', delay: '+15 min' },
    { id: 't2', path: [{lat: -17.7800, lng: 31.0500}, {lat: -17.8500, lng: 31.0500}], level: 'Flowing Heavy', delay: '+8 min' }
];

export const MOCK_EVENT_CLUSTERS: EventCluster[] = [
    { id: 'ev1', name: 'Zim Afro Jazz Festival', lat: -17.868, lng: 31.020, type: 'Concert', impact: '+45%', attendees: '15.5k' },
    { id: 'ev2', name: 'National Independence Gala', lat: -17.825, lng: 31.053, type: 'Holiday/Gala', impact: '+30%', attendees: '25k' }
];

export const MOCK_SERVICE_ASSETS: ServiceAsset[] = [
    { id: 'DS-101', service: 'ride', lat: -17.828, lng: 31.050, name: 'Tinashe M.', tier: 'DashX' },
    { id: 'DS-102', service: 'ride', lat: -17.820, lng: 31.058, name: 'Blessing K.', tier: 'Economy' },
    { id: 'FD-201', service: 'food', lat: -17.795, lng: 31.005, name: 'Farai G.', status: 'On Delivery' },
    { id: 'FD-202', service: 'food', lat: -17.805, lng: 31.030, name: 'Simbai R.', status: 'Idle' },
    { id: 'PL-301', service: 'parcel', lat: -17.935, lng: 31.090, name: 'Zim Hub 1', type: 'Truck' },
];

export const MOCK_DEMAND_POINTS: DemandPoint[] = [
    { id: 'UP-001', lat: -17.825, lng: 31.052, name: 'Tapfuma J.', rating: 4.8, trips: 142, loyalty: 'Platinum', behavior: 'Frequent Rider', since: '2023-01-12', activeRequests: ['ride', 'food'], topVertical: 'Ride Hailing' },
    { id: 'UP-002', lat: -17.824, lng: 31.054, name: 'Nyasha C.', rating: 4.9, trips: 89, loyalty: 'Gold', behavior: 'Business User', since: '2023-05-20', activeRequests: ['ride'], topVertical: 'Ride Hailing' },
];

export const getMockZonesForService = (serviceId: string): Zone[] => {
    return MOCK_ZONES.map(zone => {
        let demand = zone.demand;
        let drivers = zone.drivers;
        let orders = zone.orders;
        
        if (serviceId === 'food') {
            if (zone.id === 'z2' || zone.id === 'z4') demand = 'critical';
            orders = orders * 1.5;
        } else if (serviceId === 'parcel') {
            if (zone.id === 'z1' || zone.id === 'z3') demand = 'high';
            drivers = drivers * 0.5;
        }
        
        return { ...zone, demand, drivers, orders: Math.round(orders) };
    });
};
