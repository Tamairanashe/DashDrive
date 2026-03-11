import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Typography, Modal, Form, Input, InputNumber, Space, Tag, message, Row, Col } from 'antd';
import { PlusOutlined, BankOutlined, EditOutlined } from '@ant-design/icons';
import { adminApi } from '../../api/adminApi';

const { Title } = Typography;

export const LoanProductManagement: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      setIsModalVisible(false);
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
          <Title level={3}><BankOutlined /> Loan Product Management</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Create Global Loan Product
          </Button>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Table 
          columns={columns} 
          dataSource={products} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Create New Loan Product"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Daily Driver Loan" />
          </Form.Item>
          <Form.Item name="interest_rate" label="Interest Rate (%)" rules={[{ required: true }]}>
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="max_amount" label="Maximum Loan Amount ($)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="repayment_period_days" label="Repayment Period (Days)" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
