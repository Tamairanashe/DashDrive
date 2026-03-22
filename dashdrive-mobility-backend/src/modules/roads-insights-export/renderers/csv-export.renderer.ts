// src/modules/roads-insights-export/renderers/csv-export.renderer.ts

import { Injectable } from '@nestjs/common';
import { RoadsExportDto } from '../dto/roads-export.dto';
import { RoadsExportContext } from '../types/export-context.type';
import { RendererResult } from '../types/renderer-result.type';

@Injectable()
export class CsvExportRenderer {
  async render(context: RoadsExportContext, dto: RoadsExportDto): Promise<RendererResult> {
    const rows = context.tables?.topDelayedRoads ?? [];
    const header = [
      'Road Name',
      'Zone',
      'Average Speed (kph)',
      'Delay (mins)',
      'Reliability Score',
      'Status',
    ];

    const csvLines = [
      header.join(','),
      ...rows.map((r: any) =>
        [
          `"${r.roadName}"`,
          `"${r.zone}"`,
          r.averageSpeedKph,
          r.delayMinutes,
          r.reliabilityScore,
          `"${r.status}"`,
        ].join(','),
      ),
    ];

    return {
      contentType: 'text/csv',
      buffer: Buffer.from(csvLines.join('\n'), 'utf-8'),
    };
  }
}
