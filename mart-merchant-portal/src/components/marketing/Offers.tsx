import {
    Tag, Plus, Calendar,
    CheckCircle2, ArrowRight,
    Filter, Search, ShoppingBag
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Card, Typography, Button, Input, Space } from 'antd';

const { Title, Text } = Typography;

const offers = [
    {
        id: 'OFF-1024',
        name: 'Weekend Sizzler: 20% Off All Produce',
        type: 'Percentage Discount',
        value: '20% Off',
        status: 'Active',
        range: 'Feb 20 - Feb 22',
        redemptions: 142,
        stores: '2 Stores'
    },
    {
        id: 'OFF-1025',
        name: 'New User Welcome: $10 Credit',
        type: 'Fixed Amount',
        value: '$10.00 Off',
        status: 'Active',
        range: 'Permanent',
        redemptions: 89,
        stores: 'All Stores'
    },
    {
        id: 'OFF-1026',
        name: 'Holiday BOGO: Beverages',
        type: 'Buy One Get One',
        value: 'BOGO',
        status: 'Scheduled',
        range: 'Mar 17',
        redemptions: 0,
        stores: 'All Stores'
    }
];

export function Offers() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Title level={2} style={{ margin: 0, fontWeight: 900, letterSpacing: '-0.02em' }}>Offers & Discounts</Title>
                    <Text type="secondary" style={{ fontWeight: 500 }}>Create and manage performance-based incentives</Text>
                </div>
                <Button type="primary" size="large" icon={<Plus size={18} />} style={{ backgroundColor: '#2563eb', borderRadius: 20, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} className="shadow-lg shadow-blue-100">
                    Create New Offer
                </Button>
            </div>

            {/* Filters */}
            <Card bordered={false} className="shadow-sm border border-gray-100 rounded-2xl" bodyStyle={{ padding: 16 }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <Input
                        prefix={<Search size={18} className="text-gray-400" />}
                        placeholder="Search offers..."
                        size="large"
                        style={{ maxWidth: 400, borderRadius: 12, backgroundColor: '#f9fafb', border: 'none' }}
                    />
                    <Space>
                        <Button type="text" icon={<Filter size={18} />} style={{ fontWeight: 700, color: '#6b7280', borderRadius: 12 }}>
                            Status: All
                        </Button>
                    </Space>
                </div>
            </Card>

            {/* Offers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {offers.map((offer) => (
                    <Card key={offer.id} bordered={false} hoverable className="shadow-sm rounded-[32px] group transition-all" bodyStyle={{ padding: 32 }}>
                        <div className="flex items-start justify-between mb-6">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                <Tag size={24} />
                            </div>
                            <div className={cn(
                                "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                offer.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                            )}>
                                {offer.status}
                            </div>
                        </div>

                        <Title level={4} style={{ margin: 0, marginBottom: 8, letterSpacing: '-0.02em', fontWeight: 900, lineHeight: 1.2 }} className="group-hover:text-blue-600 transition-colors">
                            {offer.name}
                        </Title>

                        <div className="flex items-center gap-4 mb-8">
                            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400"><Calendar size={14} /> {offer.range}</span>
                            <span className="size-1 rounded-full bg-gray-200" />
                            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400"><ShoppingBag size={14} /> {offer.stores}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                            <div>
                                <Text type="secondary" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>Type</Text>
                                <Text strong style={{ fontSize: '14px', marginTop: 4, display: 'block' }}>{offer.type}</Text>
                            </div>
                            <div className="text-right">
                                <Text type="secondary" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>Redemptions</Text>
                                <Text strong style={{ fontSize: '14px', marginTop: 4, display: 'block' }}>{offer.redemptions}</Text>
                            </div>
                        </div>

                        <Button block type="text" style={{ marginTop: 32, backgroundColor: '#f9fafb', color: '#6b7280', borderRadius: 16, height: 48, fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }} className="hover:!bg-zinc-900 hover:!text-white transition-all flex items-center justify-center gap-2">
                            Manage Details <ArrowRight size={14} />
                        </Button>
                    </Card>
                ))}

                {/* Empty State / Create More */}
                <button className="bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center gap-4 group hover:bg-white hover:border-blue-200 transition-all min-h-[300px]">
                    <div className="p-4 bg-white rounded-2xl text-gray-300 group-hover:text-blue-500 transition-colors shadow-sm">
                        <Plus size={32} />
                    </div>
                    <div className="text-center">
                        <Title level={4} style={{ margin: 0, fontWeight: 900, letterSpacing: '-0.02em', color: '#1f2937' }}>Create New Campaign</Title>
                        <Text type="secondary" style={{ fontWeight: 500, fontSize: '12px', marginTop: 4, display: 'block' }}>Drive more orders during off-peak</Text>
                    </div>
                </button>
            </div>

            {/* Marketing Tip */}
            <div className="bg-emerald-600 rounded-[40px] p-8 text-white shadow-xl shadow-emerald-100 flex flex-col md:flex-row items-center gap-8">
                <div className="size-24 bg-white/10 rounded-[32px] backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={40} className="text-white opacity-40" />
                </div>
                <div className="flex-1 space-y-2 text-center md:text-left">
                    <h4 className="text-2xl font-black tracking-tight italic">Boost Sales by 40%</h4>
                    <p className="text-sm opacity-80 leading-relaxed font-medium">Stores with active "New User Welcome" offers see an average 40% increase in weekly volume during the first 30 days.</p>
                </div>
                <button className="px-8 py-4 bg-white text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                    View Guide
                </button>
            </div>
        </div>
    );
}
