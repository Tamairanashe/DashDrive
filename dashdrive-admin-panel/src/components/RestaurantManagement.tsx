import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Input, Space, Tag, Typography, Row, Col, Statistic, Dropdown, MenuProps, Empty, Drawer, Descriptions, Divider, Switch, Avatar, InputNumber, Select, message, Alert, Tabs, Modal } from 'antd';
import { DownloadOutlined, PlusOutlined, SearchOutlined, ShopOutlined, MoreOutlined, EyeOutlined, StarFilled, ClockCircleOutlined, PercentageOutlined, HistoryOutlined, DollarCircleOutlined, SolutionOutlined, WarningOutlined, ExceptionOutlined } from '@ant-design/icons';
import { adminApi } from '../api/adminApi';
import { MapPreview } from './MapPreview';
import { MapPin, Package } from 'lucide-react';

const { Title, Text } = Typography;

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  url: string;
}

interface Restaurant {
  id: string;
  name: string;
  owner: string;
  location: string;
  zone: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  approvalStatus: 'Approved' | 'Pending' | 'Rejected';
  rating: number;
  totalOrders: number;
  earnings: string;
  commission: number;
  logo: string;
  coordinates: [number, number];
  estimatedPrepTime?: number;
  cuisineTypes?: string[];
  reviewCount?: number;
  documents?: Document[];
  email: string;
  phone: string;
  contactPerson: string;
}

const MOCK_DOCS: Document[] = [
  { id: 'doc-1', name: 'City Business License', type: 'License', status: 'Pending', url: '#' },
  { id: 'doc-2', name: 'Food Safety Permit', type: 'Permit', status: 'Pending', url: '#' },
  { id: 'doc-3', name: 'W-9 Form', type: 'Tax', status: 'Pending', url: '#' }
];

const mockRestaurants: Restaurant[] = [
  {
    id: 'RES-101',
    name: 'Burger King',
    owner: 'Robert Fox',
    location: '123 Main St, Downtown',
    zone: 'Downtown',
    status: 'Active',
    approvalStatus: 'Approved',
    rating: 4.8,
    totalOrders: 1240,
    earnings: '$12,450',
    commission: 15,
    logo: 'https://logo.clearbit.com/burgerking.com',
    coordinates: [23.7516, 90.3804],
    estimatedPrepTime: 25,
    cuisineTypes: ['Burgers', 'Fast Food'],
    reviewCount: 450,
    email: 'ops@burgerking.co.zw',
    phone: '+263 77 123 4567',
    contactPerson: 'Robert Fox'
  },
  {
    id: 'RES-102',
    name: 'Green Leaf Vegan',
    owner: 'Sarah Smith',
    location: '45 Health Ave, Suburbs',
    zone: 'Suburbs',
    status: 'Inactive',
    approvalStatus: 'Pending',
    rating: 0,
    totalOrders: 0,
    earnings: '$0',
    commission: 0,
    logo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=150&auto=format&fit=crop',
    coordinates: [23.7616, 90.3904],
    estimatedPrepTime: 15,
    cuisineTypes: ['Vegan', 'Healthy'],
    reviewCount: 0,
    documents: MOCK_DOCS,
    email: 'sarah@greenleaf.com',
    phone: '+263 78 444 5566',
    contactPerson: 'Sarah Smith'
  },
  {
    id: 'RES-103',
    name: 'Night Owl Diner',
    owner: 'Mike Johnson',
    location: '900 Midnight Blvd, Northside',
    zone: 'Northside',
    status: 'Suspended',
    approvalStatus: 'Approved',
    rating: 3.2,
    totalOrders: 3120,
    earnings: '$28,400',
    commission: 18,
    logo: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=150&auto=format&fit=crop',
    coordinates: [23.7416, 90.3704],
    estimatedPrepTime: 30,
    cuisineTypes: ['American', 'Diner'],
    reviewCount: 890,
    email: 'mike@nightowl.co.zw',
    phone: '+263 71 222 3333',
    contactPerson: 'Mike Johnson'
  },
  {
    id: 'RES-104',
    name: 'Taste of Italy',
    owner: 'Giovanni Rossi',
    location: '12 Pasta Lane, Downtown',
    zone: 'Downtown',
    status: 'Inactive',
    approvalStatus: 'Pending',
    rating: 0,
    totalOrders: 0,
    earnings: '$0',
    commission: 0,
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=150&auto=format&fit=crop',
    coordinates: [23.7550, 90.3850],
    estimatedPrepTime: 40,
    cuisineTypes: ['Italian', 'Pizza'],
    reviewCount: 0,
    documents: MOCK_DOCS.map(d => ({ ...d, status: 'Verified' as const })),
    email: 'giovanni@italy.co.zw',
    phone: '+263 77 888 9900',
    contactPerson: 'Giovanni Rossi'
  }
];

const MOCK_ORDER_HISTORY = [
  { id: 'ORD-5412', date: '2024-03-08 11:20 AM', items: 3, amount: 25.50, status: 'Completed' },
  { id: 'ORD-5410', date: '2024-03-08 09:15 AM', items: 1, amount: 12.00, status: 'Completed' },
  { id: 'ORD-5398', date: '2024-03-07 07:45 PM', items: 5, amount: 84.30, status: 'Completed' },
  { id: 'ORD-5390', date: '2024-03-07 01:20 PM', items: 2, amount: 15.00, status: 'Refunded' },
];

const MOCK_PAYOUT_HISTORY = [
  { id: 'TRX-9921', date: '2024-03-01', period: 'Feb 15 - Feb 29', amount: 1450.00, method: 'Bank Transfer', status: 'Success' },
  { id: 'TRX-9810', date: '2024-02-15', period: 'Feb 01 - Feb 14', amount: 1220.50, method: 'Bank Transfer', status: 'Success' },
];

const MOCK_DISPUTES = [
  { id: 'DSP-101', orderId: 'ORD-5410', date: '2024-03-08', type: 'Merchant Dispute', reason: 'Customer claimed item missing, but we have CCTV of packing.', amount: 12.00, status: 'Pending' },
  { id: 'REF-202', orderId: 'ORD-5390', date: '2024-03-07', type: 'Refund Request', reason: 'Cold food upon arrival.', amount: 15.00, status: 'Under Review' },
  { id: 'DSP-103', orderId: 'ORD-5300', date: '2024-03-05', type: 'Merchant Dispute', reason: 'Refund was processed without merchant notification.', amount: 22.50, status: 'Resolved' },
];

export const RestaurantManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  
  // Local state for interactive editing in the drawer
  const [editedCommission, setEditedCommission] = useState<number>(0);
  const [editedStatus, setEditedStatus] = useState<'Active' | 'Inactive' | 'Suspended'>('Inactive');
  const [isSaving, setIsSaving] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [disputeResponse, setDisputeResponse] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, [activeTab]);

  const fetchRestaurants = async () => {
    setIsLoading(true);
    try {
      const statusMap: any = {
        'New Requests': 'PENDING',
        'Active': 'Active',
        'Suspended': 'Suspended'
      };
      const status = statusMap[activeTab];
      const response = await adminApi.stores.list({ status, type: 'FOOD' });

      const apiRes = response.data.data || [];
      const mappedRes = apiRes.map((r: any) => ({
        id: r.id,
        name: r.name,
        owner: r.owner_name || 'New Merchant',
        location: r.address || 'Location Pending',
        zone: r.regions?.name || 'Unassigned',
        status: r.is_active ? 'Active' : 'Inactive',
        approvalStatus: r.status === 'PENDING' ? 'Pending' : (r.is_active ? 'Approved' : 'Rejected'),
        rating: r.rating || 0,
        totalOrders: 0,
        earnings: '$0',
        commission: r.status === 'PENDING' ? 0 : 15,
        logo: r.logo_url || 'https://via.placeholder.com/150',
        coordinates: [23.7516, 90.3804],
        estimatedPrepTime: r.estimatedPrepTime,
        cuisineTypes: r.cuisineTypes,
        reviewCount: r.reviewCount,
        email: r.email || `contact@${(r.name || 'vendor').toLowerCase().replace(/\s/g, '')}.com`,
        phone: r.phone_number || '+263 00 000 0000',
        contactPerson: r.contact_person || r.owner_name || 'N/A',
        documents: r.documents || (r.status === 'PENDING' ? MOCK_DOCS : MOCK_DOCS.map(d => ({ ...d, status: 'Verified' as const })))
      }));

      // Fallback to local mock data if the DB is empty so the UI tabs work visually
      if (mappedRes.length > 0) {
        setRestaurants(mappedRes);
      } else {
        fallbackToMock();
      }
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
      fallbackToMock();
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackToMock = () => {
    if (activeTab === 'All') setRestaurants(mockRestaurants);
    else if (activeTab === 'New Requests') setRestaurants(mockRestaurants.filter(r => r.approvalStatus === 'Pending'));
    else if (activeTab === 'Active') setRestaurants(mockRestaurants.filter(r => r.status === 'Active'));
    else if (activeTab === 'Suspended') setRestaurants(mockRestaurants.filter(r => r.status === 'Suspended'));
  };

  const currentData = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openProfile = (record: Restaurant) => {
    setSelectedRestaurant(record);
    setEditedCommission(record.commission);
    setEditedStatus(record.status);
    setIsDrawerVisible(true);
  };

  const handleSaveConfiguration = () => {
    if (!selectedRestaurant) return;
    setIsSaving(true);
    
    // Simulate API call to save vendor config
    setTimeout(() => {
      message.success(`Configuration for ${selectedRestaurant.name} saved successfully.`);
      
      // Update local table data mock for immediate visual feedback
      const updatedRest = { ...selectedRestaurant, commission: editedCommission, status: editedStatus };
      setRestaurants(prev => prev.map(r => r.id === selectedRestaurant.id ? updatedRest : r));
      
      setSelectedRestaurant(updatedRest); // Update drawer view
      setIsSaving(false);
      setIsDrawerVisible(false);
    }, 800);
  };

  const getActionMenu = (record: Restaurant): MenuProps => ({
    items: [
      { key: 'view', icon: <EyeOutlined />, label: 'View Profile', onClick: () => openProfile(record) },
      { key: 'edit', label: 'Edit Configuration', onClick: () => openProfile(record) }
    ]
  });

  const handleVerifyDocument = (docId: string, status: 'Verified' | 'Rejected') => {
    if (!selectedRestaurant || !selectedRestaurant.documents) return;
    
    setTimeout(() => {
        const updatedDocs = selectedRestaurant.documents!.map(d => d.id === docId ? { ...d, status } : d);
        const updatedRest = { ...selectedRestaurant, documents: updatedDocs };
        
        setSelectedRestaurant(updatedRest);
        setRestaurants(prev => prev.map(r => r.id === selectedRestaurant.id ? updatedRest : r));
        message.success(`Document marked as ${status}`);
    }, 400);
  };

  const handleWorkflowAction = (action: 'Approve' | 'Suspend' | 'Restore' | 'Reject') => {
      if (!selectedRestaurant) return;
      setIsSaving(true);

      setTimeout(() => {
          let updatedStatus: 'Active' | 'Inactive' | 'Suspended' = selectedRestaurant.status;
          let updatedApproval: 'Approved' | 'Pending' | 'Rejected' = selectedRestaurant.approvalStatus;

          if (action === 'Approve') {
              updatedStatus = 'Active';
              updatedApproval = 'Approved';
          } else if (action === 'Suspend') {
              updatedStatus = 'Suspended';
          } else if (action === 'Restore') {
              updatedStatus = 'Active';
          } else if (action === 'Reject') {
              updatedStatus = 'Inactive';
              updatedApproval = 'Rejected';
          }

          const updatedRest = { ...selectedRestaurant, status: updatedStatus, approvalStatus: updatedApproval, commission: editedCommission };
          setSelectedRestaurant(updatedRest);
          setRestaurants(prev => prev.map(r => r.id === selectedRestaurant.id ? updatedRest : r));
          
          setIsSaving(false);
          setIsDrawerVisible(false);
          message.success(`Vendor ${action.toLowerCase()} successfully`);
      }, 600);
  };

  const handleOpenDispute = (dispute: any) => {
    setSelectedDispute(dispute);
    setIsDisputeModalOpen(true);
  };

  const handleResolveDispute = (action: string) => {
    setIsSaving(true);
    setTimeout(() => {
        message.success(`Dispute ${selectedDispute.id} marked as ${action}`);
        setIsSaving(false);
        setIsDisputeModalOpen(false);
        setSelectedDispute(null);
        setDisputeResponse('');
    }, 800);
  };

  const columns = [
    {
      title: 'Restaurant Name',
      key: 'name',
      render: (_: any, record: Restaurant) => (
        <Space size="middle">
          <div style={{ width: 48, height: 48, borderRadius: 8, border: '1px solid #f0f0f0', overflow: 'hidden' }}>
            <img src={record.logo} alt={record.name} style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
          </div>
          <div>
            <Text strong style={{ fontSize: 15 }}>{record.name}</Text>
            <div style={{ marginTop: 4 }}>
              {record.cuisineTypes?.length ? (
                <Space size={4}>
                  {record.cuisineTypes.map(type => (
                    <Tag key={type} bordered={false} color="default">{type}</Tag>
                  ))}
                </Space>
              ) : (
                <Text type="secondary" style={{ fontSize: 12 }}>Owner: {record.owner}</Text>
              )}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Rating',
      key: 'rating',
      render: (_: any, record: Restaurant) => (
        <Space orientation="vertical" size={2}>
          <Space>
            <StarFilled style={{ color: '#f59e0b' }} />
            <Text strong>{record.rating?.toFixed(1) || '0.0'}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>({record.reviewCount || 0} reviews)</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Orders',
      key: 'orders',
      render: (_: any, record: Restaurant) => (
        <Space>
          <Package className="w-4 h-4 text-slate-400" />
          <Text strong>{record.totalOrders.toLocaleString()}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: Restaurant) => {
        let color = 'default';
        if (record.status === 'Active') color = 'success';
        if (record.status === 'Suspended') color = 'error';
        return <Tag color={color}>{record.status}</Tag>;
      },
    },
    {
      title: 'Commission',
      key: 'commission',
      render: (_: any, record: Restaurant) => (
        <Tag color="processing" bordered={false}>
          {record.commission}%
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Restaurant) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => openProfile(record)} />
          <Dropdown menu={getActionMenu(record)} trigger={['click']} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col>
          <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Vendor Management</Title>
          <Text type="secondary" style={{ fontSize: 15 }}>Onboard, approve, and manage restaurant partners</Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<DownloadOutlined />}>Export Registry</Button>
            <Button type="primary" icon={<PlusOutlined />}>Add Restaurant</Button>
          </Space>
        </Col>
      </Row>

      <Card 
        bordered={false} 
        className="shadow-sm border border-slate-100 rounded-2xl"
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          {/* Ant Design Tabs are best here but we use raw pills for simple list views or antd Tabs */}
          <Space size="large" style={{ fontWeight: 500 }}>
              {['All', 'New Requests', 'Active', 'Suspended'].map(tab => (
                <div 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  style={{ 
                    cursor: 'pointer', 
                    color: activeTab === tab ? '#1677ff' : '#64748b',
                    borderBottom: activeTab === tab ? '2px solid #1677ff' : '2px solid transparent',
                    paddingBottom: 4
                  }}
                >
                  {tab}
                </div>
              ))}
          </Space>
          <Input 
            placeholder="Search restaurants, owners, or IDs..." 
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 300, borderRadius: 8 }}
          />
        </div>
        
        <Table 
          columns={columns} 
          dataSource={currentData} 
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 15 }}
          locale={{ 
            emptyText: (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description={
                  <span>
                    <Text strong style={{ display: 'block', fontSize: 16 }}>No {activeTab.toLowerCase()} restaurants.</Text>
                    <Text type="secondary">There are currently no records found in the "{activeTab}" category.</Text>
                  </span>
                }
              >
                  <Button type="primary" icon={<PlusOutlined />}>Add Restaurant</Button>
              </Empty>
            )
          }}
        />
      </Card>

      <Drawer
        title="Vendor Configuration & Profile"
        placement="right"
        width={600}
        onClose={() => setIsDrawerVisible(false)}
        open={isDrawerVisible}
      >
        {selectedRestaurant && (
            <Tabs defaultActiveKey="profile" items={[
                {
                    key: 'profile',
                    label: <span><SolutionOutlined /> Profile & Config</span>,
                    children: (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <Avatar src={selectedRestaurant.logo} size={80} shape="square" style={{ border: '1px solid #f0f0f0' }} />
                                <div>
                                    <Title level={4} style={{ margin: 0 }}>{selectedRestaurant.name}</Title>
                                    <Text type="secondary">{selectedRestaurant.owner}</Text>
                                    <div style={{ marginTop: 8 }}>
                                        <Select 
                                            value={editedStatus} 
                                            onChange={setEditedStatus}
                                            style={{ width: 140 }}
                                            size="small"
                                            options={[
                                                { value: 'Active', label: 'Active', className: 'text-emerald-500 font-bold' },
                                                { value: 'Inactive', label: 'Inactive / Pending', className: 'text-slate-500' },
                                                { value: 'Suspended', label: 'Suspended', className: 'text-rose-500' }
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Descriptions title="Business Information" column={1} bordered size="small">
                                <Descriptions.Item label="Vendor ID">{selectedRestaurant.id}</Descriptions.Item>
                                <Descriptions.Item label="Owner">{selectedRestaurant.owner}</Descriptions.Item>
                                <Descriptions.Item label="Contact Person">{selectedRestaurant.contactPerson}</Descriptions.Item>
                                <Descriptions.Item label="Contact Email">{selectedRestaurant.email}</Descriptions.Item>
                                <Descriptions.Item label="Contact Phone">{selectedRestaurant.phone}</Descriptions.Item>
                                <Descriptions.Item label="Physical Address">{selectedRestaurant.location}</Descriptions.Item>
                                <Descriptions.Item label="Assigned Zone"><Tag>{selectedRestaurant.zone}</Tag></Descriptions.Item>
                                <Descriptions.Item label="Cuisine Types">{selectedRestaurant.cuisineTypes?.join(', ') || 'N/A'}</Descriptions.Item>
                            </Descriptions>

                            <Descriptions title="Platform Economics" column={2} bordered size="small">
                                <Descriptions.Item label="Base Commission (%)">
                                    <InputNumber 
                                        min={0} max={100} 
                                        value={editedCommission} 
                                        onChange={(val) => setEditedCommission(val || 0)} 
                                        style={{ width: '100%' }}
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item label="Vendor Earnings (Net)">{selectedRestaurant.earnings}</Descriptions.Item>
                                <Descriptions.Item label="Platform Rev (Gross)">${(parseFloat(selectedRestaurant.earnings.replace(/[^0-9.]/g, '')) * (editedCommission/100)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Descriptions.Item>
                                <Descriptions.Item label="Lifetime Orders">{selectedRestaurant.totalOrders}</Descriptions.Item>
                                <Descriptions.Item label="Avg Rating">{selectedRestaurant.rating}</Descriptions.Item>
                            </Descriptions>

                            <Divider style={{ margin: '12px 0' }} />

                            <Title level={5}>Required Documents (Verification)</Title>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {selectedRestaurant.documents && selectedRestaurant.documents.length > 0 ? (
                                    selectedRestaurant.documents.map(doc => (
                                        <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid #f0f0f0', borderRadius: 8 }}>
                                            <div>
                                                <Text strong style={{ display: 'block' }}>{doc.name}</Text>
                                                <Space size="small">
                                                    <Text type="secondary" style={{ fontSize: 12 }}>{doc.type}</Text>
                                                    <Tag color={doc.status === 'Verified' ? 'success' : (doc.status === 'Rejected' ? 'error' : 'warning')}>{doc.status}</Tag>
                                                </Space>
                                            </div>
                                            <Space>
                                                <Button size="small" type="link">View</Button>
                                                {doc.status === 'Pending' && (
                                                    <>
                                                        <Button size="small" type="primary" onClick={() => handleVerifyDocument(doc.id, 'Verified')}>Verify</Button>
                                                        <Button size="small" danger onClick={() => handleVerifyDocument(doc.id, 'Rejected')}>Reject</Button>
                                                    </>
                                                )}
                                            </Space>
                                        </div>
                                    ))
                                ) : (
                                    <Text type="secondary">No documents uploaded.</Text>
                                )}
                            </div>

                            <Divider style={{ margin: '12px 0' }} />

                            <Title level={5}>Operations & Configurations</Title>
                            
                            <Row align="middle" justify="space-between" style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <Col>
                                    <Text strong>Accepting New Orders</Text>
                                    <Text type="secondary" style={{ display: 'block', fontSize: 13 }}>Allow users to place orders in real-time</Text>
                                </Col>
                                <Col><Switch defaultChecked={selectedRestaurant.status === 'Active'} /></Col>
                            </Row>

                            <Row align="middle" justify="space-between" style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <Col>
                                    <Text strong>Auto-Accept Orders</Text>
                                    <Text type="secondary" style={{ display: 'block', fontSize: 13 }}>Automatically confirm and prep incoming requests</Text>
                                </Col>
                                <Col><Switch defaultChecked={selectedRestaurant.status === 'Active'} /></Col>
                            </Row>

                            <Row align="middle" justify="space-between" style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <Col>
                                    <Text strong>Allow Scheduled Orders</Text>
                                    <Text type="secondary" style={{ display: 'block', fontSize: 13 }}>Users can place requests for a future date/time</Text>
                                </Col>
                                <Col><Switch /></Col>
                            </Row>

                            <Divider />

                            {selectedRestaurant.approvalStatus === 'Pending' && (
                                <div style={{ padding: 16, backgroundColor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8 }}>
                                    <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <StarFilled style={{ color: '#faad14' }} />
                                        <Text strong style={{ color: '#faad14' }}>Application Review Required</Text>
                                    </div>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <Button type="primary" onClick={() => handleWorkflowAction('Approve')} loading={isSaving} style={{ flex: 1, backgroundColor: '#52c41a' }}>Approve & Activate</Button>
                                        <Button danger onClick={() => handleWorkflowAction('Reject')} loading={isSaving} style={{ flex: 1 }}>Reject Application</Button>
                                    </div>
                                </div>
                            )}

                            {selectedRestaurant.approvalStatus === 'Approved' && (
                                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                                    {selectedRestaurant.status === 'Active' ? (
                                        <Button danger type="dashed" onClick={() => handleWorkflowAction('Suspend')} loading={isSaving}>Suspend Operations</Button>
                                    ) : (
                                        <Button type="primary" onClick={() => handleWorkflowAction('Restore')} loading={isSaving}>Restore Operations</Button>
                                    )}
                                    <Button type="primary" onClick={handleSaveConfiguration} loading={isSaving}>Save Configuration</Button>
                                </div>
                            )}

                            {selectedRestaurant.approvalStatus === 'Rejected' && (
                                <Alert message="This application has been rejected." type="error" showIcon />
                            )}
                        </div>
                    )
                },
                {
                    key: 'history',
                    label: <span><HistoryOutlined /> Order History</span>,
                    children: (
                        <div style={{ paddingTop: 16 }}>
                            <Table 
                                size="small"
                                dataSource={MOCK_ORDER_HISTORY}
                                columns={[
                                    { title: 'Order ID', dataIndex: 'id', key: 'id', render: (t) => <Text strong>{t}</Text> },
                                    { title: 'Date', dataIndex: 'date', key: 'date' },
                                    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (a) => <Text strong>${a.toFixed(2)}</Text> },
                                    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'Completed' ? 'success' : 'error'}>{s}</Tag> },
                                    { title: 'Action', key: 'action', render: () => <Button type="link" size="small">Details</Button> }
                                ]}
                                pagination={{ pageSize: 8 }}
                            />
                        </div>
                    )
                },
                {
                    key: 'payouts',
                    label: <span><DollarCircleOutlined /> Payouts</span>,
                    children: (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 16 }}>
                            <Card bordered className="bg-slate-50">
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Statistic title="Vendor Balance" value={420.50} precision={2} prefix="$" />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic title="Platform Fee" value={420.50 * (editedCommission/100)} precision={2} prefix="$" valueStyle={{ color: '#1677ff' }} />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic title="Next Payout" value="Mar 15" valueStyle={{ fontSize: 18 }} />
                                    </Col>
                                </Row>
                                <Button type="primary" ghost block style={{ marginTop: 16 }}>Request Early Settlement</Button>
                            </Card>

                            <div>
                                <Title level={5}>Payout History</Title>
                                <Table 
                                    size="small"
                                    dataSource={MOCK_PAYOUT_HISTORY}
                                    columns={[
                                        { title: 'ID', dataIndex: 'id', key: 'id' },
                                        { title: 'Period', dataIndex: 'period', key: 'period' },
                                        { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (a) => <Text strong>${a.toFixed(2)}</Text> },
                                        { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color="success">{s}</Tag> }
                                    ]}
                                    pagination={false}
                                />
                            </div>
                        </div>
                    )
                },
                {
                    key: 'disputes',
                    label: <span><ExceptionOutlined /> Disputes & Refunds</span>,
                    children: (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 16 }}>
                            <Card bordered className="bg-rose-50 border-rose-100">
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Statistic title="Unresolved Issues" value={2} prefix={<WarningOutlined className="text-rose-500" />} />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic title="Refund Rate" value={1.2} precision={1} suffix="%" />
                                    </Col>
                                </Row>
                            </Card>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <Title level={5} style={{ margin: 0 }}>Active Disputes & Refund Requests</Title>
                                    <Button size="small">View All</Button>
                                </div>
                                <Table 
                                    size="small"
                                    dataSource={MOCK_DISPUTES}
                                    columns={[
                                        { title: 'Type', dataIndex: 'type', key: 'type', render: (t) => <Tag color={t.includes('Dispute') ? 'orange' : 'blue'}>{t}</Tag> },
                                        { title: 'Reason', dataIndex: 'reason', key: 'reason', ellipsis: true },
                                        { title: 'Amt', dataIndex: 'amount', key: 'amount', render: (a) => <Text strong>${a.toFixed(2)}</Text> },
                                        { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'Resolved' ? 'success' : 'warning'}>{s}</Tag> },
                                        { title: 'Action', key: 'action', render: (_, record) => <Button type="link" size="small" onClick={() => handleOpenDispute(record)}>Resolve</Button> }
                                    ]}
                                    pagination={false}
                                />
                            </div>

                            <Alert 
                                type="info"
                                showIcon
                                message="Dispute Resolution Policy"
                                description="Merchants have 48 hours to dispute a customer refund. If no evidence is provided, the platform's decision is final."
                            />
                        </div>
                    )
                }
            ]} />
        )}

      </Drawer>

      <Modal
        title={`Analyze Dispute: ${selectedDispute?.id}`}
        open={isDisputeModalOpen}
        onCancel={() => setIsDisputeModalOpen(false)}
        width={750}
        footer={[
            <Button key="cancel" onClick={() => setIsDisputeModalOpen(false)}>Close</Button>,
            <Button key="reject" danger onClick={() => handleResolveDispute('Rejected')}>Reject Dispute</Button>,
            <Button key="partial" onClick={() => handleResolveDispute('Partially Refunded')}>Partial Refund</Button>,
            <Button key="approve" type="primary" onClick={() => handleResolveDispute('Approved/Refunded')}>Full Refund (Approve)</Button>
        ]}
      >
        {selectedDispute && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card size="small" title="Customer Evidence" extra={<Tag color="blue">Order Issue</Tag>}>
                            <Text type="secondary" italic>"{selectedDispute.type === 'Refund Request' ? selectedDispute.reason : 'Customer filed a complaint regarding this order.'}"</Text>
                            <Divider style={{ margin: '8px 0' }} />
                            <div style={{ height: 100, background: '#f8fafc', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Text type="secondary">Photo: Cold Food/Packaging</Text>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card size="small" title="Merchant Evidence" extra={<Tag color="orange">Appeal</Tag>}>
                            <Text type="secondary" italic>"{selectedDispute.type === 'Merchant Dispute' ? selectedDispute.reason : 'Waiting for merchant statement...'}"</Text>
                            <Divider style={{ margin: '8px 0' }} />
                            <div style={{ height: 100, background: '#f8fafc', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Text type="secondary">CCTV Packing Snapshot</Text>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Descriptions title="Order Details" bordered size="small" column={2}>
                    <Descriptions.Item label="Order ID">{selectedDispute.orderId}</Descriptions.Item>
                    <Descriptions.Item label="Amount">${selectedDispute.amount.toFixed(2)}</Descriptions.Item>
                    <Descriptions.Item label="Timestamp">{selectedDispute.date}</Descriptions.Item>
                    <Descriptions.Item label="Merchant">{selectedRestaurant?.name}</Descriptions.Item>
                </Descriptions>

                <div style={{ marginTop: 8 }}>
                    <Text strong>Internal Resolution Note</Text>
                    <Input.TextArea 
                        rows={3} 
                        placeholder="Explain your decision to both parties..." 
                        value={disputeResponse}
                        onChange={e => setDisputeResponse(e.target.value)}
                        style={{ marginTop: 8 }}
                    />
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};

