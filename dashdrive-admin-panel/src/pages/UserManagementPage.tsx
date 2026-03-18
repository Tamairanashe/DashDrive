import React, { useState, useEffect } from 'react';
import { 
  Typography, Row, Col, Card, Tabs, Space, 
  Tag
} from 'antd';
import { 
  WalletOutlined, CrownOutlined, TeamOutlined, PlusOutlined
} from '@ant-design/icons';

import { CustomerWalletManagement } from '../components/CustomerWalletManagement';
import { WalletBonusManagement } from '../components/WalletBonusManagement';
import { CustomerLevelManagement } from '../components/CustomerLevelManagement';
import { CustomerListPage } from './CustomerListPage';
import { useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

export const UserManagementPage: React.FC = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('1');

    useEffect(() => {
        // Map paths to tab keys
        const pathMap: Record<string, string> = {
            '/users/management': '1',
            '/users/customers': '1',
            '/users/tier-setup': '2',
            '/users/wallet': '4',
        };
        
        const currentPath = location.pathname;
        if (pathMap[currentPath]) {
            setActiveTab(pathMap[currentPath]);
        }
    }, [location.pathname]);

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={4} style={{ margin: 0 }}>Advanced User Management</Title>
                    <Text type="secondary">Manage customer growth, loyalty tiers, and wallets.</Text>
                </Col>
            </Row>

            <Card bordered={false} className="shadow-sm rounded-2xl">
                <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
                    <Tabs.TabPane tab={<span><TeamOutlined /> Customers</span>} key="1">
                        <CustomerListPage />
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><CrownOutlined /> Customer Levels</span>} key="2">
                        <CustomerLevelManagement />
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><WalletOutlined /> Customer Wallets</span>} key="4">
                        <CustomerWalletManagement />
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><Tag color="gold" style={{ border: 'none', margin: 0, padding: 0, background: 'transparent' }}><PlusOutlined /></Tag> Wallet Bonuses</span>} key="5">
                        <WalletBonusManagement />
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        </div>
    );
};
