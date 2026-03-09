import React from 'react';
import { Card, Typography, Switch, Row, Col, Space, Button, InputNumber, Divider, Alert } from 'antd';
import { ShieldCheck, Bell, Wallet, Users, Info } from 'lucide-react';

const { Title, Text } = Typography;

export function MarketingSettings() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>Marketing Settings</Title>
                    <Text type="secondary">Configure your lending campaign preferences, budget limits, and targeting rules.</Text>
                </div>
                <Button type="primary">Save Changes</Button>
            </div>

            <Alert
                message="Campaign Review Required"
                description="Lending products require strict adherence to regulatory standards. All campaigns will be reviewed by DashDrive compliance."
                type="info"
                showIcon
                icon={<Info size={18} />}
                style={{ borderRadius: '12px' }}
            />

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card title={<Space><ShieldCheck size={18} /> Compliance & Approval</Space>} style={{ borderRadius: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block' }}>Mandatory Review</Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>All lending promotions must be vetted for compliance.</Text>
                                </div>
                                <Switch defaultChecked disabled />
                            </div>
                            <Divider style={{ margin: 0 }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block' }}>AI Ad Quality Scoring</Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>Automatically check ad copy for high performance scores.</Text>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </div>
                    </Card>

                    <Card title={<Space><Bell size={18} /> Communication Settings</Space>} style={{ borderRadius: '20px', marginTop: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block' }}>Usage Alerts</Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>Notify when daily budget reaches 90%.</Text>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Divider style={{ margin: 0 }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block' }}>Conversion Alerts</Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>Notify for every 100 new applications generated.</Text>
                                </div>
                                <Switch />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title={<Space><Wallet size={18} /> Budget & Credit</Space>} style={{ borderRadius: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Total Campaign Cap</Text>
                                <InputNumber 
                                    prefix="$" 
                                    style={{ width: '100%' }} 
                                    defaultValue={15000} 
                                    size="large"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                                <Text type="secondary" style={{ fontSize: '12px' }}>Total monthly marketing spend limit for loan products.</Text>
                            </div>
                            <div>
                                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Credit Alert Level</Text>
                                <InputNumber 
                                    prefix="$" 
                                    style={{ width: '100%' }} 
                                    defaultValue={1000} 
                                    size="large"
                                />
                                <Text type="secondary" style={{ fontSize: '12px' }}>Warn when remaining marketing credit drops below this value.</Text>
                            </div>
                        </div>
                    </Card>

                    <Card title={<Space><Users size={18} /> Targeting Best Practices</Space>} style={{ borderRadius: '20px', marginTop: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block' }}>Exclude Non-Eligible</Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>Don't show lending products to users with low ratings.</Text>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Divider style={{ margin: 0 }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block' }}>Geofence Targeting</Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>Prioritize users in high-growth operational regions.</Text>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
