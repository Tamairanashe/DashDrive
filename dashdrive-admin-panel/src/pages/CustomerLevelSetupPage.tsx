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
  PieChartOutlined,
  CarOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

export const CustomerLevelSetupPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTier, setEditingTier] = useState<any>(null);
  const [form] = Form.useForm();

  const [tiers, setTiers] = useState([
    { 
      id: 'T-BRNZ', 
      name: 'Bronze', 
      color: 'default', 
      reqTrips: 0, 
      benefits: ['Standard Pricing', 'Standard Dispatch'] 
    },
    { 
      id: 'T-SLVR', 
      name: 'Silver', 
      color: 'blue', 
      reqTrips: 20, 
      benefits: ['5% Output Discount', 'Standard Dispatch'] 
    },
    { 
      id: 'T-GOLD', 
      name: 'Gold', 
      color: 'gold', 
      reqTrips: 50, 
      benefits: ['10% Ride Discount', 'Priority Drivers', 'Free Cancellations (Once/mo)'] 
    },
    { 
      id: 'T-VIP', 
      name: 'VIP', 
      color: 'purple', 
      reqTrips: 100, 
      benefits: ['15% All Services Discount', 'VIP Premium Drivers Only', 'Zero Delivery Fees', '24/7 Dedicated Support'] 
    },
  ]);

  const handleEdit = (tier: any) => {
    setEditingTier(tier);
    form.setFieldsValue({
      name: tier.name,
      reqTrips: tier.reqTrips,
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
          id: `T-CUST-${Date.now()}`,
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
      title: 'Loyalty Tier',
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
      title: 'Required Trips/Month',
      dataIndex: 'reqTrips',
      key: 'reqTrips',
      render: (trips: number) => <Text strong>{trips === 0 ? 'Base Level' : `Min. ${trips} Trips`}</Text>,
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
          <Title level={4} style={{ margin: 0 }}>Customer Level Setup</Title>
          <Text type="secondary">Define loyalty tiers, unlock conditions, and specific customer benefits.</Text>
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
              title="Avg Benefits Cost" 
              value={4.2} 
              precision={1} 
              prefix={<PieChartOutlined />} 
              suffix="% margin impact" 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm" style={{ borderTop: '4px solid #faad14' }}>
            <Statistic 
              title="Gold & VIP Users" 
              value={12450} 
              prefix={<StarOutlined />} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm" style={{ borderTop: '4px solid #722ed1' }}>
            <Statistic 
              title="Priority Dispatches Today" 
              value={842} 
              prefix={<CarOutlined />} 
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Title level={5}>Active Loyalty Structure</Title>
          <Text type="secondary">Customers automatically upgrade or downgrade based on their 30-day activity logs against these requirements.</Text>
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

      <Drawer
        title={<span>{editingTier ? 'Configure Tier Benefits' : 'Create New Tier'}</span>}
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        width={600}
        destroyOnClose
        extra={<Button type="primary" onClick={handleSave}>Save Configuration</Button>}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="name" 
                label="Tier Name" 
                rules={[{ required: true, message: 'Please input the tier name' }]}
              >
                <Input placeholder="e.g. Platinum" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="reqTrips" 
                label="Required Trips (Monthly)" 
                rules={[{ required: true, message: 'Please input the required trips' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Granted Benefits</Divider>
          
          <Form.Item 
            name="benefits" 
            label="Select Benefits to Apply"
            rules={[{ required: true, message: 'Please select at least one benefit' }]}
          >
            <Select 
              mode="tags" 
              style={{ width: '100%' }} 
              placeholder="Type and press enter to add custom benefits"
              options={[
                { value: '5% Ride Discount', label: '5% Ride Discount' },
                { value: '10% Ride Discount', label: '10% Ride Discount' },
                { value: '15% All Services Discount', label: '15% All Services Discount' },
                { value: 'Priority Drivers', label: 'Priority Drivers (Faster Pickup)' },
                { value: 'VIP Premium Drivers Only', label: 'VIP Premium Drivers Only' },
                { value: 'Zero Delivery Fees', label: 'Zero Delivery Fees' },
                { value: 'Free Cancellations (Once/mo)', label: 'Free Cancellations (Once/mo)' },
                { value: '24/7 Dedicated Support', label: '24/7 Dedicated Support' },
              ]}
            />
          </Form.Item>
          <Text type="secondary">These benefits will be instantly active on the user's rider app once they reach this tier.</Text>
        </Form>
      </Drawer>
    </div>
  );
};
