// src/modules/roads-insights-export/services/roads-insights-pdf-table.service.ts

import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { RoadsInsightsPdfUiService } from './roads-insights-pdf-ui.service';

type TableColumn<T> = {
  key: keyof T | string;
  title: string;
  width: number;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => string;
  badge?: boolean;
};

@Injectable()
export class RoadsInsightsPdfTableService {
  constructor(private readonly ui: RoadsInsightsPdfUiService) {}

  private readonly pageBottomMargin = 40;
  private readonly rowHeight = 22;
  private readonly headerHeight = 24;
  private readonly tableFontSize = 9;

  renderSectionTitle(doc: PDFKit.PDFDocument, title: string) {
    this.ensureSpace(doc, 30);
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#111').text(title);
    doc.moveDown(0.4);
  }

  renderTable<T extends Record<string, any>>(
    doc: PDFKit.PDFDocument,
    columns: Array<TableColumn<T>>,
    rows: T[],
  ) {
    if (!rows.length) {
      doc.font('Helvetica').fontSize(10).fillColor('#666').text('No data available.');
      doc.moveDown();
      return;
    }

    this.renderHeaderRow(doc, columns);

    rows.forEach((row, index) => {
      this.ensureSpace(doc, this.rowHeight + 8, () => this.renderHeaderRow(doc, columns));
      this.renderBodyRow(doc, columns, row, index);
    });

    doc.moveDown();
  }

  private renderHeaderRow<T extends Record<string, any>>(
    doc: PDFKit.PDFDocument,
    columns: Array<TableColumn<T>>,
  ) {
    const startX = doc.page.margins.left;
    const y = doc.y;
    let x = startX;

    doc.save();
    doc.rect(startX, y, this.getTotalWidth(columns), this.headerHeight)
      .fillAndStroke('#f5f5f5', '#d9d9d9');
    doc.restore();

    columns.forEach((column) => {
      doc
        .font('Helvetica-Bold')
        .fontSize(this.tableFontSize)
        .fillColor('#111')
        .text(column.title, x + 6, y + 7, {
          width: column.width - 12,
          align: column.align ?? 'left',
        });

      x += column.width;
    });

    doc.y = y + this.headerHeight;
  }

  private renderBodyRow<T extends Record<string, any>>(
    doc: PDFKit.PDFDocument,
    columns: Array<TableColumn<T>>,
    row: T,
    index: number,
  ) {
    const startX = doc.page.margins.left;
    const y = doc.y;
    let x = startX;

    const fillColor = index % 2 === 0 ? '#ffffff' : '#fafafa';

    doc.save();
    doc.rect(startX, y, this.getTotalWidth(columns), this.rowHeight)
      .fillAndStroke(fillColor, '#eeeeee');
    doc.restore();

    columns.forEach((column) => {
      const raw =
        typeof column.render === 'function'
          ? column.render(row)
          : String(row[column.key as keyof T] ?? '');

      if (column.badge) {
        const badgeWidth = Math.min(column.width - 12, 58);
        const badgeX = x + Math.max((column.width - badgeWidth) / 2, 6);
        this.ui.drawBadge(
          doc,
          raw,
          badgeX,
          y + 3,
          badgeWidth,
          15,
          this.ui.getToneFromStatus(raw),
        );
      } else {
        doc
          .font('Helvetica')
          .fontSize(this.tableFontSize)
          .fillColor('#222')
          .text(raw, x + 6, y + 6, {
            width: column.width - 12,
            align: column.align ?? 'left',
            ellipsis: true,
          });
      }

      x += column.width;
    });

    doc.y = y + this.rowHeight;
  }

  private getTotalWidth<T>(columns: Array<TableColumn<T>>) {
    return columns.reduce((sum, column) => sum + column.width, 0);
  }

  private ensureSpace(
    doc: PDFKit.PDFDocument,
    requiredHeight: number,
    onPageBreak?: () => void,
  ) {
    const maxY = doc.page.height - this.pageBottomMargin;
    if (doc.y + requiredHeight <= maxY) return;

    doc.addPage();
    if (onPageBreak) onPageBreak();
  }
}
