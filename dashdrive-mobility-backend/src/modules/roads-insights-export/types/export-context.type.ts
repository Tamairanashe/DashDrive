// src/modules/roads-insights-export/types/export-context.type.ts

export type RoadsExportContext = {
  meta: {
    title: string;
    format: string;
    generatedAt: string;
    requestedBy: string;
  };
  filters: any | null;
  layers: any | null;
  summary: any | null;
  analytics: any | null;
  tables: any | null;
  mapImage: {
    source: 'client_snapshot' | 'server_render';
    mimeType: string;
    buffer: Buffer;
  } | null;
};
