import React, { useState } from 'react';
import { 
  Typography, Input, Button, Row, Col, Card, 
  Tag, Slider, Checkbox, Select, Space, 
  Breadcrumb, Empty, Avatar, Divider
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
  HeartOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const MOCK_CARS = [
  {
    id: '1',
    name: 'Mercedes-Benz GLE-Class 2024',
    type: 'SUV',
    price: 171,
    rating: 5.0,
    trips: 16,
    image: 'https://images.unsplash.com/photo-1540066019607-e5f69323a8bc?auto=format&fit=crop&q=80&w=600',
    features: ['Instant Book', 'Delivery'],
    host: 'Bruce Matthews',
    location: 'Nyanga'
  },
  {
    id: '2',
    name: 'Tesla Model S Plaid 2023',
    type: 'Electric',
    price: 245,
    rating: 4.9,
    trips: 42,
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=600',
    features: ['Instant Book', 'Free Charging'],
    host: 'Sarah Chen',
    location: 'Harare CBD'
  },
  {
    id: '3',
    name: 'Porsche 911 Carrera 2025',
    type: 'Coupe',
    price: 389,
    rating: 5.0,
    trips: 12,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600',
    features: ['Delivery', 'Premium Audio'],
    host: 'James Wilson',
    location: 'Victoria Falls'
  },
  {
    id: '4',
    name: 'Range Rover Sport 2024',
    type: 'SUV',
    price: 295,
    rating: 4.8,
    trips: 28,
    image: 'https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?auto=format&fit=crop&q=80&w=600',
    features: ['Instant Book', 'Off-road Kit'],
    host: 'Michael Brown',
    location: 'Bulawayo'
  },
  {
    id: '5',
    name: 'BMW M8 Competition 2025',
    type: 'Coupe',
    price: 412,
    rating: 5.0,
    trips: 8,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=600',
    features: ['Track Mode', 'Delivery'],
    host: 'David Evans',
    location: 'Harare'
  },
  {
    id: '6',
    name: 'Audi RS Q8 2024',
    type: 'SUV',
    price: 320,
    rating: 4.95,
    trips: 19,
    image: 'https://images.unsplash.com/photo-1606152424101-ad2f8a487ba5?auto=format&fit=crop&q=80&w=600',
    features: ['Instant Book', 'Sunroof'],
    host: 'Elena Rodriguez',
    location: 'Nyanga'
  }
];

export default function Search() {
  const [priceRange, setPriceRange] = useState([50, 500]);
  
  return (
    <div className="bg-white min-h-screen">
      {/* Search Header */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-20 z-40 px-8 py-4">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="flex-1 max-w-2xl bg-gray-100 rounded-2xl px-6 py-3 flex items-center">
            <SearchOutlined className="text-gray-400 mr-4" />
            <Input 
              placeholder="Search by city, airport, or hotel" 
              variant="borderless" 
              className="font-bold text-base"
            />
            <Divider type="vertical" className="h-6 bg-gray-300 mx-4" />
            <Text className="font-bold text-gray-500 whitespace-nowrap">Mar 20 - Mar 23</Text>
          </div>

          <Space size="middle">
            <Select 
              defaultValue="relevance" 
              className="w-48 !rounded-xl"
              options={[
                { value: 'relevance', label: 'Sorted by: Relevance' },
                { value: 'lowToHigh', label: 'Price: Low to High' },
                { value: 'highToLow', label: 'Price: High to Low' },
                { value: 'rating', label: 'Top Rated' },
              ]}
            />
            <Button size="large" icon={<FilterOutlined />} className="px-6 rounded-xl font-bold border-gray-200">
              Filters
            </Button>
          </Space>
        </div>
      </div>

      <div className="container mx-auto px-8 py-12">
        <Row gutter={48}>
          {/* Filters Sidebar */}
          <Col xs={0} lg={6}>
            <div className="sticky top-44 space-y-12">
              <div>
                <Title level={5} className="!font-black uppercase tracking-widest text-[11px] text-gray-400 mb-6">Price range</Title>
                <div className="px-2">
                  <Slider 
                    range 
                    defaultValue={[50, 500]} 
                    max={1000} 
                    onChange={setPriceRange}
                    className="mb-4"
                  />
                  <div className="flex justify-between items-center text-gray-800 font-black">
                    <Text>${priceRange[0]}</Text>
                    <Text>${priceRange[1]}+</Text>
                  </div>
                </div>
              </div>

              <div>
                <Title level={5} className="!font-black uppercase tracking-widest text-[11px] text-gray-400 mb-6">Vehicle Type</Title>
                <Checkbox.Group className="w-full space-y-4">
                  <div className="flex flex-col space-y-4 font-semibold">
                    <Checkbox value="suv">SUV</Checkbox>
                    <Checkbox value="coupe">Coupe</Checkbox>
                    <Checkbox value="sedan">Sedan</Checkbox>
                    <Checkbox value="electric">Electric</Checkbox>
                    <Checkbox value="luxury">Luxury</Checkbox>
                  </div>
                </Checkbox.Group>
              </div>

              <div>
                <Title level={5} className="!font-black uppercase tracking-widest text-[11px] text-gray-400 mb-6">Features</Title>
                <Checkbox.Group className="w-full space-y-4">
                  <div className="flex flex-col space-y-4 font-semibold">
                    <Checkbox value="instant-book" className="flex items-center">
                      Instant Book <ThunderboltFilled className="text-amber-400 ml-2" />
                    </Checkbox>
                    <Checkbox value="delivery">Delivery</Checkbox>
                    <Checkbox value="all-wheel-drive">All-wheel drive</Checkbox>
                    <Checkbox value="unlimited-distance">Unlimited distance</Checkbox>
                  </div>
                </Checkbox.Group>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <Button block size="large" className="rounded-2xl font-black bg-gray-100 border-none text-gray-800 h-14">
                  Clear all filters
                </Button>
              </div>
            </div>
          </Col>

          {/* Results Grid */}
          <Col xs={24} lg={18}>
            <div className="mb-10">
              <Breadcrumb className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                <Breadcrumb.Item>Zimbabwe</Breadcrumb.Item>
                <Breadcrumb.Item>All Cars</Breadcrumb.Item>
              </Breadcrumb>
              <Title level={2} className="!font-black !text-4xl underline decoration-indigo-600 decoration-8 underline-offset-8">
                324 cars available
              </Title>
            </div>

            <Row gutter={[24, 24]}>
              {MOCK_CARS.map((car, idx) => (
                <Col xs={24} sm={12} key={car.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link to={`/vehicle/${car.id}`}>
                      <Card
                        hoverable
                        className="rounded-[2.5rem] overflow-hidden border-none shadow-md group relative"
                        styles={{ body: { padding: 0 } }}
                        cover={
                          <div className="h-64 overflow-hidden relative">
                            <img alt={car.name} src={car.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-4 right-4 z-10">
                              <Button 
                                shape="circle" 
                                icon={<HeartOutlined />} 
                                className="bg-white/80 backdrop-blur-md border-none hover:!bg-white" 
                              />
                            </div>
                            <div className="absolute bottom-4 left-4 flex gap-2">
                              {car.features.includes('Instant Book') && (
                                <Tag className="bg-white/80 backdrop-blur-md text-amber-500 border-none font-black px-3 rounded-full flex items-center shadow-sm">
                                  <ThunderboltFilled className="mr-1" /> Instant
                                </Tag>
                              )}
                            </div>
                          </div>
                        }
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 pr-4">
                              <Title level={4} className="!font-black !m-0 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                {car.name}
                              </Title>
                              <div className="flex items-center mt-1 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                <StarFilled className="text-amber-400 mr-1" /> {car.rating} • {car.trips} trips
                              </div>
                            </div>
                            <div className="text-right">
                              <Text className="text-gray-800 font-black text-2xl">${car.price}</Text>
                              <Text className="text-gray-400 text-[10px] font-bold block">per day</Text>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <div className="flex items-center">
                              <Avatar size="small" className="bg-indigo-100 text-indigo-600 font-bold text-[10px] mr-2">
                                {car.host.split(' ').map(n=>n[0]).join('')}
                              </Avatar>
                              <Text className="text-gray-400 text-xs font-bold leading-none">{car.host}</Text>
                            </div>
                            <Space size={4} className="text-gray-300 text-xs font-bold">
                              <EnvironmentOutlined /> {car.location}
                            </Space>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                </Col>
              ))}
            </Row>

            <div className="mt-20 text-center">
              <Button size="large" className="h-16 px-16 rounded-[2rem] font-black bg-indigo-600 text-white border-none shadow-xl shadow-indigo-100">
                Show more cars
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
