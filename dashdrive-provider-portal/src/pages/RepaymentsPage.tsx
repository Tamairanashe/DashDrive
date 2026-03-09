import React, { useState } from 'react';
import { Typography, Table, Tag, Card, Row, Col, Statistic, Button, Modal, Space, Input, message, Progress, Divider } from 'antd';
import { DollarOutlined, CalendarOutlined, PlusOutlined, HistoryOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface RepaymentInstallment {
  id: string;
  date: string;
  principal: number;
  interest: number;
  total: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

interface LoanRepayment {
  id: string;
  borrower: string;
  product: string;
  disbursedAmount: number;
  monthlyInstalment: number;
  remainingBalance: number;
  nextDueDate: string;
  status: 'Paid' | 'Grace Period' | 'Overdue' | 'Current';
  installments: RepaymentInstallment[];
}

export const RepaymentsPage: React.FC = () => {
  const [selectedLoan, setSelectedLoan] = useState<LoanRepayment | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const [loans] = useState<LoanRepayment[]>([
    {
      id: 'LN-001', borrower: 'Driver Grace', product: 'Vehicle Loan', disbursedAmount: 5000, monthlyInstalment: 300, remainingBalance: 3900, nextDueDate: '2026-04-05', status: 'Current',
      installments: [
        { id: 'INS-1', date: '2026-02-05', principal: 250, interest: 50, total: 300, status: 'Paid' },
        { id: 'INS-2', date: '2026-03-05', principal: 250, interest: 50, total: 300, status: 'Paid' },
        { id: 'INS-3', date: '2026-04-05', principal: 250, interest: 50, total: 300, status: 'Pending' },
      ]
    },
    {
      id: 'LN-002', borrower: 'Driver John', product: 'Microloan', disbursedAmount: 800, monthlyInstalment: 150, remainingBalance: 350, nextDueDate: '2026-03-08', status: 'Paid',
      installments: [
        { id: 'INS-1', date: '2026-02-08', principal: 130, interest: 20, total: 150, status: 'Paid' },
        { id: 'INS-2', date: '2026-03-08', principal: 130, interest: 20, total: 150, status: 'Paid' },
      ]
    },
    {
      id: 'LN-003', borrower: 'Driver Sarah', product: 'Fuel Credit', disbursedAmount: 200, monthlyInstalment: 50, remainingBalance: 100, nextDueDate: '2026-03-10', status: 'Current',
      installments: [
        { id: 'INS-1', date: '2026-02-10', principal: 45, interest: 5, total: 50, status: 'Paid' },
        { id: 'INS-2', date: '2026-03-10', principal: 45, interest: 5, total: 50, status: 'Pending' },
      ]
    },
    {
      id: 'LN-004', borrower: 'Driver Kudzi', product: 'Repair Financing', disbursedAmount: 1200, monthlyInstalment: 200, remainingBalance: 1200, nextDueDate: '2026-03-01', status: 'Overdue',
      installments: [
        { id: 'INS-1', date: '2026-03-01', principal: 180, interest: 20, total: 200, status: 'Overdue' },
      ]
    },
    {
      id: 'LN-005', borrower: 'Rider Mike', product: 'Personal Loan', disbursedAmount: 1500, monthlyInstalment: 250, remainingBalance: 1500, nextDueDate: '2026-03-04', status: 'Grace Period',
      installments: [
        { id: 'INS-1', date: '2026-03-04', principal: 220, interest: 30, total: 250, status: 'Pending' },
      ]
    }
  ]);

  const statusColors: Record<string, string> = { Paid: 'green', Current: 'blue', 'Grace Period': 'orange', Overdue: 'red' };

  const columns = [
    { title: 'Loan ID', dataIndex: 'id', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Borrower', dataIndex: 'borrower' },
    { title: 'Product', dataIndex: 'product' },
    { title: 'Instalment', dataIndex: 'monthlyInstalment', render: (v: number) => `$${v}` },
    { title: 'Remaining', dataIndex: 'remainingBalance', render: (v: number) => <Text strong>${v.toLocaleString()}</Text> },
    { title: 'Next Due', dataIndex: 'nextDueDate' },
    { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
    {
      title: 'Actions',
      render: (_: any, record: LoanRepayment) => (
        <Space>
          <Button size="small" icon={<CalendarOutlined />} onClick={() => { setSelectedLoan(record); setIsScheduleOpen(true); }}>Schedule</Button>
          <Button size="small" type="primary" ghost icon={<DollarOutlined />} onClick={() => { setSelectedLoan(record); setPaymentAmount(record.monthlyInstalment); setIsPaymentModalOpen(true); }}>Log Payment</Button>
        </Space>
      )
    },
  ];

  const instColumns = [
    { title: 'Due Date', dataIndex: 'date' },
    { title: 'Principal', dataIndex: 'principal', render: (v: number) => `$${v}` },
    { title: 'Interest', dataIndex: 'interest', render: (v: number) => `$${v}` },
    { title: 'Total', dataIndex: 'total', render: (v: number) => <Text strong>${v}</Text> },
    { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={s === 'Paid' ? 'green' : s === 'Overdue' ? 'red' : 'orange'}>{s}</Tag> },
  ];

  const totalDisbursed = loans.reduce((s, l) => s + l.disbursedAmount, 0);
  const totalRemaining = loans.reduce((s, l) => s + l.remainingBalance, 0);
  const totalCollected = totalDisbursed - totalRemaining;
  const overdueLoans = loans.filter(l => l.status === 'Overdue');

  const handleLogPayment = () => {
    if (!selectedLoan) return;
    message.success(`Payment of $${paymentAmount} logged for ${selectedLoan.borrower}`);
    setIsPaymentModalOpen(false);
  };

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col><Title level={4}>Repayments & Portfolio</Title></Col>
        <Col><Button type="primary" icon={<HistoryOutlined />}>Payment History Report</Button></Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false} style={{ borderTop: '4px solid #1677ff' }}>
            <Statistic title="Total Disbursed" value={totalDisbursed} prefix="$" />
            <Text type="secondary" style={{ fontSize: 12 }}>Lifetime loan volume</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ borderTop: '4px solid #52c41a' }}>
            <Statistic title="Total Collected" value={totalCollected} prefix="$" valueStyle={{ color: '#52c41a' }} />
            <Progress percent={Math.round((totalCollected / totalDisbursed) * 100)} size="small" status="active" />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ borderTop: '4px solid #faad14' }}>
            <Statistic title="Outstanding" value={totalRemaining} prefix="$" valueStyle={{ color: '#faad14' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>Principal at risk</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ borderTop: '4px solid #ff4d4f' }}>
            <Statistic title="At Risk (Overdue)" value={overdueLoans.reduce((s, l) => s + l.remainingBalance, 0)} prefix="$" valueStyle={{ color: '#ff4d4f' }} />
            <Tag color="red" style={{ marginTop: 4 }}>{overdueLoans.length} Loans Overdue</Tag>
          </Card>
        </Col>
      </Row>

      <Card bordered={false} title={<Space><DollarOutlined /> Active Repayment Tracking</Space>}>
        <Table columns={columns} dataSource={loans} rowKey="id" scroll={{ x: 1000 }} />
      </Card>

      {/* Repayment Schedule Modal */}
      <Modal
        title={<Space><CalendarOutlined /> Repayment Schedule — {selectedLoan?.id}</Space>}
        open={isScheduleOpen}
        onCancel={() => setIsScheduleOpen(false)}
        footer={[<Button key="close" onClick={() => setIsScheduleOpen(false)}>Close</Button>]}
        width={650}
      >
        {selectedLoan && (
          <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={12}><Statistic title="Loan Amount" value={selectedLoan.disbursedAmount} prefix="$" /></Col>
              <Col span={12}><Statistic title="Processed Payments" value={selectedLoan.disbursedAmount - selectedLoan.remainingBalance} prefix="$" valueStyle={{ color: '#52c41a' }} /></Col>
            </Row>
            <Divider>Installment Breakdown</Divider>
            <Table columns={instColumns} dataSource={selectedLoan.installments} rowKey="id" pagination={false} />
          </div>
        )}
      </Modal>

      {/* Log Payment Modal */}
      <Modal
        title={<Space><PlusOutlined /> Log Manual Payment</Space>}
        open={isPaymentModalOpen}
        onCancel={() => setIsPaymentModalOpen(false)}
        onOk={handleLogPayment}
        okText="Log Payment"
      >
        {selectedLoan && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text>Logging payment for </Text><Text strong>{selectedLoan.borrower}</Text><Text> ({selectedLoan.id})</Text>
            </div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text type="secondary">Product:</Text>
                <div><Text strong>{selectedLoan.product}</Text></div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Remaining Balance:</Text>
                <div><Text strong style={{ color: '#ff4d4f' }}>${selectedLoan.remainingBalance.toLocaleString()}</Text></div>
              </Col>
            </Row>
            <div style={{ marginBottom: 8 }}><Text strong>Amount Paid ($):</Text></div>
            <Input 
              type="number" 
              value={paymentAmount} 
              onChange={(e) => setPaymentAmount(Number(e.target.value))} 
              size="large"
              prefix={<DollarOutlined />}
            />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Note: This payment will be credited to the oldest outstanding installment.</Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

