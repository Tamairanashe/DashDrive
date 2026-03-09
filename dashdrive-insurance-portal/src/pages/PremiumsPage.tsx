import React from 'react';
import { Typography, Table, Tag, Card, Row, Col, Statistic } from 'antd';
import { DollarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const PremiumsPage: React.FC = () => {
  const premiums = [
    { user: 'Driver John', policy: 'Accident Cover', premium: 3, method: 'Wallet', status: 'Paid', date: '2026-03-01' },
    { user: 'Driver Sarah', policy: 'Vehicle Damage', premium: 8, method: 'Card', status: 'Paid', date: '2026-03-01' },
    { user: 'Rider Mike', policy: 'Trip Protection', premium: 1.5, method: 'Auto Deduction', status: 'Paid', date: '2026-03-01' },
    { user: 'Driver Grace', policy: 'Accident Cover', premium: 3, method: 'Wallet', status: 'Overdue', date: '2026-03-01' },
    { user: 'Driver Tino', policy: 'Vehicle Damage', premium: 8, method: 'Card', status: 'Failed', date: '2026-03-01' },
  ];

  const methodIcon = (m: string) => m === 'Wallet' ? '💰' : m === 'Card' ? '💳' : '🔄';

  const columns = [
    { title: 'User', dataIndex: 'user', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Policy', dataIndex: 'policy', render: (t: string) => <Tag color="purple">{t}</Tag> },
    { title: 'Premium', dataIndex: 'premium', render: (v: number) => `$${v}/mo` },
    { title: 'Method', dataIndex: 'method', render: (m: string) => <span>{methodIcon(m)} {m}</span> },
    { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={s === 'Paid' ? 'green' : s === 'Overdue' ? 'orange' : 'red'}>{s}</Tag> },
    { title: 'Date', dataIndex: 'date' },
  ];

  const totalCollected = premiums.filter(p => p.status === 'Paid').reduce((s, p) => s + p.premium, 0);

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={8}><Card bordered={false}><Statistic title="Collected This Month" value={totalCollected} prefix="$" valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={8}><Card bordered={false}><Statistic title="Overdue" value={premiums.filter(p => p.status === 'Overdue').length} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={8}><Card bordered={false}><Statistic title="Failed" value={premiums.filter(p => p.status === 'Failed').length} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
      </Row>
      <Title level={4}>Premium Payments</Title>
      <Table columns={columns} dataSource={premiums} rowKey={(r, i) => `${r.user}-${i}`} scroll={{ x: 800 }} />
    </div>
  );
};
