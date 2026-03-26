import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Row, Col, Button, Tag, Space, 
  Table, Modal, message, Empty, Progress, Statistic, 
  Divider, Alert, Tabs, Input, Segmented, Drawer, Form,
  InputNumber, Badge, Avatar, List, Switch, Descriptions
} from 'antd';
import { 
  WalletOutlined, ShoppingCartOutlined, HistoryOutlined, 
  CarOutlined, SafetyCertificateOutlined, ThunderboltOutlined, 
  ClockCircleOutlined, CheckCircleOutlined, PlusOutlined,
  SearchOutlined, TeamOutlined, BarChartOutlined, SettingOutlined,
  EditOutlined, DeleteOutlined, InfoCircleOutlined, RestOutlined,
  RollbackOutlined, DeleteFilled, CloudDownloadOutlined
} from '@ant-design/icons';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell
} from 'recharts';
import { fintechHubApi } from '../../api/fintechHubApi';
import { adminApi } from '../../api/adminApi';

const { Title, Text, Paragraph } = Typography;

export const DriverBundleHub: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [bundles, setBundles] = useState<any[]>([
    { id: 'pkg-1', name: 'Starter Pack', rides: 50, price: 10, expiryDays: 30, sales: 1245, status: 'Active' },
    { id: 'pkg-2', name: 'Business Pack', rides: 250, price: 45, expiryDays: 60, sales: 890, status: 'Active' },
    { id: 'pkg-3', name: 'Enterprise Hub', rides: 1000, price: 160, expiryDays: 180, sales: 320, status: 'Inactive' }
  ]);
  const [salesData] = useState([
    { date: '2024-03-01', revenue: 1200, volume: 45 },
    { date: '2024-03-02', revenue: 1900, volume: 52 },
    { date: '2024-03-03', revenue: 1500, volume: 38 },
    { date: '2024-03-04', revenue: 2500, volume: 65 },
    { date: '2024-03-05', revenue: 3200, volume: 72 },
    { date: '2024-03-06', revenue: 2800, volume: 58 },
    { date: '2024-03-07', revenue: 4100, volume: 85 },
  ]);
  const [trashedBundles, setTrashedBundles] = useState<any[]>([]);
  const [driverBalances, setDriverBalances] = useState<any[]>([
    { id: 'D-9901', name: 'John Makoni', vehicle: 'Toyota Belta', balance: 42, status: 'Active', trend: 'up' },
    { id: 'D-8821', name: 'Sarah Chipo', vehicle: 'Nissan Note', balance: 5, status: 'Low', trend: 'down' },
    { id: 'D-4412', name: 'Mike N.', vehicle: 'Honda Fit', balance: 128, status: 'Active', trend: 'up' },
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<any>(null);
  const [form] = Form.useForm();

  const handleSaveBundle = (values: any) => {
    if (editingBundle) {
      setBundles(prev => prev.map(b => b.id === editingBundle.id ? { ...b, ...values } : b));
      message.success('Bundle configuration updated');
    } else {
      const newBundle = { ...values, id: `pkg-${Date.now()}`, sales: 0, status: 'Active' };
      setBundles(prev => [...prev, newBundle]);
      message.success('New bundle package created');
    }
    setIsDrawerOpen(false);
    setEditingBundle(null);
    form.resetFields();
  };

  const toggleBundleStatus = (id: string) => {
    setBundles(prev => prev.map(b => {
      if (b.id === id) {
        const newStatus = b.status === 'Active' ? 'Inactive' : 'Active';
        message.info(`${b.name} set to ${newStatus}`);
        return { ...b, status: newStatus };
      }
      return b;
    }));
  };

  const deleteToTrash = (bundle: any) => {
    setBundles(prev => prev.filter(b => b.id !== bundle.id));
    setTrashedBundles(prev => [...prev, bundle]);
    message.warning(`${bundle.name} moved to trash`);
  };

  const restoreFromTrash = (bundle: any) => {
    setTrashedBundles(prev => prev.filter(b => b.id !== bundle.id));
    setBundles(prev => [...prev, bundle]);
    message.success(`${bundle.name} restored to inventory`);
  };

  const handleExportSales = () => {
    const headers = ['Transaction ID', 'Driver', 'Package', 'Amount', 'Time', 'Method'];
    const data = [
      ['TX-1002', 'Mike N.', 'Starter Pack', 10, '2 mins ago', 'Paynow'],
      ['TX-1001', 'Sarah C.', 'Business Pack', 45, '15 mins ago', 'Paynow'],
      ['TX-0999', 'John M.', 'Enterprise Hub', 160, '1 hr ago', 'EcoCash']
    ];
    
    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashdrive_sales_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    message.success('Sales report exported');
  };

// --- Sub-components (Tabs) ---

const InventoryTab: React.FC<{ 
  bundles: any[], 
  onToggle: (id: string) => void, 
  onEdit: (bundle: any) => void, 
  onDelete: (bundle: any) => void,
  onCreate: () => void
}> = ({ bundles, onToggle, onEdit, onDelete, onCreate }) => (
  <div style={{ marginTop: 20 }}>
    <Row gutter={[24, 24]}>
      {bundles.map((bundle, idx) => (
        <Col xs={24} sm={12} lg={8} key={idx}>
          <Card 
            hoverable 
            style={{ borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}
            styles={{ body: { padding: 0 } }}
          >
            <div style={{ background: '#f8fafc', padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong style={{ fontSize: 16 }}>{bundle.name}</Text>
                <Space>
                  <Switch 
                    size="small" 
                    checked={bundle.status === 'Active'} 
                    onChange={() => onToggle(bundle.id)} 
                  />
                  <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(bundle)} />
                  <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(bundle)} />
                </Space>
              </div>
              <Title level={2} style={{ margin: '16px 0 0 0' }}>{bundle.rides} <small style={{ fontSize: 14, color: '#64748b' }}>RIDES</small></Title>
            </div>
            <div style={{ padding: '24px' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic title="Price" value={bundle.price} prefix="$" valueStyle={{ fontSize: 18 }} />
                </Col>
                <Col span={12}>
                  <Statistic title="Total Sales" value={bundle.sales} valueStyle={{ fontSize: 18, color: '#10b981' }} />
                </Col>
              </Row>
              <Divider style={{ margin: '16px 0' }} />
              <Space orientation="vertical" size={4} style={{ width: '100%' }}>
                <Text type="secondary" style={{ fontSize: 12 }}><ClockCircleOutlined /> Valid for {bundle.expiryDays} days</Text>
                <Progress percent={75} size="small" status="active" strokeColor="#3b82f6" />
              </Space>
            </div>
          </Card>
        </Col>
      ))}
      <Col xs={24} sm={12} lg={8}>
        <div 
          onClick={onCreate}
          style={{ 
            height: '100%', 
            minHeight: 250,
            border: '2px dashed #e2e8f0', 
            borderRadius: 16, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            background: '#fff',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = '#10b981'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
        >
          <PlusOutlined style={{ fontSize: 32, color: '#10b981', marginBottom: 12 }} />
          <Text strong>Create New Package</Text>
          <Text type="secondary">Define size, price & expiry</Text>
        </div>
      </Col>
    </Row>
  </div>
);

const ReportingTab: React.FC<{ salesData: any[], bundles: any[], onExport: () => void }> = ({ salesData, bundles, onExport }) => (
  <div style={{ marginTop: 20 }}>
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={16}>
        <Card 
          title={<Space><BarChartOutlined /> Revenue Trend (Last 7 Days)</Space>} 
          variant="borderless" 
          className="shadow-sm"
          style={{ borderRadius: 16 }}
          extra={
            <Space>
              <Button size="small">Last 30 Days</Button>
              <Button size="small" icon={<CloudDownloadOutlined />} onClick={onExport}>Export CSV</Button>
            </Space>
          }
        >
          <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `$${v}`} />
                <ChartTooltip 
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(v) => [`$${v}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Col>
      <Col xs={24} lg={8}>
        <Card 
          title="Sales by Package" 
          variant="borderless" 
          className="shadow-sm" 
          style={{ borderRadius: 16, height: '100%' }}
        >
          <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bundles} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 11 }} />
                      <ChartTooltip cursor={{ fill: '#f8fafc' }} />
                      <Bar dataKey="sales" radius={[0, 4, 4, 0]} barSize={20}>
                          {bundles.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : '#f59e0b'} />
                          ))}
                      </Bar>
                  </BarChart>
              </ResponsiveContainer>
          </div>
        </Card>
      </Col>
      <Col span={24}>
         <Card title="Sales Detailed Log" variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
            <Table 
              dataSource={[
                  { id: 'TX-1002', driver: 'Mike N.', bundle: 'Starter Pack', amount: 10, time: '2 mins ago', method: 'Paynow', category: 'Economy' },
                  { id: 'TX-1001', driver: 'Sarah C.', bundle: 'Business Pack', amount: 45, time: '15 mins ago', method: 'Paynow', category: 'Premium' },
                  { id: 'TX-0999', driver: 'John M.', bundle: 'Enterprise Hub', amount: 160, time: '1 hr ago', method: 'EcoCash', category: 'Delivery' },
              ]}
              columns={[
                  { title: 'Transaction ID', dataIndex: 'id', key: 'id', render: (t) => <Text strong>{t}</Text> },
                  { title: 'Driver', dataIndex: 'driver', key: 'driver' },
                  { 
                      title: 'Vehicle', 
                      dataIndex: 'category', 
                      key: 'category',
                      render: (cat) => <Tag color={cat === 'Premium' ? 'gold' : cat === 'Delivery' ? 'blue' : 'default'} style={{ fontSize: 11 }}>{cat}</Tag>
                  },
                  { title: 'Package', dataIndex: 'bundle', key: 'bundle' },
                  { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (a) => <Text strong>${a}</Text> },
                  { title: 'Time', dataIndex: 'time', key: 'time' },
                  { title: 'Method', dataIndex: 'method', key: 'method', render: (m) => <Tag>{m}</Tag> }
              ]}
              pagination={false}
            />
         </Card>
      </Col>
    </Row>
  </div>
);

const MasterOversightTab: React.FC<{ driverBalances: any[] }> = ({ driverBalances }) => (
  <div style={{ marginTop: 20 }}>
    <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
          <Title level={5} style={{ margin: 0 }}>Driver Ride Balances</Title>
          <Input 
              placeholder="Search driver name or ID..." 
              prefix={<SearchOutlined />} 
              style={{ width: 300 }}
              allowClear
          />
      </div>
      <Table 
        dataSource={driverBalances}
        pagination={{ pageSize: 5 }}
        rowKey="id"
        columns={[
          {
              title: 'Driver',
              key: 'driver',
              render: (_, record) => (
                  <Space>
                      <Avatar icon={<CarOutlined />} style={{ background: '#f1f5f9', color: '#64748b' }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <Text strong>{record.name}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>{record.id}</Text>
                      </div>
                  </Space>
              )
          },
          { title: 'Vehicle', dataIndex: 'vehicle', key: 'vehicle' },
          { 
              title: 'Current Balance', 
              dataIndex: 'balance', 
              key: 'balance',
              render: (val, record) => (
                  <Space orientation="vertical" size={2}>
                      <Text strong style={{ color: record.status === 'Low' ? '#ef4444' : '#0f172a' }}>{val} Rides</Text>
                      <Progress 
                          percent={val > 100 ? 100 : val} 
                          size="small" 
                          showInfo={false} 
                          strokeColor={record.status === 'Low' ? '#ef4444' : '#10b981'} 
                      />
                  </Space>
              )
          },
          { 
              title: 'Status', 
              dataIndex: 'status', 
              key: 'status',
              render: (status) => <Tag color={status === 'Low' ? 'error' : 'green'}>{status}</Tag>
          },
          {
              title: 'Actions',
              key: 'actions',
              render: () => (
                  <Space>
                      <Button size="small" icon={<WalletOutlined />}>Refill</Button>
                      <Button size="small" icon={<HistoryOutlined />}>Logs</Button>
                  </Space>
              )
          }
        ]}
      />
    </Card>
  </div>
);

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Row justify="space-between" align="bottom" style={{ marginBottom: 32 }}>
          <Col>
            <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Ride Bundle Management</Title>
            <Text type="secondary">Configure prepaid packages and oversee system-wide driver ride balances.</Text>
          </Col>
          <Col>
            <Space>
              <Button icon={<RestOutlined />} danger onClick={() => setIsTrashOpen(true)}>Trash ({trashedBundles.length})</Button>
              <Button icon={<BarChartOutlined />} onClick={handleExportSales}>Export Sales</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsDrawerOpen(true)}>Add Package</Button>
            </Space>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
          <Col xs={24} md={6}>
            <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 12 }}>
                <Statistic title="Total Active Bundles" value={2450} prefix={<SafetyCertificateOutlined style={{ color: '#10b981' }} />} />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 12 }}>
                <Statistic title="Month Revenue" value={12450} prefix={<span style={{ color: '#3b82f6' }}>$</span>} />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 12 }}>
                <Statistic title="Low Balance Alerts" value={12} prefix={<ClockCircleOutlined style={{ color: '#ef4444' }} />} />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 12 }}>
                <Statistic title="System Sync" value="99.9%" prefix={<ThunderboltOutlined style={{ color: '#00b894' }} />} />
            </Card>
          </Col>
        </Row>

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={[
            { 
              key: '1', 
              label: <Space><SettingOutlined /> Bundle Inventory</Space>, 
              children: <InventoryTab 
                          bundles={bundles} 
                          onToggle={toggleBundleStatus}
                          onEdit={(b) => {
                            setEditingBundle(b);
                            form.setFieldsValue(b);
                            setIsDrawerOpen(true);
                          }}
                          onDelete={deleteToTrash}
                          onCreate={() => {
                            setEditingBundle(null);
                            setIsDrawerOpen(true);
                          }}
                        /> 
            },
            { 
              key: '2', 
              label: <Space><TeamOutlined /> Driver Oversight</Space>, 
              children: <MasterOversightTab driverBalances={driverBalances} /> 
            },
            { 
              key: '3', 
              label: <Space><BarChartOutlined /> Sales Reporting</Space>, 
              children: <ReportingTab salesData={salesData} bundles={bundles} onExport={handleExportSales} /> 
            },
          ]}
        />

        <Drawer
          title={editingBundle ? 'Edit Bundle Package' : 'Create New Bundle Package'}
          open={isDrawerOpen}
          onClose={() => { setIsDrawerOpen(false); setEditingBundle(null); }}
          width={400}
          extra={<Button type="primary" onClick={() => form.submit()}>Save Config</Button>}
          destroyOnClose
        >
          <Form form={form} layout="vertical" onFinish={handleSaveBundle} initialValues={{ expiryDays: 30 }}>
            <Form.Item label="Package Name" name="name" rules={[{ required: true, message: 'Enter package name' }]}>
              <Input placeholder="Ex: Gold Starter Pack" />
            </Form.Item>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Ride Count" name="rides" rules={[{ required: true }]}>
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Price ($)" name="price" rules={[{ required: true }]}>
                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label="Expiry Duration (Days)" name="expiryDays">
                <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Divider />
            <Alert 
                message="Global Availability"
                description="Once saved, this bundle will be visible to all active drivers in the Zimbabwean network for purchase."
                type="info"
                showIcon
                icon={<InfoCircleOutlined />}
                style={{ borderRadius: 12 }}
            />
          </Form>
        </Drawer>
        <Drawer
          title={<Space><RestOutlined /> Trashed Bundles</Space>}
          open={isTrashOpen}
          onClose={() => setIsTrashOpen(false)}
          width={500}
        >
          {trashedBundles.length === 0 ? (
            <Empty description="Trash is empty" style={{ marginTop: 100 }} />
          ) : (
            <List
              dataSource={trashedBundles}
              renderItem={bundle => (
                <List.Item
                  actions={[
                    <Button key="restore" type="text" icon={<RollbackOutlined />} onClick={() => restoreFromTrash(bundle)}>Restore</Button>,
                    <Button key="delete" type="text" danger icon={<DeleteFilled />} onClick={() => {
                        setTrashedBundles(prev => prev.filter(b => b.id !== bundle.id));
                        message.error(`${bundle.name} permanently deleted`);
                    }}>Delete</Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<CarOutlined />} style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} />}
                    title={bundle.name}
                    description={`${bundle.rides} Rides • $${bundle.price}`}
                  />
                </List.Item>
              )}
            />
          )}
        </Drawer>
      </div>
    </div>
  );
};

