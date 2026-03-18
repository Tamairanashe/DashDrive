import React, { useState } from 'react';
import {
    Form,
    Switch,
    InputNumber,
    Button,
    Card,
    Typography,
    Space,
    Divider,
    Row,
    Col,
    Alert,
    message,
    Select
} from 'antd';
import {
    SaveOutlined,
    CoffeeOutlined,
    ClockCircleOutlined,
    DeploymentUnitOutlined,
    SafetyCertificateOutlined,
    GlobalOutlined,
    PercentageOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export const FoodServiceRules: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        setLoading(true);
        setTimeout(() => {
            message.success('Food delivery logistics rules updated successfully');
            setLoading(false);
        }, 1000);
    };

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
                <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Food Logistics Engine</Title>
                <Text type="secondary" style={{ fontSize: 15 }}>Configure restaurant commissions, automated fulfillment buffers, and delivery radius limits</Text>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    enableService: true,
                    commission: 18,
                    baseFee: 1.50,
                    prepTimeBuffer: 10,
                    autoAccept: true,
                    deliveryRadius: 8,
                    minOrderValue: 5.00
                }}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Card 
                            title={<span><GlobalOutlined /> Core Platform Pricing</span>} 
                            bordered={false} 
                            className="shadow-sm"
                            style={{ borderRadius: 20 }}
                        >
                            <Form.Item name="enableService" label="Vertical Status" valuePropName="checked">
                                <Switch checkedChildren="Accepting Orders" unCheckedChildren="Service Paused" />
                            </Form.Item>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="commission" label="Base Commission (%)">
                                        <InputNumber min={0} max={100} style={{ width: '100%' }} precision={1} prefix={<PercentageOutlined />} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="baseFee" label="Base Delivery Fee ($)">
                                        <InputNumber min={0} style={{ width: '100%' }} precision={2} prefix="$" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item name="minOrderValue" label="Minimum Order Value ($)">
                                <InputNumber min={0} style={{ width: '100%' }} precision={2} prefix="$" />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card 
                            title={<span><ClockCircleOutlined /> Fulfillment & Timing</span>} 
                            bordered={false} 
                            className="shadow-sm"
                            style={{ borderRadius: 20 }}
                        >
                            <Form.Item name="autoAccept" label="Merchant Auto-Accept" valuePropName="checked" extra="Automatically confirm orders if restaurant status is 'Open'.">
                                <Switch />
                            </Form.Item>
                            <Form.Item name="prepTimeBuffer" label="Default Prep Buffer (Mins)" extra="Additional time added to restaurant's estimated prep time.">
                                <InputNumber min={0} max={60} style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item label="Busy Mode Threshold" extra="Automatically increase delivery fees during high order density.">
                                <Select defaultValue="balanced" options={[
                                    { value: 'aggressive', label: 'Aggressive (Low threshold)' },
                                    { value: 'balanced', label: 'Balanced' },
                                    { value: 'conservative', label: 'Conservative (High threshold)' }
                                ]} />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>

                <div style={{ marginTop: 24 }}>
                    <Card 
                        title={<span><DeploymentUnitOutlined /> Dispatch & Coverage</span>} 
                        bordered={false} 
                        className="shadow-sm"
                        style={{ borderRadius: 20 }}
                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name="deliveryRadius" label="Max Delivery Radius (KM)" extra="Furthest distance a customer can order from a restaurant.">
                                    <InputNumber min={1} max={50} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Stacked Deliveries" valuePropName="checked" extra="Allow riders to carry multiple food orders (max 2).">
                                    <Switch defaultChecked />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '12px 0' }} />
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text strong><ThunderboltOutlined /> Ultra-Fast Delivery Zone</Text>
                            <Alert
                                message="Priority Routing Active"
                                description="Orders within 2km are automatically prioritized for bicycle and scooter couriers to ensure <15min delivery."
                                type="success"
                                showIcon
                            />
                        </Space>
                    </Card>
                </div>

                <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        icon={<SaveOutlined />} 
                        size="large" 
                        loading={loading}
                        style={{ borderRadius: 12, height: 48, padding: '0 40px' }}
                    >
                        Update Food Service Rules
                    </Button>
                </div>
            </Form>
        </Space>
    );
};
