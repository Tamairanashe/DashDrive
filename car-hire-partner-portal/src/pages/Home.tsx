import React, { useState } from 'react';
import { Typography, Input, Button, Row, Col, Card, DatePicker, Space, Tag, Divider } from 'antd';
import { 
  SearchOutlined, 
  CarOutlined, 
  SafetyOutlined, 
  GlobalOutlined, 
  StarFilled,
  ArrowRightOutlined,
  CompassOutlined,
  CrownOutlined,
  ThunderboltFilled,
  TeamOutlined
} from '@ant-design/icons';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const CATEGORIES = [
  { name: 'Luxury', icon: <CrownOutlined />, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Adventure', icon: <CompassOutlined />, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400' },
  { name: 'Electric', icon: <ThunderboltFilled />, image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=400' },
  { name: 'Family', icon: <TeamOutlined />, image: 'https://images.unsplash.com/photo-1517672745183-1437acd46fb4?auto=format&fit=crop&q=80&w=400' },
];

export default function Home() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.1]);

  return (
    <div className="bg-white selection:bg-indigo-100">
      {/* Immersive Hero Section */}
      <section className="relative h-[85vh] min-h-[700px] flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-white" />
        </motion.div>

        <div className="container mx-auto px-12 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          >
            <Tag className="bg-white/20 backdrop-blur-md text-white border-none font-bold px-6 py-1.5 rounded-full mb-8 tracking-widest uppercase text-[10px]">
              The Gold Standard of Car Sharing
            </Tag>
            <Title className="!text-white !text-7xl lg:!text-8xl !font-black !mb-8 leading-[0.9] tracking-tighter">
              Drive the <span className="text-indigo-400">Exceptional.</span>
            </Title>
            <Paragraph className="text-white/80 text-xl lg:text-2xl font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
              Unlock a world of premium mobility. From exotic sports cars to rugged explorers, find your perfect match.
            </Paragraph>

            {/* Floating Premium Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="max-w-5xl mx-auto bg-white/95 backdrop-blur-2xl rounded-[3rem] p-3 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] flex flex-wrap lg:flex-nowrap items-center gap-2"
            >
              <div className="flex-1 px-8 py-4 border-r border-gray-100 group transition-all">
                <Text className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 block mb-2">Location</Text>
                <Input 
                  placeholder="Where to?" 
                  variant="borderless" 
                  className="!px-0 font-black text-lg placeholder:text-gray-300" 
                  prefix={<SearchOutlined className="text-indigo-500 mr-2" />}
                />
              </div>
              <div className="flex-1 px-8 py-4 border-r border-gray-100">
                <Text className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 block mb-2">Trip Start</Text>
                <DatePicker variant="borderless" className="!px-0 font-black text-lg w-full" placeholder="Pick a date" />
              </div>
              <div className="flex-1 px-8 py-4 border-r border-gray-100">
                <Text className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 block mb-2">Trip End</Text>
                <DatePicker variant="borderless" className="!px-0 font-black text-lg w-full" placeholder="Pick a date" />
              </div>
              <Button 
                type="primary" 
                size="large" 
                className="h-[72px] px-12 rounded-[2rem] bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-lg font-black shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
                icon={<ArrowRightOutlined />}
              >
                Search
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-32">
        <div className="container mx-auto px-12">
          <Row gutter={[24, 24]}>
            {CATEGORIES.map((cat, idx) => (
              <Col xs={12} lg={6} key={cat.name}>
                <motion.div
                  whileHover={{ y: -10 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card 
                    className="rounded-[2.5rem] overflow-hidden border-none shadow-sm hover:shadow-xl transition-all h-[300px] group relative"
                    styles={{ body: { padding: 0 } }}
                  >
                    <img src={cat.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={cat.name} />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    <div className="absolute bottom-8 left-8 text-white z-10">
                      <div className="text-2xl mb-2">{cat.icon}</div>
                      <Title level={3} className="!text-white !font-black !m-0">{cat.name}</Title>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Featured Fleet with refined cards */}
      <section className="py-32 bg-gray-50/50">
        <div className="container mx-auto px-12">
          <div className="flex justify-between items-end mb-20">
            <div>
              <Text className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Our Curated Selection</Text>
              <Title level={2} className="!font-black !text-5xl !m-0 tracking-tighter">Iconic Drives.</Title>
            </div>
            <Link to="/search" className="h-14 px-8 rounded-2xl border-2 border-indigo-100 text-indigo-600 font-bold flex items-center hover:bg-indigo-50 transition-all group">
              Explore the whole fleet <ArrowRightOutlined className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <Row gutter={[40, 40]}>
            {[
              {
                id: '1',
                name: 'Mercedes-Benz GLE-Class',
                price: 171,
                image: 'https://images.unsplash.com/photo-1540066019607-e5f69323a8bc?auto=format&fit=crop&q=80&w=800',
                rating: 5.0,
                trips: 16,
                type: 'Luxury SUV'
              },
              {
                id: '2',
                name: 'Tesla Model S Plaid',
                price: 245,
                image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800',
                rating: 4.9,
                trips: 42,
                type: 'Super Electric'
              },
              {
                id: '3',
                name: 'Porsche 911 Carrera',
                price: 389,
                image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
                rating: 5.0,
                trips: 12,
                type: 'High Performance'
              }
            ].map((car, idx) => (
              <Col xs={24} lg={8} key={car.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/vehicle/${car.id}`}>
                    <Card
                      hoverable
                      className="rounded-[3rem] overflow-hidden border-none shadow-premium group bg-white"
                      styles={{ body: { padding: 0 } }}
                      cover={
                        <div className="h-[340px] overflow-hidden relative">
                          <img alt={car.name} src={car.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                          <div className="absolute top-6 left-6">
                            <Tag className="bg-black/60 backdrop-blur-md text-white border-none font-black px-4 py-1 rounded-full uppercase text-[10px] tracking-widest">
                              <StarFilled className="text-amber-400 mr-2" /> {car.rating}
                            </Tag>
                          </div>
                          <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                            <Button shape="circle" icon={<ArrowRightOutlined />} className="h-14 w-14 bg-indigo-600 text-white border-none text-xl" />
                          </div>
                        </div>
                      }
                    >
                      <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 block">{car.type}</Text>
                            <Title level={3} className="!font-black !m-0 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{car.name}</Title>
                          </div>
                          <div className="text-right">
                            <Text className="text-indigo-600 font-black text-2xl tracking-tighter">${car.price}</Text>
                            <Text className="text-gray-400 text-[10px] font-bold block uppercase tracking-widest">/ day</Text>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-400 text-xs font-bold pt-6 border-t border-gray-50/50 uppercase tracking-widest">
                          <Text className="mr-6">{car.trips} trips</Text>
                          <Text className="flex items-center"><SafetyOutlined className="mr-2 text-indigo-500" /> DashDrive Elite</Text>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Trust & Safety - Modern Grid */}
      <section className="py-40">
        <div className="container mx-auto px-12 text-center">
          <Title level={2} className="!font-black !text-5xl mb-24 tracking-tighter">The DashDrive Assurance.</Title>
          <Row gutter={[64, 64]}>
            {[
              {
                icon: <CarOutlined className="text-5xl text-indigo-500" />,
                title: 'Limitless Choice',
                desc: 'Access an elite fleet of vehicles you won’t find at traditional rental counters.'
              },
              {
                icon: <SafetyOutlined className="text-5xl text-indigo-500" />,
                title: 'Elite Protection',
                desc: 'Every journey is protected by our highest tier of insurance and 24/7 white-glove support.'
              },
              {
                icon: <GlobalOutlined className="text-5xl text-indigo-500" />,
                title: 'Global Precision',
                desc: 'Seamless pick-up and drop-off in the world’s most iconic cities and destinations.'
              }
            ].map((feature, idx) => (
              <Col xs={24} md={8} key={idx}>
                <motion.div 
                  className="p-12 rounded-[3rem] hover:bg-gray-50 transition-all duration-300 group"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                >
                  <div className="mb-10 group-hover:scale-110 transition-transform duration-500">{feature.icon}</div>
                  <Title level={3} className="!font-black mb-6 uppercase tracking-tight">{feature.title}</Title>
                  <Text className="text-gray-500 text-lg leading-relaxed block">{feature.desc}</Text>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Host CTA - High Conversion */}
      <section className="py-40 container mx-auto px-12">
        <div className="bg-[#0f172a] rounded-[4rem] p-24 text-center text-white relative overflow-hidden group">
          <div className="relative z-10 flex flex-col items-center">
            <Tag className="bg-indigo-600 text-white border-none font-bold px-8 py-2 rounded-full mb-10 tracking-widest uppercase text-xs">
              Monetize Your Assets
            </Tag>
            <Title className="!text-white !text-7xl !font-black mb-10 tracking-tighter max-w-4xl">
              Turn your garage into a <span className="text-indigo-400">revenue engine.</span>
            </Title>
            <Paragraph className="text-gray-400 text-xl max-w-2xl mb-16 leading-relaxed">
              Join thousands of hosts earning significant passive income by listing their vehicles on DashDrive Elite.
            </Paragraph>
            <Space size="large">
              <Button size="large" className="h-20 px-16 rounded-[2rem] font-black bg-white text-indigo-900 border-none shadow-2xl hover:scale-105 transition-all text-xl">
                Become a Host
              </Button>
            </Space>
          </div>
          {/* Subtle animated light blobs */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-indigo-500/20 transition-all duration-1000" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -ml-64 -mb-64 group-hover:bg-indigo-500/20 transition-all duration-1000" />
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-24 border-t border-gray-100 bg-white">
        <div className="container mx-auto px-12">
          <Row gutter={[64, 64]}>
            <Col xs={24} md={8}>
              <div className="font-black text-3xl text-indigo-600 uppercase tracking-tighter mb-8">DashDrive</div>
              <Paragraph className="text-gray-400 text-lg leading-relaxed max-w-sm">
                Redefining prestige on the road. The world’s leading car sharing marketplace for those who refuse to compromise.
              </Paragraph>
            </Col>
            {[
              { title: 'Company', links: ['Our Story', 'Principles', 'Careers', 'Press'] },
              { title: 'Explore', links: ['Book', 'Destinations', 'Trust & Safety', 'Elite Membership'] },
              { title: 'Hosting', links: ['List Your Car', 'Calculator', 'Host Stories', 'Insurance'] }
            ].map((group, idx) => (
              <Col xs={12} md={5} key={idx}>
                <Title level={5} className="!font-black mb-8 uppercase tracking-[0.3em] text-[10px] text-gray-500">{group.title}</Title>
                <div className="space-y-6">
                  {group.links.map(link => (
                    <Link key={link} to="#" className="block text-gray-900 font-bold hover:text-indigo-600 transition-colors">{link}</Link>
                  ))}
                </div>
              </Col>
            ))}
          </Row>
          <Divider className="my-20 border-gray-50" />
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-300 text-xs font-black uppercase tracking-[0.2em]">
            <Text>© 2026 DashDrive Inc. All rights reserved.</Text>
            <Space size="large" className="mt-8 md:mt-0">
              <Link to="#" className="text-gray-300 hover:text-indigo-600">Privacy</Link>
              <Link to="#" className="text-gray-300 hover:text-indigo-600">Terms</Link>
              <Link to="#" className="text-gray-300 hover:text-indigo-600">Sitemap</Link>
            </Space>
          </div>
        </div>
      </footer>
    </div>
  );
}
