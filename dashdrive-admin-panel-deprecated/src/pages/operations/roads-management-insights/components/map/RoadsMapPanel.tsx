// src/pages/operations/roads-management-insights/components/map/RoadsMapPanel.tsx

import React, { forwardRef } from 'react';
import { Button, Card, Space, Tag } from 'antd';
import type {
  IncidentMapItem,
  RoadsMapData,
  RoadsMapLayers,
  RoadsSelectionState,
  RouteMapItem,
} from '../../types/roadsInsights.types';
import RoadsModernMapCanvas from './RoadsModernMapCanvas';

export interface RoadsMapPanelProps {
  layers: RoadsMapLayers;
  selection: RoadsSelectionState;
  mapData?: RoadsMapData;
  loading?: boolean;
  onLayerToggle: (key: keyof RoadsMapLayers, value: boolean) => void;
  onRoadSelect: (roadId: string) => void;
  onIncidentSelect: (incidentId: string) => void;
  onRouteSelect: (routeId: string) => void;
  onResetView?: () => void;
  onFullscreen?: () => void;
}

interface RoadsMapToolbarProps {
  layers: RoadsMapLayers;
  onToggle: (key: keyof RoadsMapLayers, value: boolean) => void;
  onResetView?: () => void;
  onFullscreen?: () => void;
}

const RoadsMapToolbar: React.FC<RoadsMapToolbarProps> = ({
  layers,
  onToggle,
  onResetView,
  onFullscreen,
}) => {
  const layerButtons: Array<{ key: keyof RoadsMapLayers; label: string }> = [
    { key: 'traffic', label: 'Traffic' },
    { key: 'congestion', label: 'Congestion' },
    { key: 'incidents', label: 'Incidents' },
    { key: 'speedLimits', label: 'Speed Limits' },
    { key: 'routeReliability', label: 'Route Reliability' },
    { key: 'riskZones', label: 'Risk Zones' },
    { key: 'corridors', label: 'Corridors' },
    { key: 'vehicleTraces', label: 'Vehicle Traces' },
  ];

  return (
    <Space wrap>
      {layerButtons.map((item) => (
        <Button
          key={item.key}
          type={layers[item.key] ? 'primary' : 'default'}
          size="small"
          onClick={() => onToggle(item.key, !layers[item.key])}
        >
          {item.label}
        </Button>
      ))}
      <Button size="small" onClick={onResetView}>
        Reset View
      </Button>
      <Button size="small" onClick={onFullscreen}>
        Fullscreen
      </Button>
    </Space>
  );
};

const RoadsMapLegend: React.FC = () => (
  <Space wrap>
    <Tag color="green">Stable</Tag>
    <Tag color="gold">Moderate</Tag>
    <Tag color="orange">Degraded</Tag>
    <Tag color="red">Critical</Tag>
    <Tag color="blue">Primary Route</Tag>
    <Tag color="purple">Alternate Route</Tag>
    <Tag>Unavailable</Tag>
  </Space>
);

const SelectedRouteCard: React.FC<{ route?: RouteMapItem }> = ({ route }) => {
  if (!route) return null;
  return (
    <Card size="small" title={route.name} style={{ width: 260 }}>
      <p>ETA: {route.etaMinutes} min</p>
      <p>Distance: {route.distanceKm} km</p>
      <p>Reliability: {route.reliabilityScore}/100</p>
      <p>Delay: {route.delayMinutes ?? 0} min</p>
    </Card>
  );
};

const SelectedIncidentCard: React.FC<{ incident?: IncidentMapItem }> = ({ incident }) => {
  if (!incident) return null;
  return (
    <Card size="small" title={incident.title} style={{ width: 260 }}>
      <p>Type: {incident.type}</p>
      <p>Severity: {incident.severity}</p>
      <p>Status: {incident.status}</p>
      <p>Started: {incident.startedAt}</p>
    </Card>
  );
};

const RoadsMapPanel = forwardRef<HTMLDivElement, RoadsMapPanelProps>(({
  layers,
  selection,
  mapData,
  loading = false,
  onLayerToggle,
  onRoadSelect,
  onIncidentSelect,
  onRouteSelect,
  onResetView,
  onFullscreen,
}, ref) => {
  const selectedRoute = mapData?.routes.find((item) => item.id === selection.selectedRouteId);
  const selectedIncident = mapData?.incidents.find(
    (item) => item.id === selection.selectedIncidentId,
  );

  return (
    <Card loading={loading} title="Interactive Map" extra={<RoadsMapLegend />} styles={{ body: { padding: 0 } }}>
      <div style={{ padding: 16, borderBottom: '1px solid #f0f0f0' }}>
        <RoadsMapToolbar
          layers={layers}
          onToggle={onLayerToggle}
          onResetView={onResetView}
          onFullscreen={onFullscreen}
        />
      </div>

      <div ref={ref} style={{ position: 'relative' }}>
        <RoadsModernMapCanvas
          apiKey={(import.meta as unknown as { env: { VITE_GOOGLE_MAPS_API_KEY: string } }).env.VITE_GOOGLE_MAPS_API_KEY}
          mapData={mapData}
          layers={layers}
          selection={selection}
          onRoadSelect={onRoadSelect}
          onIncidentSelect={onIncidentSelect}
          onRouteSelect={onRouteSelect}
        />

        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          <Space orientation="vertical" align="end">
            <Card size="small" style={{ width: 220 }}>
              <p><strong>Center:</strong> {mapData?.center.lat ?? 0}, {mapData?.center.lng ?? 0}</p>
              <p><strong>Zoom:</strong> {mapData?.zoom ?? 0}</p>
              <p><strong>Roads:</strong> {mapData?.roads.length ?? 0}</p>
              <p><strong>Incidents:</strong> {mapData?.incidents.length ?? 0}</p>
              <p><strong>Routes:</strong> {mapData?.routes.length ?? 0}</p>
            </Card>

            <SelectedIncidentCard incident={selectedIncident} />
            <SelectedRouteCard route={selectedRoute} />
          </Space>
        </div>
      </div>
    </Card>
  );
});

RoadsMapPanel.displayName = 'RoadsMapPanel';

export default RoadsMapPanel;
