import React, { useState } from 'react';
import { Typography, Tabs, Card, Row, Col, Statistic } from 'antd';
import { ShopOutlined, UnorderedListOutlined, TagOutlined, DollarOutlined, ClockCircleOutlined, GlobalOutlined, SettingOutlined } from '@ant-design/icons';
import { RestaurantManagement } from '../components/RestaurantManagement';
import { MenuManagement } from '../components/MenuManagement';
import { FoodOrders } from '../components/FoodOrders';
import { FoodServiceRules } from '../components/FoodServiceRules';

const { Title, Text } = Typography;

export const FoodDeliveryPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('restaurants');

    return (
        <div style={{ maxWidth: 1600, margin: '0 auto' }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Food Delivery Platform</Title>
                <Text type="secondary" style={{ fontSize: 15 }}>Manage restaurant operations, catalogs, and live food logistics.</Text>
            </div>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Live Orders" 
                            value={85} 
                            prefix={<UnorderedListOutlined style={{ color: '#1677ff' }} />} 
                            valueStyle={{ color: '#1677ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Active Restaurants" 
                            value={124} 
                            prefix={<ShopOutlined style={{ color: '#52c41a' }} />} 
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Pending Approval" 
                            value={18} 
                            prefix={<ClockCircleOutlined style={{ color: '#d97706' }} />} 
                            valueStyle={{ color: '#d97706' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Daily Revenue" 
                            value={4250.80} 
                            precision={2}
                            prefix={<DollarOutlined style={{ color: '#faad14' }} />} 
                            valueStyle={{ color: '#faad14' }}
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
                    <Tabs.TabPane tab={<span><ShopOutlined /> Restaurant Vendors</span>} key="restaurants">
                        <div style={{ padding: 24, minHeight: 'calc(100vh - 280px)' }}>
                            <RestaurantManagement />
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<span><TagOutlined /> Menus & Catalog</span>} key="menus">
                        <div style={{ padding: 24, minHeight: 'calc(100vh - 280px)' }}>
                            <MenuManagement />
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<span><UnorderedListOutlined /> Live Orders</span>} key="orders">
                        <div style={{ padding: 24, minHeight: 'calc(100vh - 280px)' }}>
                            <FoodOrders />
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<span><SettingOutlined /> Service Rules</span>} key="settings">
                        <div style={{ padding: 24, minHeight: 'calc(100vh - 280px)' }}>
                            <FoodServiceRules />
                        </div>
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        </div>
    );
};
