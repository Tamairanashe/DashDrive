import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Form, 
  Select, 
  Input, 
  Row, 
  Col, 
  Table, 
  Tag, 
  Space, 
  Modal, 
  message,
  Alert
} from 'antd';
import { 
  ThunderboltOutlined, 
  RocketOutlined, 
  UsergroupAddOutlined, 
  SendOutlined,
  CheckCircleOutlined,
  HistoryOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export function FintechPromotion() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissions, setSubmissions] = useState([
    { id: 'FP-001', product: 'Driver Vehicle Loan', message: 'Get a $5000 vehicle loan with low interest.', target: 'Gold Drivers', status: 'Approved', date: '2026-03-05' },
    { id: 'FP-002', product: 'Driver Fuel Credit', message: 'Boost your trips with instant fuel credit.', target: 'All Drivers', status: 'Pending', date: '2026-03-08' },
  ]);

  const handleSubmit = (values: any) => {
    const newSub = {
      id: `FP-00${submissions.length + 1}`,
      product: values.product,
      message: values.message,
      target: values.target,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    setSubmissions([newSub, ...submissions]);
    message.success('Promotion submitted for Admin approval');
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={4}>DashDrive Growth Engine Integration</Title>
          <Text type="secondary">Submit your products for platform-wide promotion and rewards.</Text>
        </Col>
        <Col>
          <Button type="primary" icon={<ThunderboltOutlined />} onClick={() => setIsModalOpen(true)}>
            New Growth Campaign
          </Button>
        </Col>
      </Row>

      <Alert 
        message="Partner Growth Engine"
        description="Promotions submitted here appear in the Driver and Rider apps once approved by DashDrive Admins. You can target specific tiers and cities."
        type="info"
        showIcon
      />

      <Card title={<span><HistoryOutlined /> Past Submissions</span>} bordered={false}>
        <Table 
          dataSource={submissions} 
          rowKey="id"
          pagination={false}
          columns={[
            { title: 'Promotion ID', dataIndex: 'id' },
            { title: 'Product', dataIndex: 'product', render: (t) => <Text strong>{t}</Text> },
            { title: 'Message', dataIndex: 'message', ellipsis: true },
            { title: 'Target Audience', dataIndex: 'target', render: (t) => <Tag color="blue">{t}</Tag> },
            { title: 'Status', dataIndex: 'status', render: (s) => (
               <Tag color={s === 'Approved' ? 'success' : 'orange'}>
                 {s === 'Approved' ? <CheckCircleOutlined /> : <RocketOutlined />} {s}
               </Tag>
            )},
            { title: 'Submitted', dataIndex: 'date' },
          ]}
        />
      </Card>

      <Modal 
        title="Promote Fintech Product" 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="product" label="Product to Promote" rules={[{ required: true }]}>
            <Select placeholder="Select a loan product">
              <Select.Option value="Driver Vehicle Loan">Driver Vehicle Loan</Select.Option>
              <Select.Option value="Driver Fuel Credit">Driver Fuel Credit</Select.Option>
              <Select.Option value="Repair Financing">Repair Financing</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="message" label="Promotion Message" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="e.g. Get a $5000 vehicle loan with low interest." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="target" label="Target Tier" rules={[{ required: true }]}>
                <Select placeholder="Select Tier">
                  <Select.Option value="All Drivers">All Drivers</Select.Option>
                  <Select.Option value="Gold Drivers">Gold Drivers</Select.Option>
                  <Select.Option value="Platinum Drivers">Platinum Drivers</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="city" label="Target City" rules={[{ required: true }]}>
                <Select mode="multiple" placeholder="Select City">
                  <Select.Option value="Harare">Harare</Select.Option>
                  <Select.Option value="Bulawayo">Bulawayo</Select.Option>
                  <Select.Option value="Mutare">Mutare</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Alert 
            message="Budget Note"
            description="Campaign costs will be added to your next monthly commission invoice."
            type="warning"
            style={{ marginBottom: 24 }}
          />

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />} block>
              Submit for Approval
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
