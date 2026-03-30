import React, { useState } from 'react';
import { 
  Typography, Row, Col, Card, Table, Tag, 
  Button, Space, Statistic, Tabs, Badge, Avatar,
  Tooltip, Modal, Descriptions, Empty, message, Input,
  Drawer, Popconfirm, Form, Alert
} from 'antd';
import { 
  ShopOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  EyeOutlined,
  UserOutlined,
  StarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  MessageOutlined,
  FileTextOutlined,
  SearchOutlined,
  WarningOutlined,
  HomeOutlined,
  CreditCardOutlined,
  ReloadOutlined,
  RestOutlined,
  UndoOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface Listing {
  id: string;
  host: string;
  title: string;
  type: string;
  price: number;
  status: 'pending' | 'active' | 'rejected';
  location: string;
  createdAt: string;
  // Property verification
  verification: {
    photoAiCheck: 'passed' | 'review' | 'failed';
    addressValid: boolean;
    safetyFeaturesCovered: boolean;
  };
}

interface Host {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'pending' | 'verified' | 'rejected';
  documentUrl: string;
  rating: number;
  totalListings: number;
  // Airbnb-standard verification fields
  identity: {
    idVerified: boolean;
    idType: 'Passport' | 'Driver License' | 'National ID';
    selfieMatched: boolean;
    phoneVerified: boolean;
    emailVerified: boolean;
    backgroundCheck?: 'clear' | 'pending' | 'flagged';
  };
  property: {
    addressVerified: boolean;
    ownershipProof: 'Title Deed' | 'Lease Agreement' | 'Management Contract';
    taxRegistered: boolean;
  };
  payment: {
    methodSet: boolean;
    taxIdStatus: 'verified' | 'pending' | 'none';
    payoutEnabled: boolean;
  };
}

interface Booking {
  id: string;
  listingTitle: string;
  customerName: string;
  hostName: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

interface UserReview {
  id: string;
  listingTitle: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  hasDispute: boolean;
  disputeStatus?: 'open' | 'resolved' | 'escalated';
}

export const MarketplaceManagementPage: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('1');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedReview, setSelectedReview] = useState<UserReview | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerType, setDrawerType] = useState<'listing' | 'host' | 'booking' | 'review' | 'none'>('none');
  const [searchText, setSearchText] = useState('');

  // Rejection/Delete with Reason state
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [pendingAction, setPendingAction] = useState<{ id: string, type: 'listing' | 'host' | 'dispute' | 'booking' | 'review' } | null>(null);

  // Data Management state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trashVisible, setTrashVisible] = useState(false);

  const [listings, setListings] = useState<Listing[]>([
    { 
      id: 'L-001', host: 'Sarah Jenkins', title: 'Luxury Penthouse', type: 'Apartment', price: 250, status: 'pending', location: 'Harare, Central', createdAt: '2024-03-15',
      verification: { photoAiCheck: 'passed', addressValid: true, safetyFeaturesCovered: true }
    },
    { 
      id: 'L-002', host: 'Michael Chen', title: 'Cozy Studio', type: 'Studio', price: 85, status: 'active', location: 'Bulawayo, Suburbs', createdAt: '2024-03-14',
      verification: { photoAiCheck: 'passed', addressValid: true, safetyFeaturesCovered: true }
    },
    { 
      id: 'L-003', host: 'Elena Rodriguez', title: 'Safari Lodge', type: 'Lodge', price: 450, status: 'active', location: 'Victoria Falls', createdAt: '2024-03-10',
      verification: { photoAiCheck: 'passed', addressValid: true, safetyFeaturesCovered: true }
    },
    { 
      id: 'L-004', host: 'David Ndlovu', title: 'Modern Villa', type: 'House', price: 180, status: 'pending', location: 'Kariba, Heights', createdAt: '2024-03-16',
      verification: { photoAiCheck: 'review', addressValid: false, safetyFeaturesCovered: false }
    },
  ]);

  const [hosts, setHosts] = useState<Host[]>([
    { 
      id: 'H-001', name: 'John Doe', email: 'john@example.com', phone: '+263 77 123 4567', joinDate: '2024-01-20', status: 'pending', documentUrl: 'identity_v1.pdf', rating: 0, totalListings: 1,
      identity: { idVerified: true, idType: 'Passport', selfieMatched: true, phoneVerified: true, emailVerified: true, backgroundCheck: 'clear' },
      property: { addressVerified: true, ownershipProof: 'Title Deed', taxRegistered: true },
      payment: { methodSet: true, taxIdStatus: 'verified', payoutEnabled: true }
    },
    { 
      id: 'H-002', name: 'Alice Smith', email: 'alice@host.com', phone: '+263 71 987 6543', joinDate: '2023-11-15', status: 'verified', documentUrl: 'passport_scan.jpg', rating: 4.8, totalListings: 12,
      identity: { idVerified: true, idType: 'Driver License', selfieMatched: true, phoneVerified: true, emailVerified: true, backgroundCheck: 'clear' },
      property: { addressVerified: true, ownershipProof: 'Lease Agreement', taxRegistered: true },
      payment: { methodSet: true, taxIdStatus: 'verified', payoutEnabled: true }
    },
    { 
      id: 'H-003', name: 'Robert Mugabe Jr', email: 'rob@prestige.zw', phone: '+263 78 555 0199', joinDate: '2024-02-01', status: 'pending', documentUrl: 'national_id_front.png', rating: 0, totalListings: 3,
      identity: { idVerified: false, idType: 'National ID', selfieMatched: false, phoneVerified: true, emailVerified: false },
      property: { addressVerified: false, ownershipProof: 'Management Contract', taxRegistered: false },
      payment: { methodSet: false, taxIdStatus: 'none', payoutEnabled: false }
    },
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    { id: 'B-1001', listingTitle: 'Luxury Penthouse', customerName: 'James Bond', hostName: 'Sarah Jenkins', checkIn: '2024-04-01', checkOut: '2024-04-05', totalPrice: 1000, status: 'upcoming' },
    { id: 'B-1002', listingTitle: 'Cozy Studio', customerName: 'Elena Gilbert', hostName: 'Michael Chen', checkIn: '2024-03-15', checkOut: '2024-03-18', totalPrice: 255, status: 'active' },
    { id: 'B-1003', listingTitle: 'Lakeside Villa', customerName: 'Damon Salvatore', hostName: 'Anna Müller', checkIn: '2024-03-01', checkOut: '2024-03-05', totalPrice: 1800, status: 'completed' },
  ]);

  const [reviews, setReviews] = useState<UserReview[]>([
    { id: 'R-001', listingTitle: 'Lakeside Villa', customerName: 'Damon Salvatore', rating: 5, comment: 'Incredible stay, highly recommend!', date: '2024-03-06', hasDispute: false },
    { id: 'R-002', listingTitle: 'Cozy Studio', customerName: 'Stefan Salvatore', rating: 2, comment: 'The place was dirty when I arrived.', date: '2024-03-10', hasDispute: true, disputeStatus: 'open' },
    { id: 'R-003', listingTitle: 'Mountain Cabin', customerName: 'Bonnie Bennett', rating: 4, comment: 'Great location but very cold.', date: '2024-03-12', hasDispute: false },
  ]);

  const handleApprove = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'active' } : l));
    setDrawerVisible(false);
    message.success('Listing approved successfully');
  };

  const initiateRejection = (id: string, type: 'listing' | 'host' | 'dispute' | 'booking' | 'review') => {
    setPendingAction({ id, type });
    setRejectionReason('');
    setRejectionModalVisible(true);
  };

  const handleConfirmRejection = () => {
    if (!rejectionReason.trim()) {
      message.warning('Please provide a reason for rejection');
      return;
    }

    if (pendingAction?.type === 'listing') {
      setListings(prev => prev.map(l => l.id === pendingAction.id ? { ...l, status: 'rejected' } : l));
      message.error(`Listing rejected. Reason: ${rejectionReason}`);
    } else if (pendingAction?.type === 'host') {
      setHosts(prev => prev.map(h => h.id === pendingAction.id ? { ...h, status: 'rejected' } : h));
      message.error(`Host application rejected. Reason: ${rejectionReason}`);
    } else if (pendingAction?.type === 'booking') {
      setBookings(prev => prev.map(b => b.id === pendingAction.id ? { ...b, status: 'cancelled' } : b));
      message.error(`Booking cancelled. Reason: ${rejectionReason}`);
    } else if (pendingAction?.type === 'review') {
      setReviews(prev => prev.filter(r => r.id !== pendingAction.id));
      message.error(`Review deleted. Reason: ${rejectionReason}`);
    }
    
    setRejectionModalVisible(false);
    setDrawerVisible(false);
    setPendingAction(null);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      message.success('Marketplace data synchronized');
    }, 1500);
  };

  const handleRestore = (id: string, type: 'listing' | 'host' | 'review') => {
    if (type === 'listing') {
      setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'pending' } : l));
    } else if (type === 'host') {
      setHosts(prev => prev.map(h => h.id === id ? { ...h, status: 'pending' } : h));
    } else if (type === 'review') {
      // For simplicity, we'll need to store 'deleted' reviews if we want to restore them.
      // Since reviews are filtered out on delete, restore logic would need a hidden state.
      // For now, let's keep it consistent with Listings/Hosts which just change status.
    }
    message.success(`${type.charAt(0).toUpperCase() + type.slice(1)} restored to pending`);
  };

  const showListingDetails = (listing: Listing) => {
    setSelectedListing(listing);
    setDrawerType('listing');
    setDrawerVisible(true);
  };

  const showHostProfile = (host: Host) => {
    setSelectedHost(host);
    setDrawerType('host');
    setDrawerVisible(true);
  };

  const showBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDrawerType('booking');
    setDrawerVisible(true);
  };

  const showReviewDetails = (review: UserReview) => {
    setSelectedReview(review);
    setDrawerType('review');
    setDrawerVisible(true);
  };

  const columns = [
    {
      title: 'LISTING',
      dataIndex: 'title',
      key: 'title',
      render: (t: string, r: Listing) => (
        <Space>
          <Avatar shape="square" size={48} icon={<ShopOutlined />} src={`https://api.dicebear.com/7.x/initials/svg?seed=${t}`} />
          <Space orientation="vertical" size={0}>
            <Text strong>{t}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.type} • {r.id}</Text>
          </Space>
        </Space>
      )
    },
    {
      title: 'HOST',
      dataIndex: 'host',
      key: 'host',
      render: (t: string) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>{t}</Text>
        </Space>
      )
    },
    {
      title: 'LOCATION',
      dataIndex: 'location',
      key: 'location',
      render: (t: string) => <Space><EnvironmentOutlined /> {t}</Space>
    },
    {
      title: 'PRICE',
      dataIndex: 'price',
      key: 'price',
      render: (v: number) => <Text strong>${v}/night</Text>
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => (
        <Tag color={s === 'active' ? 'green' : s === 'pending' ? 'gold' : 'red'} style={{ borderRadius: 12, padding: '0 12px' }}>
          {s.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_: any, r: Listing) => (
        <Space>
          <Tooltip title="View Details">
            <Button type="text" icon={<EyeOutlined />} onClick={() => showListingDetails(r)} />
          </Tooltip>
          {r.status === 'pending' && (
            <>
              <Tooltip title="Approve">
                <Button type="text" icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />} onClick={() => handleApprove(r.id)} />
              </Tooltip>
              <Tooltip title="Reject">
                <Button type="text" icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />} onClick={() => initiateRejection(r.id, 'listing')} />
              </Tooltip>
            </>
          )}
        </Space>
      )
    }
  ];

  const hostColumns = [
    {
      title: 'HOST',
      dataIndex: 'name',
      key: 'name',
      render: (t: string, r: Host) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Space orientation="vertical" size={0}>
            <Text strong>{t}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.email}</Text>
          </Space>
        </Space>
      )
    },
    {
      title: 'JOINED',
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
    {
      title: 'DOCUMENT',
      dataIndex: 'documentUrl',
      key: 'documentUrl',
      render: (url: string) => <Button type="link" icon={<FileTextOutlined />}>{url}</Button>
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => (
        <Tag color={s === 'verified' ? 'green' : s === 'pending' ? 'gold' : 'red'}>
          {s.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_: any, r: Host) => (
        <Space>
          {r.status === 'pending' && (
            <>
              <Popconfirm
                title="Verify Host"
                description="Are you sure you want to verify this host?"
                onConfirm={() => handleVerifyHost(r.id, 'verified')}
                okText="Yes"
                cancelText="No"
              >
                <Button size="small" type="primary">Verify</Button>
              </Popconfirm>
              <Button size="small" danger onClick={() => initiateRejection(r.id, 'host')}>Reject</Button>
            </>
          )}
          <Button size="small" icon={<EyeOutlined />} onClick={() => showHostProfile(r)}>Profile</Button>
        </Space>
      )
    }
  ];

  const bookingColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'LISTING / HOST',
      dataIndex: 'listingTitle',
      key: 'listingTitle',
      render: (t: string, r: Booking) => (
        <Space orientation="vertical" size={0}>
          <Text strong>{t}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>Host: {r.hostName}</Text>
        </Space>
      )
    },
    {
      title: 'CUSTOMER',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'DATES',
      key: 'dates',
      render: (_: any, r: Booking) => (
        <Text style={{ fontSize: 13 }}>{r.checkIn} → {r.checkOut}</Text>
      )
    },
    {
      title: 'TOTAL',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (v: number) => <Text strong>${v}</Text>
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => (
        <Badge status={s === 'active' ? 'processing' : s === 'upcoming' ? 'warning' : s === 'completed' ? 'success' : 'default'} text={s.toUpperCase()} />
      )
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_: any, r: Booking) => (
        <Space>
          {r.status === 'upcoming' && (
            <Button size="small" danger onClick={() => initiateRejection(r.id, 'booking')}>Cancel</Button>
          )}
          <Button size="small" icon={<EyeOutlined />} onClick={() => showBookingDetails(r)}>Details</Button>
        </Space>
      )
    }
  ];

  const reviewColumns = [
    {
      title: 'RATING',
      dataIndex: 'rating',
      key: 'rating',
      render: (r: number) => (
        <Space size={4}>
          <StarOutlined style={{ color: '#f59e0b' }} />
          <Text strong>{r} / 5</Text>
        </Space>
      )
    },
    {
      title: 'COMMENT',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
      render: (c: string, r: UserReview) => (
        <Space orientation="vertical" size={0}>
          <Text italic>"{c}"</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{r.customerName} on {r.date}</Text>
        </Space>
      )
    },
    {
      title: 'LISTING',
      dataIndex: 'listingTitle',
      key: 'listingTitle',
    },
    {
      title: 'DISPUTE',
      key: 'dispute',
      render: (_: any, r: UserReview) => r.hasDispute ? (
        <Tag color="red" icon={<CloseCircleOutlined />}>OPEN DISPUTE</Tag>
      ) : (
        <Tag color="green" icon={<CheckCircleOutlined />}>CLEAN</Tag>
      )
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_: any, r: UserReview) => (
        <Space>
           {r.hasDispute && (
             <Popconfirm
                title="Resolve Dispute"
                description="Are you sure you want to mark this dispute as resolved?"
                onConfirm={() => handleResolveDispute(r.id)}
             >
               <Button size="small" type="primary">Resolve</Button>
             </Popconfirm>
           )}
           <Button size="small" icon={<EyeOutlined />} onClick={() => showReviewDetails(r)}>Details</Button>
           <Button size="small" danger icon={<CloseCircleOutlined />} onClick={() => initiateRejection(r.id, 'review')}>Delete</Button>
        </Space>
      )
    }
  ];

  const handleVerifyHost = (id: string, status: 'verified' | 'rejected') => {
    setHosts(prev => prev.map(h => h.id === id ? { ...h, status } : h));
    if (status === 'verified') message.success('Host identity verified');
    else message.error('Host application rejected');
  };

  const handleResolveDispute = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, hasDispute: false, disputeStatus: 'resolved' } : r));
    message.success('Dispute resolved');
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
        <Col>
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Marketplace & Stays</Title>
          <Text type="secondary" style={{ fontSize: 16 }}>Moderate listings, verify hosts, and oversee marketplace health.</Text>
        </Col>
        <Col>
          <Space size="large">
            <Input 
              placeholder="Search marketplace..." 
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} 
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 300, borderRadius: 12 }}
            />
            <Button 
               icon={<ReloadOutlined spin={isRefreshing} />} 
               onClick={handleRefresh}
               loading={isRefreshing}
            >
               Refresh
            </Button>
            <Button 
               icon={<RestOutlined />} 
               onClick={() => setTrashVisible(true)}
            >
               Manage Trashed Data
            </Button>
            <Badge count={listings.filter(l => l.status === 'pending').length + hosts.filter(h => h.status === 'pending').length} offset={[10, 0]}>
              <Button icon={<SafetyCertificateOutlined />} size="large" onClick={() => setActiveTab('2')}>Moderation Queue</Button>
            </Badge>
          </Space>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col span={6}>
          <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
            <Statistic title="TOTAL LISTINGS" value={listings.length} prefix={<ShopOutlined style={{ color: '#10b981' }} />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
            <Statistic title="ACTIVE BOOKINGS" value={bookings.filter(b => b.status === 'active').length} prefix={<CalendarOutlined style={{ color: '#3b82f6' }} />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
            <Statistic title="AVG RATING" value={reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 0} suffix="/ 5" prefix={<StarOutlined style={{ color: '#f59e0b' }} />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
            <Statistic title="PENDING MODERATION" value={listings.filter(l => l.status === 'pending').length + hosts.filter(h => h.status === 'pending').length} prefix={<SafetyCertificateOutlined style={{ color: '#ef4444' }} />} />
          </Card>
        </Col>
      </Row>

      <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} tabBarExtraContent={
          <Space>
            <Button size="small">Filter</Button>
            <Button size="small" type="primary">Export</Button>
          </Space>
        }>
          <TabPane tab={<span><ShopOutlined />All Listings</span>} key="1">
            <Table 
              columns={columns} 
              dataSource={listings.filter(l => l.title.toLowerCase().includes(searchText.toLowerCase()) || l.host.toLowerCase().includes(searchText.toLowerCase()))} 
              rowKey="id" 
              pagination={{ pageSize: 5 }} 
            />
          </TabPane>
          <TabPane tab={<span><UserOutlined />Host Verification</span>} key="2">
            <Table 
              columns={hostColumns} 
              dataSource={hosts.filter(h => h.name.toLowerCase().includes(searchText.toLowerCase()) || h.email.toLowerCase().includes(searchText.toLowerCase()))} 
              rowKey="id" 
            />
          </TabPane>
          <TabPane tab={<span><CalendarOutlined />Booking Oversite</span>} key="3">
            <Table 
              columns={bookingColumns} 
              dataSource={bookings.filter(b => b.listingTitle.toLowerCase().includes(searchText.toLowerCase()) || b.customerName.toLowerCase().includes(searchText.toLowerCase()))} 
              rowKey="id" 
            />
          </TabPane>
          <TabPane tab={<span><StarOutlined />Reviews & Disputes</span>} key="4">
            <Table 
              columns={reviewColumns} 
              dataSource={reviews.filter(r => r.listingTitle.toLowerCase().includes(searchText.toLowerCase()) || r.comment.toLowerCase().includes(searchText.toLowerCase()))} 
              rowKey="id" 
            />
          </TabPane>
        </Tabs>
      </Card>

      <Drawer
        title={
          drawerType === 'listing' ? "Listing Details" : 
          drawerType === 'host' ? "Host Profile" :
          drawerType === 'booking' ? "Booking Details" : "Review Details"
        }
        placement="right"
        width={720}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        extra={
          <Space>
            <Button onClick={() => setDrawerVisible(false)}>Cancel</Button>
            {drawerType === 'listing' && selectedListing?.status === 'pending' && (
              <>
                <Button danger onClick={() => initiateRejection(selectedListing.id, 'listing')}>Reject</Button>
                <Button type="primary" onClick={() => handleApprove(selectedListing.id)}>Approve</Button>
              </>
            )}
            {drawerType === 'host' && selectedHost?.status === 'pending' && (
              <>
                <Button danger onClick={() => initiateRejection(selectedHost.id, 'host')}>Reject</Button>
                <Button type="primary" onClick={() => handleVerifyHost(selectedHost.id, 'verified')}>Verify</Button>
              </>
            )}
          </Space>
        }
      >
        {drawerType === 'listing' && selectedListing && (
          <Row gutter={24}>
            <Col span={24}>
              <img 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedListing.title}`} 
                alt="Listing" 
                style={{ width: '100%', borderRadius: 12, marginBottom: 24, height: 300, objectFit: 'cover' }}
              />
              <Descriptions title="Property Details" bordered column={1}>
                <Descriptions.Item label="ID">{selectedListing.id}</Descriptions.Item>
                <Descriptions.Item label="Title">{selectedListing.title}</Descriptions.Item>
                <Descriptions.Item label="Host">{selectedListing.host}</Descriptions.Item>
                <Descriptions.Item label="Location">{selectedListing.location}</Descriptions.Item>
                <Descriptions.Item label="Type">{selectedListing.type}</Descriptions.Item>
                <Descriptions.Item label="Price">${selectedListing.price} / night</Descriptions.Item>
              </Descriptions>

              <Card size="small" title="Trust & Safety Checks" style={{ marginTop: 24, background: isDark ? '#2d2d2d' : '#f8fafc' }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic 
                      title="Photo AI Check" 
                      value={selectedListing.verification.photoAiCheck.toUpperCase()} 
                      valueStyle={{ color: selectedListing.verification.photoAiCheck === 'passed' ? '#3f8600' : '#cf1322', fontSize: 14 }}
                      prefix={selectedListing.verification.photoAiCheck === 'passed' ? <CheckCircleOutlined /> : <WarningOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="Address Valid" 
                      value={selectedListing.verification.addressValid ? 'YES' : 'PENDING'} 
                      valueStyle={{ color: selectedListing.verification.addressValid ? '#3f8600' : '#d46b08', fontSize: 14 }}
                      prefix={<EnvironmentOutlined />}
                    />
                  </Col>
                  <Col span={24}>
                    <Space>
                      <Badge status={selectedListing.verification.safetyFeaturesCovered ? 'success' : 'warning'} />
                      <Text type="secondary">Fire safety & smoke detectors {selectedListing.verification.safetyFeaturesCovered ? 'confirmed' : 'under review'}</Text>
                    </Space>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        )}

        {drawerType === 'host' && selectedHost && (
          <div style={{ padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <Avatar size={100} icon={<UserOutlined />} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedHost.name}`} />
              <Title level={3} style={{ marginTop: 16, marginBottom: 4 }}>{selectedHost.name}</Title>
              <Text type="secondary">{selectedHost.email}</Text>
              <div style={{ marginTop: 8 }}>
                <Tag color={selectedHost.status === 'verified' ? 'green' : 'gold'} icon={selectedHost.status === 'verified' ? <CheckCircleOutlined /> : <SafetyCertificateOutlined />}>
                   {selectedHost.status.toUpperCase()} HOST
                </Tag>
              </div>
            </div>
            
            <Space orientation="vertical" size="large" style={{ width: '100%' }}>
              <Descriptions title={<span><UserOutlined /> Identity Verification</span>} bordered column={1} size="small">
                <Descriptions.Item label="ID Verification">
                  <Badge status={selectedHost.identity.idVerified ? 'success' : 'error'} text={selectedHost.identity.idVerified ? 'Verified' : 'Pending'} />
                  {selectedHost.identity.idVerified && <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>({selectedHost.identity.idType})</Text>}
                </Descriptions.Item>
                <Descriptions.Item label="Selfie Match">
                  <Badge status={selectedHost.identity.selfieMatched ? 'success' : 'warning'} text={selectedHost.identity.selfieMatched ? 'Matched' : 'Unmatched'} />
                </Descriptions.Item>
                <Descriptions.Item label="Phone / Email">
                  <Space split={<Text type="secondary">|</Text>}>
                    <Text type={selectedHost.identity.phoneVerified ? 'success' : 'danger'}>{selectedHost.identity.phoneVerified ? 'Phone ✓' : 'Phone ✗'}</Text>
                    <Text type={selectedHost.identity.emailVerified ? 'success' : 'danger'}>{selectedHost.identity.emailVerified ? 'Email ✓' : 'Email ✗'}</Text>
                  </Space>
                </Descriptions.Item>
                {selectedHost.identity.backgroundCheck && (
                  <Descriptions.Item label="Background Check">
                    <Tag color={selectedHost.identity.backgroundCheck === 'clear' ? 'blue' : 'orange'}>{selectedHost.identity.backgroundCheck.toUpperCase()}</Tag>
                  </Descriptions.Item>
                )}
              </Descriptions>

              <Descriptions title={<span><HomeOutlined /> Property Validation</span>} bordered column={1} size="small">
                <Descriptions.Item label="Address">
                  <Badge status={selectedHost.property.addressVerified ? 'success' : 'error'} text={selectedHost.property.addressVerified ? 'Confirmed' : 'Unverified'} />
                </Descriptions.Item>
                <Descriptions.Item label="Ownership Proof">
                  <Tag color="cyan">{selectedHost.property.ownershipProof}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Local Tax Reg">
                  <Badge status={selectedHost.property.taxRegistered ? 'success' : 'default'} text={selectedHost.property.taxRegistered ? 'Registered' : 'Not Found'} />
                </Descriptions.Item>
              </Descriptions>

              <Descriptions title={<span><CreditCardOutlined /> Payment & Tax</span>} bordered column={1} size="small">
                <Descriptions.Item label="Payout Method">
                   {selectedHost.payment.methodSet ? <Tag color="green">ENABLED</Tag> : <Tag color="red">MISSING</Tag>}
                </Descriptions.Item>
                <Descriptions.Item label="Tax ID Status">
                   <Badge status={selectedHost.payment.taxIdStatus === 'verified' ? 'success' : 'warning'} text={selectedHost.payment.taxIdStatus.toUpperCase()} />
                </Descriptions.Item>
              </Descriptions>

              <Descriptions title="Account Stats" bordered column={2} size="small">
                <Descriptions.Item label="Joined">{selectedHost.joinDate}</Descriptions.Item>
                <Descriptions.Item label="Rating">{selectedHost.rating} / 5</Descriptions.Item>
                <Descriptions.Item label="Listings">{selectedHost.totalListings}</Descriptions.Item>
                <Descriptions.Item label="Docs">
                  <Button type="link" size="small" icon={<FileTextOutlined />}>View ID</Button>
                </Descriptions.Item>
              </Descriptions>
            </Space>
          </div>
        )}

        {drawerType === 'booking' && selectedBooking && (
          <div style={{ padding: '0 24px' }}>
            <Descriptions title="Reservation Information" bordered column={1}>
              <Descriptions.Item label="Booking ID">{selectedBooking.id}</Descriptions.Item>
              <Descriptions.Item label="Listing">{selectedBooking.listingTitle}</Descriptions.Item>
              <Descriptions.Item label="Host">{selectedBooking.hostName}</Descriptions.Item>
              <Descriptions.Item label="Guest">{selectedBooking.customerName}</Descriptions.Item>
              <Descriptions.Item label="Check-In">{selectedBooking.checkIn}</Descriptions.Item>
              <Descriptions.Item label="Check-Out">{selectedBooking.checkOut}</Descriptions.Item>
              <Descriptions.Item label="Total Price">${selectedBooking.totalPrice}</Descriptions.Item>
              <Descriptions.Item label="Status">
                 <Badge status={selectedBooking.status === 'active' ? 'processing' : 'default'} text={selectedBooking.status.toUpperCase()} />
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}

        {drawerType === 'review' && selectedReview && (
          <div style={{ padding: '0 24px' }}>
             <div style={{ marginBottom: 24 }}>
                <Title level={4}>Feedback for {selectedReview.listingTitle}</Title>
                <div style={{ marginBottom: 16 }}>
                   <Space size={4}>
                      <StarOutlined style={{ color: '#f59e0b' }} />
                      <Text strong>{selectedReview.rating} / 5</Text>
                   </Space>
                   <Text type="secondary" style={{ marginLeft: 16 }}>by {selectedReview.customerName} on {selectedReview.date}</Text>
                </div>
                <Card variant="borderless" style={{ background: isDark ? '#2d2d2d' : '#f8fafc', fontStyle: 'italic' }}>
                   "{selectedReview.comment}"
                </Card>
             </div>
             
             {selectedReview.hasDispute && (
                <Alert
                   message="Active Dispute"
                   description={`This review has an open dispute with status: ${selectedReview.disputeStatus?.toUpperCase()}`}
                   type="error"
                   showIcon
                />
             )}
          </div>
        )}
      </Drawer>

      <Modal
        title="Reason for Rejection"
        open={rejectionModalVisible}
        onOk={handleConfirmRejection}
        onCancel={() => setRejectionModalVisible(false)}
        okText="Confirm Rejection"
        okButtonProps={{ danger: true }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            Please provide a detailed reason for rejecting this {pendingAction?.type}. 
            This information will be shared with the user.
          </Text>
        </div>
        <Form layout="vertical">
          <Form.Item label="Rejection Reason" required>
            <Input.TextArea 
              rows={4} 
              placeholder="e.g. Identity documents are expired or photo quality is insufficient..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={<span><RestOutlined /> Trashed Data (Rejected / Deleted)</span>}
        width={800}
        onClose={() => setTrashVisible(false)}
        open={trashVisible}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Rejected Listings" key="1">
            <Table
              size="small"
              dataSource={listings.filter(l => l.status === 'rejected')}
              rowKey="id"
              columns={[
                { title: 'Title', dataIndex: 'title', key: 'title' },
                { title: 'Host', dataIndex: 'host', key: 'host' },
                { 
                  title: 'Actions', 
                  key: 'actions', 
                  render: (_: any, r: Listing) => (
                    <Button size="small" icon={<UndoOutlined />} onClick={() => handleRestore(r.id, 'listing')}>Restore</Button>
                  )
                }
              ]}
              locale={{ emptyText: <Empty description="No trashed listings" /> }}
            />
          </TabPane>
          <TabPane tab="Rejected Hosts" key="2">
            <Table
              size="small"
              dataSource={hosts.filter(h => h.status === 'rejected')}
              rowKey="id"
              columns={[
                { title: 'Name', dataIndex: 'name', key: 'name' },
                { title: 'Email', dataIndex: 'email', key: 'email' },
                { 
                  title: 'Actions', 
                  key: 'actions', 
                  render: (_: any, r: Host) => (
                    <Button size="small" icon={<UndoOutlined />} onClick={() => handleRestore(r.id, 'host')}>Restore</Button>
                  )
                }
              ]}
              locale={{ emptyText: <Empty description="No trashed hosts" /> }}
            />
          </TabPane>
        </Tabs>
      </Drawer>
    </div>
  );
};

