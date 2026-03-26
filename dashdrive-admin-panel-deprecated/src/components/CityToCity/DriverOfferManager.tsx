import React, { useState } from 'react';
import { Table, Tag, Button, Space, Card, Typography, Avatar, Tooltip, Row, Col, Input, Badge, Statistic } from 'antd';
import { 
    DollarOutlined, 
    ArrowRightOutlined,
    SafetyCertificateOutlined,
    WarningOutlined,
    NotificationOutlined,
    HistoryOutlined,
    FilterOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Title } = Typography;

const initialOffers = [
    { 
        id: 'OFF-101', 
        driver: 'Tatenda M.', 
        rating: 4.8,
        rideId: 'REQ-9921',
        route: 'Harare → Bulawayo',
        passengerPrice: 50,
        offerPrice: 55,
        basePrice: 45,
        timestamp: '2 mins ago',
        status: 'pending',
        reliability: 98
    },
    { 
        id: 'OFF-102', 
        driver: 'Simba G.', 
        rating: 4.9,
        rideId: 'REQ-9921',
        route: 'Harare → Bulawayo',
        passengerPrice: 50,
        offerPrice: 50,
        basePrice: 45,
        timestamp: '5 mins ago',
        status: 'pending',
        reliability: 100
    },
    { 
        id: 'OFF-103', 
        driver: 'Farai K.', 
        rating: 4.2,
        rideId: 'REQ-9925',
        route: 'Gweru → Harare',
        passengerPrice: 20,
        offerPrice: 35,
        basePrice: 25,
        timestamp: '8 mins ago',
        status: 'flagged',
        reliability: 75
    },
    { 
        id: 'OFF-104', 
        driver: 'Memory N.', 
        rating: 4.7,
        rideId: 'REQ-9921',
        route: 'Harare → Bulawayo',
        passengerPrice: 50,
        offerPrice: 60,
        basePrice: 45,
        timestamp: '15 mins ago',
        status: 'rejected',
        reliability: 92
    }
];

export const DriverOfferManager: React.FC = () => {
    const [offers] = useState(initialOffers);

    const getPriceVariance = (offer: number, base: number) => {
        const variance = ((offer - base) / base) * 100;
        return variance.toFixed(1);
    };

    const columns = [
        {
            title: 'Driver Details',
            key: 'driver',
            render: (_: any, record: any) => (
                <Space>
                    <Avatar src={`https://i.pravatar.cc/150?u=${record.driver}`} />
                    <div>
                        <Text strong>{record.driver}</Text>
                        <div style={{ fontSize: 11, color: '#f59e0b' }}>
                            ★ {record.rating} • {record.reliability}% Reliability
                        </div>
                    </div>
                </Space>
            )
        },
        {
            title: 'Market Context',
            key: 'context',
            render: (_: any, record: any) => (
                <Space orientation="vertical" size={0}>
                    <Text strong style={{ fontSize: 12 }}>{record.route}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>Linked to {record.rideId}</Text>
                </Space>
            )
        },
        {
            title: 'Negotiation Math',
            key: 'math',
            render: (_: any, record: any) => {
                const variance = parseFloat(getPriceVariance(record.offerPrice, record.basePrice));
                return (
                    <div style={{ padding: '4px 0' }}>
                        <Space split={<ArrowRightOutlined style={{ fontSize: 10, color: '#94a3b8' }} />}>
                            <Tooltip title="Passenger Proposed">
                                <Text style={{ fontSize: 13 }}>${record.passengerPrice}</Text>
                            </Tooltip>
                            <Tooltip title="Driver Bid">
                                <Text strong style={{ fontSize: 15, color: '#10b981' }}>${record.offerPrice}</Text>
                            </Tooltip>
                        </Space>
                        <div style={{ fontSize: 11, marginTop: 2 }}>
                            <Tag color={variance > 20 ? 'error' : 'default'} style={{ fontSize: 10, height: 18, lineHeight: '16px' }}>
                                {variance > 0 ? '+' : ''}{variance}% vs Base
                            </Tag>
                        </div>
                    </div>
                );
            }
        },
        {
            title: 'Timing',
            dataIndex: 'timestamp',
            render: (text: string) => <Tag icon={<HistoryOutlined />} style={{ borderRadius: 4 }}>{text}</Tag>
        },
        {
            title: 'Admin Status',
            dataIndex: 'status',
            render: (status: string) => {
                const colors: any = {
                    pending: 'processing',
                    flagged: 'error',
                    rejected: 'default',
                    accepted: 'success'
                };
                return <Badge status={colors[status]} text={status.toUpperCase()} style={{ fontSize: 11, fontWeight: 600 }} />;
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    <Button type="link" size="small" icon={<NotificationOutlined />}>Warn</Button>
                    <Button type="link" size="small" icon={<SafetyCertificateOutlined />}>Verify</Button>
                    {record.status === 'flagged' && (
                        <Tooltip title="Price Gouging Detected">
                            <ExclamationCircleOutlined style={{ color: '#ef4444' }} />
                        </Tooltip>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '24px 0' }}>
            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card variant="borderless" className="glass-card">
                        <Statistic 
                            title="Total Live Bids" 
                            value={128} 
                            prefix={<DollarOutlined />} 
                            styles={{ content: { color: '#3b82f6' } }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card variant="borderless" className="glass-card">
                        <Statistic 
                            title="Avg. Markup" 
                            value={12.4} 
                            suffix="%" 
                            styles={{ content: { color: '#10b981' } }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card variant="borderless" className="glass-card">
                        <Statistic 
                            title="Flagged Offers" 
                            value={3} 
                            prefix={<WarningOutlined />} 
                            styles={{ content: { color: '#ef4444' } }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card variant="borderless" className="glass-card">
                        <Statistic 
                            title="Top Routing" 
                            value="HRE → BYO" 
                            styles={{ content: { color: '#6366f1', fontSize: 20 } }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card 
                variant="borderless" 
                style={{ borderRadius: 24 }} 
                title={
                    <Space>
                        <Title level={4} style={{ margin: 0 }}>Driver Bidding Stream</Title>
                        <Tag color="blue">LIVE MONITOR</Tag>
                    </Space>
                }
                extra={
                    <Space>
                        <Input.Search placeholder="Search driver or route..." style={{ width: 250 }} />
                        <Button icon={<FilterOutlined />}>Filters</Button>
                    </Space>
                }
            >
                <Table 
                    dataSource={offers} 
                    columns={columns} 
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    className="premium-table"
                />
            </Card>
        </div>
    );
};
