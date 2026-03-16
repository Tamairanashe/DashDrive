import React from 'react';
import { Row, Col, Card, Typography, Button, Space, Table, Tag, Avatar, Badge } from 'antd';
import {
  FileSyncOutlined,
  RightOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const rentals = [
  {
    key: '1',
    driver: 'Alex Smith',
    vehicle: 'Toyota Corolla (ABC-123)',
    startDate: '2026-03-01',
    endDate: '2026-03-24',
    weeklyRate: '$245',
    deposit: '$500',
    status: 'ACTIVE',
    paymentStatus: 'PAID',
  },
  {
    key: '2',
    driver: 'Sarah Jones',
    vehicle: 'Honda CR-V (XYZ-789)',
    startDate: '2026-03-10',
    endDate: '2026-04-10',
    weeklyRate: '$385',
    deposit: '$750',
    status: 'ACTIVE',
    paymentStatus: 'OVERDUE',
  },
  {
    key: '3',
    driver: 'Mike Ross',
    vehicle: 'Mercedes E-Class (LUX-001)',
    startDate: '2026-03-15',
    endDate: '2026-06-15',
    weeklyRate: '$840',
    deposit: '$1,500',
    status: 'CREATED',
    paymentStatus: 'PENDING',
  },
];

const Rentals: React.FC = () => {
  const columns = [
    {
      title: 'Contract / Asset',
      key: 'asset',
      render: (record: any) => (
        <Space direction="vertical" size={2}>
          <Text strong className="text-gray-800">{record.vehicle}</Text>
          <Space size={4}>
            <Avatar size={16} className="bg-blue-600 text-[8px]">{record.driver[0]}</Avatar>
            <Text className="text-[11px] text-gray-500 font-medium">Assigned to {record.driver}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Timeline',
      key: 'timeline',
      render: (record: any) => (
        <Space direction="vertical" size={2}>
          <Space size={4}>
            <CalendarOutlined className="text-gray-400 text-[10px]" />
            <Text className="text-[11px] text-gray-600 font-bold">{record.startDate} — {record.endDate}</Text>
          </Space>
          <Text className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Fixed Weekly Contract</Text>
        </Space>
      ),
    },
    {
      title: 'Financial Configuration',
      key: 'financials',
      render: (record: any) => (
        <Space direction="vertical" size={2}>
          <Text strong className="text-gray-800">{record.weeklyRate}<span className="text-[10px] font-normal text-gray-400">/week</span></Text>
          <Text className="text-[10px] text-gray-400 font-medium">Deposit: {record.deposit}</Text>
        </Space>
      ),
    },
    {
      title: 'Agreement State',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag className="border-none px-3 py-1 rounded-full font-black text-[10px] tracking-widest" color={status === 'ACTIVE' ? 'success' : 'processing'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Settlement Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (pay: string) => (
        <Badge 
          status={pay === 'PAID' ? 'success' : pay === 'OVERDUE' ? 'error' : 'warning'} 
          text={<Text className={`text-[11px] font-bold ${pay === 'OVERDUE' ? 'text-red-500' : 'text-gray-500'}`}>{pay}</Text>} 
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: () => (
        <Button type="link" icon={<RightOutlined />} className="text-gray-400 hover:text-blue-500" />
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <Title level={2} className="!mb-1 !font-black tracking-tight text-gray-800">Rental Contracts</Title>
          <Text type="secondary" className="font-medium">Active and pending lease agreements between fleet and drivers</Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<FileSyncOutlined />}
          className="shadow-xl shadow-blue-200 h-11 px-8 rounded-xl font-bold"
        >
          New Contract
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card bordered={false} className="shadow-2xl shadow-gray-100">
               <div className="grid grid-cols-3 gap-8 mb-8">
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
                    <Text className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-2">Total Monthly Projections</Text>
                    <Title level={3} className="!m-0 !font-black text-blue-600">$12,450</Title>
                  </div>
                  <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100/50">
                    <Text className="text-[10px] font-bold text-red-400 uppercase tracking-widest block mb-2">Portfolio at Risk</Text>
                    <Title level={3} className="!m-0 !font-black text-red-600">$385</Title>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Pending Signatures</Text>
                    <Title level={3} className="!m-0 !font-black text-gray-400">1</Title>
                  </div>
               </div>
              <Table 
                columns={columns} 
                dataSource={rentals} 
                pagination={{ pageSize: 5 }}
                className="ant-table-premium"
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default Rentals;
