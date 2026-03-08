import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Row, Col, Card, Select, Button, Space, Tag, Statistic, Divider, message, Alert } from 'antd';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
    SyncOutlined, 
    GlobalOutlined, 
    ThunderboltOutlined, 
    CarOutlined, 
    NotificationOutlined 
} from '@ant-design/icons';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const { Title, Text } = Typography;
const { Option } = Select;

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Mock Data for Demand Zones
const MOCK_ZONES = [
    { id: 'z1', name: 'CBD', lat: -17.824858, lng: 31.053028, demand: 'high', drivers: 12, orders: 85, waitTime: '8 min', surge: 1.8 },
    { id: 'z2', name: 'Avondale', lat: -17.8000, lng: 31.0333, demand: 'medium', drivers: 25, orders: 30, waitTime: '4 min', surge: 1.1 },
    { id: 'z3', name: 'Borrowdale', lat: -17.7500, lng: 31.1000, demand: 'low', drivers: 40, orders: 15, waitTime: '2 min', surge: 1.0 },
    { id: 'z4', name: 'Airport', lat: -17.9333, lng: 31.0833, demand: 'critical', drivers: 2, orders: 45, waitTime: '25 min', surge: 2.5 },
];

export const HeatMapPage: React.FC = () => {
    const navigate = useNavigate();
    const [service, setService] = useState('ALL');
    const [timeRange, setTimeRange] = useState('LIVE');
    const [loading, setLoading] = useState(false);
    const [zones, setZones] = useState<any[]>([]);
    const [selectedZone, setSelectedZone] = useState<any | null>(null);

    useEffect(() => {
        setLoading(true);
        // Simulate data fetch
        const timer = setTimeout(() => {
            setZones(MOCK_ZONES);
            setSelectedZone(MOCK_ZONES[0]);
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [service, timeRange]);

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 500);
    };

    const getZoneColor = (demand: string) => {
        switch(demand) {
            case 'low': return '#22c55e'; // Green
            case 'medium': return '#eab308'; // Yellow
            case 'high': return '#ef4444'; // Red
            case 'critical': return '#a855f7'; // Purple
            default: return '#3b82f6';
        }
    };

    return (
        <div style={{ paddingBottom: 24 }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={4} style={{ margin: 0 }}>Live Demand Heat Map</Title>
                    <Text type="secondary">Monitor real-time supply vs demand across dispatch zones.</Text>
                </Col>
                <Col>
                    <Space>
                        <Select value={service} onChange={setService} style={{ width: 150 }}>
                            <Option value="ALL">All Services</Option>
                            <Option value="RIDE">Ride Hailing</Option>
                            <Option value="FOOD">Food Delivery</Option>
                            <Option value="MART">Mart Delivery</Option>
                            <Option value="PARCEL">Parcel Delivery</Option>
                        </Select>
                        <Select value={timeRange} onChange={setTimeRange} style={{ width: 120 }}>
                            <Option value="LIVE">Live Now</Option>
                            <Option value="1H">Last 1 Hour</Option>
                            <Option value="TODAY">Today</Option>
                        </Select>
                        <Button icon={<SyncOutlined spin={loading} />} onClick={handleRefresh}>Refresh</Button>
                    </Space>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: 0, height: 600, position: 'relative' }}>
                        <div style={{ height: '100%', width: '100%', backgroundColor: '#e2e8f0' }}>
                            <MapContainer 
                                center={[-17.824858, 31.053028]} 
                                zoom={12} 
                                style={{ height: '100%', width: '100%', zIndex: 1 }}
                            >
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                                />
                                {zones.map(zone => (
                                    <Circle 
                                        key={zone.id}
                                        center={[zone.lat, zone.lng]}
                                        pathOptions={{ fillColor: getZoneColor(zone.demand), color: getZoneColor(zone.demand), fillOpacity: 0.4 }}
                                        radius={zone.demand === 'critical' || zone.demand === 'high' ? 2500 : 4000}
                                        eventHandlers={{
                                            click: () => setSelectedZone(zone)
                                        }}
                                    >
                                        <Popup>
                                            <strong>{zone.name}</strong><br/>
                                            Demand: <Tag color={getZoneColor(zone.demand)}>{zone.demand.toUpperCase()}</Tag>
                                        </Popup>
                                    </Circle>
                                ))}
                            </MapContainer>
                        </div>

                        {/* Map Overlay Legend */}
                        <div style={{ 
                            position: 'absolute', bottom: 24, left: 24, zIndex: 1000, 
                            background: 'white', padding: '12px 16px', borderRadius: 8, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                        }}>
                            <Text strong style={{ display: 'block', marginBottom: 8 }}>Legend</Text>
                            <Space direction="vertical" size={4}>
                                <Space><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }}/> <Text style={{ fontSize: 12 }}>Balanced Supply</Text></Space>
                                <Space><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#eab308' }}/> <Text style={{ fontSize: 12 }}>Medium Demand</Text></Space>
                                <Space><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }}/> <Text style={{ fontSize: 12 }}>High Demand</Text></Space>
                                <Space><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#a855f7' }}/> <Text style={{ fontSize: 12 }}>Critical Shortage</Text></Space>
                            </Space>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    {selectedZone ? (
                        <Card bordered={false} className="shadow-sm" title={<Space><GlobalOutlined /> {selectedZone.name} Insights</Space>}>
                            
                            {selectedZone.demand === 'critical' && (
                                <Alert message="Critical Driver Shortage" type="error" showIcon style={{ marginBottom: 16 }} />
                            )}

                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Statistic title="Active Drivers" value={selectedZone.drivers} prefix={<CarOutlined />} valueStyle={{ color: '#0f172a' }} />
                                </Col>
                                <Col span={12}>
                                    <Statistic title="Live Orders" value={selectedZone.orders} valueStyle={{ color: selectedZone.orders > 50 ? '#ef4444' : '#0f172a' }} />
                                </Col>
                                <Col span={12}>
                                    <Statistic title="Avg Wait Time" value={selectedZone.waitTime} />
                                </Col>
                                <Col span={12}>
                                    <Statistic title="Surge Multiplier" value={`${selectedZone.surge}x`} prefix={<ThunderboltOutlined />} valueStyle={{ color: selectedZone.surge > 1.2 ? '#eab308' : '#10b981' }} />
                                </Col>
                            </Row>

                            <Divider />

                            <Title level={5}>Admin Actions</Title>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button block type="primary" danger={selectedZone.surge < 2.0} onClick={() => message.success(`Surge increased to ${selectedZone.surge + 0.2}x in ${selectedZone.name}`)}>
                                    Increase Surge Pricing
                                </Button>
                                <Button block onClick={() => message.info(`Incentive offer sent to drivers near ${selectedZone.name}`)}>
                                    Send Driver Incentive ($+)
                                </Button>
                                <Button block icon={<NotificationOutlined />} onClick={() => message.success('Alert sent to standby drivers')}>
                                    Dispatch Standby Drivers
                                </Button>
                                <Button block type="dashed" onClick={() => navigate(`/dashboard/fleet?zone=${selectedZone.id}`)}>
                                    Open Fleet View for {selectedZone.name}
                                </Button>
                            </Space>
                        </Card>
                    ) : (
                        <Card bordered={false} className="shadow-sm" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Text type="secondary">Select a zone on the map to view insights</Text>
                        </Card>
                    )}
                </Col>
            </Row>
        </div>
    );
};
