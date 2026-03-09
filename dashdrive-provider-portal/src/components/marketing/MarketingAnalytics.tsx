import React from 'react';
import { Card, Typography, Row, Col, Space, Table, Tag } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Zap, DollarSign } from 'lucide-react';

const { Title, Text } = Typography;

const campaignPerformance = [
    { name: 'Jan', apps: 320, revenue: 18000 },
    { name: 'Feb', apps: 450, revenue: 25000 },
    { name: 'Mar', apps: 580, revenue: 32000 },
    { name: 'Apr', apps: 420, revenue: 21000 },
    { name: 'May', apps: 610, revenue: 35000 },
    { name: 'Jun', apps: 750, revenue: 42000 },
    { name: 'Jul', apps: 890, revenue: 51000 },
];

const conversionData = [
    { name: 'Mon', rate: 3.5 },
    { name: 'Tue', rate: 4.1 },
    { name: 'Wed', rate: 5.2 },
    { name: 'Thu', rate: 4.8 },
    { name: 'Fri', rate: 6.3 },
    { name: 'Sat', rate: 7.2 },
    { name: 'Sun', rate: 6.9 },
];

export function MarketingAnalytics({ token }: { token: string }) {
    const tableData = [
        { key: '1', campaign: 'SME Loan Drive', applications: 1540, cvr: '9.2%', revenue: '$154,000', status: 'High' },
        { key: '2', campaign: 'Fuel Credit Promo', applications: 2400, cvr: '15.5%', revenue: '$12,000', status: 'Excellent' },
        { key: '3', campaign: 'Asset Finance Launch', applications: 420, cvr: '6.8%', revenue: '$840,000', status: 'Steady' },
    ];

    const columns = [
        { title: 'Top Campaigns', dataIndex: 'campaign', key: 'campaign' },
        { title: 'Applications', dataIndex: 'applications', key: 'applications' },
        { title: 'CVR', dataIndex: 'cvr', key: 'cvr', render: (text: string) => <Tag color="green">{text}</Tag> },
        { title: 'Revenue (Disbursed)', dataIndex: 'revenue', key: 'revenue', render: (text: string) => <Text strong>{text}</Text> },
        { title: 'Performance', dataIndex: 'status', key: 'status' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>Campaign Analytics</Title>
                    <Text type="secondary">Track your lending product performance and conversion metrics.</Text>
                </div>
            </div>

            <Row gutter={[24, 24]}>
                {[
                    { title: 'Conversion Rate', value: '8.4%', change: '+2.1%', icon: <TrendingUp size={20} />, color: '#10b981' },
                    { title: 'Total Applications', value: '4,360', change: '+22%', icon: <Zap size={20} />, color: '#3b82f6' },
                    { title: 'CAC (Cost per App)', value: '$12.50', change: '-8%', icon: <DollarSign size={20} />, color: '#f59e0b' },
                    { title: 'ROI (Projected)', value: '6.5x', change: '+0.8', icon: <TrendingUp size={20} />, color: '#8b5cf6' },
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
                    <Card title="Applications Forecast" style={{ borderRadius: '20px' }}>
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
                    <Card title="Approval Success Rate" style={{ borderRadius: '20px' }}>
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
