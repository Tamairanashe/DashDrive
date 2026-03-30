import React, { useState, useEffect } from 'react';
import { 
  Typography, Input, Button, Row, Col, Card, 
  Tag, Slider, Checkbox, Select, Space, 
  Breadcrumb, Empty, Avatar, Divider, Skeleton
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  StarFilled, 
  EnvironmentOutlined,
  ThunderboltFilled,
  UpOutlined,
  DownOutlined,
  ArrowRightOutlined,
  HeartOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const MOCK_CARS = [
  {
    id: '1',
    name: 'Mercedes-Benz GLE-Class 2024',
    type: 'Executive SUV',
    price: 171,
    rating: 5.0,
    trips: 16,
    image: 'https://images.unsplash.com/photo-1540066019607-e5f69323a8bc?auto=format&fit=crop&q=80&w=800',
    features: ['Instant Book', 'Delivery Available'],
    host: 'Bruce Matthews',
    location: 'Nyanga',
    isElite: true
  },
  {
    id: '2',
    name: 'Tesla Model S Plaid 2023',
    type: 'Electric Performance',
    price: 245,
    rating: 4.9,
    trips: 42,
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800',
    features: ['Instant Book', 'Free Supercharge'],
    host: 'Sarah Chen',
    location: 'Harare CBD',
    isElite: true
  },
  {
    id: '3',
    name: 'Porsche 911 Carrera 2025',
    type: 'Luxury Coupe',
    price: 389,
    rating: 5.0,
    trips: 12,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    features: ['Delivery Included', 'Premium Audio'],
    host: 'James Wilson',
    location: 'Victoria Falls',
    isElite: false
  },
  {
    id: '4',
    name: 'Range Rover Sport 2024',
    type: 'All-Terrain Luxury',
    price: 295,
    rating: 4.8,
    trips: 28,
    image: 'https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?auto=format&fit=crop&q=80&w=800',
    features: ['Instant Book', 'Tow-bar'],
    host: 'Michael Brown',
    location: 'Bulawayo',
    isElite: false
  },
  {
    id: '5',
    name: 'BMW M8 Competition 2025',
    type: 'Sports Grand Tourer',
    price: 412,
    rating: 5.0,
    trips: 8,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
    features: ['Exclusive Access', 'Full Concierge'],
    host: 'David Evans',
    location: 'Harare',
    isElite: true
  },
  {
    id: '6',
    name: 'Audi RS Q8 2024',
    type: 'Performance SUV',
    price: 320,
    rating: 4.95,
    trips: 19,
    image: 'https://images.unsplash.com/photo-1606152424101-ad2f8a487ba5?auto=format&fit=crop&q=80&w=800',
    features: ['Instant Book', 'Night Vision'],
    host: 'Elena Rodriguez',
    location: 'Nyanga',
    isElite: false
  }
];

export default function Search() {
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([50, 800]);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="bg-[#f9fafb] min-h-screen pb-32">
      {/* Floating Modern Header */}
      <div className="bg-white/80 backdrop-blur-2xl border-b border-gray-100/50 sticky top-20 z-[900] px-12 py-6">
        <div className="container mx-auto">
          <Row gutter={32} align="middle" justify="space-between">
            <Col flex="1" className="max-w-3xl">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl px-8 py-4 flex items-center shadow-inner group transition-all hover:bg-white hover:border-indigo-100">
                <SearchOutlined className="text-gray-300 mr-4 text-xl group-hover:text-indigo-500 transition-colors" />
                <Input 
                  placeholder="Where do you want to go?" 
                  variant="borderless" 
                  className="font-black text-lg placeholder:text-gray-300"
                />
                <Divider type="vertical" className="h-8 bg-gray-200 mx-6" />
                <div className="flex items-center cursor-pointer group/date">
                   <Text className="font-black text-gray-400 group-hover/date:text-indigo-600 transition-colors">MAR 20 — MAR 23</Text>
                   <DownOutlined className="ml-3 text-[10px] text-gray-300" />
                </div>
              </div>
            </Col>
            
            <Col>
              <Space size="middle">
                <Select 
                  defaultValue="relevance" 
                  variant="borderless"
                  className="w-56 font-bold text-gray-500 py-2 px-4 rounded-xl bg-gray-50 border border-gray-100"
                  options={[
                    { value: 'relevance', label: 'Sort: Relevance' },
                    { value: 'lowToHigh', label: 'Price: Low to High' },
                    { value: 'highToLow', label: 'Price: High to Low' },
                    { value: 'rating', label: 'Top Rated' },
                  ]}
                />
                <Button size="large" icon={<FilterOutlined />} className="h-14 px-8 rounded-2xl font-black bg-white border-gray-100 shadow-sm flex items-center">
                  All Filters
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div className="container mx-auto px-12 py-16">
        <Row gutter={64}>
          {/* Advanced Filters Sidebar */}
          <Col xs={0} lg={6}>
            <div className="sticky top-52 space-y-16">
              <div>
                <Title level={5} className="!font-black uppercase tracking-[0.3em] text-[10px] text-gray-400 mb-10">Price Per Day</Title>
                <div className="px-2">
                  <Slider 
                    range 
                    defaultValue={[50, 800]} 
                    max={2000} 
                    onChange={setPriceRange}
                    className="mb-8"
                    styles={{
                      track: { background: '#6366f1' },
                      handle: { border: '4px solid #6366f1' }
                    }}
                  />
                  <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-50 font-black text-gray-800">
                    <Text className="text-lg">${priceRange[0]}</Text>
                    <ArrowRightOutlined className="text-gray-300" />
                    <Text className="text-lg">${priceRange[1]}+</Text>
                  </div>
                </div>
              </div>

              <div>
                <Title level={5} className="!font-black uppercase tracking-[0.3em] text-[10px] text-gray-400 mb-10">Vehicle Category</Title>
                <div className="space-y-4">
                  {['SUV', 'Luxury', 'Sports', 'Electric', 'Convertible'].map(cat => (
                    <label key={cat} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-50 cursor-pointer hover:border-indigo-100 transition-all group">
                       <Text className="font-bold text-gray-500 group-hover:text-indigo-600 transition-colors">{cat}</Text>
                       <Checkbox value={cat.toLowerCase()} />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Title level={5} className="!font-black uppercase tracking-[0.3em] text-[10px] text-gray-400 mb-10">Host Features</Title>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-50 cursor-pointer hover:border-indigo-100 transition-all group">
                     <Space className="font-bold text-gray-500 group-hover:text-indigo-600 transition-colors">
                       Instant Book <ThunderboltFilled className="text-amber-400" />
                     </Space>
                     <Checkbox value="instant" />
                  </label>
                  <label className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-50 cursor-pointer hover:border-indigo-100 transition-all group">
                     <Text className="font-bold text-gray-500 group-hover:text-indigo-600 transition-colors">Elite Host</Text>
                     <Checkbox value="elite" />
                  </label>
                </div>
              </div>

              <div className="pt-10">
                <Button block type="link" className="font-black text-gray-400 uppercase tracking-widest text-[11px] hover:text-indigo-600">
                  Reset All Filters
                </Button>
              </div>
            </div>
          </Col>

          {/* Dynamic Results Grid */}
          <Col xs={24} lg={18}>
            <div className="mb-16 flex items-end justify-between">
              <div>
                <Breadcrumb className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                  <Breadcrumb.Item>Zimbabwe</Breadcrumb.Item>
                  <Breadcrumb.Item className="!text-gray-400">Marketplace</Breadcrumb.Item>
                </Breadcrumb>
                <Title level={1} className="!font-black !text-5xl !m-0 tracking-tighter">
                  Experience <span className="text-indigo-600">{MOCK_CARS.length}+</span> masterpieces.
                </Title>
              </div>
            </div>

            <Row gutter={[32, 32]}>
              {loading ? (
                // Skeleton Grid
                Array(6).fill(0).map((_, i) => (
                  <Col xs={24} sm={12} key={i}>
                    <div className="bg-white rounded-[3rem] p-4 shadow-sm">
                      <Skeleton.Button active block className="!h-[300px] !rounded-[2.5rem] mb-6" />
                      <div className="px-4">
                        <Skeleton active title={{ width: '60%' }} paragraph={{ rows: 1, width: '40%' }} />
                      </div>
                    </div>
                  </Col>
                ))
              ) : (
                <AnimatePresence>
                  {MOCK_CARS.map((car, idx) => (
                    <Col xs={24} sm={12} key={car.id}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05, duration: 0.5 }}
                      >
                        <Link to={`/vehicle/${car.id}`}>
                          <Card
                            hoverable
                            className="rounded-[3rem] overflow-hidden border-none shadow-sm hover:shadow-premium transition-all duration-500 group bg-white"
                            styles={{ body: { padding: 0 } }}
                            cover={
                              <div className="h-[320px] overflow-hidden relative">
                                <img alt={car.name} src={car.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                <div className="absolute top-6 left-6 flex flex-col gap-2">
                                  <Tag className="bg-black/60 backdrop-blur-md text-white border-none font-black px-4 py-1.5 rounded-full uppercase text-[9px] tracking-widest shadow-xl flex items-center">
                                    <StarFilled className="text-amber-400 mr-2" /> {car.rating} • {car.trips} trips
                                  </Tag>
                                  {car.isElite && (
                                    <Tag className="bg-indigo-600/90 backdrop-blur-md text-white border-none font-black px-4 py-1.5 rounded-full uppercase text-[9px] tracking-widest shadow-xl">
                                      Elite Selection
                                    </Tag>
                                  )}
                                </div>
                                <div className="absolute top-6 right-6 z-10">
                                  <Button 
                                    shape="circle" 
                                    icon={<HeartOutlined className="text-lg" />} 
                                    className="bg-white/40 backdrop-blur-md border-none hover:!bg-white text-white hover:text-red-500 h-12 w-12 flex items-center justify-center shadow-lg transition-all" 
                                  />
                                </div>
                                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                   <div className="flex gap-2">
                                      {car.features.map(f => (
                                        <Tag key={f} className="bg-white/95 text-gray-800 font-bold border-none px-4 py-1.5 rounded-full text-[10px] shadow-lg">
                                          {f.includes('Instant') ? <ThunderboltFilled className="text-amber-500 mr-2" /> : null}
                                          {f}
                                        </Tag>
                                      ))}
                                   </div>
                                </div>
                              </div>
                            }
                          >
                            <div className="p-10">
                              <div className="flex justify-between items-start mb-8">
                                <div className="flex-1 pr-4">
                                  <Text className="text-indigo-400 font-black uppercase tracking-[0.2em] text-[9px] mb-3 block">{car.type}</Text>
                                  <Title level={3} className="!font-black !m-0 !text-2xl tracking-tighter group-hover:text-indigo-600 transition-colors uppercase line-clamp-1">
                                    {car.name}
                                  </Title>
                                </div>
                                <div className="text-right">
                                  <Text className="text-gray-900 font-black text-3xl tracking-tighter">${car.price}</Text>
                                  <Text className="text-gray-400 text-[11px] font-black block uppercase tracking-widest">/ day</Text>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                                <div className="flex items-center group/host">
                                  <Avatar size={40} className="bg-indigo-50 text-indigo-600 font-black border border-indigo-100 mr-4 group-hover/host:scale-110 transition-transform">
                                    {car.host.split(' ').map(n=>n[0]).join('')}
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <Text className="text-gray-800 font-black text-xs leading-none mb-1">{car.host}</Text>
                                    <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Elite Host</Text>
                                  </div>
                                </div>
                                <Space size={6} className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                  <EnvironmentOutlined className="text-indigo-400" /> {car.location}
                                </Space>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    </Col>
                  ))}
                </AnimatePresence>
              )}
            </Row>

            <div className="mt-32 text-center">
              <Button size="large" className="h-20 px-16 rounded-[2.5rem] font-black border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition-all text-lg flex items-center mx-auto gap-4">
                Discover More Treasures <ArrowRightOutlined />
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
