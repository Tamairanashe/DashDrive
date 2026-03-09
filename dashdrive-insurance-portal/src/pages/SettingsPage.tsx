import React from 'react';
import { Typography, Card, Row, Col, Form, Input, Button, Table, Tag, Space, Divider } from 'antd';
import { SaveOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const SettingsPage: React.FC = () => {
  const teamMembers = [
    { name: 'Admin User', email: 'admin@globalinsure.com', role: 'Admin', status: 'Active' },
    { name: 'Jane Agent', email: 'jane@globalinsure.com', role: 'Claims Adjuster', status: 'Active' },
    { name: 'Peter Analyst', email: 'peter@globalinsure.com', role: 'Risk Analyst', status: 'Active' },
  ];

  const roleColors: Record<string, string> = { Admin: 'red', 'Claims Adjuster': 'purple', 'Risk Analyst': 'blue' };

  const teamColumns = [
    { title: 'Name', dataIndex: 'name', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Role', dataIndex: 'role', render: (r: string) => <Tag color={roleColors[r]}>{r}</Tag> },
    { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color="green">{s}</Tag> },
  ];

  return (
    <div>
      <Title level={4}>Provider Settings</Title>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card title="Company Profile" bordered={false}>
            <Form layout="vertical">
              <Form.Item label="Company Name"><Input defaultValue="Global Insure Ltd." /></Form.Item>
              <Form.Item label="Contact Email"><Input defaultValue="partners@globalinsure.com" /></Form.Item>
              <Form.Item label="Phone"><Input defaultValue="+263 4 555 6789" /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />} style={{ background: '#722ed1' }}>Save Changes</Button>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Commission Agreement" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div><Text type="secondary">Platform Fee:</Text> <Text strong>3% of premiums collected</Text></div>
              <div><Text type="secondary">Claims Processing Fee:</Text> <Text strong>$2 per claim reviewed</Text></div>
              <div><Text type="secondary">Settlement Cycle:</Text> <Text strong>Monthly, NET 15</Text></div>
              <Divider />
              <div><Text type="secondary">Contract Status:</Text> <Tag color="green">Active</Tag></div>
            </Space>
          </Card>
        </Col>
      </Row>
      <Card title="Authorized Users" bordered={false} style={{ marginTop: 24 }}>
        <Table columns={teamColumns} dataSource={teamMembers} rowKey="email" pagination={false} />
      </Card>
      <Card title="Security Settings" bordered={false} style={{ marginTop: 24 }}>
        <Form layout="vertical" style={{ maxWidth: 400 }}>
          <Form.Item label="Two-Factor Authentication"><Button type="primary" ghost icon={<LockOutlined />}>Enable 2FA</Button></Form.Item>
        </Form>
      </Card>
    </div>
  );
};
