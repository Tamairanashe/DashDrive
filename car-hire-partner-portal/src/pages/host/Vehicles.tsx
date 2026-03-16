import React from 'react';
import { Typography, Card, Space, Button, Table, Tag } from 'antd';
import { PlusOutlined, FilterOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Vehicles: React.FC = () => {
  const columns = [
    { title: 'Vehicle', dataIndex: 'model', key: 'model', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Plate', dataIndex: 'plate', key: 'plate' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color={status === 'Available' ? 'green' : 'blue'}>{status}</Tag> },
    { title: 'Daily Price', dataIndex: 'price', key: 'price', render: (price: number) => `$${price}` },
  ];

  const data = [
    { key: '1', model: 'BMW 3 Series', plate: 'ABC-123', status: 'Available', price: 80 },
    { key: '2', model: 'Tesla Model 3', plate: 'ECO-444', status: 'Booked', price: 120 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <Title level={2} className="!font-black">My Fleet</Title>
          <Text type="secondary">Manage your vehicle listings and availability</Text>
        </div>
        <Space>
          <Button size="large" icon={<FilterOutlined />} className="rounded-xl">Filters</Button>
          <Button type="primary" size="large" icon={<PlusOutlined />} className="rounded-xl bg-blue-600">Add Vehicle</Button>
        </Space>
      </div>
      <Card bordered={false} className="shadow-2xl rounded-[2rem] overflow-hidden">
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default Vehicles;
