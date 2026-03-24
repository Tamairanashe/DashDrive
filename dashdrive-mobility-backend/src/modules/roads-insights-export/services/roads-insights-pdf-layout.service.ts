// src/modules/roads-insights-export/services/roads-insights-pdf-layout.service.ts

import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { RoadsInsightsPdfUiService } from './roads-insights-pdf-ui.service';

@Injectable()
export class RoadsInsightsPdfLayoutService {
  constructor(private readonly ui: RoadsInsightsPdfUiService) {}

  renderKpis(
    doc: PDFKit.PDFDocument,
    kpis: Array<{
      label: string;
      value: string;
      tone?: 'success' | 'warning' | 'danger' | 'neutral' | 'default';
      sublabel?: string;
    }>,
  ) {
    const startX = 40;
    const y = doc.y;
    const cardWidth = 122;
    const cardHeight = 58;
    const gap = 10;

    kpis.slice(0, 4).forEach((item, index) => {
      this.ui.drawMetricCard(doc, {
        x: startX + index * (cardWidth + gap),
        y,
        width: cardWidth,
        height: cardHeight,
        label: item.label,
        value: item.value,
        tone: item.tone,
        sublabel: item.sublabel,
      });
    });

    doc.y = y + cardHeight + 18;
  }

  renderImageBlock(
    doc: PDFKit.PDFDocument,
    title: string,
    image: Buffer,
    fit: [number, number],
  ) {
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#111').text(title);
    doc.moveDown(0.5);
    doc.image(image, { fit, align: 'center' });
    doc.moveDown();
  }

  renderBulletSummary(doc: PDFKit.PDFDocument, title: string, lines: string[]) {
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#111').text(title);
    doc.moveDown(0.4);
    doc.font('Helvetica').fontSize(10).fillColor('#222');

    for (const line of lines) {
      doc.text(`• ${line}`);
    }

    doc.moveDown();
  }
}
