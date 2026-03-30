import React, { useState } from 'react';
import { Table, Card, Button, Input, Space, Tag, Typography, Badge, Avatar, Divider, message, Descriptions } from 'antd';
import { SearchOutlined, FilterOutlined, DownloadOutlined, EyeOutlined, TruckOutlined, SafetyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ShoppingOrder {
  id: string;
  customer: {
    name: string;
    avatar: string;
  };
  vendor: string;
  itemsCount: number;
  total: string;
  paymentMethod: 'Wallet' | 'Card' | 'Cash';
  deliveryType: 'Standard' | 'Express';
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  date: string;
  zone: string;
}

const mockOrders: ShoppingOrder[] = [
  {
    id: 'ORD-SHP-8821',
    customer: { name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?u=alex' },
    vendor: 'ElectroHub Store',
    itemsCount: 2,
    total: '$312.40',
    paymentMethod: 'Card',
    deliveryType: 'Express',
    status: 'Shipped',
    date: '12th Oct, 2023 14:20',
    zone: 'Gulshan 2'
  },
  {
    id: 'ORD-SHP-8822',
    customer: { name: 'Sarah Miller', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    vendor: 'Urban Fashion',
    itemsCount: 4,
    total: '$145.00',
    paymentMethod: 'Wallet',
    deliveryType: 'Standard',
    status: 'Delivered',
    date: '12th Oct, 2023 11:35',
    zone: 'Banani'
  },
  {
    id: 'ORD-SHP-8823',
    customer: { name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?u=michael' },
    vendor: 'Gadget World',
    itemsCount: 1,
    total: '$850.00',
    paymentMethod: 'Card',
    deliveryType: 'Express',
    status: 'Confirmed',
    date: '13th Oct, 2023 09:15',
    zone: 'Dhanmondi'
  },
  {
    id: 'ORD-SHP-8824',
    customer: { name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?u=emma' },
    vendor: 'Beauty Palace',
    itemsCount: 3,
    total: '$68.20',
    paymentMethod: 'Cash',
    deliveryType: 'Standard',
    status: 'Pending',
    date: '13th Oct, 2023 15:45',
    zone: 'Uttara'
  }
];

export const ShoppingOrders: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const columns = [
    {
      title: 'Order ID',
      key: 'id',
      render: (_, record: ShoppingOrder) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text strong style={{ color: '#1677ff' }}>{record.id}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.date}</Text>
        </div>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record: ShoppingOrder) => (
        <Space>
          <Avatar src={record.customer.avatar} size="small" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text strong style={{ fontSize: 13 }}>{record.customer.name}</Text>
            <Tag style={{ fontSize: 10, margin: 0 }}>{record.zone}</Tag>
          </div>
        </Space>
      ),
    },
    {
      title: 'Vendor Source',
      key: 'vendor',
      render: (_, record: ShoppingOrder) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text strong>{record.vendor}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.itemsCount} Items</Text>
        </div>
      ),
    },
    {
      title: 'Value & Method',
      key: 'value',
      render: (_, record: ShoppingOrder) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text strong style={{ fontSize: 15 }}>{record.total}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.paymentMethod}</Text>
        </div>
      ),
    },
    {
      title: 'Shipping State',
      key: 'status',
      render: (_, record: ShoppingOrder) => {
        let status: any = 'processing';
        if (record.status === 'Delivered') status = 'success';
        if (record.status === 'Cancelled' || record.status === 'Returned') status = 'error';
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Badge status={status} text={record.status} />
            <Text type="secondary" style={{ fontSize: 10 }}><TruckOutlined /> {record.deliveryType}</Text>
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: ShoppingOrder) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" />
          <Button icon={<TruckOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  const filteredOrders = mockOrders.filter(o => {
      const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (activeTab === 'All') return matchesSearch;
      return matchesSearch && o.status === activeTab;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
            <Title level={4} style={{ margin: 0 }}>Marketplace Fulfillment</Title>
            <Text type="secondary">Monitor cross-vendor order logistics, shipping cycles, and marketplace returns.</Text>
        </div>
        <Space>
            <Button icon={<DownloadOutlined />}>Daily Report</Button>
            <Button type="primary" icon={<SafetyOutlined />}>Process Checks</Button>
        </Space>
      </div>

      <Card bordered={false} styles={{ body: { padding: 0 } }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
          <Space size="large" style={{ fontWeight: 500 }}>
             {['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered'].map(tab => (
               <div 
                 key={tab} 
                 onClick={() => setActiveTab(tab)}
                 style={{ 
                   cursor: 'pointer', 
                   color: activeTab === tab ? '#1677ff' : '#64748b',
                   borderBottom: activeTab === tab ? '2px solid #1677ff' : '2px solid transparent',
                   paddingBottom: 4
                 }}
               >
                 {tab}
               </div>
             ))}
          </Space>
          <Input
            placeholder="Search orders..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 250 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <div style={{ padding: 24, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div>
            <Text strong>Return Investigation Required</Text>
            <Text type="secondary" style={{ display: 'block' }}>There are 8 pending return requests awaiting marketplace investigation.</Text>
         </div>
         <Button type="primary" style={{ backgroundColor: '#faad14' }}>Review Returns</Button>
      </div>
    </div>
  );
};
