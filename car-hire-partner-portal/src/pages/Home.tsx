import React from 'react';
import { Typography, Input, Button, Row, Col, Card, DatePicker, TimePicker, Space, Tag } from 'antd';
import { 
  SearchOutlined, 
  CarOutlined, 
  SafetyOutlined, 
  GlobalOutlined, 
  StarFilled,
  ArrowRightOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container mx-auto px-8 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title className="!text-white !text-7xl !font-black !mb-6 leading-tight tracking-tighter">
              Skip the rental car counter
            </Title>
            <Text className="text-white/90 text-2xl font-medium mb-12 block">
              Rent just about any car, just about anywhere
            </Text>

            {/* Premium Search Bar */}
            <div className="max-w-4xl mx-auto bg-white rounded-[2rem] p-4 shadow-2xl flex flex-wrap lg:flex-nowrap items-center gap-4">
              <div className="flex-1 px-4 border-r border-gray-100 text-left">
                <Text className="text-[10px] uppercase font-black tracking-widest text-gray-400 block mb-1">Where</Text>
                <Input 
                  placeholder="City, airport, address, or hotel" 
                  variant="borderless" 
                  className="!px-0 font-bold text-lg" 
                  prefix={<SearchOutlined className="text-gray-300" />}
                />
              </div>
              <div className="flex-1 px-4 border-r border-gray-100 text-left">
                <Text className="text-[10px] uppercase font-black tracking-widest text-gray-400 block mb-1">From</Text>
                <DatePicker variant="borderless" className="!px-0 font-bold text-lg w-full" placeholder="Add dates" />
              </div>
              <div className="flex-1 px-4 border-r border-gray-100 text-left">
                <Text className="text-[10px] uppercase font-black tracking-widest text-gray-400 block mb-1">Until</Text>
                <DatePicker variant="borderless" className="!px-0 font-bold text-lg w-full" placeholder="Add dates" />
              </div>
              <Button 
                type="primary" 
                size="large" 
                shape="circle" 
                icon={<SearchOutlined />} 
                className="h-16 w-16 bg-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-200"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Fleet */}
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <Text className="text-indigo-600 font-black uppercase tracking-[0.2em] text-sm mb-2 block">Premium Selection</Text>
              <Title level={2} className="!font-black !text-4xl !m-0">Featured Vehicles</Title>
            </div>
            <Link to="/search" className="text-indigo-600 font-bold flex items-center group">
              View all vehicles <ArrowRightOutlined className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <Row gutter={[32, 32]}>
            {[
              {
                id: '1',
                name: 'Mercedes-Benz GLE-Class',
                price: 171,
                image: 'https://images.unsplash.com/photo-1540066019607-e5f69323a8bc?auto=format&fit=crop&q=80&w=600',
                rating: 5.0,
                trips: 16
              },
              {
                id: '2',
                name: 'Tesla Model S Plaid',
                price: 245,
                image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=600',
                rating: 4.9,
                trips: 42
              },
              {
                id: '3',
                name: 'Porsche 911 Carrera',
                price: 389,
                image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600',
                rating: 5.0,
                trips: 12
              }
            ].map((car, idx) => (
              <Col xs={24} md={8} key={car.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    hoverable
                    className="rounded-[2.5rem] overflow-hidden border-none shadow-lg group"
                    styles={{ body: { padding: 0 } }}
                    cover={
                      <div className="h-64 overflow-hidden relative">
                        <img alt={car.name} src={car.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-4 right-4">
                          <Tag color="white" className="!rounded-full px-3 py-1 font-bold text-gray-800 border-none shadow-sm backdrop-blur-md">
                            <StarFilled className="text-amber-400 mr-1" /> {car.rating}
                          </Tag>
                        </div>
                      </div>
                    }
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <Text className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1 block">SUV • All Wheel Drive</Text>
                          <Title level={4} className="!font-black !m-0">{car.name}</Title>
                        </div>
                        <div className="text-right">
                          <Text className="text-indigo-600 font-black text-xl">${car.price}</Text>
                          <Text className="text-gray-400 text-[10px] font-bold block">per day</Text>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm font-medium pt-4 border-t border-gray-50">
                        <Text className="mr-4">{car.trips} trips</Text>
                        <Text>DashDrive Verified</Text>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Why DashDrive */}
      <section className="py-24">
        <div className="container mx-auto px-8 text-center">
          <Title level={2} className="!font-black !text-4xl mb-16">Why choose DashDrive?</Title>
          <Row gutter={[48, 48]}>
            {[
              {
                icon: <CarOutlined className="text-4xl text-indigo-500" />,
                title: 'Endless options',
                desc: 'Choose from hundreds of models you won’t find anywhere else.'
              },
              {
                icon: <SafetyOutlined className="text-4xl text-indigo-500" />,
                title: 'Book with confidence',
                desc: 'Every trip is backed by top-tier insurance and 24/7 support.'
              },
              {
                icon: <GlobalOutlined className="text-4xl text-indigo-500" />,
                title: 'Global reach',
                desc: 'Find the perfect car in over 50 countries and 5,000 cities.'
              }
            ].map((feature, idx) => (
              <Col xs={24} md={8} key={idx}>
                <div className="p-8 rounded-3xl hover:bg-gray-50 transition-colors">
                  <div className="mb-6">{feature.icon}</div>
                  <Title level={4} className="!font-black mb-4">{feature.title}</Title>
                  <Text className="text-gray-500 leading-relaxed block">{feature.desc}</Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 container mx-auto px-8">
        <div className="bg-indigo-600 rounded-[3rem] p-16 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <Title className="!text-white !text-5xl !font-black mb-8">Ready to hit the road?</Title>
            <Space size="large">
              <Button size="large" className="h-16 px-10 rounded-2xl font-bold bg-white text-indigo-600 border-none shadow-xl">
                Browse cars
              </Button>
              <Button size="large" className="h-16 px-10 rounded-2xl font-bold border-2 border-white/30 text-white bg-transparent hover:bg-white/10">
                Become a host
              </Button>
            </Space>
          </div>
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32" />
        </div>
      </section>

      {/* Main Footer */}
      <footer className="py-16 border-t border-gray-100 bg-gray-50/30">
        <div className="container mx-auto px-8">
          <Row gutter={[48, 48]}>
            <Col xs={24} md={6}>
              <div className="font-black text-2xl text-indigo-600 uppercase tracking-tighter mb-6">DashDrive</div>
              <Text className="text-gray-400 block mb-6">Redefining the car rental experience with premium vehicles and seamless service.</Text>
            </Col>
            {[
              { title: 'DashDrive', links: ['About', 'Team', 'Policies', 'Careers'] },
              { title: 'Explore', links: ['Book a car', 'Weddings', 'Trust & Safety', 'Insurance'] },
              { title: 'Hosting', links: ['List your car', 'Car calculator', 'Host stories', 'Help center'] }
            ].map((group, idx) => (
              <Col xs={12} md={6} key={idx}>
                <Title level={5} className="!font-black mb-6 uppercase tracking-widest text-xs text-gray-500">{group.title}</Title>
                <div className="space-y-4">
                  {group.links.map(link => (
                    <Link key={link} to="#" className="block text-gray-600 font-semibold hover:text-indigo-600 transition-colors">{link}</Link>
                  ))}
                </div>
              </Col>
            ))}
          </Row>
          <div className="mt-20 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm font-bold">
            <Text>© 2026 DashDrive Inc. All rights reserved.</Text>
            <Space size="large" className="mt-4 md:mt-0">
              <Link to="#" className="text-gray-400 hover:text-indigo-600">Privacy</Link>
              <Link to="#" className="text-gray-400 hover:text-indigo-600">Terms</Link>
              <Link to="#" className="text-gray-400 hover:text-indigo-600">Sitemap</Link>
            </Space>
          </div>
        </div>
      </footer>
    </div>
  );
}
