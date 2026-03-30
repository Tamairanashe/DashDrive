import React, { useState, useEffect } from 'react';
import { 
  Typography, Button, Row, Col, Card, 
  Tag, Space, Avatar, Divider, Breadcrumb, 
  Rate, List, Affix, DatePicker, Select,
  ConfigProvider, Progress
} from 'antd';
import { 
  StarFilled, 
  EnvironmentOutlined,
  ThunderboltFilled,
  SafetyOutlined,
  VerifiedOutlined,
  CalendarOutlined,
  CarOutlined,
  ToolOutlined,
  SettingOutlined,
  SoundOutlined,
  ArrowLeftOutlined,
  ShareAltOutlined,
  HeartOutlined,
  ArrowRightOutlined,
  CheckCircleFilled,
  InfoCircleOutlined,
  ClockCircleOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;

const MOCK_CAR = {
  id: '1',
  name: 'Mercedes-Benz GLE-Class 2024',
  tagline: 'The Pinnacle of Executive Comfort and Off-Road Prowess',
  type: 'Executive SUV',
  price: 171,
  rating: 5.0,
  reviewsCount: 16,
  description: `Experience the future of the luxury SUV. This 2024 Mercedes-Benz GLE-Class combines cutting-edge technology with unparalleled comfort. Featuring an intelligent MBUX infotainment system, advanced driver assistance, and a smooth, powerful engine that makes every journey effortless.

Perfect for executive travel, family adventures, or simply making a statement. The interior is a sanctuary of fine leather, ambient lighting, and panoramic views.`,
  images: [
    'https://images.unsplash.com/photo-1540066019607-e5f69323a8bc?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1517672745183-1437acd46fb4?auto=format&fit=crop&q=80&w=1000',
  ],
  specs: [
    { label: 'Transmission', value: '9G-TRONIC Auto', icon: <SettingOutlined /> },
    { label: 'Fuel Type', value: 'Premium Unleaded', icon: <ThunderboltFilled /> },
    { label: 'Engine', value: '3.0L Inline-6 Turbo', icon: <ToolOutlined /> },
    { label: 'Drivetrain', value: '4MATIC AWD', icon: <GlobalOutlined /> },
    { label: 'Seats', value: '5 Adults', icon: <CarOutlined /> },
    { label: 'Entertainment', value: 'Burmester Sound', icon: <SoundOutlined /> }
  ],
  features: [
    'Apple CarPlay', 'Android Auto', 'Memory Seats', 'Blind Spot Assist',
    'Heated Steering Wheel', 'Adaptive Cruise Control', 'Panoramic Sunroof',
    'Wireless Charging', '360 Camera', 'Multibeam LED'
  ],
  host: {
    name: 'Bruce Matthews',
    avatar: 'BM',
    joined: 'Jan 2022',
    responseRate: '100%',
    responseTime: '< 5 min',
    isElite: true,
    rating: 5.0,
    deliveries: 124
  }
};

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(MOCK_CAR.images[0]);

  return (
    <div className="bg-white min-h-screen pb-40">
      {/* Immersive Photo Gallery */}
      <section className="relative h-[70vh] min-h-[600px] group">
        <div className="absolute inset-0 flex">
          <motion.div 
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full relative"
          >
            <img src={activeImage} className="w-full h-full object-cover" alt="Focus View" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-10 left-12 z-20 flex gap-4">
          <Button 
            onClick={() => navigate(-1)} 
            icon={<ArrowLeftOutlined />} 
            className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-3xl border-white/30 text-white hover:!bg-white hover:!text-indigo-600 transition-all border-none shadow-xl" 
          />
        </div>
        <div className="absolute top-10 right-12 z-20 flex gap-4">
          <Button icon={<ShareAltOutlined />} className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-3xl border-white/30 text-white hover:!bg-white hover:!text-indigo-600 transition-all border-none shadow-xl" />
          <Button icon={<HeartOutlined />} className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-3xl border-white/30 text-white hover:!bg-white hover:!text-red-500 transition-all border-none shadow-xl" />
        </div>

        {/* Thumbnail Selector Overlay */}
        <div className="absolute bottom-12 left-12 z-20 flex gap-4 overflow-x-auto pb-4 max-w-[calc(100%-64px)]">
           {MOCK_CAR.images.map((img, i) => (
             <motion.div
               key={i}
               whileHover={{ y: -5 }}
               onClick={() => setActiveImage(img)}
               className={`h-24 w-36 rounded-2xl overflow-hidden cursor-pointer border-4 transition-all flex-shrink-0 ${activeImage === img ? 'border-indigo-500 scale-105 shadow-2xl' : 'border-transparent opacity-60'}`}
             >
               <img src={img} className="w-full h-full object-cover" alt={`Thumb ${i}`} />
             </motion.div>
           ))}
        </div>
      </section>

      <main className="container mx-auto px-12 -mt-24 relative z-30">
        <Row gutter={64}>
          {/* Main Content Area */}
          <Col xs={24} lg={15}>
            <div className="bg-white rounded-[4rem] p-16 shadow-premium-lg border border-gray-50 mb-16">
              <div className="mb-16">
                <Breadcrumb className="mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">
                  <Breadcrumb.Item><Link to="/search" className="!text-indigo-500">Marketplace</Link></Breadcrumb.Item>
                  <Breadcrumb.Item className="!text-gray-300">{MOCK_CAR.type}</Breadcrumb.Item>
                </Breadcrumb>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                  <div>
                    <Title level={1} className="!font-black !text-6xl !m-0 tracking-tighter uppercase leading-none">
                      {MOCK_CAR.name}
                    </Title>
                    <Text className="text-gray-400 text-xl font-bold italic tracking-tight block mt-4">{MOCK_CAR.tagline}</Text>
                  </div>
                  <Tag className="bg-indigo-50 text-indigo-600 border-none font-black px-8 py-3 rounded-full uppercase text-xs tracking-widest flex items-center h-12 shadow-sm">
                    <StarFilled className="text-amber-400 mr-2 text-lg" /> {MOCK_CAR.rating} • {MOCK_CAR.reviewsCount} REVIEWS
                  </Tag>
                </div>
              </div>

              <Divider className="my-16 border-gray-50" />

              {/* Specs Grid */}
              <div className="mb-20">
                <Title level={5} className="!font-black uppercase tracking-[0.4em] text-[10px] text-gray-400 mb-12">Core Specifications</Title>
                <Row gutter={[40, 40]}>
                  {MOCK_CAR.specs.map(spec => (
                    <Col xs={12} md={8} key={spec.label}>
                      <div className="flex items-center group">
                        <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-xl text-indigo-500 mr-5 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {spec.icon}
                        </div>
                        <div>
                          <Text className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">{spec.label}</Text>
                          <Text className="text-gray-900 font-black text-sm uppercase">{spec.value}</Text>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>

              {/* Description */}
              <div className="mb-20">
                <Title level={5} className="!font-black uppercase tracking-[0.4em] text-[10px] text-gray-400 mb-8">The Narrative</Title>
                <Paragraph className="text-gray-600 text-xl leading-relaxed italic font-medium">
                  {MOCK_CAR.description}
                </Paragraph>
                <Button type="link" className="font-black p-0 text-indigo-600 uppercase tracking-widest text-[11px] mt-6 hover:text-indigo-800">
                  Read Technical Breakdown <ArrowRightOutlined className="ml-2" />
                </Button>
              </div>

              {/* Features Chips */}
              <div className="mb-20">
                 <Title level={5} className="!font-black uppercase tracking-[0.4em] text-[10px] text-gray-400 mb-12">Notable Features</Title>
                 <div className="flex flex-wrap gap-4">
                    {MOCK_CAR.features.map(f => (
                      <div key={f} className="bg-gray-50 px-8 py-3 rounded-2xl font-bold text-gray-700 text-xs border border-transparent hover:border-indigo-200 hover:bg-white transition-all cursor-default">
                        {f}
                      </div>
                    ))}
                 </div>
              </div>

              {/* Host Profile Section */}
              <div className="bg-gray-50/50 rounded-[3rem] p-12 border border-gray-100 flex flex-col md:flex-row items-center gap-12 group">
                 <div className="relative">
                    <Avatar size={140} className="bg-indigo-600 text-white font-black text-4xl border-8 border-white shadow-2xl group-hover:scale-105 transition-transform">
                      {MOCK_CAR.host.avatar}
                    </Avatar>
                    <div className="absolute -bottom-2 right-4 bg-indigo-500 text-white p-3 rounded-2xl shadow-xl">
                       <VerifiedOutlined className="text-2xl" />
                    </div>
                 </div>
                 <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                      <Title level={2} className="!font-black !m-0 !text-4xl tracking-tighter uppercase">{MOCK_CAR.host.name}</Title>
                      <Tag className="bg-indigo-600 text-white border-none font-black px-4 py-1.5 rounded-full uppercase text-[9px] tracking-widest shadow-lg shadow-indigo-100">
                        Top Rated Elite
                      </Tag>
                    </div>
                    <Paragraph className="text-gray-500 text-lg font-medium italic mb-10 leading-relaxed md:max-w-md">
                      "I take pride in providing a seamless, showroom-quality experience for every guest."
                    </Paragraph>
                    <Row gutter={[48, 24]}>
                       {[
                         { label: 'Rating', value: <><StarFilled className="text-amber-400 mr-2" /> 5.0</> },
                         { label: 'Deliveries', value: '124 Trips' },
                         { label: 'Response', value: '< 5 min' }
                       ].map(stat => (
                         <Col key={stat.label}>
                            <Text className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">{stat.label}</Text>
                            <Text className="text-gray-900 font-bold text-lg uppercase">{stat.value}</Text>
                         </Col>
                       ))}
                    </Row>
                 </div>
                 <div className="flex flex-col gap-4 w-full md:w-auto">
                    <Button size="large" className="h-16 px-12 rounded-2xl font-black bg-white border-gray-200 text-indigo-600 hover:bg-indigo-50 transition-all text-sm uppercase tracking-widest">
                      Contact Host
                    </Button>
                    <Button size="large" className="h-16 px-12 rounded-2xl font-black bg-indigo-600 text-white border-none shadow-xl hover:scale-105 transition-all text-sm uppercase tracking-widest">
                      View Profile
                    </Button>
                 </div>
              </div>
            </div>

            {/* Verification & Trust */}
            <div className="px-16 grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="flex gap-6 group">
                  <div className="h-20 w-20 rounded-[2rem] bg-indigo-50 flex items-center justify-center text-3xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                    <SafetyOutlined />
                  </div>
                  <div className="flex-1">
                    <Title level={4} className="!font-black uppercase tracking-tight mb-3">DashDrive Shield</Title>
                    <Text className="text-gray-500 font-medium leading-relaxed italic">Premium insurance coverage included with every journey, protecting you and the asset.</Text>
                  </div>
               </div>
               <div className="flex gap-6 group">
                  <div className="h-20 w-20 rounded-[2rem] bg-indigo-50 flex items-center justify-center text-3xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                    <ClockCircleOutlined />
                  </div>
                  <div className="flex-1">
                    <Title level={4} className="!font-black uppercase tracking-tight mb-3">Concierge Support</Title>
                    <Text className="text-gray-500 font-medium leading-relaxed italic">24/7 priority assistance to ensure your high-end experience remains uninterrupted.</Text>
                  </div>
               </div>
            </div>
          </Col>

          {/* Sticky Booking Column */}
          <Col xs={24} lg={9}>
            <Affix offsetTop={120}>
              <Card 
                className="rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-none overflow-hidden bg-[#0f172a] text-white p-4"
                styles={{ body: { padding: '48px' } }}
              >
                <div className="flex justify-between items-end mb-16">
                   <div>
                      <Text className="text-indigo-400 font-black text-5xl tracking-tighter leading-none">${MOCK_CAR.price}</Text>
                      <Text className="text-indigo-200 text-xs font-black uppercase tracking-[0.3em] block mt-2 ml-1">Daily Investment</Text>
                   </div>
                   <div className="text-right">
                      <Tag className="bg-emerald-500/20 text-emerald-400 border-none font-black px-4 py-1.5 rounded-full uppercase text-[9px] tracking-widest">
                        Available Now
                      </Tag>
                   </div>
                </div>

                <div className="space-y-10 mb-20">
                  <div className="group">
                    <Text className="text-indigo-300 font-black uppercase tracking-widest text-[10px] block mb-4 ml-2">Departure Window</Text>
                    <DatePicker 
                      className="h-20 w-full rounded-[2rem] bg-indigo-900/40 border-indigo-700/50 text-white placeholder:text-indigo-300 font-black text-lg focus:bg-indigo-800/60 hover:border-indigo-400 transition-all custom-picker" 
                      placeholder="Start Journey"
                      suffixIcon={<CalendarOutlined className="text-indigo-300" />}
                    />
                  </div>
                  <div className="group">
                    <Text className="text-indigo-300 font-black uppercase tracking-widest text-[10px] block mb-4 ml-2">Completion Window</Text>
                    <DatePicker 
                      className="h-20 w-full rounded-[2rem] bg-indigo-900/40 border-indigo-700/50 text-white placeholder:text-indigo-300 font-black text-lg focus:bg-indigo-800/60 hover:border-indigo-400 transition-all custom-picker" 
                      placeholder="End Journey"
                      suffixIcon={<CalendarOutlined className="text-indigo-300" />}
                    />
                  </div>
                  <div className="group">
                    <Text className="text-indigo-300 font-black uppercase tracking-widest text-[10px] block mb-4 ml-2">Acquisition Type</Text>
                    <Select 
                       defaultValue="pickup"
                       className="h-20 w-full custom-select-dark"
                       dropdownClassName="dark-dropdown"
                       options={[
                         { value: 'pickup', label: 'Host Location (Free)' },
                         { value: 'delivery', label: 'Custom Delivery (+$45)' },
                         { value: 'airport', label: 'Airport Curbside (+$30)' },
                       ]}
                    />
                  </div>
                </div>

                <div className="space-y-6 mb-16 px-4">
                   <div className="flex justify-between items-center text-sm font-bold opacity-60">
                      <Text className="text-white">Day Rate (3 days)</Text>
                      <Text className="text-white">${MOCK_CAR.price * 3}</Text>
                   </div>
                   <div className="flex justify-between items-center text-sm font-bold opacity-60">
                      <Text className="text-white">DashDrive Elite Fee</Text>
                      <Text className="text-white">$42.50</Text>
                   </div>
                   <Divider className="my-8 border-indigo-800" />
                   <div className="flex justify-between items-center">
                      <Text className="text-white font-black text-2xl uppercase tracking-tighter">Total</Text>
                      <Text className="text-white font-black text-3xl tracking-tighter">${(MOCK_CAR.price * 3) + 42.50}</Text>
                   </div>
                </div>

                <Button 
                  block 
                  size="large" 
                  className="h-24 rounded-[2.5rem] bg-indigo-500 hover:bg-indigo-400 border-none text-white font-black text-xl uppercase tracking-wider shadow-[0_20px_40px_-10px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
                >
                  Initiate Booking <ArrowRightOutlined className="ml-4" />
                </Button>
                
                <div className="mt-10 text-center">
                   <Text className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                     <InfoCircleOutlined className="text-lg" /> No charges until host confirms
                   </Text>
                </div>
              </Card>
            </Affix>
          </Col>
        </Row>
      </main>

      <style>{`
        .shadow-premium-lg {
          box-shadow: 0 40px 100px -20px rgba(0,0,0,0.06);
        }
        .custom-picker .ant-picker-input > input {
          color: white !important;
          font-weight: 900 !important;
          letter-spacing: -0.025em;
        }
        .custom-picker .ant-picker-input > input::placeholder {
          color: rgba(165, 180, 252, 0.5) !important;
        }
        .custom-select-dark .ant-select-selector {
          background-color: rgba(49, 46, 129, 0.4) !important;
          border-color: rgba(67, 56, 202, 0.5) !important;
          border-radius: 2rem !important;
          color: white !important;
          height: 80px !important;
          padding: 0 32px !important;
          display: flex !important;
          align-items: center !important;
        }
        .custom-select-dark .ant-select-selection-item {
          color: white !important;
          font-weight: 900 !important;
          font-size: 18px !important;
          letter-spacing: -0.025em !important;
        }
        .custom-select-dark .ant-select-arrow {
          color: #a5b4fc !important;
          right: 32px !important;
        }
        .dark-dropdown {
          background: #1e293b !important;
          border-radius: 2rem !important;
          padding: 12px !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.4) !important;
        }
        .dark-dropdown .ant-select-item {
          color: #94a3b8 !important;
          border-radius: 1.5rem !important;
          padding: 12px 24px !important;
          font-weight: 700 !important;
        }
        .dark-dropdown .ant-select-item-option-selected {
          background: #4f46e5 !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
}
