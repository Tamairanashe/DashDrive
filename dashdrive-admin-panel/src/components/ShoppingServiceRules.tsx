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
    Select,
    Tag
} from 'antd';
import {
    SaveOutlined,
    ShoppingOutlined,
    GlobalOutlined,
    PercentageOutlined,
    TruckOutlined,
    SafetyCertificateOutlined,
    DollarCircleOutlined,
    DeploymentUnitOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export const ShoppingServiceRules: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        setLoading(true);
        setTimeout(() => {
            message.success('Marketplace shipping and payout rules updated');
            setLoading(false);
        }, 1000);
    };

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
                <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Marketplace Logistics Engine</Title>
                <Text type="secondary" style={{ fontSize: 15 }}>Configure global marketplace commissions, multi-tier shipping rates, and merchant payout thresholds</Text>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    enableService: true,
                    commission: 12,
                    payoutThreshold: 50.00,
                    multiVendorShipping: 'split',
                    returnWindow: 7,
                    standardShippingFee: 4.00,
                    expressShippingFee: 10.00
                }}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Card 
                            title={<span><GlobalOutlined /> Marketplace Economics</span>} 
                            bordered={false} 
                            className="shadow-sm"
                            style={{ borderRadius: 20 }}
                        >
                            <Form.Item name="enableService" label="Marketplace Status" valuePropName="checked">
                                <Switch checkedChildren="Live" unCheckedChildren="Maintenance" />
                            </Form.Item>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="commission" label="Marketplace Fee (%)">
                                        <InputNumber min={0} max={100} style={{ width: '100%' }} precision={1} prefix={<PercentageOutlined />} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="payoutThreshold" label="Min Payout ($)">
                                        <InputNumber min={0} style={{ width: '100%' }} precision={2} prefix="$" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item name="returnWindow" label="Return Window (Days)">
                                <InputNumber min={0} max={30} style={{ width: '100%' }} />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card 
                            title={<span><TruckOutlined /> Multi-Tier Shipping Rules</span>} 
                            bordered={false} 
                            className="shadow-sm"
                            style={{ borderRadius: 20 }}
                        >
                            <Form.Item name="multiVendorShipping" label="Multi-Vendor Cart Logic" extra="How to handle shipping fees when a user buys from multiple merchants.">
                                <Select options={[
                                    { value: 'split', label: 'Split Fee (Higher fee, separate drivers)' },
                                    { value: 'consolidated', label: 'Consolidated (Hub-based sorting)' },
                                    { value: 'highest', label: 'Single Flat (Charge highest merchant fee)' }
                                ]} />
                            </Form.Item>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="standardShippingFee" label="Standard Base ($)">
                                        <InputNumber min={0} style={{ width: '100%' }} precision={2} prefix="$" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="expressShippingFee" label="Express Base ($)">
                                        <InputNumber min={0} style={{ width: '100%' }} precision={2} prefix="$" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                <div style={{ marginTop: 24 }}>
                    <Card 
                        title={<span><SafetyCertificateOutlined /> Merchant Compliance</span>} 
                        bordered={false} 
                        className="shadow-sm"
                        style={{ borderRadius: 20 }}
                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item label="Counterfeit Protection Active" valuePropName="checked" extra="Mandatory SKU verification for high-value fashion and electronics.">
                                    <Switch defaultChecked />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Instant Merchant Payouts" valuePropName="checked" extra="Allow trusted merchants (Rating > 4.5) to withdraw funds daily.">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '12px 0' }} />
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text strong><DollarCircleOutlined /> Revenue Protection</Text>
                            <Alert
                                message="Escrow Guard Active"
                                description="Funds are held in platform escrow until the return window expires or user confirms delivery successfully."
                                type="warning"
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
                        Update Marketplace Rules
                    </Button>
                </div>
            </Form>
        </Space>
    );
};
