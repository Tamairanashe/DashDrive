import React, { useState } from 'react';
import { Table, Tag, Button, Space, Card, Typography, Avatar, Row, Col, Progress, Badge, List, Alert, Empty } from 'antd';
import { 
    EnvironmentOutlined, 
    SafetyOutlined, 
    WarningOutlined, 
    CompassOutlined,
    PhoneOutlined,
    MessageOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    GlobalOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

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
        alerts: []
    },
    { 
        id: 'TRP-1005', 
        route: 'Harare → Mutare', 
        driver: 'Blessing C.', 
        progress: 15,
        location: 'Melfort',
        status: 'delayed',
        lastUpdate: '1 min ago',
        alerts: ['Speeding Alert (110km/h)']
    },
    { 
        id: 'TRP-1008', 
        route: 'Bulawayo → Vic Falls', 
        driver: 'Simba O.', 
        progress: 88,
        location: 'Hwange',
        status: 'critical',
        lastUpdate: 'Just now',
        alerts: ['SOS Alert Triggered']
    }
];

export const LiveOperations: React.FC = () => {
    const [trips] = useState(activeTrips);

    return (
        <div style={{ padding: '24px 0' }}>
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card 
                        variant="borderless" 
                        style={{ borderRadius: 20, marginBottom: 24 }} 
                        title={<Space><GlobalOutlined style={{ color: '#3b82f6' }} /> Real-time Fleet Tracking</Space>}
                    >
                        <div style={{ height: 400, background: '#f8fafc', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #cbd5e1', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ textAlign: 'center' }}>
                                <CompassOutlined style={{ fontSize: 48, color: '#94a3b8', marginBottom: 16 }} />
                                <Title level={5}>Inter-City Network Map</Title>
                                <Text type="secondary">GPS integration active with 42 vehicles pinging</Text>
                            </div>
                            
                            {/* Mock markers */}
                            <div style={{ position: 'absolute', top: '20%', left: '30%', padding: '4px 8px', background: 'white', borderRadius: 8, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: '1px solid #e2e8f0' }}>
                                <Badge status="success" /> <Text strong style={{ fontSize: 11 }}>TRP-1001</Text>
                            </div>
                            <div style={{ position: 'absolute', top: '50%', left: '60%', padding: '4px 8px', background: 'white', borderRadius: 8, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: '1px solid #ef4444' }}>
                                <Badge status="error" /> <Text strong style={{ fontSize: 11 }}>TRP-1008 (SOS!)</Text>
                            </div>
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
                        <List
                            itemLayout="vertical"
                            dataSource={trips.filter(t => t.alerts.length > 0)}
                            renderItem={item => (
                                <div style={{ padding: 16, background: item.status === 'critical' ? '#fef2f2' : '#fffbeb', borderRadius: 12, marginBottom: 16, border: `1px solid ${item.status === 'critical' ? '#fecaca' : '#fef3c7'}` }}>
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
                            )}
                        />
                        {trips.filter(t => t.alerts.length > 0).length === 0 && (
                            <Empty description="No active safety incidents" />
                        )}
                        
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
                        <List
                            size="small"
                            dataSource={[
                                { type: 'Mechanical', time: 'Yesterday', status: 'Resolved' },
                                { type: 'Passenger Dispute', time: '2 days ago', status: 'Compensated' }
                            ]}
                            renderItem={item => (
                                <List.Item extra={<Tag color="success">{item.status}</Tag>}>
                                    <List.Item.Meta title={item.type} description={item.time} />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
