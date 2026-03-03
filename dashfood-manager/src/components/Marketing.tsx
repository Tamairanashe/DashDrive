import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from './ui';
import { cn } from '../lib/utils';
import {
    Plus,
    Search,
    MoreVertical,
    TrendingUp,
    Target,
    Zap,
    Check,
    ChevronRight,
    Megaphone,
    Sparkles,
    ArrowRight,
    Clock,
    Filter,
    Eye,
    MousePointer2,
    Users,
    LayoutGrid,
    Calendar,
    BarChart3,
    Lightbulb,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Terminal,
    MousePointerClick,
    Percent,
    Layers,
    ShoppingBag,
    History,
    TrendingDown,
    Gift,
    Trash2,
    CheckCircle2,
    AlertCircle,
    MoreHorizontal,
    X,
    ChevronDown,
    Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

// --- TYPES ---
interface Offer {
    id: string;
    name: string;
    type: 'percentage' | 'fixed_amount' | 'bogo' | 'Ad' | 'Offer';
    value?: number;
    status: 'Live' | 'Scheduled' | 'Paused' | 'Draft' | 'Ended';
    performance: string;
    spend: string;
    roas: string;
    nextRun?: string;
    start_date?: string;
    end_date?: string;
    usage_count?: number;
    impact?: number | string;
    budget?: string;
    impressions?: string;
    clicks?: string;
    orders?: string;
    schedule?: string;
}

// --- MOCK DATA ---
const ALL_CAMPAIGNS: Offer[] = [
    { id: 'c1', name: 'Lunch Boost', type: 'Ad', status: 'Live', performance: '23 orders', spend: '$185', roas: '3.2x', nextRun: 'Today 11AM' },
    { id: 'c2', name: '20% Off Pizza', type: 'Offer', status: 'Live', performance: '23 redeemed', spend: '$32', roas: 'N/A', nextRun: 'Ongoing' },
    { id: 'c3', name: 'Valentine\'s Day', type: 'Ad', status: 'Scheduled', performance: 'Starts Feb 14', spend: '$0', roas: 'N/A', nextRun: 'Feb 14' },
    { id: 'c4', name: 'Weekend Special', type: 'Offer', status: 'Paused', performance: '45 redeemed', spend: '$75', roas: 'N/A', nextRun: 'None' },
];

const ADS = [
    { id: 'a1', name: 'Lunch Boost 2.0', status: 'Live', budget: '$20/day', spent: '$140', impressions: '2,450', clicks: '89', orders: '23', roas: '3.2x', schedule: 'Weekdays 11AM-2PM' },
    { id: 'a2', name: 'Valentine\'s Day Promo', status: 'Scheduled', budget: '$30/day', spent: '$0', impressions: '0', clicks: '0', orders: '0', roas: 'N/A', schedule: 'Feb 14, 5PM-10PM' },
    { id: 'a3', name: 'Weekend Brunch', status: 'Draft', budget: '$15/day', spent: '$0', impressions: '0', clicks: '0', orders: '0', roas: 'N/A', schedule: 'Weekends 9AM-2PM' },
];

const OFFERS = [
    { id: 'o1', name: '20% Off Pizza', status: 'Live', type: 'percentage', budget: '$50/week', spent: '$32', redemptions: '23', avgOrder: '$28.50', minOrder: '$15', ends: 'Jan 31, 2024', impact: 12.4 },
    { id: 'o2', name: 'Valentine\'s BOGO', status: 'Scheduled', type: 'bogo', budget: '$100 total', spent: '$0', redemptions: '0', avgOrder: 'N/A', minOrder: '$25', ends: 'Feb 14, 2024', impact: 0 },
];

const RECOMMENDATIONS = [
    { id: 'r1', priority: 'High', title: 'Increase Ad Budget', impact: '8-12 additional orders/week', desc: 'Your "Lunch Boost" campaign has a 3.2x ROAS. Increasing budget by 20% is highly recommended.', type: 'budget' },
    { id: 'r2', priority: 'High', title: 'Run BOGO on Pizza', impact: '+15-20% volume', desc: 'Pepperoni Pizza has high organic demand. A BOGO offer could significantly scale this.', type: 'offer' },
    { id: 'r3', priority: 'Medium', title: 'Schedule Slow Hours', impact: 'Fill 2-4 PM gap', desc: 'Traffic dips mid-afternoon. Targeted ads can capture late-lunch seekers.', type: 'schedule' },
    { id: 'r4', priority: 'Medium', title: 'New Customer Discount', impact: 'Expand customer base', desc: 'You have a 15% lower acquisition rate than similar nearby stores. A 25% first-order discount could help.', type: 'growth' },
];

const ANALYTICS_TRENDS = [
    { date: 'Mon', spend: 40, orders: 12 },
    { date: 'Tue', spend: 30, orders: 15 },
    { date: 'Wed', spend: 65, orders: 25 },
    { date: 'Thu', spend: 45, orders: 18 },
    { date: 'Fri', spend: 90, orders: 35 },
    { date: 'Sat', spend: 120, orders: 48 },
    { date: 'Sun', spend: 85, orders: 32 },
];

export default function Marketing() {
    const [isLoading, setIsLoading] = useState(true);
    const [syncProgress, setSyncProgress] = useState(0);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'campaigns' | 'ads' | 'offers' | 'recommendations' | 'analytics'>('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // Simulate loading sequence
    useEffect(() => {
        const timer = setInterval(() => {
            setSyncProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setIsLoading(false), 500);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
        return () => clearInterval(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-transparent">
                <Card className="w-full max-w-2xl p-8 bg-white border-2 border-zinc-100 shadow-2xl rounded-[32px]">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white">
                            <Terminal size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Syncing Marketing protocols</h2>
                            <p className="text-sm text-zinc-500 font-medium">Main Street Kitchen</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                                <span>Loading progress</span>
                                <span>{syncProgress}%</span>
                            </div>
                            <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-zinc-900"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${syncProgress}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[
                                { label: 'Active ad campaigns loaded', complete: syncProgress > 30 },
                                { label: 'Active offers loaded', complete: syncProgress > 60 },
                                { label: 'Performance telemetry (Live)', complete: syncProgress > 85 },
                                { label: 'AI Recommendations (100%)', complete: syncProgress >= 100 },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm font-medium">
                                    {item.complete ? (
                                        <div className="text-emerald-500"><Check size={16} /></div>
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-zinc-200 border-t-zinc-900 animate-spin" />
                                    )}
                                    <span className={cn(item.complete ? "text-zinc-900" : "text-zinc-400")}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    const renderDashboard = () => (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* HUD Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 bg-zinc-900 text-white border-none rounded-[32px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <Target size={80} />
                    </div>
                    <p className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.2em] mb-1">Marketing Status</p>
                    <div className="text-3xl font-semibold">3 ACTIVE</div>
                    <p className="text-[10px] text-emerald-400 font-medium mt-4 flex items-center gap-1.5">
                        <TrendingUp size={12} /> +12% ROAS increase
                    </p>
                </Card>

                <Card className="p-6 bg-white border-zinc-100 rounded-[32px] relative group border-2">
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.2em] mb-1">Weekly Spend</p>
                    <div className="text-3xl font-semibold text-zinc-900">$185.00</div>
                    <p className="text-[10px] text-rose-500 font-medium mt-4 flex items-center gap-1.5">
                        <ArrowDownRight size={12} /> -8% vs last cycle
                    </p>
                </Card>

                <Card className="p-6 bg-white border-zinc-100 rounded-[32px] border-2">
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.2em] mb-1">Active Offers</p>
                    <div className="text-3xl font-semibold text-zinc-900">1 LIVE</div>
                    <p className="text-[10px] text-zinc-500 font-medium mt-4 flex items-center gap-1.5">
                        <Users size={12} /> 23 total redemptions
                    </p>
                </Card>
            </div>

            {/* AI Recommendations Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
                        <Sparkles className="text-zinc-900" size={20} /> RECOMMENDED FOR YOU
                    </h2>
                    <Button variant="ghost" className="text-zinc-400 font-semibold text-[10px] uppercase tracking-widest hover:text-zinc-900">
                        View All
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {RECOMMENDATIONS.slice(0, 3).map((rec) => (
                        <Card key={rec.id} className="p-6 bg-zinc-50 border-none rounded-[32px] hover:bg-zinc-100 transition-all group">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <Badge variant={rec.priority === 'High' ? 'error' : 'warning'}>{rec.priority} Priority</Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white">
                                        <ArrowRight size={14} />
                                    </Button>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-zinc-900 leading-tight">{rec.title}</h3>
                                    <p className="text-xs text-zinc-500 mt-1 font-medium">{rec.desc}</p>
                                </div>
                                <div className="pt-4 border-t border-zinc-200/50 flex items-center justify-between">
                                    <div className="text-emerald-600 font-semibold text-[10px] uppercase tracking-wider">{rec.impact}</div>
                                    <Button className="h-8 px-4 bg-zinc-900 text-white rounded-xl text-[10px] font-semibold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                                        Apply
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Active Campaigns Preview */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">ACTIVE CAMPAIGNS</h2>
                    <Button variant="secondary" onClick={() => setIsCreating(true)} className="rounded-2xl h-10 px-6 font-semibold text-[10px] uppercase tracking-widest border-2">
                        Create Campaign
                    </Button>
                </div>

                <div className="space-y-4">
                    {ALL_CAMPAIGNS.filter(c => c.status === 'Live').map((campaign) => (
                        <Card key={campaign.id} className="p-6 bg-white border-2 border-zinc-100 rounded-[32px] hover:shadow-2xl hover:shadow-zinc-900/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                            <div className="flex items-center gap-6">
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105",
                                    campaign.type === 'Ad' ? "bg-zinc-900 text-white shadow-xl shadow-zinc-900/20" : "bg-emerald-50 text-emerald-600"
                                )}>
                                    {campaign.type === 'Ad' ? <Target size={24} /> : <Megaphone size={24} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-semibold text-zinc-900">{campaign.name}</h3>
                                        <Badge variant="success">Active</Badge>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 text-xs text-zinc-400 font-medium">
                                        <span className="flex items-center gap-1.5"><Clock size={14} /> {campaign.nextRun}</span>
                                        <span className="flex items-center gap-1.5"><TrendingUp size={14} /> High Impact</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-12 pr-4">
                                <div className="text-right">
                                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Performance</p>
                                    <p className="text-xl font-semibold text-zinc-900 leading-none mt-1">{campaign.performance.split(' ')[0]} <span className="text-xs font-medium text-zinc-400">{campaign.performance.split(' ')[1]}</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Spend</p>
                                    <p className="text-xl font-semibold text-zinc-900 leading-none mt-1">{campaign.spend}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full border-2 hover:bg-zinc-900 hover:text-white transition-all">
                                        <BarChart3 size={18} />
                                    </Button>
                                    <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full border-2 hover:bg-zinc-900 hover:text-white transition-all">
                                        <MoreVertical size={18} />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderAdsTab = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Ad Specific HUD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 bg-zinc-900 text-white border-none rounded-[32px]">
                    <p className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.2em] mb-1">Active Ad Spend</p>
                    <div className="text-3xl font-semibold">$140.00</div>
                    <p className="text-[10px] text-emerald-400 font-medium mt-4">7,240 Total Impressions</p>
                </Card>
                <Card className="p-6 bg-white border-2 border-zinc-100 rounded-[32px]">
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.2em] mb-1">Average CTR</p>
                    <div className="text-3xl font-semibold text-zinc-900">4.2%</div>
                    <p className="text-[10px] text-zinc-500 font-medium mt-4">Above industry average</p>
                </Card>
                <Card className="p-6 bg-white border-2 border-zinc-100 rounded-[32px]">
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.2em] mb-1">Ad Orders</p>
                    <div className="text-3xl font-semibold text-zinc-900">23</div>
                    <p className="text-[10px] text-zinc-500 font-medium mt-4">Generated past 7 days</p>
                </Card>
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">MANAGED ADS</h2>
                <Button onClick={() => setIsCreating(true)} className="bg-zinc-900 text-white rounded-2xl h-11 px-6 font-semibold text-[10px] uppercase tracking-widest shadow-xl shadow-zinc-900/10 hover:scale-105 transition-all">
                    <Plus size={16} className="mr-2" /> Create Ad
                </Button>
            </div>

            <div className="space-y-4">
                {ADS.map((ad) => (
                    <Card key={ad.id} className="p-8 bg-white border-2 border-zinc-100 rounded-[40px] hover:shadow-2xl hover:shadow-zinc-900/5 transition-all group">
                        <div className="flex flex-col md:flex-row md:items-center gap-10">
                            <div className={cn(
                                "w-16 h-16 rounded-[24px] flex items-center justify-center transition-transform group-hover:scale-105 shrink-0",
                                ad.status === 'Live' ? "bg-zinc-900 text-white shadow-xl shadow-zinc-900/20" :
                                    ad.status === 'Scheduled' ? "bg-amber-50 text-amber-600" : "bg-zinc-100 text-zinc-400"
                            )}>
                                <Target size={32} />
                            </div>

                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-xl font-semibold text-zinc-900 tracking-tight">{ad.name}</h3>
                                    <Badge variant={ad.status === 'Live' ? 'success' : ad.status === 'Scheduled' ? 'warning' : 'neutral'}>
                                        {ad.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-6 mt-1 text-xs text-zinc-400 font-medium">
                                    <span className="flex items-center gap-2"><Clock size={16} /> {ad.schedule}</span>
                                    <span className="flex items-center gap-2"><Target size={16} /> 3 mile radius</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pr-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Reach</p>
                                    <p className="text-lg font-semibold text-zinc-900">{ad.impressions}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Clicks</p>
                                    <p className="text-lg font-semibold text-zinc-900">{ad.clicks}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">ROAS</p>
                                    <p className="text-lg font-semibold text-emerald-600">{ad.roas}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Spent</p>
                                    <p className="text-lg font-semibold text-zinc-900">{ad.spent}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 border-l-2 border-zinc-100 pl-8">
                                <Button variant="secondary" className="h-12 w-12 rounded-2xl border-2 hover:bg-zinc-900 hover:text-white transition-all">
                                    <BarChart3 size={20} />
                                </Button>
                                <Button variant="secondary" className="h-12 w-12 rounded-2xl border-2 hover:bg-zinc-900 hover:text-white transition-all">
                                    <MoreVertical size={20} />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderOffersTab = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Offers HUD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 bg-white border-2 border-zinc-100 rounded-[32px]">
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.2em] mb-1">Active Offers</p>
                    <div className="text-3xl font-semibold text-zinc-900">1 LIVE</div>
                    <p className="text-[10px] text-zinc-500 font-medium mt-4 flex items-center gap-1.5">
                        <Tag size={12} /> Currently broadcasting
                    </p>
                </Card>
                <Card className="p-6 bg-zinc-900 text-white border-none rounded-[32px]">
                    <p className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.2em] mb-1">Total Redeemed</p>
                    <div className="text-3xl font-semibold">1,052</div>
                    <p className="text-[10px] text-emerald-400 font-medium mt-4 flex items-center gap-1.5">
                        <Check size={12} /> Historical protocol lift
                    </p>
                </Card>
                <Card className="p-6 bg-white border-2 border-zinc-100 rounded-[32px]">
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.2em] mb-1">Avg. ROA</p>
                    <div className="text-3xl font-semibold text-emerald-600">+15.4%</div>
                    <p className="text-[10px] text-zinc-500 font-medium mt-4">Revenue per redemption</p>
                </Card>
            </div>

            <div className="flex items-center gap-4">
                <Button onClick={() => setIsCreating(true)} className="bg-zinc-900 text-white rounded-2xl h-11 px-8 font-semibold text-[10px] uppercase tracking-widest shadow-xl shadow-zinc-900/10 hover:scale-105 transition-all">
                    <Plus size={16} className="mr-2" /> Create Offer
                </Button>
                <Button variant="secondary" className="rounded-2xl h-11 px-8 font-semibold text-[10px] uppercase tracking-widest border-2">
                    Use Template
                </Button>
            </div>

            <div className="space-y-4">
                {OFFERS.map((offer: any) => (
                    <Card key={offer.id} className="p-8 bg-white border-2 border-zinc-100 rounded-[40px] transition-all group overflow-hidden relative">
                        {offer.status === 'Live' && (
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                        )}
                        <div className="flex flex-col md:flex-row md:items-center gap-10">
                            <div className={cn(
                                "w-20 h-20 rounded-[28px] flex items-center justify-center transition-transform group-hover:scale-105 shrink-0",
                                offer.status === 'Live' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                            )}>
                                <Megaphone size={36} />
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-2xl font-semibold text-zinc-900 tracking-tight">{offer.name}</h3>
                                    <Badge variant={offer.status === 'Live' ? 'success' : 'warning'}>{offer.status}</Badge>
                                </div>
                                <p className="text-sm text-zinc-500 font-medium">Type: {offer.type} • Min Order {offer.minOrder}</p>
                                <div className="flex items-center gap-4 mt-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5"><Calendar size={14} /> Ends {offer.ends}</span>
                                    <span className="flex items-center gap-1.5"><History size={14} /> Active for 14 days</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 pr-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Redeemed</p>
                                    <p className="text-2xl font-semibold text-zinc-900">{offer.redemptions}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Avg Order</p>
                                    <p className="text-2xl font-semibold text-zinc-900">{offer.avgOrder}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Spent</p>
                                    <p className="text-2xl font-semibold text-zinc-900">{offer.spent}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button className="h-12 px-6 bg-zinc-900 text-white rounded-2xl font-semibold text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                                    Edit Offer
                                </Button>
                                <Button variant="secondary" size="icon" className="h-12 w-12 rounded-2xl border-2">
                                    <MoreVertical size={20} />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderCampaignsTab = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-2xl border-2 border-zinc-100">
                    {['All', 'Active', 'Scheduled', 'Paused', 'Ended'].map(filter => (
                        <button key={filter} className="px-5 py-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 rounded-xl transition-all active:scale-95">
                            {filter}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Filter campaigns..."
                            className="pl-11 pr-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 focus:bg-white focus:ring-4 focus:ring-zinc-900/5 rounded-2xl text-xs font-semibold uppercase tracking-widest transition-all outline-none w-64 border-2 border-transparent focus:border-zinc-200"
                        />
                    </div>
                    <Button onClick={() => setIsCreating(true)} className="bg-zinc-900 text-white rounded-2xl h-11 px-6 font-semibold text-[10px] uppercase tracking-widest shadow-xl shadow-zinc-900/10 hover:scale-105 transition-all">
                        <Plus size={16} className="mr-2" /> New Campaign
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border-2 border-zinc-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b-2 border-zinc-100 bg-zinc-50/50">
                            <th className="px-8 py-5 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Campaign Name</th>
                            <th className="px-8 py-5 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Type</th>
                            <th className="px-8 py-5 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-5 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest text-right">Performance</th>
                            <th className="px-8 py-5 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest text-right">Spend</th>
                            <th className="px-8 py-5"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-zinc-100">
                        {ALL_CAMPAIGNS.map((campaign) => (
                            <tr key={campaign.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="font-semibold text-zinc-900">{campaign.name}</div>
                                    <div className="text-[10px] text-zinc-400 font-medium uppercase tracking-tighter mt-0.5">Updated 1h ago</div>
                                </td>
                                <td className="px-8 py-6">
                                    <Badge variant="neutral">{campaign.type}</Badge>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-2 h-2 rounded-full",
                                            campaign.status === 'Live' ? "bg-emerald-500" :
                                                campaign.status === 'Scheduled' ? "bg-amber-500" : "bg-zinc-300"
                                        )} />
                                        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-900">{campaign.status}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right font-semibold text-zinc-900">{campaign.performance}</td>
                                <td className="px-8 py-6 text-right font-semibold text-zinc-900">{campaign.spend}</td>
                                <td className="px-8 py-6 text-right">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full group-hover:bg-white group-hover:shadow-md transition-all">
                                        <MoreVertical size={16} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderRecommendationsTab = () => (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-zinc-900 tracking-tight">AI PROTOCOLS</h2>
                <Badge variant="info">4 New Suggestions</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {RECOMMENDATIONS.map((rec) => (
                    <Card key={rec.id} className="p-10 bg-white border-2 border-zinc-100 rounded-[48px] relative group hover:shadow-2xl hover:shadow-zinc-900/5 transition-all">
                        <div className="absolute top-10 right-10">
                            <Badge variant={rec.priority === 'High' ? 'error' : 'warning'}>{rec.priority} Priority</Badge>
                        </div>

                        <div className="space-y-8">
                            <div className={cn(
                                "w-20 h-20 rounded-[32px] flex items-center justify-center",
                                rec.type === 'budget' ? "bg-amber-50 text-amber-600" :
                                    rec.type === 'offer' ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-900"
                            )}>
                                {rec.type === 'budget' ? <TrendingUp size={40} /> :
                                    rec.type === 'offer' ? <Tag size={40} /> : <Zap size={40} />}
                            </div>

                            <div>
                                <h3 className="text-3xl font-semibold text-zinc-900 leading-none mb-4">{rec.title}</h3>
                                <p className="text-zinc-500 font-medium leading-relaxed max-w-md">{rec.desc}</p>
                            </div>

                            <div className="p-6 bg-zinc-50 rounded-[32px] border-2 border-zinc-100/50 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Estimated Impact</p>
                                    <p className="text-lg font-semibold text-zinc-900">{rec.impact}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button variant="ghost" className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-900">Dismiss</Button>
                                    <Button className="bg-zinc-900 text-white rounded-2xl h-12 px-8 font-semibold text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Apply Now</Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderAnalyticsTab = () => (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h2 className="text-3xl font-semibold text-zinc-900 tracking-tight">PERFORMANCE ANALYTICS</h2>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" className="rounded-2xl h-11 border-2 font-semibold text-[10px] uppercase tracking-widest">
                        <Download size={16} className="mr-2" /> Export PDF
                    </Button>
                    <div className="bg-zinc-100 p-1 rounded-2xl border-2 border-zinc-100 flex items-center">
                        <button className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-900 bg-white rounded-xl shadow-sm">7 Days</button>
                        <button className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-900">30 Days</button>
                        <button className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-900">Year</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Spent', value: '$842.00', trend: '+12%', up: true },
                    { label: 'Attributed Orders', value: '148', trend: '+8.4%', up: true },
                    { label: 'Avg. ROAS', value: '4.2x', trend: '-2.1%', up: false },
                    { label: 'New Customers', value: '42', trend: '+18%', up: true },
                ].map((stat, i) => (
                    <Card key={i} className="p-6 bg-white border-2 border-zinc-100 rounded-[32px]">
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <div className="text-2xl font-semibold text-zinc-900">{stat.value}</div>
                        <div className={cn("text-[10px] font-semibold mt-2 flex items-center gap-1", stat.up ? "text-emerald-500" : "text-rose-500")}>
                            {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {stat.trend} vs last period
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="p-8 bg-white border-2 border-zinc-100 rounded-[48px] space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-semibold text-zinc-900 tracking-tight">Demand Velocity</h3>
                        <p className="text-xs text-zinc-400 font-medium">Daily correlation between spend and orders.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-zinc-900" />
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Orders</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Spend</span>
                        </div>
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%" minHeight={0}>
                        <AreaChart data={ANALYTICS_TRENDS} margin={{ top: 20, right: 20, left: -20, bottom: 20 }}>
                            <defs>
                                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 'bold' }}
                                dy={20}
                            />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                                    padding: '16px'
                                }}
                            />
                            <Area type="monotone" dataKey="spend" stroke="#34d399" strokeWidth={4} fillOpacity={1} fill="url(#colorSpend)" />
                            <Area type="monotone" dataKey="orders" stroke="#18181b" strokeWidth={4} fillOpacity={0} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );

    return (
        <div className="flex-1 bg-transparent overflow-y-auto pb-20 scroll-smooth">
            <div className="max-w-7xl mx-auto py-12 px-6">
                {/* Header Section */}
                <div className="space-y-2 mb-10">
                    <div className="flex items-center gap-3">
                        <h1 className="text-5xl font-semibold text-zinc-900 tracking-tighter">Marketing</h1>
                        <Badge variant="info">Protocol v4.5</Badge>
                    </div>
                    <p className="text-zinc-400 text-sm font-medium tracking-tight">Unified command center for demand generation.</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-1.5 bg-zinc-100 p-1.5 rounded-[24px] w-fit mb-12 border-2 border-zinc-200/50">
                    {(['dashboard', 'campaigns', 'ads', 'offers', 'recommendations', 'analytics'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-8 py-3 rounded-[20px] text-[10px] font-semibold uppercase tracking-[0.15em] transition-all relative",
                                activeTab === tab
                                    ? "bg-white text-zinc-900 shadow-xl shadow-zinc-900/5 ring-2 ring-zinc-200/50"
                                    : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/50"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {activeTab === 'dashboard' ? renderDashboard() :
                            activeTab === 'campaigns' ? renderCampaignsTab() :
                                activeTab === 'ads' ? renderAdsTab() :
                                    activeTab === 'offers' ? renderOffersTab() :
                                        activeTab === 'recommendations' ? renderRecommendationsTab() :
                                            activeTab === 'analytics' ? renderAnalyticsTab() : (
                                                <div className="h-96 flex flex-col items-center justify-center bg-white rounded-[40px] border-4 border-dashed border-zinc-100 text-zinc-300 space-y-6">
                                                    <div className="p-8 bg-zinc-50 rounded-[32px]">
                                                        <LayoutGrid size={64} strokeWidth={1} />
                                                    </div>
                                                    <div className="text-center space-y-2">
                                                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">Section {activeTab} Incoming</p>
                                                        <p className="text-xs text-zinc-300 font-medium tracking-tight max-w-xs mx-auto">Connecting to Marketing Protocol backend to fetch regional data packets.</p>
                                                    </div>
                                                </div>
                                            )}
                    </motion.div>
                </AnimatePresence>

                {/* Global Action Footer */}
                <div className="mt-16 flex items-center justify-center gap-4">
                    <Button onClick={() => setIsCreating(true)} className="h-14 px-10 bg-zinc-900 text-white rounded-3xl font-semibold text-xs uppercase tracking-[0.2em] shadow-2xl shadow-zinc-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                        <Plus size={20} /> Create New Campaign
                    </Button>
                    <Button variant="secondary" className="h-14 px-10 bg-white border-2 border-zinc-100 text-zinc-900 rounded-3xl font-semibold text-xs uppercase tracking-[0.2em] hover:bg-zinc-50 transition-all flex items-center gap-3">
                        <BarChart3 size={20} /> Marketing Report
                    </Button>
                </div>
            </div>

            {/* Premium Modal Builder */}
            <AnimatePresence>
                {isCreating && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-white/20"
                        >
                            <div className="p-10 border-b border-zinc-50 flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black tracking-tighter">Initiate Campaign</h2>
                                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Deploying New Protocol v4.2</p>
                                </div>
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-black hover:text-white transition-all shadow-sm"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-10 space-y-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-2">Codename / Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Operation Summer Growth"
                                        className="w-full px-8 py-5 bg-zinc-50 border border-zinc-100 rounded-[24px] text-sm font-bold focus:ring-4 focus:ring-[#00ff90]/10 outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-2">Algorithm Type</label>
                                        <div className="relative">
                                            <select className="w-full px-8 py-5 bg-zinc-50 border border-zinc-100 rounded-[24px] text-sm font-bold appearance-none outline-none focus:ring-4 focus:ring-[#00ff90]/10 transition-all">
                                                <option>Percentage Variable (%)</option>
                                                <option>Fixed Value Protocol ($)</option>
                                                <option>Item Replication (BOGO)</option>
                                            </select>
                                            <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-2">Magnitude</label>
                                        <input
                                            type="number"
                                            placeholder="20"
                                            className="w-full px-8 py-5 bg-zinc-50 border border-zinc-100 rounded-[24px] text-sm font-bold focus:ring-4 focus:ring-[#00ff90]/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="bg-zinc-900 p-8 rounded-[32px] flex gap-6 items-start border border-white/10 shadow-xl overflow-hidden relative">
                                    <div className="absolute -top-4 -right-4 text-white opacity-5">
                                        <Shield size={120} />
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-[#00ff90]/20 flex items-center justify-center text-[#00ff90] shrink-0">
                                        <AlertCircle size={24} />
                                    </div>
                                    <div className="space-y-2 relative z-10">
                                        <h4 className="text-white font-black text-sm uppercase tracking-wider">Network Safety Notice</h4>
                                        <p className="text-[12px] text-zinc-400 font-medium leading-relaxed">
                                            This campaign will broadcast to all network nodes. Ensure your infrastructure can handle the projected <span className="text-[#00ff90] font-bold">14-18% traffic spike</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 bg-zinc-50/50 flex items-center gap-6 border-t border-zinc-50">
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="flex-1 py-5 bg-white border border-zinc-200 text-black rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-all shadow-sm"
                                >
                                    Abort
                                </button>
                                <button className="flex-1 py-5 bg-black text-[#00ff90] rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20">
                                    Confirm Deployment
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

const Tag = ({ size, className }: { size?: number, className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size || 24}
        height={size || 24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
        <path d="M7 7h.01" />
    </svg>
);
