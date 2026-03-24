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

  async getMapData(dto: any, user: AuthUser) {
    this.logger.log(`Fetching map data for user ${user.id}`);
    
    // In a real app, this would query a database or external API
    // For now, we return mock data that matches the frontend type expectation
    return {
      mapData: {
        center: { lat: -17.8292, lng: 31.0522 },
        zoom: 13,
        roads: [
          {
            id: 'road_1',
            name: 'Samora Machel Ave',
            classification: 'Primary',
            path: [
              { lat: -17.828, lng: 31.04 },
              { lat: -17.829, lng: 31.05 },
              { lat: -17.83, lng: 31.06 },
            ],
            congestionLevel: 'high',
            reliabilityScore: 45,
            averageSpeedKph: 22,
            postedSpeedLimitKph: 60,
          },
          {
            id: 'road_2',
            name: 'Julius Nyerere Way',
            classification: 'Primary',
            path: [
              { lat: -17.825, lng: 31.045 },
              { lat: -17.835, lng: 31.045 },
            ],
            congestionLevel: 'medium',
            reliabilityScore: 72,
            averageSpeedKph: 35,
            postedSpeedLimitKph: 60,
          },
        ],
        corridors: [
          {
            id: 'corr_1',
            name: 'West-East Corridor',
            path: [
              { lat: -17.82, lng: 31.02 },
              { lat: -17.84, lng: 31.08 },
            ],
            congestionLevel: 'medium',
            reliabilityScore: 68,
          },
        ],
        incidents: [
          {
            id: 'inc_1',
            title: 'Stalled Vehicle',
            type: 'Breakdown',
            severity: 'medium',
            lat: -17.8295,
            lng: 31.051,
            status: 'Active',
            startedAt: new Date().toISOString(),
          },
          {
            id: 'inc_2',
            title: 'Road Works',
            type: 'Construction',
            severity: 'high',
            lat: -17.832,
            lng: 31.055,
            status: 'Active',
            startedAt: new Date().toISOString(),
          },
        ],
        routes: [
          {
            id: 'route_1',
            name: 'Standard Route',
            path: [
              { lat: -17.81, lng: 31.03 },
              { lat: -17.85, lng: 31.07 },
            ],
            etaMinutes: 24,
            distanceKm: 8.5,
            reliabilityScore: 82,
            isPrimary: true,
          },
        ],
        riskZones: [
          {
            id: 'risk_1',
            name: 'High Pedestrian Volume',
            polygon: [
              { lat: -17.827, lng: 31.048 },
              { lat: -17.827, lng: 31.052 },
              { lat: -17.831, lng: 31.052 },
              { lat: -17.831, lng: 31.048 },
            ],
            riskScore: 75,
            severity: 'high',
          },
        ],
        vehicleTraces: [],
      },
    };
  }
}
