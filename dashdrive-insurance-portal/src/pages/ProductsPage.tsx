import React, { useState } from 'react';
import { Typography, Row, Col, Table, Tag, Badge, Button, Space, Modal, Form, Input, InputNumber, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface InsuranceProduct {
  id: string;
  name: string;
  coverageAmount: number;
  monthlyPremium: number;
  eligibleUsers: string;
  eligibleCountries: string[];
  coverageConditions: string;
  policyDuration: string;
  status: string;
  activePolicies: number;
}

export const ProductsPage: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form] = Form.useForm();

  const [products, setProducts] = useState<InsuranceProduct[]>([
    { id: 'IP-001', name: 'Driver Accident Insurance', coverageAmount: 10000, monthlyPremium: 3, eligibleUsers: 'Drivers', eligibleCountries: ['Zimbabwe', 'South Africa'], coverageConditions: 'Active driving status required. No pre-existing conditions.', policyDuration: '12 months', status: 'Active', activePolicies: 800 },
    { id: 'IP-002', name: 'Vehicle Damage Insurance', coverageAmount: 15000, monthlyPremium: 8, eligibleUsers: 'Drivers', eligibleCountries: ['Zimbabwe'], coverageConditions: 'Vehicle must pass inspection. Max vehicle age: 10 years.', policyDuration: '12 months', status: 'Active', activePolicies: 520 },
    { id: 'IP-003', name: 'Trip Protection', coverageAmount: 5000, monthlyPremium: 1.5, eligibleUsers: 'Drivers & Riders', eligibleCountries: ['All'], coverageConditions: 'Covers incidents during active trips only.', policyDuration: '6 months', status: 'Active', activePolicies: 1200 },
    { id: 'IP-004', name: 'Passenger Insurance', coverageAmount: 8000, monthlyPremium: 2, eligibleUsers: 'Riders', eligibleCountries: ['Zimbabwe'], coverageConditions: 'Valid for passengers during trips.', policyDuration: '12 months', status: 'Paused', activePolicies: 320 },
    { id: 'IP-005', name: 'Health Insurance', coverageAmount: 20000, monthlyPremium: 12, eligibleUsers: 'Drivers', eligibleCountries: ['Zimbabwe', 'South Africa'], coverageConditions: 'Requires health screening. Minimum 6 months on platform.', policyDuration: '12 months', status: 'Disabled', activePolicies: 0 },
  ]);

  const statusBadge = (s: string) => s === 'Active' ? 'success' : s === 'Paused' ? 'warning' : 'error';

  const columns = [
    { title: 'Product Name', dataIndex: 'name', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Coverage', dataIndex: 'coverageAmount', render: (v: number) => `$${v.toLocaleString()}` },
    { title: 'Premium', dataIndex: 'monthlyPremium', render: (v: number) => `$${v}/mo` },
    { title: 'Eligible Users', dataIndex: 'eligibleUsers', render: (t: string) => <Tag color="purple">{t}</Tag> },
    { title: 'Active Policies', dataIndex: 'activePolicies', sorter: (a: any, b: any) => a.activePolicies - b.activePolicies },
    { title: 'Status', dataIndex: 'status', render: (s: string) => <Badge status={statusBadge(s) as any} text={s} /> },
    {
      title: 'Actions',
      render: (_: any, record: InsuranceProduct) => (
        <Space>
          <Button size="small" type="primary" ghost onClick={() => { /* view details */ }}>View</Button>
          {record.status === 'Active' && <Button size="small" onClick={() => setProducts(p => p.map(pr => pr.id === record.id ? { ...pr, status: 'Paused' } : pr))}>Pause</Button>}
          {record.status === 'Paused' && <Button size="small" type="primary" onClick={() => setProducts(p => p.map(pr => pr.id === record.id ? { ...pr, status: 'Active' } : pr))}>Activate</Button>}
          {record.status === 'Disabled' && <Button size="small" type="primary" onClick={() => setProducts(p => p.map(pr => pr.id === record.id ? { ...pr, status: 'Active' } : pr))}>Enable</Button>}
          {record.status !== 'Disabled' && <Button size="small" danger onClick={() => setProducts(p => p.map(pr => pr.id === record.id ? { ...pr, status: 'Disabled' } : pr))}>Disable</Button>}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>Insurance Products</Title>
          <Text type="secondary">Manage insurance policies offered on DashDrive.</Text>
        </Col>
        <Col><Button type="primary" icon={<PlusOutlined />} style={{ background: '#722ed1' }} onClick={() => setIsCreateOpen(true)}>Create Product</Button></Col>
      </Row>
      <Table columns={columns} dataSource={products} rowKey="id" scroll={{ x: 1000 }} />

      <Modal title="Create Insurance Product" open={isCreateOpen} onCancel={() => setIsCreateOpen(false)} onOk={() => form.submit()} okText="Create" width={600}>
        <Form form={form} layout="vertical" onFinish={(values) => {
          const np: InsuranceProduct = { id: `IP-${String(products.length + 1).padStart(3, '0')}`, ...values, status: 'Active', activePolicies: 0, eligibleCountries: values.eligibleCountries || [] };
          setProducts([...products, np]); form.resetFields(); setIsCreateOpen(false);
        }}>
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="coverageAmount" label="Coverage Amount ($)" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="monthlyPremium" label="Monthly Premium ($)" rules={[{ required: true }]}><InputNumber min={0} step={0.5} style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
          <Form.Item name="coverageConditions" label="Coverage Conditions"><TextArea rows={3} placeholder="e.g. Active driving status required. No pre-existing conditions." /></Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="eligibleUsers" label="Eligible Users" rules={[{ required: true }]}>
                <Select options={[{ value: 'Drivers', label: 'Drivers' }, { value: 'Riders', label: 'Riders' }, { value: 'Drivers & Riders', label: 'Drivers & Riders' }]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="policyDuration" label="Policy Duration" rules={[{ required: true }]}>
                <Select options={[{ value: '1 month', label: '1 Month' }, { value: '3 months', label: '3 Months' }, { value: '6 months', label: '6 Months' }, { value: '12 months', label: '12 Months' }]} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="eligibleCountries" label="Eligible Countries">
            <Select mode="tags" placeholder="Type to add countries" options={[{ value: 'Zimbabwe' }, { value: 'South Africa' }, { value: 'All' }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
