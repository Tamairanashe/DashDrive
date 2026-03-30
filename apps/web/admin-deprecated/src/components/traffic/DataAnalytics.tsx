import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Space, Tag, List, Badge, Button, Progress, Statistic, Slider, Segmented } from 'antd';
import { 
    AreaChartOutlined, 
    BarChartOutlined, 
    CalendarOutlined,
    PlayCircleOutlined,
    InfoCircleOutlined,
    HomeOutlined,
    SyncOutlined
} from '@ant-design/icons';
import { GoogleMap, PolylineF, HeatmapLayerF } from '@react-google-maps/api';

const { Title, Text, Paragraph } = Typography;

const mapContainerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '16px'
};

const center = {
    lat: -17.824858,
    lng: 31.053028
};

const MOCK_HISTORICAL_ROUTES = [
    { id: '1', name: 'Route ROUTE-10', delay: '+83s', percent: '829%', severity: 'critical' },
    { id: '2', name: 'Route 71564C85', delay: '+107s', percent: '821%', severity: 'critical' },
    { id: '3', name: 'Route ROUTE-27', delay: '+69s', percent: '686%', severity: 'high' },
    { id: '4', name: 'Route ROUTE-67', delay: '+183s', percent: '446%', severity: 'high' },
    { id: '5', name: 'Route 6D6C897A', delay: '+30s', percent: '423%', severity: 'medium' },
    { id: '6', name: 'Route ROUTE-96', delay: '+175s', percent: '398%', severity: 'medium' },
];

export const DataAnalytics: React.FC = () => {
    const [playbackTime, setPlaybackTime] = useState(1020); // 5:00 PM in minutes
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setPlaybackTime(prev => (prev + 10) % 1440);
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

    return (
        <div style={{ position: 'relative' }}>
            <Row gutter={[24, 24]}>
                {/* Left Panel: Urban Planning Metrics */}
                <Col xs={24} lg={6}>
                    <Card variant="borderless" style={{ background: '#f8fafc', height: '100%', borderRadius: 16 }}>
                        <Title level={4} style={{ marginBottom: 4 }}>Data Analytics</Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>Urban Planning & Congestion Analysis</Text>
                        
                        <div style={{ marginTop: 24 }}>
                            <Paragraph style={{ fontSize: 13, color: '#64748b' }}>
                                Pinpoint recurring congestion hotspots to guide infrastructure improvements and targeted traffic management strategies.
                            </Paragraph>
                            
                            <Space wrap size={[8, 8]} style={{ marginBottom: 24 }}>
                                <Tag color="blue" style={{ borderRadius: 12, padding: '2px 10px' }}>Urban Planning</Tag>
                                <Tag color="orange" style={{ borderRadius: 12, padding: '2px 10px' }}>Congestion Reduction</Tag>
                                <Tag color="green" style={{ borderRadius: 12, padding: '2px 10px' }}>Sustainable Mobility</Tag>
                            </Space>

                            <div style={{ background: 'white', padding: 16, borderRadius: 12, marginBottom: 16, border: '1px solid #f1f5f9' }}>
                                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Network Performance</Text>
                                <Progress percent={64} size="small" status="active" strokeColor={{ '0%': '#10b981', '100%': '#3b82f6' }} />
                                <Text type="secondary" style={{ fontSize: 10 }}>Overall mobility index</Text>
                            </div>

                            <Card size="small" style={{ borderRadius: 12, border: '1px solid #f1f5f9' }}>
                                <Statistic title="HOTSPOT DENSITY" value={42} suffix="%" valueStyle={{ color: '#ef4444', fontSize: 20 }} />
                                <Text type="secondary" style={{ fontSize: 11 }}>+12% from last month</Text>
                            </Card>
                        </div>

                        <div style={{ marginTop: 40 }}>
                             <Button block icon={<HomeOutlined />} style={{ borderRadius: 8 }}>Home</Button>
                        </div>
                    </Card>
                </Col>

                {/* Center: Map with Historical Data Playback */}
                <Col xs={24} lg={12}>
                    <div style={{ position: 'relative' }}>
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={center}
                            zoom={13}
                            options={{
                                styles: [
                                    {
                                        featureType: 'all',
                                        elementType: 'labels.text.fill',
                                        stylers: [{ color: '#64748b' }]
                                    }
                                ]
                            }}
                        >
                            {/* Heatmap Layer Simulation */}
                            <HeatmapLayerF 
                                data={[
                                    {location: new google.maps.LatLng(-17.825, 31.052), weight: 3},
                                    {location: new google.maps.LatLng(-17.828, 31.055), weight: 2},
                                    {location: new google.maps.LatLng(-17.830, 31.060), weight: 4},
                                    {location: new google.maps.LatLng(-17.820, 31.045), weight: 5},
                                    {location: new google.maps.LatLng(-17.835, 31.070), weight: 2},
                                ]}
                                options={{ radius: 20, opacity: 0.6 }}
                            />

                            {/* Mock Historical Traffic Lines */}
                            <PolylineF 
                                path={[{lat: -17.82, lng: 31.04}, {lat: -17.83, lng: 31.05}, {lat: -17.84, lng: 31.06}]}
                                options={{ strokeColor: '#ef4444', strokeWeight: 6, strokeOpacity: 0.8 }}
                            />
                            <PolylineF 
                                path={[{lat: -17.81, lng: 31.03}, {lat: -17.82, lng: 31.04}, {lat: -17.815, lng: 31.05}]}
                                options={{ strokeColor: '#f59e0b', strokeWeight: 6, strokeOpacity: 0.8 }}
                            />
                        </GoogleMap>
                        
                        {/* Playback Control Overlay */}
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
                            minWidth: '450px',
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
                                <Text style={{ fontSize: 11, color: '#94a3b8', display: 'block' }}>Historical traffic data from Sep 24-Oct 7</Text>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text strong style={{ fontSize: 13 }}>Wednesdays between 5 PM to 7 PM</Text>
                                    <Text type="secondary" style={{ fontSize: 11 }}>{formatPlaybackTime(playbackTime)}</Text>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>

                {/* Right Panel: Historical Comparison */}
                <Col xs={24} lg={6}>
                    <Card 
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Title level={5} style={{ margin: 0 }}>Historical Analysis - Harare</Title>
                                <InfoCircleOutlined style={{ fontSize: 14, color: '#94a3b8' }} />
                            </div>
                        }
                        variant="borderless" 
                        style={{ height: '100%', borderRadius: 16 }}
                    >
                        <Segmented 
                            block 
                            options={['Weekdays vs Weekends', 'Last Week vs This Week']} 
                            style={{ marginBottom: 16, fontSize: '11px' }}
                        />
                        
                        <Row gutter={16} style={{ marginBottom: 24 }}>
                            <Col span={12}>
                                <Statistic title="AVERAGE DELAY" value={56.9} suffix="%" valueStyle={{ color: '#ef4444', fontSize: 18 }} />
                                <Text type="secondary" style={{ fontSize: 10 }}>Peak hours only</Text>
                            </Col>
                            <Col span={12}>
                                <Statistic title="HOTSPOTS" value={264} valueStyle={{ color: '#ef4444', fontSize: 18 }} />
                                <Text type="secondary" style={{ fontSize: 10 }}>Identified nodes</Text>
                            </Col>
                        </Row>

                        <List
                            itemLayout="horizontal"
                            dataSource={MOCK_HISTORICAL_ROUTES}
                            renderItem={item => (
                                <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Space>
                                            <Badge status={item.severity === 'critical' ? 'error' : 'warning'} />
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <Text strong style={{ fontSize: 12 }}>{item.name}</Text>
                                                <Text type="secondary" style={{ fontSize: 10 }}>Historical corridor</Text>
                                            </div>
                                        </Space>
                                        <div style={{ textAlign: 'right' }}>
                                            <Text type="danger" style={{ fontSize: 12, display: 'block', fontWeight: 'bold' }}>{item.delay}</Text>
                                            <Text type="secondary" style={{ fontSize: 10 }}>({item.percent} severity)</Text>
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
