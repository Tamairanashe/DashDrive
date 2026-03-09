import React from 'react';
import { Typography, Table, Tag, Card, Row, Col, Statistic, Steps, Tabs, Progress, Space, Button, Divider } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, WalletOutlined, DownloadOutlined, LineChartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Invoice {
  id: string;
  period: string;
  product: string;
  loansApproved: number;
  loanVolume: number;
  commissionRate: number;
  commissionAmount: number;
  disbursementFees: number;
  referralFees: number;
  totalDue: number;
  status: string;
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
}

export const BillingPage: React.FC = () => {
  const invoices: Invoice[] = [
    { id: 'INV-2041', period: 'January 2026', product: 'Vehicle Loan', loansApproved: 110, loanVolume: 440000, commissionRate: 3, commissionAmount: 13200, disbursementFees: 550, referralFees: 110, totalDue: 13860, status: 'Paid', issuedDate: '2026-02-01', dueDate: '2026-02-15', paidDate: '2026-02-12' },
    { id: 'INV-2042', period: 'January 2026', product: 'Fuel Credit', loansApproved: 300, loanVolume: 45000, commissionRate: 5, commissionAmount: 2250, disbursementFees: 300, referralFees: 300, totalDue: 2850, status: 'Paid', issuedDate: '2026-02-01', dueDate: '2026-02-15', paidDate: '2026-02-14' },
    { id: 'INV-2043', period: 'January 2026', product: 'Microloan', loansApproved: 180, loanVolume: 180000, commissionRate: 4, commissionAmount: 7200, disbursementFees: 360, referralFees: 180, totalDue: 7740, status: 'Paid', issuedDate: '2026-02-01', dueDate: '2026-02-15', paidDate: '2026-02-15' },
    { id: 'INV-2044', period: 'February 2026', product: 'Vehicle Loan', loansApproved: 120, loanVolume: 480000, commissionRate: 3, commissionAmount: 14400, disbursementFees: 600, referralFees: 120, totalDue: 15120, status: 'Invoiced', issuedDate: '2026-03-01', dueDate: '2026-03-15' },
    { id: 'INV-2045', period: 'February 2026', product: 'Fuel Credit', loansApproved: 340, loanVolume: 51000, commissionRate: 5, commissionAmount: 2550, disbursementFees: 340, referralFees: 340, totalDue: 3230, status: 'Invoiced', issuedDate: '2026-03-01', dueDate: '2026-03-15' },
    { id: 'INV-2046', period: 'February 2026', product: 'Microloan', loansApproved: 210, loanVolume: 210000, commissionRate: 4, commissionAmount: 8400, disbursementFees: 420, referralFees: 210, totalDue: 9030, status: 'Overdue', issuedDate: '2026-03-01', dueDate: '2026-03-15' },
    { id: 'INV-2047', period: 'March 2026', product: 'Vehicle Loan', loansApproved: 0, loanVolume: 0, commissionRate: 3, commissionAmount: 0, disbursementFees: 0, referralFees: 0, totalDue: 0, status: 'Draft', issuedDate: '', dueDate: '' },
  ];

  const statusColors: Record<string, string> = { Draft: 'default', Invoiced: 'blue', Paid: 'green', Overdue: 'red' };

  const paidInvoices = invoices.filter(i => i.status === 'Paid');
  const outstandingInvoices = invoices.filter(i => ['Draft', 'Invoiced', 'Overdue'].includes(i.status));
  const totalPaid = paidInvoices.reduce((s, i) => s + i.totalDue, 0);
  const totalOutstanding = outstandingInvoices.reduce((s, i) => s + i.totalDue, 0);
  const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.totalDue, 0);

  const invoiceColumns = [
    { title: 'Invoice ID', dataIndex: 'id', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Period', dataIndex: 'period' },
    { title: 'Product', dataIndex: 'product' },
    { title: 'Commission', dataIndex: 'commissionAmount', render: (v: number) => `$${v.toLocaleString()}` },
    { title: 'Fees', render: (_: any, r: Invoice) => `$${(r.disbursementFees + r.referralFees).toLocaleString()}` },
    { title: 'Total Due', dataIndex: 'totalDue', render: (v: number) => <Text strong style={{ color: '#1677ff' }}>${v.toLocaleString()}</Text> },
    { title: 'Due Date', dataIndex: 'dueDate', render: (t: string) => t || '-' },
    { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
    { title: 'Actions', render: () => <Button size="small" type="text" icon={<DownloadOutlined />}>CSV</Button> }
  ];

  const commissionSummary = [
    { product: 'Vehicle Loan', commissionPer: '$120/approval', rate: '3%', loansApproved: 120, volume: '$480,000', commission: '$14,400' },
    { product: 'Fuel Credit', commissionPer: '$30/approval', rate: '5%', loansApproved: 340, volume: '$51,000', commission: '$2,550' },
    { product: 'Microloan', commissionPer: '$30/approval', rate: '4%', loansApproved: 210, volume: '$210,000', commission: '$8,400' },
    { product: 'Personal Loan', commissionPer: '$50/approval', rate: '5%', loansApproved: 85, volume: '$127,500', commission: '$6,375' },
  ];

  const summaryColumns = [
    { title: 'Product', dataIndex: 'product', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Per Approval', dataIndex: 'commissionPer' },
    { title: 'Rate', dataIndex: 'rate', render: (t: string) => <Tag color="blue">{t}</Tag> },
    { title: 'Approvals', dataIndex: 'loansApproved' },
    { title: 'DashDrive Revenue', dataIndex: 'commission', render: (t: string) => <Text strong style={{ color: '#1677ff' }}>{t}</Text> },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col><Title level={4}>Billing & Commissions</Title></Col>
        <Col>
          <Space>
            <Button icon={<LineChartOutlined />}>Revenue Report</Button>
            <Button type="primary" icon={<WalletOutlined />}>Automated Settlement Settings</Button>
          </Space>
        </Col>
      </Row>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false} style={{ borderLeft: '4px solid #52c41a' }}>
            <Statistic title="Total Paid to DashDrive" value={totalPaid} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>All-time platform fees</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ borderLeft: '4px solid #1890ff' }}>
            <Statistic title="Outstanding Invoices" value={totalOutstanding} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#1890ff' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>Settlement in progress</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ borderLeft: '4px solid #ff4d4f' }}>
            <Statistic title="Overdue Fees" value={totalOverdue} prefix={<ExclamationCircleOutlined />} valueStyle={{ color: '#ff4d4f' }} />
            <Tag color="red" style={{ marginTop: 4 }}>Attention Required</Tag>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ borderLeft: '4px solid #faad14' }}>
            <Statistic title="Collection Efficiency" value={92} suffix="%" />
            <Progress percent={92} size="small" showInfo={false} strokeColor="#faad14" />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={16}>
          <Card 
            title={<span><ClockCircleOutlined /> Current Invoicing Cycle (March 2026)</span>} 
            bordered={false} 
            style={{ marginBottom: 24 }}
            extra={<Tag color="blue">Active</Tag>}
          >
            <Row gutter={16} align="middle">
              <Col span={18}>
                <Text type="secondary">Days remaining until period close: <Text strong>22 Days</Text></Text>
                <Progress percent={26} status="active" />
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <Statistic title="Accrued Fees" value={1450} prefix="$" valueStyle={{ fontSize: 20 }} />
              </Col>
            </Row>
          </Card>

          <Card bordered={false}>
            <Tabs defaultActiveKey="outstanding" items={[
              {
                key: 'outstanding',
                label: <span><ClockCircleOutlined /> Outstanding ({outstandingInvoices.length})</span>,
                children: <Table columns={invoiceColumns} dataSource={outstandingInvoices} rowKey="id" pagination={false} scroll={{ x: 800 }} />,
              },
              {
                key: 'paid',
                label: <span><CheckCircleOutlined /> Paid History</span>,
                children: <Table columns={invoiceColumns} dataSource={paidInvoices} rowKey="id" pagination={false} scroll={{ x: 800 }} />,
              },
              {
                key: 'summary',
                label: <span><FileTextOutlined /> Commission Rates</span>,
                children: <Table columns={summaryColumns} dataSource={commissionSummary} rowKey="product" pagination={false} />,
              },
            ]} />
          </Card>
        </Col>
        
        <Col span={8}>
          <Card title="Settlement Workflow" bordered={false} style={{ marginBottom: 24 }}>
            <Steps 
              direction="vertical" 
              size="small" 
              current={1}
              items={[
                { title: 'Period Close', description: 'Monthly loan volume tallied' },
                { title: 'Invoicing', description: 'DashDrive issues platform fee invoice' },
                { title: 'Settlement', description: 'Financier pays via Bank/Portal' },
                { title: 'Confirmation', description: 'Revenue cleared for next period' },
              ]} 
            />
          </Card>

          <Card title="Commission Model" bordered={false} size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Referral Fee</Text>
                <Text strong>$1/approved app</Text>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Product Fee</Text>
                <Text strong>3-5% of Principal</Text>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Disbursement Processing</Text>
                <Text strong>$5/transaction</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

