// src/pages/operations/roads-management-insights/services/roadsInsights.service.ts

import type {
  RoadsAnalyticsResponse,
  RoadsFilters,
  RoadsMapLayers,
  RoadsMapResponse,
  RoadsRoadDetailsResponse,
  RoadsRouteCompareResponse,
  RoadsSafetyResponse,
  RoadsSavedViewsResponse,
  RoadsSummaryResponse,
  RouteSearchInput,
  SavedViewItem,
} from '../types/roadsInsights.types';

const API_BASE =
  (typeof import.meta !== 'undefined' &&
    (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE_URL) ||
  '';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

interface GetMapDataParams {
  filters: RoadsFilters;
  layers: RoadsMapLayers;
}

export interface RoadsExportRequest {
  title: string;
  format: 'pdf' | 'csv' | 'json' | 'png';
  includeMapSnapshot: boolean;
  includeKpis: boolean;
  includeAnalytics: boolean;
  includeTables: boolean;
  includeActiveFilters: boolean;
  includeEnabledLayers: boolean;
  filters: RoadsFilters;
  layers: RoadsMapLayers;
  mapSnapshotBase64?: string;
}

export interface RoadsExportResponse {
  success: boolean;
  mode: 'direct' | 'job';
  jobId?: string;
  status?: string;
  message?: string;
  fileName?: string;
  contentType?: string;
  downloadUrl?: string;
  fileBase64?: string;
}

export interface ExportJobStatus {
  success: boolean;
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  fileName?: string;
  contentType?: string;
  downloadUrl?: string;
  message?: string;
}

export interface RoadsExportJobListItem {
  jobId: string;
  module: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  stage?: string;
  fileName?: string;
  contentType?: string;
  downloadUrl?: string;
  errorCode?: string;
  message?: string;
  createdAt: string;
  completedAt?: string;
}

export interface RoadsExportJobsListResponse {
  success: boolean;
  items: RoadsExportJobListItem[];
}

const buildQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null) {
          searchParams.append(key, String(item));
        }
      });
      return;
    }

    if (typeof value === 'object') {
      searchParams.append(key, JSON.stringify(value));
      return;
    }

    searchParams.append(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

const request = async <T>(
  path: string,
  { method = 'GET', body, signal, headers }: RequestOptions = {},
): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorPayload = (await response.json()) as { message?: string };
      if (errorPayload?.message) message = errorPayload.message;
    } catch {
      // ignore
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
};

export const roadsInsightsService = {
  getSummary: async (
    filters?: RoadsFilters,
    signal?: AbortSignal,
  ): Promise<RoadsSummaryResponse> => {
    const query = filters ? buildQueryString(filters as Record<string, unknown>) : '';
    return request<RoadsSummaryResponse>(`/roads/insights/summary${query}`, { signal });
  },

  getMapData: async (
    params: GetMapDataParams,
    signal?: AbortSignal,
  ): Promise<RoadsMapResponse> => {
    return request<RoadsMapResponse>('/roads/insights/map-data', {
      method: 'POST',
      body: params,
      signal,
    });
  },

  getRoadDetails: async (
    roadId: string,
    signal?: AbortSignal,
  ): Promise<RoadsRoadDetailsResponse> => {
    return request<RoadsRoadDetailsResponse>(
      `/roads/insights/road/${encodeURIComponent(roadId)}`,
      { signal },
    );
  },

  compareRoutes: async (
    input: RouteSearchInput,
    signal?: AbortSignal,
  ): Promise<RoadsRouteCompareResponse> => {
    return request<RoadsRouteCompareResponse>('/roads/insights/routes/compare', {
      method: 'POST',
      body: input,
      signal,
    });
  },

  getSafety: async (
    filters?: RoadsFilters,
    signal?: AbortSignal,
  ): Promise<RoadsSafetyResponse> => {
    const query = filters ? buildQueryString(filters as Record<string, unknown>) : '';
    return request<RoadsSafetyResponse>(`/roads/insights/safety${query}`, { signal });
  },

  getAnalytics: async (
    filters?: RoadsFilters,
    signal?: AbortSignal,
  ): Promise<RoadsAnalyticsResponse> => {
    const query = filters ? buildQueryString(filters as Record<string, unknown>) : '';
    return request<RoadsAnalyticsResponse>(`/roads/insights/analytics${query}`, { signal });
  },

  getSavedViews: async (signal?: AbortSignal): Promise<RoadsSavedViewsResponse> => {
    return request<RoadsSavedViewsResponse>('/roads/insights/saved-views', { signal });
  },

  createSavedView: async (
    payload: Omit<SavedViewItem, 'id'>,
    signal?: AbortSignal,
  ): Promise<SavedViewItem> => {
    return request<SavedViewItem>('/roads/insights/saved-views', {
      method: 'POST',
      body: payload,
      signal,
    });
  },

  updateSavedView: async (
    id: string,
    payload: Partial<Omit<SavedViewItem, 'id'>>,
    signal?: AbortSignal,
  ): Promise<SavedViewItem> => {
    return request<SavedViewItem>(`/roads/insights/saved-views/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: payload,
      signal,
    });
  },

  deleteSavedView: async (id: string, signal?: AbortSignal): Promise<{ success: boolean }> => {
    return request<{ success: boolean }>(
      `/roads/insights/saved-views/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
        signal,
      },
    );
  },

  exportReport: async (
    payload: RoadsExportRequest,
    signal?: AbortSignal,
  ): Promise<RoadsExportResponse> => {
    return request<RoadsExportResponse>('/roads/insights/export', {
      method: 'POST',
      body: payload,
      signal,
    });
  },

  getExportJobStatus: async (jobId: string, signal?: AbortSignal): Promise<ExportJobStatus> => {
    return request<ExportJobStatus>(`/roads/insights/export-jobs/${encodeURIComponent(jobId)}`, {
      signal,
    });
  },

  listExportJobs: async (
    params: {
      limit?: number;
      status?: 'queued' | 'processing' | 'completed' | 'failed';
    } = {},
    signal?: AbortSignal,
  ): Promise<RoadsExportJobsListResponse> => {
    const query = buildQueryString(params);
    return request<RoadsExportJobsListResponse>(`/roads/insights/export-jobs${query}`, { signal });
  },

  retryExportJob: async (jobId: string): Promise<{ success: boolean }> => {
    return request<{ success: boolean }>(`/roads/insights/export-jobs/${encodeURIComponent(jobId)}/retry`, {
      method: 'POST',
    });
  },

  cancelExportJob: async (jobId: string): Promise<{ success: boolean }> => {
    return request<{ success: boolean }>(`/roads/insights/export-jobs/${encodeURIComponent(jobId)}/cancel`, {
      method: 'POST',
    });
  },
};
