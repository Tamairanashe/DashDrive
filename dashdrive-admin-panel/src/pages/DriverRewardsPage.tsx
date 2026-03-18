import React, { useState } from 'react';
import { DriverRewards } from '../components/DriverRewards';
import { Tabs, Typography, Row, Col, Breadcrumb, Space, Button } from 'antd';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const DriverRewardsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Campaigns');

    const tabs = [
        { key: 'Campaigns', label: 'Bonus Campaigns' },
        { key: 'Global Settings', label: 'Global Settings' },
    ];

    return (
        <div style={{ maxWidth: 1600, margin: '0 auto', padding: '24px 24px 80px 24px' }}>
            {/* Breadcrumb & Header */}
            <Row justify="space-between" align="bottom" style={{ marginBottom: 32 }}>
                <Col>
                    <Breadcrumb style={{ marginBottom: 8, fontSize: 11 }}>
                        <Breadcrumb.Item>User Mgmt</Breadcrumb.Item>
                        <Breadcrumb.Item>Drivers</Breadcrumb.Item>
                        <Breadcrumb.Item>Rewards</Breadcrumb.Item>
                    </Breadcrumb>
                    <Title level={2} style={{ margin: 0, fontWeight: 900 }}>Driver Rewards</Title>
                    <Text type="secondary">High-intensity performance models and strategic incentives</Text>
                </Col>
                <Col>
                    <Space size="middle">
                        <Button icon={<DownloadOutlined />}>Export Stats</Button>
                        <Button type="primary" icon={<PlusOutlined />}>Create Campaign</Button>
                    </Space>
                </Col>
            </Row>

            <div style={{ marginBottom: 24 }}>
                <Tabs 
                  activeKey={activeTab} 
                  onChange={setActiveTab} 
                  items={tabs}
                  className="custom-tabs"
                />
            </div>
            <DriverRewards activeTab={activeTab} />
        </div>
    );
};
