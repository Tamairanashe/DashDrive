import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Drawer, Card, Typography, Space, Tag, Spin, Badge, Button, Flex, Divider, Alert } from 'antd';
import {
  CloseOutlined,
  ClockCircleOutlined,
  CarOutlined,
  AimOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { GoogleMap, PolylineF, MarkerF, useJsApiLoader, InfoWindowF } from '@react-google-maps/api';

const { Title, Text } = Typography;

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyCxwlIiOcrI_yBrehP9CKr-CoIoPusShh0";
const LIBRARIES: ("places" | "drawing" | "visualization" | "geometry" | "marker")[] = ['places', 'drawing', 'visualization', 'geometry', 'marker'];

interface RouteData {
  routeIndex: number;
  distanceMeters: number;
  duration: string;
  durationSeconds: number;
  polyline: string;
  fuelLiters?: number;
  fuelGallons?: number;
  estimatedFuelCostUSD?: number;
}

interface RouteMapDrawerProps {
  visible: boolean;
  onClose: () => void;
  origin: { lat: number; lng: number; label?: string } | null;
  destination: { lat: number; lng: number; label?: string } | null;
  tripId?: string;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.round((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs} hr ${mins} min`;
  return `${mins} min`;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

// Route colors
const ROUTE_COLORS = ['#1677ff', '#8c8c8c', '#bfbfbf'];

// Mock fallback for when API isn't available
const MOCK_ROUTES: RouteData[] = [
  { 
    routeIndex: 0, 
    distanceMeters: 12400, 
    duration: '26 min', 
    durationSeconds: 1560, 
    polyline: '', 
    fuelLiters: 1.8, 
    fuelGallons: 0.48, 
    estimatedFuelCostUSD: 1.68 
  },
  { 
    routeIndex: 1, 
    distanceMeters: 14200, 
    duration: '33 min', 
    durationSeconds: 1980, 
    polyline: '', 
    fuelLiters: 2.1, 
    fuelGallons: 0.55, 
    estimatedFuelCostUSD: 1.93 
  },
];

export const RouteMapDrawer: React.FC<RouteMapDrawerProps> = ({ visible, onClose, origin, destination, tripId }) => {
  const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: GOOGLE_MAPS_API_KEY, libraries: LIBRARIES });

  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decodedPaths, setDecodedPaths] = useState<google.maps.LatLngLiteral[][]>([]);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Fetch routes from backend
  const fetchRoutes = useCallback(async () => {
    if (!origin || !destination) return;
    setLoading(true);
    setError(null);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3002';
      const res = await fetch(`${API_BASE}/trips/compute-route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error ${res.status}: ${errorText || 'Internal Server Error'}`);
      }
      const data = await res.json();
      setRoutes(data.allRoutes || []);
      setSelectedRoute(0);
    } catch (err: any) {
      console.warn('Routes API unavailable, using mock data:', err.message);
      setError(`Live routes unavailable: ${err.message}`);
      setRoutes(MOCK_ROUTES);
    } finally {
      setLoading(false);
    }
  }, [origin, destination]);

  useEffect(() => {
    if (visible && origin && destination) {
      fetchRoutes();
    }
  }, [visible, fetchRoutes]);

  // Decode polylines when routes change
  useEffect(() => {
    if (!isLoaded || routes.length === 0 || !window.google) return;
    
    try {
      const paths = routes.map(r => {
        if (r.polyline && window.google.maps.geometry) {
          const decoded = window.google.maps.geometry.encoding.decodePath(r.polyline);
          return decoded.map(p => ({ lat: p.lat(), lng: p.lng() }));
        }
        
        // Fallback: straight line ONLY if geometry decoding fails or polyline is missing
        if (origin && destination) {
          return [
            { lat: origin.lat, lng: origin.lng },
            { lat: destination.lat, lng: destination.lng },
          ];
        }
        return [];
      });
      setDecodedPaths(paths);
    } catch (err) {
      console.error('Error decoding polyline:', err);
    }
  }, [routes, isLoaded, origin, destination]);

  // Fit map bounds
  useEffect(() => {
    if (!mapRef.current || !isLoaded || !origin || !destination) return;
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(origin);
    bounds.extend(destination);
    decodedPaths.forEach(path => path.forEach(p => bounds.extend(p)));
    if (!bounds.isEmpty()) {
       mapRef.current.fitBounds(bounds, { top: 80, bottom: 200, left: 60, right: 60 });
    }
  }, [decodedPaths, isLoaded, origin, destination]);

  if (!origin || !destination) return null;

  const center = { lat: (origin.lat + destination.lat) / 2, lng: (origin.lng + destination.lng) / 2 };
  const activeRoute = routes[selectedRoute];

  const drawerTitle = (
    <Flex align="center" gap={12}>
      <AimOutlined style={{ fontSize: 18, color: '#1677ff' }} />
      <div>
        <Title level={5} style={{ margin: 0 }}>Route Analysis</Title>
        <Text type="secondary" style={{ fontSize: 11 }}>{tripId ? `Trip #${tripId}` : 'Live Route Computation'}</Text>
      </div>
    </Flex>
  );

  return (
    <>
    <Drawer
      title={drawerTitle}
      placement="right"
      onClose={onClose}
      open={visible}
      size="large"
      closeIcon={<CloseOutlined />}
      styles={{
        body: { padding: 0, position: 'relative', height: '100%' },
        footer: { padding: '12px 20px', borderTop: '1px solid #f0f0f0' },
      }}
      footer={
        activeRoute && (
          <Flex justify="space-between" align="center">
            <Space size="large">
              <Space direction="vertical" size={0}>
                <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Distance</Text>
                <Text strong>{formatDistance(activeRoute.distanceMeters)}</Text>
              </Space>
              <Space direction="vertical" size={0}>
                <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Duration</Text>
                <Text strong>{formatDuration(activeRoute.durationSeconds)}</Text>
              </Space>
              <Space direction="vertical" size={0}>
                <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Fuel Est.</Text>
                <Text strong style={{ color: '#52c41a' }}>{activeRoute.fuelGallons} gal · ${activeRoute.estimatedFuelCostUSD}</Text>
              </Space>
            </Space>
            <Tag color={selectedRoute === 0 ? 'blue' : 'default'}>
              {selectedRoute === 0 ? 'Primary Route' : `Alternative ${selectedRoute}`}
            </Tag>
          </Flex>
        )
      }
    >
      {/* Map Area — fills all available space */}
      <div style={{ height: 'calc(100% - 140px)', position: 'relative' }}>
        {loading && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.8)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spin description="Computing routes..." size="large" />
          </div>
        )}

        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={13}
            onLoad={(map) => { mapRef.current = map; }}
            options={{
              disableDefaultUI: false,
              zoomControl: true,
              mapTypeControl: true,
              streetViewControl: false,
              fullscreenControl: true,
              scaleControl: true,
              rotateControl: false,
              mapId: 'ROUTE_MAP',
            }}
          >
            {/* Render alternative routes first (behind) */}
            {decodedPaths.map((path, i) => i !== selectedRoute && (
              <PolylineF
                key={`route-${i}`}
                path={path}
                options={{
                  strokeColor: ROUTE_COLORS[Math.min(i, ROUTE_COLORS.length - 1)],
                  strokeWeight: 3,
                  strokeOpacity: 0.4,
                  clickable: true,
                }}
                onClick={() => setSelectedRoute(i)}
              />
            ))}

            {/* Primary/selected route on top */}
            {decodedPaths[selectedRoute] && (
              <PolylineF
                key={`route-selected-${selectedRoute}`}
                path={decodedPaths[selectedRoute]}
                options={{
                  strokeColor: '#1677ff',
                  strokeWeight: 5,
                  strokeOpacity: 1,
                }}
              />
            )}

            {/* Origin marker */}
            <MarkerF
              position={origin}
              label={{ text: 'A', color: '#fff', fontWeight: 'bold' }}
            />

            {/* Destination marker */}
            <MarkerF
              position={destination}
              label={{ text: 'B', color: '#fff', fontWeight: 'bold' }}
            />

            {/* Info bubble at midpoint of selected route */}
            {activeRoute && decodedPaths[selectedRoute] && decodedPaths[selectedRoute].length > 0 && (
              <InfoWindowF
                position={decodedPaths[selectedRoute][Math.floor(decodedPaths[selectedRoute].length / 2)]}
                options={{ disableAutoPan: true }}
              >
                <div style={{ padding: '4px 8px', minWidth: 120 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#1677ff' }}>{formatDuration(activeRoute.durationSeconds)}</div>
                  <div style={{ fontSize: 11, color: '#8c8c8c' }}>{formatDistance(activeRoute.distanceMeters)}</div>
                  {activeRoute.fuelGallons != null && (
                    <div style={{ fontSize: 11, color: '#52c41a', marginTop: 2 }}>⛽ {activeRoute.fuelGallons} gal · ${activeRoute.estimatedFuelCostUSD}</div>
                  )}
                </div>
              </InfoWindowF>
            )}
          </GoogleMap>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
            <Spin tip="Loading map..." />
          </div>
        )}
      </div>

      {/* Route Selector Cards */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa', overflowX: 'auto' }}>
        {error && <Alert title={error} type="warning" showIcon closable style={{ marginBottom: 8 }} />}

        <Flex gap={10}>
          {routes.map((route, i) => (
            <Card
              key={i}
              size="small"
              hoverable
              onClick={() => setSelectedRoute(i)}
              style={{
                minWidth: 180,
                cursor: 'pointer',
                border: selectedRoute === i ? '2px solid #1677ff' : '1px solid #e8e8e8',
                borderRadius: 12,
                background: selectedRoute === i ? '#f0f5ff' : '#fff',
              }}
              styles={{ body: { padding: '10px 14px' } }}
            >
              <Flex justify="space-between" align="center" style={{ marginBottom: 6 }}>
                <Badge color={i === 0 ? '#1677ff' : '#8c8c8c'} text={<Text strong style={{ fontSize: 11 }}>{i === 0 ? 'Fastest' : `Alt ${i}`}</Text>} />
                {i === 0 && <Tag color="blue" style={{ fontSize: 9, padding: '0 4px', margin: 0 }}>Recommended</Tag>}
              </Flex>
              <Flex gap={16}>
                <Space size={4} direction="vertical">
                  <Text type="secondary" style={{ fontSize: 10 }}><ClockCircleOutlined /> Time</Text>
                  <Text strong style={{ fontSize: 13 }}>{formatDuration(route.durationSeconds)}</Text>
                </Space>
                <Space size={4} direction="vertical">
                  <Text type="secondary" style={{ fontSize: 10 }}><CarOutlined /> Dist</Text>
                  <Text strong style={{ fontSize: 13 }}>{formatDistance(route.distanceMeters)}</Text>
                </Space>
                {route.estimatedFuelCostUSD != null && (
                  <Space size={4} orientation="vertical">
                    <Text type="secondary" style={{ fontSize: 10 }}><FireOutlined /> Fuel</Text>
                    <Text strong style={{ fontSize: 13, color: '#52c41a' }}>${route.estimatedFuelCostUSD}</Text>
                  </Space>
                )}
              </Flex>
            </Card>
          ))}
        </Flex>
      </div>
    </Drawer>
    </>
  );
};
