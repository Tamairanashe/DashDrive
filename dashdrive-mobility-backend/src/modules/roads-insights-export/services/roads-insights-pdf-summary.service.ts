// src/modules/roads-insights-export/services/roads-insights-pdf-summary.service.ts

import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { RoadsInsightsPdfUiService } from './roads-insights-pdf-ui.service';

@Injectable()
export class RoadsInsightsPdfSummaryService {
  constructor(private readonly ui: RoadsInsightsPdfUiService) {}

  renderFilterChips(
    doc: PDFKit.PDFDocument,
    filters: Record<string, any> | null | undefined,
  ) {
    if (!filters) return;

    const chips = this.buildFilterChips(filters);
    if (!chips.length) return;

    doc.font('Helvetica-Bold').fontSize(11).fillColor('#111').text('Active Filters');
    doc.moveDown(0.4);

    let x = doc.page.margins.left;
    let y = doc.y;
    const maxX = doc.page.width - doc.page.margins.right;

    for (const chip of chips) {
      const width = Math.min(140, Math.max(54, chip.length * 5.6 + 18));

      if (x + width > maxX) {
        x = doc.page.margins.left;
        y += 22;
      }

      doc.save();
      doc.roundedRect(x, y, width, 16, 8).fillAndStroke('#fafafa', '#d9d9d9');
      doc
        .font('Helvetica')
        .fontSize(7.5)
        .fillColor('#444')
        .text(chip, x, y + 4.5, {
          width,
          align: 'center',
        });
      doc.restore();

      x += width + 8;
    }

    doc.y = y + 24;
    doc.moveDown(0.3);
  }

  renderExecutiveSummary(
    doc: PDFKit.PDFDocument,
    summary: {
      title?: string;
      highlights: string[];
    },
  ) {
    const x = doc.page.margins.left;
    const y = doc.y;
    const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const height = 92;

    doc.save();
    doc.roundedRect(x, y, width, height, 10).fillAndStroke('#f8fbff', '#d6e4ff');

    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .fillColor('#1d39c4')
      .text(summary.title ?? 'Executive Summary', x + 14, y + 12);

    let lineY = y + 32;
    summary.highlights.slice(0, 3).forEach((line) => {
      doc
        .font('Helvetica')
        .fontSize(9.5)
        .fillColor('#222')
        .text(`• ${line}`, x + 14, lineY, {
          width: width - 28,
        });
      lineY += 16;
    });

    doc.restore();
    doc.y = y + height + 14;
  }

  renderScopeSummary(
    doc: PDFKit.PDFDocument,
    input: {
      city?: string;
      zone?: string;
      mode?: string;
      services?: string[];
      roadTypes?: string[];
    },
  ) {
    const items = [
      { label: 'CITY', value: input.city ?? 'ALL' },
      { label: 'ZONE', value: input.zone ?? 'ALL' },
      { label: 'MODE', value: (input.mode ?? 'N/A').toUpperCase() },
      {
        label: 'SERVICES',
        value: input.services?.length ? input.services.join(', ') : 'ALL',
      },
      {
        label: 'ROAD TYPES',
        value: input.roadTypes?.length ? input.roadTypes.join(', ') : 'ALL',
      },
    ];

    const x = doc.page.margins.left;
    const y = doc.y;
    const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const height = 44;
    const itemWidth = width / items.length;

    doc.save();
    doc.roundedRect(x, y, width, height, 8).fillAndStroke('#ffffff', '#e8e8e8');

    items.forEach((item, index) => {
      const itemX = x + index * itemWidth;

      if (index > 0) {
        doc
          .moveTo(itemX, y + 6)
          .lineTo(itemX, y + height - 6)
          .strokeColor('#f0f0f0')
          .stroke();
      }

      doc
        .font('Helvetica')
        .fontSize(7.2)
        .fillColor('#8c8c8c')
        .text(item.label, itemX + 8, y + 8, {
          width: itemWidth - 16,
        });

      doc
        .font('Helvetica-Bold')
        .fontSize(8.5)
        .fillColor('#111')
        .text(item.value, itemX + 8, y + 20, {
          width: itemWidth - 16,
          ellipsis: true,
        });
    });

    doc.restore();
    doc.y = y + height + 12;
  }

  private buildFilterChips(filters: Record<string, any>): string[] {
    const chips: string[] = [];

    if (filters.cityId) chips.push(`City: ${filters.cityId}`);
    if (filters.zoneId) chips.push(`Zone: ${filters.zoneId}`);
    if (filters.mode) chips.push(`Mode: ${filters.mode}`);

    if (Array.isArray(filters.serviceType)) {
      filters.serviceType.forEach((v: string) => chips.push(`Service: ${v}`));
    }

    if (Array.isArray(filters.roadType)) {
      filters.roadType.forEach((v: string) => chips.push(`Road: ${v}`));
    }

    if (Array.isArray(filters.severity)) {
      filters.severity.forEach((v: string) => chips.push(`Severity: ${v}`));
    }

    if (Array.isArray(filters.incidentStatus)) {
      filters.incidentStatus.forEach((v: string) => chips.push(`Incident: ${v}`));
    }

    return chips.slice(0, 12);
  }
}
