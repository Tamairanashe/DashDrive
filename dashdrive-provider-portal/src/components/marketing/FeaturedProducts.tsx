import { Star, Zap, BarChart3, Package, TrendingUp, MoreHorizontal, Layout } from 'lucide-react';
import { Card, Typography, Button, Row, Col, Tag, Space, Dropdown, Progress, Statistic } from 'antd';
import { useEffect } from 'react';

const { Title, Text } = Typography;

const featuredItems = [
    {
        id: 'LOAN-001',
        name: 'Asset Finance Plus',
        category: 'Asset Finance',
        placement: 'Driver App Home',
        image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&q=80&w=200&h=200',
        impressions: 12400,
        clicks: 842,
        conversion: 6.8,
        status: 'Featured',
        color: '#722ed1'
    },
    {
        id: 'LOAN-004',
        name: 'Business Working Capital',
        category: 'Commercial',
        placement: 'Customer Wallet',
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=200&h=200',
        impressions: 8200,
        clicks: 412,
        conversion: 5.0,
        status: 'Featured',
        color: '#1890ff'
    },
    {
        id: 'LOAN-012',
        name: 'Fleet Leasing Solution',
        category: 'Leasing',
        placement: 'Checkout Page',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=200&h=200',
        impressions: 15100,
        clicks: 1200,
        conversion: 8.2,
        status: 'Featured',
        color: '#13c2c2'
    }
];

export function FeaturedProducts({ token }: { token: string }) {
    useEffect(() => {
        console.log('Loading featured products');
    }, [token]);

    const statCards = [
        { label: 'Total Impressions', value: '35.7k', icon: <BarChart3 size={20} />, color: '#1890ff', bg: '#e6f7ff' },
        { label: 'Applications', value: '2.4k', icon: <Zap size={20} />, color: '#faad14', bg: '#fffbe6' },
        { label: 'Approval Rate', value: '64.7%', icon: <Star size={20} />, color: '#52c41a', bg: '#f6ffed' },
        { label: 'Marketing Spend', value: '$420.00', icon: <Package size={20} />, color: '#722ed1', bg: '#f9f0ff' },
    ];

    const menuItems = [
        { key: 'edit', label: 'Edit Placement' },
        { key: 'analytics', label: 'Full Report' },
        { key: 'remove', label: 'End Promotion', danger: true },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={3} style={{ margin: 0, fontWeight: 800 }}>Featured Placements</Title>
                    <Text type="secondary" style={{ fontSize: '15px' }}>Strategic product promotion across the DashDrive ecosystem</Text>
                </div>
                <Button 
                    type="primary" 
                    icon={<Star size={18} />} 
                    size="large"
                    style={{ 
                        borderRadius: '12px', 
                        height: '48px', 
                        padding: '0 24px',
                        background: '#722ed1',
                        border: 'none',
                        boxShadow: '0 4px 10px rgba(114, 46, 209, 0.2)'
                    }}
                >
                    Feature New Loan
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                {statCards.map((stat, i) => (
                    <Col xs={24} sm={12} md={6} key={i}>
                        <Card bordered={false} style={{ borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                            <Space size={16} align="start">
                                <div style={{ 
                                    padding: '12px', 
                                    backgroundColor: stat.bg, 
                                    color: stat.color, 
                                    borderRadius: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {stat.icon}
                                </div>
                                <Statistic 
                                    title={<Text type="secondary" style={{ fontSize: '12px', fontWeight: 600 }}>{stat.label}</Text>}
                                    value={stat.value}
                                    valueStyle={{ fontWeight: 800, fontSize: '20px' }}
                                />
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[24, 24]}>
                {featuredItems.map((item) => (
                    <Col xs={24} md={12} lg={8} key={item.id}>
                        <Card 
                            hoverable 
                            bordered={false} 
                            style={{ 
                                borderRadius: '28px', 
                                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                overflow: 'hidden'
                            }}
                            bodyStyle={{ padding: 0 }}
                        >
                            <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ 
                                    position: 'absolute', 
                                    top: 0, 
                                    left: 0, 
                                    right: 0, 
                                    bottom: 0, 
                                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)' 
                                }} />
                                <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                                    <Tag color="green" style={{ borderRadius: '8px', border: 'none', fontWeight: 700, margin: 0 }}>
                                        {item.status.toUpperCase()}
                                    </Tag>
                                </div>
                                <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
                                    <Tag color="blue" style={{ borderRadius: '6px', border: 'none', fontSize: '11px', fontWeight: 600 }}>
                                        <Space size={4}><Layout size={10} />{item.placement}</Space>
                                    </Tag>
                                </div>
                            </div>
                            
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <div>
                                        <Title level={5} style={{ margin: 0, fontWeight: 700 }}>{item.name}</Title>
                                        <Text type="secondary" style={{ fontSize: '13px' }}>{item.category}</Text>
                                    </div>
                                    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                                        <Button type="text" shape="circle" icon={<MoreHorizontal size={18} color="#8c8c8c" />} />
                                    </Dropdown>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '20px' }}>
                                    <div style={{ background: '#fafafa', padding: '12px', borderRadius: '16px' }}>
                                        <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>Impressions</Text>
                                        <Text strong style={{ fontSize: '14px' }}>{item.impressions.toLocaleString()}</Text>
                                    </div>
                                    <div style={{ background: '#fafafa', padding: '12px', borderRadius: '16px' }}>
                                        <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>Clicks</Text>
                                        <Text strong style={{ fontSize: '14px' }}>{item.clicks.toLocaleString()}</Text>
                                    </div>
                                    <div style={{ background: '#f6ffed', padding: '12px', borderRadius: '16px' }}>
                                        <Text style={{ fontSize: '11px', display: 'block', marginBottom: '4px', color: '#52c41a' }}>CVR</Text>
                                        <Text strong style={{ fontSize: '14px', color: '#52c41a' }}>{item.conversion}%</Text>
                                    </div>
                                </div>

                                <div style={{ marginTop: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <Text strong style={{ fontSize: '12px' }}>Target Reach Velocity</Text>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>{Math.round(item.clicks/item.impressions*100)}% Momentum</Text>
                                    </div>
                                    <Progress percent={Math.round(item.clicks/item.impressions*1000)} showInfo={false} strokeColor={item.color} size="small" />
                                </div>

                                <Button block size="large" style={{ marginTop: '24px', borderRadius: '12px', fontWeight: 600, height: '42px' }}>
                                    Optimize Placement
                                </Button>
                            </div>
                        </Card>
                    </Col>
                ))}

                <Col xs={24} md={12} lg={8}>
                    <Card 
                        bordered={false} 
                        style={{ 
                            borderRadius: '28px', 
                            height: '100%', 
                            minHeight: '440px',
                            background: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)', 
                            color: 'white',
                            display: 'flex',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        bodyStyle={{ 
                            padding: '40px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1 }}>
                            <Star size={300} color="white" />
                        </div>
                        
                        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                            <div style={{ 
                                width: '80px', 
                                height: '80px', 
                                background: 'rgba(255,255,255,0.1)', 
                                borderRadius: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <TrendingUp size={40} color="#722ed1" />
                            </div>
                            <Title level={3} style={{ color: 'white', margin: '0 0 12px 0', fontWeight: 800 }}>Boost Visibility</Title>
                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', display: 'block', marginBottom: '32px', lineHeight: 1.6 }}>
                                Reach up to <strong>300% more borrowers</strong> by featuring your top loan products in high-intent conversion zones.
                            </Text>
                            <Button 
                                type="primary" 
                                size="large"
                                style={{ 
                                    borderRadius: '12px', 
                                    height: '50px', 
                                    padding: '0 32px',
                                    fontWeight: 700,
                                    background: '#722ed1',
                                    border: 'none',
                                    boxShadow: '0 10px 20px rgba(114, 46, 209, 0.3)'
                                }}
                            >
                                Start Boosting
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

