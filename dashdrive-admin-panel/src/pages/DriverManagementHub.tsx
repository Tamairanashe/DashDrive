import React, { useState } from 'react';
import { 
  Table, Tag, Space, Button, Input, Card, Typography, Tabs, 
  Row, Col, Statistic, Avatar, Tooltip, Badge, Dropdown, 
  Drawer, Form, Select, DatePicker, List, Rate, Empty, Divider,
  Modal, InputNumber, Radio, Descriptions, Switch, Segmented, App, Flex
} from 'antd';
import { 
  SearchOutlined, PlusOutlined, UserOutlined, FileTextOutlined,
  SafetyCertificateOutlined, WalletOutlined, HistoryOutlined,
  StarOutlined, WarningOutlined, StopOutlined, BarChartOutlined,
  MoreOutlined, CheckCircleOutlined, CloseCircleOutlined,
  EnvironmentOutlined, CarOutlined, PhoneOutlined, MailOutlined,
  CloudUploadOutlined, MessageOutlined, BellOutlined, SafetyOutlined,
  AuditOutlined, SwapOutlined, ThunderboltOutlined, RocketOutlined,
  DollarOutlined, LockOutlined, UnlockOutlined, ArrowUpOutlined, ArrowDownOutlined,
  CrownOutlined, TrophyOutlined, RiseOutlined, FilterOutlined,
  CheckOutlined, CloseOutlined, SyncOutlined, FileSearchOutlined
} from '@ant-design/icons';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie 
} from 'recharts';

const { Title, Text, Paragraph } = Typography;

export const DriverManagementHub: React.FC = () => {
  const { message, notification, modal } = App.useApp();
  const [activeTab, setActiveTab] = useState('1');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<any>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [form] = Form.useForm();
  const [walletForm] = Form.useForm();
  const [deleteForm] = Form.useForm();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<any>(null);
  const [incidentForm] = Form.useForm();
  const [reasonForm] = Form.useForm();

  // Governance & Trash State
  const [isTrashDrawerOpen, setIsTrashDrawerOpen] = useState(false);
  const [trashedDrivers, setTrashedDrivers] = useState<any[]>([]);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [reasonTarget, setReasonTarget] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [filterCity, setFilterCity] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [filterCategory, setFilterCategory] = useState<string | undefined>(undefined);

  const handleResetFilters = () => {
    setSearchText('');
    setFilterCity(undefined);
    setFilterStatus(undefined);
    setFilterCategory(undefined);
  };

  // Mock Data for Driver List
  const [drivers, setDrivers] = useState([
    { 
      id: 'DR-1023', name: 'Devid Jack', email: 'c*****@customer.com', phone: '+8****', vehicle: 'Toyota Prius', rating: 4.0, status: 'Active', city: 'Harare', category: 'Economy', walletBalance: 156.00, isFrozen: false, 
      trips: 3, cancellationRate: '0%', acceptanceRate: '98%', joinDate: '12 Jan 2023', tier: 'Bronze',
      services: ['Ride Request', 'Parcel (Capacity-Unlimited)'],
      avgActiveRate: '0%', avgEarningValue: 52.00, positiveReviewRate: '100%', successRate: '100%', todayIdleHourRate: '0%',
      collectableCash: 0, pendingWithdraw: 0, alreadyWithdrawn: 0, withdrawableAmount: 136.50, totalEarning: 156.00,
      completedTrips: 3, cancelledTrips: 0, lowestPriceTrip: 71.50, highestPriceTrip: 71.50,
      idDocuments: ['2023-11-20-655b66dfcc71a.png'], otherDocuments: ['2023-11-20-655b66dfcd620.jpg']
    },
    { 
      id: 'DR-1024', name: 'Sarah Chipo', email: 's.chipo@dashdrive.com', phone: '+263 782 998 122', vehicle: 'Honda Fit', rating: 4.5, status: 'Offline', city: 'Bulawayo', category: 'Economy', walletBalance: 22.00, isFrozen: false, 
      trips: 850, cancellationRate: '3.5%', acceptanceRate: '92%', joinDate: '05 Mar 2023', tier: 'Silver',
      services: ['Ride Request'],
      avgActiveRate: '85%', avgEarningValue: 45.00, positiveReviewRate: '94%', successRate: '96%', todayIdleHourRate: '1.2h',
      collectableCash: 12.00, pendingWithdraw: 45.00, alreadyWithdrawn: 1200.00, withdrawableAmount: 550.00, totalEarning: 1800.00,
      completedTrips: 840, cancelledTrips: 10, lowestPriceTrip: 5.00, highestPriceTrip: 45.00,
      idDocuments: ['doc1.png'], otherDocuments: ['doc2.jpg']
    },
    { 
      id: 'DR-1027', name: 'New Applicant', email: 'new.recruit@dashdrive.com', phone: '+263 770 000 000', vehicle: 'N/A', rating: 0, status: 'Active', city: 'Harare', category: 'Economy', walletBalance: 0, isFrozen: false, 
      trips: 0, cancellationRate: '0%', acceptanceRate: '0%', joinDate: 'Just Now', tier: 'Bronze',
      services: ['Ride Request'],
      avgActiveRate: '0%', avgEarningValue: 0, positiveReviewRate: '0%', successRate: '0%', todayIdleHourRate: '0%',
      collectableCash: 0, pendingWithdraw: 0, alreadyWithdrawn: 0, withdrawableAmount: 0, totalEarning: 0,
      completedTrips: 0, cancelledTrips: 0, lowestPriceTrip: 0, highestPriceTrip: 0,
      idDocuments: [], otherDocuments: []
    }
  ]);

  // Mock Data for Deep-Dive Tabs
  const tripsHistory = [
    { driverId: 'DR-1023', id: 'TRP-8821', pickup: 'Avondale Shopping Centre', dropoff: 'Belgravia', fare: 71.50, distance: '12.4 km', duration: '28 min', status: 'Completed', date: 'Today, 09:24 AM' },
    { driverId: 'DR-1023', id: 'TRP-8825', pickup: 'Borrowdale Village', dropoff: 'Greystone Park', fare: 12.00, distance: '4.2 km', duration: '12 min', status: 'Completed', date: 'Yesterday, 04:12 PM' },
    { driverId: 'DR-1023', id: 'TRP-8830', pickup: 'Mart Central', dropoff: 'Highlands', fare: 8.50, distance: '3.1 km', duration: '8 min', status: 'Completed', date: '12 Mar 2024' },
    { driverId: 'DR-1024', id: 'TRP-9001', pickup: 'Airport', dropoff: 'CBD', fare: 25.00, distance: '22 km', duration: '35 min', status: 'Completed', date: 'Today, 10:15 AM' },
  ];

  const walletHistory = [
    { driverId: 'DR-1023', id: 'TXN-5501', type: 'Earning', description: 'Trip TRP-8821 Payment', amount: 71.50, balance: 156.00, date: 'Today, 09:30 AM' },
    { driverId: 'DR-1023', id: 'TXN-5502', type: 'Withdrawal', description: 'Weekly Payout', amount: -65.00, balance: 84.50, date: 'Yesterday, 05:00 PM' },
    { driverId: 'DR-1023', id: 'TXN-5503', type: 'Adjustment', description: 'Bonus: 100% Success Rate', amount: 5.00, balance: 149.50, date: '12 Mar 2024' },
  ];

  const driverReviews = [
    { driverId: 'DR-1023', reviewer: 'John S.', rating: 5, comment: 'Very professional and quick delivery. Vehicle was clean.', date: 'Today, 09:45 AM' },
    { driverId: 'DR-1023', reviewer: 'Mary P.', rating: 4, comment: 'Helpful driver, but traffic was bad.', date: 'Yesterday, 04:30 PM' },
  ];

  const ListTab = () => (
    <div style={{ marginTop: 20 }}>
      <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={7}>
            <Input 
              placeholder="Search name, phone or ID..." 
              prefix={<SearchOutlined />} 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select 
              placeholder="City" 
              style={{ width: '100%' }} 
              allowClear 
              value={filterCity}
              onChange={setFilterCity}
            >
              <Select.Option value="Harare">Harare</Select.Option>
              <Select.Option value="Bulawayo">Bulawayo</Select.Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select 
              placeholder="Status" 
              style={{ width: '100%' }} 
              allowClear 
              value={filterStatus}
              onChange={setFilterStatus}
            >
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Offline">Offline</Select.Option>
              <Select.Option value="Suspended">Suspended</Select.Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select 
              placeholder="Category" 
              style={{ width: '100%' }} 
              allowClear 
              value={filterCategory}
              onChange={setFilterCategory}
            >
              <Select.Option value="Economy">Economy</Select.Option>
              <Select.Option value="Premium">Premium</Select.Option>
              <Select.Option value="XL">XL</Select.Option>
              <Select.Option value="Delivery">Delivery</Select.Option>
            </Select>
          </Col>
          <Col span={5} style={{ textAlign: 'right' }}>
            <Space>
              <Tooltip title="Reset Filters">
                <Button icon={<SyncOutlined />} onClick={handleResetFilters} />
              </Tooltip>
              <Button icon={<HistoryOutlined />} onClick={() => setIsTrashDrawerOpen(true)}>Trash</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsDrawerOpen(true)}>Add New</Button>
            </Space>
          </Col>
        </Row>
        <Table 
          dataSource={drivers.filter(d => {
            const matchesSearch = !searchText || 
              d.name.toLowerCase().includes(searchText.toLowerCase()) || 
              d.id.toLowerCase().includes(searchText.toLowerCase()) ||
              d.phone.includes(searchText);
            const matchesCity = !filterCity || d.city === filterCity;
            const matchesStatus = !filterStatus || d.status === filterStatus;
            const matchesCategory = !filterCategory || d.category === filterCategory;
            return matchesSearch && matchesCity && matchesStatus && matchesCategory;
          })}
          rowKey="id"
          columns={[
            { title: 'Driver ID', dataIndex: 'id', key: 'id', width: 100, fixed: 'left', render: (t) => <Text strong style={{ whiteSpace: 'nowrap' }}>{t}</Text> },
            { 
              title: 'Name', 
              key: 'name', 
              width: 220,
              render: (_, record) => (
                <Space style={{ whiteSpace: 'nowrap' }}>
                  <Avatar icon={<UserOutlined />} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text strong>{record.name}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>{record.email}</Text>
                  </div>
                </Space>
              )
            },
            { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 150, render: (p) => <Text style={{ whiteSpace: 'nowrap' }}>{p}</Text> },
            { 
              title: 'Tier', 
              dataIndex: 'tier', 
              key: 'tier',
              width: 120,
              render: (tier) => {
                const colors: any = { Platinum: 'purple', Gold: 'gold', Silver: 'cyan', Bronze: 'orange' };
                const icons: any = { Platinum: <CrownOutlined />, Gold: <TrophyOutlined />, Silver: <StarOutlined />, Bronze: <RiseOutlined /> };
                return (
                  <Tag color={colors[tier]} icon={icons[tier]} style={{ fontWeight: 600, borderRadius: 6 }}>
                    {tier}
                  </Tag>
                );
              }
            },
            { 
              title: 'Category', 
              dataIndex: 'category', 
              key: 'category',
              width: 120,
              render: (cat) => <Tag color={cat === 'Premium' ? 'gold' : cat === 'Delivery' ? 'blue' : 'default'}>{cat}</Tag>
            },
            { title: 'Vehicle', dataIndex: 'vehicle', key: 'vehicle', width: 160, render: (v) => <Tag icon={<CarOutlined />} style={{ whiteSpace: 'nowrap' }}>{v}</Tag> },
            { title: 'Rating', dataIndex: 'rating', key: 'rating', width: 120, render: (r) => <Rate disabled defaultValue={r} style={{ fontSize: 12, display: 'flex' }} /> },
            { 
              title: 'Wallet', 
              key: 'wallet',
              width: 135,
              render: (_, record) => (
                <div 
                  className="shadow-sm"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: 10,
                    background: record.walletBalance < 0 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                    border: record.walletBalance < 0 ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)',
                    minWidth: 100
                  }}
                >
                  <Space size={6}>
                    <WalletOutlined style={{ color: record.walletBalance < 0 ? '#ef4444' : '#10b981', fontSize: 13 }} />
                    <Text strong style={{ color: record.walletBalance < 0 ? '#ef4444' : '#10b981', fontSize: 13 }}>
                      ${Math.abs(record.walletBalance).toFixed(2)}
                      {record.walletBalance < 0 && "-"}
                    </Text>
                  </Space>
                  <Tooltip title="Quick Adjust">
                    <Button 
                      size="small" 
                      type="text" 
                      icon={<SwapOutlined style={{ fontSize: 12, color: '#94a3b8' }} />} 
                      style={{ padding: 0, height: 20, width: 20 }}
                      onClick={(e) => { 
                        e.stopPropagation();
                        setSelectedDriver(record); 
                        setIsWalletModalOpen(true); 
                      }} 
                    />
                  </Tooltip>
                </div>
              )
            },
            { 
              title: 'Total Trip', 
              dataIndex: 'trips', 
              key: 'trips', 
              width: 110, 
              align: 'center',
              render: (trips) => <Text strong>{trips}</Text>
            },
            { 
              title: 'Earnings', 
              dataIndex: 'totalEarning', 
              key: 'totalEarning', 
              width: 130,
              render: (earnings) => <Text strong style={{ color: '#059669' }}>${(earnings || 0).toFixed(2)}</Text>
            },
            { 
              title: 'Status Toggle', 
              key: 'statusToggle',
              width: 130,
              align: 'center',
              render: (_, record) => (
                <Tooltip title={record.isFrozen ? "Unfreeze Driver" : "Freeze Driver"}>
                  <Switch 
                    checked={!record.isFrozen} 
                    onChange={() => {
                      setReasonTarget(record);
                      setIsReasonModalOpen(true);
                      reasonForm.setFieldsValue({ reason: '' });
                    }}
                    checkedChildren="Active"
                    unCheckedChildren="Frozen"
                  />
                </Tooltip>
              )
            },
            { 
              title: 'Profile Status', 
              key: 'status',
              width: 140,
              render: (_, record) => (
                <Tag color={record.isFrozen ? 'volcano' : record.status === 'Active' ? 'success' : 'default'} style={{ whiteSpace: 'nowrap' }}>
                  {record.isFrozen ? 'Account Frozen' : record.status}
                </Tag>
              )
            },
            { title: 'City', dataIndex: 'city', key: 'city', width: 120 },
            {
              title: 'Actions',
              key: 'actions',
              align: 'right',
              width: 150,
              fixed: 'right',
              render: (_, record) => (
                <Space>
                  <Button size="small" type="primary" onClick={() => { setSelectedDriver(record); setIsDetailDrawerOpen(true); }}>View</Button>
                  <Dropdown menu={{ 
                    items: [
                      { key: 'edit', label: 'Edit Profile', icon: <PlusOutlined />, onClick: () => { setSelectedDriver(record); setEditingDriver(record); setIsDrawerOpen(true); } },
                      { key: 'logs', label: 'View Logs', icon: <HistoryOutlined />, onClick: () => setActiveTab('9') },
                      { key: 'wallet', label: 'Adjust Wallet', icon: <DollarOutlined />, onClick: () => { setSelectedDriver(record); setIsWalletModalOpen(true); } },
                      { type: 'divider' },
                      { 
                        key: 'delete', 
                        label: 'Delete Driver',
                        danger: true,
                        icon: <StopOutlined />,
                        onClick: () => {
                          const hasOnhandData = (record.trips || 0) > 0 || (record.totalEarning || 0) > 0;
                          if (hasOnhandData) {
                            Modal.warning({
                              title: 'Operation Denied',
                              content: 'Sorry you cannot delete this driver, because there are ongoing rides or payments due to this driver. Only drivers with zero earnings or trips can be deleted.',
                              centered: true,
                              okButtonProps: { type: 'primary', danger: true }
                            });
                          } else {
                            setDriverToDelete(record);
                            setIsDeleteModalOpen(true);
                          }
                        }
                      }
                    ] 
                  }}>
                    <Button size="small" icon={<MoreOutlined />} />
                  </Dropdown>
                </Space>
              )
            }
          ]}
          scroll={{ x: 1600 }}
        />
      </Card>
    </div>
  );

  const RequestsTab = () => (
    <div style={{ marginTop: 20 }}>
      <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
        <Table 
          dataSource={[
            { id: 'RQ-234', name: 'Alex K', email: 'alex.k@google.com', phone: '+263 77x xxxx', city: 'Harare', vehicle: 'Honda Fit', status: 'Pending', date: '12 Mar' }
          ]}
          columns={[
            { title: 'Request ID', dataIndex: 'id', key: 'id', width: 120 },
            { 
              title: 'Name', 
              key: 'name',
              width: 220,
              render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text strong>{record.name}</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>{record.email}</Text>
                </div>
              )
            },
            { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 150 },
            { title: 'City', dataIndex: 'city', key: 'city', width: 120 },
            { title: 'Vehicle', dataIndex: 'vehicle', key: 'vehicle', width: 150 },
            { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (s) => <Badge status="processing" text={s} /> },
            { title: 'Date', dataIndex: 'date', key: 'date', width: 100 },
            {
              title: 'Actions',
              key: 'actions',
              width: 140,
              fixed: 'right',
              render: () => (
                <Space>
                  <Button size="small" type="primary" ghost>Review</Button>
                  <Button size="small" icon={<CheckCircleOutlined />} style={{ color: '#10b981' }} />
                  <Button size="small" icon={<CloseCircleOutlined />} danger />
                </Space>
              )
            }
          ]}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );

  const DocumentsTab = () => {
    const [docFilter, setDocFilter] = useState('All');
    const [docData, setDocData] = useState([
      { id: 'DOC-101', driver: 'John M', doc: 'Driver License', expiry: '2027-12-15', status: 'Verified', type: 'Identity' },
      { id: 'DOC-102', driver: 'Sarah C', doc: 'Police Clearance', expiry: '2024-05-20', status: 'Pending', type: 'Legal' },
      { id: 'DOC-103', driver: 'Mike N', doc: 'Insurance', expiry: '2023-11-01', status: 'Rejected', type: 'Vehicle' },
      { id: 'DOC-104', driver: 'Elena R', doc: 'Vehicle Registration', expiry: '2025-08-10', status: 'Verified', type: 'Vehicle' },
    ]);

    const filteredDocs = docFilter === 'All' ? docData : docData.filter(d => d.status === docFilter);

    const handleVerify = (id: string, status: string) => {
      setDocData(prev => prev.map(d => d.id === id ? { ...d, status } : d));
      message.success(`Document marked as ${status}`);
    };

    return (
      <div style={{ marginTop: 20 }}>
        <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <Text strong>Filter by Status:</Text>
              <Radio.Group value={docFilter} onChange={e => setDocFilter(e.target.value)} buttonStyle="solid">
                <Radio.Button value="All">All</Radio.Button>
                <Radio.Button value="Verified">Verified</Radio.Button>
                <Radio.Button value="Pending">Pending</Radio.Button>
                <Radio.Button value="Rejected">Rejected</Radio.Button>
              </Radio.Group>
            </Space>
            <Button icon={<AuditOutlined />}>Bulk Verification</Button>
          </div>
          <Table 
            dataSource={filteredDocs}
            rowKey="id"
            columns={[
              { title: 'Doc ID', dataIndex: 'id', key: 'id', width: 100 },
              { title: 'Driver', dataIndex: 'driver', key: 'driver', width: 150, render: (t) => <Text strong>{t}</Text> },
              { title: 'Document Type', dataIndex: 'doc', key: 'doc', width: 180 },
              { title: 'Category', dataIndex: 'type', key: 'type', width: 120, render: (t) => <Tag>{t}</Tag> },
              { title: 'Expiry Date', dataIndex: 'expiry', key: 'expiry', width: 120 },
              { 
                title: 'Status', 
                dataIndex: 'status', 
                key: 'status',
                width: 120,
                render: (s) => (
                  <Tag color={s === 'Verified' ? 'success' : s === 'Pending' ? 'warning' : 'error'} icon={s === 'Verified' ? <CheckCircleOutlined /> : s === 'Pending' ? <SyncOutlined spin /> : <CloseCircleOutlined />}>
                    {s}
                  </Tag>
                )
              },
              {
                title: 'Actions',
                key: 'actions',
                width: 200,
                fixed: 'right',
                render: (_, record) => (
                  <Space>
                    <Button size="small" icon={<FileSearchOutlined />}>View</Button>
                    {record.status === 'Pending' && (
                      <>
                        <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => handleVerify(record.id, 'Verified')} />
                        <Button size="small" danger icon={<CloseOutlined />} onClick={() => handleVerify(record.id, 'Rejected')} />
                      </>
                    )}
                  </Space>
                )
              }
            ]}
            scroll={{ x: 1000 }}
          />
        </Card>
      </div>
    );
  };

  const FinancialTab = () => (
    <div style={{ marginTop: 20 }}>
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
            <Col span={6}><Card className="shadow-sm"><Statistic title="Total Payouts" value={142500} prefix="$" /></Card></Col>
            <Col span={6}><Card className="shadow-sm"><Statistic title="Pending Settlements" value={12400} prefix="$" styles={{ content: { color: '#faad14' } }} /></Card></Col>
            <Col span={6}><Card className="shadow-sm"><Statistic title="Avg Driver Earnings" value={850} prefix="$" /></Card></Col>
            <Col span={6}><Card className="shadow-sm"><Statistic title="Admin Commission" value={28500} prefix="$" styles={{ content: { color: '#10b981' } }} /></Card></Col>
        </Row>
        <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
            <Table 
                dataSource={[
                    { id: 'DR-1023', name: 'John M', email: 'john.m@gmail.com', trips: 120, earnings: 900, commission: 180, net: 720 },
                    { id: 'DR-1024', name: 'Sarah C', email: 's.chipo@facebook.com', trips: 95, earnings: 750, commission: 150, net: 600 },
                ]}
                columns={[
                    { 
                      title: 'Driver', 
                      key: 'name',
                      width: 220,
                      render: (_, record) => (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <Text strong>{record.name}</Text>
                          <Text type="secondary" style={{ fontSize: 11 }}>{record.email}</Text>
                        </div>
                      )
                    },
                    { title: 'Trips', dataIndex: 'trips', key: 'trips', width: 100 },
                    { title: 'Gross Earnings', dataIndex: 'earnings', key: 'earnings', width: 140, render: (v) => `$${v}` },
                    { title: 'Commission', dataIndex: 'commission', key: 'commission', width: 140, render: (v) => `$${v}` },
                    { title: 'Net Payout', dataIndex: 'net', key: 'net', width: 140, render: (v) => <Text strong style={{ color: '#10b981' }}>${v}</Text> },
                    { title: 'Status', key: 'status', width: 120, render: () => <Tag color="processing">Processing</Tag> },
                    { title: 'Actions', key: 'actions', width: 120, fixed: 'right', render: () => <Button size="small">Settlement</Button> }
                ]}
                scroll={{ x: 1000 }}
            />
        </Card>
    </div>
  );

  const TripsTab = () => (
    <div style={{ marginTop: 20 }}>
      <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
        <Table 
          dataSource={[
            { id: 'T-9821', rider: 'Alice W.', pickup: 'Avondale', dropoff: 'Harare CBD', fare: 12.50, status: 'Completed', date: 'Today, 10:30 AM' },
            { id: 'T-9822', rider: 'Bob M.', pickup: 'Borrowdale', dropoff: 'Airport', fare: 25.00, status: 'Cancelled', date: 'Today, 09:15 AM' },
            { id: 'T-9823', rider: 'Cassie L.', pickup: 'Mt Pleasant', dropoff: 'Sam Levy', fare: 8.20, status: 'Disputed', date: 'Yesterday' },
          ]}
          columns={[
            { title: 'Trip ID', dataIndex: 'id', key: 'id', width: 100, render: (t) => <Text strong>{t}</Text> },
            { title: 'Rider', dataIndex: 'rider', key: 'rider', width: 140 },
            { title: 'Route', key: 'route', width: 220, render: (_, r) => <Space size={0} orientation="vertical"><Text style={{ fontSize: 12 }}>{r.pickup}</Text><SwapOutlined style={{ fontSize: 10, alignSelf: 'center' }} /><Text style={{ fontSize: 12 }}>{r.dropoff}</Text></Space> },
            { title: 'Fare', dataIndex: 'fare', key: 'fare', width: 100, render: (v) => `$${v.toFixed(2)}` },
            { 
              title: 'Status', 
              dataIndex: 'status', 
              key: 'status',
              width: 120,
              render: (s) => (
                <Tag color={s === 'Completed' ? 'success' : s === 'Cancelled' ? 'default' : 'error'}>
                  {s}
                </Tag>
              )
            },
            { title: 'Date', dataIndex: 'date', key: 'date', width: 160 },
            { title: 'Actions', key: 'actions', width: 100, fixed: 'right', render: () => <Button size="small">Details</Button> }
          ]}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );

  const RatingsTab = () => (
    <div style={{ marginTop: 20 }}>
      <Row gutter={24}>
        <Col span={8}>
          <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16, textAlign: 'center' }}>
            <Statistic title="Average Rating" value={4.8} prefix={<StarOutlined style={{ color: '#fadb14' }} />} precision={1} />
            <Divider style={{ margin: '16px 0' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ width: 30 }}>5 <StarOutlined style={{ fontSize: 10 }} /></Text>
                <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 4, margin: '0 8px', overflow: 'hidden' }}>
                  <div style={{ width: '80%', height: '100%', background: '#10b981' }} />
                </div>
                <Text type="secondary">210</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ width: 30 }}>4 <StarOutlined style={{ fontSize: 10 }} /></Text>
                <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 4, margin: '0 8px', overflow: 'hidden' }}>
                  <div style={{ width: '15%', height: '100%', background: '#3b82f6' }} />
                </div>
                <Text type="secondary">60</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ width: 30 }}>3 <StarOutlined style={{ fontSize: 10 }} /></Text>
                <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 4, margin: '0 8px', overflow: 'hidden' }}>
                  <div style={{ width: '3%', height: '100%', background: '#faad14' }} />
                </div>
                <Text type="secondary">20</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ width: 30 }}>2 <StarOutlined style={{ fontSize: 10 }} /></Text>
                <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 4, margin: '0 8px', overflow: 'hidden' }}>
                  <div style={{ width: '1%', height: '100%', background: '#ff4d4f' }} />
                </div>
                <Text type="secondary">5</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Text style={{ width: 30 }}>1 <StarOutlined style={{ fontSize: 10 }} /></Text>
                <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 4, margin: '0 8px', overflow: 'hidden' }}>
                  <div style={{ width: '1%', height: '100%', background: '#ff4d4f' }} />
                </div>
                <Text type="secondary">5</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={16}>
          <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
            <Title level={5}>Recent Feedback</Title>
            <List 
              dataSource={[
                { user: 'Alice W.', rating: 5, comment: 'Very professional driver, clean car.', date: '2 hours ago' },
                { user: 'Bob M.', rating: 4, comment: 'Slightly late but great service.', date: '5 hours ago' },
                { user: 'Cassie L.', rating: 1, comment: 'Driver was rude and took a long route.', date: '1 day ago' },
              ]}
              renderItem={item => (
                <List.Item style={{ padding: '16px 0' }}>
                  <List.Item.Meta 
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={<Space><Text strong>{item.user}</Text><Rate disabled defaultValue={item.rating} style={{ fontSize: 10 }} /></Space>}
                    description={<div><Text style={{ display: 'block', marginBottom: 4 }}>{item.comment}</Text><Text type="secondary" style={{ fontSize: 11 }}>{item.date}</Text></div>}
                  />
                  <Button size="small">Reply</Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  const IncidentsTab = () => (
    <div style={{ marginTop: 20 }}>
      <Card 
        variant="borderless" 
        className="shadow-sm" 
        style={{ borderRadius: 16 }}
        title={<Space><WarningOutlined style={{ color: '#ef4444' }} /> Critical Safety Incidents</Space>}
        extra={<Button type="primary" danger icon={<PlusOutlined />} onClick={() => setIsIncidentModalOpen(true)}>Report Incident</Button>}
      >
        <Table 
          dataSource={[
            { id: 'INC-101', driver: 'John M.', type: 'Accident', severity: 'High', status: 'Under Investigation', date: '14 Mar' },
            { id: 'INC-102', driver: 'Sarah C.', type: 'Fraud Alert', severity: 'Critical', status: 'Pending', date: '14 Mar' },
            { id: 'INC-103', driver: 'Mike N.', type: 'Late Arrival', severity: 'Low', status: 'Resolved', date: '13 Mar' },
          ]}
          columns={[
            { title: 'Incident ID', dataIndex: 'id', key: 'id', width: 120 },
            { title: 'Driver', dataIndex: 'driver', key: 'driver', width: 150 },
            { title: 'Type', dataIndex: 'type', key: 'type', width: 120 },
            { 
              title: 'Severity', 
              dataIndex: 'severity', 
              key: 'severity',
              width: 120,
              render: (s) => <Tag color={s === 'Critical' ? 'red' : s === 'High' ? 'orange' : 'blue'}>{s}</Tag>
            },
            { title: 'Status', dataIndex: 'status', key: 'status', width: 160 },
            { title: 'Date', dataIndex: 'date', key: 'date', width: 100 },
            {
              title: 'Actions',
              key: 'actions',
              width: 180,
              fixed: 'right',
              render: () => (
                <Space>
                  <Button size="small">Investigate</Button>
                  <Button size="small" type="primary" danger>Suspend</Button>
                </Space>
              )
            }
          ]}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );

  const SuspensionTab = () => (
    <div style={{ marginTop: 20 }}>
      <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
        <Table 
          dataSource={[
            { driver: 'Mike Nzungu', reason: 'High Cancellation Rate', start: '12 Mar', end: '19 Mar', status: 'Active' },
            { driver: 'Pardon T.', reason: 'Safety Violation', start: '10 Mar', end: 'Indefinite', status: 'Permanent' },
          ]}
          columns={[
            { title: 'Driver', dataIndex: 'driver', key: 'driver', width: 150 },
            { title: 'Reason', dataIndex: 'reason', key: 'reason', width: 220 },
            { title: 'Start Date', dataIndex: 'start', key: 'start', width: 120 },
            { title: 'End Date', dataIndex: 'end', key: 'end', width: 120 },
            { 
              title: 'Status', 
              dataIndex: 'status', 
              key: 'status',
              width: 120,
              render: (s) => <Tag color={s === 'Active' ? 'warning' : 'error'}>{s}</Tag>
            },
            {
              title: 'Actions',
              key: 'actions',
              width: 220,
              fixed: 'right',
              render: () => (
                <Space>
                  <Button size="small" style={{ color: '#10b981' }}>Lift Suspension</Button>
                  <Button size="small" icon={<HistoryOutlined />}>History</Button>
                </Space>
              )
            }
          ]}
          scroll={{ x: 1000 }}
        />
        <Button danger block style={{ marginTop: 16, height: 45 }} icon={<StopOutlined />}>Schedule New Suspension</Button>
      </Card>
    </div>
  );

  const ActivityLogTab = () => (
    <div style={{ marginTop: 20 }}>
      <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Input placeholder="Search logs..." prefix={<SearchOutlined />} style={{ width: 250 }} />
            <Select defaultValue="all" style={{ width: 160 }}>
              <Select.Option value="all">All Activities</Select.Option>
              <Select.Option value="wallet">Wallet Adjustments</Select.Option>
              <Select.Option value="status">Status Changes</Select.Option>
              <Select.Option value="onboarding">Onboarding</Select.Option>
            </Select>
          </Space>
          <Button icon={<HistoryOutlined />}>Export Audit Log</Button>
        </div>
        <Table 
          dataSource={[
            { id: 1, admin: 'Operations Manager', target: 'John Makoni', action: 'Wallet Credit', detail: 'Credited $50.00 (Promotion)', date: 'Today, 09:24 AM' },
            { id: 2, admin: 'System Bot', target: 'Sarah Chipo', action: 'Automatic Freeze', detail: 'Suspicious login detected', date: 'Today, 04:12 AM' },
            { id: 3, admin: 'Admin User', target: 'Mike Nzungu', action: 'Manual Freeze', detail: 'Disciplinary action: Safety violation', date: 'Yesterday, 03:45 PM' },
            { id: 4, admin: 'Operations Manager', target: 'Elena Rivera', action: 'Approval', detail: 'Approved vehicle onboarding', date: '12 Mar 2024' },
          ]}
          columns={[
            { title: 'Date & Time', dataIndex: 'date', key: 'date', width: 180 },
            { title: 'Administrator', dataIndex: 'admin', key: 'admin', width: 180, render: (a) => <Space><Avatar size="small" icon={<UserOutlined />} />{a}</Space> },
            { title: 'Target Driver', dataIndex: 'target', key: 'target', width: 180, render: (t) => <Text strong>{t}</Text> },
            { 
              title: 'Action', 
              dataIndex: 'action', 
              key: 'action',
              width: 150,
              render: (a) => <Tag color={a.includes('Freeze') ? 'error' : a.includes('Wallet') ? 'success' : 'blue'}>{a}</Tag>
            },
            { title: 'Details', dataIndex: 'detail', key: 'detail' },
          ]}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );

  const PerformanceTab = () => {
    const weeklyData = [
      { name: 'Mon', trips: 120, earnings: 450, cancellations: 2 },
      { name: 'Tue', trips: 150, earnings: 520, cancellations: 5 },
      { name: 'Wed', trips: 180, earnings: 680, cancellations: 3 },
      { name: 'Thu', trips: 140, earnings: 490, cancellations: 8 },
      { name: 'Fri', trips: 220, earnings: 850, cancellations: 4 },
      { name: 'Sat', trips: 280, earnings: 1100, cancellations: 10 },
      { name: 'Sun', trips: 210, earnings: 780, cancellations: 6 },
    ];

    const ratingData = [
      { name: '5 Stars', value: 85, fill: '#10b981' },
      { name: '4 Stars', value: 10, fill: '#3b82f6' },
      { name: '3 Stars', value: 3, fill: '#faad14' },
      { name: '2 Stars', value: 1, fill: '#f59e0b' },
      { name: '1 Star', value: 1, fill: '#ff4d4f' },
    ];

    return (
      <div style={{ marginTop: 20 }}>
        <Row gutter={[24, 24]}>
          <Col span={6}><Card className="shadow-sm"><Statistic title="Driver Utilization" value={78} suffix="%" styles={{ content: { color: '#3b82f6' } }} /></Card></Col>
          <Col span={6}><Card className="shadow-sm"><Statistic title="Avg Trips/Day" value={14.5} /></Card></Col>
          <Col span={6}><Card className="shadow-sm"><Statistic title="Cancellation Rate" value={3.2} suffix="%" styles={{ content: { color: '#ff4d4f' } }} /></Card></Col>
          <Col span={6}><Card className="shadow-sm"><Statistic title="Acceptance Rate" value={98} suffix="%" styles={{ content: { color: '#10b981' } }} /></Card></Col>
        </Row>
        
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col span={16}>
            <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16, height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <Title level={5}><BarChartOutlined /> Weekly Volume & Earnings</Title>
                <Segmented options={['Trips', 'Earnings']} />
              </div>
              <div style={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="trips" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTrips)" />
                    <Area type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={3} fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16, height: '100%' }}>
              <Title level={5}>Rating Mix</Title>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ratingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {ratingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ marginTop: 20 }}>
                {ratingData.map(item => (
                  <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Space><div style={{ width: 10, height: 10, borderRadius: 2, background: item.fill }} /> <Text style={{ fontSize: 12 }}>{item.name}</Text></Space>
                    <Text strong>{item.value}%</Text>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const items = [
    { key: '1', label: <Space><UserOutlined /> Driver List</Space>, children: <ListTab /> },
    { key: '2', label: <Space><PlusOutlined /> Driver Requests</Space>, children: <RequestsTab /> },
    { key: '3', label: <Space><FileTextOutlined /> Documents</Space>, children: <DocumentsTab /> },
    { key: '4', label: <Space><WalletOutlined /> Earnings</Space>, children: <FinancialTab /> },
    { key: '5', label: <Space><HistoryOutlined /> Trips</Space>, children: <TripsTab /> },
    { key: '6', label: <Space><StarOutlined /> Ratings</Space>, children: <RatingsTab /> },
    { key: '7', label: <Space><WarningOutlined /> Incidents</Space>, children: <IncidentsTab /> },
    { key: '8', label: <Space><StopOutlined /> Suspension</Space>, children: <SuspensionTab /> },
    { key: '9', label: <Space><BarChartOutlined /> Activity Log</Space>, children: <ActivityLogTab /> },
    { key: '10', label: <Space><BarChartOutlined /> Performance</Space>, children: <PerformanceTab /> },
  ];

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>Driver Management Hub</Title>
            <Text type="secondary">Central command for fleet onboarding, compliance and oversight.</Text>
          </Col>
          <Col>
            <Space>
               <Button icon={<HistoryOutlined />}>Activity Logs</Button>
               <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsDrawerOpen(true)}>Manual Onboard</Button>
            </Space>
          </Col>
        </Row>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        items={items}
        style={{ background: 'transparent' }}
      />

      <Drawer
        title={<Space><RocketOutlined style={{ color: '#10b981' }} /> Driver Management Profile</Space>}
        open={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        size="large"
        styles={{ body: { padding: 0, background: '#f8fafc' } }}
      >
        {selectedDriver && (
          <div style={{ padding: '24px' }}>
            {/* Header Section */}
            <Card variant="borderless" style={{ borderRadius: 16, marginBottom: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Row gutter={24} align="top">
                <Col>
                  <Avatar size={100} icon={<UserOutlined />} style={{ background: '#1e293b' }} />
                </Col>
                <Col flex="auto">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Title level={3} style={{ margin: 0 }}>{selectedDriver.name}</Title>
                      <Space size={12} style={{ marginTop: 4 }}>
                        {(() => {
                          const colors: any = { Platinum: 'purple', Gold: 'gold', Silver: 'cyan', Bronze: 'orange' };
                          const icons: any = { Platinum: <CrownOutlined />, Gold: <TrophyOutlined />, Silver: <StarOutlined />, Bronze: <RiseOutlined /> };
                          return <Tag color={colors[selectedDriver.tier]} icon={icons[selectedDriver.tier]} style={{ fontWeight: 600 }}>{selectedDriver.tier} Tier</Tag>;
                        })()}
                        <Space size={4}>
                          <Rate disabled defaultValue={selectedDriver.rating} style={{ fontSize: 14 }} />
                          <Text strong>({selectedDriver.rating.toFixed(1)})</Text>
                        </Space>
                      </Space>
                    </div>
                    <Tag color={selectedDriver.isFrozen ? 'volcano' : 'success'}>
                      {selectedDriver.isFrozen ? 'Account Frozen' : 'Active'}
                    </Tag>
                  </div>
                  
                  <Row gutter={[16, 8]} style={{ marginTop: 16 }}>
                    <Col span={12}><Text type="secondary"><PhoneOutlined /> {selectedDriver.phone}</Text></Col>
                    <Col span={12}><Text type="secondary"><MailOutlined /> {selectedDriver.email}</Text></Col>
                    <Col span={24}>
                      <Text strong style={{ fontSize: 13 }}><SafetyOutlined /> Services: </Text>
                      <Text type="secondary">{selectedDriver.services?.join(', ') || 'Ride Hailing'}</Text>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>

            {/* Driver Rate Info Section */}
            <Title level={5} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChartOutlined style={{ color: '#3b82f6' }} /> Driver rate info
            </Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card size="small" style={{ borderRadius: 12 }}>
                  <Statistic title="Avg active rate/day" value={selectedDriver.avgActiveRate || '0%'} styles={{ content: { color: '#64748b' } }} />
                  <div style={{ height: 4, background: '#f1f5f9', borderRadius: 2, marginTop: 8 }}>
                    <div style={{ width: selectedDriver.avgActiveRate || '0%', height: '100%', background: '#3b82f6', borderRadius: 2 }} />
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ borderRadius: 12 }}>
                  <Statistic title="Avg. earning value" value={selectedDriver.avgEarningValue || 0} prefix="$" precision={2} styles={{ content: { color: '#3b82f6' } }} />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ borderRadius: 12 }}>
                  <Statistic title="Positive review rate" value={selectedDriver.positiveReviewRate || '0%'} styles={{ content: { color: '#10b981' } }} />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ borderRadius: 12 }}>
                  <Statistic title="Success rate" value={selectedDriver.successRate || '0%'} styles={{ content: { color: '#10b981' } }} />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ borderRadius: 12 }}>
                  <Statistic title="Cancelation rate" value={selectedDriver.cancellationRate || '0%'} styles={{ content: { color: '#ef4444' } }} />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ borderRadius: 12 }}>
                  <Statistic title="Today Idle Hour Rate" value={selectedDriver.todayIdleHourRate || '0%'} styles={{ content: { color: '#f59e0b' } }} />
                </Card>
              </Col>
            </Row>

            {/* Wallet Info Section */}
            <Title level={5} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <WalletOutlined style={{ color: '#10b981' }} /> Wallet info
            </Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={4.8} style={{ width: '20%' }}>
                <Card size="small" style={{ borderRadius: 12, textAlign: 'center', background: '#f8fafc' }}>
                  <Statistic title="Collectable cash" value={selectedDriver.collectableCash || 0} prefix="$" precision={2} styles={{ content: { color: '#64748b', fontSize: 16 } }} />
                </Card>
              </Col>
              <Col span={4.8} style={{ width: '20%' }}>
                <Card size="small" style={{ borderRadius: 12, textAlign: 'center', background: '#fff7ed' }}>
                  <Statistic title="Pending withdraw" value={selectedDriver.pendingWithdraw || 0} prefix="$" precision={2} styles={{ content: { color: '#ea580c', fontSize: 16 } }} />
                </Card>
              </Col>
              <Col span={4.8} style={{ width: '20%' }}>
                <Card size="small" style={{ borderRadius: 12, textAlign: 'center', background: '#f0f9ff' }}>
                  <Statistic title="Already withdrawn" value={selectedDriver.alreadyWithdrawn || 0} prefix="$" precision={2} styles={{ content: { color: '#0284c7', fontSize: 16 } }} />
                </Card>
              </Col>
              <Col span={4.8} style={{ width: '20%' }}>
                <Card size="small" style={{ borderRadius: 12, textAlign: 'center', background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                  <Statistic title="Withdrawable" value={selectedDriver.withdrawableAmount || 0} prefix="$" precision={2} styles={{ content: { color: '#16a34a', fontSize: 18, fontWeight: 700 } }} />
                </Card>
              </Col>
              <Col span={4.8} style={{ width: '20%' }}>
                <Card size="small" style={{ borderRadius: 12, textAlign: 'center', background: '#ecfdf5', borderColor: '#6ee7b7' }}>
                  <Statistic title="Total earning" value={selectedDriver.totalEarning || 0} prefix="$" precision={2} styles={{ content: { color: '#059669', fontSize: 18, fontWeight: 700 } }} />
                </Card>
              </Col>
            </Row>

            {/* Bottom Tabbed Navigation */}
            <Tabs 
              defaultActiveKey="overview"
              items={[
                { 
                  key: 'overview', 
                  label: 'Overview', 
                  children: (
                    <div style={{ marginTop: 16 }}>
                      <Row gutter={24}>
                        <Col span={12}>
                          <Card title="Trip Overview" size="small" variant="borderless" className="shadow-sm">
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Total completed trip">{selectedDriver.completedTrips || 0}</Descriptions.Item>
                              <Descriptions.Item label="Total cancel trip">{selectedDriver.cancelledTrips || 0}</Descriptions.Item>
                              <Descriptions.Item label="Lowest price trip">${(selectedDriver.lowestPriceTrip || 0).toFixed(2)}</Descriptions.Item>
                              <Descriptions.Item label="Highest price trip">${(selectedDriver.highestPriceTrip || 0).toFixed(2)}</Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card title="Documents & Identity" size="small" variant="borderless" className="shadow-sm">
                            <Text strong style={{ fontSize: 12 }}>Identity documents</Text>
                            <div style={{ marginTop: 8, padding: 12, border: '1px solid #f1f5f9', borderRadius: 8, background: '#fff' }}>
                              <Space size={12}>
                                {selectedDriver.idDocuments?.map((doc: string, idx: number) => (
                                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <FileTextOutlined style={{ fontSize: 24, color: '#3b82f6' }} />
                                    <Text type="secondary" style={{ fontSize: 10 }}>{doc}</Text>
                                  </div>
                                ))}
                              </Space>
                            </div>
                            <Text strong style={{ fontSize: 12, display: 'block', marginTop: 16 }}>Other documents</Text>
                            <div style={{ marginTop: 8, padding: 12, border: '1px solid #f1f5f9', borderRadius: 8, background: '#fff' }}>
                              <Space size={12}>
                                {selectedDriver.otherDocuments?.map((doc: string, idx: number) => (
                                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <CloudUploadOutlined style={{ fontSize: 24, color: '#94a3b8' }} />
                                    <Text type="secondary" style={{ fontSize: 10 }}>{doc}</Text>
                                  </div>
                                ))}
                              </Space>
                            </div>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  )
                },
                { key: 'vehicle', label: 'Vehicle', children: <div style={{ padding: 20 }}><Empty description="Vehicle Details Loading..." /></div> },
                { 
                  key: 'trips', 
                  label: 'Trips', 
                  children: (
                    <div style={{ marginTop: 16 }}>
                      <Table 
                        dataSource={tripsHistory.filter(t => t.driverId === selectedDriver.id)}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                        columns={[
                          { title: 'Trip ID', dataIndex: 'id', key: 'id', render: (id) => <Text strong>{id}</Text> },
                          { title: 'Pickup - Dropoff', key: 'route', render: (_, r) => (
                            <div style={{ maxWidth: 250 }}>
                              <Text style={{ fontSize: 13 }}>{r.pickup}</Text><br/>
                              <Text type="secondary" style={{ fontSize: 11 }}>â†’ {r.dropoff}</Text>
                            </div>
                          )},
                          { title: 'Details', key: 'details', render: (_, r) => (
                            <Text type="secondary" style={{ fontSize: 12 }}>{r.distance} | {r.duration}</Text>
                          )},
                          { title: 'Fare', dataIndex: 'fare', key: 'fare', render: (f) => <Text strong>${f.toFixed(2)}</Text> },
                          { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color="success">{s}</Tag> },
                        ]}
                      />
                    </div>
                  )
                },
                { 
                  key: 'transaction', 
                  label: 'Transaction', 
                  children: (
                    <div style={{ marginTop: 16 }}>
                      <Table 
                        dataSource={walletHistory.filter(t => t.driverId === selectedDriver.id)}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                        columns={[
                          { title: 'Txn ID', dataIndex: 'id', key: 'id' },
                          { title: 'Type', dataIndex: 'type', key: 'type', render: (t) => (
                            <Tag icon={t === 'Earning' ? <ArrowUpOutlined /> : t === 'Withdrawal' ? <ArrowDownOutlined /> : <SwapOutlined />} color={t === 'Earning' ? 'success' : t === 'Withdrawal' ? 'warning' : 'blue'}>
                              {t}
                            </Tag>
                          )},
                          { title: 'Description', dataIndex: 'description', key: 'description' },
                          { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (a) => (
                            <Text strong style={{ color: a > 0 ? '#10b981' : '#f59e0b' }}>
                              {a > 0 ? '+' : ''}${Math.abs(a).toFixed(2)}
                            </Text>
                          )},
                          { title: 'Current Balance', dataIndex: 'balance', key: 'balance', render: (v) => <Text type="secondary">${v.toFixed(2)}</Text> },
                        ]}
                      />
                    </div>
                  )
                },
                { 
                  key: 'review', 
                  label: 'Review', 
                  children: (
                    <div style={{ marginTop: 16 }}>
                      <List
                        dataSource={driverReviews.filter(r => r.driverId === selectedDriver.id)}
                        renderItem={(item) => (
                          <List.Item>
                            <Card variant="borderless" style={{ background: '#fff', width: '100%', borderRadius: 12 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Space>
                                  <Avatar size="small">{item.reviewer.charAt(0)}</Avatar>
                                  <Text strong>{item.reviewer}</Text>
                                </Space>
                                <Text type="secondary" style={{ fontSize: 12 }}>{item.date}</Text>
                              </div>
                              <div style={{ marginTop: 8 }}>
                                <Rate disabled defaultValue={item.rating} style={{ fontSize: 12 }} />
                              </div>
                              <Paragraph style={{ marginTop: 8, marginBottom: 0, fontSize: 13 }}>
                                "{item.comment}"
                              </Paragraph>
                            </Card>
                          </List.Item>
                        )}
                      />
                    </div>
                  )
                },
              ]}
            />

            <div style={{ marginTop: 32, textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Copyright DashDrive Admin @ 2024</Text>
            </div>
          </div>
        )}
      </Drawer>      <Drawer
        title={editingDriver ? "Edit Driver" : "Add Driver"}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        width={680}
        extra={<Button type="primary" onClick={() => form.submit()}>Add Driver</Button>}
        styles={{ body: { paddingBottom: 80 } }}
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={(values) => {
            // Processing logic remains similar but with expanded fields
            const newDriver = {
              ...values,
              id: `DR-${Math.floor(Math.random() * 9000) + 1000}`,
              name: `${values.firstName} ${values.lastName}`,
              rating: 0,
              status: 'Active',
              walletBalance: 0,
              isFrozen: false,
              trips: 0,
              cancellationRate: '0%',
              acceptanceRate: '0%',
              joinDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              tier: 'Bronze'
            };
            setDrivers(prev => [...prev, newDriver]);
            message.success('New driver onboarded successfully');
            setIsDrawerOpen(false);
            form.resetFields();
          }}
        >
          <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12, marginBottom: 24 }}>
            <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <UserOutlined /> General info
            </Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="firstName" label="First name *" rules={[{ required: true }]}>
                  <Input placeholder="Ex: Maximilian" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="lastName" label="Last name *" rules={[{ required: true }]}>
                  <Input placeholder="Ex: SchwarzmÃ¼ller" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="email" label="Email *" rules={[{ required: true, type: 'email' }]}>
                  <Input placeholder="Ex: company@company.com" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="identityType" label="Identity type *" rules={[{ required: true }]}>
                  <Select placeholder="Select identity type">
                    <Select.Option value="Passport">Passport</Select.Option>
                    <Select.Option value="NID">National ID</Select.Option>
                    <Select.Option value="License">Driving License</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="identityNumber" label="Identity number *" rules={[{ required: true }]}>
                  <Input placeholder="Ex: 3032" />
                </Form.Item>
              </Col>
            </Row>

            <Divider dashed />
            <Row gutter={24}>
              <Col span={12}>
                <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>Driver image</Text>
                <div style={{ border: '2px dashed #cbd5e1', borderRadius: 8, padding: 20, textAlign: 'center', background: '#fff' }}>
                  <Avatar size={64} icon={<UserOutlined />} style={{ marginBottom: 12 }} />
                  <br />
                  <Button size="small" icon={<CloudUploadOutlined />}>Click to upload</Button>
                  <Text type="secondary" style={{ display: 'block', fontSize: 10, marginTop: 8 }}>
                    Format: .png, .jpg (Max 1MB)
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>Identity card image</Text>
                <div style={{ border: '2px dashed #cbd5e1', borderRadius: 8, padding: 20, textAlign: 'center', background: '#fff' }}>
                  <FileTextOutlined style={{ fontSize: 32, color: '#94a3b8', marginBottom: 12 }} />
                  <br />
                  <Button size="small" icon={<CloudUploadOutlined />}>Click to upload</Button>
                  <Text type="secondary" style={{ display: 'block', fontSize: 10, marginTop: 8 }}>
                    Format: .png, .jpg (Max 1MB)
                  </Text>
                </div>
              </Col>
            </Row>
          </div>

          <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12, marginBottom: 24 }}>
            <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <LockOutlined /> Account information
            </Title>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="phone" label="Phone *" rules={[{ required: true }]}>
                  <Input addonBefore="+1" placeholder="Ex: xxxxx xxxxxx" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                  <Input.Password placeholder="Ex: ********" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  name="confirmPassword" 
                  label="Confirm password" 
                  dependencies={['password']}
                  rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Ex: ********" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12 }}>
            <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <CloudUploadOutlined /> Upload Other Documents
            </Title>
            <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 16 }}>
              Format: .png, .jpg, .csv, .xlsx, .pdf, .zip (Max 1MB)
            </Text>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ flex: 1, border: '1px solid #d9d9d9', padding: '8px 12px', borderRadius: 6, background: '#fff' }}>
                <Text type="secondary">No file chosen</Text>
              </div>
              <Button type="primary">Upload</Button>
            </div>
            <div style={{ marginTop: 12, padding: 12, border: '1px solid #f1f5f9', borderRadius: 8, background: '#fff', textAlign: 'center' }}>
               <Text type="secondary">File or image</Text>
            </div>
          </div>
        </Form>
      </Drawer>

      <Modal
        title={<Space><DollarOutlined /> Wallet Adjustment: {selectedDriver?.name}</Space>}
        open={isWalletModalOpen}
        onCancel={() => { setIsWalletModalOpen(false); walletForm.resetFields(); }}
        onOk={() => walletForm.submit()}
        okText="Process Adjustment"
        centered
      >
        <div style={{ marginBottom: 20 }}>
          <Tag color="blue">Current Balance: ${selectedDriver?.walletBalance.toFixed(2)}</Tag>
        </div>
        <Form form={walletForm} layout="vertical" onFinish={(values) => {
          const amount = values.type === 'increase' ? values.amount : -values.amount;
          setDrivers(prev => prev.map(d => d.id === selectedDriver.id ? { ...d, walletBalance: d.walletBalance + amount } : d));
          message.success(`Wallet adjusted by ${values.type === 'increase' ? '+' : '-'}$${values.amount}`);
          setIsWalletModalOpen(false);
          walletForm.resetFields();
        }}>
          <Form.Item name="type" label="Adjustment Type" rules={[{ required: true }]} initialValue="increase">
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="increase" style={{ background: '#f0fdf4', color: '#166534' }}><ArrowUpOutlined /> Increase Balance</Radio.Button>
              <Radio.Button value="reduce" style={{ background: '#fef2f2', color: '#991b1b' }}><ArrowDownOutlined /> Reduce Balance</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="amount" label="Amount ($)" rules={[{ required: true, type: 'number', min: 0.01 }]}>
            <InputNumber prefix="$" style={{ width: '100%' }} precision={2} placeholder="0.00" />
          </Form.Item>
          <Form.Item name="reason" label="Reason for Adjustment" rules={[{ required: true }]}>
            <Input.TextArea placeholder="e.g. Weekly bonus, Fine for violation, etc." rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<Space><StopOutlined style={{ color: '#ff4d4f' }} /> Confirm Driver Deletion</Space>}
        open={isDeleteModalOpen}
        onCancel={() => { setIsDeleteModalOpen(false); deleteForm.resetFields(); }}
        onOk={() => deleteForm.submit()}
        okText="Confirm Deletion"
        okButtonProps={{ danger: true }}
        centered
      >
        <div style={{ marginBottom: 20 }}>
          <Text strong>Are you sure you want to delete {driverToDelete?.name}?</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 13 }}>This action will permanently remove the driver from the management hub.</Text>
        </div>
        <Form form={deleteForm} layout="vertical" onFinish={(values) => {
          setTrashedDrivers(prev => [...prev, { 
            ...driverToDelete, 
            deletedAt: new Date().toISOString(), 
            deleteReason: values.reason 
          }]);
          setDrivers(prev => prev.filter(d => d.id !== driverToDelete.id));
          message.success(`Driver ${driverToDelete.name} moved to trash`);
          setIsDeleteModalOpen(false);
          deleteForm.resetFields();
          setDriverToDelete(null);
        }}>
          <Form.Item 
            name="reason" 
            label="Reason for Deletion" 
            rules={[{ required: true, message: 'Please provide a reason for deletion' }]}
          >
            <Input.TextArea placeholder="Provide a reason for deleting this driver profile..." rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<Space><WarningOutlined style={{ color: '#ff4d4f' }} /> Report New Safety Incident</Space>}
        open={isIncidentModalOpen}
        onCancel={() => { setIsIncidentModalOpen(false); incidentForm.resetFields(); }}
        onOk={() => incidentForm.submit()}
        okText="Log Incident"
        okButtonProps={{ danger: true }}
        centered
        width={600}
      >
        <Form form={incidentForm} layout="vertical" onFinish={(values) => {
          message.success(`Incident ${values.type} reported for ${values.driverName}`);
          setIsIncidentModalOpen(false);
          incidentForm.resetFields();
        }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="driverName" label="Driver Name / ID" rules={[{ required: true }]}>
                <Input placeholder="Enter driver identification" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="Incident Type" rules={[{ required: true }]}>
                <Select placeholder="Select type">
                  <Select.Option value="Accident">Accident</Select.Option>
                  <Select.Option value="Verbal Abuse">Verbal Abuse</Select.Option>
                  <Select.Option value="Fraud">Fraud</Select.Option>
                  <Select.Option value="Reckless Driving">Reckless Driving</Select.Option>
                  <Select.Option value="Other">Other</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="severity" label="Severity" rules={[{ required: true }]} initialValue="Low">
                <Select>
                  <Select.Option value="Critical">Critical</Select.Option>
                  <Select.Option value="High">High</Select.Option>
                  <Select.Option value="Medium">Medium</Select.Option>
                  <Select.Option value="Low">Low</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="date" label="Incident Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Detailed Description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Describe exactly what happened..." />
          </Form.Item>
          <Form.Item label="Evidence / Photos">
            <div style={{ border: '1px dashed #d9d9d9', padding: '20px', textAlign: 'center', borderRadius: 8 }}>
              <CloudUploadOutlined style={{ fontSize: 24, color: '#94a3b8', marginBottom: 8 }} />
              <br />
              <Button size="small">Upload Files</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<Space><AuditOutlined /> Status Change Justification</Space>}
        open={isReasonModalOpen}
        onCancel={() => { setIsReasonModalOpen(false); reasonForm.resetFields(); }}
        onOk={() => reasonForm.submit()}
        okText="Confirm Change"
        centered
      >
        <div style={{ marginBottom: 16 }}>
          <Text>You are about to <strong>{reasonTarget?.isFrozen ? 'Activate' : 'Freeze'}</strong> the account for {reasonTarget?.name}.</Text>
        </div>
        <Form form={reasonForm} layout="vertical" onFinish={(values) => {
          const action = reasonTarget.isFrozen ? 'Activated' : 'Frozen';
          setDrivers(prev => prev.map(d => d.id === reasonTarget.id ? { ...d, isFrozen: !d.isFrozen } : d));
          message.success(`Driver ${action} successfully`);
          // Here we would typically log values.reason to the audit log
          setIsReasonModalOpen(false);
          reasonForm.resetFields();
          setReasonTarget(null);
        }}>
          <Form.Item 
            name="reason" 
            label="Reason for Status Change" 
            rules={[{ required: true, message: 'Please provide a reason' }]}
          >
            <Input.TextArea placeholder="Describe why this account status is being changed..." rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={<Space><HistoryOutlined /> Manage Trashed Drivers</Space>}
        open={isTrashDrawerOpen}
        onClose={() => setIsTrashDrawerOpen(false)}
        width={720}
      >
        <Table 
          dataSource={trashedDrivers}
          rowKey="id"
          columns={[
            { title: 'Driver ID', dataIndex: 'id', key: 'id', width: 100 },
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Deletion Reason', dataIndex: 'deleteReason', key: 'reason' },
            { title: 'Deleted At', dataIndex: 'deletedAt', key: 'date', render: (d) => new Date(d).toLocaleString() },
            { 
              title: 'Actions', 
              key: 'actions', 
              align: 'right',
              render: (_, record) => (
                <Space>
                  <Button 
                    size="small" 
                    icon={<SyncOutlined />} 
                    onClick={() => {
                      setDrivers(prev => [...prev, record]);
                      setTrashedDrivers(prev => prev.filter(d => d.id !== record.id));
                      message.success('Driver restored successfully');
                    }}
                  >
                    Restore
                  </Button>
                  <Button 
                    size="small" 
                    danger 
                    icon={<CloseCircleOutlined />}
                    onClick={() => {
                      setTrashedDrivers(prev => prev.filter(d => d.id !== record.id));
                      message.warning('Driver permanently deleted');
                    }}
                  >
                    Purge
                  </Button>
                </Space>
              )
            }
          ]}
          locale={{ emptyText: <Empty description="Trash is empty" /> }}
        />
      </Drawer>
    </div>
  );
};

