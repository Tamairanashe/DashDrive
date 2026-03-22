// src/modules/exports/realtime/exports-events.service.ts

import { Injectable } from '@nestjs/common';
import { ExportsGateway } from './exports.gateway';

export type ExportRealtimePayload = {
  jobId: string;
  module: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress?: number;
  stage?: string;
  fileName?: string;
  contentType?: string;
  downloadUrl?: string;
  errorCode?: string;
  message?: string;
  createdAt?: string;
  completedAt?: string;
};

@Injectable()
export class ExportsEventsService {
  constructor(private readonly gateway: ExportsGateway) {}

  emitQueued(userId: string, payload: ExportRealtimePayload) {
    this.gateway.emitToUser(userId, 'export.queued', payload);
  }

  emitProgress(userId: string, payload: ExportRealtimePayload) {
    this.gateway.emitToUser(userId, 'export.progress', payload);
  }

  emitCompleted(userId: string, payload: ExportRealtimePayload) {
    this.gateway.emitToUser(userId, 'export.completed', payload);
  }

  emitFailed(userId: string, payload: ExportRealtimePayload) {
    this.gateway.emitToUser(userId, 'export.failed', payload);
  }

  emitJobUpdate(userId: string, payload: ExportRealtimePayload) {
    this.gateway.emitToUser(userId, 'export.update', payload);
  }
}
