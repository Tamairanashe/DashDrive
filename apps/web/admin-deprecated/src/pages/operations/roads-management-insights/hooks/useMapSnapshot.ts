// src/pages/operations/roads-management-insights/hooks/useMapSnapshot.ts

import { useCallback, useState } from 'react';

export interface UseMapSnapshotResult {
  capturing: boolean;
  captureSnapshot: (element: HTMLElement | null) => Promise<string | null>;
}

export const useMapSnapshot = (): UseMapSnapshotResult => {
  const [capturing, setCapturing] = useState(false);

  const captureSnapshot = useCallback(async (element: HTMLElement | null) => {
    if (!element) return null;

    setCapturing(true);
    try {
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;

      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        scale: 2,
      });

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Map snapshot capture failed', error);
      return null;
    } finally {
      setCapturing(false);
    }
  }, []);

  return { capturing, captureSnapshot };
};

export default useMapSnapshot;
