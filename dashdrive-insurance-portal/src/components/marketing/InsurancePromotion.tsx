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
  SafetyOutlined, 
  SendOutlined,
  CheckCircleOutlined,
  HistoryOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export function InsurancePromotion() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissions, setSubmissions] = useState([
    { id: 'IP-001', product: 'Passenger Travel Cover', message: 'Protect your riders with $1 coverage per trip.', target: 'All Riders', status: 'Approved', date: '2026-03-04' },
    { id: 'IP-002', product: 'Comprehensive Driver Cover', message: 'Exclusive insurance for Diamond tier drivers.', target: 'Diamond Drivers', status: 'Pending', date: '2026-03-09' },
  ]);

  const handleSubmit = (values: any) => {
    const newSub = {
      id: `IP-00${submissions.length + 1}`,
      product: values.product,
      message: values.message,
      target: values.target,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    setSubmissions([newSub, ...submissions]);
    message.success('Insurance promotion submitted for DashDrive approval');
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={4}>DashDrive Growth Engine Integration</Title>
          <Text type="secondary">Promote insurance coverage to the entire DashDrive fleet and rider base.</Text>
        </Col>
        <Col>
          <Button type="primary" icon={<ThunderboltOutlined />} onClick={() => setIsModalOpen(true)}>
            Submit Growth Campaign
          </Button>
        </Col>
      </Row>

      <Alert 
        message="Insurance Growth Center"
        description="Submit your insurance products to be featured in the DashDrive Super App. Once approved, campaigns appear in the 'Promotions' section of Driver and Rider apps."
        type="info"
        showIcon
      />

      <Card title={<span><HistoryOutlined /> Submission History</span>} bordered={false}>
        <Table 
          dataSource={submissions} 
          rowKey="id"
          pagination={false}
          columns={[
            { title: 'Promo ID', dataIndex: 'id' },
            { title: 'Product', dataIndex: 'product', render: (t) => <Text strong>{t}</Text> },
            { title: 'Message', dataIndex: 'message', ellipsis: true },
            { title: 'Target Group', dataIndex: 'target', render: (t) => <Tag color="blue">{t}</Tag> },
            { title: 'Status', dataIndex: 'status', render: (s) => (
               <Tag color={s === 'Approved' ? 'success' : 'orange'}>
                 {s === 'Approved' ? <CheckCircleOutlined /> : <RocketOutlined />} {s}
               </Tag>
            )},
            { title: 'Date', dataIndex: 'date' },
          ]}
        />
      </Card>

      <Modal 
        title="Promote Insurance Product" 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="product" label="Insurance Product" rules={[{ required: true }]}>
            <Select placeholder="Select a coverage product">
              <Select.Option value="Passenger Travel Cover">Passenger Travel Cover</Select.Option>
              <Select.Option value="Comprehensive Driver Cover">Comprehensive Driver Cover</Select.Option>
              <Select.Option value="Personal Accident Protection">Personal Accident Protection</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="message" label="App Notification Message" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="e.g. Protect your riders with $1 coverage per trip." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="target" label="Target Audience" rules={[{ required: true }]}>
                <Select placeholder="Select Audience">
                  <Select.Option value="All Drivers">All Drivers</Select.Option>
                  <Select.Option value="Platinum Drivers">Platinum Drivers</Select.Option>
                  <Select.Option value="All Riders">All Riders</Select.Option>
                  <Select.Option value="VIP Riders">VIP Riders</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="city" label="Geographic Targeting" rules={[{ required: true }]}>
                <Select mode="multiple" placeholder="Select Areas">
                  <Select.Option value="All Regions">Whole Country</Select.Option>
                  <Select.Option value="Harare">Harare</Select.Option>
                  <Select.Option value="Bulawayo">Bulawayo</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Alert 
            message="Settlement Policy"
            description="Campaign fees will be billed based on impressions and successful coverage signups."
            type="info"
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
