import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface BaseMapProps {
  center: [number, number];
  zoom?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  height?: string | number;
}

/**
 * Functional component to handle map resizing and other global map behaviors
 */
const MapHandlers = () => {
  const map = useMap();
  
  useEffect(() => {
    // Ensure map is correctly sized even if initialized in an invisible container (e.g. tabs)
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
};

export const BaseMap: React.FC<BaseMapProps> = ({ 
  center, 
  zoom = 13, 
  children, 
  style, 
  height = '100%' 
}) => {
  return (
    <div style={{ height, width: '100%', position: 'relative', ...style }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapHandlers />
        {children}
      </MapContainer>
    </div>
  );
};
