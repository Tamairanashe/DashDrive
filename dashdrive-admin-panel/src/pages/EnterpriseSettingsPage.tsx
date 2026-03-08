import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Tabs, Table, Button, Tag, Space, Switch, Input, Form, Divider, message, Empty } from 'antd';
import { SettingOutlined, LockOutlined, CloudServerOutlined, SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const EnterpriseSettingsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState<any[]>([]);

    useEffect(() => {
        setTimeout(() => {
            setRoles([
                { id: 'R-1', name: 'Super Admin', users: 2, access: 'Full System' },
                { id: 'R-2', name: 'Logistics Manager', users: 15, access: 'Operations, Drivers, Map' },
                { id: 'R-3', name: 'Finance Controller', users: 4, access: 'Finance, Marketing' },
                { id: 'R-4', name: 'Support Agent', users: 45, access: 'Users, Dispatch, Tickets' },
            ]);
            setLoading(false);
        }, 600);
    }, []);

    const handleSaveSettings = () => {
        message.loading({ content: 'Saving system settings...', key: 'save' });
        setTimeout(() => {
            message.success({ content: 'Settings updated successfully.', key: 'save' });
        }, 1000);
    };

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={4} style={{ margin: 0 }}>Enterprise & Governance Settings</Title>
                    <Text type="secondary">Manage global permissions, APIs, and low-level system config.</Text>
                </Col>
            </Row>

            <Card bordered={false} className="shadow-sm">
                <Tabs defaultActiveKey="1" size="large">
                    
                    <Tabs.TabPane tab={<span><SettingOutlined /> System Config</span>} key="1">
                        <Form layout="vertical" style={{ maxWidth: 600, marginTop: 16 }}>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item label="Global Maintenance Mode" extra="Locks all customers and drivers out of the app.">
                                        <Switch unCheckedChildren="Live" checkedChildren="Maintenance" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Debug Logging" extra="Verbose tracing to System Logs.">
                                        <Switch defaultChecked />
                                    </Form.Item>
                                </Col>
                            </Row>
                            
                            <Divider />
                            
                            <Form.Item label="Google Maps API Key">
                                <Input.Password value="AIzaSyAxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                            </Form.Item>
                            <Form.Item label="Stripe Secret Key">
                                <Input.Password value="sk_live_xxxxxxxxxxxxxxxxxxxx" />
                            </Form.Item>
                            
                            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveSettings}>
                                Commit Configuration
                            </Button>
                        </Form>
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><LockOutlined /> Roles & RBAC</span>} key="2">
                        <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>Create Role</Button>
                        <Table 
                            loading={loading}
                            dataSource={roles} 
                            rowKey="id"
                            columns={[
                                { title: 'Role Name', dataIndex: 'name', render: (t) => <strong>{t}</strong> },
                                { title: 'Assigned Users', dataIndex: 'users', render: (u) => <Tag color="blue">{u}</Tag> },
                                { title: 'Access Bound', dataIndex: 'access' },
                                { title: 'Action', render: () => <Space><Button size="small">Edit Policy</Button><Button size="small" danger icon={<DeleteOutlined />}/></Space>}
                            ]}
                        />
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><CloudServerOutlined /> Service Webhooks</span>} key="3">
                        <Empty description="No external webhooks configured for this tenant." style={{ margin: '40px 0' }} />
                        <div style={{ textAlign: 'center' }}>
                            <Button type="primary" icon={<PlusOutlined />}>Register Endpoint</Button>
                        </div>
                    </Tabs.TabPane>

                </Tabs>
            </Card>
        </div>
    );
};
