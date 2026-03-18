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
  message
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
  MessageOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export const CustomerListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchText, setSearchText] = useState('');

  // Drawers state
  const [isSuspendDrawerVisible, setIsSuspendDrawerVisible] = useState(false);
  const [isComplaintDrawerVisible, setIsComplaintDrawerVisible] = useState(false);
  const [isAddCustomerVisible, setIsAddCustomerVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [customerForm] = Form.useForm();

  const stats = [
    { title: 'Total Customers', value: '124,502', icon: <UserOutlined />, color: '#10b981' },
    { title: 'Active (30d)', value: '42,120', icon: <UserOutlined />, color: '#3b82f6' },
    { title: 'New (This Month)', value: '1,240', icon: <UserAddOutlined />, color: '#6366f1' },
    { title: 'Suspended', value: '845', icon: <StopOutlined />, color: '#ef4444' },
  ];

  const handleSuspend = (customer: any) => {
    setSelectedCustomer(customer);
    setIsSuspendDrawerVisible(true);
  };

  const handleReviewComplaints = (customer: any) => {
    setSelectedCustomer(customer);
    setIsComplaintDrawerVisible(true);
  };

  const confirmSuspension = () => {
    setLoading(true);
    setTimeout(() => {
      message.success(`Account for ${selectedCustomer?.name} has been suspended.`);
      setIsSuspendDrawerVisible(false);
      setLoading(false);
    }, 1000);
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

  const columns = [
    {
      title: 'Customer',
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
            <Text type="secondary" style={{ fontSize: 11 }}>ID: {record.id}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => <Text style={{ fontWeight: 600 }}>{phone}</Text>,
    },
    {
      title: 'Trips',
      dataIndex: 'totalTrips',
      key: 'trips',
      sorter: (a: any, b: any) => a.totalTrips - b.totalTrips,
      render: (trips: number) => <Text strong>{trips}</Text>,
    },
    {
      title: 'Wallet',
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
      title: 'Status',
      key: 'status',
      render: (_: any, record: any) => {
        let color = 'default';
        if (record.status === 'Active') color = 'success';
        if (record.status === 'Suspended') color = 'error';
        if (record.status === 'Inactive') color = 'warning';

        return (
          <Space direction="vertical" size={2}>
            <Tag color={color}>{record.status}</Tag>
            <Tag color={record.level === 'VIP' ? 'purple' : record.level === 'Gold' ? 'gold' : record.level === 'Silver' ? 'default' : 'orange'} icon={<StarOutlined />}>
              {record.level}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="View Customer">
            <Button size="small" type="primary" ghost icon={<EyeOutlined />}>View</Button>
          </Tooltip>
          
          <Tooltip title="Review Complaints">
            <Badge count={record.complaints} color="#faad14" offset={[-4, 4]}>
              <Button size="small" icon={<MessageOutlined />} onClick={() => handleReviewComplaints(record)} />
            </Badge>
          </Tooltip>

          <Tooltip title="Suspend Account">
            <Button size="small" danger icon={<StopOutlined />} onClick={() => handleSuspend(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const customers = [
    { 
      id: 'C-8001', name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 
      phone: '+1 555-1234', totalTrips: 154, walletBalance: 120.50, status: 'Active', level: 'VIP', complaints: 0 
    },
    { 
      id: 'C-8002', name: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 
      phone: '+1 555-5678', totalTrips: 42, walletBalance: 15.00, status: 'Active', level: 'Silver', complaints: 2 
    },
    { 
      id: 'C-8003', name: 'James Phiri', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 
      phone: '+263 772-111', totalTrips: 8, walletBalance: 0.00, status: 'Suspended', level: 'Bronze', complaints: 5 
    },
    { 
      id: 'C-8004', name: 'Elena Zhou', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 
      phone: '+1 555-9999', totalTrips: 305, walletBalance: 450.25, status: 'Active', level: 'Gold', complaints: 0 
    },
  ];

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>Customer Management</Title>
          <Text type="secondary">View customers, manage balances, and handle account suspensions.</Text>
        </Col>
        <Col>
          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />} 
            style={{ borderRadius: 8 }}
            onClick={() => setIsAddCustomerVisible(true)}
          >
            Add Customer
          </Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {stats.map(stat => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <Card bordered={false} bodyStyle={{ padding: 20 }}>
              <Space size={16}>
                <div style={{ 
                  width: 48, height: 48, background: `${stat.color}15`, 
                  borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: stat.color, fontSize: 24
                }}>
                  {stat.icon}
                </div>
                <Statistic title={stat.title} value={stat.value} valueStyle={{ fontWeight: 800 }} />
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={[
              { key: 'All', label: 'All Customers' },
              { key: 'Active', label: 'Active' },
              { key: 'VIP', label: 'VIP / Gold' },
              { key: 'Suspended', label: 'Suspended' },
            ]}
            style={{ marginBottom: -16 }}
          />
          <Space size="middle">
            <Button icon={<ReloadOutlined />} />
            <Button icon={<DownloadOutlined />}>Export</Button>
            <Input
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Search by name, phone..."
              style={{ width: 280, borderRadius: 8 }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </Space>
        </div>
        <Table 
          columns={columns} 
          dataSource={customers} 
          rowKey="id"
          pagination={{ pageSize: 15, position: ['bottomRight'] }}
        />
      </Card>

      {/* Drawers */}
      <Drawer
        title={<span><PlusOutlined /> Add New Customer</span>}
        open={isAddCustomerVisible}
        onClose={() => setIsAddCustomerVisible(false)}
        width={400}
        extra={<Button type="primary" onClick={() => customerForm.submit()} loading={loading}>Add</Button>}
        destroyOnClose
      >
        <Form form={customerForm} layout="vertical" onFinish={handleAddCustomer}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="Ex: Sarah Jenkins" />
          </Form.Item>
          <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
            <Input placeholder="+1 555-0000" />
          </Form.Item>
          <Form.Item name="level" label="Customer Level" initialValue="Bronze">
            <Select options={[{ value: 'Bronze', label: 'Bronze' }, { value: 'Silver', label: 'Silver' }, { value: 'Gold', label: 'Gold' }, { value: 'VIP', label: 'VIP' }]} />
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title={<span><StopOutlined style={{ color: '#ef4444' }} /> Suspend Customer Account</span>}
        open={isSuspendDrawerVisible}
        onClose={() => setIsSuspendDrawerVisible(false)}
        width={400}
        extra={<Button danger type="primary" onClick={confirmSuspension} loading={loading}>Suspend Account</Button>}
      >
        <div style={{ padding: '0 0 24px 0' }}>
            <p>Are you sure you want to suspend the account for <strong>{selectedCustomer?.name}</strong>?</p>
            <p>They will not be able to request rides or use any DashDrive services until the suspension is lifted.</p>
            <Form.Item label="Reason for suspension">
                <Input.TextArea placeholder="Type reason here..." rows={4} />
            </Form.Item>
        </div>
      </Drawer>

      <Drawer
        title={<span><WarningOutlined style={{ color: '#faad14' }} /> Complaints Review</span>}
        open={isComplaintDrawerVisible}
        onClose={() => setIsComplaintDrawerVisible(false)}
        width={400}
      >
        <div style={{ padding: 16, background: '#fffbe6', borderRadius: 12, border: '1px solid #ffe58f', marginBottom: 20 }}>
            <Title level={5}>Customer: {selectedCustomer?.name}</Title>
            <Text>Total Recorded Complaints: <strong>{selectedCustomer?.complaints}</strong></Text>
        </div>
        <div style={{ padding: '0 10px' }}>
             {selectedCustomer?.complaints > 0 ? (
                 <ul style={{ paddingLeft: 20 }}>
                     <li style={{ marginBottom: 16 }}>
                        <Text strong>Reported rude behavior</Text><br/>
                        <Text type="secondary" style={{ fontSize: 12 }}>by Driver D-991 (2 days ago)</Text>
                     </li>
                     {selectedCustomer?.complaints > 1 && <li>
                        <Text strong>Cancelled 3 rides consecutively</Text><br/>
                        <Text type="secondary" style={{ fontSize: 12 }}>(1 week ago)</Text>
                     </li>}
                 </ul>
             ) : (
                 <Text type="secondary">No complaints recorded for this user. Excellent standing.</Text>
             )}
        </div>
      </Drawer>
    </div>
  );
};
