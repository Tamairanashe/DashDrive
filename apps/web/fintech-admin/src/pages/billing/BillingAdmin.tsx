import React from 'react';
import { Typography, Row, Col, Table, Tag, Input, Space, Button, DatePicker } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const BillingAdmin: React.FC = () => {
  const columns = [
    { title: 'Transaction ID', dataIndex: 'id', key: 'id', render: (text: string) => <Text style={{ fontFamily: 'monospace', color: '#8c8c8c' }}>{text}</Text> },
    { title: 'Timestamp', dataIndex: 'date', key: 'date' },
    { 
      title: 'Movement Type', 
      dataIndex: 'type', 
      key: 'type',
      render: (type: string) => <Tag color={type.includes('Inbound') ? 'green' : 'blue'}>{type}</Tag>
    },
    { title: 'Source/Destination', dataIndex: 'entity', key: 'entity', render: (text: string) => <Text strong style={{ color: '#fff' }}>{text}</Text> },
    { 
      title: 'Ledger Amount', 
      dataIndex: 'amount', 
      key: 'amount',
      render: (amount: number) => <Text style={{ color: amount > 0 ? '#52c41a' : '#fff', fontWeight: amount > 0 ? 'bold' : 'normal' }}>{amount > 0 ? '+' : ''}${Math.abs(amount).toFixed(2)}</Text>
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => <Tag color={status === 'Cleared' ? 'success' : 'processing'}>{status}</Tag>
    }
  ];

  const data = [
    { key: '1', id: 'TXN-9091223', date: '2026-10-24 14:30', type: 'Loan Disbursement (Outbound)', entity: 'User U-1829', amount: -10000.00, status: 'Cleared' },
    { key: '2', id: 'TXN-9091224', date: '2026-10-24 14:32', type: 'Partner Commission (Inbound)', entity: 'Capital Drive Bank', amount: 250.00, status: 'Cleared' },
    { key: '3', id: 'TXN-9091225', date: '2026-10-24 15:00', type: 'Insurance Premium (Inbound)', entity: 'User U-3392', amount: 35.00, status: 'Cleared' },
    { key: '4', id: 'TXN-9091226', date: '2026-10-24 16:15', type: 'Claim Payout (Outbound)', entity: 'User U-1102', amount: -4500.00, status: 'Processing' },
    { key: '5', id: 'TXN-9091227', date: '2026-10-24 16:15', type: 'Provider Settlement (Outbound)', entity: 'Allied Shield Ins.', amount: -35.00, status: 'Processing' },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#ffffff' }}>System Revenue Ledger</Title>
          <Text type="secondary">Immutable record of all financial value movements across DashDrive Fintech Services.</Text>
        </Col>
        <Col>
          <Space>
            <RangePicker style={{ width: 250 }} />
            <Input prefix={<SearchOutlined />} placeholder="Search TXN ID..." style={{ width: 200 }} />
            <Button icon={<DownloadOutlined />}>Export CSV</Button>
          </Space>
        </Col>
      </Row>

      <Table 
        columns={columns} 
        dataSource={data} 
        style={{ background: '#1f1f1f', borderRadius: 8 }}
      />
    </div>
  );
};
