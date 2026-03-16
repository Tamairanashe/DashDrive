import React, { useState } from 'react';
import { 
  Typography, Card, Row, Col, Tabs, Space, InputNumber, 
  Form, Button, Divider, Table, Tag, message, Alert,
  Switch, Tooltip, Input, List, Statistic, Progress, Badge,
  Select, Segmented, Drawer, DatePicker, TimePicker, Radio, Checkbox
} from 'antd';
import { 
  CarOutlined, 
  ShoppingOutlined, 
  CoffeeOutlined, 
  GlobalOutlined,
  SaveOutlined,
  DollarOutlined,
  LineChartOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  DashboardOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ThunderboltOutlined,
  HistoryOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  BoxPlotOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  CalculatorOutlined,
  SyncOutlined,
  RocketOutlined,
  ArrowRightOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const { Title, Text, Paragraph } = Typography;

type ServiceVertical = 'RIDE' | 'FOOD' | 'MART' | 'PARCEL' | 'SHOPPING';

const FareManagementHub: React.FC = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [vertical, setVertical] = useState<ServiceVertical>('RIDE');

  const [surgeForm] = Form.useForm();
  const [isSurgeDrawerVisible, setIsSurgeDrawerVisible] = useState(false);
  const [isParcelDetailVisible, setIsParcelDetailVisible] = useState(false);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [parcelZones, setParcelZones] = useState([
    { id: 1, name: 'All Over The World', drivers: 8, categories: ['Documents', 'Fragile', 'Gift'] },
    { id: 2, name: 'Asia', drivers: 0, categories: ['Documents', 'Fragile', 'Gift'] },
    { id: 3, name: 'Egypt', drivers: 0, categories: ['Documents', 'Fragile', 'Gift'] },
  ]);

  const allCategories = ['Documents', 'Fragile', 'Gift'];
  const [editingSurge, setEditingSurge] = useState<any>(null);
  const [surgeRules, setSurgeRules] = useState([
    { 
      id: '#10002', 
      name: 'Time-based Pricing', 
      zone: 'All zones',
      extra: '50% for All vehicles, 50% for All parcels',
      date: '03 Apr 26 - 29 May 26',
      rate: 50,
      setupFor: 'both',
      rateType: 'same',
      scheduleType: 'Custom',
      detail: 'See All Custom Times',
      status: 'Upcoming'
    },
    { 
      id: '#10001', 
      name: 'Extra Charge', 
      zone: 'All zones',
      extra: '50% for All parcels',
      date: '01 Dec 25 - 31 Mar 26',
      rate: 50,
      setupFor: 'parcel',
      rateType: 'same',
      scheduleType: 'Weekly',
      detail: '12:00 AM - 11:59 PM (Fri-Sun)',
      status: 'Ongoing'
    },
    { 
      id: '#10000', 
      name: 'Rush Hour Boost', 
      zone: 'All zones',
      extra: '50% for All vehicles, 50% for All parcels',
      date: '28 Aug 25 - 31 Oct 25',
      rate: 50,
      setupFor: 'both',
      rateType: 'same',
      scheduleType: 'Daily',
      detail: '09:00 AM - 08:59 PM',
      status: 'Expired'
    }
  ]);

  const handleSave = () => {
    setLoading(true);
    
    if (vertical === 'PARCEL' && isParcelDetailVisible && selectedZone) {
      // Logic to update the categories for the selected zone
      const updatedZones = parcelZones.map(z => 
        z.id === selectedZone.id ? { ...z, categories: selectedZone.categories } : z
      );
      setParcelZones(updatedZones);
    }

    message.loading(`Updating ${vertical} pricing configuration...`, 1.5).then(() => {
      setLoading(false);
      message.success(`${vertical} pricing updated successfully.`);
      if (vertical === 'PARCEL') setIsParcelDetailVisible(false);
    });
  };

  const handleSaveSurge = (values: any) => {
    setLoading(true);
    message.loading(editingSurge ? "Updating surge rule..." : "Creating surge rule...", 1).then(() => {
      const newRule = {
        id: editingSurge ? editingSurge.id : `#${Math.floor(10000 + Math.random() * 9000).toString()}`,
        name: values.name,
        zone: values.zone === 'all' ? 'All zones' : values.zone,
        extra: `${values.rate}% for ${values.setupFor === 'both' ? 'All vehicles & parcels' : values.setupFor}`,
        date: 'Current Date Range', // Mocked for now
        rate: values.rate,
        setupFor: values.setupFor,
        rateType: values.rateType,
        scheduleType: values.scheduleType,
        detail: 'Dynamic Time Range', // Mocked for now
        status: editingSurge ? editingSurge.status : 'Upcoming'
      };

      if (editingSurge) {
        setSurgeRules(surgeRules.map(r => r.id === editingSurge.id ? newRule : r));
      } else {
        setSurgeRules([newRule, ...surgeRules]);
      }

      setLoading(false);
      setIsSurgeDrawerVisible(false);
      setEditingSurge(null);
      surgeForm.resetFields();
      message.success(`Surge rule ${editingSurge ? 'updated' : 'created'} successfully.`);
    });
  };

  const handleDeleteSurge = (id: string) => {
    setSurgeRules(surgeRules.filter(r => r.id !== id));
    message.success('Surge rule removed successfully.');
  };

  const openSurgeDrawer = (rule?: any) => {
    if (rule) {
      setEditingSurge(rule);
      surgeForm.setFieldsValue({
        name: rule.name,
        zone: rule.zone === 'All zones' ? 'all' : rule.zone.toLowerCase(),
        setupFor: rule.setupFor,
        rateType: rule.rateType,
        rate: rule.rate,
        scheduleType: rule.scheduleType,
        note: rule.note
      });
    } else {
      setEditingSurge(null);
      surgeForm.resetFields();
    }
    setIsSurgeDrawerVisible(true);
  };

  const renderBasePricing = () => {
    if (vertical === 'PARCEL') {
      return renderParcelZoneSetup();
    }
    
    if (vertical === 'RIDE') {
      return (
        <Row gutter={24}>
          <Col span={14}>
            <Title level={5}>{vertical} Distance & Time Matrix</Title>
            <Paragraph type="secondary">Primary math for {vertical.toLowerCase()} costs based on usage.</Paragraph>
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}><Form.Item label="Base Fare ($)"><InputNumber defaultValue={2.50} style={{ width: '100%' }} prefix="$" /></Form.Item></Col>
                <Col span={12}><Form.Item label="Price Per KM ($)"><InputNumber defaultValue={0.80} style={{ width: '100%' }} prefix="$" /></Form.Item></Col>
                <Col span={12}><Form.Item label="Price Per Minute ($)"><InputNumber defaultValue={0.15} style={{ width: '100%' }} prefix="$" /></Form.Item></Col>
                <Col span={12}><Form.Item label="Minimum Fare ($)"><InputNumber defaultValue={5.00} style={{ width: '100%' }} prefix="$" /></Form.Item></Col>
              </Row>
              <Divider />
              <Title level={5}>Dynamic Surge Ceiling</Title>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>Enable Demand-Based Multipliers</Text>
                <Switch defaultChecked />
              </div>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} style={{ marginTop: 24 }}>Commit {vertical} Fares</Button>
            </Form>
          </Col>
          <Col span={10}>
             <Card variant="borderless" style={{ background: isDark ? '#141414' : '#fafafa', borderRadius: 16 }} title="Simulation Preview">
                <div style={{ padding: '8px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <Text type="secondary">Est. 10km Trip</Text>
                      <Text strong>$12.75</Text>
                   </div>
                   <Divider style={{ margin: '12px 0' }} />
                   <Alert showIcon type="info" title="Surge Sensitivity" description="Current settings allow 4.5x max surge during peak demand." />
                </div>
             </Card>
          </Col>
        </Row>
      );
    }

    return (
      <Row gutter={24}>
        <Col span={14}>
          <Title level={5}>{vertical} Revenue Share & Dispatch Fees</Title>
          <Paragraph type="secondary">Merchant commissions and customer delivery pricing.</Paragraph>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}><Form.Item label="Merchant Commission (%)"><InputNumber defaultValue={25} style={{ width: '100%' }} suffix="%" /></Form.Item></Col>
              <Col span={12}><Form.Item label="Base Delivery Fee ($)"><InputNumber defaultValue={1.50} style={{ width: '100%' }} prefix="$" /></Form.Item></Col>
              <Col span={12}><Form.Item label="Small Order Surcharge ($)"><InputNumber defaultValue={2.00} style={{ width: '100%' }} prefix="$" /></Form.Item></Col>
              <Col span={12}><Form.Item label="Platform Service Fee (%)"><InputNumber defaultValue={5} style={{ width: '100%' }} suffix="%" /></Form.Item></Col>
            </Row>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} style={{ marginTop: 24 }}>Commit {vertical} Logic</Button>
          </Form>
        </Col>
        <Col span={10}>
           <Card variant="borderless" style={{ background: isDark ? '#141414' : '#fafafa', borderRadius: 16 }} title="Order Economics">
              <List size="small">
                <List.Item extra={<Text strong>$12.00</Text>}>Gross Order Value</List.Item>
                <List.Item extra={<Text type="success">-$3.00</Text>}>Merchant Fee (25%)</List.Item>
                <List.Item extra={<Text strong>$1.50</Text>}>Delivery Fee</List.Item>
                <Divider style={{ margin: '8px 0' }} />
                <List.Item extra={<Text strong style={{ color: '#1890ff' }}>$4.50</Text>}>Net Platform Rev</List.Item>
              </List>
           </Card>
        </Col>
      </Row>
    );
  };

  const renderParcelZoneSetup = () => {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={5}>Parcel delivery fare setup</Title>
            <Text type="secondary">Manage your parcel fares zone wise</Text>
          </div>
          <Input 
            placeholder="Search zones..." 
            prefix={<SearchOutlined />} 
            style={{ width: 250 }} 
          />
        </div>
        
        <Title level={5} style={{ fontSize: 14 }}>Operation zone wise parcel fare setup</Title>
        
        <Row gutter={[16, 16]}>
          {parcelZones.map((zone) => (
            <Col span={24} key={zone.id}>
              <Card size="small" variant="borderless" style={{ background: isDark ? '#1a1a1a' : '#f9f9f9', borderRadius: 12 }}>
                <Row align="middle">
                  <Col span={1}>
                    <Text strong type="secondary">{zone.id}</Text>
                  </Col>
                  <Col span={8}>
                    <Title level={5} style={{ margin: 0 }}>{zone.name}</Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>Total driver: {zone.drivers}</Text>
                  </Col>
                  <Col span={10}>
                    <Text strong style={{ fontSize: 12 }}>Available parcel categories in this zone</Text>
                    <div style={{ marginTop: 4 }}>
                      {zone.categories.map(cat => (
                        <Tag key={cat} color="blue" variant="filled" style={{ borderRadius: 4 }}>{cat}</Tag>
                      ))}
                    </div>
                  </Col>
                  <Col span={5} style={{ textAlign: 'right' }}>
                    <Button 
                      type="primary" 
                      size="small" 
                      ghost 
                      icon={<SettingOutlined />}
                      onClick={() => {
                        setSelectedZone(zone);
                        setIsParcelDetailVisible(true);
                      }}
                    >
                      Configure Fare
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  const renderParcelDetailDrawer = () => {
    const weightSlabs = [
      { key: 'base', label: 'Base fare /Kg ($)' },
      { key: '0.5-1', label: '0.5-1 /Kg' },
      { key: '1.1-5', label: '1.1-5 /Kg' },
      { key: '5.1-10', label: '5.1-10 /Kg' },
      { key: '10.1-30', label: '10.1-30 /Kg' },
    ];

    const selectedCategories = selectedZone?.categories || [];
    const checkAll = allCategories.length === selectedCategories.length;
    const indeterminate = selectedCategories.length > 0 && selectedCategories.length < allCategories.length;

    const onCategoryChange = (list: any[]) => {
      setSelectedZone({ ...selectedZone, categories: list });
    };

    const onCheckAllChange = (e: any) => {
      setSelectedZone({ 
        ...selectedZone, 
        categories: e.target.checked ? allCategories : [] 
      });
    };

    return (
      <Drawer
        title={<Space><BoxPlotOutlined color="#1890ff" /> Parcel delivery fare setup - {selectedZone?.name} Zone</Space>}
        size="large"
        onClose={() => setIsParcelDetailVisible(false)}
        open={isParcelDetailVisible}
        extra={
          <Space>
            <Button onClick={() => setIsParcelDetailVisible(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Save Changes</Button>
          </Space>
        }
      >
        <Form layout="vertical">
          <Alert 
            title="Configure Operation Zone Fares"
            description={`Available parcel category in this zone: ${selectedCategories.join(', ') || 'None'}`}
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Title level={5}>Available parcel category in this zone</Title>
          <Card size="small" variant="borderless" style={{ background: isDark ? '#1a1a1a' : '#f9f9f9', marginBottom: 24, borderRadius: 12 }}>
            <div style={{ padding: '8px 16px' }}>
              <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
              >
                Check all
              </Checkbox>
              <Divider type="vertical" />
              <Checkbox.Group
                options={allCategories}
                value={selectedCategories}
                onChange={onCategoryChange}
              />
            </div>
          </Card>

          <Title level={5}>Default fare setup</Title>
          <Row gutter={16}>
             <Col span={12}>
                <Form.Item label="Base Fare ($)" rules={[{ required: true }]}>
                   <InputNumber defaultValue={100} style={{ width: '100%' }} prefix="$" />
                </Form.Item>
             </Col>
             <Col span={12}>
                <Form.Item label="Return fee (%)" rules={[{ required: true }]}>
                   <InputNumber defaultValue={20} style={{ width: '100%' }} suffix="%" />
                </Form.Item>
             </Col>
          </Row>

          <Divider />
          
          <Title level={5}>Category wise delivery fee</Title>
          <Paragraph type="secondary">Here you can setup individual price for each parcel category</Paragraph>
          
          <Table 
            size="small"
            pagination={false}
            bordered
            dataSource={selectedCategories.map((cat: string) => ({ 
              key: cat, 
              category: `${cat} / km ($)`,
              'base': 100,
              '0.5-1': 50,
              '1.1-5': 100,
              '5.1-10': 200,
              '10.1-30': 330
            }))}
            columns={[
              { 
                title: 'Fare', 
                dataIndex: 'category', 
                key: 'category', 
                fixed: 'left', 
                width: 150,
                render: (t) => <Text strong>{t}</Text>
              },
              ...weightSlabs.map(slab => ({
                title: slab.label,
                dataIndex: slab.key,
                key: slab.key,
                render: (val: number) => (
                  <InputNumber defaultValue={val} size="small" style={{ width: '100%' }} prefix="$" />
                )
              }))
            ]}
          />

          <div style={{ marginTop: 32, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
             <Button icon={<HistoryOutlined />}>Reset</Button>
             <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>Submit</Button>
          </div>
        </Form>
      </Drawer>
    );
  };

  const renderGlobalFees = () => (
    <div style={{ padding: 16 }}>
       <Title level={5}>Platform Commissions & Institutional Fees</Title>
       <Paragraph type="secondary">Global administrative charges applied across all DashDrive transactions.</Paragraph>
       <Form layout="vertical">
          <Row gutter={24}>
             <Col span={8}>
                <Form.Item label="Platform Fee ($ per order)">
                   <InputNumber defaultValue={0.45} style={{ width: '100%' }} prefix="$" />
                </Form.Item>
             </Col>
             <Col span={8}>
                <Form.Item label="Insurance Contribution (fixed)">
                   <InputNumber defaultValue={0.10} style={{ width: '100%' }} prefix="$" />
                </Form.Item>
             </Col>
             <Col span={8}>
                <Form.Item label="VAT / Sales Tax (%)">
                   <InputNumber defaultValue={15} style={{ width: '100%' }} suffix="%" />
                </Form.Item>
             </Col>
          </Row>
          <Divider />
          <Title level={5}>Global Settlement Rules</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isDark ? '#1a1a1a' : '#f9f9f9', padding: 12, borderRadius: 8 }}>
                <Text strong>Auto-disburse Earnings</Text>
                <Switch defaultChecked />
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isDark ? '#1a1a1a' : '#f9f9f9', padding: 12, borderRadius: 8 }}>
                <Text strong>Enable Daily Settlement Limit</Text>
                <Switch defaultChecked />
             </div>
          </Space>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} style={{ marginTop: 24 }}>Save Global Rules</Button>
       </Form>
    </div>
  );

  const renderSimulator = () => {
    return (
      <div style={{ padding: 16 }}>
        <Title level={5}>{vertical} Outcome Simulator</Title>
        <Paragraph type="secondary">Enter operational parameters to calculate payouts and net margins.</Paragraph>
        <Card size="small" style={{ background: isDark ? '#141414' : '#fafafa' }}>
           <Form layout="vertical">
              <Row gutter={16}>
                 <Col span={8}>
                    <Form.Item label={vertical === 'RIDE' ? 'Distance (KM)' : 'Subtotal ($)'}>
                       <InputNumber defaultValue={15} style={{ width: '100%' }} />
                    </Form.Item>
                 </Col>
                 <Col span={8}>
                    <Form.Item label={vertical === 'RIDE' ? 'Duration (Min)' : 'Distance (KM)'}>
                       <InputNumber defaultValue={25} style={{ width: '100%' }} />
                    </Form.Item>
                 </Col>
                 <Col span={8}>
                    <Form.Item label="Surge / Multiplier">
                       <InputNumber defaultValue={1.2} suffix="x" style={{ width: '100%' }} />
                    </Form.Item>
                 </Col>
              </Row>
              <Divider style={{ margin: '12px 0' }} />
              <Row gutter={32} align="middle">
                 <Col span={12}>
                    <Statistic title="Simulated End-User Total" value={vertical === 'RIDE' ? 24.50 : 38.20} prefix="$" styles={{ content: { color: '#1890ff' } }} />
                 </Col>
                 <Col span={12}>
                    <Statistic title="Simulated Partner Payout" value={vertical === 'RIDE' ? 19.60 : 31.50} prefix="$" />
                 </Col>
              </Row>
           </Form>
        </Card>
      </div>
    );
  };

  return (
    <div style={{ padding: '0 24px 24px 24px' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}><DollarOutlined /> Fare Management Hub</Title>
          <Text type="secondary">Cross-vertical pricing engine, regional overrides, and yield optimization.</Text>
        </div>
      </div>

      <Row gutter={[16, 16]}>
         <Col span={6}>
            <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
               <Statistic 
                 title={`Avg ${vertical} Revenue`} 
                 value={vertical === 'RIDE' ? 14.20 : 8.50} 
                 prefix="$" 
                 styles={{ content: { color: '#10b981' } }} 
                 suffix={<ArrowUpOutlined style={{ fontSize: 14 }} />}
               />
               <Text type="secondary" style={{ fontSize: 12 }}>Per completion</Text>
            </Card>
         </Col>
         <Col span={6}>
            <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
               <Statistic title="Active Reg. Overrides" value={vertical === 'RIDE' ? 12 : 3} prefix={<EnvironmentOutlined />} />
               <Text type="secondary" style={{ fontSize: 12 }}>Unique pricing zones</Text>
            </Card>
         </Col>
         <Col span={6}>
            <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
               <Statistic title="Net Vertical Margin" value={vertical === 'FOOD' ? 12.5 : 22.8} suffix="%" />
               <Progress percent={vertical === 'FOOD' ? 65 : 88} showInfo={false} size="small" strokeColor="#8b5cf6" />
            </Card>
         </Col>
         <Col span={6}>
            <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
               <Statistic title="Optimization Score" value={94} suffix="/100" />
               <Badge status="processing" text="Performing well" />
            </Card>
         </Col>

         <Col span={24}>
            <Card variant="borderless" className="premium-tabs shadow-sm" style={{ borderRadius: 16, minHeight: 600 }}>
               <Tabs
                  activeKey={activeTab}
                  onChange={(key) => {
                    setActiveTab(key);
                    if (key === '1') setVertical('RIDE');
                    if (key === '2') setVertical('PARCEL');
                    if (key === '3') setVertical('FOOD');
                    if (key === '4') setVertical('SHOPPING');
                  }}
                  items={[
                      {
                         key: '1',
                         label: <Space><CarOutlined /> Trip Fare Setup</Space>,
                         children: renderBasePricing()
                      },
                      {
                         key: '2',
                         label: <Space><BoxPlotOutlined /> Parcel Delivery Setup</Space>,
                         children: renderBasePricing()
                      },
                      {
                         key: '3',
                         label: <Space><CoffeeOutlined /> Food Delivery Setup</Space>,
                         children: renderBasePricing()
                      },
                      {
                         key: '4',
                         label: <Space><ShoppingOutlined /> Shopping Delivery Setup</Space>,
                         children: renderBasePricing()
                      },
                      {
                         key: '5',
                         label: <Space><GlobalOutlined /> All Our Services Fee or Fare Setup</Space>,
                         children: renderGlobalFees()
                      },
                      {
                         key: '6',
                         label: <Space><ThunderboltOutlined /> Surge & Boost Setup</Space>,
                         children: (
                           <div style={{ padding: 16 }}>
                              <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <div>
                                    <Title level={5}>Surge Price Setup</Title>
                                    <Text type="secondary">Manage time-based boosts and multi-service price multipliers.</Text>
                                 </div>
                                 <Space>
                                    <Input placeholder="Search by ID, name..." prefix={<SearchOutlined />} style={{ width: 250 }} />
                                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openSurgeDrawer()}>Create Surge Rule</Button>
                                 </Space>
                              </div>

                               <Row gutter={16} style={{ marginBottom: 24 }}>
                                  <Col span={8}>
                                      <Card variant="borderless" style={{ background: isDark ? '#1f1f1f' : '#f0faff', borderRadius: 12 }}>
                                        <Statistic 
                                          title="Upcoming Surges" 
                                          value={surgeRules.filter(r => r.status === 'Upcoming').length} 
                                          styles={{ content: { color: '#faad14' } }} 
                                          prefix={<ClockCircleOutlined />} 
                                        />
                                     </Card>
                                  </Col>
                                  <Col span={8}>
                                     <Card variant="borderless" style={{ background: isDark ? '#162312' : '#f6ffed', borderRadius: 12 }}>
                                        <Statistic 
                                          title="Ongoing Surges" 
                                          value={surgeRules.filter(r => r.status === 'Ongoing').length} 
                                          styles={{ content: { color: '#52c41a' } }} 
                                          prefix={<SyncOutlined spin />} 
                                        />
                                     </Card>
                                  </Col>
                                  <Col span={8}>
                                     <Card variant="borderless" style={{ background: isDark ? '#2a1215' : '#fff1f0', borderRadius: 12 }}>
                                        <Statistic 
                                          title="Expired Rules" 
                                          value={surgeRules.filter(r => r.status === 'Expired').length} 
                                          styles={{ content: { color: '#ff4d4f' } }} 
                                          prefix={<HistoryOutlined />} 
                                        />
                                     </Card>
                                  </Col>
                               </Row>
                              <Table 
                                 size="small"
                                 pagination={false}
                                 dataSource={surgeRules.map((r, index) => ({ ...r, sl: index + 1 }))}
                                 columns={[
                                    { title: 'SL', dataIndex: 'sl', key: 'sl', width: 50 },
                                    { 
                                      title: 'Surge Info', 
                                      key: 'info',
                                      render: (record: any) => (
                                         <div>
                                            <Text strong>{record.name}</Text><br />
                                            <Text type="secondary" style={{ fontSize: 11 }}>{record.id}</Text>
                                         </div>
                                      )
                                    },
                                    { title: 'Zone', dataIndex: 'zone', key: 'zone' },
                                    { 
                                      title: 'Extra Price (%)', 
                                      dataIndex: 'extra', 
                                      key: 'extra',
                                      render: (text) => <Text style={{ fontSize: 12 }}>{text}</Text>
                                    },
                                    { 
                                      title: 'Time & Date', 
                                      dataIndex: 'date', 
                                      key: 'date',
                                      render: (text) => <Space><CalendarOutlined /> {text}</Space>
                                    },
                                    { 
                                      title: 'Statistic', 
                                      key: 'stat',
                                      render: (record: any) => (
                                         <div>
                                            <Tag color="blue">{record.scheduleType}</Tag><br />
                                            <Text style={{ fontSize: 11 }} type="secondary">{record.detail}</Text>
                                         </div>
                                      )
                                    },
                                  { 
                                    title: 'Status', 
                                    key: 'status_toggle',
                                    render: (record: any) => (
                                       <Space direction="vertical" size={0}>
                                          <Badge 
                                            status={record.status === 'Ongoing' ? 'processing' : record.status === 'Upcoming' ? 'warning' : 'default'} 
                                            text={record.status} 
                                          />
                                          <Switch 
                                            size="small" 
                                            defaultChecked={record.status !== 'Expired'} 
                                            onChange={(checked) => message.info(`Surge rule ${record.id} ${checked ? 'enabled' : 'disabled'}`)}
                                            style={{ marginTop: 4 }}
                                          />
                                       </Space>
                                    )
                                  },
                                  { 
                                    title: 'Action', 
                                    key: 'action', 
                                    render: (record: any) => (
                                       <Space>
                                          <Tooltip title="View Details">
                                            <Button size="small" type="text" icon={<EyeOutlined style={{ color: '#1890ff' }} />} onClick={() => openSurgeDrawer(record)} />
                                          </Tooltip>
                                          <Tooltip title="Edit Rule">
                                            <Button size="small" type="text" icon={<EditOutlined style={{ color: '#faad14' }} />} onClick={() => openSurgeDrawer(record)} />
                                          </Tooltip>
                                          <Tooltip title="Remove Rule">
                                            <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteSurge(record.id)} />
                                          </Tooltip>
                                       </Space>
                                    )
                                  }
                               ]}
                              />
                           </div>
                         )
                      },
                      {
                         key: '7',
                         label: <Space><CalculatorOutlined /> Pricing Simulator</Space>,
                         children: renderSimulator()
                      }
                  ]}
               />
            </Card>
         </Col>
      </Row>

      {/* Surge Price Setup Drawer */}
       <Drawer
        title={<Space><ThunderboltOutlined color="#fadb14" /> {editingSurge ? 'Edit' : 'Create'} Surge Price Setup</Space>}
        width={500}
        onClose={() => {
          setIsSurgeDrawerVisible(false);
          setEditingSurge(null);
        }}
        open={isSurgeDrawerVisible}
        extra={
          <Space>
            <Button onClick={() => setIsSurgeDrawerVisible(false)}>Cancel</Button>
            <Button type="primary" onClick={() => surgeForm.submit()} loading={loading}>Save Surge</Button>
          </Space>
        }
      >
        <Form form={surgeForm} layout="vertical" onFinish={handleSaveSurge}>
          <Form.Item name="name" label="Surge Name" rules={[{ required: true }]}>
            <Input placeholder="Type Surge Name" />
          </Form.Item>

          <Form.Item name="zone" label="Zone" rules={[{ required: true }]}>
             <Select placeholder="Select Zone">
                <Select.Option value="all">All Zones</Select.Option>
                <Select.Option value="world">All Over The World</Select.Option>
                <Select.Option value="asia">Asia</Select.Option>
                <Select.Option value="egypt">Egypt</Select.Option>
             </Select>
          </Form.Item>

          <Form.Item name="setupFor" label="Setup Surge Pricing For" rules={[{ required: true }]} initialValue="ride">
             <Radio.Group>
                <Radio value="ride">Ride</Radio>
                <Radio value="parcel">Parcel</Radio>
                <Radio value="both">Both</Radio>
             </Radio.Group>
          </Form.Item>

          <Form.Item name="rateType" label="Price Increase Rate For Ride" rules={[{ required: true }]} initialValue="same">
             <Radio.Group>
                <Radio value="same">Same for All Vehicle</Radio>
                <Radio value="different">Setup Different Rate</Radio>
             </Radio.Group>
          </Form.Item>

          <Form.Item name="rate" label="Rate (%)" rules={[{ required: true }]}>
             <InputNumber placeholder="Ex: 20" style={{ width: '100%' }} suffix="%" precision={0} />
          </Form.Item>

          <Divider />
          <Title level={5} style={{ fontSize: 14 }}>Surge Price Schedule</Title>
          <Form.Item name="scheduleType" rules={[{ required: true }]} initialValue="Daily">
             <Segmented block options={['Daily', 'Weekly', 'Custom']} />
          </Form.Item>

          <div style={{ background: isDark ? '#1a1a1a' : '#f5f5f5', padding: 16, borderRadius: 12, marginBottom: 24 }}>
             <Text strong style={{ fontSize: 13 }}><ClockCircleOutlined /> Select time & date</Text><br />
             <Text type="secondary" style={{ fontSize: 12 }}>Select your suitable time within a time range you want add surge price .</Text>
             
             <div style={{ marginTop: 16 }}>
                <Text style={{ fontSize: 12 }}>Date Range</Text><br />
                <DatePicker.RangePicker style={{ width: '100%', marginTop: 4 }} format="MM/DD/YY" />
             </div>

             <div style={{ marginTop: 12 }}>
                <Text style={{ fontSize: 12 }}>Time Range</Text><br />
                <TimePicker.RangePicker style={{ width: '100%', marginTop: 4 }} format="h:mm a" use12Hours />
             </div>
             
             <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Tag color="blue" variant="outlined">This surge price will be applied for 0 time.</Tag>
             </div>
          </div>

          <Form.Item name="note" label="Note for Customer" extra="0/30 Characters">
             <Input.TextArea placeholder="Add a note to inform users about temporary price changes." maxLength={30} showCount />
          </Form.Item>

          <Divider />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div>
                <Text strong>Availability</Text><br />
                <Text type="secondary" style={{ fontSize: 12 }}>Enable or disable this surge rule</Text>
             </div>
             <Switch defaultChecked />
          </div>
        </Form>
      </Drawer>
      {/* Parcel Detail Setup Drawer */}
      {renderParcelDetailDrawer()}
    </div>
  );
};

export default FareManagementHub;
