import { useEffect, useRef, useCallback } from 'react';
import { MarkerClusterer, SuperClusterAlgorithm, Cluster, ClusterStats, Marker, Renderer } from '@googlemaps/markerclusterer';

interface ClusterableMarker {
  lat: number;
  lng: number;
  id: string;
  heading?: number;
  isHandicap?: boolean;
  onClick?: () => void;
}

// Inject pulse animation keyframes once
let pulseInjected = false;
function injectPulseAnimation() {
  if (pulseInjected) return;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes marker-pulse {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.1); }
      100% { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
  pulseInjected = true;
}

class DashDriveClusterRenderer implements Renderer {
  render(cluster: Cluster, stats: ClusterStats, map: google.maps.Map): Marker {
    const { count, position } = cluster;
    // Determine styling based on cluster density
    const size = count > 50 ? 56 : count > 20 ? 48 : 40;
    const color = count > 50 ? '#ef4444' : count > 20 ? '#f59e0b' : '#10b981';
    const bgColor = count > 50 ? 'rgba(239, 68, 68, 0.15)' : count > 20 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)';

    const div = document.createElement('div');
    div.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${bgColor};
      border: 2px solid ${color};
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      cursor: pointer;
      transition: transform 0.2s ease;
    `;
    div.innerHTML = `
      <span style="
        font-size: ${size > 48 ? 15 : 13}px;
        font-weight: 700;
        color: ${color};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      ">${count}</span>
    `;
    div.addEventListener('mouseenter', () => { div.style.transform = 'scale(1.15)'; });
    div.addEventListener('mouseleave', () => { div.style.transform = 'scale(1)'; });

    // Create an AdvancedMarkerElement for the cluster (per official docs)
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position,
      content: div,
      zIndex: 999999 + count,
    });

    return marker;
  }
}

/**
 * Creates an AdvancedMarkerElement with the car marker image for a driver,
 * following the official Google Maps AdvancedMarkerElement pattern.
 */
function createDriverAdvancedMarker(
  driver: ClusterableMarker,
  carMarkerSrc: string,
  carMarkerHandicapSrc: string
): google.maps.marker.AdvancedMarkerElement {
  const container = document.createElement('div');
  container.style.cssText = `
    width: 80px;
    height: 80px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  `;

  // Halo effect
  const halo = document.createElement('div');
  halo.style.cssText = `
    position: absolute;
    width: 50px;
    height: 50px;
    background: rgba(16, 185, 129, 0.15);
    border-radius: 50%;
    border: 2px solid rgba(16, 185, 129, 0.3);
    box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
    animation: marker-pulse 2s infinite;
  `;
  container.appendChild(halo);

  // Car image
  const img = document.createElement('img');
  img.src = driver.isHandicap ? carMarkerHandicapSrc : carMarkerSrc;
  img.alt = 'car';
  img.style.cssText = `
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 6px 15px rgba(0,0,0,0.4));
    transform: rotate(${driver.heading || 0}deg);
    transition: transform 0.5s ease-out;
  `;
  container.appendChild(img);

  // Create AdvancedMarkerElement (per official docs pattern)
  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: { lat: driver.lat, lng: driver.lng },
    content: container,
  });

  // Use the official addListener pattern for click events
  if (driver.onClick) {
    marker.addListener('click', driver.onClick);
  }

  return marker;
}

/**
 * React hook that manages a MarkerClusterer for driver markers on a Google Map.
 * 
 * Follows the official @googlemaps/markerclusterer pattern:
 * 1. Create AdvancedMarkerElement instances with custom content
 * 2. Pass them to MarkerClusterer({ markers, map })
 * 3. Clean up on unmount/driver changes
 * 
 * @param map - The Google Maps map instance (must have mapId set)
 * @param drivers - Array of driver marker data
 * @param carMarkerSrc - URL for normal car marker image
 * @param carMarkerHandicapSrc - URL for handicap car marker image
 * @param enabled - Whether clustering is enabled (disable when tracking a single trip)
 */
export function useMarkerClusterer(
  map: google.maps.Map | null,
  drivers: ClusterableMarker[],
  carMarkerSrc: string,
  carMarkerHandicapSrc: string,
  enabled: boolean = true
) {
  const clustererRef = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    // Ensure the marker library is loaded and we have a valid map
    if (!map || !enabled || !window.google?.maps?.marker?.AdvancedMarkerElement) {
      // Clean up if disabled or not ready
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
        clustererRef.current.setMap(null);
        clustererRef.current = null;
      }
      return;
    }

    // Inject CSS animation for marker halos
    injectPulseAnimation();

    // Step 1: Create AdvancedMarkerElement instances (per official docs)
    const markers = drivers.map(driver =>
      createDriverAdvancedMarker(driver, carMarkerSrc, carMarkerHandicapSrc)
    );

    // Step 2: Add a marker clusterer to manage the markers (per official docs)
    // Always create fresh to avoid stale state
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
      clustererRef.current.setMap(null);
    }

    clustererRef.current = new MarkerClusterer({
      markers,
      map,
      algorithm: new SuperClusterAlgorithm({ radius: 80, maxZoom: 16 }),
      renderer: new DashDriveClusterRenderer(),
    });

    // Cleanup on unmount or when dependencies change
    return () => {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
        clustererRef.current.setMap(null);
        clustererRef.current = null;
      }
    };
  }, [map, drivers, carMarkerSrc, carMarkerHandicapSrc, enabled]);

  return clustererRef;
}

export type { ClusterableMarker };
