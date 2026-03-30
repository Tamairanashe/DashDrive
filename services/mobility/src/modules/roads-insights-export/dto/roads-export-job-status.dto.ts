// src/modules/roads-insights-export/dto/roads-export-job-status.dto.ts

export class RoadsExportJobStatusDto {
  success!: boolean;
  jobId!: string;
  status!: 'queued' | 'processing' | 'completed' | 'failed';
  progress?: number;
  stage?: string;
  fileName?: string;
  contentType?: string;
  downloadUrl?: string;
  errorCode?: string;
  message?: string;
  createdAt!: string;
  completedAt?: string;
}
