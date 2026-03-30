// src/modules/roads-insights-export/renderers/json-export.renderer.ts

import { Injectable } from '@nestjs/common';
import { RoadsExportDto } from '../dto/roads-export.dto';
import { RoadsExportContext } from '../types/export-context.type';
import { RendererResult } from '../types/renderer-result.type';

@Injectable()
export class JsonExportRenderer {
  async render(context: RoadsExportContext, dto: RoadsExportDto): Promise<RendererResult> {
    const data = {
      reportTitle: context.meta.title,
      generatedAt: context.meta.generatedAt,
      filters: context.filters,
      layers: context.layers,
      summary: context.summary,
      analytics: context.analytics,
      tables: context.tables,
    };

    return {
      contentType: 'application/json',
      buffer: Buffer.from(JSON.stringify(data, null, 2), 'utf-8'),
    };
  }
}
