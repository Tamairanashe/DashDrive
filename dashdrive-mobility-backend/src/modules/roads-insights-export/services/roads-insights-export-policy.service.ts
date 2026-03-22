// src/modules/roads-insights-export/services/roads-insights-export-policy.service.ts

import { Injectable } from '@nestjs/common';
import { RoadsExportDto, RoadsExportFormat } from '../dto/roads-export.dto';

@Injectable()
export class RoadsInsightsExportPolicyService {
  shouldQueue(dto: RoadsExportDto): boolean {
    // PDF and PNG are expensive, so always queue them
    if (dto.format === RoadsExportFormat.PDF || dto.format === RoadsExportFormat.PNG) {
      return true;
    }
    
    // For CSV, queue if multiple tables are requested
    if (dto.format === RoadsExportFormat.CSV && (dto.tables?.length ?? 0) > 1) {
      return true;
    }

    return false;
  }
}
