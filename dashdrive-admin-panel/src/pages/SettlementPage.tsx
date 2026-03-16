import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Tabs, 
  Table, 
  Input, 
  Button, 
  Space, 
  Tag, 
  Statistic, 
  message, 
  Progress,
  List,
  Badge,
  Alert
} from 'antd';
import { 
  SearchOutlined, 
  DownloadOutlined, 
  FilterOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  HistoryOutlined,
  WalletOutlined,
  BankOutlined,
  ProjectOutlined,
  PrinterOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  InteractionOutlined,
  FileProtectOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const { Title, Text } = Typography;

interface SettlementData {
  key: string;
  id: string;
  partner: string;
  service: string;
  earnings: number;
  commissions: number;
  netPayable: number;
  status: 'Pending' | 'Generated' | 'Processing' | 'Paid' | 'Failed';
  date: string;
}

const mockSettlements: SettlementData[] = [
  { key: '1', id: 'STL-9001', partner: 'Ammar Logistics', service: 'Ride Hailing', earnings: 5200.50, commissions: 780.00, netPayable: 4420.50, status: 'Pending', date: 'Oct 20, 2025' },
  { key: '2', id: 'STL-9002', partner: 'QuickBite Foods', service: 'Food Delivery', earnings: 3100.20, commissions: 465.00, netPayable: 2635.20, status: 'Generated', date: 'Oct 21, 2025' },
  { key: '3', id: 'STL-9003', partner: 'Mike Driver', service: 'Ride Hailing', earnings: 1200.00, commissions: 180.00, netPayable: 1020.00, status: 'Processing', date: 'Oct 22, 2025' },
  { key: '4', id: 'STL-9004', partner: 'Swift Parcel', service: 'Parcel', earnings: 850.40, commissions: 127.50, netPayable: 722.90, status: 'Paid', date: 'Oct 18, 2025' },
  { key: '5', id: 'STL-9005', partner: 'Star Hotels', service: 'Hotels', earnings: 12400.00, commissions: 1860.00, netPayable: 10540.00, status: 'Failed', date: 'Oct 19, 2025' },
];

export const SettlementPage: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerateSettlements = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      message.success('System has generated 142 new settlement batches for the current cycle.');
    }, 2000);
  };

  const columns = [
    { title: 'Settlement ID', dataIndex: 'id', key: 'id', render: (id: string) => <Text strong>{id}</Text> },
    { title: 'Partner', dataIndex: 'partner', key: 'partner' },
    { title: 'Service', dataIndex: 'service', key: 'service', render: (svc: string) => <Tag color="blue">{svc}</Tag> },
    { title: 'Gross Earnings', dataIndex: 'earnings', key: 'earnings', render: (val: number) => `$${val.toLocaleString()}` },
    { title: 'Comm. Deduction', dataIndex: 'commissions', key: 'commissions', render: (val: number) => <Text type="danger">-$${val.toLocaleString()}</Text> },
    { title: 'Net Payable', dataIndex: 'netPayable', key: 'netPayable', render: (val: number) => <Text strong style={{ color: '#10b981' }}>$${val.toLocaleString()}</Text> },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        const colors = { Pending: 'orange', Generated: 'blue', Processing: 'processing', Paid: 'green', Failed: 'red' };
        return <Tag color={(colors as any)[status]}>{status}</Tag>
      }
    },
    { title: 'Cycle Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: SettlementData) => (
        <Space>
          <Button size="small" type="link">View Records</Button>
          {(record.status === 'Pending' || record.status === 'Generated') && <Button size="small" type="primary" ghost>Approve</Button>}
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '0px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: '#3b82f615', borderRadius: '12px' }}>
              <BankOutlined style={{ fontSize: 24, color: '#3b82f6' }} />
            </div>
            <div>
              <Title level={4} style={{ margin: 0 }}>Settlement & Payouts Hub</Title>
              <Text type="secondary">Operational partner payment engine and disbursement management</Text>
            </div>
          </div>
        </Col>
        <Col>
          <Space>
            <Button icon={<PrinterOutlined />}>Batch PDF</Button>
            <Button type="primary" icon={<SyncOutlined spin={isProcessing} />} onClick={handleGenerateSettlements}>
              Generate Cycle Settlements
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={6}>
          <Card bordered={false} className="shadow-sm" style={{ borderRadius: 16 }}>
            <Statistic 
              title="Awaiting Approval" 
              value={42} 
              suffix="Partners"
              styles={{ content: { color: '#f59e0b', fontWeight: 700 } }}
            />
            <Progress percent={65} size="small" strokeColor="#f59e0b" status="active" />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card bordered={false} className="shadow-sm" style={{ borderRadius: 16 }}>
            <Statistic 
              title="Pending Disbursement" 
              value={125400.50} 
              prefix="$"
              styles={{ content: { color: '#3b82f6', fontWeight: 700 } }}
            />
            <Badge status="processing" text="In Processing Queue" />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card bordered={false} className="shadow-sm" style={{ borderRadius: 16 }}>
            <Statistic 
              title="Total Paid (Cycle)" 
              value={850400} 
              prefix="$"
              styles={{ content: { color: '#10b981', fontWeight: 700 } }}
            />
            <Text type="success">+12% from last cycle</Text>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card bordered={false} className="shadow-sm" style={{ borderRadius: 16 }}>
            <Statistic 
              title="Failed Payouts" 
              value={3} 
              styles={{ content: { color: '#ef4444', fontWeight: 700 } }}
            />
            <Button type="link" danger style={{ padding: 0 }}>Action Required</Button>
          </Card>
        </Col>
      </Row>

      <Card 
        variant="borderless" 
        className="shadow-sm premium-tabs" 
        style={{ borderRadius: 16, marginBottom: 24 }}
        tabList={[
          { key: '1', tab: <Space><ClockCircleOutlined /> Pending Settlements</Space> },
          { key: '2', tab: <Space><DollarOutlined /> Partner Earnings</Space> },
          { key: '3', tab: <Space><SyncOutlined /> Generate Settlements</Space> },
          { key: '4', tab: <Space><InteractionOutlined /> Payout Processing</Space> },
          { key: '5', tab: <Space><HistoryOutlined /> Payout History</Space> },
          { key: '6', tab: <Space><ExclamationCircleOutlined /> Failed Payouts</Space> },
          { key: '7', tab: <Space><FileProtectOutlined /> Settlement Reports</Space> },
        ]}
        activeTabKey={activeTab}
        onTabChange={setActiveTab}
      >
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Input 
              placeholder="Search Partner or ID..." 
              prefix={<SearchOutlined />} 
              style={{ width: 300, borderRadius: 8 }}
            />
            <Button icon={<FilterOutlined />}>Filters</Button>
          </Space>
          <Space>
            <Button icon={<DownloadOutlined />}>Export CSV</Button>
            {activeTab === '4' && <Button type="primary" style={{ background: '#10b981', borderColor: '#10b981' }}>Process Bulk Payouts</Button>}
          </Space>
        </div>

        {activeTab === '3' ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <EmptyState 
              title="Ready to Generate Settlements" 
              description="Click the button below to analyze all partner earnings for the selected cycle and generate settlement statements."
              onAction={handleGenerateSettlements}
              loading={isProcessing}
            />
          </div>
        ) : activeTab === '6' ? (
          <div>
            <Alert 
              message="Critical: 3 Payouts Failed" 
              description="These payouts were rejected by the destination bank. Please verify partner account details and retry."
              type="error"
              showIcon
              style={{ marginBottom: 24, borderRadius: 12 }}
            />
            <Table columns={columns} dataSource={mockSettlements.filter(s => s.status === 'Failed')} pagination={false} />
          </div>
        ) : (
          <Table 
            columns={columns} 
            dataSource={
              activeTab === '1' ? mockSettlements.filter(s => s.status === 'Pending') :
              activeTab === '4' ? mockSettlements.filter(s => s.status === 'Processing') :
              activeTab === '5' ? mockSettlements.filter(s => s.status === 'Paid') :
              mockSettlements
            } 
          />
        )}
      </Card>
      
      {/* Footer Info */}
      <Card bordered={false} className="shadow-sm" style={{ borderRadius: 16, background: isDark ? '#1e293b' : '#f8fafc' }}>
        <Row gutter={24} align="middle">
          <Col md={16}>
            <Title level={5}>Scheduled Payout Window</Title>
            <Text>Next automated disbursement is scheduled for <strong>Monday, Oct 27, 2025 at 02:00 AM</strong>. Ensure all pending settlements are approved before the cutoff.</Text>
          </Col>
          <Col md={8} style={{ textAlign: 'right' }}>
            <Button type="link" icon={<HistoryOutlined />}>View Automation Logs</Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

// Internal Helper Components
const EmptyState = ({ title, description, onAction, loading }: any) => (
  <div style={{ maxWidth: 400, margin: '0 auto' }}>
    <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
    <Title level={5}>{title}</Title>
    <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>{description}</Text>
    <Button type="primary" size="large" onClick={onAction} loading={loading}>Start Generation</Button>
  </div>
);
