import React from 'react';
import { Card, Row, Col, Typography, Button, Space, Divider, List, Badge } from 'antd';
import { RocketOutlined, CrownOutlined, ThunderboltOutlined, CheckCircleFilled } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const packages = [
    {
        title: 'Starter',
        price: '$49',
        period: '/mo',
        description: 'Perfect for local agencies starting with digital lead generation.',
        icon: <RocketOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
        features: [
            'Basic Search Visibility',
            '2 Active Campaigns',
            'Monthly Portfolio Report',
            'Email Support'
        ],
        buttonText: 'Current Plan',
        isCurrent: true,
        color: '#1890ff'
    },
    {
        title: 'Professional',
        price: '$149',
        period: '/mo',
        description: 'Scale your portfolio with priority placements and automated outreach.',
        icon: <ThunderboltOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
        features: [
            'Priority Policy Placement',
            'Up to 10 Active Campaigns',
            'Real-time Risk Dashboard',
            'Custom Referral Links',
            'Broker Portal Access'
        ],
        buttonText: 'Upgrade to Pro',
        isCurrent: false,
        popular: true,
        color: '#52c41a'
    },
    {
        title: 'Elite',
        price: '$299',
        period: '/mo',
        description: 'Unmatched visibility and enterprise-grade marketing automation.',
        icon: <CrownOutlined style={{ fontSize: '32px', color: '#faad14' }} />,
        features: [
            'Top-of-Search Priority',
            'Unlimited Active Campaigns',
            'Full API Marketing Access',
            'Personal Account Manager',
            'Market Benchmarking Data',
            'White-label Reporting'
        ],
        buttonText: 'Go Elite',
        isCurrent: false,
        color: '#faad14'
    }
];

export const MarketingPackages: React.FC = () => {
    return (
        <div style={{ padding: '24px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <Title level={2}>Marketing Packages</Title>
                <Paragraph style={{ fontSize: '16px', color: '#8c8c8c' }}>
                    Choose a package that fits your growth strategy. Boost your visibility and attract more customers seamlessly.
                </Paragraph>
            </div>

            <Row gutter={[24, 24]} justify="center">
                {packages.map((pkg, index) => (
                    <Col xs={24} md={12} lg={8} key={index}>
                        <Badge.Ribbon text="MOST POPULAR" color="#ff4d4f" style={{ display: pkg.popular ? 'block' : 'none' }}>
                            <Card 
                                hoverable
                                style={{ 
                                    height: '100%', 
                                    borderRadius: '24px', 
                                    border: pkg.isCurrent ? `2px solid ${pkg.color}` : '1px solid #f0f0f0',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                                bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px' }}
                            >
                                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                    <div style={{ 
                                        width: '64px', 
                                        height: '64px', 
                                        lineHeight: '64px', 
                                        background: `${pkg.color}10`, 
                                        borderRadius: '16px', 
                                        margin: '0 auto 16px' 
                                    }}>
                                        {pkg.icon}
                                    </div>
                                    <Title level={3} style={{ margin: 0 }}>{pkg.title}</Title>
                                    <div style={{ marginTop: '8px' }}>
                                        <Text style={{ fontSize: '32px', fontWeight: 'bold' }}>{pkg.price}</Text>
                                        <Text type="secondary">{pkg.period}</Text>
                                    </div>
                                    <Paragraph style={{ marginTop: '16px', color: '#595959', minHeight: '44px' }}>
                                        {pkg.description}
                                    </Paragraph>
                                </div>

                                <Divider style={{ margin: '12px 0 24px' }} />

                                <div style={{ flex: 1 }}>
                                    <List
                                        dataSource={pkg.features}
                                        renderItem={(item) => (
                                            <List.Item style={{ border: 'none', padding: '8px 0' }}>
                                                <Space>
                                                    <CheckCircleFilled style={{ color: pkg.color }} />
                                                    <Text>{item}</Text>
                                                </Space>
                                            </List.Item>
                                        )}
                                    />
                                </div>

                                <Button 
                                    type={pkg.isCurrent ? 'default' : 'primary'}
                                    block 
                                    size="large"
                                    disabled={pkg.isCurrent}
                                    style={{ 
                                        marginTop: '32px', 
                                        height: '50px', 
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        backgroundColor: pkg.isCurrent ? '#f5f5f5' : pkg.color,
                                        borderColor: pkg.isCurrent ? '#d9d9d9' : pkg.color,
                                        color: pkg.isCurrent ? '#8c8c8c' : '#fff'
                                    }}
                                >
                                    {pkg.buttonText}
                                </Button>
                            </Card>
                        </Badge.Ribbon>
                    </Col>
                ))}
            </Row>

            <Card style={{ marginTop: '64px', borderRadius: '24px', background: '#fafafa', border: 'none' }}>
                <Row align="middle" gutter={32}>
                    <Col xs={24} md={18}>
                        <Title level={4} style={{ margin: 0 }}>Need a Custom Marketing Solution?</Title>
                        <Paragraph style={{ margin: '8px 0 0', color: '#595959' }}>
                            We offer tailored packages for large-scale operations with specific requirements. Contact our expert team for a consultation.
                        </Paragraph>
                    </Col>
                    <Col xs={24} md={6} style={{ textAlign: 'right' }}>
                        <Button size="large" style={{ borderRadius: '12px' }}>Contact Sales</Button>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};
