import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  Input, 
  Tag, 
  Badge, 
  Button, 
  Space,
  Avatar,
  Rate,
  Tooltip,
  Dropdown
} from 'antd';
import { 
  SearchOutlined, 
  DownloadOutlined, 
  UserOutlined, 
  CarOutlined, 
  StarOutlined, 
  MoreOutlined,
  EyeOutlined,
  StopOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  PlusOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface Driver {
  id: string;
  name: string;
  avatar: string;
  vehicle: string;
  vehicleType: string;
  rating: number;
  trips: number;
  earnings: string;
  status: 'Active' | 'Suspended' | 'Banned';
}

export const DriverList: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchText, setSearchText] = useState('');

  const drivers: Driver[] = [
    { 
      id: 'D-4001', 
      name: 'Alex Rivera', 
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 
      vehicle: 'Toyota Prius (BCD 1234)',
      vehicleType: 'Economy',
      rating: 4.9, 
      trips: 1240,
      earnings: '$42,500',
      status: 'Active' 
    },
    { 
      id: 'D-4002', 
      name: 'Sarah Chen', 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 
      vehicle: 'Honda Civic (EFG 5678)',
      vehicleType: 'Standard',
      rating: 4.8, 
      trips: 856,
      earnings: '$28,400',
      status: 'Active' 
    },
    { 
      id: 'D-4003', 
      name: 'Marco Rossi', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 
      vehicle: 'Motorcycle (ZXY 9012)',
      vehicleType: 'Bike',
      rating: 4.7, 
      trips: 412,
      earnings: '$12,500',
      status: 'Suspended' 
    },
    { 
      id: 'D-4004', 
      name: 'Elena Petrova', 
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 
      vehicle: 'Tesla Model 3 (ELC 7788)',
      vehicleType: 'Luxury',
      rating: 4.9, 
      trips: 1502,
      earnings: '$61,200',
      status: 'Banned' 
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return <Tag color="success" icon={<CheckCircleOutlined />}>Active</Tag>;
      case 'Suspended': return <Tag color="warning" icon={<StopOutlined />}>Suspended</Tag>;
      case 'Banned': return <Tag color="error" icon={<StopOutlined />}>Banned</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Driver Name',
      key: 'name',
      render: (record: Driver) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <Text strong style={{ display: 'block' }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>ID: {record.id}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Vehicle',
      key: 'vehicle',
      render: (record: Driver) => (
        <div>
          <Text style={{ display: 'block' }}>{record.vehicle}</Text>
          <Tag color="cyan" style={{ fontSize: 10 }}>{record.vehicleType}</Tag>
        </div>
      )
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <Space size={4}>
          <Rate disabled defaultValue={rating} style={{ fontSize: 12 }} />
          <Text strong style={{ fontSize: 12 }}>{rating}</Text>
        </Space>
      )
    },
    {
      title: 'Trips',
      dataIndex: 'trips',
      key: 'trips',
      render: (trips: number) => <Text strong>{trips.toLocaleString()}</Text>
    },
    {
      title: 'Earnings',
      dataIndex: 'earnings',
      key: 'earnings',
      render: (earnings: string) => <Text strong style={{ color: '#52c41a' }}>{earnings}</Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusBadge(status)
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: () => (
        <Space>
          <Tooltip title="View Profile">
            <Button type="text" icon={<EyeOutlined />} />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                { key: 'suspend', label: 'Suspend Driver', icon: <StopOutlined />, danger: true },
                { key: 'ratings', label: 'Check Ratings', icon: <StarOutlined /> },
              ],
            }}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={4} style={{ margin: 0 }}>Fleet Management</Title>
          <Text type="secondary">Monitor and manage your driver fleet performance and compliance.</Text>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} size="large">Add New Driver</Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Total Drivers" value={12405} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Active Now" value={3120} prefix={<CarOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Avg. Rating" value={4.85} prefix={<StarOutlined />} precision={2} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Suspended" value={42} prefix={<StopOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
      </Row>

      <Card 
        bordered={false} 
        className="shadow-sm"
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={5} style={{ margin: 0 }}>Driver Registry</Title>
            <Space>
              <Input.Search 
                placeholder="Search name, ID, vehicle..." 
                style={{ width: 250 }} 
                onSearch={v => setSearchText(v)}
                prefix={<SearchOutlined />}
              />
              <Button icon={<ReloadOutlined />} />
              <Button icon={<DownloadOutlined />}>Export CSV</Button>
            </Space>
          </div>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space size="large" style={{ borderBottom: '1px solid #f1f5f9', width: '100%', paddingBottom: 12 }}>
            {['All', 'Active', 'Suspended', 'Banned'].map(tab => (
              <div 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                style={{ 
                  cursor: 'pointer', 
                  color: activeTab === tab ? '#1677ff' : '#64748b',
                  fontWeight: activeTab === tab ? 700 : 500,
                  borderBottom: activeTab === tab ? '2px solid #1677ff' : '2px solid transparent',
                  paddingBottom: 10,
                  marginBottom: -13
                }}
              >
                {tab}
              </div>
            ))}
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={activeTab === 'All' ? drivers : drivers.filter(d => d.status === activeTab)}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};
