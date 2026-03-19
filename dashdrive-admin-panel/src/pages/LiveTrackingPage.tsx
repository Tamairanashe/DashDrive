import React, { useState, useEffect, useMemo } from 'react';
import { 
  Typography, Row, Col, Card, Space, Input, Button, Timeline, 
  Tag, Avatar, Badge, message, Divider, Alert, Tooltip, List, Statistic
} from 'antd';
import { 
  SearchOutlined, EnvironmentOutlined, CarOutlined, ShopOutlined, 
  UserOutlined, PhoneOutlined, MessageOutlined, StopOutlined,
  CompassOutlined, SyncOutlined, SwapOutlined, WarningOutlined,
  PlayCircleOutlined, PauseCircleOutlined, ExpandOutlined
} from '@ant-design/icons';
import { MarkerF, InfoWindowF, PolylineF, OverlayViewF, OverlayView } from '@react-google-maps/api';
import { BaseMap, useBaseMap } from '../components/BaseMap';
import carMarker from '../assets/car-marker.png';
import carMarkerHandicap from '../assets/car-marker-handicap.png';

const { Title, Text } = Typography;

const DriverMarker = ({ position, isHandicap }: { position: google.maps.LatLngLiteral, isHandicap?: boolean }) => (
  <OverlayViewF
    position={position}
    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
  >
    <div style={{ 
      transform: 'translate(-50%, -50%)',
      width: '40px', height: '40px', 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <img 
        src={isHandicap ? carMarkerHandicap : carMarker} 
        style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }} 
        alt="car" 
      />
    </div>
  </OverlayViewF>
);

const PickupMarker = ({ position }: { position: google.maps.LatLngLiteral }) => (
  <OverlayViewF
    position={position}
    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
  >
    <div style={{ 
      transform: 'translate(-50%, -50%)',
      width: '24px', height: '24px', background: '#0f172a', border: '2px solid #fff', 
      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)' 
    }}></div>
  </OverlayViewF>
);

const DropoffMarker = ({ position }: { position: google.maps.LatLngLiteral }) => (
  <OverlayViewF
    position={position}
    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
  >
    <div style={{ 
      transform: 'translate(-50%, -50%)',
      width: '24px', height: '24px', background: '#ef4444', border: '2px solid #fff', 
      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)' 
    }}></div>
  </OverlayViewF>
);

const MapFitter = ({ bounds }: { bounds: google.maps.LatLngBoundsLiteral | null }) => {
    const { map } = useBaseMap();
    useEffect(() => {
        if (bounds && map) {
            const googleBounds = new google.maps.LatLngBounds();
            if (Array.isArray(bounds)) {
               // Handle legacy array bounds if passed
            } else {
              // Assume it's handled or we adjust the caller
            }
        }
    }, [bounds, map]);
    return null;
};

// Mock Individual Trip Data
const MOCK_TRIPS = [
    {
        id: 'ORD-2201',
        service: 'Food Delivery',
        status: 'Delivering',
        merchant: { name: 'Pizza Hub CBD', lat: -17.8200, lng: 31.0500 },
        customer: { name: 'John Makoni', phone: '+263 77 123 4567', avatar: 'https://i.pravatar.cc/150?u=1' },
        driver: { id: 'D-201', name: 'Alex T.', phone: '+263 71 987 6543', vehicle: 'Motorcycle', plate: 'AB-123', lat: -17.8220, lng: 31.0520 },
        dropoff: { address: '14 Samora Machel Ave', lat: -17.8300, lng: 31.0600 },
        route: [{lat: -17.8200, lng: 31.0500}, {lat: -17.8210, lng: 31.0510}, {lat: -17.8220, lng: 31.0520}, {lat: -17.8300, lng: 31.0600}],
        timeline: [
            { time: '12:00', event: 'Order created', status: 'success' },
            { time: '12:02', event: 'Restaurant accepted', status: 'success' },
            { time: '12:10', event: 'Food prepared', status: 'success' },
            { time: '12:11', event: 'Driver assigned', status: 'success' },
            { time: '12:12', event: 'Driver picked up at Pizza Hub', status: 'success' },
            { time: '12:15', event: 'In transit to customer (Traffic delay)', status: 'processing', alert: true }
        ],
        alerts: ['Driver stationary for 3 minutes'],
        distance: '4.2 km',
        eta: '12 min',
        elapsed: '16 min'
    },
    {
        id: 'RID-1055',
        service: 'Ride Hailing',
        status: 'In Transit',
        merchant: null,
        customer: { name: 'Sarah Chipo', phone: '+263 73 555 4444', avatar: 'https://i.pravatar.cc/150?u=2' },
        driver: { id: 'D-405', name: 'Mike N.', phone: '+263 77 111 2222', vehicle: 'Toyota Belta', plate: 'AEE-9901', lat: -17.8050, lng: 31.0400 },
        pickup: { address: 'Avondale Shopping Center', lat: -17.8000, lng: 31.0333 },
        dropoff: { address: 'Borrowdale Village', lat: -17.7500, lng: 31.1000 },
        route: [{lat: -17.8000, lng: 31.0333}, {lat: -17.8050, lng: 31.0400}, {lat: -17.7500, lng: 31.1000}],
        timeline: [
            { time: '14:20', event: 'Ride requested', status: 'success' },
            { time: '14:22', event: 'Driver accepted', status: 'success' },
            { time: '14:28', event: 'Driver arrived', status: 'success' },
            { time: '14:30', event: 'Ride started', status: 'success' },
            { time: '14:35', event: 'In transit to Borrowdale', status: 'processing' }
        ],
        alerts: [],
        distance: '8.5 km',
        eta: '18 min',
        elapsed: '5 min'
    }
];

export const LiveTrackingPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTrip, setActiveTrip] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [playbackMode, setPlaybackMode] = useState(false);
    const [showInfoWindow, setShowInfoWindow] = useState<string | null>(null);

    const handleSearch = (value: string) => {
        setLoading(true);
        setTimeout(() => {
            const found = MOCK_TRIPS.find(t => t.id === value.toUpperCase() || t.driver.id === value.toUpperCase() || t.customer.name.toLowerCase().includes(value.toLowerCase()));
            if (found) {
                setActiveTrip(found);
                message.success(`Tracking initiated for ${found.id}`);
            } else {
                setActiveTrip(null);
                message.error('Order/Trip not found or no longer active');
            }
            setLoading(false);
        }, 600);
    };

    // Simulate driver movement on active trip
    useEffect(() => {
        if (!activeTrip || activeTrip.status !== 'Delivering') return;
        const interval = setInterval(() => {
            setActiveTrip(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    driver: {
                        ...prev.driver,
                        lat: prev.driver.lat + (Math.random() - 0.5) * 0.0005,
                        lng: prev.driver.lng + (Math.random() - 0.5) * 0.0005,
                    }
                };
            });
        }, 4000);
        return () => clearInterval(interval);
    }, [activeTrip]);

    const fitBoundsTrigger = useMemo(() => {
        if (!activeTrip) return MOCK_TRIPS.map(t => ({ lat: t.driver.lat, lng: t.driver.lng }));
        const points = [
            { lat: activeTrip.driver.lat, lng: activeTrip.driver.lng },
            { lat: activeTrip.dropoff.lat, lng: activeTrip.dropoff.lng }
        ];
        if (activeTrip.merchant) points.push({ lat: activeTrip.merchant.lat, lng: activeTrip.merchant.lng });
        if (activeTrip.pickup) points.push({ lat: activeTrip.pickup.lat, lng: activeTrip.pickup.lng });
        return points;
    }, [activeTrip]);

    const handleMapLoad = (map: google.maps.Map) => {
        const bounds = new google.maps.LatLngBounds();
        fitBoundsTrigger.forEach(p => bounds.extend(p));
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    };

    return (
        <div style={{ paddingBottom: 24, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Title level={4} style={{ margin: 0 }}>Live Tracking Module</Title>
                    <Text type="secondary">Deep dive into individual trips, orders, and delivery routes.</Text>
                </Col>
                <Col>
                    <Input.Search 
                        placeholder="Search Order ID, Driver ID, Customer..." 
                        style={{ width: 350 }} 
                        size="large"
                        onSearch={handleSearch}
                        loading={loading}
                        enterButton="Track"
                        allowClear
                    />
                </Col>
            </Row>

            <Row gutter={16} style={{ flex: 1, minHeight: 0 }}>
                {/* Main Content Area */}
                <Col span={activeTrip ? 16 : 24} style={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s' }}>
                    
                    {/* Trip Summary Header (Only if selected) */}
                    {activeTrip && (
                        <Card size="small" bordered={false} className="shadow-sm" style={{ marginBottom: 16 }}>
                            <Row align="middle" justify="space-between">
                                <Col>
                                    <Space size="large">
                                        <div>
                                            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Active Order</Text>
                                            <Text strong style={{ fontSize: 16 }}>{activeTrip.id}</Text> <Tag color={activeTrip.service === 'Food Delivery' ? 'orange' : 'blue'}>{activeTrip.service}</Tag>
                                        </div>
                                        <Divider orientation="vertical" style={{ height: 32 }} />
                                        <div>
                                            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Driver</Text>
                                            <Space><CarOutlined /> <Text strong>{activeTrip.driver.name}</Text></Space>
                                        </div>
                                        <div>
                                            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Status</Text>
                                            <Badge status="processing" text={activeTrip.status} />
                                        </div>
                                    </Space>
                                </Col>
                                <Col>
                                    <Space>
                                        <Statistic title="Elapsed" value={activeTrip.elapsed} valueStyle={{ fontSize: 16, color: '#ef4444' }} />
                                        <Statistic title="ETA" value={activeTrip.eta} valueStyle={{ fontSize: 16, color: '#10b981' }} />
                                    </Space>
                                </Col>
                            </Row>
                        </Card>
                    )}

                    {/* Map View - ALWAYS SHOWING */}
                    <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: 0, height: '100%', minHeight: 400, position: 'relative', overflow: 'hidden', flex: 1 }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
                            <BaseMap center={[-17.824858, 31.053028]} zoom={13} onLoad={handleMapLoad}>
                                {activeTrip ? (
                                    <>
                                        <DriverMarker position={{ lat: activeTrip.driver.lat, lng: activeTrip.driver.lng }} />
                                        {(activeTrip.merchant || activeTrip.pickup) && (
                                            <PickupMarker position={{ lat: activeTrip.merchant?.lat || activeTrip.pickup?.lat, lng: activeTrip.merchant?.lng || activeTrip.pickup?.lng }} />
                                        )}
                                        <DropoffMarker position={{ lat: activeTrip.dropoff.lat, lng: activeTrip.dropoff.lng }} />
                                        <PolylineF 
                                            path={activeTrip.route} 
                                            options={{
                                                strokeColor: "#0f172a",
                                                strokeOpacity: activeTrip.status === 'Delivering' ? 0 : 0.6,
                                                strokeWeight: 4,
                                                icons: activeTrip.status === 'Delivering' ? [{
                                                  icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 2 },
                                                  offset: '0',
                                                  repeat: '10px'
                                                }] : undefined
                                            }}
                                        />
                                    </>
                                ) : (
                                    // Show all active trips when none selected
                                    MOCK_TRIPS.map(trip => (
                                        <React.Fragment key={trip.id}>
                                            <MarkerF 
                                                position={{ lat: trip.driver.lat, lng: trip.driver.lng }} 
                                                onClick={() => setShowInfoWindow(trip.id)}
                                                icon={{
                                                    url: trip.id.includes('HANDICAP') ? carMarkerHandicap : carMarker,
                                                    scaledSize: new google.maps.Size(32, 32),
                                                    anchor: new google.maps.Point(16, 16)
                                                }}
                                            />
                                            {showInfoWindow === trip.id && (
                                                <InfoWindowF 
                                                    position={{ lat: trip.driver.lat, lng: trip.driver.lng }}
                                                    onCloseClick={() => setShowInfoWindow(null)}
                                                >
                                                    <div onClick={() => setActiveTrip(trip)} style={{ cursor: 'pointer' }}>
                                                        <strong>{trip.id}</strong><br/>
                                                        Driver: {trip.driver.name}<br/>
                                                        Status: {trip.status}
                                                    </div>
                                                </InfoWindowF>
                                            )}
                                        </React.Fragment>
                                    ))
                                )}
                            </BaseMap>
                        </div>

                        {/* Top Left Tooltip */}
                        {!activeTrip && (
                            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 1000 }}>
                                <Alert 
                                    message="Select a trip on the map or use search to deep dive." 
                                    type="info" 
                                    showIcon 
                                    style={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                            </div>
                        )}

                        {/* Playback Controls Overlay */}
                        {activeTrip && (
                            <div style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 1000, background: 'white', padding: '8px 16px', borderRadius: 32, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                                <Space size="middle">
                                    <Text strong style={{ fontSize: 12 }}>GPS Playback</Text>
                                    {playbackMode ? <PauseCircleOutlined style={{ fontSize: 24, color: '#3b82f6', cursor: 'pointer' }} onClick={() => setPlaybackMode(false)} /> : <PlayCircleOutlined style={{ fontSize: 24, color: '#3b82f6', cursor: 'pointer' }} onClick={() => setPlaybackMode(true)} />}
                                    <Text type="secondary" style={{ fontSize: 12 }}>1x Speed</Text>
                                </Space>
                            </div>
                        )}
                    </Card>
                </Col>

                {/* Info Panel - Only shown when trip selected */}
                {activeTrip && (
                    <Col span={8} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        
                        {activeTrip.alerts.length > 0 && (
                            <Alert 
                                message="Tracking Alert" 
                                description={activeTrip.alerts[0]} 
                                type="error" 
                                showIcon 
                                style={{ marginBottom: 16 }} 
                            />
                        )}

                        <Card title="Trip Timeline" bordered={false} className="shadow-sm" style={{ flex: 1, overflowY: 'auto' }}>
                            <Timeline>
                                {activeTrip.timeline.map((item: any, idx: number) => (
                                    <Timeline.Item key={idx} color={item.status === 'success' ? 'green' : item.alert ? 'red' : 'blue'}>
                                        <Text strong>{item.time}</Text>
                                        <br />
                                        <Text type={item.alert ? 'danger' : 'secondary'}>{item.event}</Text>
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        </Card>

                        <Card title="Admin Action Panel" bordered={false} className="shadow-sm" style={{ marginTop: 16 }}>
                            <Row gutter={[12, 12]}>
                                <Col span={12}>
                                    <Button block icon={<PhoneOutlined />} onClick={() => message.info('Calling Driver...')}>Call Driver</Button>
                                </Col>
                                <Col span={12}>
                                    <Button block icon={<MessageOutlined />} onClick={() => message.info('Calling Customer...')}>Call Customer</Button>
                                </Col>
                                <Col span={24}>
                                    <Button block type="dashed" danger icon={<SwapOutlined />} onClick={() => message.success('Driver assignment revoked & searching for new driver...')}>
                                        Reassign Driver
                                    </Button>
                                </Col>
                                <Col span={24}>
                                    <Button block type="primary" danger icon={<StopOutlined />}>
                                        Cancel Order / Issue Refund
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
};
