import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { RoadsInsightsExportService } from '../services/roads-insights-export.service';
import { RoadsExportDto } from '../dto/roads-export.dto';
import { FirebaseAuthGuard } from '../../auth/firebase-auth.guard';

/**
 * Quick helper until full auth integration is wired to req.user
 */
const mockCurrentUser = () => ({
  id: 'admin_123',
  email: 'admin@dashdrive.com',
});

@Controller('roads/insights')
@UseGuards(FirebaseAuthGuard)
export class RoadsInsightsExportController {
  constructor(
    private readonly exportService: RoadsInsightsExportService,
  ) {}

  @Post('export')
  async createExport(@Body() dto: RoadsExportDto) {
    return this.exportService.createExport(dto, mockCurrentUser());
  }

  @Get('export-jobs')
  async listExportJobs(
    @Query('limit') limit?: string,
    @Query('status') status?: 'queued' | 'processing' | 'completed' | 'failed',
  ) {
    return this.exportService.listExportJobs(mockCurrentUser(), {
      limit: limit ? Number(limit) : 20,
      status,
    });
  }

  @Get('export-jobs/:jobId')
  async getExportJob(@Param('jobId') jobId: string) {
    return this.exportService.getExportJob(jobId, mockCurrentUser());
  }

  @Post('export-jobs/:jobId/retry')
  async retryExportJob(@Param('jobId') jobId: string) {
    return this.exportService.retryExportJob(jobId, mockCurrentUser());
  }

  @Post('export-jobs/:jobId/cancel')
  async cancelExportJob(@Param('jobId') jobId: string) {
    return this.exportService.cancelExportJob(jobId, mockCurrentUser());
  }

  @Get('export-jobs/:jobId/download') // Corrected path based on original and user intent
  async downloadExport(
    @Param('jobId') jobId: string,
    @Res() res: Response,
  ) {
    return this.exportService.streamExportFile(jobId, mockCurrentUser(), res);
  }
}
