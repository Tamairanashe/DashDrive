import React, { useState } from 'react';
import { 
  Table, 
  Tag, 
  Space, 
  Button, 
  Input, 
  Card, 
  Typography, 
  Tabs, 
  Row, 
  Col, 
  Statistic,
  Avatar,
  Tooltip,
  Progress,
  Rate
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  EditOutlined, 
  MoreOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  CarOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export const DriverListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchText, setSearchText] = useState('');

  const stats = [
    { title: 'Total Drivers', value: '12,405', icon: <UserOutlined />, color: '#10b981' },
    { title: 'Live On-Trip', value: '3,120', icon: <CarOutlined />, color: '#3b82f6' },
    { title: 'Active/Available', value: '1,840', icon: <SafetyCertificateOutlined />, color: '#10b981' },
    { title: 'Offline', value: '7,445', icon: <UserOutlined />, color: '#94a3b8' },
  ];

  const columns = [
    {
      title: 'Driver Info',
      key: 'info',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Avatar 
            size={48} 
            src={record.avatar} 
            icon={<UserOutlined />} 
            style={{ borderRadius: 12, border: '2px solid #f1f5f9' }}
          />
          <div>
            <Text strong style={{ fontSize: 14, display: 'block' }}>{record.name}</Text>
            <Space size={4}>
              <Tag color="blue" style={{ fontSize: 9 }}>{record.vehicleType}</Tag>
              <Text type="secondary" style={{ fontSize: 11 }}>ID: {record.id}</Text>
            </Space>
          </div>
        </Space>
      ),
    },
    {
      title: 'Tier & Rating',
      key: 'tier',
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Tag color={record.level === 'Platinum' ? 'purple' : record.level === 'Gold' ? 'gold' : 'default'}>
            {record.level}
          </Tag>
          <Rate disabled defaultValue={record.rating} style={{ fontSize: 12 }} />
        </Space>
      ),
    },
    {
      title: 'KPI Metrics',
      key: 'kpi',
      render: (_: any, record: any) => (
        <div style={{ width: 120 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text type="secondary" style={{ fontSize: 10 }}>Acceptance</Text>
            <Text strong style={{ fontSize: 10, color: '#10b981' }}>{record.acceptanceRate}%</Text>
          </div>
          <Progress percent={record.acceptanceRate} size="small" showInfo={false} strokeColor="#10b981" />
        </div>
      ),
    },
    {
      title: 'Compliance',
      key: 'compliance',
      dataIndex: 'kycStatus',
      render: (status: string) => (
        <Tag color={status === 'Verified' ? 'green' : 'orange'} icon={<SafetyCertificateOutlined />}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status: string) => (
        <Space size={4}>
          <div style={{ 
            width: 8, height: 8, borderRadius: '50%', 
            background: status === 'On Trip' ? '#10b981' : status === 'Active' ? '#3b82f6' : '#94a3b8' 
          }} />
          <Text strong style={{ fontSize: 12 }}>{status}</Text>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Tooltip title="View Profile">
            <Button type="text" icon={<EyeOutlined />} />
          </Tooltip>
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" icon={<MoreOutlined />} />
        </Space>
      ),
    },
  ];

  const drivers = [
    { id: 'D-4001', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', level: 'Platinum', status: 'On Trip', rating: 4.9, acceptanceRate: 98, kycStatus: 'Verified', vehicleType: 'Luxury' },
    { id: 'D-4002', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', level: 'Gold', status: 'Active', rating: 4.8, acceptanceRate: 95, kycStatus: 'Verified', vehicleType: 'Standard' },
    { id: 'D-4003', name: 'Marco Rossi', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', level: 'Silver', status: 'Offline', rating: 4.7, acceptanceRate: 88, kycStatus: 'Pending', vehicleType: 'Bike' },
  ];

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>Fleet Command Center</Title>
          <Text type="secondary">Advanced driver tracking, performance analytics, and compliance.</Text>
        </Col>
        <Col>
          <Button type="primary" size="large" icon={<PlusOutlined />} style={{ borderRadius: 8 }}>
            Add New Driver
          </Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {stats.map(stat => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <Card bordered={false} bodyStyle={{ padding: 20 }}>
              <Space size={16}>
                <div style={{ 
                  width: 48, height: 48, background: `${stat.color}15`, 
                  borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: stat.color, fontSize: 24
                }}>
                  {stat.icon}
                </div>
                <Statistic title={stat.title} value={stat.value} valueStyle={{ fontWeight: 800 }} />
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={[
              { key: 'All', label: 'All Fleet' },
              { key: 'Active', label: 'Active' },
              { key: 'On Trip', label: 'On Trip' },
              { key: 'Offline', label: 'Offline' },
              { key: 'Compliance', label: 'Compliance Alerts' },
            ]}
            style={{ marginBottom: -16 }}
          />
          <Space size="middle">
            <Button icon={<ReloadOutlined />} />
            <Button icon={<DownloadOutlined />}>Export CSV</Button>
            <Input
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Search by name, ID, vehicle..."
              style={{ width: 280, borderRadius: 8 }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </Space>
        </div>
        <Table 
          columns={columns} 
          dataSource={drivers} 
          rowKey="id"
          pagination={{ pageSize: 15, position: ['bottomRight'] }}
        />
      </Card>
    </div>
  );
};
