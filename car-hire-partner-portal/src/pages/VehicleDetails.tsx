import React, { useState } from 'react';
import { 
  Typography, Button, Row, Col, Tag, 
  Rate, Avatar, Space, Card, Divider, 
  Calendar, Badge, List, Tooltip
} from 'antd';
import { 
  EnvironmentOutlined, 
  SafetyCertificateOutlined, 
  ThunderboltFilled,
  StarFilled,
  MessageOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  HeartOutlined,
  ShareAltOutlined,
  CheckCircleFilled,
  UserOutlined
} from '@ant-design/icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState(null);

  // In a real app, fetch vehicle by ID
  const car = {
    id: '1',
    name: 'Mercedes-Benz GLE-Class 2024',
    type: 'Luxury SUV',
    price: 171,
    rating: 5.0,
    trips: 16,
    images: [
      'https://images.unsplash.com/photo-1540066019607-e5f69323a8bc?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c3d9?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1621285222047-975be9037c22?auto=format&fit=crop&q=80&w=600'
    ],
    host: {
      name: 'Bruce Matthews',
      joined: '2022',
      rating: 5.0,
      responseTime: '5 mins',
      totalTrips: 145,
      isAllStar: true
    },
    specs: [
      { label: 'Seats', value: '7 seats' },
      { label: 'Engine', value: 'V6 Turbo' },
      { label: 'Fuel', value: 'Premium' },
      { label: 'Transmission', value: 'Automatic' }
    ],
    features: ['Blind spot warning', 'Backup camera', 'Sunroof', 'App-connect', 'Premium Sound']
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Photo Gallery - Premium Grid */}
      <section className="container mx-auto px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <BreadcrumbDetail name={car.name} />
          <Space>
            <Button icon={<ShareAltOutlined />} className="rounded-full border-gray-200 font-bold">Share</Button>
            <Button icon={<HeartOutlined />} className="rounded-full border-gray-200 font-bold">Save</Button>
          </Space>
        </div>

        <Row gutter={[16, 16]} className="h-[500px]">
          <Col span={12}>
            <img src={car.images[0]} className="w-full h-full object-cover rounded-[2.5rem]" alt="Car Main" />
          </Col>
          <Col span={12}>
            <div className="flex flex-col h-full gap-4">
              <div className="flex-1">
                <img src={car.images[1]} className="w-full h-full object-cover rounded-[2.5rem]" alt="Car Side" />
              </div>
              <div className="flex-1">
                <img src={car.images[2]} className="w-full h-full object-cover rounded-[2.5rem]" alt="Car Interior" />
              </div>
            </div>
          </Col>
        </Row>
      </section>

      <section className="container mx-auto px-8 py-12">
        <Row gutter={64}>
          {/* Main Info */}
          <Col xs={24} lg={15}>
            <div className="mb-12">
              <Title className="!font-black !text-5xl !mb-4">{car.name}</Title>
              <div className="flex items-center gap-6">
                <Space size={4} className="font-black text-gray-800">
                  {car.rating} <StarFilled className="text-amber-400" />
                </Space>
                <Text className="text-gray-400 font-bold underline cursor-pointer">({car.trips} trips)</Text>
                <div className="h-4 w-px bg-gray-200" />
                <Tag color="magenta" className="!rounded-full px-4 border-none font-black uppercase text-[10px] tracking-widest py-1">All-Star Host</Tag>
              </div>
            </div>

            <Divider className="border-gray-100" />

            {/* Features Row */}
            <Row className="py-8" gutter={[32, 24]}>
              {car.specs.map((spec, i) => (
                <Col span={6} key={i}>
                  <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-1">{spec.label}</Text>
                  <Text className="font-bold text-gray-800">{spec.value}</Text>
                </Col>
              ))}
            </Row>

            <Divider className="border-gray-100" />

            {/* Description */}
            <div className="py-8">
              <Title level={3} className="!font-black mb-6">Description</Title>
              <Paragraph className="text-gray-600 text-lg leading-relaxed">
                Experience luxury and performance with our brand new 2024 Mercedes GLE. Perfect for family road trips or a stylish weekend getaway. This model comes fully loaded with the latest safety features and premium amenities to ensure your journey is as smooth as possible.
              </Paragraph>
            </div>

            <Divider className="border-gray-100" />

            {/* Host Profile */}
            <div className="py-12 bg-gray-50/50 rounded-[3rem] p-10 flex gap-8">
              <div className="relative">
                <Avatar size={120} icon={<UserOutlined />} className="bg-indigo-100 text-indigo-600 border-4 border-white shadow-xl" />
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 rounded-full h-8 w-8 flex items-center justify-center border-2 border-white">
                  <CheckCircleFilled className="text-white text-sm" />
                </div>
              </div>
              <div className="flex-1">
                <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2 font-bold">Hosted by</Text>
                <Title level={2} className="!font-black !mb-4">{car.host.name}</Title>
                <Row gutter={48}>
                  <Col>
                    <div className="font-black text-xl">{car.host.totalTrips}</div>
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Trips</div>
                  </Col>
                  <Col>
                    <div className="font-black text-xl flex items-center">{car.host.rating} <StarFilled className="text-amber-400 text-sm ml-1" /></div>
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Rating</div>
                  </Col>
                  <Col>
                    <div className="font-black text-xl text-green-500">{car.host.responseTime}</div>
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Response</div>
                  </Col>
                </Row>
                <Button icon={<MessageOutlined />} className="mt-8 rounded-2xl h-12 flex items-center font-bold px-8 border-gray-200">
                  Message Bruce
                </Button>
              </div>
            </div>
          </Col>

          {/* Booking Component */}
          <Col xs={24} lg={9}>
            <div className="sticky top-44 bg-white border border-gray-100 rounded-[3rem] p-10 shadow-2xl shadow-gray-100">
              <div className="flex justify-between items-baseline mb-10">
                <div>
                  <Title level={2} className="!m-0 !font-black text-indigo-600">${car.price}</Title>
                  <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest">per day</Text>
                </div>
                <div className="text-right">
                  <Title level={5} className="!m-0 !font-black">$513 total</Title>
                  <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Excl. taxes & fees</Text>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2">Trip Start</Text>
                  <div className="font-bold cursor-pointer flex justify-between">
                    <Text className="text-lg">Mar 20, 2026</Text>
                    <Text className="text-gray-400">10:00 AM</Text>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2">Trip End</Text>
                  <div className="font-bold cursor-pointer flex justify-between">
                    <Text className="text-lg">Mar 23, 2026</Text>
                    <Text className="text-gray-400">10:00 AM</Text>
                  </div>
                </div>
              </div>

              <Button block type="primary" size="large" className="h-16 rounded-2xl font-black bg-indigo-600 text-lg shadow-xl shadow-indigo-100 mb-6">
                Continue to Book
              </Button>

              <div className="flex items-center justify-center p-4 rounded-xl bg-amber-50 gap-2">
                <ThunderboltFilled className="text-amber-500" />
                <Text className="text-amber-800 font-bold text-xs uppercase tracking-widest">Instant Booking Available</Text>
              </div>

              <Divider className="border-gray-50 mt-10 mb-6" />

              <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>Distance included</span>
                <span className="text-gray-600">600 mi</span>
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </div>
  );
}

function BreadcrumbDetail({ name }) {
  return (
    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
      <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
      <span>/</span>
      <Link to="/search" className="hover:text-indigo-600 transition-colors">Search</Link>
      <span>/</span>
      <span className="text-gray-800">{name}</span>
    </div>
  );
}
