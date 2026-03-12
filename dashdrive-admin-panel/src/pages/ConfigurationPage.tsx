import React, { useState } from 'react';
import {
  Tabs, Card, Form, Input, Select, Switch, Button, Table, Tag, Space, Typography,
  Divider, InputNumber, message, Alert, Collapse, Tooltip, Badge, Slider, Radio
} from 'antd';
import {
  BellOutlined, ApiOutlined, ScanOutlined, RobotOutlined,
  SaveOutlined, ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined,
  MailOutlined, MessageOutlined, MobileOutlined, ThunderboltOutlined,
  GoogleOutlined, FacebookOutlined, AppleOutlined, CreditCardOutlined,
  CloudOutlined, SafetyCertificateOutlined, SettingOutlined, ExperimentOutlined,
  EyeOutlined, KeyOutlined, LinkOutlined,
  CarOutlined, ClockCircleOutlined, ShoppingCartOutlined, CoffeeOutlined,
  ShopOutlined, GiftOutlined, UserAddOutlined, UserOutlined, MoreOutlined,
  EditOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Panel } = Collapse;
const { TextArea } = Input;

// ============================================================
// NOTIFICATION MESSAGE PANEL (reusable per service)
// ============================================================
interface NotificationMessage {
  key: string;
  event: string;
  pushTitle: string;
  pushBody: string;
  smsBody: string;
  emailSubject: string;
  pushEnabled: boolean;
  smsEnabled: boolean;
  emailEnabled: boolean;
}

const NotificationMessagePanel: React.FC<{ messages: NotificationMessage[]; color: string }> = ({ messages, color }) => {
  const [data, setData] = useState(messages);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const handleToggle = (key: string, channel: 'pushEnabled' | 'smsEnabled' | 'emailEnabled') => {
    setData(prev => prev.map(m => m.key === key ? { ...m, [channel]: !m[channel] } : m));
  };

  const columns = [
    {
      title: 'Event',
      dataIndex: 'event',
      width: 180,
      render: (text: string) => <Text strong style={{ fontSize: 12 }}>{text}</Text>,
    },
    {
      title: 'Push Notification',
      dataIndex: 'pushTitle',
      render: (text: string, record: NotificationMessage) => (
        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          <Text style={{ fontSize: 12, fontWeight: 600 }}>{text}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.pushBody}</Text>
        </Space>
      ),
    },
    {
      title: <Space><MobileOutlined /> Push</Space>,
      dataIndex: 'pushEnabled',
      width: 70,
      align: 'center' as const,
      render: (val: boolean, record: NotificationMessage) => (
        <Switch size="small" checked={val} onChange={() => handleToggle(record.key, 'pushEnabled')} />
      ),
    },
    {
      title: <Space><MessageOutlined /> SMS</Space>,
      dataIndex: 'smsEnabled',
      width: 70,
      align: 'center' as const,
      render: (val: boolean, record: NotificationMessage) => (
        <Switch size="small" checked={val} onChange={() => handleToggle(record.key, 'smsEnabled')} />
      ),
    },
    {
      title: <Space><MailOutlined /> Email</Space>,
      dataIndex: 'emailEnabled',
      width: 70,
      align: 'center' as const,
      render: (val: boolean, record: NotificationMessage) => (
        <Switch size="small" checked={val} onChange={() => handleToggle(record.key, 'emailEnabled')} />
      ),
    },
    {
      title: 'Action',
      width: 60,
      render: (_: any, record: NotificationMessage) => (
        <Button size="small" type="text" icon={<EditOutlined />}
          onClick={() => setEditingKey(editingKey === record.key ? null : record.key)} />
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={data} columns={columns} pagination={false} size="small"
        expandable={{
          expandedRowKeys: editingKey ? [editingKey] : [],
          expandedRowRender: (record) => (
            <div style={{ padding: '8px 0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 11 }}>Push Title</Text>
                  <Input size="small" defaultValue={record.pushTitle} style={{ marginTop: 4 }} />
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 11 }}>Email Subject</Text>
                  <Input size="small" defaultValue={record.emailSubject} style={{ marginTop: 4 }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 11 }}>Push / SMS Body</Text>
                  <TextArea rows={2} defaultValue={record.pushBody} style={{ marginTop: 4, fontSize: 12 }} />
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 11 }}>SMS Body (if different)</Text>
                  <TextArea rows={2} defaultValue={record.smsBody} style={{ marginTop: 4, fontSize: 12 }} />
                </div>
              </div>
              <div style={{ marginTop: 8, textAlign: 'right' }}>
                <Button size="small" type="primary" icon={<SaveOutlined />} style={{ background: '#0e172a' }}
                  onClick={() => { message.success('Message template updated'); setEditingKey(null); }}>
                  Update
                </Button>
              </div>
            </div>
          ),
          showExpandColumn: false,
        }}
      />
      <div style={{ marginTop: 12, textAlign: 'right' }}>
        <Button type="primary" icon={<SaveOutlined />} style={{ background: '#0e172a' }}
          onClick={() => message.success('All notification messages saved')}>
          Save All Messages
        </Button>
      </div>
    </div>
  );
};

// ============================================================
// NOTIFICATION SERVICE CONFIGS
// ============================================================
const scheduleTripMessages: NotificationMessage[] = [
  { key: 's1', event: 'Trip Scheduled', pushTitle: 'Trip Scheduled! 🗓️', pushBody: 'Your trip to {{destination}} is confirmed for {{date}} at {{time}}.', smsBody: 'DashDrive: Trip to {{destination}} confirmed for {{date}} {{time}}.', emailSubject: 'Your Scheduled Trip Confirmation', pushEnabled: true, smsEnabled: true, emailEnabled: true },
  { key: 's2', event: 'Trip Reminder (1hr)', pushTitle: 'Trip Starting Soon ⏰', pushBody: 'Your scheduled trip to {{destination}} starts in 1 hour.', smsBody: 'DashDrive: Your trip starts in 1 hour.', emailSubject: 'Trip Reminder - Starting Soon', pushEnabled: true, smsEnabled: true, emailEnabled: false },
  { key: 's3', event: 'Driver Assigned', pushTitle: 'Driver On The Way 🚗', pushBody: '{{driverName}} is heading to your pickup in {{vehicle}}.', smsBody: 'DashDrive: {{driverName}} ({{vehicle}}) is on the way.', emailSubject: 'Your Driver is Assigned', pushEnabled: true, smsEnabled: false, emailEnabled: false },
  { key: 's4', event: 'Trip Cancelled', pushTitle: 'Trip Cancelled ❌', pushBody: 'Your scheduled trip for {{date}} has been cancelled.', smsBody: 'DashDrive: Scheduled trip cancelled for {{date}}.', emailSubject: 'Trip Cancellation Notice', pushEnabled: true, smsEnabled: true, emailEnabled: true },
];

const regularTripMessages: NotificationMessage[] = [
  { key: 'r1', event: 'Ride Accepted', pushTitle: 'Ride Accepted ✅', pushBody: '{{driverName}} accepted your ride. Arriving in {{eta}} min.', smsBody: 'DashDrive: Driver arriving in {{eta}} min.', emailSubject: 'Ride Confirmed', pushEnabled: true, smsEnabled: false, emailEnabled: false },
  { key: 'r2', event: 'Driver Arrived', pushTitle: 'Driver Has Arrived 📍', pushBody: '{{driverName}} is waiting at the pickup point.', smsBody: 'DashDrive: Your driver is at the pickup.', emailSubject: 'Driver Arrived', pushEnabled: true, smsEnabled: true, emailEnabled: false },
  { key: 'r3', event: 'Trip Started', pushTitle: 'Trip In Progress 🚀', pushBody: 'Your trip to {{destination}} has started. Enjoy the ride!', smsBody: 'DashDrive: Trip started.', emailSubject: 'Trip Started', pushEnabled: true, smsEnabled: false, emailEnabled: false },
  { key: 'r4', event: 'Trip Completed', pushTitle: 'Trip Completed 🎉', pushBody: 'You arrived at {{destination}}. Total: {{currency}}{{amount}}', smsBody: 'DashDrive: Trip complete. Total: {{currency}}{{amount}}', emailSubject: 'Trip Receipt', pushEnabled: true, smsEnabled: true, emailEnabled: true },
  { key: 'r5', event: 'Rate Your Driver', pushTitle: 'How Was Your Ride? ⭐', pushBody: 'Rate {{driverName}} and help us improve.', smsBody: '', emailSubject: 'Rate Your Recent Trip', pushEnabled: true, smsEnabled: false, emailEnabled: true },
];

const parcelMessages: NotificationMessage[] = [
  { key: 'p1', event: 'Parcel Picked Up', pushTitle: 'Parcel Collected 📦', pushBody: 'Your parcel has been picked up and is on the way.', smsBody: 'DashDrive: Parcel collected, en route.', emailSubject: 'Parcel Picked Up', pushEnabled: true, smsEnabled: true, emailEnabled: true },
  { key: 'p2', event: 'Parcel In Transit', pushTitle: 'Parcel In Transit 🚚', pushBody: 'Your parcel is being delivered. Track it live.', smsBody: 'DashDrive: Parcel in transit.', emailSubject: 'Parcel In Transit', pushEnabled: true, smsEnabled: false, emailEnabled: false },
  { key: 'p3', event: 'Parcel Delivered', pushTitle: 'Parcel Delivered ✅', pushBody: 'Your parcel was delivered to {{recipient}}.', smsBody: 'DashDrive: Parcel delivered to {{recipient}}.', emailSubject: 'Parcel Delivery Confirmation', pushEnabled: true, smsEnabled: true, emailEnabled: true },
  { key: 'p4', event: 'Delivery Failed', pushTitle: 'Delivery Issue ⚠️', pushBody: 'We couldn\'t deliver your parcel. Reason: {{reason}}', smsBody: 'DashDrive: Delivery failed — {{reason}}.', emailSubject: 'Delivery Issue', pushEnabled: true, smsEnabled: true, emailEnabled: true },
];

const foodMessages: NotificationMessage[] = [
  { key: 'f1', event: 'Order Placed', pushTitle: 'Order Confirmed 🍽️', pushBody: 'Your order from {{restaurant}} is being prepared.', smsBody: 'DashDrive: Order from {{restaurant}} confirmed.', emailSubject: 'Food Order Confirmation', pushEnabled: true, smsEnabled: true, emailEnabled: true },
  { key: 'f2', event: 'Preparing', pushTitle: 'Being Prepared 👨‍🍳', pushBody: '{{restaurant}} is preparing your order. Est. {{eta}} min.', smsBody: '', emailSubject: '', pushEnabled: true, smsEnabled: false, emailEnabled: false },
  { key: 'f3', event: 'Rider Picked Up', pushTitle: 'Food On The Way 🛵', pushBody: '{{driverName}} has picked up your food!', smsBody: 'DashDrive: Food on the way!', emailSubject: 'Food Being Delivered', pushEnabled: true, smsEnabled: false, emailEnabled: false },
  { key: 'f4', event: 'Delivered', pushTitle: 'Enjoy Your Meal! 🎉', pushBody: 'Your order from {{restaurant}} has been delivered.', smsBody: 'DashDrive: Food delivered!', emailSubject: 'Food Delivery Receipt', pushEnabled: true, smsEnabled: true, emailEnabled: true },
];

const martMessages: NotificationMessage[] = [
  { key: 'm1', event: 'Order Placed', pushTitle: 'Mart Order Placed 🛒', pushBody: 'Your mart order is being processed.', smsBody: 'DashDrive Mart: Order confirmed.', emailSubject: 'Mart Order Confirmation', pushEnabled: true, smsEnabled: true, emailEnabled: true },
  { key: 'm2', event: 'Items Picked', pushTitle: 'Items Collected ✅', pushBody: 'All items have been picked. Rider on the way.', smsBody: 'DashDrive Mart: Items collected, on the way.', emailSubject: 'Items Collected', pushEnabled: true, smsEnabled: false, emailEnabled: false },
  { key: 'm3', event: 'Item Unavailable', pushTitle: 'Item Substitution ⚠️', pushBody: '{{item}} is unavailable. We replaced it with {{substitute}}.', smsBody: 'DashDrive: {{item}} replaced with {{substitute}}.', emailSubject: 'Item Substitution Notice', pushEnabled: true, smsEnabled: true, emailEnabled: true },
  { key: 'm4', event: 'Delivered', pushTitle: 'Mart Order Delivered 📦', pushBody: 'Your mart order has been delivered!', smsBody: 'DashDrive Mart: Delivered!', emailSubject: 'Mart Delivery Confirmation', pushEnabled: true, smsEnabled: true, emailEnabled: true },
];

const shoppingMessages: NotificationMessage[] = [
  { key: 'sh1', event: 'Order Confirmed', pushTitle: 'Order Placed 🛍️', pushBody: 'Your shopping order has been confirmed!', smsBody: 'DashDrive Shop: Order confirmed.', emailSubject: 'Shopping Order Confirmation', pushEnabled: true, smsEnabled: true, emailEnabled: true },
  { key: 'sh2', event: 'Shipped', pushTitle: 'Order Shipped 📮', pushBody: 'Your order is on the way. Track it live.', smsBody: 'DashDrive Shop: Order shipped.', emailSubject: 'Order Shipped', pushEnabled: true, smsEnabled: true, emailEnabled: true },
  { key: 'sh3', event: 'Out For Delivery', pushTitle: 'Almost There 🚚', pushBody: 'Your order is out for delivery today.', smsBody: 'DashDrive Shop: Out for delivery.', emailSubject: 'Out For Delivery', pushEnabled: true, smsEnabled: false, emailEnabled: false },
  { key: 'sh4', event: 'Delivered', pushTitle: 'Delivered! 🎉', pushBody: 'Your shopping order has been delivered.', smsBody: 'DashDrive Shop: Delivered!', emailSubject: 'Delivery Confirmation', pushEnabled: true, smsEnabled: true, emailEnabled: true },
  { key: 'sh5', event: 'Refund Processed', pushTitle: 'Refund Issued 💰', pushBody: '{{currency}}{{amount}} refunded for order #{{orderId}}.', smsBody: 'DashDrive: Refund of {{currency}}{{amount}} processed.', emailSubject: 'Refund Confirmation', pushEnabled: true, smsEnabled: true, emailEnabled: true },
];

const driverRegMessages: NotificationMessage[] = [
  { key: 'd1', event: 'Registration Received', pushTitle: 'Welcome to DashDrive 🚗', pushBody: 'Your driver registration has been received. We\'ll review it shortly.', smsBody: 'DashDrive: Registration received. Under review.', emailSubject: 'Driver Registration Received', pushEnabled: true, smsEnabled: true, emailEnabled: true },
  { key: 'd2', event: 'Documents Required', pushTitle: 'Documents Needed 📄', pushBody: 'Please upload {{documentType}} to complete registration.', smsBody: 'DashDrive: Upload {{documentType}} to proceed.', emailSubject: 'Documents Required', pushEnabled: true, smsEnabled: true, emailEnabled: true },
  { key: 'd3', event: 'Approved', pushTitle: 'You\'re Approved! 🎉', pushBody: 'Congratulations! You can now start accepting rides.', smsBody: 'DashDrive: You\'re approved! Start driving now.', emailSubject: 'Driver Application Approved', pushEnabled: true, smsEnabled: true, emailEnabled: true },
  { key: 'd4', event: 'Rejected', pushTitle: 'Application Update ❌', pushBody: 'Your application needs attention. Reason: {{reason}}', smsBody: 'DashDrive: Application issue — {{reason}}.', emailSubject: 'Driver Application Update', pushEnabled: true, smsEnabled: true, emailEnabled: true },
  { key: 'd5', event: 'Document Expiring', pushTitle: 'Document Expiring ⚠️', pushBody: 'Your {{documentType}} expires in {{days}} days.', smsBody: 'DashDrive: {{documentType}} expires in {{days}} days.', emailSubject: 'Document Expiring Soon', pushEnabled: true, smsEnabled: true, emailEnabled: true },
];

const userMessages: NotificationMessage[] = [
  { key: 'u1', event: 'Welcome', pushTitle: 'Welcome to DashDrive! 🎉', pushBody: 'Your account is ready. Explore rides, food, shopping & more.', smsBody: 'Welcome to DashDrive! Download: {{appUrl}}', emailSubject: 'Welcome to DashDrive', pushEnabled: true, smsEnabled: true, emailEnabled: true },
  { key: 'u2', event: 'OTP Verification', pushTitle: '', pushBody: '', smsBody: 'DashDrive: Your code is {{otp}}. Valid for 5 minutes.', emailSubject: 'Your Verification Code', pushEnabled: false, smsEnabled: true, emailEnabled: true },
  { key: 'u3', event: 'Password Reset', pushTitle: '', pushBody: '', smsBody: 'DashDrive: Reset code is {{code}}. Expires in 15 min.', emailSubject: 'Password Reset Request', pushEnabled: false, smsEnabled: true, emailEnabled: true },
  { key: 'u4', event: 'Profile Updated', pushTitle: 'Profile Updated ✅', pushBody: 'Your profile information has been updated.', smsBody: '', emailSubject: 'Profile Updated', pushEnabled: true, smsEnabled: false, emailEnabled: true },
  { key: 'u5', event: 'Wallet Top-Up', pushTitle: 'Wallet Credited 💰', pushBody: '{{currency}}{{amount}} added to your wallet. Balance: {{currency}}{{balance}}', smsBody: 'DashDrive: Wallet +{{currency}}{{amount}}. Balance: {{currency}}{{balance}}', emailSubject: 'Wallet Top-Up Confirmation', pushEnabled: true, smsEnabled: true, emailEnabled: true },
];

const otherMessages: NotificationMessage[] = [
  { key: 'o1', event: 'Promotion', pushTitle: '🔥 Special Offer!', pushBody: '{{promoMessage}}. Use code: {{promoCode}}', smsBody: 'DashDrive: {{promoMessage}}. Code: {{promoCode}}', emailSubject: 'Special Offer For You', pushEnabled: true, smsEnabled: true, emailEnabled: true },
  { key: 'o2', event: 'Referral Reward', pushTitle: 'Referral Reward 🎁', pushBody: 'You earned {{currency}}{{amount}} for referring {{friendName}}!', smsBody: 'DashDrive: Referral reward of {{currency}}{{amount}}!', emailSubject: 'Referral Reward Earned', pushEnabled: true, smsEnabled: true, emailEnabled: true },
  { key: 'o3', event: 'System Maintenance', pushTitle: 'Scheduled Maintenance 🔧', pushBody: 'DashDrive will be briefly unavailable on {{date}} at {{time}}.', smsBody: 'DashDrive: Maintenance on {{date}} {{time}}.', emailSubject: 'Scheduled Maintenance Notice', pushEnabled: true, smsEnabled: false, emailEnabled: true },
  { key: 'o4', event: 'App Update', pushTitle: 'New Version Available 📱', pushBody: 'Update DashDrive to v{{version}} for the latest features.', smsBody: '', emailSubject: 'DashDrive App Update Available', pushEnabled: true, smsEnabled: false, emailEnabled: true },
  { key: 'o5', event: 'Survey Request', pushTitle: 'We Value Your Feedback 📝', pushBody: 'Help us improve! Take a 2-minute survey.', smsBody: '', emailSubject: 'We\'d Love Your Feedback', pushEnabled: true, smsEnabled: false, emailEnabled: true },
];

// ============================================================
// TAB 1: NOTIFICATION SETTINGS (with sub-tabs)
// ============================================================
const NotificationTab: React.FC = () => {
  const serviceSubTabs = [
    { key: 'schedule_trip', label: 'Schedule Trip', icon: <ClockCircleOutlined />, color: '#6366f1', messages: scheduleTripMessages },
    { key: 'regular_trip', label: 'Regular Trip', icon: <CarOutlined />, color: '#0ea5e9', messages: regularTripMessages },
    { key: 'parcel', label: 'Parcel', icon: <GiftOutlined />, color: '#f59e0b', messages: parcelMessages },
    { key: 'food', label: 'Food', icon: <CoffeeOutlined />, color: '#ef4444', messages: foodMessages },
    { key: 'mart', label: 'Mart', icon: <ShopOutlined />, color: '#10b981', messages: martMessages },
    { key: 'shopping', label: 'Shopping', icon: <ShoppingCartOutlined />, color: '#8b5cf6', messages: shoppingMessages },
    { key: 'driver_reg', label: 'Driver Registration', icon: <UserAddOutlined />, color: '#0e172a', messages: driverRegMessages },
    { key: 'user', label: 'User', icon: <UserOutlined />, color: '#3b82f6', messages: userMessages },
    { key: 'other', label: 'Other', icon: <MoreOutlined />, color: '#64748b', messages: otherMessages },
  ];

  return (
    <div>
      <Alert
        type="info" showIcon icon={<BellOutlined />}
        message="Notification Messages"
        description="Configure notification message templates for each service. Toggle Push, SMS, and Email channels per event. Use {{variables}} for dynamic content."
        style={{ marginBottom: 20, borderRadius: 12 }}
      />

      <Tabs
        tabPosition="left"
        size="small"
        style={{ minHeight: 500 }}
        items={serviceSubTabs.map(tab => ({
          key: tab.key,
          label: (
            <Space style={{ minWidth: 140 }}>
              <span style={{ color: tab.color }}>{tab.icon}</span>
              <Text style={{ fontSize: 13 }}>{tab.label}</Text>
            </Space>
          ),
          children: (
            <div style={{ paddingLeft: 8 }}>
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 6, height: 24, borderRadius: 3, background: tab.color }} />
                <Title level={5} style={{ margin: 0 }}>{tab.label} Notifications</Title>
                <Tag>{tab.messages.length} events</Tag>
              </div>
              <NotificationMessagePanel messages={tab.messages} color={tab.color} />
            </div>
          ),
        }))}
      />
    </div>
  );
};

// ============================================================
// TAB 2: 3RD PARTY INTEGRATIONS
// ============================================================
interface IntegrationItem {
  key: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'error';
  fields: { label: string; key: string; type: 'text' | 'password' | 'url'; value: string }[];
}

const ThirdPartyTab: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>({
    google_maps: true, stripe: true, paystack: true, google_auth: true,
    facebook_auth: false, apple_auth: false, aws_s3: true, recaptcha: true,
    sms_gateway: true, firebase_otp: true, email_config: true,
  });

  const handleToggleEnabled = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEnabledMap(prev => ({ ...prev, [key]: !prev[key] }));
    message.success(`${enabledMap[key] ? 'Disabled' : 'Enabled'} integration`);
  };

  const integrations: IntegrationItem[] = [
    {
      key: 'google_maps', name: 'Google Maps', category: 'Maps & Location', icon: <GoogleOutlined />,
      status: 'connected',
      fields: [
        { label: 'API Key', key: 'apiKey', type: 'password', value: 'AIza••••••••••••••••••••' },
        { label: 'Map ID', key: 'mapId', type: 'text', value: 'dashdrive-map-001' },
      ],
    },
    {
      key: 'stripe', name: 'Stripe', category: 'Payment Gateway', icon: <CreditCardOutlined />,
      status: 'connected',
      fields: [
        { label: 'Publishable Key', key: 'pubKey', type: 'password', value: 'pk_live_••••••••' },
        { label: 'Secret Key', key: 'secretKey', type: 'password', value: 'sk_live_••••••••' },
        { label: 'Webhook Secret', key: 'webhookSecret', type: 'password', value: 'whsec_••••••••' },
      ],
    },
    {
      key: 'paystack', name: 'Paystack', category: 'Payment Gateway', icon: <CreditCardOutlined style={{ color: '#00C3F7' }} />,
      status: 'connected',
      fields: [
        { label: 'Public Key', key: 'pubKey', type: 'password', value: 'pk_live_••••••••' },
        { label: 'Secret Key', key: 'secretKey', type: 'password', value: 'sk_live_••••••••' },
      ],
    },
    {
      key: 'google_auth', name: 'Google OAuth', category: 'Social Login', icon: <GoogleOutlined style={{ color: '#4285F4' }} />,
      status: 'connected',
      fields: [
        { label: 'Client ID', key: 'clientId', type: 'text', value: '102938.apps.googleusercontent.com' },
        { label: 'Client Secret', key: 'clientSecret', type: 'password', value: 'GOCSPX-••••••••' },
      ],
    },
    {
      key: 'facebook_auth', name: 'Facebook OAuth', category: 'Social Login', icon: <FacebookOutlined style={{ color: '#1877F2' }} />,
      status: 'disconnected',
      fields: [
        { label: 'App ID', key: 'appId', type: 'text', value: '' },
        { label: 'App Secret', key: 'appSecret', type: 'password', value: '' },
      ],
    },
    {
      key: 'apple_auth', name: 'Apple Sign-In', category: 'Social Login', icon: <AppleOutlined />,
      status: 'disconnected',
      fields: [
        { label: 'Service ID', key: 'serviceId', type: 'text', value: '' },
        { label: 'Team ID', key: 'teamId', type: 'text', value: '' },
        { label: 'Key ID', key: 'keyId', type: 'text', value: '' },
      ],
    },
    {
      key: 'aws_s3', name: 'AWS S3 Storage', category: 'Cloud Storage', icon: <CloudOutlined style={{ color: '#FF9900' }} />,
      status: 'connected',
      fields: [
        { label: 'Access Key', key: 'accessKey', type: 'password', value: 'AKIA••••••••••••' },
        { label: 'Secret Key', key: 'secretKey', type: 'password', value: '••••••••••••••••' },
        { label: 'Bucket Name', key: 'bucket', type: 'text', value: 'dashdrive-uploads' },
        { label: 'Region', key: 'region', type: 'text', value: 'af-south-1' },
      ],
    },
    {
      key: 'recaptcha', name: 'Google reCAPTCHA', category: 'Security', icon: <SafetyCertificateOutlined style={{ color: '#4285F4' }} />,
      status: 'connected',
      fields: [
        { label: 'Site Key', key: 'siteKey', type: 'text', value: '6Lf••••••••••••••••••••' },
        { label: 'Secret Key', key: 'secretKey', type: 'password', value: '6Lf••••••••••••••••••••' },
      ],
    },
    {
      key: 'sms_gateway', name: 'SMS Gateway', category: 'Communication', icon: <MessageOutlined style={{ color: '#10b981' }} />,
      status: 'connected',
      fields: [
        { label: 'Provider', key: 'provider', type: 'text', value: 'Twilio' },
        { label: 'Account SID', key: 'accountSid', type: 'password', value: 'AC••••••••••••••••' },
        { label: 'Auth Token', key: 'authToken', type: 'password', value: '••••••••••••••••' },
        { label: 'From Number', key: 'fromNumber', type: 'text', value: '+1234567890' },
      ],
    },
    {
      key: 'firebase_otp', name: 'Firebase OTP', category: 'Authentication', icon: <MobileOutlined style={{ color: '#FFCA28' }} />,
      status: 'connected',
      fields: [
        { label: 'FCM Server Key', key: 'fcmServerKey', type: 'password', value: 'AAAA••••••••••••••••••••••••' },
        { label: 'Sender ID', key: 'senderId', type: 'text', value: '102938475610' },
        { label: 'Project ID', key: 'projectId', type: 'text', value: 'dashdrive-prod' },
        { label: 'Web API Key', key: 'webApiKey', type: 'password', value: 'AIza••••••••••••••••••••' },
      ],
    },
    {
      key: 'email_config', name: 'Email Config (SMTP)', category: 'Communication', icon: <MailOutlined style={{ color: '#3b82f6' }} />,
      status: 'connected',
      fields: [
        { label: 'Mail Driver', key: 'mailDriver', type: 'text', value: 'SMTP' },
        { label: 'Host', key: 'mailHost', type: 'text', value: 'smtp.gmail.com' },
        { label: 'Port', key: 'mailPort', type: 'text', value: '587' },
        { label: 'Username', key: 'mailUsername', type: 'text', value: 'noreply@dashdrive.app' },
        { label: 'Password', key: 'mailPassword', type: 'password', value: '••••••••' },
        { label: 'Encryption', key: 'mailEncryption', type: 'text', value: 'TLS' },
        { label: 'From Name', key: 'mailFromName', type: 'text', value: 'DashDrive' },
        { label: 'From Address', key: 'mailFromAddress', type: 'text', value: 'noreply@dashdrive.app' },
      ],
    },
  ];

  const statusColors = { connected: 'success', disconnected: 'default', error: 'error' } as const;

  return (
    <div style={{ maxWidth: 800 }}>
      <Alert
        type="info" showIcon icon={<ApiOutlined />}
        message="Third-Party Service Integrations"
        description="Connect external APIs for maps, payments, social login, storage, and security services."
        style={{ marginBottom: 24, borderRadius: 12 }}
      />

      <Collapse
        accordion
        style={{ borderRadius: 12, background: 'white' }}
        items={integrations.map(item => ({
          key: item.key,
          label: (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', opacity: enabledMap[item.key] ? 1 : 0.5 }}>
              <Space>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <div>
                  <Text strong>{item.name}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 11 }}>{item.category}</Text>
                </div>
              </Space>
              <Space>
                <Tag color={enabledMap[item.key] ? statusColors[item.status] : 'default'}>
                  {enabledMap[item.key] ? item.status.toUpperCase() : 'DISABLED'}
                </Tag>
                <Switch
                  size="small"
                  checked={enabledMap[item.key]}
                  onClick={(_, e) => handleToggleEnabled(item.key, e as unknown as React.MouseEvent)}
                  checkedChildren="ON"
                  unCheckedChildren="OFF"
                />
              </Space>
            </div>
          ),
          children: (
            <Form layout="vertical">
              <div style={{ display: 'grid', gridTemplateColumns: item.fields.length > 2 ? '1fr 1fr' : '1fr', gap: 16 }}>
                {item.fields.map(field => (
                  <Form.Item key={field.key} label={field.label}>
                    {field.type === 'password' ? (
                      <Input.Password defaultValue={field.value} placeholder={`Enter ${field.label}`} disabled={!enabledMap[item.key]} />
                    ) : (
                      <Input defaultValue={field.value} placeholder={`Enter ${field.label}`} disabled={!enabledMap[item.key]} />
                    )}
                  </Form.Item>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button size="small" icon={<ReloadOutlined />} disabled={!enabledMap[item.key]}>Test</Button>
                <Button size="small" type="primary" icon={<SaveOutlined />} style={{ background: '#0e172a' }} disabled={!enabledMap[item.key]}>Save</Button>
              </div>
            </Form>
          ),
        }))}
      />
    </div>
  );
};

// ============================================================
// TAB 3: FACE VERIFICATION API
// ============================================================
const FaceVerificationTab: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    message.success('Face verification settings saved');
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <Alert
        type="info" showIcon icon={<ScanOutlined />}
        message="Face Verification & Identity"
        description="Configure face recognition APIs for driver and user identity verification during onboarding and trip safety checks."
        style={{ marginBottom: 24, borderRadius: 12 }}
      />

      <Form form={form} layout="vertical" initialValues={{
        provider: 'aws_rekognition',
        enabled: true,
        driverOnboarding: true,
        periodicDriverCheck: true,
        periodicInterval: 24,
        userVerification: false,
        livenessDetection: true,
        confidenceThreshold: 85,
        maxRetries: 3,
        apiKey: 'AKIA••••••••••••',
        apiSecret: '••••••••••••••••',
        region: 'af-south-1',
        webhookUrl: 'https://api.dashdrive.app/webhooks/face-verify',
      }}>
        {/* Provider Selection */}
        <Card
          title={<Space><EyeOutlined /> Verification Provider</Space>}
          size="small" style={{ marginBottom: 16, borderRadius: 12 }}
          styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0' } }}
          extra={
            <Form.Item name="enabled" valuePropName="checked" style={{ margin: 0 }}>
              <Switch checkedChildren="Active" unCheckedChildren="Disabled" />
            </Form.Item>
          }
        >
          <Form.Item label="Face Verification Provider" name="provider">
            <Select>
              <Option value="aws_rekognition">AWS Rekognition</Option>
              <Option value="azure_face">Azure Face API</Option>
              <Option value="google_vision">Google Cloud Vision</Option>
              <Option value="faceplusplus">Face++</Option>
              <Option value="trulioo">Trulioo</Option>
              <Option value="jumio">Jumio</Option>
              <Option value="onfido">Onfido</Option>
            </Select>
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="API Key / Access Key" name="apiKey">
              <Input.Password placeholder="API Key" />
            </Form.Item>
            <Form.Item label="API Secret" name="apiSecret">
              <Input.Password placeholder="API Secret" />
            </Form.Item>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="Region" name="region">
              <Input placeholder="e.g. us-east-1" />
            </Form.Item>
            <Form.Item label="Webhook URL" name="webhookUrl">
              <Input addonBefore={<LinkOutlined />} placeholder="https://..." />
            </Form.Item>
          </div>
        </Card>

        {/* Verification Rules */}
        <Card
          title={<Space><SafetyCertificateOutlined /> Verification Rules</Space>}
          size="small" style={{ marginBottom: 16, borderRadius: 12 }}
          styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0' } }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div style={{ padding: 12, border: '1px solid #f1f5f9', borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Driver Onboarding</Text><br />
                  <Text type="secondary" style={{ fontSize: 11 }}>Require face match during signup</Text>
                </div>
                <Form.Item name="driverOnboarding" valuePropName="checked" style={{ margin: 0 }}>
                  <Switch size="small" />
                </Form.Item>
              </div>
            </div>
            <div style={{ padding: 12, border: '1px solid #f1f5f9', borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Periodic Driver Check</Text><br />
                  <Text type="secondary" style={{ fontSize: 11 }}>Re-verify drivers periodically</Text>
                </div>
                <Form.Item name="periodicDriverCheck" valuePropName="checked" style={{ margin: 0 }}>
                  <Switch size="small" />
                </Form.Item>
              </div>
            </div>
            <div style={{ padding: 12, border: '1px solid #f1f5f9', borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>User Verification</Text><br />
                  <Text type="secondary" style={{ fontSize: 11 }}>Verify user identity for high-value transactions</Text>
                </div>
                <Form.Item name="userVerification" valuePropName="checked" style={{ margin: 0 }}>
                  <Switch size="small" />
                </Form.Item>
              </div>
            </div>
            <div style={{ padding: 12, border: '1px solid #f1f5f9', borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Liveness Detection</Text><br />
                  <Text type="secondary" style={{ fontSize: 11 }}>Anti-spoofing (prevents photo attacks)</Text>
                </div>
                <Form.Item name="livenessDetection" valuePropName="checked" style={{ margin: 0 }}>
                  <Switch size="small" />
                </Form.Item>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="Confidence Threshold (%)" name="confidenceThreshold">
              <Slider min={50} max={99} marks={{ 50: '50%', 75: '75%', 85: '85%', 99: '99%' }} />
            </Form.Item>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Form.Item label="Max Retries" name="maxRetries">
                <InputNumber style={{ width: '100%' }} min={1} max={10} />
              </Form.Item>
              <Form.Item label="Check Interval (hrs)" name="periodicInterval">
                <InputNumber style={{ width: '100%' }} min={1} max={168} />
              </Form.Item>
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Button icon={<ReloadOutlined />}>Test API Connection</Button>
          <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}
            style={{ background: '#0e172a' }}>
            Save Face Verification Settings
          </Button>
        </div>
      </Form>
    </div>
  );
};

// ============================================================
// TAB 4: AI SETUP
// ============================================================
const AISetupTab: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    message.success('AI configuration saved');
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <Alert
        type="info" showIcon icon={<RobotOutlined />}
        message="AI & Machine Learning Configuration"
        description="Configure AI engines for dispatch optimization, fraud detection, demand forecasting, chatbot support, and dynamic pricing."
        style={{ marginBottom: 24, borderRadius: 12 }}
      />

      <Form form={form} layout="vertical" initialValues={{
        llmProvider: 'openai',
        llmModel: 'gpt-4o',
        llmApiKey: 'sk-••••••••••••••••••••',
        llmTemperature: 0.3,
        llmMaxTokens: 2048,
        dispatchAI: true,
        fraudAI: true,
        demandForecast: true,
        chatbotEnabled: true,
        dynamicPricing: true,
        sentimentAnalysis: false,
        routeOptimization: true,
        etaModel: 'ml_ensemble',
      }}>
        {/* LLM Provider */}
        <Card
          title={<Space><ExperimentOutlined /> LLM Provider (Chatbot & Support)</Space>}
          size="small" style={{ marginBottom: 16, borderRadius: 12 }}
          styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0' } }}
        >
          <Form.Item label="LLM Provider" name="llmProvider">
            <Select>
              <Option value="openai">OpenAI</Option>
              <Option value="anthropic">Anthropic (Claude)</Option>
              <Option value="google">Google Gemini</Option>
              <Option value="mistral">Mistral AI</Option>
              <Option value="azure_openai">Azure OpenAI</Option>
              <Option value="self_hosted">Self-Hosted (Ollama / vLLM)</Option>
            </Select>
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="Model" name="llmModel">
              <Select>
                <Option value="gpt-4o">GPT-4o</Option>
                <Option value="gpt-4o-mini">GPT-4o Mini</Option>
                <Option value="claude-3.5-sonnet">Claude 3.5 Sonnet</Option>
                <Option value="gemini-2.0-flash">Gemini 2.0 Flash</Option>
                <Option value="mistral-large">Mistral Large</Option>
              </Select>
            </Form.Item>
            <Form.Item label="API Key" name="llmApiKey">
              <Input.Password placeholder="Enter API key" />
            </Form.Item>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="Temperature" name="llmTemperature">
              <Slider min={0} max={1} step={0.1} marks={{ 0: 'Precise', 0.5: 'Balanced', 1: 'Creative' }} />
            </Form.Item>
            <Form.Item label="Max Tokens" name="llmMaxTokens">
              <InputNumber style={{ width: '100%' }} min={256} max={8192} step={256} />
            </Form.Item>
          </div>
        </Card>

        {/* AI Feature Toggles */}
        <Card
          title={<Space><ThunderboltOutlined /> AI Feature Toggles</Space>}
          size="small" style={{ marginBottom: 16, borderRadius: 12 }}
          styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0' } }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { key: 'dispatchAI', label: 'Smart Dispatch', desc: 'AI-powered driver assignment & batching', icon: '🚗' },
              { key: 'fraudAI', label: 'Fraud Detection', desc: 'Real-time anomaly detection on transactions', icon: '🛡️' },
              { key: 'demandForecast', label: 'Demand Forecasting', desc: 'Predict peak hours and driver demand', icon: '📈' },
              { key: 'chatbotEnabled', label: 'AI Chatbot', desc: 'Automated customer & driver support', icon: '💬' },
              { key: 'dynamicPricing', label: 'Dynamic Pricing', desc: 'ML-based surge pricing engine', icon: '💰' },
              { key: 'sentimentAnalysis', label: 'Sentiment Analysis', desc: 'Analyze reviews and support tickets', icon: '🧠' },
              { key: 'routeOptimization', label: 'Route Optimization', desc: 'TSP solver for multi-stop deliveries', icon: '🗺️' },
            ].map(item => (
              <div key={item.key} style={{ padding: 12, border: '1px solid #f1f5f9', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div>
                    <Text strong style={{ fontSize: 13 }}>{item.label}</Text><br />
                    <Text type="secondary" style={{ fontSize: 11 }}>{item.desc}</Text>
                  </div>
                </Space>
                <Form.Item name={item.key} valuePropName="checked" style={{ margin: 0 }}>
                  <Switch size="small" />
                </Form.Item>
              </div>
            ))}
          </div>
        </Card>

        {/* ETA Prediction Model */}
        <Card
          title={<Space><SettingOutlined /> ETA Prediction Model</Space>}
          size="small" style={{ marginBottom: 24, borderRadius: 12 }}
          styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0' } }}
        >
          <Form.Item label="ETA Model Type" name="etaModel">
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="simple">Simple (Distance/Speed)</Radio.Button>
              <Radio.Button value="ml_ensemble">ML Ensemble</Radio.Button>
              <Radio.Button value="deep_learning">Deep Learning</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Card>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Button>Reset to Defaults</Button>
          <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}
            style={{ background: '#0e172a' }}>
            Save AI Configuration
          </Button>
        </div>
      </Form>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export const ConfigurationPage: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Configuration</Title>
        <Text type="secondary">Manage notifications, integrations, verification, and AI services</Text>
      </div>

      <Tabs
        defaultActiveKey="notifications"
        type="card"
        size="large"
        items={[
          {
            key: 'notifications',
            label: <span><BellOutlined /> Notification</span>,
            children: <NotificationTab />,
          },
          {
            key: 'thirdparty',
            label: <span><ApiOutlined /> 3rd Party</span>,
            children: <ThirdPartyTab />,
          },
          {
            key: 'faceverify',
            label: <span><ScanOutlined /> Face Verification API</span>,
            children: <FaceVerificationTab />,
          },
          {
            key: 'ai',
            label: <span><RobotOutlined /> AI Setup</span>,
            children: <AISetupTab />,
          },
        ]}
        style={{ background: 'white', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}
      />
    </div>
  );
};
