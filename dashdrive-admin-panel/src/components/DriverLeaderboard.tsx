import React, { useState } from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Table, 
  Avatar, 
  Tag, 
  Space, 
  Tooltip, 
  Progress, 
  Rate,
  Badge,
  Divider,
  Statistic,
  Modal,
  Form,
  Select,
  InputNumber,
  Segmented,
  Button,
  message
} from 'antd';
import { 
  TrophyOutlined, 
  RiseOutlined, 
  UserOutlined,
  CrownOutlined,
  ThunderboltOutlined,
  CarOutlined,
  DollarCircleOutlined,
  GiftOutlined,
  PlusOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface DriverLeaderboardProps {
  timeFilter: string;
}

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  trips: number;
  acceptanceRate: number;
  rating: number;
  ratingCount: number;
  starsCount: { [key: number]: number };
  earnings: number;
  trend: 'up' | 'down' | 'stable';
  badges: string[];
}

const leaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    id: 'D-9921',
    name: 'Tendai Moyo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    trips: 452,
    acceptanceRate: 98,
    rating: 4.98,
    ratingCount: 420,
    starsCount: { 5: 412, 4: 5, 3: 2, 2: 1, 1: 0 },
    earnings: 2840,
    trend: 'up',
    badges: ['Top Earner', 'Elite Status']
  },
  {
    rank: 2,
    id: 'D-8812',
    name: 'Sarah Mulenga',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    trips: 410,
    acceptanceRate: 95,
    rating: 4.95,
    ratingCount: 385,
    starsCount: { 5: 370, 4: 10, 3: 5, 2: 0, 1: 0 },
    earnings: 2450,
    trend: 'up',
    badges: ['Customer Favorite']
  },
  {
    rank: 3,
    id: 'D-7712',
    name: 'Kelvin Phiri',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    trips: 395,
    acceptanceRate: 92,
    rating: 4.88,
    ratingCount: 350,
    starsCount: { 5: 310, 4: 25, 3: 10, 2: 5, 1: 0 },
    earnings: 2100,
    trend: 'stable',
    badges: ['Road Warrior']
  },
  {
    rank: 4,
    id: 'D-6652',
    name: 'Elena Zhou',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    trips: 380,
    acceptanceRate: 94,
    rating: 4.85,
    ratingCount: 320,
    starsCount: { 5: 280, 4: 25, 3: 10, 2: 5, 1: 0 },
    earnings: 1950,
    trend: 'down',
    badges: []
  },
  {
    rank: 5,
    id: 'D-5512',
    name: 'Mike Makoni',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    trips: 350,
    acceptanceRate: 90,
    rating: 4.82,
    ratingCount: 300,
    starsCount: { 5: 250, 4: 30, 3: 15, 2: 5, 1: 0 },
    earnings: 1800,
    trend: 'up',
    badges: []
  }
];

export const DriverLeaderboard: React.FC<DriverLeaderboardProps> = ({ timeFilter }) => {
  const top3 = leaderboardData.slice(0, 3);
  const [isRewardModalVisible, setIsRewardModalVisible] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<LeaderboardEntry | null>(null);
  const [rewardType, setRewardType] = useState('Bonus');
  const [form] = Form.useForm();

  const handleRewardSubmit = () => {
    message.success(`Successfully issued ${rewardType} reward to ${selectedDriver?.name}!`);
    setIsRewardModalVisible(false);
    form.resetFields();
  };

  const openRewardModal = (driver: LeaderboardEntry) => {
    setSelectedDriver(driver);
    setIsRewardModalVisible(true);
  };

  const getRankColor = (rank: number) => {
    switch(rank) {
      case 1: return '#faad14';
      case 2: return '#1890ff';
      case 3: return '#52c41a';
      default: return '#8c8c8c';
    }
  };

  const renderPodium = () => (
    <div style={{ marginBottom: 32 }}>
      <Row gutter={[16, 16]} align="bottom">
        {/* Rank 2 */}
        <Col xs={24} sm={8}>
          <Card 
            bordered={false} 
            className="shadow-sm"
            style={{ borderRadius: 16, textAlign: 'center' }}
            bodyStyle={{ padding: '24px' }}
          >
            <Badge count={2} style={{ backgroundColor: '#1890ff' }} offset={[-10, 10]}>
               <Avatar size={80} src={top3[1].avatar} style={{ border: '3px solid #1890ff' }} />
            </Badge>
            <Title level={5} style={{ marginTop: 16, marginBottom: 4 }}>{top3[1].name}</Title>
            <Text type="secondary" style={{ fontSize: 12 }}>{top3[1].trips} Trips</Text>
            <Divider style={{ margin: '16px 0' }} />
            <Row gutter={8}>
              <Col span={12}>
                <Statistic value={top3[1].earnings} prefix="$" valueStyle={{ fontSize: 16, fontWeight: 700 }} />
              </Col>
              <Col span={12}>
                <Statistic value={top3[1].rating} suffix="★" valueStyle={{ fontSize: 16, fontWeight: 700, color: '#faad14' }} />
              </Col>
            </Row>
            <Button 
              type="primary" ghost 
              icon={<GiftOutlined />} 
              style={{ marginTop: 16, width: '100%' }}
              onClick={() => openRewardModal(top3[1])}
            >
              Reward
            </Button>
          </Card>
        </Col>

        {/* Rank 1 */}
        <Col xs={24} sm={8}>
          <Card 
            bordered={false} 
            className="shadow-sm"
            style={{ borderRadius: 16, textAlign: 'center', border: '1px solid #faad14' }}
            bodyStyle={{ padding: '32px 24px' }}
          >
            <div style={{ position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
              <CrownOutlined style={{ fontSize: 32, color: '#faad14' }} />
            </div>
            <Badge count={1} style={{ backgroundColor: '#faad14', color: '#fff' }} offset={[-15, 15]}>
               <Avatar size={100} src={top3[0].avatar} style={{ border: '4px solid #faad14' }} />
            </Badge>
            <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>{top3[0].name}</Title>
            <Tag color="gold" style={{ marginBottom: 8 }}>MASTER CHAMPION</Tag>
            <Divider style={{ margin: '16px 0' }} />
            <Row gutter={8}>
              <Col span={12}>
                <Statistic value={top3[0].earnings} prefix="$" valueStyle={{ fontSize: 20, fontWeight: 800, color: '#52c41a' }} />
              </Col>
              <Col span={12}>
                <Statistic value={top3[0].rating} suffix="★" valueStyle={{ fontSize: 20, fontWeight: 800, color: '#faad14' }} />
              </Col>
            </Row>
            <Button 
              type="primary" 
              icon={<GiftOutlined />} 
              style={{ marginTop: 16, width: '100%' }}
              onClick={() => openRewardModal(top3[0])}
            >
              Reward Champion
            </Button>
          </Card>
        </Col>

        {/* Rank 3 */}
        <Col xs={24} sm={8}>
          <Card 
            bordered={false} 
            className="shadow-sm"
            style={{ borderRadius: 16, textAlign: 'center' }}
            bodyStyle={{ padding: '24px' }}
          >
            <Badge count={3} style={{ backgroundColor: '#52c41a' }} offset={[-10, 10]}>
               <Avatar size={80} src={top3[2].avatar} style={{ border: '3px solid #52c41a' }} />
            </Badge>
            <Title level={5} style={{ marginTop: 16, marginBottom: 4 }}>{top3[2].name}</Title>
            <Text type="secondary" style={{ fontSize: 12 }}>{top3[2].trips} Trips</Text>
            <Divider style={{ margin: '16px 0' }} />
            <Row gutter={8}>
              <Col span={12}>
                <Statistic value={top3[2].earnings} prefix="$" valueStyle={{ fontSize: 16, fontWeight: 700 }} />
              </Col>
              <Col span={12}>
                <Statistic value={top3[2].rating} suffix="★" valueStyle={{ fontSize: 16, fontWeight: 700, color: '#faad14' }} />
              </Col>
            </Row>
            <Button 
              type="primary" ghost 
              icon={<GiftOutlined />} 
              style={{ marginTop: 16, width: '100%' }}
              onClick={() => openRewardModal(top3[2])}
            >
              Reward
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (rank: number) => (
        <div style={{ 
          width: 28, height: 28, borderRadius: '50%', 
          background: getRankColor(rank), 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, color: '#fff', fontSize: 12
        }}>
          {rank}
        </div>
      )
    },
    {
      title: 'Driver',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: LeaderboardEntry) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <Text strong>{name}</Text><br/>
            <Text type="secondary" style={{ fontSize: 11 }}>{record.id}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Activity',
      key: 'activity',
      render: (record: LeaderboardEntry) => (
        <div style={{ width: 140 }}>
          <Space orientation="vertical" size={0} style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
              <Text strong style={{ fontSize: 12 }}>{record.trips} Trips</Text>
              <Text type="secondary" style={{ fontSize: 10 }}>{record.acceptanceRate}%</Text>
            </div>
            <Progress percent={record.acceptanceRate} size="small" showInfo={false} strokeColor="#1890ff" />
          </Space>
        </div>
      )
    },
    {
      title: 'Performance',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number, record: LeaderboardEntry) => (
        <Tooltip 
           title={
              <div style={{ padding: 8 }}>
                {Object.entries(record.starsCount).reverse().map(([star, count]) => (
                  <Row key={star} gutter={8} align="middle">
                    <Col span={4}><Text style={{ color: 'white', fontSize: 10 }}>{star}★</Text></Col>
                    <Col span={14}><Progress percent={(count / record.ratingCount) * 100} showInfo={false} size="small" strokeColor="#faad14" /></Col>
                    <Col span={6}><Text style={{ color: 'white', fontSize: 10 }}>{count}</Text></Col>
                  </Row>
                ))}
              </div>
            }
        >
          <div style={{ cursor: 'pointer' }}>
            <Space>
              <Text strong>{rating}</Text>
              <Rate disabled defaultValue={1} count={1} style={{ fontSize: 12, color: '#faad14' }} />
              <Text type="secondary" style={{ fontSize: 11 }}>({record.ratingCount})</Text>
            </Space>
            <br/>
            <Text style={{ fontSize: 10, color: '#faad14', fontWeight: 600 }}>{record.starsCount[5]} listings of 5★</Text>
          </div>
        </Tooltip>
      )
    },
    {
      title: 'Earnings',
      dataIndex: 'earnings',
      key: 'earnings',
      render: (val: number) => (
        <Text strong style={{ color: '#52c41a' }}>${val.toLocaleString()}</Text>
      )
    },
    {
      title: 'Status',
      dataIndex: 'trend',
      key: 'trend',
      align: 'right' as const,
      render: (trend: string) => {
        if (trend === 'up') return <Tag color="success" icon={<RiseOutlined />}>Rising</Tag>;
        if (trend === 'down') return <Tag color="error">Falling</Tag>;
        return <Tag color="default">Stable</Tag>;
      }
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center' as const,
      render: (record: LeaderboardEntry) => (
        <Tooltip title="Send Reward">
          <Button 
            type="text" 
            icon={<GiftOutlined style={{ color: '#eb2f96' }} />} 
            onClick={() => openRewardModal(record)} 
          />
        </Tooltip>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {renderPodium()}
      
      <Card bordered={false} className="shadow-sm" style={{ borderRadius: 16 }}>
        <div style={{ padding: '0 0 16px 0', borderBottom: '1px solid #f0f0f0', marginBottom: 16 }}>
          <Space>
            <TrophyOutlined style={{ color: '#faad14', fontSize: 20 }} />
            <Text strong style={{ fontSize: 16 }}>Full Ranking List</Text>
          </Space>
        </div>
        <Table 
          dataSource={leaderboardData} 
          columns={columns} 
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </Card>

      <Modal
        title={
          <Space>
            <GiftOutlined style={{ color: '#eb2f96' }} />
            <span>Reward Driver: {selectedDriver?.name}</span>
          </Space>
        }
        open={isRewardModalVisible}
        onCancel={() => setIsRewardModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <Segmented
            value={rewardType}
            onChange={(val) => setRewardType(val.toString())}
            options={[
              { label: 'Financial Bonus', value: 'Bonus' },
              { label: 'Performance Boost', value: 'Boost' },
              { label: 'Digital Gift', value: 'Gift' },
            ]}
            block
          />
        </div>

        <Form form={form} layout="vertical" onFinish={handleRewardSubmit}>
          {rewardType === 'Bonus' && (
            <>
              <Form.Item label="Wallet Top-up Amount ($)" name="amount" rules={[{ required: true, message: 'Please enter an amount' }]}>
                <InputNumber style={{ width: '100%' }} min={1} placeholder="e.g. 50" prefix="$" />
              </Form.Item>
              <Form.Item label="Reference Note" name="note">
                <Select placeholder="Select a reason">
                  <Select.Option value="leaderboard_monthly">Monthly Leaderboard Reward</Select.Option>
                  <Select.Option value="leaderboard_weekly">Weekly Top Performer</Select.Option>
                  <Select.Option value="customer_fav">Customer Favorite Bonus</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

          {rewardType === 'Boost' && (
            <>
              <Form.Item label="Promotion Type" name="promoType" rules={[{ required: true, message: 'Select a promotion' }]}>
                <Select placeholder="Select Promotion">
                  <Select.Option value="commission_0">0% Commission (24h)</Select.Option>
                  <Select.Option value="multiplier_15">1.5x Fare Multiplier (4h)</Select.Option>
                  <Select.Option value="priority_disp">Priority Dispatch (48h)</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

          {rewardType === 'Gift' && (
            <>
              <Form.Item label="Digital Voucher" name="voucher" rules={[{ required: true, message: 'Select a voucher' }]}>
                <Select placeholder="Select Voucher">
                  <Select.Option value="fuel_20">$20 Fuel Voucher</Select.Option>
                  <Select.Option value="wash_free">Free Premium Car Wash</Select.Option>
                  <Select.Option value="data_10g">10GB Mobile Data Bundle</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

          <Form.Item style={{ marginTop: 24, marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsRewardModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">Issue Reward</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

