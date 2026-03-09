import React, { useState } from 'react';
import { Table, Card, Button, Input, Space, Tag, Typography, Badge, Avatar, Divider, message, Select } from 'antd';
import { SearchOutlined, PlusOutlined, FilterOutlined, ReloadOutlined, DownloadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ShoppingProduct {
  id: string;
  name: string;
  vendor: string;
  category: string;
  price: string;
  stock: number;
  status: 'Active' | 'Pending' | 'Out of Stock' | 'Draft';
  sku: string;
  rating: number;
  sales: string;
  image: string;
  lastUpdated: string;
}

const mockProducts: ShoppingProduct[] = [
  {
    id: 'SHP-401',
    name: 'Ultra-Slim Smart Watch 4',
    vendor: 'ElectroHub Store',
    category: 'Electronics',
    price: '$299.00',
    stock: 45,
    status: 'Active',
    sku: 'WCH-UL-4B',
    rating: 4.8,
    sales: '1.2k',
    image: 'https://images.unsplash.com/photo-1546868889-4e0c68a702ec?w=100&h=100&fit=crop',
    lastUpdated: '2h ago'
  },
  {
    id: 'SHP-402',
    name: 'Premium Leather Tote Bag',
    vendor: 'Urban Fashion',
    category: 'Fashion',
    price: '$120.00',
    stock: 12,
    status: 'Pending',
    sku: 'BAG-LTR-UB',
    rating: 0.0,
    sales: '0',
    image: 'https://images.unsplash.com/photo-1584917033904-494b7c6204d4?w=100&h=100&fit=crop',
    lastUpdated: '1d ago'
  },
  {
    id: 'SHP-403',
    name: '4K OLED Gaming Monitor 32"',
    vendor: 'Gadget World',
    category: 'Electronics',
    price: '$850.00',
    stock: 0,
    status: 'Out of Stock',
    sku: 'MON-OLED-32',
    rating: 4.9,
    sales: '482',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100&h=100&fit=crop',
    lastUpdated: '5h ago'
  },
  {
    id: 'SHP-404',
    name: 'Moisturizing Face Serum 30ml',
    vendor: 'Beauty Palace',
    category: 'Beauty',
    price: '$45.00',
    stock: 120,
    status: 'Active',
    sku: 'SRM-MST-30',
    rating: 4.6,
    sales: '3.4k',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop',
    lastUpdated: '8h ago'
  }
];

export const ShoppingProducts: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const columns = [
    {
      title: 'Product Lifecycle',
      key: 'product',
      render: (_, record: ShoppingProduct) => (
        <Space size="middle">
          <Avatar src={record.image} shape="square" size={48} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text strong>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>SKU: {record.sku} • {record.lastUpdated}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
      render: (vendor: string) => <Text strong>{vendor}</Text>,
    },
    {
      title: 'Economics',
      key: 'economics',
      render: (_, record: ShoppingProduct) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text strong>{record.price}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.sales} sold • {record.rating}★</Text>
        </div>
      ),
    },
    {
      title: 'Inventory',
      key: 'stock',
      render: (_, record: ShoppingProduct) => {
        let color = '#52c41a';
        if (record.stock === 0) color = '#ff4d4f';
        else if (record.stock < 15) color = '#faad14';
        return (
          <div style={{ width: 100 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text strong style={{ fontSize: 12, color }}>{record.stock}</Text>
                <Text type="secondary" style={{ fontSize: 10 }}>In Stock</Text>
             </div>
             <div style={{ height: 4, background: '#f0f0f0', borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${Math.min((record.stock / 150) * 100, 100)}%`, background: color, borderRadius: 2 }} />
             </div>
          </div>
        );
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record: ShoppingProduct) => {
        let status: any = 'success';
        if (record.status === 'Pending') status = 'processing';
        if (record.status === 'Out of Stock') status = 'error';
        if (record.status === 'Draft') status = 'default';
        return <Badge status={status} text={record.status} />;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: ShoppingProduct) => (
        <Space>
           {record.status === 'Pending' ? (
             <Button type="primary" size="small" icon={<CheckCircleOutlined />} style={{ backgroundColor: '#52c41a' }}>Approve</Button>
           ) : (
             <Button size="small">Edit</Button>
           )}
        </Space>
      ),
    },
  ];

  const filteredProducts = mockProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.vendor.toLowerCase().includes(searchQuery.toLowerCase());
      if (activeTab === 'All') return matchesSearch;
      return matchesSearch && p.status === activeTab;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
            <Title level={4} style={{ margin: 0 }}>Marketplace Catalog</Title>
            <Text type="secondary">Monitor multi-vendor SKU health, listing approvals, and pricing strategies.</Text>
        </div>
        <Space>
            <Button icon={<DownloadOutlined />}>Export CSV</Button>
            <Button type="primary" icon={<PlusOutlined />}>New Listing Req</Button>
        </Space>
      </div>

      <Card bordered={false} styles={{ body: { padding: 0 } }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
          <Space size="large" style={{ fontWeight: 500 }}>
             {['All', 'Active', 'Pending', 'Out of Stock'].map(tab => (
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
          <Space>
            <Input
                placeholder="Search catalog..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: 250 }}
            />
            <Button icon={<ReloadOutlined />} />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};
