import React from 'react';
import {
 TrendingUp,
 ShoppingBag,
 Users,
 Car,
 Utensils,
 Package,
 CreditCard,
 FileText,
 Clock,
 Heart,
 ArrowUpRight,
 ArrowDownRight,
 MoreVertical
} from 'lucide-react';
import { StatCard } from './StatCard';
import { EarningChart } from './EarningChart';
import { cn } from '../utils';

export const SuperAppDashboard: React.FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {
 return (
 <div className="space-y-8 pb-8">
 {/* Row 1: Main KPI Summary */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 <StatCard
 title="Total Revenue"
 value="$4,968,533"
 icon={<TrendingUp className="text-emerald-500 w-6 h-6" />}
 color="bg-emerald-500"
 trend="+12.5% from last month"
 />
 <StatCard
 title="Total Orders"
 value="124,802"
 icon={<ShoppingBag className="text-blue-500 w-6 h-6" />}
 color="bg-blue-500"
 trend="+8.2% from last month"
 />
 <StatCard
 title="Active Users"
 value="842,456"
 icon={<Users className="text-primary w-6 h-6" />}
 color="bg-primary"
 trend="+5.4% from last month"
 />
 <StatCard
 title="Active Drivers"
 value="12,402"
 icon={<Car className="text-amber-500 w-6 h-6" />}
 color="bg-amber-500"
 trend="+2.1% from last month"
 />
 </div>

 {/* Row 2: Services Overview */}
 <div>
 <h3 className="text-lg font-bold text-slate-800 mb-4">Services Overview</h3>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <ServiceCard
 title="Ride Hailing"
 icon={<Car className="w-5 h-5" />}
 stats={[
 { label: 'Total Rides', value: '45,201' },
 { label: 'Pending', value: '1,284' },
 { label: 'Active', value: '842' },
 { label: 'Completed', value: '43,075' }
 ]}
 color="bg-blue-500"
 />
 <ServiceCard
 title="Food Delivery"
 icon={<Utensils className="w-5 h-5" />}
 stats={[
 { label: 'Total Orders', value: '68,402' },
 { label: 'Pending', value: '2,104' },
 { label: 'Active', value: '1,456' },
 { label: 'Completed', value: '64,842' }
 ]}
 color="bg-emerald-500"
 />
 <ServiceCard
 title="Parcel Delivery"
 icon={<Package className="w-5 h-5" />}
 stats={[
 { label: 'Total Shipments', value: '11,200' },
 { label: 'Pending', value: '452' },
 { label: 'In Transit', value: '890' },
 { label: 'Delivered', value: '9,858' }
 ]}
 color="bg-amber-500"
 />
 </div>
 </div>

 {/* Row 3: Payments & Fintech */}
 <div>
 <h3 className="text-lg font-bold text-slate-800 mb-4">Payments & Financial Services</h3>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 <FintechCard
 title="Cashless Payments"
 icon={<CreditCard className="text-primary" />}
 value="$2.4M"
 subtext="Total Volume"
 stats={[
 { label: 'Success', value: '98.2%' },
 { label: 'Failed', value: '1.8%' }
 ]}
 />
 <FintechCard
 title="Pay Bills"
 icon={<FileText className="text-blue-500" />}
 value="12,402"
 subtext="Bills Paid Today"
 stats={[
 { label: 'Utility', value: '65%' },
 { label: 'Telecom', value: '35%' }
 ]}
 />
 <FintechCard
 title="Dash PayLater"
 icon={<Clock className="text-amber-500" />}
 value="$1.2M"
 subtext="Outstanding Credit"
 stats={[
 { label: 'Active Users', value: '45k' },
 { label: 'Repayment', value: '94%' }
 ]}
 />
 <FintechCard
 title="Donations"
 icon={<Heart className="text-red-500" />}
 value="$45,200"
 subtext="Total Amount"
 stats={[
 { label: 'Campaigns', value: '12' },
 { label: 'Donors', value: '8.4k' }
 ]}
 />
 </div>
 </div>

 {/* Row 4: Platform Stats */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 <PlatformStatsCard
 title="Drivers"
 icon={<Car className="text-primary" />}
 onDetailsClick={() => onNavigate?.('Drivers')}
 stats={[
 { label: 'Total Drivers', value: '15,200' },
 { label: 'Online', value: '12,402', color: 'text-emerald-500' },
 { label: 'Offline', value: '2,656', color: 'text-slate-400' },
 { label: 'Suspended', value: '142', color: 'text-red-500' }
 ]}
 />
 <PlatformStatsCard
 title="Users"
 icon={<Users className="text-blue-500" />}
 onDetailsClick={() => onNavigate?.('Customers')}
 stats={[
 { label: 'Total Users', value: '1.2M' },
 { label: 'Customers', value: '1.18M' },
 { label: 'Vendors', value: '12,402' },
 { label: 'New Today', value: '2,456', color: 'text-primary' }
 ]}
 />
 </div>

 {/* Row 5: Charts */}
 <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
 <div className="bg-white p-6 rounded-[24px] shadow-soft border border-slate-100">
 <div className="flex items-center justify-between mb-6">
 <h3 className="text-sm font-bold text-slate-800 ">Revenue by Service</h3>
 <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
 <MoreVertical className="w-4 h-4 text-slate-400" />
 </button>
 </div>
 <div className="h-[300px]">
 <EarningChart />
 </div>
 </div>
 <div className="bg-white p-6 rounded-[24px] shadow-soft border border-slate-100">
 <div className="flex items-center justify-between mb-6">
 <h3 className="text-sm font-bold text-slate-800 ">Daily Transactions</h3>
 <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
 <MoreVertical className="w-4 h-4 text-slate-400" />
 </button>
 </div>
 <div className="h-[300px] flex items-center justify-center text-slate-400 italic">
 {/* Placeholder for Transaction Chart */}
 <TrendingUp className="w-12 h-12 opacity-10" />
 </div>
 </div>
 </div>
 </div>
 );
};

interface ServiceCardProps {
 title: string;
 icon: React.ReactNode;
 stats: { label: string; value: string }[];
 color: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, icon, stats, color }) => (
 <div className="bg-white p-6 rounded-[24px] shadow-soft border border-slate-100 hover:border-primary/20 transition-all group">
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center gap-3">
 <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-current/10", color)}>
 {icon}
 </div>
 <h4 className="font-bold text-slate-800">{title}</h4>
 </div>
 <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
 <MoreVertical className="w-4 h-4 text-slate-400" />
 </button>
 </div>
 <div className="grid grid-cols-2 gap-4">
 {stats.map((stat) => (
 <div key={stat.label}>
 <p className="text-xs font-bold text-slate-400 tracking-wide">{stat.label}</p>
 <p className="text-lg font-bold text-slate-800 mt-1">{stat.value}</p>
 </div>
 ))}
 </div>
 </div>
);

interface FintechCardProps {
 title: string;
 icon: React.ReactNode;
 value: string;
 subtext: string;
 stats: { label: string; value: string }[];
}

const FintechCard: React.FC<FintechCardProps> = ({ title, icon, value, subtext, stats }) => (
 <div className="bg-white p-6 rounded-[24px] shadow-soft border border-slate-100">
 <div className="flex items-center gap-2 mb-4">
 <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
 <span className="w-4 h-4">{icon}</span>
 </div>
 <h4 className="text-xs font-bold text-slate-400 ">{title}</h4>
 </div>
 <div className="mb-4">
 <p className="text-2xl font-bold text-slate-800">{value}</p>
 <p className="text-[10px] font-bold text-slate-400 ">{subtext}</p>
 </div>
 <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
 {stats.map((stat) => (
 <div key={stat.label}>
 <p className="text-[10px] font-bold text-slate-400 ">{stat.label}</p>
 <p className="text-sm font-bold text-slate-800">{stat.value}</p>
 </div>
 ))}
 </div>
 </div>
);

interface PlatformStatsCardProps {
 title: string;
 icon: React.ReactNode;
 stats: { label: string; value: string; color?: string }[];
 onDetailsClick?: () => void;
}

const PlatformStatsCard: React.FC<PlatformStatsCardProps> = ({ title, icon, stats, onDetailsClick }) => (
 <div className="bg-white p-6 rounded-[24px] shadow-soft border border-slate-100">
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
 <span className="w-5 h-5">{icon}</span>
 </div>
 <h4 className="font-bold text-slate-800">{title} Stats</h4>
 </div>
 <button
 onClick={onDetailsClick}
 className="text-xs font-bold text-primary hover:underline"
 >
 View Details
 </button>
 </div>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
 {stats.map((stat) => (
 <div key={stat.label}>
 <p className="text-[10px] font-bold text-slate-400 ">{stat.label}</p>
 <p className={cn("text-xl font-bold mt-1", stat.color || "text-slate-800")}>{stat.value}</p>
 </div>
 ))}
 </div>
 </div>
);
