import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { DriverLocation } from '../hooks/useFleetData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

const libraries: ("visualization")[] = ["visualization"];

interface FleetMapProps {
  drivers: DriverLocation[];
  selectedDriverId: string | null;
  onSelectDriver: (id: string | null) => void;
  autoZoom?: boolean;
}

export function FleetMap({ drivers, selectedDriverId, onSelectDriver, autoZoom = false }: FleetMapProps) {
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

  // Auto zoom to fit drivers if autoZoom is true
  useEffect(() => {
    if (map && autoZoom && drivers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      drivers.forEach(d => {
        bounds.extend({ lat: d.lat, lng: d.lng });
      });
      map.fitBounds(bounds);
      
      // Don't zoom in too close
      const listener = window.google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom()! > 15) {
          map.setZoom(15);
        }
        window.google.maps.event.removeListener(listener);
      });
    }
  }, [map, autoZoom, drivers]);

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
          To view the fleet map, please add your Google Maps API key in the application settings (VITE_GOOGLE_MAPS_API_KEY).
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
          Google Maps failed to load. Please ensure you have provided a valid Google Maps API Key in the application settings.
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

  const getMarkerIcon = (status: string) => {
    let color = '#94a3b8'; // Offline (slate-400)
    if (status === 'Idle') color = '#22c55e'; // green-500
    if (status === 'Busy') color = '#3b82f6'; // blue-500
    if (status === 'En Route') color = '#eab308'; // yellow-500
    if (status === 'Issue') color = '#ef4444'; // red-500

    return {
      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 1,
      strokeColor: '#ffffff',
      scale: 1.5,
      anchor: new window.google.maps.Point(12, 24),
    };
  };

  const selectedDriver = drivers.find(d => d.id === selectedDriverId);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={selectedDriver ? { lat: selectedDriver.lat, lng: selectedDriver.lng } : center}
      zoom={selectedDriver ? 14 : 12}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        fullscreenControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      }}
    >
      {drivers.map((driver) => (
        <Marker
          key={driver.id}
          position={{ lat: driver.lat, lng: driver.lng }}
          icon={getMarkerIcon(driver.status)}
          onClick={() => onSelectDriver(driver.id)}
        />
      ))}

      {selectedDriver && (
        <InfoWindow
          position={{ lat: selectedDriver.lat, lng: selectedDriver.lng }}
          onCloseClick={() => onSelectDriver(null)}
          options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
        >
          <div className="p-1 min-w-[180px]">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-10 w-10 border border-slate-200">
                <AvatarImage src={selectedDriver.avatarUrl} alt={selectedDriver.name} />
                <AvatarFallback className="bg-slate-100 text-slate-600">
                  {selectedDriver.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-sm text-slate-900 leading-tight">{selectedDriver.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedDriver.id}</p>
              </div>
            </div>
            <div className="space-y-1.5 border-t pt-2">
              <p className="text-xs flex justify-between"><span className="font-medium text-slate-500">Service:</span> <span className="font-medium text-slate-900">{selectedDriver.serviceType}</span></p>
              <p className="text-xs flex justify-between"><span className="font-medium text-slate-500">Status:</span> <span className="font-medium text-slate-900">{selectedDriver.status}</span></p>
              <p className="text-xs flex justify-between"><span className="font-medium text-slate-500">Vehicle:</span> <span className="font-medium text-slate-900">{selectedDriver.vehicle}</span></p>
              {selectedDriver.speed !== undefined && (
                <p className="text-xs flex justify-between"><span className="font-medium text-slate-500">Speed:</span> <span className="font-medium text-blue-600">{selectedDriver.speed} mph</span></p>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
