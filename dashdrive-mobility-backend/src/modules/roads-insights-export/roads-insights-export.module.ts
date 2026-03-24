import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { RoadsInsightsExportController } from './controller/roads-insights-export.controller';
import { RoadsInsightsExportService } from './services/roads-insights-export.service';
import { RoadsInsightsDirectExportService } from './services/roads-insights-direct-export.service';
import { RoadsInsightsQueuedExportService } from './services/roads-insights-queued-export.service';
import { RoadsInsightsDataAssemblerService } from './services/roads-insights-data-assembler.service';
import { RoadsInsightsMapImageService } from './services/roads-insights-map-image.service';
import { RoadsInsightsStaticMapService } from './services/roads-insights-static-map.service';
import { RoadsInsightsChartImageService } from './services/roads-insights-chart-image.service';
import { RoadsInsightsPdfLayoutService } from './services/roads-insights-pdf-layout.service';
import { RoadsInsightsPdfTableService } from './services/roads-insights-pdf-table.service';
import { RoadsInsightsPdfUiService } from './services/roads-insights-pdf-ui.service';
import { RoadsInsightsPdfBrandingService } from './services/roads-insights-pdf-branding.service';
import { RoadsInsightsPdfSummaryService } from './services/roads-insights-pdf-summary.service';
import { RoadsInsightsExportPolicyService } from './services/roads-insights-export-policy.service';
import { RoadsInsightsFileNamingService } from './services/roads-insights-file-naming.service';
import { RoadsInsightsExportProcessor } from './processors/roads-insights-export.processor';
import { PdfExportRenderer } from './renderers/pdf-export.renderer';
import { CsvExportRenderer } from './renderers/csv-export.renderer';
import { JsonExportRenderer } from './renderers/json-export.renderer';
import { PngExportRenderer } from './renderers/png-export.renderer';
import { ExportJobsRepository } from './repositories/export-jobs.repository';
import { ExportProgressService } from '../exports/progress/export-progress.service';
import { ExportsRealtimeModule } from '../exports/realtime/exports-realtime.module';
import { StorageModule } from '../../providers/storage/storage.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    StorageModule,
    BullModule.registerQueue({
      name: 'roads-insights-export',
    }),
    ExportsRealtimeModule,
  ],
  controllers: [RoadsInsightsExportController],
  providers: [
    RoadsInsightsExportService,
    RoadsInsightsDirectExportService,
    RoadsInsightsQueuedExportService,
    RoadsInsightsDataAssemblerService,
    RoadsInsightsMapImageService,
    RoadsInsightsStaticMapService,
    RoadsInsightsChartImageService,
    RoadsInsightsPdfLayoutService,
    RoadsInsightsPdfTableService,
    RoadsInsightsPdfUiService,
    RoadsInsightsPdfBrandingService,
    RoadsInsightsExportPolicyService,
    RoadsInsightsFileNamingService,
    RoadsInsightsExportProcessor,
    PdfExportRenderer,
    CsvExportRenderer,
    JsonExportRenderer,
    PngExportRenderer,
    ExportJobsRepository,
    ExportProgressService,
    RoadsInsightsPdfSummaryService,
  ],
  exports: [RoadsInsightsExportService],
})
export class RoadsInsightsExportModule {}
