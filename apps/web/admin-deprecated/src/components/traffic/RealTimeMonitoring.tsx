import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Typography, Space, Badge, List, Tag, Button, Statistic, Tooltip, App, Slider, FloatButton } from 'antd';
import { 
    InfoCircleOutlined, 
    WarningOutlined, 
    EnvironmentOutlined, 
    SyncOutlined,
    HeatMapOutlined,
    GlobalOutlined,
    RiseOutlined,
    HomeOutlined,
    PlayCircleOutlined
} from '@ant-design/icons';
import { GoogleMap, useJsApiLoader, TrafficLayer, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { PlacesSearch } from '../PlacesSearch';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyCxwlIiOcrI_yBrehP9CKr-CoIoPusShh0";

const { Title, Text, Paragraph } = Typography;

const mapContainerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '16px'
};

const DEFAULT_CENTER = {
    lat: -17.824858,
    lng: 31.053028
};

const MOCK_ALERTS = [
    {
        id: '1',
        type: 'Severe Congestion',
        route: 'Samora Machel Ave',
        location: 'CBD to Eastlea',
        delay: '+8m 12s',
        intensity: '210.5%',
        severity: 'critical'
    },
    {
        id: '2',
        type: 'Road Works',
        route: 'Julius Nyerere Way',
        location: 'Near Africa Unity Square',
        delay: '+5m 43s',
        intensity: '143.3%',
        severity: 'high'
    },
    {
        id: '3',
        type: 'Heavy Traffic',
        route: 'Robert Mugabe Rd',
        location: 'Mbare Musika area',
        delay: '+12m 47s',
        intensity: '315.8%',
        severity: 'critical'
    },
    {
        id: '4',
        type: 'Moderate Delay',
        route: 'Liberation Legacy Way',
        location: 'Enterprise Rd intersection',
        delay: '+3m 21s',
        intensity: '124.4%',
        severity: 'medium'
    }
];

export const RealTimeMonitoring: React.FC = () => {
    const { message } = App.useApp();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<any>(null);

    const [playbackTime, setPlaybackTime] = useState(540); // 9:00 AM in minutes
    const [isPlaying, setIsPlaying] = useState(false);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ['places', 'drawing', 'visualization', 'geometry', 'marker']
    });

    const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

    const onMapLoad = useCallback((map: google.maps.Map) => {
        setMapInstance(map);
    }, []);

    const handlePlaceSelected = (lat: number, lng: number, name: string) => {
        const newCenter = { lat, lng };
        setMapCenter(newCenter);
        if (mapInstance) {
            mapInstance.panTo(newCenter);
            mapInstance.setZoom(15);
        }
    };

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setPlaybackTime(prev => (prev + 1) % 1440);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const formatPlaybackTime = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        const period = h < 12 ? 'AM' : 'PM';
        const displayH = h % 12 || 12;
        return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            message.success('Traffic data updated');
        }, 1000);
    };

    if (!isLoaded) return <div style={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Maps...</div>;

    return (

        <div style={{ position: 'relative' }}>
            <Row gutter={[24, 24]}>
                {/* Left Panel: Overview */}
                <Col xs={24} lg={6}>
                    <Card variant="borderless" style={{ background: '#f8fafc', height: '100%' }}>
                        <Title level={4}>Real-Time Monitoring</Title>
                        <Text type="secondary">Get real-time information on traffic conditions</Text>
                        
                        <div style={{ marginTop: 24 }}>
                            <Paragraph>
                                expected norm, which could indicate accidents, sudden increases in traffic volume, or emerging congestion.
                            </Paragraph>
                            
                            <Space wrap size={[8, 8]} orientation="horizontal">
                                <Tag color="blue">Immediate Awareness</Tag>
                                <Tag color="orange">Data-Driven Decisions</Tag>
                                <Tag color="green">Safety and Efficiency</Tag>
                            </Space>

                            <Paragraph style={{ marginTop: 24 }}>
                                A perfect fit for smart city projects, driving real-time traffic optimization.
                            </Paragraph>
                        </div>

                        <div style={{ marginTop: 40 }}>
                             <Button block type="primary" icon={<HomeOutlined />} style={{ borderRadius: 8 }}>Home</Button>
                        </div>
                    </Card>
                </Col>

                {/* Center: Map */}
                <Col xs={24} lg={12}>
                    <div style={{ position: 'relative' }}>
                        {/* Search Overlay */}
                        <div style={{ 
                            position: 'absolute', 
                            top: 20, 
                            left: 20, 
                            right: 20, 
                            zIndex: 10,
                            maxWidth: '400px'
                        }}>
                             <PlacesSearch onPlaceSelected={handlePlaceSelected} />
                        </div>

                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={mapCenter}
                            zoom={13}
                            onLoad={onMapLoad}
                            options={{
                                disableDefaultUI: false,
                                zoomControl: true,
                            }}
                        >
                            <TrafficLayer />
                            
                            {/* Visual Markers for abnormalities */}
                            {MOCK_ALERTS.map(alert => (
                                <MarkerF 
                                    key={alert.id}
                                    position={{ lat: DEFAULT_CENTER.lat + (Math.random() - 0.5) * 0.05, lng: DEFAULT_CENTER.lng + (Math.random() - 0.5) * 0.05 }}
                                    onClick={() => setSelectedAlert(alert)}
                                    icon={{
                                        path: google.maps.SymbolPath.CIRCLE,
                                        fillColor: alert.severity === 'critical' ? '#ef4444' : '#f59e0b',
                                        fillOpacity: 1,
                                        strokeWeight: 2,
                                        strokeColor: '#fff',
                                        scale: 10
                                    }}
                                />
                            ))}

                            {selectedAlert && (
                                <InfoWindowF
                                    position={{ lat: DEFAULT_CENTER.lat + 0.01, lng: DEFAULT_CENTER.lng + 0.01 }}
                                    onCloseClick={() => setSelectedAlert(null)}
                                >
                                    <div>
                                        <Text strong>{selectedAlert.type}</Text><br/>
                                        <Text style={{ fontSize: '12px' }}>{selectedAlert.location}</Text>
                                    </div>
                                </InfoWindowF>
                            )}
                        </GoogleMap>

                        {/* Map Overlay: Playback Control */}
                        <div style={{ 
                            position: 'absolute', 
                            bottom: 20, 
                            left: '50%', 
                            transform: 'translateX(-50%)',
                            background: 'rgba(255,255,255,0.98)',
                            padding: '12px 24px',
                            borderRadius: '16px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            zIndex: 10,
                            width: '90%',
                            maxWidth: '600px',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                             <Button 
                                type="primary" 
                                shape="circle" 
                                icon={isPlaying ? <SyncOutlined spin /> : <PlayCircleOutlined />} 
                                size="large"
                                onClick={() => setIsPlaying(!isPlaying)}
                                style={{ background: isPlaying ? '#ffc107' : '#1a73e8', border: 'none' }}
                            />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <Text style={{ fontSize: 11, color: '#94a3b8' }}>Showing real-time traffic for Zimbabwe</Text>
                                    <Text strong style={{ fontSize: 12 }}>{formatPlaybackTime(playbackTime)} on Aug 20, 2025</Text>
                                </div>
                                <Slider 
                                    min={0} 
                                    max={1439} 
                                    value={playbackTime} 
                                    onChange={setPlaybackTime}
                                    tooltip={{ formatter: formatPlaybackTime }}
                                    styles={{ track: { background: '#1a73e8' } }}
                                />
                            </div>
                        </div>

                    </div>
                </Col>

                {/* Right Panel: Abnormalities */}
                <Col xs={24} lg={6}>
                    <Card 
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Title level={5} style={{ margin: 0 }}>Detected Abnormalities - Harare</Title>
                                <InfoCircleOutlined style={{ fontSize: 14, color: '#94a3b8' }} />
                            </div>
                        }
                        variant="borderless" 
                        style={{ height: '100%', borderRadius: 16 }}
                    >
                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 16 }}>
                            Key corridors including Samora Machel Ave and Robert Mugabe Rd
                        </Text>
                        
                        <List
                            itemLayout="horizontal"
                            dataSource={MOCK_ALERTS}
                            renderItem={item => (
                                <List.Item 
                                    style={{ 
                                        padding: '12px 0', 
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #f1f5f9'
                                    }}
                                    onClick={() => setSelectedAlert(item)}
                                >
                                    <div style={{ display: 'flex', width: '100%', gap: 12 }}>
                                        <Badge status={item.severity === 'critical' ? 'error' : 'warning'} style={{ marginTop: 8 }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Text strong>{item.type}</Text>
                                                <Text type="danger" style={{ fontSize: 12 }}>{item.intensity}</Text>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Text type="secondary" style={{ fontSize: 11 }}>on {item.route}</Text>
                                                <Text type="secondary" style={{ fontSize: 11 }}>({item.delay})</Text>
                                            </div>
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
