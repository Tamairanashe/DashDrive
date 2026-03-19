import React, { useState, useEffect } from 'react';
import { 
  Typography, Row, Col, Card, Tabs, Table, Button, Tag, Space, Form, 
  Input, Empty, Select, InputNumber, Divider, Badge, Tooltip, 
  Avatar, Descriptions, Alert, message, Drawer, Segmented, 
  Upload, Radio, Checkbox, Switch, Statistic, List
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, 
  CloseCircleOutlined, CarOutlined, SettingOutlined, SolutionOutlined,
  SearchOutlined, FilterOutlined, EyeOutlined, InfoCircleOutlined,
  FileProtectOutlined, SafetyCertificateOutlined, InboxOutlined,
  HistoryOutlined, UserOutlined, ThunderboltOutlined, BarChartOutlined,
  LineChartOutlined, SafetyOutlined, FileTextOutlined, AuditOutlined,
  CloudUploadOutlined, TeamOutlined, GlobalOutlined, StarOutlined, RocketOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip as RechartsTooltip, BarChart, Bar,
  LineChart, Line, Cell, PieChart, Pie
} from 'recharts';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

// --- Interfaces ---

interface VehicleAttribute {
  key: string;
  type: string;
  category: 'Ride' | 'Delivery' | 'Rental';
  seats: number;
  status: 'Active' | 'Inactive';
  fuelType: string;
  minYear: number;
}

interface Vehicle {
  key: string;
  vehicleId: string;
  driverName: string;
  driverId: string;
  type: string;
  plateNumber: string;
  status: 'Active' | 'Pending' | 'Suspended' | 'Expired';
  city: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  trips: number;
  rating: number;
  category?: 'Ride' | 'Delivery' | 'Rental';
  vehicleImage?: string;
  services?: string[];
  licenceDisc?: string;
  regBook?: string;
}

interface VehicleRequest {
  key: string;
  requestId: string;
  driverName: string;
  driverId: string;
  vehicleType: string;
  plateNumber: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
  brand: string;
  model: string;
  vehicleImage?: string;
  services?: string[];
  licenceDisc?: string;
  regBook?: string;
  documents: { type: string, status: 'Verified' | 'Pending', expiry?: string }[];
  history: { date: string, action: string, user: string }[];
}

interface VehiclePerformance {
  trips: { day: string, count: number }[];
  ratings: { month: string, score: number }[];
}

// Custom Icons for Status and Actions
const StopOutlined = (props: any) => (
  <span className="anticon" {...props} style={{ display: 'inline-flex', alignItems: 'center', ...props.style }}>
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM4 12C4 7.58 7.58 4 12 4C13.88 4 15.59 4.65 16.95 5.74L5.74 16.95C4.65 15.59 4 13.88 4 12ZM12 20C10.12 20 8.41 19.35 7.05 18.26L18.26 7.05C19.35 8.41 20 10.12 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor"/>
    </svg>
  </span>
);

const WarningOutlined = (props: any) => (
  <span className="anticon" {...props} style={{ display: 'inline-flex', alignItems: 'center', ...props.style }}>
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
      <path d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="currentColor"/>
    </svg>
  </span>
);

const RenderAddVehicleForm: React.FC<{ 
  onFinish: (values: any) => void, 
  form: any, 
  attributes: VehicleAttribute[],
  isDark: boolean 
}> = ({ onFinish, form, attributes, isDark }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = async () => {
    try {
      await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (e) {
      message.error('Please complete all required fields');
    }
  };

  const prev = () => setCurrentStep(currentStep - 1);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 0' }}>
      <Row gutter={48}>
        <Col span={6}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { title: 'Basic Info', icon: <CarOutlined /> },
              { title: 'Assignment', icon: <TeamOutlined /> },
              { title: 'Documentation', icon: <CloudUploadOutlined /> }
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 32, height: 32, borderRadius: '50%', 
                  background: currentStep === i ? '#0e172a' : (currentStep > i ? '#10b981' : (isDark ? '#333' : '#f0f0f0')),
                  color: currentStep >= i ? '#fff' : (isDark ? '#999' : '#666'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {currentStep > i ? <CheckCircleOutlined /> : s.icon}
                </div>
                <Text strong={currentStep === i} type={currentStep === i ? undefined : 'secondary'}>{s.title}</Text>
              </div>
            ))}
          </div>
        </Col>
        <Col span={18}>
          <Card variant="borderless" className="shadow-sm" style={{ minHeight: 400 }}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              {currentStep === 0 && (
                <div>
                   <Divider orientation={"left" as any} orientationMargin={0}>Vehicle Information</Divider>
                   <Divider style={{ margin: '12px 0 24px' }} />
                   <Row gutter={16}>
                      <Col span={12}><Form.Item name="brand" label="Brand" rules={[{required: true}]}><Input placeholder="Toyota" /></Form.Item></Col>
                      <Col span={12}><Form.Item name="model" label="Model" rules={[{required: true}]}><Input placeholder="Corolla" /></Form.Item></Col>
                      <Col span={8}><Form.Item name="year" label="Year" rules={[{required: true}]}><InputNumber style={{width:'100%'}} /></Form.Item></Col>
                      <Col span={8}><Form.Item name="color" label="Color" rules={[{required: true}]}><Input /></Form.Item></Col>
                      <Col span={8}><Form.Item name="plateNumber" label="Plate" rules={[{required: true}]}><Input placeholder="ABC1234" /></Form.Item></Col>
                   </Row>
                   <Divider dashed />
                   <Form.Item name="vehicleImage" label="Vehicle Image" rules={[{required: true}]}>
                     <Dragger style={{ padding: '20px', background: isDark ? '#1e293b' : '#f8fafc' }}>
                       <p className="ant-upload-drag-icon"><CarOutlined style={{ color: '#10b981' }} /></p>
                       <p className="ant-upload-text">Click or drag vehicle photo to this area</p>
                       <p className="ant-upload-hint">Support for .png, .jpg (Max 2MB)</p>
                     </Dragger>
                   </Form.Item>
                </div>
              )}

              {currentStep === 1 && (
                <div>
                    <Divider orientation={"left" as any} orientationMargin={0}>Driver & Service Assignment</Divider>
                    <Divider style={{ margin: '12px 0 24px' }} />
                    <Form.Item name="category" label="Vertical Category" rules={[{required: true}]}>
                      <Segmented 
                        block 
                        options={[
                          { label: 'Ride Hailing', value: 'Ride', icon: <CarOutlined /> },
                          { label: 'Delivery', value: 'Delivery', icon: <InboxOutlined /> },
                          { label: 'Rental', value: 'Rental', icon: <HistoryOutlined /> }
                        ]} 
                      />
                    </Form.Item>
                    <Form.Item name="services" label="Applicable Services" rules={[{required: true}]}>
                      <Checkbox.Group style={{ width: '100%' }}>
                        <Row gutter={[16, 8]}>
                          <Col span={12}><Checkbox value="Ride">Standard Ride</Checkbox></Col>
                          <Col span={12}><Checkbox value="Luxury">Luxury/Premium</Checkbox></Col>
                          <Col span={12}><Checkbox value="Parcel">Parcel Delivery</Checkbox></Col>
                          <Col span={12}><Checkbox value="Food">Food/Mart Delivery</Checkbox></Col>
                        </Row>
                      </Checkbox.Group>
                    </Form.Item>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="type" label="Vehicle Type" rules={[{required: true}]}>
                          <Select placeholder="e.g. Sedan, SUV">
                              {attributes.map(a => <Option key={a.key} value={a.type}>{a.type}</Option>)}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="city" label="Operational City" rules={[{required: true}]}>
                          <Select placeholder="Select city">
                              <Option value="Harare">Harare</Option>
                              <Option value="Bulawayo">Bulawayo</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item name="driverName" label="Primary Driver">
                       <Select placeholder="Assign driver now or later" showSearch>
                          <Option value="John Makoni">John Makoni (DRV-442)</Option>
                          <Option value="Sarah Chipo">Sarah Chipo (DRV-901)</Option>
                       </Select>
                    </Form.Item>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                    <Divider orientation={"left" as any} orientationMargin={0}>Document Compliance</Divider>
                    <Divider style={{ margin: '12px 0 24px' }} />
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="licenceDisc" label="Licence Disc" rules={[{required: true}]}>
                          <Upload.Dragger multiple={false} style={{ padding: '20px' }}>
                            <FileTextOutlined style={{ fontSize: 24, color: '#3b82f6', marginBottom: 8 }} />
                            <div style={{ fontSize: 12 }}>Upload licence disc</div>
                          </Upload.Dragger>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="regBook" label="Registration Book" rules={[{required: true}]}>
                          <Upload.Dragger multiple={false} style={{ padding: '20px' }}>
                            <AuditOutlined style={{ fontSize: 24, color: '#3b82f6', marginBottom: 8 }} />
                            <div style={{ fontSize: 12 }}>Upload reg book</div>
                          </Upload.Dragger>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Alert message="Compliance Check" description="Uploaded documents will be queued for review. The vehicle will remain 'Pending' until verified." type="warning" showIcon style={{ marginBottom: 24 }} />
                </div>
              )}

              <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
                <Button disabled={currentStep === 0} onClick={prev}>Previous</Button>
                {currentStep < 2 ? (
                  <Button type="primary" onClick={next} style={{ background: '#0e172a' }}>Next Step</Button>
                ) : (
                  <Button type="primary" onClick={() => form.submit()} style={{ background: '#10b981', border: 'none' }}>Provision Vehicle</Button>
                )}
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export const VehicleManagementPage: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('1');

  // --- State ---
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [requests, setRequests] = useState<VehicleRequest[]>([]);
  const [attributes, setAttributes] = useState<VehicleAttribute[]>([]);
  
  // --- Drawer States ---
  const [isAttributeDrawerVisible, setIsAttributeDrawerVisible] = useState(false);
  const [isVehicleDetailDrawerVisible, setIsVehicleDetailDrawerVisible] = useState(false);
  const [isRequestDetailDrawerVisible, setIsRequestDetailDrawerVisible] = useState(false);
  const [isAddVehicleDrawerVisible, setIsAddVehicleDrawerVisible] = useState(false);

  // Sync Tabs with Path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/vehicles/attributes')) setActiveTab('1');
    else if (path.includes('/vehicles/list')) setActiveTab('2');
    else if (path.includes('/vehicles/requests')) setActiveTab('3');
    else if (path.includes('/vehicles/add')) setActiveTab('4');
  }, [location.pathname]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === '1') navigate('/vehicles/attributes');
    else if (key === '2') navigate('/vehicles/list');
    else if (key === '3') navigate('/vehicles/requests');
    else if (key === '4') navigate('/vehicles/add');
  };
  
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<VehicleRequest | null>(null);
  const [selectedAttribute, setSelectedAttribute] = useState<VehicleAttribute | null>(null);

  const [attributeForm] = Form.useForm();
  const [addVehicleForm] = Form.useForm();

  // Governance & Trash State
  const [trashedVehicles, setTrashedVehicles] = useState<Vehicle[]>([]);
  const [isTrashDrawerOpen, setIsTrashDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filterCity, setFilterCity] = useState<string | undefined>(undefined);

  const handleResetFilters = () => {
    setSearchText('');
    setFilterType(undefined);
    setFilterCity(undefined);
  };

  useEffect(() => {
    // Simulate API Fetch
    setTimeout(() => {
      setVehicles([
        { 
          key: '1', vehicleId: 'VH1023', driverName: 'John Makoni', driverId: 'DRV-442', 
          type: 'Sedan', plateNumber: 'ABC123', status: 'Active', city: 'Harare',
          brand: 'Toyota', model: 'Corolla', year: 2022, color: 'Silver',
          trips: 1240, rating: 4.8, services: ['Ride-Hailing']
        },
        { 
          key: '2', vehicleId: 'VH1024', driverName: 'Sarah K', driverId: 'DRV-901', 
          type: 'Premium', plateNumber: 'XYZ789', status: 'Suspended', city: 'Bulawayo',
          brand: 'Mercedes', model: 'C-Class', year: 2023, color: 'Black',
          trips: 85, rating: 4.9, services: ['Ride-Hailing', 'Luxury']
        },
        { 
          key: '3', vehicleId: 'VH1025', driverName: 'Alex Makoni', driverId: 'CR-1002', 
          type: 'Motorcycle', plateNumber: 'MOTO-5', status: 'Active', city: 'Harare',
          brand: 'Honda', model: 'CG125', year: 2021, color: 'Red',
          trips: 3421, rating: 4.7, services: ['Delivery', 'Parcel']
        },
        { 
          key: '4', vehicleId: 'VH2222', driverName: 'Fleet Assigned', driverId: 'FL-100', 
          type: 'Van', plateNumber: 'BUL-LOG-1', status: 'Active', city: 'Bulawayo',
          brand: 'Ford', model: 'Transit', year: 2020, color: 'White',
          trips: 450, rating: 4.6, services: ['Logistics', 'Heavy Delivery']
        },
      ]);
      setRequests([
        { 
          key: '1', requestId: 'VR556', driverName: 'Alex T', driverId: 'DRV-221', 
          vehicleType: 'Sedan', plateNumber: 'HRE555', status: 'Pending', date: '12 Mar',
          brand: 'Toyota', model: 'Prius',
          documents: [
            { type: 'Registration', status: 'Verified', expiry: '2026-12-12' },
            { type: 'Insurance', status: 'Pending', expiry: '2026-06-15' }
          ],
          history: [
            { date: '2026-03-12 10:00', action: 'Request Submitted', user: 'Alex T' },
            { date: '2026-03-12 14:00', action: 'Document Verification Started', user: 'Admin' }
          ]
        },
        { 
          key: '2', requestId: 'VR557', driverName: 'Musa W', driverId: 'DRV-003', 
          vehicleType: 'Van', plateNumber: 'BUL001', status: 'Pending', date: '13 Mar',
          brand: 'Ford', model: 'Transit',
          documents: [
            { type: 'Registration', status: 'Pending' },
            { type: 'Roadworthiness', status: 'Pending' }
          ],
          history: [
            { date: '2026-03-13 09:30', action: 'Request Submitted', user: 'Musa W' }
          ]
        },
      ]);
      setAttributes([
        { key: '1', type: 'Economy', category: 'Ride', seats: 4, status: 'Active', fuelType: 'Petrol', minYear: 2015 },
        { key: '2', type: 'Premium', category: 'Ride', seats: 4, status: 'Active', fuelType: 'Hybrid', minYear: 2018 },
        { key: '3', type: 'Motorcycle', category: 'Delivery', seats: 1, status: 'Active', fuelType: 'Petrol', minYear: 2010 },
        { key: '4', type: 'Van', category: 'Delivery', seats: 2, status: 'Active', fuelType: 'Diesel', minYear: 2012 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // --- Handlers ---

  const handleCreateAttribute = (values: any) => {
    const newAttr: VehicleAttribute = {
      key: Date.now().toString(),
      type: values.type,
      category: values.category,
      seats: values.seats,
      status: 'Active',
      fuelType: values.fuelType,
      minYear: values.minYear
    };
    setAttributes([...attributes, newAttr]);
    setIsAttributeDrawerVisible(false);
    attributeForm.resetFields();
    message.success('Vehicle attribute created successfully');
  };

  const handleAddVehicle = (values: any) => {
    const newVehicle: Vehicle = {
      key: Date.now().toString(),
      vehicleId: `VH${Math.floor(1000 + Math.random() * 9000)}`,
      driverName: values.driverName || 'Unassigned',
      driverId: 'NEW',
      type: values.type,
      category: values.category,
      services: values.services,
      plateNumber: values.plateNumber,
      status: 'Active',
      city: values.city,
      brand: values.brand,
      model: values.model,
      year: values.year,
      color: values.color,
      trips: 0,
      rating: 0
    };
    setVehicles([newVehicle, ...vehicles]);
    setIsAddVehicleDrawerVisible(false);
    addVehicleForm.resetFields();
    message.success('Vehicle added and activated');
    navigate('/vehicles/list');
  };

  // --- Columns Definitions ---

  const attributeColumns = [
    { title: 'Type', dataIndex: 'type', key: 'type', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (c: string) => <Tag color="blue">{c}</Tag> },
    { title: 'Seats', dataIndex: 'seats', key: 'seats' },
    { title: 'Min Year', dataIndex: 'minYear', key: 'minYear' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'Active' ? 'green' : 'red'}>{s}</Tag> },
    { 
      title: 'Action', 
      key: 'action', 
      render: (_: any, r: VehicleAttribute) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined style={{ color: '#10b981' }} />} onClick={() => { setSelectedAttribute(r); attributeForm.setFieldsValue(r); setIsAttributeDrawerVisible(true); }} />
          <Button type="text" icon={<DeleteOutlined style={{ color: '#ef4444' }} />} />
        </Space>
      ) 
    },
  ];

  const vehicleColumns = [
    { 
      title: 'Vehicle Info', 
      key: 'vehicleInfo', 
      width: 250,
      render: (_: any, r: Vehicle) => (
        <Space>
          <div style={{ width: 48, height: 48, borderRadius: 8, background: isDark ? '#1a1a1a' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {r.vehicleImage ? <img src={r.vehicleImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <CarOutlined style={{ fontSize: 24, color: '#10b981' }} />}
          </div>
          <div>
            <Text strong>{r.brand} {r.model}</Text><br />
            <Text type="secondary" style={{ fontSize: 11 }}>{r.vehicleId} â€¢ {r.color}</Text>
          </div>
        </Space>
      )
    },
    { 
      title: 'Services', 
      dataIndex: 'services', 
      key: 'services',
      width: 180,
      render: (services: string[]) => (
        <Space wrap size={[4, 4]}>
          {services?.map(s => <Tag key={s} color="blue" style={{ fontSize: 10, margin: 0 }}>{s}</Tag>)}
          {!services && <Text type="secondary" style={{ fontSize: 10 }}>N/A</Text>}
        </Space>
      )
    },
    { 
      title: 'Category', 
      dataIndex: 'type', 
      key: 'type',
      render: (t: string) => <Tag color={t === 'Premium' ? 'gold' : t === 'Motorcycle' ? 'blue' : 'default'}>{t}</Tag>
    },
    { title: 'Plate', dataIndex: 'plateNumber', key: 'plateNumber', render: (p: string) => <Tag style={{ fontWeight: 600 }}>{p}</Tag> },
    { title: 'Driver', dataIndex: 'driverName', key: 'driverName', render: (d: string) => <Space><Avatar size="small" icon={<UserOutlined />} /> {d}</Space> },
    { 
      title: 'Compliance', 
      key: 'compliance', 
      width: 150,
      render: (_: any, r: Vehicle) => (
        <Space orientation="vertical" size={0}>
          <Tag color={r.status === 'Active' ? 'green' : 'orange'} icon={<SafetyOutlined />} style={{ margin: 0 }}>Verified</Tag>
          <Space size={4} style={{ marginTop: 4 }}>
            <Tooltip title="Licence Disc"><FileTextOutlined style={{ fontSize: 12, color: r.licenceDisc ? '#10b981' : '#d1d5db' }} /></Tooltip>
            <Tooltip title="Reg Book"><AuditOutlined style={{ fontSize: 12, color: r.regBook ? '#10b981' : '#d1d5db' }} /></Tooltip>
          </Space>
        </Space>
      ) 
    },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (s: string) => {
      const colors: any = { Active: 'success', Pending: 'warning', Suspended: 'error', Expired: 'volcano' };
      return <Badge status={colors[s] || 'default' as any} text={s} />;
    }},
    { title: 'City', dataIndex: 'city', key: 'city', width: 120 },
    { title: 'Trips', dataIndex: 'trips', key: 'trips', sorter: (a: Vehicle, b: Vehicle) => a.trips - b.trips },
    { 
      title: 'Action', 
      key: 'action', 
      fixed: 'right' as const,
      width: 150,
      render: (_: any, r: Vehicle) => (
        <Space>
          <Tooltip title="View Details"><Button size="small" type="text" icon={<EyeOutlined />} onClick={() => { setSelectedVehicle(r); setIsVehicleDetailDrawerVisible(true); }} /></Tooltip>
          <Tooltip title="Edit"><Button size="small" type="text" icon={<EditOutlined style={{ color: '#10b981' }} />} /></Tooltip>
          <Tooltip title="Delete (Move to Trash)">
            <Button 
              size="small" 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => {
                setTrashedVehicles(prev => [...prev, r]);
                setVehicles(prev => prev.filter(v => v.key !== r.key));
                message.success('Vehicle moved to trash');
              }}
            />
          </Tooltip>
        </Space>
      ) 
    },
  ];

  const requestColumns = [
    { 
      title: 'Request ID', 
      dataIndex: 'requestId', 
      key: 'requestId',
      render: (id: string) => <Text strong>{id}</Text>
    },
    { title: 'Driver', dataIndex: 'driverName', key: 'driverName' },
    { 
      title: 'Vehicle Info', 
      key: 'vehicleInfo', 
      render: (_: any, r: VehicleRequest) => (
        <Space>
          <Avatar shape="square" size={40} icon={<CarOutlined />} style={{ borderRadius: 6, background: '#f8fafc' }} />
          <div>
            <Text strong>{r.brand} {r.model}</Text><br/>
            <Text type="secondary" style={{ fontSize: 11 }}>{r.vehicleType}</Text>
          </div>
        </Space>
      )
    },
    { 
      title: 'Services', 
      dataIndex: 'services', 
      key: 'services',
      render: (services: string[]) => (
        <Space wrap size={[2, 2]}>
          {services?.map(s => <Tag key={s} color="cyan" style={{ fontSize: 10 }}>{s}</Tag>)}
        </Space>
      )
    },
    { title: 'Plate', dataIndex: 'plateNumber', key: 'plateNumber' },
    { 
      title: 'Documents', 
      key: 'docs', 
      render: (_, r) => (
        <Space>
          <Tooltip title="Licence Disc"><FileTextOutlined style={{ color: r.licenceDisc ? '#10b981' : '#d1d5db' }} /></Tooltip>
          <Tooltip title="Reg Book"><AuditOutlined style={{ color: r.regBook ? '#10b981' : '#d1d5db' }} /></Tooltip>
        </Space>
      )
    },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { 
      title: 'Action', 
      key: 'action', 
      render: (_: any, r: VehicleRequest) => (
        <Space>
          <Button size="small" type="primary" style={{ background: '#0e172a' }} onClick={() => { setSelectedRequest(r); setIsRequestDetailDrawerVisible(true); }}>View & Review</Button>
          <Button size="small" icon={<CheckCircleOutlined style={{ color: '#10b981' }} />} type="text" />
          <Button size="small" icon={<CloseCircleOutlined style={{ color: '#ef4444' }} />} type="text" />
        </Space>
      ) 
    },
  ];

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
        <Col>
          <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Fleet Management</Title>
          <Text type="secondary">Enterprise-grade vehicle registry, compliance tracking, and asset administration.</Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<HistoryOutlined />}>Audit Trail</Button>
            <Button type="primary" icon={<PlusOutlined />} style={{ background: '#0e172a', borderColor: '#0e172a' }} onClick={() => handleTabChange('4')}>
              Provision New Vehicle
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Stats Overview */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small" style={{ borderRadius: 12, borderLeft: '4px solid #10b981' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Total Active Fleet</Text>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{vehicles.filter(v => v.status === 'Active').length} <Text style={{ fontSize: 14, color: '#10b981' }}><ThunderboltOutlined /> Live</Text></div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ borderRadius: 12, borderLeft: '4px solid #3b82f6' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Pending Requests</Text>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{requests.length} <Text style={{ fontSize: 14, color: '#3b82f6' }}><InfoCircleOutlined /></Text></div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ borderRadius: 12, borderLeft: '4px solid #ef4444' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Suspended Assets</Text>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{vehicles.filter(v => v.status === 'Suspended').length} <Text style={{ fontSize: 14, color: '#ef4444' }}><WarningOutlined /></Text></div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ borderRadius: 12, borderLeft: '4px solid #f59e0b' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Expiring Compliance</Text>
            <div style={{ fontSize: 24, fontWeight: 700 }}>8 <Text style={{ fontSize: 14, color: '#f59e0b' }}><FileProtectOutlined /></Text></div>
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          size="large"
          items={[
            {
              key: '1',
              label: <span><SettingOutlined /> Vehicle Attributes</span>,
              children: (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setSelectedAttribute(null); attributeForm.resetFields(); setIsAttributeDrawerVisible(true); }}>
                      Create Attribute
                    </Button>
                  </div>
                  <Table 
                    loading={loading}
                    dataSource={attributes} 
                    columns={attributeColumns}
                    className="premium-table"
                  />
                </div>
              )
            },
            {
              key: '2',
              label: <span><SafetyCertificateOutlined /> Vehicle List</span>,
              children: (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <Space>
                      <Input 
                        prefix={<SearchOutlined />} 
                        placeholder="Search by plate or ID..." 
                        style={{ width: 300, borderRadius: 8 }} 
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                      />
                      <Select 
                        placeholder="All Types" 
                        style={{ width: 140 }} 
                        allowClear
                        value={filterType}
                        onChange={setFilterType}
                      >
                        <Option value="Sedan">Sedan</Option>
                        <Option value="Motorcycle">Motorcycle</Option>
                        <Option value="Premium">Premium</Option>
                        <Option value="Van">Van</Option>
                      </Select>
                      <Select
                        placeholder="City"
                        style={{ width: 120 }}
                        allowClear
                        value={filterCity}
                        onChange={setFilterCity}
                      >
                        <Option value="Harare">Harare</Option>
                        <Option value="Bulawayo">Bulawayo</Option>
                      </Select>
                      <Tooltip title="Reset Filters">
                        <Button icon={<HistoryOutlined />} onClick={handleResetFilters} />
                      </Tooltip>
                    </Space>
                    <Space>
                      <Button icon={<InboxOutlined />} onClick={() => setIsTrashDrawerOpen(true)}>Manage Trash</Button>
                      <Segmented options={['Daily', 'Weekly', 'Monthly']} />
                    </Space>
                  </div>
                  <Table 
                    loading={loading}
                    dataSource={vehicles.filter(v => {
                      const matchesSearch = !searchText || 
                        v.plateNumber.toLowerCase().includes(searchText.toLowerCase()) || 
                        v.vehicleId.toLowerCase().includes(searchText.toLowerCase());
                      const matchesType = !filterType || v.type === filterType;
                      const matchesCity = !filterCity || v.city === filterCity;
                      return matchesSearch && matchesType && matchesCity;
                    })} 
                    columns={vehicleColumns}
                    className="premium-table"
                  />
                </div>
              )
            },
            {
              key: '3',
              label: <span><AuditOutlined /> Review Requests <Badge count={requests.length} style={{ marginLeft: 8 }} /></span>,
              children: (
                <Table 
                  loading={loading}
                  dataSource={requests}
                  columns={requestColumns}
                  className="premium-table"
                />
              )
            },
            {
              key: '4',
              label: <span><PlusOutlined /> Add New Vehicle</span>,
              children: <RenderAddVehicleForm onFinish={handleAddVehicle} form={addVehicleForm} attributes={attributes} isDark={isDark} />
            }
          ]}
        />
      </Card>

      {/* --- DRAWERS --- */}

      {/* 1. Attribute Drawer */}
      <Drawer
        title={selectedAttribute ? 'Update Attribute' : 'Create Vehicle Attribute'}
        open={isAttributeDrawerVisible}
        onClose={() => setIsAttributeDrawerVisible(false)}
        width={400}
        extra={
          <Space>
            <Button onClick={() => setIsAttributeDrawerVisible(false)}>Cancel</Button>
            <Button type="primary" onClick={() => attributeForm.submit()} style={{ background: '#10b981', borderColor: '#10b981' }}>
              {selectedAttribute ? 'Update' : 'Create'}
            </Button>
          </Space>
        }
      >
        <Form form={attributeForm} layout="vertical" onFinish={handleCreateAttribute}>
          <Form.Item name="type" label="Vehicle Type Name" rules={[{ required: true }]} tooltip="e.g. Economy, Luxury, Delivery Van">
            <Input placeholder="Enter type name" />
          </Form.Item>
          <Form.Item name="category" label="Vehicle Category" rules={[{ required: true }]}>
            <Select placeholder="Select category">
              <Option value="Ride">Ride Hailing</Option>
              <Option value="Delivery">Parcel Delivery</Option>
              <Option value="Rental">Car Rental</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="seats" label="Seats" rules={[{ required: true }]}>
                <InputNumber min={1} max={50} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="minYear" label="Min Year" rules={[{ required: true }]}>
                <InputNumber min={1990} max={2026} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="fuelType" label="Fuel Type" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="Petrol">Petrol</Radio>
              <Radio value="Hybrid">Hybrid</Radio>
              <Radio value="Electric">Electric</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Drawer>

      {/* 2. Vehicle Detail Drawer */}
      <Drawer
        title={<Space><CarOutlined /> Vehicle Profile: {selectedVehicle?.vehicleId}</Space>}
        open={isVehicleDetailDrawerVisible}
        onClose={() => setIsVehicleDetailDrawerVisible(false)}
        width={600}
      >
        {selectedVehicle && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24, padding: 24, background: isDark ? '#1a1a1a' : '#f8fafc', borderRadius: 16 }}>
              <Avatar size={100} icon={<CarOutlined />} style={{ background: '#10b981', marginBottom: 16 }} />
              <Title level={4} style={{ margin: 0 }}>{selectedVehicle.brand} {selectedVehicle.model}</Title>
              <Text type="secondary">{selectedVehicle.plateNumber} â€¢ {selectedVehicle.city}</Text>
              <div style={{ marginTop: 12 }}>
                <Badge status={selectedVehicle.status === 'Active' ? 'success' : 'error'} text={selectedVehicle.status} />
              </div>
            </div>

            <Tabs items={[
              {
                key: 'info',
                label: <span><InfoCircleOutlined /> General Info</span>,
                children: (
                  <Space orientation="vertical" style={{ width: '100%' }} size="large">
                    <Descriptions bordered column={1} size="small">
                      <Descriptions.Item label="Registration">{selectedVehicle.plateNumber}</Descriptions.Item>
                      <Descriptions.Item label="Color / Year">{selectedVehicle.color} â€¢ {selectedVehicle.year}</Descriptions.Item>
                      <Descriptions.Item label="Driver Instance">{selectedVehicle.driverName} ({selectedVehicle.driverId})</Descriptions.Item>
                      <Descriptions.Item label="Service Class">{selectedVehicle.type}</Descriptions.Item>
                    </Descriptions>

                    <Card size="small" title="Service Eligibility" className="shadow-sm">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <Space><CarOutlined /> Ride Hailing</Space>
                            <Switch defaultChecked size="small" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <Space><InboxOutlined /> Parcel Delivery</Space>
                            <Switch defaultChecked size="small" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Space><ThunderboltOutlined /> Express Priority</Space>
                            <Switch size="small" />
                        </div>
                    </Card>
                  </Space>
                )
              },
              {
                key: 'analytics',
                label: <span><LineChartOutlined /> Performance</span>,
                children: (
                  <Space orientation="vertical" style={{ width: '100%' }} size="middle">
                     <Row gutter={16}>
                        <Col span={12}>
                           <Card size="small" style={{ textAlign: 'center' }}>
                              <Statistic title="Total Trips" value={selectedVehicle.trips} prefix={<RocketOutlined />} />
                           </Card>
                        </Col>
                        <Col span={12}>
                           <Card size="small" style={{ textAlign: 'center' }}>
                              <Statistic title="Avg Rating" value={selectedVehicle.rating} prefix={<StarOutlined style={{ color: '#f59e0b' }} />} />
                           </Card>
                        </Col>
                     </Row>
                     
                     <Card size="small" title="Trip Volume (Last 7 Days)">
                        <div style={{ height: 200, width: '100%' }}>
                           <ResponsiveContainer>
                              <AreaChart data={[
                                {day: 'Mon', trips: 12}, {day: 'Tue', trips: 15}, {day: 'Wed', trips: 10},
                                {day: 'Thu', trips: 18}, {day: 'Fri', trips: 22}, {day: 'Sat', trips: 25}, {day: 'Sun', trips: 14}
                              ]}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                 <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                 <YAxis hide />
                                 <RechartsTooltip />
                                 <Area type="monotone" dataKey="trips" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                              </AreaChart>
                           </ResponsiveContainer>
                        </div>
                     </Card>
                  </Space>
                )
              },
              {
                key: 'docs',
                label: <span><FileProtectOutlined /> Compliance Docs</span>,
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <Card size="small" title="Insurance Certificate" extra={<Tag color="green">Verified</Tag>}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">Expiry: 12 Dec 2026</Text>
                        <Button type="link" size="small">View Scan</Button>
                      </div>
                    </Card>
                    <Card size="small" title="Roadworthiness Certificate" extra={<Tag color="orange">Expiring Soon</Tag>}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">Expiry: 20 Apr 2026</Text>
                        <Button type="link" size="small">View Scan</Button>
                      </div>
                    </Card>
                    <Divider style={{ fontSize: 12, margin: '12px 0' }}>Review Controls</Divider>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text>Force Re-verification</Text>
                        <Button size="small">Flush Cache</Button>
                    </div>
                  </div>
                )
              }
            ]} />
          </div>
        )}
      </Drawer>

      {/* 3. Request Review Drawer */}
      <Drawer
        title={<Space><AuditOutlined /> Review Onboarding Request: {selectedRequest?.requestId}</Space>}
        open={isRequestDetailDrawerVisible}
        onClose={() => setIsRequestDetailDrawerVisible(false)}
        width={750}
        footer={
          <div style={{ display: 'flex', gap: 12 }}>
            <Button danger block icon={<CloseCircleOutlined />} size="large">Reject Request</Button>
            <Button type="primary" block icon={<CheckCircleOutlined />} size="large" style={{ background: '#10b981', borderColor: '#10b981' }}>Approve & Activate Vehicle</Button>
          </div>
        }
      >
        {selectedRequest && (
          <Row gutter={24}>
            <Col span={14}>
               <Space orientation="vertical" size="large" style={{ width: '100%' }}>
                  <Alert 
                    message="Manual Verification Required" 
                    description={`Driver ${selectedRequest.driverName} has submitted a ${selectedRequest.brand} ${selectedRequest.model} for the ${selectedRequest.vehicleType} class.`} 
                    type="info" 
                    showIcon 
                  />
                  
                  <section>
                    <Title level={5} style={{ marginBottom: 16 }}><FileTextOutlined /> Submitted Documents</Title>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {selectedRequest.documents.map((doc, idx) => (
                           <Card key={idx} size="small" className="shadow-sm" style={{ border: '1px solid #f0f0f0' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <Space>
                                    <FileProtectOutlined style={{ color: '#10b981' }} />
                                    <div>
                                       <Text strong style={{ display: 'block' }}>{doc.type}</Text>
                                       {doc.expiry && <Text type="secondary" style={{ fontSize: 12 }}>Expires: {doc.expiry}</Text>}
                                    </div>
                                 </Space>
                                 <Space>
                                    <Tag color={doc.status === 'Verified' ? 'green' : 'orange'}>{doc.status}</Tag>
                                    <Button size="small">View Full</Button>
                                 </Space>
                              </div>
                           </Card>
                        ))}
                    </div>
                  </section>

                  <section>
                    <Title level={5} style={{ marginBottom: 16 }}><SettingOutlined /> Service Parameters</Title>
                    <Card size="small" className="shadow-sm">
                       <Row gutter={[16, 16]}>
                          <Col span={12}><Text type="secondary">Vehicle Category</Text><br/><Text strong>{selectedRequest.vehicleType}</Text></Col>
                          <Col span={12}><Text type="secondary">Plate Number</Text><br/><Text strong>{selectedRequest.plateNumber}</Text></Col>
                          <Col span={24}>
                             <Divider style={{ margin: '8px 0' }} />
                             <Text type="secondary" style={{ fontSize: 13 }}>Eligibility Checks</Text>
                             <div style={{ marginTop: 8 }}>
                                <Checkbox checked disabled>Safety Standards Met</Checkbox><br/>
                                <Checkbox checked disabled>Insurance Coverage Active</Checkbox>
                             </div>
                          </Col>
                       </Row>
                    </Card>
                  </section>
               </Space>
            </Col>
            
            <Col span={10}>
               <div style={{ background: isDark ? '#1a1a1a' : '#f8fafc', padding: 20, borderRadius: 16, height: '100%' }}>
                  <Title level={5} style={{ marginBottom: 16 }}><AuditOutlined /> Review Audit Trail</Title>
                  <List
                    dataSource={selectedRequest.history}
                    renderItem={item => (
                      <List.Item style={{ padding: '12px 0', border: 'none' }}>
                        <div style={{ position: 'relative', paddingLeft: 16, borderLeft: '2px solid #10b981' }}>
                           <div style={{ position: 'absolute', left: -5, top: 0, width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                           <Text strong style={{ display: 'block', fontSize: 13 }}>{item.action}</Text>
                           <Text type="secondary" style={{ fontSize: 11 }}>{item.date} â€¢ {item.user}</Text>
                        </div>
                      </List.Item>
                    )}
                  />
                  <Divider />
                  <div style={{ marginTop: 16 }}>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>Internal Decision Note</Text>
                    <Input.TextArea placeholder="Add rationale for approval/rejection..." rows={4} />
                  </div>
               </div>
            </Col>
          </Row>
        )}
      </Drawer>

      {/* 4. Add Vehicle Drawer */}
      <Drawer
        title="Provision New Vehicle"
        open={isAddVehicleDrawerVisible}
        onClose={() => {
          setIsAddVehicleDrawerVisible(false);
          if (location.pathname === '/vehicles/add') navigate('/vehicles/list');
        }}
        width={650}
        extra={
          <Space>
            <Button onClick={() => setIsAddVehicleDrawerVisible(false)}>Cancel</Button>
            <Button type="primary" onClick={() => addVehicleForm.submit()} style={{ background: '#0e172a' }}>Provision & Activate</Button>
          </Space>
        }
      >
        <Form form={addVehicleForm} layout="vertical" onFinish={handleAddVehicle}>
          <Title level={5} style={{ marginBottom: 16 }}>Basic Information</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="brand" label="Brand" rules={[{ required: true }]}>
                <Input placeholder="e.g. Toyota" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="model" label="Model" rules={[{ required: true }]}>
                <Input placeholder="e.g. Camry" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="year" label="Year" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="color" label="Color" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="plateNumber" label="Plate" rules={[{ required: true }]}>
                <Input placeholder="ABC-123" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Title level={5} style={{ marginBottom: 16 }}>Service Configuration</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Vehicle Category" rules={[{ required: true }]}>
                <Select placeholder="Select Class">
                  {attributes.map(a => <Option key={a.key} value={a.type}>{a.type}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="city" label="Operation City" rules={[{ required: true }]}>
                <Select placeholder="Select City">
                  <Option value="Harare">Harare</Option>
                  <Option value="Bulawayo">Bulawayo</Option>
                  <Option value="Gweru">Gweru</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Service Assignment">
            <Checkbox.Group options={['Ride Hailing', 'Parcel Delivery', 'Car Rental']} defaultValue={['Ride Hailing']} />
          </Form.Item>

          <Divider />

          <Title level={5} style={{ marginBottom: 16 }}>Document Uploads</Title>
          <Dragger style={{ marginBottom: 24, padding: 20 }}>
            <p className="ant-upload-drag-icon"><InboxOutlined style={{ color: '#10b981' }} /></p>
            <p className="ant-upload-text">Upload Registration & Insurance</p>
            <p className="ant-upload-hint">Support for PDF, JPG, PNG (Max 5MB)</p>
          </Dragger>

          <Form.Item name="driverName" label="Assign Driver (Optional)">
            <Select placeholder="Search for driver..." showSearch>
              <Option value="John M">John M (DRV-442)</Option>
              <Option value="Sarah K">Sarah K (DRV-901)</Option>
            </Select>
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title={<Space><HistoryOutlined /> Recover Trashed Vehicles</Space>}
        open={isTrashDrawerOpen}
        onClose={() => setIsTrashDrawerOpen(false)}
        width={700}
      >
        <Table 
          dataSource={trashedVehicles}
          rowKey="key"
          columns={[
            { title: 'Vehicle ID', dataIndex: 'vehicleId', key: 'id' },
            { title: 'Type/Brand', key: 'info', render: (_, r) => <Text>{r.brand} {r.model} ({r.type})</Text> },
            { title: 'Plate', dataIndex: 'plateNumber', key: 'plate' },
            { 
              title: 'Actions', 
              key: 'actions', 
              align: 'right',
              render: (_, record) => (
                <Space>
                  <Button 
                    size="small" 
                    icon={<ThunderboltOutlined />} 
                    onClick={() => {
                      setVehicles([record, ...vehicles]);
                      setTrashedVehicles(prev => prev.filter(v => v.key !== record.key));
                      message.success('Vehicle restored to fleet');
                    }}
                  >
                    Restore
                  </Button>
                  <Button 
                    size="small" 
                    danger 
                    icon={<CloseCircleOutlined />}
                    onClick={() => {
                      setTrashedVehicles(prev => prev.filter(v => v.key !== record.key));
                      message.warning('Vehicle purged from records');
                    }}
                  >
                    Purge
                  </Button>
                </Space>
              )
            }
          ]}
          locale={{ emptyText: <Empty description="Trash bin is empty" /> }}
        />
      </Drawer>

      <style>{`
        .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .ant-card { border-radius: 12px; }
        .ant-tabs-nav::before { border-bottom: 1px solid ${isDark ? '#333' : '#f0f0f0'} !important; }
        .premium-table .ant-table { background: transparent; }
        .premium-table .ant-table-thead > tr > th { background: ${isDark ? '#1a1a1a' : '#f8fafc'}; font-weight: 600; }
      `}</style>
    </div>
  );
};

