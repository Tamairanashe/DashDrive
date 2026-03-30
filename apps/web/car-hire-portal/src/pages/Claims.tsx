import React, { useState } from 'react';
import { Card, Row, Col, Typography, Table, Tag, Button, Modal, Form, Input, Upload, Space, Statistic, Divider, Empty } from 'antd';
import { 
  FileProtectOutlined, 
  PlusOutlined, 
  UploadOutlined, 
  SafetyCertificateOutlined, 
  DollarOutlined, 
  ClockCircleOutlined,
  CheckCircleFilled,
  WarningFilled
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Claim {
  key: string;
  claimId: string;
  vehicle: string;
  tripId: string;
  date: string;
  type: 'Mechanical' | 'Interior' | 'Exterior' | 'Accident';
  status: 'Open' | 'Under Review' | 'Paid' | 'Closed';
  amount?: number;
}

const INITIAL_CLAIMS: Claim[] = [
  {
    key: '1',
    claimId: 'CLM-7782',
    vehicle: 'Tesla Model 3',
    tripId: 'TRX-1023',
    date: 'Mar 10, 2026',
    type: 'Exterior',
    status: 'Paid',
    amount: 1250,
  },
  {
    key: '2',
    claimId: 'CLM-8890',
    vehicle: 'BMW X5',
    tripId: 'TRX-1015',
    date: 'Feb 22, 2026',
    type: 'Interior',
    status: 'Under Review',
    amount: 450,
  },
];

export default function Claims() {
  const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const columns = [
    {
      title: 'Claim ID',
      dataIndex: 'claimId',
      key: 'claimId',
      render: (text: string) => <Text className="font-mono text-indigo-600 font-semibold">{text}</Text>,
    },
    {
      title: 'Vehicle',
      dataIndex: 'vehicle',
      key: 'vehicle',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'Accident' ? 'red' : 'blue'}>{type}</Tag>
      ),
    },
    {
      title: 'Date Reported',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Estimated Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount?: number) => amount ? <Text strong>${amount.toLocaleString()}</Text> : <Text type="secondary">TBD</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'Paid') color = 'success';
        if (status === 'Under Review') color = 'warning';
        if (status === 'Open') color = 'processing';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Claim) => (
        <Space>
          <Button type="link" className="p-0">View Details</Button>
          {record.status === 'Open' && <Button type="link" danger className="p-0">Cancel</Button>}
        </Space>
      ),
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-xl">
        <div>
          <Title level={2} className="!mb-0 !font-black text-gray-800 flex items-center">
            <FileProtectOutlined className="mr-3 text-indigo-600" />
            Claims & Protection
          </Title>
          <Text className="text-gray-500">Report vehicle damage, manage invoices, and track claim payouts.</Text>
        </div>
        <Button 
          type="primary" 
          size="large" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalVisible(true)}
          className="bg-indigo-600 hover:bg-indigo-700 h-12 rounded-2xl px-8 shadow-lg shadow-indigo-200"
        >
          Report New Damage
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="rounded-[2rem] border-none shadow-sm bg-indigo-50/50">
            <Statistic 
              title={<span className="text-indigo-600 font-semibold">Self-Insurance Savings</span>}
              value={4250} 
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
            />
            <div className="mt-2 text-xs text-indigo-400">Total recovered from damage reports this year</div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="rounded-[2rem] border-none shadow-sm bg-green-50/50">
            <Statistic 
              title={<span className="text-green-600 font-semibold">Active Claims</span>}
              value={1} 
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#10b981', fontWeight: 'bold' }}
            />
            <div className="mt-2 text-xs text-green-400">1 report currently under review by trust & safety</div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="rounded-[2rem] border-none shadow-sm bg-amber-50/50">
            <Statistic 
              title={<span className="text-amber-600 font-semibold">Safety Compliance</span>}
              value={100} 
              suffix="%" 
              valueStyle={{ color: '#d97706', fontWeight: 'bold' }}
            />
            <div className="mt-2 text-xs text-amber-500">All vehicles meet annual inspection standards</div>
          </Card>
        </Col>
      </Row>

      <Card 
        variant="borderless" 
        className="rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden"
        styles={{ body: { padding: 0 } }}
      >
        <Title level={4} className="p-6 !mb-0 border-b border-gray-50">Recent Damage Incidents</Title>
        <Table 
          columns={columns} 
          dataSource={claims} 
          pagination={false}
          locale={{ emptyText: <Empty description="No damage incidents reported" /> }}
        />
      </Card>

      <Modal
        title={
          <div className="flex items-center text-xl font-bold">
            <WarningFilled className="text-amber-500 mr-2" />
            Report Vehicle Damage
          </div>
        }
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        okText="Submit Report"
        cancelText="Discard"
        className="rounded-3xl"
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)} className="rounded-xl">Cancel</Button>,
          <Button key="submit" type="primary" onClick={() => setIsModalVisible(false)} className="bg-indigo-600 rounded-xl px-6">Submit Claim</Button>
        ]}
      >
        <Form layout="vertical" className="mt-6">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Select Vehicle" required>
                <Input placeholder="Select vehicle from fleet" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Trip ID" required>
                <Input placeholder="e.g. TRX-1023" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Damage Category" required>
            <Space size={[8, 16]} wrap>
              {['Exterior', 'Interior', 'Mechanical', 'Cleanliness', 'Smoking'].map(cat => (
                <Tag.CheckableTag key={cat} checked={false} onChange={() => {}} className="px-4 py-1 rounded-full text-sm border">
                  {cat}
                </Tag.CheckableTag>
              ))}
            </Space>
          </Form.Item>

          <Form.Item label="Describe what happened" required>
            <TextArea rows={4} placeholder="Please provide as much detail as possible about the damage..." />
          </Form.Item>

          <Divider plain>Upload Evidence</Divider>
          
          <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 text-center">
            <Upload listType="picture" multiple>
              <div className="flex flex-col items-center">
                <UploadOutlined className="text-3xl text-indigo-500 mb-2" />
                <Text strong>Click or drag photos of the damage</Text>
                <Text type="secondary" className="text-xs">Take clear photos from multiple angles including pre-trip photos for comparison.</Text>
              </div>
            </Upload>
          </div>

          <Alert 
            className="mt-6 rounded-xl border-amber-200 bg-amber-50"
            message={<span className="font-semibold text-amber-800">Important</span>}
            description={<span className="text-amber-700 text-sm">Damage reports must be filed within 24 hours of the trip ending to be eligible for coverage.</span>}
            type="warning"
            showIcon
          />
        </Form>
      </Modal>

      <Card className="rounded-[2rem] bg-gray-900 text-white border-none p-8">
        <Row align="middle" gutter={32}>
          <Col span={4}>
            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <SafetyCertificateOutlined className="text-3xl text-indigo-400" />
            </div>
          </Col>
          <Col span={14}>
            <Title level={3} className="!text-white !mb-1">Protection Plans</Title>
            <Paragraph className="text-gray-400 !mb-0">
              You're currently on the <strong>60 Plan</strong>. You earn 60% of the trip price, and we cover 100% of eligible damage costs with no deductible.
            </Paragraph>
          </Col>
          <Col span={6} className="text-right">
            <Button鬼 className="border-indigo-500 text-indigo-400 hover:text-indigo-300">Switch Plan</Button鬼>
          </Col>
        </Row>
      </Card>
    </motion.div>
  );
}

function Alert({ className, message, description, type, showIcon }: any) {
  return (
    <div className={`p-4 flex items-start ${className}`}>
      {showIcon && <WarningFilled className="mr-3 text-amber-500 mt-1" />}
      <div>
        {message}
        <div className="mt-1">{description}</div>
      </div>
    </div>
  );
}

function Button鬼({ children, className, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-xl border transition-all hover:bg-white/5 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}
