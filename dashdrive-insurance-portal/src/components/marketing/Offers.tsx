import {
    Tag as TagIcon, Plus, MoreHorizontal, Calendar, Zap, Gift
} from 'lucide-react';
import { Card, Typography, Button, Row, Col, Tag, Progress, Space, Avatar, Dropdown } from 'antd';
import { useState, useEffect } from 'react';

const { Title, Text } = Typography;

export function Offers({ token }: { token: string }) {
    const [couponList, setCouponList] = useState<any[]>([]);
    
    const loadCoupons = async () => {
        const data = [
            { id: 'OFF-001', code: 'RENEW20', product: 'Auto Insurance', discount: '20% Off Premium', type: 'Renewal', usage: 450, total: 1000, expiry: '2026-12-31', status: 'Active', color: 'blue' },
            { id: 'OFF-002', code: 'CASHBACK50', product: 'Life Insurance', discount: '$50 Cashback', type: 'Cashback', usage: 120, total: 500, expiry: '2026-06-30', status: 'Active', color: 'green' },
            { id: 'OFF-003', code: 'WAIVEFEE', product: 'Home Insurance', discount: '$0 Processing Fee', type: 'Fee Waiver', usage: 85, total: 200, expiry: '2026-03-31', status: 'Active', color: 'purple' },
        ];
        setCouponList(data);
    };

    useEffect(() => {
        loadCoupons();
    }, [token]);

    const menuItems = [
        { key: 'edit', label: 'Edit Incentive' },
        { key: 'stats', label: 'View Analytics' },
        { key: 'pause', label: 'Pause Campaign', danger: true },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Policy Incentives</Title>
                    <Text type="secondary" style={{ fontSize: '14px' }}>Strategic rewards to drive renewals and higher coverage depth</Text>
                </div>
                <Button 
                    type="primary" 
                    icon={<Plus size={18} />} 
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
                    New Incentive
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                {couponList.map((offer) => (
                    <Col xs={24} md={12} lg={8} key={offer.id}>
                        <Card 
                            hoverable 
                            bordered={false} 
                            style={{ 
                                borderRadius: '24px', 
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                overflow: 'hidden'
                            }}
                            bodyStyle={{ padding: '24px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <Avatar 
                                    shape="square" 
                                    size={48} 
                                    style={{ 
                                        backgroundColor: offer.color === 'blue' ? '#e6f7ff' : offer.color === 'green' ? '#f6ffed' : '#f9f0ff',
                                        borderRadius: '14px'
                                    }}
                                    icon={<TagIcon size={24} color={offer.color === 'blue' ? '#1890ff' : offer.color === 'green' ? '#52c41a' : '#722ed1'} />}
                                />
                                <div style={{ textAlign: 'right' }}>
                                    <Tag color={offer.color} style={{ borderRadius: '8px', border: 'none', fontWeight: 700, margin: 0, fontSize: '11px' }}>
                                        {offer.type.toUpperCase()}
                                    </Tag>
                                    <div style={{ marginTop: '8px' }}>
                                        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                                            <Button type="text" shape="circle" icon={<MoreHorizontal size={18} color="#8c8c8c" />} />
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <Title level={4} style={{ margin: '0 0 4px 0', letterSpacing: '0.05em' }}>{offer.code}</Title>
                                <Text strong style={{ fontSize: '14px', color: '#595959' }}>{offer.product}</Text>
                            </div>

                            <div style={{ 
                                padding: '16px', 
                                background: '#fafafa', 
                                borderRadius: '16px', 
                                marginBottom: '24px',
                                border: '1px solid #f0f0f0'
                            }}>
                                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Zap size={16} color="#52c41a" fill="#52c41a" />
                                        <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>{offer.discount}</Text>
                                    </div>
                                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>Redemption Progress</Text>
                                            <Text strong style={{ fontSize: '12px' }}>{offer.usage} / {offer.total}</Text>
                                        </div>
                                        <Progress 
                                            percent={Math.round((offer.usage / offer.total) * 100)} 
                                            strokeColor={offer.color === 'blue' ? '#1890ff' : offer.color === 'green' ? '#52c41a' : '#722ed1'}
                                            showInfo={false}
                                            size="small"
                                        />
                                    </Space>
                                </Space>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Space size={4} style={{ color: '#8c8c8c' }}>
                                    <Calendar size={14} />
                                    <Text type="secondary" style={{ fontSize: '12px' }}>Ends {offer.expiry}</Text>
                                </Space>
                                <Button type="link" style={{ padding: 0, fontWeight: 600 }}>Performance</Button>
                            </div>
                        </Card>
                    </Col>
                ))}

                <Col xs={24} md={12} lg={8}>
                    <div style={{ 
                        height: '100%', 
                        minHeight: '280px',
                        border: '2px dashed #d9d9d9', 
                        borderRadius: '24px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '16px',
                        padding: '24px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        backgroundColor: '#fafafa'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#722ed1';
                        e.currentTarget.style.backgroundColor = '#f9f0ff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#d9d9d9';
                        e.currentTarget.style.backgroundColor = '#fafafa';
                    }}
                    >
                        <div style={{ 
                            width: '56px', 
                            height: '56px', 
                            backgroundColor: '#fff', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            color: '#bfbfbf'
                        }}>
                            <Plus size={28} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Text strong style={{ display: 'block', fontSize: '16px', color: '#595959' }}>New Incentive</Text>
                            <Text type="secondary" style={{ fontSize: '13px' }}>Create a targeted reward</Text>
                        </div>
                    </div>
                </Col>
            </Row>

            <div style={{ 
                marginTop: '16px',
                padding: '32px', 
                background: 'linear-gradient(135deg, #00474f 0%, #006d75 100%)', 
                borderRadius: '28px', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 10px 30px rgba(0, 71, 79, 0.15)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1 }}>
                    <Gift size={200} color="white" />
                </div>
                
                <Row gutter={48} align="middle" style={{ width: '100%', zIndex: 1 }}>
                    <Col xs={24} md={18}>
                        <Space direction="vertical" size={12}>
                            <Tag color="cyan" style={{ borderRadius: '6px', fontWeight: 700, border: 'none' }}>INSIDER TIP</Tag>
                            <Title level={3} style={{ color: 'white', margin: 0, fontWeight: 800 }}>Boost Retention Strategy</Title>
                            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', display: 'block', maxWidth: '600px' }}>
                                Insurers using dynamic renewal incentives report a <strong>42% increase</strong> in customer lifetime value over standard policies.
                            </Text>
                        </Space>
                    </Col>
                    <Col xs={24} md={6} style={{ textAlign: 'right' }}>
                        <Button 
                            ghost 
                            size="large" 
                            style={{ 
                                borderRadius: '12px', 
                                height: '50px', 
                                padding: '0 32px', 
                                fontWeight: 700,
                                borderColor: 'rgba(255,255,255,0.4)'
                            }}
                        >
                            View Guide
                        </Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

