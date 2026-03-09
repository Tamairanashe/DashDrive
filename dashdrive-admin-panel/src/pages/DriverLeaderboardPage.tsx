import React, { useState } from 'react';
import { Typography, Row, Col, Breadcrumb, Space, Segmented, Card, Statistic, Button } from 'antd';
import { 
  TrophyOutlined, 
  TeamOutlined, 
  RiseOutlined, 
  StarOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { DriverLeaderboard } from '../components/DriverLeaderboard';

const { Title, Text } = Typography;

export const DriverLeaderboardPage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('This Month');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header Section aligned with DriverVerification.tsx */}
      <Row justify="space-between" align="middle">
        <Col>
          <Breadcrumb style={{ marginBottom: 8, fontSize: 12 }}>
            <Breadcrumb.Item>Fleet Management</Breadcrumb.Item>
            <Breadcrumb.Item>Performance</Breadcrumb.Item>
          </Breadcrumb>
          <Title level={4} style={{ margin: 0 }}>Driver Leaderboard</Title>
          <Text type="secondary">Competitive performance tracking and driver analytics across the platform.</Text>
        </Col>
        <Col>
          <Space>
             <Segmented 
              value={timeFilter}
              onChange={(v) => setTimeFilter(v as string)}
              options={['Today', 'This Week', 'This Month', 'All Time']}
            />
            <Button icon={<ReloadOutlined />}>Refresh</Button>
            <Button type="primary" icon={<DownloadOutlined />}>Export</Button>
          </Space>
        </Col>
      </Row>

      {/* Summary Stats aligned with DriverVerification.tsx card style */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: '20px' }}>
            <Statistic 
              title="Active Competitors" 
              value={1240} 
              valueStyle={{ color: '#1890ff' }} 
              prefix={<TeamOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: '20px' }}>
            <Statistic 
              title="Avg Weekly Rating" 
              value={4.82} 
              precision={2}
              valueStyle={{ color: '#faad14' }} 
              prefix={<StarOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: '20px' }}>
            <Statistic 
              title="Total Trips" 
              value={45620} 
              valueStyle={{ color: '#52c41a' }} 
              prefix={<ThunderboltOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: '20px' }}>
            <Statistic 
              title="Fleet Momentum" 
              value={12.5} 
              precision={1}
              suffix="%"
              valueStyle={{ color: '#722ed1' }} 
              prefix={<RiseOutlined />} 
            />
          </Card>
        </Col>
      </Row>

      {/* Leaderboard Content */}
      <DriverLeaderboard timeFilter={timeFilter} />
    </div>
  );
};
