import React, { useState } from 'react';
import { Table, Card, Button, Switch, Space, Tag, Typography, Modal, Form, Input, Select, message, Row, Col, Divider, Alert, Statistic } from 'antd';
import { 
  PlusOutlined, 
  SettingOutlined, 
  SafetyCertificateOutlined, 
  GlobalOutlined, 
  WalletOutlined,
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface PaymentGateway {
  id: string;
  name: string;
  type: 'Global' | 'Local' | 'Internal';
  status: boolean;
  transactionsCount: number;
  lastUsed: string;
  supportedCurrencies: string[];
}

const INITIAL_GATEWAYS: PaymentGateway[] = [
  {
    id: 'PG-001',
    name: 'Stripe Connect',
    type: 'Global',
    status: true,
    transactionsCount: 14500,
    lastUsed: '2 minutes ago',
    supportedCurrencies: ['USD', 'EUR', 'GBP']
  },
  {
    id: 'PG-002',
    name: 'PayPal Checkout',
    type: 'Global',
    status: true,
    transactionsCount: 8900,
    lastUsed: '15 minutes ago',
    supportedCurrencies: ['USD', 'CAD', 'AUD']
  },
  {
    id: 'PG-003',
    name: 'Paystack',
    type: 'Local',
    status: true,
    transactionsCount: 2100,
    lastUsed: '1 hour ago',
    supportedCurrencies: ['NGN', 'GHS', 'ZAR']
  },
  {
    id: 'PG-004',
    name: 'Dash Wallet (Internal)',
    type: 'Internal',
    status: true,
    transactionsCount: 45000,
    lastUsed: 'Seconds ago',
    supportedCurrencies: ['ALL']
  },
  {
    id: 'PG-005',
    name: 'Flutterwave',
    type: 'Local',
    status: false,
    transactionsCount: 0,
    lastUsed: 'Never',
    supportedCurrencies: ['KES', 'UGX', 'RWF']
  }
];

export const PaymentGateways: React.FC = () => {
  const [gateways, setGateways] = useState<PaymentGateway[]>(INITIAL_GATEWAYS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGateway, setEditingGateway] = useState<PaymentGateway | null>(null);

  const toggleStatus = (id: string, checked: boolean) => {
    setGateways(prev => prev.map(g => g.id === id ? { ...g, status: checked } : g));
    message.success(`Gateway ${checked ? 'enabled' : 'disabled'} successfully`);
  };

  const showConfig = (gateway: PaymentGateway) => {
    setEditingGateway(gateway);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Gateway Provider',
      key: 'provider',
      render: (_, record: PaymentGateway) => (
        <Space>
          <div style={{ 
            width: 32, height: 32, borderRadius: 8, background: '#f8fafc', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' 
          }}>
            {record.type === 'Global' ? <GlobalOutlined /> : record.type === 'Internal' ? <WalletOutlined /> : <SafetyCertificateOutlined />}
          </div>
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.id}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'Global' ? 'blue' : type === 'Internal' ? 'purple' : 'cyan'}>
          {type}
        </Tag>
      ),
    },
    {
        title: 'Currencies',
        dataIndex: 'supportedCurrencies',
        key: 'currencies',
        render: (currencies: string[]) => (
          <div style={{ maxWidth: 150 }}>
            {currencies.map(c => <Tag key={c} style={{ margin: '2px' }}>{c}</Tag>)}
          </div>
        ),
      },
    {
      title: 'Activity',
      key: 'activity',
      render: (_, record: PaymentGateway) => (
        <div>
          <Text style={{ fontSize: 13 }}>{record.transactionsCount.toLocaleString()} Trans.</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>Last: {record.lastUsed}</Text>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record: PaymentGateway) => (
        <Switch 
          checked={record.status} 
          onChange={(checked) => toggleStatus(record.id, checked)}
          checkedChildren="Live"
          unCheckedChildren="Off"
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: PaymentGateway) => (
        <Button icon={<SettingOutlined />} onClick={() => showConfig(record)}>Configure</Button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Payment Gateways</Title>
          <Text type="secondary">Manage third-party payment providers and internal wallet settlements.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>Connect Provider</Button>
      </div>

      <Alert 
        message="Active Security Protocol" 
        description="All gateway credentials are encrypted at rest using AES-256. Connections are monitored by the DashDrive Security Ops Center."
        type="info"
        showIcon
        icon={<SafetyCertificateOutlined />}
        style={{ borderRadius: 12 }}
      />

      <Card bordered={false} styles={{ body: { padding: 0 } }} className="shadow-sm">
        <Table 
          dataSource={gateways} 
          columns={columns} 
          rowKey="id" 
          pagination={false}
        />
      </Card>

      <Modal
        title={`Configure ${editingGateway?.name}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
            message.success('Configuration saved successfully');
            setIsModalVisible(false);
        }}
        width={600}
      >
        <Form layout="vertical" initialValues={{ mode: 'sandbox' }}>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Operating Mode" name="mode" required>
                        <Select options={[{ value: 'sandbox', label: 'Sandbox / Testing' }, { value: 'live', label: 'Production / Live' }]} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Settle Period" name="settle" required>
                        <Select options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }]} />
                    </Form.Item>
                </Col>
            </Row>
            
            <Form.Item label="API Public Key" required>
                <Input.Password value="pk_test_************************" />
            </Form.Item>
            <Form.Item label="API Secret Key" required>
                <Input.Password value="sk_test_************************" />
            </Form.Item>
            
            <Divider>Advanced Rules</Divider>
            
            <Form.Item label="Auto-Refund on Dispute" valuePropName="checked">
                <Switch size="small" />
            </Form.Item>
            <Form.Item label="Max Single Transaction Limit ($)">
                <Input prefix="$" defaultValue="5000" />
            </Form.Item>
        </Form>
      </Modal>

      <div style={{ marginTop: 8 }}>
          <Title level={5}>Settlement Accounts</Title>
          <Row gutter={16}>
              <Col span={8}>
                <Card size="small" className="shadow-sm">
                    <Statistic title="Unsettled (Stripe)" value={1240.20} precision={2} prefix="$" />
                    <Button type="link" size="small" style={{ padding: 0, marginTop: 8 }}>Initiate Payout</Button>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" className="shadow-sm">
                    <Statistic title="Unsettled (Paystack)" value={45200.00} precision={2} prefix="R" />
                    <Button type="link" size="small" style={{ padding: 0, marginTop: 8 }}>Next Sync: 2h</Button>
                </Card>
              </Col>
          </Row>
      </div>
    </div>
  );
};
