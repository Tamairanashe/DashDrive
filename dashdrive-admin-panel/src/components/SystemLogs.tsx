import React, { useState } from 'react';
import { Typography, Card, Table, Button, Space, Tag, Input, Select, Badge } from 'antd';
import { FileSearch, Search, Filter, Download, Terminal, AlertCircle, Info, ShieldAlert } from 'lucide-react';

const { Title, Text } = Typography;
const StyledCard = Card as any;

// Mock Data
const mockLogs = [
    {
        id: 'LOG-884920',
        timestamp: '2025-06-15T14:32:45Z',
        service: 'payment-gateway',
        level: 'ERROR',
        message: 'Failed to connect to Stripe API: ETIMEDOUT 104.18.24.11:443',
        source: 'worker-node-1',
        context: '{ "orderId": "ORD-5892", "amount": 45.00, "currency": "USD" }'
    },
    {
        id: 'LOG-884919',
        timestamp: '2025-06-15T14:30:12Z',
        service: 'auth-service',
        level: 'WARN',
        message: 'Multiple invalid login attempts from IP 192.168.1.55',
        source: 'api-gateway',
        context: '{ "userEmail": "admin@dashdrive.com", "attempts": 5 }'
    },
    {
        id: 'LOG-884918',
        timestamp: '2025-06-15T14:28:05Z',
        service: 'dispatch-engine',
        level: 'INFO',
        message: 'Auto-assigned Rider RID-102 to Order ORD-5891',
        source: 'worker-node-2',
        context: '{ "algorithm": "nearest-neighbor", "distanceKm": 1.2 }'
    },
    {
        id: 'LOG-884917',
        timestamp: '2025-06-15T14:25:00Z',
        service: 'merchant-portal',
        level: 'INFO',
        message: 'Store XYZ updated business hours successfully',
        source: 'api-gateway',
        context: '{ "merchantId": "MER-401", "updatedFields": ["monday", "tuesday"] }'
    },
    {
        id: 'LOG-884916',
        timestamp: '2025-06-15T14:20:10Z',
        service: 'database',
        level: 'DEBUG',
        message: 'Executed slow query in 1205ms',
        source: 'primary-db',
        context: '{ "query": "SELECT * FROM orders WHERE status = \'PENDING\'", "duration": "1205ms" }'
    }
];

export function SystemLogs() {
    const [searchText, setSearchText] = useState('');
    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

    const getLevelConfig = (level: string) => {
        switch (level) {
            case 'ERROR': return { color: 'error', icon: <ShieldAlert className="w-3 h-3 text-red-500" /> };
            case 'WARN': return { color: 'warning', icon: <AlertCircle className="w-3 h-3 text-orange-500" /> };
            case 'INFO': return { color: 'blue', icon: <Info className="w-3 h-3 text-blue-500" /> };
            case 'DEBUG': return { color: 'default', icon: <Terminal className="w-3 h-3 text-zinc-500" /> };
            default: return { color: 'default', icon: null };
        }
    };

    const columns = [
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: 180,
            render: (text: string) => (
                <Space direction="vertical" size={0}>
                    <Text className="text-sm font-mono text-zinc-700">{new Date(text).toLocaleDateString()}</Text>
                    <Text type="secondary" className="text-xs font-mono">{new Date(text).toLocaleTimeString()}</Text>
                </Space>
            ),
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            width: 120,
            render: (level: string) => {
                const config = getLevelConfig(level);
                return (
                    <Tag color={config.color} className="rounded-md border-0 m-0 font-bold px-2 flex items-center gap-1 w-fit">
                        {config.icon} {level}
                    </Tag>
                );
            },
        },
        {
            title: 'Service & Source',
            key: 'service',
            width: 200,
            render: (_: any, record: any) => (
                <Space direction="vertical" size={2}>
                    <Text strong className="text-zinc-800 text-sm font-mono">{record.service}</Text>
                    <Text type="secondary" className="text-xs font-mono">{record.source}</Text>
                </Space>
            ),
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
            render: (text: string, record: any) => (
                <div className="flex flex-col gap-1">
                    <Text className={`text-sm ${record.level === 'ERROR' ? 'text-red-600 font-medium' : 'text-zinc-700'}`}>
                        {text}
                    </Text>
                    <Text type="secondary" className="text-xs font-mono text-zinc-400">ID: {record.id}</Text>
                </div>
            ),
        },
    ];

    const expandedRowRender = (record: any) => {
        return (
            <div className="p-4 bg-zinc-900 rounded-xl m-2 border border-zinc-800 font-mono text-xs overflow-x-auto shadow-inner">
                <div className="text-green-400 mb-2">// Raw Context JSON Data</div>
                <pre className="text-zinc-300 m-0 whitespace-pre-wrap">
                    {JSON.stringify(JSON.parse(record.context), null, 2)}
                </pre>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-50 shadow-lg shadow-zinc-900/10">
                        <Terminal className="w-6 h-6" />
                    </div>
                    <div>
                        <Title level={3} className="m-0 tracking-tight">System Logs & Audit Trail</Title>
                        <Text type="secondary">Real-time technical logs across all microservices for debugging and auditing.</Text>
                    </div>
                </div>
                <Space>
                    <Badge status="processing" text="Live Feed Active" className="mr-4 font-medium" />
                    <Button type="primary" icon={<Download className="w-4 h-4" />} className="h-11 px-6 rounded-xl font-medium shadow-md">
                        Export Logs
                    </Button>
                </Space>
            </div>

            <StyledCard className="rounded-3xl shadow-sm border-zinc-100 overflow-hidden" bodyStyle={{ padding: 0 }}>
                <div className="p-5 border-b border-zinc-100 flex flex-wrap gap-4 justify-between items-center bg-zinc-50/50">
                    <Input
                        placeholder="Search logs by message, service, or ID..."
                        prefix={<Search className="w-4 h-4 text-zinc-400" />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-96 rounded-xl h-10 font-mono text-sm"
                    />
                    <Space>
                        <Select
                            defaultValue="ALL_LEVELS"
                            className="w-32 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:h-10"
                            options={[
                                { value: 'ALL_LEVELS', label: 'All Levels' },
                                { value: 'ERROR', label: 'Error' },
                                { value: 'WARN', label: 'Warning' },
                                { value: 'INFO', label: 'Info' },
                                { value: 'DEBUG', label: 'Debug' }
                            ]}
                        />
                        <Select
                            defaultValue="ALL_SERVICES"
                            className="w-40 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:h-10"
                            options={[
                                { value: 'ALL_SERVICES', label: 'All Services' },
                                { value: 'auth-service', label: 'Auth Service' },
                                { value: 'payment-gateway', label: 'Payment Gateway' },
                                { value: 'dispatch-engine', label: 'Dispatch Engine' },
                                { value: 'merchant-portal', label: 'Merchant Portal' }
                            ]}
                        />
                    </Space>
                </div>
                <Table
                    columns={columns}
                    dataSource={mockLogs}
                    rowKey="id"
                    pagination={{ pageSize: 15, className: 'px-6' }}
                    expandable={{
                        expandedRowRender,
                        expandedRowKeys,
                        onExpand: (expanded, record) => {
                            setExpandedRowKeys(expanded
                                ? [...expandedRowKeys, record.id]
                                : expandedRowKeys.filter(k => k !== record.id)
                            );
                        }
                    }}
                    className="[&_.ant-table-thead_th]:bg-zinc-50/50 [&_.ant-table-thead_th]:font-semibold [&_.ant-table-thead_th]:text-zinc-500 [&_.ant-table-tbody_td]:py-3"
                />
            </StyledCard>
        </div>
    );
}
