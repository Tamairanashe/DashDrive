// src/modules/roads-insights-export/services/roads-insights-pdf-branding.service.ts

import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { RoadsInsightsPdfUiService } from './roads-insights-pdf-ui.service';

type HeaderInput = {
  title: string;
  generatedAt: string;
  reportId?: string;
  logoText?: string;
};

@Injectable()
export class RoadsInsightsPdfBrandingService {
  constructor(private readonly ui: RoadsInsightsPdfUiService) {}

  renderHeader(doc: PDFKit.PDFDocument, input: HeaderInput) {
    const top = 24;
    const left = doc.page.margins.left;
    const right = doc.page.width - doc.page.margins.right;

    doc.save();

    doc
      .font('Helvetica-Bold')
      .fontSize(16)
      .fillColor('#1677ff')
      .text(input.logoText ?? 'DashDrive Roads Intelligence', left, top, {
        width: 220,
      });

    doc
      .font('Helvetica-Bold')
      .fontSize(20)
      .fillColor('#111')
      .text(input.title, left, top + 26, {
        width: right - left,
      });

    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor('#666')
      .text(`Generated: ${input.generatedAt}`, left, top + 52);

    if (input.reportId) {
      doc
        .font('Helvetica')
        .fontSize(9)
        .fillColor('#666')
        .text(`Report ID: ${input.reportId}`, left + 180, top + 52);
    }

    doc
      .moveTo(left, top + 74)
      .lineTo(right, top + 74)
      .strokeColor('#e8e8e8')
      .stroke();

    doc.restore();
    doc.y = top + 88;
  }

  renderFooter(doc: PDFKit.PDFDocument, input: { pageNumber: number; totalPages: number; reportId?: string }) {
    const y = doc.page.height - 24;
    const left = doc.page.margins.left;
    const right = doc.page.width - doc.page.margins.right;

    doc.save();

    doc
      .moveTo(left, y - 10)
      .lineTo(right, y - 10)
      .strokeColor('#e8e8e8')
      .stroke();

    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor('#8c8c8c')
      .text('Confidential operational report', left, y - 2);

    if (input.reportId) {
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor('#8c8c8c')
        .text(`Report ID: ${input.reportId}`, left + 160, y - 2);
    }

    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor('#8c8c8c')
      .text(`Page ${input.pageNumber} of ${input.totalPages}`, right - 80, y - 2, {
        width: 80,
        align: 'right',
      });

    doc.restore();
  }

  renderStatusLegend(doc: PDFKit.PDFDocument) {
    const startX = doc.page.margins.left;
    const y = doc.y;

    doc
      .font('Helvetica-Bold')
      .fontSize(11)
      .fillColor('#111')
      .text('Status Legend', startX, y);

    const items = [
      { label: 'Success / Preferred', tone: 'success' as const },
      { label: 'Warning / Queued', tone: 'warning' as const },
      { label: 'Critical / Failed', tone: 'danger' as const },
      { label: 'Neutral / Medium', tone: 'neutral' as const },
    ];

    let x = startX;
    const badgeY = y + 16;

    items.forEach((item) => {
      this.ui.drawBadge(doc, item.label, x, badgeY, 88, 16, item.tone);
      x += 96;
    });

    doc.y = badgeY + 24;
  }

  renderMetaStrip(
    doc: PDFKit.PDFDocument,
    items: Array<{ label: string; value: string }>,
  ) {
    const x = doc.page.margins.left;
    const y = doc.y;
    const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const height = 36;
    const itemWidth = width / Math.max(items.length, 1);

    doc.save();
    doc.roundedRect(x, y, width, height, 8).fillAndStroke('#fafafa', '#e8e8e8');

    items.forEach((item, index) => {
      const itemX = x + itemWidth * index;

      if (index > 0) {
        doc
          .moveTo(itemX, y + 6)
          .lineTo(itemX, y + height - 6)
          .strokeColor('#ededed')
          .stroke();
      }

      doc
        .font('Helvetica')
        .fontSize(7.5)
        .fillColor('#8c8c8c')
        .text(item.label, itemX + 10, y + 8, {
          width: itemWidth - 20,
        });

      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor('#111')
        .text(item.value, itemX + 10, y + 18, {
          width: itemWidth - 20,
        });
    });

    doc.restore();
    doc.y = y + height + 14;
  }
}
