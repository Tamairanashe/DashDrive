import React, { useState } from 'react';
import { 
  Table, Tag, Space, Button, Input, Card, Typography, Tabs, 
  Row, Col, Statistic, Avatar, Tooltip, Badge, Dropdown, 
  Drawer, Form, Select, DatePicker, List, Rate, Empty, Divider,
  Modal, InputNumber, Radio, message as antdMessage, Descriptions, Progress
} from 'antd';
import { 
  SearchOutlined, PlusOutlined, UserOutlined, FileTextOutlined,
  SafetyCertificateOutlined, WalletOutlined, HistoryOutlined,
  StarOutlined, WarningOutlined, StopOutlined, BarChartOutlined,
  MoreOutlined, CheckCircleOutlined, CloseCircleOutlined,
  EnvironmentOutlined, CarOutlined, PhoneOutlined, MailOutlined,
  CloudUploadOutlined, MessageOutlined, BellOutlined, SafetyOutlined,
  AuditOutlined, SwapOutlined, ThunderboltOutlined, RocketOutlined,
  DollarOutlined, LockOutlined, UnlockOutlined, BankOutlined,
  PieChartOutlined, TeamOutlined, LineChartOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface FleetOperatorHubProps {
  initialTab?: string;
}

export const FleetOperatorHub: React.FC<FleetOperatorHubProps> = ({ initialTab = '1' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState<any>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [form] = Form.useForm();

  const [fleets, setFleets] = useState([
    { 
      id: 'FL-100', companyName: 'City Taxi Co.', vehicles: 45, drivers: 60, city: 'Harare', status: 'Active',
      contactPerson: 'James Muranda', phone: '+263 771 222 333', email: 'ops@citytaxi.com',
      tripsCompleted: 24500, revenue: 185000.00, commission: 37000.00, netPayout: 148000.00,
      joinedDate: '10 Jan 2023'
    },
    { 
      id: 'FL-105', companyName: 'Express Logistics', vehicles: 12, drivers: 15, city: 'Bulawayo', status: 'Active',
      contactPerson: 'Elena Rivera', phone: '+263 782 111 444', email: 'elena@expresslog.com',
      tripsCompleted: 8200, revenue: 42000.00, commission: 8400.00, netPayout: 33600.00,
      joinedDate: '15 Mar 2023'
    }
  ]);

  const ListTab = () => (
    <div style={{ marginTop: 20 }}>
      <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
        <Row gutter={16} style={{ marginBottom: 20 }} align="middle">
          <Col span={8}>
            <Input 
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} 
              placeholder="Search by company name, ID or contact..." 
            />
          </Col>
          <Col span={4}>
            <Select placeholder="City" style={{ width: '100%' }} allowClear>
              <Select.Option value="Harare">Harare</Select.Option>
              <Select.Option value="Bulawayo">Bulawayo</Select.Option>
            </Select>
          </Col>
          <Col span={8} style={{ textAlign: 'right', offset: 4 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsDrawerOpen(true)}>Add Fleet Operator</Button>
          </Col>
        </Row>
        <Table 
          dataSource={fleets}
          rowKey="id"
          columns={[
            { title: 'Fleet ID', dataIndex: 'id', key: 'id' },
            { title: 'Company Name', dataIndex: 'companyName', key: 'companyName', render: (t) => <Text strong>{t}</Text> },
            { title: 'Vehicles', dataIndex: 'vehicles', key: 'vehicles', render: (v) => <Tag color="blue" icon={<CarOutlined />}>{v}</Tag> },
            { title: 'Drivers', dataIndex: 'drivers', key: 'drivers', render: (d) => <Tag color="green" icon={<TeamOutlined />}>{d}</Tag> },
            { title: 'City', dataIndex: 'city', key: 'city' },
            { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color="success">{s}</Tag> },
            {
              title: 'Actions',
              key: 'actions',
              align: 'right',
              render: (_, record) => (
                <Space>
                  <Button size="small" onClick={() => { setSelectedFleet(record); setIsDetailDrawerOpen(true); }}>View</Button>
                  <Button size="small" icon={<MoreOutlined />} />
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
            { id: 'FR-202', name: 'Zim-Ride Fleets', contact: 'Taurai M', vehicles: 20, status: 'Pending', date: 'Yesterday' }
          ]}
          columns={[
            { title: 'Request ID', dataIndex: 'id', key: 'id' },
            { title: 'Company Name', dataIndex: 'name', key: 'name' },
            { title: 'Proposed Vehicles', dataIndex: 'vehicles', key: 'vehicles' },
            { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Badge status="processing" text={s} /> },
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

  const FinancialsTab = () => (
    <div style={{ marginTop: 20 }}>
      <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
        <Table 
          dataSource={fleets}
          rowKey="id"
          columns={[
            { title: 'Fleet Operator', dataIndex: 'companyName', key: 'companyName', render: (t) => <Text strong>{t}</Text> },
            { title: 'Total Trips', dataIndex: 'tripsCompleted', key: 'trips', render: (t) => t.toLocaleString() },
            { title: 'Gross Revenue', dataIndex: 'revenue', key: 'revenue', render: (r) => `$${r.toLocaleString()}` },
            { title: 'DashDrive Comm.', dataIndex: 'commission', key: 'comm', render: (c) => `$${c.toLocaleString()}` },
            { title: 'Fleet Payout', dataIndex: 'netPayout', key: 'payout', render: (p) => <Text strong style={{ color: '#10b981' }}>${p.toLocaleString()}</Text> },
            { title: 'Status', key: 'status', render: () => <Tag color="blue">Processing</Tag> },
            { title: 'Action', key: 'action', render: () => <Button size="small" icon={<WalletOutlined />}>Settle</Button> }
          ]}
        />
      </Card>
    </div>
  );

  const AnalyticsTab = () => (
    <div style={{ marginTop: 20 }}>
      <Row gutter={24}>
        <Col span={12}>
          <Card title="Fleet Utilization Rate" className="shadow-sm">
             <Progress type="dashboard" percent={88} strokeColor="#10b981" />
             <div style={{ marginTop: 12 }}>
                <Text type="secondary">88% of fleet vehicles are currently active on trips</Text>
             </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Revenue Growth (MoM)" className="shadow-sm">
             <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: 12 }}>
                <LineChartOutlined style={{ fontSize: 48, color: '#3b82f6' }} />
                <Text style={{ marginLeft: 12 }}>+18% Growth this month</Text>
             </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const items = [
    { key: '1', label: <Space><TeamOutlined /> Fleet List</Space>, children: <ListTab /> },
    { key: '2', label: <Space><PlusOutlined /> Requests</Space>, children: <RequestsTab /> },
    { key: '3', label: <Space><CarOutlined /> Fleet Vehicles</Space>, children: <div style={{ padding: 20 }}>Centralized Fleet Vehicles List...</div> },
    { key: '4', label: <Space><UserOutlined /> Fleet Drivers</Space>, children: <div style={{ padding: 20 }}>Centralized Fleet Drivers List...</div> },
    { key: '5', label: <Space><WalletOutlined /> Fleet Earnings</Space>, children: <FinancialsTab /> },
    { key: '6', label: <Space><BarChartOutlined /> Analytics</Space>, children: <AnalyticsTab /> },
  ];

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0, letterSpacing: -1 }}>Fleet Operator Hub</Title>
          <Text type="secondary">Manage enterprise partners, company-owned vehicles, and large-scale operations</Text>
        </div>
        <Space>
          <Button icon={<FileTextOutlined />}>Enterprise Analytics</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsDrawerOpen(true)}>Register Fleet</Button>
        </Space>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        items={items}
        type="line"
      />

      <Drawer
        title="Fleet 360° Profile"
        width={800}
        onClose={() => setIsDetailDrawerOpen(false)}
        open={isDetailDrawerOpen}
      >
        {selectedFleet && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
              <div style={{ width: 64, height: 64, background: '#f1f5f9', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BankOutlined style={{ fontSize: 32, color: '#0f172a' }} />
              </div>
              <div>
                <Title level={3} style={{ margin: 0 }}>{selectedFleet.companyName}</Title>
                <Space>
                  <Tag color="blue">{selectedFleet.city}</Tag>
                  <Text type="secondary">ID: {selectedFleet.id}</Text>
                </Space>
              </div>
            </div>

            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card size="small" title="Vehicles" style={{ textAlign: 'center' }}>
                  <Text style={{ fontSize: 24, fontWeight: 700 }}>{selectedFleet.vehicles}</Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" title="Drivers" style={{ textAlign: 'center' }}>
                  <Text style={{ fontSize: 24, fontWeight: 700 }}>{selectedFleet.drivers}</Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" title="Trips" style={{ textAlign: 'center' }}>
                  <Text style={{ fontSize: 24, fontWeight: 700 }}>{selectedFleet.tripsCompleted.toLocaleString()}</Text>
                </Card>
              </Col>
            </Row>

            <Descriptions title="Company Details" bordered column={1} size="small">
              <Descriptions.Item label="Contact Person">{selectedFleet.contactPerson}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedFleet.phone}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedFleet.email}</Descriptions.Item>
              <Descriptions.Item label="Registration Info">ZIM-CORP-2024-8891</Descriptions.Item>
            </Descriptions>

            <Divider orientation={"left" as any}>Operational Actions</Divider>
            <Row gutter={16}>
               <Col span={12}><Button block icon={<CarOutlined />}>Manage Vehicles</Button></Col>
               <Col span={12}><Button block icon={<TeamOutlined />}>Manage Drivers</Button></Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 12 }}>
               <Col span={12}><Button block icon={<DollarOutlined />}>View Earnings</Button></Col>
               <Col span={12}><Button block danger icon={<StopOutlined />}>Suspend Account</Button></Col>
            </Row>
          </div>
        )}
      </Drawer>

      <Drawer
        title="Register New Fleet Operator"
        width={600}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      >
        <Form layout="vertical">
          <Form.Item label="Company Name" rules={[{ required: true }]}>
            <Input placeholder="Legal company name" />
          </Form.Item>
          <Form.Item label="Business Reg Number">
            <Input placeholder="Registration number" />
          </Form.Item>
          <Divider orientation={"left" as any}>Contact Details</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Contact Person" rules={[{ required: true }]}>
                <Input placeholder="Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Phone" rules={[{ required: true }]}>
                <Input placeholder="Phone number" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Email" rules={[{ required: true }]}>
            <Input placeholder="Email address" />
          </Form.Item>
          <Form.Item label="Headquarters City" rules={[{ required: true }]}>
             <Select placeholder="Select city">
                <Select.Option value="Harare">Harare</Select.Option>
                <Select.Option value="Bulawayo">Bulawayo</Select.Option>
             </Select>
          </Form.Item>
        </Form>
        <div style={{ position: 'absolute', right: 0, bottom: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'right' }}>
          <Button onClick={() => setIsDrawerOpen(false)} style={{ marginRight: 8 }}>Cancel</Button>
          <Button type="primary">Submit Registration</Button>
        </div>
      </Drawer>
    </div>
  );
};


