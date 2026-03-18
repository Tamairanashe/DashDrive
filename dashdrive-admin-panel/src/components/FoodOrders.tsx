import React, { useState } from 'react';
import { Table, Tag, Space, Button, Typography, Card, Badge } from 'antd';
import { EyeOutlined, ShoppingCartOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const FoodOrders: React.FC = () => {
  const [orders] = useState([
    { id: 'ORD-101', customer: 'John Doe', restaurant: 'Burger King', amount: 25.50, status: 'Preparing', time: '10 mins ago' },
    { id: 'ORD-102', customer: 'Jane Smith', restaurant: 'Pizza Hut', amount: 42.00, status: 'Out for Delivery', time: '5 mins ago' },
    { id: 'ORD-103', customer: 'Bob Johnson', restaurant: 'KFC', amount: 12.50, status: 'Pending', time: '15 mins ago' },
  ]);

  const columns = [
    { title: 'Order ID', dataIndex: 'id', key: 'id', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Restaurant', dataIndex: 'restaurant', key: 'restaurant' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount: number) => `$${amount.toFixed(2)}` },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'Out for Delivery' ? 'processing' : status === 'Preparing' ? 'warning' : 'default'} 
          text={status} 
        />
      )
    },
    { title: 'Time', dataIndex: 'time', key: 'time' },
    { 
      title: 'Action', 
      key: 'action',
      render: () => (
        <Button size="small" icon={<EyeOutlined />}>View</Button>
      )
    },
  ];

  return (
    <Card title={<span><ShoppingCartOutlined /> Recent Food Orders</span>} bordered={false}>
      <Table 
        dataSource={orders} 
        columns={columns} 
        rowKey="id" 
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};
