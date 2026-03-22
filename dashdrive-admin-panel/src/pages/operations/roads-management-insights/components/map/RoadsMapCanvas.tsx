// src/pages/operations/roads-management-insights/components/map/RoadsMapCanvas.tsx

import React from 'react';
import { PolylineF, TrafficLayerF, CircleF } from '@react-google-maps/api';
import { BaseMap } from '../../../../../components/BaseMap';
import type {
  RoadsMapData,
  RoadsMapLayers,
  RoadsSelectionState,
} from '../../types/roadsInsights.types';

export interface RoadsMapCanvasProps {
  apiKey?: string;
  layers: RoadsMapLayers;
  selection: RoadsSelectionState;
  mapData?: RoadsMapData;
  onRoadSelect: (roadId: string) => void;
  onIncidentSelect: (incidentId: string) => void;
  onRouteSelect: (routeId: string) => void;
}

const getCongestionColor = (level: string) => {
  switch (level) {
    case 'low': return '#22c55e';
    case 'medium': return '#eab308';
    case 'high': return '#f97316';
    case 'critical': return '#ef4444';
    default: return '#94a3b8';
  }
};

const RoadsMapCanvas: React.FC<RoadsMapCanvasProps> = ({
  layers,
  selection,
  mapData,
  onRoadSelect,
  onIncidentSelect,
  onRouteSelect,
}) => {
  return (
    <BaseMap
      center={[mapData?.center.lat ?? -17.8292, mapData?.center.lng ?? 31.0522]}
      zoom={mapData?.zoom ?? 12}
      height="620px"
    >
      {layers.traffic && <TrafficLayerF />}

      {layers.congestion && mapData?.roads.map(road => (
        <PolylineF
          key={road.id}
          path={road.path}
          options={{
            strokeColor: getCongestionColor(road.congestionLevel),
            strokeWeight: selection.selectedRoadId === road.id ? 8 : 5,
            strokeOpacity: 0.8
          }}
          onClick={() => onRoadSelect(road.id)}
        />
      ))}

      {layers.corridors && mapData?.corridors.map(corridor => (
        <PolylineF
          key={corridor.id}
          path={corridor.path}
          options={{
            strokeColor: getCongestionColor(corridor.congestionLevel),
            strokeWeight: 10,
            strokeOpacity: 0.5
          }}
        />
      ))}

      {layers.routeReliability && mapData?.routes.map(route => (
        <PolylineF
          key={route.id}
          path={route.path}
          options={{
            strokeColor: route.isPrimary ? '#3182ce' : '#805ad5',
            strokeWeight: selection.selectedRouteId === route.id ? 8 : 4,
            strokeOpacity: 0.9
          }}
          onClick={() => onRouteSelect(route.id)}
        />
      ))}

      {layers.incidents && mapData?.incidents.map(incident => (
        <CircleF
          key={incident.id}
          center={{ lat: incident.lat, lng: incident.lng }}
          radius={300}
          options={{
            fillColor: incident.severity === 'critical' ? '#ef4444' : '#f97316',
            fillOpacity: 0.4,
            strokeColor: '#fff',
            strokeWeight: 2
          }}
          onClick={() => onIncidentSelect(incident.id)}
        />
      ))}
    </BaseMap>
  );
};

export default RoadsMapCanvas;
