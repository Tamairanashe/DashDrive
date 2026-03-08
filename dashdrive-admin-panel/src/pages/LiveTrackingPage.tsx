import React, { useState, useEffect } from 'react';
import { 
  Typography, Row, Col, Card, Space, Input, Button, Timeline, 
  Descriptions, Tag, Avatar, Badge, message, Divider, Alert, Tooltip, List, Statistic
} from 'antd';
import { 
  SearchOutlined, EnvironmentOutlined, CarOutlined, ShopOutlined, 
  UserOutlined, PhoneOutlined, MessageOutlined, StopOutlined,
  CompassOutlined, SyncOutlined, SwapOutlined, WarningOutlined,
  PlayCircleOutlined, PauseCircleOutlined, ExpandOutlined
} from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const { Title, Text } = Typography;

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const driverIcon = new L.DivIcon({
    className: 'driver-marker',
    html: `<div style="width: 32px; height: 32px; background: #fff; border: 3px solid #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

const pickupIcon = new L.DivIcon({
    className: 'pickup-marker',
    html: `<div style="width: 24px; height: 24px; background: #0f172a; border: 2px solid #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

const dropoffIcon = new L.DivIcon({
    className: 'dropoff-marker',
    html: `<div style="width: 24px; height: 24px; background: #ef4444; border: 2px solid #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

const MapFitter = ({ bounds }: { bounds: L.LatLngBoundsExpression | null }) => {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
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
        route: [[-17.8200, 31.0500], [-17.8210, 31.0510], [-17.8220, 31.0520], [-17.8300, 31.0600]],
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
        route: [[-17.8000, 31.0333], [-17.8050, 31.0400], [-17.7500, 31.1000]],
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

    const bounds: L.LatLngBoundsExpression | null = activeTrip ? [
        [activeTrip.merchant?.lat || activeTrip.pickup?.lat, activeTrip.merchant?.lng || activeTrip.pickup?.lng],
        [activeTrip.dropoff.lat, activeTrip.dropoff.lng],
        [activeTrip.driver.lat, activeTrip.driver.lng]
    ] : MOCK_TRIPS.map(t => [t.driver.lat, t.driver.lng]);

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
                                        <Divider type="vertical" style={{ height: 32 }} />
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
                            <MapContainer center={[-17.824858, 31.053028]} zoom={13} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
                                
                                <MapFitter bounds={bounds} />

                                {activeTrip ? (
                                    <>
                                        <Marker position={[activeTrip.driver.lat, activeTrip.driver.lng]} icon={driverIcon} zIndexOffset={100} />
                                        {(activeTrip.merchant || activeTrip.pickup) && (
                                            <Marker position={[activeTrip.merchant?.lat || activeTrip.pickup?.lat, activeTrip.merchant?.lng || activeTrip.pickup?.lng]} icon={pickupIcon} />
                                        )}
                                        <Marker position={[activeTrip.dropoff.lat, activeTrip.dropoff.lng]} icon={dropoffIcon} />
                                        <Polyline 
                                            positions={activeTrip.route} 
                                            color="#0f172a" 
                                            weight={4} 
                                            opacity={0.6}
                                            dashArray={activeTrip.status === 'Delivering' ? "10, 10" : ""}
                                        />
                                    </>
                                ) : (
                                    // Show all active trips when none selected
                                    MOCK_TRIPS.map(trip => (
                                        <Marker 
                                            key={trip.id} 
                                            position={[trip.driver.lat, trip.driver.lng]} 
                                            icon={driverIcon}
                                            eventHandlers={{ click: () => setActiveTrip(trip) }}
                                        >
                                            <Popup>
                                                <strong>{trip.id}</strong><br/>
                                                Driver: {trip.driver.name}<br/>
                                                Status: {trip.status}
                                            </Popup>
                                        </Marker>
                                    ))
                                )}
                            </MapContainer>
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
