import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  Input, 
  Select, 
  Tag, 
  Badge, 
  Button, 
  Space,
  Avatar
} from 'antd';
import { 
  SearchOutlined, 
  DownloadOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  SyncOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined,
  ExportOutlined,
  CreditCardOutlined,
  BankOutlined,
  WalletOutlined,
  MoreOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

type TransactionStatus = 'All' | 'Successful' | 'Failed' | 'Refunded' | 'Pending' | 'Disputed';

export const Transactions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TransactionStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const transactions = [
    {
      id: 'TX-15982',
      user: 'Sarah Jenkins',
      userType: 'Customer',
      service: 'Ride Hailing',
      method: 'Wallet',
      amount: '$18.50',
      commission: '$3.70',
      status: 'Successful',
      date: 'Feb 23, 2026, 14:28',
      ref: 'ORD-9012'
    },
    {
      id: 'TX-15981',
      user: 'Robert Paulson',
      userType: 'Driver',
      service: 'Food Delivery',
      method: 'Debit Card',
      amount: '$42.00',
      commission: '$8.40',
      status: 'Failed',
      date: 'Feb 23, 2026, 14:15',
      ref: 'ORD-8945'
    },
    {
      id: 'TX-15980',
      user: 'Michael Chen',
      userType: 'Customer',
      service: 'Mart',
      method: 'PayLater',
      amount: '$156.40',
      commission: '$23.46',
      status: 'Successful',
      date: 'Feb 23, 2026, 13:50',
      ref: 'ORD-8821'
    },
    {
      id: 'TX-15979',
      user: 'Emma Watson',
      userType: 'Customer',
      service: 'Shopping',
      method: 'Wallet',
      amount: '$240.00',
      commission: '$36.00',
      status: 'Refunded',
      date: 'Feb 23, 2026, 12:30',
      ref: 'ORD-8711'
    },
    {
      id: 'TX-15978',
      user: 'David Miller',
      userType: 'Driver',
      service: 'Withdrawal',
      method: 'Bank Transfer',
      amount: '$1,200.00',
      commission: '$5.00',
      status: 'Pending',
      date: 'Feb 23, 2026, 11:20',
      ref: 'WDR-402'
    },
    {
      id: 'TX-15977',
      user: 'John Doe',
      userType: 'Customer',
      service: 'Ride Hailing',
      method: 'Credit Card',
      amount: '$25.00',
      commission: '$5.00',
      status: 'Disputed',
      date: 'Feb 23, 2026, 10:45',
      ref: 'ORD-8604'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Successful': return <Badge status="success" text="Successful" />;
      case 'Failed': return <Badge status="error" text="Failed" />;
      case 'Refunded': return <Badge status="warning" text="Refunded" />;
      case 'Pending': return <Badge status="processing" text="Pending" />;
      case 'Disputed': return <Badge color="orange" text="Disputed" />;
      default: return <Badge status="default" text={status} />;
    }
  };

  const columns = [
    {
      title: 'Transaction / User',
      dataIndex: 'user',
      key: 'user',
      render: (u: string, tx: any) => (
        <Space>
          <Avatar size="small" icon={<CreditCardOutlined />} style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} />
          <div>
            <Text strong style={{ display: 'block' }}>{u}</Text>
            <Space size={4}>
              <Text type="secondary" style={{ fontSize: 11 }}>{tx.id}</Text>
              <Text type="secondary" style={{ fontSize: 11 }}>•</Text>
              <Tag color="blue" bordered={false} style={{ fontSize: 10, lineHeight: '14px', margin: 0 }}>{tx.userType}</Tag>
            </Space>
          </div>
        </Space>
      )
    },
    {
      title: 'Service & Ref',
      key: 'service',
      render: (tx: any) => (
        <div>
          <Text strong>{tx.service}</Text>
          <div style={{ fontSize: 11, color: '#64748b' }}>
            <ExportOutlined /> {tx.ref}
          </div>
        </div>
      )
    },
    {
      title: 'Amount / Method',
      key: 'amount',
      render: (tx: any) => (
        <div>
          <Text strong>{tx.amount}</Text>
          <div style={{ fontSize: 11, color: '#64748b' }}>
            {tx.method === 'Wallet' && <WalletOutlined />} {tx.method}
          </div>
        </div>
      )
    },
    {
      title: 'Comm.',
      dataIndex: 'commission',
      key: 'commission',
      render: (c: string) => <Text strong style={{ color: '#52c41a' }}>{c}</Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string, tx: any) => (
        <div>
          {getStatusBadge(s)}
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{tx.date}</div>
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: () => <Button type="text" icon={<MoreOutlined />} />
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Total Transacted" value={42805120} prefix="$" valueStyle={{ color: '#52c41a', fontWeight: 800 }} />
            <Text type="success" style={{ fontSize: 12 }}>+12% from last period</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Platform Commission" value={3842500} prefix="$" valueStyle={{ color: '#1677ff', fontWeight: 800 }} />
            <Text type="success" style={{ fontSize: 12 }}>+8% growth</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Failed Payments" value={428} valueStyle={{ color: '#ff4d4f', fontWeight: 800 }} />
            <Text type="danger" style={{ fontSize: 12 }}>-2% improvement</Text>
          </Card>
        </Col>
      </Row>

      <Card 
        bordered={false} 
        className="shadow-sm"
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>Financial Ledger</Title>
            <Space>
              <Input.Search 
                placeholder="Search TX ID, User..." 
                style={{ width: 250 }} 
                prefix={<SearchOutlined />}
              />
              <Button icon={<DownloadOutlined />}>Export CSV</Button>
              <Button type="primary">New Manual Refund</Button>
            </Space>
          </div>
        }
      >
        <div style={{ marginBottom: 16 }}>
           <Space size="large" style={{ borderBottom: '1px solid #f1f5f9', width: '100%', paddingBottom: 12 }}>
            {['All', 'Successful', 'Failed', 'Refunded', 'Pending', 'Disputed'].map(tab => (
              <div 
                key={tab} 
                onClick={() => setActiveTab(tab as any)}
                style={{ 
                  cursor: 'pointer', 
                  color: activeTab === tab ? '#1677ff' : '#64748b',
                  fontWeight: activeTab === tab ? 700 : 500,
                  borderBottom: activeTab === tab ? '2px solid #1677ff' : '2px solid transparent',
                  paddingBottom: 10,
                  marginBottom: -13
                }}
              >
                {tab}
              </div>
            ))}
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={activeTab === 'All' ? transactions : transactions.filter(tx => tx.status === activeTab)}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          className="premium-table"
        />
      </Card>
    </div>
  );
};
