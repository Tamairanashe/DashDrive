import { Star, Zap, BarChart3, Package, TrendingUp, Info } from 'lucide-react';
import { Card, Typography, Button, Row, Col, Tag, Space, Tooltip as AntTooltip, Progress } from 'antd';
import { useEffect } from 'react';

const { Title, Text } = Typography;

const featuredItems = [
    {
        id: 'POL-001',
        name: 'Comprehensive Auto Policy',
        category: 'Automotive',
        placement: 'Driver App Home',
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=200&h=200',
        impressions: '12.4k',
        clicks: '842',
        conversion: 6.8,
        status: 'Active',
        performance: 'Top Tier'
    },
    {
        id: 'POL-004',
        name: 'Health Shield Platinum',
        category: 'Personal',
        placement: 'Customer Wallet',
        image: 'https://images.unsplash.com/photo-1505751172157-c72df58ea8df?auto=format&fit=crop&q=80&w=200&h=200',
        impressions: '8.2k',
        clicks: '412',
        conversion: 5.0,
        status: 'Active',
        performance: 'Stable'
    },
    {
        id: 'POL-012',
        name: 'SME Liability Insurance',
        category: 'Commercial',
        placement: 'Checkout Page',
        image: 'https://images.unsplash.com/photo-1454165833767-131435bb4496?auto=format&fit=crop&q=80&w=200&h=200',
        impressions: '15.1k',
        clicks: '1.2k',
        conversion: 8.2,
        status: 'Active',
        performance: 'Growing'
    }
];

export function FeaturedProducts({ token }: { token: string }) {
    useEffect(() => {
        console.log('Loading featured products with token:', token.substring(0, 5) + '...');
    }, [token]);

    const statCards = [
        { label: 'Total Impressions', value: '35.7k', icon: <BarChart3 size={18} />, color: '#1890ff', bg: '#e6f7ff' },
        { label: 'Policy Quotes', value: '2.4k', icon: <Zap size={18} />, color: '#faad14', bg: '#fffbe6' },
        { label: 'Retention Rate', value: '94.2%', icon: <Star size={18} />, color: '#52c41a', bg: '#f6ffed' },
        { label: 'Marketing Spend', value: '$420.00', icon: <Package size={18} />, color: '#722ed1', bg: '#f9f0ff' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Featured Policies</Title>
                    <Text type="secondary" style={{ fontSize: '14px' }}>Strategic placements for high-yield insurance products</Text>
                </div>
                <Button 
                    type="primary" 
                    icon={<Star size={18} />} 
                    size="large"
                    style={{ 
                        borderRadius: '12px', 
                        height: '46px', 
                        padding: '0 24px',
                        background: '#722ed1',
                        border: 'none',
                        boxShadow: '0 4px 10px rgba(114, 46, 209, 0.2)'
                    }}
                >
                    Feature New Policy
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                {statCards.map((stat, i) => (
                    <Col xs={24} sm={12} md={6} key={i}>
                        <Card 
                            bordered={false} 
                            style={{ 
                                borderRadius: '20px', 
                                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                                background: '#fff'
                            }}
                        >
                            <Space size={16}>
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
                                <div>
                                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500 }}>{stat.label}</Text>
                                    <Text style={{ fontSize: '20px', fontWeight: 700, display: 'block' }}>{stat.value}</Text>
                                </div>
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
                                borderRadius: '24px', 
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                overflow: 'hidden'
                            }}
                            bodyStyle={{ padding: 0 }}
                        >
                            <div style={{ position: 'relative', height: '160px' }}>
                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '16px', 
                                    right: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                    alignItems: 'flex-end'
                                }}>
                                    <Tag color="success" style={{ borderRadius: '8px', border: 'none', fontWeight: 700, margin: 0, padding: '4px 12px' }}>
                                        {item.status.toUpperCase()}
                                    </Tag>
                                    <Tag color="processing" style={{ borderRadius: '8px', border: 'none', fontWeight: 600, margin: 0, fontSize: '11px' }}>
                                        {item.placement}
                                    </Tag>
                                </div>
                            </div>
                            
                            <div style={{ padding: '24px' }}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>{item.category}</Text>
                                    <Title level={5} style={{ margin: '4px 0 0 0', fontWeight: 700, fontSize: '17px' }}>{item.name}</Title>
                                </div>

                                <div style={{ background: '#fafafa', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Space direction="vertical" size={2}>
                                                <Text type="secondary" style={{ fontSize: '11px' }}>Impressions</Text>
                                                <Text strong style={{ fontSize: '15px' }}>{item.impressions}</Text>
                                            </Space>
                                        </Col>
                                        <Col span={8}>
                                            <Space direction="vertical" size={2}>
                                                <Text type="secondary" style={{ fontSize: '11px' }}>Quotes</Text>
                                                <Text strong style={{ fontSize: '15px' }}>{item.clicks}</Text>
                                            </Space>
                                        </Col>
                                        <Col span={8} style={{ textAlign: 'right' }}>
                                            <Space direction="vertical" size={2}>
                                                <Text type="secondary" style={{ fontSize: '11px' }}>CVR</Text>
                                                <Text strong style={{ fontSize: '15px', color: '#52c41a' }}>{item.conversion}%</Text>
                                            </Space>
                                        </Col>
                                    </Row>
                                    <div style={{ marginTop: '12px' }}>
                                        <Progress 
                                            percent={item.conversion * 10} 
                                            showInfo={false} 
                                            strokeColor={{ '0%': '#1890ff', '100%': '#52c41a' }} 
                                            size="small"
                                        />
                                    </div>
                                </div>

                                <Space style={{ width: '100%' }}>
                                    <Button block style={{ borderRadius: '10px', height: '40px', fontWeight: 600 }}>
                                        Analytics
                                    </Button>
                                    <AntTooltip title="Product Settings">
                                        <Button icon={<Info size={18} color="#8c8c8c" />} style={{ borderRadius: '10px', height: '40px' }} />
                                    </AntTooltip>
                                </Space>
                            </div>
                        </Card>
                    </Col>
                ))}

                <Col xs={24} md={12} lg={8}>
                    <Card 
                        bordered={false} 
                        style={{ 
                            borderRadius: '24px', 
                            height: '100%', 
                            minHeight: '400px',
                            background: 'linear-gradient(145deg, #1f2937 0%, #111827 100%)', 
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                        }}
                        bodyStyle={{ padding: '32px' }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ 
                                width: '70px', 
                                height: '70px', 
                                backgroundColor: 'rgba(255,255,255,0.08)', 
                                borderRadius: '24px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                                color: '#faad14'
                            }}>
                                <TrendingUp size={36} />
                            </div>
                            <Title level={3} style={{ color: 'white', margin: '0 0 12px 0', fontWeight: 800 }}>Boost Visibility</Title>
                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', display: 'block', marginBottom: '32px', lineHeight: '1.6' }}>
                                Reach up to 3x more potential policyholders by boosting your top products on the driver home screen.
                            </Text>
                            <Button 
                                type="primary" 
                                size="large"
                                style={{ 
                                    borderRadius: '12px', 
                                    height: '50px', 
                                    padding: '0 32px', 
                                    background: '#faad14', 
                                    border: 'none',
                                    color: '#000',
                                    fontWeight: 700
                                }}
                            >
                                Start Boosting Now
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

