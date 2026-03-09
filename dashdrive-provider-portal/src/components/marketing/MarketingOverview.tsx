import {
    TrendingUp, Users,
    Zap,
    MousePointer2,
    Megaphone,
    ArrowUpRight,
    Search,
    Filter
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Card, Typography, Row, Col, Spin, Button, Space, Tag } from 'antd';
import { useState, useEffect } from 'react';
import { api } from '../../api';

const { Title, Text } = Typography;

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
                    { name: 'Jan', apps: 400, disbursed: 240000 },
                    { name: 'Feb', apps: 300, disbursed: 139800 },
                    { name: 'Mar', apps: 200, disbursed: 980000 },
                    { name: 'Apr', apps: 278, disbursed: 390800 },
                    { name: 'May', apps: 189, disbursed: 480000 },
                    { name: 'Jun', apps: 239, disbursed: 380000 },
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

    const statCards = [
        { label: 'Active Campaigns', value: '12', change: '+2', icon: <Megaphone size={18} />, color: '#722ed1', bg: '#f9f0ff' },
        { label: 'Total Impressions', value: '84.2k', change: '+12.5%', icon: <MousePointer2 size={18} />, color: '#1890ff', bg: '#e6f7ff' },
        { label: 'Apps Generated', value: '1,240', change: '+18.2%', icon: <Zap size={18} />, color: '#faad14', bg: '#fffbe6' },
        { label: 'Growth Depth', value: '94.2%', change: '+5.4%', icon: <TrendingUp size={18} />, color: '#52c41a', bg: '#f6ffed' },
        { label: 'Marketing ROI', value: '4.8x', change: '+22.1%', icon: <Users size={18} />, color: '#eb2f96', bg: '#fff0f6' },
    ];

    if (loading && !stats) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Spin size="large" tip="Orchestrating growth data..." />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '32px' }}>
            <Row gutter={[24, 24]}>
                {statCards.map((stat, i) => (
                    <Col xs={24} sm={12} md={4} lg={4} key={i} style={{ flex: '1 0 20%' }}>
                        <Card 
                            bordered={false} 
                            style={{ 
                                borderRadius: '24px', 
                                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                background: 'white',
                                height: '100%'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ 
                                    padding: '10px', 
                                    backgroundColor: stat.bg, 
                                    color: stat.color, 
                                    borderRadius: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {stat.icon}
                                </div>
                                <Tag color="success" style={{ 
                                    borderRadius: '8px', 
                                    border: 'none', 
                                    margin: 0, 
                                    fontWeight: 700,
                                    background: '#f6ffed',
                                    color: '#52c41a'
                                }}>
                                    {stat.change}
                                </Tag>
                            </div>
                            <Text type="secondary" style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                                {stat.label}
                            </Text>
                            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>{stat.value}</Title>
                            
                            <div style={{ height: '40px', width: '100%', marginTop: '16px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData.slice(-4)}>
                                        <Area 
                                            type="monotone" 
                                            dataKey="disbursed" 
                                            stroke={stat.color} 
                                            fill={stat.color} 
                                            fillOpacity={0.1} 
                                            strokeWidth={2} 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                ))}

                <Col xs={24} lg={16}>
                    <Card 
                        bordered={false} 
                        style={{ borderRadius: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                        title={
                            <div style={{ padding: '8px 0' }}>
                                <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Disbursement Growth</Title>
                                <Text type="secondary" style={{ fontSize: '14px' }}>Historical performance of marketing-driven volume</Text>
                            </div>
                        }
                        extra={
                            <Space>
                                <Button icon={<Search size={16} />} type="text" shape="circle" />
                                <Button icon={<Filter size={16} />} type="text" shape="circle" />
                                <Tag color="blue" style={{ borderRadius: '6px', fontWeight: 600 }}>Last 6 Months</Tag>
                            </Space>
                        }
                    >
                        <div style={{ height: '360px', width: '100%', marginTop: '16px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorDisbursed" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#1890ff" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#8c8c8c', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#8c8c8c', fontSize: 12 }}
                                        tickFormatter={(value) => `$${value/1000}k`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ fontWeight: 700 }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="disbursed" 
                                        stroke="#1890ff" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorDisbursed)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card 
                        bordered={false} 
                        style={{ borderRadius: '28px', height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                        title={
                            <div style={{ padding: '8px 0' }}>
                                <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Active Boosters</Title>
                                <Text type="secondary" style={{ fontSize: '14px' }}>Current high-visibility promotions</Text>
                            </div>
                        }
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { name: 'Driver Referral Boost', impact: '+42%', color: '#52c41a', icon: <ArrowUpRight size={18} /> },
                                { name: 'New Markets Entry', impact: '+28%', color: '#1890ff', icon: <ArrowUpRight size={18} /> },
                                { name: 'Flash Rewards', impact: '+15%', color: '#faad14', icon: <ArrowUpRight size={18} /> },
                            ].map((item, i) => (
                                <div key={i} style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between', 
                                    padding: '20px', 
                                    backgroundColor: '#fafafa', 
                                    borderRadius: '20px',
                                    border: '1px solid #f0f0f0'
                                }}>
                                    <Space size={12}>
                                        <div style={{ color: item.color }}>{item.icon}</div>
                                        <Text strong style={{ fontSize: '15px' }}>{item.name}</Text>
                                    </Space>
                                    <Text strong style={{ color: item.color, fontSize: '16px' }}>{item.impact}</Text>
                                </div>
                            ))}
                            
                            <div style={{ 
                                marginTop: '8px', 
                                padding: '24px', 
                                background: 'linear-gradient(135deg, #1d39c4 0%, #002329 100%)', 
                                borderRadius: '24px',
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1 }}>
                                    <Zap size={100} color="white" />
                                </div>
                                <Space direction="vertical" size={12} style={{ position: 'relative', zIndex: 1 }}>
                                    <Text strong style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', textTransform: 'uppercase' }}>Growth Insight</Text>
                                    <Text style={{ color: 'white', fontSize: '15px', fontWeight: 600, display: 'block' }}>
                                        Targeted campaigns are performing 3x better than general outreach.
                                    </Text>
                                    <Button ghost size="small" style={{ borderRadius: '6px', marginTop: '4px' }}>View Analysis</Button>
                                </Space>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

