import React, { useState } from 'react';
import {
 Zap,
 RotateCcw,
 Save,
 Star,
 Navigation,
 Clock,
 Shield,
 Bot,
 Target,
 Activity,
 Users,
 ChevronRight,
 ArrowUpRight,
 TrendingUp,
 Settings2,
 CheckCircle2,
 LayoutGrid,
 Truck,
 Car,
 Smartphone,
 Info,
 ArrowRight
} from 'lucide-react';
import { cn } from '../utils';

export const PrioritySetup: React.FC = () => {
 const [servicePriority, setServicePriority] = useState([
 { id: '1', name: 'Elite Ride', priority: 'High', color: 'blue', icon: Star },
 { id: '2', name: 'Standard Ride', priority: 'Medium', color: 'slate', icon: Car },
 { id: '3', name: 'Parcel Priority', priority: 'High', color: 'emerald', icon: Zap },
 { id: '4', name: 'Food Delivery', priority: 'Low', color: 'rose', icon: Activity },
 ]);

 const [assignmentLogic, setAssignmentLogic] = useState('Nearest Driver');

 const renderHeader = () => (
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 mt-4">
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg">
 <Target className="w-6 h-6 text-amber-400" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-black text-slate-400 tracking-[0.2em]">Configuration</span>
 <div className="w-1 h-1 rounded-full bg-slate-200" />
 <span className="text-[10px] font-black text-[#0089D1] tracking-[0.2em]">Operational Intelligence</span>
 </div>
 <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mt-1">Priority Setup</h1>
 </div>
 </div>
 <p className="text-base font-medium text-slate-500 max-w-lg leading-relaxed">
 Fine-tune assignment logic, service weighting, and triage rules to optimize platform efficiency and customer satisfaction.
 </p>
 </div>

 <div className="flex items-center gap-4">
 <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-[24px] text-xs font-black hover:bg-slate-50 hover:text-slate-600 transition-all focus:ring-4 focus:ring-slate-100">
 <RotateCcw className="w-5 h-5" /> Reset
 </button>
 <button className="flex items-center gap-3 px-10 py-4 bg-[#0089D1] text-white rounded-[24px] text-xs font-black hover:bg-[#007AB8] transition-all shadow-xl shadow-[#0089D1]/20 font-display focus:ring-4 focus:ring-[#007AB8]/20">
 <Save className="w-5 h-5" /> Persist Changes
 </button>
 </div>
 </div>
 );

 return (
 <div className="max-w-[1700px] mx-auto space-y-12 pb-20 px-4">
 {renderHeader()}

 <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
 {/* Assignment Logic Engine */}
 <div className="flex-1 space-y-8">
 <div className="bg-white p-12 rounded-[60px] border border-slate-100 shadow-sm space-y-10 relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] -mr-40 -mt-40 transition-all group-hover:bg-blue-500/10" />

 <div className="flex items-center justify-between relative z-10">
 <div className="flex items-center gap-6">
 <div className="p-5 bg-blue-50 text-blue-500 rounded-[30px] border border-blue-100/50 shadow-inner">
 <Bot className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Dispatch Logic</h3>
 <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] mt-2 italic">Automated Assignment Rules</p>
 </div>
 </div>
 <div className="px-5 py-2 bg-emerald-50 rounded-full border border-emerald-100">
 <span className="text-[10px] font-black text-emerald-500 italic flex items-center gap-2">
 <TrendingUp className="w-4 h-4" /> Optimization Active
 </span>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
 {[
 { title: 'Nearest Driver', desc: 'Prioritizes the driver with the shortest physical distance.', icon: Navigation, active: assignmentLogic === 'Nearest Driver' },
 { title: 'Highest Rated', desc: 'Routes requests to drivers with 4.8+ ratings first.', icon: Star, active: assignmentLogic === 'Highest Rated' },
 { title: 'Idle Time', desc: 'Assigns to drivers who have been online the longest without a trip.', icon: Clock, active: assignmentLogic === 'Idle Time' },
 { title: 'Balanced Load', desc: 'Distributes earnings evenly across the online fleet.', icon: Activity, active: assignmentLogic === 'Balanced Load' }
 ].map((logic) => (
 <button
 key={logic.title}
 onClick={() => setAssignmentLogic(logic.title)}
 className={cn(
 "p-8 rounded-[40px] border text-left transition-all duration-300 group/item relative overflow-hidden",
 logic.active
 ? "bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]"
 : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-white hover:border-blue-100"
 )}
 >
 {logic.active && <div className="absolute top-4 right-4"><CheckCircle2 className="w-5 h-5 text-blue-400" /></div>}
 <logic.icon className={cn(
 "w-8 h-8 mb-4 transition-colors",
 logic.active ? "text-blue-400" : "text-slate-300 group-hover/item:text-blue-500"
 )} />
 <h4 className="text-sm font-black mb-2">{logic.title}</h4>
 <p className={cn(
 "text-[10px] font-medium leading-relaxed",
 logic.active ? "text-white/60" : "text-slate-400"
 )}>
 {logic.desc}
 </p>
 </button>
 ))}
 </div>
 </div>

 <div className="p-10 bg-blue-50/50 rounded-[50px] border border-blue-100 flex items-start gap-6 group hover:bg-blue-50 transition-colors duration-500">
 <div className="p-4 bg-white rounded-[24px] text-blue-500 shadow-sm border border-blue-50 group-hover:scale-110 transition-transform">
 <Shield className="w-6 h-6" />
 </div>
 <div className="space-y-3">
 <h4 className="text-sm font-black text-blue-900 ">Safety Tier Integration</h4>
 <p className="text-[10px] font-medium text-blue-800/60 leading-relaxed">
 High-priority services (e.g. Elite Ride) bypass standard radius limits and utilize a secondary verification layer
 to ensure your top drivers are always matched with premium customers.
 </p>
 <button className="flex items-center gap-2 text-[10px] font-black text-blue-600 hover:underline transition-all">
 Efficiency Report <ArrowRight className="w-3 h-3" />
 </button>
 </div>
 </div>
 </div>

 {/* Service Weighting Panel */}
 <div className="lg:w-[500px] shrink-0 space-y-8">
 <div className="bg-slate-900 p-12 rounded-[60px] text-white space-y-10 shadow-2xl relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />

 <div className="flex items-center gap-6 relative z-10">
 <div className="p-5 bg-white/10 rounded-[30px] border border-white/10 text-amber-400">
 <LayoutGrid className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-3xl font-black tracking-tight leading-none">Service Weighting</h3>
 <p className="text-[10px] font-black text-white/40 tracking-[0.2em] mt-2 italic">Hierarchy of Fulfillment</p>
 </div>
 </div>

 <div className="space-y-4 relative z-10">
 {servicePriority.map((item) => (
 <div key={item.id} className="p-6 bg-white/5 border border-white/5 rounded-[32px] hover:bg-white/10 transition-all group/row cursor-pointer">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-4">
 <div className={cn(
 "p-3 rounded-2xl bg-white/10 group-hover/row:scale-110 transition-transform",
 item.color === 'blue' ? "text-blue-400" :
 item.color === 'emerald' ? "text-emerald-400" :
 item.color === 'rose' ? "text-rose-400" :
 "text-slate-400"
 )}>
 <item.icon className="w-5 h-5" />
 </div>
 <span className="text-xs font-black ">{item.name}</span>
 </div>
 <button className="flex items-center gap-2 text-[10px] font-black text-white/40 hover:text-white transition-colors">
 {item.priority} Priority <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
 <div className={cn(
 "h-full transition-all duration-1000",
 item.priority === 'High' ? "w-[90%] bg-white" :
 item.priority === 'Medium' ? "w-[60%] bg-white/60" :
 "w-[30%] bg-white/20"
 )} />
 </div>
 </div>
 ))}
 </div>

 <button className="w-full py-6 bg-white text-slate-900 rounded-[32px] text-xs font-black tracking-[0.3em] shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
 <Settings2 className="w-5 h-5" /> Re-calibate Triage
 </button>
 </div>

 <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm space-y-6">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-amber-50 rounded-2xl text-amber-500">
 <TrendingUp className="w-6 h-6" />
 </div>
 <div>
 <h4 className="text-sm font-black text-slate-900 ">Real-time Triage</h4>
 <p className="text-[10px] font-medium text-slate-500">Live request processing status</p>
 </div>
 </div>
 <div className="space-y-4">
 {[
 { label: 'Active Queue', value: '42 Jobs', color: 'blue' },
 { label: 'Triage Latency', value: '14ms', color: 'emerald' },
 { label: 'Match Confidence', value: '98.4%', color: 'amber' }
 ].map((stat) => (
 <div key={stat.label} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
 <span className="text-[10px] font-black text-slate-400 ">{stat.label}</span>
 <span className={cn(
 "text-xs font-black",
 stat.color === 'blue' ? "text-blue-600" :
 stat.color === 'emerald' ? "text-emerald-600" :
 "text-amber-600"
 )}>{stat.value}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};
