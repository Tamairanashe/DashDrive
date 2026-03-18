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
  Progress,
  Rate,
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
  EditOutlined, 
  MoreOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  CarOutlined,
  DownloadOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { DriverDetails } from '../components/DriverDetails';
import { StateWrapper } from '../components/common/StateWrapper';

const { Title, Text } = Typography;

export const DriverListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [editingDriver, setEditingDriver] = useState<any>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats = [
    { title: 'Total Drivers', value: '12,405', icon: <UserOutlined />, color: '#10b981' },
    { title: 'Live On-Trip', value: '3,120', icon: <CarOutlined />, color: '#3b82f6' },
    { title: 'Active/Available', value: '1,840', icon: <SafetyCertificateOutlined />, color: '#10b981' },
    { title: 'Offline', value: '7,445', icon: <UserOutlined />, color: '#94a3b8' },
  ];

  // Mock Data with Timestamps
  const allDrivers = [
    { id: 'D-4001', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', status: 'On Trip', rating: 4.9, vehicle: 'Toyota Prius', tripProgress: 65, eta: '12 mins', destination: 'Central Park', createdAt: '2025-10-12T14:30:00Z', updatedAt: '2026-03-18T08:22:15Z' },
    { id: 'D-4002', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'Active', rating: 4.8, vehicle: 'Honda Civic', shiftTime: '4h 20m', zone: 'Downtown', createdAt: '2025-11-05T09:12:00Z', updatedAt: '2026-03-17T11:45:00Z' },
    { id: 'D-4003', name: 'Marco Rossi', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'Offline', rating: 4.7, vehicle: 'Motorcycle', lastSeen: '2h ago', preferredZone: 'North End', createdAt: '2025-12-01T20:10:00Z', updatedAt: '2026-03-18T06:30:00Z' },
    { id: 'D-4004', name: 'Elena Petrova', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', status: 'Compliance Alert', rating: 4.9, vehicle: 'Tesla Model 3', alertType: 'Insurance Expiring', expiry: 'In 3 days', createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-03-18T09:45:00Z' },
  ];

  const handleEditDriver = (record: any) => {
    setEditingDriver(record);
    form.setFieldsValue(record);
    setIsDrawerVisible(true);
  };

  const handleSaveDriver = (values: any) => {
    setLoading(true);
    message.loading(editingDriver ? 'Updating driver...' : 'Onboarding driver...', 1).then(() => {
      message.success(`Driver ${editingDriver ? 'updated' : 'onboarded'} successfully`);
      setIsDrawerVisible(false);
      setEditingDriver(null);
      form.resetFields();
      setLoading(false);
    });
  };

  const getColumns = () => {
    const baseColumns = [
      {
        title: 'Driver Info',
        key: 'info',
        render: (_: any, record: any) => (
          <Space>
            <Avatar src={record.avatar} icon={<UserOutlined />} />
            <div>
              <Text strong style={{ fontSize: 13 }}>{record.name}</Text>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>ID: {record.id} • {record.vehicle}</div>
            </div>
          </Space>
        ),
      }
    ];

    if (activeTab === 'On Trip') {
      return [
        ...baseColumns,
        {
          title: 'Current Trip',
          key: 'trip',
          render: (record: any) => (
            <div style={{ width: 150 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 11 }}><EnvironmentOutlined /> {record.destination}</Text>
                <Text strong style={{ fontSize: 11, color: '#3b82f6' }}>{record.eta}</Text>
              </div>
              <Progress percent={record.tripProgress} size="small" strokeColor="#3b82f6" />
            </div>
          )
        },
        { title: 'Status', key: 'status', render: () => <Badge color="green" text="In Progress" /> },
        { title: 'Actions', key: 'actions', render: (_: any, record: any) => <Button size="small" onClick={() => setSelectedDriverId(record.id)}>Track Live</Button> }
      ];
    }

    if (activeTab === 'Active') {
      return [
        ...baseColumns,
        { title: 'Shift Duration', dataIndex: 'shiftTime', key: 'shift', render: (t: string) => <Space><ClockCircleOutlined /> {t}</Space> },
        { title: 'Current Zone', dataIndex: 'zone', key: 'zone', render: (z: string) => <Tag color="blue">{z}</Tag> },
        { title: 'Load', key: 'load', render: () => <Badge status="processing" text="Available" /> },
        { title: 'Actions', key: 'actions', render: (_: any, record: any) => <Button size="small" onClick={() => setSelectedDriverId(record.id)}>View Profile</Button> }
      ];
    }

    if (activeTab === 'Offline') {
      return [
        ...baseColumns,
        { title: 'Last Seen', dataIndex: 'lastSeen', key: 'seen' },
        { title: 'Preferred Zone', dataIndex: 'preferredZone', key: 'prefZone' },
        { title: 'Status', key: 'status', render: () => <Badge color="default" text="Offline" /> },
        { title: 'Actions', key: 'actions', render: (_: any, record: any) => <Button size="small" onClick={() => setSelectedDriverId(record.id)}>Review Profile</Button> }
      ];
    }

    if (activeTab === 'Compliance') {
      return [
        ...baseColumns,
        { 
          title: 'Issue Type', 
          key: 'issue', 
          render: (record: any) => (
            <Space>
              <WarningOutlined style={{ color: '#ff4d4f' }} />
              <Text type="danger" strong style={{ fontSize: 12 }}>{record.alertType}</Text>
            </Space>
          )
        },
        { title: 'Deadline', dataIndex: 'expiry', key: 'expiry', render: (e: string) => <Tag color="error">{e}</Tag> },
        { title: 'Actions', key: 'actions', render: (_: any, record: any) => <Button type="primary" danger size="small" onClick={() => setSelectedDriverId(record.id)}>Investigate</Button> }
      ];
    }

    return [
      ...baseColumns,
      {
        title: 'Rating',
        dataIndex: 'rating',
        key: 'rating',
        render: (r: number) => <Rate disabled defaultValue={r} style={{ fontSize: 12 }} />
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (s: string) => (
          <Tag color={s === 'On Trip' ? 'green' : s === 'Active' ? 'blue' : s === 'Offline' ? 'default' : 'red'}>
            {s}
          </Tag>
        )
      },
      {
         title: 'Governance',
         key: 'governance',
         render: (_: any, record: any) => (
           <Space direction="vertical" size={0}>
             <Text style={{ fontSize: 10, color: '#64748b' }}>Added: {new Date(record.createdAt).toLocaleDateString()}</Text>
             <Text style={{ fontSize: 10, color: '#64748b' }}>Sync: {new Date(record.updatedAt).toLocaleTimeString()}</Text>
           </Space>
         )
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: any) => (
          <Space>
            <Tooltip title="View Detailed Profile">
              <Button type="text" icon={<EyeOutlined />} onClick={() => setSelectedDriverId(record.id)} />
            </Tooltip>
            <Tooltip title="Edit Driver">
              <Button type="text" icon={<EditOutlined style={{ color: '#faad14' }} />} onClick={() => handleEditDriver(record)} />
            </Tooltip>
            <Button type="text" icon={<MoreOutlined />} />
          </Space>
        )
      }
    ];
  };

  const renderContent = () => {
    if (selectedDriverId) {
      return (
        <div className="animate-in fade-in duration-500">
          <DriverDetails 
            driverId={selectedDriverId} 
            onBack={() => setSelectedDriverId(null)} 
          />
        </div>
      );
    }

    const currentData = activeTab === 'All' ? allDrivers : allDrivers.filter(d => (activeTab === 'Compliance' ? d.status === 'Compliance Alert' : d.status === activeTab));

    return (
      <>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={4} style={{ margin: 0, letterSpacing: -0.5 }}>Fleet Command Center</Title>
            <Text type="secondary">Real-time operational overview of your network.</Text>
          </Col>
          <Col>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 500); }} />
              <Button icon={<DownloadOutlined />}>Report</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                setEditingDriver(null);
                form.resetFields();
                setIsDrawerVisible(true);
              }}>
                Manual Onboard
              </Button>
            </Space>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          {stats.map(stat => (
            <Col xs={24} sm={12} lg={6} key={stat.title}>
              <Card bordered={false} bodyStyle={{ padding: 20 }} className="shadow-sm">
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

        <Card bordered={false} bodyStyle={{ padding: 0 }} className="shadow-sm">
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              items={[
                { key: 'All', label: 'All Fleet' },
                { key: 'Active', label: 'Available Drivers' },
                { key: 'On Trip', label: 'Live Trips' },
                { key: 'Offline', label: 'Offline Fleet' },
                { key: 'Compliance', label: <Badge size="small" count={2} offset={[10, 0]}>Compliance Alerts</Badge> },
              ]}
              style={{ marginBottom: -16 }}
            />
            <Input
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Quick search..."
              style={{ width: 240, borderRadius: 8 }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
          <StateWrapper 
            loading={loading} 
            error={error} 
            isEmpty={currentData.length === 0}
            onRetry={() => { setLoading(true); setTimeout(() => setLoading(false), 500); }}
          >
            <Table 
              columns={getColumns()} 
              dataSource={currentData} 
              rowKey="id"
              pagination={{ 
                pageSize: 15,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} Drivers`
              }}
            />
          </StateWrapper>
        </Card>

        <Drawer
          title={editingDriver ? "Edit Driver" : "Onboard New Driver"}
          open={isDrawerVisible}
          onClose={() => setIsDrawerVisible(false)}
          width={450}
          extra={<Button type="primary" onClick={() => form.submit()} loading={loading}>Save</Button>}
          destroyOnClose
        >
          <Form form={form} layout="vertical" onFinish={handleSaveDriver}>
            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
              <Input placeholder="Ex: John Doe" />
            </Form.Item>
            <Form.Item name="vehicle" label="Vehicle" rules={[{ required: true }]}>
              <Input placeholder="Ex: Toyota Prius" />
            </Form.Item>
            <Form.Item name="status" label="Status" initialValue="Active">
              <Select>
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="On Trip">On Trip</Select.Option>
                <Select.Option value="Offline">Offline</Select.Option>
                <Select.Option value="Compliance Alert">Compliance Alert</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Onboarding Documents">
              <div style={{ border: '1px dashed #d9d9d9', padding: 16, borderRadius: 8, textAlign: 'center' }}>
                <PlusOutlined style={{ fontSize: 24, color: '#94a3b8' }} />
                <div style={{ marginTop: 8 }}>Upload License & Insurance</div>
              </div>
            </Form.Item>
          </Form>
        </Drawer>
      </>
    );
  };

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      {renderContent()}
    </div>
  );
};
