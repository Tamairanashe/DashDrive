import React, { useState, useEffect } from 'react';
import { 
  Typography, Row, Col, Card, Tabs, Table, Button, Tag, Space, 
  Form, Input, Select, Badge, Empty, Drawer, InputNumber, message 
} from 'antd';
import { 
  UserOutlined, WalletOutlined, PlusOutlined, DeleteOutlined, 
  EditOutlined, CrownOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

export const UserManagementPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState<any[]>([]);
    const [tiers, setTiers] = useState<any[]>([]);
    const [employeeDrawerVisible, setEmployeeDrawerVisible] = useState(false);
    const [tierDrawerVisible, setTierDrawerVisible] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<any>(null);
    const [editingTier, setEditingTier] = useState<any>(null);
    const [employeeForm] = Form.useForm();
    const [tierForm] = Form.useForm();

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

    const handleEditEmployee = (record: any) => {
        setEditingEmployee(record);
        employeeForm.setFieldsValue(record);
        setEmployeeDrawerVisible(true);
    };

    const handleSaveEmployee = (values: any) => {
        setLoading(true);
        setTimeout(() => {
            if (editingEmployee) {
                setEmployees(prev => prev.map(em => em.id === editingEmployee.id ? { ...em, ...values } : em));
                message.success('Employee updated');
            } else {
                const newEmp = { ...values, id: `EMP-${Math.floor(Math.random() * 100)}`, status: 'Active' };
                setEmployees(prev => [...prev, newEmp]);
                message.success('Employee added');
            }
            setEmployeeDrawerVisible(false);
            setEditingEmployee(null);
            employeeForm.resetFields();
            setLoading(false);
        }, 1000);
    };

    const handleEditTier = (record: any) => {
        setEditingTier(record);
        tierForm.setFieldsValue(record);
        setTierDrawerVisible(true);
    };

    const handleSaveTier = (values: any) => {
        setLoading(true);
        setTimeout(() => {
            if (editingTier) {
                setTiers(prev => prev.map(t => t.id === editingTier.id ? { ...t, ...values } : t));
                message.success('Tier updated');
            } else {
                const newTier = { ...values, id: `T-${Math.floor(Math.random() * 10)}` };
                setTiers(prev => [...prev, newTier]);
                message.success('Tier created');
            }
            setTierDrawerVisible(false);
            setEditingTier(null);
            tierForm.resetFields();
            setLoading(false);
        }, 1000);
    };

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
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />} 
                            style={{ marginBottom: 16 }}
                            onClick={() => {
                                setEditingEmployee(null);
                                employeeForm.resetFields();
                                setEmployeeDrawerVisible(true);
                            }}
                        >
                            Add Employee
                        </Button>
                        <Table 
                            loading={loading}
                            dataSource={employees} 
                            rowKey="id"
                            columns={[
                                { title: 'Employee ID', dataIndex: 'id' },
                                { title: 'Name', dataIndex: 'name', render: (t) => <strong>{t}</strong> },
                                { title: 'Role (RBAC)', dataIndex: 'role', render: (r) => <Tag color="blue">{r}</Tag> },
                                { title: 'Status', dataIndex: 'status', render: (s) => <Badge status="success" text={s} /> },
                                { title: 'Action', render: (_, record) => (
                                    <Space>
                                        <Button size="small" icon={<EditOutlined />} onClick={() => handleEditEmployee(record)}/>
                                        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => setEmployees(prev => prev.filter(e => e.id !== record.id))}/>
                                    </Space>
                                )}
                            ]}
                        />
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><CrownOutlined /> Loyalty Tiers Setup</span>} key="2">
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />} 
                            style={{ marginBottom: 16 }}
                            onClick={() => {
                                setEditingTier(null);
                                tierForm.resetFields();
                                setTierDrawerVisible(true);
                            }}
                        >
                            Create Tier
                        </Button>
                        <Table 
                            loading={loading}
                            dataSource={tiers} 
                            rowKey="id"
                            columns={[
                                { title: 'Tier Name', dataIndex: 'name', render: (t) => <strong>{t}</strong> },
                                { title: 'Trips Required', dataIndex: 'reqTrips' },
                                { title: 'Configured Benefits', dataIndex: 'benefits' },
                                { title: 'Action', render: (_, record) => (
                                    <Space>
                                        <Button size="small" icon={<EditOutlined />} onClick={() => handleEditTier(record)}/>
                                        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => setTiers(prev => prev.filter(t => t.id !== record.id))}/>
                                    </Space>
                                )}
                            ]}
                        />
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><WalletOutlined /> Global Master Wallets</span>} key="3">
                        <Empty description="Master Ledger view requires Admin authentication and audit clearance." style={{ margin: '40px 0' }} />
                    </Tabs.TabPane>
                </Tabs>
            </Card>

            {/* Employee Drawer */}
            <Drawer
                title={editingEmployee ? "Edit Employee" : "Add Employee"}
                open={employeeDrawerVisible}
                onClose={() => setEmployeeDrawerVisible(false)}
                width={400}
                extra={<Button type="primary" onClick={() => employeeForm.submit()} loading={loading}>Save</Button>}
                destroyOnClose
            >
                <Form form={employeeForm} layout="vertical" onFinish={handleSaveEmployee}>
                    <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Support Agent">Support Agent</Option>
                            <Option value="Super Admin">Super Admin</Option>
                            <Option value="Dispatcher">Dispatcher</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Drawer>

            {/* Tier Drawer */}
            <Drawer
                title={editingTier ? "Edit Loyalty Tier" : "Create Loyalty Tier"}
                open={tierDrawerVisible}
                onClose={() => setTierDrawerVisible(false)}
                width={400}
                extra={<Button type="primary" onClick={() => tierForm.submit()} loading={loading}>Save</Button>}
                destroyOnClose
            >
                <Form form={tierForm} layout="vertical" onFinish={handleSaveTier}>
                    <Form.Item name="name" label="Tier Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="reqTrips" label="Required Trips" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="benefits" label="Benefits">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};
