import React, { useState } from 'react';
import { 
  Card, Row, Col, Tag, Button, Typography, Modal, Form, 
  Input, InputNumber, Select, Switch, Upload, Tooltip, 
  Tabs, Checkbox, Divider, Space, Badge, Avatar 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, ShopOutlined, 
  EnvironmentOutlined, DollarOutlined, 
  PictureOutlined, TeamOutlined, 
  StarFilled, HomeOutlined, 
  SafetyCertificateOutlined,
  WifiOutlined,
  CoffeeOutlined,
  CarOutlined,
  CloudOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function MarketplaceListings() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);

  const [properties, setProperties] = useState([
    {
      id: 1,
      name: 'Emerald Lake Cabin',
      location: 'Nyanga',
      price: 120,
      rating: 4.95,
      trips: 45,
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=500',
      isActive: true,
      type: 'Cabin'
    },
    {
      id: 2,
      name: 'Modern City Loft',
      location: 'Harare CBD',
      price: 85,
      rating: 4.82,
      trips: 112,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=500',
      isActive: true,
      type: 'Apartment'
    },
    {
      id: 3,
      name: 'Zambezi Sunset Villa',
      location: 'Victoria Falls',
      price: 450,
      rating: 4.98,
      trips: 28,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=500',
      isActive: false,
      type: 'Villa'
    }
  ]);

  const togglePropertyStatus = (id: number) => {
    setProperties(properties.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const openEditModal = (property?: any) => {
    setEditingProperty(property || null);
    setIsModalVisible(true);
  };

  const tabItems = [
    {
      key: '1',
      label: <span className="flex items-center"><HomeOutlined className="mr-2" /> Basic Info</span>,
      children: (
        <div className="pt-6 space-y-6">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label="Property Name" name="name" required>
                <Input className="h-12 rounded-xl" placeholder="e.g. Emerald Lake Cabin" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Property Type" name="type" required>
                <Select className="w-full h-12 rounded-xl">
                  <Select.Option value="cabin">Cabin</Select.Option>
                  <Select.Option value="villa">Villa</Select.Option>
                  <Select.Option value="apartment">Apartment</Select.Option>
                  <Select.Option value="house">House</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Detailed Description" name="description" required>
            <TextArea rows={4} className="rounded-xl" placeholder="Tell guests about your space..." />
          </Form.Item>
          <Form.Item label="Location" name="location" required>
            <Input prefix={<EnvironmentOutlined className="text-gray-400" />} className="h-12 rounded-xl" placeholder="e.g. Victoria Falls, Zimbabwe" />
          </Form.Item>
        </div>
      )
    },
    {
      key: '2',
      label: <span className="flex items-center"><SafetyCertificateOutlined className="mr-2" /> Amenities</span>,
      children: (
        <div className="pt-6">
          <Checkbox.Group className="w-full">
            <Row gutter={[16, 16]}>
              {[
                { label: 'Wifi', icon: <WifiOutlined /> },
                { label: 'Kitchen', icon: <CoffeeOutlined /> },
                { label: 'Free Parking', icon: <CarOutlined /> },
                { label: 'Air Conditioning', icon: <CloudOutlined /> },
                { label: 'Pool', icon: <TeamOutlined /> },
                { label: 'Gym', icon: <TeamOutlined /> },
                { label: 'Self Check-in', icon: <SafetyCertificateOutlined /> },
                { label: 'Workspace', icon: <EditOutlined /> }
              ].map(amenity => (
                <Col span={8} key={amenity.label}>
                  <Card className="hover:border-indigo-500 cursor-pointer overflow-hidden" size="small">
                    <Checkbox value={amenity.label.toLowerCase()}>
                      <Space>
                        {amenity.icon}
                        {amenity.label}
                      </Space>
                    </Checkbox>
                  </Card>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>
      )
    },
    {
      key: '3',
      label: <span className="flex items-center"><DollarOutlined className="mr-2" /> Pricing</span>,
      children: (
        <div className="pt-6 space-y-6">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Nightly Rate" name="price" required>
                <InputNumber prefix="$" className="w-full h-12 rounded-xl pt-1" min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Cleaning Fee" name="cleaningFee">
                <InputNumber prefix="$" className="w-full h-12 rounded-xl pt-1" />
              </Form.Item>
            </Col>
          </Row>
          <Card className="bg-indigo-50 border-indigo-100 rounded-2xl">
            <div className="flex justify-between items-center">
              <div>
                <Title level={5} className="!mb-0">Smart Pricing</Title>
                <Text className="text-gray-500 text-xs">Adjust your prices automatically to get more bookings.</Text>
              </div>
              <Switch defaultChecked className="bg-indigo-600" />
            </div>
          </Card>
        </div>
      )
    },
    {
      key: '4',
      label: <span className="flex items-center"><PictureOutlined className="mr-2" /> Photos</span>,
      children: (
        <div className="pt-6">
          <Upload.Dragger className="rounded-3xl bg-gray-50 border-dashed border-2 hover:border-indigo-500">
            <p className="ant-upload-drag-icon">
              <PictureOutlined className="text-4xl text-indigo-500" />
            </p>
            <p className="ant-upload-text">Click or drag photos to this area to upload</p>
            <p className="ant-upload-hint">Upload up to 10 high-resolution photos for your listing.</p>
          </Upload.Dragger>
        </div>
      )
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center bg-white/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 shadow-xl">
        <div>
          <Title level={3} className="!mb-0 !font-black text-gray-800">Property Portfolio</Title>
          <Text className="text-gray-400">Manage your holiday homes, villas, and apartments.</Text>
        </div>
        <Button 
          type="primary" 
          size="large" 
          icon={<PlusOutlined />} 
          onClick={() => openEditModal()}
          className="bg-indigo-600 hover:bg-indigo-700 h-12 rounded-2xl px-8 shadow-lg shadow-indigo-200"
        >
          Add New Property
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {properties.map(property => (
          <Col xs={24} sm={12} lg={8} key={property.id}>
            <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card
                className={`group rounded-[2.5rem] overflow-hidden shadow-xl border-none relative ${!property.isActive ? 'opacity-80' : ''}`}
                styles={{ body: { padding: 0 } }}
                cover={
                  <div className="relative h-56 overflow-hidden">
                    <img alt={property.name} src={property.image} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-4 left-4">
                      <Tag className={`rounded-full px-4 py-1 border-none font-bold backdrop-blur-md shadow-sm ${property.isActive ? 'bg-indigo-600/80 text-white' : 'bg-gray-800/80 text-white'}`}>
                        {property.isActive ? 'Active' : 'Paused'}
                      </Tag>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Tag className="rounded-full px-3 py-1 bg-white/80 text-indigo-600 border-none backdrop-blur-md font-black">
                        {property.type}
                      </Tag>
                    </div>
                  </div>
                }
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Title level={4} className="!mb-0 !font-black tracking-tight">{property.name}</Title>
                      <Space size={4} className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                        <EnvironmentOutlined /> {property.location}
                      </Space>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-indigo-600">${property.price}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">per night</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-3xl flex flex-col items-center justify-center">
                      <Title level={5} className="!mb-0 !font-black uppercase text-[10px] text-gray-400">Total Bookings</Title>
                      <div className="font-black text-gray-800 text-lg">{property.trips}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-3xl flex flex-col items-center justify-center">
                      <Title level={5} className="!mb-0 !font-black uppercase text-[10px] text-gray-400">Avg Rating</Title>
                      <div className="font-black text-amber-500 text-lg">{property.rating} <StarFilled className="text-xs" /></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-50 pt-4 mt-2">
                    <Button type="text" className="font-bold text-gray-400 hover:text-indigo-600 px-0" icon={<EditOutlined />} onClick={() => openEditModal(property)}>Edit Details</Button>
                    <div className="flex flex-col items-end">
                      <Text className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Visibility</Text>
                      <Switch checked={property.isActive} onChange={() => togglePropertyStatus(property.id)} size="small" className={property.isActive ? 'bg-indigo-600' : ''} />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <Modal
        title={
          <div className="flex items-center text-xl font-black p-4">
            <ShopOutlined className="mr-3 text-indigo-600" />
            {editingProperty ? "Update Listing" : "New Property Listing"}
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={900}
        footer={null}
        className="premium-modal"
        styles={{ body: { padding: '0 24px 24px' } }}
      >
        <Form layout="vertical" initialValues={editingProperty || { type: 'cabin', price: 100 }}>
          <Tabs defaultActiveKey="1" items={tabItems} className="premium-tabs-vertical" />
          <div className="flex justify-end mt-8 space-x-4">
            <Button size="large" className="rounded-2xl px-10 h-12 font-bold" onClick={() => setIsModalVisible(false)}>Discard</Button>
            <Button type="primary" size="large" className="rounded-2xl px-10 h-12 font-bold bg-indigo-600 shadow-lg shadow-indigo-100" onClick={() => setIsModalVisible(false)}>
              {editingProperty ? 'Save Changes' : 'Publish Listing'}
            </Button>
          </div>
        </Form>
      </Modal>
    </motion.div>
  );
}
