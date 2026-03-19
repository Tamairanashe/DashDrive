import React, { useState } from 'react';
import { 
  Table, Tag, Space, Button, Input, Card, Typography, Tabs, 
  Row, Col, Statistic, Avatar, Tooltip, Badge, Dropdown, 
  Drawer, Form, Select, DatePicker, List, Rate, Empty, Divider,
  Modal, InputNumber, Radio, message as antdMessage, Descriptions, Switch
} from 'antd';
import { 
  SearchOutlined, PlusOutlined, UserOutlined, FileTextOutlined,
  SafetyCertificateOutlined, WalletOutlined, HistoryOutlined,
  StarOutlined, WarningOutlined, StopOutlined, BarChartOutlined,
  MoreOutlined, CheckCircleOutlined, CloseCircleOutlined,
  EnvironmentOutlined, CarOutlined, PhoneOutlined, MailOutlined,
  CloudUploadOutlined, MessageOutlined, BellOutlined, SafetyOutlined,
  AuditOutlined, SwapOutlined, ThunderboltOutlined, RocketOutlined,
  DollarOutlined, LockOutlined, UnlockOutlined, ClockCircleOutlined,
  ShoppingOutlined, CoffeeOutlined, ShopOutlined, SyncOutlined,
  FileSearchOutlined, CheckOutlined, CloseOutlined,
  ReloadOutlined, RestOutlined, UndoOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface CourierManagementHubProps {
  initialTab?: string;
}

export const CourierManagementHub: React.FC<CourierManagementHubProps> = ({ initialTab = '1' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCourier, setEditingCourier] = useState<any>(null);
  const [selectedCourier, setSelectedCourier] = useState<any>(null);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  
  // Standardization State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trashVisible, setTrashVisible] = useState(false);
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [pendingAction, setPendingAction] = useState<{ id: string, name: string } | null>(null);

  const [form] = Form.useForm();
  const [incidentForm] = Form.useForm();

  const [couriers, setCouriers] = useState([
    { 
      id: 'CR-1002', name: 'Alex Makoni', email: 'alex.k@dashdrive.com', phone: '+263 772 123 456', 
      vehicleType: 'Motorcycle', rating: 4.7, status: 'Active', city: 'Harare',
      deliveriesCompleted: 220, avgDeliveryTime: '24 min', cancellationRate: '2%',
      earnings: 540.00, commission: 108.00, netPayout: 432.00,
      joinedDate: '15 Feb 2024'
    },
    { 
      id: 'CR-1005', name: 'Sarah Chipo', email: 's.chipo@dashdrive.com', phone: '+263 782 998 122', 
      vehicleType: 'Bicycle', rating: 4.9, status: 'Active', city: 'Bulawayo',
      deliveriesCompleted: 145, avgDeliveryTime: '32 min', cancellationRate: '1%',
      earnings: 320.00, commission: 64.00, netPayout: 256.00,
      joinedDate: '01 Mar 2024'
    }
  ]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      antdMessage.success('Courier synchronization complete');
    }, 1000);
  };

  const handleStatusChange = (id: string, newStatus: string, reason?: string) => {
    setCouriers(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    antdMessage.success(`Courier ${id} is now ${newStatus}`);
    if (reason) antdMessage.info(`Reason: ${reason}`);
    setRejectionModalVisible(false);
    setPendingAction(null);
  };

  const initiateSuspension = (record: any) => {
    setPendingAction({ id: record.id, name: record.name });
    setRejectionReason('');
    setRejectionModalVisible(true);
  };

  const handleConfirmSuspension = () => {
    if (!rejectionReason.trim()) {
      antdMessage.warning('Please provide a suspension reason');
      return;
    }
    handleStatusChange(pendingAction!.id, 'Suspended', rejectionReason);
  };

  const ListTab = () => (
    <div style={{ marginTop: 20 }}>
      <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
        <Row gutter={16} style={{ marginBottom: 20 }} align="middle">
          <Col span={8}>
            <Input 
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} 
              placeholder="Search couriers by name, ID or phone..." 
              className="custom-search"
            />
          </Col>
          <Col span={4}>
            <Select placeholder="Vehicle Type" style={{ width: '100%' }} allowClear>
              <Select.Option value="Motorcycle">Motorcycle</Select.Option>
              <Select.Option value="Bicycle">Bicycle</Select.Option>
              <Select.Option value="Scooter">Scooter</Select.Option>
              <Select.Option value="Car">Small Car</Select.Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select placeholder="Status" style={{ width: '100%' }} allowClear>
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Suspended">Suspended</Select.Option>
            </Select>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsDrawerOpen(true)}>Add New Courier</Button>
          </Col>
        </Row>
        <Table 
          dataSource={couriers}
          rowKey="id"
          columns={[
            { title: 'Courier ID', dataIndex: 'id', key: 'id', width: 120 },
            { 
              title: 'Name', 
              key: 'name', 
              render: (_, record) => (
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <div>
                    <Text strong>{record.name}</Text><br/>
                    <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
                  </div>
                </Space>
              )
            },
            { title: 'Phone', dataIndex: 'phone', key: 'phone' },
            { 
              title: 'Vehicle', 
              dataIndex: 'vehicleType', 
              key: 'vehicleType',
              render: (v) => <Tag color="blue">{v}</Tag>
            },
            { 
              title: 'Rating', 
              dataIndex: 'rating', 
              key: 'rating',
              render: (r) => <Rate disabled defaultValue={r} style={{ fontSize: 12 }} />
            },
            { 
              title: 'Status', 
              dataIndex: 'status', 
              key: 'status',
              render: (s) => <Tag color={s === 'Active' ? 'success' : 'warning'}>{s}</Tag>
            },
            { title: 'City', dataIndex: 'city', key: 'city' },
            {
              title: 'Actions',
              key: 'actions',
              align: 'right',
              render: (_, record) => (
                <Space>
                  <Button size="small" onClick={() => { setSelectedCourier(record); setIsDetailDrawerOpen(true); }}>View</Button>
                  <Dropdown menu={{ 
                    items: [
                      { key: 'edit', label: 'Edit Profile', icon: <PlusOutlined /> },
                      { 
                        key: 'suspend', 
                        label: record.status === 'Suspended' ? 'Activate' : 'Suspend', 
                        danger: record.status !== 'Suspended', 
                        icon: record.status === 'Suspended' ? <CheckCircleOutlined /> : <StopOutlined />,
                        onClick: () => record.status === 'Suspended' ? handleStatusChange(record.id, 'Active') : initiateSuspension(record)
                      }
                    ] 
                  }}>
                    <Button size="small" icon={<MoreOutlined />} />
                  </Dropdown>
                </Space>
              )
            }
          ]}
        />
      </Card>
    </div>
  );

  const RequestsTab = () => (
    <div style={{ marginTop: 20 }}>
      <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
        <Table 
          dataSource={[
            { id: 'RQ-501', name: 'John Doe', city: 'Harare', vehicle: 'Scooter', status: 'Pending', date: 'Today' }
          ]}
          columns={[
            { title: 'Request ID', dataIndex: 'id', key: 'id' },
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Phone', dataIndex: 'phone', key: 'phone' },
            { title: 'City', dataIndex: 'city', key: 'city' },
            { title: 'Vehicle', dataIndex: 'vehicle', key: 'vehicle' },
            { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Badge status="processing" text={s} /> },
            { title: 'Date', dataIndex: 'date', key: 'date' },
            {
              title: 'Actions',
              key: 'actions',
              render: () => (
                <Space>
                  <Button size="small" type="primary">Approve</Button>
                  <Button size="small" danger>Reject</Button>
                </Space>
              )
            }
          ]}
        />
      </Card>
    </div>
  );

  const EarningsTab = () => (
    <div style={{ marginTop: 20 }}>
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card className="shadow-sm">
            <Statistic title="Total Courier Earnings" value={12540} prefix="$" precision={2} />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="shadow-sm">
            <Statistic title="Total Commission" value={2508} prefix="$" precision={2} valueStyle={{ color: '#10b981' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="shadow-sm">
            <Statistic title="Avg Earnings/Courier" value={840} prefix="$" precision={2} />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="shadow-sm">
            <Statistic title="Pending Payouts" value={1450} prefix="$" precision={2} valueStyle={{ color: '#f59e0b' }} />
          </Card>
        </Col>
      </Row>
      <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
        <Table 
          dataSource={couriers}
          rowKey="id"
          columns={[
            { title: 'Courier', dataIndex: 'name', key: 'name', render: (t) => <Text strong>{t}</Text> },
            { title: 'Deliveries', dataIndex: 'deliveriesCompleted', key: 'deliveries' },
            { title: 'Earnings', dataIndex: 'earnings', key: 'earnings', render: (e) => `$${e.toFixed(2)}` },
            { title: 'Commission', dataIndex: 'commission', key: 'commission', render: (c) => `$${c.toFixed(2)}` },
            { title: 'Net Payout', dataIndex: 'netPayout', key: 'netPayout', render: (p) => <Text strong style={{ color: '#10b981' }}>${p.toFixed(2)}</Text> },
            { title: 'Action', key: 'action', render: () => <Button size="small">Process Payout</Button> }
          ]}
        />
      </Card>
    </div>
  );

  const DeliveriesTab = () => (
    <div style={{ marginTop: 20 }}>
      <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
        <Table 
          dataSource={[
            { id: 'DL-8821', pickup: 'Avondale Shopping Centre', dropoff: 'Belgravia', fee: 5.50, status: 'Delivered', type: 'Food' },
            { id: 'DL-8825', pickup: 'Borrowdale Village', dropoff: 'Greystone Park', fee: 12.00, status: 'Cancelled', type: 'Parcel' },
            { id: 'DL-8830', pickup: 'Mart Central', dropoff: 'Highlands', fee: 8.50, status: 'Delivered', type: 'Mart' },
          ]}
          columns={[
            { title: 'Delivery ID', dataIndex: 'id', key: 'id' },
            { title: 'Type', dataIndex: 'type', key: 'type', render: (t) => (
              <Tag icon={t === 'Food' ? <CoffeeOutlined /> : t === 'Mart' ? <ShopOutlined /> : <PlusOutlined />}>{t}</Tag>
            )},
            { title: 'Pickup', dataIndex: 'pickup', key: 'pickup' },
            { title: 'Dropoff', dataIndex: 'dropoff', key: 'dropoff' },
            { title: 'Fee', dataIndex: 'fee', key: 'fee', render: (f) => `$${f.toFixed(2)}` },
            { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => (
              <Tag color={s === 'Delivered' ? 'success' : s === 'Cancelled' ? 'error' : 'warning'}>{s}</Tag>
            )}
          ]}
        />
      </Card>
    </div>
  );

  const items = [
    { key: '1', label: <Space><UserOutlined /> Courier List</Space>, children: <ListTab /> },
    { key: '2', label: <Space><PlusOutlined /> Manual Requests</Space>, children: <RequestsTab /> },
    { 
      key: '3', 
      label: <Space><FileTextOutlined /> Documents</Space>, 
      children: (
        <div style={{ marginTop: 20 }}>
          <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Space>
                <Text strong>Document Status:</Text>
                <Radio.Group defaultValue="All" buttonStyle="solid">
                  <Radio.Button value="All">All</Radio.Button>
                  <Radio.Button value="Verified">Verified</Radio.Button>
                  <Radio.Button value="Pending">Pending</Radio.Button>
                </Radio.Group>
              </Space>
              <Button icon={<AuditOutlined />}>Bulk Verify</Button>
            </div>
            <Table 
              dataSource={[
                { id: 'DOC-501', courier: 'Alex Makoni', type: 'Bike Registration', expiry: '2025-10-12', status: 'Verified' },
                { id: 'DOC-502', courier: 'Sarah Chipo', type: 'National ID', expiry: 'N/A', status: 'Pending' },
                { id: 'DOC-503', courier: 'John Doe', type: 'Operator License', expiry: '2026-01-15', status: 'Verified' },
              ]}
              columns={[
                { title: 'Doc ID', dataIndex: 'id', key: 'id' },
                { title: 'Courier', dataIndex: 'courier', key: 'courier', render: (t) => <Text strong>{t}</Text> },
                { title: 'Document Type', dataIndex: 'type', key: 'type' },
                { title: 'Expiry', dataIndex: 'expiry', key: 'expiry' },
                { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => (
                  <Tag color={s === 'Verified' ? 'success' : 'warning'} icon={s === 'Verified' ? <CheckCircleOutlined /> : <SyncOutlined spin />}>
                    {s}
                  </Tag>
                )},
                { title: 'Actions', key: 'actions', render: () => (
                  <Space>
                    <Button size="small" icon={<FileSearchOutlined />}>View</Button>
                    <Button size="small" type="link">Verify</Button>
                  </Space>
                )}
              ]}
            />
          </Card>
        </div>
      )
    },
    { key: '4', label: <Space><WalletOutlined /> Earnings</Space>, children: <EarningsTab /> },
    { key: '5', label: <Space><RocketOutlined /> Deliveries</Space>, children: <DeliveriesTab /> },
    { 
      key: '6', 
      label: <Space><StarOutlined /> Ratings</Space>, 
      children: (
        <div style={{ marginTop: 20 }}>
          <Row gutter={24}>
            <Col span={8}>
              <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16, textAlign: 'center' }}>
                <Statistic title="Overall Rating" value={4.85} prefix={<StarOutlined style={{ color: '#fadb14' }} />} precision={2} />
                <Divider />
                <div style={{ textAlign: 'left' }}>
                  <Space orientation="vertical" style={{ width: '100%' }}>
                    <div><Text>Timeliness</Text><Rate disabled defaultValue={4.9} style={{ fontSize: 12, float: 'right' }} /></div>
                    <div><Text>Communication</Text><Rate disabled defaultValue={4.7} style={{ fontSize: 12, float: 'right' }} /></div>
                    <div><Text>Care of Items</Text><Rate disabled defaultValue={4.9} style={{ fontSize: 12, float: 'right' }} /></div>
                  </Space>
                </div>
              </Card>
            </Col>
            <Col span={16}>
              <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
                <Title level={5}>Recent Courier Reviews</Title>
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    { user: 'Tendai M.', rating: 5, comment: 'Quick delivery and very polite.', courier: 'Alex Makoni' },
                    { user: 'Blessing K.', rating: 4, comment: 'Food was a bit cold but courier was fast.', courier: 'Sarah Chipo' },
                  ]}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={<Space><Text strong>{item.user}</Text> <Text type="secondary">reviewed</Text> <Text strong>{item.courier}</Text></Space>}
                        description={<div><Rate disabled defaultValue={item.rating} style={{ fontSize: 10 }} /><br/><Text>"{item.comment}"</Text></div>}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </div>
      )
    },
    { 
      key: '7', 
      label: <Space><WarningOutlined /> Incidents</Space>, 
      children: (
        <div style={{ marginTop: 20 }}>
          <Card 
            variant="borderless" 
            className="shadow-sm" 
            style={{ borderRadius: 16 }}
            title="Logistics Incidents"
            extra={<Button type="primary" danger icon={<PlusOutlined />} onClick={() => setIsIncidentModalOpen(true)}>Report Incident</Button>}
          >
            <Table
              dataSource={[
                { id: 'INC-201', courier: 'John Doe', type: 'Late Delivery', severity: 'Low', status: 'Resolved', date: 'Yesterday' },
                { id: 'INC-202', courier: 'Alex Makoni', type: 'Damaged Goods', severity: 'Medium', status: 'Investigating', date: 'Today' },
              ]}
              columns={[
                { title: 'ID', dataIndex: 'id', key: 'id' },
                { title: 'Courier', dataIndex: 'courier', key: 'courier' },
                { title: 'Type', dataIndex: 'type', key: 'type' },
                { title: 'Severity', dataIndex: 'severity', key: 'severity', render: (s) => <Tag color={s === 'High' ? 'red' : 'blue'}>{s}</Tag> },
                { title: 'Status', dataIndex: 'status', key: 'status' },
                { title: 'Date', dataIndex: 'date', key: 'date' },
                { title: 'Action', key: 'action', render: () => <Button size="small">Details</Button> }
              ]}
            />
          </Card>
        </div>
      )
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0, letterSpacing: -1 }}>Courier Management Hub</Title>
          <Text type="secondary">Manage delivery partners, specialized vehicles, and logistics performance</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined spin={isRefreshing} />} onClick={handleManualRefresh}>Refresh</Button>
          <Button icon={<RestOutlined />} onClick={() => setTrashVisible(true)}>Suspended Partners</Button>
          <Button icon={<AuditOutlined />}>Compliance Report</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsDrawerOpen(true)}>Manual Onboard</Button>
        </Space>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        items={items}
        type="line"
        className="custom-tabs"
      />

      <Drawer
        title={editingCourier ? "Edit Courier" : "Add New Courier"}
        width={640}
        onClose={() => { setIsDrawerOpen(false); setEditingCourier(null); }}
        open={isDrawerOpen}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                <Input placeholder="Enter courier name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
                <Input placeholder="Enter phone" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="city" label="City" rules={[{ required: true }]}>
                <Select placeholder="Select city">
                  <Select.Option value="Harare">Harare</Select.Option>
                  <Select.Option value="Bulawayo">Bulawayo</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation={"left" as any}>Vehicle Information</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="vehicleType" label="Vehicle Category" rules={[{ required: true }]}>
                <Select placeholder="Select category">
                  <Select.Option value="Motorcycle">Motorcycle</Select.Option>
                  <Select.Option value="Bicycle">Bicycle</Select.Option>
                  <Select.Option value="Scooter">Scooter</Select.Option>
                  <Select.Option value="Small Car">Small Car</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="plate" label="Plate Number (If applicable)">
                <Input placeholder="e.g. ABC 123" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div style={{ position: 'absolute', right: 0, bottom: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'right' }}>
          <Button onClick={() => setIsDrawerOpen(false)} style={{ marginRight: 8 }}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()}>Submit Request</Button>
        </div>
      </Drawer>

      <Drawer
        title="Courier 360Â° Profile"
        width={800}
        onClose={() => setIsDetailDrawerOpen(false)}
        open={isDetailDrawerOpen}
      >
        {selectedCourier && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar size={80} icon={<UserOutlined />} />
              <Title level={4} style={{ marginTop: 12, marginBottom: 4 }}>{selectedCourier.name}</Title>
              <Tag color="green">Active Partner</Tag>
              <div style={{ marginTop: 8 }}>
                 <Rate disabled defaultValue={selectedCourier.rating} />
              </div>
            </div>
            
            <Descriptions title="Courier Information" bordered column={1} size="small">
              <Descriptions.Item label="Courier ID">{selectedCourier.id}</Descriptions.Item>
              <Descriptions.Item label="Joined Date">{selectedCourier.joinedDate}</Descriptions.Item>
              <Descriptions.Item label="Contact Info">{selectedCourier.phone} | {selectedCourier.email}</Descriptions.Item>
              <Descriptions.Item label="City">{selectedCourier.city}</Descriptions.Item>
              <Descriptions.Item label="Vehicle Type">{selectedCourier.vehicleType}</Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginTop: 24 }}>Logistics Performance</Title>
            <Row gutter={16}>
              <Col span={8}>
                <Card size="small" style={{ background: '#f0f9ff' }}>
                  <Statistic title="Deliveries" value={selectedCourier.deliveriesCompleted} valueStyle={{ fontSize: 18 }} />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ background: '#f0fdf4' }}>
                  <Statistic title="Avg Time" value={selectedCourier.avgDeliveryTime} valueStyle={{ fontSize: 18 }} />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ background: '#fef2f2' }}>
                  <Statistic title="Cancellation" value={selectedCourier.cancellationRate} valueStyle={{ fontSize: 18 }} />
                </Card>
              </Col>
            </Row>

            <Divider />
            <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
              <Button icon={<MessageOutlined />}>Send Message</Button>
              <Button icon={<WarningOutlined />} danger>Send Warning</Button>
              <Button type="primary">Assign New Vehicle</Button>
            </Space>
          </div>
        )}
      </Drawer>

      <CourierIncidentModal 
        isOpen={isIncidentModalOpen} 
        onClose={() => setIsIncidentModalOpen(false)} 
        form={incidentForm} 
      />

      {/* Standardization Modals & Drawers */}
      <Modal
        title="Account Suspension Reason"
        open={rejectionModalVisible}
        onOk={handleConfirmSuspension}
        onCancel={() => setRejectionModalVisible(false)}
        okText="Suspend Partner"
        okButtonProps={{ danger: true }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            Provide a detailed reason for suspending <Text strong>{pendingAction?.name}</Text>. 
          </Text>
        </div>
        <Form layout="vertical">
          <Form.Item label="Reason" required>
            <Input.TextArea 
              rows={4} 
              placeholder="e.g. Failure to comply with delivery standards, fraudulent activity..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={<span><RestOutlined /> Suspended Courier Partners</span>}
        width={720}
        onClose={() => setTrashVisible(false)}
        open={trashVisible}
      >
        <Table
          size="small"
          dataSource={couriers.filter(c => c.status === 'Suspended')}
          rowKey="id"
          columns={[
            {
              title: 'Courier',
              key: 'courier',
              render: (_, r) => (
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <Text strong>{r.name}</Text>
                </Space>
              )
            },
            { title: 'Vehicle', dataIndex: 'vehicleType', key: 'vehicle' },
            { 
              title: 'Actions', 
              key: 'actions', 
              render: (_: any, r: any) => (
                <Space>
                  <Button size="small" icon={<UndoOutlined />} onClick={() => handleStatusChange(r.id, 'Active')}>Restore Account</Button>
                </Space>
              )
            }
          ]}
          locale={{ emptyText: <Empty description="No suspended couriers found" /> }}
        />
      </Drawer>
    </div>
  );
};

const CourierIncidentModal: React.FC<{ 
  isOpen: boolean, 
  onClose: () => void, 
  form: any 
}> = ({ isOpen, onClose, form }) => (
  <Modal
    title={<Space><WarningOutlined style={{ color: '#ff4d4f' }} /> Report Courier Incident</Space>}
    open={isOpen}
    onCancel={onClose}
    onOk={() => form.submit()}
    okText="Report Incident"
    okButtonProps={{ danger: true }}
    centered
  >
    <Form form={form} layout="vertical" onFinish={(values) => {
      antdMessage.success(`Incident reported for ${values.courierName}`);
      onClose();
      form.resetFields();
    }}>
      <Form.Item name="courierName" label="Courier Name / ID" rules={[{ required: true }]}>
        <Input placeholder="Search courier..." />
      </Form.Item>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="type" label="Incident Type" rules={[{ required: true }]}>
            <Select placeholder="Select type">
              <Select.Option value="Damaged Goods">Damaged Goods</Select.Option>
              <Select.Option value="Late Delivery">Late Delivery</Select.Option>
              <Select.Option value="Rude Behavior">Rude Behavior</Select.Option>
              <Select.Option value="Traffic Violation">Traffic Violation</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="severity" label="Severity" rules={[{ required: true }]}>
            <Select placeholder="Select severity">
              <Select.Option value="Low">Low</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="High">High</Select.Option>
              <Select.Option value="Critical">Critical</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="description" label="Incident Description" rules={[{ required: true }]}>
        <Input.TextArea rows={4} placeholder="Describe the incident in detail..." />
      </Form.Item>
      <Form.Item label="Supporting Evidence (Photos)">
        <div style={{ border: '1px dashed #d9d9d9', padding: '16px', textAlign: 'center', borderRadius: 8 }}>
          <CloudUploadOutlined style={{ fontSize: 24, color: '#94a3b8' }} /><br/>
          <Button size="small">Upload Files</Button>
        </div>
      </Form.Item>
    </Form>
  </Modal>
);

export default CourierManagementHub;



