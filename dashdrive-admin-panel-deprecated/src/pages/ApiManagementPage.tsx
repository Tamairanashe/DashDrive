import React, { useState } from 'react';
import {
  Tabs, Card, Form, Input, Select, Switch, Button, Table, Tag, Space, Typography,
  Divider, InputNumber, message, Alert, Badge, Tooltip, Modal, Popconfirm, Progress, Drawer
} from 'antd';
import {
  BankOutlined, ApiOutlined, KeyOutlined, SaveOutlined, ReloadOutlined,
  PlusOutlined, DeleteOutlined, CopyOutlined, EditOutlined, SwapOutlined,
  SafetyCertificateOutlined, ThunderboltOutlined, CloudServerOutlined,
  CheckCircleOutlined, CloseCircleOutlined, WarningOutlined,
  LockOutlined, EyeOutlined, SettingOutlined, DashboardOutlined,
  SyncOutlined, StopOutlined, CarOutlined, ShopOutlined, CoffeeOutlined,
  ShoppingCartOutlined, GiftOutlined, BulbOutlined, ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

// ============================================================
// TAB 1: BANK & FINTECH API CONNECTIONS
// ============================================================
interface BankProviderConfig {
  key: string;
  name: string;
  type: 'banking' | 'insurance' | 'kyc' | 'payment';
  environment: 'sandbox' | 'production';
  status: 'active' | 'inactive' | 'error';
  baseUrl: string;
  apiKey: string;
  apiSecret: string;
  lastHealthCheck: string;
  uptime: number;
  txnLimit: number;
  dailyLimit: number;
  monthlyLimit: number;
  timeout: number;
  retries: number;
  fallbackProvider: string;
}

const BankFintechTab: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [addProviderDrawerOpen, setAddProviderDrawerOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<BankProviderConfig | null>(null);
  const [addProviderForm] = Form.useForm();
  const [selectedType, setSelectedType] = useState<string>('banking');

  const [providers, setProviders] = useState<BankProviderConfig[]>([
    {
      key: '1', name: 'Primary Bank (Production)', type: 'banking', environment: 'production',
      status: 'active', baseUrl: 'https://api.testbank.com', apiKey: 'BANK_API_KEY_••••',
      apiSecret: '••••••••••••', lastHealthCheck: '30 sec ago', uptime: 99.97,
      txnLimit: 50000, dailyLimit: 500000, monthlyLimit: 5000000,
      timeout: 10000, retries: 3, fallbackProvider: 'Backup Bank',
    },
    {
      key: '2', name: 'Backup Bank (Failover)', type: 'banking', environment: 'production',
      status: 'inactive', baseUrl: 'https://api.backupbank.com', apiKey: 'BKUP_API_KEY_••••',
      apiSecret: '••••••••••••', lastHealthCheck: '5 min ago', uptime: 99.85,
      txnLimit: 50000, dailyLimit: 500000, monthlyLimit: 5000000,
      timeout: 10000, retries: 3, fallbackProvider: '',
    },
    {
      key: '3', name: 'Insurance Provider', type: 'insurance', environment: 'production',
      status: 'active', baseUrl: 'https://api.testinsurance.com', apiKey: 'INS_API_KEY_••••',
      apiSecret: '••••••••••••', lastHealthCheck: '1 min ago', uptime: 99.92,
      txnLimit: 100000, dailyLimit: 1000000, monthlyLimit: 10000000,
      timeout: 15000, retries: 2, fallbackProvider: '',
    },
    {
      key: '4', name: 'KYC / Identity Verification', type: 'kyc', environment: 'production',
      status: 'active', baseUrl: 'https://api.kycprovider.com', apiKey: 'KYC_API_KEY_••••',
      apiSecret: '••••••••••••', lastHealthCheck: '2 min ago', uptime: 99.99,
      txnLimit: 0, dailyLimit: 0, monthlyLimit: 0,
      timeout: 20000, retries: 2, fallbackProvider: '',
    },
    {
      key: '5', name: 'Stripe Payment Gateway', type: 'payment', environment: 'production',
      status: 'active', baseUrl: 'https://api.stripe.com/v1', apiKey: 'sk_live_••••••••',
      apiSecret: 'whsec_••••••••', lastHealthCheck: '15 sec ago', uptime: 99.99,
      txnLimit: 100000, dailyLimit: 2000000, monthlyLimit: 50000000,
      timeout: 10000, retries: 3, fallbackProvider: 'Paystack',
    },
    {
      key: '6', name: 'Paystack (Africa)', type: 'payment', environment: 'production',
      status: 'active', baseUrl: 'https://api.paystack.co', apiKey: 'sk_live_••••••••',
      apiSecret: '••••••••••••', lastHealthCheck: '1 min ago', uptime: 99.90,
      txnLimit: 50000, dailyLimit: 500000, monthlyLimit: 10000000,
      timeout: 10000, retries: 3, fallbackProvider: '',
    },
    {
      key: '7', name: 'Sandbox Bank (Testing)', type: 'banking', environment: 'sandbox',
      status: 'active', baseUrl: 'https://sandbox.testbank.com', apiKey: 'SBX_BANK_••••',
      apiSecret: '••••••••••••', lastHealthCheck: '10 min ago', uptime: 99.00,
      txnLimit: 1000, dailyLimit: 10000, monthlyLimit: 100000,
      timeout: 5000, retries: 5, fallbackProvider: '',
    },
  ]);

  const handleToggle = (key: string) => {
    setProviders(prev => prev.map(p => p.key === key ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p));
    message.success('Provider status updated');
  };

  const handleEdit = (provider: BankProviderConfig) => {
    setSelectedProvider(provider);
    setEditDrawerOpen(true);
  };

  const handleDeleteProvider = (key: string) => {
    setProviders(prev => prev.filter(p => p.key !== key));
    message.success('Provider removed');
  };

  const handleAddProvider = () => {
    addProviderForm.validateFields().then(values => {
      const newProvider: BankProviderConfig = {
        key: String(Date.now()),
        name: values.providerName,
        type: values.type,
        environment: values.environment,
        status: 'active',
        baseUrl: values.baseUrl,
        apiKey: values.apiKey || '',
        apiSecret: values.apiSecret || '',
        lastHealthCheck: 'Never',
        uptime: 0,
        txnLimit: values.txnLimit || 0,
        dailyLimit: values.dailyLimit || 0,
        monthlyLimit: values.monthlyLimit || 0,
        timeout: values.timeout || 10000,
        retries: values.retries || 3,
        fallbackProvider: values.fallbackProvider || '',
      };
      setProviders(prev => [...prev, newProvider]);
      addProviderForm.resetFields();
      setAddProviderDrawerOpen(false);
      message.success(`${values.providerName} added successfully — testing connection...`);
      setTimeout(() => message.success(`${values.providerName} connection verified ✓`), 1500);
    });
  };

  const wellKnownProviders: Record<string, { name: string; url: string; icon: string }[]> = {
    banking: [
      { name: 'Standard Bank', url: 'https://api.standardbank.co.za', icon: '🏦' },
      { name: 'First National Bank', url: 'https://api.fnb.co.za', icon: '🏦' },
      { name: 'Stanbic Bank', url: 'https://api.stanbicbank.co.zw', icon: '🏦' },
      { name: 'CBZ Bank', url: 'https://api.cbz.co.zw', icon: '🏦' },
      { name: 'Ecobank', url: 'https://api.ecobank.com', icon: '🏦' },
      { name: 'CABS', url: 'https://api.cabs.co.zw', icon: '🏦' },
      { name: 'Custom Bank', url: '', icon: '🏗️' },
    ],
    insurance: [
      { name: 'Old Mutual', url: 'https://api.oldmutual.com', icon: '🛡️' },
      { name: 'Sanlam', url: 'https://api.sanlam.com', icon: '🛡️' },
      { name: 'Nicoz Diamond', url: 'https://api.nicoz.co.zw', icon: '🛡️' },
      { name: 'First Mutual', url: 'https://api.firstmutual.co.zw', icon: '🛡️' },
      { name: 'Hollard Insurance', url: 'https://api.hollard.com', icon: '🛡️' },
      { name: 'Custom Insurance', url: '', icon: '🏗️' },
    ],
    kyc: [
      { name: 'Onfido', url: 'https://api.onfido.com/v3.6', icon: '🪪' },
      { name: 'Jumio', url: 'https://api.jumio.com', icon: '🪪' },
      { name: 'Trulioo', url: 'https://api.trulioo.com', icon: '🪪' },
      { name: 'Smile Identity', url: 'https://api.smileidentity.com', icon: '🪪' },
      { name: 'Veriff', url: 'https://api.veriff.com', icon: '🪪' },
      { name: 'Custom KYC', url: '', icon: '🏗️' },
    ],
    payment: [
      { name: 'Stripe', url: 'https://api.stripe.com/v1', icon: '💳' },
      { name: 'Paystack', url: 'https://api.paystack.co', icon: '💳' },
      { name: 'Flutterwave', url: 'https://api.flutterwave.com/v3', icon: '💳' },
      { name: 'DPO Group', url: 'https://api.dpogroup.com', icon: '💳' },
      { name: 'Paynow (ZW)', url: 'https://api.paynow.co.zw', icon: '💳' },
      { name: 'EcoCash API', url: 'https://api.ecocash.co.zw', icon: '📱' },
      { name: 'Innbucks', url: 'https://api.innbucks.co.zw', icon: '📱' },
      { name: 'Custom Gateway', url: '', icon: '🏗️' },
    ],
  };

  const typeColors = { banking: '#3b82f6', insurance: '#8b5cf6', kyc: '#f59e0b', payment: '#10b981' };
  const typeIcons = { banking: '🏦', insurance: '🛡️', kyc: '🪪', payment: '💳' };

  const columns = [
    {
      title: 'Provider',
      render: (_: any, r: BankProviderConfig) => (
        <Space>
          <div style={{
            width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${typeColors[r.type]}15`, fontSize: 20,
          }}>
            {typeIcons[r.type]}
          </div>
          <div>
            <Text strong style={{ fontSize: 13 }}>{r.name}</Text><br />
            <Text type="secondary" style={{ fontSize: 11, fontFamily: 'monospace' }}>{r.baseUrl}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={typeColors[type as keyof typeof typeColors]} style={{ textTransform: 'capitalize' }}>{type}</Tag>
      ),
    },
    {
      title: 'Environment',
      dataIndex: 'environment',
      width: 110,
      render: (env: string) => (
        <Badge status={env === 'production' ? 'success' : 'warning'} text={
          <Text style={{ fontSize: 12, textTransform: 'capitalize' as const }}>{env}</Text>
        } />
      ),
    },
    {
      title: 'Uptime',
      dataIndex: 'uptime',
      width: 90,
      render: (val: number) => (
        <Text style={{ fontFamily: 'monospace', fontWeight: 600, color: val > 99.5 ? '#10b981' : val > 99 ? '#f59e0b' : '#ef4444' }}>
          {val}%
        </Text>
      ),
    },
    {
      title: 'Health',
      dataIndex: 'lastHealthCheck',
      width: 100,
      render: (text: string, r: BankProviderConfig) => (
        <Tooltip title={`Last check: ${text}`}>
          {r.status === 'active' ? <CheckCircleOutlined style={{ color: '#10b981', fontSize: 16 }} />
            : r.status === 'error' ? <CloseCircleOutlined style={{ color: '#ef4444', fontSize: 16 }} />
            : <StopOutlined style={{ color: '#94a3b8', fontSize: 16 }} />}
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      width: 80,
      render: (_: any, r: BankProviderConfig) => (
        <Switch size="small" checked={r.status === 'active'} onChange={() => handleToggle(r.key)}
          checkedChildren="ON" unCheckedChildren="OFF" />
      ),
    },
    {
      title: 'Action',
      width: 110,
      render: (_: any, r: BankProviderConfig) => (
        <Space>
          <Tooltip title="Configure"><Button size="small" type="text" icon={<EditOutlined />} onClick={() => handleEdit(r)} /></Tooltip>
          <Tooltip title="Test Connection"><Button size="small" type="text" icon={<ReloadOutlined />}
            onClick={() => message.success(`${r.name} connection OK`)} /></Tooltip>
          <Popconfirm title="Remove this provider?" onConfirm={() => handleDeleteProvider(r.key)}>
            <Button size="small" type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Alert
        type="info" showIcon icon={<BankOutlined />}
        message="Bank & Fintech API Connections"
        description="Manage outgoing API connections to banks, insurance providers, KYC services, and payment gateways. These are the external financial services DashDrive connects to."
        style={{ marginBottom: 24, borderRadius: 12 }}
      />

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {(['banking', 'insurance', 'kyc', 'payment'] as const).map(type => {
          const active = providers.filter(p => p.type === type && p.status === 'active').length;
          const total = providers.filter(p => p.type === type).length;
          return (
            <Card key={type} size="small" style={{ borderRadius: 12, borderLeft: `3px solid ${typeColors[type]}` }}>
              <Space>
                <span style={{ fontSize: 24 }}>{typeIcons[type]}</span>
                <div>
                  <Text type="secondary" style={{ fontSize: 11, textTransform: 'capitalize' }}>{type}</Text>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{active}<Text type="secondary" style={{ fontSize: 14 }}>/{total}</Text></div>
                </div>
              </Space>
            </Card>
          );
        })}
      </div>

      {/* Provider Table */}
      <Card title={<Space><CloudServerOutlined /> Connected Providers</Space>}
        style={{ borderRadius: 12 }}
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setAddProviderDrawerOpen(true)} style={{ background: '#0e172a' }}>Add Provider</Button>}
      >
        <Table dataSource={providers} columns={columns} pagination={false} size="middle" />
      </Card>

      {/* Global Settings */}
      <Card
        title={<Space><SettingOutlined /> Connection Defaults</Space>}
        size="small" style={{ marginTop: 16, borderRadius: 12 }}
        styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0' } }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
          <Form.Item label="Default Timeout (ms)">
            <InputNumber defaultValue={10000} min={1000} max={60000} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Max Retries">
            <InputNumber defaultValue={3} min={0} max={10} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Health Check Interval">
            <Select defaultValue="30s">
              <Option value="10s">Every 10 sec</Option>
              <Option value="30s">Every 30 sec</Option>
              <Option value="60s">Every 1 min</Option>
              <Option value="300s">Every 5 min</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Failover Strategy">
            <Select defaultValue="automatic">
              <Option value="automatic">Automatic</Option>
              <Option value="manual">Manual</Option>
              <Option value="round_robin">Round Robin</Option>
            </Select>
          </Form.Item>
        </div>
      </Card>

      {/* Transaction Limits */}
      <Card
        title={<Space><SafetyCertificateOutlined /> Global Transaction Limits</Space>}
        size="small" style={{ marginTop: 16, borderRadius: 12 }}
        styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0' } }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <Form.Item label="Max Single Transaction ($)">
            <InputNumber defaultValue={50000} style={{ width: '100%' }} formatter={v => `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
          </Form.Item>
          <Form.Item label="Daily Transaction Cap ($)">
            <InputNumber defaultValue={500000} style={{ width: '100%' }} formatter={v => `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
          </Form.Item>
          <Form.Item label="Monthly Transaction Cap ($)">
            <InputNumber defaultValue={5000000} style={{ width: '100%' }} formatter={v => `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
          </Form.Item>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item label="Settlement Schedule">
            <Select defaultValue="daily">
              <Option value="realtime">Real-time</Option>
              <Option value="daily">Daily (T+1)</Option>
              <Option value="weekly">Weekly</Option>
              <Option value="monthly">Monthly</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Auto-Reconciliation">
            <Switch defaultChecked checkedChildren="Enabled" unCheckedChildren="Disabled" />
          </Form.Item>
        </div>
      </Card>

      {/* Edit Provider Modal */}
      <Drawer
        title={`Configure — ${selectedProvider?.name || ''}`}
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        width={700}
        extra={[
          <Button key="test" icon={<ReloadOutlined />} onClick={() => message.success('Connection test passed')}>Test Connection</Button>,
          <Button key="save" type="primary" icon={<SaveOutlined />} style={{ background: '#0e172a' }}
            onClick={() => { message.success('Provider settings saved'); setEditDrawerOpen(false); }}>
            Save Configuration
          </Button>,
        ]}
      >
        {selectedProvider && (
          <Form layout="vertical" initialValues={selectedProvider}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Form.Item label="Provider Name" name="name">
                <Input />
              </Form.Item>
              <Form.Item label="Environment" name="environment">
                <Select>
                  <Option value="sandbox"><Badge status="warning" text="Sandbox" /></Option>
                  <Option value="production"><Badge status="success" text="Production" /></Option>
                </Select>
              </Form.Item>
            </div>
            <Form.Item label="Base URL" name="baseUrl">
              <Input addonBefore="https://" />
            </Form.Item>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Form.Item label="API Key" name="apiKey">
                <Input.Password />
              </Form.Item>
              <Form.Item label="API Secret" name="apiSecret">
                <Input.Password />
              </Form.Item>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <Form.Item label="Max Transaction ($)" name="txnLimit">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
              <Form.Item label="Daily Limit ($)" name="dailyLimit">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
              <Form.Item label="Monthly Limit ($)" name="monthlyLimit">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <Form.Item label="Timeout (ms)" name="timeout">
                <InputNumber style={{ width: '100%' }} min={1000} max={60000} />
              </Form.Item>
              <Form.Item label="Retries" name="retries">
                <InputNumber style={{ width: '100%' }} min={0} max={10} />
              </Form.Item>
              <Form.Item label="Fallback Provider" name="fallbackProvider">
                <Input placeholder="None" />
              </Form.Item>
            </div>
          </Form>
        )}
      </Drawer>

      {/* ============================================================ */}
      {/* ADD PROVIDER MODAL                                           */}
      {/* ============================================================ */}
      <Drawer
        title={<Space><PlusOutlined /> Add API Provider</Space>}
        open={addProviderDrawerOpen}
        onClose={() => { setAddProviderDrawerOpen(false); addProviderForm.resetFields(); setSelectedType('banking'); }}
        width={780}
        extra={[
          <Button key="cancel" onClick={() => { setAddProviderDrawerOpen(false); addProviderForm.resetFields(); }}>Cancel</Button>,
          <Button key="test" icon={<ReloadOutlined />} onClick={() => {
            const url = addProviderForm.getFieldValue('baseUrl');
            if (url) { message.loading({ content: 'Testing...', key: 'test' }); setTimeout(() => message.success({ content: 'Connection successful', key: 'test' }), 1200); }
            else message.warning('Enter a Base URL first');
          }}>Test Connection</Button>,
          <Button key="add" type="primary" icon={<SaveOutlined />} style={{ background: '#0e172a' }} onClick={handleAddProvider}>
            Add Provider
          </Button>,
        ]}
      >
        <Form form={addProviderForm} layout="vertical" initialValues={{ type: 'banking', environment: 'production', timeout: 10000, retries: 3 }}>
          {/* Step 1: Provider Type */}
          <div style={{ marginBottom: 20 }}>
            <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>① Select Provider Type</Text>
            <Form.Item name="type" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                {(['banking', 'insurance', 'kyc', 'payment'] as const).map(type => (
                  <div key={type} onClick={() => { addProviderForm.setFieldValue('type', type); setSelectedType(type); addProviderForm.setFieldValue('preset', undefined); }}
                    style={{
                      padding: '14px 12px', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                      border: `2px solid ${selectedType === type ? typeColors[type] : '#e2e8f0'}`,
                      background: selectedType === type ? `${typeColors[type]}08` : 'white',
                      transition: 'all 0.2s',
                    }}>
                    <span style={{ fontSize: 28 }}>{typeIcons[type]}</span>
                    <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4, textTransform: 'capitalize' }}>{type}</div>
                  </div>
                ))}
              </div>
            </Form.Item>
          </div>

          {/* Step 2: Pick well-known or custom */}
          <div style={{ marginBottom: 20 }}>
            <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>② Choose Provider</Text>
            <Form.Item name="preset" style={{ marginBottom: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {(wellKnownProviders[selectedType] || []).map(p => (
                  <div key={p.name} onClick={() => {
                    addProviderForm.setFieldsValue({ preset: p.name, providerName: p.name, baseUrl: p.url });
                  }}
                    style={{
                      padding: '10px 8px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                      border: `1px solid ${addProviderForm.getFieldValue('preset') === p.name ? typeColors[selectedType as keyof typeof typeColors] : '#e2e8f0'}`,
                      background: addProviderForm.getFieldValue('preset') === p.name ? `${typeColors[selectedType as keyof typeof typeColors]}08` : 'white',
                      transition: 'all 0.15s',
                    }}>
                    <span style={{ fontSize: 18 }}>{p.icon}</span>
                    <div style={{ fontSize: 11, fontWeight: 500, marginTop: 2 }}>{p.name}</div>
                  </div>
                ))}
              </div>
            </Form.Item>
          </div>

          <Divider style={{ margin: '16px 0' }} />

          {/* Step 3: Details */}
          <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>③ Provider Details</Text>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <Form.Item label="Provider Name" name="providerName" rules={[{ required: true, message: 'Required' }]}>
              <Input placeholder="e.g. Standard Bank Production" />
            </Form.Item>
            <Form.Item label="Environment" name="environment" rules={[{ required: true }]}>
              <Select>
                <Option value="sandbox"><Badge status="warning" text="Sandbox" /></Option>
                <Option value="production"><Badge status="success" text="Production" /></Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="Base URL" name="baseUrl" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="https://api.provider.com/v1" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="API Key / Access Key" name="apiKey" rules={[{ required: true, message: 'Required' }]}>
              <Input.Password placeholder="Enter API key" />
            </Form.Item>
            <Form.Item label="API Secret / Auth Token" name="apiSecret" rules={[{ required: true, message: 'Required' }]}>
              <Input.Password placeholder="Enter API secret" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="Webhook / Callback URL" name="callbackUrl">
              <Input placeholder="https://api.dashdrive.app/webhooks/bank" />
            </Form.Item>
            <Form.Item label="IP Whitelist (comma separated)" name="ipWhitelist">
              <Input placeholder="e.g. 41.60.0.0/16, 196.21.0.0/16" />
            </Form.Item>
          </div>

          <Divider style={{ margin: '12px 0' }} />
          <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>④ Limits & Behaviour</Text>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item label="Max Transaction ($)" name="txnLimit">
              <InputNumber placeholder="50000" style={{ width: '100%' }} min={0} />
            </Form.Item>
            <Form.Item label="Daily Limit ($)" name="dailyLimit">
              <InputNumber placeholder="500000" style={{ width: '100%' }} min={0} />
            </Form.Item>
            <Form.Item label="Monthly Limit ($)" name="monthlyLimit">
              <InputNumber placeholder="5000000" style={{ width: '100%' }} min={0} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item label="Timeout (ms)" name="timeout">
              <InputNumber style={{ width: '100%' }} min={1000} max={60000} />
            </Form.Item>
            <Form.Item label="Max Retries" name="retries">
              <InputNumber style={{ width: '100%' }} min={0} max={10} />
            </Form.Item>
            <Form.Item label="Fallback Provider" name="fallbackProvider">
              <Select placeholder="None" allowClear>
                {providers.map(p => <Option key={p.key} value={p.name}>{p.name}</Option>)}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </div>
  );
};

// ============================================================
// TAB 2: DASHDRIVE DIRECT API (Incoming)
// ============================================================
interface ApiClient {
  key: string;
  clientName: string;
  clientId: string;
  apiKey: string;
  scopes: string[];
  rateLimit: number;
  status: 'active' | 'revoked' | 'expired';
  createdAt: string;
  lastUsed: string;
  requestsToday: number;
  totalRequests: number;
}

const DashDirectApiTab: React.FC = () => {
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [addForm] = Form.useForm();

  const availableScopes = [
    { group: 'Rides', scopes: ['rides:read', 'rides:write', 'rides:dispatch'] },
    { group: 'Food & Delivery', scopes: ['food:read', 'food:write', 'delivery:track'] },
    { group: 'Fintech', scopes: ['wallet:read', 'wallet:write', 'transfers:create', 'loans:read', 'insurance:read'] },
    { group: 'Users', scopes: ['users:read', 'users:write', 'users:verify'] },
    { group: 'Hotels', scopes: ['hotels:read', 'hotels:book', 'hotels:manage'] },
    { group: 'Events', scopes: ['events:read', 'events:book', 'events:manage'] },
    { group: 'Fuel', scopes: ['fuel:read', 'fuel:transact'] },
    { group: 'Transit', scopes: ['transit:read', 'transit:book'] },
    { group: 'Admin', scopes: ['admin:read', 'admin:write', 'admin:super'] },
  ];

  const [clients, setClients] = useState<ApiClient[]>([
    {
      key: '1', clientName: 'DashDrive User App (Android)', clientId: 'dd_android_usr_prod',
      apiKey: 'dd_live_sk_••••••••••••', scopes: ['rides:read', 'rides:write', 'food:read', 'food:write', 'wallet:read', 'wallet:write', 'hotels:read', 'hotels:book'],
      rateLimit: 1000, status: 'active', createdAt: '2024-01-15', lastUsed: 'Just now', requestsToday: 245000, totalRequests: 89000000,
    },
    {
      key: '2', clientName: 'DashDrive User App (iOS)', clientId: 'dd_ios_usr_prod',
      apiKey: 'dd_live_sk_••••••••••••', scopes: ['rides:read', 'rides:write', 'food:read', 'food:write', 'wallet:read', 'wallet:write', 'hotels:read', 'hotels:book'],
      rateLimit: 1000, status: 'active', createdAt: '2024-01-15', lastUsed: 'Just now', requestsToday: 198000, totalRequests: 72000000,
    },
    {
      key: '3', clientName: 'DashDrive Driver App', clientId: 'dd_driver_prod',
      apiKey: 'dd_live_sk_••••••••••••', scopes: ['rides:read', 'rides:dispatch', 'delivery:track', 'wallet:read', 'wallet:write'],
      rateLimit: 500, status: 'active', createdAt: '2024-01-20', lastUsed: '5 sec ago', requestsToday: 120000, totalRequests: 45000000,
    },
    {
      key: '4', clientName: 'Admin Panel', clientId: 'dd_admin_prod',
      apiKey: 'dd_live_sk_••••••••••••', scopes: ['admin:read', 'admin:write', 'users:read', 'users:write', 'rides:read', 'wallet:read'],
      rateLimit: 200, status: 'active', createdAt: '2024-02-01', lastUsed: '30 sec ago', requestsToday: 8500, totalRequests: 3200000,
    },
    {
      key: '5', clientName: 'Financier Partner Portal', clientId: 'dd_financier_prod',
      apiKey: 'dd_live_sk_••••••••••••', scopes: ['loans:read', 'insurance:read', 'wallet:read'],
      rateLimit: 100, status: 'active', createdAt: '2024-03-10', lastUsed: '2 min ago', requestsToday: 3200, totalRequests: 890000,
    },
    {
      key: '6', clientName: 'Insurance Partner Portal', clientId: 'dd_insurance_prod',
      apiKey: 'dd_live_sk_••••••••••••', scopes: ['insurance:read', 'users:read', 'users:verify'],
      rateLimit: 100, status: 'active', createdAt: '2024-04-05', lastUsed: '10 min ago', requestsToday: 1200, totalRequests: 340000,
    },
    {
      key: '7', clientName: 'Legacy App (Deprecated)', clientId: 'dd_legacy_v1',
      apiKey: 'dd_test_sk_••••••••••••', scopes: ['rides:read'],
      rateLimit: 10, status: 'expired', createdAt: '2023-06-01', lastUsed: '3 months ago', requestsToday: 0, totalRequests: 12000000,
    },
  ]);

  const handleRevoke = (key: string) => {
    setClients(prev => prev.map(c => c.key === key ? { ...c, status: 'revoked' } : c));
    message.warning('API key revoked');
  };

  const handleAdd = () => {
    const values = addForm.getFieldsValue();
    setClients(prev => [...prev, {
      key: String(Date.now()),
      clientName: values.clientName,
      clientId: `dd_${values.clientName.toLowerCase().replace(/\s+/g, '_')}_${Date.now().toString(36)}`,
      apiKey: `dd_live_sk_${Math.random().toString(36).substring(2, 20)}`,
      scopes: values.scopes || [],
      rateLimit: values.rateLimit || 100,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      requestsToday: 0,
      totalRequests: 0,
    }]);
    addForm.resetFields();
    setAddDrawerOpen(false);
    message.success('API client created — key generated');
  };

  const columns = [
    {
      title: 'Client',
      render: (_: any, r: ApiClient) => (
        <Space orientation="vertical" size={0}>
          <Text strong style={{ fontSize: 13 }}>{r.clientName}</Text>
          <Text type="secondary" style={{ fontSize: 11, fontFamily: 'monospace' }}>{r.clientId}</Text>
        </Space>
      ),
    },
    {
      title: 'Scopes',
      dataIndex: 'scopes',
      width: 180,
      render: (scopes: string[]) => (
        <Space wrap size={2}>
          {scopes.slice(0, 3).map(s => <Tag key={s} style={{ fontSize: 10 }}>{s}</Tag>)}
          {scopes.length > 3 && <Tag style={{ fontSize: 10 }}>+{scopes.length - 3}</Tag>}
        </Space>
      ),
    },
    {
      title: 'Rate Limit',
      dataIndex: 'rateLimit',
      width: 90,
      render: (val: number) => <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{val}/min</Text>,
    },
    {
      title: 'Today',
      dataIndex: 'requestsToday',
      width: 80,
      render: (val: number) => <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 90,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : status === 'revoked' ? 'error' : 'default'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Last Used',
      dataIndex: 'lastUsed',
      width: 100,
      render: (text: string) => <Text type="secondary" style={{ fontSize: 12 }}>{text}</Text>,
    },
    {
      title: 'Action',
      width: 110,
      render: (_: any, r: ApiClient) => (
        <Space>
          <Tooltip title="Copy API Key"><Button size="small" type="text" icon={<CopyOutlined />}
            onClick={() => message.success('API key copied to clipboard')} /></Tooltip>
          <Tooltip title="Rotate Key"><Button size="small" type="text" icon={<SyncOutlined />}
            onClick={() => message.info('Key rotated — old key valid for 24h')} /></Tooltip>
          {r.status === 'active' && (
            <Popconfirm title="Revoke this API key?" description="Client will lose access immediately." onConfirm={() => handleRevoke(r.key)}>
              <Button size="small" type="text" danger icon={<StopOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const activeClients = clients.filter(c => c.status === 'active').length;
  const totalToday = clients.reduce((s, c) => s + c.requestsToday, 0);

  return (
    <div>
      <Alert
        type="info" showIcon icon={<ApiOutlined />}
        message="DashDrive Direct API"
        description="Manage API keys and access for apps and external partners consuming DashDrive services. Control rate limits, scopes, and permissions per client."
        style={{ marginBottom: 24, borderRadius: 12 }}
      />

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <Card size="small" style={{ borderRadius: 12, borderLeft: '3px solid #10b981' }}>
          <Text type="secondary" style={{ fontSize: 11 }}>Active Clients</Text>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{activeClients}</div>
        </Card>
        <Card size="small" style={{ borderRadius: 12, borderLeft: '3px solid #3b82f6' }}>
          <Text type="secondary" style={{ fontSize: 11 }}>Requests Today</Text>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{(totalToday / 1000).toFixed(0)}K</div>
        </Card>
        <Card size="small" style={{ borderRadius: 12, borderLeft: '3px solid #8b5cf6' }}>
          <Text type="secondary" style={{ fontSize: 11 }}>API Version</Text>
          <div style={{ fontSize: 24, fontWeight: 700 }}>v2.4</div>
        </Card>
        <Card size="small" style={{ borderRadius: 12, borderLeft: '3px solid #f59e0b' }}>
          <Text type="secondary" style={{ fontSize: 11 }}>Revoked / Expired</Text>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#ef4444' }}>{clients.filter(c => c.status !== 'active').length}</div>
        </Card>
      </div>

      {/* Client Table */}
      <Card title={<Space><KeyOutlined /> API Clients</Space>} style={{ borderRadius: 12 }}
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setAddDrawerOpen(true)} style={{ background: '#0e172a' }}>Generate API Key</Button>}
      >
        <Table dataSource={clients} columns={columns} pagination={false} size="middle" />
      </Card>

      {/* API Security */}
      <Card
        title={<Space><LockOutlined /> API Security & Rate Limiting</Space>}
        size="small" style={{ marginTop: 16, borderRadius: 12 }}
        styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0' } }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <Form.Item label="Global Rate Limit (req/min)">
            <InputNumber defaultValue={5000} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="JWT Token Expiry (hours)">
            <InputNumber defaultValue={24} min={1} max={720} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Key Rotation Period">
            <Select defaultValue="90days">
              <Option value="30days">30 Days</Option>
              <Option value="60days">60 Days</Option>
              <Option value="90days">90 Days</Option>
              <Option value="180days">180 Days</Option>
              <Option value="never">Never (Manual)</Option>
            </Select>
          </Form.Item>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 12, border: '1px solid #f1f5f9', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text strong>CORS Enforcement</Text><br />
              <Text type="secondary" style={{ fontSize: 11 }}>Restrict cross-origin API requests</Text>
            </div>
            <Switch defaultChecked size="small" />
          </div>
          <div style={{ padding: 12, border: '1px solid #f1f5f9', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text strong>IP Whitelisting</Text><br />
              <Text type="secondary" style={{ fontSize: 11 }}>Only allow requests from approved IPs</Text>
            </div>
            <Switch size="small" />
          </div>
        </div>
      </Card>

      {/* API Versioning */}
      <Card
        title={<Space><SwapOutlined /> API Versioning</Space>}
        size="small" style={{ marginTop: 16, borderRadius: 12 }}
        styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0' } }}
      >
        <Table size="small" pagination={false} dataSource={[
          { key: '1', version: 'v2.4', status: 'current', released: '2026-02-15', clients: 5 },
          { key: '2', version: 'v2.3', status: 'supported', released: '2025-11-01', clients: 1 },
          { key: '3', version: 'v2.0', status: 'deprecated', released: '2025-06-01', clients: 1 },
          { key: '4', version: 'v1.0', status: 'sunset', released: '2024-01-01', clients: 0 },
        ]} columns={[
          { title: 'Version', dataIndex: 'version', render: (t: string) => <Tag style={{ fontFamily: 'monospace', fontWeight: 600 }}>{t}</Tag> },
          { title: 'Status', dataIndex: 'status', render: (s: string) => (
            <Tag color={s === 'current' ? 'green' : s === 'supported' ? 'blue' : s === 'deprecated' ? 'orange' : 'red'}>
              {s.toUpperCase()}
            </Tag>
          )},
          { title: 'Released', dataIndex: 'released' },
          { title: 'Active Clients', dataIndex: 'clients' },
          { title: 'Action', render: (_: any, r: any) => r.status === 'current' ? null : (
            <Button size="small" disabled={r.status === 'sunset'}>
              {r.status === 'deprecated' ? 'Force Sunset' : 'Deprecate'}
            </Button>
          )},
        ]} />
      </Card>

      <Drawer
        title="Create API Client"
        open={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        width={600}
        extra={[
          <Button key="cancel" onClick={() => setAddDrawerOpen(false)}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={handleAdd} style={{ background: '#0e172a' }}>Generate Key</Button>
        ]}
      >
        <Alert type="warning" showIcon message="A new API key will be generated. Store it securely — it will only be shown once." style={{ marginBottom: 16, borderRadius: 10 }} />
        <Form form={addForm} layout="vertical">
          <Form.Item label="Client Name" name="clientName" rules={[{ required: true }]}>
            <Input placeholder="e.g. Partner App, Webhook Service" />
          </Form.Item>
          <Form.Item label="Access Scopes" name="scopes" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="Select API scopes"
              options={availableScopes.flatMap(g => g.scopes.map(s => ({ label: `${g.group} → ${s}`, value: s })))}
            />
          </Form.Item>
          <Form.Item label="Rate Limit (requests/minute)" name="rateLimit">
            <InputNumber defaultValue={100} min={1} max={10000} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export const ApiManagementPage: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>API Management</Title>
        <Text type="secondary">Control bank connections, fintech integrations, and DashDrive Direct API access</Text>
      </div>

      <Tabs
        defaultActiveKey="bank"
        type="card"
        size="large"
        items={[
          {
            key: 'bank',
            label: <span><BankOutlined /> Bank & Fintech APIs</span>,
            children: <BankFintechTab />,
          },
          {
            key: 'direct',
            label: <span><ApiOutlined /> DashDrive Direct API</span>,
            children: <DashDirectApiTab />,
          },
        ]}
        style={{ background: 'white', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}
      />
    </div>
  );
};

