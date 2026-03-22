import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { RoadsExportDto } from '../dto/roads-export.dto';
import { RoadsInsightsExportPolicyService } from './roads-insights-export-policy.service';
import { RoadsInsightsDirectExportService } from './roads-insights-direct-export.service';
import { RoadsInsightsQueuedExportService } from './roads-insights-queued-export.service';
import { ExportJobsRepository } from '../repositories/export-jobs.repository';
import { FileStorageService } from '../../../providers/storage/file-storage.service';
import { ExportsEventsService } from '../../exports/realtime/exports-events.service';
import { ExportProgressService } from '../../exports/progress/export-progress.service';

type AuthUser = { id: string };

@Injectable()
export class RoadsInsightsExportService {
  private readonly logger = new Logger(RoadsInsightsExportService.name);

  constructor(
    private readonly policy: RoadsInsightsExportPolicyService,
    private readonly directService: RoadsInsightsDirectExportService,
    private readonly queuedService: RoadsInsightsQueuedExportService,
    private readonly jobsRepository: ExportJobsRepository,
    private readonly storage: FileStorageService,
    private readonly eventsService: ExportsEventsService,
    private readonly progressService: ExportProgressService,
  ) {}

  async createExport(dto: RoadsExportDto, user: { id: string; email?: string }) {
    this.logger.log(`Received export request: ${dto.title} (${dto.format})`);
    
    if (this.policy.shouldQueue(dto)) {
      return this.queuedService.enqueueExport(dto, user);
    }
    return this.directService.executeDirectExport(dto, user);
  }

  async listExportJobs(
    user: AuthUser,
    options: {
      limit: number;
      status?: 'queued' | 'processing' | 'completed' | 'failed';
    },
  ) {
    const jobs = await this.jobsRepository.listOwnedJobs(user.id, options);

    const items = await Promise.all(
      jobs.map(async (job: any) => {
        let downloadUrl: string | undefined;

        if (job.status === 'completed') {
          downloadUrl = `/roads/insights/export-jobs/${job.id}/download`;
        }

        return {
          jobId: job.id,
          module: job.module,
          status: job.status,
          progress: job.progress,
          stage: job.stage,
          fileName: job.file_name,
          contentType: job.content_type,
          downloadUrl,
          errorCode: job.error_code,
          message: job.error_message,
          createdAt: job.created_at.toISOString(),
          completedAt: job.completed_at?.toISOString(),
        };
      }),
    );

    return {
      success: true,
      items,
    };
  }

  async getExportJob(jobId: string, user: { id: string }) {
    const job = await this.jobsRepository.findOwnedJob(jobId, user.id);
    if (!job) {
      throw new NotFoundException('Export job not found');
    }

    let downloadUrl: string | undefined;

    if (job.status === 'completed') {
      downloadUrl = `/roads/insights/export-jobs/${job.id}/download`;
    }

    return {
      success: job.status !== 'failed',
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      stage: job.stage,
      fileName: job.file_name,
      contentType: job.content_type,
      downloadUrl,
      errorCode: job.error_code,
      message: job.error_message,
      createdAt: job.created_at.toISOString(),
      completedAt: job.completed_at?.toISOString(),
    };
  }

  async streamExportFile(
    jobId: string,
    user: { id: string },
    res: Response,
  ) {
    const job = await this.jobsRepository.findOwnedCompletedJob(jobId, user.id);
    if (!job || !job.file_path) {
      throw new NotFoundException('Export file not found or still processing');
    }

    const stream = await this.storage.createReadStream(job.file_path);
    
    res.set({
      'Content-Type': job.content_type || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${job.file_name}"`,
    });

    stream.pipe(res);
  }

  async retryExportJob(jobId: string, user: { id: string }) {
    const job = await this.jobsRepository.findOwnedJob(jobId, user.id);
    if (!job) {
      throw new NotFoundException('Export job not found');
    }

    if (job.status !== 'failed' && job.status !== 'cancelled') {
      throw new Error('Only failed or cancelled jobs can be retried');
    }

    await this.jobsRepository.resetForRetry(jobId);
    await this.queuedService.enqueueRetry(jobId, job.request_payload);

    this.eventsService.emitJobUpdate(user.id, {
      jobId,
      module: 'roads_insights',
      status: 'queued',
      progress: this.progressService.getProgress('queued'),
    });

    return { success: true };
  }

  async cancelExportJob(jobId: string, user: { id: string }) {
    const job = await this.jobsRepository.findOwnedJob(jobId, user.id);
    if (!job) {
      throw new NotFoundException('Export job not found');
    }

    if (
      job.status === 'completed' ||
      job.status === 'failed' ||
      job.status === 'cancelled'
    ) {
      throw new Error(`Cannot cancel job in ${job.status} state`);
    }

    await this.jobsRepository.markCancelled(jobId);
    await this.queuedService.cancel(jobId);

    this.eventsService.emitJobUpdate(user.id, {
      jobId,
      module: 'roads_insights',
      status: 'cancelled',
      progress: 100,
    });

    return { success: true };
  }
}
