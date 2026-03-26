import React, { useState } from 'react';
import { Typography, Row, Col, Card, Button, Space, Tabs, Tag, Badge } from 'antd';
import { 
    CompassOutlined, 
    GlobalOutlined, 
    ClockCircleOutlined,
    SafetyCertificateOutlined,
    DownloadOutlined,
    EnvironmentOutlined,
    ThunderboltOutlined,
    TeamOutlined,
    DollarOutlined,
    SecurityScanOutlined,
    SwapOutlined,
    CarOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

// Import Modular Components
import { C2COverview } from '../components/CityToCity/C2COverview';
import { RouteManager } from '../components/CityToCity/RouteManager';
import { RideRequestAndOffers } from '../components/CityToCity/RideRequestAndOffers';
import { ScheduledTripManager } from '../components/CityToCity/ScheduledTripManager';
import { C2CDriverManager } from '../components/CityToCity/C2CDriverManager';
import { LiveOperations } from '../components/CityToCity/LiveOperations';
import { FinancialManager } from '../components/CityToCity/FinanceManager';
import { C2CAdminSettings } from '../components/CityToCity/C2CAdminSettings';
import { DriverOfferManager } from '../components/CityToCity/DriverOfferManager';

const { Title, Text, Paragraph } = Typography;

export const CityToCityPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('1');

    const tabItems = [
        {
            key: '1',
            label: (
                <Space>
                    <GlobalOutlined />
                    <span>Real-time Dashboard</span>
                </Space>
            ),
            children: <C2COverview />,
        },
        {
            key: '2',
            label: (
                <Space>
                    <EnvironmentOutlined />
                    <span>Route Control</span>
                </Space>
            ),
            children: <RouteManager />,
        },
        {
            key: '3',
            label: (
                <Space>
                    <TeamOutlined />
                    <span>Negotiation Hub</span>
                    <Badge count={42} size="small" style={{ backgroundColor: '#3b82f6', marginLeft: 4 }} />
                </Space>
            ),
            children: <RideRequestAndOffers />,
        },
        {
            key: '4',
            label: (
                <Space>
                    <DollarOutlined />
                    <span>Bidding Stream</span>
                    <Badge count={3} status="error" size="small" offset={[5, -5]} />
                </Space>
            ),
            children: <DriverOfferManager />,
        },
        {
            key: '5',
            label: (
                <Space>
                    <ClockCircleOutlined />
                    <span>Scheduled Trips</span>
                </Space>
            ),
            children: <ScheduledTripManager />,
        },
        {
            key: '6',
            label: (
                <Space>
                    <CarOutlined />
                    <span>Inter-City Fleet</span>
                </Space>
            ),
            children: <C2CDriverManager />,
        },
        {
            key: '7',
            label: (
                <Space>
                    <SwapOutlined />
                    <span>Live Operations</span>
                    <Badge dot status="error" offset={[5, 0]} />
                </Space>
            ),
            children: <LiveOperations />,
        },
        {
            key: '8',
            label: (
                <Space>
                    <SecurityScanOutlined />
                    <span>Escrow & Finance</span>
                </Space>
            ),
            children: <FinancialManager />,
        },
        {
            key: '9',
            label: (
                <Space>
                    <SafetyCertificateOutlined />
                    <span>Security & Setup</span>
                </Space>
            ),
            children: <C2CAdminSettings />,
        },
    ];

    return (
        <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 24px 48px' }}>
            {/* Premium Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                    marginBottom: 32, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    padding: '24px 0',
                    borderBottom: '1px solid #f1f5f9'
                }}
            >
                <div>
                    <Space align="center" style={{ marginBottom: 4 }}>
                        <div style={{ 
                            width: 48, 
                            height: 48, 
                            borderRadius: 14, 
                            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                        }}>
                            <CompassOutlined style={{ color: 'white', fontSize: 24 }} />
                        </div>
                        <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-1.5px', fontSize: 32 }}>
                            City-to-City Hub
                        </Title>
                    </Space>
                    <Paragraph type="secondary" style={{ fontSize: 16, margin: 0, maxWidth: 600 }}>
                        Managing the regional transport marketplace, negotiation protocols, and long-distance logistics network.
                    </Paragraph>
                </div>
                <Space size="middle" style={{ marginTop: 8 }}>
                    <Button icon={<DownloadOutlined />}>Network Report</Button>
                    <Button 
                        type="primary" 
                        icon={<ThunderboltOutlined />} 
                        style={{ 
                            background: '#10b981', 
                            border: 'none', 
                            borderRadius: 8,
                            height: 40,
                            padding: '0 20px',
                            fontWeight: 600
                        }}
                    >
                        Optimize Capacity
                    </Button>
                </Space>
            </motion.div>

            {/* Modular Tab System */}
            <Card variant="borderless" className="glass-card" style={{ borderRadius: 24, padding: 0 }}>
                <Tabs 
                    activeKey={activeTab} 
                    onChange={setActiveTab}
                    items={tabItems}
                    className="premium-tabs"
                    style={{ padding: '0 20px' }}
                />
            </Card>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{ marginTop: 24 }}
                >
                    {tabItems.find(t => t.key === activeTab)?.children}
                </motion.div>
            </AnimatePresence>

            <footer style={{ marginTop: 48, textAlign: 'center' }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                    DashDrive City-to-City Logistics Engine v2.4 • System Status: <Badge status="success" text="Operational" />
                </Text>
            </footer>
        </div>
    );
};
