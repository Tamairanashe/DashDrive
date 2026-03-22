// src/pages/operations/roads-management-insights/index.tsx

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Button, Col, Row, Space, message } from 'antd';

import RoadsBottomAnalytics from './components/analytics/RoadsBottomAnalytics';
import SavedViewsDrawer from './components/drawers/SavedViewsDrawer';
import RoadsGlobalFilters from './components/filters/RoadsGlobalFilters';
import RoadsPageHeader from './components/header/RoadsPageHeader';
import RoadsInsightPanel from './components/insight-panel/RoadsInsightPanel';
import RoadsKpiRow from './components/kpis/RoadsKpiRow';
import RoadsMapPanel from './components/map/RoadsMapPanel';
import ExportReportModal, {
  type RoadsExportPayload,
} from './components/modals/ExportReportModal';

import useRoadsInsightsPage from './hooks/useRoadsInsightsPage';
import useMapSnapshot from './hooks/useMapSnapshot';
import { useAuth } from '../../../context/AuthContext';
import { useExportJobProgress } from './hooks/useExportJobProgress';
import { ExportJobsDrawer } from './components/drawers/ExportJobsDrawer';

import { roadsInsightsService } from './services/roadsInsights.service';
import type { RoadsFilters, RoadsMapLayers } from './types/roadsInsights.types';

const defaultFilters: RoadsFilters = {
  mode: 'live',
  cityId: 'harare',
};

const defaultLayers: RoadsMapLayers = {
  traffic: true,
  congestion: true,
  incidents: true,
  speedLimits: false,
  routeReliability: true,
  riskZones: false,
  corridors: true,
  vehicleTraces: false,
};

const downloadBase64File = (
  base64Data: string,
  contentType: string,
  fileName: string,
) => {
  const byteCharacters = atob(base64Data.split(',').pop() ?? base64Data);
  const byteNumbers = new Array(byteCharacters.length)
    .fill(0)
    .map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: contentType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

const RoadsManagementInsightsPage: React.FC = () => {
  const [savedViewsOpen, setSavedViewsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const mapPanelRef = useRef<HTMLDivElement | null>(null);
  const { capturing, captureSnapshot } = useMapSnapshot();
  const { user, token } = useAuth();
  const {
    jobs,
    isDrawerOpen,
    setIsDrawerOpen,
    hydrateJobs,
    removeJob,
  } = useExportJobProgress(user?.id || 'guest', token || undefined);

  // 1) Initial Hydration
  useEffect(() => {
    const initJobs = async () => {
      try {
        const response = await roadsInsightsService.listExportJobs({ limit: 50 });
        if (response.success) {
          hydrateJobs(
            response.items.map((item) => ({
              id: item.jobId,
              module: item.module,
              format: item.fileName?.split('.').pop() || 'unknown',
              status: item.status,
              progress: item.progress,
              stage: item.stage,
              fileName: item.fileName,
              contentType: item.contentType,
              downloadUrl: item.downloadUrl,
              errorCode: item.errorCode,
              errorMessage: item.message,
              createdAt: item.createdAt,
              completedAt: item.completedAt,
            })),
          );
        }
      } catch (err) {
        console.warn('Failed to hydrate export jobs', err);
      }
    };

    if (user?.id) {
      initJobs();
    }
  }, [user?.id, hydrateJobs]);

  // 2) Listen for job completions to show toasts
  const prevJobsRef = useRef<string[]>([]);
  useEffect(() => {
    jobs.forEach((job) => {
      const wasLoaded = prevJobsRef.current.includes(job.id);
      if (wasLoaded) {
        // Find the previous state of this job (if we wanted more granularity)
        // For now, just show toast if it just hit terminal state
      }

      if (job.status === 'completed' && !wasLoaded) {
          message.success(`Export job "${job.fileName || 'Report'}" is ready!`);
      } else if (job.status === 'failed' && !wasLoaded) {
          message.error(`Export job "${job.fileName || 'Report'}" failed.`);
      }
    });

    prevJobsRef.current = jobs.map(j => j.id);
  }, [jobs]);

  const {
    filters,
    setFilters,
    layers,
    setLayers,
    activeTab,
    setActiveTab,
    summary,
    overview,
    safetyData,
    analytics,
    savedViews,
    mapData,
    roadDetails,
    routeData,
    selection,
    loadingPage,
    loadingMap,
    loadingRoadDetails,
    loadingRoutes,
    loadingSavedViews,
    error,
    refreshPage,
    selectRoad,
    selectIncident,
    selectRoute,
    compareRoutes,
    resetSelection,
    createSavedView,
    updateSavedView,
    deleteSavedView,
    applySavedView,
  } = useRoadsInsightsPage({
    initialFilters: defaultFilters,
    initialLayers: defaultLayers,
  });

  const panelLoading = useMemo(
    () => loadingMap || loadingRoadDetails || loadingRoutes,
    [loadingMap, loadingRoadDetails, loadingRoutes],
  );

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setLayers(defaultLayers);
    resetSelection();
    setActiveTab('overview');
  };
 
  const handleRetryExportJob = async (id: string) => {
    try {
      await roadsInsightsService.retryExportJob(id);
      message.success('Export job retry requested.');
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to retry export job.');
    }
  };

  const handleCancelExportJob = async (id: string) => {
    try {
      await roadsInsightsService.cancelExportJob(id);
      message.success('Export job cancellation requested.');
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to cancel export job.');
    }
  };

  const handleCompareRoutes = async () => {
    await compareRoutes({
      origin: 'CBD',
      destination: 'Airport',
      departureTime: new Date().toISOString(),
      serviceType: 'ride_hailing',
      trafficMode: 'traffic_aware_optimal',
      compareAlternates: true,
    });
    setActiveTab('routes');
  };

  const handleExport = async (payload: RoadsExportPayload) => {
    try {
      setExportLoading(true);

      let mapSnapshotBase64: string | undefined;

      if (payload.includeMapSnapshot) {
        mapSnapshotBase64 = (await captureSnapshot(mapPanelRef.current)) ?? undefined;
      }

      const response = await roadsInsightsService.exportReport({
        ...payload,
        filters,
        layers,
        mapSnapshotBase64,
      });

      if (response.mode === 'direct') {
        if (response.downloadUrl) {
          window.open(response.downloadUrl, '_blank', 'noopener,noreferrer');
        } else if (response.fileBase64 && response.contentType && response.fileName) {
          downloadBase64File(response.fileBase64, response.contentType, response.fileName);
        } else {
          throw new Error('Export completed but no file was returned.');
        }
        message.success('Report exported successfully.');
        setExportOpen(false);
        setExportLoading(false);
      } else if (response.mode === 'job' && response.jobId) {
        message.info('Export job started. You will be notified of progress.');
        setIsDrawerOpen(true);
        setExportOpen(false);
        setExportLoading(false);
      }
    } catch (err) {
      message.error(
        err instanceof Error ? err.message : 'Unable to export report right now.',
      );
      setExportLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <RoadsPageHeader
          loading={loadingPage || capturing}
          error={error}
          onRefresh={refreshPage}
          onOpenSavedViews={() => setSavedViewsOpen(true)}
          onOpenExport={() => setExportOpen(true)}
          onOpenExportJobs={() => setIsDrawerOpen(true)}
          exportJobsCount={jobs.filter(j => j.status === 'processing' || j.status === 'queued').length}
        />

        <RoadsGlobalFilters
          filters={filters}
          onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
          onReset={handleResetFilters}
          loading={loadingPage}
          cityOptions={[
            { label: 'Harare', value: 'harare' },
            { label: 'Bulawayo', value: 'bulawayo' },
          ]}
          zoneOptions={[
            { label: 'CBD', value: 'cbd' },
            { label: 'North', value: 'north' },
            { label: 'South', value: 'south' },
            { label: 'Airport', value: 'airport' },
          ]}
        />

        {error ? (
          <Alert
            type="error"
            showIcon
            message="Some roads insights data could not be loaded."
            description={error}
          />
        ) : null}

        <Row gutter={[12, 12]}>
          <Col>
            <Button onClick={handleCompareRoutes} loading={loadingRoutes}>
              Compare Default Routes
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => {
                resetSelection();
                setActiveTab('overview');
              }}
            >
              Reset Selection
            </Button>
          </Col>
        </Row>

        <RoadsKpiRow data={summary?.kpis} loading={loadingPage} />

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={16}>
            <RoadsMapPanel
              ref={mapPanelRef}
              layers={layers}
              selection={selection}
              mapData={mapData ?? undefined}
              loading={loadingMap}
              onLayerToggle={(key, value) =>
                setLayers((prev) => ({ ...prev, [key]: value }))
              }
              onRoadSelect={async (roadId) => {
                await selectRoad(roadId);
                setActiveTab('roadDetails');
              }}
              onIncidentSelect={(incidentId) => {
                selectIncident(incidentId);
              }}
              onRouteSelect={(routeId) => {
                selectRoute(routeId);
                setActiveTab('routes');
              }}
              onResetView={() => {
                resetSelection();
                setActiveTab('overview');
              }}
              onFullscreen={() => {
                message.info('Hook this to your fullscreen map shell.');
              }}
            />
          </Col>

          <Col xs={24} xl={8}>
            <RoadsInsightPanel
              activeTab={activeTab}
              onTabChange={setActiveTab}
              selection={selection}
              overviewData={overview}
              roadDetails={roadDetails}
              routeData={routeData}
              safetyData={safetyData}
              analyticsData={analytics?.panel}
              loading={panelLoading}
            />
          </Col>
        </Row>

        <RoadsBottomAnalytics
          trends={analytics?.trends}
          tables={analytics?.tables}
          loading={loadingPage}
        />
      </Space>

      <SavedViewsDrawer
        open={savedViewsOpen}
        onClose={() => setSavedViewsOpen(false)}
        items={savedViews}
        loading={loadingSavedViews}
        currentFilters={filters}
        currentLayers={layers}
        onApply={(view) => {
          applySavedView(view);
          setSavedViewsOpen(false);
          setActiveTab('overview');
          message.success(`Applied saved view: ${view.name}`);
        }}
        onCreate={async (payload) => {
          await createSavedView(payload);
          message.success('Saved view created.');
        }}
        onUpdate={async (id, payload) => {
          await updateSavedView(id, payload);
          message.success('Saved view updated.');
        }}
        onDelete={async (id) => {
          await deleteSavedView(id);
          message.success('Saved view deleted.');
        }}
      />

      <ExportReportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        loading={exportLoading || capturing}
        filters={filters}
        layers={layers}
        onExport={handleExport}
      />

      <ExportJobsDrawer
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        jobs={jobs}
        onRemoveJob={removeJob}
        onRetryJob={handleRetryExportJob}
        onCancelJob={handleCancelExportJob}
      />
    </div>
  );
};

export default RoadsManagementInsightsPage;
