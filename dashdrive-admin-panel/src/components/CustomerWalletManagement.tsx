import React, { useState, useEffect } from 'react';
import { 
  Typography, Row, Col, Card, Table, Button, Tag, Space, 
  Form, Input, Select, Badge, Drawer, InputNumber, message,
  DatePicker, Divider, Statistic, Tooltip, notification,
  Alert
} from 'antd';
import { 
  WalletOutlined, PlusOutlined, SearchOutlined, 
  HistoryOutlined, UserOutlined, ArrowUpOutlined,
  ArrowDownOutlined, FilterOutlined, DownloadOutlined,
  InfoCircleOutlined, CopyOutlined, CheckCircleOutlined,
  SyncOutlined, ReloadOutlined, WarningOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Mock Customers
const mockCustomers = [
  { id: 'USR-8001', name: 'Sarah Jenkins', phone: '+1 555-1234' },
  { id: 'USR-8002', name: 'Michael Chen', phone: '+1 555-5678' },
  { id: 'USR-8003', name: 'James Phiri', phone: '+263 772-111' },
  { id: 'USR-8004', name: 'Elena Zhou', phone: '+1 555-9999' },
];

// Mock Transactions
const initialTransactions = [
  { 
    id: 'TXN-99812A', 
    customerName: 'Sarah Jenkins', 
    customerPhone: '+1 555-1234', 
    reference: 'Level-up bonus (Diamond)', 
    date: '2026-03-18 10:45:22', 
    debit: 0, 
    credit: 25.00, 
    balance: 145.50, 
    bonus: 25.00 
  },
  { 
    id: 'TXN-99811B', 
    customerName: 'Michael Chen', 
    customerPhone: '+1 555-5678', 
    reference: 'Ride Payment #R-1002', 
    date: '2026-03-17 16:30:10', 
    debit: 12.50, 
    credit: 0, 
    balance: 2.50, 
    bonus: 0 
  },
  { 
    id: 'TXN-99810C', 
    customerName: 'James Phiri', 
    customerPhone: '+263 772-111', 
    reference: 'Manual Adjustment (Support Hub)', 
    date: '2026-03-17 09:12:45', 
    debit: 0, 
    credit: 50.00, 
    balance: 50.00, 
    bonus: 0 
  },
];

export const CustomerWalletManagement: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState(initialTransactions);
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const handleAddFund = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      const customer = mockCustomers.find(c => c.id === values.customerId);
      const newTransaction = {
        id: `TXN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        customerName: customer?.name || 'Unknown',
        customerPhone: customer?.phone || 'Unknown',
        reference: values.reference,
        date: new Date().toISOString().replace('T', ' ').substr(0, 19),
        debit: 0,
        credit: values.amount,
        balance: (transactions[0]?.balance || 0) + values.amount,
        bonus: 0
      };

      setTransactions([newTransaction, ...transactions]);
      setFilteredTransactions([newTransaction, ...transactions]);
      setDrawerVisible(false);
      form.resetFields();
      
      notification.success({
          message: 'Funds Credited Successfully',
          description: `An amount of $${values.amount} has been added to ${customer?.name}'s wallet. Reference: ${values.reference}`,
          placement: 'topRight'
      });
      setLoading(false);
    }, 1200);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    message.loading({ content: 'Syncing financial ledger...', key: 'sync' });
    setTimeout(() => {
      setRefreshing(false);
      message.success({ content: 'Wallet data up to date!', key: 'sync' });
    }, 1000);
  };

  const handleFilter = (values: any) => {
    let filtered = [...transactions];
    if (values.customerId) {
      const customer = mockCustomers.find(c => c.id === values.customerId);
      filtered = filtered.filter(t => t.customerName === customer?.name);
    }
    if (values.transactionId) {
      filtered = filtered.filter(t => t.id.includes(values.transactionId.toUpperCase()));
    }
    setFilteredTransactions(filtered);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Transaction ID copied');
  };

  const columns = [
    { 
        title: 'Customer Detail', 
        key: 'customer',
        render: (_: any, record: any) => (
            <div>
                <Text strong style={{ display: 'block' }}>{record.customerName}</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>{record.customerPhone}</Text>
            </div>
        )
    },
    { 
        title: 'Transaction Identity', 
        dataIndex: 'id', 
        key: 'id', 
        render: (id: string) => (
            <Space size={4}>
                <Text code style={{ fontSize: 11 }}>{id}</Text>
                <Tooltip title="Copy TXN ID">
                    <Button type="text" size="small" icon={<CopyOutlined style={{ fontSize: 10 }} />} onClick={() => copyToClipboard(id)} />
                </Tooltip>
            </Space>
        )
    },
    { title: 'Log Date', dataIndex: 'date', key: 'date', render: (d: string) => <Text style={{ fontSize: 12 }}>{d}</Text> },
    { 
        title: 'Type / Reference', 
        dataIndex: 'reference', 
        key: 'reference',
        render: (ref: string) => (
            <Tooltip title={ref}>
                <Text ellipsis style={{ maxWidth: 150, fontSize: 12 }}>{ref}</Text>
            </Tooltip>
        )
    },
    { 
      title: 'Debit (-)', 
      dataIndex: 'debit', 
      key: 'debit', 
      render: (val: number) => <Text type={val > 0 ? "danger" : "secondary"} strong={val > 0}>$ {val.toFixed(2)}</Text> 
    },
    { 
      title: 'Credit (+)', 
      dataIndex: 'credit', 
      key: 'credit', 
      render: (val: number) => <Text type={val > 0 ? "success" : "secondary"} strong={val > 0}>$ {val.toFixed(2)}</Text> 
    },
    { 
      title: 'Final Balance', 
      dataIndex: 'balance', 
      key: 'balance', 
      render: (val: number) => <Text strong style={{ color: '#0f172a' }}>$ {val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text> 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Financial Health Overview */}
      <Row gutter={[24, 24]}>
        {[
            { title: 'Total User Deposits', value: 8450200, icon: <WalletOutlined />, color: '#1d4ed8', info: 'Sum of all active wallet balances across the platform.' },
            { title: 'Month to Date Top-ups', value: 1400000, icon: <ArrowUpOutlined />, color: '#059669', info: 'Total funds added by users manually or via promos this month.' },
            { title: 'System Refunds', value: 12400, icon: <HistoryOutlined />, color: '#d97706', info: 'Pending and completed refunds processed by support.' },
            { title: 'Avg. Wallet Retention', value: 142.50, icon: <UserOutlined />, color: '#4f46e5', info: 'Average balance held by an active user.' },
        ].map((stat, i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
                <Card variant="borderless" className="shadow-sm" style={{ borderLeft: `4px solid ${stat.color}` }}>
                    <Statistic 
                        title={
                            <Space size="small">
                                <Text strong style={{ color: stat.color }}>{stat.title}</Text>
                                <Tooltip title={stat.info}><InfoCircleOutlined style={{ fontSize: 12, color: '#ccd5e1' }} /></Tooltip>
                            </Space>
                        } 
                        value={stat.value} 
                        prefix={stat.icon} 
                        precision={2}
                        valueStyle={{ fontWeight: 800, fontSize: 24 }}
                    />
                </Card>
            </Col>
        ))}
      </Row>

      {/* Main Ledger Section */}
      <Card 
        variant="borderless" 
        className="shadow-md rounded-2xl overflow-hidden"
        title={
            <div>
                 <Title level={4} style={{ margin: 0 }}>Wallet Transaction Ledger</Title>
                 <Text type="secondary" style={{ fontSize: 13 }}>Audit-ready record of all financial movements within customer wallets.</Text>
            </div>
        }
        extra={
          <Space>
            <Button icon={<HistoryOutlined />} onClick={() => navigate('/financial-reports/hub')}>Full Financial Logs</Button>
            <Button icon={<SyncOutlined spin={refreshing} />} onClick={handleRefresh} />
            <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => setDrawerVisible(true)}
                className="rounded-lg font-bold"
            >
                Manual Credit
            </Button>
          </Space>
        }
      >
        {/* Advanced Filters */}
        <Form 
          form={filterForm} 
          layout="vertical" 
          onValuesChange={handleFilter}
          className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100"
        >
          <Row gutter={16} align="bottom">
              <Col span={6}>
                <Form.Item name="customerId" label="Filter by Customer" style={{ marginBottom: 0 }}>
                    <Select placeholder="All Customers" showSearch allowClear style={{ width: '100%' }}>
                    {mockCustomers.map(c => <Option key={c.id} value={c.id}>{c.name} ({c.id})</Option>)}
                    </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="dateRange" label="Date Period" style={{ marginBottom: 0 }}>
                    <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="transactionId" label="Search Transaction ID" style={{ marginBottom: 0 }}>
                    <Input prefix={<SearchOutlined />} placeholder="Ex: TXN-12345" />
                </Form.Item>
              </Col>
              <Col span={6}>
                  <Space>
                    <Tooltip title="Reset Filters">
                        <Button icon={<ReloadOutlined />} onClick={() => { filterForm.resetFields(); setFilteredTransactions(transactions); }} />
                    </Tooltip>
                    <Button type="dashed" icon={<DownloadOutlined />}>Export Ledger</Button>
                  </Space>
              </Col>
          </Row>
        </Form>

        <Table 
          columns={columns} 
          dataSource={filteredTransactions} 
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showTotal: (total) => <Text type="secondary" style={{ fontSize: 12 }}>Total {total} transactions recorded</Text>
          }}
          className="wallet-table"
        />
      </Card>

      {/* Manual Credit Drawer */}
      <Drawer
        title={<span className="font-black text-xl flex items-center gap-2"><PlusOutlined /> Manual Wallet Credit</span>}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={440}
        extra={
          <Space>
            <Button onClick={() => setDrawerVisible(false)}>Cancel</Button>
            <Button type="primary" onClick={() => form.submit()} loading={loading}>Apply Credit</Button>
          </Space>
        }
        destroyOnClose
      >
        <div style={{ marginBottom: 24 }}>
            <Alert
                message="Administrative Override"
                description="Manual adjustments bypass standard payment gateways. Use only for support resolutions, missing rewards, or authorized cash-ins."
                type="info"
                showIcon
            />
        </div>

        <Form form={form} layout="vertical" onFinish={handleAddFund}>
          <Form.Item name="customerId" label="Target Customer Account" rules={[{ required: true, message: 'Select a destination account.' }]}>
            <Select 
              showSearch 
              placeholder="Search by name or ID..."
              optionFilterProp="children"
            >
              {mockCustomers.map(c => <Option key={c.id} value={c.id}>{c.name} ({c.id})</Option>)}
            </Select>
          </Form.Item>
          
          <Form.Item name="amount" label="Credit Amount ($)" rules={[{ required: true, message: 'Enter a valid amount.' }]}>
            <InputNumber 
              className="w-full h-12 flex items-center text-lg font-bold" 
              prefix="$" 
              min={1} 
              placeholder="0.00"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item 
            name="reference" 
            label="Required: Reference Insight / Reason" 
            rules={[{ required: true, message: 'Provide a reason for this adjustment for audit purposes.' }]}
          >
            <Input.TextArea 
                rows={4} 
                maxLength={200} 
                showCount 
                placeholder="Ex: Loyalty reward correction for ride ID #R-2021..." 
            />
          </Form.Item>

          <Divider />
          <Text type="secondary" style={{ fontSize: 12 }}>
              <WarningOutlined style={{ marginRight: 4 }} />
              This action is permanent and will be logged under your administrator ID.
          </Text>
        </Form>
      </Drawer>
    </div>
  );
};
