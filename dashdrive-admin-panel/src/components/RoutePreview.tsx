import React, { useMemo } from 'react';
import { PolylineF } from '@react-google-maps/api';

interface RoutePreviewProps {
  encodedPolyline: string;
  color?: string;
  weight?: number;
  opacity?: number;
}

/**
 * RoutePreview Component
 * Decodes and renders a Google Maps encoded polyline.
 * Requires 'geometry' library to be loaded in the Google Maps script.
 */
export const RoutePreview: React.FC<RoutePreviewProps> = ({
  encodedPolyline,
  color = '#3b82f6',
  weight = 6,
  opacity = 0.7,
}) => {
  const path = useMemo(() => {
    if (!encodedPolyline || typeof window === 'undefined' || !window.google?.maps?.geometry) {
      return [];
    }
    try {
      return window.google.maps.geometry.encoding.decodePath(encodedPolyline);
    } catch (e) {
      console.error('Failed to decode polyline:', e);
      return [];
    }
  }, [encodedPolyline]);

  if (!path || path.length === 0) return null;

  return (
    <PolylineF
      path={path}
      options={{
        strokeColor: color,
        strokeOpacity: opacity,
        strokeWeight: weight,
        geodesic: true,
      }}
    />
  );
};
