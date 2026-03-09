import React from 'react';
import { Card, Typography, Row, Col, Space, Table, Tag } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Zap, DollarSign } from 'lucide-react';

const { Title, Text } = Typography;

const campaignPerformance = [
    { name: 'Jan', apps: 400, revenue: 2400 },
    { name: 'Feb', apps: 300, revenue: 1398 },
    { name: 'Mar', apps: 200, revenue: 9800 },
    { name: 'Apr', apps: 278, revenue: 3908 },
    { name: 'May', apps: 189, revenue: 4800 },
    { name: 'Jun', apps: 239, revenue: 3800 },
    { name: 'Jul', apps: 349, revenue: 4300 },
];

const conversionData = [
    { name: 'Mon', rate: 2.4 },
    { name: 'Tue', rate: 3.2 },
    { name: 'Wed', rate: 4.8 },
    { name: 'Thu', rate: 4.2 },
    { name: 'Fri', rate: 5.5 },
    { name: 'Sat', rate: 6.1 },
    { name: 'Sun', rate: 5.8 },
];

export function MarketingAnalytics({ token }: { token: string }) {
    const tableData = [
        { key: '1', campaign: 'Life Insurance Drive', applications: 1240, cvr: '8.4%', revenue: '$12,400', status: 'High' },
        { key: '2', campaign: 'Auto Renewal Promo', applications: 850, cvr: '12.2%', revenue: '$42,500', status: 'Excellent' },
        { key: '3', campaign: 'Home Shield Launch', applications: 320, cvr: '5.6%', revenue: '$8,000', status: 'Steady' },
    ];

    const columns = [
        { title: 'Top Campaigns', dataIndex: 'campaign', key: 'campaign' },
        { title: 'Applications', dataIndex: 'applications', key: 'applications' },
        { title: 'CVR', dataIndex: 'cvr', key: 'cvr', render: (text: string) => <Tag color="green">{text}</Tag> },
        { title: 'Revenue', dataIndex: 'revenue', key: 'revenue', render: (text: string) => <Text strong>{text}</Text> },
        { title: 'Performance', dataIndex: 'status', key: 'status' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>Campaign Analytics</Title>
                    <Text type="secondary">In-depth tracking of your marketing performance and ROI.</Text>
                </div>
            </div>

            <Row gutter={[24, 24]}>
                {[
                    { title: 'Conversion Rate', value: '7.8%', change: '+1.2%', icon: <TrendingUp size={20} />, color: '#10b981' },
                    { title: 'Total Applications', value: '2,410', change: '+15%', icon: <Zap size={20} />, color: '#3b82f6' },
                    { title: 'Cost Per App', value: '$8.45', change: '-4%', icon: <DollarSign size={20} />, color: '#f59e0b' },
                    { title: 'ROI', value: '4.2x', change: '+0.4', icon: <TrendingUp size={20} />, color: '#8b5cf6' },
                ].map((stat, i) => (
                    <Col xs={24} sm={12} md={6} key={i}>
                        <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                            <Space direction="vertical" size={4}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ padding: '6px', backgroundColor: `${stat.color}15`, color: stat.color, borderRadius: '8px' }}>{stat.icon}</div>
                                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600 }}>{stat.title}</Text>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                    <Title level={3} style={{ margin: 0, fontWeight: 800 }}>{stat.value}</Title>
                                    <Text style={{ color: stat.change.startsWith('+') ? '#10b981' : '#ef4444', fontSize: '12px', fontWeight: 600 }}>{stat.change}</Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card title="Applications vs Revenue" style={{ borderRadius: '20px' }}>
                        <div style={{ height: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={campaignPerformance}>
                                    <defs>
                                        <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="apps" stroke="#3b82f6" fillOpacity={1} fill="url(#colorApps)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Daily Conversion Rate" style={{ borderRadius: '20px' }}>
                        <div style={{ height: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={conversionData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Bar dataKey="rate" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Card style={{ borderRadius: '20px', overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
                <Table pagination={false} dataSource={tableData} columns={columns} />
            </Card>
        </div>
    );
}
