// ────────────────────────────────────────────────────────────────
// Heat Map — Map Canvas (Google Maps + Zone Polygons + Markers)
// ────────────────────────────────────────────────────────────────

import { useState, useCallback, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Polygon, Marker, InfoWindow } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  ZoomIn, ZoomOut, LocateFixed, Tag, Eye, EyeOff, Layers,
} from 'lucide-react';
import { MapLegend } from './MapLegend';
import { LAYER_META } from '../types';
import type { HeatMapZone, HeatMapLayerId, DriverMarker, H3HexCell } from '../types';
import { CITIES } from '../mockData';

const containerStyle = { width: '100%', height: '100%' };
const libraries: ('visualization')[] = ['visualization'];

interface HeatMapCanvasProps {
  zones: HeatMapZone[];
  drivers: DriverMarker[];
  hexCells: H3HexCell[];
  selectedZoneId: string | null;
  onZoneSelect: (zoneId: string) => void;
  activeLayer: HeatMapLayerId;
  onLayerChange: (layer: HeatMapLayerId) => void;
  cityId: string;
  isLoading: boolean;
}

// Color ramp for zone polygons based on intensity
function getZoneColor(zone: HeatMapZone, layer: HeatMapLayerId): { fill: string; stroke: string } {
  let intensity = 0;
  switch (layer) {
    case 'imbalance': intensity = zone.metrics.imbalanceScore / 100; break;
    case 'demand': intensity = Math.min(1, zone.metrics.activeDemand / 350); break;
    case 'supply': intensity = Math.min(1, (zone.metrics.idleSupply + zone.metrics.busySupply) / 150); break;
    case 'eta': intensity = Math.min(1, zone.metrics.avgETA / 15); break;
    case 'cancels': intensity = Math.min(1, zone.metrics.cancelRate / 12); break;
    case 'surge': intensity = zone.metrics.surgeMultiplier ? zone.metrics.surgeMultiplier / 2.5 : 0; break;
    case 'revenue': intensity = Math.min(1, zone.metrics.revenue / 15000); break;
    case 'traffic': intensity = zone.contextInsights.traffic.includes('Heavy') ? 0.9 : zone.contextInsights.traffic.includes('Moderate') ? 0.5 : 0.2; break;
  }

  if (intensity > 0.8) return { fill: '#a855f780', stroke: '#7c3aed' }; // purple / critical
  if (intensity > 0.6) return { fill: '#ef444480', stroke: '#dc2626' }; // red / severe
  if (intensity > 0.4) return { fill: '#f9731680', stroke: '#ea580c' }; // orange / elevated
  if (intensity > 0.2) return { fill: '#eab30880', stroke: '#ca8a04' }; // yellow / rising
  return { fill: '#22c55e60', stroke: '#16a34a' }; // green / healthy
}

function getDriverMarkerColor(status: string) {
  if (status === 'idle') return '#22c55e';
  if (status === 'busy') return '#3b82f6';
  return '#eab308'; // en-route
}

export function HeatMapCanvas({
  zones, drivers, hexCells, selectedZoneId, onZoneSelect,
  activeLayer, onLayerChange, cityId, isLoading,
}: HeatMapCanvasProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showDrivers, setShowDrivers] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [infoZone, setInfoZone] = useState<HeatMapZone | null>(null);

  const cityCenter = useMemo(() => {
    const city = CITIES.find((c) => c.id === cityId);
    return city ? { lat: city.lat, lng: city.lng } : { lat: -17.8252, lng: 31.0335 };
  }, [cityId]);

  const onLoad = useCallback((m: google.maps.Map) => setMap(m), []);
  const onUnmount = useCallback(() => setMap(null), []);

  // Re-center when city changes
  useEffect(() => {
    if (map) {
      map.panTo(cityCenter);
      map.setZoom(13);
    }
  }, [map, cityCenter]);

  // Heat layer via Google Maps visualization
  useEffect(() => {
    if (!map || !isLoaded || !window.google?.maps?.visualization) return;

    const heatData = hexCells.map((cell) => ({
      location: new window.google.maps.LatLng(cell.lat, cell.lng),
      weight: cell.value * 10,
    }));

    const heatLayer = new window.google.maps.visualization.HeatmapLayer({
      data: heatData,
      map,
      radius: 40,
      opacity: 0.6,
      gradient: [
        'rgba(0, 255, 0, 0)',
        'rgba(0, 255, 0, 0.4)',
        'rgba(255, 255, 0, 0.5)',
        'rgba(255, 165, 0, 0.6)',
        'rgba(255, 0, 0, 0.7)',
        'rgba(160, 32, 240, 0.8)',
      ],
    });

    return () => heatLayer.setMap(null);
  }, [map, isLoaded, hexCells]);

  const layerKeys = Object.keys(LAYER_META) as HeatMapLayerId[];

  // Fallback: no API key
  if (!(import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 p-6 text-center">
        <div className="text-amber-500 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Google Maps API Key Required</h3>
        <p className="text-sm text-slate-500 max-w-md">Add VITE_GOOGLE_MAPS_API_KEY to .env</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 p-6 text-center">
        <div className="text-red-500 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Map Loading Error</h3>
        <p className="text-sm text-slate-500">Check your Google Maps API Key.</p>
      </div>
    );
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
          <span className="text-sm font-medium text-slate-500">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={cityCenter}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: true,
          zoomControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          styles: [
            { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
            { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
          ],
        }}
      >
        {/* Zone Polygons */}
        {zones.map((zone) => {
          const colors = getZoneColor(zone, activeLayer);
          const isSelected = selectedZoneId === zone.id;
          const isHovered = hoveredZoneId === zone.id;
          return (
            <Polygon
              key={zone.id}
              paths={zone.polygon}
              options={{
                fillColor: colors.fill.slice(0, 7),
                fillOpacity: isSelected ? 0.7 : isHovered ? 0.55 : 0.35,
                strokeColor: isSelected ? '#1e293b' : colors.stroke,
                strokeWeight: isSelected ? 3 : isHovered ? 2 : 1,
                strokeOpacity: 0.9,
                clickable: true,
              }}
              onClick={() => onZoneSelect(zone.id)}
              onMouseOver={() => setHoveredZoneId(zone.id)}
              onMouseOut={() => setHoveredZoneId(null)}
            />
          );
        })}

        {/* Zone labels */}
        {showLabels && zones.map((zone) => (
          <Marker
            key={`label-${zone.id}`}
            position={{ lat: zone.lat, lng: zone.lng }}
            icon={{
              url: 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>`),
              scaledSize: new window.google.maps.Size(1, 1),
            }}
            label={{
              text: zone.name,
              className: 'font-bold text-[11px] drop-shadow-sm',
              color: '#1e293b',
              fontWeight: 'bold',
              fontSize: '11px',
            }}
            clickable={false}
          />
        ))}

        {/* Surge Badges */}
        {zones.filter((z) => z.metrics.surgeMultiplier).map((zone) => (
          <InfoWindow
            key={`surge-${zone.id}`}
            position={{ lat: zone.lat + 0.006, lng: zone.lng }}
            options={{
              disableAutoPan: true,
              pixelOffset: new window.google.maps.Size(0, -8),
            }}
          >
            <div className="flex items-center gap-1 bg-violet-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg whitespace-nowrap">
              <span>⚡</span> {zone.metrics.surgeMultiplier}x
            </div>
          </InfoWindow>
        ))}

        {/* Alert markers for critical/severe zones */}
        {zones.filter((z) => z.status === 'critical').map((zone) => (
          <Marker
            key={`alert-${zone.id}`}
            position={{ lat: zone.lat - 0.005, lng: zone.lng + 0.005 }}
            icon={{
              path: 'M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z',
              fillColor: '#ef4444',
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: '#ffffff',
              scale: 1.2,
              anchor: new window.google.maps.Point(12, 21),
            }}
            onClick={() => onZoneSelect(zone.id)}
          />
        ))}

        {/* Driver Markers */}
        {showDrivers && drivers.slice(0, 200).map((driver) => (
          <Marker
            key={driver.id}
            position={{ lat: driver.lat, lng: driver.lng }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: getDriverMarkerColor(driver.status),
              fillOpacity: 0.8,
              strokeWeight: 1,
              strokeColor: '#ffffff',
              scale: 5,
            }}
          />
        ))}

        {/* Hovered zone info window */}
        {hoveredZoneId && !selectedZoneId && (() => {
          const zone = zones.find((z) => z.id === hoveredZoneId);
          if (!zone) return null;
          return (
            <InfoWindow
              position={{ lat: zone.lat, lng: zone.lng }}
              options={{ disableAutoPan: true, pixelOffset: new window.google.maps.Size(0, -15) }}
            >
              <div className="p-1 min-w-[160px]">
                <h3 className="font-bold text-sm text-slate-900">{zone.name}</h3>
                <div className="flex gap-3 mt-1 text-[11px]">
                  <span className="text-slate-500">Demand: <strong className="text-slate-900">{zone.metrics.activeDemand}</strong></span>
                  <span className="text-slate-500">Supply: <strong className="text-slate-900">{zone.metrics.idleSupply + zone.metrics.busySupply}</strong></span>
                </div>
                <div className="flex gap-3 mt-0.5 text-[11px]">
                  <span className="text-slate-500">ETA: <strong className="text-slate-900">{zone.metrics.avgETA}m</strong></span>
                  <span className="text-slate-500">Cancel: <strong className="text-rose-600">{zone.metrics.cancelRate}%</strong></span>
                </div>
              </div>
            </InfoWindow>
          );
        })()}
      </GoogleMap>

      {/* ── Floating Layer Toolbar ── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-slate-200 px-1.5 py-1">
        {layerKeys.map((lk) => {
          const meta = LAYER_META[lk];
          const isActive = activeLayer === lk;
          return (
            <button
              key={lk}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                isActive
                  ? 'text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              style={isActive ? { backgroundColor: meta.color } : undefined}
              onClick={() => onLayerChange(lk)}
            >
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* ── Map Utility Controls ── */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-white/90 backdrop-blur-sm shadow-md border-slate-200" onClick={() => map?.setZoom((map.getZoom() || 13) + 1)}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Zoom In</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-white/90 backdrop-blur-sm shadow-md border-slate-200" onClick={() => map?.setZoom((map.getZoom() || 13) - 1)}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Zoom Out</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-white/90 backdrop-blur-sm shadow-md border-slate-200" onClick={() => { map?.panTo(cityCenter); map?.setZoom(13); }}>
                <LocateFixed className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Center City</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className={`h-8 w-8 bg-white/90 backdrop-blur-sm shadow-md border-slate-200 ${showLabels ? '' : 'opacity-50'}`} onClick={() => setShowLabels(!showLabels)}>
                <Tag className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">{showLabels ? 'Hide' : 'Show'} Labels</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className={`h-8 w-8 bg-white/90 backdrop-blur-sm shadow-md border-slate-200 ${showDrivers ? '' : 'opacity-50'}`} onClick={() => setShowDrivers(!showDrivers)}>
                {showDrivers ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">{showDrivers ? 'Hide' : 'Show'} Drivers</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* ── Map Legend ── */}
      <MapLegend layer={activeLayer} />
    </div>
  );
}
