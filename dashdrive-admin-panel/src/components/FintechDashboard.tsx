import React from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Progress, 
  Table, 
  Badge, 
  Button, 
  Space,
  Divider,
  Tag
} from 'antd';
import { 
  RiseOutlined, 
  FallOutlined, 
  WalletOutlined, 
  CreditCardOutlined, 
  BarChartOutlined, 
  SyncOutlined,
  HistoryOutlined,
  AlertOutlined,
  SafetyCertificateOutlined,
  ArrowUpOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export const FintechDashboard: React.FC = () => {
  const serviceRevenue = [
    { label: 'Ride & Transport', value: '$120,400', percent: 30, color: '#1677ff' },
    { label: 'Food & Mart', value: '$92,800', percent: 23, color: '#52c41a' },
    { label: 'DashWallet Transfers', value: '$45,200', percent: 11, color: '#722ed1' },
    { label: 'Bill Payments', value: '$38,900', percent: 9, color: '#faad14' },
    { label: 'Merchant QR Payments', value: '$22,500', percent: 6, color: '#f5222d' },
    { label: 'Fintech Commissions', value: '$23,000', percent: 5, color: '#64748b' }
  ];

  const failedTransactions = [
    { id: 'TX-9042', user: 'James Wilson', service: 'Food', amount: '$45.20', reason: 'Insufficient Funds', time: '2m ago' },
    { id: 'TX-9041', user: 'Maria Garcia', service: 'Ride', amount: '$12.00', reason: 'Gateway Timeout', time: '5m ago' },
    { id: 'TX-9040', user: 'Robert Chen', service: 'Mart', amount: '$156.40', reason: '3DS Failure', time: '12m ago' }
  ];

  const paymentMix = [
    { label: 'DashWallet (Direct)', value: '48%', color: '#1677ff' },
    { label: 'Credit/Debit Card', value: '32%', color: '#3b82f6' },
    { label: 'Bank Transfer (P2P)', value: '12%', color: '#faad14' },
    { label: 'PayLater (BNPL)', value: '8%', color: '#f5222d' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 24 }}>
      {/* KPI Cards */}
      <Row gutter={[24, 24]}>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic 
              title="Total Transaction Volume" 
              value={1284502} 
              prefix={<RiseOutlined style={{ color: '#52c41a' }} />} 
              suffix={<div style={{ fontSize: 12, color: '#52c41a' }}><ArrowUpOutlined /> 14.2%</div>}
              precision={0}
              valueStyle={{ fontWeight: 800 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic 
              title="Total Revenue (Platform)" 
              value={342800} 
              prefix={<BarChartOutlined style={{ color: '#1677ff' }} />} 
              suffix={<div style={{ fontSize: 12, color: '#1677ff' }}><ArrowUpOutlined /> 8.4%</div>}
              precision={0}
              valueStyle={{ fontWeight: 800 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic 
              title="Global Wallet Balance" 
              value={8450200} 
              prefix={<WalletOutlined style={{ color: '#722ed1' }} />} 
              precision={0}
              valueStyle={{ fontWeight: 800 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic 
              title="PayLater Outstanding" 
              value={452100} 
              prefix={<CreditCardOutlined style={{ color: '#faad14' }} />} 
              precision={0}
              valueStyle={{ fontWeight: 800 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Secondary Financial Alerts */}
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm border-l-4 border-rose-500">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Statistic title="Withdraw Pending" value={84200} prefix="$" valueStyle={{ color: '#f5222d', fontWeight: 800 }} />
              <HistoryOutlined style={{ fontSize: 24, color: '#f5222d', opacity: 0.2 }} />
            </div>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text type="secondary" style={{ fontSize: 12 }}>428 Requests</Text>
              <Button type="link" size="small" danger>Process Now</Button>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm border-l-4 border-amber-500">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Statistic title="Fraud Alerts" value={12} suffix="High Risk" valueStyle={{ color: '#faad14', fontWeight: 800 }} />
              <AlertOutlined style={{ fontSize: 24, color: '#faad14', opacity: 0.2 }} />
            </div>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text type="secondary" style={{ fontSize: 12 }}>24 Medium Risk</Text>
              <Button type="link" size="small" style={{ color: '#faad14' }}>Review All</Button>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm border-l-4 border-emerald-500">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Statistic title="Refund Success Rate" value={99.4} suffix="%" valueStyle={{ color: '#52c41a', fontWeight: 800 }} />
              <SafetyCertificateOutlined style={{ fontSize: 24, color: '#52c41a', opacity: 0.2 }} />
            </div>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text type="secondary" style={{ fontSize: 12 }}>0.6% Disputed</Text>
              <Button type="link" size="small" style={{ color: '#52c41a' }}>View Policy</Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Revenue Breakdown and Charts */}
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card 
            title={<Title level={4} style={{ margin: 0 }}>Service-wise Revenue</Title>}
            bordered={false} 
            className="shadow-sm"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {serviceRevenue.map(service => (
                <div key={service.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text strong>{service.label}</Text>
                    <Text strong>{service.value}</Text>
                  </div>
                  <Progress percent={service.percent} strokeColor={service.color} showInfo={false} />
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title={<Title level={4} style={{ margin: 0 }}>Payment Mix Breakdown</Title>}
            bordered={false} 
            className="shadow-sm"
            styles={{ body: { background: '#0f172a', borderRadius: '0 0 16px 16px', padding: 24 } }}
            headStyle={{ borderBottom: 'none' }}
          >
             <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {paymentMix.map(method => (
                <div key={method.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{method.label}</Text>
                    <Text style={{ color: '#fff', fontWeight: 800 }}>{method.value}</Text>
                  </div>
                  <Progress percent={parseInt(method.value)} strokeColor={method.color} showInfo={false} trailColor="rgba(255,255,255,0.1)" />
                </div>
              ))}
            </div>
            <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, display: 'block', marginBottom: 4 }}>WAlLET ADOPTION RATIO</Text>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>1.4x</span>
                <Tag color="success" icon={<RiseOutlined />}>More Wallet Usage</Tag>
              </div>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, display: 'block', marginTop: 8 }}>
                Digital wallet adoption has increased by 12% following the recent Dash Rewards campaign.
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Transaction Monitor */}
      <Card 
        title={<Title level={4} style={{ margin: 0 }}>Failed Transactions Monitor</Title>}
        bordered={false} 
        className="shadow-sm"
        extra={<Button type="link">View All Failures</Button>}
      >
        <Table 
          dataSource={failedTransactions}
          pagination={false}
          size="middle"
          columns={[
            { title: 'TX ID', dataIndex: 'id', key: 'id', render: (t) => <Text style={{ fontSize: 12, color: '#64748b', fontWeight: 'bold' }}>{t}</Text> },
            { 
              title: 'User', 
              dataIndex: 'user', 
              key: 'user', 
              render: (u, record) => (
                <div>
                  <Text strong style={{ display: 'block' }}>{u}</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>{record.time}</Text>
                </div>
              ) 
            },
            { title: 'Service', dataIndex: 'service', key: 'service', render: (s) => <Tag>{s}</Tag> },
            { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (a) => <Text strong>{a}</Text> },
            { title: 'Failure Reason', dataIndex: 'reason', key: 'reason', render: (r) => <Badge status="error" text={r} /> },
            { title: 'Action', key: 'action', align: 'right', render: () => <Button type="primary" size="small" ghost>Re-verify</Button> }
          ]}
        />
      </Card>
    </div>
  );
};
