import React, { useState, useEffect } from 'react';
import {
    Megaphone,
    Plus,
    Trash2,
    Clock,
    Tag,
    Percent,
    Gift,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    Target,
    Zap,
    Users,
    ArrowUpRight,
    MoreHorizontal,
    Sparkles,
    BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../types';

interface Offer {
    id: string;
    name: string;
    type: 'percentage' | 'fixed_amount' | 'bogo';
    value: number;
    is_active: boolean;
    start_date: string;
    end_date: string;
    usage_count: number;
    impact: number;
}

export default function Marketing() {
    const [offers, setOffers] = useState<Offer[]>([
        {
            id: '1',
            name: 'First-Node Welcome Reward',
            type: 'percentage',
            value: 20,
            is_active: true,
            start_date: '2024-01-01',
            end_date: '2024-12-31',
            usage_count: 145,
            impact: 12.4
        },
        {
            id: '2',
            name: 'Weekend Sizzler Campaign',
            type: 'fixed_amount',
            value: 5,
            is_active: true,
            start_date: '2024-02-01',
            end_date: '2024-03-01',
            usage_count: 42,
            impact: 8.2
        },
        {
            id: '3',
            name: 'BOGO Pizza Protocol',
            type: 'bogo',
            value: 1,
            is_active: false,
            start_date: '2024-03-01',
            end_date: '2024-04-01',
            usage_count: 0,
            impact: 0
        }
    ]);

    const [isCreating, setIsCreating] = useState(false);

    return (
        <div className="flex-1 bg-transparent overflow-y-auto animate-in fade-in duration-700">
            <div className="max-w-[1400px] mx-auto py-12 px-8 space-y-12">
                {/* Executive Header */}
                <div className="flex items-end justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-5xl font-black text-black tracking-tighter">Campaign Hub</h1>
                            <div className="px-3 py-1 bg-[#00ff90]/10 text-[#00ff90] rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Sparkles size={12} />
                                Revenue AI Active
                            </div>
                        </div>
                        <p className="text-zinc-500 font-medium text-lg">Deploy high-impact operational incentives across your network.</p>
                    </div>

                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-black text-[#00ff90] px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center gap-3"
                    >
                        <Plus size={20} />
                        Launch Campaign
                    </button>
                </div>

                {/* Performance HUD */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Active Signals', value: '3', icon: Megaphone, trend: '+2', color: 'text-black', bg: 'bg-white' },
                        { label: 'Total Redemptions', value: '412', icon: BarChart3, trend: '+18%', color: 'text-black', bg: 'bg-white' },
                        { label: 'Network Conversion', value: '18.4%', icon: Target, trend: '+2.1%', color: 'text-black', bg: 'bg-white' },
                        { label: 'Revenue Lift', value: '+$4.2k', icon: Zap, trend: '+12%', color: 'text-black', bg: 'bg-[#00ff90]' },
                    ].map((stat, i) => (
                        <div key={i} className={cn("p-6 rounded-[32px] shadow-sm border border-zinc-50 flex flex-col justify-between h-[160px]", stat.bg)}>
                            <div className="flex items-center justify-between">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg === 'bg-[#00ff90]' ? 'bg-black text-[#00ff90]' : 'bg-zinc-50 text-black')}>
                                    <stat.icon size={24} />
                                </div>
                                <div className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full", stat.bg === 'bg-[#00ff90]' ? 'bg-black/10 text-black' : 'bg-[#00ff90]/10 text-[#00ff90]')}>
                                    {stat.trend}
                                </div>
                            </div>
                            <div>
                                <p className={cn("text-[10px] font-black uppercase tracking-widest mb-1", stat.bg === 'bg-[#00ff90]' ? 'text-black/60' : 'text-zinc-400')}>{stat.label}</p>
                                <p className="text-3xl font-black">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Active Offers List */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-sm font-black text-black uppercase tracking-[0.2em]">Running Protcols</h2>
                            <div className="flex gap-2">
                                <span className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase rounded-[15px] tracking-widest shadow-lg">Live</span>
                                <span className="px-4 py-2 bg-white text-zinc-400 text-[10px] font-black uppercase rounded-[15px] tracking-widest shadow-sm">Scheduled</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {offers.map((offer, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={offer.id}
                                    className="card-premium p-8 group hover:bg-black transition-all duration-300 relative overflow-hidden border-none"
                                >
                                    <div className="flex items-center justify-between gap-8 relative z-10">
                                        <div className="flex items-center gap-8">
                                            <div className={cn(
                                                "w-20 h-20 rounded-[28px] flex items-center justify-center transition-transform group-hover:scale-110 duration-500",
                                                offer.type === 'percentage' ? "bg-[#00ff90]/10 text-[#00ff90]" :
                                                    offer.type === 'fixed_amount' ? "bg-black text-white group-hover:bg-[#00ff90]/20 group-hover:text-[#00ff90]" : "bg-zinc-100 text-zinc-400"
                                            )}>
                                                {offer.type === 'percentage' ? <Percent size={32} /> :
                                                    offer.type === 'fixed_amount' ? <Tag size={32} /> : <Gift size={32} />}
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-black text-black group-hover:text-white transition-colors">{offer.name}</h3>
                                                    {!offer.is_active && <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest border border-zinc-200 px-2 rounded-full">Inactive</span>}
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 group-hover:text-zinc-500 uppercase tracking-widest">
                                                        <Clock size={14} />
                                                        Till {new Date(offer.end_date).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-[#00ff90] uppercase tracking-widest">
                                                        <TrendingUp size={14} />
                                                        {offer.usage_count} Impacts
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Rev Lift</div>
                                                <div className="text-2xl font-black text-black group-hover:text-[#00ff90] leading-none tracking-tight">+{offer.impact}%</div>
                                            </div>
                                            <button className="w-12 h-12 rounded-2xl bg-zinc-50 group-hover:bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar / Recommendations */}
                    <div className="space-y-8">
                        <section className="card-premium p-8 bg-black text-white border-none space-y-6">
                            <div className="w-14 h-14 bg-[#00ff90] text-black rounded-[20px] flex items-center justify-center">
                                <Sparkles size={28} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black tracking-tight">Campaign Intelligence</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Our AI suggests a <span className="text-[#00ff90]">"30% Off New Items"</span> campaign to target users in the Lynwood cluster based on recent order dips.
                                </p>
                            </div>
                            <button className="w-full py-4 bg-[#00ff90] text-black text-[11px] font-black uppercase tracking-widest rounded-[20px] hover:scale-105 transition-all shadow-xl shadow-[#00ff90]/10">
                                Deploy Suggestion
                            </button>
                        </section>

                        <section className="card-premium p-8 space-y-6 border-none overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <Target size={120} />
                            </div>
                            <h3 className="text-xs font-black text-black uppercase tracking-[0.3em]">Network reach</h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-zinc-400">Target Segment</span>
                                        <span className="text-black">84k Users</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                        <div className="w-[84%] h-full bg-[#00ff90] rounded-full" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-zinc-400">Market share</span>
                                        <span className="text-black">12.4%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                        <div className="w-[12%] h-full bg-black rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
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
                                    <div className="absolute -top-4 -right-4 text-[#00ff90]/5">
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

const X = ({ size, className }: { size: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);

const ChevronDown = ({ size, className }: { size: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6" /></svg>
);

const Shield = ({ size, className }: { size: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" /></svg>
);
