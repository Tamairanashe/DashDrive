import { Plus, Zap, Calendar, ArrowRight, Filter, Search, Tag as TagIcon, MoreVertical } from 'lucide-react';
import { cn } from '../../utils/cn';
import { StatusBadge } from '../common/StatusBadge';
import { Card, Table, Typography, Button, Input, Tag } from 'antd';

const { Title, Text } = Typography;

import { useState, useEffect } from 'react';
import { api } from '../../api';

export function Campaigns({ token }: { token: string }) {
    const [campaignList, setCampaignList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadCampaigns = async () => {
        setLoading(true);
        try {
            const data = await api.marketing.getCampaigns(token);
            setCampaignList(data);
        } catch (err: any) {
            console.error('Failed to load campaigns:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCampaigns();
    }, [token]);

    const columns = [
        {
            title: 'Campaign Info',
            key: 'info',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400">
                        <Zap size={20} />
                    </div>
                    <div>
                        <Text strong style={{ fontSize: '14px', display: 'block' }}>{record.name}</Text>
                        <Text type="secondary" style={{ fontSize: '10px', fontWeight: 700 }}>{record.id}</Text>
                    </div>
                </div>
            )
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => (
                <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-blue-500" />
                    <Text strong style={{ fontSize: '12px' }}>{type}</Text>
                </div>
            )
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
            render: (discount: string) => (
                <Tag color="success" style={{ fontWeight: 900, borderRadius: 8, padding: '2px 8px', border: 'none' }}>
                    {discount}
                </Tag>
            )
        },
        {
            title: 'Schedule',
            key: 'schedule',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <Calendar size={14} className="text-zinc-300" />
                    <span>{record.startDate}</span>
                    <ArrowRight size={10} />
                    <span>{record.endDate}</span>
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => <StatusBadge status={status} />
        },
        {
            title: 'Revenue',
            key: 'revenue',
            align: 'right' as const,
            render: (_: any, record: any) => (
                <div>
                    <Text strong style={{ fontSize: '14px', display: 'block' }}>{record.revenue}</Text>
                    <Text type="secondary" style={{ fontSize: '10px', fontWeight: 700 }}>{record.products} Products</Text>
                </div>
            )
        },
        {
            title: '',
            key: 'actions',
            align: 'right' as const,
            render: () => (
                <Button type="text" shape="circle" icon={<MoreVertical size={16} />} />
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Title level={2} style={{ margin: 0, fontWeight: 900, letterSpacing: '-0.02em' }}>Marketing Campaigns</Title>
                    <Text type="secondary" style={{ fontWeight: 500 }}>Drive volume with targeted, time-limited promotions</Text>
                </div>
                <Button type="primary" size="large" icon={<Plus size={18} />} style={{ backgroundColor: '#18181b', borderRadius: 20, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} className="shadow-xl shadow-zinc-200">
                    Create Campaign
                </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Active Campaigns', value: '3', icon: Zap, color: 'emerald' },
                    { label: 'Avg. Conversion', value: '12.4%', icon: Zap, color: 'blue' },
                    { label: 'Campaign Revenue', value: '$13,690', icon: TagIcon, color: 'amber' },
                ].map((stat, i) => (
                    <Card key={i} bordered={false} hoverable className="shadow-sm rounded-[32px]" bodyStyle={{ padding: 24 }}>
                        <div className="flex items-center gap-4">
                            <div className={cn("p-3 rounded-2xl", `bg-${stat.color}-50 text-${stat.color}-600`)}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <Text type="secondary" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block' }}>{stat.label}</Text>
                                <Title level={3} style={{ margin: 0, marginTop: 4, letterSpacing: '-0.02em', fontWeight: 900 }}>{stat.value}</Title>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* List Table */}
            <Card bordered={false} className="shadow-sm rounded-[40px] overflow-hidden" bodyStyle={{ padding: 0 }}>
                <div className="p-6 border-b border-gray-50 flex items-center justify-between gap-4 bg-gray-50/30">
                    <Input
                        prefix={<Search size={18} className="text-gray-400" />}
                        placeholder="Find campaigns..."
                        style={{ maxWidth: 400, borderRadius: 12, backgroundColor: '#f9fafb', border: 'none' }}
                        size="large"
                    />
                    <Button icon={<Filter size={18} />} style={{ borderRadius: 12 }} size="large" />
                </div>
                <Table
                    columns={columns}
                    dataSource={campaignList}
                    loading={loading}
                    pagination={false}
                    rowKey="id"
                    className="custom-table"
                />
            </Card>
        </div>
    );
}
