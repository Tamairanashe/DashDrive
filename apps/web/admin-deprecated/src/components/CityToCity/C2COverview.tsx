import React from 'react';
import { Row, Col, Card, Statistic, Typography, Space, Progress } from 'antd';
import { 
    GlobalOutlined, 
    RiseOutlined, 
    EnvironmentOutlined, 
    SafetyCertificateOutlined,
    TeamOutlined,
    DollarOutlined,
    ClockCircleOutlined,
    SwapOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Title, Paragraph } = Typography;

const StatItem = ({ title, value, icon, color, suffix, trend }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
    >
        <Card variant="borderless" className="glass-card" style={{ borderRadius: 16 }}>
            <Statistic 
                title={<Text type="secondary" style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</Text>}
                value={value}
                suffix={suffix}
                prefix={<span style={{ color, marginRight: 12, fontSize: 24 }}>{icon}</span>}
                styles={{ content: { fontWeight: 800, color: '#1e293b', fontSize: 24 } }}
            />
            {trend && (
                <div style={{ marginTop: 8 }}>
                    <Text type={trend > 0 ? 'success' : 'danger'} style={{ fontSize: 12, fontWeight: 600 }}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12, marginLeft: 4 }}>from last week</Text>
                </div>
            )}
        </Card>
    </motion.div>
);

export const C2COverview: React.FC = () => {
    return (
        <div style={{ padding: '24px 0' }}>
            <Row gutter={[20, 20]}>
                <Col xs={24} sm={12} lg={6}>
                    <StatItem 
                        title="Active Routes" 
                        value={18} 
                        icon={<GlobalOutlined />} 
                        color="#3b82f6" 
                        trend={12} 
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatItem 
                        title="Live Trips" 
                        value={42} 
                        icon={<SwapOutlined />} 
                        color="#10b981" 
                        trend={5} 
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatItem 
                        title="Pending Offers" 
                        value={156} 
                        icon={<TeamOutlined />} 
                        color="#f59e0b" 
                        trend={24} 
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatItem 
                        title="Daily Revenue" 
                        value={4850} 
                        suffix="$" 
                        icon={<DollarOutlined />} 
                        color="#8b5cf6" 
                        trend={-2} 
                    />
                </Col>
            </Row>

            <Row gutter={[20, 20]} style={{ marginTop: 24 }}>
                <Col xs={24} lg={16}>
                    <Card variant="borderless" style={{ borderRadius: 20, height: '100%' }} title="Real-time Operational Snapshot">
                        <Row gutter={[24, 24]}>
                            <Col span={12}>
                                <div style={{ marginBottom: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text strong>Harare ↔ Bulawayo Demand</Text>
                                        <Tag color="cyan">High</Tag>
                                    </div>
                                    <Progress percent={92} strokeColor="#10b981" />
                                </div>
                                <div style={{ marginBottom: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text strong>Harare ↔ Mutare Demand</Text>
                                        <Tag color="blue">Moderate</Tag>
                                    </div>
                                    <Progress percent={65} strokeColor="#3b82f6" />
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text strong>Driver Availability</Text>
                                        <Text type="secondary">78% Active</Text>
                                    </div>
                                    <Progress percent={78} strokeColor="#f59e0b" />
                                </div>
                                <div style={{ marginBottom: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text strong>Completion Rate</Text>
                                        <Text type="secondary">Target 95%</Text>
                                    </div>
                                    <Progress percent={94.5} strokeColor="#8b5cf6" />
                                </div>
                            </Col>
                        </Row>
                        <div style={{ marginTop: 16, padding: 16, background: 'rgba(241, 245, 249, 0.5)', borderRadius: 12 }}>
                            <Space align="start">
                                <ClockCircleOutlined style={{ color: '#3b82f6', marginTop: 4 }} />
                                <div>
                                    <Text strong>Operational Insight:</Text>
                                    <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                                        Peak demand observed on Friday evenings for Harare-Bulawayo routes. Recommended to increase driver incentives between 16:00 and 19:00.
                                    </Paragraph>
                                </div>
                            </Space>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card variant="borderless" style={{ borderRadius: 20, height: '100%' }} title="Critical Health Metrics">
                        <Space orientation="vertical" size={24} style={{ width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Space>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <SafetyCertificateOutlined style={{ color: '#ef4444' }} />
                                    </div>
                                    <div>
                                        <Text strong style={{ display: 'block' }}>Safety Incidents</Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>Last 24 hours</Text>
                                    </div>
                                </Space>
                                <Title level={4} style={{ margin: 0, color: '#ef4444' }}>0</Title>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Space>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ClockCircleOutlined style={{ color: '#f59e0b' }} />
                                    </div>
                                    <div>
                                        <Text strong style={{ display: 'block' }}>Avg. Wait Time</Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>For driver offers</Text>
                                    </div>
                                </Space>
                                <Title level={4} style={{ margin: 0 }}>14m</Title>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Space>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <RiseOutlined style={{ color: '#10b981' }} />
                                    </div>
                                    <div>
                                        <Text strong style={{ display: 'block' }}>Price Variance</Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>Negotiated vs Base</Text>
                                    </div>
                                </Space>
                                <Title level={4} style={{ margin: 0 }}>+4.2%</Title>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

const Tag = ({ color, children }: any) => (
    <span style={{ 
        background: color === 'cyan' ? '#ecfeff' : '#eff6ff', 
        color: color === 'cyan' ? '#0891b2' : '#2563eb',
        padding: '2px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 600
    }}>
        {children}
    </span>
);
