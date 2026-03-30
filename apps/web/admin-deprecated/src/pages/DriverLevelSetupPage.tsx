import React, { useState } from 'react';
import { 
  Table, 
  Tag, 
  Space, 
  Button, 
  Card, 
  Typography, 
  Row, 
  Col, 
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Divider,
  List,
  Statistic,
  Drawer
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  CrownOutlined,
  CheckCircleOutlined,
  StarOutlined,
  CarOutlined,
  ThunderboltOutlined,
  RiseOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export const DriverLevelSetupPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTier, setEditingTier] = useState<any>(null);
  const [form] = Form.useForm();

  const [tiers, setTiers] = useState([
    { 
      id: 'DT-BRNZ', 
      name: 'Bronze', 
      color: 'default', 
      reqTrips: 0,
      minAcceptance: 0,
      minHours: 0,
      benefits: ['Standard Commission (20%)', 'Standard Dispatch'] 
    },
    { 
      id: 'DT-SLVR', 
      name: 'Silver', 
      color: 'blue', 
      reqTrips: 50,
      minAcceptance: 75,
      minHours: 20,
      benefits: ['Reduced Commission (18%)', 'Priority Airport Dispatch', 'Free Monthly Car Wash'] 
    },
    { 
      id: 'DT-GOLD', 
      name: 'Gold', 
      color: 'gold', 
      reqTrips: 150,
      minAcceptance: 85,
      minHours: 40,
      benefits: ['Low Commission (15%)', 'Priority High-Demand Zones', 'Weekly $10 Fuel Voucher', 'Free Vehicle Inspection'] 
    },
    { 
      id: 'DT-PLAT', 
      name: 'Platinum', 
      color: 'purple', 
      reqTrips: 300,
      minAcceptance: 92,
      minHours: 60,
      benefits: ['Lowest Commission (12%)', 'VIP-Only Ride Requests', 'Weekly $25 Fuel Voucher', 'Free Premium Car Wash', '24/7 Dedicated Driver Support', 'Guaranteed Minimum Earnings'] 
    },
  ]);

  const handleEdit = (tier: any) => {
    setEditingTier(tier);
    form.setFieldsValue({
      name: tier.name,
      reqTrips: tier.reqTrips,
      minAcceptance: tier.minAcceptance,
      minHours: tier.minHours,
      benefits: tier.benefits
    });
    setIsModalVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (editingTier) {
        setTiers(tiers.map(t => t.id === editingTier.id ? { ...t, ...values } : t));
        message.success(`${values.name} tier updated successfully.`);
      } else {
        const newTier = {
          id: `DT-CUST-${Date.now()}`,
          color: 'cyan',
          ...values
        };
        setTiers([...tiers, newTier]);
        message.success(`${values.name} tier created.`);
      }
      setIsModalVisible(false);
      setEditingTier(null);
      form.resetFields();
    });
  };

  const columns = [
    {
      title: 'Driver Tier',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <Space>
          <CrownOutlined style={{ color: record.color === 'gold' ? '#faad14' : record.color === 'purple' ? '#722ed1' : record.color === 'blue' ? '#1890ff' : '#8c8c8c' }} />
          <Tag color={record.color} style={{ fontSize: 14, padding: '4px 12px' }}>{name}</Tag>
        </Space>
      ),
    },
    {
      title: 'Requirements',
      key: 'requirements',
      render: (_: any, record: any) => (
        <Space orientation="vertical" size={2}>
          <Text style={{ fontSize: 12 }}><strong>{record.reqTrips === 0 ? 'Base' : record.reqTrips}</strong> Trips/mo</Text>
          <Text style={{ fontSize: 12 }}><strong>{record.minAcceptance === 0 ? 'Any' : `${record.minAcceptance}%`}</strong> Acceptance</Text>
          <Text style={{ fontSize: 12 }}><strong>{record.minHours === 0 ? 'Any' : `${record.minHours}h`}</strong> Active/mo</Text>
        </Space>
      ),
    },
    {
      title: 'Configured Benefits',
      dataIndex: 'benefits',
      key: 'benefits',
      render: (benefits: string[]) => (
        <List
          size="small"
          dataSource={benefits}
          renderItem={item => (
            <List.Item style={{ padding: '4px 0', border: 'none' }}>
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                <Text>{item}</Text>
              </Space>
            </List.Item>
          )}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: any) => (
        <Button 
          type="primary" 
          ghost 
          icon={<EditOutlined />} 
          onClick={() => handleEdit(record)}
        >
          Configure Benefits
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>Driver Level Setup</Title>
          <Text type="secondary">Define driver performance tiers, unlock conditions, and specific driver benefits.</Text>
        </Col>
        <Col>
          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />} 
            onClick={() => {
              setEditingTier(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Create Custom Tier
          </Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm" style={{ borderTop: '4px solid #1890ff' }}>
            <Statistic 
              title="Avg Commission Rate" 
              value={16.5} 
              precision={1} 
              prefix={<RiseOutlined />} 
              suffix="%" 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm" style={{ borderTop: '4px solid #faad14' }}>
            <Statistic 
              title="Gold & Platinum Drivers" 
              value={3820} 
              prefix={<StarOutlined />} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm" style={{ borderTop: '4px solid #722ed1' }}>
            <Statistic 
              title="Priority Dispatches Today" 
              value={1254} 
              prefix={<ThunderboltOutlined />} 
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Title level={5}>Active Driver Level Structure</Title>
          <Text type="secondary">Drivers automatically upgrade or downgrade based on their 30-day performance metrics against these requirements.</Text>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={tiers} 
          rowKey="id"
          pagination={false}
          bordered
          size="middle"
        />
      </Card>

      <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: 24 }} style={{ marginTop: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Title level={5}>Level Transition History</Title>
          <Text type="secondary">Recent driver upgrades and downgrades based on performance evaluations.</Text>
        </div>
        <Table 
          dataSource={[
            { id: 'DR-1092', name: 'John Makoni', direction: 'Upgrade', from: 'Silver', to: 'Gold', reason: 'Rating Target Met', time: '12 mins ago' },
            { id: 'DR-4421', name: 'Sarah Mulenga', direction: 'Upgrade', from: 'Gold', to: 'Platinum', reason: 'Trips Milestone', time: '1 hour ago' },
            { id: 'DR-3342', name: 'Mike Phiri', direction: 'Downgrade', from: 'Gold', to: 'Silver', reason: 'High Cancellation Rate', time: '3 hours ago' },
            { id: 'DR-7712', name: 'Elena Zhou', direction: 'Upgrade', from: 'Bronze', to: 'Silver', reason: 'Initial Probation Complete', time: '5 hours ago' },
          ]}
          rowKey="id"
          pagination={false}
          size="middle"
          columns={[
            {
              title: 'Driver',
              dataIndex: 'name',
              render: (name: string, record: any) => (
                <Space>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f56a00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 12 }}>{name.charAt(0)}</div>
                  <div>
                    <Text strong>{name}</Text><br/>
                    <Text type="secondary" style={{ fontSize: 10 }}>ID: {record.id}</Text>
                  </div>
                </Space>
              )
            },
            {
              title: 'Direction',
              dataIndex: 'direction',
              render: (dir: string) => <Tag color={dir === 'Upgrade' ? 'success' : 'error'}>{dir}</Tag>
            },
            {
              title: 'Transition',
              render: (_: any, record: any) => (
                <Space>
                  <Text type="secondary">{record.from}</Text>
                  <Text>→</Text>
                  <Text strong>{record.to}</Text>
                </Space>
              )
            },
            { title: 'Reason', dataIndex: 'reason' },
            { title: 'When', dataIndex: 'time', render: (val: string) => <Text type="secondary">{val}</Text> }
          ]}
        />
      </Card>      <Drawer
        title={<span>{editingTier ? 'Configure Driver Tier Benefits' : 'Create New Driver Tier'}</span>}
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        width={600}
        destroyOnClose
        extra={<Button type="primary" onClick={handleSave}>Save Configuration</Button>}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item 
            name="name" 
            label="Tier Name" 
            rules={[{ required: true, message: 'Please input the tier name' }]}
          >
            <Input placeholder="e.g. Diamond" />
          </Form.Item>
          {/* ... (rest of the form content is the same) */}
          <Divider>Unlock Requirements</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="reqTrips" label="Min. Trips/Month" rules={[{ required: true, message: 'Required' }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="minAcceptance" label="Min. Acceptance Rate (%)" rules={[{ required: true, message: 'Required' }]}>
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="minHours" label="Min. Active Hours/Mo" rules={[{ required: true, message: 'Required' }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Divider>Granted Benefits</Divider>
          <Form.Item name="benefits" label="Select Benefits to Apply" rules={[{ required: true, message: 'Please select at least one benefit' }]}>
            <Select mode="tags" style={{ width: '100%' }} placeholder="Type and press enter to add custom benefits" options={[
              { value: 'Reduced Commission (18%)', label: 'Reduced Commission (18%)' },
              { value: 'Low Commission (15%)', label: 'Low Commission (15%)' },
              { value: 'Lowest Commission (12%)', label: 'Lowest Commission (12%)' },
              { value: 'Priority Airport Dispatch', label: 'Priority Airport Dispatch' },
              { value: 'Priority High-Demand Zones', label: 'Priority High-Demand Zones' },
              { value: 'VIP-Only Ride Requests', label: 'VIP-Only Ride Requests' },
              { value: 'Weekly $10 Fuel Voucher', label: 'Weekly $10 Fuel Voucher' },
              { value: 'Weekly $25 Fuel Voucher', label: 'Weekly $25 Fuel Voucher' },
              { value: 'Free Monthly Car Wash', label: 'Free Monthly Car Wash' },
              { value: 'Free Premium Car Wash', label: 'Free Premium Car Wash' },
              { value: 'Free Vehicle Inspection', label: 'Free Vehicle Inspection' },
              { value: '24/7 Dedicated Driver Support', label: '24/7 Dedicated Driver Support' },
              { value: 'Guaranteed Minimum Earnings', label: 'Guaranteed Minimum Earnings' },
            ]} />
          </Form.Item>
          <Text type="secondary">These benefits activate instantly in the driver app once a driver reaches this tier.</Text>
        </Form>
      </Drawer>
    </div>
  );
};

