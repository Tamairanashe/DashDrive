// src/modules/roads-insights-export/services/roads-insights-queued-export.service.ts

import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { RoadsExportDto } from '../dto/roads-export.dto';
import { ExportJobsRepository } from '../repositories/export-jobs.repository';

import { ExportsEventsService } from '../../exports/realtime/exports-events.service';

@Injectable()
export class RoadsInsightsQueuedExportService {
  constructor(
    @InjectQueue('roads-insights-export') private readonly exportQueue: Queue,
    private readonly jobsRepository: ExportJobsRepository,
    private readonly exportsEvents: ExportsEventsService,
  ) {}

  async enqueueExport(dto: RoadsExportDto, user: { id: string }) {
    const dbJob = await this.jobsRepository.create({
      module: 'roads_insights',
      requestedBy: user.id,
      format: dto.format,
      status: 'queued',
      progress: 0,
      requestPayloadJson: dto,
    });

    // Priority mapping: lower numeral = higher priority
    // Fast exports (CSV, JSON) = 1, Visual exports (PDF, PNG) = 5
    const priority = dto.format === 'pdf' || dto.format === 'png' ? 5 : 1;

    await this.exportQueue.add(
      'generate-roads-insights-export',
      {
        exportJobId: dbJob.id,
        userId: user.id,
        dto,
      },
      {
        jobId: dbJob.id, // Explicitly set BullMQ Job ID to match DB ID for easy cancellation
        attempts: 3,
        priority,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    );

    this.exportsEvents.emitQueued(user.id, {
      jobId: dbJob.id,
      module: 'roads_insights',
      status: 'queued',
      progress: 0,
      createdAt: dbJob.createdAt.toISOString(),
      message: 'Export job created successfully.',
    });

    return {
      success: true,
      mode: 'job' as const,
      jobId: dbJob.id,
      status: 'queued' as const,
      message: 'Export job queued successfully.',
    };
  }

  async enqueueRetry(jobId: string, dto: any) {
    // Priority mapping: lower numeral = higher priority
    const priority = dto.format === 'pdf' || dto.format === 'png' ? 5 : 1;

    await this.exportQueue.add(
      'generate-roads-insights-export',
      {
        exportJobId: jobId,
        dto,
      },
      {
        jobId: jobId,
        attempts: 3,
        priority,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    );
  }

  async cancel(jobId: string) {
    const job = await this.exportQueue.getJob(jobId);
    if (job) {
      await job.remove();
    }
  }
}
