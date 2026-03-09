import React, { useState } from 'react';
import { Table, Card, Button, Input, Space, Tag, Typography, Row, Col, Dropdown, MenuProps, Empty, Tabs, Badge, Avatar } from 'antd';
import { SearchOutlined, FilterOutlined, DownloadOutlined, EyeOutlined, CheckCircleOutlined, MoreOutlined, CompassOutlined } from '@ant-design/icons';
import { MapPreview } from './MapPreview';
import { MapPin, Clock, ExternalLink } from 'lucide-react';

const { Title, Text } = Typography;

interface FoodOrder {
  id: string;
  customer: { name: string; avatar: string };
  restaurant: { name: string; logo: string };
  rider: { name: string; avatar: string } | null;
  value: string;
  status: 'New' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  time: string;
  zone: string;
  eta: string;
  locations: {
    restaurant: [number, number];
    customer: [number, number];
  };
  nearbyRiders?: any[];
}

const mockOrders: FoodOrder[] = [
  {
    id: 'ORD-8241',
    customer: { name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    restaurant: { name: 'Burger King', logo: 'https://logo.clearbit.com/burgerking.com' },
    rider: { name: 'Alex Thompson', avatar: 'https://i.pravatar.cc/150?u=alex' },
    value: '$34.50',
    status: 'Preparing',
    time: '12:45 PM',
    zone: 'Downtown',
    eta: '12 min',
    locations: {
      restaurant: [23.7516, 90.3704],
      customer: [23.7616, 90.3804]
    },
    nearbyRiders: [
      { name: 'James Wilson', coords: [23.7556, 90.3754], active: true },
      { name: 'Elena Petrova', coords: [23.7506, 90.3854], active: false },
      { name: 'Sarah Chen', coords: [23.7486, 90.3724], active: true }
    ]
  },
  {
    id: 'ORD-8242',
    customer: { name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?u=michael' },
    restaurant: { name: "Sultan's Dine", logo: 'https://logo.clearbit.com/sultansdine.com' },
    rider: { name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?u=james' },
    value: '$124.00',
    status: 'Out for Delivery',
    time: '12:40 PM',
    zone: 'Airport',
    eta: '5 min',
    locations: {
      restaurant: [23.7925, 90.4078],
      customer: [23.8125, 90.4278]
    },
    nearbyRiders: [
      { name: 'Alex Rivera', coords: [23.7955, 90.4128], active: false },
      { name: 'Marco Rossi', coords: [23.8055, 90.4328], active: false },
      { name: 'Yuki Tanaka', coords: [23.8155, 90.4178], active: false }
    ]
  },
  {
    id: 'ORD-8243',
    customer: { name: 'Emma Davis', avatar: 'https://i.pravatar.cc/150?u=emma' },
    restaurant: { name: 'Pizza Hut', logo: 'https://logo.clearbit.com/pizzahut.com' },
    rider: null,
    value: '$45.20',
    status: 'New',
    time: '12:58 PM',
    zone: 'Suburbs',
    eta: '--',
    locations: {
      restaurant: [23.8759, 90.3795],
      customer: [23.8959, 90.3995]
    },
    nearbyRiders: []
  }
];

export const FoodOrders: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All Orders');

  const getStatusBadge = (status: FoodOrder['status']) => {
    switch (status) {
        case 'New': return <Badge status="error" text={<Text strong type="danger">New</Text>} />;
        case 'Preparing': return <Badge status="warning" text={<Text strong type="warning">Preparing</Text>} />;
        case 'Out for Delivery': return <Badge status="processing" text={<Text strong style={{ color: '#1677ff' }}>Out for Delivery</Text>} />;
        case 'Delivered': return <Badge status="success" text={<Text strong type="success">Delivered</Text>} />;
        case 'Cancelled': return <Badge status="default" text={<Text type="secondary">Cancelled</Text>} />;
        default: return <Badge status="default" text={status} />;
    }
  };

  const columns = [
    {
      title: 'Order Detail',
      key: 'detail',
      render: (_: any, record: FoodOrder) => (
        <Space size="middle">
          <MapPreview
            type="order-route"
            data={{
              ...record.locations,
              nearbyRiders: record.nearbyRiders,
              restaurantName: record.restaurant.name,
              customerName: record.customer.name
            }}
            label={`Order ${record.id}`}
          />
          <div>
            <Text strong style={{ fontSize: 15, display: 'block' }}>{record.id}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.time} • {record.customer.name}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Restaurant',
      key: 'restaurant',
      render: (_: any, record: FoodOrder) => (
        <Space>
            <Avatar src={record.restaurant.logo} shape="square" />
            <Text strong>{record.restaurant.name}</Text>
        </Space>
      ),
    },
    {
      title: 'Assignment',
      key: 'assignment',
      render: (_: any, record: FoodOrder) => (
        record.rider ? (
            <Space>
                <Avatar src={record.rider.avatar} />
                <Text>{record.rider.name}</Text>
            </Space>
        ) : (
            <Button type="dashed" size="small" style={{ borderColor: '#1677ff', color: '#1677ff' }}>Assign Rider</Button>
        )
      ),
    },
    {
      title: 'Logistics',
      key: 'logistics',
      render: (_: any, record: FoodOrder) => (
        <Space direction="vertical" size={2}>
            <Space>
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <Text strong>{record.zone}</Text>
            </Space>
            <Space>
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <Text type="secondary" style={{ fontSize: 12 }}>{record.eta} ETA</Text>
            </Space>
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: FoodOrder) => getStatusBadge(record.status),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: FoodOrder) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} />
          <Button type="text" icon={<CheckCircleOutlined style={{ color: '#10b981' }} />} />
        </Space>
      ),
    },
  ];

  const filteredOrders = activeTab === 'All Orders' ? mockOrders : mockOrders.filter(o => o.status === activeTab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col>
          <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Order Management</Title>
          <Text type="secondary" style={{ fontSize: 15 }}>Real-time control over food logistics and vendor fulfillment</Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<DownloadOutlined />}>Export Log</Button>
            <Button type="primary" icon={<FilterOutlined />}>Advanced Filter</Button>
          </Space>
        </Col>
      </Row>

      <Card bordered={false} className="shadow-sm border border-slate-100 rounded-2xl" bodyStyle={{ padding: 0 }}>
        <div style={{ padding: '0px 24px', borderBottom: '1px solid #f0f0f0' }}>
            <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab} 
                items={[
                    { key: 'All Orders', label: 'All Orders' },
                    { key: 'New', label: 'New' },
                    { key: 'Preparing', label: 'Preparing' },
                    { key: 'Out for Delivery', label: 'Out for Delivery' },
                    { key: 'Delivered', label: 'Delivered' },
                    { key: 'Cancelled', label: 'Cancelled' }
                ]} 
            />
        </div>

        <Table 
            columns={columns} 
            dataSource={filteredOrders} 
            rowKey="id"
            pagination={{ pageSize: 15 }}
            locale={{
              emptyText: <Empty description="No orders matching this status." />
            }}
        />
      </Card>
    </div>
  );
};
