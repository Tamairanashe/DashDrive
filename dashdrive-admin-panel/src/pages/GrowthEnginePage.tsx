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
  Alert,
  Form,
  Select,
  InputNumber,
  Slider,
  Switch
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
  ShoppingOutlined,
  ExperimentOutlined,
  SafetyOutlined,
  SettingOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { OfferMatchingEngine, FinancialProduct, UserProfile, MatchingResult, EngineConfig, DEFAULT_ENGINE_CONFIG } from '../utils/OfferMatchingEngine';

const { Title, Text } = Typography;

export const GrowthEnginePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [engineConfig, setEngineConfig] = useState<EngineConfig>(DEFAULT_ENGINE_CONFIG);
  const [simulationResults, setSimulationResults] = useState<MatchingResult[]>([]);

  const mockProducts: FinancialProduct[] = [
    {
      id: 'P-001', name: 'Premium Vehicle Loan', provider: 'XYZ Bank', type: 'Loan', interestRate: 9, maxAmount: 15000,
      partnerPriority: 8, revenuePotential: 9, approvalProbability: 0.85, estimatedCommission: 150,
      thresholds: { minEarnings: 800, minRating: 4.5, minAccountAge: 12, userType: 'Driver', minCreditScore: 650 }
    },
    {
      id: 'P-002', name: 'Micro-Fuel Credit', provider: 'FuelPay', type: 'Credit', maxAmount: 500,
      partnerPriority: 6, revenuePotential: 4, approvalProbability: 0.95, estimatedCommission: 15,
      thresholds: { minEarnings: 200, minRating: 4.0, userType: 'Driver' }
    },
    {
      id: 'P-003', name: 'Rider Insurance Bundle', provider: 'ABC Insurance', type: 'Insurance',
      partnerPriority: 5, revenuePotential: 3, approvalProbability: 0.99, estimatedCommission: 5,
      thresholds: { userType: 'Customer' }
    },
    {
      id: 'P-004', name: 'Gold Tier Personal Loan', provider: 'FinCap', type: 'Loan', interestRate: 12, maxAmount: 5000,
      partnerPriority: 7, revenuePotential: 7, approvalProbability: 0.65, estimatedCommission: 80,
      thresholds: { minEarnings: 1000, minAccountAge: 6, userType: 'Both', minCreditScore: 700 }
    }
  ];

  const handleSimulate = (values: any) => {
    const user: UserProfile = {
      id: 'SIM-001',
      name: 'Simulator User',
      type: values.type,
      earnings: values.earnings,
      rating: values.rating,
      tripVolume: values.trips,
      accountAgeMonths: values.age,
      location: 'Harare',
      creditScore: values.creditScore || 700,
      fraudFlags: values.fraudFlags || 0
    };

    const results = OfferMatchingEngine.rankOffers(user, mockProducts, engineConfig);
    setSimulationResults(results);
  };

  const handleWeightChange = (key: keyof EngineConfig['weights'], value: number) => {
    setEngineConfig({
      ...engineConfig,
      weights: {
        ...engineConfig.weights,
        [key]: value
      }
    });
  };

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
                <Text type="success" style={{ fontSize: 12 }}><RiseOutlined /> +12%</Text> <Text type="secondary" style={{ fontSize: 12 }}>vs last month</Text>
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
              key: 'engine-config',
              label: <span><SettingOutlined /> Engine Config</span>,
              children: (
                <div style={{ padding: 24 }}>
                  <Row gutter={24}>
                    <Col span={16}>
                      <Card title={
                        <div>
                          <Text strong style={{ fontSize: 16 }}>Global Weighting Controls</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>Adjust how the engine ranks offers in real-time.</Text>
                        </div>
                      }>
                        <div style={{ marginBottom: 32 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text strong>Approval Probability Weight</Text>
                            <Tag color="blue">{engineConfig.weights.approvalProbability}%</Tag>
                          </div>
                          <Slider 
                            value={engineConfig.weights.approvalProbability} 
                            onChange={(val) => handleWeightChange('approvalProbability', val)}
                            marks={{ 0: 'Organic', 50: 'Balanced', 100: 'Safe' }}
                          />
                          <Text type="secondary" style={{ fontSize: 12 }}>Prioritize offers with the highest likelihood of conversion.</Text>
                        </div>

                        <div style={{ marginBottom: 32 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text strong>Commission Value Weight</Text>
                            <Tag color="green">{engineConfig.weights.commissionValue}%</Tag>
                          </div>
                          <Slider 
                            value={engineConfig.weights.commissionValue} 
                            onChange={(val) => handleWeightChange('commissionValue', val)}
                            marks={{ 0: 'Service', 50: 'Optimized', 100: 'Revenue' }}
                          />
                          <Text type="secondary" style={{ fontSize: 12 }}>Prioritize offers that generate higher revenue for DashDrive.</Text>
                        </div>

                        <div style={{ marginBottom: 32 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text strong>User Relevance Weight</Text>
                            <Tag color="orange">{engineConfig.weights.userRelevance}%</Tag>
                          </div>
                          <Slider 
                            value={engineConfig.weights.userRelevance} 
                            onChange={(val) => handleWeightChange('userRelevance', val)}
                            marks={{ 0: 'Broad', 50: 'Targeted', 100: 'Hyper-Local' }}
                          />
                          <Text type="secondary" style={{ fontSize: 12 }}>Match offers strictly based on user profile and behavior.</Text>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text strong>Partner Priority (Boost)</Text>
                            <Tag color="purple">{engineConfig.weights.partnerPriority}%</Tag>
                          </div>
                          <Slider 
                            value={engineConfig.weights.partnerPriority} 
                            onChange={(val) => handleWeightChange('partnerPriority', val)}
                            marks={{ 0: 'Fair', 50: 'Weighted', 100: 'Sponsored' }}
                          />
                          <Text type="secondary" style={{ fontSize: 12 }}>Influence rankings based on strategic partner agreements.</Text>
                        </div>
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card title="Risk Controls" style={{ marginBottom: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                          <Text strong>Fraud Filtering</Text>
                          <Switch defaultChecked />
                        </div>
                        <div style={{ marginBottom: 24 }}>
                          <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>Fraud Flag Threshold</Text>
                          <InputNumber 
                            min={0} max={100} value={engineConfig.riskThreshold} 
                            onChange={(val) => setEngineConfig({...engineConfig, riskThreshold: val || 80})}
                            style={{ width: '100%' }}
                            suffix="%"
                          />
                        </div>
                        <Alert 
                          message="High Risk Exclusion" 
                          description="Users exceeding this threshold will see limited/no high-value loan products."
                          type="warning"
                          showIcon
                        />
                      </Card>

                      <Card title="Seasonal Boosts" size="small">
                        <Button block type="dashed" style={{ marginBottom: 12 }}>Add Event Trigger</Button>
                        <Timeline 
                          items={[
                            { color: 'blue', children: 'Back to School - Microloan Boost (Active)' },
                            { color: 'gray', children: 'Rainy Season - Insurance Boost (Scheduled)' },
                          ]}
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
              key: 'simulator',
              label: <span><ExperimentOutlined /> Offer Simulator</span>,
              children: (
                <div style={{ padding: 24 }}>
                  <Row gutter={24}>
                    <Col span={8}>
                      <Card title="Simulation Parameters" size="small">
                        <Form layout="vertical" initialValues={{ type: 'Driver', earnings: 1000, rating: 4.8, trips: 500, age: 12, creditScore: 720, fraudFlags: 0 }} onValuesChange={(_, all) => handleSimulate(all)}>
                          <Form.Item name="type" label="User Type">
                            <Select options={[{ label: 'Driver', value: 'Driver' }, { label: 'Customer', value: 'Customer' }]} />
                          </Form.Item>
                          <Row gutter={16}>
                            <Col span={12}>
                              <Form.Item name="earnings" label="Earnings ($)">
                                <InputNumber style={{ width: '100%' }} />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item name="rating" label="Rating">
                                <InputNumber step={0.1} max={5} style={{ width: '100%' }} />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={16}>
                            <Col span={12}>
                              <Form.Item name="age" label="Account Age">
                                <InputNumber style={{ width: '100%' }} />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item name="creditScore" label="Credit Score">
                                <InputNumber style={{ width: '100%' }} />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Form.Item name="fraudFlags" label="Fraud Risk Score (0-100)">
                             <Slider />
                          </Form.Item>
                          <Button type="primary" block onClick={() => handleSimulate({ type: 'Driver', earnings: 1000, rating: 4.8, trips: 500, age: 12, creditScore: 720, fraudFlags: 0 })}>Refresh Rankings</Button>
                        </Form>
                      </Card>
                    </Col>
                    <Col span={16}>
                      <Card title="Live Marketplace Rankings" extra={<Text type="secondary">Based on current weighting logic</Text>} size="small">
                        <Table 
                          dataSource={simulationResults}
                          pagination={false}
                          size="small"
                          rowKey={(r) => r.product.id}
                          columns={[
                            { 
                              title: 'Rank / Product', 
                              render: (_, r, i) => (
                                <Space>
                                  <Text type="secondary">{i + 1}</Text>
                                  <div>
                                    <Text strong>{r.product.name}</Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: 11 }}>{r.product.provider}</Text>
                                  </div>
                                </Space>
                              ) 
                            },
                            { 
                              title: 'Eligibility', 
                              dataIndex: 'isEligible', 
                              render: (e, r) => (
                                <Tag color={e ? 'green' : 'red'} icon={e ? <CheckCircleOutlined /> : <WarningOutlined />}>
                                  {e ? 'Pass' : r.matchReason}
                                </Tag>
                              ) 
                            },
                            { 
                              title: 'Conversion Score', 
                              dataIndex: 'score', 
                              render: (s) => (
                                <div style={{ minWidth: 100 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <Text style={{ fontSize: 12 }}>{s}% Match</Text>
                                  </div>
                                  <Progress percent={s} size="small" strokeColor={s > 80 ? '#52c41a' : s > 50 ? '#faad14' : '#ff4d4f'} showInfo={false} />
                                </div>
                              ) 
                            },
                            { title: 'Confidence', dataIndex: 'matchReason' }
                          ]}
                        />
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


