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
    message
} from 'antd';
import {
    SaveOutlined,
    SettingOutlined,
    SafetyCertificateOutlined,
    DeploymentUnitOutlined,
    GlobalOutlined,
    NodeIndexOutlined,
    BellOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export const ParcelServiceRules: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        setLoading(true);
        setTimeout(() => {
            message.success('Parcel logistics rules updated successfully');
            setLoading(false);
        }, 1000);
    };

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
                <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Parcel Logistics Engine</Title>
                <Text type="secondary" style={{ fontSize: 15 }}>Configure global platform rules, dispatch logic, and safety compliance for the courier vertical</Text>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    enableService: true,
                    commission: 20,
                    baseFee: 5.00,
                    maxDistance: 50,
                    autoDispatch: true,
                    mandatoryInsurance: 500,
                    riderSelectionRadius: 5
                }}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Card 
                            title={<span><GlobalOutlined /> Core Service Settings</span>} 
                            bordered={false} 
                            className="shadow-sm"
                            style={{ borderRadius: 20 }}
                        >
                            <Form.Item name="enableService" label="Active Status" valuePropName="checked">
                                <Switch checkedChildren="Online" unCheckedChildren="Offline" />
                            </Form.Item>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="commission" label="Commission Rate (%)">
                                        <InputNumber min={0} max={100} style={{ width: '100%' }} precision={1} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="baseFee" label="Base Delivery Fee ($)">
                                        <InputNumber min={0} style={{ width: '100%' }} precision={2} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item name="maxDistance" label="Max Delivery Distance (KM)">
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card 
                            title={<span><DeploymentUnitOutlined /> Dispatch & Routing Logic</span>} 
                            bordered={false} 
                            className="shadow-sm"
                            style={{ borderRadius: 20 }}
                        >
                            <Form.Item name="autoDispatch" label="Automated Dispatching" valuePropName="checked" extra="Automatically assign riders based on proximity and rating.">
                                <Switch />
                            </Form.Item>
                            <Form.Item name="riderSelectionRadius" label="Rider Search Radius (KM)">
                                <InputNumber min={1} max={20} style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item label="Multi-parcel Stacking" extra="Allow riders to carry multiple parcels along the same route.">
                                <Switch defaultChecked />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>

                <div style={{ marginTop: 24 }}>
                    <Card 
                        title={<span><SafetyCertificateOutlined /> Safety & Compliance Rules</span>} 
                        bordered={false} 
                        className="shadow-sm"
                        style={{ borderRadius: 20 }}
                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name="mandatoryInsurance" label="Mandatory Insurance Threshold ($)" extra="Orders above this value require mandatory insurance coverage.">
                                    <InputNumber min={0} style={{ width: '100%' }} prefix="$" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Electronic Proof of Delivery (ePOD)" valuePropName="checked" extra="Require digital signature or photo at drop-off point.">
                                    <Switch defaultChecked />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '12px 0' }} />
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text strong>Restricted Items Notification</Text>
                            <Alert
                                message="Restricted Items Policy"
                                description="The system automatically blocks orders containing keyword flagged restricted items. You can manage these keywords in the 'Categories' tab."
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
                        Update Logistics Engine
                    </Button>
                </div>
            </Form>
        </Space>
    );
};
