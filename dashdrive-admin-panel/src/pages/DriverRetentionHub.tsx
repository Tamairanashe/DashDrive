import React, { useState } from 'react';
import { 
  Card, Typography, Row, Col, Space, Table, Tag, 
  Button, Statistic, Progress, Avatar, List, Tabs,
  Badge, Rate, Divider, Segmented, Empty
} from 'antd';
import { 
  TrophyOutlined, GiftOutlined, StarOutlined, 
  RiseOutlined, TeamOutlined, ThunderboltOutlined,
  CheckCircleOutlined, InfoCircleOutlined, FireOutlined,
  GlobalOutlined, RocketOutlined, AppstoreAddOutlined
} from '@ant-design/icons';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';

const { Title, Text } = Typography;

export const DriverRetentionHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');

  const leaderboardData = [
    { rank: 1, name: 'John Makoni', trips: 145, rating: 4.96, earnings: 1200, trend: 'up' },
    { rank: 2, name: 'Sarah Chipo', trips: 132, rating: 4.92, earnings: 1050, trend: 'stable' },
    { rank: 3, name: 'Alex Rivera', trips: 128, rating: 4.90, earnings: 980, trend: 'up' },
    { rank: 4, name: 'Marco Rossi', trips: 115, rating: 4.88, earnings: 890, trend: 'down' },
    { rank: 5, name: 'Elena Petrova', trips: 110, rating: 4.85, earnings: 850, trend: 'up' },
  ];

  const levels = [
    { name: 'Bronze', drivers: 8500, color: '#cd7f32', benefits: ['Standard Commission', 'Basic Support'] },
    { name: 'Silver', drivers: 2400, color: '#c0c0c0', benefits: ['-2% Commission', 'Priority Support', 'Fuel Discounts'] },
    { name: 'Gold', drivers: 1205, color: '#ffd700', benefits: ['-5% Commission', 'Immediate Payouts', 'Health Insurance'] },
    { name: 'Platinum', drivers: 280, color: '#e5e4e2', benefits: ['-8% Commission', 'Concierge Support', 'Family Rewards'] },
  ];

  const LeaderboardTab = () => (
    <div style={{ marginTop: 20 }}>
      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Card 
            title={<Space><TrophyOutlined /> Top Performers (This Week)</Space>} 
            bordered={false} 
            className="shadow-sm"
            style={{ borderRadius: 16 }}
          >
            <Table 
                dataSource={leaderboardData}
                pagination={false}
                columns={[
                    { title: 'Rank', dataIndex: 'rank', key: 'rank', render: (r) => <Text strong style={{ fontSize: 16 }}>#{r}</Text> },
                    { 
                        title: 'Driver', 
                        key: 'driver',
                        render: (_, record) => (
                            <Space>
                                <Avatar size="small" icon={<UserOutlined />} />
                                <Text strong>{record.name}</Text>
                            </Space>
                        )
                    },
                    { title: 'Trips', dataIndex: 'trips', key: 'trips' },
                    { title: 'Rating', dataIndex: 'rating', key: 'rating', render: (r) => <Tag color="gold" icon={<StarOutlined />}>{r}</Tag> },
                    { title: 'Trend', dataIndex: 'trend', key: 'trend', render: (t) => <RiseOutlined style={{ color: t === 'up' ? '#10b981' : '#94a3b8' }} /> },
                ]}
            />
          </Card>
        </Col>
        <Col span={8}>
            <Card 
                title={<Space><RocketOutlined /> Participation</Space>} 
                bordered={false} 
                className="shadow-sm" 
                style={{ borderRadius: 16 }}
            >
                <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={[
                                    { name: 'Engaged', value: 85, fill: '#10b981' },
                                    { name: 'Inactive', value: 15, fill: '#f1f5f9' }
                                ]}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            />
                            <RechartsTooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ textAlign: 'center', marginTop: -170 }}>
                        <Title level={2} style={{ margin: 0 }}>85%</Title>
                        <Text type="secondary">Engagement</Text>
                    </div>
                </div>
            </Card>
        </Col>
      </Row>
    </div>
  );

  const LevelsTab = () => (
    <div style={{ marginTop: 20 }}>
      <Row gutter={[24, 24]}>
         {levels.map(lvl => (
             <Col xs={24} md={12} lg={6} key={lvl.name}>
                <Card 
                    bordered={false} 
                    className="shadow-sm" 
                    style={{ borderRadius: 16, borderTop: `4px solid ${lvl.color}` }}
                >
                    <Title level={4}>{lvl.name}</Title>
                    <Statistic value={lvl.drivers} suffix="Drivers" />
                    <Divider style={{ margin: '12px 0' }} />
                    <List 
                        size="small"
                        dataSource={lvl.benefits}
                        renderItem={item => <List.Item style={{ fontSize: 11, padding: '4px 0' }}><CheckCircleOutlined style={{ color: '#10b981' }} /> {item}</List.Item>}
                    />
                    <Button block style={{ marginTop: 16 }}>Edit Config</Button>
                </Card>
             </Col>
         ))}
      </Row>
    </div>
  );

  const RewardsTab = () => (
    <div style={{ marginTop: 20 }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title={<Space><GiftOutlined /> Active Reward Programs</Space>} bordered={false} className="shadow-sm" style={{ borderRadius: 16 }}>
             <Table 
                dataSource={[
                    { id: 'R-1', name: 'Weekend Warrior', target: '50 Trips', reward: '$100 Bonus', status: 'Active' },
                    { id: 'R-2', name: 'Night Owl Promo', target: '10 PM - 2 AM', reward: '1.2x Multiplier', status: 'Active' },
                    { id: 'R-3', name: 'New Driver Referral', target: '30 Successful Trips', reward: '$50 Each', status: 'Active' },
                ]}
                columns={[
                    { title: 'Program', dataIndex: 'name', key: 'name', render: (n) => <Text strong>{n}</Text> },
                    { title: 'Target', dataIndex: 'target', key: 'target' },
                    { title: 'Reward', dataIndex: 'reward', key: 'reward', render: (r) => <Tag color="blue">{r}</Tag> },
                    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color="success">{s}</Tag> },
                    { title: 'Actions', key: 'actions', render: () => <Button size="small">Edit</Button> }
                ]}
             />
             <Button type="dashed" block icon={<AppstoreAddOutlined />} style={{ marginTop: 16, height: 45 }}>Create New Reward Program</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const items = [
    { key: '1', label: <Space><TrophyOutlined /> Leaderboard</Space>, children: <LeaderboardTab /> },
    { key: '2', label: <Space><RiseOutlined /> Tier Setup</Space>, children: <LevelsTab /> },
    { key: '3', label: <Space><GiftOutlined /> Incentives & Rewards</Space>, children: <RewardsTab /> },
  ];

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
         <Title level={4} style={{ margin: 0 }}>Driver Engagement Hub</Title>
         <Text type="secondary">Manage driver loyalty, gamification and rewards systems.</Text>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        items={items}
      />
    </div>
  );
};

const UserOutlined: React.FC = () => <TeamOutlined />; // Polyfill
