import React, { useState } from 'react';
import { Typography, Table, Tag, Card, Row, Col, Statistic, Steps, Button, Space, Modal, message, Divider, Alert } from 'antd';
import { DownloadOutlined, CheckCircleOutlined, HistoryOutlined, BankOutlined, CreditCardOutlined, GlobalOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Invoice {
  id: string;
  provider: string;
  period: string;
  totalCommission: number;
  status: 'Draft' | 'Invoiced' | 'Paid' | 'Overdue' | 'Cancelled';
  dueDate: string;
  paidDate: string;
  method: string;
}

export const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 'INV-2041', provider: 'XYZ Bank', period: 'January 2026', totalCommission: 24450, status: 'Paid', dueDate: '2026-02-15', paidDate: '2026-02-12', method: 'Bank Transfer' },
    { id: 'INV-2042', provider: 'XYZ Bank', period: 'February 2026', totalCommission: 27380, status: 'Invoiced', dueDate: '2026-03-15', paidDate: '', method: '' },
    { id: 'INV-2043', provider: 'XYZ Bank', period: 'February 2026 (Microloan)', totalCommission: 9030, status: 'Overdue', dueDate: '2026-03-15', paidDate: '', method: '' },
    { id: 'INV-2044', provider: 'XYZ Bank', period: 'March 2026', totalCommission: 0, status: 'Draft', dueDate: '', paidDate: '', method: '' },
  ]);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const statusColors: Record<string, string> = { Draft: 'default', Invoiced: 'blue', Paid: 'green', Overdue: 'red', Cancelled: 'volcano' };

  const columns = [
    { title: 'Invoice ID', dataIndex: 'id', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Billing Period', dataIndex: 'period' },
    { title: 'Total Commission', dataIndex: 'totalCommission', render: (v: number) => v > 0 ? <Text strong style={{ color: '#1677ff' }}>${v.toLocaleString()}</Text> : '-' },
    { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
    { title: 'Due Date', dataIndex: 'dueDate', render: (t: string) => t || '-' },
    { title: 'Paid Date', dataIndex: 'paidDate', render: (t: string) => t || '-' },
    {
      title: 'Actions',
      render: (_: any, record: Invoice) => (
        <Space>
          <Button size="small" icon={<DownloadOutlined />}>PDF</Button>
          {['Invoiced', 'Overdue'].includes(record.status) && (
            <Button size="small" type="primary" ghost onClick={() => { setSelectedInvoice(record); setIsPayModalOpen(true); }}>Mark as Paid</Button>
          )}
        </Space>
      )
    },
  ];

  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.totalCommission, 0);
  const totalOutstanding = invoices.filter(i => ['Invoiced', 'Overdue'].includes(i.status)).reduce((s, i) => s + i.totalCommission, 0);

  const handleMarkPaid = () => {
    if (!selectedInvoice) return;
    setInvoices(invoices.map(inv => inv.id === selectedInvoice.id ? { ...inv, status: 'Paid' as 'Paid', paidDate: new Date().toISOString().split('T')[0], method: 'Manual Entry' } : inv));
    message.success(`${selectedInvoice.id} marked as paid`);
    setIsPayModalOpen(false);
  };

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>DashDrive Platform Invoices</Title>
          <Text type="secondary">Manage your commission settlements to the DashDrive platform.</Text>
        </Col>
        <Col><Button icon={<HistoryOutlined />}>Full Invoicing Audit</Button></Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}><Card bordered={false} style={{ borderLeft: '4px solid #52c41a' }}><Statistic title="Settled to DashDrive" value={totalPaid} prefix="$" valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card bordered={false} style={{ borderLeft: '4px solid #1890ff' }}><Statistic title="Pending Settlement" value={totalOutstanding} prefix="$" valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={6}><Card bordered={false} style={{ borderLeft: '4px solid #ff4d4f' }}><Statistic title="Overdue Invoices" value={invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.totalCommission, 0)} prefix="$" valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
        <Col span={6}><Card bordered={false} style={{ borderLeft: '4px solid #1677ff' }}><Statistic title="Total Invoices" value={invoices.length} /></Card></Col>
      </Row>

      <Row gutter={24}>
        <Col span={18}>
          <Card bordered={false} title="Billing History">
            <Table columns={columns} dataSource={invoices} rowKey="id" scroll={{ x: 1000 }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Payment Instructions" bordered={false} style={{ marginBottom: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong><BankOutlined /> Bank Transfer</Text>
                <div style={{ fontSize: 12 }}><Text type="secondary">DashDrive Global Accounts (USD/ZAR)</Text></div>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div>
                <Text strong><CreditCardOutlined /> Card / Portal</Text>
                <div style={{ fontSize: 12 }}><Text type="secondary">Settle via integrated Stripe dashboard</Text></div>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div>
                <Text strong><GlobalOutlined /> Wire Transfer</Text>
                <div style={{ fontSize: 12 }}><Text type="secondary">International SWIFT settlements</Text></div>
              </div>
            </Space>
          </Card>

          <Card title="Invoice Workflow" bordered={false} size="small">
            <Steps 
              direction="vertical" 
              size="small" 
              current={1}
              items={[
                { title: 'Calculation', description: 'Monthly totals' },
                { title: 'Issuance', description: 'Net 15 Terms' },
                { title: 'Review', description: 'Dispute window' },
                { title: 'Payment', description: 'Platform clearance' },
              ]} 
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={<Space><CheckCircleOutlined style={{ color: '#52c41a' }} /> Confirm Payment Settlement</Space>}
        open={isPayModalOpen}
        onCancel={() => setIsPayModalOpen(false)}
        onOk={handleMarkPaid}
        okText="Confirm Settlement"
      >
        {selectedInvoice && (
          <div style={{ padding: '12px 0' }}>
            <Text>Are you confirming that </Text><Text strong>{selectedInvoice.id}</Text><Text> for amount </Text>
            <Text strong style={{ color: '#1677ff' }}>${selectedInvoice.totalCommission.toLocaleString()}</Text>
            <Text> has been paid to DashDrive?</Text>
            <div style={{ marginTop: 16 }}>
              <Alert 
                type="info" 
                showIcon 
                message="Settlement Process" 
                description="Once marked as paid, the DashDrive finance team will verify the funds within 24-48 hours. Your credit limit for new loans will be updated accordingly."
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

