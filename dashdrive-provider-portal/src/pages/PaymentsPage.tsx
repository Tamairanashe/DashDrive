import React from 'react';
import { Typography, Table, Tag, Card, Row, Col, Statistic } from 'antd';
// Removed unused icons

const { Title, Text } = Typography;

export const PaymentsPage: React.FC = () => {
  const disbursements = [
    { id: 'APP-1016', user: 'Driver Grace', amount: 6000, status: 'Sent', date: '2026-03-01', method: 'Wallet' },
    { id: 'APP-1013', user: 'Driver Sarah', amount: 200, status: 'Sent', date: '2026-03-07', method: 'Mobile Money' },
    { id: 'APP-1012', user: 'Driver John', amount: 5000, status: 'Processing', date: '2026-03-09', method: 'Bank Transfer' },
    { id: 'APP-1017', user: 'Driver Kudzi', amount: 3000, status: 'Failed', date: '2026-03-04', method: 'Bank Transfer' },
  ];

  const statusColor = (s: string) => s === 'Sent' ? 'green' : s === 'Processing' ? 'blue' : 'red';
  const methodIcon = (m: string) => m === 'Wallet' ? '💰' : m === 'Mobile Money' ? '📱' : '🏦';

  const columns = [
    { title: 'App ID', dataIndex: 'id', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'User', dataIndex: 'user' },
    { title: 'Amount', dataIndex: 'amount', render: (v: number) => `$${v.toLocaleString()}` },
    { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={statusColor(s)}>{s}</Tag> },
    { title: 'Date', dataIndex: 'date' },
    { title: 'Method', dataIndex: 'method', render: (m: string) => <span>{methodIcon(m)} {m}</span> },
  ];

  const totalDisbursed = disbursements.filter(d => d.status === 'Sent').reduce((sum, d) => sum + d.amount, 0);

  return (
    <div style={{ padding: '24px 0' }}>
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic title="Total Disbursed" value={totalDisbursed} prefix="$" precision={2} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic title="Pending" value={disbursements.filter(d => d.status === 'Processing').length} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic title="Failed" value={disbursements.filter(d => d.status === 'Failed').length} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
      </Row>
      <Title level={4}>Disbursement Ledger</Title>
      <Table columns={columns} dataSource={disbursements} rowKey="id" scroll={{ x: 800 }} />
    </div>
  );
};
