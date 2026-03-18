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
    Badge
} from 'antd';
import {
    SaveOutlined,
    ShopOutlined,
    SyncOutlined,
    DatabaseOutlined,
    SafetyCertificateOutlined,
    GlobalOutlined,
    PercentageOutlined,
    AlertOutlined,
    AppstoreOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export const MartServiceRules: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        setLoading(true);
        setTimeout(() => {
            message.success('Mart logistics and SKU rules updated successfully');
            setLoading(false);
        }, 1000);
    };

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
                <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Mart & Grocery Engine</Title>
                <Text type="secondary" style={{ fontSize: 15 }}>Configure retail commissions, SKU sync frequency, and inventory health thresholds</Text>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    enableService: true,
                    commission: 10,
                    baseFee: 3.00,
                    syncFrequency: 15,
                    lowStockThreshold: 10,
                    autoDisableOutofStock: true,
                    maxItemsPerOrder: 50
                }}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Card 
                            title={<span><GlobalOutlined /> Retail Economics</span>} 
                            bordered={false} 
                            className="shadow-sm"
                            style={{ borderRadius: 20 }}
                        >
                            <Form.Item name="enableService" label="Service Status" valuePropName="checked">
                                <Switch checkedChildren="Open for Business" unCheckedChildren="Mart Closed" />
                            </Form.Item>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="commission" label="Platform Commission (%)">
                                        <InputNumber min={0} max={100} style={{ width: '100%' }} precision={1} prefix={<PercentageOutlined />} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="baseFee" label="Mart Delivery Base ($)">
                                        <InputNumber min={0} style={{ width: '100%' }} precision={2} prefix="$" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item name="maxItemsPerOrder" label="Max Items per Basket">
                                <InputNumber min={1} max={200} style={{ width: '100%' }} />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card 
                            title={<span><SyncOutlined /> Data & Inventory Sync</span>} 
                            bordered={false} 
                            className="shadow-sm"
                            style={{ borderRadius: 20 }}
                        >
                            <Form.Item name="syncFrequency" label="SKU Sync Frequency (Mins)" extra="How often the system pulls fresh stock data from partner POS.">
                                <InputNumber min={1} max={60} style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item name="lowStockThreshold" label="Low Stock Alert Threshold" extra="Notify managers when SKU count falls below this value.">
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item name="autoDisableOutofStock" label="Auto-Hide OOS Items" valuePropName="checked" extra="Automatically hide items with 0 stock from the user app.">
                                <Switch />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>

                <div style={{ marginTop: 24 }}>
                    <Card 
                        title={<span><AppstoreOutlined /> Aisle Catalog Rules</span>} 
                        bordered={false} 
                        className="shadow-sm"
                        style={{ borderRadius: 20 }}
                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item label="Electronic Approval Required" valuePropName="checked" extra="New merchant SKUs require admin approval before going live.">
                                    <Switch defaultChecked />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Price Matching Guarantee" valuePropName="checked" extra="Ensure app prices match in-store shelf prices.">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '12px 0' }} />
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text strong><AlertOutlined /> Sync Integrity Shield</Text>
                            <Alert
                                message="Anti-Fragmentation Active"
                                description="The system prevents contradictory stock updates during multi-access sync sessions. Conflict resolution is set to 'Store-First'."
                                type="info"
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
                        Update Mart Engine
                    </Button>
                </div>
            </Form>
        </Space>
    );
};
