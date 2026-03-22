// src/pages/operations/roads-management-insights/hooks/useRoadsInsightsPage.ts

import { useCallback, useEffect, useMemo, useState } from 'react';
import { roadsInsightsService } from '../services/roadsInsights.service';
import useRoadsMapData from './useRoadsMapData';
import useRoadsRouteCompare from './useRoadsRouteCompare';
import type {
  RoadsAnalyticsResponse,
  RoadsFilters,
  RoadsInsightTabKey,
  RoadsMapLayers,
  RoadsOverviewData,
  RoadsSafetyData,
  RoadsSummaryResponse,
  SavedViewItem,
  RouteSearchInput,
} from '../types/roadsInsights.types';

export interface UseRoadsInsightsPageParams {
  initialFilters: RoadsFilters;
  initialLayers: RoadsMapLayers;
  autoLoad?: boolean;
}

export interface UseRoadsInsightsPageResult {
  filters: RoadsFilters;
  setFilters: React.Dispatch<React.SetStateAction<RoadsFilters>>;
  layers: RoadsMapLayers;
  setLayers: React.Dispatch<React.SetStateAction<RoadsMapLayers>>;
  activeTab: RoadsInsightTabKey;
  setActiveTab: React.Dispatch<React.SetStateAction<RoadsInsightTabKey>>;
  selection: ReturnType<typeof useRoadsMapData>['selection'];
  
  summary: RoadsSummaryResponse | null;
  overview: RoadsOverviewData | undefined;
  safetyData: RoadsSafetyData | null;
  analytics: RoadsAnalyticsResponse | null;
  savedViews: SavedViewItem[];
  
  mapData: ReturnType<typeof useRoadsMapData>['mapData'];
  roadDetails: ReturnType<typeof useRoadsMapData>['roadDetails'];
  routeData: ReturnType<typeof useRoadsRouteCompare>['routeData'];
  
  loadingPage: boolean;
  loadingMap: boolean;
  loadingRoadDetails: boolean;
  loadingRoutes: boolean;
  loadingSavedViews: boolean;
  
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  
  refreshPage: () => Promise<void>;
  refreshSavedViews: () => Promise<void>;
  
  selectRoad: (roadId: string) => Promise<void>;
  selectIncident: (incidentId: string) => void;
  selectRoute: (routeId: string) => void;
  compareRoutes: (input: RouteSearchInput) => Promise<void>;
  resetSelection: () => void;
  
  // Saved View Actions
  createSavedView: (payload: Omit<SavedViewItem, 'id'>) => Promise<void>;
  updateSavedView: (id: string, payload: Partial<Omit<SavedViewItem, 'id'>>) => Promise<void>;
  deleteSavedView: (id: string) => Promise<void>;
  applySavedView: (view: SavedViewItem) => void;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'Something went wrong while loading roads insights.';
};

export const useRoadsInsightsPage = ({
  initialFilters,
  initialLayers,
  autoLoad = true,
}: UseRoadsInsightsPageParams): UseRoadsInsightsPageResult => {
  // --- CORE STATE ---
  const [filters, setFilters] = useState<RoadsFilters>(initialFilters);
  const [layers, setLayers] = useState<RoadsMapLayers>(initialLayers);
  const [activeTab, setActiveTab] = useState<RoadsInsightTabKey>('overview');

  // --- DATA STATE ---
  const [summary, setSummary] = useState<RoadsSummaryResponse | null>(null);
  const [safetyData, setSafetyData] = useState<RoadsSafetyData | null>(null);
  const [analytics, setAnalytics] = useState<RoadsAnalyticsResponse | null>(null);
  const [savedViews, setSavedViews] = useState<SavedViewItem[]>([]);
  
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingSafety, setLoadingSafety] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [loadingSavedViews, setLoadingSavedViews] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- SUBSIDIARY HOOKS ---
  const {
    mapData,
    roadDetails,
    selection,
    loadingMap,
    loadingRoadDetails,
    refreshMap,
    selectRoad,
    selectIncident,
    selectRoute: selectRouteFromMap,
    resetSelection: resetMapSelection,
    error: mapError,
  } = useRoadsMapData({
    filters,
    layers,
    autoLoad,
  });

  const {
    routeData,
    loading: loadingRoutes,
    compareRoutes: performRouteCompare,
    resetRouteCompare,
  } = useRoadsRouteCompare();

  // --- ACTIONS ---
  const loadSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const response = await roadsInsightsService.getSummary(filters);
      setSummary(response);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingSummary(false);
    }
  }, [filters]);

  const loadSafety = useCallback(async () => {
    setLoadingSafety(true);
    try {
      const response = await roadsInsightsService.getSafety(filters);
      setSafetyData(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingSafety(false);
    }
  }, [filters]);

  const loadAnalytics = useCallback(async () => {
    setLoadingAnalytics(true);
    try {
      const response = await roadsInsightsService.getAnalytics(filters);
      setAnalytics(response);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingAnalytics(false);
    }
  }, [filters]);

  const refreshSavedViews = useCallback(async () => {
    setLoadingSavedViews(true);
    try {
      const response = await roadsInsightsService.getSavedViews();
      setSavedViews(response.items ?? []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingSavedViews(false);
    }
  }, []);

  const refreshPage = useCallback(async () => {
    setError(null);
    await Promise.all([
      loadSummary(),
      loadSafety(),
      loadAnalytics(),
      refreshMap(),
      refreshSavedViews(),
    ]);
  }, [loadSummary, loadSafety, loadAnalytics, refreshMap, refreshSavedViews]);

  const compareRoutes = useCallback(async (input: RouteSearchInput) => {
    const data = await performRouteCompare(input);
    if (data) {
      setActiveTab('routes');
    }
  }, [performRouteCompare]);

  const resetSelection = useCallback(() => {
    resetMapSelection();
    resetRouteCompare();
  }, [resetMapSelection, resetRouteCompare]);

  const selectRoute = useCallback((routeId: string) => {
    selectRouteFromMap(routeId);
    setActiveTab('routes');
  }, [selectRouteFromMap]);

  // --- SAVED VIEWS CRUD ---
  const createSavedView = useCallback(async (payload: Omit<SavedViewItem, 'id'>) => {
    try {
      await roadsInsightsService.createSavedView(payload);
      await refreshSavedViews();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [refreshSavedViews]);

  const updateSavedView = useCallback(async (id: string, payload: Partial<Omit<SavedViewItem, 'id'>>) => {
    try {
      await roadsInsightsService.updateSavedView(id, payload);
      await refreshSavedViews();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [refreshSavedViews]);

  const deleteSavedView = useCallback(async (id: string) => {
    try {
      await roadsInsightsService.deleteSavedView(id);
      await refreshSavedViews();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [refreshSavedViews]);

  const applySavedView = useCallback((view: SavedViewItem) => {
    setFilters(view.filters);
    setLayers(view.layers);
    setActiveTab('overview');
    resetSelection();
  }, [resetSelection]);

  // --- EFFECTS ---
  useEffect(() => {
    if (!autoLoad) return;
    loadSummary();
    loadSafety();
    loadAnalytics();
    refreshSavedViews();
  }, [autoLoad, loadSummary, loadSafety, loadAnalytics, refreshSavedViews]);

  useEffect(() => {
    if (mapError) setError(mapError);
  }, [mapError]);

  const loadingPage = useMemo(
    () => loadingSummary || loadingSafety || loadingAnalytics || loadingSavedViews || loadingMap,
    [loadingSummary, loadingSafety, loadingAnalytics, loadingSavedViews, loadingMap]
  );

  return {
    filters,
    setFilters,
    layers,
    setLayers,
    activeTab,
    setActiveTab,
    selection,
    
    summary,
    overview: summary?.overview,
    safetyData,
    analytics,
    savedViews,
    
    mapData,
    roadDetails,
    routeData,
    
    loadingPage,
    loadingMap,
    loadingRoadDetails,
    loadingRoutes,
    loadingSavedViews,
    
    error,
    setError,
    
    refreshPage,
    refreshSavedViews,
    
    selectRoad,
    selectIncident,
    selectRoute,
    compareRoutes,
    resetSelection,
    
    createSavedView,
    updateSavedView,
    deleteSavedView,
    applySavedView,
  };
};

export default useRoadsInsightsPage;
