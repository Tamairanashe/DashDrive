import React from 'react';
import { Typography, Card, Table, Tag } from 'antd';

const { Title } = Typography;

const Bookings: React.FC = () => {
  const columns = [
    { title: 'Booking ID', dataIndex: 'id', key: 'id' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Vehicle', dataIndex: 'vehicle', key: 'vehicle' },
    { title: 'Start Date', dataIndex: 'start', key: 'start' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color="blue">{status}</Tag> },
  ];

  const data = [
    { key: '1', id: 'BK-1001', customer: 'John Doe', vehicle: 'BMW 3 Series', start: '2026-03-20', status: 'Confirmed' },
  ];

  return (
    <div className="space-y-8">
      <Title level={2} className="!font-black">Bookings</Title>
      <Card bordered={false} className="shadow-2xl rounded-[2rem] overflow-hidden">
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default Bookings;
