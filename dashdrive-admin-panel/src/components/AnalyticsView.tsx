import React from 'react';
import {
 TrendingUp,
 Target,
 Zap,
 BarChart3,
 Calendar,
 Download,
 Filter
} from 'lucide-react';
import { StatCard } from './StatCard';
import { EarningChart } from './EarningChart';
import { Leaderboard } from './Leaderboard';
import { RecentActivity } from './RecentActivity';

export const AnalyticsView: React.FC = () => {
 return (
 <div className="space-y-8 pb-8">
 {/* Page Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Financial & Performance Analytics</h2>
 <p className="text-sm text-slate-500">Comprehensive overview of platform earnings, growth, and activity</p>
 </div>
 <div className="flex items-center gap-3">
 <div className="flex bg-white rounded-xl shadow-sm border border-slate-100 p-1">
 <button className="px-4 py-2 text-xs font-bold bg-primary/10 text-primary rounded-lg transition-all">Monthly</button>
 <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg">Weekly</button>
 <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg">Daily</button>
 </div>
 <button className="p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-primary/20 transition-all">
 <Calendar className="w-5 h-5 text-slate-400" />
 </button>
 <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 font-bold text-sm hover:bg-primary/90 transition-all">
 <Download className="w-4 h-4" /> Export
 </button>
 </div>
 </div>

 {/* Analytics KPIs */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 <StatCard
 title="Gross Revenue"
 value="$842,402"
 icon={<TrendingUp className="text-emerald-500 w-6 h-6" />}
 color="bg-emerald-500"
 trend="+15.3% vs last target"
 />
 <StatCard
 title="Avg. Order Value"
 value="$34.50"
 icon={<Target className="text-blue-500 w-6 h-6" />}
 color="bg-blue-500"
 trend="+4.2% from prev month"
 />
 <StatCard
 title="Conversion Rate"
 value="3.84%"
 icon={<Zap className="text-amber-500 w-6 h-6" />}
 color="bg-amber-500"
 trend="+0.5% optimization"
 />
 <StatCard
 title="Growth Index"
 value="112.4"
 icon={<BarChart3 className="text-primary w-6 h-6" />}
 color="bg-primary"
 trend="+2.1 performance gain"
 />
 </div>

 {/* Main Charts & Lists */}
 <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 min-h-[600px]">
 {/* Earnings Chart - Spans 2 columns on large screens */}
 <div className="xl:col-span-2 space-y-8">
 <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100 flex flex-col h-full">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h3 className="text-sm font-bold text-slate-400 mb-1">Revenue Stream</h3>
 <h4 className="text-xl font-bold text-slate-800">Earnings Performance</h4>
 </div>
 <div className="relative">
 <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
 <Filter className="w-3.5 h-3.5" /> All Regions
 </button>
 </div>
 </div>
 <div className="flex-1 min-h-[400px]">
 <EarningChart />
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
 <RecentActivity />
 </div>
 </div>

 {/* Leaderboard - Spans 1 column */}
 <div className="h-full">
 <Leaderboard />
 </div>
 </div>
 </div>
 );
};
