import { Users, Star, MessageSquare, TrendingUp, Search, Filter, MoreVertical, ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { cn } from '../utils/cn';
import { useState } from 'react';
import { Card, Table, Tabs, Input, Button, Typography, Tag, Select, Rate, Avatar, Progress, Space } from 'antd';

const { Title, Text } = Typography;

const customerStats = [
    { label: 'Total Customers', value: '12,482', change: '+8.4%', icon: Users, color: 'blue' },
    { label: 'Avg. Store Rating', value: '4.8', change: '0.2', icon: Star, color: 'amber' },
    { label: 'Total Reviews', value: '842', change: '+12', icon: MessageSquare, color: 'emerald' },
    { label: 'Retention Rate', value: '64%', change: '+2.1%', icon: TrendingUp, color: 'indigo' },
];

const topCustomers = [
    { name: 'Sarah Jenkins', orders: 42, spend: '$842.00', lastOrder: '2 hours ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    { name: 'Michael Chen', orders: 38, spend: '$756.20', lastOrder: '5 hours ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    { name: 'Emma Wilson', orders: 31, spend: '$612.40', lastOrder: '1 day ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
];

const reviews = [
    {
        id: 'REV-001',
        user: 'David Miller',
        rating: 5,
        comment: 'The produce was incredibly fresh and arrived earlier than expected. Great service!',
        date: 'Oct 24, 2023',
        status: 'Public',
        helpful: 12
    },
    {
        id: 'REV-002',
        user: 'Linda Thompson',
        rating: 4,
        comment: 'Overall good experience, but one of the milk cartons was slightly dented. Everything else was perfect.',
        date: 'Oct 23, 2023',
        status: 'Public',
        helpful: 8
    },
    {
        id: 'REV-003',
        user: 'Robert Smith',
        rating: 5,
        comment: 'DashDrive Mart has the best selection of organic items in the area. Highly recommend!',
        date: 'Oct 22, 2023',
        status: 'Pending',
        helpful: 0
    }
];

const allCustomerList = [
    { name: 'John Doe', email: 'john@example.com', orders: 12, spent: '$240.50', lastOrder: '2 days ago', avatar: 'JD', status: 'Active' },
    { name: 'Mary Smith', email: 'mary.s@gmail.com', orders: 5, spent: '$88.20', lastOrder: '1 week ago', avatar: 'MS', status: 'Active' },
    { name: 'Alex Brown', email: 'alex.b@outlook.com', orders: 1, spent: '$12.00', lastOrder: 'Yesterday', avatar: 'AB', status: 'New' },
    { name: 'Sarah Jenkins', email: 'sarah.j@company.com', orders: 42, spent: '$842.00', lastOrder: '2 hours ago', avatar: 'SJ', status: 'VIP' },
    { name: 'Michael Chen', email: 'mchen@tech.io', orders: 38, spent: '$756.20', lastOrder: '5 hours ago', avatar: 'MC', status: 'VIP' },
];

export function Customers() {
    const [activeTab, setActiveTab] = useState('insights');

    const customerColumns = [
        {
            title: 'Customer',
            key: 'customer',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-4">
                    <Avatar style={{ backgroundColor: '#18181b', color: '#fff' }} shape="square" size="large">
                        {record.avatar}
                    </Avatar>
                    <div>
                        <Text strong style={{ fontSize: '14px', display: 'block' }}>{record.name}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
                    </div>
                </div>
            )
        },
        {
            title: 'Orders',
            dataIndex: 'orders',
            key: 'orders',
            render: (orders: number) => <Text strong>{orders}</Text>
        },
        {
            title: 'Total Spent',
            dataIndex: 'spent',
            key: 'spent',
            render: (spent: string) => <Text strong>{spent}</Text>
        },
        {
            title: 'Last Order',
            dataIndex: 'lastOrder',
            key: 'lastOrder',
            render: (lastOrder: string) => <Text type="secondary">{lastOrder}</Text>
        },
        {
            title: 'Status',
            key: 'status',
            render: (_: any, record: any) => {
                let color = 'blue';
                if (record.status === 'VIP') color = 'gold';
                else if (record.status === 'Active') color = 'green';
                return <Tag color={color} style={{ fontWeight: 700, borderRadius: 12, border: 'none', padding: '0 8px', textTransform: 'uppercase' }}>{record.status}</Tag>;
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'right' as const,
            render: () => <Button type="text" shape="circle" icon={<MoreVertical size={16} />} />
        }
    ];

    const tabItems = [
        {
            key: 'insights',
            label: <span className="flex items-center gap-2"><TrendingUp size={16} /> Insights</span>,
            children: (
                <div className="space-y-8 animate-in fade-in duration-500">
                    {/* Customer Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {customerStats.map((stat, i) => (
                            <Card key={i} bordered={false} hoverable className="shadow-sm overflow-hidden group">
                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <div className={cn("p-3 rounded-2xl", `bg-${stat.color}-50 text-${stat.color}-600`)}>
                                        <stat.icon size={20} />
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                                        {stat.change}
                                    </span>
                                </div>
                                <Text type="secondary" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>{stat.label}</Text>
                                <Title level={2} style={{ margin: 0, marginTop: 4, letterSpacing: '-0.02em', fontWeight: 900 }}>{stat.value}</Title>

                                <div className={cn("absolute -bottom-4 -right-4 size-24 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700", `bg-${stat.color}-500`)} />
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Top Customers List */}
                        <Card bordered={false} className="lg:col-span-2 shadow-sm rounded-3xl" bodyStyle={{ padding: 32 }}>
                            <div className="flex items-center justify-between mb-8">
                                <Title level={4} style={{ margin: 0 }}>Top Value Customers</Title>
                                <div className="flex gap-2">
                                    <Button icon={<Filter size={16} />} style={{ borderRadius: 12 }} />
                                    <Button type="link" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px' }}>View All</Button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {topCustomers.map((customer, i) => (
                                    <div key={i} className="flex items-center gap-4 group hover:bg-gray-50 p-4 rounded-3xl transition-all border border-transparent hover:border-gray-100">
                                        <div className="relative">
                                            <Avatar src={customer.avatar} size={56} shape="square" style={{ borderRadius: 16 }} />
                                            <div className="absolute -bottom-1 -right-1 size-5 bg-amber-400 text-white rounded-full flex items-center justify-center border-2 border-white">
                                                <Star size={10} fill="currentColor" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <Text strong style={{ fontSize: '16px', display: 'block' }}>{customer.name}</Text>
                                            <Text type="secondary" style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Last order {customer.lastOrder}</Text>
                                        </div>
                                        <div className="text-right">
                                            <Text strong style={{ display: 'block', fontSize: '14px' }}>{customer.spend}</Text>
                                            <Text style={{ fontSize: '10px', color: '#10b981', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{customer.orders} Orders</Text>
                                        </div>
                                        <Button type="text" shape="circle" icon={<MoreVertical size={18} />} style={{ marginLeft: 8 }} />
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Customer Retention Card */}
                        <div className="bg-zinc-900 rounded-[40px] p-8 text-white relative overflow-hidden group shadow-xl shadow-zinc-200/50">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full -mr-24 -mt-24" />
                            <div className="relative z-10">
                                <div className="size-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 mb-8">
                                    <Users className="text-emerald-400" size={28} />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight leading-tight mb-4">Improve <br /> Customer Retention</h3>
                                <p className="text-sm text-zinc-400 font-medium mb-8">Returning customers spend 3x more on average than new shoppers.</p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                                        <span className="text-zinc-500">Target Goal</span>
                                        <span className="text-emerald-400">75%</span>
                                    </div>
                                    <Progress percent={64} strokeColor="#10b981" trailColor="rgba(255,255,255,0.05)" showInfo={false} strokeWidth={8} />
                                </div>

                                <Button block size="large" style={{ backgroundColor: '#fff', color: '#18181b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 16, border: 'none' }} className="shadow-2xl">
                                    Launch Loyalty Program
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'reviews',
            label: <span className="flex items-center gap-2"><MessageSquare size={16} /> Reviews</span>,
            children: (
                <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
                    <Card bordered={false} className="shadow-sm rounded-3xl" bodyStyle={{ padding: 40 }}>
                        <div className="flex items-center gap-12">
                            <div className="text-center">
                                <Title style={{ margin: 0, fontSize: '48px', fontWeight: 900, letterSpacing: '-0.05em' }}>4.8</Title>
                                <Rate disabled defaultValue={5} style={{ color: '#fbbf24', fontSize: '20px', margin: '8px 0' }} />
                                <Text type="secondary" style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Based on 842 reviews</Text>
                            </div>
                            <div className="flex-1 space-y-3">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <div key={rating} className="flex items-center gap-4">
                                        <Text type="secondary" strong style={{ width: 16 }}>{rating}</Text>
                                        <Progress
                                            percent={rating === 5 ? 75 : rating === 4 ? 20 : 5}
                                            showInfo={false}
                                            strokeColor="#fbbf24"
                                            trailColor="#f9fafb"
                                            strokeWidth={6}
                                            style={{ margin: 0, flex: 1 }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Title level={4} style={{ margin: 0 }}>Recent Feedback</Title>
                            <Space>
                                <Input prefix={<Search size={16} className="text-gray-400" />} placeholder="Search reviews..." style={{ width: 200, borderRadius: 12 }} />
                                <Select defaultValue="Latest First" style={{ width: 140 }} options={[{ value: 'Latest First', label: 'Latest First' }, { value: 'Top Rated', label: 'Top Rated' }]} />
                            </Space>
                        </div>

                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <Card key={review.id} bordered={false} className="shadow-sm rounded-3xl hover:border-zinc-200 transition-all" bodyStyle={{ padding: 32 }}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar icon={<User size={24} />} size={48} style={{ backgroundColor: '#fafafa', color: '#a1a1aa', border: '1px solid #f4f4f5' }} shape="square" className="rounded-2xl" />
                                            <div>
                                                <Text strong style={{ fontSize: '16px', display: 'block' }}>{review.user}</Text>
                                                <Rate disabled defaultValue={review.rating} style={{ color: '#fbbf24', fontSize: '12px' }} />
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Text type="secondary" style={{ display: 'block', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{review.date}</Text>
                                            <Tag color={review.status === 'Public' ? 'success' : 'warning'} style={{ marginTop: 8, borderRadius: 8, border: 'none', fontWeight: 900, textTransform: 'uppercase' }}>
                                                {review.status}
                                            </Tag>
                                        </div>
                                    </div>
                                    <Text type="secondary" style={{ display: 'block', fontSize: '14px', fontStyle: 'italic', marginBottom: 24 }}>"{review.comment}"</Text>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                        <Space size="large">
                                            <Button type="text" icon={<ThumbsUp size={14} />} style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af' }}>{review.helpful} Helpful</Button>
                                            <Button type="text" icon={<ThumbsDown size={14} />} style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af' }}>Report</Button>
                                        </Space>
                                        <Button type="primary" style={{ backgroundColor: '#18181b', borderRadius: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px' }} className="shadow-lg shadow-zinc-200">
                                            Reply to Review
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'list',
            label: <span className="flex items-center gap-2"><Users size={16} /> Customer List</span>,
            children: (
                <Card bordered={false} className="shadow-sm rounded-3xl animate-in fade-in duration-500" bodyStyle={{ padding: 0 }}>
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                        <Input size="large" prefix={<Search size={18} className="text-gray-400" />} placeholder="Search by name, email or phone..." style={{ width: 384, borderRadius: 16 }} />
                        <Space>
                            <Button size="large" icon={<Filter size={16} />} style={{ borderRadius: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px' }}>
                                Filters
                            </Button>
                            <Button type="primary" size="large" style={{ backgroundColor: '#18181b', borderRadius: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px' }} className="shadow-xl shadow-zinc-200">
                                Export CSV
                            </Button>
                        </Space>
                    </div>
                    <Table
                        columns={customerColumns}
                        dataSource={allCustomerList}
                        pagination={{ pageSize: 5 }}
                        rowKey="email"
                        className="custom-table"
                    />
                </Card>
            )
        },
        {
            key: 'segments',
            label: <span className="flex items-center gap-2"><Filter size={16} /> Segments</span>,
            children: (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
                    {[
                        { title: 'High Value Customers', criteria: 'Total Spent > $1,000', count: 124, growth: '+12%', color: 'amber', icon: TrendingUp },
                        { title: 'Frequent Buyers', criteria: 'Orders > 10 per month', count: 85, growth: '+5%', color: 'blue', icon: Star },
                        { title: 'New Customers', criteria: 'First order < 30 days', count: 420, growth: '+24%', color: 'emerald', icon: User },
                        { title: 'Inactive Customers', criteria: 'No orders > 60 days', count: 18, growth: '-2%', color: 'rose', icon: Users },
                    ].map((segment, i) => (
                        <Card key={i} bordered={false} hoverable className="shadow-sm rounded-3xl" bodyStyle={{ padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div className="flex items-center gap-6">
                                <div className={cn("p-5 rounded-[24px]", `bg-${segment.color}-50 text-${segment.color}-600`)}>
                                    <segment.icon size={28} />
                                </div>
                                <div>
                                    <Title level={4} style={{ margin: 0 }}>{segment.title}</Title>
                                    <Text type="secondary" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{segment.criteria}</Text>
                                </div>
                            </div>
                            <div className="text-right">
                                <Title style={{ margin: 0, fontSize: '30px', fontWeight: 900, letterSpacing: '-0.05em' }}>{segment.count}</Title>
                                <Tag color={segment.growth.startsWith('+') ? 'success' : 'error'} style={{ margin: 0, marginTop: 4, borderRadius: 8, border: 'none', fontWeight: 900 }}>
                                    {segment.growth}
                                </Tag>
                            </div>
                        </Card>
                    ))}

                    <div className="lg:col-span-2 bg-zinc-900 rounded-[40px] p-10 text-white flex items-center justify-between relative overflow-hidden shadow-xl shadow-zinc-200/50">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full" />
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black tracking-tight mb-2">Create Custom Segment</h3>
                            <p className="text-zinc-400 text-sm max-w-md">Define your own rules to group customers based on specific behavior, tags, or demographic data.</p>
                        </div>
                        <Button size="large" style={{ backgroundColor: '#fff', color: '#18181b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', borderRadius: 24, padding: '0 40px', height: 56, border: 'none' }} className="shadow-2xl relative z-10">
                            New Segment
                        </Button>
                    </div>
                </div>
            )
        },
        {
            key: 'loyalty',
            label: <span className="flex items-center gap-2"><Star size={16} /> Loyalty</span>,
            children: (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card bordered={false} className="lg:col-span-2 shadow-sm rounded-3xl" bodyStyle={{ padding: 40 }}>
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <Title level={3} style={{ margin: 0 }}>Active Rewards Rules</Title>
                                    <Text type="secondary">Configure how your customers earn and redeem points.</Text>
                                </div>
                                <Button type="primary" size="large" style={{ backgroundColor: '#18181b', borderRadius: 16, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    Add Rule
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { title: 'Free Item on 10th Order', type: 'Frequency', reward: 'Free Burger/Sides', members: 48, status: 'Active' },
                                    { title: '$10 Off for $100 Spend', type: 'Spending', reward: '$10 Wallet Credit', members: 156, status: 'Active' },
                                    { title: 'Birthday Special', type: 'Event', reward: '20% Discount', members: 842, status: 'Paused' },
                                ].map((rule, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100 group hover:border-zinc-200 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="size-12 bg-white rounded-2xl flex items-center justify-center text-zinc-900 shadow-sm border border-gray-100">
                                                <TrendingUp size={20} />
                                            </div>
                                            <div>
                                                <Title level={5} style={{ margin: 0 }}>{rule.title}</Title>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <Text type="secondary" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{rule.type} Rule</Text>
                                                    <Tag style={{ margin: 0, backgroundColor: '#fff', border: 'none', borderRadius: 4, fontWeight: 900, textTransform: 'uppercase', fontSize: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>Reward: {rule.reward}</Tag>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <Text strong style={{ display: 'block', fontSize: '14px' }}>{rule.members}</Text>
                                                <Text type="secondary" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Members</Text>
                                            </div>
                                            <Tag color={rule.status === 'Active' ? 'success' : 'default'} style={{ borderRadius: 12, border: 'none', fontWeight: 900, textTransform: 'uppercase', padding: '4px 12px' }}>
                                                {rule.status}
                                            </Tag>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <div className="bg-amber-400 rounded-[40px] p-10 text-zinc-900 relative overflow-hidden shadow-2xl shadow-amber-100/50">
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/20 blur-3xl rounded-full" />
                            <Title level={3} style={{ margin: 0, marginBottom: 32, letterSpacing: '-0.02em', fontWeight: 900 }}>Loyalty <br /> Impact Analytics</Title>

                            <div className="space-y-10">
                                <div>
                                    <Text style={{ display: 'block', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: 8 }}>Total Points Earned</Text>
                                    <Title style={{ margin: 0, fontSize: '36px', letterSpacing: '-0.05em', fontWeight: 900 }}>1.2M</Title>
                                </div>
                                <div>
                                    <Text style={{ display: 'block', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: 8 }}>Retention Uplift</Text>
                                    <Title style={{ margin: 0, fontSize: '36px', letterSpacing: '-0.05em', fontWeight: 900 }}>+18.4%</Title>
                                </div>
                                <div>
                                    <Text style={{ display: 'block', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: 8 }}>Rewards Redeemed</Text>
                                    <Title style={{ margin: 0, fontSize: '36px', letterSpacing: '-0.05em', fontWeight: 900 }}>4,281</Title>
                                </div>
                            </div>

                            <Button block size="large" style={{ marginTop: 48, backgroundColor: '#18181b', color: '#fff', borderRadius: 24, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', border: 'none', height: 48 }} className="shadow-2xl">
                                Detailed Report
                            </Button>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
                className="custom-tabs-container"
                size="large"
            />
        </div>
    );
}
