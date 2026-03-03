import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  ChevronRight,
  Camera,
  UserPlus,
  Settings as SettingsIcon,
  MessageSquare,
  Activity,
  Zap,
  Target,
  Globe
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import { motion } from 'motion/react';
import { cn } from '../types';
import { fetchFromAdmin } from '../api';

const salesData = [
  { name: 'Mon', sales: 4200, orders: 120 },
  { name: 'Tue', sales: 3800, orders: 110 },
  { name: 'Wed', sales: 3200, orders: 95 },
  { name: 'Thu', sales: 4500, orders: 140 },
  { name: 'Fri', sales: 5100, orders: 165 },
  { name: 'Sat', sales: 6200, orders: 200 },
  { name: 'Sun', sales: 5800, orders: 185 },
];

const TaskCard = ({ title, description, icon: Icon, action, severity }: { title: string, description: string, icon: any, action: string, severity?: 'critical' | 'warning' | 'info' }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="card-premium p-6 flex items-start gap-4 relative overflow-hidden group border-none"
  >
    {severity === 'critical' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]" />}

    <div className={cn(
      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300",
      severity === 'critical' ? "bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white" :
        severity === 'warning' ? "bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white" :
          "bg-[#00ff90]/10 text-[#00ff90] group-hover:bg-[#00ff90] group-hover:text-black"
    )}>
      <Icon size={24} />
    </div>
    <div className="flex-1">
      <h3 className="font-black text-black text-[15px] mb-1 leading-tight">{title}</h3>
      <p className="text-[12px] text-gray-500 mb-4 font-medium leading-relaxed">{description}</p>
      <button className="text-[11px] font-black text-black flex items-center gap-1 group-hover:translate-x-1 transition-transform uppercase tracking-widest">
        {action} <ChevronRight size={14} className="text-[#00ff90]" />
      </button>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    orders_today: 0,
    revenue_today: 0,
    avg_prep_time: 0,
    late_orders: 0,
    active_stores: 0
  });

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await fetchFromAdmin('/admin/dashboard/overview');
        setMetrics(data);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      }
    };
    loadMetrics();
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Total Revenue', value: '£' + metrics.revenue_today.toLocaleString(), trend: '0.43%', up: true, icon: TrendingUp },
    { label: 'Total Orders', value: metrics.orders_today, trend: '4.35%', up: true, icon: ShoppingBag },
    { label: 'Active Hubs', value: metrics.active_stores, trend: '2.59%', up: true, icon: Globe },
    { label: 'SLA Risk', value: metrics.late_orders, trend: '0.95%', up: false, icon: AlertCircle },
  ];

  return (
    <div className="space-y-6">
      {/* 4-Column KPI Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <div className="w-12 h-12 rounded-full bg-[#EFF4FB] flex items-center justify-center text-[#3C50E0]">
                <stat.icon size={22} />
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {stat.value}
                </h4>
                <span className="text-sm font-medium text-[#64748B]">{stat.label}</span>
              </div>

              <span className={cn(
                "flex items-center gap-1 text-sm font-medium",
                stat.up ? "text-meta-3" : "text-meta-1"
              )} style={{ color: stat.up ? '#10B981' : '#F09595' }}>
                {stat.trend}
                {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* Main Chart */}
        <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
            <div className="flex w-full flex-wrap gap-3 sm:gap-5">
              <div className="flex min-w-47.5">
                <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
                  <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
                </span>
                <div className="w-full">
                  <p className="font-semibold text-primary">Total Revenue</p>
                  <p className="text-sm font-medium">12.04.2024 - 12.05.2024</p>
                </div>
              </div>
            </div>
            <div className="flex w-full max-w-45 justify-end">
              <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
                <button className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
                  Day
                </button>
                <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
                  Week
                </button>
                <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
                  Month
                </button>
              </div>
            </div>
          </div>

          <div>
            <div id="chartOne" className="-ml-5 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3C50E0" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3C50E0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="#3C50E0" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Channels/Side content */}
        <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Top Fulfillment Hubs
          </h4>

          <div className="flex flex-col gap-4">
            {[
              { name: 'London Central', orders: 1204, growth: '+12%', color: '#3C50E0' },
              { name: 'Manchester Hub', orders: 940, growth: '+8.4%', color: '#10B981' },
              { name: 'Birmingham South', orders: 820, growth: '-2.1%', color: '#FFBA00' },
              { name: 'Glasgow West', orders: 670, growth: '+4.2%', color: '#3C50E0' },
            ].map((hub, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: hub.color }}></div>
                  <span className="text-sm font-medium text-black">{hub.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{hub.orders}</span>
                  <span className={cn("text-xs font-medium", hub.growth.startsWith('+') ? "text-meta-3" : "text-meta-1")} style={{ color: hub.growth.startsWith('+') ? '#10B981' : '#F09595' }}>
                    {hub.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90" style={{ backgroundColor: '#1C2434' }}>
              Detailed Hub Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
