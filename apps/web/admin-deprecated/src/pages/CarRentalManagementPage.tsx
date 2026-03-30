import React, { useState } from 'react';
import { Typography, Row, Col, Card, Statistic, Table, Tag, Button, Space, Badge, Input, Select, Progress, Avatar } from 'antd';
import { 
    KeyOutlined, 
    CarOutlined, 
    TransactionOutlined,
    CheckCircleOutlined,
    SearchOutlined,
    SettingOutlined,
    DashboardOutlined,
    RiseOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export const CarRentalManagementPage: React.FC = () => {
    const [fleet] = useState([
        { id: 'RN-501', vehicle: 'Toyota Fortuner 2023', user: 'Mark Zulu', start: '2024-03-15', end: '2024-03-20', status: 'Active', price: 120 },
        { id: 'RN-502', vehicle: 'Hyundai Creta', user: 'Sarah J.', start: '2024-03-18', end: '2024-03-22', status: 'Pending', price: 65 },
        { id: 'RN-503', vehicle: 'Mercedes GLE 450', user: 'David H.', start: '2024-03-12', end: '2024-03-16', status: 'Returned', price: 250 },
        { id: 'RN-504', vehicle: 'VW Polo Vivo', user: 'Anna S.', start: '2024-03-19', end: '2024-03-21', status: 'Scheduled', price: 45 },
    ]);

    return (
        <div style={{ maxWidth: 1600, margin: '0 auto', paddingBottom: 24 }}>
            <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-1px' }}>
                        <KeyOutlined style={{ color: '#0ea5e9', marginRight: 12 }} />
                        Fleet Rental Operations
                    </Title>
                    <Paragraph type="secondary" style={{ fontSize: 16, marginTop: 8 }}>
                        Monitor rental bookings, manage vehicle health, and oversee long-term lease agreements.
                    </Paragraph>
                </div>
                <Space>
                    <Button icon={<SettingOutlined />}>Inventory Settings</Button>
                    <Button type="primary" size="large" icon={<CarOutlined />} style={{ background: '#0ea5e9', border: 'none', borderRadius: 12 }}>
                        Add Vehicle to Fleet
                    </Button>
                </Space>
            </div>

            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                {[
                    { title: 'Total Fleet Size', value: 342, icon: <DashboardOutlined />, color: '#64748b' },
                    { title: 'Currently Rented', value: 215, icon: <KeyOutlined />, color: '#0ea5e9' },
                    { title: 'Revenue (MTD)', value: 42500, prefix: '$', icon: <TransactionOutlined />, color: '#10b981' },
                    { title: 'Fleet Utilization', value: 82, suffix: '%', icon: <RiseOutlined />, color: '#f59e0b' },
                ].map((stat, i) => (
                    <Col key={i} xs={24} sm={12} lg={6}>
                        <Card bordered={false} className="shadow-sm" style={{ borderRadius: 16 }}>
                            <Statistic 
                                title={<Text type="secondary" style={{ fontSize: 14 }}>{stat.title}</Text>}
                                value={stat.value}
                                prefix={stat.prefix || <span style={{ color: stat.color, marginRight: 8 }}>{stat.icon}</span>}
                                suffix={stat.suffix}
                                valueStyle={{ fontWeight: 800, color: '#0f172a' }}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card 
                bordered={false} 
                className="shadow-sm" 
                style={{ borderRadius: 20 }} 
                title={<Space><KeyOutlined /> Active Rental Contracts</Space>}
                extra={
                    <Space>
                        <Input placeholder="Search contracts or vehicles..." prefix={<SearchOutlined />} style={{ width: 250, borderRadius: 8 }} />
                        <Select defaultValue="all" style={{ width: 140 }} options={[{label: 'All Status', value: 'all'}, {label: 'Active', value: 'active'}, {label: 'Overdue', value: 'overdue'}]} />
                    </Space>
                }
            >
                <Table 
                    dataSource={fleet} 
                    rowKey="id"
                    columns={[
                        { 
                            title: 'Contract ID', 
                            dataIndex: 'id', 
                            render: (id) => <Text strong style={{ color: '#0ea5e9' }}>{id}</Text> 
                        },
                        { 
                            title: 'Vehicle', 
                            render: (record) => (
                                <Space>
                                    <Avatar shape="square" icon={<CarOutlined />} style={{ background: '#f0f9ff', color: '#0ea5e9' }} />
                                    <Text strong>{record.vehicle}</Text>
                                </Space>
                            )
                        },
                        { title: 'Customer', dataIndex: 'user' },
                        { 
                            title: 'Rental Period', 
                            render: (record) => (
                                <Space orientation="vertical" size={0}>
                                    <Text style={{ fontSize: 12 }}>{record.start} to</Text>
                                    <Text style={{ fontSize: 12 }}>{record.end}</Text>
                                </Space>
                            )
                        },
                        { 
                            title: 'Status', 
                            dataIndex: 'status',
                            render: (s) => (
                                <Tag color={s === 'Active' ? 'blue' : s === 'Returned' ? 'green' : s === 'Pending' ? 'orange' : 'default'} style={{ borderRadius: 6 }}>
                                    {s}
                                </Tag>
                            )
                        },
                        { 
                            title: 'Daily Rate', 
                            dataIndex: 'price', 
                            render: (p) => <Text strong>${p}</Text> 
                        },
                        { 
                            title: 'Check-In', 
                            render: () => <Button size="small" icon={<EnvironmentOutlined />}>Status</Button> 
                        }
                    ]}
                />
            </Card>
        </div>
    );
};

