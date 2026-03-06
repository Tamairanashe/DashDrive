import React from 'react';
import { Car, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '../utils';

const activities = [
 { id: 'TR-9421', time: '2 mins ago', status: 'Completed', type: 'Luxury' },
 { id: 'TR-9420', time: '15 mins ago', status: 'Pending', type: 'Standard' },
 { id: 'TR-9419', time: '24 mins ago', status: 'Cancelled', type: 'Bike' },
 { id: 'TR-9418', time: '1 hour ago', status: 'Completed', type: 'Luxury' },
 { id: 'TR-9417', time: '2 hours ago', status: 'Ongoing', type: 'Standard' },
 { id: 'TR-9416', time: '3 hours ago', status: 'Completed', type: 'Parcel' },
];

const getStatusStyles = (status: string) => {
 switch (status) {
 case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
 case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
 case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
 case 'Ongoing': return 'bg-blue-50 text-blue-600 border-blue-100';
 default: return 'bg-slate-50 text-slate-600 border-slate-100';
 }
};

const getStatusIcon = (status: string) => {
 switch (status) {
 case 'Completed': return <CheckCircle2 className="w-3 h-3" />;
 case 'Pending': return <Clock className="w-3 h-3" />;
 case 'Cancelled': return <XCircle className="w-3 h-3" />;
 case 'Ongoing': return <AlertCircle className="w-3 h-3" />;
 default: return null;
 }
};

export const RecentActivity = () => {
 return (
 <div className="bg-white p-6 rounded-[20px] shadow-soft border border-slate-50 flex flex-col h-full">
 <div className="flex items-center justify-between mb-6">
 <h3 className="text-lg font-bold text-slate-800">Recent Trips Activity</h3>
 <button className="text-xs font-semibold text-primary hover:underline">View All</button>
 </div>

 <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide">
 {activities.map((activity) => (
 <div key={activity.id} className="flex items-start gap-4 group cursor-pointer">
 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
 <Car className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
 </div>
 
 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between mb-1">
 <p className="text-sm font-bold text-slate-800 truncate">Trip #{activity.id}</p>
 <span className={cn(
 "text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1",
 getStatusStyles(activity.status)
 )}>
 {getStatusIcon(activity.status)}
 {activity.status}
 </span>
 </div>
 <div className="flex items-center gap-2 text-xs text-slate-500">
 <span>{activity.type}</span>
 <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
 <span>{activity.time}</span>
 </div>
 </div>
 </div>
 ))}
 </div>
 
 <div className="mt-6 pt-6 border-top border-slate-100">
 <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
 <p className="text-xs font-semibold text-primary mb-1">System Health</p>
 <div className="flex items-center justify-between">
 <span className="text-[10px] text-slate-500">98.5% uptime today</span>
 <div className="flex gap-0.5">
 {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-3 bg-primary rounded-full opacity-60"></div>)}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};
