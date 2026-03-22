import React, { useState } from 'react';
import { Table, Tag, Button, Space, Card, Typography, Avatar, Row, Col, Progress, Badge, Alert, Empty, App, Flex, Divider } from 'antd';
import { 
    EnvironmentOutlined, 
    SafetyOutlined, 
    WarningOutlined, 
    CompassOutlined,
    PhoneOutlined,
    MessageOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    GlobalOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';

const { Text, Title, Paragraph } = Typography;

const activeTrips = [
    { 
        id: 'TRP-1001', 
        route: 'Harare → Bulawayo', 
        driver: 'Gift M.', 
        progress: 65,
        location: 'Chegutu (En-route)',
        status: 'on_track',
        lastUpdate: '2 mins ago',
        alerts: [],
        position: { lat: -18.1302, lng: 30.1407 }
    },
    { 
        id: 'TRP-1005', 
        route: 'Harare → Mutare', 
        driver: 'Blessing C.', 
        progress: 15,
        location: 'Melfort',
        status: 'delayed',
        lastUpdate: '1 min ago',
        alerts: ['Speeding Alert (110km/h)'],
        position: { lat: -17.9667, lng: 31.3833 }
    },
    { 
        id: 'TRP-1008', 
        route: 'Bulawayo → Vic Falls', 
        driver: 'Simba O.', 
        progress: 88,
        location: 'Hwange',
        status: 'critical',
        lastUpdate: 'Just now',
        alerts: ['SOS Alert Triggered'],
        position: { lat: -18.3693, lng: 26.5019 }
    }
];

export const LiveOperations: React.FC = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyCxwlIiOcrI_yBrehP9CKr-CoIoPusShh0",
        libraries: ['places', 'drawing', 'visualization', 'geometry', 'marker']
    });

    const [trips] = useState(activeTrips);
    const [selectedTrip, setSelectedTrip] = useState<any | null>(null);

    const mapCenter = { lat: -19.0154, lng: 29.1549 }; // Central Zimbabwe

    return (
        <div style={{ padding: '24px 0' }}>
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card 
                        variant="borderless" 
                        style={{ borderRadius: 20, marginBottom: 24 }} 
                        title={<Space><GlobalOutlined style={{ color: '#3b82f6' }} /> Real-time Fleet Tracking</Space>}
                    >
                        <div style={{ height: 450, background: '#f8fafc', borderRadius: 16, position: 'relative', overflow: 'hidden' }}>
                            {isLoaded ? (
                                <GoogleMap
                                    mapContainerStyle={{ width: '100%', height: '100%' }}
                                    center={mapCenter}
                                    zoom={7}
                                    options={{
                                        disableDefaultUI: false,
                                        zoomControl: true,
                                        styles: [
                                            {
                                                featureType: 'all',
                                                elementType: 'labels.text.fill',
                                                stylers: [{ color: '#64748b' }]
                                            }
                                        ]
                                    }}
                                >
                                    {trips.map(trip => (
                                        <MarkerF
                                            key={trip.id}
                                            position={trip.position}
                                            onClick={() => setSelectedTrip(trip)}
                                            icon={{
                                                path: google.maps.SymbolPath.CIRCLE,
                                                fillColor: trip.status === 'critical' ? '#ef4444' : trip.status === 'delayed' ? '#f59e0b' : '#3b82f6',
                                                fillOpacity: 0.9,
                                                strokeWeight: 2,
                                                strokeColor: '#fff',
                                                scale: 8,
                                            }}
                                        />
                                    ))}

                                    <AnimatePresence>
                                        {selectedTrip && (
                                            <InfoWindowF
                                                position={selectedTrip.position}
                                                onCloseClick={() => setSelectedTrip(null)}
                                            >
                                                <div style={{ padding: 8, maxWidth: 200 }}>
                                                    <Text strong style={{ display: 'block' }}>{selectedTrip.id} - {selectedTrip.driver}</Text>
                                                    <Text type="secondary" style={{ fontSize: 11 }}>{selectedTrip.route}</Text>
                                                    <Divider style={{ margin: '8px 0' }} />
                                                    <Text style={{ fontSize: 12 }}>Loc: {selectedTrip.location}</Text>
                                                    {selectedTrip.alerts.length > 0 && (
                                                        <div style={{ marginTop: 4 }}>
                                                            {selectedTrip.alerts.map((a: string) => <Tag key={a} color="error" style={{ fontSize: 10 }}>{a}</Tag>)}
                                                        </div>
                                                    )}
                                                </div>
                                            </InfoWindowF>
                                        )}
                                    </AnimatePresence>
                                </GoogleMap>
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <CompassOutlined style={{ fontSize: 48, color: '#94a3b8', marginBottom: 16 }} className="animate-spin" />
                                        <Title level={5}>Loading Inter-City Network Map...</Title>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: 24 }}>
                            <Table 
                                dataSource={trips}
                                pagination={false}
                                size="small"
                                rowKey="id"
                                columns={[
                                    {
                                        title: 'Active Trip',
                                        key: 'trip',
                                        render: (_: any, record: any) => (
                                            <Space orientation="vertical" size={0}>
                                                <Text strong>{record.id} • {record.driver}</Text>
                                                <Text type="secondary" style={{ fontSize: 11 }}>{record.route}</Text>
                                            </Space>
                                        )
                                    },
                                    {
                                        title: 'Progress',
                                        dataIndex: 'progress',
                                        render: (p, record) => (
                                            <div style={{ width: 120 }}>
                                                <Progress 
                                                    percent={p} 
                                                    size="small" 
                                                    strokeColor={record.status === 'critical' ? '#ef4444' : record.status === 'delayed' ? '#f59e0b' : '#3b82f6'} 
                                                />
                                                <Text type="secondary" style={{ fontSize: 10 }}>{record.location}</Text>
                                            </div>
                                        )
                                    },
                                    {
                                        title: 'Alerts',
                                        dataIndex: 'alerts',
                                        render: (alerts: string[]) => (
                                            <Space orientation="vertical" size={0}>
                                                {alerts.length > 0 ? (
                                                    alerts.map(a => <Tag key={a} color="error" style={{ fontSize: 10, borderRadius: 4 }}>{a}</Tag>)
                                                ) : (
                                                    <Tag color="success" style={{ fontSize: 10, borderRadius: 4 }}>Normal</Tag>
                                                )}
                                            </Space>
                                        )
                                    },
                                    {
                                        title: 'Ops',
                                        render: () => (
                                            <Space>
                                                <Button size="small" type="link" icon={<PhoneOutlined />} />
                                                <Button size="small" type="link">Protocol</Button>
                                            </Space>
                                        )
                                    }
                                ]}
                            />
                        </div>
                    </Card>
                </Col>
                
                <Col xs={24} lg={8}>
                    <Card 
                        variant="borderless" 
                        style={{ borderRadius: 20, border: '2px solid #fee2e2' }} 
                        title={<Space><SafetyOutlined style={{ color: '#ef4444' }} /> Emergency & Incident Hub</Space>}
                    >
                        <Flex vertical gap={16}>
                            {trips.filter(t => t.alerts.length > 0).map(item => (
                                <div key={item.id} style={{ padding: 16, background: item.status === 'critical' ? '#fef2f2' : '#fffbeb', borderRadius: 12, border: `1px solid ${item.status === 'critical' ? '#fecaca' : '#fef3c7'}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <Space>
                                            <ExclamationCircleOutlined style={{ color: '#ef4444', fontSize: 20 }} />
                                            <Text strong>{item.alerts[0]}</Text>
                                        </Space>
                                        <Tag color="error">Vrg-1</Tag>
                                    </div>
                                    <Text type="secondary" style={{ display: 'block', fontSize: 12, marginBottom: 12 }}>
                                        Trip {item.id} ({item.route}) reported {item.alerts[0]} 40km after {item.location}.
                                    </Text>
                                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                        <Button danger size="small" icon={<PhoneOutlined />}>Call Driver</Button>
                                        <Button size="small" icon={<MessageOutlined />}>Support</Button>
                                        <Button size="small" type="primary" style={{ background: '#ef4444', border: 'none' }}>Dispatch Help</Button>
                                    </Space>
                                </div>
                            ))}
                            {trips.filter(t => t.alerts.length > 0).length === 0 && (
                                <Empty description="No active safety incidents" />
                            )}
                        </Flex>
                        
                        <div style={{ marginTop: 24, padding: 16, background: '#f0fdf4', borderRadius: 12 }}>
                            <Space align="start">
                                <CheckCircleOutlined style={{ color: '#10b981', marginTop: 4 }} />
                                <div>
                                    <Text strong style={{ color: '#10b981' }}>Safety Protocols Active</Text>
                                    <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 0 }}>
                                        All vehicles are currently within speed limits (Avg 92km/h). Route deviation detection is monitoring 42 trips.
                                    </Paragraph>
                                </div>
                            </Space>
                        </div>
                    </Card>

                    <Card variant="borderless" style={{ borderRadius: 20, marginTop: 24 }} title="Incident History">
                        <Flex vertical gap={12}>
                            {[
                                { type: 'Mechanical', time: 'Yesterday', status: 'Resolved' },
                                { type: 'Passenger Dispute', time: '2 days ago', status: 'Compensated' }
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: idx === 1 ? 'none' : '1px solid #f1f5f9' }}>
                                    <div>
                                        <Text strong style={{ display: 'block' }}>{item.type}</Text>
                                        <Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Text>
                                    </div>
                                    <Tag color="success">{item.status}</Tag>
                                </div>
                            ))}
                        </Flex>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
