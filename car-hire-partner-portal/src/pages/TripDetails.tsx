import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Card, Tabs, Descriptions, Timeline, Avatar, Divider, Input, Upload, Row, Col, Statistic, Button, Space, Tag, Breadcrumb } from 'antd';
import { MessageOutlined, FileTextOutlined, UserOutlined, CameraOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, CarOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

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

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const trip = MOCK_TRIPS.find(t => t.id === id) || MOCK_TRIPS[0]; // Fallback to first if not found
  const now = dayjs('2026-03-15T09:39:50-07:00');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'green',
      CONFIRMED: 'blue',
      REQUESTED: 'orange',
      COMPLETED: 'purple',
      CANCELLED: 'red'
    };
    return colors[status] || 'default';
  };

  const renderTimeline = () => {
    const isPast = (date: string) => dayjs(date).isBefore(now);
    
    return (
      <Timeline
        items={[
          {
            color: 'green',
            children: 'Booking Confirmed',
          },
          {
            color: isPast(trip.start) ? 'green' : 'blue',
            children: `Check-in Window (${dayjs(trip.start).format('MMM D, h:mm A')})`,
          },
          {
            color: trip.status === 'ACTIVE' || trip.status === 'COMPLETED' ? 'green' : 'gray',
            children: 'Trip Active',
          },
          {
            color: isPast(trip.end) ? 'green' : 'gray',
            children: `Check-out Window (${dayjs(trip.end).format('MMM D, h:mm A')})`,
          },
          {
            color: trip.status === 'COMPLETED' ? 'green' : 'gray',
            children: 'Review Period',
          },
        ]}
      />
    );
  };

  const renderTabContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="space-y-8 max-w-4xl">
          {/* Trip Summary */}
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Card className="bg-gray-50 border-gray-200">
                <Statistic title="Your Earnings" value={trip.earnings} prefix="$" valueStyle={{ color: '#16a34a', fontWeight: 'bold' }} />
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card className="bg-gray-50 border-gray-200">
                <Statistic title="Trip Status" value={trip.status} />
              </Card>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Descriptions title="Guest Details" bordered column={1} className="bg-white">
                <Descriptions.Item label="Name">
                  <Space><Avatar icon={<UserOutlined />} /> {trip.guest.name}</Space>
                </Descriptions.Item>
                <Descriptions.Item label="Rating">⭐ {trip.guest.rating} ({trip.guest.trips} trips)</Descriptions.Item>
                <Descriptions.Item label="Joined">Turo member since {trip.guest.joinDate}</Descriptions.Item>
              </Descriptions>
            </Col>
            <Col xs={24} md={12}>
              <Descriptions title="Vehicle Details" bordered column={1} className="bg-white">
                <Descriptions.Item label="Car">{trip.vehicle}</Descriptions.Item>
                <Descriptions.Item label="License Plate">{trip.licensePlate}</Descriptions.Item>
                <Descriptions.Item label="Dates">
                  {dayjs(trip.start).format('MMM D, h:mm A')} to <br/>{dayjs(trip.end).format('MMM D, h:mm A')}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>

          {/* Itinerary & Timeline */}
          <div>
            <Title level={5}>Itinerary & Timeline</Title>
            <Card className="shadow-sm">
              {renderTimeline()}
            </Card>
          </div>

          {/* Actions */}
          <div>
            <Title level={5}>Trip Actions</Title>
            <Card className="shadow-sm bg-indigo-50 border-indigo-100">
              <Space wrap size="middle">
                {trip.status === 'CONFIRMED' && <Button type="primary" size="large" icon={<CheckCircleOutlined />}>Check In Guest</Button>}
                {trip.status === 'ACTIVE' && <Button type="primary" size="large" icon={<CheckCircleOutlined />}>Check Out Guest</Button>}
                {trip.status === 'ACTIVE' && <Button size="large" icon={<ClockCircleOutlined />}>Extend Trip</Button>}
                {['CONFIRMED', 'REQUESTED'].includes(trip.status) && <Button danger size="large">Cancel Trip</Button>}
                {['ACTIVE', 'COMPLETED'].includes(trip.status) && <Button danger size="large" icon={<ExclamationCircleOutlined />}>Report Issue</Button>}
                {trip.status === 'COMPLETED' && <Button type="primary" size="large">Leave Review</Button>}
              </Space>
            </Card>
          </div>
        </div>
      );
    }

    if (activeTab === 'messages') {
      return (
        <div className="flex flex-col h-[600px] max-w-4xl space-y-4">
          <div className="flex-1 bg-gray-50 rounded-lg p-6 overflow-y-auto border border-gray-200">
            <div className="text-center text-gray-400 text-sm mb-6">Trip booked on {dayjs(trip.start).subtract(5, 'days').format('MMMM D, YYYY')}</div>
            <div className="flex gap-4 mb-6">
              <Avatar icon={<UserOutlined />} size="large" />
              <div className="bg-white p-4 rounded-xl rounded-tl-none shadow-sm border border-gray-100 max-w-[80%]">
                <Text className="text-base">Hi! I'm looking forward to renting your {trip.vehicle.split(' ')[0]}. Will you be available for handoff around {dayjs(trip.start).format('h:mm A')}?</Text>
                <div className="text-xs text-gray-400 mt-2">{dayjs(trip.start).subtract(2, 'days').format('h:mm A')}</div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <TextArea rows={3} placeholder="Type a message to the guest..." className="flex-1 text-base" />
            <Button type="primary" size="large" className="h-auto px-8">Send</Button>
          </div>
        </div>
      );
    }

    if (activeTab === 'photos') {
      return (
        <div className="space-y-8 max-w-4xl">
          <Card title="Pre-Trip Photos" className="shadow-sm">
            <Text className="text-gray-500 block mb-4">Upload photos of the car's exterior, interior, mileage, and fuel level before handoff.</Text>
            <Upload listType="picture-card">
              <div>
                <CameraOutlined className="text-2xl" />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Card>
          
          <Card title="Post-Trip Photos" className="shadow-sm">
            <Text className="text-gray-500 block mb-4">Upload photos after return to document condition and fuel.</Text>
            <Upload listType="picture-card" disabled={trip.status === 'CONFIRMED' || trip.status === 'REQUESTED'}>
              <div>
                <CameraOutlined className="text-2xl" />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Card>
        </div>
      );
    }

    if (activeTab === 'receipts') {
      return (
        <div className="space-y-6 max-w-2xl">
          <Card title="Invoice & Earnings" className="shadow-sm">
            <div className="space-y-4 text-base">
              <div className="flex justify-between">
                <Text>Trip Price ({trip.dailyRate} × {trip.days} days)</Text>
                <Text>${trip.dailyRate * trip.days}</Text>
              </div>
              {trip.extras > 0 && (
                <div className="flex justify-between">
                  <Text>Extras (Delivery, etc.)</Text>
                  <Text>${trip.extras}</Text>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <Text>Turo Host Fee (25%)</Text>
                <Text>-${((trip.dailyRate * trip.days + trip.extras) * 0.25).toFixed(2)}</Text>
              </div>
              <Divider className="my-4" />
              <div className="flex justify-between font-bold text-xl">
                <Text strong>Your Earnings</Text>
                <Text className="text-green-600">${trip.earnings}</Text>
              </div>
            </div>
          </Card>
          <Button icon={<FileTextOutlined />} size="large" block>Download Full Receipt</Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { title: <a onClick={() => navigate('/trips')}>Trips</a> },
          { title: trip.id },
        ]}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/trips')} />
          <Title level={3} className="!mb-0">Trip {trip.id}</Title>
          <Tag color={getStatusColor(trip.status)} className="text-sm px-3 py-1">{trip.status}</Tag>
        </div>
      </div>

      <Card className="shadow-sm p-0" styles={{ body: { padding: '0 24px' } }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          items={[
            { key: 'overview', label: <span><CarOutlined /> Overview</span> },
            { key: 'messages', label: <span><MessageOutlined /> Messages</span> },
            { key: 'photos', label: <span><CameraOutlined /> Photos</span> },
            { key: 'receipts', label: <span><FileTextOutlined /> Receipts</span> },
          ]}
        />
      </Card>

      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
