import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Tabs, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Progress, 
  List, 
  Badge,
  Divider,
  Timeline,
  Alert
} from 'antd';
import { 
  RocketOutlined, 
  RiseOutlined, 
  UserAddOutlined, 
  DollarOutlined, 
  CheckCircleOutlined, 
  TrophyOutlined, 
  GiftOutlined, 
  ShareAltOutlined, 
  BankOutlined, 
  LineChartOutlined,
  NotificationOutlined,
  ThunderboltOutlined,
  CarOutlined,
  ShoppingOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export const GrowthEnginePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const summaryData = [
    { title: 'Active Campaigns', value: 8, icon: <RocketOutlined />, color: '#1890ff' },
    { title: 'Driver Rewards Issued', value: 9200, prefix: '$', icon: <TrophyOutlined />, color: '#52c41a' },
    { title: 'Customer Rewards Issued', value: 5600, prefix: '$', icon: <GiftOutlined />, color: '#722ed1' },
    { title: 'New Referrals', value: 320, icon: <UserAddOutlined />, color: '#faad14' },
  ];

  const driverTiers = [
    { tier: 'Standard', benefits: 'Basic rides', color: 'default' },
    { tier: 'Silver', benefits: '5% bonus earnings', color: 'blue' },
    { tier: 'Gold', benefits: '10% bonus earnings', color: 'gold' },
    { tier: 'Platinum', benefits: 'Priority dispatch', color: 'purple' },
    { tier: 'Diamond', benefits: 'Premium ride access', color: 'red' },
  ];

  const dashPointsRules = [
    { activity: 'Ride completed', points: 10 },
    { activity: 'Food order', points: 8 },
    { activity: 'Referral signup', points: 50 },
    { activity: 'Promo campaign', points: 20 },
  ];

  const activeCampaigns = [
    { id: 'CP-001', name: '100 trips Bonus', target: 'Drivers', reward: '$50', status: 'Active', conversion: '12%' },
    { id: 'CP-002', name: 'Weekend Surge', target: 'Drivers', reward: '$40', status: 'Active', conversion: '8%' },
    { id: 'CP-003', name: 'Free Ride Redeem', target: 'Customers', reward: 'Riders', status: 'Active', conversion: '15%' },
    { id: 'CP-004', name: 'Vehicle Loan Promo', target: 'Fintech', reward: 'Low Int', status: 'Draft', conversion: '-' },
  ];

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>DashDrive Growth Engine</Title>
          <Text type="secondary">Unified growth infrastructure for mobility, rewards, and fintech.</Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<LineChartOutlined />}>Growth Report</Button>
            <Button type="primary" icon={<ThunderboltOutlined />}>Launch Campaign</Button>
          </Space>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {summaryData.map((stat, index) => (
          <Col span={6} key={index}>
            <Card bordered={false} bodyStyle={{ padding: '20px 24px' }}>
              <Statistic 
                title={<Text type="secondary">{stat.title}</Text>} 
                value={stat.value} 
                prefix={stat.prefix ? stat.prefix : stat.icon}
                valueStyle={{ color: stat.color, fontWeight: 700 }}
              />
              <div style={{ marginTop: 8 }}>
                <Text type="success" size="small"><RiseOutlined /> +12%</Text> <Text type="secondary" size="small">vs last month</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          size="large"
          tabBarStyle={{ padding: '0 24px', marginBottom: 0 }}
          items={[
            {
              key: 'dashboard',
              label: <span><LineChartOutlined /> Overview</span>,
              children: (
                <div style={{ padding: 24 }}>
                   <Row gutter={24}>
                     <Col span={16}>
                        <Card title="Campaign Conversions" bordered size="small" style={{ marginBottom: 24 }}>
                          <Table 
                            dataSource={activeCampaigns} 
                            pagination={false}
                            rowKey="id"
                            size="small"
                            columns={[
                              { title: 'ID', dataIndex: 'id' },
                              { title: 'Campaign Name', dataIndex: 'name', render: (t) => <Text strong>{t}</Text> },
                              { title: 'Target', dataIndex: 'target', render: (t) => <Tag>{t}</Tag> },
                              { title: 'Status', dataIndex: 'status', render: (s) => <Badge status={s === 'Active' ? 'success' : 'default'} text={s} /> },
                              { title: 'Conversion', dataIndex: 'conversion' },
                            ]}
                          />
                        </Card>

                        <Row gutter={16}>
                          <Col span={12}>
                            <Card title="Referral Growth" bordered size="small">
                               <Progress type="dashboard" percent={75} strokeColor="#1890ff" />
                               <div style={{ textAlign: 'center', marginTop: -20 }}>
                                 <Text strong>Active Referrers</Text>
                                 <br />
                                 <Text type="secondary">320 / 500 Goal</Text>
                               </div>
                            </Card>
                          </Col>
                          <Col span={12}>
                            <Card title="Reward Usage" bordered size="small">
                               <Timeline 
                                  items={[
                                    { color: 'green', children: 'Driver John redeemed $50 (Trip Bonus)' },
                                    { color: 'blue', children: 'Customer Sarah redeemed Free Ride (600 pts)' },
                                    { color: 'gold', children: 'New Driver Referral Bonus issued (ID: 442)' },
                                  ]}
                               />
                            </Card>
                          </Col>
                        </Row>
                     </Col>
                     <Col span={8}>
                        <Card title="Growth Automations" bordered size="small">
                          <Alert 
                            message="Auto-Incentive Active" 
                            description="Bonus campaign triggered in Nairobi (Supply < Threshold)"
                            type="info"
                            showIcon
                            style={{ marginBottom: 16 }}
                          />
                          <List 
                            header={<Text strong>Active Rules</Text>}
                            dataSource={[
                              'Weekend Surge Multiplier (1.5x)',
                              'Dormant User Re-engagement',
                              'Peak Hour Driver Incentive'
                            ]}
                            renderItem={(item) => (
                              <List.Item>
                                 <Space><CheckCircleOutlined style={{ color: '#52c41a' }} /> {item}</Space>
                              </List.Item>
                            )}
                          />
                        </Card>
                     </Col>
                   </Row>
                </div>
              )
            },
            {
              key: 'drivers',
              label: <span><CarOutlined /> Driver Rewards</span>,
              children: (
                <div style={{ padding: 24 }}>
                   <Row gutter={24}>
                     <Col span={12}>
                        <Title level={5}>Loyalty Tiers</Title>
                        <Table 
                          dataSource={driverTiers}
                          pagination={false}
                          size="small"
                          columns={[
                            { title: 'Tier', dataIndex: 'tier', render: (t, r) => <Tag color={r.color}>{t}</Tag> },
                            { title: 'Benefits', dataIndex: 'benefits' },
                          ]}
                        />
                     </Col>
                     <Col span={12}>
                        <Title level={5}>Active Driver Incentives</Title>
                        <List 
                          itemLayout="horizontal"
                          dataSource={[
                            { title: '100 trips → $50 bonus', description: 'Progress: 42 drivers qualified' },
                            { title: 'Weekend bonus → $40', description: 'Starting Friday 6PM' },
                            { title: 'Peak hour incentive → $3 per ride', description: 'Active in CBD zones' },
                          ]}
                          renderItem={(item) => (
                            <List.Item actions={[<Button type="link">Edit</Button>]}>
                              <List.Item.Meta
                                avatar={<Badge status="processing" />}
                                title={item.title}
                                description={item.description}
                              />
                            </List.Item>
                          )}
                        />
                     </Col>
                   </Row>
                </div>
              )
            },
            {
              key: 'customers',
              label: <span><ShoppingOutlined /> Customer Loyalty</span>,
              children: (
                <div style={{ padding: 24 }}>
                   <Row gutter={24}>
                     <Col span={12}>
                        <Title level={5}>DashPoints Engine</Title>
                        <Table 
                          dataSource={dashPointsRules}
                          pagination={false}
                          size="small"
                          columns={[
                            { title: 'Activity', dataIndex: 'activity' },
                            { title: 'Points Earned', dataIndex: 'points', render: (p) => <Tag color="blue">+{p} pts</Tag> },
                          ]}
                        />
                     </Col>
                     <Col span={12}>
                        <Title level={5}>Redemption Catalog</Title>
                        <Row gutter={[8, 8]}>
                           {['Ride Discounts', 'Free Rides', 'Delivery Discounts', 'Insurance Offers', 'Loan Fee Discounts'].map(r => (
                             <Col span={12} key={r}>
                               <Card size="small" hoverable style={{ textAlign: 'center' }}>
                                 <Text strong>{r}</Text>
                               </Card>
                             </Col>
                           ))}
                        </Row>
                     </Col>
                   </Row>
                </div>
              )
            },
            {
              key: 'referrals',
              label: <span><ShareAltOutlined /> Referrals</span>,
              children: (
                <div style={{ padding: 24 }}>
                   <Alert 
                    message="Referral Status"
                    description="The driver referral bonus is currently $100 per successful recruitment. Rider referral is $10 per signup."
                    type="success"
                    showIcon
                    style={{ marginBottom: 24 }}
                   />
                   <Row gutter={24}>
                      <Col span={12}>
                        <Card title="Driver Referrals" size="small">
                          <Statistic title="Total Driver Referrals" value={1420} />
                          <Divider />
                          <Button block type="dashed">Adjust Bonus Amount</Button>
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card title="Rider Referrals" size="small">
                          <Statistic title="Total Rider Referrals" value={8540} />
                          <Divider />
                          <Button block type="dashed">Update Reward Credit</Button>
                        </Card>
                      </Col>
                   </Row>
                </div>
              )
            },
            {
              key: 'fintech',
              label: <span><BankOutlined /> Fintech Subs</span>,
              children: (
                <div style={{ padding: 24 }}>
                   <Title level={5}>Partner Promotions (Provider Portal Submissions)</Title>
                   <Table 
                    dataSource={[
                      { id: 1, partner: 'XYZ Bank', product: 'Vehicle Loan Campaign', status: 'Pending Review', date: '2026-03-09' },
                      { id: 2, partner: 'ABC Insurance', product: 'Passenger Travel Cover', status: 'Active', date: '2026-03-08' },
                      { id: 3, partner: 'FuelPay', product: 'Driver Fuel Credit Offer', status: 'Expired', date: '2026-02-28' },
                    ]}
                    pagination={false}
                    columns={[
                      { title: 'Partner', dataIndex: 'partner' },
                      { title: 'Product', dataIndex: 'product', render: (t) => <Text strong>{t}</Text> },
                      { title: 'Status', dataIndex: 'status', render: (s) => <Tag color={s === 'Active' ? 'green' : s === 'Pending Review' ? 'orange' : 'default'}>{s}</Tag> },
                      { title: 'Submitted', dataIndex: 'date' },
                      { title: 'Action', render: () => <Button size="small">Manage</Button> }
                    ]}
                   />
                </div>
              )
            }
          ]}
        />
      </Card>
    </div>
  );
};
