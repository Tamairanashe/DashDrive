import React, { useState } from 'react';
import { Table, Card, Button, Input, Space, Tag, Typography, Row, Col, Dropdown, MenuProps, Empty, Tabs } from 'antd';
import { PlusOutlined, SearchOutlined, FilterOutlined, MoreOutlined, EditOutlined, EyeOutlined, CloudUploadOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import { Package, Utensils, Clock, Tag as TagIcon, Layers } from 'lucide-react';

const { Title, Text } = Typography;

interface MenuItem {
  id: string;
  name: string;
  restaurant: string;
  category: string;
  price: string;
  availability: 'In Stock' | 'Out of Stock';
  status: 'Active' | 'Inactive';
  prepTime: string;
  image: string;
}

const mockItems: MenuItem[] = [
  {
    id: 'ITM-901',
    name: 'Whopper Meal',
    restaurant: 'Burger King',
    category: 'Burgers',
    price: '$12.99',
    availability: 'In Stock',
    status: 'Active',
    prepTime: '10-15 min',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop'
  },
  {
    id: 'ITM-902',
    name: 'Kacchi Biryani',
    restaurant: "Sultan's Dine",
    category: 'Main Course',
    price: '$18.50',
    availability: 'In Stock',
    status: 'Active',
    prepTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1589302168068-1c459288350e?w=400&h=400&fit=crop'
  },
  {
    id: 'ITM-903',
    name: 'Pepperoni Feast',
    restaurant: 'Pizza Hut',
    category: 'Pizza',
    price: '$14.99',
    availability: 'Out of Stock',
    status: 'Inactive',
    prepTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop'
  }
];

export const MenuManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('items');

  const getActionMenu = (record: MenuItem): MenuProps => ({
    items: [
      { key: 'edit', icon: <EditOutlined />, label: 'Edit Item' },
      { key: 'view', icon: <EyeOutlined />, label: 'View Details' },
      { type: 'divider' },
      { key: 'delete', danger: true, label: 'Remove Item' },
    ]
  });

  const columns = [
    {
      title: 'Item Details',
      key: 'item',
      render: (_: any, record: MenuItem) => (
        <Space size="middle">
          <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', border: '1px solid #f0f0f0' }}>
            <img src={record.image} alt={record.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <Text strong style={{ fontSize: 15, display: 'block' }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.id}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Assignment',
      key: 'assignment',
      render: (_: any, record: MenuItem) => (
        <Space orientation="vertical" size={2}>
          <Space>
            <Utensils className="w-4 h-4 text-slate-400" />
            <Text strong>{record.restaurant}</Text>
          </Space>
          <Space>
            <TagIcon className="w-3.5 h-3.5 text-slate-400" />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.category}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Price & Data',
      key: 'price',
      render: (_: any, record: MenuItem) => (
        <Space orientation="vertical" size={2}>
          <Text strong style={{ fontSize: 15 }}>{record.price}</Text>
          <Space>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.prepTime}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Availability',
      key: 'availability',
      render: (_: any, record: MenuItem) => (
        <Tag color={record.availability === 'In Stock' ? 'success' : 'error'}>
          {record.availability}
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: MenuItem) => (
        <Space>
            {record.status === 'Active' ? <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#cbd5e1' }} />}
            <Text type={record.status === 'Active' ? 'success' : 'secondary'} strong style={{ fontSize: 12 }}>{record.status}</Text>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: MenuItem) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} />
          <Dropdown menu={getActionMenu(record)} trigger={['click']} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>Catalog Control</Title>
          <Text type="secondary">Manage global menu items, categories, and modifier groups</Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<CloudUploadOutlined />}>Bulk Import (CSV)</Button>
            <Button type="primary" icon={<PlusOutlined />}>Add Menu Item</Button>
          </Space>
        </Col>
      </Row>

      <Card bordered={false} className="shadow-sm border border-slate-100 rounded-2xl" bodyStyle={{ padding: 0 }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab} 
            items={[
                { key: 'categories', label: 'Categories' },
                { key: 'items', label: 'Items' },
                { key: 'modifiers', label: 'Modifiers' },
                { key: 'schedule', label: 'Availability Schedule' }
            ]} 
            style={{ marginBottom: -17 }}
          />
          <Space>
            <Input 
                placeholder="Find items/categories..." 
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                style={{ width: 280, borderRadius: 8 }}
            />
            <Button icon={<FilterOutlined />} />
          </Space>
        </div>

        {activeTab === 'items' ? (
          <Table 
            columns={columns} 
            dataSource={mockItems} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: <Empty description="No menu items found." />
            }}
          />
        ) : (
          <div style={{ padding: '100px 24px', textAlign: 'center' }}>
            <Empty 
                image={<AppstoreAddOutlined style={{ fontSize: 64, color: '#cbd5e1' }} />}
                description={
                    <span>
                        <Title level={4} style={{ marginTop: 16 }}>Unified {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} View</Title>
                        <Text type="secondary">The global management interface for {activeTab} is being optimized for enterprise catalog scaling.</Text>
                    </span>
                }
            >
                <Button type="primary" size="large" style={{ marginTop: 16, borderRadius: 8 }}>
                    Create New {activeTab.slice(0, -1)}
                </Button>
            </Empty>
          </div>
        )}
      </Card>
    </div>
  );
};

