import React, { useState } from 'react';
import { Typography, Row, Col, Card, Statistic, Table, Tag, Button, Space, Badge, Input, Select } from 'antd';
import { 
    ThunderboltOutlined, 
    EnvironmentOutlined, 
    HistoryOutlined, 
    SearchOutlined, 
    FilterOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    BellOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export const FuelServicesPage: React.FC = () => {
    const [stations] = useState([
        { id: 'ST-001', name: 'TotalEnergies Samora', status: 'Active', fuelPrice: 1.65, evAvailable: true, todayVolume: '4,200L' },
        { id: 'ST-002', name: 'Puma Avondale', status: 'Active', fuelPrice: 1.62, evAvailable: false, todayVolume: '3,850L' },
        { id: 'ST-003', name: 'Zuva Borrowdale', status: 'Maintenance', fuelPrice: 1.68, evAvailable: true, todayVolume: '0L' },
        { id: 'ST-004', name: 'Engen CBD', status: 'Active', fuelPrice: 1.64, evAvailable: false, todayVolume: '5,100L' },
    ]);

    return (
        <div style={{ maxWidth: 1600, margin: '0 auto', paddingBottom: 24 }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Fuel & Energy Management</Title>
                <Text type="secondary" style={{ fontSize: 15 }}>Monitor partner stations, fuel prices, and EV charging infrastructure.</Text>
            </div>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Active Stations" 
                            value={142} 
                            prefix={<EnvironmentOutlined style={{ color: '#1677ff' }} />} 
                            valueStyle={{ color: '#1677ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Avg. Fuel Price ($)" 
                            value={1.64} 
                            precision={2}
                            prefix={<ThunderboltOutlined style={{ color: '#52c41a' }} />} 
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Today's Dispensed" 
                            value={12400} 
                            suffix="L" 
                            prefix={<HistoryOutlined style={{ color: '#faad14' }} />} 
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Alerts" 
                            value={3} 
                            prefix={<Badge status="error" />} 
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card bordered={false} className="shadow-sm" style={{ borderRadius: 16 }} title="Partner Station Monitor">
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <Space>
                        <Input placeholder="Search station..." prefix={<SearchOutlined />} style={{ width: 250 }} />
                        <Button icon={<FilterOutlined />}>Filters</Button>
                    </Space>
                    <Button type="primary" icon={<BellOutlined />}>Price Alert Setup</Button>
                </div>
                <Table 
                    dataSource={stations} 
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    columns={[
                        { title: 'Station ID', dataIndex: 'id', render: (t) => <Text strong>{t}</Text> },
                        { title: 'Name', dataIndex: 'name' },
                        { 
                            title: 'Status', 
                            dataIndex: 'status', 
                            render: (s) => (
                                <Tag color={s === 'Active' ? 'green' : 'orange'}>{s.toUpperCase()}</Tag>
                            ) 
                        },
                        { title: 'Current Price ($)', dataIndex: 'fuelPrice', render: (p) => <Text strong>${p.toFixed(2)}</Text> },
                        { 
                            title: 'EV Charging', 
                            dataIndex: 'evAvailable', 
                            render: (ev) => ev ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <Text type="secondary">-</Text> 
                        },
                        { title: "Today's Volume", dataIndex: 'todayVolume' },
                        { title: 'Action', render: () => <Button size="small">Details</Button> }
                    ]}
                />
            </Card>
        </div>
    );
};
