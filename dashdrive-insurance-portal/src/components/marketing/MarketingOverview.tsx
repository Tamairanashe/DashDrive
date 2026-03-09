import {
    TrendingUp, Users,
    Star, Zap,
    MousePointer2,
    Megaphone
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell
} from 'recharts';
import { Card, Typography, Row, Col, Statistic, Spin, Space, Tag, Button } from 'antd';
import { AreaChart, Area } from 'recharts';

const { Title, Text } = Typography;

import { useState, useEffect } from 'react';
import { api } from '../../api';

export function MarketingOverview({ token }: { token: string }) {
    const [stats, setStats] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsData, impactData] = await Promise.all([
                api.marketing.getStats(token),
                api.marketing.getCampaignImpact ? await api.marketing.getCampaignImpact(token) : [
                    { name: 'Jan', policies: 400, premium: 24000 },
                    { name: 'Feb', policies: 300, premium: 13980 },
                    { name: 'Mar', policies: 200, premium: 98000 },
                    { name: 'Apr', policies: 278, premium: 39080 },
                    { name: 'May', policies: 189, premium: 48000 },
                    { name: 'Jun', policies: 239, premium: 38000 },
                ]
            ]);
            setStats(statsData);
            setChartData(impactData);
        } catch (err: any) {
            console.error('Failed to load marketing data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [token]);

    if (loading && !stats) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Spin size="large" tip="Loading Insights..." />
            </div>
        );
    }

    const statCards = [
        { label: 'Active Campaigns', value: 6, change: '+2', icon: <Megaphone size={18} />, color: '#722ed1', bg: '#f9f0ff' },
        { label: 'Total Impressions', value: 54000, change: '+12.5%', icon: <MousePointer2 size={18} />, color: '#1890ff', bg: '#e6f7ff' },
        { label: 'Applications Generated', value: 1200, change: '+18.2%', icon: <Zap size={18} />, color: '#faad14', bg: '#fffbe6' },
        { label: 'Conversions', value: 320, change: '+5.4%', icon: <Users size={18} />, color: '#52c41a', bg: '#f6ffed' },
        { label: 'Campaign Revenue', value: 48000, prefix: '$', change: '+22.1%', icon: <TrendingUp size={18} />, color: '#eb2f96', bg: '#fff0f6' },
    ];

    return (
        <div style={{ padding: '0 0 32px 0' }}>
            <Row gutter={[24, 24]}>
                {statCards.map((stat, i) => (
                    <Col xs={24} sm={12} lg={4.8} key={i} style={{ flex: '1 0 20%', maxWidth: '20%' }}>
                        <Card 
                            bordered={false} 
                            hoverable 
                            style={{ 
                                borderRadius: '20px', 
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                background: '#fff',
                                overflow: 'hidden'
                            }}
                            bodyStyle={{ padding: '24px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <div style={{ 
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: stat.bg, 
                                    color: stat.color, 
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {stat.icon}
                                </div>
                                <Tag color="success" style={{ borderRadius: '12px', border: 'none', fontWeight: 600, margin: 0 }}>
                                    {stat.change}
                                </Tag>
                            </div>
                            <Statistic 
                                title={<Text type="secondary" style={{ fontSize: '13px', fontWeight: 500 }}>{stat.label}</Text>}
                                value={stat.value}
                                precision={stat.prefix === '$' ? 0 : 0}
                                prefix={stat.prefix}
                                valueStyle={{ fontWeight: 700, fontSize: '28px', color: '#1f1f1f' }}
                            />
                            <div style={{ height: '40px', marginTop: '12px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData.slice(-4)}>
                                        <Area 
                                            type="monotone" 
                                            dataKey="policies" 
                                            stroke={stat.color} 
                                            fill={stat.bg} 
                                            strokeWidth={2}
                                            fillOpacity={0.6}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                ))}

                <Col xs={24} lg={16}>
                    <Card 
                        title={
                            <Space direction="vertical" size={0}>
                                <Title level={5} style={{ margin: 0 }}>Policy Performance Analytics</Title>
                                <Text type="secondary" style={{ fontSize: '12px', fontWeight: 400 }}>Overview of monthly incremental premium and policy count</Text>
                            </Space>
                        }
                        bordered={false} 
                        style={{ borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                        extra={
                            <Space>
                                <Button size="small">Daily</Button>
                                <Button size="small" type="primary">Monthly</Button>
                            </Space>
                        }
                    >
                        <div style={{ height: '350px', width: '100%', marginTop: '10px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#8c8c8c' }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#8c8c8c' }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f5f5f5' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="premium" radius={[6, 6, 0, 0]} barSize={40}>
                                        {chartData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#722ed1' : '#d6e4ff'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Space direction="vertical" size={24} style={{ width: '100%' }}>
                        <Card 
                            title={<Title level={5} style={{ margin: 0 }}>Active Boosters</Title>} 
                            bordered={false} 
                            style={{ borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                            bodyStyle={{ padding: '24px' }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[
                                    { name: 'Easter Special', boost: '2.4x', icon: <Zap size={16} />, color: '#faad14', bg: '#fffbe6' },
                                    { name: 'Weekend Surge', boost: '1.8x', icon: <Zap size={16} />, color: '#1890ff', bg: '#e6f7ff' },
                                    { name: 'New User Bonus', boost: '3.1x', icon: <Zap size={16} />, color: '#52c41a', bg: '#f6ffed' },
                                ].map((item, i) => (
                                    <div key={i} style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-between', 
                                        padding: '16px', 
                                        backgroundColor: '#fafafa', 
                                        borderRadius: '16px',
                                        transition: 'all 0.3s'
                                    }}>
                                        <Space size="middle">
                                            <div style={{ padding: '8px', background: item.bg, color: item.color, borderRadius: '8px' }}>
                                                {item.icon}
                                            </div>
                                            <Text strong style={{ fontSize: '14px' }}>{item.name}</Text>
                                        </Space>
                                        <Tag color={item.color} style={{ borderRadius: '8px', border: 'none', fontWeight: 700 }}>
                                            {item.boost} Boost
                                        </Tag>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card 
                            bordered={false} 
                            style={{ 
                                borderRadius: '24px', 
                                background: 'linear-gradient(135deg, #722ed1 0%, #2f54eb 100%)',
                                boxShadow: '0 4px 20px rgba(114, 46, 209, 0.2)'
                            }}
                            bodyStyle={{ padding: '24px' }}
                        >
                            <Space align="start" size={16}>
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    background: 'rgba(255,255,255,0.2)', 
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Star size={20} color="white" fill="white" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Text strong style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '4px' }}>Pro Strategy</Text>
                                    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', lineHeight: '1.5' }}>
                                        Boosted campaigns reach up to 30% more potential customers during peak insurance seasons.
                                    </Text>
                                    <Button ghost size="small" style={{ marginTop: '16px', borderRadius: '8px', borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>
                                        Learn More
                                    </Button>
                                </div>
                            </Space>
                        </Card>
                    </Space>
                </Col>
            </Row>
        </div>
    );
}

