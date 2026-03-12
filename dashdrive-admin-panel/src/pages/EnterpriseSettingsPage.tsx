import React, { useState } from 'react';
import {
  Typography, Card, Tabs, Table, Button, Tag, Space, Switch, Input, Form, Divider,
  message, Checkbox, Select, Modal, Badge, Tooltip, Popconfirm, Dropdown, Avatar,
  Upload, DatePicker, Radio
} from 'antd';
import {
  LockOutlined, PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined,
  SaveOutlined, DownloadOutlined, ReloadOutlined, RestOutlined, UserOutlined,
  TeamOutlined, CheckCircleOutlined, CloseCircleOutlined, HistoryOutlined,
  ExclamationCircleOutlined, FileExcelOutlined, FilePdfOutlined, FilterOutlined,
  EyeOutlined, MailOutlined, PhoneOutlined, SafetyCertificateOutlined,
  CameraOutlined, IdcardOutlined, HomeOutlined, ManOutlined, WomanOutlined,
  CalendarOutlined, UploadOutlined, FileImageOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

// ============================================================
// ALL SERVICE MODULES
// ============================================================
const serviceModules = [
  { key: 'ride_management', label: 'Ride Management', icon: '🚗' },
  { key: 'food_delivery', label: 'Food Delivery Management', icon: '🍽️' },
  { key: 'parcel_management', label: 'Parcel Management', icon: '📦' },
  { key: 'mart_management', label: 'Mart Management', icon: '🛒' },
  { key: 'shopping_management', label: 'Shopping Management', icon: '🛍️' },
  { key: 'hotel_management', label: 'Hotel & Booking Management', icon: '🏨' },
  { key: 'event_management', label: 'Events & Ticketing', icon: '🎟️' },
  { key: 'car_rental', label: 'Car Rental Management', icon: '🚘' },
  { key: 'fuel_management', label: 'Fuel Services', icon: '⛽' },
  { key: 'transit_management', label: 'Public Transit', icon: '🚌' },
  { key: 'fare_management', label: 'Fare & Pricing Management', icon: '💲' },
  { key: 'vehicle_management', label: 'Vehicle Management', icon: '🔧' },
  { key: 'driver_management', label: 'Driver Management', icon: '👨‍✈️' },
  { key: 'user_management', label: 'User Management', icon: '👥' },
  { key: 'finance_management', label: 'Finance & Wallet', icon: '💰' },
  { key: 'loan_management', label: 'Loans & BNPL', icon: '🏦' },
  { key: 'insurance_management', label: 'Insurance Management', icon: '🛡️' },
  { key: 'marketing', label: 'Marketing & Promotions', icon: '📢' },
  { key: 'support_tickets', label: 'Support & Tickets', icon: '🎧' },
  { key: 'analytics', label: 'Analytics & Reports', icon: '📊' },
  { key: 'content_management', label: 'CMS & Pages', icon: '📝' },
  { key: 'system_settings', label: 'System Settings', icon: '⚙️' },
  { key: 'enterprise_config', label: 'Enterprise Configuration', icon: '🏢' },
  { key: 'api_management', label: 'API Management', icon: '🔌' },
];

// ============================================================
// EMPLOYEE DATA
// ============================================================
interface Employee {
  key: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  position: string;
  role: string;
  modules: string[];
  status: 'active' | 'inactive';
  joinedAt: string;
  lastActive: string;
}

const initialEmployees: Employee[] = [
  {
    key: '1', name: 'Tatenda Moyo', email: 'tatenda@dashdrive.app', phone: '+263 77 123 4567',
    avatar: 'TM', position: 'Chief Technology Officer', role: 'Super Admin',
    modules: serviceModules.map(m => m.key),
    status: 'active', joinedAt: '2024-01-10', lastActive: 'Just now',
  },
  {
    key: '2', name: 'Rumbidzai Chikore', email: 'rumbi@dashdrive.app', phone: '+263 71 234 5678',
    avatar: 'RC', position: 'Operations Director', role: 'Super Admin',
    modules: serviceModules.map(m => m.key),
    status: 'active', joinedAt: '2024-01-10', lastActive: '5 min ago',
  },
  {
    key: '3', name: 'Kudakwashe Dube', email: 'kuda@dashdrive.app', phone: '+263 78 345 6789',
    avatar: 'KD', position: 'Logistics Manager', role: 'Logistics Manager',
    modules: ['ride_management', 'parcel_management', 'food_delivery', 'driver_management', 'vehicle_management', 'fare_management'],
    status: 'active', joinedAt: '2024-02-15', lastActive: '10 min ago',
  },
  {
    key: '4', name: 'Nyasha Mapfumo', email: 'nyasha@dashdrive.app', phone: '+263 73 456 7890',
    avatar: 'NM', position: 'Ride Operations Lead', role: 'Logistics Manager',
    modules: ['ride_management', 'driver_management', 'vehicle_management', 'fare_management'],
    status: 'active', joinedAt: '2024-03-01', lastActive: '30 min ago',
  },
  {
    key: '5', name: 'Tendai Chirwa', email: 'tendai@dashdrive.app', phone: '+263 77 567 8901',
    avatar: 'TC', position: 'Food & Mart Manager', role: 'Logistics Manager',
    modules: ['food_delivery', 'mart_management', 'shopping_management', 'parcel_management'],
    status: 'active', joinedAt: '2024-03-15', lastActive: '1 hr ago',
  },
  {
    key: '6', name: 'Chiedza Mutasa', email: 'chiedza@dashdrive.app', phone: '+263 71 678 9012',
    avatar: 'CM', position: 'Finance Controller', role: 'Finance Controller',
    modules: ['finance_management', 'loan_management', 'insurance_management', 'analytics', 'marketing'],
    status: 'active', joinedAt: '2024-02-20', lastActive: '2 hr ago',
  },
  {
    key: '7', name: 'Farai Banda', email: 'farai@dashdrive.app', phone: '+263 78 789 0123',
    avatar: 'FB', position: 'Accounts Assistant', role: 'Finance Controller',
    modules: ['finance_management', 'analytics'],
    status: 'active', joinedAt: '2024-05-10', lastActive: '4 hr ago',
  },
  {
    key: '8', name: 'Rutendo Kamota', email: 'rutendo@dashdrive.app', phone: '+263 73 890 1234',
    avatar: 'RK', position: 'Senior Support Agent', role: 'Support Agent',
    modules: ['user_management', 'support_tickets', 'ride_management'],
    status: 'active', joinedAt: '2024-04-01', lastActive: '15 min ago',
  },
  {
    key: '9', name: 'Blessing Moyo', email: 'blessing@dashdrive.app', phone: '+263 77 901 2345',
    avatar: 'BM', position: 'Support Agent', role: 'Support Agent',
    modules: ['user_management', 'support_tickets'],
    status: 'active', joinedAt: '2024-06-01', lastActive: '20 min ago',
  },
  {
    key: '10', name: 'Tinashe Gweru', email: 'tinashe@dashdrive.app', phone: '+263 71 012 3456',
    avatar: 'TG', position: 'Marketing Coordinator', role: 'Marketing Manager',
    modules: ['marketing', 'analytics', 'content_management'],
    status: 'active', joinedAt: '2024-04-20', lastActive: '3 hr ago',
  },
  {
    key: '11', name: 'Tafadzwa Chiundura', email: 'taf@dashdrive.app', phone: '+263 78 111 2233',
    avatar: 'TC', position: 'Hotel & Events Coordinator', role: 'Service Manager',
    modules: ['hotel_management', 'event_management', 'car_rental'],
    status: 'active', joinedAt: '2024-05-01', lastActive: '1 day ago',
  },
  {
    key: '12', name: 'Simba Madondo', email: 'simba@dashdrive.app', phone: '+263 73 222 3344',
    avatar: 'SM', position: 'Former Fleet Manager', role: 'Logistics Manager',
    modules: ['vehicle_management', 'driver_management'],
    status: 'inactive', joinedAt: '2024-01-20', lastActive: '2 months ago',
  },
  {
    key: '13', name: 'Rudo Musekiwa', email: 'rudo@dashdrive.app', phone: '+263 77 333 4455',
    avatar: 'RM', position: 'Former Intern', role: 'Support Agent',
    modules: ['support_tickets'],
    status: 'inactive', joinedAt: '2024-07-01', lastActive: '1 month ago',
  },
];

// ============================================================
// ROLE DEFINITIONS
// ============================================================
interface RoleDefinition {
  key: string;
  name: string;
  description: string;
  modules: string[];
  employeeCount: number;
  color: string;
}

const initialRoles: RoleDefinition[] = [
  { key: 'R1', name: 'Super Admin', description: 'Full system access — all modules', modules: serviceModules.map(m => m.key), employeeCount: 2, color: '#dc2626' },
  { key: 'R2', name: 'Logistics Manager', description: 'Rides, deliveries, drivers, vehicles, fares', modules: ['ride_management', 'food_delivery', 'parcel_management', 'driver_management', 'vehicle_management', 'fare_management'], employeeCount: 3, color: '#3b82f6' },
  { key: 'R3', name: 'Finance Controller', description: 'Wallets, loans, insurance, analytics', modules: ['finance_management', 'loan_management', 'insurance_management', 'analytics', 'marketing'], employeeCount: 2, color: '#10b981' },
  { key: 'R4', name: 'Support Agent', description: 'Users, support tickets, basic ride view', modules: ['user_management', 'support_tickets', 'ride_management'], employeeCount: 2, color: '#f59e0b' },
  { key: 'R5', name: 'Marketing Manager', description: 'Marketing, analytics, CMS', modules: ['marketing', 'analytics', 'content_management'], employeeCount: 1, color: '#8b5cf6' },
  { key: 'R6', name: 'Service Manager', description: 'Hotels, events, rentals', modules: ['hotel_management', 'event_management', 'car_rental'], employeeCount: 1, color: '#06b6d4' },
];

// ============================================================
// ATTRIBUTE TAB
// ============================================================
const AttributeTab: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [roles, setRoles] = useState<RoleDefinition[]>(initialRoles);
  const [searchRole, setSearchRole] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null);
  const [roleModules, setRoleModules] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm] = Form.useForm();
  const [activityLogModal, setActivityLogModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [trashedModalOpen, setTrashedModalOpen] = useState(false);
  const [trashedEmployees, setTrashedEmployees] = useState<Employee[]>([]);

  // Role & Permissions Logic
  const handleSelectRole = (roleName: string) => {
    const role = roles.find(r => r.name === roleName);
    if (role) {
      setSelectedRole(role);
      setRoleModules([...role.modules]);
      setSelectAll(role.modules.length === serviceModules.length);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setRoleModules(checked ? serviceModules.map(m => m.key) : []);
  };

  const handleModuleToggle = (moduleKey: string, checked: boolean) => {
    const updated = checked ? [...roleModules, moduleKey] : roleModules.filter(m => m !== moduleKey);
    setRoleModules(updated);
    setSelectAll(updated.length === serviceModules.length);
  };

  const handleSaveRole = () => {
    if (!selectedRole) return;
    setRoles(prev => prev.map(r => r.key === selectedRole.key ? { ...r, modules: roleModules } : r));
    message.success(`${selectedRole.name} permissions updated`);
  };

  // Employee List Logic
  const handleToggleStatus = (key: string) => {
    setEmployees(prev => prev.map(e => e.key === key ? { ...e, status: e.status === 'active' ? 'inactive' : 'active' } : e));
    message.success('Employee status updated');
  };

  const handleDeleteEmployee = (key: string) => {
    const emp = employees.find(e => e.key === key);
    if (emp) {
      setTrashedEmployees(prev => [...prev, emp]);
      setEmployees(prev => prev.filter(e => e.key !== key));
      message.success('Employee moved to trash');
    }
  };

  const handleRestoreEmployee = (key: string) => {
    const emp = trashedEmployees.find(e => e.key === key);
    if (emp) {
      setEmployees(prev => [...prev, emp]);
      setTrashedEmployees(prev => prev.filter(e => e.key !== key));
      message.success('Employee restored');
    }
  };

  const handlePermanentDelete = (key: string) => {
    setTrashedEmployees(prev => prev.filter(e => e.key !== key));
    message.success('Employee permanently deleted');
  };

  const handleAddEmployee = () => {
    addForm.validateFields().then(values => {
      const newEmp: Employee = {
        key: String(Date.now()),
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        phone: values.phone || '',
        avatar: `${values.firstName?.[0] || ''}${values.lastName?.[0] || ''}`.toUpperCase(),
        position: values.position,
        role: values.role,
        modules: roles.find(r => r.name === values.role)?.modules || [],
        status: 'active',
        joinedAt: new Date().toISOString().split('T')[0],
        lastActive: 'Just now',
      };
      setEmployees(prev => [...prev, newEmp]);
      addForm.resetFields();
      setAddModalOpen(false);
      message.success(`${values.name} added successfully`);
    });
  };

  const handleEditEmployee = () => {
    editForm.validateFields().then(values => {
      setEmployees(prev => prev.map(e => e.key === selectedEmployee?.key ? {
        ...e, 
        name: `${values.firstName} ${values.lastName}`, 
        email: values.email, 
        phone: values.phone,
        position: values.position, 
        role: values.role,
        modules: roles.find(r => r.name === values.role)?.modules || e.modules,
      } : e));
      setEditModalOpen(false);
      message.success('Employee updated');
    });
  };

  const handleDownload = (format: string) => {
    message.success(`Downloading employee list as ${format.toUpperCase()}...`);
  };

  const filteredRoles = roles.filter(r => r.name.toLowerCase().includes(searchRole.toLowerCase()));

  const filteredEmployees = employees.filter(e => {
    const matchesTab = activeTab === 'all' || e.status === activeTab;
    const matchesSearch = e.name.toLowerCase().includes(employeeSearch.toLowerCase()) || e.email.toLowerCase().includes(employeeSearch.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Activity log mock
  const activityLogs = [
    { time: '2 min ago', action: 'Viewed ride dispatch board', module: 'Ride Management' },
    { time: '15 min ago', action: 'Updated driver status', module: 'Driver Management' },
    { time: '1 hr ago', action: 'Exported analytics report', module: 'Analytics' },
    { time: '3 hr ago', action: 'Processed refund #RF-4521', module: 'Finance' },
    { time: 'Yesterday', action: 'Resolved support ticket #TK-2389', module: 'Support' },
    { time: '2 days ago', action: 'Updated fare pricing zone', module: 'Fare Management' },
  ];

  const employeeColumns = [
    {
      title: 'Employee Name',
      render: (_: any, r: Employee) => (
        <Space>
          <Avatar style={{ background: '#0e172a', fontWeight: 600, fontSize: 12 }} size={36}>{r.avatar}</Avatar>
          <div>
            <Text strong style={{ fontSize: 13 }}>{r.name}</Text><br />
            <Text type="secondary" style={{ fontSize: 11 }}>{r.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Employee Position',
      dataIndex: 'position',
      render: (text: string, r: Employee) => (
        <div>
          <Text style={{ fontSize: 13 }}>{text}</Text><br />
          <Tag color={roles.find(rl => rl.name === r.role)?.color || '#666'} style={{ fontSize: 10, marginTop: 2 }}>{r.role}</Tag>
        </div>
      ),
    },
    {
      title: 'Module Access',
      dataIndex: 'modules',
      width: 200,
      render: (modules: string[]) => (
        <Space wrap size={2}>
          {modules.slice(0, 3).map(m => {
            const mod = serviceModules.find(sm => sm.key === m);
            return <Tag key={m} style={{ fontSize: 10 }}>{mod?.icon} {mod?.label?.split(' ')[0]}</Tag>;
          })}
          {modules.length > 3 && <Tag style={{ fontSize: 10 }}>+{modules.length - 3} more</Tag>}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 80,
      render: (status: string, r: Employee) => (
        <Switch size="small" checked={status === 'active'} onChange={() => handleToggleStatus(r.key)}
          checkedChildren="Active" unCheckedChildren="Off" />
      ),
    },
    {
      title: 'Action',
      width: 150,
      render: (_: any, r: Employee) => (
        <Space>
          <Tooltip title="View Details">
            <Button size="small" type="primary" ghost icon={<EyeOutlined />} onClick={() => { setSelectedEmployee(r); setDetailsModalOpen(true); }} />
          </Tooltip>
          <Tooltip title="Activity Log">
            <Button size="small" type="text" icon={<HistoryOutlined />} onClick={() => { setSelectedEmployee(r); setActivityLogModal(true); }} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button size="small" type="text" icon={<EditOutlined />} onClick={() => {
              setSelectedEmployee(r);
              const [firstName, ...lastNameParts] = r.name.split(' ');
              editForm.setFieldsValue({ ...r, firstName, lastName: lastNameParts.join(' ') });
              setEditModalOpen(true);
            }} />
          </Tooltip>
          <Popconfirm title="Move to trash?" onConfirm={() => handleDeleteEmployee(r.key)}>
            <Button size="small" type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* ============================================================ */}
      {/* SECTION 1: EMPLOYEE ROLE & PERMISSIONS                       */}
      {/* ============================================================ */}
      <Card
        title={<Space><SafetyCertificateOutlined /> Employee Role & Permissions</Space>}
        style={{ borderRadius: 12, marginBottom: 24 }}
        styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
      >
        {/* Role Name Search & Module Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <Form.Item label="Role Name" style={{ marginBottom: 0 }}>
            <Input
              placeholder="Search roles..."
              prefix={<SearchOutlined />}
              value={searchRole}
              onChange={e => setSearchRole(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Select Module for Roles" style={{ marginBottom: 0 }}>
            <Select
              placeholder="Select a role to configure"
              value={selectedRole?.name}
              onChange={handleSelectRole}
              allowClear
              onClear={() => { setSelectedRole(null); setRoleModules([]); }}
            >
              {filteredRoles.map(r => (
                <Option key={r.key} value={r.name}>
                  <Space>
                    <Badge color={r.color} />
                    {r.name}
                    <Text type="secondary" style={{ fontSize: 11 }}>({r.employeeCount} employees)</Text>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* Role Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          {filteredRoles.map(r => (
            <div
              key={r.key}
              onClick={() => handleSelectRole(r.name)}
              style={{
                padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                border: `2px solid ${selectedRole?.key === r.key ? r.color : '#e2e8f0'}`,
                background: selectedRole?.key === r.key ? `${r.color}08` : 'white',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Badge color={r.color} text={<Text strong style={{ fontSize: 13 }}>{r.name}</Text>} />
                  <div style={{ marginTop: 2 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>{r.description}</Text>
                  </div>
                </div>
                <Tag style={{ fontWeight: 600 }}>{r.employeeCount}</Tag>
              </div>
            </div>
          ))}
        </div>

        {/* Module Checkboxes */}
        {selectedRole && (
          <>
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text strong style={{ fontSize: 14 }}>
                Module Permissions for <Tag color={selectedRole.color}>{selectedRole.name}</Tag>
              </Text>
              <Checkbox checked={selectAll} onChange={e => handleSelectAll(e.target.checked)}>
                <Text strong>Select All</Text>
              </Checkbox>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {serviceModules.map(mod => (
                <div
                  key={mod.key}
                  style={{
                    padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                    border: `1px solid ${roleModules.includes(mod.key) ? '#3b82f6' : '#e2e8f0'}`,
                    background: roleModules.includes(mod.key) ? '#eff6ff' : 'white',
                    display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'all 0.15s',
                  }}
                  onClick={() => handleModuleToggle(mod.key, !roleModules.includes(mod.key))}
                >
                  <Checkbox checked={roleModules.includes(mod.key)} />
                  <span style={{ fontSize: 16 }}>{mod.icon}</span>
                  <Text style={{ fontSize: 11, fontWeight: roleModules.includes(mod.key) ? 600 : 400 }}>{mod.label}</Text>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, gap: 12 }}>
              <Button onClick={() => { setSelectedRole(null); setRoleModules([]); }}>Cancel</Button>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveRole} style={{ background: '#0e172a' }}>
                Save Role Permissions
              </Button>
            </div>
          </>
        )}
      </Card>

      {/* ============================================================ */}
      {/* SECTION 2: EMPLOYEE LIST                                     */}
      {/* ============================================================ */}
      <Card
        title={<Space><TeamOutlined /> Employee List</Space>}
        style={{ borderRadius: 12 }}
        styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
        extra={
          <Space>
            <Dropdown menu={{ items: [
              { key: 'csv', label: 'Download CSV', icon: <FileExcelOutlined />, onClick: () => handleDownload('csv') },
              { key: 'excel', label: 'Download Excel', icon: <FileExcelOutlined />, onClick: () => handleDownload('excel') },
            ]}}>
              <Button icon={<DownloadOutlined />} size="small">Export</Button>
            </Dropdown>
            <Tooltip title="Refresh">
              <Button icon={<ReloadOutlined />} size="small" onClick={() => message.success('Employee list refreshed')} />
            </Tooltip>
            <Tooltip title="Manage Trashed">
              <Badge count={trashedEmployees.length} size="small">
                <Button icon={<RestOutlined />} size="small" onClick={() => setTrashedModalOpen(true)} />
              </Badge>
            </Tooltip>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)} style={{ background: '#0e172a' }}>
              Add Employee
            </Button>
          </Space>
        }
      >
        {/* Tabs & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Space size={0}>
            {(['all', 'active', 'inactive'] as const).map(tab => (
              <Button
                key={tab}
                type={activeTab === tab ? 'primary' : 'default'}
                size="small"
                onClick={() => setActiveTab(tab)}
                style={activeTab === tab ? { background: '#0e172a', borderColor: '#0e172a' } : {}}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <Badge count={
                  tab === 'all' ? employees.length :
                  tab === 'active' ? employees.filter(e => e.status === 'active').length :
                  employees.filter(e => e.status === 'inactive').length
                } style={{ marginLeft: 6, background: activeTab === tab ? 'white' : '#e2e8f0', color: activeTab === tab ? '#0e172a' : '#64748b', fontSize: 11, fontWeight: 600 }} />
              </Button>
            ))}
          </Space>
          <Input
            placeholder="Search by name or email..."
            prefix={<SearchOutlined />}
            value={employeeSearch}
            onChange={e => setEmployeeSearch(e.target.value)}
            style={{ width: 280 }}
            allowClear
          />
        </div>

        <Table
          dataSource={filteredEmployees}
          columns={employeeColumns}
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `${total} employees` }}
          size="middle"
        />
      </Card>

      {/* ============================================================ */}
      {/* ADD EMPLOYEE MODAL                                           */}
      {/* ============================================================ */}
      <Modal
        title={<Space><PlusOutlined /> Add New Employee</Space>}
        open={addModalOpen}
        onCancel={() => { setAddModalOpen(false); addForm.resetFields(); }}
        onOk={handleAddEmployee}
        okText="Add Employee"
        okButtonProps={{ style: { background: '#0e172a' } }}
        width={750}
      >
        <Form form={addForm} layout="vertical">
          {/* ---- SECTION: Profile Picture ---- */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <Upload
              name="avatar"
              listType="picture-circle"
              showUploadList={false}
              beforeUpload={() => { message.info('Profile photo selected'); return false; }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <CameraOutlined style={{ fontSize: 24, color: '#94a3b8' }} />
                <Text type="secondary" style={{ fontSize: 10, marginTop: 4 }}>Upload Photo</Text>
              </div>
            </Upload>
            <Text type="secondary" style={{ fontSize: 11 }}>Click to upload profile picture (JPG, PNG, max 2MB)</Text>
          </div>

          <Divider style={{ margin: '16px 0' }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0e172a', marginBottom: 12 }}>
            <Space><UserOutlined /> Personal Information</Space>
          </div>

          {/* ---- SECTION: Personal Information ---- */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'First name is required' }]}>
              <Input prefix={<UserOutlined />} placeholder="e.g. Tatenda" />
            </Form.Item>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Last name is required' }]}>
              <Input prefix={<UserOutlined />} placeholder="e.g. Moyo" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="Email Address" name="email" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
              <Input prefix={<MailOutlined />} placeholder="tatenda@dashdrive.app" />
            </Form.Item>
            <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: 'Phone is required' }]}>
              <Input prefix={<PhoneOutlined />} placeholder="+263 77 123 4567" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item label="Date of Birth" name="dob">
              <DatePicker style={{ width: '100%' }} placeholder="Select date" />
            </Form.Item>
            <Form.Item label="Gender" name="gender">
              <Select placeholder="Select">
                <Option value="male"><Space><ManOutlined /> Male</Space></Option>
                <Option value="female"><Space><WomanOutlined /> Female</Space></Option>
                <Option value="other">Other</Option>
                <Option value="prefer_not">Prefer not to say</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Blood Group" name="bloodGroup">
              <Select placeholder="Select">
                <Option value="A+">A+</Option>
                <Option value="A-">A-</Option>
                <Option value="B+">B+</Option>
                <Option value="B-">B-</Option>
                <Option value="O+">O+</Option>
                <Option value="O-">O-</Option>
                <Option value="AB+">AB+</Option>
                <Option value="AB-">AB-</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="Residential Address" name="address">
            <Input prefix={<HomeOutlined />} placeholder="e.g. 42 Samora Machel Ave, Harare" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="Emergency Contact Name" name="emergencyName">
              <Input placeholder="e.g. Rumbidzai Moyo" />
            </Form.Item>
            <Form.Item label="Emergency Contact Phone" name="emergencyPhone">
              <Input prefix={<PhoneOutlined />} placeholder="+263 71 234 5678" />
            </Form.Item>
          </div>

          <Divider style={{ margin: '16px 0' }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0e172a', marginBottom: 12 }}>
            <Space><IdcardOutlined /> Identity Information</Space>
          </div>

          {/* ---- SECTION: Identity Information ---- */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="Identity Type" name="identityType" rules={[{ required: true, message: 'Select ID type' }]}>
              <Select placeholder="Select ID type">
                <Option value="national_id">National ID Card</Option>
                <Option value="passport">Passport</Option>
                <Option value="drivers_license">Driver's License</Option>
                <Option value="voter_id">Voter Registration</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Identity Number" name="identityNumber" rules={[{ required: true, message: 'Enter ID number' }]}>
              <Input prefix={<IdcardOutlined />} placeholder="e.g. 63-2345678-M-08" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="ID Card — Front" name="idFront">
              <Upload.Dragger
                beforeUpload={() => { message.info('ID front image selected'); return false; }}
                maxCount={1}
                accept="image/*"
                style={{ borderRadius: 10, padding: '12px 0' }}
              >
                <div style={{ padding: '8px 0' }}>
                  <FileImageOutlined style={{ fontSize: 28, color: '#3b82f6' }} />
                  <div style={{ marginTop: 4 }}>
                    <Text style={{ fontSize: 12, fontWeight: 500 }}>Upload Front Side</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: 10 }}>Click or drag image here</Text>
                </div>
              </Upload.Dragger>
            </Form.Item>
            <Form.Item label="ID Card — Back" name="idBack">
              <Upload.Dragger
                beforeUpload={() => { message.info('ID back image selected'); return false; }}
                maxCount={1}
                accept="image/*"
                style={{ borderRadius: 10, padding: '12px 0' }}
              >
                <div style={{ padding: '8px 0' }}>
                  <FileImageOutlined style={{ fontSize: 28, color: '#3b82f6' }} />
                  <div style={{ marginTop: 4 }}>
                    <Text style={{ fontSize: 12, fontWeight: 500 }}>Upload Back Side</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: 10 }}>Click or drag image here</Text>
                </div>
              </Upload.Dragger>
            </Form.Item>
          </div>

          <Divider style={{ margin: '16px 0' }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0e172a', marginBottom: 12 }}>
            <Space><SafetyCertificateOutlined /> Role Assignment</Space>
          </div>

          {/* ---- SECTION: Role ---- */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="Position / Job Title" name="position" rules={[{ required: true }]}>
              <Input placeholder="e.g. Operations Manager" />
            </Form.Item>
            <Form.Item label="Assign Role" name="role" rules={[{ required: true }]}>
              <Select placeholder="Select a role">
                {roles.map(r => (
                  <Option key={r.key} value={r.name}>
                    <Space>
                      <Badge color={r.color} />
                      {r.name}
                      <Text type="secondary" style={{ fontSize: 11 }}>— {r.modules.length} modules</Text>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* ============================================================ */}
      {/* EDIT EMPLOYEE MODAL                                          */}
      {/* ============================================================ */}
      <Modal
        title={<Space><EditOutlined /> Edit Employee — {selectedEmployee?.name}</Space>}
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleEditEmployee}
        okText="Save Changes"
        okButtonProps={{ style: { background: '#0e172a' } }}
        width={750}
      >
        <Form form={editForm} layout="vertical">
          {/* ---- SECTION: Profile Picture ---- */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <Upload
              name="avatar"
              listType="picture-circle"
              showUploadList={false}
              beforeUpload={() => { message.info('Profile photo selected'); return false; }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <CameraOutlined style={{ fontSize: 24, color: '#94a3b8' }} />
                <Text type="secondary" style={{ fontSize: 10, marginTop: 4 }}>Change Photo</Text>
              </div>
            </Upload>
            <Text type="secondary" style={{ fontSize: 11 }}>Click to update profile picture (JPG, PNG, max 2MB)</Text>
          </div>

          <Divider style={{ margin: '16px 0' }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0e172a', marginBottom: 12 }}>
            <Space><UserOutlined /> Personal Information</Space>
          </div>

          {/* ---- SECTION: Personal Information ---- */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'First name is required' }]}>
              <Input prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Last name is required' }]}>
              <Input prefix={<UserOutlined />} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="Email Address" name="email" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
              <Input prefix={<MailOutlined />} />
            </Form.Item>
            <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: 'Phone is required' }]}>
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item label="Date of Birth" name="dob">
              <DatePicker style={{ width: '100%' }} placeholder="Select date" />
            </Form.Item>
            <Form.Item label="Gender" name="gender">
              <Select placeholder="Select">
                <Option value="male"><Space><ManOutlined /> Male</Space></Option>
                <Option value="female"><Space><WomanOutlined /> Female</Space></Option>
                <Option value="other">Other</Option>
                <Option value="prefer_not">Prefer not to say</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Blood Group" name="bloodGroup">
              <Select placeholder="Select">
                <Option value="A+">A+</Option>
                <Option value="A-">A-</Option>
                <Option value="B+">B+</Option>
                <Option value="B-">B-</Option>
                <Option value="O+">O+</Option>
                <Option value="O-">O-</Option>
                <Option value="AB+">AB+</Option>
                <Option value="AB-">AB-</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="Residential Address" name="address">
            <Input prefix={<HomeOutlined />} />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="Emergency Contact Name" name="emergencyName">
              <Input />
            </Form.Item>
            <Form.Item label="Emergency Contact Phone" name="emergencyPhone">
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
          </div>

          <Divider style={{ margin: '16px 0' }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0e172a', marginBottom: 12 }}>
            <Space><IdcardOutlined /> Identity Information</Space>
          </div>

          {/* ---- SECTION: Identity Information ---- */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="Identity Type" name="identityType" rules={[{ required: true, message: 'Select ID type' }]}>
              <Select>
                <Option value="national_id">National ID Card</Option>
                <Option value="passport">Passport</Option>
                <Option value="drivers_license">Driver's License</Option>
                <Option value="voter_id">Voter Registration</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Identity Number" name="identityNumber" rules={[{ required: true, message: 'Enter ID number' }]}>
              <Input prefix={<IdcardOutlined />} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="ID Card — Front" name="idFront">
              <Upload.Dragger
                beforeUpload={() => { message.info('ID front image selected'); return false; }}
                maxCount={1}
                accept="image/*"
                style={{ borderRadius: 10, padding: '12px 0' }}
              >
                <div style={{ padding: '8px 0' }}>
                  <FileImageOutlined style={{ fontSize: 28, color: '#3b82f6' }} />
                  <div style={{ marginTop: 4 }}>
                    <Text style={{ fontSize: 12, fontWeight: 500 }}>Upload Front Side</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: 10 }}>Click or drag image here</Text>
                </div>
              </Upload.Dragger>
            </Form.Item>
            <Form.Item label="ID Card — Back" name="idBack">
              <Upload.Dragger
                beforeUpload={() => { message.info('ID back image selected'); return false; }}
                maxCount={1}
                accept="image/*"
                style={{ borderRadius: 10, padding: '12px 0' }}
              >
                <div style={{ padding: '8px 0' }}>
                  <FileImageOutlined style={{ fontSize: 28, color: '#3b82f6' }} />
                  <div style={{ marginTop: 4 }}>
                    <Text style={{ fontSize: 12, fontWeight: 500 }}>Upload Back Side</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: 10 }}>Click or drag image here</Text>
                </div>
              </Upload.Dragger>
            </Form.Item>
          </div>

          <Divider style={{ margin: '16px 0' }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0e172a', marginBottom: 12 }}>
            <Space><SafetyCertificateOutlined /> Role Assignment</Space>
          </div>

          {/* ---- SECTION: Role ---- */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="Position / Job Title" name="position" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Assign Role" name="role" rules={[{ required: true }]}>
              <Select>
                {roles.map(r => (
                  <Option key={r.key} value={r.name}>
                    <Space>
                      <Badge color={r.color} />
                      {r.name}
                      <Text type="secondary" style={{ fontSize: 11 }}>— {r.modules.length} modules</Text>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* ============================================================ */}
      {/* ACTIVITY LOG MODAL                                           */}
      {/* ============================================================ */}
      <Modal
        title={<Space><HistoryOutlined /> Activity Log — {selectedEmployee?.name}</Space>}
        open={activityLogModal}
        onCancel={() => setActivityLogModal(false)}
        footer={null}
        width={600}
      >
        <div style={{ maxHeight: 400, overflow: 'auto' }}>
          {activityLogs.map((log, i) => (
            <div key={i} style={{
              padding: '10px 12px', borderBottom: '1px solid #f1f5f9',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <Text style={{ fontSize: 13 }}>{log.action}</Text><br />
                <Tag style={{ fontSize: 10, marginTop: 4 }}>{log.module}</Tag>
              </div>
              <Text type="secondary" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{log.time}</Text>
            </div>
          ))}
        </div>
      </Modal>

      {/* ============================================================ */}
      {/* TRASHED EMPLOYEES MODAL                                      */}
      {/* ============================================================ */}
      <Modal
        title={<Space><RestOutlined /> Trashed Employees</Space>}
        open={trashedModalOpen}
        onCancel={() => setTrashedModalOpen(false)}
        footer={null}
        width={650}
      >
        {trashedEmployees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <RestOutlined style={{ fontSize: 40, color: '#d1d5db' }} />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">No trashed employees</Text>
            </div>
          </div>
        ) : (
          <Table
            dataSource={trashedEmployees}
            size="small"
            pagination={false}
            columns={[
              {
                title: 'Employee', render: (_: any, r: Employee) => (
                  <Space>
                    <Avatar size="small" style={{ background: '#94a3b8' }}>{r.avatar}</Avatar>
                    <div>
                      <Text>{r.name}</Text><br />
                      <Text type="secondary" style={{ fontSize: 11 }}>{r.email}</Text>
                    </div>
                  </Space>
                ),
              },
              { title: 'Position', dataIndex: 'position' },
              {
                title: 'Action', width: 150, render: (_: any, r: Employee) => (
                  <Space>
                    <Button size="small" type="primary" ghost onClick={() => handleRestoreEmployee(r.key)}>Restore</Button>
                    <Popconfirm title="Permanently delete?" onConfirm={() => handlePermanentDelete(r.key)} okButtonProps={{ danger: true }}>
                      <Button size="small" danger>Delete</Button>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />
        )}
      </Modal>

      {/* ============================================================ */}
      {/* VIEW EMPLOYEE DETAILS MODAL                                  */}
      {/* ============================================================ */}
      <Modal
        title={<Space><EyeOutlined /> Employee Registration Details</Space>}
        open={detailsModalOpen}
        onCancel={() => setDetailsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailsModalOpen(false)}>Close</Button>,
          <Button key="edit" type="primary" icon={<EditOutlined />} onClick={() => { 
            setDetailsModalOpen(false); 
            const [firstName, ...lastNameParts] = selectedEmployee.name.split(' ');
            editForm.setFieldsValue({ ...selectedEmployee, firstName, lastName: lastNameParts.join(' ') }); 
            setEditModalOpen(true); 
          }} style={{ background: '#0e172a' }}>
            Edit Employee
          </Button>
        ]}
        width={700}
      >
        {selectedEmployee && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Header: Avatar & Basic Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <Avatar size={64} style={{ background: '#0e172a', fontWeight: 600, fontSize: 24 }}>{selectedEmployee.avatar}</Avatar>
              <div style={{ flex: 1 }}>
                <Title level={4} style={{ margin: 0 }}>{selectedEmployee.name}</Title>
                <Text type="secondary">{selectedEmployee.position}</Text>
                <div style={{ marginTop: 8 }}>
                  <Tag color={selectedEmployee.status === 'active' ? 'success' : 'default'} style={{ textTransform: 'capitalize' }}>
                    {selectedEmployee.status}
                  </Tag>
                  <Tag color={roles.find(r => r.name === selectedEmployee.role)?.color || '#64748b'}>{selectedEmployee.role}</Tag>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div>
              <Divider style={{ margin: '0 0 16px 0' }} />
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Personal Information</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                <div><Text type="secondary" style={{ fontSize: 11 }}>Email Address</Text><br /><Text strong>{selectedEmployee.email}</Text></div>
                <div><Text type="secondary" style={{ fontSize: 11 }}>Phone Number</Text><br /><Text strong>{selectedEmployee.phone || '—'}</Text></div>
                <div><Text type="secondary" style={{ fontSize: 11 }}>Date of Birth</Text><br /><Text strong>15 May 1990</Text></div>
                <div><Text type="secondary" style={{ fontSize: 11 }}>Gender</Text><br /><Text strong>Female</Text></div>
                <div style={{ gridColumn: 'span 2' }}><Text type="secondary" style={{ fontSize: 11 }}>Residential Address</Text><br /><Text strong>42 Samora Machel Ave, Harare, Zimbabwe</Text></div>
                <div><Text type="secondary" style={{ fontSize: 11 }}>Emergency Contact</Text><br /><Text strong>John Doe</Text></div>
                <div><Text type="secondary" style={{ fontSize: 11 }}>Emergency Phone</Text><br /><Text strong>+263 71 234 5678</Text></div>
              </div>
            </div>

            {/* Identity Info */}
            <div>
              <Divider style={{ margin: '0 0 16px 0' }} />
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Identity Information</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px', marginBottom: 16 }}>
                <div><Text type="secondary" style={{ fontSize: 11 }}>Identity Type</Text><br /><Text strong>National ID Card</Text></div>
                <div><Text type="secondary" style={{ fontSize: 11 }}>Identity Number</Text><br /><Text strong>63-2345678-M-08</Text></div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ padding: 12, border: '1px dashed #cbd5e1', borderRadius: 8, textAlign: 'center', background: '#f8fafc' }}>
                  <IdcardOutlined style={{ fontSize: 32, color: '#94a3b8', marginBottom: 8 }} />
                  <div><Text strong style={{ fontSize: 12 }}>ID Card (Front)</Text></div>
                  <Button type="link" size="small" icon={<EyeOutlined />}>View Image</Button>
                </div>
                <div style={{ padding: 12, border: '1px dashed #cbd5e1', borderRadius: 8, textAlign: 'center', background: '#f8fafc' }}>
                  <IdcardOutlined style={{ fontSize: 32, color: '#94a3b8', marginBottom: 8 }} />
                  <div><Text strong style={{ fontSize: 12 }}>ID Card (Back)</Text></div>
                  <Button type="link" size="small" icon={<EyeOutlined />}>View Image</Button>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div>
              <Divider style={{ margin: '0 0 16px 0' }} />
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>System Information</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                <div><Text type="secondary" style={{ fontSize: 11 }}>Date Joined</Text><br /><Text strong>{selectedEmployee.joinedAt}</Text></div>
                <div><Text type="secondary" style={{ fontSize: 11 }}>Last Active</Text><br /><Text strong>{selectedEmployee.lastActive}</Text></div>
                <div style={{ gridColumn: 'span 2' }}>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>Module Access ({selectedEmployee.modules.length})</Text>
                  <Space wrap size={4}>
                    {selectedEmployee.modules.map(m => {
                      const mod = serviceModules.find(sm => sm.key === m);
                      return <Tag key={m} style={{ margin: 0, fontSize: 11 }}>{mod?.icon} {mod?.label}</Tag>;
                    })}
                  </Space>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================
export const EnterpriseSettingsPage: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Roles & Permissions</Title>
        <Text type="secondary">Manage employee roles, module access permissions, and team members</Text>
      </div>

      <Tabs
        defaultActiveKey="attribute"
        type="card"
        size="large"
        items={[
          {
            key: 'attribute',
            label: <span><LockOutlined /> Attribute</span>,
            children: <AttributeTab />,
          },
        ]}
        style={{ background: 'white', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}
      />
    </div>
  );
};
