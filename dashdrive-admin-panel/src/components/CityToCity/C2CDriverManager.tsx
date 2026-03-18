import React, { useState } from 'react';
import { Table, Tag, Button, Space, Card, Typography, Avatar, Tooltip, Row, Col, Progress, Rate, Badge, Input, Select } from 'antd';
import { 
    UserOutlined, 
    EnvironmentOutlined, 
    CarOutlined, 
    CheckCircleOutlined,
    SafetyCertificateOutlined,
    WarningOutlined,
    FilterOutlined,
    ExportOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Title } = Typography;

const initialDrivers = [
    { 
        id: 1, 
        name: 'Tatenda Mash', 
        status: 'Active', 
        routes: ['Harare → Bulawayo', 'Harare → Mutare'],
        tripsCompleted: 450,
        rating: 4.8,
        safetyScore: 98,
        vehicle: 'Toyota Hiace',
        verified: true
    },
    { 
        id: 2, 
        name: 'Simba Gumbo', 
        status: 'On Trip', 
        routes: ['Bulawayo → Victoria Falls'],
        tripsCompleted: 320,
        rating: 4.9,
        safetyScore: 99,
        vehicle: 'Mercedes Sprinter',
        verified: true
    },
    { 
        id: 3, 
        name: 'Memory Ndlovu', 
        status: 'Resting', 
        routes: ['Harare → Gweru'],
        tripsCompleted: 156,
        rating: 4.2,
        safetyScore: 85,
        vehicle: 'Nissan Caravan',
        verified: false
    },
    { 
        id: 4, 
        name: 'John Moyo', 
        status: 'Offline', 
        routes: ['Harare → Masvingo'],
        tripsCompleted: 580,
        rating: 4.7,
        safetyScore: 95,
        vehicle: 'Yutong Coach',
        verified: true
    }
];

export const C2CDriverManager: React.FC = () => {
    const [drivers] = useState(initialDrivers);

    const columns = [
        {
            title: 'Driver Identity',
            key: 'driver',
            render: (_: any, record: any) => (
                <Space>
                    <Badge dot status={record.verified ? 'success' : 'warning'}>
                        <Avatar icon={<UserOutlined />} src={`https://i.pravatar.cc/150?u=${record.id}`} />
                    </Badge>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Text strong>{record.name}</Text>
                            {record.verified && <SafetyCertificateOutlined style={{ color: '#10b981', fontSize: 12 }} />}
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>ID: C2C-DRV-{record.id}</Text>
                    </div>
                </Space>
            )
        },
        {
            title: 'Primary Routes',
            dataIndex: 'routes',
            render: (routes: string[]) => (
                <div style={{ maxWidth: 200 }}>
                    {routes.map(r => <Tag key={r} style={{ marginBottom: 4 }}>{r}</Tag>)}
                </div>
            )
        },
        {
            title: 'Performance',
            key: 'stats',
            render: (_: any, record: any) => (
                <div style={{ minWidth: 120 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary" style={{ fontSize: 11 }}>Trips</Text>
                        <Text strong style={{ fontSize: 11 }}>{record.tripsCompleted}</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary" style={{ fontSize: 11 }}>Rating</Text>
                        <Rate disabled defaultValue={record.rating} style={{ fontSize: 10 }} />
                    </div>
                </div>
            )
        },
        {
            title: 'Safety %',
            dataIndex: 'safetyScore',
            render: (score: number) => (
                <div style={{ width: 80 }}>
                    <Text strong style={{ color: score > 90 ? '#10b981' : score > 80 ? '#f59e0b' : '#ef4444' }}>
                        {score}%
                    </Text>
                    <Progress 
                        percent={score} 
                        showInfo={false} 
                        size="small" 
                        strokeColor={score > 90 ? '#10b981' : score > 80 ? '#f59e0b' : '#ef4444'} 
                    />
                </div>
            )
        },
        {
            title: 'Current Status',
            dataIndex: 'status',
            render: (status: string) => {
                const color = status === 'Active' ? 'success' : status === 'On Trip' ? 'processing' : 'default';
                return <Badge status={color as any} text={status} />;
            }
        },
        {
            title: 'Admin actions',
            key: 'actions',
            render: () => (
                <Space>
                    <Button type="link" size="small">Audit</Button>
                    <Button type="link" size="small" danger>Restrict</Button>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '24px 0' }}>
            <Card variant="borderless" style={{ borderRadius: 20 }} title="Long-Distance Fleet Operations">
                <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
                    <Space size="middle">
                        <Input placeholder="Search drivers or vehicle plates..." prefix={<SearchOutlined />} style={{ width: 300 }} />
                        <Select defaultValue="all" style={{ width: 150 }} options={[
                            { label: 'All Statuses', value: 'all' },
                            { label: 'Active', value: 'active' },
                            { label: 'On Trip', value: 'on_trip' }
                        ]} />
                    </Space>
                    <Space>
                        <Button icon={<FilterOutlined />}>Advanced filters</Button>
                        <Button type="primary" icon={<ExportOutlined />}>Registry Export</Button>
                    </Space>
                </div>

                <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
                    <Col span={6}>
                        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>TOTAL DRIVERS</Text>
                            <Title level={4} style={{ margin: '4px 0' }}>1,240</Title>
                            <Tag color="blue">+12 this week</Tag>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>IDLE IN HARARE</Text>
                            <Title level={4} style={{ margin: '4px 0' }}>84</Title>
                            <Text type="secondary" style={{ fontSize: 11 }}>Ready for dispatch</Text>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>AVERAGE SAFETY</Text>
                            <Title level={4} style={{ margin: '4px 0' }}>94.2%</Title>
                            <Progress percent={94} showInfo={false} strokeColor="#10b981" />
                        </div>
                    </Col>
                    <Col span={6}>
                        <div style={{ padding: 16, background: '#fef2f2', borderRadius: 12, border: '1px solid #fee2e2' }}>
                            <Text type="secondary" style={{ fontSize: 12, color: '#ef4444' }}>CRITICAL ALERTS</Text>
                            <Title level={4} style={{ margin: '4px 0', color: '#ef4444' }}>3</Title>
                            <Text style={{ fontSize: 11, color: '#ef4444' }}>License expirations</Text>
                        </div>
                    </Col>
                </Row>

                <Table 
                    dataSource={drivers} 
                    columns={columns} 
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
};
