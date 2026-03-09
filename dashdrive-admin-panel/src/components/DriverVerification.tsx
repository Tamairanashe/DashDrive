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
  Checkbox,
  Radio,
  notification
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
  SafetyOutlined,
  BankOutlined,
  EyeOutlined
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
  plate?: string;
  color: string;
  year: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Resubmission Requested' | 'Expired' | 'Reviewing';
  docs: {
    [key: string]: {
      url: string;
      expiry: string;
      status: string;
      rejectionReason?: string;
    }
  };
  bankInfo: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    accountType: string;
    bankCode: string;
  };
  fraudFlags?: string[];
}

export const DriverVerification: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [isResubmitVisible, setIsResubmitVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [customComment, setCustomComment] = useState('');

  const [apps, setApps] = useState<Application[]>([
    {
      id: 'DRV-1029',
      name: 'John Makoni',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      phone: '+263 771 222 333',
      email: 'john.m@dashdrive.com',
      city: 'Harare',
      appliedDate: '2026-03-09 09:22',
      status: 'Pending',
      vehicleType: 'Economy Car',
      brand: 'Honda',
      model: 'Fit',
      plate: 'AB-123',
      color: 'Midnight Blue',
      year: '2022',
      docs: {
        license: { url: 'https://picsum.photos/seed/license1/800/600', expiry: '2028-10-15', status: 'Verified' },
        idCard: { url: 'https://picsum.photos/seed/id1/800/600', expiry: '2030-01-01', status: 'Verified' },
        registration: { url: 'https://picsum.photos/seed/reg1/800/600', expiry: '2026-05-12', status: 'Pending' },
        regBook: { url: 'https://picsum.photos/seed/book1/800/600', expiry: 'N/A', status: 'Verified' },
        residency: { url: 'https://picsum.photos/seed/res1/800/600', expiry: '2025-06-01', status: 'Verified' },
      },
      bankInfo: {
        bankName: 'Steward Bank',
        accountName: 'John Makoni',
        accountNumber: '1002233445',
        accountType: 'Current',
        bankCode: 'SB-044'
      },
      fraudFlags: ['Multiple vehicles linked']
    },
    {
      id: 'DRV-1030',
      name: 'Sarah Mulenga',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      phone: '+260 962 888 111',
      email: 's.mulenga@dashdrive.zm',
      city: 'Lusaka',
      appliedDate: '2026-03-09 10:45',
      status: 'Reviewing',
      vehicleType: 'Executive',
      brand: 'Mercedes',
      model: 'C-Class',
      plate: 'LU-4455',
      color: 'Silver',
      year: '2021',
      docs: {
        license: { url: 'https://picsum.photos/seed/license2/800/600', expiry: '2024-04-20', status: 'Expiring Soon' },
        idCard: { url: 'https://picsum.photos/seed/id2/800/600', expiry: '2029-12-31', status: 'Verified' },
        registration: { url: 'https://picsum.photos/seed/reg2/800/600', expiry: '2025-11-30', status: 'Verified' },
        regBook: { url: 'https://picsum.photos/seed/book2/800/600', expiry: 'N/A', status: 'Verified' },
        residency: { url: 'https://picsum.photos/seed/res2/800/600', expiry: '2025-12-01', status: 'Verified' },
      },
      bankInfo: {
        bankName: 'EcoCash Save',
        accountName: 'Sarah Mulenga',
        accountNumber: '260962888111',
        accountType: 'Mobile Money',
        bankCode: 'EC-001'
      }
    }
  ]);

  const handleApprove = () => {
    notification.success({ message: 'Application Approved', description: 'Driver has been notified of their successful verification.' });
    setIsModalVisible(false); // Changed from setIsReviewVisible to setIsModalVisible
  };

  const handleDownload = (docName: string, url: string) => {
    notification.info({ 
      message: 'Processing Download', 
      description: `Downloading ${docName}. The file will be available shortly.` 
    });
    // Simulation: window.open(url, '_blank');
  };

  const reasonSuggestions: Record<string, string> = {
    "Image is blurry or unreadable": "Please ensure the camera is focused and all four corners of the document are visible. Avoid using a flash if it causes glare.",
    "Identification document has expired": "Please upload a current, valid version of this document. We cannot accept expired credentials.",
    "Details do not match profile information": "The name or ID number on the document does not match your DashDrive profile. Please ensure you are uploading your own documents.",
    "Incorrect document type uploaded": "You appear to have uploaded a different document. Please upload the specific file requested in this category.",
    "Missing critical information (e.g. signature)": "Important sections of the document are cut off or missing. Please ensure the entire page is visible including signatures and stamps."
  };

  const handleReasonChange = (reason: string) => {
    setRejectionReason(reason);
    if (reasonSuggestions[reason]) {
      setCustomComment(reasonSuggestions[reason]);
    }
  };

  const handleInvalidate = () => {
    if (!rejectionReason) {
      message.error('Please select a rejection reason.');
      return;
    }
    notification.warning({ 
      message: 'Resubmission Requested', 
      description: `Request for "${selectedDoc.title}" sent. Reason: ${rejectionReason}${customComment ? ` - Note: ${customComment}` : ''}` 
    });

    // Update state to reflect rejection
    if (selectedApp) {
      const updatedApps = apps.map(app => {
        if (app.id === selectedApp.id) {
          const updatedDocs = { ...app.docs };
          // Find the key in docs that matches selectedDoc.info.url (as a simple mock match)
          Object.keys(updatedDocs).forEach(key => {
            const doc = updatedDocs[key];
            if (doc.url === selectedDoc.info.url) {
              updatedDocs[key] = {
                ...doc,
                status: 'Rejected',
                rejectionReason: `${rejectionReason}${customComment ? ` (${customComment})` : ''}`
              };
            }
          });
          return { ...app, docs: updatedDocs, status: 'Resubmission Requested' as const };
        }
        return app;
      }) as Application[];
      setApps(updatedApps);
      // Sync selected app
      const syncApp = updatedApps.find(a => a.id === selectedApp.id);
      if (syncApp) setSelectedApp(syncApp);
    }

    setIsResubmitVisible(false);
    setRejectionReason('');
    setCustomComment('');
  };

  const handleAction = (status: string) => {
    if (status === 'Approved') {
      setIsSuccessVisible(true);
      handleApprove();
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
      case 'Reviewing': return <Tag color="processing" icon={<ReloadOutlined />}>Reviewing</Tag>; // Added 'Reviewing'
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
          <Tooltip title="Passport/ID"><Badge status="success" /></Tooltip>
          <Tooltip title="Residence"><Badge status="success" /></Tooltip>
          <Tooltip title="Vehicle Pic"><Badge status="success" /></Tooltip>
          <Tooltip title="Reg Book"><Badge status="warning" /></Tooltip>
          <Tooltip title="Bank Info"><Badge status="success" /></Tooltip>
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
            <Statistic 
              title="Pending Verification" 
              value={apps.filter(a => a.status === 'Pending' || a.status === 'Reviewing' || a.status === 'Under Review' || a.status === 'Resubmission Requested').length} 
              valueStyle={{ color: '#faad14' }} 
              prefix={<ClockCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: '20px' }}>
            <Statistic 
              title="Approved Drivers" 
              value={1250 + apps.filter(a => a.status === 'Approved').length} 
              valueStyle={{ color: '#52c41a' }} 
              prefix={<CheckCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: '20px' }}>
            <Statistic 
              title="Rejected Drivers" 
              value={12 + apps.filter(a => a.status === 'Rejected').length} 
              valueStyle={{ color: '#ff4d4f' }} 
              prefix={<CloseCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: '20px' }}>
            <Statistic 
              title="Security Alerts" 
              value={apps.some(a => a.fraudFlags && a.fraudFlags.length > 0) ? 1 : 0} 
              valueStyle={{ color: '#cf1322' }} 
              prefix={<WarningOutlined />} 
            />
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
          dataSource={apps.filter(app => {
            const matchesSearch = app.name.toLowerCase().includes(searchText.toLowerCase()) || app.id.includes(searchText);
            const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
            return matchesSearch && matchesStatus;
          })}
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
                  <Descriptions.Item label="Color">{selectedApp.color}</Descriptions.Item>
                  <Descriptions.Item label="Year">{selectedApp.year}</Descriptions.Item>
                </Descriptions>
                <Divider style={{ margin: '12px 0' }} />
                <Title level={5}><BankOutlined /> Bank Details</Title>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Bank">{selectedApp.bankInfo.bankName}</Descriptions.Item>
                  <Descriptions.Item label="Account">{selectedApp.bankInfo.accountNumber}</Descriptions.Item>
                  <Descriptions.Item label="Type">{selectedApp.bankInfo.accountType}</Descriptions.Item>
                  <Descriptions.Item label="Code">{selectedApp.bankInfo.bankCode}</Descriptions.Item>
                  <Descriptions.Item label="Holder">{selectedApp.bankInfo.accountName}</Descriptions.Item>
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
                  <Checkbox>Identification (ID/Passport) is valid</Checkbox>
                  <Checkbox>Proof of Residency verified</Checkbox>
                  <Checkbox>Vehicle Registration Book verified</Checkbox>
                  <Checkbox>Bank Account details confirmed</Checkbox>
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
                    { title: 'Valid Driver\'s License', info: selectedApp.docs.license },
                    { title: 'Identification (ID/Passport)', info: selectedApp.docs.idCard },
                    { title: 'Profile Photo Holding ID', info: selectedApp.docs.idCard }, // Reusing URL for mock
                    { title: 'Proof of Residency', info: selectedApp.docs.residency },
                    { title: 'Vehicle Picture', info: selectedApp.docs.registration },
                    { title: 'Vehicle Registration Book', info: selectedApp.docs.regBook }
                  ]}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button 
                          key="zoom" 
                          size="small" 
                          icon={<ZoomInOutlined />} 
                          onClick={() => {
                            setPreviewImage(item.info.url);
                            setPreviewVisible(true);
                          }}
                        />,
                        <Button 
                          key="dl" 
                          size="small" 
                          icon={<DownloadOutlined />} 
                          onClick={() => handleDownload(item.title, item.info.url)}
                        />,
                        <Button 
                          key="inv" 
                          size="small" 
                          danger 
                          icon={<CloseCircleOutlined />}
                          onClick={() => {
                            setSelectedDoc(item);
                            setIsResubmitVisible(true);
                          }}
                        >
                          Resubmit
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Image
                            src={item.info.url}
                            width={64}
                            height={64}
                            style={{ objectFit: 'cover', borderRadius: 4 }}
                            preview={{
                              visible: previewVisible && previewImage === item.info.url,
                              onVisibleChange: (visible) => setPreviewVisible(visible),
                              mask: <EyeOutlined />
                            }}
                          />
                        }
                        title={
                          <div style={{ width: '100%' }}>
                            <Space wrap align="center">
                              <Text strong style={{ fontSize: 14 }}>{item.title}</Text>
                              <Badge status={item.info.status === 'Verified' ? 'success' : item.info.status === 'Rejected' ? 'error' : 'warning'} />
                            </Space>
                            {item.info.status === 'Rejected' && (
                              <div style={{ marginTop: 4 }}>
                                <Tag color="error" style={{ fontSize: 10, margin: 0 }}>
                                  <ExclamationCircleOutlined /> REJECTED: {item.info.rejectionReason}
                                </Tag>
                              </div>
                            )}
                          </div>
                        }
                        description={
                          <Space direction="vertical" size={2} style={{ marginTop: 4 }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              <ClockCircleOutlined /> Uploaded: 2 hours ago
                            </Text>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              <IdcardOutlined /> Expiry: {item.info.expiry}
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

      {/* Resubmission Request Modal */}
      <Modal
        title={<Space><CloseCircleOutlined style={{ color: '#ef4444' }} /><span>Invalidate Document & Request Resubmission</span></Space>}
        open={isResubmitVisible}
        onCancel={() => setIsResubmitVisible(false)}
        onOk={handleInvalidate}
        okText="Confirm Invalidation"
        okButtonProps={{ danger: true, disabled: !rejectionReason }}
        cancelText="Keep Document"
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">Document to invalidate:</Text><br />
          <Text strong style={{ fontSize: 16 }}>{selectedDoc?.title}</Text>
        </div>
        
        <Text strong>Select Rejection Reason:</Text>
        <div style={{ marginTop: 12 }}>
          <Radio.Group value={rejectionReason} onChange={(e) => handleReasonChange(e.target.value)} style={{ width: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio value="Image is blurry or unreadable">Image is blurry or unreadable</Radio>
              <Radio value="Identification document has expired">Identification document has expired</Radio>
              <Radio value="Details do not match profile information">Details do not match profile information</Radio>
              <Radio value="Incorrect document type uploaded">Incorrect document type uploaded</Radio>
              <Radio value="Missing critical information (e.g. signature)">Missing critical information</Radio>
            </Space>
          </Radio.Group>
          
          <div style={{ marginTop: 20 }}>
            <Row justify="space-between" style={{ width: '100%', marginBottom: 8 }}>
              <Col><Text strong>Instructions for Driver:</Text></Col>
              <Col>{rejectionReason && <Tag color="blue" style={{ fontSize: 10 }}>Auto-Suggested for {rejectionReason.split(' ')[0]}...</Tag>}</Col>
            </Row>
            <Input.TextArea 
              rows={4} 
              placeholder="Provide specific instructions to help the driver get it right..." 
              style={{ marginTop: 8, borderRadius: 12, border: '1px solid #d9d9d9' }}
              value={customComment}
              onChange={(e) => setCustomComment(e.target.value)}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <Alert 
              type="info" 
              showIcon 
              message={<Text style={{ fontSize: 11 }}>An automated notification will be sent to the driver requesting a re-upload of this specific document with your reasons included.</Text>}
            />
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
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
