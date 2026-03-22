// src/modules/roads-insights-export/processors/roads-insights-export.processor.ts

import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { RoadsInsightsDataAssemblerService } from '../services/roads-insights-data-assembler.service';
import { PdfExportRenderer } from '../renderers/pdf-export.renderer';
import { CsvExportRenderer } from '../renderers/csv-export.renderer';
import { JsonExportRenderer } from '../renderers/json-export.renderer';
import { PngExportRenderer } from '../renderers/png-export.renderer';
import { FileStorageService } from '../../../providers/storage/file-storage.service';
import { ExportJobsRepository } from '../repositories/export-jobs.repository';
import { RoadsInsightsFileNamingService } from '../services/roads-insights-file-naming.service';
import { RoadsExportFormat } from '../dto/roads-export.dto';
import { Logger } from '@nestjs/common';
import { ExportsEventsService } from '../../exports/realtime/exports-events.service';
import { ExportProgressService } from '../../exports/progress/export-progress.service';

const EXPORT_CANCELLED = 'EXPORT_CANCELLED';

@Processor('roads-insights-export')
export class RoadsInsightsExportProcessor extends WorkerHost {
  private readonly logger = new Logger(RoadsInsightsExportProcessor.name);

  constructor(
    private readonly assembler: RoadsInsightsDataAssemblerService,
    private readonly pdfRenderer: PdfExportRenderer,
    private readonly csvRenderer: CsvExportRenderer,
    private readonly jsonRenderer: JsonExportRenderer,
    private readonly pngRenderer: PngExportRenderer,
    private readonly storage: FileStorageService,
    private readonly jobsRepo: ExportJobsRepository,
    private readonly fileNaming: RoadsInsightsFileNamingService,
    private readonly exportsEvents: ExportsEventsService,
    private readonly progress: ExportProgressService,
  ) {
    super();
  }

  async process(job: Job<any>) {
    const { exportJobId, userId, dto } = job.data;

    try {
      await this.ensureNotCancelled(exportJobId);
      await this.jobsRepo.markProcessing(exportJobId, {
        progress: this.progress.getProgress('assembling_data'),
        stage: 'assembling_data',
      });
      this.exportsEvents.emitProgress(userId, {
        jobId: exportJobId,
        module: 'roads_insights',
        progress: this.progress.getProgress('assembling_data'),
        stage: 'assembling_data',
        status: 'processing',
      });
      const context = await this.assembler.assemble(dto, { id: userId });

      await this.ensureNotCancelled(exportJobId);
      await this.jobsRepo.markProcessing(exportJobId, {
        progress: this.progress.getProgress('rendering_output'),
        stage: 'rendering_output',
      });
      this.exportsEvents.emitProgress(userId, {
        jobId: exportJobId,
        module: 'roads_insights',
        progress: this.progress.getProgress('rendering_output'),
        stage: 'rendering_output',
        status: 'processing',
      });
      const rendered = await this.renderByFormat(dto.format, context, dto);

      await this.ensureNotCancelled(exportJobId);
      await this.jobsRepo.markProcessing(exportJobId, {
        progress: this.progress.getProgress('uploading'),
        stage: 'uploading',
      });
      this.exportsEvents.emitProgress(userId, {
        jobId: exportJobId,
        module: 'roads_insights',
        progress: this.progress.getProgress('uploading'),
        stage: 'uploading',
        status: 'processing',
      });
      const fileName = this.fileNaming.buildName(dto);
      const storageResult = await this.storage.putObject({
        fileName,
        contentType: rendered.contentType,
        buffer: rendered.buffer,
      });

      await this.jobsRepo.markCompleted(exportJobId, {
        fileName,
        filePath: storageResult.path,
        contentType: rendered.contentType,
        fileSizeBytes: rendered.buffer.length,
      });

      this.exportsEvents.emitCompleted(userId, {
        jobId: exportJobId,
        module: 'roads_insights',
        status: 'completed',
        progress: 100,
        fileName,
        contentType: rendered.contentType,
        downloadUrl: storageResult.path,
        completedAt: new Date().toISOString(),
      });

      return { exportJobId };
    } catch (err) {
      if (err.message === EXPORT_CANCELLED) {
        this.logger.log(`Export job ${exportJobId} cancelled by user.`);
        return;
      }
      this.logger.error(
        `Export job ${exportJobId} failed: ${err.message}`,
        err.stack,
      );
      throw err; // BullMQ will handle retry if configured
    }
  }

  private async ensureNotCancelled(jobId: string) {
    const job = await this.jobsRepo.findById(jobId);
    if (job?.is_cancelled) {
      throw new Error(EXPORT_CANCELLED);
    }
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job | undefined, err: Error) {
    if (!job?.data?.exportJobId) return;
    const { exportJobId, userId } = job.data;
    await this.jobsRepo.markFailed(exportJobId, {
      errorCode: 'EXPORT_PROCESS_FAILED',
      errorMessage: err.message,
    });
    this.exportsEvents.emitFailed(userId, {
      jobId: exportJobId,
      module: 'roads_insights',
      status: 'failed',
      message: err.message,
    });
  }

  private async renderByFormat(format: RoadsExportFormat, context: any, dto: any) {
    switch (format) {
      case RoadsExportFormat.CSV: return this.csvRenderer.render(context, dto);
      case RoadsExportFormat.JSON: return this.jsonRenderer.render(context, dto);
      case RoadsExportFormat.PNG: return this.pngRenderer.render(context, dto);
      case RoadsExportFormat.PDF:
      default:
        return this.pdfRenderer.render(context, dto);
    }
  }
}
