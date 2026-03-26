import { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Polygon, DrawingManager } from '@react-google-maps/api';
import { Zone } from '../hooks/useZones';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

const libraries: ("drawing" | "geometry" | "places" | "visualization")[] = ["drawing", "geometry"];

interface ZoneEditorMapProps {
  zones: Zone[];
  selectedZoneId: string | null;
  onSelectZone: (id: string | null) => void;
  isDrawingMode: boolean;
  onPolygonComplete: (polygon: google.maps.Polygon) => void;
}

export function ZoneEditorMap({ zones, selectedZoneId, onSelectZone, isDrawingMode, onPolygonComplete }: ZoneEditorMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const getZoneColor = (type: string) => {
    switch (type) {
      case 'operational': return '#3b82f6'; // blue
      case 'surge': return '#eab308'; // yellow
      case 'restricted': return '#ef4444'; // red
      case 'priority': return '#8b5cf6'; // purple
      case 'merchant': return '#10b981'; // green
      case 'fleet': return '#f97316'; // orange
      case 'corridor': return '#06b6d4'; // cyan
      default: return '#94a3b8'; // slate
    }
  };

  if (!(import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 p-6 text-center">
        <div className="text-amber-500 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Google Maps API Key Required</h3>
        <p className="text-sm text-slate-500 max-w-md">
          To view the zone map, please add your Google Maps API key in the application settings (VITE_GOOGLE_MAPS_API_KEY).
        </p>
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
        <p className="text-sm text-slate-500 max-w-md">
          Google Maps failed to load. Please ensure you have provided a valid Google Maps API Key.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 animate-pulse">
        <span className="text-slate-500 font-medium">Loading Map...</span>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      }}
    >
      {zones.map(zone => {
        const isSelected = zone.id === selectedZoneId;
        const color = getZoneColor(zone.zoneType);
        
        return (
          <Polygon
            key={zone.id}
            paths={zone.geometry}
            options={{
              fillColor: color,
              fillOpacity: isSelected ? 0.5 : 0.2,
              strokeColor: color,
              strokeOpacity: 1,
              strokeWeight: isSelected ? 3 : 1.5,
              clickable: true,
              editable: isSelected, // Allow editing if selected
              zIndex: isSelected ? 10 : 1,
            }}
            onClick={() => onSelectZone(zone.id)}
          />
        );
      })}

      {isDrawingMode && (
        <DrawingManager
          onPolygonComplete={onPolygonComplete}
          options={{
            drawingControl: false,
            drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
            polygonOptions: {
              fillColor: '#3b82f6',
              fillOpacity: 0.3,
              strokeWeight: 2,
              strokeColor: '#3b82f6',
              clickable: true,
              editable: true,
              zIndex: 100,
            },
          }}
        />
      )}
    </GoogleMap>
  );
}
