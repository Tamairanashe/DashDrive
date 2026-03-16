import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button, Space, Typography, Card, Tabs, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// Mock Data
const MOCK_TRIPS = [
  {
    id: 'TRX-1024',
    guest: { name: 'Michael Chen', rating: 5.0, trips: 12, joinDate: '2023' },
    vehicle: 'BMW X5 (2024)',
    licensePlate: 'XYZ-9876',
    start: '2026-03-14T14:00:00',
    end: '2026-03-17T14:00:00',
    status: 'ACTIVE',
    earnings: 320,
    dailyRate: 100,
    days: 3,
    extras: 20
  },
  {
    id: 'TRX-1023',
    guest: { name: 'Sarah Jenkins', rating: 4.8, trips: 5, joinDate: '2024' },
    vehicle: 'Tesla Model 3 (2023)',
    licensePlate: 'ABC-1234',
    start: '2026-03-16T10:00:00',
    end: '2026-03-18T10:00:00',
    status: 'CONFIRMED',
    earnings: 150,
    dailyRate: 75,
    days: 2,
    extras: 0
  },
  {
    id: 'TRX-1025',
    guest: { name: 'Emma Watson', rating: 0, trips: 0, joinDate: '2026' },
    vehicle: 'Toyota Corolla (2022)',
    licensePlate: 'DEF-5678',
    start: '2026-03-20T11:00:00',
    end: '2026-03-22T11:00:00',
    status: 'REQUESTED',
    earnings: 90,
    dailyRate: 45,
    days: 2,
    extras: 0
  },
  {
    id: 'TRX-1020',
    guest: { name: 'David Smith', rating: 4.9, trips: 22, joinDate: '2021' },
    vehicle: 'Honda Civic (2021)',
    licensePlate: 'LMN-4321',
    start: '2026-03-01T09:00:00',
    end: '2026-03-05T09:00:00',
    status: 'COMPLETED',
    earnings: 210,
    dailyRate: 50,
    days: 4,
    extras: 10
  },
];

export default function Trips() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');

  const now = dayjs('2026-03-15T09:11:36-07:00'); // Using the provided local time

  const filteredTrips = useMemo(() => {
    return MOCK_TRIPS.filter(trip => {
      if (activeTab === 'upcoming') return ['CONFIRMED', 'REQUESTED'].includes(trip.status) || dayjs(trip.start).isAfter(now);
      if (activeTab === 'active') return trip.status === 'ACTIVE';
      if (activeTab === 'past') return ['COMPLETED', 'CANCELLED'].includes(trip.status) || dayjs(trip.end).isBefore(now);
      return true;
    });
  }, [activeTab]);

  const handleManageTrip = (trip: any) => {
    navigate(`/trips/${trip.id}`);
  };

  const columns = [
    {
      title: 'Guest',
      key: 'guest',
      render: (_: any, record: any) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Text strong>{record.guest.name}</Text>
        </Space>
      ),
    },
    {
      title: 'Vehicle',
      dataIndex: 'vehicle',
      key: 'vehicle',
    },
    {
      title: 'Dates',
      key: 'dates',
      render: (_: any, record: any) => (
        <Text>
          {dayjs(record.start).format('MMM D')} - {dayjs(record.end).format('MMM D, YYYY')}
        </Text>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          ACTIVE: 'green',
          CONFIRMED: 'blue',
          REQUESTED: 'orange',
          COMPLETED: 'purple',
          CANCELLED: 'red'
        };
        return <Tag color={colors[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: 'Earnings',
      key: 'earnings',
      render: (_: any, record: any) => <Text className="font-semibold text-green-600">${record.earnings}</Text>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button type="primary" size="small" onClick={() => handleManageTrip(record)}>
          Manage Trip
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={4} className="!mb-0">Trips Management</Title>
      </div>

      <Card className="shadow-sm p-0" styles={{ body: { padding: 0 } }}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          className="px-4 pt-2"
          items={[
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'active', label: 'Active' },
            { key: 'past', label: 'Past' },
          ]}
        />
        <Table 
          columns={columns} 
          dataSource={filteredTrips} 
          rowKey="id"
          pagination={{ pageSize: 10 }} 
          scroll={{ x: 'max-content' }}
          className="border-t border-gray-100"
        />
      </Card>
    </div>
  );
}
