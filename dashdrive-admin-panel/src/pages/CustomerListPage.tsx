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
  Progress
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  EditOutlined, 
  MoreOutlined,
  UserOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  DownloadOutlined,
  ReloadOutlined,
  StarOutlined,
  CarOutlined,
  CoffeeOutlined,
  ShopOutlined,
  PushpinOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export const CustomerListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchText, setSearchText] = useState('');

  const stats = [
    { title: 'Total Customers', value: '124,502', icon: <UserOutlined />, color: '#10b981' },
    { title: 'Active (30d)', value: '42,120', icon: <UserOutlined />, color: '#3b82f6' },
    { title: 'New (This Month)', value: '1,240', icon: <UserAddOutlined />, color: '#6366f1' },
    { title: 'Inactive', value: '8,405', icon: <UserDeleteOutlined />, color: '#ef4444' },
  ];

  const columns = [
    {
      title: 'Customer Name',
      key: 'name',
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
            <Text type="secondary" style={{ fontSize: 11 }}>ID: {record.id}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Profile Completion',
      key: 'profile',
      render: (_: any, record: any) => (
        <div style={{ width: 100 }}>
          <Progress 
            percent={record.profileStatus} 
            size="small" 
            strokeColor={record.profileStatus >= 90 ? '#10b981' : record.profileStatus >= 50 ? '#10b981' : '#f59e0b'} 
          />
        </div>
      ),
    },
    {
      title: 'Contact Info',
      key: 'contact',
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 12, fontWeight: 600 }}>{record.phone}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.email}</Text>
        </Space>
      ),
    },
    {
      title: 'Level & Loyalty',
      key: 'level',
      render: (_: any, record: any) => (
        <Tag color={record.level === 'DashPlus' ? 'rose' : record.level === 'Loyal' ? 'blue' : 'default'} icon={<StarOutlined />}>
          {record.level}
        </Tag>
      ),
    },
    {
      title: 'Activity',
      key: 'activity',
      render: (_: any, record: any) => (
        <Space direction="vertical" size={4}>
          <Text strong style={{ fontSize: 14 }}>{record.totalTrips} Orders</Text>
          <Space size={4}>
            {record.serviceUsage.map((s: string) => {
              const icons: any = { 
                Ride: <CarOutlined />, 
                Food: <CoffeeOutlined />, 
                Mart: <ShopOutlined />, 
                Parcel: <PushpinOutlined /> 
              };
              return <Tooltip title={s} key={s}>{React.cloneElement(icons[s], { style: { color: '#94a3b8' } })}</Tooltip>;
            })}
          </Space>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Tooltip title="View History">
            <Button type="text" icon={<EyeOutlined />} />
          </Tooltip>
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" icon={<MoreOutlined />} />
        </Space>
      ),
    },
  ];

  const customers = [
    { id: 'C-8001', name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', profileStatus: 95, phone: '+1 555-1234', email: 'sarah@dashdrive.com', level: 'DashPlus', totalTrips: 154, status: 'Active', serviceUsage: ['Ride', 'Food', 'Mart', 'Parcel'] },
    { id: 'C-8002', name: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', profileStatus: 70, phone: '+1 555-5678', email: 'michael@dashdrive.com', level: 'Standard', totalTrips: 42, status: 'Active', serviceUsage: ['Ride', 'Food'] },
  ];

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>Customer Analytics</Title>
          <Text type="secondary">Unified intelligence across all DashDrive ecosystem services.</Text>
        </Col>
        <Col>
          <Button type="primary" size="large" icon={<PlusOutlined />} style={{ borderRadius: 8 }}>
            Register New Customer
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
              { key: 'All', label: 'All Customers' },
              { key: 'New', label: 'New Registered' },
              { key: 'DashPlus', label: 'DashPlus Segment' },
              { key: 'Inactive', label: 'Churn Risk' },
            ]}
            style={{ marginBottom: -16 }}
          />
          <Space size="middle">
            <Button icon={<ReloadOutlined />} />
            <Button icon={<DownloadOutlined />}>Export</Button>
            <Input
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Search by name, ID, phone..."
              style={{ width: 280, borderRadius: 8 }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </Space>
        </div>
        <Table 
          columns={columns} 
          dataSource={customers} 
          rowKey="id"
          pagination={{ pageSize: 15, position: ['bottomRight'] }}
        />
      </Card>
    </div>
  );
};
