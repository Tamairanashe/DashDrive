// src/modules/roads-insights-export/renderers/png-export.renderer.ts

import { Injectable } from '@nestjs/common';
import { RoadsExportDto } from '../dto/roads-export.dto';
import { RoadsExportContext } from '../types/export-context.type';
import { RendererResult } from '../types/renderer-result.type';

@Injectable()
export class PngExportRenderer {
  async render(context: RoadsExportContext, dto: RoadsExportDto): Promise<RendererResult> {
    if (!context.mapImage?.buffer) {
      throw new Error('PNG export requires a valid map snapshot image.');
    }

    // Since it's already a PNG buffer from the client, we just wrap it
    return {
      contentType: 'image/png',
      buffer: context.mapImage.buffer,
    };
  }
}
