// src/modules/roads-insights-export/services/roads-insights-direct-export.service.ts

import { Injectable } from '@nestjs/common';
import { RoadsExportDto, RoadsExportFormat } from '../dto/roads-export.dto';
import { RoadsInsightsDataAssemblerService } from './roads-insights-data-assembler.service';
import { RoadsInsightsFileNamingService } from './roads-insights-file-naming.service';
import { PdfExportRenderer } from '../renderers/pdf-export.renderer';
import { CsvExportRenderer } from '../renderers/csv-export.renderer';
import { JsonExportRenderer } from '../renderers/json-export.renderer';
import { PngExportRenderer } from '../renderers/png-export.renderer';

@Injectable()
export class RoadsInsightsDirectExportService {
  constructor(
    private readonly assembler: RoadsInsightsDataAssemblerService,
    private readonly pdfRenderer: PdfExportRenderer,
    private readonly csvRenderer: CsvExportRenderer,
    private readonly jsonRenderer: JsonExportRenderer,
    private readonly pngRenderer: PngExportRenderer,
    private readonly fileNaming: RoadsInsightsFileNamingService,
  ) {}

  async executeDirectExport(dto: RoadsExportDto, user: { id: string }) {
    const context = await this.assembler.assemble(dto, user);
    const rendered = await this.renderByFormat(dto.format, context, dto);

    return {
      success: true,
      mode: 'direct' as const,
      fileName: this.fileNaming.buildName(dto),
      contentType: rendered.contentType,
      fileBase64: rendered.buffer.toString('base64'),
    };
  }

  private async renderByFormat(format: RoadsExportFormat, context: any, dto: RoadsExportDto) {
    switch (format) {
      case RoadsExportFormat.CSV: return this.csvRenderer.render(context, dto);
      case RoadsExportFormat.JSON: return this.jsonRenderer.render(context, dto);
      case RoadsExportFormat.PNG: return this.pngRenderer.render(context, dto);
      case RoadsExportFormat.PDF:
      default:
        return this.pdfRenderer.render(context);
    }
  }
}
