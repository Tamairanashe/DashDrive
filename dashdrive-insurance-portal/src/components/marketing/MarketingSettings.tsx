import React from 'react';
import { Card, Typography, Switch, Row, Col, Space, Button, InputNumber, Divider, Alert } from 'antd';
import { ShieldCheck, Bell, Wallet, Users, Info } from 'lucide-react';

const { Title, Text } = Typography;

export function MarketingSettings({ token }: { token: string }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>Marketing Settings</Title>
                    <Text type="secondary">Configure your campaign preferences, budget caps, and approval workflows.</Text>
                </div>
                <Button type="primary">Save Changes</Button>
            </div>

            <Alert
                message="Campaign Review Required"
                description="All new campaigns with a budget over $5,000 require manual approval by DashDrive Admin to ensure quality and brand alignment."
                type="info"
                showIcon
                icon={<Info size={18} />}
                style={{ borderRadius: '12px' }}
            />

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card title={<Space><ShieldCheck size={18} /> Approval Workflow</Space>} style={{ borderRadius: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block' }}>Require Admin Review</Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>All campaigns must be approved before going live.</Text>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Divider style={{ margin: 0 }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block' }}>Auto-Approve Low Budget</Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>Campaigns under $500 bypass manual review.</Text>
                                </div>
                                <Switch />
                            </div>
                        </div>
                    </Card>

                    <Card title={<Space><Bell size={18} /> Notification Preferences</Space>} style={{ borderRadius: '20px', marginTop: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block' }}>Campaign Start/End Alerts</Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>Notify when a campaign goes live or expires.</Text>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Divider style={{ margin: 0 }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block' }}>Budget Threshold Alerts</Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>Notify when 80% of budget is consumed.</Text>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title={<Space><Wallet size={18} /> Budget Controls</Space>} style={{ borderRadius: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Daily Spending Cap</Text>
                                <InputNumber 
                                    prefix="$" 
                                    style={{ width: '100%' }} 
                                    defaultValue={500} 
                                    size="large"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                                <Text type="secondary" style={{ fontSize: '12px' }}>Maximum amount to spend across all campaigns per day.</Text>
                            </div>
                            <div>
                                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Monthly Total Budget</Text>
                                <InputNumber 
                                    prefix="$" 
                                    style={{ width: '100%' }} 
                                    defaultValue={10000} 
                                    size="large"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                                <Text type="secondary" style={{ fontSize: '12px' }}>Total marketing credit limit for your portal.</Text>
                            </div>
                        </div>
                    </Card>

                    <Card title={<Space><Users size={18} /> Audience Rules</Space>} style={{ borderRadius: '20px', marginTop: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block' }}>Frequency Capping</Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>Limit push notifications to 2 per user per week.</Text>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Divider style={{ margin: 0 }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block' }}>Exclude Recent Leads</Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>Don't show ads to users who applied in last 30 days.</Text>
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
