// src/modules/roads-insights-export/services/roads-insights-file-naming.service.ts

import { Injectable } from '@nestjs/common';
import { RoadsExportDto } from '../dto/roads-export.dto';

@Injectable()
export class RoadsInsightsFileNamingService {
  buildName(dto: RoadsExportDto): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sanitizedTitle = dto.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `roads-export-${sanitizedTitle}-${timestamp}.${dto.format}`;
  }
}
