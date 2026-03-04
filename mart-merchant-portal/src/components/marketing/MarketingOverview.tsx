import {
    Megaphone, TrendingUp, Users,
    Star, Zap,
    MousePointer2
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Card, Typography, Button } from 'antd';

const { Title, Text } = Typography;

const promoData = [
    { name: 'Jan', redemptions: 400, sales: 2400 },
    { name: 'Feb', redemptions: 300, sales: 1398 },
    { name: 'Mar', redemptions: 200, sales: 9800 },
    { name: 'Apr', redemptions: 278, sales: 3908 },
    { name: 'May', redemptions: 189, sales: 4800 },
    { name: 'Jun', redemptions: 239, sales: 3800 },
];

export function MarketingOverview() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Top Level Marketing Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Redemptions', value: '1,284', change: '+12.5%', icon: Megaphone, color: 'blue' },
                    { label: 'Promo Sales', value: '$8,432.00', change: '+18.2%', icon: TrendingUp, color: 'emerald' },
                    { label: 'New Customers', value: '342', change: '+5.4%', icon: Users, color: 'indigo' },
                    { label: 'Click Rate', value: '4.2%', change: '+0.8%', icon: MousePointer2, color: 'amber' },
                ].map((stat, i) => (
                    <Card key={i} bordered={false} hoverable className="shadow-sm rounded-[32px]">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2.5 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl`}>
                                <stat.icon size={20} />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">{stat.change}</span>
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>{stat.label}</Text>
                        <Title level={3} style={{ margin: 0, marginTop: 4, letterSpacing: '-0.02em', fontWeight: 900 }}>{stat.value}</Title>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Promotion Performance Chart */}
                <Card bordered={false} className="lg:col-span-2 shadow-sm rounded-[40px]" bodyStyle={{ padding: 32 }}>
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <Title level={4} style={{ margin: 0 }}>Campaign Impact</Title>
                            <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, marginTop: 4, display: 'block' }}>Incremental sales driven by promotions</Text>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={promoData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    labelStyle={{ fontWeight: 900, color: '#1e293b' }}
                                />
                                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Featured / Boosted Items */}
                <Card bordered={false} className="shadow-sm rounded-[40px]" bodyStyle={{ padding: 32 }}>
                    <div className="flex items-center justify-between mb-8">
                        <Title level={4} style={{ margin: 0 }}>Featured Items</Title>
                        <Button type="link" style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px' }}>Manage</Button>
                    </div>
                    <div className="space-y-6">
                        {[
                            { name: 'Organic Bananas', sales: 124, boost: '2.4x', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=100&h=100' },
                            { name: 'Whole Milk 2L', sales: 89, boost: '1.8x', image: 'https://images.unsplash.com/photo-1550583726-2248277c63b2?auto=format&fit=crop&q=80&w=100&h=100' },
                            { name: 'Avocado Pack', sales: 212, boost: '3.1x', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=100&h=100' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 group hover:bg-gray-50 p-2 -mx-2 rounded-2xl transition-all cursor-pointer">
                                <img src={item.image} alt={item.name} className="size-16 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                                <div className="flex-1">
                                    <Text strong style={{ fontSize: '14px', display: 'block' }}>{item.name}</Text>
                                    <Text type="secondary" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.sales} Sales</Text>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                                        <Zap size={10} className="fill-emerald-500" />
                                        <span className="text-[10px] font-black">{item.boost}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-50/50">
                        <div className="flex items-start gap-4">
                            <Star className="text-blue-500 mt-1 shrink-0" size={18} />
                            <div>
                                <Text strong style={{ color: '#1e3a8a', display: 'block', fontSize: '14px' }}>Boost Visibility</Text>
                                <Text style={{ color: '#1d4ed8', fontSize: '12px', opacity: 0.8 }}>Boosted items appear 30% more often in search results.</Text>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
