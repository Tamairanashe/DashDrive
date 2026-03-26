import React, { useState, useEffect } from 'react';
import { 
  Table, Tag, Button, Space, Typography, Card, Badge, Row, Col, 
  Tabs, Statistic, Drawer, Descriptions, Alert, Input, Form,
  Timeline, Divider, message, Switch, List, Progress, Avatar,
  Select, Empty, Tooltip, Steps, Checkbox, InputNumber, Segmented, Result, Modal
} from 'antd';
import { 
  BankOutlined, ApiOutlined, SafetyCertificateOutlined, 
  GlobalOutlined, KeyOutlined, MedicineBoxOutlined, 
  RocketOutlined, CheckCircleOutlined, SyncOutlined,
  StopOutlined, WarningOutlined, DatabaseOutlined,
  CodeOutlined, DashboardOutlined, BuildOutlined,
  BellOutlined, CloudServerOutlined, LineChartOutlined,
  UndoOutlined, WalletOutlined, PlusOutlined,
  HistoryOutlined, DollarOutlined, AuditOutlined,
  InfoCircleOutlined, EyeOutlined, CheckSquareOutlined,
  FileSearchOutlined, ReconciliationOutlined, DeploymentUnitOutlined,
  SwapOutlined, ThunderboltOutlined, MobileOutlined, VerifiedOutlined,
  InteractionOutlined, SecurityScanOutlined, PartitionOutlined,
  ArrowRightOutlined, SettingOutlined, UserOutlined, DeleteOutlined, DownloadOutlined
} from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { fintechHubApi } from '../api/fintechHubApi';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface FintechPartner {
  key: string;
  name: string;
  type: 'Bank' | 'Insurance' | 'Digital Wallet';
  status: 'Connected' | 'Onboarding' | 'Revoked' | 'Maintenance';
  activeProducts: number;
  apiHealth: number; // percentage
  latency: number; // ms
  joinedDate: string;
  config?: any;
}

interface WebhookLog {
  id: string;
  event: string;
  timestamp: string;
  status: '200 OK' | '500 Error' | '401 Unauthorized';
  latency: number;
}

interface ReversalRecord {
  key: string;
  orderId: string;
  partner: string;
  amount: number;
  reason: string;
  status: 'Pending' | 'Succeeded' | 'Failed';
  date: string;
}

interface ApiRequestLog {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  status: number;
  time: string;
  latency: number;
  payloadSize: string;
}

export const FintechPartnerHub: React.FC = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [selectedPartner, setSelectedPartner] = useState<FintechPartner | null>(null);
  
  // --- Middleware Orchestration States ---
  const [routingMode, setRoutingMode] = useState<'smart' | 'manual'>('smart');
  const [switchStatus, setSwitchStatus] = useState<'active' | 'degraded' | 'maintenance'>('active');
  const [isPayoutSimulationRunning, setIsPayoutSimulationRunning] = useState(false);
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [isReversalDrawerVisible, setIsReversalDrawerVisible] = useState(false);
  const [reversalForm] = Form.useForm();
  const [onboardForm] = Form.useForm();
  const [isSandboxVisible, setIsSandboxVisible] = useState(false);
  const [isOnboardDrawerVisible, setIsOnboardDrawerVisible] = useState(false);
  const [isManageApiVisible, setIsManageApiVisible] = useState(false);
  const [manageApiForm] = Form.useForm();
  const [isThresholdDrawerVisible, setIsThresholdDrawerVisible] = useState(false);
  const [thresholdForm] = Form.useForm();
  const [sandboxJson, setSandboxJson] = useState(JSON.stringify({
    product_name: "Instant Driver Loan",
    provider: "Standard Bank",
    interest_rate: 4.5,
    max_amount: 1000,
    repayment_period: "30 Days",
    eligibility: ["Driver Score > 90", "Active for 6 Months"]
  }, null, 2));
  const [sandboxPreview, setSandboxPreview] = useState<any>(null);
  const [validationStatus, setValidationStatus] = useState<'none' | 'validating' | 'success' | 'error'>('none');

  const [partners, setPartners] = useState<FintechPartner[]>([
    {
      key: 'p1',
      name: 'Standard Bank Group',
      type: 'Bank',
      status: 'Connected',
      activeProducts: 4,
      apiHealth: 99.8,
      latency: 45,
      joinedDate: '12 Jan 2024'
    },
    {
      key: 'p2',
      name: 'SafeStep Insurance',
      type: 'Insurance',
      status: 'Connected',
      activeProducts: 2,
      apiHealth: 94.2,
      latency: 120,
      joinedDate: '05 Mar 2024'
    },
    {
      key: 'p4',
      name: 'Paynow Zimbabwe',
      type: 'Digital Wallet',
      status: 'Connected',
      activeProducts: 3,
      apiHealth: 99.9,
      latency: 15,
      joinedDate: '13 Mar 2024'
    },
    {
      key: 'p3',
      name: 'EcoCash Ecosystem',
      type: 'Digital Wallet',
      status: 'Maintenance',
      activeProducts: 1,
      apiHealth: 0,
      latency: 0,
      joinedDate: '20 May 2024'
    }
  ]);

  const webhookLogs: WebhookLog[] = [
    { id: 'wh1', event: 'loan.application.submitted', timestamp: '14:30:22', status: '200 OK', latency: 88 },
    { id: 'wh2', event: 'policy.issued', timestamp: '14:28:10', status: '200 OK', latency: 42 },
    { id: 'wh3', event: 'kyc.verification.failed', timestamp: '14:25:05', status: '500 Error', latency: 2400 },
    { id: 'wh4', event: 'settlement.reversal.initiated', timestamp: '14:20:15', status: '200 OK', latency: 110 },
  ];

  const [reversals, setReversals] = useState<ReversalRecord[]>([
    { key: 'rev1', orderId: '#ORD-9981', partner: 'Standard Bank', amount: 45.00, reason: 'Ride Cancelled (Post-Payment)', status: 'Succeeded', date: '20 July, 09:00' },
    { key: 'rev2', orderId: '#ORD-9922', partner: 'EcoCash', amount: 12.50, reason: 'Duplicate Transaction', status: 'Pending', date: '20 July, 10:15' },
    { key: 'rev3', orderId: '#ORD-9855', partner: 'SafeStep', amount: 120.00, reason: 'Chargeback Requested', status: 'Failed', date: '19 July, 22:30' },
  ]);

  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchProviders = async () => {
    try {
      const res = await fintechHubApi.providers.list();
      // If we have real DB providers, we merge or replace the mock ones
      if (res.data && res.data.length > 0) {
        const enriched = res.data.map((p: any) => ({
          key: p.key,
          name: p.name,
          type: p.type,
          status: p.isActive ? 'Connected' : 'Maintenance',
          activeProducts: p.activeProducts || 0,
          apiHealth: p.apiHealth || 99,
          latency: p.latency || 50,
          joinedDate: p.joinedDate || 'Recent',
          config: p // Keep the full config for "Manage API"
        }));
        setPartners(enriched);
      }
    } catch (err) {
      console.error("Failed to fetch providers", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const trxRes = await fintechHubApi.admin.getTransactions();
        setTransactions(Array.isArray(trxRes.data) ? trxRes.data : []);
        await fetchProviders();
      } catch (err) {
        console.error("Failed to fetch fintech hub data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const healthData = [
    { time: '00:00', calls: 450, success: 448 },
    { time: '04:00', calls: 320, success: 315 },
    { time: '08:00', calls: 1200, success: 1195 },
    { time: '12:00', calls: 2100, success: 2090 },
    { time: '16:00', calls: 1800, success: 1780 },
    { time: '20:00', calls: 950, success: 948 },
    { time: '23:59', calls: 500, success: 498 },
  ];

  const apiRequestLogs: ApiRequestLog[] = [
    { id: 'req1', method: 'POST', path: '/v1/loans/apply', status: 201, time: '14:35:10', latency: 145, payloadSize: '2.4KB' },
    { id: 'req2', method: 'GET', path: '/v1/insurance/policies', status: 200, time: '14:32:05', latency: 89, payloadSize: '1.1KB' },
    { id: 'req3', method: 'POST', path: '/v1/settlements/reversal', status: 202, time: '14:30:00', latency: 210, payloadSize: '0.8KB' },
    { id: 'req4', method: 'PUT', path: '/v1/partners/profile', status: 401, time: '14:28:45', latency: 45, payloadSize: '4.2KB' },
  ];

  const pendingSubmissions = [
    { 
      id: 'sub1', 
      provider: 'Standard Bank', 
      product: 'Driver SMB Loan', 
      type: 'Financing',
      submittedAt: '2 days ago',
      status: 'In Risk Review',
      riskScore: 12,
      diff: {
        interest_rate: { old: 5.5, new: 4.5 },
        max_amount: { old: 500, new: 1000 }
      }
    },
    { 
      id: 'sub2', 
      provider: 'SafeStep', 
      product: 'Fleet Protection Plus', 
      type: 'Insurance',
      submittedAt: '5 hours ago',
      status: 'Compliance Check',
      riskScore: 5,
      diff: {
        premium: { old: 'N/A', new: '$12/mo' }
      }
    }
  ];

  const handleManualReversal = async (values: any) => {
    setLoading(true);
    message.loading('Initiating inter-ledger reversal...', 2);
    try {
      // Find the transaction record mapping if available, or just send IDs
      await fintechHubApi.payments.refund({
        transaction_id: values.orderId, // Should ideally be transaction ID
        refund_amount: values.amount,
        reason: values.reason
      });
      
      const newRev: ReversalRecord = {
        key: `rev${Date.now()}`,
        orderId: values.orderId,
        partner: values.partner,
        amount: values.amount,
        reason: values.reason,
        status: 'Pending',
        date: new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
      };
      setReversals([newRev, ...reversals]);
      setIsReversalDrawerVisible(false);
      reversalForm.resetFields();
      message.success('Reversal request transmitted to partner gateway.');
    } catch (err) {
      message.error('Failed to initiate reversal.');
    } finally {
      setLoading(false);
    }
  };


  const handleOnboardProvider = async (values: any) => {
    setLoading(true);
    message.loading('Registering and configuring new financial partner...', 2);
    try {
      const providerKey = values.name.toLowerCase().replace(/\s+/g, '_');
      await fintechHubApi.providers.upsert(providerKey, {
        name: values.name,
        type: values.type,
        endpoint: values.endpoint,
        isActive: true,
        joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      });
      
      message.success(`${values.name} successfully registered and configured.`);
      setIsOnboardDrawerVisible(false);
      onboardForm.resetFields();
      fetchProviders();
    } catch (err) {
      message.error('Failed to register partner API.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitToUnderwriting = () => {
    setLoading(true);
    message.loading('Transmitting sandbox product to Risk Dept...', 2).then(() => {
      setLoading(false);
      setIsSandboxVisible(false);
      message.success('Product submitted for underwriting. You will receive a webhook notification upon approval.');
    });
  };
  const handleDownloadAudit = async () => {
    message.loading('Generating real-time compliance audit snapshot...', 2);
    try {
      const response = await fintechHubApi.compliance.getAudit();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Compliance_Audit_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      message.success('Compliance audit generated and downloaded successfully.');
    } catch (err) {
      console.error("Audit export failed", err);
      message.error('Failed to generate compliance audit.');
    }
  };

  const handleUpdateThresholds = async (values: any) => {
    setLoading(true);
    message.loading('Syncing risk tripwires with middleware orchestration layer...', 2);
    try {
      await fintechHubApi.compliance.updateThresholds(values);
      message.success('Global compliance thresholds updated and propagated.');
      setIsThresholdDrawerVisible(false);
    } catch (err) {
      message.error('Failed to push compliance threshold changes.');
    } finally {
      setLoading(false);
    }
  };

  const handleManageApi = async (values: any) => {
    if (!selectedPartner) return;
    setLoading(true);
    try {
      await fintechHubApi.providers.upsert(selectedPartner.key, {
        ...selectedPartner,
        ...values,
        isActive: values.isActive ?? true
      });
      message.success(`API Configuration for ${selectedPartner.name} updated successfully.`);
      setIsManageApiVisible(false);
      fetchProviders();
    } catch (err) {
      message.error('Failed to update API configuration.');
    } finally {
      setLoading(false);
    }
  };
  const handleDeletePartner = async (partner: FintechPartner) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this partner?',
      content: 'This will remove the API integration and all technical configurations. It cannot be undone.',
      okText: 'Delete Partner',
      okType: 'danger',
      onOk: async () => {
        try {
          await fintechHubApi.providers.delete(partner.key);
          message.success(`${partner.name} has been removed from the registry.`);
          setIsDeepDiveVisible(false);
          fetchProviders();
        } catch (err) {
          message.error('Failed to delete partner.');
        }
      }
    });
  };


  const [isDeepDiveVisible, setIsDeepDiveVisible] = useState(false);
  const [activeWebhook, setActiveWebhook] = useState<WebhookLog | null>(null);

  // --- Middleware Mock Data ---
  const recentTransactions = [
    { key: 'trx-1', id: 'DASH_BT_991', type: 'Bank Transfer', provider: 'Standard Bank', amount: 45.00, status: 'Completed', time: '10:24 AM' },
    { key: 'trx-p2p-1', id: 'P2P_WL_102', type: 'P2P Transfer', provider: 'DashWallet', amount: 15.00, status: 'Completed', time: '10:28 AM' },
    { key: 'trx-2', id: 'DASH_MM_442', type: 'Mobile Money', provider: 'EcoCash', amount: 12.50, status: 'Standard', time: '10:30 AM' },
    { key: 'trx-3', id: 'DASH_BP_110', type: 'Bill Payment', provider: 'ZESA', amount: 20.00, status: 'Completed', time: '10:45 AM' },
    { key: 'trx-p2p-2', id: 'P2P_WL_105', type: 'P2P Transfer', provider: 'DashWallet', amount: 10.00, status: 'Completed', time: '10:55 AM' },
    { key: 'trx-4', id: 'DASH_AL_008', type: 'Loan Disburse', provider: 'DashDrive Finance', amount: 500.00, status: 'Processing', time: '11:02 AM' },
  ];

  const recentTrxColumns = [
    { title: 'Trx ID', dataIndex: 'id', key: 'id', width: 150, render: (t: string) => <Text code>{t}</Text> },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 120 },
    { title: 'Provider', dataIndex: 'provider', key: 'provider', width: 150 },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 100, render: (a: number) => <Text strong>${a.toFixed(2)}</Text> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (s: string) => <Badge status={s === 'Completed' ? 'success' : 'processing'} text={s} /> },
    { title: 'Time', dataIndex: 'time', key: 'time', width: 100 },
  ];

  const renderMiddleWareStats = () => (
    <Row gutter={16}>
      <Col span={6}>
        <Card variant="borderless" style={{ background: isDark ? '#1d1d1d' : '#f0f5ff' }}>
          <Statistic title="Routing Success" value={98.5} suffix="%" valueStyle={{ color: '#52c41a' }} />
          <Text type="secondary" style={{ fontSize: 12 }}>Smart Fallback Level: 1</Text>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" style={{ background: isDark ? '#1d1d1d' : '#fff7e6' }}>
          <Statistic title="Avg Switch Latency" value={142} suffix="ms" valueStyle={{ color: '#fa8c16' }} />
          <Text type="secondary" style={{ fontSize: 12 }}>P99: 210ms</Text>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" style={{ background: isDark ? '#1d1d1d' : '#f6ffed' }}>
          <Statistic title="Active Nodes" value={3} suffix="/ 4" />
          <Text type="secondary" style={{ fontSize: 12 }}>Node 4: Maintenance</Text>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" style={{ background: isDark ? '#1d1d1d' : '#fff1f0' }}>
          <Statistic title="Blocked (Fraud)" value={12} valueStyle={{ color: '#ff4d4f' }} />
          <Text type="secondary" style={{ fontSize: 12 }}>Last 1h detections</Text>
        </Card>
      </Col>
    </Row>
  );

  const renderTelecomHub = () => (
    <div style={{ padding: 24 }}>
      <Row gutter={24}>
        <Col span={16}>
          <Card variant="borderless" className="shadow-sm" title={<Space><MobileOutlined /> Regional Telecom Aggregation</Space>}>
            <Table 
              size="small"
              pagination={false}
              scroll={{ x: 'max-content' }}
              dataSource={[
                { network: 'EcoCash Mobile Money', type: 'Wallet', latency: '250ms', success: '99.2%', fallback: 'OneMoney' },
                { network: 'Econet Wireless', type: 'Airtime/Data', latency: '400ms', success: '98.5%', fallback: 'NetOne' },
                { network: 'ZOL Internet', type: 'Fiber/LTE', latency: '600ms', success: '97.1%', fallback: 'Liquid' },
              ]}
              columns={[
                { title: 'Provider Network', dataIndex: 'network', key: 'network', width: 180, render: (t) => <Text strong>{t}</Text> },
                { title: 'Service Type', dataIndex: 'type', key: 'type', width: 120 },
                { title: 'Avg Latency', dataIndex: 'latency', key: 'latency', width: 100 },
                { title: 'Success Rate', dataIndex: 'success', key: 'success', width: 100, render: (s) => <Tag color="green">{s}</Tag> },
                { title: 'Smart Fallback', dataIndex: 'fallback', key: 'fallback', width: 120, render: (f) => <Tag color="orange" icon={<SyncOutlined spin />}>{f}</Tag> }
              ]}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card variant="borderless" className="shadow-sm" title="Real-time Topup Monitor">
             <div style={{ height: 300, background: '#1e1e1e', borderRadius: 8, padding: 12, overflow: 'auto' }}>
                <pre style={{ color: '#52c41a', fontSize: 11 }}>
{`[${new Date().toLocaleTimeString()}] TOPUP_REQ: 077XXXXX
[${new Date().toLocaleTimeString()}] PROTOCOL: SOAP/XML
[${new Date().toLocaleTimeString()}] STATUS: EXECUTED
[${new Date().toLocaleTimeString()}] BATCH_ID: ZIM_TRX_992`}
                </pre>
             </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderBillsOrchestrator = () => (
    <div style={{ padding: 24 }}>
      <Row gutter={24}>
        <Col span={12}>
           <Card variant="borderless" className="shadow-sm" title={<Space><ThunderboltOutlined /> Utility Switch (Water/Power)</Space>}>
             <Space orientation="vertical" style={{ width: '100%' }} size="large">
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space><Avatar size="large" src="https://www.paynow.co.zw/Content/img/logo.png" /> <Text strong>Paynow BillPay Engine</Text></Space>
                    <Tag color="green">INTEGRATED</Tag>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space><Avatar size="large" icon={<ThunderboltOutlined />} /> <Text strong>ZESA (Prepaid Electricity)</Text></Space>
                    <Tag color="blue">CONNECTED VIA PAYNOW</Tag>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space><Avatar size="large" icon={<GlobalOutlined />} /> <Text strong>City Council (Water)</Text></Space>
                    <Tag color="orange">LEGACY (DIRECT)</Tag>
                 </div>
                <Divider />
                <Button block type="primary" icon={<PlusOutlined />}>Connect New Utility Provider</Button>
             </Space>
           </Card>
        </Col>
        <Col span={12}>
           <Card variant="borderless" className="shadow-sm" title="Biller Aggregation Logs">
              <Table 
                size="small" 
                pagination={false}
                scroll={{ x: 'max-content' }}
                dataSource={[
                  { acc: '14420-992', biller: 'ZESA', status: 'Success', amount: '$20.00' },
                  { acc: '9881-220', biller: 'ZOL', status: 'Pending', amount: '$45.00' },
                ]}
                columns={[
                  { title: 'Account', dataIndex: 'acc', key: 'acc', width: 120 },
                  { title: 'Biller', dataIndex: 'biller', key: 'biller', width: 100 },
                  { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 100 },
                  { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (s) => <Badge status={s === 'Success' ? 'success' : 'processing'} text={s} /> }
                ]}
              />
           </Card>
        </Col>
      </Row>
    </div>
  );

  const renderSettlementEngine = () => (
    <div style={{ padding: 24 }}>
       <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card variant="borderless" className="shadow-sm" style={{ background: isDark ? '#141414' : '#fff7e6', borderRadius: 16 }}>
              <Row align="middle" justify="space-between">
                <Col>
                  <Space size="large">
                    <Avatar size={48} icon={<BankOutlined />} style={{ background: '#fa8c16' }} />
                    <div>
                      <Title level={5} style={{ margin: 0 }}>Core Banking Bridge</Title>
                      <Text type="secondary">Real-time Bank Settlement & Reconciliation Engine</Text>
                    </div>
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <Badge status="processing" text={<Text strong style={{ color: '#fa8c16' }}>PROD MODE ACTIVE</Text>} />
                    <Divider orientation="vertical" />
                    <Button icon={<SettingOutlined />}>Configure API</Button>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={16}>
             <Card variant="borderless" className="shadow-sm" title={<Space><SwapOutlined /> P2P Command Center</Space>} style={{ borderRadius: 16 }}>
                <Row gutter={16} style={{ marginBottom: 24 }}>
                   <Col span={8}>
                      <Statistic title="P2P Volume (24h)" value={12540.50} prefix="$" precision={2} />
                   </Col>
                   <Col span={8}>
                      <Statistic title="Active Peer Pairs" value={842} prefix={<UserOutlined />} />
                   </Col>
                   <Col span={8}>
                      <Statistic title="Instant Settlements" value={100} suffix="%" valueStyle={{ color: '#52c41a' }} />
                   </Col>
                </Row>
                
                <Title level={5}>Recent Cross-Role Transfers</Title>
                <Table 
                  size="small"
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                  dataSource={[
                    { key: '1', from: 'Driver Dave', to: 'User Sarah', amount: 15.00, type: 'Rider -> Customer', time: '2 mins ago' },
                    { key: '2', from: 'User Sarah', to: 'User Mart', amount: 10.00, type: 'Customer -> Merchant', time: '5 mins ago' },
                    { key: '3', from: 'Merchant Joe', to: 'Driver Mike', amount: 50.00, type: 'Merchant -> Rider', time: '12 mins ago' },
                  ]}
                  columns={[
                    { title: 'Recipient', key: 'recipient', width: 180, render: (_, r) => <Space><Avatar size="small" /> <Text>{r.to}</Text></Space> },
                    { title: 'Type', dataIndex: 'type', key: 'type', width: 140, render: (t) => <Tag color="blue">{t}</Tag> },
                    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 100, render: (a) => <Text strong>${a.toFixed(2)}</Text> },
                    { title: 'Time', dataIndex: 'time', key: 'time', width: 120 },
                  ]}
                />
             </Card>
          </Col>

          <Col span={8}>
             <Card variant="borderless" className="shadow-sm" title={<Space><AuditOutlined /> Settlement Hook Health</Space>} style={{ borderRadius: 16 }}>
                <Timeline 
                  items={[
                    { color: 'green', children: 'Bank API Auth Success (16:00 CAT)' },
                    { color: 'green', children: 'Internal Ledger Sync Complete' },
                    { color: 'blue', children: 'Settling Batched P2P Transfers...' },
                    { color: 'gray', children: 'Reconciliation Report Generation' },
                  ]}
                />
                <Divider />
                <Button block danger icon={<WarningOutlined />}>Emergency Halt Settlement</Button>
             </Card>
          </Col>

          <Col span={24}>
             <Card variant="borderless" className="shadow-sm" title={<Space><ReconciliationOutlined /> Unified Global Ledger</Space>} style={{ borderRadius: 16 }}>
                <Table 
                  size="middle"
                  scroll={{ x: 'max-content' }}
                  dataSource={[
                    { key: 'l1', id: 'TX-9921', entity: 'User Sarah', type: 'P2P DEBIT', amount: -10.00, bankStatus: 'Settled', ledger: 'Internal' },
                    { key: 'l2', id: 'TX-9921', entity: 'User Mart', type: 'P2P CREDIT', amount: 10.00, bankStatus: 'Settled', ledger: 'Internal' },
                    { key: 'l3', id: 'WDL-001', entity: 'Driver Mike', type: 'WITHDRAWAL', amount: -50.00, bankStatus: 'Pending', ledger: 'External' },
                  ]}
                  columns={[
                    { title: 'Local TX ID', dataIndex: 'id', key: 'id', width: 120, render: (id) => <Text code>{id}</Text> },
                    { title: 'Entity', dataIndex: 'entity', key: 'entity', width: 150 },
                    { title: 'Type', dataIndex: 'type', key: 'type', width: 120 },
                    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 100, render: (a) => <Text style={{ color: a < 0 ? '#ff4d4f' : '#52c41a' }} strong>{a > 0 ? '+' : ''}{a.toFixed(2)}</Text> },
                    { title: 'Bank Settlement', dataIndex: 'bankStatus', key: 'bankStatus', width: 150, render: (s) => <Badge status={s === 'Settled' ? 'success' : 'warning'} text={s} /> },
                  ]}
                />
             </Card>
          </Col>
       </Row>
    </div>
  );
  const renderWebhookObserver = () => (
    <div style={{ padding: 24 }}>
      <Card 
        variant="borderless" 
        className="shadow-sm" 
        title={<Space><BellOutlined /> Real-time Webhook Observer</Space>}
        extra={<Button size="small" type="link">View All</Button>}
        style={{ borderRadius: 16 }}
      >
        <List
          dataSource={webhookLogs}
          renderItem={item => (
            <List.Item style={{ padding: '12px 0' }}>
              <List.Item.Meta
                avatar={<Badge status={item.status === '200 OK' ? 'success' : 'error'} />}
                title={<div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 13 }}>{item.event}</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>{item.timestamp}</Text>
                </div>}
                description={
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>{item.status}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>{item.latency}ms</Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );

  const renderUnderwritingSandbox = () => (
    <div style={{ padding: 24 }}>
       <Row gutter={24}>
          <Col span={8}>
            <Card 
              variant="borderless" 
              className="shadow-sm" 
              title={<Space><MedicineBoxOutlined /> Pending Submissions</Space>}
              style={{ borderRadius: 16 }}
            >
               <Alert 
                 title="3 New Products Pending"
                 type="warning"
                 showIcon
                 style={{ marginBottom: 16 }}
               />
               <Steps
                 orientation="vertical"
                 size="small"
                 current={1}
                 items={pendingSubmissions.map(sub => ({
                   title: <Text strong style={{ fontSize: 13 }}>{sub.provider}: {sub.product}</Text>,
                   content: (
                     <div style={{ fontSize: 11 }}>
                       <Tag color={sub.type === 'Financing' ? 'blue' : 'purple'}>{sub.type}</Tag>
                       <Text type="secondary">{sub.status}</Text>
                     </div>
                   )
                 }))}
               />
               <Button 
                 block 
                 type="primary" 
                 style={{ marginTop: 16 }} 
                 icon={<FileSearchOutlined />}
                 onClick={() => {
                   Modal.info({
                     title: 'Marketplace Underwriting Review',
                     width: 700,
                     content: (
                       <div style={{ marginTop: 20 }}>
                         <Title level={5}>Pending Detailed Review: Standard Bank</Title>
                         <Paragraph>System detected a 1.0% interest rate reduction proposing wider market capture.</Paragraph>
                         <Card size="small" title="Schema Comparison (Diff)" style={{ background: isDark ? '#141414' : '#fafafa' }}>
                           <Row gutter={16}>
                             <Col span={12}>
                               <Text type="secondary">Current Approved</Text>
                               <div style={{ background: '#fff1f0', padding: 8, borderRadius: 4, marginTop: 4 }}>
                                 <Text delete type="danger">interest_rate: 5.5%</Text><br />
                                 <Text delete type="danger">max_amount: $500</Text>
                               </div>
                             </Col>
                             <Col span={12}>
                               <Text type="secondary">Proposed Draft</Text>
                               <div style={{ background: '#f6ffed', padding: 8, borderRadius: 4, marginTop: 4 }}>
                                 <Text strong style={{ color: '#52c41a' }}>interest_rate: 4.5%</Text><br />
                                 <Text strong style={{ color: '#52c41a' }}>max_amount: $1000</Text>
                               </div>
                             </Col>
                           </Row>
                         </Card>
                         <Divider />
                         <Title level={5}>Compliance Verification</Title>
                         <List 
                           size="small"
                           dataSource={['Interest ceiling check (USURY v2)', 'Repayment tenure validation', 'Partner liquitity buffer verified']}
                           renderItem={item => <List.Item><Space><CheckCircleOutlined style={{ color: '#52c41a' }} /> {item}</Space></List.Item>}
                         />
                       </div>
                     ),
                     okText: 'Approve & Activate',
                     onOk: () => message.success('Product live on Marketplace')
                   });
                 }}
               >
                 Full Review Submissions
               </Button>
            </Card>
          </Col>
          <Col span={16}>
             <Card 
               variant="borderless" 
               className="shadow-sm" 
               title={<Space><RocketOutlined /> Launchpad Lab</Space>}
               style={{ borderRadius: 16, minHeight: 400 }}
             >
                <Result
                  title="Underwriting Lab Active"
                  subTitle="Use the Marketplace Sandbox button in the header to initialize new product schemas for automated compliance testing."
                  extra={<Button type="primary" icon={<BuildOutlined />} onClick={() => setIsSandboxVisible(true)}>Open Marketplace Sandbox</Button>}
                />
             </Card>
             </Col>
          </Row>
       </div>
    );


  const partnerColumns = [
    {
      title: 'Provider',
      dataIndex: 'name',
      width: 250,
      render: (name: string, record: FintechPartner) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          <Space>
            <Avatar icon={record.type === 'Bank' ? <BankOutlined /> : record.type === 'Insurance' ? <SafetyCertificateOutlined /> : <RocketOutlined />} />
            <div>
              <Text strong>{name}</Text><br />
              <Text type="secondary" style={{ fontSize: 11 }}>{record.type}</Text>
            </div>
          </Space>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={status === 'Connected' ? 'green' : status === 'Maintenance' ? 'orange' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Marketplace Products',
      key: 'products',
      width: 200,
      render: (_, r: FintechPartner) => (
        <Space size={[0, 4]} wrap>
          {r.name === 'Standard Bank Group' && <Tag bordered={false} color="blue">Micro-Loan 500</Tag>}
          {r.name === 'SafeStep Insurance' && (
            <>
              <Tag bordered={false} color="green">Accident Cover</Tag>
              <Tag bordered={false} color="green">Trip Protection</Tag>
            </>
          )}
          {r.name === 'EcoCash Ecosystem' && <Tag variant="filled" color="purple">Wallet Credit</Tag>}
          {r.name === 'Paynow Zimbabwe' && (
            <>
              <Tag variant="filled" color="orange">Visa/Mastercard</Tag>
              <Tag variant="filled" color="orange">ZimSwitch</Tag>
            </>
          )}
        </Space>
      )
    },
    {
      title: 'API Health',
      dataIndex: 'apiHealth',
      key: 'apiHealth',
      width: 100,
      render: (h: number) => (
        <Space size="small">
          <Progress type="circle" percent={h} size={20} strokeColor={h > 95 ? '#52c41a' : h > 0 ? '#faad14' : '#ff4d4f'} />
          <Text style={{ fontSize: 12 }}>{h}%</Text>
        </Space>
      )
    },
    { title: 'Latency', dataIndex: 'latency', key: 'latency', width: 100, render: (l: number) => <Text style={{ fontSize: 12 }}>{l > 0 ? `${l}ms` : 'N/A'}</Text> },
    {
      title: 'Action',
      key: 'action',
      width: 220,
      render: (_, record: FintechPartner) => (
        <Space>
          <Button 
            size="small" 
            icon={<EyeOutlined />} 
            onClick={() => {
              setSelectedPartner(record);
              setIsDeepDiveVisible(true);
            }}
          >
            View API
          </Button>
          <Button 
            size="small" 
            type="primary" 
            ghost 
            icon={<SettingOutlined />}
            onClick={() => {
              setSelectedPartner(record);
              manageApiForm.setFieldsValue(record.config || {});
              setIsManageApiVisible(true);
            }}
          >
            Manage API
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '0 24px 24px 24px' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <Title level={4}><ApiOutlined /> Fintech Partner Hub</Title>
          <Text type="secondary">Global registry and API gateway management for financial service providers</Text>
        </div>
        <Space>
           <Input.Search 
             placeholder="Lookup Wallet (Phone/Email)" 
             style={{ width: 300 }} 
             onSearch={(value) => {
                message.loading(`Resolving identifier ${value}...`, 1.5).then(() => {
                  if (value.includes('Sarah') || value.includes('333')) {
                    Modal.confirm({
                      title: 'Wallet Found: Sarah (CUSTOMER)',
                      content: 'Wallet ID: WLT-C-102. Would you like to initiate a manual reversal for this user?',
                      okText: 'Start Reversal',
                      onOk: () => {
                        reversalForm.setFieldsValue({ orderId: '#ORD-9981', amount: 45.00 });
                        setIsReversalDrawerVisible(true);
                      }
                    });
                  } else if (value.includes('Dave') || value.includes('111')) {
                    Modal.confirm({
                      title: 'Wallet Found: Dave (RIDER)',
                      content: 'Wallet ID: WLT-R-005. Would you like to initiate a manual reversal for this driver?',
                      okText: 'Start Reversal',
                      onOk: () => {
                        reversalForm.setFieldsValue({ orderId: '#ORD-9922', amount: 12.50 });
                        setIsReversalDrawerVisible(true);
                      }
                    });
                  } else {
                    message.error('Identifier not found in any role');
                  }
                });
             }}
             enterButton={<FileSearchOutlined />}
           />
           <Button icon={<BuildOutlined />} onClick={() => setIsSandboxVisible(true)}>Marketplace Sandbox</Button>
           <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsOnboardDrawerVisible(true)}>Onboard Provider</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={24}>
           <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
             <Row gutter={32}>
               <Col span={6}>
                 <Statistic title="Active Partners" value={14} prefix={<BankOutlined />} />
               </Col>
               <Col span={6}>
                 <Statistic title="Total API Calls (Today)" value={245600} prefix={<SyncOutlined spin={loading} />} />
               </Col>
               <Col span={6}>
                 <Statistic title="Avg. Partner Latency" value={62} suffix="ms" prefix={<DashboardOutlined />} />
               </Col>
               <Col span={6}>
                 <Statistic title="System Uptime" value={99.98} suffix="%" prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} />
               </Col>
             </Row>
           </Card>
        </Col>

        <Col span={24}>
          <Card 
            variant="borderless" 
            className="shadow-sm premium-tabs" 
            style={{ borderRadius: 16, minHeight: 600 }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: '1',
                  label: <Space><GlobalOutlined /> Provider Registry</Space>,
                  children: (
                    <Table 
                      dataSource={partners} 
                      columns={partnerColumns} 
                      pagination={{ pageSize: 8 }}
                      size="middle"
                      scroll={{ x: 'max-content' }}
                    />
                  )
                },
                {
                  key: '2',
                  label: <Space><InteractionOutlined /> Payments & Routing</Space>,
                  children: (
                    <div style={{ padding: 24 }}>
                      <Alert 
                        title="Gateway Orchestration Shield"
                        description="Middleware is intelligently routing between the Internal DashWallet Ledger and the External Paynow Gateway."
                        type="success"
                        showIcon
                        action={<Space><Tag color="blue">USD Mode</Tag><Tag color="orange">ZiG Mode</Tag></Space>}
                        style={{ marginBottom: 24 }}
                      />
                      <Row gutter={16} style={{ marginBottom: 24 }}>
                        <Col span={12}>
                          <Card size="small" title="DashWallet (Internal)" bordered={false} style={{ background: isDark ? '#1a1a1a' : '#f0faff' }}>
                            <Statistic title="Instant P2P Volume" value={8420} prefix="$" precision={2} valueStyle={{ color: '#1890ff' }} />
                            <Text type="secondary" style={{ fontSize: 11 }}>0% Gateway Fees</Text>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card size="small" title="Paynow (External)" bordered={false} style={{ background: isDark ? '#1a1a1a' : '#fff7e6' }}>
                            <Statistic title="Gateway Volume" value={14200} prefix="$" precision={2} valueStyle={{ color: '#fa8c16' }} />
                            <Text type="secondary" style={{ fontSize: 11 }}>Settlement: T+1</Text>
                          </Card>
                        </Col>
                      </Row>
                      {renderMiddleWareStats()}
                      <Card variant="borderless" className="shadow-sm" style={{ marginTop: 24, borderRadius: 16 }} title="Unified Transaction Switch">
                        <Table 
                          columns={recentTrxColumns} 
                          scroll={{ x: 'max-content' }}
                          dataSource={Array.isArray(transactions) && transactions.length > 0 ? transactions.map(t => ({
                            key: t.id,
                            id: t.gatewayTransactionId || t.id,
                            type: t.paymentMethod,
                            provider: t.gateway,
                            amount: t.amount,
                            status: t.status === 'SUCCESS' ? 'Completed' : 'Processing',
                            time: new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          })) : recentTransactions} 
                          pagination={{ pageSize: 5 }} 
                        />
                      </Card>
                    </div>
                  )
                },
                {
                  key: '3',
                  label: <Space><ThunderboltOutlined /> Bills & Utilities</Space>,
                  children: renderBillsOrchestrator(),
                },
                {
                  key: '4',
                  label: <Space><MobileOutlined /> Telecom HUB</Space>,
                  children: renderTelecomHub(),
                },
                {
                  key: '5',
                  label: <Space><BankOutlined /> Lending & BNPL</Space>,
                  children: (
                    <div style={{ padding: 24 }}>
                       <Row gutter={24}>
                          <Col span={16}>
                             <div style={{ height: 400 }}>
                                <Title level={5}>Credit Logic & Performance</Title>
                                <ResponsiveContainer width="100%" height="90%">
                                  <AreaChart data={healthData}>
                                    <defs>
                                      <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1890ff" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#1890ff" stopOpacity={0}/>
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#333' : '#f0f0f0'} />
                                    <XAxis dataKey="time" stroke={isDark ? '#888' : '#999'} fontSize={10} />
                                    <YAxis stroke={isDark ? '#888' : '#999'} fontSize={10} />
                                    <RechartsTooltip />
                                    <Area type="monotone" dataKey="calls" stroke="#1890ff" fillOpacity={1} fill="url(#colorCalls)" />
                                  </AreaChart>
                                </ResponsiveContainer>
                             </div>
                          </Col>
                          <Col span={8}>
                             <Card variant="borderless" className="shadow-sm" title="Underwriting Thresholds" style={{ borderRadius: 16 }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>Product: Asset Financing</Text>
                                <Divider />
                                <Text style={{ fontSize: 13 }}>Minimum Credit Score</Text>
                                <Statistic value={650} styles={{ content: { fontSize: 24 } }} />
                                <Button block type="primary" style={{ marginTop: 16 }} icon={<SecurityScanOutlined />}>Run Risk Simulation</Button>
                             </Card>
                          </Col>
                       </Row>
                    </div>
                  )
                },
                {
                  key: '6',
                  label: <Space><PartitionOutlined /> Wallet & Settlements</Space>,
                  children: renderSettlementEngine(),
                },
                {
                  key: '7',
                  label: <Space><SecurityScanOutlined /> Compliance & KYC</Space>,
                  children: (
                    <div style={{ padding: 24 }}>
                       <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
                          <Result 
                            icon={<VerifiedOutlined style={{ color: '#52c41a' }} />}
                            title="Global Compliance Shield Active"
                            subTitle="Middleware is screening all payout entities against AML/Sanctions lists in real-time."
                            extra={[
                               <Button type="primary" key="audit" icon={<DownloadOutlined />} onClick={handleDownloadAudit}>Download Compliance Audit</Button>,
                               <Button key="rule" icon={<SecurityScanOutlined />} onClick={() => setIsThresholdDrawerVisible(true)}>Configure Flagging Thresholds</Button>
                            ]}
                          />
                       </Card>
                    </div>
                  )
                },
                {
                  key: '8',
                  label: <Space><BellOutlined /> Real-time Monitoring</Space>,
                  children: renderWebhookObserver(),
                },
                {
                  key: '9',
                  label: <Space><BuildOutlined /> Product Labs</Space>,
                  children: renderUnderwritingSandbox(),
                }
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Drawer
        title={<Space><UndoOutlined /> Initialize Financial Reversal</Space>}
        open={isReversalDrawerVisible}
        onClose={() => setIsReversalDrawerVisible(false)}
        width={500}
        extra={<Button key="submit" type="primary" danger loading={loading} onClick={() => reversalForm.submit()}>Transmit Reversal</Button>}
      >
        <Alert 
          message="High-Impact Action"
          description="A manual reversal will attempt to pull funds back from the partner's automated ledger. This action is irreversible once committed."
          type="warning"
          showIcon
          style={{ marginBottom: 20 }}
        />
        <Form form={reversalForm} layout="vertical" onFinish={handleManualReversal}>
          <Form.Item name="orderId" label="Associated Order ID" rules={[{ required: true }]}>
            <Input placeholder="#ORD-XXXXX" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="partner" label="Financial Partner" rules={[{ required: true }]}>
                <Select placeholder="Select Partner">
                  {partners.map(p => <Option key={p.key} value={p.name}>{p.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="amount" label="Reversal Amount ($)" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} prefix="$" precision={2} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="reason" label="Regulatory Reason for Reversal" rules={[{ required: true }]}>
            <Select placeholder="Select Reason">
              <Option value="Customer Dispute (Won)">Customer Dispute (Won)</Option>
              <Option value="Fraudulent Activity Detected">Fraudulent Activity Detected</Option>
              <Option value="Duplicate Settlement Correction">Duplicate Settlement Correction</Option>
              <Option value="Reverse Logistics (Return Success)">Reverse Logistics (Return Success)</Option>
            </Select>
          </Form.Item>
        </Form>
      </Drawer>

      {/* Marketplace Sandbox Modal */}
      <Drawer
        title={<Space><BuildOutlined /> Marketplace Underwriting Sandbox</Space>}
        open={isSandboxVisible}
        onClose={() => setIsSandboxVisible(false)}
        width={1000}
        extra={
          <Space>
            <Button key="validate" type="primary" loading={validationStatus === 'validating'} onClick={() => {
              setValidationStatus('validating');
              setTimeout(() => {
                try {
                  const parsed = JSON.parse(sandboxJson);
                  setSandboxPreview(parsed);
                  setValidationStatus('success');
                  message.success('JSON Schema Validated & Preview Generated');
                } catch (e) {
                  setValidationStatus('error');
                  message.error('Invalid JSON Schema: Check syntax');
                }
              }, 1000);
            }}>Validate & Preview</Button>
            <Button key="submit" type="primary" disabled={validationStatus !== 'success'} ghost loading={loading} onClick={handleSubmitToUnderwriting}>Submit for Underwriting</Button>
          </Space>
        }
      >
        <Row gutter={24}>
           <Col span={12}>
              <Title level={5}>Product Definition (JSON)</Title>
              <Paragraph type="secondary" style={{ fontSize: 12 }}>Edit the raw JSON definition to configure loan/insurance terms.</Paragraph>
              <Input.TextArea 
                value={sandboxJson} 
                onChange={(e) => {
                  setSandboxJson(e.target.value);
                  setValidationStatus('none');
                }}
                rows={18} 
                style={{ fontFamily: 'monospace', fontSize: 12, background: isDark ? '#1a1a1a' : '#f5f5f5' }}
              />
              {validationStatus === 'error' && (
                <Alert title="JSON Error" type="error" showIcon style={{ marginTop: 12 }} />
              )}
           </Col>
           <Col span={12}>
              <Title level={5}>Mobile App Preview</Title>
              <Paragraph type="secondary" style={{ fontSize: 12 }}>Simulated view of how DashDrive users will see this product.</Paragraph>
              <div style={{ 
                border: '12px solid #333', 
                borderRadius: 36, 
                padding: 16, 
                width: 320,
                height: 580, 
                margin: '0 auto',
                background: isDark ? '#000' : '#fff', 
                overflowY: 'auto',
                position: 'relative',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
              }}>
                 {sandboxPreview ? (
                   <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                         <Text strong style={{ fontSize: 16 }}>{sandboxPreview.product_name}</Text>
                         <Badge status="success" text="Verified" />
                      </div>
                      <Card size="small" style={{ borderRadius: 12, marginBottom: 16, background: 'linear-gradient(135deg, #1890ff 0%, #001529 100%)', border: 'none' }}>
                         <Statistic 
                           title={<Text style={{ color: '#fff' }}>Max Benefit</Text>} 
                           value={sandboxPreview.max_amount} 
                           prefix="$" 
                           styles={{ content: { color: '#fff' } }} 
                         />
                      </Card>
                      <Descriptions column={1} size="small">
                         <Descriptions.Item label="Interest Rate">{sandboxPreview.interest_rate}%</Descriptions.Item>
                         <Descriptions.Item label="Repayment">{sandboxPreview.repayment_period}</Descriptions.Item>
                         <Descriptions.Item label="Provider">{sandboxPreview.provider}</Descriptions.Item>
                      </Descriptions>
                      <Divider style={{ margin: '12px 0' }} />
                      <Text strong style={{ fontSize: 12 }}>Eligibility Criteria</Text>
                      <List 
                        size="small"
                        dataSource={sandboxPreview.eligibility || []}
                        renderItem={(item: string) => <List.Item style={{ fontSize: 11, padding: '4px 0' }}>• {item}</List.Item>}
                      />
                      <Button block type="primary" shape="round" style={{ marginTop: 24, background: '#10b981', borderColor: '#10b981' }}>Apply Now</Button>
                   </div>
                 ) : (
                   <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                      <RocketOutlined style={{ fontSize: 40, color: '#bfbfbf', marginBottom: 16 }} />
                      <Text type="secondary">Validate JSON to see preview</Text>
                   </div>
                 )}
              </div>
              <div style={{ marginTop: 16 }}>
                <Title level={5}>Underwriting Checklist</Title>
                <Checkbox>Regulatory Compliance Verified</Checkbox><br />
                <Checkbox>API Callback Latency &lt; 200ms</Checkbox><br />
                <Checkbox>Legal Terms of Service Attached</Checkbox>
              </div>
           </Col>
        </Row>
      </Drawer>

      {/* Compliance Thresholds Modal */}
      <Drawer
        title={<Space><SecurityScanOutlined /> Configure Global Compliance Tripwires</Space>}
        open={isThresholdDrawerVisible}
        onClose={() => setIsThresholdDrawerVisible(false)}
        width={500}
        extra={<Button type="primary" onClick={() => thresholdForm.submit()} loading={loading}>Save Thresholds</Button>}
      >
        <Alert 
          message="System-Wide Regulatory Logic"
          description="These thresholds apply to all internal and external transfers. Violations trigger an immediate 'Flagged' status and require manual admin clearance."
          type="info"
          showIcon
          style={{ marginBottom: 20 }}
        />
        <Form form={thresholdForm} layout="vertical" onFinish={handleUpdateThresholds} initialValues={{ dailyLimit: 5000, velocityCount: 10, amlCheck: true }}>
           <Row gutter={16}>
              <Col span={12}>
                 <Form.Item name="dailyLimit" label="Single Transaction Limit ($)" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} prefix="$" />
                 </Form.Item>
              </Col>
              <Col span={12}>
                 <Form.Item name="velocityCount" label="Velocity Check (Transfers/Hour)" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} />
                 </Form.Item>
              </Col>
           </Row>
           <Form.Item name="amlCheck" label="Real-time AML Screening" valuePropName="checked">
              <Switch checkedChildren="ON" unCheckedChildren="OFF" />
           </Form.Item>
           <Form.Item name="payoutDelay" label="High-Value Payout Hold (Hours)">
              <Select placeholder="Select hold time">
                 <Option value={0}>Instant (No Hold)</Option>
                 <Option value={12}>12 Hours</Option>
                 <Option value={24}>24 Hours (Standard)</Option>
                 <Option value={48}>48 Hours (Aggressive)</Option>
              </Select>
           </Form.Item>
           <Divider />
           <Text type="secondary" style={{ fontSize: 12 }}>
             <InfoCircleOutlined /> Last update propagated across 14 financial nodes.
           </Text>
        </Form>
      </Drawer>

       <Drawer
         title={<span><PlusOutlined /> Onboard New Financial Partner</span>}
         open={isOnboardDrawerVisible}
         onClose={() => setIsOnboardDrawerVisible(false)}
         width={500}
         extra={<Button type="primary" onClick={() => onboardForm.submit()} loading={loading}>Register Partner</Button>}
       >
         <Form form={onboardForm} layout="vertical" onFinish={handleOnboardProvider}>
           <Form.Item name="name" label="Legal Entity Name" rules={[{ required: true }]}>
             <Input placeholder="Standard Bank Group" />
           </Form.Item>
           <Form.Item name="type" label="Vertical Type" rules={[{ required: true }]}>
             <Select options={[{ value: 'Bank', label: 'Bank' }, { value: 'Insurance', label: 'Insurance' }, { value: 'Digital Wallet', label: 'Digital Wallet' }]} />
           </Form.Item>
           <Form.Item name="endpoint" label="Base API Endpoint" rules={[{ required: true }]}>
             <Input placeholder="https://api.partner.com/v1" />
           </Form.Item>
           <Divider />
           <Alert message="Technical Handshake" description="Dashboard will attempt to verify SSL and OAuth2 handshake upon registration." type="warning" />
         </Form>
       </Drawer>

      {/* Manage API Modal */}
      <Drawer
        title={<Space><SettingOutlined /> {selectedPartner?.name} API Configuration</Space>}
        open={isManageApiVisible}
        onClose={() => setIsManageApiVisible(false)}
        width={600}
        extra={<Button type="primary" loading={loading} onClick={() => manageApiForm.submit()}>Update Configuration</Button>}
      >
        <Alert 
          message="Technical Configuration Required"
          description="Changes to these credentials will affect real-world transaction fulfillment and bank settlement. Handle with extreme caution."
          type="warning"
          showIcon
          style={{ marginBottom: 20 }}
        />
        <Form form={manageApiForm} layout="vertical" onFinish={handleManageApi}>
           <Form.Item name="endpoint" label="Production Gateway URL" rules={[{ required: true, type: 'url' }]}>
              <Input placeholder="https://api.partner.com/v1" />
           </Form.Item>
           <Form.Item name="isActive" label="Integration Status" rules={[{ required: true }]}>
              <Select placeholder="Select status">
                 <Option value={true}>Connected (Live)</Option>
                 <Option value={false}>Maintenance (Offline)</Option>
              </Select>
           </Form.Item>
           <Row gutter={16}>
              <Col span={12}>
                 <Form.Item name="integrationId" label="Integration ID (Production)" rules={[{ required: true }]}>
                    <Input placeholder="e.g. 22095" />
                 </Form.Item>
              </Col>
              <Col span={12}>
                 <Form.Item name="integrationKey" label="Integration Key (Production)" rules={[{ required: true }]}>
                    <Input.Password placeholder="Enter secret key" />
                 </Form.Item>
              </Col>
           </Row>
           <Form.Item name="webhookUrl" label="Callback Webhook (Optional)">
              <Input placeholder="https://api.dashdrive.com/fintech/webhooks/callback" />
           </Form.Item>
           <Divider />
           <Text type="secondary" style={{ fontSize: 12 }}>
             <InfoCircleOutlined /> Last modified by: DashDrive Admin on {selectedPartner?.joinedDate}
           </Text>
        </Form>
      </Drawer>

      {/* Partner Deep-Dive Drawer */}
      <Drawer
        title={selectedPartner ? <Space><Avatar icon={<BankOutlined />} /> {selectedPartner.name} Deep Dive</Space> : 'Partner Deep Dive'}
        open={isDeepDiveVisible}
        onClose={() => setIsDeepDiveVisible(false)}
        width={900}
        extra={<Button key="health" type="primary" onClick={() => setActiveTab('3')}>View Health Analytics</Button>}
      >
        {selectedPartner && (
          <div style={{ marginTop: 20 }}>
            <Row gutter={24}>
              <Col span={16}>
                <Title level={5}>Marketplace Performance & Adoption</Title>
                <Alert 
                  title="System Link Active"
                  description={`This provider is currently powering ${selectedPartner.activeProducts} live products in the DashDrive Marketplace.`}
                  type="success"
                  showIcon
                  style={{ marginBottom: 20 }}
                />
                
                <Row gutter={12}>
                  <Col span={8}>
                    <Card size="small" style={{ background: isDark ? '#141414' : '#fafafa' }}>
                      <Statistic title="Conversion Rate" value={14.2} suffix="%" styles={{ content: { color: '#10b981' } }} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small" style={{ background: isDark ? '#141414' : '#fafafa' }}>
                      <Statistic title="Total Users" value={12500} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small" style={{ background: isDark ? '#141414' : '#fafafa' }}>
                      <Statistic title="Default Rate" value={0.8} suffix="%" styles={{ content: { color: '#ef4444' } }} />
                    </Card>
                  </Col>
                </Row>
 
                <Divider />
                
                <Title level={5}>Technical Resilience</Title>
                <Descriptions column={2} bordered size="small">
                  <Descriptions.Item label="API Latency (p95)">{selectedPartner.latency}ms</Descriptions.Item>
                  <Descriptions.Item label="Success Rate">{selectedPartner.apiHealth}%</Descriptions.Item>
                  <Descriptions.Item label="Connected Since">{selectedPartner.joinedDate}</Descriptions.Item>
                  <Descriptions.Item label="Auth Type">OAuth2 + mTLS</Descriptions.Item>
                </Descriptions>
              </Col>
              
              <Col span={8}>
                <Title level={5}>Live Payload Monitor</Title>
                <div style={{ background: '#1e1e1e', padding: 12, borderRadius: 8, height: 280, overflow: 'auto', border: '1px solid #333', marginBottom: 20 }}>
                  <Text style={{ color: '#d4d4d4', fontFamily: 'monospace', fontSize: 11 }}>
                    <pre>
{`{
  "timestamp": "${new Date().toISOString()}",
  "partner": "${selectedPartner.key}",
  "event": "balance_inquiry",
  "response": 200,
  "config": {
    "gateway": "${selectedPartner.config?.endpoint || 'https://api.partner.com'}",
    "integration_id": "${selectedPartner.config?.integrationId || 'XXXXX'}",
    "mode": "PRODUCTION"
  },
  "payload": {
    "status": "success",
    "trace_id": "dash_99x..."
  }
}`}
                    </pre>
                  </Text>
                </div>
                
                <Divider />
                <div style={{ background: isDark ? '#2a1215' : '#fff1f0', padding: 16, borderRadius: 8, border: '1px solid #ffa39e' }}>
                   <Text strong style={{ color: '#cf1322' }}>Danger Zone</Text><br />
                   <Text type="secondary" style={{ fontSize: 12 }}>Remove this partner and all its configurations from the DashDrive ecosystem.</Text>
                   <Button danger block style={{ marginTop: 12 }} icon={<DeleteOutlined />} onClick={() => handleDeletePartner(selectedPartner)}>Delete Partner</Button>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Drawer>
    </div>
  );
};

