import React, { useState } from 'react';
import { Typography, Row, Col, Card, Statistic, Table, Tag, Button, Space, Badge, Input, Select, Avatar, List } from 'antd';
import { 
    CalendarOutlined, 
    TeamOutlined, 
    DollarOutlined,
    CheckCircleOutlined,
    SearchOutlined,
    PlusOutlined,
    FilterOutlined,
    StarOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export const EventsBookingPage: React.FC = () => {
    const [events] = useState([
        { id: 'EVT-101', name: 'Harare Tech Summit 2024', date: 'Oct 15, 2024', status: 'Active', bookings: 450, revenue: 12500, category: 'Conference' },
        { id: 'EVT-102', name: 'Sunset Music Festival', date: 'Nov 02, 2024', status: 'Draft', bookings: 0, revenue: 0, category: 'Music' },
        { id: 'EVT-103', name: 'Global Finance Forum', date: 'Oct 20, 2024', status: 'Sold Out', bookings: 200, revenue: 8000, category: 'Business' },
        { id: 'EVT-104', name: 'National Sports Gala', date: 'Dec 12, 2024', status: 'Active', bookings: 1200, revenue: 35000, category: 'Sports' },
    ]);

    return (
        <div style={{ maxWidth: 1600, margin: '0 auto', paddingBottom: 24 }}>
            <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-1px' }}>
                        <CalendarOutlined style={{ color: '#8b5cf6', marginRight: 12 }} />
                        Events & Ticketing Hub
                    </Title>
                    <Paragraph type="secondary" style={{ fontSize: 16, marginTop: 8 }}>
                        Manage event listings, track ticket sales, and oversee vendor partnerships across the platform.
                    </Paragraph>
                </div>
                <Button type="primary" size="large" icon={<PlusOutlined />} style={{ background: '#8b5cf6', border: 'none', height: 48, borderRadius: 12, padding: '0 24px' }}>
                    Create New Event
                </Button>
            </div>

            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                {[
                    { title: 'Total Tickets Sold', value: 12450, icon: <TeamOutlined />, color: '#3b82f6' },
                    { title: 'Gross Revenue', value: 154200, prefix: '$', icon: <DollarOutlined />, color: '#10b981' },
                    { title: 'Upcoming Events', value: 18, icon: <CalendarOutlined />, color: '#f59e0b' },
                    { title: 'Average Filling Rate', value: 84, suffix: '%', icon: <StarOutlined />, color: '#f43f5e' },
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

            <Row gutter={24}>
                <Col span={16}>
                    <Card 
                        bordered={false} 
                        className="shadow-sm" 
                        style={{ borderRadius: 20 }} 
                        title={<Space><CalendarOutlined /> Master Event List</Space>}
                        extra={
                            <Space>
                                <Input placeholder="Search events..." prefix={<SearchOutlined />} style={{ width: 250, borderRadius: 8 }} />
                                <Button icon={<FilterOutlined />}>Category</Button>
                            </Space>
                        }
                    >
                        <Table 
                            dataSource={events} 
                            rowKey="id"
                            columns={[
                                { 
                                    title: 'Event Name', 
                                    key: 'name',
                                    render: (record) => (
                                        <Space>
                                            <Avatar shape="square" icon={<CalendarOutlined />} style={{ background: '#f5f3ff', color: '#8b5cf6' }} />
                                            <div>
                                                <Text strong style={{ display: 'block' }}>{record.name}</Text>
                                                <Text type="secondary" style={{ fontSize: 12 }}>{record.id}</Text>
                                            </div>
                                        </Space>
                                    )
                                },
                                { title: 'Date', dataIndex: 'date' },
                                { title: 'Category', dataIndex: 'category', render: (c) => <Tag style={{ borderRadius: 4 }}>{c}</Tag> },
                                { 
                                    title: 'Status', 
                                    dataIndex: 'status',
                                    render: (s) => (
                                        <Badge 
                                            status={s === 'Active' ? 'success' : s === 'Sold Out' ? 'error' : 'default'} 
                                            text={s} 
                                        />
                                    )
                                },
                                { 
                                    title: 'Sales', 
                                    key: 'sales',
                                    render: (record) => (
                                        <div>
                                            <Text strong>{record.bookings}</Text>
                                            <div style={{ fontSize: 12, color: '#10b981' }}>${record.revenue.toLocaleString()}</div>
                                        </div>
                                    )
                                },
                                { 
                                    title: 'Actions', 
                                    render: () => <Button type="text" icon={<StarOutlined />} /> 
                                }
                            ]}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} className="shadow-sm" style={{ borderRadius: 20 }} title="Top Venues">
                        <List
                            itemLayout="horizontal"
                            dataSource={[
                                { name: 'HICC Main Hall', location: 'Harare', events: 12 },
                                { name: 'ZITF Grounds', location: 'Bulawayo', events: 8 },
                                { name: 'Celebration Center', location: 'Barrowdale', events: 5 },
                            ]}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<EnvironmentOutlined />} style={{ background: '#f8fafc', color: '#64748b' }} />}
                                        title={<Text strong>{item.name}</Text>}
                                        description={`${item.location} â€¢ ${item.events} Events`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
