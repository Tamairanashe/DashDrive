import React from 'react';
import {
 Search,
 Filter,
 MapPin,
 Clock,
 MoreVertical,
 ChevronRight,
 User,
 Car,
 AlertCircle,
 CheckCircle2,
 XCircle
} from 'lucide-react';
import { cn } from '../utils';

interface RideRequest {
 id: string;
 customer: string;
 pickup: string;
 drop: string;
 time: string;
 status: 'Pending' | 'Accepted' | 'Cancelled' | 'Searching';
 driver: string | null;
 service: 'Dash Sedan' | 'Dash XL' | 'Dash Bike';
 payment: 'Cash' | 'Wallet';
}

const mockRequests: RideRequest[] = [
 {
 id: 'REQ-9402',
 customer: 'Alex Johnson',
 pickup: '742 Evergreen Terrace, Springfield',
 drop: 'Springfield Airport (Terminal 3)',
 time: '12:45 PM',
 status: 'Pending',
 driver: null,
 service: 'Dash Sedan',
 payment: 'Wallet'
 },
 {
 id: 'REQ-9401',
 customer: 'Sarah Miller',
 pickup: 'Central Park West, Entrance 4',
 drop: 'Grand Central Terminal',
 time: '12:42 PM',
 status: 'Searching',
 driver: null,
 service: 'Dash XL',
 payment: 'Cash'
 },
 {
 id: 'REQ-9400',
 customer: 'Michael Chen',
 pickup: 'Tech Hub Office Park, Block C',
 drop: 'Downtown Shopping Mall',
 time: '12:38 PM',
 status: 'Accepted',
 driver: 'Robert Fox',
 service: 'Dash Sedan',
 payment: 'Wallet'
 },
 {
 id: 'REQ-9399',
 customer: 'Emma Wilson',
 pickup: 'University Library South',
 drop: 'Sunset Blvd Appts, No 42',
 time: '12:35 PM',
 status: 'Cancelled',
 driver: null,
 service: 'Dash Bike',
 payment: 'Cash'
 }
];

export const RideRequests: React.FC = () => {
 return (
 <div className="space-y-8">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Ride Requests</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Manage incoming ride bookings before trip commencement</p>
 </div>
 <div className="flex items-center gap-4">
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold font-small-caps text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
 <Filter className="w-3.5 h-3.5" />
 Filters
 </button>
 <div className="relative">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
 <input
 type="text"
 placeholder="Search requests..."
 className="pl-11 pr-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all w-72 shadow-sm"
 />
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
 <StatusPill label="All Requests" count={124} active />
 <StatusPill label="Pending" count={12} color="text-amber-600" />
 <StatusPill label="Searching" count={8} color="text-blue-600" />
 <StatusPill label="Completed Today" count={104} color="text-emerald-600" />
 </div>

 <div className="bg-white rounded-[32px] shadow-soft border border-slate-100/50 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-slate-50 bg-slate-50/30">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Request ID</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Customer</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Route Locations</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Status</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Service</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {mockRequests.map((req) => (
 <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
 <td className="px-8 py-6">
 <span className="text-sm font-display font-extrabold text-slate-900 tracking-tight">{req.id}</span>
 <p className="text-[10px] text-slate-400 font-bold font-small-caps mt-1.5">{req.time}</p>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-3.5">
 <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
 <User className="w-5 h-5 text-slate-400" />
 </div>
 <span className="text-sm font-display font-bold text-slate-800 tracking-tight">{req.customer}</span>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-2.5 max-w-[280px]">
 <div className="flex items-center gap-3">
 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
 <span className="text-xs font-medium text-slate-600 truncate">{req.pickup}</span>
 </div>
 <div className="flex items-center gap-3">
 <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-sm" />
 <span className="text-xs font-medium text-slate-600 truncate">{req.drop}</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <StatusBadge status={req.status} />
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2.5">
 <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center">
 <Car className="w-3.5 h-3.5 text-slate-400" />
 </div>
 <span className="text-xs font-bold font-display text-slate-800 tracking-tight">{req.service}</span>
 </div>
 <p className="text-[10px] text-slate-400 font-bold font-small-caps mt-1.5 ">{req.payment} Account</p>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
 <button className="p-2.5 hover:bg-primary/10 text-primary rounded-xl transition-all border border-transparent hover:border-primary/20">
 <CheckCircle2 className="w-4.5 h-4.5" />
 </button>
 <button className="p-2.5 hover:bg-slate-50 text-slate-400 rounded-xl transition-all border border-transparent hover:border-slate-200">
 <MoreVertical className="w-4.5 h-4.5" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
};

const StatusPill: React.FC<{ label: string; count: number; color?: string; active?: boolean }> = ({ label, count, color, active }) => (
 <div className={cn(
 "p-6 rounded-[28px] bg-white border border-slate-100 flex items-center justify-between transition-all hover:scale-[1.02] cursor-pointer shadow-sm group",
 active && "border-primary/30 bg-primary/[0.03] shadow-primary/5"
 )}>
 <span className="text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em] group-hover:text-slate-500 transition-colors">{label}</span>
 <span className={cn("text-2xl font-display font-black tracking-tight", color || "text-slate-900")}>{count}</span>
 </div>
);

const StatusBadge: React.FC<{ status: RideRequest['status'] }> = ({ status }) => (
 <span className={cn(
 "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[10px] font-bold font-small-caps ",
 status === 'Pending' && "bg-amber-50 text-amber-700 border border-amber-100/50",
 status === 'Searching' && "bg-blue-50 text-blue-700 border border-blue-100/50",
 status === 'Accepted' && "bg-emerald-50 text-emerald-700 border border-emerald-100/50",
 status === 'Cancelled' && "bg-red-50 text-red-700 border border-red-100/50"
 )}>
 {status === 'Searching' && <div className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />}
 {status}
 </span>
);

