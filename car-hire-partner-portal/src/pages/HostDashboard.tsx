import React from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Statistic, 
  Table, 
  Tag, 
  Space, 
  Button, 
  Divider,
  Progress,
} from 'antd';
import { 
  PlusOutlined, 
  CalendarOutlined, 
  ArrowRightOutlined,
  CarOutlined,
  UserOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const revenueData = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 600 },
  { name: 'Wed', value: 500 },
  { name: 'Thu', value: 900 },
  { name: 'Fri', value: 1200 },
  { name: 'Sat', value: 1500 },
  { name: 'Sun', value: 1100 },
];

const utilizationData = [
  { name: 'BMW 3', value: 85, color: '#0066ff' },
  { name: 'Tesla 3', value: 45, color: '#13c2c2' },
  { name: 'Audi A4', value: 60, color: '#722ed1' },
];

const recentBookings = [
  {
    key: '1',
    id: 'BK-9920',
    customer: 'Sarah Jenkins',
    vehicle: 'BMW 3 Series',
    start: 'Mar 20',
    end: 'Mar 22',
    status: 'ACTIVE',
    amount: 240,
  },
  {
    key: '2',
    id: 'BK-9921',
    customer: 'Michael Chen',
    vehicle: 'Tesla Model 3',
    start: 'Mar 25',
    end: 'Mar 28',
    status: 'CONFIRMED',
    amount: 450,
  },
  {
    key: '3',
    id: 'BK-9922',
    customer: 'David Smith',
    vehicle: 'Audi A4',
    start: 'Mar 21',
    end: 'Mar 21',
    status: 'PENDING',
    amount: 85,
  },
];

const HostDashboard: React.FC = () => {
  const navigate = useNavigate();

  const kpis = [
    { title: 'Fleet Size', value: '12', sub: '2 cars in shop', icon: <CarOutlined />, color: '#0066ff' },
    { title: 'Active Rentals', value: '8', sub: '66% Utilization', icon: <CalendarOutlined />, color: '#52c41a' },
    { title: 'Monthly Revenue', value: '$12,450', sub: '+14% vs last mo', icon: <RiseOutlined />, color: '#722ed1' },
    { title: 'Pending Requests', value: '5', sub: 'Require approval', icon: <UserOutlined />, color: '#faad14' },
  ];

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <Text className="font-mono font-bold text-blue-600">{text}</Text>,
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (record: any) => (
        <Space>
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-xs">
            {record.customer[0]}
          </div>
          <Text strong>{record.customer}</Text>
        </Space>
      ),
    },
    {
      title: 'Vehicle',
      dataIndex: 'vehicle',
      key: 'vehicle',
    },
    {
      title: 'Dates',
      key: 'dates',
      render: (record: any) => <Text type="secondary">{record.start} - {record.end}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'ACTIVE') color = 'processing';
        if (status === 'CONFIRMED') color = 'success';
        if (status === 'PENDING') color = 'warning';
        return <Tag color={color} className="rounded-full border-none font-bold text-[10px] uppercase tracking-wider px-3">{status}</Tag>;
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (val: number) => <Text strong>${val}</Text>,
    },
    {
      title: '',
      key: 'action',
      render: () => <Button type="text" icon={<ArrowRightOutlined />} />,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <Title level={1} className="!mb-1 !font-black tracking-tight text-gray-800 text-4xl">Host Overview</Title>
          <Text type="secondary" className="font-medium text-lg italic">Growth is looking strong this week, John.</Text>
        </div>
        <Space size={16}>
          <Button size="large" className="rounded-2xl font-bold h-14 px-8 border-gray-200">Export Reports</Button>
          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />} 
            className="h-14 px-10 rounded-2xl font-black text-lg bg-blue-600 shadow-2xl shadow-blue-200"
            onClick={() => navigate('/host/create')}
          >
            Add Vehicle
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {kpis.map((kpi, idx) => (
          <Col key={kpi.title} xs={24} sm={12} lg={6}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}>
              <Card bordered={false} className="shadow-2xl shadow-gray-100 rounded-[2rem] hover:shadow-blue-50 transition-all border border-transparent hover:border-blue-100 group">
                <div className="flex justify-between items-start mb-4">
                  <div style={{ background: `${kpi.color}15`, color: kpi.color }} className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl">
                    {kpi.icon}
                  </div>
                  <Tag color={kpi.color} className="rounded-full border-none font-black text-[9px] px-2">{kpi.title.split(' ')[0]}</Tag>
                </div>
                <Statistic 
                  value={kpi.value} 
                  valueStyle={{ fontWeight: 900, fontSize: '32px', letterSpacing: '-1px' }} 
                />
                <Text type="secondary" className="text-[12px] font-bold uppercase tracking-wider mt-1 block opacity-60">
                  {kpi.sub}
                </Text>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card bordered={false} title={<Title level={4} className="!mb-0 font-black">Performance Revenue</Title>} className="shadow-2xl shadow-gray-100 rounded-[2.5rem] p-4">
            <div className="h-[350px] mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066ff" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0066ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#aaa' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#aaa' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontWeight: 900, color: '#0066ff' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#0066ff" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card bordered={false} title={<Title level={4} className="!mb-0 font-black">Utilization</Title>} className="shadow-2xl shadow-gray-100 rounded-[2.5rem] p-4 h-full">
            <div className="space-y-8 mt-6">
              {utilizationData.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between mb-2">
                    <Text strong>{item.name}</Text>
                    <Text strong>{item.value}%</Text>
                  </div>
                  <Progress 
                    percent={item.value} 
                    strokeColor={item.color} 
                    showInfo={false} 
                    strokeWidth={12} 
                    className="m-0 premium-progress"
                  />
                </div>
              ))}
              <Divider className="my-8" />
              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                <Text type="secondary" className="text-[10px] font-black uppercase tracking-widest block mb-2">System Insight</Text>
                <Text className="text-sm font-medium leading-relaxed">Your <span className="text-blue-600 font-bold">BMW 3 Series</span> is consistently 80%+ booked. Consider increasing daily price by <span className="text-green-600 font-bold">$10</span>.</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card bordered={false} className="shadow-2xl shadow-gray-100 rounded-[2.5rem] overflow-hidden">
        <div className="flex justify-between items-center p-8 pb-0">
          <Title level={4} className="!mb-0 font-black">Recent Booking Engine Activity</Title>
          <Button type="link" className="font-bold flex items-center gap-1 group">
            View All Bookings <ArrowRightOutlined className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
        <Table 
          columns={columns} 
          dataSource={recentBookings} 
          pagination={false} 
          className="ant-table-premium p-4"
        />
      </Card>
    </div>
  );
};

export default HostDashboard;
