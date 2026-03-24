// src/modules/roads-insights-export/types/pdf-sections.type.ts

export type PdfKpi = {
  label: string;
  value: string;
};

export type PdfTable = {
  title: string;
  headers: string[];
  rows: any[][];
  columnWidths: number[];
};

export type PdfBulletSummary = {
  title: string;
  bullets: string[];
};

export type TopDelayedRoadRow = {
  roadName: string;
  zone: string;
  averageSpeedKph: number;
  delayMinutes: number;
  speedLimitKph?: number;
  incidentCount: number;
  reliabilityScore: number;
  status: string;
};

export type RoutePerformanceRow = {
  routeName: string;
  origin: string;
  destination: string;
  etaMinutes: number;
  actualAverageMinutes: number;
  varianceMinutes: number;
  reliabilityScore: number;
  routeStatus: string;
};
