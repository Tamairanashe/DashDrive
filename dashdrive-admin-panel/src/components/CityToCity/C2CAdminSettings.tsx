import React from 'react';
import { Card, Typography, Row, Col, Switch, Space, Select, Button, List, Divider, Tag, Input, Form } from 'antd';
import { 
    BellOutlined, 
    SecurityScanOutlined, 
    UserOutlined, 
    LockOutlined,
    NotificationOutlined,
    SafetyOutlined,
    GlobalOutlined,
    SaveOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Title, Paragraph } = Typography;

export const C2CAdminSettings: React.FC = () => {
    return (
        <div style={{ padding: '24px 0' }}>
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card 
                        variant="borderless" 
                        style={{ borderRadius: 20 }} 
                        title={<Space><BellOutlined /> Notification Control Center</Space>}
                        extra={<Button type="primary" size="small" icon={<SaveOutlined />}>Save Changes</Button>}
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={[
                                { title: 'New Arrival Offers', desc: 'Notify admin when 5+ offers are received on a single request', default: true },
                                { title: 'Price Abuse Alerts', desc: 'Auto-flag offers exceeding 50% of market base price', default: true },
                                { title: 'Long-Stop Detection', desc: 'Alert ops if a long-distance driver stops for > 45 mins', default: false },
                                { title: 'Passenger SOS', desc: 'High-priority sound alert for all support agents', default: true },
                            ]}
                            renderItem={item => (
                                <List.Item extra={<Switch defaultChecked={item.default} />}>
                                    <List.Item.Meta title={item.title} description={item.desc} />
                                </List.Item>
                            )}
                        />
                    </Card>

                    <Card 
                        variant="borderless" 
                        style={{ borderRadius: 20, marginTop: 24 }} 
                        title={<Space><SecurityScanOutlined /> Fraud & Protection Rules</Space>}
                    >
                        <Form layout="vertical">
                            <Form.Item label="Price Negotiation Boundary (%)" extra="Maximum % a driver can offer above the passenger's proposed price.">
                                <Select defaultValue="25" options={[
                                    { label: 'Strict (15%)', value: '15' },
                                    { label: 'Standard (25%)', value: '25' },
                                    { label: 'Flexible (40%)', value: '40' }
                                ]} />
                            </Form.Item>
                            <Form.Item label="Same-Day Cancellation Penalty ($)">
                                <Input prefix="$" defaultValue="10" />
                            </Form.Item>
                            <Form.Item label="Automated Driver Blocking" extra="Block drivers automatically after X safety violations.">
                                <Select defaultValue="3" options={[
                                    { label: '1 Violation', value: '1' },
                                    { label: '3 Violations', value: '3' },
                                    { label: 'Manual Only', value: 'manual' }
                                ]} />
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card 
                        variant="borderless" 
                        style={{ borderRadius: 20 }} 
                        title={<Space><UserOutlined /> Admin Roles & Access</Space>}
                    >
                        <Alert
                            message="Role Permissions for City-to-City"
                            description="Access to financial data (escrow release) is restricted to Finance Admins and Super Admins."
                            type="info"
                            showIcon
                            style={{ marginBottom: 20, borderRadius: 12 }}
                        />
                        <List
                            size="small"
                            dataSource={[
                                { role: 'Super Admin', access: 'All Access', users: 3 },
                                { role: 'Operations Manager', access: 'Fleet & Routes', users: 5 },
                                { role: 'Support Agent', access: 'Live Monitor & Disputes', users: 12 },
                                { role: 'Finance Admin', access: 'Escrow & Payouts', users: 2 }
                            ]}
                            renderItem={item => (
                                <List.Item extra={<Button type="link">Manage Users</Button>}>
                                    <div>
                                        <Text strong>{item.role} </Text>
                                        <Tag style={{ marginLeft: 8 }}>{item.access}</Tag>
                                        <div style={{ fontSize: 12, color: '#64748b' }}>{item.users} users assigned</div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>

                    <Card 
                        variant="borderless" 
                        style={{ borderRadius: 20, marginTop: 24, background: '#1e293b' }} 
                        title={<Text style={{ color: 'white' }}><LockOutlined /> System Integrity Logs</Text>}
                    >
                        <div style={{ color: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}>
                            <div>[2026-03-18 08:30] ADMIN-5 changed route pricing for HRE-BUL</div>
                            <div>[2026-03-18 08:42] SYSTEM auto-flagged TRP-1008 as CRITICAL</div>
                            <div>[2026-03-18 09:12] OPS-Manager-3 activated new route: HRE-GWERU</div>
                            <div>[2026-03-18 09:45] FINANCE-Admin released escrow for PAY-8821</div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

const Alert = ({ message, description, type, showIcon, style }: any) => (
    <div style={{ 
        padding: 16, 
        background: type === 'info' ? '#eff6ff' : '#fef2f2', 
        border: `1px solid ${type === 'info' ? '#bfdbfe' : '#fecaca'}`,
        ...style 
    }}>
        <div style={{ display: 'flex', gap: 12 }}>
            {showIcon && <NotificationOutlined style={{ color: type === 'info' ? '#3b82f6' : '#ef4444', fontSize: 20 }} />}
            <div>
                <Text strong style={{ color: type === 'info' ? '#1d4ed8' : '#b91c1c' }}>{message}</Text>
                <Paragraph style={{ margin: 0, fontSize: 13, color: type === 'info' ? '#1e40af' : '#991b1b' }}>{description}</Paragraph>
            </div>
        </div>
    </div>
);
