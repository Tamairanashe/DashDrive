import React, { useState } from 'react';
import { 
  Table, 
  Tag, 
  Space, 
  Button, 
  Input, 
  Card, 
  Typography, 
  Tabs, 
  Row, 
  Col, 
  Statistic,
  Avatar,
  Tooltip,
  Badge,
  Drawer,
  Form,
  Select,
  message,
  notification,
  Divider,
  Popconfirm,
  Empty
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  MoreOutlined,
  UserOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  DownloadOutlined,
  ReloadOutlined,
  StarOutlined,
  StopOutlined,
  WarningOutlined,
  WalletOutlined,
  MessageOutlined,
  InfoCircleOutlined,
  HistoryOutlined,
  CopyOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { adminApi } from '../api/adminApi';
import { StateWrapper } from '../components/common/StateWrapper';

const { Title, Text } = Typography;

export const CustomerListPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [isSuspendDrawerVisible, setIsSuspendDrawerVisible] = useState(false);
  const [isComplaintDrawerVisible, setIsComplaintDrawerVisible] = useState(false);
  const [isAddCustomerVisible, setIsAddCustomerVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerForm] = Form.useForm();
  const [suspendForm] = Form.useForm();

  // Governance & Trash State
  const [trashedCustomers, setTrashedCustomers] = useState<any[]>([]);
  const [isTrashDrawerOpen, setIsTrashDrawerOpen] = useState(false);
  const [filterLevel, setFilterLevel] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

  const handleResetFilters = () => {
    setSearchText('');
    setFilterLevel(undefined);
    setFilterStatus(undefined);
    setActiveTab('All');
  };

  const handleRestoreCustomer = (customer: any) => {
    setTrashedCustomers(prev => prev.filter(c => c.id !== customer.id));
    message.success(`Customer ${customer.name} restored successfully`);
  };

  const stats = [
    { 
        title: 'Total Customers', 
        value: '124,502', 
        icon: <UserOutlined />, 
        color: '#10b981',
        info: 'Total number of accounts registered on the platform.'
    },
    { 
        title: 'Active (30d)', 
        value: '42,120', 
        icon: <UserOutlined />, 
        color: '#3b82f6',
        info: 'Customers who used at least one service in the last 30 days.'
    },
    { 
        title: 'New Signups', 
        value: '1,240', 
        icon: <UserAddOutlined />, 
        color: '#6366f1',
        info: 'Accounts created during the current calendar month.'
    },
    { 
        title: 'Suspended', 
        value: '845', 
        icon: <StopOutlined />, 
        color: '#ef4444',
        info: 'Accounts temporarily blocked due to policy violations or complaints.'
    },
  ];

  // Mock Data
  const customers = [
    { 
      id: 'USR-8001', name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 
      phone: '+1 555-1234', totalTrips: 154, walletBalance: 120.50, status: 'Active', level: 'Diamond', complaints: 0,
      createdAt: '2025-06-15T10:00:00Z', updatedAt: '2026-03-18T09:30:00Z'
    },
    { 
      id: 'USR-8002', name: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 
      phone: '+1 555-5678', totalTrips: 42, walletBalance: 15.00, status: 'Active', level: 'Silver', complaints: 2,
      createdAt: '2025-09-20T14:45:00Z', updatedAt: '2026-03-17T16:20:00Z'
    },
    { 
      id: 'USR-8003', name: 'James Phiri', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 
      phone: '+263 772-111', totalTrips: 8, walletBalance: 0.00, status: 'Suspended', level: 'Bronze', complaints: 5,
      createdAt: '2025-12-05T08:12:00Z', updatedAt: '2026-03-18T11:05:00Z'
    },
    { 
      id: 'USR-8004', name: 'Elena Zhou', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 
      phone: '+1 555-9999', totalTrips: 305, walletBalance: 450.25, status: 'Active', level: 'Gold', complaints: 0,
      createdAt: '2024-11-22T19:00:00Z', updatedAt: '2026-03-18T12:01:00Z'
    },
  ];

  const handleSuspend = (customer: any) => {
    setSelectedCustomer(customer);
    setIsSuspendDrawerVisible(true);
  };

  const handleReviewComplaints = (customer: any) => {
    setSelectedCustomer(customer);
    setIsComplaintDrawerVisible(true);
  };

  const confirmSuspension = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      notification.success({
        message: 'Account Suspended',
        description: `Account for ${selectedCustomer?.name} has been suspended. Reason: ${values.reason}`,
        placement: 'topRight'
      });
      setIsSuspendDrawerVisible(false);
      suspendForm.resetFields();
      setLoading(false);
    }, 1200);
  };

  const handleAddCustomer = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      message.success(`Customer ${values.name} added successfully.`);
      setIsAddCustomerVisible(false);
      customerForm.resetFields();
      setLoading(false);
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('ID copied to clipboard');
  };

  const columns = [
    {
      title: 'Customer Profile',
      key: 'name',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Avatar 
            size={48} 
            src={record.avatar} 
            icon={<UserOutlined />} 
            style={{ borderRadius: 12, border: '2px solid #f1f5f9' }}
          />
          <div>
            <Text strong style={{ fontSize: 14, display: 'block' }}>{record.name}</Text>
            <Space size={4}>
                <Text type="secondary" style={{ fontSize: 11 }}>{record.id}</Text>
                <Tooltip title="Copy User ID">
                    <Button 
                        type="text" 
                        size="small" 
                        icon={<CopyOutlined style={{ fontSize: 10 }} />} 
                        onClick={() => copyToClipboard(record.id)}
                        style={{ height: 16, width: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    />
                </Tooltip>
            </Space>
          </div>
        </Space>
      ),
    },
    {
      title: 'Contact',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => <Text style={{ fontWeight: 600 }}>{phone}</Text>,
    },
    {
      title: 'Wallet Balance',
      dataIndex: 'walletBalance',
      key: 'wallet',
      sorter: (a: any, b: any) => a.walletBalance - b.walletBalance,
      render: (val: number) => (
        <Space>
           <WalletOutlined style={{ color: '#10b981' }} />
           <Text strong style={{ color: '#10b981' }}>${val.toFixed(2)}</Text>
        </Space>
      ),
    },
    {
      title: 'Status & Tier',
      key: 'status',
      render: (_: any, record: any) => {
        let color = 'default';
        if (record.status === 'Active') color = 'success';
        if (record.status === 'Suspended') color = 'error';
        if (record.status === 'Inactive') color = 'warning';

        return (
          <Space orientation="vertical" size={2}>
            <Tag color={color} style={{ borderRadius: 4, border: 'none' }}>{record.status}</Tag>
            <Tag 
                style={{ borderRadius: 4, border: 'none' }}
                color={record.level === 'Diamond' ? 'purple' : record.level === 'Gold' ? 'gold' : record.level === 'Silver' ? 'blue' : 'orange'} 
                icon={<StarOutlined />}
            >
              {record.level}
            </Tag>
          </Space>
        );
      },
    },
    {
       title: 'Operational Audit',
       key: 'audit',
       render: (_: any, record: any) => (
         <Space orientation="vertical" size={0}>
           <Text style={{ fontSize: 10, color: '#64748b' }}>Joined: {new Date(record.createdAt).toLocaleDateString()}</Text>
           <Text style={{ fontSize: 10, color: '#64748b' }}>Sync: {new Date(record.updatedAt).toLocaleTimeString()}</Text>
         </Space>
       )
    },
    {
      title: 'Action Center',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="View Full Profile">
            <Button size="small" type="primary" ghost icon={<EyeOutlined />}>View Details</Button>
          </Tooltip>
          
          <Tooltip title="Review Behavioral Complaints">
            <Badge count={record.complaints} color="#faad14" offset={[-4, 4]}>
              <Button size="small" icon={<MessageOutlined />} onClick={() => handleReviewComplaints(record)} />
            </Badge>
          </Tooltip>

          <Tooltip title="Secure Account Suspension">
            <Button size="small" danger icon={<StopOutlined />} onClick={() => handleSuspend(record)} />
          </Tooltip>

          <Tooltip title="Move to Trash">
            <Popconfirm 
              title="Move to Trash?" 
              description="This user will be deactivated and moved to trash for 30 days."
              onConfirm={() => handleDeleteCustomer(record)}
              okText="Yes, Trash"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button size="small" danger icon={<UserDeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleDeleteCustomer = (customer: any) => {
    setTrashedCustomers(prev => [...prev, { ...customer, deletedAt: new Date().toISOString() }]);
    message.warning(`Customer ${customer.name} moved to trash`);
  };

  const currentData = activeTab === 'All' 
    ? customers.filter(c => !trashedCustomers.find(tc => tc.id === c.id))
    : customers.filter(c => !trashedCustomers.find(tc => tc.id === c.id) && (activeTab === 'Diamond' ? (c.level === 'Diamond' || c.level === 'Gold') : c.status === activeTab));

  const filteredData = currentData.filter(c => {
    const matchesSearch = !searchText || 
      c.name.toLowerCase().includes(searchText.toLowerCase()) || 
      c.id.toLowerCase().includes(searchText.toLowerCase()) ||
      c.phone.includes(searchText);
    return matchesSearch;
  });

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>Customer Directory</Title>
          <Text type="secondary">
              Central hub for user identity, financial balances, and account security.
              <Tooltip title="Use this tab to search for users, verify their wallet balances, or take action on problematic behavior.">
                  <InfoCircleOutlined style={{ marginLeft: 8, color: '#94a3b8' }} />
              </Tooltip>
          </Text>
        </Col>
        <Col>
            <Space>
                <Button icon={<HistoryOutlined />} onClick={() => setIsTrashDrawerOpen(true)}>Manage Trash</Button>
                <Button icon={<ReloadOutlined />} onClick={() => navigate('/enterprise/audit-logs')}>User Logs</Button>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    style={{ borderRadius: 8 }}
                    onClick={() => setIsAddCustomerVisible(true)}
                >
                    Add Single User
                </Button>
            </Space>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {stats.map(stat => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <Card variant="borderless" styles={{ body: { padding: 20 } }} className="shadow-sm">
              <Space size={16}>
                <div style={{ 
                  width: 48, height: 48, background: `${stat.color}15`, 
                  borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: stat.color, fontSize: 24
                }}>
                  {stat.icon}
                </div>
                <Statistic 
                    title={
                        <Space size="small">
                            {stat.title}
                            <Tooltip title={stat.info}><InfoCircleOutlined style={{ fontSize: 10, color: '#cbd5e1' }} /></Tooltip>
                        </Space>
                    } 
                    value={stat.value} 
                    valueStyle={{ fontWeight: 800 }} 
                />
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Card variant="borderless" styles={{ body: { padding: 0 } }} className="shadow-sm">
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={[
              { key: 'All', label: 'Global List' },
              { key: 'Active', label: 'Active Users' },
              { key: 'Diamond', label: 'High Value (Gold/Diamond)' },
              { key: 'Suspended', label: 'Restricted' },
            ]}
            style={{ marginBottom: -16 }}
          />
          <Space size="middle">
            <Tooltip title="Reset All Filters">
               <Button icon={<ReloadOutlined />} onClick={handleResetFilters} />
            </Tooltip>
            <Button icon={<DownloadOutlined />}>Export List</Button>
            <Input
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Search by name, phone or User ID..."
              style={{ width: 280, borderRadius: 8 }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Space>
        </div>
        <StateWrapper 
            loading={loading} 
            error={error} 
            isEmpty={filteredData.length === 0}
            onRetry={() => { setLoading(true); setTimeout(() => setLoading(false), 500); }}
          >
          <Table 
            columns={columns} 
            dataSource={filteredData} 
            rowKey="id"
            pagination={{ 
              pageSize: 10, 
              position: ['bottomRight'],
              showSizeChanger: true,
              showTotal: (total) => <Text type="secondary" style={{ fontSize: 12 }}>Showing {total} customers</Text>
            }}
          />
        </StateWrapper>
      </Card>

      {/* Drawers */}
      <Drawer
        title={<span><PlusOutlined /> Register New Customer</span>}
        open={isAddCustomerVisible}
        onClose={() => setIsAddCustomerVisible(false)}
        width={440}
        extra={
            <Space>
                <Button onClick={() => setIsAddCustomerVisible(false)}>Cancel</Button>
                <Button type="primary" onClick={() => customerForm.submit()} loading={loading}>Save User</Button>
            </Space>
        }
        destroyOnClose
      >
        <Form form={customerForm} layout="vertical" onFinish={handleAddCustomer}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>Enter the customer's legal name and primary contact number used for app registration.</Text>
          <Form.Item name="name" label="Legal Full Name" rules={[{ required: true, message: 'Please enter name' }]}>
            <Input placeholder="Ex: Sarah Jenkins" />
          </Form.Item>
          <Form.Item name="phone" label="Primary Phone Number" rules={[{ required: true, message: 'Please enter phone' }]}>
            <Input placeholder="+1 555-0000" />
          </Form.Item>
          <Form.Item name="level" label="Initial Loyalty Tier" initialValue="Bronze">
            <Select options={[{ value: 'Bronze', label: 'Bronze' }, { value: 'Silver', label: 'Silver' }, { value: 'Gold', label: 'Gold' }, { value: 'Diamond', label: 'Diamond' }]} />
          </Form.Item>
          <Divider />
          <Alert
            message="Initial Setup"
            description="New customers start with a zero balance and are required to complete phone verification upon first login."
            type="info"
            showIcon
          />
        </Form>
      </Drawer>

      <Drawer
        title={<span><StopOutlined style={{ color: '#ef4444' }} /> Suspend Customer Account</span>}
        open={isSuspendDrawerVisible}
        onClose={() => setIsSuspendDrawerVisible(false)}
        width={440}
        extra={
            <Space>
                <Button onClick={() => setIsSuspendDrawerVisible(false)}>Cancel</Button>
                <Button 
                    danger 
                    type="primary" 
                    onClick={() => suspendForm.submit()} 
                    loading={loading}
                >
                    Confirm Suspension
                </Button>
            </Space>
        }
      >
        <Form form={suspendForm} layout="vertical" onFinish={confirmSuspension}>
            <div style={{ marginBottom: 24, padding: 16, background: '#fff1f0', borderRadius: 8, border: '1px solid #ffccc7' }}>
                <Title level={5} style={{ color: '#cf1322', marginTop: 0 }}>Critical Restriction</Title>
                <p style={{ margin: 0 }}>You are about to restrict <strong>{selectedCustomer?.name}</strong>.</p>
                <p style={{ margin: '8px 0 0 0', fontSize: 13 }}>They will be unable to use any services until an admin manually lifts this restriction.</p>
            </div>
            
            <Form.Item 
                name="reason" 
                label="Required: Reason for suspension" 
                rules={[{ required: true, message: 'A valid reason is required for the audit log.' }]}
            >
                <Input.TextArea placeholder="Describe the violation (e.g., Unpaid balance, Reported behavior...)" rows={4} />
            </Form.Item>

            <Alert
                message="Action is Logged"
                description="This action will be permanently recorded in the system audit logs under your administrator handle."
                type="warning"
                showIcon
            />
        </Form>
      </Drawer>

      <Drawer
        title={<span><WarningOutlined style={{ color: '#faad14' }} /> Behavioral Review</span>}
        open={isComplaintDrawerVisible}
        onClose={() => setIsComplaintDrawerVisible(false)}
        width={440}
      >
        <div style={{ padding: 16, background: '#fffbe6', borderRadius: 12, border: '1px solid #ffe58f', marginBottom: 20 }}>
            <Title level={5} style={{ marginTop: 0 }}>{selectedCustomer?.name}</Title>
            <Text>Reported Complaints: <Tag color="warning" style={{ borderRadius: 4, marginLeft: 8 }}>{selectedCustomer?.complaints}</Tag></Text>
        </div>
        
        <Title level={5} style={{ fontSize: 14 }}>Complaint History</Title>
        <div style={{ padding: '0 10px' }}>
             {selectedCustomer?.complaints > 0 ? (
                 <ul style={{ paddingLeft: 20, listStyleType: 'disc' }}>
                     <li style={{ marginBottom: 16 }}>
                        <Text strong>Reported unprofessional conduct</Text><br/>
                        <Text type="secondary" style={{ fontSize: 12 }}>Reported by Driver D-991 (Harare) • 2 days ago</Text>
                     </li>
                     {selectedCustomer?.complaints > 1 && <li>
                        <Text strong>High cancellation rate detected</Text><br/>
                        <Text type="secondary" style={{ fontSize: 12 }}>System Alert: 3 cancellations in 1 hour • 1 week ago</Text>
                     </li>}
                 </ul>
             ) : (
                 <Empty description="Clear behavioral history. No complaints found." />
             )}
        </div>
        <Divider />
        <Button block icon={<HistoryOutlined />} onClick={() => navigate('/enterprise/audit-logs')}>View Full User History</Button>
      </Drawer>

      <Drawer
        title={<span><HistoryOutlined /> Manage Trashed Customers</span>}
        open={isTrashDrawerOpen}
        onClose={() => setIsTrashDrawerOpen(false)}
        size="large"
      >
        <Table 
          dataSource={trashedCustomers}
          rowKey="id"
          columns={[
            { title: 'User ID', dataIndex: 'id', key: 'id' },
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Deleted At', dataIndex: 'deletedAt', key: 'date', render: (d) => new Date(d).toLocaleString() },
            { 
              title: 'Actions', 
              key: 'actions', 
              align: 'right',
              render: (_, record) => (
                <Space>
                  <Button size="small" icon={<ReloadOutlined />} onClick={() => handleRestoreCustomer(record)}>Restore</Button>
                  <Button size="small" danger onClick={() => setTrashedCustomers(prev => prev.filter(c => c.id !== record.id))}>Purge</Button>
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

const Alert: React.FC<{message: string, description: string, type: 'info' | 'warning', showIcon: boolean}> = ({message, description, type, showIcon}) => (
    <div style={{ 
        padding: 12, 
        background: type === 'info' ? '#f0fdf4' : '#fffbe6', 
        borderRadius: 8, 
        border: `1px solid ${type === 'info' ? '#dcfce7' : '#ffe58f'}`,
        display: 'flex',
        gap: 12
    }}>
        {showIcon && (type === 'info' ? <CheckCircleOutlined style={{ color: '#10b981', marginTop: 4 }} /> : <WarningOutlined style={{ color: '#faad14', marginTop: 4 }} />)}
        <div>
            <Text strong style={{ fontSize: 13, display: 'block' }}>{message}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{description}</Text>
        </div>
    </div>
);

