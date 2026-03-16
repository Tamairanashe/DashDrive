import React from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Space, 
  Button, 
  Divider, 
  Avatar, 
  Tabs,
  Rate,
} from 'antd';
import { 
  EnvironmentOutlined, 
  SafetyOutlined, 
  ThunderboltOutlined, 
  CheckCircleOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  HeartOutlined,
  ShareAltOutlined,
  UserOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const VehicleDetails: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto py-8 px-4">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <Space>
           <Button icon={<ShareAltOutlined />} className="rounded-full">Share</Button>
           <Button icon={<HeartOutlined />} className="rounded-full">Save</Button>
        </Space>
      </div>

      <Row gutter={[32, 32]}>
        {/* Left Column: Visuals and Info */}
        <Col xs={24} lg={16}>
          {/* Hero Gallery Mock */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-4 grid-rows-2 gap-4 h-[500px] mb-8 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="col-span-3 row-span-2 bg-gray-100 flex items-center justify-center relative overflow-hidden group">
               <img 
                 src="https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop" 
                 alt="BMW 3 Series Main" 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
            </div>
            <div className="col-start-4 bg-gray-100 overflow-hidden">
               <img 
                 src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2070&auto=format&fit=crop" 
                 alt="BMW Interior" 
                 className="w-full h-full object-cover"
               />
            </div>
            <div className="col-start-4 row-start-2 bg-gray-100 relative group overflow-hidden">
               <img 
                 src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=1974&auto=format&fit=crop" 
                 alt="BMW Rear" 
                 className="w-full h-full object-cover"
               />
               <Button className="absolute bottom-4 right-4 bg-white/90 border-none font-bold rounded-lg text-xs">View 21 photos</Button>
            </div>
          </motion.div>

          <div className="space-y-8">
            <div>
              <Title className="!mb-1 !font-black !text-5xl tracking-tight">BMW 3 Series</Title>
              <Text className="text-xl font-bold text-gray-500">2026 M340i xDrive</Text>
            </div>

            <div className="flex gap-4 flex-wrap">
              {[
                { label: '5 seats', icon: <UserOutlined /> },
                { label: 'Hybrid (Premium)', icon: <ThunderboltOutlined /> },
                { label: '30 MPG', icon: <EnvironmentOutlined /> },
                { label: 'Automatic transmission', icon: <SafetyOutlined /> },
              ].map(spec => (
                <div key={spec.label} className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 min-w-[120px]">
                  <div className="text-xl text-blue-600 mb-1">{spec.icon}</div>
                  <Text className="text-[11px] font-black uppercase tracking-widest text-gray-400">{spec.label}</Text>
                </div>
              ))}
            </div>

            <Divider />

            {/* Hosted By */}
            <div className="flex items-center gap-6">
              <Avatar size={72} className="border-4 border-white shadow-xl" src="https://ui-avatars.com/api/?name=LA+Auto+Spot&background=0066ff&color=fff" />
              <div>
                <Title level={4} className="!mb-0 font-black">Hosted by LA Auto Spot (Honolulu)</Title>
                <div className="flex items-center gap-4 mt-1">
                  <Space><Rate disabled defaultValue={4.8} className="text-xs" /><Text strong>4.8</Text></Space>
                  <Text type="secondary" className="font-bold">10,911 trips • Joined Apr 2025</Text>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200">
                <CheckCircleOutlined />
              </div>
              <div>
                <Title level={5} className="!mb-0 font-black text-blue-900 uppercase tracking-widest text-xs">Deluxe class</Title>
                <Text className="text-blue-700/80 text-sm font-medium">This exclusive car has additional safety checks for guests under 30.</Text>
              </div>
            </div>

            <Tabs defaultActiveKey="1" className="premium-tabs">
              <Tabs.TabPane tab="OVERVIEW" key="1">
                 <div className="grid grid-cols-2 gap-12 py-6">
                    <div>
                      <Title level={4} className="font-black mb-6">Vehicle features</Title>
                      <div className="space-y-8">
                         <div>
                            <Text className="text-[11px] font-black text-gray-400 tracking-widest mb-4 block">SAFETY</Text>
                            <Space direction="vertical" className="w-full text-gray-600 font-medium">
                               <Text><CheckCircleOutlined className="text-green-500 mr-2" /> All-wheel drive</Text>
                               <Text><CheckCircleOutlined className="text-green-500 mr-2" /> Backup camera</Text>
                               <Text><CheckCircleOutlined className="text-green-500 mr-2" /> Blind spot warning</Text>
                               <Text type="secondary" className="line-through"><CheckCircleOutlined className="mr-2" /> Brake assist</Text>
                            </Space>
                         </div>
                         <div>
                            <Text className="text-[11px] font-black text-gray-400 tracking-widest mb-4 block">DEVICE CONNECTIVITY</Text>
                            <Space direction="vertical" className="w-full text-gray-600 font-medium">
                               <Text><CheckCircleOutlined className="text-green-500 mr-2" /> Android Auto</Text>
                               <Text><CheckCircleOutlined className="text-green-500 mr-2" /> Apple CarPlay</Text>
                               <Text><CheckCircleOutlined className="text-green-500 mr-2" /> Bluetooth</Text>
                               <Text><CheckCircleOutlined className="text-green-500 mr-2" /> USB charger</Text>
                            </Space>
                         </div>
                      </div>
                      <Button className="mt-8 rounded-xl font-bold px-6 h-11 border-2 border-gray-100">See all 19 features</Button>
                    </div>

                    <div>
                      <Title level={4} className="font-black mb-6">Included in the price</Title>
                      <div className="space-y-8">
                        <div>
                           <Text className="text-[11px] font-black text-gray-400 tracking-widest mb-4 block uppercase">Convenience</Text>
                           <ul className="space-y-4 list-none p-0 m-0">
                              <li className="flex gap-4">
                                <EnvironmentOutlined className="text-xl text-gray-400" />
                                <div>
                                  <Text strong className="block">Skip the rental counter</Text>
                                  <Text type="secondary" className="text-xs">Use the app for pickup and return instructions</Text>
                                </div>
                              </li>
                              <li className="flex gap-4">
                                <UserOutlined className="text-xl text-gray-400" />
                                <Text strong>Add additional drivers for free</Text>
                              </li>
                              <li className="flex gap-4">
                                <CalendarOutlined className="text-xl text-gray-400" />
                                <div>
                                  <Text strong className="block">30-minute return grace period</Text>
                                  <Text type="secondary" className="text-xs">No need to extend your trip unless you're running late</Text>
                                </div>
                              </li>
                           </ul>
                        </div>
                      </div>
                    </div>
                 </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="FEATURES" key="2" />
              <Tabs.TabPane tab="REVIEWS" key="3" />
              <Tabs.TabPane tab="LOCATION" key="4" />
            </Tabs>
          </div>
        </Col>

        {/* Right Column: Pricing & Booking */}
        <Col xs={24} lg={8}>
          <div className="sticky top-24">
            <Card bordered={false} className="shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Title level={2} className="!mb-0 font-black">$315 total</Title>
                    <Text type="secondary" className="font-bold">Before taxes</Text>
                  </div>
                </div>

                <div className="space-y-4 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                   <div>
                      <Text className="text-[10px] font-black text-gray-400 tracking-widest block mb-1 uppercase">Trip start</Text>
                      <Row gutter={8}>
                         <Col span={14}><Button block className="h-11 rounded-xl text-left bg-white font-bold border-gray-100">4/9/2026</Button></Col>
                         <Col span={10}><Button block className="h-11 rounded-xl text-left bg-white font-bold border-gray-100">10:00 AM</Button></Col>
                      </Row>
                   </div>
                   <div>
                      <Text className="text-[10px] font-black text-gray-400 tracking-widest block mb-1 uppercase">Trip end</Text>
                      <Row gutter={8}>
                         <Col span={14}><Button block className="h-11 rounded-xl text-left bg-white font-bold border-gray-100">4/12/2026</Button></Col>
                         <Col span={10}><Button block className="h-11 rounded-xl text-left bg-white font-bold border-gray-100">10:00 AM</Button></Col>
                      </Row>
                   </div>
                </div>

                <div className="mb-8">
                   <div className="flex justify-between items-center mb-2">
                      <Text className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Pickup & return location</Text>
                      <Button type="link" className="p-0 text-blue-600 font-bold h-auto"><EditOutlined /> Edit</Button>
                   </div>
                   <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <Text strong className="block">On-site at Daniel K. Inouye International Airport</Text>
                      <Text type="secondary" className="text-xs block mt-1 underline">About airport pickups</Text>
                   </div>
                </div>

                <Button type="primary" size="large" block className="h-14 rounded-2xl font-black text-lg bg-blue-600 shadow-xl shadow-blue-200">Continue</Button>
              </div>

              <Divider className="m-0" />

              <div className="p-6 space-y-6">
                 <div className="flex justify-between items-start">
                    <div className="max-w-[70%] text-gray-600">
                        <Title level={5} className="!mb-1 font-black">Cancellation policy</Title>
                        <Text strong className="text-xs block mb-1">Free cancellation</Text>
                        <Text type="secondary" className="text-[11px] block leading-relaxed">Full refund within 24 hours of booking. More flexible options available at checkout.</Text>
                    </div>
                 </div>

                 <div className="flex justify-between items-start">
                    <div className="max-w-[80%] text-gray-600">
                        <Title level={5} className="!mb-1 font-black">Payment options</Title>
                        <Text strong className="text-xs block mb-1">Flexible payment</Text>
                        <Text type="secondary" className="text-[11px] block leading-relaxed">$0 due now when you choose the Refundable option at checkout.</Text>
                    </div>
                 </div>

                 <div className="flex justify-between items-center">
                    <div className="text-gray-600">
                        <Title level={5} className="!mb-1 font-black">Distance included</Title>
                        <Text strong className="text-xs">Unlimited</Text>
                    </div>
                    <InfoCircleOutlined className="text-gray-300" />
                 </div>

                 <div className="flex justify-between items-start">
                    <div className="text-gray-600">
                        <Title level={5} className="!mb-1 font-black">Insurance & Protection</Title>
                        <Text strong className="text-xs">Insurance via Travelers</Text>
                    </div>
                    <InfoCircleOutlined className="text-gray-300" />
                 </div>
              </div>
            </Card>

            <div className="mt-6 flex justify-center gap-4">
              <Button type="text" className="text-xs font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-50 px-4">Report listing</Button>
              <Button type="text" className="text-xs font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-50 px-4">Cancellation policy</Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default VehicleDetails;
