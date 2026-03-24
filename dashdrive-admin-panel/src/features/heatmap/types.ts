import { ReactNode } from 'react';

export type ServiceType = 'ride' | 'food' | 'mart' | 'parcel' | 'shopping';

export interface ServiceDefinition {
    id: ServiceType;
    name: string;
    icon: ReactNode;
    kpiName: string;
    color: string;
}

export interface Zone {
    id: string;
    name: string;
    lat: number;
    lng: number;
    demand: 'low' | 'medium' | 'high' | 'critical';
    drivers: number;
    orders: number;
    waitTime: string;
    surge: number;
    prevOrders?: number;
    prevDemand?: string;
    imbalanceScore?: number; // -100 (oversupply) to 100 (shortage)
    cancellationRate?: number;
    fulfillmentRisk?: 'low' | 'medium' | 'high';
    avgEta?: string;
}

export interface MarketSummary {
    activeRequests: number;
    availableDrivers: number;
    demandSupplyRatio: number;
    activeSurgeZones: number;
    avgPickupEta: string;
    completionRate: number;
}

export interface WeatherCluster {
    id: string;
    points: { lat: number, lng: number }[];
    intensity: string;
    impact: string;
    condition?: string;
    temp?: string;
    icon?: string;
}

export interface WeatherCondition {
    text: string;
    icon: string;
    type: string;
}

export interface WeatherValue {
    degrees?: number;
    value?: number;
    unit: string;
}

export interface CurrentWeather {
    currentTime: string;
    isDaytime: boolean;
    condition: WeatherCondition;
    temperature: WeatherValue;
    feelsLike: WeatherValue;
    humidity: number;
    uvIndex: number;
    precipitation: {
        probability: { percent: number, type: string };
        qpf: { quantity: number, unit: string };
    };
    wind: {
        direction: { degrees: number, cardinal: string };
        speed: WeatherValue;
        gust: WeatherValue;
    };
    visibility: { distance: number, unit: string };
    cloudCover: number;
    pressure: number;
}

export interface WeatherForecastDay {
    date: { year: number, month: number, day: number };
    maxTemp: WeatherValue;
    minTemp: WeatherValue;
    dayCondition: WeatherCondition;
    nightCondition: WeatherCondition;
    rainProb: number;
}

export interface WeatherAlert {
    id: string;
    event: string;
    severity: string;
    summary: string;
    instruction: string;
    startTime: string;
    endTime: string;
}


export interface TrafficCluster {
    id: string;
    path: { lat: number, lng: number }[];
    level: string;
    delay: string;
}

export interface EventCluster {
    id: string;
    name: string;
    lat: number;
    lng: number;
    type: string;
    impact: string;
    attendees: string;
    isGlobal?: boolean;
}

export interface ServiceAsset {
    id: string;
    service: ServiceType;
    lat: number;
    lng: number;
    name: string;
    tier?: string;
    status?: string;
    type?: string;
}

export interface DemandPoint {
    id: string;
    lat: number;
    lng: number;
    name: string;
    rating: number;
    trips: number;
    loyalty: string;
    behavior: string;
    since: string;
    activeRequests: string[];
    topVertical: string;
}

export interface MarketplaceAction {
    time: string;
    msg: string;
    type: 'INCENTIVE' | 'MANUAL';
}

export interface PeakHourConfig {
    id: number;
    day: string;
    zone: string;
    startTime: string;
    endTime: string;
    multiplier: string;
}
