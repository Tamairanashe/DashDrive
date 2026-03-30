import { Star, Zap, ArrowUpRight, BarChart3, Package } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Card, Typography, Button } from 'antd';

const { Title, Text } = Typography;

const featuredItems = [
    {
        id: 'PROD-001',
        name: 'Organic Bananas',
        category: 'Fruits',
        image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=100&h=100',
        impressions: '12.4k',
        clicks: '842',
        conversion: '6.8%',
        status: 'Featured'
    },
    {
        id: 'PROD-004',
        name: 'Whole Milk 2L',
        category: 'Dairy',
        image: 'https://images.unsplash.com/photo-1550583726-2248277c63b2?auto=format&fit=crop&q=80&w=100&h=100',
        impressions: '8.2k',
        clicks: '412',
        conversion: '5.0%',
        status: 'Featured'
    },
    {
        id: 'PROD-012',
        name: 'Avocado Pack',
        category: 'Vegetables',
        image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=100&h=100',
        impressions: '15.1k',
        clicks: '1.2k',
        conversion: '8.2%',
        status: 'Featured'
    }
];

import { useEffect } from 'react';

export function FeaturedProducts({ token }: { token: string }) {
    useEffect(() => {
        // Simulated data load using token
        console.log('Loading featured products with token:', token.substring(0, 5) + '...');
    }, [token]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Title level={2} style={{ margin: 0, fontWeight: 900, letterSpacing: '-0.02em' }}>Featured Products</Title>
                    <Text type="secondary" style={{ fontWeight: 500 }}>Boost products to increase visibility and conversion</Text>
                </div>
                <Button type="primary" size="large" icon={<Star size={18} fill="currentColor" />} style={{ backgroundColor: '#18181b', borderRadius: 20, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} className="shadow-xl shadow-zinc-200">
                    Feature New Item
                </Button>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Impressions', value: '35.7k', icon: BarChart3, color: 'blue' },
                    { label: 'Total Clicks', value: '2.4k', icon: Zap, color: 'amber' },
                    { label: 'Avg. Conversion', value: '6.7%', icon: Star, color: 'emerald' },
                    { label: 'Boost Fee', value: '$420.00', icon: Package, color: 'indigo' },
                ].map((stat, i) => (
                    <Card key={i} bordered={false} hoverable className="shadow-sm rounded-[32px]" bodyStyle={{ padding: 24 }}>
                        <div className={cn("size-10 rounded-xl flex items-center justify-center mb-4", `bg-${stat.color}-50 text-${stat.color}-600`)}>
                            <stat.icon size={20} />
                        </div>
                        <Text type="secondary" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block' }}>{stat.label}</Text>
                        <Title level={3} style={{ margin: 0, marginTop: 4, letterSpacing: '-0.02em', fontWeight: 900 }}>{stat.value}</Title>
                    </Card>
                ))}
            </div>

            {/* Grid of Featured Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredItems.map((item) => (
                    <Card key={item.id} bordered={false} hoverable className="shadow-sm rounded-[40px] group transition-all hover:shadow-xl hover:shadow-gray-100" bodyStyle={{ padding: 32 }}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="relative">
                                <img src={item.image} alt={item.name} className="size-20 rounded-3xl object-cover shadow-lg group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute -top-2 -right-2 size-8 bg-zinc-900 text-amber-400 rounded-full flex items-center justify-center border-4 border-white">
                                    <Star size={14} fill="currentColor" />
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest inline-block">
                                    {item.status}
                                </div>
                                <Text type="secondary" style={{ fontSize: '10px', fontWeight: 700, marginTop: 8, display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.category}</Text>
                            </div>
                        </div>

                        <Title level={4} style={{ margin: 0, marginBottom: 24, letterSpacing: '-0.02em', fontWeight: 900 }}>{item.name}</Title>

                        <div className="grid grid-cols-3 gap-2 py-6 border-y border-gray-50">
                            <div>
                                <Text type="secondary" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>Impressions</Text>
                                <Text strong style={{ fontSize: '14px' }}>{item.impressions}</Text>
                            </div>
                            <div>
                                <Text type="secondary" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>Clicks</Text>
                                <Text strong style={{ fontSize: '14px' }}>{item.clicks}</Text>
                            </div>
                            <div className="text-right">
                                <Text type="secondary" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>CVR</Text>
                                <span className="text-sm font-black text-emerald-600 flex items-center justify-end gap-1">
                                    <ArrowUpRight size={12} />
                                    {item.conversion}
                                </span>
                            </div>
                        </div>

                        <Button block type="text" style={{ marginTop: 32, backgroundColor: '#f9fafb', color: '#6b7280', borderRadius: 16, height: 48, fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }} className="hover:!bg-zinc-900 hover:!text-white transition-all">
                            View Performance Data
                        </Button>
                    </Card>
                ))}

                {/* Boost Card Invitation */}
                <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-[40px] p-8 text-white relative overflow-hidden group shadow-xl shadow-zinc-200/50">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16" />
                    <div className="relative z-10 flex flex-col h-full px-2">
                        <div className="size-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 mb-6 group-hover:rotate-12 transition-transform">
                            <Star size={24} className="text-amber-400" fill="currentColor" />
                        </div>
                        <h4 className="text-2xl font-black tracking-tight leading-tight mb-4">Want more <br /> exposure?</h4>
                        <p className="text-sm text-zinc-400 font-medium mb-8 flex-1">Boosted items appear at the very top of search results and category pages.</p>
                        <Button block size="large" style={{ backgroundColor: '#fff', color: '#18181b', borderRadius: 16, height: 48, fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', border: 'none' }} className="hover:!bg-amber-400 hover:!text-zinc-900 transition-colors shadow-2xl">
                            Boost Visibility Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
