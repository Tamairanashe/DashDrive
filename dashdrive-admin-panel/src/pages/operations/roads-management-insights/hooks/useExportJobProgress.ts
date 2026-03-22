// src/pages/operations/roads-management-insights/hooks/useExportJobProgress.ts

import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { ExportJobItem, ExportJobEventPayload } from '../types/exportJobs.types';

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001/exports';

export const useExportJobProgress = (userId: string, token?: string) => {
  const [jobs, setJobs] = useState<ExportJobItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const addOrUpdateJob = useCallback((payload: ExportJobEventPayload) => {
    setJobs((prev) => {
      const existingIdx = prev.findIndex((j) => j.id === payload.jobId);
      const updatedJob: ExportJobItem = {
        id: payload.jobId,
        module: payload.module,
        format: payload.fileName?.split('.').pop() || 'unknown',
        status: payload.status,
        progress: payload.progress ?? 0,
        stage: payload.stage,
        fileName: payload.fileName,
        contentType: payload.contentType,
        downloadUrl: payload.downloadUrl,
        errorCode: payload.errorCode,
        errorMessage: payload.message,
        createdAt: payload.createdAt || new Date().toISOString(),
        completedAt: payload.completedAt,
      };

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = { ...next[existingIdx], ...updatedJob };
        return next;
      }
      return [updatedJob, ...prev];
    });
  }, []);

  const hydrateJobs = useCallback((items: ExportJobItem[]) => {
    setJobs(items);
  }, []);

  useEffect(() => {
    if (!userId || !token) return;

    const socket: Socket = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: { token },
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('Connected to exports websocket (authenticated)');
    });

    socket.on('export.queued', (payload: ExportJobEventPayload) => {
      addOrUpdateJob(payload);
      setIsDrawerOpen(true);
    });

    socket.on('export.progress', (payload: ExportJobEventPayload) => {
      addOrUpdateJob(payload);
    });

    socket.on('export.completed', (payload: ExportJobEventPayload) => {
      addOrUpdateJob(payload);
    });

    socket.on('export.failed', (payload: ExportJobEventPayload) => {
      addOrUpdateJob(payload);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, token, addOrUpdateJob]);

  const clearJobs = () => setJobs([]);
  const removeJob = (jobId: string) => setJobs(prev => prev.filter(j => j.id !== jobId));

  return {
    jobs,
    isDrawerOpen,
    setIsDrawerOpen,
    hydrateJobs,
    clearJobs,
    removeJob,
  };
};
