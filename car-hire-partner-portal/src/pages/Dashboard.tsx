import React from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Tag, 
  Space, 
  Button, 
  Input, 
  Badge,
  Divider,
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  ThunderboltOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const marketplaceVehicles = [
  {
    id: 'bmw-3',
    name: 'BMW 3 Series',
    year: '2026',
    model: 'M340i xDrive',
    price: 105,
    rating: 4.8,
    trips: 10911,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop',
    tags: ['DELUXE CLASS', 'HYBRID'],
  },
  {
    id: 'merc-e',
    name: 'Mercedes E-Class',
    year: '2025',
    model: 'Executive Pack',
    price: 150,
    rating: 4.9,
    trips: 8432,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop',
    tags: ['LUXURY', 'FREE CANCEL'],
  },
  {
    id: 'tesla-3',
    name: 'Tesla Model 3',
    year: '2024',
    model: 'Long Range',
    price: 85,
    rating: 4.7,
    trips: 15200,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop',
    tags: ['ELECTRIC', 'FREE PICKUP'],
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-10 py-4">
      <header className="text-center max-w-2xl mx-auto space-y-4">
        <Title className="!mb-0 !font-black !text-5xl tracking-tight">Explore premium rentals</Title>
        <Text className="text-lg text-gray-500 font-medium">Find the perfect car for your next journey, from executive sedans to luxury EVs.</Text>
        
        <div className="mt-8 flex items-center bg-white p-2 rounded-2xl shadow-2xl border border-gray-100 max-w-xl mx-auto">
          <Input 
            prefix={<SearchOutlined className="text-gray-300 ml-2" />} 
            placeholder="Search city, airport, or hotel..." 
            className="border-none h-12 text-lg shadow-none focus:ring-0"
          />
          <Button type="primary" size="large" className="rounded-xl h-12 px-8 font-black bg-blue-600">Search</Button>
        </div>
      </header>

      <div className="flex justify-between items-center">
        <Title level={3} className="!mb-0 font-black">Featured for you</Title>
        <Button icon={<FilterOutlined />} className="rounded-xl font-bold border-gray-100 h-10 px-6">Marketplace Filters</Button>
      </div>

      <Row gutter={[32, 32]}>
        {marketplaceVehicles.map((car, idx) => (
          <Col key={car.id} xs={24} sm={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => navigate(`/vehicle/${car.id}`)}
              className="cursor-pointer"
            >
              <Card 
                bordered={false} 
                className="shadow-2xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden group border border-gray-50"
                cover={
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={car.image} 
                      alt={car.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                       {car.tags.map(tag => (
                         <Tag key={tag} className="border-none bg-white/90 backdrop-blur-md text-[9px] font-black tracking-widest text-blue-600 px-3 py-1 rounded-full shadow-sm">
                           {tag}
                         </Tag>
                       ))}
                    </div>
                  </div>
                }
              >
                <div className="p-2">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Title level={4} className="!mb-0 font-black">{car.name}</Title>
                      <Text type="secondary" className="font-bold text-xs tracking-tighter uppercase">{car.year} {car.model}</Text>
                    </div>
                    <div className="text-right">
                      <Title level={4} className="!mb-0 font-black text-blue-600">${car.price}</Title>
                      <Text className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">PER DAY</Text>
                    </div>
                  </div>

                  <Divider className="my-4 border-gray-50" />

                  <div className="flex justify-between items-center">
                    <Space>
                      <Badge status="success" />
                      <Text className="font-bold text-xs text-gray-700">{car.rating} ({car.trips} trips)</Text>
                    </Space>
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 transform transition-transform group-hover:translate-x-1">
                       <ArrowRightOutlined />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <div className="bg-blue-600 rounded-[3rem] p-12 text-white overflow-hidden relative shadow-2xl shadow-blue-200 mt-20">
         <div className="relative z-10 max-w-xl">
           <Title className="!text-white !font-black !text-4xl mb-6">Want to earn with your car?</Title>
           <Paragraph className="text-blue-100 text-lg font-medium mb-8">
             List your vehicle on DashHire and turn it into a high-yielding asset. Our marketplace handles insurance and verification.
           </Paragraph>
           <Button size="large" className="rounded-2xl h-14 px-10 font-black text-blue-600 border-none shadow-xl shadow-blue-900/20">Become a Host</Button>
         </div>
         <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <ThunderboltOutlined className="text-[30rem] rotate-12 -translate-y-20 translate-x-20" />
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
