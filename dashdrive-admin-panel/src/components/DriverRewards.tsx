import React, { useState } from 'react';
import {
 Award,
 TrendingUp,
 Users,
 ChevronRight,
 Search,
 Filter,
 Download,
 Plus,
 Edit3,
 Trash2,
 CheckCircle2,
 XCircle,
 Info,
 Zap,
 Scale,
 Shield,
 Star,
 ArrowUpRight,
 ArrowDownRight,
 History,
 Settings,
 LayoutGrid,
 Target,
 Gift,
 Clock,
 DollarSign,
 MoreVertical,
 Activity,
 Lock,
 Unlock,
 Fuel,
 HeartPulse,
 Percent,
 Crown,
 Diamond,
 Plane,
 MapPin,
 GraduationCap,
 Wrench,
 Calendar,
 Bot,
 PlayCircle,
 MousePointer2,
 RefreshCw,
 Eye,
 ShieldCheck
} from 'lucide-react';
import { cn } from '../utils';

interface DriverRewardsProps {
 activeTab: string;
}

interface Tier {
 id: string;
 name: string;
 color: string;
 icon: any;
 points: number;
 minTrips: number;
 minRating: number;
 minAcceptanceRate: number;
 maxCancellations: number;
 driversCount: number;
 status: 'Active' | 'Inactive';
 benefits: string[];
}

export const DriverRewards: React.FC<DriverRewardsProps> = ({ activeTab }) => {
 const [searchTerm, setSearchTerm] = useState('');

 const tiers: Tier[] = [
 {
 id: 'T-001',
 name: 'Bronze',
 color: 'text-amber-700 bg-amber-50 border-amber-100',
 icon: Award,
 points: 0,
 minTrips: 0,
 minRating: 4.70,
 minAcceptanceRate: 0,
 maxCancellations: 15,
 driversCount: 1240,
 status: 'Active',
 benefits: ['Standard 12% Commission', 'Basic Ride Feed Access', 'Instant Payouts']
 },
 {
 id: 'T-002',
 name: 'Silver',
 color: 'text-slate-500 bg-slate-50 border-slate-200',
 icon: Shield,
 points: 2200,
 minTrips: 20,
 minRating: 4.75,
 minAcceptanceRate: 75,
 maxCancellations: 8,
 driversCount: 850,
 status: 'Active',
 benefits: ['11% Commission Rate', 'Quick-Counter Bid Buttons', 'Fuel Partner Discounts']
 },
 {
 id: 'T-003',
 name: 'Gold',
 color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
 icon: Star,
 points: 6500,
 minTrips: 50,
 minRating: 4.80,
 minAcceptanceRate: 80,
 maxCancellations: 6,
 driversCount: 420,
 status: 'Active',
 benefits: ['10% Commission Rate', 'Verified Trust Badge', 'Directional Ride Filters']
 },
 {
 id: 'T-004',
 name: 'Platinum',
 color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
 icon: Crown,
 points: 13500,
 minTrips: 90,
 minRating: 4.85,
 minAcceptanceRate: 85,
 maxCancellations: 4,
 driversCount: 120,
 status: 'Active',
 benefits: ['8% Commission Rate', '3s Early Ride Access (Sneak Peek)', '5 Zero-Comm Rides Weekly']
 },
 {
 id: 'T-005',
 name: 'Diamond',
 color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
 icon: Diamond,
 points: 25500,
 minTrips: 150,
 minRating: 4.90,
 minAcceptanceRate: 90,
 maxCancellations: 2,
 driversCount: 45,
 status: 'Active',
 benefits: ['5% Commission Rate (Elite)', 'Pinned Top Bid Placement', 'Automated Accept Filters']
 }
 ];

 const renderOverview = () => (
 <div className="space-y-8 animate-in fade-in duration-500">
 {/* Stats Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
 {tiers.map((tier) => (
 <div key={tier.name} className={cn(
 "p-6 rounded-[32px] border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden",
 tier.color
 )}>
 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
 <tier.icon className="w-20 h-20" />
 </div>
 <div className="relative z-10">
 <div className="flex items-center gap-3 mb-4">
 <div className="p-2.5 rounded-2xl bg-white/60 shadow-sm backdrop-blur-sm">
 <tier.icon className="w-5 h-5" />
 </div>
 <span className="text-[10px] font-bold opacity-60">{tier.name} TIER</span>
 </div>
 <div className="flex flex-col">
 <span className="text-3xl font-black">{tier.driversCount.toLocaleString()}</span>
 <span className="text-[10px] font-bold mt-1 opacity-50">Drivers Active</span>
 </div>
 <div className="mt-6 flex items-center gap-2">
 <div className="flex-1 h-1.5 bg-white/40 rounded-full overflow-hidden">
 <div className="h-full bg-current rounded-full" style={{ width: '65%' }} />
 </div>
 <span className="text-[10px] font-bold">+12%</span>
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* Middle Section: Distribution & Analytics */}
 <div className="grid grid-cols-12 gap-8">
 <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h3 className="text-lg font-bold text-slate-900 leading-none">Tier Distribution</h3>
 <p className="text-xs font-medium text-slate-400 mt-2">Driver migration across tiers over the last 30 days</p>
 </div>
 <select className="bg-slate-50 border-none rounded-xl text-[11px] font-bold px-4 py-2 focus:ring-0">
 <option>Last 30 Days</option>
 <option>Last 3 Months</option>
 </select>
 </div>

 <div className="h-[300px] flex items-end justify-between gap-4 px-4">
 {[45, 65, 85, 35, 25, 55, 75, 95, 45, 65].map((h, i) => (
 <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
 <div className="relative w-full">
 <div
 className="w-full bg-slate-50 rounded-2xl transition-all duration-500 group-hover:bg-slate-100"
 style={{ height: '240px' }}
 />
 <div
 className="absolute bottom-0 left-0 right-0 bg-[#0089D1] rounded-2xl transition-all duration-1000 group-hover:brightness-110 shadow-lg shadow-[#0089D1]/20"
 style={{ height: `${h}%` }}
 >
 <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
 {h}% Growth
 </div>
 </div>
 </div>
 <span className="text-[10px] font-bold text-slate-400">Day {i + 1}</span>
 </div>
 ))}
 </div>
 </div>

 <div className="col-span-12 lg:col-span-4 space-y-8">
 <div className="bg-slate-900 p-8 rounded-[40px] text-white overflow-hidden relative">
 <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
 <h4 className="text-sm font-bold opacity-60 mb-6">Tier Performance</h4>
 <div className="space-y-6">
 {[
 { label: 'Avg Driver Score', value: '4.85', icon: Target, trend: '+0.5' },
 { label: 'Tier Upgrade Rate', value: '24.2%', icon: TrendingUp, trend: '+2.1%' },
 { label: 'Churn Risk (Diamond)', value: '1.2%', icon: Activity, trend: '-0.3%' }
 ].map((stat) => (
 <div key={stat.label} className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="p-2.5 bg-white/10 rounded-2xl">
 <stat.icon className="w-5 h-5" />
 </div>
 <div>
 <p className="text-[10px] font-bold opacity-50 tracking-tight">{stat.label}</p>
 <p className="text-xl font-bold mt-0.5">{stat.value}</p>
 </div>
 </div>
 <span className={cn(
 "text-[10px] font-bold px-2 py-1 rounded-full",
 stat.trend.startsWith('+') ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
 )}>{stat.trend}</span>
 </div>
 ))}
 </div>
 </div>

 <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
 <h4 className="text-xs font-bold text-slate-400 mb-6">Quick Actions</h4>
 <div className="grid grid-cols-2 gap-4">
 <button className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-3xl hover:bg-slate-100 transition-all group">
 <div className="p-3 bg-white rounded-2xl shadow-sm text-[#0089D1] group-hover:scale-110 transition-transform">
 <Plus className="w-5 h-5" />
 </div>
 <span className="text-[10px] font-bold text-slate-600">New Tier</span>
 </button>
 <button className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-3xl hover:bg-slate-100 transition-all group">
 <div className="p-3 bg-white rounded-2xl shadow-sm text-amber-500 group-hover:scale-110 transition-transform">
 <Download className="w-5 h-5" />
 </div>
 <span className="text-[10px] font-bold text-slate-600">Export Report</span>
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );

 const renderTierRules = () => (
 <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
 <div>
 <h3 className="text-lg font-bold text-slate-900 leading-none">Promotion Rules Engine</h3>
 <p className="text-xs font-medium text-slate-400 mt-2">Manage minimum requirements for tier advancement</p>
 </div>
 <button className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-[11px] font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
 Update All Rules
 </button>
 </div>

 <table className="w-full text-left">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-10 py-5 text-[9px] font-bold text-slate-400 ">TIER</th>
 <th className="px-10 py-5 text-[9px] font-bold text-slate-400 text-center">REQ. POINTS</th>
 <th className="px-10 py-5 text-[9px] font-bold text-slate-400 text-center">MIN. TRIPS</th>
 <th className="px-10 py-5 text-[9px] font-bold text-slate-400 text-center">TARGET EFFICIENCY</th>
 <th className="px-10 py-5 text-[9px] font-bold text-slate-400 text-center">MIN. RATING</th>
 <th className="px-10 py-5 text-[9px] font-bold text-slate-400 text-center">MIN. ACCEPTANCE %</th>
 <th className="px-10 py-5 text-[9px] font-bold text-slate-400 text-center">MAX. CANCEL %</th>
 <th className="px-10 py-5 text-[9px] font-bold text-slate-400 text-right">ACTIONS</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {tiers.map((tier) => (
 <tr key={tier.name} className="group hover:bg-slate-50/30 transition-all">
 <td className="px-10 py-6">
 <div className="flex items-center gap-4">
 <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", tier.color)}>
 <tier.icon className="w-5 h-5" />
 </div>
 <span className="text-xs font-black text-slate-900">{tier.name}</span>
 </div>
 </td>
 <td className="px-10 py-6 text-center">
 <span className="text-xs font-bold text-slate-900">{tier.points.toLocaleString()}</span>
 </td>
 <td className="px-10 py-6 text-center">
 <span className="text-xs font-bold text-indigo-600">{tier.minTrips}</span>
 </td>
 <td className="px-10 py-6 text-center">
 <span className="text-xs font-black text-slate-900">{tier.minTrips > 0 ? (tier.points / tier.minTrips).toFixed(0) : '0'} <span className="text-[10px] font-bold text-slate-400">pts/trip</span></span>
 </td>
 <td className="px-10 py-6 text-center">
 <span className="text-xs font-bold text-slate-900">{tier.minRating}</span>
 </td>
 <td className="px-10 py-6 text-center">
 <span className="text-xs font-bold text-emerald-500">{tier.minAcceptanceRate}%</span>
 </td>
 <td className="px-10 py-6 text-center">
 <span className="text-xs font-bold text-rose-500">{tier.maxCancellations}%</span>
 </td>
 <td className="px-10 py-6">
 <div className="flex items-center justify-end gap-2">
 <button className="p-2 text-slate-300 hover:text-[#0089D1] transition-colors"><Edit3 className="w-4 h-4" /></button>
 <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 );

 const renderBenefitsSetup = () => (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500 pb-20">
 {tiers.slice(1).map((tier) => (
 <div key={tier.name} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8 relative overflow-hidden group">
 <div className={cn("absolute top-0 right-0 w-48 h-48 blur-[80px] opacity-10 transition-opacity group-hover:opacity-20",
 tier.name === 'Diamond' ? 'bg-cyan-500' :
 tier.name === 'Platinum' ? 'bg-indigo-500' :
 tier.name === 'Gold' ? 'bg-yellow-500' : 'bg-slate-500'
 )} />

 <div className="flex items-center justify-between relative z-10">
 <div className="flex items-center gap-4">
 <div className={cn("p-4 rounded-[22px] shadow-sm", tier.color)}>
 <tier.icon className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 leading-none">{tier.name}</h3>
 <p className="text-[10px] font-bold text-slate-400 mt-2 tracking-[0.2em]">Management Panel</p>
 </div>
 </div>
 <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
 <span className="text-[9px] font-black text-slate-500 ">Active</span>
 </div>
 </div>

 <div className="space-y-6 relative z-10">
 {/* Incentive Controls */}
 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-2">
 <label className="text-[10px] font-bold text-slate-400 ml-1">Commission %</label>
 <div className="relative">
 <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
 <input
 type="number"
 className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-[#0089D1]/20 outline-none transition-all"
 defaultValue={tier.name === 'Diamond' ? 15 : tier.name === 'Platinum' ? 10 : tier.name === 'Gold' ? 5 : 2}
 />
 </div>
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-bold text-slate-400 ml-1">Multiplier</label>
 <div className="relative">
 <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-500" />
 <input
 type="text"
 className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
 defaultValue={tier.name === 'Diamond' ? '2.5x' : tier.name === 'Platinum' ? '2.0x' : '1.5x'}
 />
 </div>
 </div>
 </div>

 {/* Support Priority Dropdown */}
 <div className="space-y-2">
 <label className="text-[10px] font-bold text-slate-400 ml-1">Support Priority Level</label>
 <div className="relative">
 <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-500" />
 <select className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-bold appearance-none focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer">
 <option selected={tier.name === 'Diamond'}>Dedicated VIP Support</option>
 <option selected={tier.name === 'Platinum'}>Priority Tech Support</option>
 <option selected={tier.name === 'Gold'}>Priority Support</option>
 <option selected={tier.name === 'Silver'}>Standard Support+</option>
 <option>Standard Support</option>
 </select>
 <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90" />
 </div>
 </div>

 {/* Boolean Toggles */}
 <div className="p-5 bg-slate-50/50 rounded-[32px] border border-slate-100 space-y-4">
 {[
 { label: 'Quick-Counter Bid Buttons', icon: Zap, checked: tier.points >= 2200 },
 { label: 'Sneak Peek (Early Access)', icon: Eye, checked: tier.name === 'Diamond' || tier.name === 'Platinum' },
 { label: 'Pinned Top Bid Placement', icon: Target, checked: tier.name === 'Diamond' },
 { label: 'Directional Ride Filters', icon: MapPin, checked: tier.name === 'Diamond' || tier.name === 'Platinum' || tier.name === 'Gold' },
 { label: 'Auto-Accept Filter Rules', icon: Bot, checked: tier.name === 'Diamond' },
 { label: 'Verified Trust Badge', icon: ShieldCheck, checked: tier.name === 'Diamond' || tier.name === 'Platinum' || tier.name === 'Gold' },
 ].map((toggle) => (
 <div key={toggle.label} className="flex items-center justify-between group/row">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-white rounded-xl shadow-sm group-hover/row:scale-110 transition-transform">
 <toggle.icon className="w-3.5 h-3.5 text-slate-400 group-hover/row:text-[#0089D1] transition-colors" />
 </div>
 <span className="text-[11px] font-bold text-slate-600">{toggle.label}</span>
 </div>
 <label className="relative inline-flex items-center cursor-pointer scale-90">
 <input type="checkbox" className="sr-only peer" defaultChecked={toggle.checked} />
 <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0089D1]"></div>
 </label>
 </div>
 ))}
 </div>
 </div>

 <div className="pt-2 relative z-10">
 <button className="w-full py-4 bg-slate-900 text-white rounded-[24px] text-[11px] font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 hover:-translate-y-0.5 active:translate-y-0">
 Save {tier.name} Config
 </button>
 </div>
 </div>
 ))}
 </div>
 );

 const renderTierHistory = () => (
 <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
 <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
 <div>
 <h3 className="text-lg font-bold text-slate-900 leading-none">Tier Audit Log</h3>
 <p className="text-xs font-medium text-slate-400 mt-2">Recent driver promotions, demotions, and system adjustments</p>
 </div>
 <div className="flex items-center gap-3">
 <div className="relative group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
 <input
 type="text"
 placeholder="Search by ID..."
 className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-[11px] font-bold w-[200px] outline-none focus:ring-1 focus:ring-slate-100 transition-all"
 />
 </div>
 </div>
 </div>

 <table className="w-full text-left">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-10 py-5 text-[9px] font-bold text-slate-400 ">DRIVER</th>
 <th className="px-10 py-5 text-[9px] font-bold text-slate-400 ">ACTION</th>
 <th className="px-10 py-5 text-[9px] font-bold text-slate-400 ">PREVIOUS TIER</th>
 <th className="px-10 py-5 text-[9px] font-bold text-slate-400 ">NEW TIER</th>
 <th className="px-10 py-5 text-[9px] font-bold text-slate-400 ">REASON</th>
 <th className="px-10 py-5 text-[9px] font-bold text-slate-400 ">TIMESTAMP</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {[
 { id: 'DR-1092', name: 'John Doe', action: 'Promotion', from: 'Bronze', to: 'Silver', reason: 'Req. Trips Met', time: '12 mins ago' },
 { id: 'DR-5521', name: 'Sarah Lynn', action: 'Promotion', from: 'Gold', to: 'Platinum', reason: 'Rating Milestone', time: '1 hour ago' },
 { id: 'DR-3342', name: 'Mike Ross', action: 'Demotion', from: 'Silver', to: 'Bronze', reason: 'Inactivity', time: '3 hours ago' },
 { id: 'DR-8812', name: 'Elena G.', action: 'Promotion', from: 'Silver', to: 'Gold', reason: 'Points Reached', time: '5 hours ago' },
 ].map((entry) => (
 <tr key={entry.id} className="group hover:bg-slate-50/50 transition-all">
 <td className="px-10 py-6">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{entry.name.charAt(0)}</div>
 <div>
 <p className="text-xs font-bold text-slate-900 leading-none">{entry.name}</p>
 <p className="text-[10px] font-medium text-slate-400 mt-1">ID: {entry.id}</p>
 </div>
 </div>
 </td>
 <td className="px-10 py-6">
 <span className={cn(
 "px-3 py-1 rounded-full text-[9px] font-bold ",
 entry.action === 'Promotion' ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
 )}>{entry.action}</span>
 </td>
 <td className="px-10 py-6 text-xs font-bold text-slate-400">{entry.from}</td>
 <td className="px-10 py-6 text-xs font-bold text-slate-900">{entry.to}</td>
 <td className="px-10 py-6 text-[11px] font-medium text-slate-500">{entry.reason}</td>
 <td className="px-10 py-6 text-[11px] font-bold text-slate-400">{entry.time}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 );

 const renderGlobalSettings = () => (
 <div className="grid grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
 {/* Left Column: Rewards Engine Config */}
 <div className="col-span-12 lg:col-span-8 space-y-8">
 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-10">
 <div>
 <h3 className="text-xl font-black text-slate-900 leading-none">Rewards Engine Configuration</h3>
 <p className="text-xs font-medium text-slate-400 mt-3">Central control for point multipliers and assessment cycles</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
 {/* Assessment Cycle */}
 <div className="space-y-4">
 <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 ml-1">
 <Calendar className="w-3 h-3" /> Assessment Cycle
 </label>
 <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
 {['1 Month', '3 Months', '6 Months'].map((period) => (
 <button
 key={period}
 className={cn(
 "py-2.5 rounded-xl text-[10px] font-bold transition-all",
 period === '1 Month'
 ? "bg-white text-slate-900 shadow-sm border border-slate-100"
 : "text-slate-400 hover:text-slate-600"
 )}
 >
 {period}
 </button>
 ))}
 </div>
 </div>

 {/* Base Point Logic */}
 <div className="space-y-4">
 <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 ml-1">
 <Award className="w-3 h-3 text-amber-500" /> Base Point Logic
 </label>
 <div className="relative">
 <input
 type="text"
 className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
 defaultValue="100 Dash Points (Base)"
 />
 <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">1x Base</span>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50 invisible lg:visible h-0 lg:h-auto overflow-hidden">
 {/* These will be visible on actual layout but for code simplicity we keep them together */}
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-4">
 <div className="space-y-4">
 <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 ml-1">
 <Activity className="w-3 h-3 text-[#0089D1]" /> Instant Match Bonus
 </label>
 <div className="relative">
 <input
 type="text"
 className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-[#0089D1]/20 outline-none transition-all"
 defaultValue="+50 Dash Points"
 />
 <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#0089D1] bg-[#0089D1]/5 px-2 py-1 rounded-lg border border-[#0089D1]/10">Bonus</span>
 </div>
 </div>
 <div className="space-y-4">
 <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 ml-1">
 <Zap className="w-3 h-3 text-emerald-500" /> Peak Hour Bonus
 </label>
 <div className="relative">
 <input
 type="text"
 className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
 defaultValue="200 Dash Points"
 />
 <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">2x</span>
 </div>
 </div>
 <div className="space-y-4">
 <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 ml-1">
 <TrendingUp className="w-3 h-3 text-rose-500" /> Weekend Bonus
 </label>
 <div className="relative">
 <input
 type="text"
 className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
 defaultValue="300 Dash Points"
 />
 <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">3x</span>
 </div>
 </div>
 </div>

 <div className="space-y-6 pt-10 border-t border-slate-50">
 <div className="flex items-center justify-between mb-2">
 <h4 className="text-[10px] font-bold text-slate-400 ml-1">Weekly Peak Strategy (2x Multiplier)</h4>
 <button className="text-[10px] font-bold text-[#0089D1] hover:underline flex items-center gap-1">
 <Plus className="w-3 h-3" /> Edit Schedule
 </button>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {[
 { day: 'Monday', slots: ['07:00 - 11:00 AM', '12:00 - 02:00 PM'], color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
 { day: 'Tuesday', slots: ['07:00 - 08:00 AM', '09:00 - 02:00 PM'], color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
 { day: 'Wednesday', slots: ['10:00 - 02:00 PM', '03:00 - 05:00 PM'], color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
 { day: 'Thursday', slots: ['11:00 - 05:00 PM'], color: 'bg-[#0089D1]/5 text-[#0089D1] border-[#0089D1]/10' },
 { day: 'Friday', slots: ['12:00 - 06:00 PM'], color: 'bg-[#0089D1]/5 text-[#0089D1] border-[#0089D1]/10' },
 { day: 'Saturday', slots: ['09:00 - 03:00 PM'], color: 'bg-amber-50 text-amber-600 border-amber-100 text-center' },
 { day: 'Sunday', slots: ['08:00 - 10:00 AM', '03:00 - 05:00 PM', '07:00 - 09:00 PM'], color: 'bg-rose-50 text-rose-600 border-rose-100' },
 ].map((item) => (
 <div key={item.day} className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-3 group hover:border-[#0089D1]/20 transition-all">
 <div className="flex items-center justify-between">
 <span className="text-[11px] font-black text-slate-900">{item.day}</span>
 <div className="w-1.5 h-1.5 rounded-full bg-[#0089D1]/30 group-hover:bg-[#0089D1] transition-colors" />
 </div>
 <div className="space-y-1.5">
 {item.slots.map((slot, i) => (
 <div key={i} className={cn("px-3 py-1.5 rounded-xl border text-[9px] font-bold flex items-center gap-2", item.color)}>
 <Clock className="w-3 h-3" />
 {slot}
 </div>
 ))}
 </div>
 </div>
 ))}
 </div>
 </div>

 <div className="space-y-6 pt-10 border-t border-slate-50">
 <h4 className="text-[10px] font-bold text-slate-400 ml-1">Performance Windows</h4>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-white rounded-xl shadow-sm">
 <Star className="w-4 h-4 text-yellow-500" />
 </div>
 <span className="text-[11px] font-bold text-slate-700">Rating Window</span>
 </div>
 <span className="text-xs font-black text-slate-900">Last 500 Trips</span>
 </div>
 <input type="range" className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#0089D1]" defaultValue="75" />
 </div>
 <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-white rounded-xl shadow-sm">
 <MousePointer2 className="w-4 h-4 text-indigo-500" />
 </div>
 <span className="text-[11px] font-bold text-slate-700">Acceptance Window</span>
 </div>
 <span className="text-xs font-black text-slate-900">Last 100 Requests</span>
 </div>
 <input type="range" className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-500" defaultValue="40" />
 </div>
 </div>
 </div>
 </div>

 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center justify-between">
 <div>
 <h3 className="text-xl font-black text-slate-900 leading-none">Global Tier Logic</h3>
 <p className="text-xs font-medium text-slate-400 mt-2">Override or adjust global promotion behavior</p>
 </div>
 </div>

 <div className="space-y-4">
 {[
 { label: 'Instant Promotion upon Requirement Met', desc: 'Drivers upgrade immediately when points & metrics hit threshold', state: true },
 { label: 'Manual Approval for Diamond Tier', desc: 'Requires admin review before moving a driver to Diamond', state: true },
 { label: 'Auto-Downgrade on Metric Breach', desc: 'Instantly demote drivers who fall below cancellation or rating limits', state: false },
 ].map((logic, i) => (
 <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] group hover:bg-slate-100 transition-all">
 <div>
 <p className="text-[11px] font-black text-slate-900">{logic.label}</p>
 <p className="text-[10px] font-medium text-slate-400 mt-1">{logic.desc}</p>
 </div>
 <label className="relative inline-flex items-center cursor-pointer">
 <input type="checkbox" className="sr-only peer" defaultChecked={logic.state} />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0089D1]"></div>
 </label>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Right Column: Status & Run */}
 <div className="col-span-12 lg:col-span-4 space-y-8">
 <div className="bg-slate-900 p-10 rounded-[40px] text-white relative overflow-hidden">
 <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
 <div className="flex items-center gap-3 mb-8">
 <Bot className="w-6 h-6 text-[#0089D1]" />
 <h3 className="text-sm font-bold opacity-60">Automation Engine</h3>
 </div>

 <div className="space-y-8">
 <div>
 <p className="text-4xl font-black">Active</p>
 <p className="text-[10px] font-bold opacity-40 mt-2">Auto-pilot Status</p>
 </div>

 <div className="p-6 bg-white/5 rounded-[32px] border border-white/10 space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-bold opacity-60">Last Global Assessment</span>
 <span className="text-[10px] font-black italic">2 hours ago</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-bold opacity-60">Next Scheduled Run</span>
 <span className="text-[10px] font-black">Tomorrow, 02:00 AM</span>
 </div>
 </div>

 <button className="w-full py-5 bg-[#0089D1] hover:bg-[#007AB8] text-white rounded-[24px] text-xs font-black transition-all shadow-xl shadow-[#0089D1]/20 flex items-center justify-center gap-3">
 <PlayCircle className="w-5 h-5" /> Run Manual Assessment
 </button>
 </div>
 </div>

 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
 <div className="flex items-center gap-3">
 <div className="p-2.5 bg-indigo-50 rounded-2xl">
 <RefreshCw className="w-5 h-5 text-indigo-600" />
 </div>
 <h4 className="text-sm font-bold text-slate-800 ">System Integrity</h4>
 </div>
 <div className="space-y-4">
 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
 <span className="text-[11px] font-bold text-slate-500">Database Sync</span>
 <span className="text-[10px] font-black text-emerald-500">STABLE</span>
 </div>
 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
 <span className="text-[11px] font-bold text-slate-500">Logic Latency</span>
 <span className="text-[10px] font-black text-emerald-500">12ms</span>
 </div>
 </div>
 </div>

 <div className="p-8 bg-rose-50 rounded-[40px] border border-rose-100">
 <div className="flex items-center gap-3 text-rose-600 mb-4">
 <Info className="w-5 h-5" />
 <h4 className="text-[10px] font-black tracking-[0.2em]">Safety Protocol</h4>
 </div>
 <p className="text-xs font-semibold text-rose-800 leading-relaxed px-1">Changing the assessment cycle will trigger a full re-calculation for all 2,450+ active drivers.</p>
 </div>
 </div>
 </div >
 );

 return (
 <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
 {/* Header Area */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <div className="flex items-center gap-2 mb-2">
 <span className="text-[10px] font-medium text-slate-400">User Mgmt</span>
 <ChevronRight className="w-3 h-3 text-slate-300" />
 <span className="text-[10px] font-medium text-slate-400">Drivers</span>
 <ChevronRight className="w-3 h-3 text-slate-300" />
 <span className="text-[10px] font-medium text-slate-400">Rewards</span>
 </div>
 <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Driver Rewards</h1>
 <p className="text-sm font-medium text-slate-400 mt-2">Monthly high-intensity rewards model focused on peak performance & strategic driving</p>
 </div>

 <div className="flex items-center gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/50">
 <button className="flex items-center gap-2 px-5 py-2.5 bg-white shadow-sm border border-slate-200 rounded-xl text-slate-600 text-[11px] font-bold hover:bg-slate-50 transition-all">
 <Download className="w-4 h-4" /> Export Stats
 </button>
 <button className="flex items-center gap-2 px-6 py-2.5 bg-[#0089D1] text-white rounded-xl text-[11px] font-bold hover:bg-[#007AB8] transition-all shadow-lg shadow-[#0089D1]/20">
 <Plus className="w-4 h-4" /> Create New Tier
 </button>
 </div>
 </div>

 {/* View Selection (Contextual rendering since currentView from sidebar is the source of truth) */}
 {activeTab === 'Tier Overview' && renderOverview()}
 {activeTab === 'Tier Rules' && renderTierRules()}
 {activeTab === 'Benefits Setup' && renderBenefitsSetup()}
 {activeTab === 'Tier History' && renderTierHistory()}
 {activeTab === 'Global Settings' && renderGlobalSettings()}
 </div>
 );
};
