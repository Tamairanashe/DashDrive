import React, { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyCxwlIiOcrI_yBrehP9CKr-CoIoPusShh0";

interface MapContextType {
  map: google.maps.Map | null;
  setMap: (map: google.maps.Map | null) => void;
}

const MapContext = createContext<MapContextType>({ map: null, setMap: () => {} });

export const useBaseMap = () => useContext(MapContext);

interface BaseMapProps {
  center: [number, number];
  zoom?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  height?: string | number;
  onLoad?: (map: google.maps.Map) => void;
}

const LIBRARIES: ("places" | "drawing" | "visualization" | "geometry" | "marker")[] = ['places', 'drawing', 'visualization', 'geometry', 'marker'];

export const BaseMap: React.FC<BaseMapProps> = ({ 
  center, 
  zoom = 13, 
  children, 
  style, 
  height = '100%',
  onLoad: externalOnLoad
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(mapInstance: google.maps.Map) {
    setMap(mapInstance);
    if (externalOnLoad) externalOnLoad(mapInstance);
  }, [externalOnLoad]);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  if (!isLoaded) return <div style={{ height, width: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Maps...</div>;

  return (
    <MapContext.Provider value={{ map, setMap }}>
      <div style={{ height, width: '100%', position: 'relative', ...style }}>
        <GoogleMap
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={{ lat: center[0], lng: center[1] }}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            mapId: 'DEMO_MAP_ID'
          }}
        >
          {children}
        </GoogleMap>
      </div>
    </MapContext.Provider>
  );
};
