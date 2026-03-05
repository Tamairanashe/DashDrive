import React, { useState } from 'react';
import { Typography, Card, Table, Button, Space, Tag, Input, Modal, Form, InputNumber, Select, Switch, Divider, List } from 'antd';
import { Trophy, Plus, Edit, Trash2, Award, Star, Zap, Search, HelpCircle } from 'lucide-react';

const { Title, Text } = Typography;
const { Option } = Select;
const StyledCard = Card as any;

// Mock Data
const mockTiers = [
    {
        id: '1',
        name: 'Bronze',
        color: 'orange',
        minOrders: 0,
        minSpend: 0,
        status: true,
        benefits: ['Basic Support', 'Standard Delivery'],
        icon: <Star className="w-4 h-4" />
    },
    {
        id: '2',
        name: 'Silver',
        color: 'cyan',
        minOrders: 10,
        minSpend: 150,
        status: true,
        benefits: ['Priority Support', '5% Discount on Rides', 'Free Standard Delivery'],
        icon: <Award className="w-4 h-4" />
    },
    {
        id: '3',
        name: 'Gold',
        color: 'gold',
        minOrders: 50,
        minSpend: 800,
        status: true,
        benefits: ['24/7 VIP Support', '10% Discount on Rides', 'Priority Dispatch', 'Exclusive Mart Offers'],
        icon: <Trophy className="w-4 h-4" />
    },
    {
        id: '4',
        name: 'Platinum',
        color: 'purple',
        minOrders: 150,
        minSpend: 2500,
        status: false,
        benefits: ['Dedicated Account Manager', 'Free Premium Delivery', '15% Off All Services', 'Early Access to Deals'],
        icon: <Zap className="w-4 h-4" />
    }
];

export function CustomerLevelSetup() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTier, setEditingTier] = useState<any>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingTier(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: any) => {
        setEditingTier(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'Level / Tier Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => (
                <Space>
                    <div style={{ color: `var(--ant-${record.color}-6)` }}>{record.icon}</div>
                    <Text strong>{text}</Text>
                </Space>
            ),
        },
        {
            title: 'Requirements (Lifetime)',
            key: 'requirements',
            render: (_: any, record: any) => (
                <Space direction="vertical" size="small">
                    <Text type="secondary"><strong className="text-zinc-700">{record.minOrders}</strong> Min. Orders</Text>
                    <Text type="secondary"><strong className="text-zinc-700">${record.minSpend}</strong> Min. Spend</Text>
                </Space>
            ),
        },
        {
            title: 'Key Benefits',
            dataIndex: 'benefits',
            key: 'benefits',
            render: (benefits: string[]) => (
                <div className="flex flex-wrap gap-1 max-w-[250px]">
                    {benefits.slice(0, 2).map(b => <Tag key={b} className="rounded-md border-zinc-200 bg-zinc-50">{b}</Tag>)}
                    {benefits.length > 2 && <Tag className="rounded-md border-zinc-200 bg-zinc-50">+{benefits.length - 2} more</Tag>}
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: boolean) => (
                <Tag color={status ? 'success' : 'default'} className="rounded-full px-3">
                    {status ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    <Button type="text" icon={<Edit className="w-4 h-4" />} onClick={() => handleEdit(record)} />
                    <Button type="text" danger icon={<Trash2 className="w-4 h-4" />} />
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <Title level={2} className="m-0 flex items-center gap-2">
                        <Trophy className="w-8 h-8 text-primary" />
                        Customer Levels & Loyalty
                    </Title>
                    <Text type="secondary">Define rewards, perks, and ranking criteria for the customer loyalty program.</Text>
                </div>
                <Button type="primary" icon={<Plus className="w-4 h-4" />} onClick={handleAdd} className="h-10 px-6 rounded-xl font-medium">
                    Create New Tier
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {mockTiers.map(tier => (
                    <StyledCard key={tier.id} className="rounded-2xl shadow-sm border-zinc-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-zinc-50 rounded-xl" style={{ color: `var(--ant-${tier.color}-5)` }}>
                                {tier.icon}
                            </div>
                            <Tag color={tier.status ? 'success' : 'default'} className="m-0 rounded-full">{tier.status ? 'Active' : 'Draft'}</Tag>
                        </div>
                        <Title level={4} className="m-0 mb-1">{tier.name}</Title>
                        <Text type="secondary" className="text-xs">Unlocks at ${tier.minSpend} or {tier.minOrders} orders</Text>

                        <Divider className="my-3" />

                        <div className="space-y-2">
                            {tier.benefits.slice(0, 3).map((benefit, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-zinc-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                    <span className="truncate">{benefit}</span>
                                </div>
                            ))}
                            {tier.benefits.length > 3 && (
                                <Text type="secondary" className="text-xs italic pl-3.5">+{tier.benefits.length - 3} more features</Text>
                            )}
                        </div>
                    </StyledCard>
                ))}
            </div>

            <StyledCard className="rounded-2xl shadow-sm border-zinc-100" styles={{ body: { padding: 0 } }}>
                <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50 rounded-t-2xl">
                    <Input
                        placeholder="Search tiers..."
                        prefix={<Search className="w-4 h-4 text-zinc-400" />}
                        className="w-64 rounded-lg"
                    />
                    <Button icon={<HelpCircle className="w-4 h-4" />} type="text">How it works</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={mockTiers}
                    rowKey="id"
                    pagination={false}
                    className="[&_.ant-table-thead_th]:bg-zinc-50/50 [&_.ant-table-thead_th]:font-semibold [&_.ant-table-thead_th]:text-zinc-500"
                />
            </StyledCard>

            <Modal
                title={<div className="flex items-center gap-2"><Trophy className="w-5 h-5 text-primary" /> {editingTier ? 'Edit Tier' : 'Create New Tier'}</div>}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={600}
                className="[&_.ant-modal-content]:rounded-2xl"
            >
                <Form form={form} layout="vertical" className="mt-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="name" label="Tier Name" rules={[{ required: true }]}>
                            <Input placeholder="e.g. Diamond" className="rounded-lg" />
                        </Form.Item>
                        <Form.Item name="color" label="Theme Color">
                            <Select
                                className="[&_.ant-select-selector]:rounded-lg"
                                options={[
                                    { value: 'orange', label: 'Orange / Bronze' },
                                    { value: 'cyan', label: 'Cyan / Silver' },
                                    { value: 'gold', label: 'Yellow / Gold' },
                                    { value: 'purple', label: 'Purple / Platinum' },
                                    { value: 'blue', label: 'Blue / Diamond' }
                                ]}
                            />
                        </Form.Item>
                    </div>

                    <Divider><span className="text-xs uppercase text-zinc-400 font-bold tracking-wider">Unlocking Requirements</span></Divider>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="minOrders" label="Minimum Lifetime Orders" tooltip="User must complete this many orders to qualify.">
                            <InputNumber min={0} className="w-full rounded-lg" />
                        </Form.Item>
                        <Form.Item name="minSpend" label="Minimum Lifetime Spend ($)" tooltip="User must spend this much total across all services to qualify.">
                            <InputNumber min={0} prefix="$" className="w-full rounded-lg" />
                        </Form.Item>
                    </div>

                    <Divider><span className="text-xs uppercase text-zinc-400 font-bold tracking-wider">Configuration</span></Divider>

                    <Form.Item name="benefits" label="Key Benefits (Press Enter to add)">
                        <Select mode="tags" placeholder="Type a perk and hit enter" className="w-full [&_.ant-select-selector]:rounded-lg" />
                    </Form.Item>

                    <Form.Item name="status" valuePropName="checked" label="Active Status" extra="If inactive, users cannot graduate to this tier even if they meet requirements.">
                        <Switch />
                    </Form.Item>

                    <div className="flex justify-end gap-3 mt-8">
                        <Button onClick={handleCancel} className="rounded-xl font-medium">Cancel</Button>
                        <Button type="primary" htmlType="submit" className="rounded-xl font-medium">Save Tier Configuration</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}
