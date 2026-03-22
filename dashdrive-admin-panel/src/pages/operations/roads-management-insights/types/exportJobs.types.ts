// src/pages/operations/roads-management-insights/types/exportJobs.types.ts

export type ExportJobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface ExportJobItem {
  id: string;
  module: string;
  format: string;
  status: ExportJobStatus;
  progress: number;
  stage?: string;
  fileName?: string;
  contentType?: string;
  downloadUrl?: string;
  errorCode?: string;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ExportJobEventPayload {
  jobId: string;
  module: string;
  status: ExportJobStatus;
  progress?: number;
  stage?: string;
  fileName?: string;
  contentType?: string;
  downloadUrl?: string;
  errorCode?: string;
  message?: string;
  createdAt?: string;
  completedAt?: string;
}
