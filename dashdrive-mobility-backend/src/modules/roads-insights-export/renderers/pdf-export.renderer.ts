// src/modules/roads-insights-export/renderers/pdf-export.renderer.ts

import { Injectable } from '@nestjs/common';
import PDFDocument = require('pdfkit');
import { RoadsExportDto } from '../dto/roads-export.dto';
import { RoadsExportContext } from '../types/export-context.type';
import { RendererResult } from '../types/renderer-result.type';

interface PdfTheme {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  mutedColor: string;
  backgroundColor: string;
  fontBold: string;
  fontRegular: string;
}

const ROADS_THEME: PdfTheme = {
  primaryColor: '#1890ff',
  secondaryColor: '#001529',
  textColor: '#333333',
  mutedColor: '#666666',
  backgroundColor: '#f0f2f5',
  fontBold: 'Helvetica-Bold',
  fontRegular: 'Helvetica',
};

@Injectable()
export class PdfExportRenderer {
  async render(context: RoadsExportContext, dto: RoadsExportDto): Promise<RendererResult> {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)));

    const done = new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });

    this.renderHeader(doc, context);
    this.renderKpiGrid(doc, context);
    this.renderMapSection(doc, context);
    
    if (context.analytics) {
      this.renderAnalytics(doc, context);
    }

    if (context.tables?.topDelayedRoads) {
      this.renderDelayedRoadsTable(doc, context);
    }

    this.renderFooter(doc);

    doc.end();

    return {
      contentType: 'application/pdf',
      buffer: await done,
    };
  }

  private renderHeader(doc: typeof PDFDocument, context: RoadsExportContext) {
    doc.fontSize(22)
       .font(ROADS_THEME.fontBold)
       .fillColor(ROADS_THEME.primaryColor)
       .text(context.meta.title, { align: 'left' });
    
    doc.fontSize(10)
       .font(ROADS_THEME.fontRegular)
       .fillColor(ROADS_THEME.mutedColor)
       .text(`Dashboard Report | Generated on: ${new Date(context.meta.generatedAt).toLocaleString()}`, { align: 'left' });
    
    doc.moveDown(2);
    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke(ROADS_THEME.primaryColor);
    doc.moveDown(1.5);
  }

  private renderKpiGrid(doc: typeof PDFDocument, context: RoadsExportContext) {
    if (!context.summary) return;

    doc.fontSize(16).fillColor(ROADS_THEME.secondaryColor).text('Key Metrics Summary', { underline: true });
    doc.moveDown(1);

    const startY = doc.y;
    const colWidth = 170;

    // Col 1
    doc.fontSize(10).fillColor(ROADS_THEME.mutedColor).text('Total Managed Roads', 40, startY);
    doc.fontSize(14).fillColor(ROADS_THEME.textColor).text(`${context.summary.totalRoads ?? 0}`, 40, startY + 15);

    // Col 2
    doc.fontSize(10).fillColor(ROADS_THEME.mutedColor).text('Active Incidents', 40 + colWidth, startY);
    doc.fontSize(14).fillColor(ROADS_THEME.textColor).text(`${context.summary.activeIncidents ?? 0}`, 40 + colWidth, startY + 15);

    // Col 3
    doc.fontSize(10).fillColor(ROADS_THEME.mutedColor).text('Avg Speed (KPH)', 40 + colWidth * 2, startY);
    doc.fontSize(14).fillColor(ROADS_THEME.textColor).text(`${context.summary.avgSpeedKph ?? 0}`, 40 + colWidth * 2, startY + 15);

    doc.moveDown(3);
  }

  private renderMapSection(doc: typeof PDFDocument, context: RoadsExportContext) {
    if (!context.mapImage?.buffer) {
      doc.fontSize(12).fillColor('red').text('Map visualization data unavailable.');
      return;
    }

    doc.fontSize(16).fillColor(ROADS_THEME.secondaryColor).text('Operational Awareness Map');
    doc.moveDown(1);

    try {
      doc.image(context.mapImage.buffer, {
        fit: [515, 300],
        align: 'center',
      });
      doc.moveDown(1);
    } catch (err) {
      doc.fontSize(10).fillColor('red').text('Critical Error: Failed to embed map image into PDF.');
    }
    
    doc.moveDown(1.5);
  }

  private renderAnalytics(doc: typeof PDFDocument, context: RoadsExportContext) {
    doc.addPage();
    doc.fontSize(16).fillColor(ROADS_THEME.secondaryColor).text('Insights & Trend Analysis');
    doc.moveDown(1);
    doc.fontSize(10).fillColor(ROADS_THEME.textColor).text(
      'Based on the current reporting period, we observe variations in network congestion and incident response times.'
    );
    doc.moveDown(1);
  }

  private renderDelayedRoadsTable(doc: typeof PDFDocument, context: RoadsExportContext) {
    doc.fontSize(16).fillColor(ROADS_THEME.secondaryColor).text('Top Delayed Road Segments');
    doc.moveDown(1);

    const tableTop = doc.y;
    doc.fontSize(10).font(ROADS_THEME.fontBold).fillColor(ROADS_THEME.secondaryColor);
    doc.text('Road Name', 40, tableTop);
    doc.text('Zone', 220, tableTop);
    doc.text('Delay', 380, tableTop);
    doc.text('Avg Speed', 480, tableTop);

    doc.moveTo(40, tableTop + 15).lineTo(555, tableTop + 15).stroke('#ccc');
    
    let currentY = tableTop + 25;
    doc.font(ROADS_THEME.fontRegular).fillColor(ROADS_THEME.textColor);

    context.tables.topDelayedRoads.forEach((road: any) => {
      if (currentY > 750) {
        doc.addPage();
        currentY = 40;
      }
      doc.text(road.roadName, 40, currentY);
      doc.text(road.zone, 220, currentY);
      doc.text(`${road.delayMinutes}m`, 380, currentY);
      doc.text(`${road.averageSpeedKph} km/h`, 480, currentY);
      currentY += 20;
    });

    doc.moveDown(2);
  }

  private renderFooter(doc: typeof PDFDocument) {
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      const oldBottomMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;
      doc.fontSize(8).fillColor(ROADS_THEME.mutedColor).text(
        `Confidential - DashDrive Roads Management Insights System | Page ${i + 1} of ${pages.count}`,
        0,
        doc.page.height - 30,
        { align: 'center' }
      );
      doc.page.margins.bottom = oldBottomMargin;
    }
  }
}
