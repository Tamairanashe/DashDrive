import React from 'react';
import { GoogleMap, MarkerF, PolylineF, PolygonF, useJsApiLoader } from '@react-google-maps/api';
import { cn } from '../utils';

const GOOGLE_MAPS_API_KEY = "AIzaSyCxwlIiOcrI_yBrehP9CKr-CoIoPusShh0";

interface MapPreviewProps {
  type: 'polygon' | 'order-route';
  data: any;
  label?: string;
  status?: 'Active' | 'Inactive';
  variant?: 'mini' | 'standard' | 'contained';
}

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  gestureHandling: 'none',
  styles: [
    {
      featureType: 'poi',
      elementType: 'all',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

const LIBRARIES: ("places" | "geometry")[] = ['places', 'geometry'];

export const MapPreview: React.FC<MapPreviewProps> = ({ type, data, label, status = 'Active', variant = 'standard' }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES
  });

  if (!isLoaded) return <div className="w-full h-full bg-slate-50 animate-pulse rounded-xl" />;

  let content = null;
  let center: google.maps.LatLngLiteral = { lat: 23.8103, lng: 90.4125 }; // Default to Dhaka
  let zoom = 12;

  if (type === 'polygon') {
    const points = Array.isArray(data) ? data : [];
    const paths = points.map(p => Array.isArray(p) ? { lat: p[0], lng: p[1] } : p);
    
    if (paths.length > 0) {
      const lats = paths.map(p => p.lat);
      const lngs = paths.map(p => p.lng);
      center = {
        lat: (Math.min(...lats) + Math.max(...lats)) / 2,
        lng: (Math.min(...lngs) + Math.max(...lngs)) / 2
      };
      zoom = 13;
      content = (
        <PolygonF
          paths={paths}
          options={{
            fillColor: status === 'Active' ? '#00C4B4' : '#64748b',
            fillOpacity: 0.3,
            strokeColor: status === 'Active' ? '#00C4B4' : '#64748b',
            strokeWeight: 2
          }}
        />
      );
    }
  } else if (type === 'order-route') {
    let restaurant = data.restaurant;
    let customer = data.customer;
    
    const start = Array.isArray(restaurant) ? { lat: restaurant[0], lng: restaurant[1] } : 
                  (restaurant && typeof restaurant === 'object' && 'lat' in restaurant ? restaurant : null);
    const end = Array.isArray(customer) ? { lat: customer[0], lng: customer[1] } : 
                (customer && typeof customer === 'object' && 'lat' in customer ? customer : null);

    if (start && end) {
      center = {
        lat: (start.lat + end.lat) / 2,
        lng: (start.lng + end.lng) / 2
      };
      zoom = 14;
      content = (
        <>
          <PolylineF
            path={[start, end]}
            options={{
              strokeColor: '#00C4B4',
              strokeWeight: 3,
              strokeOpacity: 1
            }}
          />
          <MarkerF position={start} label="S" />
          <MarkerF position={end} label="C" />
        </>
      );
    }
  }

  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden border border-slate-100 bg-slate-50",
      variant === 'mini' ? "w-20 h-20" : 
      variant === 'contained' ? "w-full h-full" : "w-full h-full min-h-[150px]"
    )}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={zoom}
        options={mapOptions}
      >
        {content}
      </GoogleMap>
      {label && variant !== 'mini' && (
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-slate-600 shadow-sm border border-slate-100 z-[1000]">
          {label}
        </div>
      )}
    </div>
  );
};