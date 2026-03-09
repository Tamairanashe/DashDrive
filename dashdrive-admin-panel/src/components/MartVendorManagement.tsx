import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Input, Space, Tag, Typography, Row, Col, Dropdown, MenuProps, Empty, Drawer, Descriptions, Divider, Switch, Avatar, InputNumber, Select, message, Alert, Tabs, Statistic, Modal } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined, WarningOutlined, HistoryOutlined, DollarCircleOutlined, SolutionOutlined, ExceptionOutlined } from '@ant-design/icons';
import { adminApi } from '../api/adminApi';

const { Title, Text } = Typography;

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  url: string;
}

interface MartVendor {
  id: string;
  name: string;
  owner: string;
  location: string;
  zone: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  approvalStatus: 'Approved' | 'Pending' | 'Rejected';
  rating: number;
  catalogSize: number;
  earnings: string;
  commission: number;
  logo: string;
  storeTypes: string[];
  documents?: Document[];
  email: string;
  phone: string;
  contactPerson: string;
}

const MOCK_DOCS: Document[] = [
  { id: 'doc-1', name: 'City Retail License', type: 'License', status: 'Pending', url: '#' },
  { id: 'doc-2', name: 'Pharmacy Dispensing Permit', type: 'Permit', status: 'Pending', url: '#' },
  { id: 'doc-3', name: 'W-9 Form', type: 'Tax', status: 'Pending', url: '#' }
];

const mockVendors: MartVendor[] = [
  {
    id: 'M-101',
    name: 'Fresh Choice Supermarket',
    owner: 'David Chen',
    location: 'Avondale',
    zone: 'Westside',
    status: 'Active',
    approvalStatus: 'Approved',
    rating: 4.8,
    catalogSize: 1250,
    earnings: '$5,450',
    commission: 12,
    logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=150',
    storeTypes: ['Grocery', 'Fresh Produce'],
    documents: MOCK_DOCS.map(d => ({ ...d, status: 'Verified' as const })),
    email: 'ops@freshchoice.co.zw',
    phone: '+263 77 222 1111',
    contactPerson: 'David Chen'
  },
  {
    id: 'M-102',
    name: 'Wellness Hub Pharmacy',
    owner: 'Dr. Sarah Smith',
    location: 'Borrowdale',
    zone: 'Northside',
    status: 'Inactive',
    approvalStatus: 'Pending',
    rating: 0,
    catalogSize: 450,
    earnings: '$0',
    commission: 0,
    logo: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=150',
    storeTypes: ['Pharmacy', 'Health'],
    documents: MOCK_DOCS,
    email: 'info@wellnesshub.co.zw',
    phone: '+263 78 555 6677',
    contactPerson: 'Dr. Sarah Smith'
  },
  {
    id: 'M-103',
    name: 'Gadget Express',
    owner: 'Mike Johnson',
    location: 'CBD',
    zone: 'Downtown',
    status: 'Suspended',
    approvalStatus: 'Approved',
    rating: 3.2,
    catalogSize: 85,
    earnings: '$12,400',
    commission: 18,
    logo: 'https://images.unsplash.com/photo-1550009158-9ebf6d250400?auto=format&fit=crop&q=80&w=150',
    storeTypes: ['Electronics', 'Accessories'],
    documents: MOCK_DOCS.map(d => ({ ...d, status: 'Verified' as const })),
    email: 'sales@gadgetexpress.co.zw',
    phone: '+263 71 333 4444',
    contactPerson: 'Mike Johnson'
  }
];

const MOCK_ORDER_HISTORY = [
  { id: 'ORD-7721', date: '2024-03-08 02:30 PM', items: 8, amount: 112.50, status: 'Completed' },
  { id: 'ORD-7715', date: '2024-03-08 10:15 AM', items: 2, amount: 15.20, status: 'Completed' },
  { id: 'ORD-7690', date: '2024-03-07 05:45 PM', items: 15, amount: 240.00, status: 'Completed' },
  { id: 'ORD-7682', date: '2024-03-07 11:20 AM', items: 4, amount: 42.10, status: 'Completed' },
];

const MOCK_PAYOUT_HISTORY = [
  { id: 'TRX-5512', date: '2024-03-01', period: 'Feb 15 - Feb 29', amount: 3240.00, status: 'Success' },
  { id: 'TRX-5490', date: '2024-02-15', period: 'Feb 01 - Feb 14', amount: 2850.20, status: 'Success' },
];

const MOCK_DISPUTES = [
  { id: 'DSP-M-001', orderId: 'ORD-7682', date: '2024-03-08', type: 'Merchant Dispute', reason: 'Customer reported expired milk, but our stock sync shows valid batch.', amount: 4.50, status: 'Pending' },
  { id: 'DSP-M-002', orderId: 'ORD-7715', date: '2024-03-07', type: 'Refund Request', reason: 'Damaged packaging for detergent.', amount: 12.00, status: 'Under Review' },
  { id: 'DSP-M-003', orderId: 'ORD-7500', date: '2024-03-05', type: 'Merchant Dispute', reason: 'Substituted item was refused despite customer opt-in.', amount: 8.20, status: 'Resolved' },
];

export const MartVendorManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vendors, setVendors] = useState<MartVendor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<MartVendor | null>(null);
  
  const [editedCommission, setEditedCommission] = useState<number>(0);
  const [editedStatus, setEditedStatus] = useState<'Active' | 'Inactive' | 'Suspended'>('Inactive');
  const [isSaving, setIsSaving] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [disputeResponse, setDisputeResponse] = useState('');

  useEffect(() => {
    fetchVendors();
  }, [activeTab]);

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const statusMap: any = {
        'New Requests': 'PENDING',
        'Active': 'Active',
        'Suspended': 'Suspended'
      };
      const status = statusMap[activeTab];
      const response = await adminApi.stores.list({ status, type: 'MART' });

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
        catalogSize: r.inventoryCount || 0,
        earnings: '$0',
        commission: r.status === 'PENDING' ? 0 : 12, // Lower default commission for mart
        logo: r.logo_url || 'https://via.placeholder.com/150',
        storeTypes: r.storeTypes || ['Retail'],
        email: r.email || `contact@${(r.name || 'vendor').toLowerCase().replace(/\s/g, '')}.com`,
        phone: r.phone_number || '+263 00 000 0000',
        contactPerson: r.contact_person || r.owner_name || 'N/A',
        documents: r.documents || (r.status === 'PENDING' ? MOCK_DOCS : MOCK_DOCS.map(d => ({ ...d, status: 'Verified' as const })))
      }));

      // Fallback
      if (mappedRes.length > 0) {
        setVendors(mappedRes);
      } else {
        fallbackToMock();
      }
    } catch (error) {
      console.error('Failed to fetch mart vendors:', error);
      fallbackToMock();
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackToMock = () => {
    if (activeTab === 'All') setVendors(mockVendors);
    else if (activeTab === 'New Requests') setVendors(mockVendors.filter(r => r.approvalStatus === 'Pending'));
    else if (activeTab === 'Active') setVendors(mockVendors.filter(r => r.status === 'Active'));
    else if (activeTab === 'Suspended') setVendors(mockVendors.filter(r => r.status === 'Suspended'));
  };

  const openProfile = (vendor: MartVendor) => {
    setSelectedVendor(vendor);
    setEditedCommission(vendor.commission);
    setEditedStatus(vendor.status);
    setIsDrawerVisible(true);
  };

  const handleSaveConfiguration = () => {
      setIsSaving(true);
      setTimeout(() => {
          if (selectedVendor) {
              const updatedVendor = { ...selectedVendor, commission: editedCommission, status: editedStatus };
              setVendors(prev => prev.map(v => v.id === selectedVendor.id ? updatedVendor : v));
              setSelectedVendor(updatedVendor);
          }
          setIsSaving(false);
          setIsDrawerVisible(false);
          message.success('Vendor configuration saved successfully');
      }, 500);
  };

  const handleVerifyDocument = (docId: string, status: 'Verified' | 'Rejected') => {
    if (!selectedVendor || !selectedVendor.documents) return;
    
    setTimeout(() => {
        const updatedDocs = selectedVendor.documents!.map(d => d.id === docId ? { ...d, status } : d);
        const updatedVendor = { ...selectedVendor, documents: updatedDocs };
        
        setSelectedVendor(updatedVendor);
        setVendors(prev => prev.map(v => v.id === selectedVendor.id ? updatedVendor : v));
        message.success(`Document marked as ${status}`);
    }, 400);
  };

  const handleWorkflowAction = (action: 'Approve' | 'Suspend' | 'Restore' | 'Reject') => {
      if (!selectedVendor) return;
      setIsSaving(true);

      setTimeout(() => {
          let updatedStatus: 'Active' | 'Inactive' | 'Suspended' = selectedVendor.status;
          let updatedApproval: 'Approved' | 'Pending' | 'Rejected' = selectedVendor.approvalStatus;

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

          const updatedVendor = { ...selectedVendor, status: updatedStatus, approvalStatus: updatedApproval, commission: editedCommission };
          setSelectedVendor(updatedVendor);
          setVendors(prev => prev.map(v => v.id === selectedVendor.id ? updatedVendor : v));
          
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
        message.success(`Issue ${selectedDispute.id} marked as ${action}`);
        setIsSaving(false);
        setIsDisputeModalOpen(false);
        setSelectedDispute(null);
        setDisputeResponse('');
    }, 800);
  };

  const getActionMenu = (record: MartVendor): MenuProps => ({
    items: [
      { key: 'view', icon: <EyeOutlined />, label: 'View Profile', onClick: () => openProfile(record) },
      { key: 'edit', label: 'Edit Configuration', onClick: () => openProfile(record) }
    ]
  });

  const columns = [
    {
      title: 'Vendor Name',
      key: 'name',
      render: (_, record: MartVendor) => (
        <Space>
          <Avatar src={record.logo} shape="square" size="large" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text strong>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.location} • {record.storeTypes[0]}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <Space size={4}>
          <Text strong>{rating.toFixed(1)}</Text>
          <span style={{ color: '#fadb14' }}>★</span>
        </Space>
      ),
    },
    {
      title: 'Catalog Size',
      dataIndex: 'catalogSize',
      key: 'catalogSize',
      render: (size: number) => <Text>{size.toLocaleString()} items</Text>,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record: MartVendor) => {
        let color = 'default';
        if (record.approvalStatus === 'Pending') color = 'warning';
        else if (record.status === 'Active') color = 'success';
        else if (record.status === 'Suspended') color = 'error';

        return <Tag color={color}>{record.approvalStatus === 'Pending' ? 'Pending Approval' : record.status}</Tag>;
      },
    },
    {
      title: 'Commission',
      dataIndex: 'commission',
      key: 'commission',
      render: (comm: number) => <Text>{comm}%</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: MartVendor) => (
        <Dropdown menu={getActionMenu(record)} trigger={['click']}>
          <Button type="text" onClick={e => e.stopPropagation()}>Manage Profile</Button>
        </Dropdown>
      ),
    },
  ];

  const filteredVendors = vendors.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.location.toLowerCase().includes(searchQuery.toLowerCase()));

  const tabs = [
    { key: 'All', label: 'All Vendors' },
    { key: 'New Requests', label: 'New Requests' },
    { key: 'Active', label: 'Active' },
    { key: 'Suspended', label: 'Suspended' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card bordered={false} styles={{ body: { padding: 0 } }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
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
          <Space>
            <Input
              placeholder="Search vendors..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 250 }}
            />
            <Button type="primary" icon={<PlusOutlined />}>Add Vendor</Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredVendors}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({ onClick: () => openProfile(record), style: { cursor: 'pointer' } })}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>
                    <Text strong>No Retailers Found</Text><br />
                    <Text type="secondary">There are currently no records found in the "{activeTab}" category.</Text>
                  </span>
                }
              >
                  <Button type="primary" icon={<PlusOutlined />}>Add Vendor</Button>
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
        {selectedVendor && (
            <Tabs defaultActiveKey="profile" items={[
                {
                    key: 'profile',
                    label: <span><SolutionOutlined /> Profile & Config</span>,
                    children: (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <Avatar src={selectedVendor.logo} size={80} shape="square" style={{ border: '1px solid #f0f0f0' }} />
                                <div>
                                    <Title level={4} style={{ margin: 0 }}>{selectedVendor.name}</Title>
                                    <Text type="secondary">{selectedVendor.owner}</Text>
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
                                <Descriptions.Item label="Vendor ID">{selectedVendor.id}</Descriptions.Item>
                                <Descriptions.Item label="Owner">{selectedVendor.owner}</Descriptions.Item>
                                <Descriptions.Item label="Contact Person">{selectedVendor.contactPerson}</Descriptions.Item>
                                <Descriptions.Item label="Contact Email">{selectedVendor.email}</Descriptions.Item>
                                <Descriptions.Item label="Contact Phone">{selectedVendor.phone}</Descriptions.Item>
                                <Descriptions.Item label="Store Types">{selectedVendor.storeTypes?.join(', ') || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item label="Catalog Size">{selectedVendor.catalogSize} Items</Descriptions.Item>
                                <Descriptions.Item label="Physical Address">{selectedVendor.location}</Descriptions.Item>
                                <Descriptions.Item label="Assigned Zone"><Tag>{selectedVendor.zone}</Tag></Descriptions.Item>
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
                                <Descriptions.Item label="Vendor Earnings (Net)">{selectedVendor.earnings}</Descriptions.Item>
                                <Descriptions.Item label="Platform Rev (Gross)">${(parseFloat(selectedVendor.earnings.replace(/[^0-9.]/g, '')) * (editedCommission/100)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Descriptions.Item>
                            </Descriptions>

                            <Divider style={{ margin: '12px 0' }} />

                            <Title level={5}>Required Documents (Verification)</Title>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {selectedVendor.documents && selectedVendor.documents.length > 0 ? (
                                    selectedVendor.documents.map(doc => (
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

                            <Title level={5}>Operations</Title>
                            <Row align="middle" justify="space-between" style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <Col>
                                    <Text strong>Store Status (Active)</Text>
                                    <Text type="secondary" style={{ display: 'block', fontSize: 13 }}>Enables visibility on the customer app</Text>
                                </Col>
                                <Col><Switch defaultChecked={selectedVendor.status === 'Active'} /></Col>
                            </Row>

                            <Divider />
                            
                            {selectedVendor.approvalStatus === 'Pending' && (
                                <div style={{ padding: 16, backgroundColor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8 }}>
                                    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <WarningOutlined style={{ color: '#faad14' }} />
                                    <Text strong style={{ color: '#faad14' }}>Application Review Required</Text>
                                    </div>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                    <Button type="primary" onClick={() => handleWorkflowAction('Approve')} loading={isSaving} style={{ flex: 1, backgroundColor: '#52c41a' }}>Approve & Activate</Button>
                                    <Button danger onClick={() => handleWorkflowAction('Reject')} loading={isSaving} style={{ flex: 1 }}>Reject Application</Button>
                                    </div>
                                </div>
                            )}

                            {selectedVendor.approvalStatus === 'Approved' && (
                                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                                    {selectedVendor.status === 'Active' ? (
                                    <Button danger type="dashed" onClick={() => handleWorkflowAction('Suspend')} loading={isSaving}>Suspend Operations</Button>
                                    ) : (
                                    <Button type="primary" onClick={() => handleWorkflowAction('Restore')} loading={isSaving}>Restore Operations</Button>
                                    )}
                                    <Button type="primary" onClick={handleSaveConfiguration} loading={isSaving}>Save Changes</Button>
                                </div>
                            )}

                            {selectedVendor.approvalStatus === 'Rejected' && (
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
                                    { title: 'Items', dataIndex: 'items', key: 'items' },
                                    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (a) => <Text strong>${a.toFixed(2)}</Text> },
                                    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color="success">{s}</Tag> }
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
                                        <Statistic title="Vendor Balance" value={1180.20} precision={2} prefix="$" />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic title="Platform Share" value={1180.20 * (editedCommission/100)} precision={2} prefix="$" valueStyle={{ color: '#1677ff' }} />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic title="Next Cycle" value="Mar 15" valueStyle={{ fontSize: 18 }} />
                                    </Col>
                                </Row>
                                <Button type="primary" ghost block style={{ marginTop: 16 }}>Generate Payout Report</Button>
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
                            <Card bordered className="bg-orange-50 border-orange-100">
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Statistic title="Active Issues" value={2} prefix={<WarningOutlined className="text-orange-500" />} />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic title="Damaged Goods Rate" value={0.8} precision={1} suffix="%" />
                                    </Col>
                                </Row>
                            </Card>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <Title level={5} style={{ margin: 0 }}>Refund & SKU Disputes</Title>
                                    <Button size="small">Export Log</Button>
                                </div>
                                <Table 
                                    size="small"
                                    dataSource={MOCK_DISPUTES}
                                    columns={[
                                        { title: 'Type', dataIndex: 'type', key: 'type', render: (t) => <Tag color={t.includes('Dispute') ? 'volcano' : 'cyan'}>{t}</Tag> },
                                        { title: 'Reason', dataIndex: 'reason', key: 'reason', ellipsis: true },
                                        { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (a) => <Text strong>${a.toFixed(2)}</Text> },
                                        { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'Resolved' ? 'success' : 'processing'}>{s}</Tag> },
                                        { title: 'Action', key: 'action', render: (_, record) => <Button type="link" size="small" onClick={() => handleOpenDispute(record)}>Analyze</Button> }
                                    ]}
                                    pagination={false}
                                />
                            </div>

                            <Alert 
                                type="warning"
                                showIcon
                                message="Mart Service Level Agreement"
                                description="Repeated disputes regarding 'Damaged Goods' may trigger a mandatory stock quality audit for this vendor."
                            />
                        </div>
                    )
                }
            ]} />
        )}

      </Drawer>

      <Modal
        title={`Retail Dispute Analysis: ${selectedDispute?.id}`}
        open={isDisputeModalOpen}
        onCancel={() => setIsDisputeModalOpen(false)}
        width={750}
        footer={[
            <Button key="cancel" onClick={() => setIsDisputeModalOpen(false)}>Close</Button>,
            <Button key="reject" danger onClick={() => handleResolveDispute('Denied')}>Deny Refund</Button>,
            <Button key="approve" type="primary" onClick={() => handleResolveDispute('Resolved/Refunded')}>Authorize Refund</Button>
        ]}
      >
        {selectedDispute && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card size="small" title="Customer Claim" extra={<Tag color="volcano">Damaged/OOS</Tag>}>
                            <Text type="secondary" italic>"{selectedDispute.reason}"</Text>
                            <Divider style={{ margin: '8px 0' }} />
                            <div style={{ padding: 12, background: '#fff7ed', borderRadius: 4, border: '1px solid #ffedd5' }}>
                                <Text strong style={{ fontSize: 12 }}>User Request:</Text><br/>
                                <Text style={{ fontSize: 12 }}>Immediate credit for missing item in grocery bag.</Text>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card size="small" title="Inventory Status" extra={<Tag color="cyan">System Log</Tag>}>
                            <div style={{ marginBottom: 8 }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>POS Sync at: {selectedDispute.date} 09:00 AM</Text>
                            </div>
                            <div style={{ padding: 12, background: '#ecfeff', borderRadius: 4, border: '1px solid #cffafe' }}>
                                <Text strong style={{ fontSize: 12 }}>Merchant Note:</Text><br/>
                                <Text style={{ fontSize: 12 }}>Item was scanned at checkout and packed. Check driver handling.</Text>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Descriptions title="Dispute Information" bordered size="small" column={2}>
                    <Descriptions.Item label="Issue ID">{selectedDispute.id}</Descriptions.Item>
                    <Descriptions.Item label="Order ID">{selectedDispute.orderId}</Descriptions.Item>
                    <Descriptions.Item label="Claim Value">${selectedDispute.amount.toFixed(2)}</Descriptions.Item>
                    <Descriptions.Item label="Store">{selectedVendor?.name}</Descriptions.Item>
                </Descriptions>

                <div>
                    <Text strong>Resolution Communication</Text>
                    <Input.TextArea 
                        rows={3} 
                        placeholder="Final ruling for merchant and customer..." 
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
