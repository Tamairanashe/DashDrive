import React from 'react';
import { Row, Col, Card, Space, Table, Tag, Typography, Button, Input, Avatar } from 'antd';
import {
  UserAddOutlined,
  SearchOutlined,
  MoreOutlined,
  VerifiedOutlined,
  WarningOutlined,
  SafetyOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const drivers = [
  {
    key: '1',
    name: 'Alex Smith',
    status: 'ACTIVE',
    trips: 142,
    rating: 4.9,
    documents: 'VALID',
    lastLocation: 'Main St, Downtown',
    vehicle: 'Toyota Corolla (ABC-123)',
  },
  {
    key: '2',
    name: 'Sarah Jones',
    status: 'DOCUMENT_VERIFICATION',
    trips: 0,
    rating: 0,
    documents: 'PENDING',
    lastLocation: 'N/A',
    vehicle: 'Honda CR-V (XYZ-789)',
  },
  {
    key: '3',
    name: 'Mike Ross',
    status: 'ACTIVE',
    trips: 89,
    rating: 4.8,
    documents: 'EXPIRING_SOON',
    lastLocation: 'Airport Terminal 2',
    vehicle: 'Mercedes E-Class (LUX-001)',
  },
  {
    key: '4',
    name: 'Harvey Specter',
    status: 'APPLIED',
    trips: 0,
    rating: 0,
    documents: 'INCOMPLETE',
    lastLocation: 'N/A',
    vehicle: 'None',
  },
];

const Drivers: React.FC = () => {
  const columns = [
    {
      title: 'Professional Profile',
      key: 'profile',
      render: (record: any) => (
        <Space size={16}>
          <Avatar size={48} className="bg-blue-600 shadow-md">
            {record.name.split(' ').map((n: string) => n[0]).join('')}
          </Avatar>
          <Space direction="vertical" size={0}>
            <Text strong className="text-gray-800 text-[15px]">{record.name}</Text>
            <Space size={4}>
              <EnvironmentOutlined className="text-gray-400 text-[10px]" />
              <Text className="text-[11px] text-gray-400 font-medium">{record.lastLocation}</Text>
            </Space>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Workforce State',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: any = {
          ACTIVE: 'success',
          DOCUMENT_VERIFICATION: 'processing',
          APPLIED: 'warning',
        };
        return (
          <Tag 
            className="border-none px-3 py-1 rounded-full font-extrabold text-[10px] tracking-widest"
            color={colors[status] || 'default'}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Compliance Status',
      dataIndex: 'documents',
      key: 'documents',
      render: (doc: string) => {
        let icon = <VerifiedOutlined />;
        let color = '#52c41a';
        let bg = 'rgba(82, 196, 26, 0.08)';

        if (doc === 'EXPIRING_SOON') {
          icon = <WarningOutlined />;
          color = '#faad14';
          bg = 'rgba(250, 173, 20, 0.08)';
        } else if (doc === 'PENDING' || doc === 'INCOMPLETE') {
          icon = <SafetyOutlined />;
          color = '#888';
          bg = 'rgba(0, 0, 0, 0.05)';
        }

        return (
          <Tag 
            className="border-none px-3 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1.5 w-fit"
            style={{ color, background: bg }}
          >
            {icon}
            {doc}
          </Tag>
        );
      },
    },
    {
      title: 'Platform Stats',
      key: 'stats',
      render: (record: any) => (
        <Space direction="vertical" size={2}>
          <Text className="text-[12px] font-bold text-gray-700">{record.trips} Trips Completed</Text>
          <Text className="text-[11px] text-blue-500 font-bold">⭐ {record.rating} Rating</Text>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: () => (
        <Button type="text" icon={<MoreOutlined />} className="rounded-lg hover:bg-gray-100" />
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <Title level={2} className="!mb-1 !font-black tracking-tight text-gray-800">Driver Workforce</Title>
          <Text type="secondary" className="font-medium">Manage driver lifecycle, compliance, and platform performance</Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<UserAddOutlined />}
          className="shadow-xl shadow-blue-200 h-11 px-8 rounded-xl font-bold"
        >
          Add Driver
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card bordered={false} className="shadow-2xl shadow-gray-100">
               <div className="mb-6 flex justify-between items-center">
                <Input
                  placeholder="Search drivers by name, status, or asset..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="w-96 rounded-xl bg-gray-50 border-gray-100 h-10"
                />
                <Space>
                   <Button icon={<VerifiedOutlined />} className="rounded-lg font-bold text-[11px] uppercase tracking-wider h-10">Verify Documents</Button>
                </Space>
              </div>
              <Table 
                columns={columns} 
                dataSource={drivers} 
                pagination={{ pageSize: 8 }}
                className="ant-table-premium"
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default Drivers;
