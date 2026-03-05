import React, { useState } from 'react';
import { Typography, Card, Table, Button, Space, Tag, Input, Avatar, Dropdown, MenuProps } from 'antd';
import { Users, Plus, Edit, Trash2, Search, Filter, MoreVertical, Mail, Phone, Shield } from 'lucide-react';

const { Title, Text } = Typography;

// Mock Data
const mockEmployees = [
    {
        id: 'EMP-001',
        name: 'Sarah Jenkins',
        email: 'sarah.j@dashdrive.com',
        phone: '+263 77 123 4567',
        role: 'SUPER_ADMIN',
        department: 'Management',
        status: 'Active',
        joinDate: '2025-01-15',
        avatar: 'S'
    },
    {
        id: 'EMP-002',
        name: 'Michael Chang',
        email: 'm.chang@dashdrive.com',
        phone: '+254 71 987 6543',
        role: 'DISPATCHER',
        department: 'Operations',
        status: 'Active',
        joinDate: '2025-02-01',
        avatar: 'M'
    },
    {
        id: 'EMP-003',
        name: 'Aisha Patel',
        email: 'aisha.p@dashdrive.com',
        phone: '+234 80 555 1234',
        role: 'SUPPORT_AGENT',
        department: 'Customer Service',
        status: 'On Leave',
        joinDate: '2025-03-10',
        avatar: 'A'
    },
    {
        id: 'EMP-004',
        name: 'David Osei',
        email: 'david.o@dashdrive.com',
        phone: '+233 24 111 2222',
        role: 'FINANCE_MANAGER',
        department: 'Finance',
        status: 'Active',
        joinDate: '2025-04-22',
        avatar: 'D'
    },
    {
        id: 'EMP-005',
        name: 'Elena Rodriguez',
        email: 'elena.r@dashdrive.com',
        phone: '+27 82 333 4444',
        role: 'MARKETING_LEAD',
        department: 'Marketing',
        status: 'Suspended',
        joinDate: '2025-05-05',
        avatar: 'E'
    }
];

export function Employees() {
    const [searchText, setSearchText] = useState('');

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN': return 'purple';
            case 'DISPATCHER': return 'blue';
            case 'SUPPORT_AGENT': return 'cyan';
            case 'FINANCE_MANAGER': return 'gold';
            case 'MARKETING_LEAD': return 'magenta';
            default: return 'default';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'success';
            case 'On Leave': return 'warning';
            case 'Suspended': return 'error';
            default: return 'default';
        }
    };

    const actionMenu: MenuProps['items'] = [
        { key: 'edit', icon: <Edit className="w-4 h-4" />, label: 'Edit Profile' },
        { key: 'permissions', icon: <Shield className="w-4 h-4" />, label: 'Manage Permissions' },
        { type: 'divider' },
        { key: 'delete', icon: <Trash2 className="w-4 h-4 text-red-500" />, label: <span className="text-red-500">Deactivate Account</span> },
    ];

    const columns = [
        {
            title: 'Employee',
            key: 'employee',
            render: (_: any, record: any) => (
                <Space>
                    <Avatar className="bg-primary/10 text-primary font-bold">{record.avatar}</Avatar>
                    <div className="flex flex-col">
                        <Text strong className="text-zinc-800">{record.name}</Text>
                        <Text type="secondary" className="text-xs">{record.id}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Contact Information',
            key: 'contact',
            render: (_: any, record: any) => (
                <Space direction="vertical" size="small">
                    <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <Mail className="w-3 h-3" /> {record.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <Phone className="w-3 h-3" /> {record.phone}
                    </div>
                </Space>
            ),
        },
        {
            title: 'Role & Department',
            key: 'role',
            render: (_: any, record: any) => (
                <Space direction="vertical" size="small">
                    <Tag color={getRoleColor(record.role)} className="rounded-md border-0 bg-opacity-20">{record.role.replace('_', ' ')}</Tag>
                    <Text type="secondary" className="text-xs">{record.department}</Text>
                </Space>
            ),
        },
        {
            title: 'Join Date',
            dataIndex: 'joinDate',
            key: 'joinDate',
            render: (text: string) => <Text type="secondary">{new Date(text).toLocaleDateString()}</Text>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={getStatusColor(status)} className="rounded-full px-3 m-0">
                    {status}
                </Tag>
            ),
        },
        {
            title: '',
            key: 'actions',
            width: 60,
            render: () => (
                <Dropdown menu={{ items: actionMenu }} trigger={['click']} placement="bottomRight">
                    <Button type="text" icon={<MoreVertical className="w-4 h-4 text-zinc-400" />} />
                </Dropdown>
            ),
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <Title level={3} className="m-0 tracking-tight">Employee Directory</Title>
                        <Text type="secondary">Manage internal staff accounts, roles, and departmental access.</Text>
                    </div>
                </div>
                <Button type="primary" icon={<Plus className="w-4 h-4" />} className="h-11 px-6 rounded-xl font-medium shadow-md shadow-primary/20">
                    Add Employee
                </Button>
            </div>

            <Card className="rounded-3xl shadow-sm border-zinc-100 overflow-hidden" bodyStyle={{ padding: 0 }}>
                <div className="p-5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                    <Input
                        placeholder="Search by name, email, or role..."
                        prefix={<Search className="w-4 h-4 text-zinc-400" />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-80 rounded-xl h-10"
                    />
                    <Space>
                        <Button icon={<Filter className="w-4 h-4" />} className="h-10 rounded-xl">Filter</Button>
                        <Button className="h-10 rounded-xl">Export CSV</Button>
                    </Space>
                </div>
                <Table
                    columns={columns}
                    dataSource={mockEmployees}
                    rowKey="id"
                    pagination={{ pageSize: 10, className: 'px-6' }}
                    className="[&_.ant-table-thead_th]:bg-zinc-50/50 [&_.ant-table-thead_th]:font-semibold [&_.ant-table-thead_th]:text-zinc-500 [&_.ant-table-tbody_td]:py-4"
                />
            </Card>
        </div>
    );
}
