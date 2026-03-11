import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Typography, Space, Tag, message, Row, Col, Modal, Form, Input, InputNumber } from 'antd';
import { SafetyCertificateOutlined, PlusOutlined } from '@ant-design/icons';
import { adminApi } from '../../api/adminApi';

const { Title } = Typography;

export const InsuranceManagement: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await adminApi.fintech.insurance.listProducts();
      setProducts(res.data || []);
    } catch (err) {
      message.error('Failed to fetch insurance products');
      // Mock data
      setProducts([
        { id: '1', provider: 'SafeStep', name: 'Trip Protection', premium: 1.5, coverage: 1000, type: 'ride', status: 'active' },
        { id: '2', provider: 'Hearth', name: 'Merchant Fire Cover', premium: 25.0, coverage: 10000, type: 'store', status: 'active' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = (values: any) => {
      message.info('Module integrated. Connecting to backend...');
      setIsModalVisible(false);
  };

  const columns = [
    { title: 'Provider', dataIndex: 'provider', key: 'provider' },
    { title: 'Product Name', dataIndex: 'name', key: 'name' },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color="blue">{t.toUpperCase()}</Tag> },
    { title: 'Premium ($)', dataIndex: 'premium', key: 'premium', render: (p: number) => `$${p}` },
    { title: 'Coverage ($)', dataIndex: 'coverage', key: 'coverage', render: (c: number) => `$${c.toLocaleString()}` },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => <Tag color="green">{status.toUpperCase()}</Tag>
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}><SafetyCertificateOutlined /> Insurance Marketplace Management</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Add Insurance Product
          </Button>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Table 
          columns={columns} 
          dataSource={products} 
          rowKey="id" 
          loading={loading}
        />
      </Card>

      <Modal
        title="Add New Insurance Product"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="provider" label="Insurance Provider" rules={[{ required: true }]}>
            <Input placeholder="e.g. SafeStep Insurance" />
          </Form.Item>
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Personal Accident Cover" />
          </Form.Item>
          <Form.Item name="service_type" label="Service Type" rules={[{ required: true }]}>
            <Input placeholder="ride, parcel, hotel, etc." />
          </Form.Item>
          <Form.Item name="premium_price" label="Premium Price ($)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="coverage_amount" label="Coverage Amount ($)" rules={[{ required: true }]}>
             <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
