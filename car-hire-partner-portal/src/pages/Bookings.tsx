import React, { useState } from 'react';
import { 
  Table, 
  Tag, 
  Space, 
  Button, 
  Input, 
  Card, 
  Typography, 
  Row,
  Col,
  Statistic,
  Avatar,
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  EyeOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const Bookings: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  const stats = [
    { title: 'Today\'s Pickups', value: 5, icon: <ClockCircleOutlined />, color: '#0066ff' },
    { title: 'Pending Returns', value: 2, icon: <CheckCircleOutlined />, color: '#52c41a' },
    { title: 'Daily Revenue', value: 420.50, icon: <DollarOutlined />, color: '#722ed1', isCurrency: true },
  ];

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => (
        <Space direction="vertical" size={0}>
          <Text className="font-black text-blue-600 tracking-tighter">{text}</Text>
          <Tag className="border-none bg-blue-50 text-[9px] font-bold text-blue-500 py-0 px-1.5 uppercase rounded">Personal Hire</Tag>
        </Space>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (record: any) => (
        <Space>
          <Avatar size="small" className="bg-gray-100 text-gray-400">
            {record.customer[0]}
          </Avatar>
          <Text strong className="text-gray-700">{record.customer}</Text>
        </Space>
      )
    },
    {
      title: 'Vehicle Asset',
      dataIndex: 'vehicle',
      key: 'vehicle',
      render: (text: string) => <Text className="font-medium text-gray-500">{text}</Text>
    },
    {
      title: 'Rental Window',
      key: 'duration',
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Text className="text-[12px] font-bold text-gray-700">{record.pickupDate}</Text>
          <Text type="secondary" className="text-[10px] uppercase font-bold tracking-wider">UNTIL {record.dropoffDate}</Text>
        </Space>
      ),
    },
    {
      title: 'Total Fare',
      dataIndex: 'amount',
      key: 'amount',
      render: (val: number) => <Text className="font-black text-gray-800">${val.toFixed(2)}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: any = {
          Active: 'processing',
          Completed: 'success',
          Cancelled: 'error',
          Upcoming: 'warning',
        };
        return (
          <Tag 
            className="border-none px-3 py-1 rounded-lg font-black text-[10px] tracking-widest"
            color={colors[status] || 'default'}
          >
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: any) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} className="rounded-lg hover:bg-gray-50" />
          {record.status === 'Active' && (
            <Button size="small" type="primary" className="rounded-lg font-bold text-[10px] h-7 px-4">RETURN</Button>
          )}
        </Space>
      ),
    },
  ];

  const dataSource = [
    {
      key: '1',
      id: 'BK-5291',
      customer: 'James Wilson',
      vehicle: 'Toyota Corolla (ABC-123)',
      pickupDate: '2026-03-14',
      dropoffDate: '2026-03-17',
      amount: 105.00,
      status: 'Active',
    },
    {
      key: '2',
      id: 'BK-5288',
      customer: 'Sarah Chen',
      vehicle: 'Mercedes E-Class (LUX-001)',
      pickupDate: '2026-03-12',
      dropoffDate: '2026-03-13',
      amount: 150.00,
      status: 'Completed',
    },
    {
      key: '3',
      id: 'BK-5302',
      customer: 'Michael Brown',
      vehicle: 'Honda CR-V (XYZ-789)',
      pickupDate: '2026-03-20',
      dropoffDate: '2026-03-22',
      amount: 110.00,
      status: 'Upcoming',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <Title level={2} className="!mb-1 !font-black tracking-tight text-gray-800">Direct Hire Engine</Title>
          <Text type="secondary" className="font-medium">Manage B2C short-term bookings, hourly rentals, and point-of-hire logistics</Text>
        </div>
        <Button
          type="primary"
          size="large"
          className="shadow-xl shadow-blue-200 h-11 px-8 rounded-xl font-bold"
        >
          New Personal Hire
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {stats.map((stat, idx) => (
          <Col key={stat.title} xs={24} sm={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card bordered={false} className="shadow-2xl shadow-gray-100 overflow-hidden">
                <Statistic
                  title={<Text className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">{stat.title}</Text>}
                  value={stat.value}
                  prefix={stat.icon}
                  precision={stat.isCurrency ? 2 : 0}
                  valueStyle={{ color: stat.color, fontWeight: 900, fontSize: '24px' }}
                />
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card bordered={false} className="shadow-2xl shadow-gray-100">
          <div className="mb-6 flex justify-between items-center">
            <Input
              placeholder="Search by ID, customer name, or asset..."
              prefix={<SearchOutlined className="text-gray-400" />}
              className="w-96 rounded-xl bg-gray-50 border-gray-100 h-10"
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button icon={<FilterOutlined />} className="rounded-lg font-bold text-[11px] uppercase tracking-wider h-10 px-6">Advanced Filter</Button>
          </div>

          <Table
            columns={columns}
            dataSource={dataSource.filter(d => 
              d.customer.toLowerCase().includes(searchText.toLowerCase()) || 
              d.id.toLowerCase().includes(searchText.toLowerCase())
            )}
            pagination={{ pageSize: 5 }}
            className="ant-table-premium"
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default Bookings;
