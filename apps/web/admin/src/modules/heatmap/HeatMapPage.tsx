// ────────────────────────────────────────────────────────────────
// Heat Map Page — Main Orchestrator
// ────────────────────────────────────────────────────────────────

import { useState, useMemo, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { HeatMapTopBar } from './components/HeatMapTopBar';
import { HeatMapKPIStrip } from './components/HeatMapKPIStrip';
import { HeatMapCanvas } from './components/HeatMapCanvas';
import { HeatMapRightPanel } from './components/HeatMapRightPanel';
import { ZoneDetailsDrawer } from './components/ZoneDetailsDrawer';
import { ComparePanel } from './components/ComparePanel';
import { ApplySurgeModal } from './components/ApplySurgeModal';
import { NotifyFleetModal } from './components/NotifyFleetModal';
import {
  useHeatMapData,
  useHeatMapAlerts,
  useHeatMapKPIs,
  useRecommendedActions,
  useRevenueZones,
  useSupplyResponses,
  generateDriverMarkers,
  generateH3Cells,
  searchZones,
} from './hooks/useHeatMapData';
import type { HeatMapServiceType, HeatMapLayerId, DateRangePreset, LiveMode, HeatMapZone } from './types';

export function HeatMapPage() {
  // ── State ────────────────────────────────────────────────
  const [city, setCity] = useState('harare');
  const [service, setService] = useState<HeatMapServiceType>('All');
  const [layer, setLayer] = useState<HeatMapLayerId>('imbalance');
  const [dateRange, setDateRange] = useState<DateRangePreset>('realtime');
  const [liveMode, setLiveMode] = useState<LiveMode>('live');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Drawer / modal states
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [surgeZoneId, setSurgeZoneId] = useState<string | null>(null);
  const [notifyZoneId, setNotifyZoneId] = useState<string | null>(null);

  // ── Data ─────────────────────────────────────────────────
  const { data: zones = [], isLoading: zonesLoading, refetch } = useHeatMapData(
    liveMode === 'live',
    city,
    service,
    layer,
    searchQuery
  );
  const { data: alerts = [], isLoading: alertsLoading } = useHeatMapAlerts();
  const { data: recommendedActions = [] } = useRecommendedActions();
  const { data: revenueZones = [] } = useRevenueZones();
  const { data: supplyResponses = [] } = useSupplyResponses();

  // ── Derived data ────────────────────────────────────────
  const filteredZones = useMemo(() => {
    let result = zones;
    // Filter by search
    if (searchQuery) {
      result = searchZones(searchQuery, result);
    }
    return result;
  }, [zones, searchQuery]);

  const kpiMetrics = useHeatMapKPIs(filteredZones);

  const driverMarkers = useMemo(() => generateDriverMarkers(filteredZones), [filteredZones]);
  const hexCells = useMemo(() => generateH3Cells(filteredZones, layer), [filteredZones, layer]);

  // Problem zones = sorted by imbalance score
  const problemZones = useMemo(
    () => [...filteredZones].sort((a, b) => b.metrics.imbalanceScore - a.metrics.imbalanceScore),
    [filteredZones]
  );

  // Zone lookups
  const selectedZone = useMemo(
    () => filteredZones.find((z) => z.id === selectedZoneId) || null,
    [filteredZones, selectedZoneId]
  );
  const surgeZone = useMemo(
    () => zones.find((z) => z.id === surgeZoneId) || null,
    [zones, surgeZoneId]
  );
  const notifyZone = useMemo(
    () => zones.find((z) => z.id === notifyZoneId) || null,
    [zones, notifyZoneId]
  );

  // ── Handlers ────────────────────────────────────────────
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 600);
  }, [refetch]);

  const handleFullscreenToggle = useCallback(() => {
    setIsFullscreen((f) => !f);
  }, []);

  const handleZoneSelect = useCallback((zoneId: string) => {
    setSelectedZoneId(zoneId);
  }, []);

  const handleApplySurge = useCallback((zoneId: string) => {
    setSurgeZoneId(zoneId);
  }, []);

  const handleNotifyFleet = useCallback((zoneId: string) => {
    setNotifyZoneId(zoneId);
  }, []);

  const handleOpenFleetView = useCallback((zoneId: string) => {
    // Navigation handled inside components via useNavigationStore
  }, []);

  const isLoading = zonesLoading && zones.length === 0;

  // ── Stale data detection ───────────────────────────────
  const oldestUpdate = useMemo(() => {
    if (filteredZones.length === 0) return null;
    const times = filteredZones.map((z) => new Date(z.lastUpdated).getTime());
    const oldest = Math.min(...times);
    return Date.now() - oldest;
  }, [filteredZones]);

  const isStale = oldestUpdate !== null && oldestUpdate > 30000;

  return (
    <div className={`flex flex-col -m-6 bg-slate-50 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : 'h-[calc(100vh-4rem)]'}`}>

      {/* ── Top Bar ── */}
      <HeatMapTopBar
        city={city}
        onCityChange={setCity}
        service={service}
        onServiceChange={setService}
        layer={layer}
        onLayerChange={setLayer}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        liveMode={liveMode}
        onLiveModeChange={setLiveMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCompareOpen={() => setIsCompareOpen(true)}
        onRefresh={handleRefresh}
        isFullscreen={isFullscreen}
        onFullscreenToggle={handleFullscreenToggle}
        isRefreshing={isRefreshing}
      />

      {/* ── Stale data warning ── */}
      {isStale && liveMode === 'live' && (
        <div className="flex-none bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-800">
            <Badge className="bg-amber-200 text-amber-800 text-[10px] h-4">Stale</Badge>
            Last updated {Math.round((oldestUpdate || 0) / 1000)}s ago — data may be delayed
          </div>
          <button className="text-xs font-medium text-amber-700 hover:text-amber-900 underline" onClick={handleRefresh}>
            Refresh now
          </button>
        </div>
      )}

      {/* ── Search results banner ── */}
      {searchQuery && filteredZones.length === 0 && (
        <div className="flex-none bg-slate-100 border-b border-slate-200 px-4 py-3 text-center">
          <p className="text-sm text-slate-600 font-medium">No zones matched "{searchQuery}"</p>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <span className="text-[10px] text-slate-400">Try:</span>
            {['highest demand', 'low supply', 'CBD', 'surge zones'].map((s) => (
              <button key={s} className="text-[11px] text-blue-600 hover:underline" onClick={() => setSearchQuery(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {searchQuery && filteredZones.length > 0 && filteredZones.length < zones.length && (
        <div className="flex-none bg-blue-50 border-b border-blue-200 px-4 py-1.5 flex items-center justify-between">
          <span className="text-xs text-blue-800">
            Showing {filteredZones.length} zones for "<strong>{searchQuery}</strong>"
          </span>
          <button className="text-xs font-medium text-blue-700 hover:text-blue-900 underline" onClick={() => setSearchQuery('')}>
            Clear search
          </button>
        </div>
      )}

      {/* ── KPI Strip ── */}
      <HeatMapKPIStrip metrics={kpiMetrics} isLoading={isLoading} />

      {/* ── Main Body: Map + Right Panel ── */}
      <div className="flex-1 overflow-hidden grid grid-cols-12 gap-0 relative">
        {/* Map (8 cols) */}
        <div className="col-span-8 relative border-r border-slate-200">
          <HeatMapCanvas
            zones={filteredZones}
            drivers={driverMarkers}
            hexCells={hexCells}
            selectedZoneId={selectedZoneId}
            onZoneSelect={handleZoneSelect}
            activeLayer={layer}
            onLayerChange={setLayer}
            cityId={city}
            isLoading={isLoading}
          />
        </div>

        {/* Right Panel (4 cols) */}
        <div className="col-span-4 overflow-hidden h-full flex flex-col">
          <HeatMapRightPanel
            alerts={alerts}
            problemZones={problemZones}
            recommendedActions={recommendedActions}
            revenueZones={revenueZones}
            supplyResponses={supplyResponses}
            isLoading={isLoading || alertsLoading}
            onZoneOpen={handleZoneSelect}
            onApplySurge={handleApplySurge}
            onNotifyFleet={handleNotifyFleet}
            onOpenFleetView={handleOpenFleetView}
          />
        </div>
      </div>

      {/* ── Zone Details Drawer ── */}
      <ZoneDetailsDrawer
        zone={selectedZone}
        isOpen={!!selectedZoneId}
        onClose={() => setSelectedZoneId(null)}
        onApplySurge={handleApplySurge}
        onNotifyFleet={handleNotifyFleet}
      />

      {/* ── Compare Panel ── */}
      <ComparePanel
        zones={filteredZones}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onZoneHighlight={() => {}}
      />

      {/* ── Apply Surge Modal ── */}
      <ApplySurgeModal
        zone={surgeZone}
        isOpen={!!surgeZoneId}
        onClose={() => setSurgeZoneId(null)}
      />

      {/* ── Notify Fleet Modal ── */}
      <NotifyFleetModal
        zone={notifyZone}
        isOpen={!!notifyZoneId}
        onClose={() => setNotifyZoneId(null)}
      />
    </div>
  );
}
