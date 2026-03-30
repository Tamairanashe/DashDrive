// src/modules/exports/progress/export-progress.service.ts

import { Injectable } from '@nestjs/common';

export type ExportStage =
  | 'queued'
  | 'validating'
  | 'assembling_data'
  | 'rendering_map'
  | 'rendering_output'
  | 'uploading'
  | 'finalizing'
  | 'completed'
  | 'failed'
  | 'cancelled';

@Injectable()
export class ExportProgressService {
  private readonly stageWeights: Record<ExportStage, number> = {
    queued: 0,
    validating: 5,
    assembling_data: 20,
    rendering_map: 40,
    rendering_output: 70,
    uploading: 90,
    finalizing: 97,
    completed: 100,
    failed: 100,
    cancelled: 100,
  };

  getProgress(stage: ExportStage): number {
    return this.stageWeights[stage] ?? 0;
  }
}
