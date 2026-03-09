import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  Avatar, 
  Space, 
  Tag, 
  Statistic, 
  Divider, 
  Badge, 
  Tabs, 
  Table, 
  Progress,
  Descriptions,
  Rate,
  Modal,
  Timeline,
  Select,
  Image,
  List,
  Form,
  Input,
  message,
  notification,
  Alert
} from 'antd';
import { 
  ArrowLeftOutlined,
  PhoneOutlined,
  MailOutlined,
  StarFilled,
  DownloadOutlined,
  FileTextOutlined,
  HistoryOutlined,
  SafetyCertificateOutlined,
  EditOutlined,
  StopOutlined,
  CarOutlined,
  WalletOutlined,
  DollarOutlined,
  RiseOutlined,
  TrophyOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  BankOutlined,
  FilterOutlined,
  UserOutlined,
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  FileProtectOutlined,
  WarningOutlined as WarningIcon,
  IdcardOutlined,
  CameraOutlined,
  MessageOutlined,
  SendOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DriverDetailsProps {
  driverId: string;
  onBack: () => void;
}

export const DriverDetails: React.FC<DriverDetailsProps> = ({ driverId, onBack }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [status, setStatus] = useState<'Active' | 'Suspended'>('Active');
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [docTab, setDocTab] = useState('Personal');
  const [auditFilter, setAuditFilter] = useState('All');
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  
  const [form] = Form.useForm();
  const [msgForm] = Form.useForm();

  // Mock Data (Enhanced for Ant Design)
  const [driverData, setDriverData] = useState({
    id: driverId || 'D-201',
    name: 'John Makoni',
    phone: '+263 771 222 333',
    email: 'john.m@dashdrive.com',
    avatar: `https://picsum.photos/seed/${driverId}/200/200`,
    tier: 'Platinum',
    points: 16250,
    rating: 4.85,
    joinDate: '20 Nov 2023',
    city: 'Harare',
    appliedDate: '2023-11-15 09:22',
    fraudFlags: ['Multiple vehicles linked'],
    stats: {
      avgEarning: 96.79,
      positiveReview: 98,
      successRate: 94,
      cancellationRate: 2,
      idleHourRate: 15,
      completedTrips: 1240,
      cancelTrips: 12
    },
    wallet: {
      total: 1841.25,
      withdrawable: 450.75,
      pending: 150.00
    },
    identity: [
      { name: 'Identification (ID/Passport)', status: 'Verified', expiry: '2030-01-01', url: 'https://images.unsplash.com/photo-1579444741240-62400e9fe707?w=400', type: 'Personal' },
      { name: 'Valid Driver\'s License', status: 'Verified', expiry: '2028-10-15', url: 'https://images.unsplash.com/photo-1554224155-1696413565d3?w=400', type: 'Personal' },
      { name: 'Profile Photo Holding ID', status: 'Verified', expiry: 'N/A', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', type: 'Personal' },
      { name: 'Proof of Residency', status: 'Verified', expiry: '2025-06-01', url: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400', type: 'Personal' },
    ],
    bankInfo: {
      bankName: 'Steward Bank',
      accountName: 'John Makoni',
      accountNumber: '1002233445',
      accountType: 'Current',
      bankCode: 'SB-044',
      branchCode: '2101',
      status: 'Verified'
    },
    vehicle: {
      brand: 'Honda',
      model: 'R15',
      plate: 'AB-123',
      type: 'Economy Car',
      category: 'Bike',
      expiry: '2026-01-07',
      color: 'Midnight Blue',
      year: '2022',
      documents: [
        { name: 'Vehicle Picture', status: 'Verified', expiry: 'N/A', url: 'https://images.unsplash.com/photo-1579444741240-62400e9fe707?w=400', type: 'Vehicle' },
        { name: 'Vehicle Registration Book', status: 'Verified', expiry: 'N/A', url: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400', type: 'Vehicle' },
        { name: 'Motor Insurance', status: 'Expiring Soon', expiry: '2024-04-20', url: 'https://images.unsplash.com/photo-1554224155-1696413565d3?w=400', type: 'Vehicle' },
        { name: 'Roadworthiness Certificate', status: 'Verified', expiry: '2025-11-30', url: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400', type: 'Vehicle' },
      ]
    }
  });

  const handleStatusChange = () => {
    const action = status === 'Active' ? 'Suspend' : 'Activate';
    Modal.confirm({
      title: `Confirm ${action}`,
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to ${action.toLowerCase()} this driver? This will affect their ability to accept trips.`,
      okText: 'Yes',
      okType: action === 'Suspend' ? 'danger' : 'primary',
      cancelText: 'No',
      onOk() {
        setStatus(status === 'Active' ? 'Suspended' : 'Active');
        message.success(`Driver successfully ${status === 'Active' ? 'suspended' : 'activated'}.`);
      },
    });
  };

  const handleReward = () => {
    notification.success({ message: 'Points Awarded', description: 'Driver has been credited with reward points.' });
    // setShowRewardModal(false); // Assuming there's a reward modal
  };

  const handleDownload = (docName: string, url: string) => {
    notification.info({ 
      message: 'Preparing Download', 
      description: `Your copy of "${docName}" is being prepared. It will open in a new tab shortly.` 
    });
    setTimeout(() => {
      window.open(url, '_blank');
    }, 500); // Simulate a slight delay for preparation
  };

  const handleSendMessage = (values: any) => {
    message.loading({ content: 'Sending message...', key: 'msg' });
    setTimeout(() => {
      message.success({ content: 'Message sent successfully!', key: 'msg', duration: 2 });
      setShowMessageModal(false);
      msgForm.resetFields();
    }, 1000);
  };

  const handleEditProfile = (values: any) => {
    setDriverData({
      ...driverData,
      name: values.name,
      phone: values.phone,
      email: values.email,
      tier: values.tier,
      city: values.city,
      appliedDate: values.appliedDate,
      bankInfo: {
        ...driverData.bankInfo,
        bankName: values.bankName,
        accountName: values.accountName,
        accountNumber: values.accountNumber,
        accountType: values.accountType,
        bankCode: values.bankCode
      },
      vehicle: {
        ...driverData.vehicle,
        brand: values.vBrand,
        model: values.vModel,
        plate: values.plate,
        color: values.vColor,
        type: values.vType,
        year: values.vYear
      }
    });
    message.success('Profile updated successfully!');
    setShowEditModal(false);
  };

  const handleDownloadReport = () => {
    setIsGeneratingReport(true);
    message.loading({ content: 'Generating detailed performance report...', key: 'report' });
    setTimeout(() => {
      setIsGeneratingReport(false);
      message.success({ content: 'Report ready! Check your downloads.', key: 'report', duration: 3 });
    }, 2000);
  };

  const auditLogs = [
    { key: '1', timestamp: '2024-03-09 10:15 AM', event: 'Status Change', detail: 'Driver Account Suspended (Compliance Check)', admin: 'Sarah Connor', type: 'Status' },
    { key: '2', timestamp: '2024-03-08 04:30 PM', event: 'Document Verified', detail: 'Vehicle Registration Approved', admin: 'Mark Z.', type: 'Verification' },
    { key: '3', timestamp: '2024-03-07 09:12 AM', event: 'Reward Disbursement', detail: '500 Loyalty Points Credited (Bonus)', admin: 'System', type: 'Reward' },
    { key: '4', timestamp: '2024-03-05 11:45 AM', event: 'Profile Edit', detail: 'Email updated to john.m@dashdrive.com', admin: 'John Makoni (Self)', type: 'Profile' },
    { key: '5', timestamp: '2024-03-01 02:00 PM', event: 'Status Change', detail: 'Account Activated after verification', admin: 'Sarah Connor', type: 'Status' },
  ];

  const transactions = [
    { key: '1', id: 'TXN-7721', type: 'Credit', amount: 450.00, status: 'Success', date: '2024-02-20' },
    { key: '2', id: 'TXN-7722', type: 'Debit', amount: 20.00, status: 'Success', date: '2024-02-21' },
  ];

  const trips = [
    { 
      key: '1', 
      id: 'ORD-991', 
      customer: 'Tapfuma J.', 
      destination: 'Central Park', 
      cost: '$25.00', 
      status: 'Completed', 
      date: '2024-02-22',
      pickupAddr: '123 Samora Machel Ave, Harare',
      dropoffAddr: '456 Borrowdale Rd, Harare',
      pickupCoords: [-17.8200, 31.0500] as [number, number],
      dropoffCoords: [-17.8300, 31.0600] as [number, number],
      amountAgreed: 25.00,
      commission: 3.75,
      driverEarnings: 21.25,
      tax: 1.25,
      distance: '4.2 km',
      duration: '18 mins'
    },
    { 
      key: '2', 
      id: 'ORD-992', 
      customer: 'Nyasha C.', 
      destination: 'Downtown', 
      cost: '$18.50', 
      status: 'Completed', 
      date: '2024-02-22',
      pickupAddr: '789 Churchill Ave, Harare',
      dropoffAddr: '101 Second St, Harare',
      pickupCoords: [-17.8100, 31.0400] as [number, number],
      dropoffCoords: [-17.8250, 31.0550] as [number, number],
      amountAgreed: 18.50,
      commission: 2.78,
      driverEarnings: 15.72,
      tax: 0.93,
      distance: '2.8 km',
      duration: '12 mins'
    },
    { 
      key: '3', 
      id: 'ORD-993', 
      customer: 'Chengetai M.', 
      destination: 'Avondale', 
      cost: '$12.00', 
      status: 'Cancelled', 
      canceledBy: 'Customer',
      date: '2024-02-21',
      pickupAddr: '55 Leopold Takawira, Harare',
      dropoffAddr: '22 King George Rd, Harare',
      pickupCoords: [-17.8000, 31.0450] as [number, number],
      dropoffCoords: [-17.7900, 31.0350] as [number, number],
      amountAgreed: 12.00,
      commission: 0,
      driverEarnings: 0,
      tax: 0,
      distance: '3.1 km',
      duration: '0 mins'
    },
    { 
      key: '4', 
      id: 'ORD-994', 
      customer: 'Farai G.', 
      destination: 'Highfield', 
      cost: '$15.50', 
      status: 'Cancelled', 
      canceledBy: 'Driver',
      date: '2024-02-21',
      pickupAddr: '10 Sam Nujoma, Harare',
      dropoffAddr: '88 Willowvale Rd, Harare',
      pickupCoords: [-17.8250, 31.0500] as [number, number],
      dropoffCoords: [-17.8600, 31.0100] as [number, number],
      amountAgreed: 15.50,
      commission: 0,
      driverEarnings: 0,
      tax: 0,
      distance: '6.4 km',
      duration: '0 mins'
    },
  ];

  return (
    <div style={{ padding: '0px' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space size="middle">
          <Button icon={<ArrowLeftOutlined />} onClick={onBack} shape="circle" />
          <div>
            <Title level={4} style={{ margin: 0 }}>Driver Profile: {driverData.name}</Title>
            <Space>
              <Text type="secondary">ID: {driverData.id} • Joined {driverData.joinDate}</Text>
              <Badge status={status === 'Active' ? 'success' : 'error'} text={status} />
            </Space>
          </div>
        </Space>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={handleDownloadReport} loading={isGeneratingReport}>Report</Button>
          <Button icon={<EditOutlined />} onClick={() => setShowEditModal(true)}>Edit</Button>
          <Button 
            danger={status === 'Active'} 
            icon={status === 'Active' ? <StopOutlined /> : <CheckCircleOutlined />} 
            onClick={handleStatusChange}
          >
            {status === 'Active' ? 'Suspend' : 'Activate'}
          </Button>
          <Button type="primary" icon={<MessageOutlined />} onClick={() => setShowMessageModal(true)}>Message</Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {/* Profile Info Card */}
        <Col span={8}>
          <Card bordered={false} className="shadow-sm">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Badge count={<SafetyCertificateOutlined style={{ color: '#52c41a', fontSize: 18 }} />} offset={[-10, 80]}>
                <Avatar src={driverData.avatar} size={100} border-4 />
              </Badge>
              <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>{driverData.name}</Title>
              <Tag color="gold" icon={<TrophyOutlined />}>{driverData.tier} Partner</Tag>
              <div style={{ marginTop: 8 }}>
                <Rate disabled defaultValue={4.5} style={{ fontSize: 14 }} />
                <Text strong style={{ marginLeft: 8 }}>{driverData.rating}</Text>
              </div>
            </div>
            
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label={<Space><PhoneOutlined /> Phone</Space>}>{driverData.phone}</Descriptions.Item>
              <Descriptions.Item label={<Space><MailOutlined /> Email</Space>}>{driverData.email}</Descriptions.Item>
              <Descriptions.Item label="City">{driverData.city}</Descriptions.Item>
              <Descriptions.Item label="Applied">{driverData.appliedDate}</Descriptions.Item>
              <Descriptions.Item label="Level">{driverData.tier}</Descriptions.Item>
              <Descriptions.Item label="Trips">{driverData.stats.completedTrips}</Descriptions.Item>
            </Descriptions>
            <Divider dashed />
            <Button block icon={<IdcardOutlined />} onClick={() => { setShowDocsModal(true); setDocTab('Personal'); }}>View Identity Docs</Button>
          </Card>

          <Card bordered={false} className="shadow-sm" style={{ marginTop: 24 }}>
            <Title level={5}><BankOutlined /> Payout Settings</Title>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Bank">{driverData.bankInfo.bankName}</Descriptions.Item>
              <Descriptions.Item label="Account">{driverData.bankInfo.accountNumber}</Descriptions.Item>
              <Descriptions.Item label="Type">{driverData.bankInfo.accountType}</Descriptions.Item>
              <Descriptions.Item label="Code">{driverData.bankInfo.bankCode}</Descriptions.Item>
              <Descriptions.Item label="Holder">{driverData.bankInfo.accountName}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Badge status="success" text={driverData.bankInfo.status} />
              </Descriptions.Item>
            </Descriptions>
            <Divider dashed />
            <Button block icon={<WalletOutlined />}>Payout History</Button>
          </Card>

          <Card bordered={false} className="shadow-sm" style={{ marginTop: 24 }}>
            <Title level={5}><CarOutlined /> Vehicle Info</Title>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Type">{driverData.vehicle.type}</Descriptions.Item>
              <Descriptions.Item label="Model">{driverData.vehicle.brand} {driverData.vehicle.model}</Descriptions.Item>
              <Descriptions.Item label="Plate">{driverData.vehicle.plate}</Descriptions.Item>
              <Descriptions.Item label="Color">{driverData.vehicle.color}</Descriptions.Item>
              <Descriptions.Item label="Year">{driverData.vehicle.year}</Descriptions.Item>
              <Descriptions.Item label="Expires">{driverData.vehicle.expiry}</Descriptions.Item>
            </Descriptions>
            <Divider dashed />
            <Button block icon={<FileProtectOutlined />} onClick={() => { setShowDocsModal(true); setDocTab('Vehicle'); }}>View Vehicle Docs</Button>
            
            {driverData.fraudFlags && driverData.fraudFlags.length > 0 && (
              <Alert
                message="Compliance Alerts"
                description={
                  <ul style={{ paddingLeft: 16, margin: 0 }}>
                    {driverData.fraudFlags.map((flag, idx) => <li key={idx}><Text type="danger" style={{ fontSize: 12 }}>{flag}</Text></li>)}
                  </ul>
                }
                type="error"
                showIcon
                icon={<WarningIcon />}
                style={{ marginTop: 16 }}
              />
            )}
          </Card>
        </Col>

        {/* Analytics and Dynamic Content */}
        <Col span={16}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card bordered={false} className="shadow-sm">
                <Statistic 
                  title="Total Revenue" 
                  value={driverData.wallet.total} 
                  prefix={<DollarOutlined />} 
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false} className="shadow-sm">
                <Statistic 
                  title="Success Rate" 
                  value={driverData.stats.successRate} 
                  suffix="%" 
                  prefix={<RiseOutlined />}
                  valueStyle={{ color: '#1677ff' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false} className="shadow-sm">
                <Statistic 
                  title="Wallet Balance" 
                  value={driverData.wallet.withdrawable} 
                  prefix={<WalletOutlined />} 
                  precision={2}
                />
              </Card>
            </Col>
          </Row>

          <Card bordered={false} className="shadow-sm" style={{ marginTop: 24 }}>
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              items={[
                {
                  key: 'Overview',
                  label: 'Performance Overview',
                  children: (
                    <Row gutter={[32, 32]} style={{ padding: '16px 0' }}>
                      <Col span={6} style={{ textAlign: 'center' }}>
                        <Progress type="circle" percent={driverData.stats.positiveReview} size={80} strokeColor="#52c41a" />
                        <div style={{ marginTop: 12 }}><Text type="secondary">Positive Reviews</Text></div>
                      </Col>
                      <Col span={6} style={{ textAlign: 'center' }}>
                        <Progress type="circle" percent={driverData.stats.successRate} size={80} strokeColor="#1677ff" />
                        <div style={{ marginTop: 12 }}><Text type="secondary">Trip Success</Text></div>
                      </Col>
                      <Col span={6} style={{ textAlign: 'center' }}>
                        <Progress type="circle" percent={driverData.stats.cancellationRate} size={80} status="exception" />
                        <div style={{ marginTop: 12 }}><Text type="secondary">Cancellation</Text></div>
                      </Col>
                      <Col span={6} style={{ textAlign: 'center' }}>
                        <Progress type="circle" percent={driverData.stats.idleHourRate} size={80} strokeColor="#faad14" />
                        <div style={{ marginTop: 12 }}><Text type="secondary">Idle Rate</Text></div>
                      </Col>
                    </Row>
                  )
                },
                {
                  key: 'Trips',
                  label: 'Recent Trips',
                  children: (
                    <Table 
                      size="small"
                      dataSource={trips}
                      columns={[
                        { title: 'Trip ID', dataIndex: 'id', key: 'id', render: (t) => <Text strong>{t}</Text> },
                        { title: 'Customer', dataIndex: 'customer', key: 'customer' },
                        { title: 'Cost', dataIndex: 'cost', key: 'cost' },
                        { title: 'Status', dataIndex: 'status', key: 'status', render: (s, record: any) => (
                          <Space direction="vertical" size={0}>
                            <Badge status={s === 'Completed' ? 'success' : 'error'} text={s} />
                            {s === 'Cancelled' && <Text type="secondary" style={{ fontSize: 10 }}>By: {record.canceledBy}</Text>}
                          </Space>
                        )},
                        { title: 'Action', key: 'action', render: (_, record) => <Button size="small" type="link" onClick={() => setSelectedTrip(record)}>Details</Button> },
                      ]}
                      pagination={false}
                    />
                  )
                },
                {
                  key: 'Transactions',
                  label: 'Payments',
                  children: (
                    <Table 
                      size="small"
                      dataSource={transactions}
                      columns={[
                        { title: 'TXN ID', dataIndex: 'id', key: 'id' },
                        { title: 'Type', dataIndex: 'type', key: 'type', render: (t) => <Tag color={t === 'Credit' ? 'green' : 'red'}>{t}</Tag> },
                        { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (a) => <Text strong>${a.toFixed(2)}</Text> },
                        { title: 'Date', dataIndex: 'date', key: 'date' },
                      ]}
                      pagination={false}
                    />
                  )
                }
              ]}
            />
          </Card>

          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            <Col span={24}>
              <Card bordered={false} className="shadow-sm">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text type="secondary" style={{ display: 'block' }}>Compliance Status</Text>
                    <Space>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text strong>Fully Verified Partner</Text>
                    </Space>
                  </div>
                  <Button icon={<HistoryOutlined />} onClick={() => setShowAuditLogs(true)}>Audit Logs</Button>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Operation Logs */}
          <Card 
            bordered={false} 
            className="shadow-sm" 
            style={{ marginTop: 24 }}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <HistoryOutlined style={{ color: '#1677ff' }} />
                  <Text strong style={{ fontSize: 15 }}>Operation Logs</Text>
                </Space>
                <Button size="small" type="link" onClick={() => setShowAuditLogs(true)}>View All</Button>
              </div>
            }
          >
            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong style={{ fontSize: 13 }}>Trip Completed — ORD-991</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>Today, 02:15 PM</Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Samora Machel Ave → Borrowdale Rd • $25.00 • 4.2 km</Text>
                    </div>
                  ),
                },
                {
                  color: 'blue',
                  children: (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong style={{ fontSize: 13 }}>Payout Processed</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>Today, 11:30 AM</Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>$450.75 disbursed to Steward Bank ••3445</Text>
                    </div>
                  ),
                },
                {
                  color: 'green',
                  children: (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong style={{ fontSize: 13 }}>Trip Completed — ORD-992</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>Today, 10:48 AM</Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Churchill Ave → Second St • $18.50 • 2.8 km</Text>
                    </div>
                  ),
                },
                {
                  color: 'orange',
                  children: (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong style={{ fontSize: 13 }}>Document Expiry Warning</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>Yesterday, 09:00 AM</Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Motor Insurance expires on 2024-04-20 — renewal required</Text>
                    </div>
                  ),
                },
                {
                  color: 'red',
                  children: (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong style={{ fontSize: 13 }}>Trip Cancelled — ORD-993</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>Yesterday, 05:50 PM</Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Cancelled by Customer • Leopold Takawira → King George Rd</Text>
                    </div>
                  ),
                },
                {
                  color: 'purple',
                  children: (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong style={{ fontSize: 13 }}>Loyalty Points Credited</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>Mar 07, 09:12 AM</Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>+500 bonus points awarded by System</Text>
                    </div>
                  ),
                },
                {
                  color: 'cyan',
                  children: (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong style={{ fontSize: 13 }}>Document Verified</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>Mar 06, 04:30 PM</Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Vehicle Registration Book approved by Mark Z.</Text>
                    </div>
                  ),
                },
                {
                  color: 'green',
                  children: (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong style={{ fontSize: 13 }}>Account Activated</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>Mar 01, 02:00 PM</Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Account activated after verification by Sarah Connor</Text>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* Trip Details Modal */}
      <Modal
        title={
          <Space>
            <GlobalOutlined />
            <span>Trip Audit: {selectedTrip?.id}</span>
          </Space>
        }
        open={!!selectedTrip}
        onCancel={() => setSelectedTrip(null)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setSelectedTrip(null)}>Close Audit</Button>,
          <Button key="download" icon={<DownloadOutlined />} type="primary">Export Receipt</Button>
        ]}
      >
        {selectedTrip && (
          <Row gutter={[24, 24]}>
            <Col span={14}>
              <Card 
                size="small" 
                title="Route Visualization" 
                style={{ height: 400, overflow: 'hidden' }}
                bodyStyle={{ padding: 0 }}
              >
                <MapContainer 
                  center={selectedTrip.pickupCoords} 
                  zoom={13} 
                  style={{ height: '365px', width: '100%' }}
                  zoomControl={false}
                >
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
                  <Marker position={selectedTrip.pickupCoords}>
                    <Popup>Pickup: {selectedTrip.pickupAddr}</Popup>
                  </Marker>
                  <Marker position={selectedTrip.dropoffCoords}>
                    <Popup>Drop-off: {selectedTrip.dropoffAddr}</Popup>
                  </Marker>
                  <Polyline 
                    positions={[selectedTrip.pickupCoords, selectedTrip.dropoffCoords]} 
                    color="#1677ff" 
                    dashArray="10, 10"
                  />
                </MapContainer>
              </Card>
              
              <div style={{ marginTop: 16 }}>
                <Title level={5}><EnvironmentOutlined /> Location Details</Title>
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="Pickup Location">
                    <Text strong>{selectedTrip.pickupAddr}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Drop-off Location">
                    <Text strong>{selectedTrip.dropoffAddr}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Distance / Duration">
                    <Space split={<Divider type="vertical" />}>
                      <Text>{selectedTrip.distance}</Text>
                      <Text>{selectedTrip.duration}</Text>
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </Col>
            <Col span={10}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
                <Card size="small" title={<Space><BankOutlined /> Financial Breakdown</Space>}>
                  <Statistic 
                    title="Amount Agreed (Total Fare)" 
                    value={selectedTrip.amountAgreed} 
                    prefix="$" 
                    precision={2}
                    valueStyle={{ color: '#1677ff', fontSize: 24 }}
                  />
                  <Divider style={{ margin: '12px 0' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text type="secondary">Platform Commission (15%)</Text>
                      <Text type="danger">-${selectedTrip.commission.toFixed(2)}</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text type="secondary">Tax / VAT</Text>
                      <Text type="secondary">${selectedTrip.tax.toFixed(2)}</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px solid #f0f0f0' }}>
                      <Text strong>Settled Driver Earnings</Text>
                      <Text strong style={{ color: '#52c41a' }}>${selectedTrip.driverEarnings.toFixed(2)}</Text>
                    </div>
                  </div>
                </Card>

                <Card size="small" title={<Space><ClockCircleOutlined /> Trip Timeline</Space>} style={{ flex: 1 }}>
                  <Timeline 
                    mode="left"
                    items={[
                      { label: '05:40 PM', children: 'Trip Requested', color: 'blue' },
                      { label: '05:41 PM', children: 'Accepted by John Makoni', color: 'blue' },
                      { label: '05:45 PM', children: 'Arrived at Pickup', color: 'blue' },
                      { 
                        label: selectedTrip.status === 'Cancelled' ? '05:50 PM' : '05:48 PM', 
                        children: selectedTrip.status === 'Cancelled' ? `Trip Cancelled (by ${selectedTrip.canceledBy})` : 'Trip Started', 
                        color: selectedTrip.status === 'Cancelled' ? 'red' : 'green' 
                      },
                      selectedTrip.status === 'Completed' && { label: '06:12 PM', children: 'Trip Completed', color: 'green' },
                    ].filter(Boolean)}
                  />
                </Card>
              </div>
            </Col>
          </Row>
        )}
      </Modal>

      {/* Audit Logs Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 32 }}>
            <Space>
              <HistoryOutlined />
              <span>Operational Audit Logs: {driverData.name}</span>
            </Space>
            <Space>
              <FilterOutlined style={{ fontSize: 14, color: '#94a3b8' }} />
              <Select 
                defaultValue="All" 
                style={{ width: 150 }} 
                bordered={false}
                onChange={setAuditFilter}
              >
                <Option value="All">All Events</Option>
                <Option value="Status">Status Changes</Option>
                <Option value="Verification">Verifications</Option>
                <Option value="Profile">Profile Updates</Option>
                <Option value="Reward">Rewards</Option>
              </Select>
            </Space>
          </div>
        }
        open={showAuditLogs}
        onCancel={() => setShowAuditLogs(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setShowAuditLogs(false)}>Close Registry</Button>,
          <Button key="export" icon={<DownloadOutlined />}>Export CSV</Button>
        ]}
      >
        <Table 
          dataSource={auditFilter === 'All' ? auditLogs : auditLogs.filter(log => log.type === auditFilter)}
          pagination={{ pageSize: 8 }}
          columns={[
            { 
              title: 'Timestamp', 
              dataIndex: 'timestamp', 
              key: 'timestamp',
              render: (t) => <Text style={{ fontSize: 12, color: '#64748b' }}>{t}</Text>
            },
            { 
              title: 'Event Type', 
              dataIndex: 'event', 
              key: 'event',
              render: (e, record) => (
                <Space>
                  {record.type === 'Status' && <LockOutlined style={{ color: '#ef4444' }} />}
                  {record.type === 'Verification' && <SafetyCertificateOutlined style={{ color: '#1677ff' }} />}
                  {record.type === 'Profile' && <UserOutlined style={{ color: '#8b5cf6' }} />}
                  {record.type === 'Reward' && <TrophyOutlined style={{ color: '#eab308' }} />}
                  <Text strong style={{ fontSize: 13 }}>{e}</Text>
                </Space>
              )
            },
            { 
              title: 'Change Detail', 
              dataIndex: 'detail', 
              key: 'detail',
              render: (d) => <Text style={{ fontSize: 13 }}>{d}</Text>
            },
            { 
              title: 'Performed By', 
              dataIndex: 'admin', 
              key: 'admin',
              render: (a) => <Tag icon={<UserOutlined />} color="blue">{a}</Tag>
            }
          ]}
        />
      </Modal>

      {/* Unified Document Vault Modal */}
      <Modal
        title={
          <Space>
            <FileProtectOutlined />
            <span>Operational Document Vault: {driverData.name}</span>
          </Space>
        }
        open={showDocsModal}
        onCancel={() => setShowDocsModal(false)}
        width={850}
        footer={[
          <Button key="close" onClick={() => setShowDocsModal(false)}>Close Vault</Button>,
          <Button key="audit" icon={<HistoryOutlined />} onClick={() => { setShowDocsModal(false); setShowAuditLogs(true); }}>Audit History</Button>
        ]}
      >
        <Tabs
          activeKey={docTab}
          onChange={setDocTab}
          items={[
            {
              key: 'Personal',
              label: <Space><IdcardOutlined /> Identity & License</Space>,
              children: (
                <List
                  grid={{ gutter: 16, column: 1 }}
                  dataSource={driverData.identity}
                  renderItem={(doc) => (
                    <List.Item>
                      <Card size="small" className="shadow-sm">
                        <Row align="middle" gutter={16}>
                          <Col span={6}>
                            <Image
                              src={doc.url}
                              alt={doc.name}
                              style={{ borderRadius: 8, height: 100, width: '100%', objectFit: 'cover' }}
                              preview={{
                                visible: previewVisible && previewImage === doc.url,
                                onVisibleChange: (visible) => setPreviewVisible(visible),
                                mask: <Space><EyeOutlined /> Full View</Space>
                              }}
                            />
                          </Col>
                          <Col span={10}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <Text strong style={{ fontSize: 16 }}>{doc.name}</Text>
                              <Text type="secondary" style={{ fontSize: 12, marginBottom: 8 }}>
                                {doc.name === 'Profile Photo Holding ID' ? 'Live verification photo for face-match' : 
                                 doc.name === 'Proof of Residency' ? 'Utility bill or lease agreement' : 'Government issued document'}
                              </Text>
                              <Space wrap>
                                <Tag color={doc.status === 'Verified' ? 'success' : doc.status === 'Rejected' ? 'error' : 'warning'}>
                                  {doc.status}
                                </Tag>
                                {doc.status === 'Rejected' && <Tag color="error" style={{ fontSize: 10 }}>REASON: {doc.rejectionReason || 'Invalid image'}</Tag>}
                                {doc.expiry !== 'N/A' && <Text type="secondary" style={{ fontSize: 12 }}>Expires: {doc.expiry}</Text>}
                              </Space>
                            </div>
                          </Col>
                          <Col span={8} style={{ textAlign: 'right' }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                              <Button 
                                block 
                                size="small" 
                                icon={<EyeOutlined />}
                                onClick={() => {
                                  setPreviewImage(doc.url);
                                  setPreviewVisible(true);
                                }}
                              >
                                View Full Image
                              </Button>
                              <Button block size="small" icon={<CloudUploadOutlined />}>Revise / Update</Button>
                              <Button 
                                block 
                                size="small" 
                                icon={<DownloadOutlined />}
                                onClick={() => handleDownload(doc.name, doc.url)}
                              >
                                Download Original
                              </Button>
                            </Space>
                          </Col>
                        </Row>
                      </Card>
                    </List.Item>
                  )}
                />
              )
            },
            {
              key: 'Vehicle',
              label: <Space><CarOutlined /> Vehicle Registration</Space>,
              children: (
                <div>
                  <List
                    grid={{ gutter: 16, column: 1 }}
                    dataSource={driverData.vehicle.documents}
                    renderItem={(doc) => (
                      <List.Item>
                        <Card size="small" className="shadow-sm">
                          <Row align="middle" gutter={16}>
                            <Col span={6}>
                              <Image
                                src={doc.url}
                                alt={doc.name}
                                style={{ borderRadius: 8, height: 100, width: '100%', objectFit: 'cover' }}
                                preview={{
                                  visible: previewVisible && previewImage === doc.url,
                                  onVisibleChange: (visible) => setPreviewVisible(visible),
                                  mask: <Space><EyeOutlined /> View</Space>
                                }}
                              />
                            </Col>
                            <Col span={10}>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Text strong style={{ fontSize: 16 }}>{doc.name}</Text>
                                <Text type="secondary" style={{ fontSize: 12, marginBottom: 8 }}>
                                {doc.name === 'Vehicle Picture' ? 'Actual photo of the vehicle' : 
                                 doc.name === 'Vehicle Registration Book' ? 'Full vehicle ownership history' : 'Official registration records'}
                                </Text>
                                <Space wrap>
                                  <Tag color={doc.status === 'Verified' ? 'success' : doc.status === 'Rejected' ? 'error' : 'warning'}>
                                    {doc.status}
                                  </Tag>
                                  {doc.status === 'Rejected' && <Tag color="error" style={{ fontSize: 10 }}>REASON: {doc.rejectionReason || 'Invalid image'}</Tag>}
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    {doc.status === 'Expiring Soon' ? <Text type="danger">Expires: {doc.expiry}</Text> : `Expires: ${doc.expiry}`}
                                  </Text>
                                </Space>
                              </div>
                            </Col>
                            <Col span={8} style={{ textAlign: 'right' }}>
                              <Space direction="vertical" style={{ width: '100%' }}>
                                <Button 
                                  block 
                                  size="small" 
                                  icon={<EyeOutlined />}
                                  onClick={() => {
                                    setPreviewImage(doc.url);
                                    setPreviewVisible(true);
                                  }}
                                >
                                  View / Inspect
                                </Button>
                                <Button block size="small" icon={<CloudUploadOutlined />}>Update Document</Button>
                                <Button 
                                  block 
                                  size="small" 
                                  icon={<DownloadOutlined />}
                                  onClick={() => handleDownload(doc.name, doc.url)}
                                >
                                  Download PDF
                                </Button>
                              </Space>
                            </Col>
                          </Row>
                        </Card>
                      </List.Item>
                    )}
                  />
                  {(driverData.vehicle.documents.some(d => d.status === 'Expiring Soon')) && (
                    <div style={{ marginTop: 16 }}>
                      <Badge.Ribbon text="Critical Action" color="volcano">
                        <Card size="small" style={{ backgroundColor: '#fff2f0' }}>
                          <Space>
                            <WarningIcon style={{ color: '#ff4d4f' }} />
                            <Text type="danger" strong>Action Required: Motor Insurance is expiring in 11 days.</Text>
                          </Space>
                        </Card>
                      </Badge.Ribbon>
                    </div>
                  )}
                </div>
              )
            }
          ]}
        />
      </Modal>

      {/* Messaging Modal */}
      <Modal
        title={
          <Space>
            <MessageOutlined />
            <span>Operational Messaging: {driverData.name}</span>
          </Space>
        }
        open={showMessageModal}
        onCancel={() => setShowMessageModal(false)}
        onOk={() => msgForm.submit()}
        okText="Send Message"
        okButtonProps={{ icon: <SendOutlined /> }}
        width={500}
      >
        <Form form={msgForm} layout="vertical" onFinish={handleSendMessage}>
          <Form.Item label="Message Template" name="template">
            <Select placeholder="Select a quick response...">
              <Option value="compliance">Document Compliance Notice</Option>
              <Option value="performance">Peak Performance Incentive</Option>
              <Option value="warning">Safety Warning</Option>
              <Option value="tip">Weekly Pro Tip</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="Message Content" 
            name="content"
            rules={[{ required: true, message: 'Please type a message' }]}
          >
            <TextArea rows={4} placeholder="Type your instruction to the driver here..." />
          </Form.Item>
          <div style={{ backgroundColor: '#f0f9ff', padding: '12px', borderRadius: '8px' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <InfoCircleOutlined style={{ marginRight: 4 }} />
              This message will be delivered as an in-app notification and an SMS to the driver's registered phone number.
            </Text>
          </div>
        </Form>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            <span>Edit Operational Profile: {driverData.id}</span>
          </Space>
        }
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        onOk={() => form.submit()}
        width={650}
        okText="Update Registry"
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleEditProfile}
          initialValues={{
            name: driverData.name,
            phone: driverData.phone,
            email: driverData.email,
            tier: driverData.tier,
            city: driverData.city,
            appliedDate: driverData.appliedDate,
            vType: driverData.vehicle.type,
            vBrand: driverData.vehicle.brand,
            vModel: driverData.vehicle.model,
            vYear: driverData.vehicle.year,
            plate: driverData.vehicle.plate,
            vColor: driverData.vehicle.color,
            bankName: driverData.bankInfo.bankName,
            accountName: driverData.bankInfo.accountName,
            accountNumber: driverData.bankInfo.accountNumber,
            accountType: driverData.bankInfo.accountType,
            bankCode: driverData.bankInfo.bankCode
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Partner Tier" name="tier">
                <Select>
                  <Option value="Standard">Standard</Option>
                  <Option value="Silver">Silver</Option>
                  <Option value="Gold">Gold</Option>
                  <Option value="Platinum">Platinum</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Registration City" name="city">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Applied Date" name="appliedDate">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Phone Number" name="phone" rules={[{ required: true }]}>
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Email Address" name="email" rules={[{ required: true, type: 'email' }]}>
                <Input prefix={<MailOutlined />} />
              </Form.Item>
            </Col>
          </Row>
          <Divider dashed>Bank Account Details (Payouts)</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Bank Name" name="bankName">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Account Name" name="accountName">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Account Number" name="accountNumber">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Account Type" name="accountType">
                <Select>
                  <Option value="Current">Current</Option>
                  <Option value="Savings">Savings</Option>
                  <Option value="Business">Business</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Bank Code" name="bankCode">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Divider dashed>Vehicle Information</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Brand" name="vBrand">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Model" name="vModel">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Vehicle Type" name="vType">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Year" name="vYear">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Number Plate" name="plate">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Vehicle Color" name="vColor">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

// Helper for Info Icon (Ant Design doesn't have it by default in some versions, using this for safety)
const InfoCircleOutlined = ({ style }: { style?: React.CSSProperties }) => (
  <svg 
    viewBox="64 64 896 896" 
    focusable="false" 
    data-icon="info-circle" 
    width="1em" 
    height="1em" 
    fill="currentColor" 
    aria-hidden="true"
    style={style}
  >
    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
    <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path>
  </svg>
);
