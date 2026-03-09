import React from 'react';
import { Typography, Table, Tag, Card, Row, Col, Statistic, Steps, Tabs } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Invoice {
  id: string;
  period: string;
  product: string;
  policiesSold: number;
  premiumRevenue: number;
  commissionRate: number;
  commissionAmount: number;
  claimProcessingFees: number;
  referralFees: number;
  totalDue: number;
  status: string;
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
}

export const BillingPage: React.FC = () => {
  const invoices: Invoice[] = [
    { id: 'INV-2026-001', period: 'January 2026', product: 'Driver Accident Insurance', policiesSold: 780, premiumRevenue: 2340, commissionRate: 10, commissionAmount: 234, claimProcessingFees: 24, referralFees: 780, totalDue: 1038, status: 'Paid', issuedDate: '2026-02-01', dueDate: '2026-02-15', paidDate: '2026-02-12' },
    { id: 'INV-2026-002', period: 'January 2026', product: 'Vehicle Damage Insurance', policiesSold: 500, premiumRevenue: 4000, commissionRate: 8, commissionAmount: 320, claimProcessingFees: 12, referralFees: 500, totalDue: 832, status: 'Paid', issuedDate: '2026-02-01', dueDate: '2026-02-15', paidDate: '2026-02-14' },
    { id: 'INV-2026-003', period: 'January 2026', product: 'Trip Protection', policiesSold: 1100, premiumRevenue: 1650, commissionRate: 12, commissionAmount: 198, claimProcessingFees: 8, referralFees: 1100, totalDue: 1306, status: 'Paid', issuedDate: '2026-02-01', dueDate: '2026-02-15', paidDate: '2026-02-15' },
    { id: 'INV-2026-004', period: 'February 2026', product: 'Driver Accident Insurance', policiesSold: 800, premiumRevenue: 2400, commissionRate: 10, commissionAmount: 240, claimProcessingFees: 18, referralFees: 800, totalDue: 1058, status: 'Paid', issuedDate: '2026-03-01', dueDate: '2026-03-15', paidDate: '2026-03-10' },
    { id: 'INV-2026-005', period: 'February 2026', product: 'Vehicle Damage Insurance', policiesSold: 520, premiumRevenue: 4160, commissionRate: 8, commissionAmount: 332.80, claimProcessingFees: 14, referralFees: 520, totalDue: 866.80, status: 'Invoiced', issuedDate: '2026-03-01', dueDate: '2026-03-15' },
    { id: 'INV-2026-006', period: 'February 2026', product: 'Trip Protection', policiesSold: 1200, premiumRevenue: 1800, commissionRate: 12, commissionAmount: 216, claimProcessingFees: 10, referralFees: 1200, totalDue: 1426, status: 'Invoiced', issuedDate: '2026-03-01', dueDate: '2026-03-15' },
    { id: 'INV-2026-007', period: 'February 2026', product: 'Passenger Insurance', policiesSold: 320, premiumRevenue: 640, commissionRate: 10, commissionAmount: 64, claimProcessingFees: 4, referralFees: 320, totalDue: 388, status: 'Overdue', issuedDate: '2026-03-01', dueDate: '2026-03-15' },
    { id: 'INV-2026-008', period: 'March 2026', product: 'Driver Accident Insurance', policiesSold: 0, premiumRevenue: 0, commissionRate: 10, commissionAmount: 0, claimProcessingFees: 0, referralFees: 0, totalDue: 0, status: 'Pending', issuedDate: '', dueDate: '' },
  ];

  const statusColors: Record<string, string> = { Pending: 'gold', Invoiced: 'blue', Paid: 'green', Overdue: 'red' };

  const paidInvoices = invoices.filter(i => i.status === 'Paid');
  const outstandingInvoices = invoices.filter(i => ['Invoiced', 'Overdue', 'Pending'].includes(i.status));
  const totalPaid = paidInvoices.reduce((s, i) => s + i.totalDue, 0);
  const totalOutstanding = outstandingInvoices.reduce((s, i) => s + i.totalDue, 0);
  const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.totalDue, 0);

  const invoiceColumns = [
    { title: 'Invoice ID', dataIndex: 'id', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Period', dataIndex: 'period' },
    { title: 'Product', dataIndex: 'product' },
    { title: 'Policies', dataIndex: 'policiesSold' },
    { title: 'Commission', dataIndex: 'commissionAmount', render: (v: number) => `$${v.toFixed(2)}` },
    { title: 'Processing Fees', dataIndex: 'claimProcessingFees', render: (v: number) => `$${v}` },
    { title: 'Referral Fees', dataIndex: 'referralFees', render: (v: number) => `$${v}` },
    { title: 'Total Due', dataIndex: 'totalDue', render: (v: number) => <Text strong style={{ color: '#722ed1' }}>${v.toFixed(2)}</Text> },
    { title: 'Issued', dataIndex: 'issuedDate', render: (t: string) => t || '-' },
    { title: 'Due', dataIndex: 'dueDate', render: (t: string) => t || '-' },
    { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
  ];

  const paidColumns = [
    ...invoiceColumns.filter(c => c.dataIndex !== 'dueDate'),
    { title: 'Paid Date', dataIndex: 'paidDate', render: (t: string) => t || '-' },
  ];

  // Commission breakdown for the summary table
  const commissionSummary = [
    { product: 'Driver Accident Insurance', policiesSold: 800, premiumRevenue: 2400, commission: 10, dashdriveCommission: 240, cycle: 'Monthly' },
    { product: 'Vehicle Damage Insurance', policiesSold: 520, premiumRevenue: 4160, commission: 8, dashdriveCommission: 332.80, cycle: 'Monthly' },
    { product: 'Trip Protection', policiesSold: 1200, premiumRevenue: 1800, commission: 12, dashdriveCommission: 216, cycle: 'Monthly' },
    { product: 'Passenger Insurance', policiesSold: 320, premiumRevenue: 640, commission: 10, dashdriveCommission: 64, cycle: 'Monthly' },
  ];

  const summaryColumns = [
    { title: 'Insurance Product', dataIndex: 'product', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Policies Sold', dataIndex: 'policiesSold' },
    { title: 'Premium Revenue', dataIndex: 'premiumRevenue', render: (v: number) => `$${v.toLocaleString()}` },
    { title: 'Commission %', dataIndex: 'commission', render: (v: number) => <Tag color="purple">{v}%</Tag> },
    { title: 'DashDrive Commission', dataIndex: 'dashdriveCommission', render: (v: number) => <Text strong style={{ color: '#722ed1' }}>${v.toFixed(2)}</Text> },
    { title: 'Billing Cycle', dataIndex: 'cycle' },
  ];

  return (
    <div>
      <Title level={4}>Billing & Commissions</Title>
      <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>Commission payouts from your insurance operations to DashDrive platform.</Text>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false} style={{ borderLeft: '4px solid #52c41a' }}>
            <Statistic title="Invoices Paid" value={paidInvoices.length} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
            <Text type="secondary" style={{ fontSize: 18, fontWeight: 600 }}>${totalPaid.toFixed(2)}</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ borderLeft: '4px solid #1890ff' }}>
            <Statistic title="Invoices Outstanding" value={outstandingInvoices.length} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#1890ff' }} />
            <Text type="secondary" style={{ fontSize: 18, fontWeight: 600 }}>${totalOutstanding.toFixed(2)}</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ borderLeft: '4px solid #ff4d4f' }}>
            <Statistic title="Overdue Amount" value={totalOverdue} precision={2} prefix={<ExclamationCircleOutlined />} suffix="" valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ borderLeft: '4px solid #722ed1' }}>
            <Statistic title="Total Commission (All Time)" value={totalPaid + totalOutstanding} prefix="$" precision={2} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
      </Row>

      {/* Commission Model */}
      <Card title="Commission Model" bordered={false} style={{ marginBottom: 24 }}>
        <Row gutter={[24, 16]}>
          <Col span={6}>
            <Card size="small" style={{ background: '#f9f0ff', textAlign: 'center' }}>
              <Text type="secondary">Policy Sales Commission</Text>
              <Title level={4} style={{ margin: '8px 0 0', color: '#722ed1' }}>8–12%</Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ background: '#e6f7ff', textAlign: 'center' }}>
              <Text type="secondary">Premium Revenue Share</Text>
              <Title level={4} style={{ margin: '8px 0 0', color: '#1890ff' }}>Variable</Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ background: '#f6ffed', textAlign: 'center' }}>
              <Text type="secondary">Claim Processing Fee</Text>
              <Title level={4} style={{ margin: '8px 0 0', color: '#52c41a' }}>$2/claim</Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ background: '#fffbe6', textAlign: 'center' }}>
              <Text type="secondary">Referral Fee</Text>
              <Title level={4} style={{ margin: '8px 0 0', color: '#faad14' }}>$1/policy</Title>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Commission Payout Workflow */}
      <Card title="Commission Payout Workflow" bordered={false} style={{ marginBottom: 24 }}>
        <Steps
          items={[
            { title: 'Premiums Collected', description: 'From drivers & riders' },
            { title: 'Commission Calculated', description: 'Per product rates' },
            { title: 'Invoice Generated', description: 'Monthly billing cycle' },
            { title: 'Provider Pays DashDrive', description: 'NET 15 settlement' },
          ]}
        />
      </Card>

      {/* Invoice Tabs */}
      <Card bordered={false}>
        <Tabs
          defaultActiveKey="outstanding"
          items={[
            {
              key: 'outstanding',
              label: <span><ClockCircleOutlined /> Invoices Outstanding ({outstandingInvoices.length})</span>,
              children: (
                <div>
                  {outstandingInvoices.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40 }}><Text type="secondary">No outstanding invoices 🎉</Text></div>
                  ) : (
                    <Table columns={invoiceColumns} dataSource={outstandingInvoices} rowKey="id" pagination={false} scroll={{ x: 1200 }} />
                  )}
                </div>
              ),
            },
            {
              key: 'paid',
              label: <span><CheckCircleOutlined /> Invoices Paid ({paidInvoices.length})</span>,
              children: (
                <Table columns={paidColumns} dataSource={paidInvoices} rowKey="id" pagination={false} scroll={{ x: 1200 }} />
              ),
            },
            {
              key: 'summary',
              label: <span><FileTextOutlined /> Commission Summary</span>,
              children: (
                <Table columns={summaryColumns} dataSource={commissionSummary} rowKey="product" pagination={false} scroll={{ x: 900 }} />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};
