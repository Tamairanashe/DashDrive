import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Tabs, Table, Button, Tag, Space, Modal, Form, Input, Select, Badge, Empty } from 'antd';
import { UserOutlined, SettingOutlined, WalletOutlined, PlusOutlined, DeleteOutlined, EditOutlined, CrownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

export const UserManagementPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState<any[]>([]);
    const [tiers, setTiers] = useState<any[]>([]);

    useEffect(() => {
        setTimeout(() => {
            setEmployees([
                { id: 'EMP-01', name: 'Alice Walker', role: 'Support Agent', status: 'Active' },
                { id: 'EMP-02', name: 'Bob Admin', role: 'Super Admin', status: 'Active' },
            ]);
            setTiers([
                { id: 'T-1', name: 'Bronze', reqTrips: 0, benefits: 'Standard' },
                { id: 'T-2', name: 'Silver', reqTrips: 20, benefits: '5% Off Deliveries' },
                { id: 'T-3', name: 'Gold', reqTrips: 50, benefits: 'Free Priority Support' },
            ]);
            setLoading(false);
        }, 600);
    }, []);

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={4} style={{ margin: 0 }}>Advanced User Management</Title>
                    <Text type="secondary">Manage internal staff, loyalty tiers, and global wallets.</Text>
                </Col>
            </Row>

            <Card bordered={false} className="shadow-sm">
                <Tabs defaultActiveKey="1" size="large">
                    <Tabs.TabPane tab={<span><UserOutlined /> Internal Employees</span>} key="1">
                        <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>Add Employee</Button>
                        <Table 
                            loading={loading}
                            dataSource={employees} 
                            rowKey="id"
                            columns={[
                                { title: 'Employee ID', dataIndex: 'id' },
                                { title: 'Name', dataIndex: 'name', render: (t) => <strong>{t}</strong> },
                                { title: 'Role (RBAC)', dataIndex: 'role', render: (r) => <Tag color="blue">{r}</Tag> },
                                { title: 'Status', dataIndex: 'status', render: (s) => <Badge status="success" text={s} /> },
                                { title: 'Action', render: () => <Space><Button size="small" icon={<EditOutlined />}/><Button size="small" danger icon={<DeleteOutlined />}/></Space>}
                            ]}
                        />
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><CrownOutlined /> Loyalty Tiers Setup</span>} key="2">
                        <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>Create Tier</Button>
                        <Table 
                            loading={loading}
                            dataSource={tiers} 
                            rowKey="id"
                            columns={[
                                { title: 'Tier Name', dataIndex: 'name', render: (t) => <strong>{t}</strong> },
                                { title: 'Trips Required', dataIndex: 'reqTrips' },
                                { title: 'Configured Benefits', dataIndex: 'benefits' },
                                { title: 'Action', render: () => <Space><Button size="small" icon={<EditOutlined />}/><Button size="small" danger icon={<DeleteOutlined />}/></Space>}
                            ]}
                        />
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><WalletOutlined /> Global Master Wallets</span>} key="3">
                        <Empty description="Master Ledger view requires Admin authentication and audit clearance." style={{ margin: '40px 0' }} />
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        </div>
    );
};
