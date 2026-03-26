import React, { useState } from 'react';
import { Table, Tag, Button, Space, Card, Typography, Badge, Avatar, Divider, Tooltip, Row, Col, Input, Drawer, Steps, Progress } from 'antd';
import { 
    TeamOutlined, 
    DollarOutlined, 
    ClockCircleOutlined,
    SafetyOutlined,
    WarningOutlined,
    CheckCircleOutlined,
    EyeOutlined,
    MessageOutlined,
    MoreOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const { Text, Title, Paragraph } = Typography;

const initialRequests = [
    { 
        id: 'REQ-9921', 
        user: 'John Doe', 
        route: 'Harare → Bulawayo', 
        passengers: 2, 
        basePrice: 45, 
        proposedPrice: 50, 
        status: 'offers_received',
        offers: [
            { id: 1, driver: 'Tatenda M.', price: 55, rating: 4.8, status: 'pending' },
            { id: 2, driver: 'Simba G.', price: 50, rating: 4.9, status: 'pending' },
            { id: 3, driver: 'Memory N.', price: 60, rating: 4.7, status: 'rejected' }
        ],
        time: '12 mins ago'
    },
    { 
        id: 'REQ-9922', 
        user: 'Sarah M.', 
        route: 'Harare → Mutare', 
        passengers: 1, 
        basePrice: 20, 
        proposedPrice: 18, 
        status: 'pending',
        offers: [],
        time: '5 mins ago'
    },
    { 
        id: 'REQ-9923', 
        user: 'Robert K.', 
        route: 'Bulawayo → Harare', 
        passengers: 3, 
        basePrice: 45, 
        proposedPrice: 45, 
        status: 'driver_selected',
        driver: { name: 'James T.', vehicle: 'Toyota Hiace', plate: 'ABC-1234' },
        time: '34 mins ago'
    }
];

export const RideRequestAndOffers: React.FC = () => {
    const [requests, setRequests] = useState(initialRequests);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);

    const getStatusTag = (status: string) => {
        const config: any = {
            pending: { color: 'warning', text: 'Waiting for Offers', icon: <ClockCircleOutlined /> },
            offers_received: { color: 'processing', text: 'Negotiating', icon: <TeamOutlined /> },
            driver_selected: { color: 'success', text: 'Driver Fixed', icon: <CheckCircleOutlined /> },
            cancelled: { color: 'error', text: 'Cancelled', icon: <CloseCircleOutlined /> },
        };
        const item = config[status] || { color: 'default', text: status };
        return <Tag color={item.color} icon={item.icon} style={{ borderRadius: 6 }}>{item.text}</Tag>;
    };

    const columns = [
        {
            title: 'Request ID',
            dataIndex: 'id',
            render: (id: string) => <Text code>{id}</Text>
        },
        {
            title: 'Passenger & Route',
            key: 'route',
            render: (_: any, record: any) => (
                <Space orientation="vertical" size={0}>
                    <Text strong>{record.user}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{record.route} • {record.passengers} pax</Text>
                </Space>
            )
        },
        {
            title: 'Pricing',
            key: 'pricing',
            render: (_: any, record: any) => (
                <Space orientation="vertical" size={0}>
                    <Text strong style={{ color: record.proposedPrice < record.basePrice ? '#ef4444' : '#10b981' }}>
                        Proposed: ${record.proposedPrice}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>Market Base: ${record.basePrice}</Text>
                </Space>
            )
        },
        {
            title: 'Live Negotiation',
            key: 'offers',
            render: (_: any, record: any) => (
                <Space>
                    <Badge count={record.offers?.length || 0} style={{ backgroundColor: '#3b82f6' }} />
                    <Text type="secondary">Offers received</Text>
                </Space>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status: string) => getStatusTag(status)
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Button 
                    type="link" 
                    icon={<EyeOutlined />} 
                    onClick={() => setSelectedRequest(record)}
                >
                    Monitor
                </Button>
            )
        }
    ];

    return (
        <div style={{ padding: '24px 0' }}>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Card variant="borderless" style={{ borderRadius: 20 }} title="Inter-City Ride Marketplace Monitor">
                        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
                            <Space size="large">
                                <Input.Search placeholder="Search requests..." style={{ width: 300 }} />
                                <Badge status="processing" text="42 active negotiations" />
                            </Space>
                            <Space>
                                <Button icon={<WarningOutlined />} danger>Price Abuse Alerts (2)</Button>
                                <Button icon={<MoreOutlined />} />
                            </Space>
                        </div>
                        <Table 
                            dataSource={requests} 
                            columns={columns} 
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                        />
                    </Card>
                </Col>
            </Row>

            <Drawer
                title={`Negotiation Monitor - ${selectedRequest?.id}`}
                placement="right"
                width={500}
                onClose={() => setSelectedRequest(null)}
                open={!!selectedRequest}
                extra={
                    <Space>
                        <Button icon={<SafetyOutlined />}>Safety Protocol</Button>
                        <Button type="primary" danger>Cancel Ride</Button>
                    </Space>
                }
            >
                {selectedRequest && (
                    <div style={{ padding: 12 }}>
                        <div style={{ marginBottom: 24, padding: 16, background: '#f8fafc', borderRadius: 12 }}>
                            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>PASSENGER PROPOSAL</Text>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Space>
                                    <Avatar icon={<TeamOutlined />} />
                                    <Text strong style={{ fontSize: 16 }}>{selectedRequest.user}</Text>
                                </Space>
                                <Title level={4} style={{ margin: 0 }}>${selectedRequest.proposedPrice}</Title>
                            </div>
                        </div>

                        <Text strong style={{ display: 'block', marginBottom: 16 }}>Live Driver Offers</Text>
                        <AnimatePresence>
                            {selectedRequest.offers.map((offer: any) => (
                                <motion.div
                                    key={offer.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{ 
                                        padding: 16, 
                                        border: '1px solid #e2e8f0', 
                                        borderRadius: 12, 
                                        marginBottom: 12,
                                        background: offer.status === 'rejected' ? '#fff1f2' : 'white'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Space>
                                            <Avatar src={`https://i.pravatar.cc/150?u=${offer.driver}`} />
                                            <div>
                                                <Text strong>{offer.driver}</Text>
                                                <div style={{ fontSize: 12, color: '#f59e0b' }}>
                                                    ★ {offer.rating} • Top Driver
                                                </div>
                                            </div>
                                        </Space>
                                        <div style={{ textAlign: 'right' }}>
                                            <Text strong style={{ fontSize: 18 }}>${offer.price}</Text>
                                            <div style={{ fontSize: 11, color: '#64748b' }}>
                                                {offer.status === 'rejected' ? 'Passenger Declined' : 'Waiting...'}
                                            </div>
                                        </div>
                                    </div>
                                    {offer.status === 'pending' && (
                                        <Space style={{ marginTop: 12, width: '100%', justifyContent: 'flex-end' }}>
                                            <Button size="small" type="link" danger>Block Price Abuse</Button>
                                            <Button size="small" type="link">Intervene</Button>
                                        </Space>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {selectedRequest.offers.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <Paragraph type="secondary">Waiting for drivers to respond to this request...</Paragraph>
                                <Progress percent={30} status="active" showInfo={false} />
                            </div>
                        )}

                        <Divider />
                        
                        <Text strong style={{ display: 'block', marginBottom: 16 }}>Marketplace Health Check</Text>
                        <Steps
                            orientation="vertical"
                            size="small"
                            current={1}
                            items={[
                                { title: 'Request Published', description: selectedRequest.time },
                                { title: 'Negotiation Active', description: `${selectedRequest.offers.length} drivers offering` },
                                { title: 'Pricing Match', description: 'Within 15% of market base' },
                            ]}
                        />
                    </div>
                )}
            </Drawer>
        </div>
    );
};
