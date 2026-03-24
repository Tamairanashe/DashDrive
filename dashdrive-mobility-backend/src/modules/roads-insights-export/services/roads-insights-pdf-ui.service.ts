// src/modules/roads-insights-export/services/roads-insights-pdf-ui.service.ts

import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

export type BadgeTone = 'success' | 'warning' | 'danger' | 'neutral' | 'default';

@Injectable()
export class RoadsInsightsPdfUiService {
  private readonly tones: Record<
    BadgeTone,
    { fill: string; text: string; border: string }
  > = {
    success: { fill: '#f6ffed', text: '#389e0d', border: '#b7eb8f' },
    warning: { fill: '#fffbe6', text: '#d48806', border: '#ffe58f' },
    danger: { fill: '#fff1f0', text: '#cf1322', border: '#ffa39e' },
    neutral: { fill: '#f0f5ff', text: '#1d39c4', border: '#adc6ff' },
    default: { fill: '#fafafa', text: '#595959', border: '#d9d9d9' },
  };

  getToneFromStatus(value?: string): BadgeTone {
    const normalized = (value ?? '').toLowerCase();

    if (['success', 'good', 'preferred', 'stable', 'completed', 'active'].includes(normalized)) {
      return 'success';
    }
    if (['warning', 'degraded', 'queued', 'processing', 'unstable'].includes(normalized)) {
      return 'warning';
    }
    if (['error', 'failed', 'critical', 'blocked', 'high'].includes(normalized)) {
      return 'danger';
    }
    if (['neutral', 'medium'].includes(normalized)) {
      return 'neutral';
    }

    return 'default';
  }

  drawBadge(
    doc: PDFKit.PDFDocument,
    text: string,
    x: number,
    y: number,
    width = 52,
    height = 16,
    tone: BadgeTone = 'default',
  ) {
    const palette = this.tones[tone];

    doc.save();
    doc.roundedRect(x, y, width, height, 8).fillAndStroke(palette.fill, palette.border);
    doc
      .fillColor(palette.text)
      .font('Helvetica-Bold')
      .fontSize(7.5)
      .text(text.toUpperCase(), x, y + 4.5, {
        width,
        align: 'center',
      });
    doc.restore();
  }

  drawMetricCard(
    doc: PDFKit.PDFDocument,
    input: {
      x: number;
      y: number;
      width: number;
      height: number;
      label: string;
      value: string;
      tone?: BadgeTone;
      sublabel?: string;
    },
  ) {
    const tone = input.tone ?? 'default';
    const palette = this.tones[tone];

    doc.save();
    doc.roundedRect(input.x, input.y, input.width, input.height, 10)
      .fillAndStroke('#ffffff', '#e8e8e8');

    doc.roundedRect(input.x, input.y, 6, input.height, 6).fill(palette.text);

    doc
      .fillColor('#666')
      .font('Helvetica')
      .fontSize(8)
      .text(input.label, input.x + 14, input.y + 10, {
        width: input.width - 24,
      });

    doc
      .fillColor('#111')
      .font('Helvetica-Bold')
      .fontSize(17)
      .text(input.value, input.x + 14, input.y + 24, {
        width: input.width - 24,
      });

    if (input.sublabel) {
      doc
        .fillColor('#8c8c8c')
        .font('Helvetica')
        .fontSize(7.5)
        .text(input.sublabel, input.x + 14, input.y + input.height - 14, {
          width: input.width - 24,
        });
    }

    doc.restore();
  }
}
