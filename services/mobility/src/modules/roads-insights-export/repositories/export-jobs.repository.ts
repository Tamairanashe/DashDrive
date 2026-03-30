// src/modules/roads-insights-export/repositories/export-jobs.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ExportJobsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return (this.prisma as any).exportJob.create({
      data: {
        module: data.module || 'roads_insights',
        requested_by: data.requestedBy,
        format: data.format,
        status: data.status,
        progress: data.progress,
        request_payload: data.requestPayloadJson,
      },
    });
  }

  async markProcessing(id: string, update: { progress: number; stage: string }) {
    return (this.prisma as any).exportJob.update({
      where: { id },
      data: {
        status: 'processing',
        progress: update.progress,
        started_at: new Date(),
      },
    });
  }

  async markCompleted(id: string, update: any) {
    return (this.prisma as any).exportJob.update({
      where: { id },
      data: {
        status: 'completed',
        progress: 100,
        completed_at: new Date(),
        file_name: update.fileName,
        file_path: update.filePath,
        content_type: update.contentType,
        file_size_bytes: update.fileSizeBytes,
      },
    });
  }

  async markFailed(id: string, update: { errorCode: string; errorMessage: string }) {
    return (this.prisma as any).exportJob.update({
      where: { id },
      data: {
        status: 'failed',
        error_code: update.errorCode,
        error_message: update.errorMessage,
        completed_at: new Date(),
      },
    });
  }

  async findOwnedJob(jobId: string, userId: string) {
    return (this.prisma as any).exportJob.findFirst({
      where: { id: jobId, requested_by: userId },
    });
  }

  async findOwnedCompletedJob(jobId: string, userId: string) {
    return (this.prisma as any).exportJob.findFirst({
      where: { id: jobId, requested_by: userId, status: 'completed' },
    });
  }

  async listOwnedJobs(
    userId: string,
    options: {
      limit: number;
      status?: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
    },
  ) {
    const where: any = { requested_by: userId };
    if (options.status) {
      where.status = options.status;
    }

    return (this.prisma as any).exportJob.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: options.limit,
    });
  }

  async findById(jobId: string) {
    return (this.prisma as any).exportJob.findUnique({
      where: { id: jobId },
    });
  }

  async markCancelled(id: string) {
    return (this.prisma as any).exportJob.update({
      where: { id },
      data: {
        status: 'cancelled',
        is_cancelled: true,
        cancelled_at: new Date(),
        progress: 100,
        stage: 'cancelled',
      },
    });
  }

  async resetForRetry(id: string) {
    return (this.prisma as any).exportJob.update({
      where: { id },
      data: {
        status: 'queued',
        progress: 0,
        stage: 'queued',
        error_code: null,
        error_message: null,
        is_cancelled: false,
        cancelled_at: null,
        started_at: null,
        completed_at: null,
      },
    });
  }
}
