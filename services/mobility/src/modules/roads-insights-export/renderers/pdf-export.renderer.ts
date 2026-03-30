// src/modules/roads-insights-export/renderers/pdf-export.renderer.ts

import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { RoadsInsightsPdfLayoutService } from '../services/roads-insights-pdf-layout.service';
import { RoadsInsightsChartImageService } from '../services/roads-insights-chart-image.service';
import { RoadsInsightsPdfTableService } from '../services/roads-insights-pdf-table.service';
import { RoadsInsightsPdfBrandingService } from '../services/roads-insights-pdf-branding.service';
import { RoadsInsightsPdfSummaryService } from '../services/roads-insights-pdf-summary.service';
import type { RendererResult } from '../types/renderer-result.type';
import type {
  RoutePerformanceRow,
  TopDelayedRoadRow,
} from '../types/pdf-sections.type';

@Injectable()
export class PdfExportRenderer {
  constructor(
    private readonly layout: RoadsInsightsPdfLayoutService,
    private readonly charts: RoadsInsightsChartImageService,
    private readonly tables: RoadsInsightsPdfTableService,
    private readonly branding: RoadsInsightsPdfBrandingService,
    private readonly summaryBlocks: RoadsInsightsPdfSummaryService,
  ) {}

  async render(context: any): Promise<RendererResult> {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 40,
      bufferPages: true,
    });

    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));

    const finished = new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });

    const reportId = context.meta.reportId ?? `roads-${Date.now()}`;

    this.branding.renderHeader(doc, {
      title: context.meta.title,
      generatedAt: context.meta.generatedAt,
      reportId,
      logoText: 'DashDrive Roads Intelligence',
    });

    this.branding.renderMetaStrip(doc, [
      { label: 'FORMAT', value: String(context.meta.format).toUpperCase() },
      { label: 'REQUESTED BY', value: String(context.meta.requestedBy) },
      { label: 'CITY', value: String(context.filters?.cityId ?? 'ALL') },
      { label: 'MODE', value: String(context.filters?.mode ?? 'N/A').toUpperCase() },
    ]);

    this.summaryBlocks.renderScopeSummary(doc, {
      city: context.filters?.cityId,
      zone: context.filters?.zoneId,
      mode: context.filters?.mode,
      services: context.filters?.serviceType,
      roadTypes: context.filters?.roadType,
    });

    this.summaryBlocks.renderFilterChips(doc, context.filters);

    this.summaryBlocks.renderExecutiveSummary(doc, {
      title: 'Executive Summary',
      highlights: [
        'Airport corridor reliability remains below target during peak traffic windows.',
        'CBD congestion is driven by repeated incident clusters and speed degradation.',
        'Alternate routes are consistently outperforming the primary corridor on ETA stability.',
      ],
    });

    this.branding.renderStatusLegend(doc);

    if (context.summary) {
      this.layout.renderKpis(doc, [
        {
          label: 'Congested Segments',
          value: String(context.summary.activeCongestedSegments ?? 0),
          tone: (context.summary.activeCongestedSegments ?? 0) > 20 ? 'danger' : 'warning',
          sublabel: 'Active network pressure',
        },
        {
          label: 'Avg Corridor Speed',
          value: `${context.summary.averageCorridorSpeedKph ?? 0} km/h`,
          tone: (context.summary.averageCorridorSpeedKph ?? 0) >= 30 ? 'success' : 'warning',
          sublabel: 'Across monitored corridors',
        },
        {
          label: 'Routes Below SLA',
          value: String(context.summary.routesBelowSla ?? 0),
          tone: (context.summary.routesBelowSla ?? 0) > 5 ? 'danger' : 'warning',
          sublabel: 'Operational reliability gap',
        },
        {
          label: 'High Risk Intersections',
          value: String(context.summary.highRiskIntersections ?? 0),
          tone: (context.summary.highRiskIntersections ?? 0) > 3 ? 'warning' : 'neutral',
          sublabel: 'Safety watchlist',
        },
      ]);
    }

    if (context.mapImage?.buffer) {
      this.layout.renderImageBlock(doc, 'Network Map', context.mapImage.buffer, [520, 320]);
    }

    if (context.analytics?.travelTimeTrend?.length) {
      const chartBuffer = await this.charts.renderTravelTimeTrend(
        context.analytics.travelTimeTrend.map((x: any) => x.label),
        context.analytics.travelTimeTrend.map((x: any) => x.value),
      );
      this.layout.renderImageBlock(doc, 'Travel Time Trend', chartBuffer, [520, 220]);
    }

    this.layout.renderBulletSummary(doc, 'Operational Summary', [
      'Airport corridor remains unstable during peak windows.',
      'CBD congestion severity is driven by repeated incidents.',
      'Alternate routing is outperforming the primary route on reliability.',
    ]);

    const topDelayedRoads: TopDelayedRoadRow[] = context.tables?.topDelayedRoads ?? [];
    if (topDelayedRoads.length) {
      doc.addPage();
      this.branding.renderHeader(doc, {
        title: context.meta.title,
        generatedAt: context.meta.generatedAt,
        reportId,
        logoText: 'DashDrive Roads Intelligence',
      });

      this.tables.renderSectionTitle(doc, 'Top Delayed Roads');
      this.tables.renderTable<TopDelayedRoadRow>(doc, [
        { key: 'roadName', title: 'Road', width: 130 },
        { key: 'zone', title: 'Zone', width: 60 },
        {
          key: 'averageSpeedKph',
          title: 'Avg Speed',
          width: 70,
          align: 'right',
          render: (row) => `${row.averageSpeedKph} km/h`,
        },
        {
          key: 'delayMinutes',
          title: 'Delay',
          width: 55,
          align: 'right',
          render: (row) => `${row.delayMinutes}m`,
        },
        {
          key: 'speedLimitKph',
          title: 'Limit',
          width: 50,
          align: 'right',
          render: (row) => (row.speedLimitKph ? `${row.speedLimitKph}` : '—'),
        },
        {
          key: 'incidentCount',
          title: 'Inc',
          width: 35,
          align: 'right',
        },
        {
          key: 'reliabilityScore',
          title: 'Reliability',
          width: 70,
          align: 'right',
          render: (row) => `${row.reliabilityScore}/100`,
        },
        {
          key: 'status',
          title: 'Status',
          width: 60,
          align: 'center',
          render: (row) => row.status,
          badge: true,
        },
      ], topDelayedRoads);
    }

    const routePerformance: RoutePerformanceRow[] = context.tables?.routePerformance ?? [];
    if (routePerformance.length) {
      doc.addPage();
      this.branding.renderHeader(doc, {
        title: context.meta.title,
        generatedAt: context.meta.generatedAt,
        reportId,
        logoText: 'DashDrive Roads Intelligence',
      });

      this.tables.renderSectionTitle(doc, 'Route Performance');
      this.tables.renderTable<RoutePerformanceRow>(doc, [
        { key: 'routeName', title: 'Route', width: 110 },
        { key: 'origin', title: 'Origin', width: 70 },
        { key: 'destination', title: 'Destination', width: 80 },
        {
          key: 'etaMinutes',
          title: 'ETA',
          width: 45,
          align: 'right',
          render: (row) => `${row.etaMinutes}m`,
        },
        {
          key: 'actualAverageMinutes',
          title: 'Actual',
          width: 50,
          align: 'right',
          render: (row) => `${row.actualAverageMinutes}m`,
        },
        {
          key: 'varianceMinutes',
          title: 'Var',
          width: 40,
          align: 'right',
          render: (row) => `${row.varianceMinutes}m`,
        },
        {
          key: 'reliabilityScore',
          title: 'Reliability',
          width: 65,
          align: 'right',
          render: (row) => `${row.reliabilityScore}/100`,
        },
        {
          key: 'routeStatus',
          title: 'Status',
          width: 65,
          align: 'center',
          render: (row) => row.routeStatus,
          badge: true,
        },
      ], routePerformance);
    }

    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i += 1) {
      doc.switchToPage(i);
      this.branding.renderFooter(doc, {
        pageNumber: i - range.start + 1,
        totalPages: range.count,
        reportId,
      });
    }

    doc.end();

    return {
      contentType: 'application/pdf',
      buffer: await finished,
    };
  }
}
