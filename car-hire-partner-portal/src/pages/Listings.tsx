import React, { useState } from 'react';
import { Card, Row, Col, Tag, Button, Typography, Modal, Form, Input, InputNumber, Select, Switch, Upload, Tooltip, Tabs, Checkbox, Divider, Space, Badge } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  UploadOutlined, 
  InfoCircleOutlined, 
  CarOutlined, 
  DollarOutlined, 
  SettingOutlined, 
  PictureOutlined, 
  FileTextOutlined, 
  AppstoreAddOutlined, 
  EyeOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function Listings() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [smartPricingEnabled, setSmartPricingEnabled] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isBatchModalVisible, setIsBatchModalVisible] = useState(false);
  const [batchPrice, setBatchPrice] = useState<number>(0);

  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      name: 'Tesla Model 3',
      plate: 'EV-2023',
      price: 120,
      status: 'Available',
      trips: 45,
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      isActive: true,
      hasSnooze: false,
    },
    {
      id: 2,
      name: 'Toyota Corolla',
      plate: 'ABC-123',
      price: 45,
      status: 'Booked',
      trips: 112,
      image: 'https://images.unsplash.com/photo-1629897048514-3dd741430277?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      isActive: true,
      hasSnooze: false,
    },
    {
      id: 3,
      name: 'BMW X5',
      plate: 'LUX-999',
      price: 150,
      status: 'Maintenance',
      trips: 28,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      isActive: false,
      hasSnooze: true,
    },
    {
      id: 4,
      name: 'Honda Civic',
      plate: 'XYZ-789',
      price: 55,
      status: 'Available',
      trips: 89,
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      isActive: true,
      hasSnooze: false,
    },
  ]);

  const toggleVehicleStatus = (id: number) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, isActive: !v.isActive } : v));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'success';
      case 'Booked': return 'processing';
      case 'Maintenance': return 'warning';
      default: return 'default';
    }
  };

  const openEditModal = (vehicle?: any) => {
    setEditingVehicle(vehicle || null);
    setIsModalVisible(true);
  };

  const tabItems = [
    {
      key: 'extras',
      label: <span className="flex items-center"><AppstoreAddOutlined className="mr-2" /> Extras</span>,
      children: (
        <div className="pt-6 space-y-6">
          <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 mb-6">
            <Title level={5} className="!mb-1">Vehicle Extras</Title>
            <Text className="text-gray-500 text-sm">Offer prepaid conveniences to your guests to increase your earnings.</Text>
          </div>
          <div className="space-y-4">
            <ExtraRow icon="⛽" title="Prepaid Refuel" desc="Guest can return the car at any fuel level." price={60} />
            <ExtraRow icon="💺" title="Child Safety Seat" desc="Graco 4Ever DLX 4-in-1 Car Seat." price={15} />
            <ExtraRow icon="🧊" title="Cooler" desc="YETI Tundra 45 Cooler with ice." price={25} />
          </div>
        </div>
      )
    },
    {
      key: '1',
      label: <span className="flex items-center"><CheckCircleFilled className="mr-2 text-indigo-500" /> Amenities</span>,
      children: (
        <div className="pt-6 space-y-4">
          <Form.Item name="features">
            <Checkbox.Group className="w-full">
              <Row gutter={[16, 16]}>
                {[
                  'Bluetooth', 'Backup Camera', 'Heated Seats', 'Sunroof', 
                  'Built-in GPS', 'All-Wheel Drive', 'USB Charger', 'Blind Spot Warning',
                  'Apple CarPlay', 'Android Auto', 'Toll Pass', 'Child Seat'
                ].map(feat => (
                  <Col span={8} key={feat}>
                    <Checkbox value={feat.toLowerCase().replace(' ', '_')}>{feat}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </div>
      )
    },
    {
      key: '2',
      label: <span><FileTextOutlined className="mr-2" /> Details</span>,
      children: (
        <div className="pt-6 space-y-6">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label="Make & Model" name="makeModel" required>
                <Input className="h-12 rounded-xl" placeholder="e.g. Tesla Model 3" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Year" name="year" required>
                <InputNumber className="w-full h-12 rounded-xl pt-1" min={2015} max={2026} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Listing Description" name="description" required>
            <TextArea rows={4} className="rounded-xl" placeholder="Tell guests what makes your car special..." />
          </Form.Item>
        </div>
      )
    },
    {
      key: 'pricing',
      label: <span><DollarOutlined className="mr-2" /> Pricing</span>,
      children: (
        <div className="pt-6 space-y-6">
          <div className="bg-gradient-to-r from-indigo-500 to-violet-600 p-6 rounded-3xl text-white shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <Title level={5} className="!text-white !mb-0 flex items-center">
                  AI Smart Pricing
                  <Tag className="ml-2 bg-white/20 border-none text-white text-[10px] font-black uppercase">Alpha</Tag>
                </Title>
                <Text className="text-indigo-100 text-xs">Dynamic rates based on demand patterns.</Text>
              </div>
              <Form.Item name="smartPricing" valuePropName="checked" className="mb-0">
                <Switch className="bg-white/20" />
              </Form.Item>
            </div>
          </div>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Base Daily Rate" name="basePrice">
                <InputNumber prefix="$" className="w-full h-12 rounded-xl pt-1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Minimum Daily Rate" name="minPrice">
                <InputNumber prefix="$" className="w-full h-12 rounded-xl pt-1" />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center bg-white/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 shadow-xl">
        <div>
          <Title level={3} className="!mb-0 !font-black text-gray-800">Vehicle Fleet</Title>
          <Text className="text-gray-400">Inventory management and listing controls.</Text>
        </div>
        <div className="flex space-x-3">
          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />} 
            onClick={() => openEditModal()}
            className="bg-indigo-600 hover:bg-indigo-700 h-12 rounded-2xl px-8 shadow-lg shadow-indigo-200"
          >
            Add New Vehicle
          </Button>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {vehicles.map(vehicle => (
          <Col xs={24} sm={12} lg={8} key={vehicle.id}>
            <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card
                className={`group rounded-[2.5rem] overflow-hidden shadow-xl border-none relative ${!vehicle.isActive ? 'opacity-80' : ''}`}
                styles={{ body: { padding: 0 } }}
                cover={
                  <div className="relative h-56 overflow-hidden">
                    <img alt={vehicle.name} src={vehicle.image} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-4 left-4">
                      <Tag className={`rounded-full px-3 py-1 border-none font-bold backdrop-blur-md shadow-sm ${vehicle.isActive ? 'bg-green-500/80 text-white' : 'bg-gray-800/80 text-white'}`}>
                        {vehicle.isActive ? 'Active' : 'Paused'}
                      </Tag>
                    </div>
                    {vehicle.hasSnooze && (
                      <div className="absolute top-4 right-4">
                        <Tooltip title="Temporary Snooze Active">
                          <Tag className="rounded-full px-3 py-1 bg-amber-500/80 text-white border-none backdrop-blur-md">
                            <ClockCircleOutlined className="mr-1" /> Snoozed
                          </Tag>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                }
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Title level={4} className="!mb-0 !font-black tracking-tight">{vehicle.name}</Title>
                      <Text className="text-gray-400 text-xs uppercase font-bold tracking-widest">{vehicle.plate}</Text>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-indigo-600">${vehicle.price}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">per day</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-2xl flex flex-col items-center justify-center">
                      <Title level={5} className="!mb-0 !font-black uppercase text-[10px] text-gray-400">Trips</Title>
                      <div className="font-black text-gray-800">{vehicle.trips}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl flex flex-col items-center justify-center">
                      <Title level={5} className="!mb-0 !font-black uppercase text-[10px] text-gray-400">Rating</Title>
                      <div className="font-black text-amber-500">5.0 ★</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-50 pt-4 mt-2">
                    <Button type="text" className="font-bold text-gray-400 hover:text-indigo-600 px-0" icon={<EditOutlined />} onClick={() => openEditModal(vehicle)}>Customize</Button>
                    <Space size="middle">
                      <div className="flex flex-col items-end">
                        <Text className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Listing Status</Text>
                        <Switch checked={vehicle.isActive} onChange={() => toggleVehicleStatus(vehicle.id)} size="small" className={vehicle.isActive ? 'bg-indigo-600' : ''} />
                      </div>
                    </Space>
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
            <CarOutlined className="mr-3 text-indigo-600" />
            {editingVehicle ? "Optimize Listing" : "List New Vehicle"}
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={850}
        footer={null}
        className="premium-modal"
        styles={{ body: { padding: '0 24px 24px' } }}
      >
        <Form layout="vertical" initialValues={{ smartPricing: true, basePrice: editingVehicle?.price || 90 }}>
          <Tabs defaultActiveKey="extras" items={tabItems} className="premium-tabs-vertical" />
          <div className="flex justify-end mt-8 space-x-4">
            <Button size="large" className="rounded-2xl px-10 h-12 font-bold" onClick={() => setIsModalVisible(false)}>Discard</Button>
            <Button type="primary" size="large" className="rounded-2xl px-10 h-12 font-bold bg-indigo-600 shadow-lg shadow-indigo-100" onClick={() => setIsModalVisible(false)}>Confirm Changes</Button>
          </div>
        </Form>
      </Modal>
    </motion.div>
  );
}

function ExtraRow({ icon, title, desc, price }: any) {
  return (
    <div className="flex justify-between items-start p-5 bg-white rounded-3xl border border-gray-100 group hover:border-indigo-200 transition-all hover:shadow-md">
      <div className="flex">
        <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <Title level={5} className="!mb-1 !font-black text-gray-800">{title}</Title>
          <Text className="text-gray-400 text-xs leading-tight">{desc}</Text>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xl font-black text-indigo-600">${price}</div>
        <Switch size="small" className="mt-2" />
      </div>
    </div>
  );
}
