// src/modules/roads-insights-export/dto/roads-export-response.dto.ts

export class DirectExportResponseDto {
  success!: true;
  mode!: 'direct';
  fileName!: string;
  contentType!: string;
  fileBase64?: string;
  downloadUrl?: string;
}

export class QueuedExportResponseDto {
  success!: true;
  mode!: 'job';
  jobId!: string;
  status!: 'queued' | 'processing';
  message!: string;
}

export type RoadsExportResponseDto = DirectExportResponseDto | QueuedExportResponseDto;
