// src/pages/operations/roads-management-insights/components/map/RoadsModernMapCanvas.tsx

import React, { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import type {
  RoadsMapData,
  RoadsMapLayers,
  RoadsSelectionState,
} from '../../types/roadsInsights.types';

export interface RoadsModernMapCanvasProps {
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

const LIBRARIES: ("maps" | "marker" | "geometry")[] = ['maps', 'marker', 'geometry'];

const RoadsModernMapCanvas: React.FC<RoadsModernMapCanvasProps> = ({
  apiKey,
  layers,
  selection,
  mapData,
  onRoadSelect,
  onIncidentSelect,
  onRouteSelect,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const mapRef = useRef<any>(null);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !mapData) return;

    const map = mapRef.current?.innerMap || mapRef.current;
    if (!map) return;

    // Clear existing polylines
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    // Render Congestion Polylines
    if (layers.congestion) {
      mapData.roads.forEach(road => {
        const polyline = new google.maps.Polyline({
          path: road.path,
          strokeColor: getCongestionColor(road.congestionLevel),
          strokeWeight: selection.selectedRoadId === road.id ? 8 : 5,
          strokeOpacity: 0.8,
          map: map,
        });

        polyline.addListener('click', () => onRoadSelect(road.id));
        polylinesRef.current.push(polyline);
      });
    }

    // Render Corridors
    if (layers.corridors) {
      mapData.corridors.forEach(corridor => {
        const polyline = new google.maps.Polyline({
          path: corridor.path,
          strokeColor: getCongestionColor(corridor.congestionLevel),
          strokeWeight: 10,
          strokeOpacity: 0.5,
          map: map,
        });
        polylinesRef.current.push(polyline);
      });
    }

    // Render Routes
    if (layers.routeReliability) {
      mapData.routes.forEach(route => {
        const polyline = new google.maps.Polyline({
          path: route.path,
          strokeColor: route.isPrimary ? '#3182ce' : '#805ad5',
          strokeWeight: selection.selectedRouteId === route.id ? 8 : 4,
          strokeOpacity: 0.9,
          map: map,
        });

        polyline.addListener('click', () => onRouteSelect(route.id));
        polylinesRef.current.push(polyline);
      });
    }

    // Traffic Layer
    if (layers.traffic) {
       const trafficLayer = new google.maps.TrafficLayer();
       trafficLayer.setMap(map);
       // We might need to store this to toggle it, but here we redraw on layer change
    }

  }, [isLoaded, mapData, layers, selection]);

  if (!isLoaded) {
    return (
      <div style={{ height: '620px', width: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading Modern Map...
      </div>
    );
  }

  const center = {
    lat: mapData?.center.lat ?? -17.8292,
    lng: mapData?.center.lng ?? 31.0522,
  };

  // Side effect to sync properties that might not work well as attributes in React
  React.useEffect(() => {
    if (mapRef.current) {
      const gmpMap = mapRef.current as any;
      if (mapData?.center) {
        gmpMap.center = mapData.center;
      }
      if (mapData?.zoom) {
        gmpMap.zoom = mapData.zoom;
      }
    }
  }, [mapData]);

  return (
    <div style={{ height: '620px', width: '100%', position: 'relative' }}>
      {/* @ts-ignore */}
      <gmp-map
        ref={mapRef}
        map-id="DEMO_MAP_ID"
        style={{ height: '100%', width: '100%' }}
      >
        {/* Render Incidents as Advanced Markers */}
        {layers.incidents && mapData?.incidents.map(incident => (
          <React.Fragment key={incident.id}>
            {/* @ts-ignore */}
            <gmp-advanced-marker
              position={`${incident.lat},${incident.lng}`}
              title={incident.title}
              onClick={() => onIncidentSelect(incident.id)}
            />
          </React.Fragment>
        ))}
        {/* @ts-ignore */}
        </gmp-map>
    </div>
  );
};

export default RoadsModernMapCanvas;
