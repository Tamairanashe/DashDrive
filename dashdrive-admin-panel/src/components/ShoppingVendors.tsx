import React, { useState } from 'react';
import { Table, Card, Button, Input, Space, Tag, Typography, Row, Col, Dropdown, MenuProps, Empty, Drawer, Descriptions, Divider, Switch, Avatar, InputNumber, Select, message, Alert, Tabs, Statistic, Modal } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined, WarningOutlined, WalletOutlined, UserAddOutlined, HistoryOutlined, DollarCircleOutlined, SolutionOutlined, ExceptionOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ShoppingVendor {
  id: string;
  name: string;
  businessName: string;
  category: string;
  productsCount: number;
  ordersCount: string;
  earnings: string;
  commission: number;
  rating: number;
  status: 'Active' | 'Inactive' | 'Suspended';
  approvalStatus: 'Approved' | 'Pending' | 'Rejected';
  image: string;
  email: string;
  phone: string;
  contactPerson: string;
}

const mockVendors: ShoppingVendor[] = [
  {
    id: 'VND-SHP-001',
    name: 'John Electro',
    businessName: 'ElectroHub Store',
    category: 'Electronics',
    productsCount: 420,
    ordersCount: '12.4k',
    earnings: '$142,500',
    commission: 12,
    rating: 4.8,
    status: 'Active',
    approvalStatus: 'Approved',
    image: 'https://logo.clearbit.com/apple.com',
    email: 'b2b@electrohub.co.zw',
    phone: '+263 77 999 0000',
    contactPerson: 'John Electro'
  },
  {
    id: 'VND-SHP-002',
    name: 'Sarah Fashion',
    businessName: 'Urban Fashion',
    category: 'Fashion',
    productsCount: 1250,
    ordersCount: '38.2k',
    earnings: '$285,000',
    commission: 15,
    rating: 4.7,
    status: 'Active',
    approvalStatus: 'Approved',
    image: 'https://logo.clearbit.com/nike.com',
    email: 'sarah@urbanfashion.co.zw',
    phone: '+263 71 888 7777',
    contactPerson: 'Sarah Fashion'
  },
  {
    id: 'VND-SHP-003',
    name: 'Dr. Beauty',
    businessName: 'Beauty Palace',
    category: 'Beauty',
    productsCount: 185,
    ordersCount: '4.2k',
    earnings: '$52,100',
    commission: 18,
    rating: 4.6,
    status: 'Inactive',
    approvalStatus: 'Pending',
    image: 'https://logo.clearbit.com/sephora.com',
    email: 'drbeauty@palace.co.zw',
    phone: '+263 78 666 5555',
    contactPerson: 'Dr. Beauty'
  },
  {
    id: 'VND-SHP-004',
    name: 'IKEA Global',
    businessName: 'Home Essentials',
    category: 'Home & Kitchen',
    productsCount: 940,
    ordersCount: '8.9k',
    earnings: '$112,400',
    commission: 10,
    rating: 4.9,
    status: 'Suspended',
    approvalStatus: 'Approved',
    image: 'https://logo.clearbit.com/ikea.com',
    email: 'global@ikea.co.zw',
    phone: '+263 77 111 2222',
    contactPerson: 'IKEA Admin'
  }
];

const MOCK_ORDER_HISTORY = [
  { id: 'ORD-S-9921', date: '2024-03-08 04:15 PM', amount: 890.00, status: 'Completed' },
  { id: 'ORD-S-9810', date: '2024-03-08 11:30 AM', amount: 145.20, status: 'Completed' },
  { id: 'ORD-S-9750', date: '2024-03-07 02:45 PM', amount: 2100.00, status: 'Completed' },
  { id: 'ORD-S-9742', date: '2024-03-07 09:12 AM', amount: 65.00, status: 'Refunded' },
];

const MOCK_PAYOUT_HISTORY = [
  { id: 'PAY-S-101', date: '2024-03-01', period: 'Feb 15 - Feb 29', amount: 18450.00, status: 'Success' },
  { id: 'PAY-S-098', date: '2024-02-15', period: 'Feb 01 - Feb 14', amount: 15200.20, status: 'Success' },
];

const MOCK_DISPUTES = [
  { id: 'DSP-S-001', orderId: 'ORD-S-9921', date: '2024-03-08', type: 'Return Dispute', reason: 'User returned item with missing tags. Merchant refuses refund.', amount: 890.00, status: 'Pending' },
  { id: 'DSP-S-002', orderId: 'ORD-S-9742', date: '2024-03-07', type: 'Quality Issue', reason: 'Customer claims counterfeit brand. Requires brand authentication.', amount: 65.00, status: 'Under Review' },
  { id: 'DSP-S-003', orderId: 'ORD-S-9000', date: '2024-03-05', type: 'Logistics Dispute', reason: 'Merchant claims items were delivered, user says package was empty.', amount: 120.00, status: 'Resolved' },
];

export const ShoppingVendors: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<ShoppingVendor | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editedCommission, setEditedCommission] = useState<number>(0);
  const [editedStatus, setEditedStatus] = useState<'Active' | 'Inactive' | 'Suspended'>('Inactive');
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [disputeResponse, setDisputeResponse] = useState('');

  const openProfile = (vendor: ShoppingVendor) => {
    setSelectedVendor(vendor);
    setEditedCommission(vendor.commission);
    setEditedStatus(vendor.status);
    setIsProfileDrawerOpen(true);
  };

  const handleOpenDispute = (dispute: any) => {
    setSelectedDispute(dispute);
    setIsDisputeModalOpen(true);
  };

  const handleResolveDispute = (action: string) => {
    setIsSaving(true);
    setTimeout(() => {
        message.success(`Marketplace dispute ${selectedDispute.id} marked as ${action}`);
        setIsSaving(false);
        setIsDisputeModalOpen(false);
        setSelectedDispute(null);
        setDisputeResponse('');
    }, 800);
  };

  const handleWorkflowAction = (action: 'Approve' | 'Suspend' | 'Restore' | 'Reject') => {
    if (!selectedVendor) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDrawerVisible(false);
      message.success(`Vendor ${action.toLowerCase()} successfully`);
    }, 600);
  };

  const handleSaveConfiguration = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDrawerVisible(false);
      message.success('Vendor configuration saved successfully');
    }, 500);
  };

  const columns = [
    {
      title: 'Merchant Profile',
      key: 'profile',
      render: (_, record: ShoppingVendor) => (
        <Space>
          <Avatar src={record.image} shape="square" size="large" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text strong>{record.businessName}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>Owner: {record.name} • {record.id}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (_, record: ShoppingVendor) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text strong>{record.earnings}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.ordersCount} Orders • {record.rating}★</Text>
        </div>
      ),
    },
    {
      title: 'Economics',
      key: 'economics',
      render: (_, record: ShoppingVendor) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text strong>{record.commission}% Fee</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.productsCount} SKUs</Text>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record: ShoppingVendor) => {
        let color = 'default';
        if (record.approvalStatus === 'Pending') color = 'warning';
        else if (record.status === 'Active') color = 'success';
        else if (record.status === 'Suspended') color = 'error';
        return <Tag color={color}>{record.approvalStatus === 'Pending' ? 'Pending Approval' : record.status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: ShoppingVendor) => (
        <Button onClick={() => openProfile(record)}>Manage</Button>
      ),
    },
  ];

  const filteredVendors = mockVendors.filter(v => {
    const matchesSearch = v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || v.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'All') return matchesSearch;
    if (activeTab === 'Pending Approval') return matchesSearch && v.approvalStatus === 'Pending';
    if (activeTab === 'Active') return matchesSearch && v.status === 'Active' && v.approvalStatus === 'Approved';
    if (activeTab === 'Suspended') return matchesSearch && v.status === 'Suspended';
    return matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
            <Title level={4} style={{ margin: 0 }}>Merchant Ecosystem</Title>
            <Text type="secondary">Manage multi-vendor seller profiles and global marketplace commissions.</Text>
        </div>
        <Space>
            <Button icon={<WalletOutlined />}>Payouts</Button>
            <Button type="primary" icon={<UserAddOutlined />}>Invite Vendor</Button>
        </Space>
      </div>

      <Card bordered={false} styles={{ body: { padding: 0 } }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
          <Space size="large" style={{ fontWeight: 500 }}>
            {['All', 'Pending Approval', 'Active', 'Suspended'].map(tab => (
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
            placeholder="Search merchants..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 250 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredVendors}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({ onClick: () => openProfile(record), style: { cursor: 'pointer' } })}
        />
      </Card>

      <Drawer
        title="Vendor Configuration"
        placement="right"
        width={600}
        onClose={() => setIsProfileDrawerOpen(false)}
        open={isProfileDrawerOpen}
      >
        {selectedVendor && (
            <Tabs defaultActiveKey="profile" items={[
                {
                    key: 'profile',
                    label: <span><SolutionOutlined /> Profile & Config</span>,
                    children: (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <Avatar src={selectedVendor.image} size={80} shape="square" />
                                <div>
                                    <Title level={4} style={{ margin: 0 }}>{selectedVendor.businessName}</Title>
                                    <Text type="secondary">{selectedVendor.id} • {selectedVendor.name}</Text>
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
                                <Descriptions.Item label="Owner Name">{selectedVendor.name}</Descriptions.Item>
                                <Descriptions.Item label="Contact Person">{selectedVendor.contactPerson}</Descriptions.Item>
                                <Descriptions.Item label="Contact Email">{selectedVendor.email}</Descriptions.Item>
                                <Descriptions.Item label="Contact Phone">{selectedVendor.phone}</Descriptions.Item>
                                <Descriptions.Item label="Department"><Tag color="blue">{selectedVendor.category}</Tag></Descriptions.Item>
                                <Descriptions.Item label="Catalog Size">{selectedVendor.productsCount} SKUs</Descriptions.Item>
                                <Descriptions.Item label="Avg Rating">{selectedVendor.rating} ★</Descriptions.Item>
                            </Descriptions>

                            <Descriptions title="Economics" column={1} bordered size="small">
                                <Descriptions.Item label="Commission Fee (%)">
                                    <InputNumber min={0} max={100} value={editedCommission} onChange={val => setEditedCommission(val || 0)} style={{ width: 100 }} />
                                </Descriptions.Item>
                                <Descriptions.Item label="Merchant Earnings (Net)">{selectedVendor.earnings}</Descriptions.Item>
                                <Descriptions.Item label="Platform Fee (Gross)">${(parseFloat(selectedVendor.earnings.replace(/[^0-9.]/g, '')) * (editedCommission/100)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Descriptions.Item>
                            </Descriptions>

                            <Divider />

                            <Title level={5}>Operations</Title>
                            <Row align="middle" justify="space-between" style={{ padding: '12px 0' }}>
                                <Col>
                                    <Text strong>Store Status (Active)</Text>
                                    <Text type="secondary" style={{ display: 'block', fontSize: 13 }}>Enables visibility on the shopping mall app</Text>
                                </Col>
                                <Col><Switch checked={editedStatus === 'Active'} onChange={checked => setEditedStatus(checked ? 'Active' : 'Inactive')} /></Col>
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
                                    <Button danger onClick={() => handleWorkflowAction('Reject')} loading={isSaving} style={{ flex: 1 }}>Reject</Button>
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
                                    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'Completed' ? 'success' : 'error'}>{s}</Tag> }
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
                                        <Statistic title="Merchant Balance" value={4850.25} precision={2} prefix="$" />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic title="Platform Cut" value={4850.25 * (editedCommission/100)} precision={2} prefix="$" valueStyle={{ color: '#1677ff' }} />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic title="Next Payout" value="Mar 15" valueStyle={{ fontSize: 18 }} />
                                    </Col>
                                </Row>
                                <Button type="primary" ghost block style={{ marginTop: 16 }}>View Details</Button>
                            </Card>

                            <div>
                                <Title level={5}>Payout History</Title>
                                <Table 
                                    size="small"
                                    dataSource={MOCK_PAYOUT_HISTORY}
                                    columns={[
                                        { title: 'ID', dataIndex: 'id', key: 'id' },
                                        { title: 'Period', dataIndex: 'period', key: 'period' },
                                        { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (a) => <Text strong>${a.toLocaleString()}</Text> },
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
                            <Card bordered className="bg-indigo-50 border-indigo-100">
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Statistic title="Escrow Disputes" value={2} prefix={<WarningOutlined className="text-indigo-500" />} />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic title="Return Rate" value={2.4} precision={1} suffix="%" />
                                    </Col>
                                </Row>
                            </Card>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <Title level={5} style={{ margin: 0 }}>Marketplace Disputes</Title>
                                    <Button size="small">Resolution Center</Button>
                                </div>
                                <Table 
                                    size="small"
                                    dataSource={MOCK_DISPUTES}
                                    columns={[
                                        { title: 'Nature', dataIndex: 'type', key: 'type', render: (t) => <Tag color={t.includes('Return') ? 'geekblue' : 'magenta'}>{t}</Tag> },
                                        { title: 'Summary', dataIndex: 'reason', key: 'reason', ellipsis: true },
                                        { title: 'Value', dataIndex: 'amount', key: 'amount', render: (a) => <Text strong>${a.toFixed(2)}</Text> },
                                        { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'Resolved' ? 'success' : 'red'}>{s}</Tag> },
                                        { title: 'Action', key: 'action', render: (_, record) => <Button type="link" size="small" onClick={() => handleOpenDispute(record)}>Review</Button> }
                                    ]}
                                    pagination={false}
                                />
                            </div>

                            <Alert 
                                type="info"
                                showIcon
                                message="Escrow & Payout Safety"
                                description="Payouts for disputed orders are automatically frozen in escrow until the Resolution Center marks the case as 'Resolved'."
                            />
                        </div>
                    )
                }
            ]} />
        )}

      </Drawer>

      <Modal
        title={`Marketplace Dispute Review: ${selectedDispute?.id}`}
        open={isDisputeModalOpen}
        onCancel={() => setIsDisputeModalOpen(false)}
        width={800}
        footer={[
            <Button key="cancel" onClick={() => setIsDisputeModalOpen(false)}>Close</Button>,
            <Button key="escrow" danger onClick={() => handleResolveDispute('Denied - Return to Merchant')}>Release to Merchant</Button>,
            <Button key="refund" type="primary" onClick={() => handleResolveDispute('Approved - Refunded to Customer')}>Issue Full Refund</Button>
        ]}
      >
        {selectedDispute && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ padding: '12px 16px', background: '#eef2ff', borderLeft: '4px solid #4f46e5', borderRadius: 4 }}>
                    <Text strong>Dispute Scenario:</Text> {selectedDispute.type}
                </div>

                <Row gutter={16}>
                    <Col span={12}>
                        <Card size="small" title="Buyer's Statement" extra={<Tag color="blue">Customer</Tag>}>
                            <Text type="secondary" italic>"{selectedDispute.reason}"</Text>
                            <Divider style={{ margin: '8px 0' }} />
                            <div style={{ padding: 12, background: '#f8fafc', borderRadius: 4, textAlign: 'center' }}>
                                <Text type="secondary">Product Unboxing Video Attached</Text>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card size="small" title="Seller's Rebuttal" extra={<Tag color="orange">Merchant</Tag>}>
                            <Text type="secondary" italic>"The buyer has provided no clear evidence of counterfeiting. We have authenticated invoices."</Text>
                            <Divider style={{ margin: '8px 0' }} />
                            <div style={{ padding: 12, background: '#f8fafc', borderRadius: 4, textAlign: 'center' }}>
                                <Text type="secondary">Brand Authorization Certificate</Text>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Descriptions title="Transaction Snapshot" bordered size="small" column={2}>
                    <Descriptions.Item label="Transaction ID">{selectedDispute.id}</Descriptions.Item>
                    <Descriptions.Item label="Order Reference">{selectedDispute.orderId}</Descriptions.Item>
                    <Descriptions.Item label="Escrow Value">${selectedDispute.amount.toFixed(2)}</Descriptions.Item>
                    <Descriptions.Item label="Engagement Date">{selectedDispute.date}</Descriptions.Item>
                </Descriptions>

                <div>
                    <Text strong>Decision Justification (Formal Notification)</Text>
                    <Input.TextArea 
                        rows={3} 
                        placeholder="State the final ruling for both buyer and seller..." 
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
