// src/pages/operations/roads-management-insights/hooks/useRoadsMapData.ts

import { useCallback, useEffect, useMemo, useState } from 'react';
import { roadsInsightsService } from '../services/roadsInsights.service';
import type {
  RoadDetailsData,
  RoadsFilters,
  RoadsMapData,
  RoadsMapLayers,
  RoadsSelectionState,
  RouteAnalysisData,
  RouteSearchInput,
} from '../types/roadsInsights.types';

export interface UseRoadsMapDataParams {
  filters: RoadsFilters;
  layers: RoadsMapLayers;
  autoLoad?: boolean;
}

export interface UseRoadsMapDataResult {
  mapData: RoadsMapData | null;
  roadDetails: RoadDetailsData | null;
  routeData: RouteAnalysisData | null;
  selection: RoadsSelectionState;
  loadingMap: boolean;
  loadingRoadDetails: boolean;
  loadingRoutes: boolean;
  error: string | null;
  setSelection: React.Dispatch<React.SetStateAction<RoadsSelectionState>>;
  refreshMap: () => Promise<void>;
  selectRoad: (roadId: string) => Promise<void>;
  selectIncident: (incidentId: string) => void;
  selectRoute: (routeId: string) => void;
  compareRoutes: (input: RouteSearchInput) => Promise<void>;
  resetSelection: () => void;
}

const initialSelection: RoadsSelectionState = {
  selectedRoadId: undefined,
  selectedIncidentId: undefined,
  selectedRouteId: undefined,
  selectedCorridorId: undefined,
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'Something went wrong while loading roads data.';
};

export const useRoadsMapData = ({
  filters,
  layers,
  autoLoad = true,
}: UseRoadsMapDataParams): UseRoadsMapDataResult => {
  const [mapData, setMapData] = useState<RoadsMapData | null>(null);
  const [roadDetails, setRoadDetails] = useState<RoadDetailsData | null>(null);
  const [routeData, setRouteData] = useState<RouteAnalysisData | null>(null);
  const [selection, setSelection] = useState<RoadsSelectionState>(initialSelection);

  const [loadingMap, setLoadingMap] = useState(false);
  const [loadingRoadDetails, setLoadingRoadDetails] = useState(false);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshMap = useCallback(async () => {
    setLoadingMap(true);
    setError(null);

    try {
      const response = await roadsInsightsService.getMapData({
        filters,
        layers,
      });
      setMapData(response.mapData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingMap(false);
    }
  }, [filters, layers]);

  const selectRoad = useCallback(async (roadId: string) => {
    setSelection((prev) => ({
      ...prev,
      selectedRoadId: roadId,
      selectedIncidentId: undefined,
    }));

    setLoadingRoadDetails(true);
    setError(null);

    try {
      const response = await roadsInsightsService.getRoadDetails(roadId);
      setRoadDetails(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingRoadDetails(false);
    }
  }, []);

  const selectIncident = useCallback((incidentId: string) => {
    setSelection((prev) => ({
      ...prev,
      selectedIncidentId: incidentId,
    }));
  }, []);

  const selectRoute = useCallback((routeId: string) => {
    setSelection((prev) => ({
      ...prev,
      selectedRouteId: routeId,
    }));
  }, []);

  const compareRoutes = useCallback(async (input: RouteSearchInput) => {
    setLoadingRoutes(true);
    setError(null);

    try {
      const response = await roadsInsightsService.compareRoutes(input);
      setRouteData(response.data);

      if (response.data.recommendedRouteId) {
        setSelection((prev) => ({
          ...prev,
          selectedRouteId: response.data.recommendedRouteId,
        }));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingRoutes(false);
    }
  }, []);

  const resetSelection = useCallback(() => {
    setSelection(initialSelection);
    setRoadDetails(null);
    setRouteData(null);
  }, []);

  useEffect(() => {
    if (!autoLoad) return;
    refreshMap();
  }, [autoLoad, refreshMap]);

  const result = useMemo<UseRoadsMapDataResult>(
    () => ({
      mapData,
      roadDetails,
      routeData,
      selection,
      loadingMap,
      loadingRoadDetails,
      loadingRoutes,
      error,
      setSelection,
      refreshMap,
      selectRoad,
      selectIncident,
      selectRoute,
      compareRoutes,
      resetSelection,
    }),
    [
      mapData,
      roadDetails,
      routeData,
      selection,
      loadingMap,
      loadingRoadDetails,
      loadingRoutes,
      error,
      refreshMap,
      selectRoad,
      selectIncident,
      selectRoute,
      compareRoutes,
      resetSelection,
    ],
  );

  return result;
};

export default useRoadsMapData;
