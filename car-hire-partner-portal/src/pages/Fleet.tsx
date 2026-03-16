import React, { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Typography,
  Card,
  Row,
  Col,
  Modal,
  Form,
  Select,
  Tooltip,
  Switch,
  Statistic,
} from 'antd';
import {
  SearchOutlined,
  CarOutlined,
  SafetyCertificateOutlined,
  ToolOutlined,
  UserOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;
const { Option } = Select;

const initialVehicles = [
  {
    key: '1',
    model: 'Toyota Corolla',
    plate: 'ABC-123',
    status: 'ACTIVE',
    mode: 'DRIVER_RENTAL',
    health: 'Excellent',
    lastService: '2026-01-10',
    assignedTo: 'Alex Smith',
  },
  {
    key: '2',
    model: 'Honda CR-V',
    plate: 'XYZ-789',
    status: 'INSPECTION',
    mode: 'DIRECT_HIRE',
    health: 'Good',
    lastService: '2025-12-15',
    assignedTo: 'None',
  },
  {
    key: '3',
    model: 'Mercedes E-Class',
    plate: 'LUX-001',
    status: 'ACTIVE',
    mode: 'DRIVER_RENTAL',
    health: 'Excellent',
    lastService: '2026-02-01',
    assignedTo: 'Mike Ross',
  },
  {
    key: '4',
    model: 'Toyota Prius',
    plate: 'ECO-555',
    status: 'MAINTENANCE',
    mode: 'DIRECT_HIRE',
    health: 'Needs Service',
    lastService: '2025-11-20',
    assignedTo: 'None',
  },
];

const Fleet: React.FC = () => {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    { title: 'Total Portfolio', value: 12, icon: <CarOutlined />, color: '#0066ff' },
    { title: 'B2B (Driver)', value: 8, icon: <UserOutlined />, color: '#722ed1' },
    { title: 'B2C (Hire)', value: 4, icon: <SwapOutlined />, color: '#13c2c2' },
  ];

  const columns = [
    {
      title: 'Vehicle Asset',
      key: 'asset',
      render: (record: any) => (
        <Space size={16}>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 text-lg">
            <CarOutlined />
          </div>
          <Space direction="vertical" size={0}>
            <Text strong className="text-gray-800">{record.model}</Text>
            <Text className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-black text-gray-500 uppercase tracking-tighter">
              {record.plate}
            </Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Operational Mode',
      key: 'mode',
      render: (record: any) => (
        <Space direction="vertical" size={2}>
           <Tag 
            className="border-none px-3 py-1 rounded-full font-black text-[10px] tracking-widest"
            color={record.mode === 'DRIVER_RENTAL' ? 'purple' : 'cyan'}
          >
            {record.mode.replace('_', ' ')}
          </Tag>
          <Text className="text-[10px] text-gray-400 font-medium">
            {record.mode === 'DRIVER_RENTAL' ? `Bound to ${record.assignedTo}` : 'Available for Hourly/Daily'}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Lifecycle State',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: any = {
          ACTIVE: 'success',
          INSPECTION: 'processing',
          MAINTENANCE: 'error',
        };
        return (
          <Tag className="border-none px-3 py-1 rounded-full font-bold text-[10px] tracking-widest" color={colors[status] || 'default'}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Asset Health',
      key: 'health',
      render: (record: any) => (
        <Space direction="vertical" size={2}>
          <Text className="text-[12px] font-bold text-gray-700">{record.health}</Text>
          <Text className="text-[10px] text-gray-400 font-medium italic">Service: {record.lastService}</Text>
        </Space>
      ),
    },
    {
      title: 'Model Switch',
      key: 'switch',
      align: 'center' as const,
      render: (record: any) => (
        <Tooltip title={record.assignedTo !== 'None' ? "Cannot switch while assigned to driver" : "Toggle B2B/B2C mode"}>
          <Switch 
            disabled={record.assignedTo !== 'None'} 
            checked={record.mode === 'DIRECT_HIRE'}
            className={record.mode === 'DIRECT_HIRE' ? 'bg-cyan-500' : 'bg-purple-500'}
            onChange={(checked) => {
              const newMode = checked ? 'DIRECT_HIRE' : 'DRIVER_RENTAL';
              setVehicles(vehicles.map(v => v.key === record.key ? { ...v, mode: newMode } : v));
            }}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: () => (
        <Space>
           <Button type="text" className="rounded-lg hover:bg-gray-50">Edit</Button>
           <Button type="text" danger className="rounded-lg hover:bg-red-50">Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <Title level={2} className="!mb-1 !font-black tracking-tight text-gray-800">Portfolio Operations</Title>
          <Text type="secondary" className="font-medium">Orchestrate your vehicle fleet across multiple rental models and health states</Text>
        </div>
        <Button
          type="primary"
          size="large"
          className="shadow-xl shadow-blue-200 h-11 px-8 rounded-xl font-bold"
          onClick={() => setIsModalOpen(true)}
        >
          Add Asset
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {stats.map((stat, idx) => (
          <Col key={stat.title} xs={24} sm={8}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card bordered={false} className="shadow-2xl shadow-gray-100 overflow-hidden group">
                <Statistic
                  title={<Text className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">{stat.title}</Text>}
                  value={stat.value}
                  prefix={<div style={{ color: stat.color }} className="mr-2">{stat.icon}</div>}
                  valueStyle={{ fontWeight: 900, fontSize: '24px' }}
                />
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
        <Card bordered={false} className="shadow-2xl shadow-gray-100">
          <div className="mb-6 flex justify-between items-center">
            <Input
              placeholder="Search by model, plate, or driver..."
              prefix={<SearchOutlined className="text-gray-400" />}
              className="w-96 rounded-xl bg-gray-50 border-gray-100 h-10"
            />
            <Space>
               <Button icon={<ToolOutlined />} className="rounded-lg font-bold text-[11px] uppercase tracking-wider h-10 px-6">Service Schedule</Button>
               <Button icon={<SafetyCertificateOutlined />} className="rounded-lg font-bold text-[11px] uppercase tracking-wider h-10 px-6">Inspections</Button>
            </Space>
          </div>

          <Table 
            columns={columns} 
            dataSource={vehicles} 
            pagination={{ pageSize: 8 }}
            className="ant-table-premium"
          />
        </Card>
      </motion.div>

      <Modal
        title={<Title level={4} className="!m-0 font-black">Register New Asset</Title>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className="premium-modal"
        centered
      >
        <Form layout="vertical" className="mt-6">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<Text className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Model</Text>}>
                <Input placeholder="e.g. Toyota Corolla" className="rounded-lg h-10" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<Text className="text-[11px] font-bold uppercase tracking-widest text-gray-400">License Plate</Text>}>
                <Input placeholder="e.g. ABC-123" className="rounded-lg h-10" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label={<Text className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Primary Rental Mode</Text>}>
            <Select defaultValue="DRIVER_RENTAL" className="h-10">
              <Option value="DRIVER_RENTAL">B2B (Driver Rental)</Option>
              <Option value="DIRECT_HIRE">B2C (Direct/Personal Hire)</Option>
            </Select>
          </Form.Item>
          <Button type="primary" block className="h-11 rounded-xl font-bold mt-4 shadow-lg shadow-blue-100">
            Confirm Registration
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Fleet;
