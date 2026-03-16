import React from 'react';
import { Row, Col, Card, Typography, Button, Space, Table, Tag, Progress } from 'antd';
import {
  VerifiedOutlined,
  CalendarOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  FileProtectOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const complianceItems = [
  {
    key: '1',
    item: 'Vehicle Inspection',
    asset: 'Toyota Corolla (ABC-123)',
    expiry: '2026-08-15',
    status: 'VALID',
  },
  {
    key: '2',
    item: 'Comprehensive Insurance',
    asset: 'Honda CR-V (XYZ-789)',
    expiry: '2026-03-20',
    status: 'EXPIRING_SOON',
  },
  {
    key: '3',
    item: 'Carrier Permit',
    asset: 'Mercedes E-Class (LUX-001)',
    expiry: '2026-12-01',
    status: 'VALID',
  },
  {
    key: '4',
    item: 'Hackney Permit',
    asset: 'Toyota Corolla (ABC-123)',
    expiry: '2026-02-10',
    status: 'EXPIRED',
  },
];

const Compliance: React.FC = () => {
  const columns = [
    {
      title: 'Compliance Metric',
      dataIndex: 'item',
      key: 'item',
      render: (text: string) => (
        <Space>
           <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
             <FileProtectOutlined className="text-sm" />
           </div>
           <Text strong className="text-gray-800">{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Target Asset',
      dataIndex: 'asset',
      key: 'asset',
      render: (text: string) => <Text className="text-[13px] font-medium text-gray-500">{text}</Text>,
    },
    {
      title: 'Expiry Timeline',
      dataIndex: 'expiry',
      key: 'expiry',
      render: (date: string) => (
        <Space size={4}>
          <CalendarOutlined className="text-gray-400 text-[10px]" />
          <Text className="text-[12px] font-bold text-gray-700">{date}</Text>
        </Space>
      ),
    },
    {
      title: 'Audit Result',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'success';
        let icon = <CheckCircleOutlined />;
        if (status === 'EXPIRING_SOON') { color = 'warning'; icon = <WarningOutlined />; }
        if (status === 'EXPIRED') { color = 'error'; icon = <WarningOutlined />; }

        return (
          <Tag 
            className="border-none px-3 py-1 rounded-full font-black text-[10px] tracking-widest flex items-center gap-1.5 w-fit"
            color={color}
          >
            {icon}
            {status}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <Title level={2} className="!mb-1 !font-black tracking-tight text-gray-800">Compliance & Audits</Title>
          <Text type="secondary" className="font-medium">Regulatory tracking, insurance renewals, and safety inspections</Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<VerifiedOutlined />}
          className="shadow-xl shadow-blue-200 h-11 px-8 rounded-xl font-bold"
        >
          Run Audit
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card title={<Text className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Portfolio Readiness</Text>} bordered={false} className="shadow-2xl shadow-gray-100">
              <div className="flex flex-col items-center py-6">
                <Progress 
                  type="dashboard" 
                  percent={84} 
                  strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} 
                  strokeWidth={10}
                  size={200}
                />
                <Text className="mt-4 font-bold text-gray-400 uppercase tracking-tighter">Operational Compliance</Text>
              </div>
              <div className="space-y-4 mt-4">
                <div className="flex justify-between items-center p-3 rounded-xl bg-green-50/50">
                  <Text className="text-xs font-bold text-green-700">Fully Valid</Text>
                  <Tag className="border-none bg-green-200 text-green-800 font-black rounded-lg">12 Assets</Tag>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-orange-50/50">
                  <Text className="text-xs font-bold text-orange-700">Attention Required</Text>
                  <Tag className="border-none bg-orange-200 text-orange-800 font-black rounded-lg">2 Assets</Tag>
                </div>
              </div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} lg={16}>
           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card title={<Text className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Critical Alerts</Text>} bordered={false} className="shadow-2xl shadow-gray-100">
              <Table 
                columns={columns} 
                dataSource={complianceItems} 
                pagination={false}
                className="ant-table-premium"
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default Compliance;
