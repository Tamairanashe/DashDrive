import React from 'react';
import { cn } from '../utils';

interface StatCardProps {
 title: string;
 value: string | number;
 icon: React.ReactNode;
 color?: string;
 trend?: string;
}

export const StatCard = ({ title, value, icon, color = "bg-primary", trend }: StatCardProps) => {
 return (
 <div className="bg-white p-7 rounded-[32px] shadow-soft border border-slate-100/50 flex flex-col justify-between relative overflow-hidden group hover:border-primary/20 transition-all duration-300">
 <div className="z-10">
 <p className="text-slate-400 text-[11px] font-bold font-small-caps mb-1.5">{title}</p>
 <h3 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">{value}</h3>
 </div>

 <div className={cn(
 "absolute top-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg",
 color.includes('bg-') ? `${color} text-white shadow-current/10` : `bg-${color}/10 text-${color} shadow-slate-200`
 )}>
 {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
 </div>

 <div className="mt-6 flex items-center gap-2 z-10">
 {trend ? (
 <span className="text-[10px] font-bold font-small-caps text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100/50">{trend}</span>
 ) : (
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-bold font-small-caps text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100/50">+12.5%</span>
 <span className="text-[10px] text-slate-400 font-bold font-small-caps">vs last week</span>
 </div>
 )}
 </div>

 {/* Decorative Gradient Overlay */}
 <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-slate-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
 </div>
 );
};
