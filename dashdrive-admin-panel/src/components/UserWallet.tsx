import React, { useState } from 'react';
import { Typography, Card, Table, Button, Space, Tag, Input, Statistic, Row, Col, DatePicker, Select, Badge } from 'antd';
import { Wallet, ArrowUpRight, ArrowDownRight, RefreshCcw, Search, Download, Filter, UserCheck, Smartphone } from 'lucide-react';

const { Title, Text } = Typography;
const StyledCard = Card as any;
const { RangePicker } = DatePicker;

// Mock Data
const mockTransactions = [
    {
        id: 'TRX-9821',
        user: 'John Doe',
        userType: 'CUSTOMER',
        amount: 50.00,
        type: 'TOPUP',
        method: 'Card',
        status: 'SUCCESS',
        date: '2025-06-15T10:30:00Z',
    },
    {
        id: 'TRX-9822',
        user: 'Sarah Jenkins',
        userType: 'RIDER',
        amount: 15.50,
        type: 'EARNING',
        method: 'System',
        status: 'SUCCESS',
        date: '2025-06-15T11:45:00Z',
    },
    {
        id: 'TRX-9823',
        user: 'Test Mart Store',
        userType: 'MERCHANT',
        amount: 250.00,
        type: 'WITHDRAWAL',
        method: 'Bank Transfer',
        status: 'PENDING',
        date: '2025-06-15T14:20:00Z',
    },
    {
        id: 'TRX-9824',
        user: 'Mike Smith',
        userType: 'CUSTOMER',
        amount: 25.00,
        type: 'PAYMENT',
        method: 'Wallet',
        status: 'SUCCESS',
        date: '2025-06-16T09:15:00Z',
    },
    {
        id: 'TRX-9825',
        user: 'Alice Cooper',
        userType: 'RIDER',
        amount: 100.00,
        type: 'WITHDRAWAL',
        method: 'Mobile Money',
        status: 'FAILED',
        date: '2025-06-16T16:05:00Z',
    }
];

export function UserWallet() {
    const [searchText, setSearchText] = useState('');

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'TOPUP': return 'blue';
            case 'EARNING': return 'cyan';
            case 'PAYMENT': return 'purple';
            case 'WITHDRAWAL': return 'orange';
            default: return 'default';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SUCCESS': return 'success';
            case 'PENDING': return 'warning';
            case 'FAILED': return 'error';
            default: return 'default';
        }
    };

    const getUserTypeIcon = (type: string) => {
        switch (type) {
            case 'CUSTOMER': return <Smartphone className="w-3 h-3" />;
            case 'RIDER': return <UserCheck className="w-3 h-3" />;
            case 'MERCHANT': return <Wallet className="w-3 h-3" />;
            default: return null;
        }
    };

    const columns = [
        {
            title: 'Transaction ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => <Text strong className="font-mono text-xs">{text}</Text>,
        },
        {
            title: 'User',
            key: 'user',
            render: (_: any, record: any) => (
                <Space direction="vertical" size={2}>
                    <Text strong className="text-zinc-800">{record.user}</Text>
                    <Space className="text-zinc-500 text-xs">
                        {getUserTypeIcon(record.userType)}
                        <span>{record.userType}</span>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Type & Method',
            key: 'type',
            render: (_: any, record: any) => (
                <Space direction="vertical" size={2}>
                    <Tag color={getTypeColor(record.type)} className="rounded-md border-0 m-0">{record.type}</Tag>
                    <Text type="secondary" className="text-xs">{record.method}</Text>
                </Space>
            ),
        },
        {
            title: 'Amount',
            key: 'amount',
            align: 'right' as const,
            render: (_: any, record: any) => {
                const isPositive = record.type === 'TOPUP' || record.type === 'EARNING';
                return (
                    <Text strong className={isPositive ? 'text-green-600' : 'text-zinc-800'}>
                        {isPositive ? '+' : '-'}${record.amount.toFixed(2)}
                    </Text>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Badge
                    status={status === 'SUCCESS' ? 'success' : status === 'PENDING' ? 'warning' : 'error'}
                    text={<span className="text-xs font-semibold">{status}</span>}
                />
            ),
        },
        {
            title: 'Date & Time',
            dataIndex: 'date',
            key: 'date',
            render: (text: string) => (
                <Space direction="vertical" size={0}>
                    <Text className="text-sm">{new Date(text).toLocaleDateString()}</Text>
                    <Text type="secondary" className="text-xs">{new Date(text).toLocaleTimeString()}</Text>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <Title level={2} className="m-0 flex items-center gap-2">
                        <Wallet className="w-8 h-8 text-primary" />
                        Global User Wallets
                    </Title>
                    <Text type="secondary">Monitor platform-wide wallet balances, top-ups, and withdrawal requests.</Text>
                </div>
                <Space>
                    <RangePicker className="h-10 rounded-xl" />
                    <Button type="primary" icon={<Download className="w-4 h-4" />} className="h-10 rounded-xl font-medium shadow-md">
                        Export Report
                    </Button>
                </Space>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <StyledCard className="rounded-2xl shadow-sm border-zinc-100 hover:border-primary/50 transition-colors" styles={{ body: { padding: '20px' } }}>
                        <Statistic
                            title={<span className="text-zinc-500 font-medium">Total Platform Balance</span>}
                            value={124500.50}
                            precision={2}
                            prefix="$"
                            valueStyle={{ fontWeight: 800, color: '#18181b', fontSize: '28px' }}
                        />
                        <div className="mt-2 flex items-center gap-1 text-sm text-green-600 font-medium">
                            <ArrowUpRight className="w-4 h-4" />
                            <span>+4.2% from last week</span>
                        </div>
                    </StyledCard>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StyledCard className="rounded-2xl shadow-sm border-zinc-100 hover:border-blue-400/50 transition-colors" styles={{ body: { padding: '20px' } }}>
                        <Statistic
                            title={<span className="text-zinc-500 font-medium">Today's Top-Ups</span>}
                            value={3240.00}
                            precision={2}
                            prefix="$"
                            valueStyle={{ fontWeight: 800, color: '#2563eb', fontSize: '28px' }}
                        />
                        <div className="mt-2 flex items-center gap-1 text-sm text-green-600 font-medium">
                            <ArrowUpRight className="w-4 h-4" />
                            <span>+12.5% from yesterday</span>
                        </div>
                    </StyledCard>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StyledCard className="rounded-2xl shadow-sm border-zinc-100 hover:border-orange-400/50 transition-colors" styles={{ body: { padding: '20px' } }}>
                        <Statistic
                            title={<span className="text-zinc-500 font-medium">Pending Withdrawals</span>}
                            value={1850.25}
                            precision={2}
                            prefix="$"
                            valueStyle={{ fontWeight: 800, color: '#f59e0b', fontSize: '28px' }}
                        />
                        <div className="mt-2 flex items-center gap-1 text-sm text-zinc-500 font-medium">
                            <RefreshCcw className="w-4 h-4" />
                            <span>42 requests pending</span>
                        </div>
                    </StyledCard>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StyledCard className="rounded-2xl shadow-sm border-zinc-100 hover:border-purple-400/50 transition-colors" styles={{ body: { padding: '20px' } }}>
                        <Statistic
                            title={<span className="text-zinc-500 font-medium">Wallet Payments (Today)</span>}
                            value={8920.00}
                            precision={2}
                            prefix="$"
                            valueStyle={{ fontWeight: 800, color: '#9333ea', fontSize: '28px' }}
                        />
                        <div className="mt-2 flex items-center gap-1 text-sm text-red-500 font-medium">
                            <ArrowDownRight className="w-4 h-4" />
                            <span>-1.2% from yesterday</span>
                        </div>
                    </StyledCard>
                </Col>
            </Row>

            <StyledCard className="rounded-3xl shadow-sm border-zinc-100 overflow-hidden" styles={{ body: { padding: 0 } }}>
                <div className="p-5 border-b border-zinc-100 flex flex-wrap gap-4 justify-between items-center bg-zinc-50/50">
                    <Input
                        placeholder="Search by User, Transaction ID..."
                        prefix={<Search className="w-4 h-4 text-zinc-400" />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-80 rounded-xl h-10"
                    />
                    <Space>
                        <Select
                            defaultValue="ALL"
                            className="w-32 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:h-10"
                            options={[
                                { value: 'ALL', label: 'All Users' },
                                { value: 'CUSTOMER', label: 'Customers' },
                                { value: 'RIDER', label: 'Riders' },
                                { value: 'MERCHANT', label: 'Merchants' }
                            ]}
                        />
                        <Select
                            defaultValue="ALL_TYPES"
                            className="w-36 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:h-10"
                            options={[
                                { value: 'ALL_TYPES', label: 'All Types' },
                                { value: 'TOPUP', label: 'Top-Up' },
                                { value: 'WITHDRAWAL', label: 'Withdrawal' },
                                { value: 'PAYMENT', label: 'Payment' }
                            ]}
                        />
                        <Button icon={<Filter className="w-4 h-4" />} className="h-10 rounded-xl">More Filters</Button>
                    </Space>
                </div>
                <Table
                    columns={columns}
                    dataSource={mockTransactions}
                    rowKey="id"
                    pagination={{ pageSize: 8, className: 'px-6' }}
                    className="[&_.ant-table-thead_th]:bg-zinc-50/50 [&_.ant-table-thead_th]:font-semibold [&_.ant-table-thead_th]:text-zinc-500 [&_.ant-table-tbody_td]:py-4"
                />
            </StyledCard>
        </div>
    );
}
