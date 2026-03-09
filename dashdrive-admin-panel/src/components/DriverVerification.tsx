import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Space, 
  Tag, 
  Badge, 
  Avatar, 
  Modal, 
  Image, 
  Descriptions,
  message,
  Empty,
  Result,
  Input,
  Select,
  Divider,
  Alert,
  Tooltip,
  List,
  Checkbox
} from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  FileSearchOutlined,
  IdcardOutlined,
  SolutionOutlined,
  CarOutlined,
  SafetyCertificateOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  ZoomInOutlined,
  SafetyOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface Application {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  city: string;
  appliedDate: string;
  vehicleType: string;
  brand: string;
  model: string;
  plate: string;
  color: string;
  year: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Resubmission Requested' | 'Expired';
  docs: {
    license: { url: string; expiry: string; status: string };
    idCard: { url: string; expiry: string; status: string };
    registration: { url: string; expiry: string; status: string };
  };
  fraudFlags?: string[];
}

export const DriverVerification: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const applications: Application[] = [
    {
      id: 'DRV-1023',
      name: 'John Makoni',
      avatar: 'https://i.pravatar.cc/150?u=john',
      phone: '+263 771 222 333',
      email: 'john.m@dashdrive.com',
      city: 'Harare',
      appliedDate: '2026-03-09 09:22',
      vehicleType: 'Economy Car',
      brand: 'Honda',
      model: 'Fit',
      plate: 'AB-123',
      color: 'Midnight Blue',
      year: '2022',
      status: 'Pending',
      docs: {
        license: { url: 'https://picsum.photos/seed/license1/800/600', expiry: '2028-10-15', status: 'Verified' },
        idCard: { url: 'https://picsum.photos/seed/id1/800/600', expiry: '2030-01-01', status: 'Verified' },
        registration: { url: 'https://picsum.photos/seed/reg1/800/600', expiry: '2026-05-12', status: 'Pending' }
      },
      fraudFlags: ['Multiple vehicles linked']
    },
    {
      id: 'DRV-1024',
      name: 'Sarah Mulenga',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      phone: '+260 962 888 111',
      email: 'sarah.m@dashdrive.com',
      city: 'Lusaka',
      appliedDate: '2026-03-09 10:15',
      vehicleType: 'Executive Sedan',
      brand: 'Toyota',
      model: 'Camry',
      plate: 'LU-4455',
      color: 'Silver',
      year: '2021',
      status: 'Under Review',
      docs: {
        license: { url: 'https://picsum.photos/seed/license2/800/600', expiry: '2024-04-20', status: 'Expiring Soon' },
        idCard: { url: 'https://picsum.photos/seed/id2/800/600', expiry: '2029-12-31', status: 'Verified' },
        registration: { url: 'https://picsum.photos/seed/reg2/800/600', expiry: '2025-11-30', status: 'Verified' }
      }
    }
  ];

  const handleAction = (status: string) => {
    if (status === 'Approved') {
      setIsSuccessVisible(true);
      setIsModalVisible(false);
    } else {
      message.info(`Application ${status.toLowerCase()}`);
      setIsModalVisible(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved': return <Tag color="success" icon={<CheckCircleOutlined />}>Approved</Tag>;
      case 'Rejected': return <Tag color="error" icon={<CloseCircleOutlined />}>Rejected</Tag>;
      case 'Pending': return <Tag color="warning" icon={<ClockCircleOutlined />}>Pending</Tag>;
      case 'Under Review': return <Tag color="processing" icon={<ReloadOutlined />}>Under Review</Tag>;
      case 'Resubmission Requested': return <Tag color="orange" icon={<ExclamationCircleOutlined />}>Resubmit</Tag>;
      case 'Expired': return <Tag color="default" icon={<WarningOutlined />}>Expired</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Driver ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text strong>{id}</Text>
    },
    {
      title: 'Driver Name',
      key: 'name',
      render: (record: Application) => (
        <Space>
          <Avatar src={record.avatar} />
          <div>
            <Text strong style={{ display: 'block' }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{record.phone}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city'
    },
    {
      title: 'Vehicle',
      key: 'vehicle',
      render: (record: Application) => (
        <Space direction="vertical" size={0}>
          <Tag color="blue" icon={<CarOutlined />}>{record.vehicleType}</Tag>
          <Text type="secondary" style={{ fontSize: 10 }}>{record.plate}</Text>
        </Space>
      )
    },
    {
      title: 'Docs Status',
      key: 'docs',
      render: () => (
        <Space size={4}>
          <Tooltip title="License"><Badge status="success" /></Tooltip>
          <Tooltip title="ID Card"><Badge status="success" /></Tooltip>
          <Tooltip title="Registration"><Badge status="warning" /></Tooltip>
        </Space>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => getStatusBadge(s)
    },
    {
      title: 'Submission',
      dataIndex: 'appliedDate',
      key: 'date',
      render: (d: string) => <Text type="secondary" style={{ fontSize: 12 }}>{d}</Text>
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: (record: Application) => (
        <Button 
          type="primary" 
          ghost 
          icon={<FileSearchOutlined />} 
          onClick={() => { setSelectedApp(record); setIsModalVisible(true); }}
        >
          Review
        </Button>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={4} style={{ margin: 0 }}>Driver Verification Dashboard</Title>
          <Text type="secondary">Process onboarding applications and maintain legal compliance.</Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />}>Refresh Data</Button>
            <Button type="primary" icon={<DownloadOutlined />}>Export Report</Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: '20px' }}>
            <Statistic title="Pending Verification" value={32} valueStyle={{ color: '#faad14' }} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: '20px' }}>
            <Statistic title="Approved Drivers" value={1250} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: '20px' }}>
            <Statistic title="Rejected Drivers" value={12} valueStyle={{ color: '#ff4d4f' }} prefix={<CloseCircleOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: '20px' }}>
            <Statistic title="Expiring Soon" value={7} valueStyle={{ color: '#fa8c16' }} prefix={<WarningOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} className="shadow-sm">
        <div style={{ marginBottom: 20, display: 'flex', gap: 16 }}>
          <Input 
            placeholder="Search Name, ID, Phone or Plate..." 
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            style={{ width: 300 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <Select defaultValue="All" style={{ width: 160 }} onChange={setStatusFilter}>
            <Option value="All">All Statuses</Option>
            <Option value="Pending">Pending Review</Option>
            <Option value="Under Review">Under Review</Option>
            <Option value="Approved">Approved</Option>
            <Option value="Expiring">Expiring Soon</Option>
          </Select>
          <Select defaultValue="All" style={{ width: 160 }}>
            <Option value="All">All Vehicle Types</Option>
            <Option value="Economy">Economy Car</Option>
            <Option value="Executive">Executive Sedan</Option>
            <Option value="Motorcycle">Motorcycle</Option>
          </Select>
          <Button icon={<FilterOutlined />}>Detailed Filters</Button>
        </div>

        <Table 
          columns={columns} 
          dataSource={applications} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: <Empty description="No applications found" /> }}
          className="verification-table"
        />
      </Card>

      <Modal
        title={
          <Space>
            <SafetyCertificateOutlined style={{ color: '#1677ff' }} />
            <span>Driver Verification Review: {selectedApp?.id}</span>
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={1000}
        footer={[
          <Button key="resubmit" icon={<ReloadOutlined />} onClick={() => handleAction('Resubmission Requested')}>Request Resubmission</Button>,
          <Button key="reject" danger icon={<CloseCircleOutlined />} onClick={() => handleAction('Rejected')}>Reject</Button>,
          <Button key="approve" type="primary" icon={<CheckCircleOutlined />} onClick={() => handleAction('Approved')}>Approve & Activate</Button>,
        ]}
      >
        {selectedApp && (
          <Row gutter={[24, 24]}>
            <Col span={10}>
              <Card size="small" title="Driver Identity" style={{ marginBottom: 20 }}>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Full Name"><Text strong>{selectedApp.name}</Text></Descriptions.Item>
                  <Descriptions.Item label="Phone Number">{selectedApp.phone}</Descriptions.Item>
                  <Descriptions.Item label="Email">{selectedApp.email}</Descriptions.Item>
                  <Descriptions.Item label="Registration City">{selectedApp.city}</Descriptions.Item>
                  <Descriptions.Item label="Applied Date">{selectedApp.appliedDate}</Descriptions.Item>
                </Descriptions>
                <Divider style={{ margin: '12px 0' }} />
                <Title level={5}><CarOutlined /> Vehicle Info</Title>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Type">{selectedApp.vehicleType}</Descriptions.Item>
                  <Descriptions.Item label="Model">{selectedApp.brand} {selectedApp.model}</Descriptions.Item>
                  <Descriptions.Item label="Plate">{selectedApp.plate}</Descriptions.Item>
                  <Descriptions.Item label="Color">{selectedApp.color}</Descriptions.Item>
                  <Descriptions.Item label="Year">{selectedApp.year}</Descriptions.Item>
                </Descriptions>
              </Card>

              {selectedApp.fraudFlags && selectedApp.fraudFlags.length > 0 && (
                <Alert
                  message="Compliance Alerts"
                  description={
                    <ul style={{ paddingLeft: 16, margin: 0 }}>
                      {selectedApp.fraudFlags.map((flag, idx) => <li key={idx}><Text type="danger">{flag}</Text></li>)}
                    </ul>
                  }
                  type="error"
                  showIcon
                  icon={<WarningOutlined />}
                  style={{ marginBottom: 20 }}
                />
              )}

              <Card size="small" title="Validation Checklist">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Checkbox>License number matches document</Checkbox>
                  <Checkbox>Full name matches National ID</Checkbox>
                  <Checkbox>Vehicle ownership verified</Checkbox>
                  <Checkbox>Expiry dates are valid</Checkbox>
                  <Checkbox>Photo consistency check (Face-Match)</Checkbox>
                </Space>
              </Card>
            </Col>
            
            <Col span={14}>
              <Card 
                size="small" 
                title={<Space><SolutionOutlined /> Document Evidence</Space>}
                extra={<Button size="small" icon={<DownloadOutlined />}>Download All</Button>}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    { title: 'Driver License', info: selectedApp.docs.license },
                    { title: 'National ID', info: selectedApp.docs.idCard },
                    { title: 'Vehicle Registration', info: selectedApp.docs.registration }
                  ]}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button key="zoom" size="small" icon={<ZoomInOutlined />} />,
                        <Button key="dl" size="small" icon={<DownloadOutlined />} />,
                        <Button key="inv" size="small" danger icon={<CloseCircleOutlined />}>Invalid</Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar shape="square" size={64} src={item.info.url} />}
                        title={
                          <Space>
                            <Text strong>{item.title}</Text>
                            <Badge status={item.info.status === 'Verified' ? 'success' : 'warning'} />
                          </Space>
                        }
                        description={
                          <Space direction="vertical" size={2}>
                            <Text type="secondary" style={{ fontSize: 11 }}>Uploaded: 2 hours ago</Text>
                            <Text type={item.info.status === 'Expiring Soon' ? 'danger' : 'secondary'} style={{ fontSize: 11 }}>
                              Expiry: {item.info.expiry}
                            </Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
              
              <Card size="small" title="Audit Log" style={{ marginTop: 20 }}>
                <div style={{ maxHeight: 100, overflowY: 'auto' }}>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>[09:22] Application Received - System</Text>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>[09:45] Auto-verification: 2/3 Docs Scanned - Bot</Text>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>[10:15] Manual Review Started - Sarah K.</Text>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </Modal>

      <Modal
        open={isSuccessVisible}
        onCancel={() => setIsSuccessVisible(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setIsSuccessVisible(false)}>Done</Button>
        ]}
      >
        <Result
          status="success"
          title="Driver Account Activated"
          subTitle={`${selectedApp?.name} is now verified and can accept orders on the DashDrive platform.`}
          extra={[
            <Button key="message">Notify Driver</Button>,
            <Button key="profile">Go to Profile</Button>
          ]}
        />
      </Modal>
    </div>
  );
};
