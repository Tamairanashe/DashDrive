import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Typography, Drawer, Form, Input, InputNumber, Space, Tag, message, Row, Col } from 'antd';
import { PlusOutlined, BankOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { adminApi } from '../../api/adminApi';

const { Title } = Typography;

export const LoanProductManagement: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await adminApi.fintech.loans.listProducts();
      setProducts(res.data || []);
    } catch (err) {
      message.error('Failed to fetch loan products');
      // Mock data for UI development if API is not fully ready
      setProducts([
        { id: '1', name: 'Driver Fuel Loan', interest_rate: 5.0, max_amount: 500, status: 'active' },
        { id: '2', name: 'Merchant Expansion Loan', interest_rate: 8.5, max_amount: 5000, status: 'active' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      await adminApi.fintech.loans.createProduct(values);
      message.success('Loan product created successfully');
      setIsDrawerVisible(false);
      form.resetFields();
      fetchProducts();
    } catch (err) {
      message.error('Failed to create loan product');
    }
  };

  const columns = [
    { title: 'Product Name', dataIndex: 'name', key: 'name' },
    { title: 'Interest Rate (%)', dataIndex: 'interest_rate', key: 'interest_rate', render: (rate: number) => `${rate}%` },
    { title: 'Max Amount ($)', dataIndex: 'max_amount', key: 'max_amount', render: (amt: number) => `$${amt.toLocaleString()}` },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>{status.toUpperCase()}</Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small">Edit</Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}><BankOutlined /> Loan Product Management</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsDrawerVisible(true)} style={{ background: '#0e172a' }}>
            Create Global Loan Product
          </Button>
        </Col>
      </Row>

      <Card style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <Table 
          columns={columns} 
          dataSource={products} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Drawer
        title={<Space><BankOutlined /> Create New Loan Product</Space>}
        open={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        width={500}
        extra={
          <Space>
            <Button onClick={() => setIsDrawerVisible(false)}>Cancel</Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={() => form.submit()} style={{ background: '#0e172a' }}>
              Create Product
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} style={{ marginTop: 20 }}>
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Daily Driver Loan" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="interest_rate" label="Interest Rate (%)" rules={[{ required: true }]}>
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="max_amount" label="Max Amount ($)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="repayment_period_days" label="Repayment Period (Days)" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};
