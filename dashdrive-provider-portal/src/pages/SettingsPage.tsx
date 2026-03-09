import React from 'react';
import { Typography, Card, Row, Col, Form, Input, Button, Table, Tag, Space, Divider } from 'antd';
import { SaveOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const SettingsPage: React.FC = () => {
  const teamMembers = [
    { name: 'Admin User', email: 'admin@xyzbank.com', role: 'Admin', status: 'Active' },
    { name: 'Jane Doe', email: 'jane@xyzbank.com', role: 'Loan Officer', status: 'Active' },
    { name: 'Peter Smith', email: 'peter@xyzbank.com', role: 'Analyst', status: 'Active' },
    { name: 'Support Bot', email: 'support@xyzbank.com', role: 'Support', status: 'Inactive' },
  ];

  const roleColors: Record<string, string> = { 'Admin': 'red', 'Loan Officer': 'blue', 'Analyst': 'purple', 'Support': 'default' };

  const teamColumns = [
    { title: 'Name', dataIndex: 'name', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Role', dataIndex: 'role', render: (r: string) => <Tag color={roleColors[r]}>{r}</Tag> },
    { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={s === 'Active' ? 'green' : 'default'}>{s}</Tag> },
  ];

  return (
    <div style={{ padding: '24px 0' }}>
      <Title level={4}>Provider Settings</Title>

      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card title="Company Profile" bordered={false}>
            <Form layout="vertical">
              <Form.Item label="Company Name"><Input defaultValue="XYZ Bank Ltd." /></Form.Item>
              <Form.Item label="Contact Email"><Input defaultValue="partners@xyzbank.com" /></Form.Item>
              <Form.Item label="Phone"><Input defaultValue="+263 4 123 4567" /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />}>Save Changes</Button>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Commission Agreement" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div><Text type="secondary">Referral Fee:</Text> <Text strong>$5 per approved application</Text></div>
              <div><Text type="secondary">Transaction Fee:</Text> <Text strong>2.5% of disbursed amount</Text></div>
              <div><Text type="secondary">Settlement Cycle:</Text> <Text strong>Monthly, NET 30</Text></div>
              <Divider />
              <div><Text type="secondary">Contract Status:</Text> <Tag color="green">Active</Tag></div>
              <div><Text type="secondary">Renewal Date:</Text> <Text>2027-01-15</Text></div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card title="Authorized Users" bordered={false} style={{ marginTop: 24 }}>
        <Table columns={teamColumns} dataSource={teamMembers} rowKey="email" pagination={false} />
      </Card>

      <Card title="Security Settings" bordered={false} style={{ marginTop: 24 }}>
        <Form layout="vertical" style={{ maxWidth: 400 }}>
          <Form.Item label="Two-Factor Authentication">
            <Button type="primary" ghost icon={<LockOutlined />}>Enable 2FA</Button>
          </Form.Item>
          <Form.Item label="Session Timeout">
            <Input defaultValue="30 minutes" />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
