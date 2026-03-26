// src/pages/operations/roads-management-insights/hooks/useRoadsRouteCompare.ts

import { useCallback, useMemo, useState } from 'react';
import { roadsInsightsService } from '../services/roadsInsights.service';
import type { RouteAnalysisData, RouteSearchInput } from '../types/roadsInsights.types';

export interface UseRoadsRouteCompareResult {
  routeData: RouteAnalysisData | null;
  loading: boolean;
  error: string | null;
  compareRoutes: (input: RouteSearchInput) => Promise<RouteAnalysisData | null>;
  resetRouteCompare: () => void;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'Unable to compare routes right now.';
};

export const useRoadsRouteCompare = (): UseRoadsRouteCompareResult => {
  const [routeData, setRouteData] = useState<RouteAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compareRoutes = useCallback(async (input: RouteSearchInput) => {
    setLoading(true);
    setError(null);

    try {
      const response = await roadsInsightsService.compareRoutes(input);
      setRouteData(response.data);
      return response.data;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetRouteCompare = useCallback(() => {
    setRouteData(null);
    setError(null);
  }, []);

  return useMemo(
    () => ({
      routeData,
      loading,
      error,
      compareRoutes,
      resetRouteCompare,
    }),
    [routeData, loading, error, compareRoutes, resetRouteCompare],
  );
};

export default useRoadsRouteCompare;
