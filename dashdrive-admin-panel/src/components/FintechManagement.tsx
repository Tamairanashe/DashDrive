import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Typography, 
  Empty, 
  Badge,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Alert,
  Tooltip,
  Descriptions
} from 'antd';
import { 
  BarChartOutlined, 
  ShoppingOutlined, 
  FileTextOutlined, 
  ScanOutlined, 
  TeamOutlined, 
  WalletOutlined, 
  ThunderboltOutlined, 
  SafetyCertificateOutlined,
  LineChartOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  BankOutlined,
  DollarCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

// Shared Interfaces
interface FintechProduct {
  id: string;
  name: string;
  provider: string;
  type: string;
  eligibleUsers: string;
  status: 'Active' | 'Paused' | 'Disabled';
  applications: number;
  commission: string;
  deposit?: string;
  historyReq?: string;
  finScore?: string;
  driverTier?: string;
  behavior?: string;
  interest?: string;
}

interface FintechApplication {
  id: string;
  userId: string;
  userType: 'Driver' | 'Rider';
  product: string;
  provider: string;
  requestedAmount: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Disbursed';
  date: string;
}

export const FintechManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [form] = Form.useForm();
  
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FintechProduct | null>(null);
  const [editForm] = Form.useForm();

  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<FintechProduct | null>(null);
  
  const [products, setProducts] = useState<FintechProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Sync with Backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch('http://localhost:3001/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to sync products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const [applications, setApplications] = useState<FintechApplication[]>([
    { id: 'APP-8821', userId: 'DRV-223', userType: 'Driver', product: 'Vehicle Financing', provider: 'XYZ Bank', requestedAmount: '$4,000', status: 'Approved', date: '2026-03-08' },
    { id: 'APP-8822', userId: 'DRV-105', userType: 'Driver', product: 'Fuel Credit', provider: 'DashDrive Finance', requestedAmount: '$150', status: 'Disbursed', date: '2026-03-09' },
    { id: 'APP-8823', userId: 'RID-554', userType: 'Rider', product: 'Driver Microloans', provider: 'ABC Lenders', requestedAmount: '$500', status: 'Under Review', date: '2026-03-09' },
    { id: 'APP-8824', userId: 'DRV-502', userType: 'Driver', product: 'Vehicle Financing', provider: 'XYZ Bank', requestedAmount: '$2,500', status: 'Submitted', date: '2026-03-07' },
  ]);

  // 1. Overview Dashboard
  const renderOverview = () => (
    <div style={{ padding: '24px 0' }}>
      <Row gutter={[24, 24]}>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Total Fintech Users" value={3450} valueStyle={{ color: '#1677ff' }} prefix={<TeamOutlined />} />
            <Text type="success" style={{ fontSize: 12 }}><ArrowUpOutlined /> +12% this month</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Active Products" value={8} valueStyle={{ color: '#52c41a' }} prefix={<ShoppingOutlined />} />
            <Text type="secondary" style={{ fontSize: 12 }}>3 partners integrated</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Pending Applications" value={540} valueStyle={{ color: '#faad14' }} prefix={<FileTextOutlined />} />
            <Text type="warning" style={{ fontSize: 12 }}>24 require urgent review</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Fintech Revenue (MTD)" value={12800} precision={2} prefix="$" valueStyle={{ color: '#722ed1' }} />
            <Text type="success" style={{ fontSize: 12 }}><ArrowUpOutlined /> +8.5% revenue growth</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={16}>
          <Card title="Approval Velocity & Trends" bordered={false} className="shadow-sm" extra={<Button type="link">View Report</Button>}>
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: 8 }}>
              <Space direction="vertical" align="center">
                <LineChartOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Product Usage Analytics (Chart Placeholder)</Text>
              </Space>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Top Performing Products" bordered={false} className="shadow-sm">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { name: 'Vehicle Rent-to-Buy', perf: 85, color: '#1677ff' },
                { name: 'Earnings Advance', perf: 72, color: '#52c41a' },
                { name: 'Fuel Credit', perf: 45, color: '#faad14' },
                { name: 'Driver Insurance', perf: 30, color: '#ff4d4f' }
              ].map(item => (
                <div key={item.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text strong>{item.name}</Text>
                    <Text type="secondary">{item.perf}% Growth</Text>
                  </div>
                  <div style={{ width: '100%', height: 6, background: '#f0f0f0', borderRadius: 3 }}>
                    <div style={{ width: `${item.perf}%`, height: '100%', background: item.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 2. Financial Products
  const renderProducts = () => {
    const columns = [
      {
        title: 'Product Name',
        dataIndex: 'name',
        render: (text: string) => <Text strong>{text}</Text>,
      },
      { title: 'Provider', dataIndex: 'provider' },
      { 
        title: 'Type', 
        dataIndex: 'type',
        render: (type: string) => (
          <Tag color={type === 'Loan' ? 'blue' : type === 'Insurance' ? 'purple' : 'cyan'}>{type}</Tag>
        )
      },
      { title: 'Eligible Users', dataIndex: 'eligibleUsers', render: (text: string) => <Tag color={text.includes('&') ? 'geekblue' : 'blue'}>{text}</Tag> },
      { 
        title: 'Rent-to-Buy Req.', 
        dataIndex: 'historyReq',
        render: (text: string, record: any) => record.type === 'Financing' ? (
          <Space direction="vertical" size={0}>
            <Tag color="orange">Deposit: {record.deposit}</Tag>
            <Tag color="purple" style={{ marginTop: 4 }}>History: {text || '6m+'}</Tag>
          </Space>
        ) : <Text type="secondary">-</Text>
      },
      { 
        title: 'Interest Rate', 
        dataIndex: 'interest',
        render: (text: string) => text ? <Text type="danger">{text}</Text> : <Text type="secondary">N/A</Text>
      },
      { 
        title: 'Status', 
        dataIndex: 'status',
        render: (status: string) => (
          <Badge status={status === 'Active' ? 'success' : status === 'Paused' ? 'warning' : 'default'} text={status} />
        )
      },
      { title: 'Apps', dataIndex: 'applications', sorter: (a: any, b: any) => a.applications - b.applications },
      { title: 'Commission', dataIndex: 'commission' },
      {
        title: 'Actions',
        align: 'right' as const,
        render: (_, record: FintechProduct) => (
          <Space>
            <Button size="small" onClick={() => {
              setEditingProduct(record);
              editForm.setFieldsValue({
                name: record.name,
                type: record.type,
                users: record.eligibleUsers.toLowerCase().includes('rider') ? ['drivers', 'riders'] : ['drivers'],
                deposit: record.deposit ? parseInt(record.deposit) : undefined,
                history: record.historyReq,
                finScore: record.finScore,
                tier: record.driverTier ? record.driverTier.split('/') : undefined,
                behavior: record.behavior,
                interest: record.interest ? parseFloat(record.interest) : undefined,
                comm: record.commission,
              });
              setIsEditModalVisible(true);
            }}>Edit</Button>
            <Button size="small" type="primary" ghost onClick={() => {
              setViewingProduct(record);
              setIsDetailsModalVisible(true);
            }}>Details</Button>
          </Space>
        ),
      },
    ];

    return (
      <div style={{ padding: '24px 0' }}>
        <Row style={{ marginBottom: 16 }}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>Financial Products</Title>
            <Text type="secondary">Manage all financial offers available to DashDrive users.</Text>
          </Col>
        </Row>

        <Tabs 
          defaultActiveKey="all" 
          tabBarExtraContent={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsProductModalVisible(true)}>
              Create New Product
            </Button>
          }
          items={[
            {
              key: 'all',
              label: 'All Products',
              children: <Table columns={columns} dataSource={products} loading={loadingProducts} rowKey="id" pagination={{ pageSize: 8 }} className="shadow-sm" scroll={{ x: 1000 }} />
            },
            {
              key: 'wallets',
              label: 'DashWallet & P2P',
              children: <div style={{ padding: '20px 0' }}><Statistic title="Active DashWallets" value={1420} prefix={<WalletOutlined />} /></div>
            },
            {
              key: 'transfers',
              label: 'Global Transfers',
              children: <div style={{ padding: '20px 0' }}><Statistic title="Daily Transfer Volume" value={12400.50} precision={2} prefix="$" /></div>
            },
            {
              key: 'bills',
              label: 'Bill Payments',
              children: <div style={{ padding: '20px 0' }}><Statistic title="Utility Merchants" value={24} prefix={<ThunderboltOutlined />} /></div>
            },
            {
              key: 'loans',
              label: 'Loans & Financing',
              children: <Table columns={columns} dataSource={products.filter(p => ['Loan', 'Financing', 'Credit'].includes(p.type))} rowKey="id" pagination={{ pageSize: 8 }} className="shadow-sm" scroll={{ x: 1000 }} />
            },
            {
              key: 'insurance',
              label: 'Insurance Products',
              children: <Table columns={columns} dataSource={products.filter(p => p.type === 'Insurance')} rowKey="id" pagination={{ pageSize: 8 }} className="shadow-sm" scroll={{ x: 1000 }} />
            }
          ]}
        />

        <Modal
          title="Create New Financial Product"
          open={isProductModalVisible}
          onCancel={() => setIsProductModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form 
            form={form}
            layout="vertical" 
            onFinish={async (values) => {
              const newProduct = {
                name: values.name,
                provider: values.provider || 'Internal',
                type: values.type,
                category: values.type === 'Insurance' ? 'insurance' : 'finance',
                eligibleUsers: values.users?.includes('riders') ? 'Drivers & Riders' : 'Drivers Only',
                status: 'Active',
                applications: 0,
                commission: values.comm || '0%',
                deposit: values.deposit ? `${values.deposit}%` : undefined,
                historyReq: values.history || undefined,
                finScore: values.finScore || undefined,
                driverTier: values.tier ? values.tier.join('/') : undefined,
                behavior: values.behavior || undefined,
                interest: values.interest ? `${values.interest}%` : undefined,
              };

              try {
                await fetch('http://localhost:3001/api/products', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newProduct)
                });
                await fetchProducts(); // Reload from backend
              } catch (err) {
                console.error('Failed to create product', err);
              }

              setIsProductModalVisible(false);
              form.resetFields();
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Product Name" name="name" required><Input placeholder="e.g. Repair Loan" /></Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Eligible Users" name="users" required>
                  <Select placeholder="Selection" mode="multiple">
                    <Option value="drivers">Drivers</Option>
                    <Option value="riders">Riders (Users)</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Product Type" name="type" required>
                  <Select placeholder="Type">
                    <Option value="Financing">Rent-to-Buy (Vehicle)</Option>
                    <Option value="Loan">Microloan</Option>
                    <Option value="Credit">Fuel Credit</Option>
                    <Option value="Insurance">Insurance Package</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Min. Deposit (%)" name="deposit" tooltip="Only for Rent-to-Buy">
                  <InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="40" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Required History" name="history" tooltip="e.g. 6 Months for Rent-to-Buy">
                  <Input placeholder="e.g. 6 Months Consistency" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Financial Score" name="finScore" tooltip="e.g. Normal or High">
                  <Select placeholder="Min Score">
                    <Option value="Normal">Normal</Option>
                    <Option value="High">High</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Required Driver Tier" name="tier" tooltip="e.g. Premium/High">
                  <Select placeholder="Selection" mode="multiple">
                    <Option value="Premium">Premium</Option>
                    <Option value="High">High</Option>
                    <Option value="Standard">Standard</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Behavior & Reviews" name="behavior" tooltip="e.g. Clean History / Good Reviews">
                  <Input placeholder="e.g. Good Reviews" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Interest Rate (%)" name="interest"><InputNumber style={{ width: '100%' }} min={0} max={100} /></Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Commission Structure" name="comm"><Input placeholder="e.g. 5% of Loan Amount" /></Form.Item>
              </Col>
            </Row>
            <Form.Item label="Eligible Regions" name="regions"><Select mode="multiple" placeholder="Select Regions"><Option value="global">Global</Option><Option value="ke">Kenya</Option><Option value="zw">Zimbabwe</Option></Select></Form.Item>
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Space>
                <Button onClick={() => setIsProductModalVisible(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit">Create Product</Button>
              </Space>
            </div>
          </Form>
        </Modal>

        <Modal
          title="Product Details"
          open={isDetailsModalVisible}
          onCancel={() => setIsDetailsModalVisible(false)}
          footer={[<Button key="close" onClick={() => setIsDetailsModalVisible(false)}>Close</Button>]}
          width={600}
        >
          {viewingProduct && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Product ID">{viewingProduct.id}</Descriptions.Item>
              <Descriptions.Item label="Name">{viewingProduct.name}</Descriptions.Item>
              <Descriptions.Item label="Provider">{viewingProduct.provider}</Descriptions.Item>
              <Descriptions.Item label="Type">{viewingProduct.type}</Descriptions.Item>
              <Descriptions.Item label="Eligible Users">{viewingProduct.eligibleUsers}</Descriptions.Item>
              <Descriptions.Item label="Interest Rate">{viewingProduct.interest || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Status"><Tag color="blue">{viewingProduct.status}</Tag></Descriptions.Item>
              <Descriptions.Item label="Commission">{viewingProduct.commission}</Descriptions.Item>
              {viewingProduct.deposit && <Descriptions.Item label="Deposit Requirement"><Tag color="orange">{viewingProduct.deposit}</Tag></Descriptions.Item>}
              {viewingProduct.historyReq && <Descriptions.Item label="History Strategy">{viewingProduct.historyReq}</Descriptions.Item>}
              {viewingProduct.finScore && <Descriptions.Item label="Required Min Score">{viewingProduct.finScore}</Descriptions.Item>}
              {viewingProduct.driverTier && <Descriptions.Item label="Required Tier">{viewingProduct.driverTier}</Descriptions.Item>}
              {viewingProduct.behavior && <Descriptions.Item label="Behavior Standard">{viewingProduct.behavior}</Descriptions.Item>}
              <Descriptions.Item label="Total Applications">{viewingProduct.applications}</Descriptions.Item>
            </Descriptions>
          )}
        </Modal>

        <Modal
          title="Edit Financial Product"
          open={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form 
            form={editForm}
            layout="vertical" 
            onFinish={(values) => {
              if (!editingProduct) return;
              const updatedProducts = products.map(p => {
                if (p.id === editingProduct.id) {
                  return {
                    ...p,
                    name: values.name,
                    type: values.type,
                    eligibleUsers: values.users?.includes('riders') ? 'Drivers & Riders' : 'Drivers Only',
                    commission: values.comm || p.commission,
                    deposit: values.deposit ? `${values.deposit}%` : undefined,
                    historyReq: values.history || undefined,
                    finScore: values.finScore || undefined,
                    driverTier: values.tier ? values.tier.join('/') : undefined,
                    behavior: values.behavior || undefined,
                    interest: values.interest ? `${values.interest}%` : undefined,
                  };
                }
                return p;
              });
              setProducts(updatedProducts);
              setIsEditModalVisible(false);
              setEditingProduct(null);
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Product Name" name="name" required><Input /></Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Eligible Users" name="users" required>
                  <Select placeholder="Selection" mode="multiple">
                    <Option value="drivers">Drivers</Option>
                    <Option value="riders">Riders (Users)</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Product Type" name="type" required>
                  <Select placeholder="Type">
                    <Option value="Financing">Rent-to-Buy (Vehicle)</Option>
                    <Option value="Loan">Microloan</Option>
                    <Option value="Credit">Fuel Credit</Option>
                    <Option value="Insurance">Insurance Package</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Min. Deposit (%)" name="deposit">
                  <InputNumber style={{ width: '100%' }} min={0} max={100} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Required History" name="history">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Financial Score" name="finScore">
                  <Select placeholder="Min Score">
                    <Option value="Normal">Normal</Option>
                    <Option value="High">High</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Required Driver Tier" name="tier">
                  <Select placeholder="Selection" mode="multiple">
                    <Option value="Premium">Premium</Option>
                    <Option value="High">High</Option>
                    <Option value="Standard">Standard</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Behavior & Reviews" name="behavior">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Commission Structure" name="comm"><Input /></Form.Item>
              </Col>
            </Row>
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Space>
                <Button onClick={() => setIsEditModalVisible(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit">Save Changes</Button>
              </Space>
            </div>
          </Form>
        </Modal>
      </div>
    );
  };

  // 3. Applications
  const renderApplications = () => {
    const columns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { 
        title: 'User', 
        key: 'user',
        render: (record: FintechApplication) => (
          <Space direction="vertical" size={0}>
            <Text strong>{record.userId}</Text>
            <Tag color={record.userType === 'Driver' ? 'blue' : 'orange'} style={{ fontSize: 10 }}>{record.userType}</Tag>
          </Space>
        )
      },
      { title: 'Product', dataIndex: 'product' },
      { title: 'Amount', dataIndex: 'requestedAmount' },
      { 
        title: 'Status', 
        dataIndex: 'status',
        render: (status: string) => {
          let color = 'default';
          let icon = <SyncOutlined spin />;
          
          switch(status) {
            case 'Approved': color = 'success'; icon = <CheckCircleOutlined />; break;
            case 'Rejected': color = 'error'; icon = <CloseCircleOutlined />; break;
            case 'Disbursed': color = 'gold'; icon = <DollarCircleOutlined />; break;
            case 'Under Review': color = 'processing'; icon = <SyncOutlined spin />; break;
            case 'Submitted': color = 'warning'; icon = <InfoCircleOutlined />; break;
            default: color = 'default'; icon = <SyncOutlined spin />; break;
          }
          
          return <Tag color={color} icon={icon}>{status}</Tag>;
        }
      },
      { title: 'Date', dataIndex: 'date' },
      {
        title: 'Actions',
        align: 'right' as const,
        render: () => (
          <Space>
            <Tooltip title="View Request"><Button size="small" icon={<FileTextOutlined />} /></Tooltip>
            <Button size="small" type="primary">Process</Button>
          </Space>
        ),
      },
    ];

    return (
      <div style={{ padding: '24px 0' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>Fintech Applications</Title>
            <Text type="secondary">Review and approve user requests for financial products.</Text>
          </Col>
          <Col>
            <Space>
              <Button icon={<SyncOutlined />}>Refresh</Button>
              <Button icon={<WarningOutlined />}>Flagged Requests</Button>
            </Space>
          </Col>
        </Row>

        <Table 
          columns={columns} 
          dataSource={applications} 
          rowKey="id" 
          pagination={{ pageSize: 8 }}
          className="shadow-sm"
        />
      </div>
    );
  };
  const renderEligibility = () => (
    <div style={{ padding: '24px 0' }}>
      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Card title="Driver Risk & Eligibility Matrix" bordered={false} className="shadow-sm">
            <div style={{ marginBottom: 20 }}>
              <Alert 
                message="Fintech Eligibility Guard" 
                description={
                  <ul>
                    <li><strong>Insurance & Loans:</strong> Available for both Drivers and Riders based on platform activity.</li>
                    <li><strong>Rent-to-Buy:</strong> Restricted to <strong>Registered Drivers</strong> with <strong>6+ Months</strong> of platform consistency/profit.</li>
                  </ul>
                }
                type="info" 
                showIcon 
              />
            </div>
            <Table 
              size="small"
              dataSource={[
                { id: 'DRV-223', name: 'John Makoni', score: 85, level: 'Low Risk', products: 4 },
                { id: 'DRV-105', name: 'Sarah Mulenga', score: 92, level: 'Low Risk', products: 5 },
                { id: 'DRV-502', name: 'Peter Phiri', score: 62, level: 'Medium Risk', products: 2 },
                { id: 'DRV-098', name: 'Alice Zulu', score: 45, level: 'High Risk', products: 1 },
              ]}
              columns={[
                { title: 'Driver ID', dataIndex: 'id' },
                { title: 'Name', dataIndex: 'name' },
                { 
                  title: 'Score', 
                  dataIndex: 'score',
                  render: (score: number) => (
                    <Space>
                      <div style={{ width: 100, height: 8, background: '#f5f5f5', borderRadius: 4 }}>
                        <div style={{ width: `${score}%`, height: '100%', background: score > 80 ? '#52c41a' : score > 60 ? '#faad14' : '#ff4d4f', borderRadius: 4 }} />
                      </div>
                      <Text strong>{score}</Text>
                    </Space>
                  )
                },
                { 
                  title: 'Risk level', 
                  dataIndex: 'level',
                  render: (level: string) => (
                    <Tag color={level === 'Low Risk' ? 'green' : level === 'Medium Risk' ? 'orange' : 'red'}>{level}</Tag>
                  )
                },
                { title: 'Eligible Products', dataIndex: 'products' }
              ]}
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Threshold Configuration" bordered={false} className="shadow-sm">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <Text type="secondary">Vehicle Loan Threshold</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <Text strong>Min Score: 80</Text>
                  <Button size="small" type="link">Adjust</Button>
                </div>
              </div>
              <div>
                <Text type="secondary">Repair Loan Threshold</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <Text strong>Min Score: 60</Text>
                  <Button size="small" type="link">Adjust</Button>
                </div>
              </div>
              <div>
                <Text type="secondary">Fuel Credit Threshold</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <Text strong>Min Score: 40</Text>
                  <Button size="small" type="link">Adjust</Button>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 6. Driver Wallet
  const renderWallets = () => (
    <div style={{ padding: '24px 0' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title="Driver Financial Liquidity" bordered={false} className="shadow-sm">
            <Table 
              dataSource={[
                { key: '1', driver: 'John Makoni', balance: '$240.50', pending: '$1,200', loans: '$4,000', status: 'Healthy' },
                { key: '2', driver: 'Sarah Mulenga', balance: '$890.00', pending: '$450', loans: '$0', status: 'Healthy' },
                { key: '3', driver: 'Peter Phiri', balance: '$12.20', pending: '$300', loans: '$2,500', status: 'At Risk' },
              ]}
              columns={[
                { title: 'Driver', dataIndex: 'driver', render: (text: string) => <Text strong>{text}</Text> },
                { title: 'Wallet Balance', dataIndex: 'balance', render: (text: string) => <Text type="success">{text}</Text> },
                { title: 'Pending Earnings', dataIndex: 'pending' },
                { title: 'Loan Balance', dataIndex: 'loans', render: (text: string) => <Text type="danger">{text}</Text> },
                { title: 'Health Status', dataIndex: 'status', render: (status) => <Tag color={status === 'Healthy' ? 'green' : 'red'}>{status}</Tag> },
                { title: 'Actions', render: () => (
                  <Space>
                    <Button size="small">Credit</Button>
                    <Button size="small">Freeze</Button>
                  </Space>
                )}
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 7. Earnings Advance
  const renderAdvance = () => (
    <div style={{ padding: '24px 0' }}>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card title="Advance Configuration" bordered={false} className="shadow-sm">
            <Form layout="vertical" initialValues={{ limit: 70, fee: 2, min: 50 }}>
              <Form.Item label="Maximum Advance %" name="limit">
                <InputNumber min={0} max={100} style={{ width: '100%' }} suffix="%" />
              </Form.Item>
              <Form.Item label="Fixed Advance Fee ($)" name="fee">
                <InputNumber min={0} style={{ width: '100%' }} prefix="$" />
              </Form.Item>
              <Form.Item label="Minimum Earnings Required ($)" name="min">
                <InputNumber min={0} style={{ width: '100%' }} prefix="$" />
              </Form.Item>
              <Button type="primary">Update Rules</Button>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Usage Distribution" bordered={false} className="shadow-sm">
            <div style={{ height: 280, background: '#f9f9f9', borderRadius: 8, padding: 24 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text type="secondary">Early Payout Adoption</Text>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160, paddingTop: 20 }}>
                  <div style={{ flex: 1, height: '40%', background: '#1677ff', borderRadius: '4px 4px 0 0' }} />
                  <div style={{ flex: 1, height: '60%', background: '#1677ff', borderRadius: '4px 4px 0 0' }} />
                  <div style={{ flex: 1, height: '85%', background: '#1890ff', borderRadius: '4px 4px 0 0' }} />
                  <div style={{ flex: 1, height: '70%', background: '#1677ff', borderRadius: '4px 4px 0 0' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <Text style={{ fontSize: 10 }}>Mon</Text>
                  <Text style={{ fontSize: 10 }}>Tue</Text>
                  <Text style={{ fontSize: 10 }}>Wed</Text>
                  <Text style={{ fontSize: 10 }}>Thu</Text>
                </div>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 8. Risk & Compliance
  const renderRisk = () => (
    <div style={{ padding: '24px 0' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title="Fraud & Risk Monitoring" bordered={false} className="shadow-sm">
            <Alert 
              message="Active Risk Monitoring" 
              description="System is scanning for multiple loan applications, identity fraud, and account manipulation." 
              type="success" 
              showIcon 
              style={{ marginBottom: 20 }}
            />
            <Table 
              dataSource={[
                { key: '1', alert: 'Multiple Loan Apps', user: 'Peter Phiri', severity: 'High', status: 'Pending' },
                { key: '2', alert: 'KYC Mismatch', user: 'Alice Zulu', severity: 'Medium', status: 'Investigating' },
              ]}
              columns={[
                { title: 'Risk Alert', dataIndex: 'alert', render: (text) => <Text strong><WarningOutlined style={{ color: '#ff4d4f' }} /> {text}</Text> },
                { title: 'User', dataIndex: 'user' },
                { title: 'Severity', dataIndex: 'severity', render: (sev) => <Tag color={sev === 'High' ? 'red' : 'orange'}>{sev}</Tag> },
                { title: 'Status', dataIndex: 'status' },
                { title: 'Actions', render: () => <Button size="small">View KYC</Button> }
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 9. Revenue Analytics
  const renderAnalytics = () => (
    <div style={{ padding: '24px 0' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title="Fintech Revenue Streams" bordered={false} className="shadow-sm">
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <div style={{ padding: 20, background: '#f6ffed', borderRadius: 8, border: '1px solid #b7eb8f' }}>
                  <Statistic title="Loan Commissions" value={6200} precision={2} prefix="$" valueStyle={{ color: '#52c41a' }} />
                  <Text type="secondary">From Vehicle & Microloans</Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ padding: 20, background: '#e6f7ff', borderRadius: 8, border: '1px solid #91d5ff' }}>
                  <Statistic title="Advance Fees" value={3100} precision={2} prefix="$" valueStyle={{ color: '#1890ff' }} />
                  <Text type="secondary">Early payout transaction fees</Text>
                </div>
              </Col>
            </Row>
            <div style={{ marginTop: 24, height: 300, background: '#fafafa', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Space direction="vertical" align="center">
                <BarChartOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Monthly Revenue Breakdown (Chart Placeholder)</Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 10. Partner Management
  const renderPartners = () => (
    <div style={{ padding: '24px 0' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title="Fintech & Banking Partners" bordered={false} className="shadow-sm">
            <Table 
              dataSource={[
                { key: '1', partner: 'XYZ Bank', type: 'Banking', integration: 'Full API', status: 'Active', products: 2 },
                { key: '2', partner: 'DashDrive Finance', type: 'Internal', integration: 'Direct', status: 'Active', products: 5 },
                { key: '3', partner: 'ABC Lenders', type: 'Microfinance', integration: 'Webhook', status: 'Reviewing', products: 1 },
                { key: '4', partner: 'Global Insure', type: 'Insurance', integration: 'Full API', status: 'Active', products: 1 },
              ]}
              columns={[
                { title: 'Partner Name', dataIndex: 'partner', render: (text) => <Text strong>{text}</Text> },
                { title: 'Partner Type', dataIndex: 'type' },
                { title: 'Integration Method', dataIndex: 'integration' },
                { title: 'Active Products', dataIndex: 'products' },
                { title: 'Status', dataIndex: 'status', render: (status) => <Tag color={status === 'Active' ? 'green' : 'orange'}>{status}</Tag> },
                { title: 'Actions', render: () => (
                  <Space>
                    <Button size="small">API Keys</Button>
                    <Button size="small">Contracts</Button>
                  </Space>
                )}
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderPlaceholder = (title: string) => (
    <div style={{ padding: '60px 0', textAlign: 'center' }}>
      <Empty description={<span>{title} module is currently being configured...</span>} />
    </div>
  );

  const tabItems = [
    { key: 'overview', label: <span><BarChartOutlined /> Overview</span>, children: renderOverview() },
    { key: 'products', label: <span><ShoppingOutlined /> Products</span>, children: renderProducts() },
    { key: 'applications', label: <span><FileTextOutlined /> Applications</span>, children: renderApplications() },
    { key: 'eligibility', label: <span><ScanOutlined /> Eligibility</span>, children: renderEligibility() },
    { key: 'partners', label: <span><TeamOutlined /> Partners</span>, children: renderPartners() },
    { key: 'wallets', label: <span><WalletOutlined /> Driver Wallets</span>, children: renderWallets() },
    { key: 'advance', label: <span><ThunderboltOutlined /> Earnings Advance</span>, children: renderAdvance() },
    { key: 'risk', label: <span><SafetyCertificateOutlined /> Risk & Compliance</span>, children: renderRisk() },
    { key: 'analytics', label: <span><LineChartOutlined /> Analytics</span>, children: renderAnalytics() },
  ];

  const tabKeys = ['overview', 'products', 'applications', 'eligibility', 'partners', 'wallets', 'advance', 'risk', 'analytics'];
  const currentIndex = tabKeys.indexOf(activeTab);

  const handlePrevTab = () => {
    if (currentIndex > 0) setActiveTab(tabKeys[currentIndex - 1]);
  };

  const handleNextTab = () => {
    if (currentIndex < tabKeys.length - 1) setActiveTab(tabKeys[currentIndex + 1]);
  };

  return (
    <div className="fintech-marketplace">
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={tabItems}
        size="large"
        tabBarStyle={{ marginBottom: 0 }}
        tabBarExtraContent={{
          left: (
            <Button 
              type="text" 
              icon={<LeftOutlined />} 
              onClick={handlePrevTab} 
              disabled={currentIndex <= 0}
              style={{ marginRight: 8 }}
            />
          ),
          right: (
            <Button 
              type="text" 
              icon={<RightOutlined />} 
              onClick={handleNextTab} 
              disabled={currentIndex >= tabKeys.length - 1}
              style={{ marginLeft: 8 }}
            />
          )
        }}
      />
    </div>
  );
};
