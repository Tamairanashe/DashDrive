import React, { useState } from 'react';
import { Typography, Tabs, Card, Row, Col, Statistic } from 'antd';
import { 
    BoxPlotOutlined, 
    UnorderedListOutlined, 
    AppstoreOutlined, 
    InboxOutlined, 
    SettingOutlined,
    PushpinOutlined,
    SafetyOutlined,
    CheckCircleOutlined,
    DollarOutlined
} from '@ant-design/icons';
import { ParcelOrders } from '../components/ParcelOrders';
import { ParcelCategories } from '../components/ParcelCategories';
import { ParcelWeights } from '../components/ParcelWeights';
import { ParcelAttributes } from '../components/ParcelAttributes';
import { ParcelServiceRules } from '../components/ParcelServiceRules';
import { ServiceConfigPage } from './ServiceConfigPage';

const { Title, Text } = Typography;

export const ParcelDeliveryPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('orders');

    return (
        <div style={{ maxWidth: 1600, margin: '0 auto', paddingBottom: 24 }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Parcel Delivery Service</Title>
                <Text type="secondary" style={{ fontSize: 15 }}>Manage courier dispatches, package categories, weight classes, and delivery rules.</Text>
            </div>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Pending Dispatches" 
                            value={24} 
                            prefix={<InboxOutlined style={{ color: '#1677ff' }} />} 
                            valueStyle={{ color: '#1677ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Total Weight (MT)" 
                            value={1.2} 
                            precision={1}
                            prefix={<BoxPlotOutlined style={{ color: '#52c41a' }} />} 
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Delivery Success" 
                            value={99.2} 
                            precision={1}
                            suffix="%" 
                            prefix={<CheckCircleOutlined style={{ color: '#faad14' }} />} 
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Vertical Revenue" 
                            value={1840.50} 
                            precision={2}
                            prefix={<DollarOutlined style={{ color: '#722ed1' }} />} 
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card bordered={false} className="shadow-sm" style={{ borderRadius: 16, overflow: 'hidden' }} styles={{ body: { padding: 0 } }}>
                <Tabs 
                    activeKey={activeTab} 
                    onChange={setActiveTab} 
                    size="large"
                    tabBarStyle={{ padding: '16px 24px 0 24px', margin: 0, background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}
                >
                    <Tabs.TabPane tab={<span><UnorderedListOutlined /> Live Dispatches</span>} key="orders">
                        <div style={{ padding: 24, minHeight: 'calc(100vh - 280px)' }}>
                            <ParcelOrders />
                        </div>
                    </Tabs.TabPane>
                    
                    <Tabs.TabPane tab={<span><AppstoreOutlined /> Categories</span>} key="categories">
                        <div style={{ padding: 24, minHeight: 'calc(100vh - 280px)' }}>
                            <ParcelCategories />
                        </div>
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><BoxPlotOutlined /> Attributes</span>} key="attributes">
                        <div style={{ padding: 24, minHeight: 'calc(100vh - 280px)' }}>
                            <ParcelAttributes />
                        </div>
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><InboxOutlined /> Weight Classes</span>} key="weights">
                        <div style={{ padding: 24, minHeight: 'calc(100vh - 280px)' }}>
                            <ParcelWeights />
                        </div>
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><SettingOutlined /> Service Rules</span>} key="settings">
                        <div style={{ padding: 24, minHeight: 'calc(100vh - 280px)' }}>
                             <ParcelServiceRules />
                        </div>
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        </div>
    );
};
