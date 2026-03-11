import React, { useState } from 'react';
import { Typography, Row, Col, Card, Statistic, Table, Tag, Button, Space, Badge, Input, Select, Progress } from 'antd';
import { 
    CompassOutlined, 
    GlobalOutlined, 
    HistoryOutlined, 
    SearchOutlined, 
    FilterOutlined,
    ClockCircleOutlined,
    SafetyCertificateOutlined,
    DownloadOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export const PublicTransportPage: React.FC = () => {
    const [routes] = useState([
        { id: 'RT-88', name: 'Harare - Bulawayo Express', type: 'Bus', status: 'On-Time', capacity: '92%', lastDeparture: '08:00 AM' },
        { id: 'RT-42', name: 'CBD - Airport Shuttle', type: 'Minibus', status: 'Delayed', capacity: '45%', lastDeparture: '10:15 AM' },
        { id: 'RT-11', name: 'Inter-City Rail Link', type: 'Train', status: 'On-Time', capacity: '78%', lastDeparture: '07:30 AM' },
        { id: 'RT-95', name: 'Eastern Highlands Coach', type: 'Coach', status: 'Scheduled', capacity: '0%', lastDeparture: '01:00 PM' },
    ]);

    return (
        <div style={{ maxWidth: 1600, margin: '0 auto', paddingBottom: 24 }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Public Transport Network</Title>
                <Text type="secondary" style={{ fontSize: 15 }}>Manage inter-city buses, shuttle routes, and rail schedules.</Text>
            </div>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Active Routes" 
                            value={24} 
                            prefix={<CompassOutlined style={{ color: '#1677ff' }} />} 
                            valueStyle={{ color: '#1677ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Today's Passengers" 
                            value={1850} 
                            prefix={<GlobalOutlined style={{ color: '#52c41a' }} />} 
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Avg. Punctuality" 
                            value={98.5} 
                            suffix="%" 
                            prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />} 
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Safety Rating" 
                            value={4.9} 
                            suffix="/5" 
                            prefix={<SafetyCertificateOutlined style={{ color: '#722ed1' }} />} 
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card bordered={false} className="shadow-sm" style={{ borderRadius: 16 }} title="Route & Fleet Monitor">
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <Space>
                        <Input placeholder="Search routes..." prefix={<SearchOutlined />} style={{ width: 250 }} />
                        <Button icon={<FilterOutlined />}>Vehicle Type</Button>
                    </Space>
                    <Button type="primary" icon={<DownloadOutlined />}>Manifest Export</Button>
                </div>
                <Table 
                    dataSource={routes} 
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    columns={[
                        { title: 'Route ID', dataIndex: 'id', render: (t) => <Tag color="blue">{t}</Tag> },
                        { title: 'Route Name', dataIndex: 'name', render: (t) => <Text strong>{t}</Text> },
                        { title: 'Type', dataIndex: 'type' },
                        { 
                            title: 'Status', 
                            dataIndex: 'status', 
                            render: (s) => (
                                <Badge status={s === 'On-Time' ? 'success' : s === 'Delayed' ? 'error' : 'processing'} text={s} />
                            ) 
                        },
                        { 
                            title: 'Booking Load', 
                            dataIndex: 'capacity', 
                            render: (c) => <Progress percent={parseInt(c)} size="small" strokeColor={parseInt(c) > 80 ? '#f5222d' : '#52c41a'} /> 
                        },
                        { title: 'Last Dep.', dataIndex: 'lastDeparture' },
                        { title: 'Action', render: () => <Button size="small">Live Track</Button> }
                    ]}
                />
            </Card>
        </div>
    );
};
