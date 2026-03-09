import React from 'react';
import { Typography, Card, Row, Col, Tag, Button, Space, Input, Table } from 'antd';
import { CopyOutlined, SyncOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const IntegrationsPage: React.FC = () => {
  const apiEndpoints = [
    { method: 'POST', path: '/loan/apply', description: 'Submit a new loan application' },
    { method: 'GET', path: '/loan/status/:id', description: 'Get loan application status' },
    { method: 'POST', path: '/loan/disburse', description: 'Trigger fund disbursement' },
    { method: 'GET', path: '/products', description: 'List all provider products' },
    { method: 'POST', path: '/webhook/register', description: 'Register a webhook endpoint' },
  ];

  const columns = [
    { title: 'Method', dataIndex: 'method', render: (m: string) => <Tag color={m === 'POST' ? 'blue' : 'green'}>{m}</Tag> },
    { title: 'Endpoint', dataIndex: 'path', render: (p: string) => <Text code>{p}</Text> },
    { title: 'Description', dataIndex: 'description' },
  ];

  return (
    <div style={{ padding: '24px 0' }}>
      <Title level={4}>API & Integrations</Title>
      <Text type="secondary">Connect your systems to DashDrive's embedded finance APIs.</Text>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="API Key" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input.Password value="sk_live_xyzbank_a1b2c3d4e5f6g7h8" readOnly />
              <Button icon={<CopyOutlined />} block>Copy API Key</Button>
              <Button icon={<SyncOutlined />} block type="dashed">Regenerate Key</Button>
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Webhook Endpoint" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input value="https://api.xyzbank.com/dashdrive/webhook" readOnly />
              <Tag color="green">Active</Tag>
              <Text type="secondary">Last triggered: 2 hours ago</Text>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card title="Available API Endpoints" bordered={false} style={{ marginTop: 24 }}>
        <Table columns={columns} dataSource={apiEndpoints} rowKey="path" pagination={false} />
      </Card>
    </div>
  );
};
