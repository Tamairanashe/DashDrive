import React, { useState } from 'react';
import {
  Tabs, Card, Form, Input, Select, Switch, Button, Table, Tag, Space,
  Alert, Checkbox, Typography, Divider, Popconfirm, InputNumber, message, Badge, Progress, Tooltip, Drawer
} from 'antd';
import {
  SettingOutlined, CloudOutlined, MobileOutlined, DatabaseOutlined, GlobalOutlined,
  ExclamationCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined,
  SaveOutlined, CopyOutlined, EyeOutlined, EyeInvisibleOutlined, WarningOutlined,
  AndroidOutlined, AppleOutlined, CheckCircleOutlined, CloseCircleOutlined, TranslationOutlined,
  CloudServerOutlined, ToolOutlined, StopOutlined, ThunderboltOutlined, LinkOutlined,
  ClockCircleOutlined, ApiOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// ============================================================
// TAB 1: ENVIRONMENT SETUP
// ============================================================
const EnvironmentSetupTab: React.FC = () => {
  const [form] = Form.useForm();
  const [showDbPassword, setShowDbPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    message.success('Environment configuration saved successfully');
    setSaving(false);
  };

  const handleTestConnection = async () => {
    message.loading({ content: 'Testing database connection...', key: 'dbtest' });
    await new Promise(r => setTimeout(r, 1500));
    message.success({ content: 'Database connection successful!', key: 'dbtest' });
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <Alert
        type="info"
        showIcon
        icon={<SettingOutlined />}
        message="Environment Configuration"
        description="Configure core application settings. Changes require a server restart to take effect."
        style={{ marginBottom: 24, borderRadius: 12 }}
      />

      <Form form={form} layout="vertical" initialValues={{
        appName: 'DashDrive',
        appDebug: false,
        appMode: 'production',
        appUrl: 'https://api.dashdrive.app',
        dbConnection: 'pgsql',
        dbHost: 'db.dashdrive.app',
        dbPort: 5432,
        dbDatabase: 'dashdrive_production',
        dbUsername: 'dashdrive_admin',
        dbPassword: 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢',
      }}>
        {/* Application Settings */}
        <Card
          title={<Space><CloudOutlined /> Application Settings</Space>}
          size="small"
          style={{ marginBottom: 16, borderRadius: 12 }}
          styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0' } }}
        >
          <Form.Item label="App Name" name="appName" rules={[{ required: true }]}>
            <Input placeholder="DashDrive" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="App Debug" name="appDebug" valuePropName="checked">
              <Switch
                checkedChildren="ON"
                unCheckedChildren="OFF"
              />
            </Form.Item>

            <Form.Item label="App Mode" name="appMode">
              <Select>
                <Option value="production">
                  <Badge status="success" text="Production" />
                </Option>
                <Option value="staging">
                  <Badge status="warning" text="Staging" />
                </Option>
                <Option value="development">
                  <Badge status="processing" text="Development" />
                </Option>
                <Option value="maintenance">
                  <Badge status="error" text="Maintenance" />
                </Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="App URL" name="appUrl" rules={[{ required: true, type: 'url' }]}>
            <Input addonBefore="https://" placeholder="api.dashdrive.app" />
          </Form.Item>
        </Card>

        {/* Database Settings */}
        <Card
          title={<Space><DatabaseOutlined /> Database Configuration</Space>}
          size="small"
          style={{ marginBottom: 24, borderRadius: 12 }}
          styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0' } }}
          extra={
            <Button size="small" icon={<ReloadOutlined />} onClick={handleTestConnection}>
              Test Connection
            </Button>
          }
        >
          <Form.Item label="DB Connection Driver" name="dbConnection">
            <Select>
              <Option value="pgsql">PostgreSQL</Option>
              <Option value="mysql">MySQL</Option>
              <Option value="sqlite">SQLite</Option>
              <Option value="mongodb">MongoDB</Option>
            </Select>
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <Form.Item label="DB Host" name="dbHost" rules={[{ required: true }]}>
              <Input placeholder="localhost" />
            </Form.Item>
            <Form.Item label="DB Port" name="dbPort" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={1} max={65535} />
            </Form.Item>
          </div>

          <Form.Item label="DB Database" name="dbDatabase" rules={[{ required: true }]}>
            <Input placeholder="dashdrive_production" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="DB Username" name="dbUsername" rules={[{ required: true }]}>
              <Input placeholder="dashdrive_admin" />
            </Form.Item>
            <Form.Item label="DB Password" name="dbPassword" rules={[{ required: true }]}>
              <Input.Password
                placeholder="Enter password"
                visibilityToggle={{ visible: showDbPassword, onVisibleChange: setShowDbPassword }}
              />
            </Form.Item>
          </div>
        </Card>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Button>Reset to Defaults</Button>
          <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}
            style={{ background: '#0e172a' }}>
            Save Configuration
          </Button>
        </div>
      </Form>
    </div>
  );
};

// ============================================================
// TAB 2: APP VERSION
// ============================================================
interface AppVersionData {
  key: string;
  platform: string;
  appType: string;
  currentVersion: string;
  minimumVersion: string;
  latestVersion: string;
  forceUpdate: boolean;
  maintenanceMode: boolean;
  storeUrl: string;
}

const AppVersionTab: React.FC = () => {
  const [editingKey, setEditingKey] = useState('');
  const [versions, setVersions] = useState<AppVersionData[]>([
    { key: '1', platform: 'Android', appType: 'User App', currentVersion: '3.2.1', minimumVersion: '3.0.0', latestVersion: '3.2.1', forceUpdate: false, maintenanceMode: false, storeUrl: 'https://play.google.com/store/apps/details?id=com.dashdrive.user' },
    { key: '2', platform: 'iOS', appType: 'User App', currentVersion: '3.2.0', minimumVersion: '3.0.0', latestVersion: '3.2.0', forceUpdate: false, maintenanceMode: false, storeUrl: 'https://apps.apple.com/app/dashdrive/id123456789' },
    { key: '3', platform: 'Android', appType: 'Driver App', currentVersion: '4.1.0', minimumVersion: '4.0.0', latestVersion: '4.1.0', forceUpdate: true, maintenanceMode: false, storeUrl: 'https://play.google.com/store/apps/details?id=com.dashdrive.driver' },
    { key: '4', platform: 'iOS', appType: 'Driver App', currentVersion: '4.0.8', minimumVersion: '4.0.0', latestVersion: '4.1.0', forceUpdate: true, maintenanceMode: false, storeUrl: 'https://apps.apple.com/app/dashdrive-driver/id987654321' },
  ]);

  const handleToggleForceUpdate = (key: string) => {
    setVersions(prev => prev.map(v => v.key === key ? { ...v, forceUpdate: !v.forceUpdate } : v));
    message.success('Force update toggled');
  };

  const handleToggleMaintenance = (key: string) => {
    setVersions(prev => prev.map(v => v.key === key ? { ...v, maintenanceMode: !v.maintenanceMode } : v));
    message.success('Maintenance mode toggled');
  };

  const columns = [
    {
      title: 'Platform',
      dataIndex: 'platform',
      render: (text: string) => (
        <Space>
          {text === 'Android' ? <AndroidOutlined style={{ color: '#3DDC84', fontSize: 18 }} /> : <AppleOutlined style={{ fontSize: 18 }} />}
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'App Type',
      dataIndex: 'appType',
      render: (text: string) => (
        <Tag color={text === 'User App' ? 'blue' : 'green'}>{text}</Tag>
      ),
    },
    {
      title: 'Current Version',
      dataIndex: 'currentVersion',
      render: (text: string) => <Tag style={{ fontFamily: 'monospace', fontWeight: 600 }}>{text}</Tag>,
    },
    {
      title: 'Minimum Version',
      dataIndex: 'minimumVersion',
      render: (text: string) => <Text type="secondary" style={{ fontFamily: 'monospace' }}>{text}</Text>,
    },
    {
      title: 'Latest Version',
      dataIndex: 'latestVersion',
      render: (text: string, record: AppVersionData) => {
        const isOutdated = text !== record.currentVersion;
        return (
          <Space>
            <Text style={{ fontFamily: 'monospace', color: isOutdated ? '#f59e0b' : '#10b981', fontWeight: 600 }}>{text}</Text>
            {isOutdated && <Tag color="warning">Update Available</Tag>}
          </Space>
        );
      },
    },
    {
      title: 'Force Update',
      dataIndex: 'forceUpdate',
      render: (val: boolean, record: AppVersionData) => (
        <Switch checked={val} size="small" onChange={() => handleToggleForceUpdate(record.key)} />
      ),
    },
    {
      title: 'Maintenance',
      dataIndex: 'maintenanceMode',
      render: (val: boolean, record: AppVersionData) => (
        <Switch checked={val} size="small" onChange={() => handleToggleMaintenance(record.key)}
          style={val ? { background: '#ef4444' } : {}} />
      ),
    },
    {
      title: 'Action',
      render: (_: any, record: AppVersionData) => (
        <Space>
          <Tooltip title="Edit Version"><Button size="small" type="text" icon={<EditOutlined />} /></Tooltip>
          <Tooltip title="Copy Store URL"><Button size="small" type="text" icon={<CopyOutlined />} onClick={() => { navigator.clipboard.writeText(record.storeUrl); message.success('Store URL copied'); }} /></Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Alert
        type="info"
        showIcon
        icon={<MobileOutlined />}
        message="App Version Control"
        description="Manage version requirements for User and Driver apps across Android and iOS platforms."
        style={{ marginBottom: 24, borderRadius: 12 }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {versions.map(v => (
          <Card key={v.key} size="small" style={{ borderRadius: 12, borderLeft: `3px solid ${v.platform === 'Android' ? '#3DDC84' : '#0e172a'}` }}>
            <Space direction="vertical" size={2} style={{ width: '100%' }}>
              <Space>
                {v.platform === 'Android' ? <AndroidOutlined style={{ color: '#3DDC84' }} /> : <AppleOutlined />}
                <Text strong style={{ fontSize: 12 }}>{v.appType}</Text>
              </Space>
              <Text style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace' }}>v{v.currentVersion}</Text>
              <div style={{ display: 'flex', gap: 4 }}>
                {v.forceUpdate && <Tag color="orange" style={{ fontSize: 10, margin: 0 }}>Force</Tag>}
                {v.maintenanceMode && <Tag color="red" style={{ fontSize: 10, margin: 0 }}>Maint</Tag>}
                {!v.forceUpdate && !v.maintenanceMode && <Tag color="green" style={{ fontSize: 10, margin: 0 }}>Live</Tag>}
              </div>
            </Space>
          </Card>
        ))}
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Table
          dataSource={versions}
          columns={columns}
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
};

// ============================================================
// TAB 3: CLEAN DATABASE
// ============================================================
const CleanDatabaseTab: React.FC = () => {
  const [selectedAll, setSelectedAll] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [selections, setSelections] = useState<Record<string, boolean>>({
    users: false, drivers: false, orders: false, transactions: false,
    wallets: false, loans: false, insurance: false, notifications: false,
    support_tickets: false, audit_logs: false, analytics: false, sessions: false,
    cache: false, temp_files: false,
  });

  const categories = [
    { key: 'users', label: 'Users & Customers', description: 'All user accounts and profiles', count: '12,450', danger: true },
    { key: 'drivers', label: 'Drivers & Vehicles', description: 'Driver accounts, vehicles, documents', count: '3,200', danger: true },
    { key: 'orders', label: 'Orders & Bookings', description: 'All ride, delivery, hotel, event orders', count: '145,320', danger: true },
    { key: 'transactions', label: 'Financial Transactions', description: 'Payment records, wallet movements', count: '298,100', danger: true },
    { key: 'wallets', label: 'Wallets & Balances', description: 'User and driver wallet data', count: '15,650', danger: true },
    { key: 'loans', label: 'Loans & BNPL', description: 'Loan applications, repayments, BNPL', count: '2,340', danger: true },
    { key: 'insurance', label: 'Insurance & Claims', description: 'Policies, claims, providers', count: '890', danger: true },
    { key: 'notifications', label: 'Notifications', description: 'Push, SMS, email notification logs', count: '1.2M', danger: false },
    { key: 'support_tickets', label: 'Support Tickets', description: 'Customer support conversations', count: '8,900', danger: false },
    { key: 'audit_logs', label: 'Audit Logs', description: 'System audit trail records', count: '2.5M', danger: false },
    { key: 'analytics', label: 'Analytics Data', description: 'Metrics, funnel events, cohorts', count: '5.1M', danger: false },
    { key: 'sessions', label: 'Active Sessions', description: 'User login sessions and tokens', count: '3,400', danger: false },
    { key: 'cache', label: 'System Cache', description: 'Redis/memory cache entries', count: '45K', danger: false },
    { key: 'temp_files', label: 'Temporary Files', description: 'Upload temp files, exports', count: '1.2 GB', danger: false },
  ];

  const handleSelectAll = (checked: boolean) => {
    setSelectedAll(checked);
    const newSelections: Record<string, boolean> = {};
    categories.forEach(c => { newSelections[c.key] = checked; });
    setSelections(newSelections);
  };

  const handleToggle = (key: string, checked: boolean) => {
    const newSelections = { ...selections, [key]: checked };
    setSelections(newSelections);
    setSelectedAll(Object.values(newSelections).every(v => v));
  };

  const selectedCount = Object.values(selections).filter(Boolean).length;
  const hasDangerSelected = categories.some(c => c.danger && selections[c.key]);

  const handleClean = async () => {
    setCleaning(true);
    await new Promise(r => setTimeout(r, 3000));
    setCleaning(false);
    setConfirmed(false);
    message.success(`${selectedCount} database tables cleaned successfully`);
    handleSelectAll(false);
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <Alert
        type="error"
        showIcon
        icon={<WarningOutlined />}
        message={<Text strong style={{ color: '#dc2626' }}>âš ï¸ DANGER ZONE â€” Sensitive Operation</Text>}
        description="Cleaning database tables will permanently delete records. This action cannot be undone. Proceed with extreme caution. It is strongly recommended to create a full backup before performing any cleanup."
        style={{ marginBottom: 24, borderRadius: 12, border: '1px solid #fecaca', background: '#fef2f2' }}
      />

      <Card
        title={<Space><DatabaseOutlined /> Select Tables to Clean</Space>}
        style={{ marginBottom: 24, borderRadius: 12 }}
        styles={{ header: { background: '#fafafa' } }}
        extra={
          <Checkbox checked={selectedAll} onChange={(e) => handleSelectAll(e.target.checked)}>
            <Text strong>Select All</Text>
          </Checkbox>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {categories.map(cat => (
            <div
              key={cat.key}
              style={{
                display: 'flex', alignItems: 'center', padding: '10px 12px',
                border: `1px solid ${selections[cat.key] ? (cat.danger ? '#fecaca' : '#d1d5db') : '#f1f5f9'}`,
                borderRadius: 10,
                background: selections[cat.key] ? (cat.danger ? '#fef2f2' : '#f9fafb') : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => handleToggle(cat.key, !selections[cat.key])}
            >
              <Checkbox checked={selections[cat.key]} style={{ marginRight: 12 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Text strong style={{ fontSize: 13 }}>{cat.label}</Text>
                  {cat.danger && <Tag color="red" style={{ fontSize: 10, lineHeight: '16px', margin: 0 }}>Critical</Tag>}
                </div>
                <Text type="secondary" style={{ fontSize: 11 }}>{cat.description}</Text>
              </div>
              <Tag style={{ fontFamily: 'monospace', fontSize: 11, margin: 0 }}>{cat.count}</Tag>
            </div>
          ))}
        </div>
      </Card>

      {selectedCount > 0 && (
        <Card style={{ borderRadius: 12, border: hasDangerSelected ? '1px solid #fecaca' : '1px solid #e5e7eb' }}>
          <div style={{ textAlign: 'center' }}>
            <Text strong style={{ fontSize: 16 }}>
              {selectedCount} table{selectedCount > 1 ? 's' : ''} selected for cleanup
            </Text>
            {hasDangerSelected && (
              <div style={{ marginTop: 8 }}>
                <Tag color="red" icon={<ExclamationCircleOutlined />}>Includes critical production data</Tag>
              </div>
            )}
            <Divider />
            <Checkbox checked={confirmed} onChange={e => setConfirmed(e.target.checked)} style={{ marginBottom: 16 }}>
              <Text type="danger" strong>I understand this action is irreversible and have created a backup</Text>
            </Checkbox>
            <br />
            <Popconfirm
              title="Are you absolutely sure?"
              description="This will permanently delete the selected data."
              okText="Yes, Clean Now"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              onConfirm={handleClean}
              disabled={!confirmed}
            >
              <Button
                danger
                type="primary"
                size="large"
                icon={<DeleteOutlined />}
                disabled={!confirmed}
                loading={cleaning}
                style={{ minWidth: 200 }}
              >
                Clean Selected Tables
              </Button>
            </Popconfirm>
          </div>
        </Card>
      )}
    </div>
  );
};

// ============================================================
// TAB 4: LANGUAGES
// ============================================================
interface LanguageData {
  key: string;
  name: string;
  shortCode: string;
  direction: 'ltr' | 'rtl';
  status: boolean;
  translationProgress: number;
}

const LanguagesTab: React.FC = () => {
  const [defaultLang, setDefaultLang] = useState('en');
  const [languages, setLanguages] = useState<LanguageData[]>([
    { key: '1', name: 'English', shortCode: 'en', direction: 'ltr', status: true, translationProgress: 100 },
    { key: '2', name: 'French', shortCode: 'fr', direction: 'ltr', status: true, translationProgress: 92 },
    { key: '3', name: 'Arabic', shortCode: 'ar', direction: 'rtl', status: true, translationProgress: 78 },
    { key: '4', name: 'Shona', shortCode: 'sn', direction: 'ltr', status: true, translationProgress: 65 },
    { key: '5', name: 'Portuguese', shortCode: 'pt', direction: 'ltr', status: false, translationProgress: 45 },
    { key: '6', name: 'Swahili', shortCode: 'sw', direction: 'ltr', status: true, translationProgress: 58 },
    { key: '7', name: 'Spanish', shortCode: 'es', direction: 'ltr', status: false, translationProgress: 30 },
  ]);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [translationDrawerOpen, setTranslationDrawerOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageData | null>(null);
  const [addForm] = Form.useForm();

  // Translation keys mock
  const translationKeys = [
    { key: 'app.welcome', en: 'Welcome to DashDrive', translated: 'Bienvenue sur DashDrive' },
    { key: 'app.login', en: 'Sign In', translated: 'Se connecter' },
    { key: 'app.register', en: 'Create Account', translated: 'CrÃ©er un compte' },
    { key: 'ride.request', en: 'Request a Ride', translated: 'Demander un trajet' },
    { key: 'ride.cancel', en: 'Cancel Ride', translated: 'Annuler le trajet' },
    { key: 'wallet.balance', en: 'Wallet Balance', translated: 'Solde du portefeuille' },
    { key: 'wallet.topup', en: 'Top Up', translated: 'Recharger' },
    { key: 'order.track', en: 'Track Order', translated: 'Suivre la commande' },
    { key: 'order.history', en: 'Order History', translated: 'Historique des commandes' },
    { key: 'support.help', en: 'Need Help?', translated: "Besoin d'aide ?" },
    { key: 'hotel.book', en: 'Book Now', translated: 'RÃ©server maintenant' },
    { key: 'event.tickets', en: 'Get Tickets', translated: 'Obtenir des billets' },
  ];

  const handleToggleStatus = (key: string) => {
    setLanguages(prev => prev.map(l => l.key === key ? { ...l, status: !l.status } : l));
    message.success('Language status updated');
  };

  const handleDelete = (key: string) => {
    setLanguages(prev => prev.filter(l => l.key !== key));
    message.success('Language removed');
  };

  const handleAddLanguage = () => {
    const values = addForm.getFieldsValue();
    setLanguages(prev => [...prev, {
      key: String(prev.length + 1),
      name: values.name,
      shortCode: values.shortCode,
      direction: values.direction,
      status: true,
      translationProgress: 0,
    }]);
    addForm.resetFields();
    setAddDrawerOpen(false);
    message.success('Language added successfully');
  };

  const handleOpenTranslation = (lang: LanguageData) => {
    setSelectedLang(lang);
    setTranslationDrawerOpen(true);
  };

  const columns = [
    {
      title: 'Language',
      dataIndex: 'name',
      render: (text: string, record: LanguageData) => (
        <Space>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: '#f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 11, color: '#475569', textTransform: 'uppercase' as const,
          }}>
            {record.shortCode}
          </div>
          <div>
            <Text strong>{text}</Text>
            {record.shortCode === defaultLang && <Tag color="blue" style={{ marginLeft: 8, fontSize: 10 }}>Default</Tag>}
          </div>
        </Space>
      ),
    },
    {
      title: 'Short Code',
      dataIndex: 'shortCode',
      render: (text: string) => <Tag style={{ fontFamily: 'monospace', fontWeight: 600 }}>{text}</Tag>,
    },
    {
      title: 'Direction',
      dataIndex: 'direction',
      render: (text: string) => (
        <Tag color={text === 'rtl' ? 'orange' : 'default'}>
          {text.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Translation',
      dataIndex: 'translationProgress',
      render: (val: number) => (
        <div style={{ minWidth: 120 }}>
          <Progress
            percent={val}
            size="small"
            status={val === 100 ? 'success' : val > 70 ? 'active' : 'exception'}
            strokeColor={val === 100 ? '#10b981' : val > 70 ? '#3b82f6' : '#f59e0b'}
          />
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (val: boolean, record: LanguageData) => (
        <Switch
          checked={val}
          size="small"
          onChange={() => handleToggleStatus(record.key)}
          disabled={record.shortCode === defaultLang}
        />
      ),
    },
    {
      title: 'Action',
      render: (_: any, record: LanguageData) => (
        <Space>
          <Tooltip title="Manage Translations">
            <Button size="small" type="text" icon={<TranslationOutlined />} onClick={() => handleOpenTranslation(record)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button size="small" type="text" icon={<EditOutlined />} />
          </Tooltip>
          {record.shortCode !== defaultLang && (
            <Popconfirm title="Delete this language?" onConfirm={() => handleDelete(record.key)}>
              <Button size="small" type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Default Language Selector */}
      <Card style={{ marginBottom: 24, borderRadius: 12, background: '#f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Text strong style={{ fontSize: 15 }}>System Default Language</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>This language will be used as the fallback for untranslated content</Text>
          </div>
          <Select
            value={defaultLang}
            onChange={setDefaultLang}
            style={{ width: 200 }}
            options={languages.filter(l => l.status).map(l => ({ label: l.name, value: l.shortCode }))}
          />
        </div>
      </Card>

      {/* Language Table */}
      <Card
        title={<Space><GlobalOutlined /> Language List</Space>}
        style={{ borderRadius: 12 }}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddDrawerOpen(true)}
            style={{ background: '#0e172a' }}>
            Add Language
          </Button>
        }
      >
        <Table
          dataSource={languages}
          columns={columns}
          pagination={false}
          size="middle"
        />
      </Card>

      {/* Add Language Modal */}
      <Drawer
        title="Add New Language"
        open={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        width={500}
        extra={<Button type="primary" onClick={handleAddLanguage} style={{ background: '#0e172a' }}>Add Language</Button>}
      >
        <Form form={addForm} layout="vertical" initialValues={{ direction: 'ltr' }} style={{ marginTop: 24 }}>
          <Form.Item label="Language Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="e.g. German" />
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="Short Code" name="shortCode" rules={[{ required: true }]}>
              <Input placeholder="e.g. de" maxLength={5} />
            </Form.Item>
            <Form.Item label="Direction" name="direction">
              <Select>
                <Option value="ltr">LTR (Left to Right)</Option>
                <Option value="rtl">RTL (Right to Left)</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Drawer>

      {/* Translation Modal */}
      <Drawer
        title={<Space><TranslationOutlined /> Translations â€” {selectedLang?.name}</Space>}
        open={translationDrawerOpen}
        onClose={() => setTranslationDrawerOpen(false)}
        width={900}
        extra={
          <Space>
            <Button onClick={() => setTranslationDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" icon={<SaveOutlined />} style={{ background: '#0e172a' }}
              onClick={() => { message.success('Translations saved'); setTranslationDrawerOpen(false); }}>
              Save Translations
            </Button>
          </Space>
        }
      >
        <Alert
          type="info"
          showIcon
          message={`Editing translations for ${selectedLang?.name} (${selectedLang?.shortCode})`}
          style={{ marginBottom: 24, borderRadius: 10 }}
        />
        <Table
          size="small"
          pagination={{ pageSize: 12 }}
          dataSource={translationKeys.map((t, i) => ({ ...t, key: i }))}
          columns={[
            {
              title: 'Key',
              dataIndex: 'key',
              width: 200,
              render: (text: string) => <Text code style={{ fontSize: 12 }}>{text}</Text>,
            },
            {
              title: 'English (Source)',
              dataIndex: 'en',
              width: 280,
              render: (text: string) => <Text type="secondary">{text}</Text>,
            },
            {
              title: `${selectedLang?.name || ''} Translation`,
              dataIndex: 'translated',
              render: (text: string) => (
                <Input size="small" defaultValue={text} style={{ borderRadius: 6 }} />
              ),
            },
            {
              title: '',
              width: 50,
              render: () => (
                <Button size="small" type="text" icon={<SaveOutlined />} style={{ color: '#10b981' }} />
              ),
            },
          ]}
        />
      </Drawer>
    </div>
  );
};

// ============================================================
// TAB 5: GLOBAL MAINTENANCE MODE
// ============================================================
const MaintenanceModeTab: React.FC = () => {
  const [globalMaintenance, setGlobalMaintenance] = useState(false);
  const [debugLogging, setDebugLogging] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<Record<string, boolean>>({
    ride_hailing: false, food_delivery: false, mart: false, parcel: false,
    shopping: false, hotel_booking: false, events: false, car_rental: false,
    city_to_city: false, wallet: false, loans: false,
  });

  const services = [
    { key: 'ride_hailing', label: 'Ride Hailing', icon: 'ðŸš—' },
    { key: 'food_delivery', label: 'Food Delivery', icon: 'ðŸ½ï¸' },
    { key: 'mart', label: 'Mart', icon: 'ðŸ›’' },
    { key: 'parcel', label: 'Parcel Delivery', icon: 'ðŸ“¦' },
    { key: 'shopping', label: 'Shopping', icon: 'ðŸ›ï¸' },
    { key: 'hotel_booking', label: 'Hotel Booking', icon: 'ðŸ¨' },
    { key: 'events', label: 'Events & Ticketing', icon: 'ðŸŽŸï¸' },
    { key: 'car_rental', label: 'Car Rental', icon: 'ðŸš˜' },
    { key: 'city_to_city', label: 'City to City', icon: 'ðŸšŒ' },
    { key: 'wallet', label: 'Wallet & Payments', icon: 'ðŸ’°' },
    { key: 'loans', label: 'Loans & Insurance', icon: 'ðŸ¦' },
  ];

  const handleGlobalToggle = (checked: boolean) => {
    setGlobalMaintenance(checked);
    if (checked) {
      const all: Record<string, boolean> = {};
      services.forEach(s => { all[s.key] = true; });
      setServiceStatus(all);
    }
    message.warning(checked ? 'GLOBAL MAINTENANCE MODE ACTIVATED' : 'System is back online');
  };

  const handleServiceToggle = (key: string) => {
    setServiceStatus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    message.success('Maintenance settings saved');
    setSaving(false);
  };

  const activeCount = Object.values(serviceStatus).filter(Boolean).length;

  return (
    <div style={{ maxWidth: 760 }}>
      {/* Global Master Toggle */}
      <Card
        style={{
          marginBottom: 24, borderRadius: 12,
          border: globalMaintenance ? '2px solid #ef4444' : '1px solid #e2e8f0',
          background: globalMaintenance ? '#fef2f2' : 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space size="large">
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: globalMaintenance ? '#ef4444' : '#10b981',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s',
            }}>
              {globalMaintenance
                ? <StopOutlined style={{ fontSize: 24, color: 'white' }} />
                : <ThunderboltOutlined style={{ fontSize: 24, color: 'white' }} />}
            </div>
            <div>
              <Title level={4} style={{ margin: 0, color: globalMaintenance ? '#dc2626' : '#0f172a' }}>
                {globalMaintenance ? 'ðŸ”´ MAINTENANCE MODE ACTIVE' : 'ðŸŸ¢ System Online'}
              </Title>
              <Text type="secondary">
                {globalMaintenance
                  ? 'All customers and drivers are locked out of the application'
                  : 'All services are operational and accepting requests'}
              </Text>
            </div>
          </Space>
          <Switch
            checked={globalMaintenance}
            onChange={handleGlobalToggle}
            checkedChildren="MAINTENANCE"
            unCheckedChildren="LIVE"
            style={globalMaintenance ? { background: '#ef4444' } : { background: '#10b981' }}
          />
        </div>
      </Card>

      {/* Debug & System */}
      <Card
        title={<Space><SettingOutlined /> System Controls</Space>}
        size="small" style={{ marginBottom: 16, borderRadius: 12 }}
        styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0' } }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 12, border: '1px solid #f1f5f9', borderRadius: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong>Debug Logging</Text><br />
                <Text type="secondary" style={{ fontSize: 11 }}>Verbose tracing to System Logs</Text>
              </div>
              <Switch checked={debugLogging} size="small" onChange={setDebugLogging} />
            </div>
          </div>
          <div style={{ padding: 12, border: '1px solid #f1f5f9', borderRadius: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong>API Rate Limiting</Text><br />
                <Text type="secondary" style={{ fontSize: 11 }}>Throttle incoming requests</Text>
              </div>
              <Switch defaultChecked size="small" />
            </div>
          </div>
        </div>
      </Card>

      {/* Per-Service Maintenance */}
      <Card
        title={<Space><ToolOutlined /> Per-Service Maintenance</Space>}
        size="small" style={{ marginBottom: 16, borderRadius: 12 }}
        styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0' } }}
        extra={<Tag color={activeCount > 0 ? 'red' : 'green'}>{activeCount} service{activeCount !== 1 ? 's' : ''} in maintenance</Tag>}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {services.map(svc => (
            <div key={svc.key} style={{
              padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
              border: `1px solid ${serviceStatus[svc.key] ? '#fecaca' : '#f1f5f9'}`,
              background: serviceStatus[svc.key] ? '#fef2f2' : 'white',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'all 0.2s',
            }}>
              <Space>
                <span style={{ fontSize: 18 }}>{svc.icon}</span>
                <Text strong style={{ fontSize: 12 }}>{svc.label}</Text>
              </Space>
              <Switch
                size="small"
                checked={serviceStatus[svc.key]}
                onChange={() => handleServiceToggle(svc.key)}
                style={serviceStatus[svc.key] ? { background: '#ef4444' } : {}}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Maintenance Message */}
      <Card
        title={<Space><EditOutlined /> Maintenance Page Message</Space>}
        size="small" style={{ marginBottom: 24, borderRadius: 12 }}
        styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0' } }}
      >
        <Form layout="vertical">
          <Form.Item label="Title">
            <Input defaultValue="We'll Be Right Back!" />
          </Form.Item>
          <Form.Item label="Message">
            <Input.TextArea rows={3} defaultValue="DashDrive is undergoing scheduled maintenance to improve your experience. We'll be back shortly. Thank you for your patience." />
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="Estimated Downtime">
              <Input defaultValue="2 hours" />
            </Form.Item>
            <Form.Item label="Support Contact">
              <Input defaultValue="support@dashdrive.app" />
            </Form.Item>
          </div>
        </Form>
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}
          style={{ background: '#0e172a' }}>
          Save Maintenance Settings
        </Button>
      </div>
    </div>
  );
};

// ============================================================
// TAB 6: SERVICE WEBHOOKS
// ============================================================
interface WebhookEndpoint {
  key: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'failing';
  lastTriggered: string;
  successRate: number;
  secret: string;
}

const ServiceWebhooksTab: React.FC = () => {
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [addForm] = Form.useForm();
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([
    { key: '1', name: 'Payment Gateway', url: 'https://api.dashdrive.app/webhooks/payments', events: ['payment.completed', 'payment.failed', 'refund.processed'], status: 'active', lastTriggered: '2 min ago', successRate: 99.8, secret: 'whsec_â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢' },
    { key: '2', name: 'Driver Service', url: 'https://api.dashdrive.app/webhooks/drivers', events: ['driver.online', 'driver.offline', 'trip.completed'], status: 'active', lastTriggered: '30 sec ago', successRate: 100, secret: 'whsec_â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢' },
    { key: '3', name: 'Analytics Pipeline', url: 'https://analytics.dashdrive.app/ingest', events: ['order.created', 'order.completed', 'user.signup'], status: 'active', lastTriggered: '5 min ago', successRate: 97.2, secret: 'whsec_â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢' },
    { key: '4', name: 'Fraud Detection', url: 'https://fraud.dashdrive.app/events', events: ['payment.completed', 'login.suspicious', 'account.flagged'], status: 'failing', lastTriggered: '1 hr ago', successRate: 45.0, secret: 'whsec_â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢' },
    { key: '5', name: 'CRM Sync', url: 'https://crm.example.com/api/webhooks', events: ['user.signup', 'user.updated', 'support.ticket.created'], status: 'inactive', lastTriggered: 'Never', successRate: 0, secret: 'whsec_â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢' },
  ]);

  const allEvents = [
    'payment.completed', 'payment.failed', 'refund.processed',
    'order.created', 'order.completed', 'order.cancelled',
    'user.signup', 'user.updated', 'user.deleted',
    'driver.online', 'driver.offline', 'driver.verified',
    'trip.started', 'trip.completed', 'trip.cancelled',
    'login.suspicious', 'account.flagged',
    'support.ticket.created', 'support.ticket.resolved',
  ];

  const handleToggleStatus = (key: string) => {
    setWebhooks(prev => prev.map(w => {
      if (w.key !== key) return w;
      return { ...w, status: w.status === 'active' ? 'inactive' : 'active' };
    }));
    message.success('Webhook status updated');
  };

  const handleDelete = (key: string) => {
    setWebhooks(prev => prev.filter(w => w.key !== key));
    message.success('Webhook endpoint removed');
  };

  const handleAdd = () => {
    const values = addForm.getFieldsValue();
    setWebhooks(prev => [...prev, {
      key: String(Date.now()),
      name: values.name,
      url: values.url,
      events: values.events || [],
      status: 'active',
      lastTriggered: 'Never',
      successRate: 0,
      secret: `whsec_${Math.random().toString(36).substring(2, 14)}`,
    }]);
    addForm.resetFields();
    setAddDrawerOpen(false);
    message.success('Webhook endpoint registered');
  };

  const statusColors = { active: '#10b981', inactive: '#94a3b8', failing: '#ef4444' };

  const columns = [
    {
      title: 'Endpoint',
      render: (_: any, record: WebhookEndpoint) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 13 }}>{record.name}</Text>
          <Text type="secondary" style={{ fontSize: 11, fontFamily: 'monospace' }}>{record.url}</Text>
        </Space>
      ),
    },
    {
      title: 'Events',
      dataIndex: 'events',
      width: 200,
      render: (events: string[]) => (
        <Space wrap size={2}>
          {events.slice(0, 2).map(e => <Tag key={e} style={{ fontSize: 10 }}>{e}</Tag>)}
          {events.length > 2 && <Tag style={{ fontSize: 10 }}>+{events.length - 2}</Tag>}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Badge color={statusColors[status as keyof typeof statusColors]} text={
          <Text style={{ fontSize: 12, textTransform: 'capitalize' as const }}>{status}</Text>
        } />
      ),
    },
    {
      title: 'Success Rate',
      dataIndex: 'successRate',
      width: 110,
      render: (val: number) => (
        <Text style={{ fontFamily: 'monospace', fontWeight: 600, color: val > 95 ? '#10b981' : val > 70 ? '#f59e0b' : '#ef4444' }}>
          {val}%
        </Text>
      ),
    },
    {
      title: 'Last Triggered',
      dataIndex: 'lastTriggered',
      width: 120,
      render: (text: string) => <Text type="secondary" style={{ fontSize: 12 }}>{text}</Text>,
    },
    {
      title: 'Action',
      width: 140,
      render: (_: any, record: WebhookEndpoint) => (
        <Space>
          <Switch size="small" checked={record.status === 'active'} onChange={() => handleToggleStatus(record.key)} />
          <Tooltip title="Copy Secret"><Button size="small" type="text" icon={<CopyOutlined />} onClick={() => { message.success('Webhook secret copied'); }} /></Tooltip>
          <Popconfirm title="Remove this endpoint?" onConfirm={() => handleDelete(record.key)}>
            <Button size="small" type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Alert
        type="info" showIcon icon={<CloudServerOutlined />}
        message="Service Webhooks"
        description="Register external HTTP endpoints to receive real-time event notifications from DashDrive services."
        style={{ marginBottom: 24, borderRadius: 12 }}
      />

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <Card size="small" style={{ borderRadius: 12, borderLeft: '3px solid #10b981' }}>
          <Text type="secondary" style={{ fontSize: 11 }}>Active</Text>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{webhooks.filter(w => w.status === 'active').length}</div>
        </Card>
        <Card size="small" style={{ borderRadius: 12, borderLeft: '3px solid #ef4444' }}>
          <Text type="secondary" style={{ fontSize: 11 }}>Failing</Text>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#ef4444' }}>{webhooks.filter(w => w.status === 'failing').length}</div>
        </Card>
        <Card size="small" style={{ borderRadius: 12, borderLeft: '3px solid #94a3b8' }}>
          <Text type="secondary" style={{ fontSize: 11 }}>Inactive</Text>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{webhooks.filter(w => w.status === 'inactive').length}</div>
        </Card>
        <Card size="small" style={{ borderRadius: 12, borderLeft: '3px solid #3b82f6' }}>
          <Text type="secondary" style={{ fontSize: 11 }}>Total Events</Text>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{allEvents.length}</div>
        </Card>
      </div>

      {/* Webhooks Table */}
      <Card
        title={<Space><LinkOutlined /> Registered Endpoints</Space>}
        style={{ borderRadius: 12 }}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddDrawerOpen(true)}
            style={{ background: '#0e172a' }}>
            Register Endpoint
          </Button>
        }
      >
        <Table dataSource={webhooks} columns={columns} pagination={false} size="middle" />
      </Card>

      {/* Retry Config */}
      <Card
        title={<Space><ClockCircleOutlined /> Retry Configuration</Space>}
        size="small" style={{ marginTop: 16, borderRadius: 12 }}
        styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0' } }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <Form.Item label="Max Retries">
            <InputNumber defaultValue={5} min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Retry Interval (seconds)">
            <InputNumber defaultValue={30} min={5} max={300} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Timeout (seconds)">
            <InputNumber defaultValue={10} min={3} max={60} style={{ width: '100%' }} />
          </Form.Item>
        </div>
      </Card>

      {/* Add Modal */}
      <Drawer
        title="Register Webhook Endpoint"
        open={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        width={600}
        extra={<Button type="primary" onClick={handleAdd} style={{ background: '#0e172a' }}>Register</Button>}
      >
        <Form form={addForm} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item label="Endpoint Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Payment Gateway" />
          </Form.Item>
          <Form.Item label="Webhook URL" name="url" rules={[{ required: true, type: 'url' }]}>
            <Input addonBefore={<LinkOutlined />} placeholder="https://your-server.com/webhooks" />
          </Form.Item>
          <Form.Item label="Subscribe to Events" name="events">
            <Select mode="multiple" placeholder="Select events" options={allEvents.map(e => ({ label: e, value: e }))} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export const SystemSettingsPage: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>System Settings</Title>
        <Text type="secondary">Manage environment, versions, database, localization, maintenance, and webhooks</Text>
      </div>

      <Tabs
        defaultActiveKey="environment"
        type="card"
        size="large"
        items={[
          {
            key: 'environment',
            label: <span><CloudOutlined /> Environment Setup</span>,
            children: <EnvironmentSetupTab />,
          },
          {
            key: 'version',
            label: <span><MobileOutlined /> App Version</span>,
            children: <AppVersionTab />,
          },
          {
            key: 'database',
            label: <span><DatabaseOutlined /> Clean Database</span>,
            children: <CleanDatabaseTab />,
          },
          {
            key: 'languages',
            label: <span><GlobalOutlined /> Languages</span>,
            children: <LanguagesTab />,
          },
          {
            key: 'maintenance',
            label: <span><ToolOutlined /> Maintenance Mode</span>,
            children: <MaintenanceModeTab />,
          },
          {
            key: 'webhooks',
            label: <span><CloudServerOutlined /> Service Webhooks</span>,
            children: <ServiceWebhooksTab />,
          },
        ]}
        style={{ background: 'white', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}
      />
    </div>
  );
};
