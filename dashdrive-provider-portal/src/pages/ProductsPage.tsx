import React, { useState, useMemo } from 'react';
import { Typography, Row, Col, Table, Tag, Badge, Button, Space, Modal, Form, Input, InputNumber, Select, Card, Statistic } from 'antd';
import { PlusOutlined, SearchOutlined, ShopOutlined, CheckCircleOutlined, PauseCircleOutlined, StopOutlined, PercentageOutlined, FileSearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface LoanProduct {
  id: string;
  name: string;
  amountMin: number;
  amountMax: number;
  interestRate: number;
  duration: string;
  eligibleUsers: string;
  eligibilityRequirements: string;
  regions: string[];
  activeLoans: number;
  status: string;
}

export const ProductsPage: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form] = Form.useForm();
  
  // Search & Filter State
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [eligibilityFilter, setEligibilityFilter] = useState<string | null>(null);

  const [products, setProducts] = useState<LoanProduct[]>([
    { id: 'LP-001', name: 'Driver Vehicle Loan', amountMin: 1000, amountMax: 8000, interestRate: 9, duration: '24 months', eligibleUsers: 'Drivers', eligibilityRequirements: 'Min 6 months on platform. Tier Gold+. Rating 4.5+.', regions: ['Harare', 'Bulawayo'], activeLoans: 120, status: 'Active' },
    { id: 'LP-002', name: 'Driver Fuel Credit', amountMin: 50, amountMax: 500, interestRate: 5, duration: '1 month', eligibleUsers: 'Drivers', eligibilityRequirements: 'Min 3 months active. 20+ trips/week.', regions: ['All'], activeLoans: 340, status: 'Active' },
    { id: 'LP-003', name: 'Driver Microloan', amountMin: 100, amountMax: 2000, interestRate: 12, duration: '6 months', eligibleUsers: 'Drivers', eligibilityRequirements: 'Active account. Min credit score 60.', regions: ['All'], activeLoans: 210, status: 'Active' },
    { id: 'LP-004', name: 'Customer Personal Loan', amountMin: 200, amountMax: 5000, interestRate: 15, duration: '12 months', eligibleUsers: 'Riders', eligibilityRequirements: 'Min 50 completed trips. Verified ID.', regions: ['Harare'], activeLoans: 85, status: 'Paused' },
    { id: 'LP-005', name: 'Repair Financing', amountMin: 300, amountMax: 3000, interestRate: 8, duration: '6 months', eligibleUsers: 'Drivers', eligibilityRequirements: 'Vehicle registered. Min Tier Standard.', regions: ['Harare', 'Bulawayo', 'Mutare'], activeLoans: 0, status: 'Disabled' },
  ]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = statusFilter ? p.status === statusFilter : true;
      const matchEligibility = eligibilityFilter ? p.eligibleUsers.includes(eligibilityFilter) : true;
      return matchSearch && matchStatus && matchEligibility;
    });
  }, [products, searchText, statusFilter, eligibilityFilter]);

  const stats = useMemo(() => {
    return {
      total: products.length,
      active: products.filter(p => p.status === 'Active').length,
      totalLoans: products.reduce((s, p) => s + p.activeLoans, 0),
      avgInterest: (products.reduce((s, p) => s + p.interestRate, 0) / products.length).toFixed(1)
    };
  }, [products]);

  const statusBadge = (s: string): any => s === 'Active' ? 'success' : s === 'Paused' ? 'warning' : 'error';

  const columns = [
    { title: 'Product Name', dataIndex: 'name', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Amount Range', render: (_: any, r: LoanProduct) => `$${r.amountMin.toLocaleString()} – $${r.amountMax.toLocaleString()}` },
    { title: 'Interest', dataIndex: 'interestRate', render: (v: number) => <Tag color="blue">{v}%</Tag> },
    { title: 'Duration', dataIndex: 'duration' },
    { title: 'Eligible', dataIndex: 'eligibleUsers', render: (t: string) => <Tag color="cyan">{t}</Tag> },
    { title: 'Active Loans', dataIndex: 'activeLoans', sorter: (a: any, b: any) => a.activeLoans - b.activeLoans, render: (v: number) => v.toLocaleString() },
    { title: 'Status', dataIndex: 'status', render: (s: string) => <Badge status={statusBadge(s)} text={s} /> },
    {
      title: 'Actions',
      render: (_: any, record: LoanProduct) => (
        <Space>
          <Button size="small" type="primary" ghost>View</Button>
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
          <Title level={4} style={{ margin: 0 }}>Loan Products</Title>
          <Text type="secondary">Enterprise-grade credit product management for DashDrive.</Text>
        </Col>
        <Col><Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setIsCreateOpen(true)}>Create Product</Button></Col>
      </Row>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false} style={{ borderBottom: '3px solid #1890ff' }}>
            <Statistic title="Total Products" value={stats.total} prefix={<ShopOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ borderBottom: '3px solid #52c41a' }}>
            <Statistic title="Active Products" value={stats.active} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ borderBottom: '3px solid #722ed1' }}>
            <Statistic title="Active Loans" value={stats.totalLoans} prefix={<PercentageOutlined />} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ borderBottom: '3px solid #faad14' }}>
            <Statistic title="Avg Interest" value={stats.avgInterest} suffix="%" prefix={<FileSearchOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* Search & Filter Bar */}
      <Card bordered={false} bodyStyle={{ padding: '16px 24px' }} style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Input 
              placeholder="Search product name..." 
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={5}>
            <Select 
              placeholder="Filter by Status" 
              style={{ width: '100%' }} 
              allowClear 
              onChange={v => setStatusFilter(v)}
              options={[
                { value: 'Active', label: <Space><CheckCircleOutlined style={{ color: '#52c41a' }} /> Active</Space> },
                { value: 'Paused', label: <Space><PauseCircleOutlined style={{ color: '#faad14' }} /> Paused</Space> },
                { value: 'Disabled', label: <Space><StopOutlined style={{ color: '#f5222d' }} /> Disabled</Space> },
              ]}
            />
          </Col>
          <Col span={5}>
            <Select 
              placeholder="Eligible Users" 
              style={{ width: '100%' }} 
              allowClear 
              onChange={v => setEligibilityFilter(v)}
              options={[
                { value: 'Drivers', label: 'Drivers' },
                { value: 'Riders', label: 'Riders' },
                { value: 'Both', label: 'Drivers & Riders' },
              ]}
            />
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Text type="secondary">Showing {filteredProducts.length} of {products.length} products</Text>
          </Col>
        </Row>
      </Card>

      <Table 
        columns={columns} 
        dataSource={filteredProducts} 
        rowKey="id" 
        scroll={{ x: 1100 }} 
        pagination={{ pageSize: 10 }}
      />

      <Modal title="Create Loan Product" open={isCreateOpen} onCancel={() => setIsCreateOpen(false)} onOk={() => form.submit()} okText="Create" width={600}>
        <Form form={form} layout="vertical" onFinish={(values) => {
          const np: LoanProduct = { id: `LP-${String(products.length + 1).padStart(3, '0')}`, ...values, activeLoans: 0, status: 'Active', regions: values.regions || [] };
          setProducts([...products, np]); form.resetFields(); setIsCreateOpen(false);
        }}>
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}><Input placeholder="e.g. Asset Finance Platinum" /></Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="amountMin" label="Min Amount ($)" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="amountMax" label="Max Amount ($)" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="interestRate" label="Interest Rate (%)" rules={[{ required: true }]}><InputNumber min={0} max={100} style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={12}>
              <Form.Item name="duration" label="Loan Duration" rules={[{ required: true }]}>
                <Select options={[{ value: '1 month' }, { value: '3 months' }, { value: '6 months' }, { value: '12 months' }, { value: '24 months' }, { value: '36 months' }]} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="eligibilityRequirements" label="Eligibility Requirements"><Input.TextArea rows={2} placeholder="e.g. Min 6 months on platform. Tier Gold+." /></Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="eligibleUsers" label="Eligible Users" rules={[{ required: true }]}>
                <Select options={[{ value: 'Drivers' }, { value: 'Riders' }, { value: 'Drivers & Riders' }]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="regions" label="Regions Available">
                <Select mode="tags" placeholder="Type to add regions" options={[{ value: 'All' }, { value: 'Harare' }, { value: 'Bulawayo' }, { value: 'Mutare' }]} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

