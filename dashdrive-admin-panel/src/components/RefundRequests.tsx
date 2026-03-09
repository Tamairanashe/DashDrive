import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Tag, 
  Badge, 
  Button, 
  Space,
  Avatar,
  Input,
  Tooltip
} from 'antd';
import { 
  SearchOutlined, 
  DownloadOutlined, 
  SafetyOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined, 
  SyncOutlined,
  MoreOutlined,
  SafetyCertificateOutlined,
  AuditOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface RefundRequest {
  id: string;
  orderId: string;
  customer: { name: string; email: string; avatar: string };
  amount: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'In Progress';
  timestamp: string;
  proof: boolean;
  fraudScore: number;
}

const mockRefunds: RefundRequest[] = [
  {
    id: 'REF-8001',
    orderId: 'PRC-9042',
    customer: { name: 'Sarah Miller', email: 'sarah.m@gmail.com', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    amount: '$142.50',
    reason: 'Significant physical damage to electronics packaging.',
    status: 'In Progress',
    timestamp: '2h ago',
    proof: true,
    fraudScore: 12
  },
  {
    id: 'REF-8002',
    orderId: 'PRC-9102',
    customer: { name: 'James Wilson', email: 'j.wilson@corporate.com', avatar: 'https://i.pravatar.cc/150?u=james' },
    amount: '$45.00',
    reason: 'Delayed delivery beyond 48-hour guarantee window.',
    status: 'Pending',
    timestamp: '4h ago',
    proof: false,
    fraudScore: 5
  },
  {
    id: 'REF-8003',
    orderId: 'PRC-8922',
    customer: { name: 'Elena Rodriguez', email: 'elena.rod@outlook.com', avatar: 'https://i.pravatar.cc/150?u=elena' },
    amount: '$890.00',
    reason: 'Total loss of item during transit (Assigned: DRV-401).',
    status: 'Pending',
    timestamp: '1d ago',
    proof: true,
    fraudScore: 68
  }
];

export const RefundRequests: React.FC = () => {
  const columns = [
    {
      title: 'Claim Entity',
      key: 'entity',
      render: (tx: RefundRequest) => (
        <Space>
          <Avatar src={tx.customer.avatar} />
          <div>
            <Text strong style={{ display: 'block' }}>{tx.id}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>Order: {tx.orderId}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Loss Reason / Evidence',
      key: 'reason',
      width: '30%',
      render: (tx: RefundRequest) => (
        <div>
          <Text style={{ fontSize: 13, display: 'block' }}>{tx.reason}</Text>
          <Space size={4} style={{ marginTop: 4 }}>
            {tx.proof ? (
              <Tag color="success" icon={<CheckCircleOutlined />} bordered={false} style={{ fontSize: 10 }}>Proof Verified</Tag>
            ) : (
              <Tag color="warning" icon={<ClockCircleOutlined />} bordered={false} style={{ fontSize: 10 }}>Awaiting Proof</Tag>
            )}
            <Text type="secondary" style={{ fontSize: 10 }}>{tx.timestamp}</Text>
          </Space>
        </div>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (a: string) => <Text strong>{a}</Text>
    },
    {
      title: 'Risk Score',
      dataIndex: 'fraudScore',
      key: 'risk',
      render: (score: number) => (
        <div style={{ width: 120 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Fraud Risk</Text>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: score > 50 ? '#ff4d4f' : '#52c41a' }}>{score}%</Text>
          </div>
          <Progress 
            percent={score} 
            size="small" 
            showInfo={false} 
            strokeColor={score > 50 ? '#ff4d4f' : score > 20 ? '#faad14' : '#52c41a'} 
          />
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => {
        if (s === 'Approved') return <Tag color="success">{s}</Tag>;
        if (s === 'Rejected') return <Tag color="error">{s}</Tag>;
        if (s === 'In Progress') return <Tag color="processing">{s}</Tag>;
        return <Tag color="default">{s}</Tag>;
      }
    },
    {
      title: 'Operations',
      key: 'actions',
      align: 'right' as const,
      render: () => (
        <Space>
          <Button type="primary" size="small" icon={<AuditOutlined />} ghost>Audit</Button>
          <Button type="text" icon={<MoreOutlined />} />
        </Space>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ margin: 0 }}>Logistics Recovery Audit</Title>
          <Text type="secondary">Manage parcel refund claims, failed delivery reimbursements, and network liability audits.</Text>
        </Col>
        <Col>
          <Tag color="error" icon={<SafetyOutlined />} style={{ padding: '4px 12px', borderRadius: 8 }}>
            High Fraud Alert: 2 Cases
          </Tag>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Total Claim Volume" value={42850} prefix="$" valueStyle={{ fontWeight: 800 }} />
            <Text type="secondary" style={{ fontSize: 12 }}>Last 30 days</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Approved Payouts" value={12402} prefix="$" valueStyle={{ color: '#ff4d4f', fontWeight: 800 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Badge status="error" /> <Text type="danger" style={{ fontSize: 12 }}>Net Loss</Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Blocked Fraud" value={28440} prefix="$" valueStyle={{ color: '#52c41a', fontWeight: 800 }} />
            <Text type="success" style={{ fontSize: 12 }}>Saved Revenue</Text>
          </Card>
        </Col>
      </Row>

      <Card 
        bordered={false} 
        className="shadow-sm" 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>Financial Claims Registry</Title>
            <Space>
              <Input.Search placeholder="Search Claim ID..." style={{ width: 250 }} />
              <Button icon={<DownloadOutlined />}>Export Report</Button>
            </Space>
          </div>
        }
      >
        <Table 
          columns={columns} 
          dataSource={mockRefunds} 
          pagination={{ pageSize: 5 }}
          className="premium-table"
        />
      </Card>
    </div>
  );
};
