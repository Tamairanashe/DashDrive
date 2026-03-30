import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  BarChart3,
  Target,
  Edit3,
  Save,
  X,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Activity,
  Calendar,
  Zap,
  Star,
  Users,
  PieChart as PieChartIcon,
  MousePointer2,
  RefreshCcw,
  FileText,
  AlertCircle,
  Terminal,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Card, Button, Badge } from './ui';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie
} from 'recharts';

// --- Types ---
type PerformanceTab = 'dashboard' | 'sales' | 'operations' | 'top-eats' | 'customer-insights';

// --- Mock Data ---
const PERFORMANCE_DATA = {
  overview: {
    revenue: 1245,
    orders: 47,
    avgTicket: 26.50,
    rating: 4.5,
    comparison: {
      revenue: '+12%',
      orders: '-3%',
      avgTicket: '+8%',
      rating: '0%'
    },
    hourlySales: [
      { hour: '9', status: 120 },
      { hour: '10', status: 180 },
      { hour: '11', status: 240 },
      { hour: '12', status: 380 },
      { hour: '1', status: 310 },
      { hour: '2', status: 150 },
      { hour: '3', status: 190 },
      { hour: '4', status: 260 },
      { hour: '5', status: 140 },
      { hour: '6', status: 90 },
      { hour: '7', status: 70 },
      { hour: '8', status: 50 }
    ],
    topItems: [
      { name: 'Pepperoni Pizza', sold: 12, revenue: 203.88, trend: '+2' },
      { name: 'Spaghetti Bolognese', sold: 8, revenue: 111.92, trend: '-1' },
      { name: 'Caesar Salad', sold: 7, revenue: 62.93, trend: '0' },
      { name: 'French Fries', sold: 6, revenue: 29.94, trend: '+3' },
      { name: 'Soft Drinks', sold: 5, revenue: 14.95, trend: '-2' }
    ]
  },
  operations: {
    avgPrepTime: 18,
    onTimeRate: 92,
    inaccurateRate: 4.3,
    downtime: 23,
    prepTrend: [
      { hour: '9', time: 14 },
      { hour: '10', time: 16 },
      { hour: '11', time: 20 },
      { hour: '12', time: 24 },
      { hour: '1', time: 22 },
      { hour: '2', time: 15 },
      { hour: '3', time: 14 },
      { hour: '4', time: 17 },
      { hour: '5', time: 15 }
    ],
    inaccurateDetails: [
      { id: '#12478', customer: 'John D.', issue: 'Missing: Garlic bread', status: 'Open' },
      { id: '#12465', customer: 'Sarah K.', issue: 'Wrong item: Pasta vs Pizza', status: 'Open' }
    ]
  },
  topEats: {
    progress: 85,
    metrics: [
      { label: 'Rating', current: 4.5, target: 4.8, type: 'star' },
      { label: 'On-Time Rate', current: 92, target: 95, type: 'percent' },
      { label: 'Order Volume', current: 47, target: 20, type: 'count', achieved: true }
    ],
    feedback: {
      positive: [
        { theme: 'Great pizza', count: 45 },
        { theme: 'Friendly staff', count: 32 }
      ],
      negative: [
        { theme: 'Slow delivery', count: 28 },
        { theme: 'Cold fries', count: 18 },
        { theme: 'Missing items', count: 12 }
      ]
    }
  },
  customers: {
    segments: [
      { label: 'NEW', count: 45, trend: '+12%' },
      { label: 'RETURNING', count: 78, trend: '-5%' },
      { label: 'LAPSED', count: 23, trend: '+8%' }
    ],
    ltv: 187,
    retention: 42,
    topCustomers: [
      { name: 'Michael R.', orders: 23, spent: 487, last: 'Today', segment: 'VIP 🔥' },
      { name: 'Sarah J.', orders: 18, spent: 412, last: 'Yesterday', segment: 'VIP 🔥' },
      { name: 'David K.', orders: 15, spent: 328, last: '2 days ago', segment: 'Regular' }
    ]
  }
};

// --- Sub-components ---

const PerformanceSync = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex-1 flex items-center justify-center bg-transparent min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl p-8 bg-white border-2 border-zinc-100 shadow-2xl rounded-[32px]"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white">
            <Terminal size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Aggregating Performance Analytics</h2>
            <p className="text-sm text-zinc-500 font-medium">Main Street Kitchen</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              <span>Loading progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-zinc-900"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Core metrics sync established', complete: progress > 25 },
              { label: 'Historical sales aggregation complete', complete: progress > 50 },
              { label: 'Demand Velocity trend calculation', complete: progress > 75 },
              { label: 'AI insight synthesis (100%)', complete: progress >= 100 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-medium">
                {item.complete ? (
                  <div className="text-emerald-500"><Check size={16} /></div>
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-200 border-t-zinc-900 animate-spin" />
                )}
                <span className={cn(item.complete ? "text-zinc-900" : "text-zinc-400 text-[10px] lowercase")}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App Component ---

export const Performance = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<PerformanceTab>('dashboard');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExportReady, setIsExportReady] = useState(false);
  const [drillDownData, setDrillDownData] = useState<{ title: string, data: any[] } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleChartClick = (data: any, title: string) => {
    if (data && data.activePayload) {
      setDrillDownData({
        title: `${title}: ${data.activeLabel}`,
        data: [
          { label: 'Total Revenue', value: `$${(Math.random() * 500 + 100).toFixed(2)}` },
          { label: 'Order count', value: Math.floor(Math.random() * 20 + 5) },
          { label: 'Avg Basket', value: `$${(Math.random() * 30 + 15).toFixed(2)}` },
          { label: 'Top Item', value: 'Pepperoni Pizza' }
        ]
      });
    }
  };

  const handleGenerateReport = () => {
    setExportProgress(0);
    setIsExportReady(false);
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExportReady(true);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  if (isLoading) return <PerformanceSync onComplete={() => setIsLoading(false)} />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight uppercase mb-1">Performance Command</h2>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-[10px] font-medium text-zinc-400 tracking-widest uppercase">Engine Online // Analytical Nodes Active</p>
          </div>
        </div>
      </div>

      {/* Header / Date Control */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-zinc-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {['TODAY', 'YESTERDAY', 'THIS WEEK', 'THIS MONTH', 'CUSTOM'].map((period) => (
            <Button key={period} variant="ghost" size="sm" className={cn(
              "text-[10px] font-medium tracking-widest uppercase",
              period === 'TODAY' ? "bg-zinc-900 text-white hover:bg-zinc-800" : "text-zinc-400 hover:text-zinc-900"
            )}>
              {period}
            </Button>
          ))}
          <div className="h-4 w-[1px] bg-zinc-200 mx-2" />
          <Button variant="outline" size="sm" className="h-8 text-[10px] font-medium tracking-widest uppercase"><Calendar size={14} className="mr-2" /> SELECT RANGE</Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" className="h-9 font-medium text-[10px] tracking-widest gap-2 uppercase" onClick={() => setIsExportModalOpen(true)}>
            <Download size={14} /> EXPORT REPORT
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9"><RefreshCcw size={16} /></Button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-1 bg-zinc-100/50 p-1.5 rounded-2xl w-fit border border-zinc-200/50">
        {[
          { id: 'dashboard', label: 'DASHBOARD' },
          { id: 'sales', label: 'SALES' },
          { id: 'operations', label: 'OPERATIONS' },
          { id: 'top-eats', label: 'TOP EATS' },
          { id: 'customer-insights', label: 'CUSTOMER INSIGHTS' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as PerformanceTab)}
            className={cn(
              "px-5 py-2 text-[10px] font-medium tracking-widest rounded-xl transition-all uppercase",
              activeTab === tab.id ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/10" : "text-zinc-400 hover:text-zinc-900"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'REVENUE', value: '$1,245', trend: '+12%', status: 'up', icon: BarChart3, color: 'text-zinc-900' },
                { label: 'ORDERS', value: '47', trend: '-3%', status: 'down', icon: ShoppingBag, color: 'text-zinc-900' },
                { label: 'AVG TICKET', value: '$26.50', trend: '+8%', status: 'up', icon: TrendingUp, color: 'text-zinc-900' },
                { label: 'RATING', value: '4.5', trend: '0%', status: 'neutral', icon: Star, color: 'text-zinc-900' }
              ].map(metric => (
                <Card key={metric.label} className="relative group overflow-hidden border-zinc-200/60 hover:border-zinc-900 transition-all duration-300">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">{metric.label}</p>
                      <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 transition-all duration-300 group-hover:bg-zinc-900 group-hover:text-white group-hover:scale-110 group-hover:rotate-6">
                        <metric.icon size={18} />
                      </div>
                    </div>
                    <div className="text-3xl font-semibold text-zinc-900 tracking-tight mb-2">{metric.value}</div>
                    <div className={cn(
                      "flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-tight",
                      metric.status === 'up' ? "text-emerald-600" : metric.status === 'down' ? "text-red-500" : "text-zinc-400"
                    )}>
                      {metric.status === 'up' ? <ArrowUpRight size={14} className="animate-pulse" /> : metric.status === 'down' ? <ArrowDownRight size={14} className="animate-pulse" /> : null}
                      <span className="tracking-widest">{metric.trend}</span>
                      <span className="text-zinc-300 font-medium ml-1 tracking-widest">VS PERIOD</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Trend & Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card title="TODAY'S SALES TREND" className="lg:col-span-2 shadow-sm border-zinc-200/60">
                <div className="h-[300px] w-full mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={PERFORMANCE_DATA.overview.hourlySales}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#18181b" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                      <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#a1a1aa', fontWeight: 900, letterSpacing: '0.05em' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#a1a1aa', fontWeight: 900, letterSpacing: '0.05em' }} />
                      <Tooltip
                        cursor={{ stroke: '#18181b', strokeWidth: 1, strokeDasharray: '4 4' }}
                        contentStyle={{
                          borderRadius: '16px',
                          border: 'none',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(12px)',
                          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                          fontWeight: 500,
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="status"
                        stroke="#18181b"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorSales)"
                        onClick={(data) => handleChartClick(data, 'Hourly Sales')}
                        style={{ cursor: 'pointer' }}
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-6">
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-900 gap-2 font-medium text-[10px] uppercase tracking-widest"><TrendingUp size={14} /> Full Report</Button>
                  <div className="flex gap-6 text-[9px] font-medium uppercase tracking-widest">
                    <span className="text-zinc-900 border-b-2 border-zinc-900 pb-1 cursor-pointer">Hourly</span>
                    <span className="text-zinc-400 hover:text-zinc-600 cursor-pointer">Daily</span>
                    <span className="text-zinc-400 hover:text-zinc-600 cursor-pointer">Weekly</span>
                  </div>
                </div>
              </Card>

              <Card title="TOP SELLING ITEMS (TODAY)" className="shadow-sm border-zinc-200/60">
                <div className="space-y-5 mt-6">
                  {PERFORMANCE_DATA.overview.topItems.map((item, i) => (
                    <div key={item.name} className="flex flex-col group cursor-pointer transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-[10px] font-semibold text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300">
                            {i + 1}
                          </div>
                          <span className="text-xs font-semibold text-zinc-900 uppercase tracking-tight">{item.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-zinc-900 tracking-tighter">${item.revenue.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-medium text-zinc-400 uppercase tracking-widest">{item.sold} SOLD</span>
                        <div className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-medium flex items-center gap-1 uppercase tracking-widest transition-all",
                          item.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : item.trend.startsWith('-') ? "bg-red-50 text-red-600" : "bg-zinc-50 text-zinc-400"
                        )}>
                          {item.trend !== '0' && (item.trend.startsWith('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />)}
                          {item.trend === '0' ? 'Stable' : item.trend}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-8 h-10 text-[10px] font-medium tracking-widest uppercase hover:bg-zinc-900 hover:text-white transition-all">Full Item Catalog</Button>
              </Card>
            </div>

            {/* Lower Grid: Ops & Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="OPERATIONAL ALERTS" className="shadow-sm border-zinc-200/60">
                <div className="space-y-4 mt-6">
                  <div className="p-5 bg-red-50/50 border border-red-100 rounded-2xl relative overflow-hidden group hover:bg-red-50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
                        <AlertTriangle size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-semibold text-red-900 uppercase tracking-widest">Inaccurate orders: 4.3%</p>
                        <p className="text-[10px] text-red-700/70 mt-1 font-medium uppercase tracking-tight">Above target of 3.0%. 2 orders affected today.</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-900 hover:bg-red-100/50 font-semibold"><ChevronRight size={18} /></Button>
                    </div>
                  </div>
                  <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl relative overflow-hidden group hover:bg-emerald-50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                        <Clock size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-semibold text-emerald-900 uppercase tracking-widest">Avg prep time: 18 min</p>
                        <p className="text-[10px] text-emerald-700/70 mt-1 font-medium uppercase tracking-tight">Within target of 20 min. Efficiency optimized.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 bg-amber-50/50 border border-amber-100 rounded-2xl relative overflow-hidden group hover:bg-amber-50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                        <Zap size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-semibold text-amber-900 uppercase tracking-widest">Downtime: 23 min</p>
                        <p className="text-[10px] text-amber-700/70 mt-1 font-medium uppercase tracking-tight">Investigate network status in sector B-4.</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-amber-900 hover:bg-amber-100/50 font-semibold"><ExternalLink size={18} /></Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-zinc-900 text-white border-none p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                      <Star size={20} fill="currentColor" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm tracking-widest uppercase">Top Eats Progress</h3>
                      <p className="text-white/40 text-[10px] font-medium">Main Street Kitchen</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-semibold tracking-widest text-white/60">OVERALL PROGRESS</span>
                        <span className="text-lg font-semibold">{PERFORMANCE_DATA.topEats.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-amber-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${PERFORMANCE_DATA.topEats.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {PERFORMANCE_DATA.topEats.metrics.slice(0, 2).map(m => (
                        <div key={m.label} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                          <p className="text-[9px] font-semibold text-white/50 uppercase tracking-widest mb-1">{m.label}</p>
                          <div className="flex items-baseline justify-between mb-2">
                            <span className="text-lg font-semibold">{m.current}{m.type === 'star' ? '★' : '%'}</span>
                            <span className="text-[9px] font-medium text-white/30">OF {m.target}{m.type === 'star' ? '★' : '%'}</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-white/40" style={{ width: `${(m.current / m.target) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-8 bg-white text-zinc-900 border-none hover:bg-zinc-100 font-semibold text-[10px] tracking-widest h-10" onClick={() => setActiveTab('top-eats')}>VIEW FULL BREAKDOWN</Button>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'sales' && (
          <motion.div
            key="sales"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card title="REVENUE BY CATEGORY" className="lg:col-span-1 shadow-sm border-zinc-200/60">
                <div className="h-[250px] w-full mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Pizza', value: 45 },
                          { name: 'Pasta', value: 25 },
                          { name: 'Salads', value: 20 },
                          { name: 'Drinks', value: 10 }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={8}
                        dataKey="value"
                        animationDuration={1500}
                      >
                        {[
                          { color: '#18181b' },
                          { color: '#3f3f46' },
                          { color: '#71717a' },
                          { color: '#d4d4d8' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(8px)',
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          fontWeight: 500,
                          fontSize: '10px',
                          textTransform: 'uppercase'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 mt-6">
                  {[
                    { name: 'Pizza', value: '45%', amount: '$5,602', color: 'bg-zinc-900' },
                    { name: 'Pasta', value: '25%', amount: '$3,112', color: 'bg-zinc-700' },
                    { name: 'Salads', value: '20%', amount: '$2,490', color: 'bg-zinc-500' },
                    { name: 'Drinks', value: '10%', amount: '$1,245', color: 'bg-zinc-300' }
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125", item.color)} />
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">{item.name}</span>
                      </div>
                      <div className="flex gap-6 items-baseline">
                        <span className="text-[10px] font-medium text-zinc-300 tracking-tighter">{item.value}</span>
                        <span className="text-[11px] font-semibold text-zinc-900 tracking-tighter">{item.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="SALES BY CHANNEL" className="lg:col-span-2 shadow-sm border-zinc-200/60">
                <div className="h-[300px] w-full mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Mon', delivery: 1200, pickup: 400 },
                        { name: 'Tue', delivery: 1100, pickup: 350 },
                        { name: 'Wed', delivery: 1400, pickup: 500 },
                        { name: 'Thu', delivery: 1600, pickup: 600 },
                        { name: 'Fri', delivery: 2100, pickup: 800 },
                        { name: 'Sat', delivery: 2500, pickup: 950 },
                        { name: 'Sun', delivery: 1900, pickup: 700 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      onClick={(data) => handleChartClick(data, 'Daily Sales')}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#a1a1aa', fontWeight: 900, letterSpacing: '0.05em' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#a1a1aa', fontWeight: 900, letterSpacing: '0.05em' }} />
                      <Tooltip
                        cursor={{ fill: 'rgba(244, 244, 245, 0.5)' }}
                        contentStyle={{
                          borderRadius: '16px',
                          border: 'none',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(12px)',
                          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                          fontWeight: 500,
                          fontSize: '11px',
                          textTransform: 'uppercase'
                        }}
                      />
                      <Bar dataKey="delivery" fill="#18181b" radius={[6, 6, 0, 0]} barSize={24} animationDuration={1500} />
                      <Bar dataKey="pickup" fill="#d4d4d8" radius={[6, 6, 0, 0]} barSize={24} animationDuration={1500} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-8 mt-6 pt-6 border-t border-zinc-100">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-zinc-900 rounded-md shadow-sm" />
                    <span className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase">DELIVERY (72%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-zinc-300 rounded-md shadow-sm" />
                    <span className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase">PICKUP (28%)</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Top Items Detailed Table */}
            <Card title="ITEM PERFORMANCE ANALYSIS" className="shadow-sm border-zinc-200/60">
              <div className="mt-6 -mx-6 overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100/50 bg-zinc-50/50">
                      <th className="px-6 py-4 text-[9px] font-semibold text-zinc-400 uppercase tracking-widest">Item Identifier</th>
                      <th className="px-6 py-4 text-[9px] font-semibold text-zinc-400 uppercase tracking-widest">Category</th>
                      <th className="px-6 py-4 text-[9px] font-semibold text-zinc-400 uppercase tracking-widest text-right">Volume</th>
                      <th className="px-6 py-4 text-[9px] font-semibold text-zinc-400 uppercase tracking-widest text-right">Gross Revenue</th>
                      <th className="px-6 py-4 text-[9px] font-semibold text-zinc-400 uppercase tracking-widest text-right">Momentum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Pepperoni Pizza', cat: 'Pizza', qty: 342, rev: '$5,810', trend: '+12%', status: 'up' },
                      { name: 'Truffle Pasta', cat: 'Pasta', qty: 189, rev: '$3,402', trend: '+5%', status: 'up' },
                      { name: 'Caesar Salad', cat: 'Salads', qty: 156, rev: '$1,872', trend: '-2%', status: 'down' },
                      { name: 'Margherita Pizza', cat: 'Pizza', qty: 142, rev: '$2,130', trend: '+8%', status: 'up' },
                      { name: 'Garlic Bread', cat: 'Sides', qty: 128, rev: '$640', trend: '0%', status: 'neutral' }
                    ].map((row, i) => (
                      <tr key={row.name} className="border-b border-zinc-50/50 hover:bg-zinc-50/50 transition-all duration-200 group cursor-pointer">
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold text-zinc-900 uppercase tracking-tight">{row.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="neutral" className="text-[8px] font-semibold bg-zinc-100 text-zinc-500 border-none uppercase tracking-widest">{row.cat}</Badge>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-zinc-900 text-right tracking-tighter">{row.qty}</td>
                        <td className="px-6 py-4 text-xs font-semibold text-zinc-900 text-right tracking-tighter">{row.rev}</td>
                        <td className="px-6 py-4 text-right">
                          <div className={cn(
                            "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-widest",
                            row.status === 'up' ? "bg-emerald-50 text-emerald-600" : row.status === 'down' ? "bg-red-50 text-red-600" : "bg-zinc-50 text-zinc-400"
                          )}>
                            {row.status === 'up' && <ArrowUpRight size={12} />}
                            {row.status === 'down' && <ArrowDownRight size={12} />}
                            {row.trend}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 border-t border-zinc-100/50 text-center">
                <Button variant="ghost" className="text-[10px] font-semibold text-zinc-400 hover:text-zinc-900 uppercase tracking-widest gap-2">
                  <Download size={14} /> Export full item catalog
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'operations' && (
          <motion.div
            key="operations"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Ops Scorecard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'AVG PREP TIME', value: '18 min', status: 'optimal', icon: Clock, detail: '-2 min vs avg', color: 'text-emerald-500' },
                { label: 'ON-TIME RATE', value: '92%', status: 'warning', icon: CheckCircle2, detail: '-3% vs target', color: 'text-amber-500' },
                { label: 'INACCURACY %', value: '4.3%', status: 'danger', icon: AlertTriangle, detail: '+1.3% vs target', color: 'text-red-500' },
                { label: 'TOTAL DOWNTIME', value: '23 min', status: 'neutral', icon: Zap, detail: 'Recorded yesterday', color: 'text-zinc-400' }
              ].map(metric => (
                <Card key={metric.label} className="group border-zinc-200/60 hover:border-zinc-900 transition-all duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <p className="text-[10px] font-semibold text-zinc-400 tracking-widest uppercase">{metric.label}</p>
                    <div className={cn("p-2.5 rounded-xl bg-zinc-50 transition-all group-hover:scale-110", metric.color)}>
                      <metric.icon size={18} />
                    </div>
                  </div>
                  <div className="text-2xl font-semibold text-zinc-900 tracking-tighter mb-2">{metric.value}</div>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full",
                      metric.status === 'optimal' ? "bg-emerald-500" :
                        metric.status === 'warning' ? "bg-amber-500" :
                          metric.status === 'danger' ? "bg-red-500" : "bg-zinc-300"
                    )} />
                    <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest">{metric.detail}</p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Ops Chart */}
            <Card title="PREPARATION TIME TREND" className="shadow-sm border-zinc-200/60">
              <div className="h-[300px] w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={PERFORMANCE_DATA.operations.prepTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#a1a1aa', fontWeight: 900, letterSpacing: '0.05em' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#a1a1aa', fontWeight: 900, letterSpacing: '0.05em' }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '16px',
                        border: 'none',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                        fontWeight: 900,
                        fontSize: '11px',
                        textTransform: 'uppercase'
                      }}
                    />
                    <Line type="monotone" dataKey="time" stroke="#18181b" strokeWidth={4} dot={{ r: 4, fill: '#18181b', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                    {/* Target Line */}
                    <line x1="0" y1="20" x2="100%" y2="20" stroke="#f43f5e" strokeDasharray="5 5" strokeWidth={1.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-100/50 text-[9px] font-semibold uppercase tracking-widest">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 shadow-sm" />
                    <span className="text-zinc-400">Preparation Time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-red-500 rounded-full shadow-sm shadow-red-500/20" />
                    <span className="text-red-500">Target (20m)</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="font-semibold hover:text-zinc-900 text-zinc-400 gap-2">Manage Prep Limits <ChevronRight size={14} /></Button>
              </div>
            </Card>

            {/* Inaccurate Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="INACCURATE ORDERS (INCIDENTS)" className="shadow-sm border-zinc-200/60">
                <div className="space-y-px mt-6 -mx-6">
                  {PERFORMANCE_DATA.operations.inaccurateDetails.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-5 hover:bg-zinc-50/50 transition-all cursor-pointer group px-6 border-b border-zinc-50/30">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-semibold text-[10px] tracking-tighter shadow-lg shadow-zinc-900/10">
                          #{item.id.split('#')[1]}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-900 uppercase tracking-tight">{item.customer}</p>
                          <p className="text-[9px] font-medium text-zinc-400 uppercase tracking-widest mt-0.5">{item.issue}</p>
                        </div>
                      </div>
                      <Badge variant="warning" className="text-[8px] font-semibold uppercase tracking-widest bg-amber-50 text-amber-600 border-none px-2">{item.status}</Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="ghost" className="text-[10px] font-semibold tracking-widest text-zinc-400 hover:text-zinc-900 uppercase">Archive Overview</Button>
                </div>
              </Card>

              <Card title="OPERATIONAL DOWNTIME LOG" className="shadow-sm border-zinc-200/60">
                <div className="p-5 bg-zinc-900 rounded-2xl flex items-center gap-5 mt-6 relative overflow-hidden group border border-white/5">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-500 backdrop-blur-md">
                    <Zap size={22} className="animate-pulse" />
                  </div>
                  <div className="z-10">
                    <p className="text-xs font-semibold text-white uppercase tracking-widest">Network Outage: Sector B-4</p>
                    <p className="text-[9px] font-medium text-white/40 mt-1 uppercase tracking-widest">Estimated Impact: ~$210 Revenue Lost</p>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
                    <AlertCircle size={64} className="text-white" />
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-semibold py-3 border-b border-zinc-100/50">
                    <span className="text-zinc-400 uppercase tracking-widest">Incident Source</span>
                    <span className="text-zinc-900">INTERNET CARRIER ERROR</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-semibold py-3 border-b border-zinc-100/50">
                    <span className="text-zinc-400 uppercase tracking-widest">Down Duration</span>
                    <span className="text-zinc-900">17:00 PM - 17:23 PM</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-8 h-10 text-[10px] font-semibold tracking-widest uppercase hover:bg-zinc-900 hover:text-white transition-all">Configure Failure Alerts</Button>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'top-eats' && (
          <motion.div
            key="top-eats"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 bg-zinc-900 text-white border-none p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-700 pointer-events-none">
                  <Star size={160} fill="currentColor" />
                </div>
                <div className="flex items-center gap-4 mb-10 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/30 group-hover:scale-110 transition-transform duration-500">
                    <Star size={28} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl tracking-tighter uppercase">Badge Status</h3>
                    <p className="text-emerald-400 text-[10px] font-black tracking-widest uppercase mt-1">85% TO RECOGNITION</p>
                  </div>
                </div>
                <div className="space-y-5 relative z-10">
                  {PERFORMANCE_DATA.topEats.metrics.map(m => (
                    <div key={m.label} className="p-5 bg-white/5 rounded-2xl border border-white/10 relative group/metric hover:bg-white/10 transition-all">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5">{m.label}</p>
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-black tracking-tighter">{m.current}{m.type === 'star' ? '★' : m.type === 'percent' ? '%' : ''}</span>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Goal: {m.target}{m.type === 'star' ? '★' : m.type === 'percent' ? '%' : ''}</span>
                      </div>
                      {m.achieved && (
                        <div className="absolute -top-1 -right-1">
                          <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-zinc-900 flex items-center justify-center text-white shadow-lg">
                            <CheckCircle2 size={12} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-white/30 mt-10 leading-relaxed font-black uppercase tracking-widest text-center border-t border-white/5 pt-8">Achieve 95%+ in all sectors to unlock the Elite Merchant Badge.</p>
              </Card>

              <div className="lg:col-span-2 space-y-6">
                <Card title="FEEDBACK CLUSTERS" className="shadow-sm border-zinc-200/60 font-black">
                  <div className="space-y-10 mt-6">
                    <div className="space-y-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100/50">
                          <CheckCircle2 size={18} />
                        </div>
                        <h4 className="text-[11px] font-black tracking-widest uppercase text-zinc-900">Success Themes</h4>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {PERFORMANCE_DATA.topEats.feedback.positive.map(p => (
                          <div key={p.theme} className="px-4 py-2.5 bg-zinc-50 border border-zinc-200/60 rounded-xl flex items-center gap-3 group hover:border-zinc-900 transition-all cursor-pointer">
                            <span className="text-xs font-black text-zinc-900 uppercase tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">"{p.theme}"</span>
                            <Badge variant="neutral" className="text-[10px] font-black bg-zinc-900 text-white border-none px-2.5">{p.count}x</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-5 pt-10 border-t border-zinc-100/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shadow-sm border border-red-100/50">
                          <AlertCircle size={18} />
                        </div>
                        <h4 className="text-[11px] font-black tracking-widest uppercase text-zinc-900">Points of Friction</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {PERFORMANCE_DATA.topEats.feedback.negative.map(n => (
                          <div key={n.theme} className="p-5 bg-zinc-50 border border-zinc-200/60 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-zinc-900/5 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                              <span className="text-xs font-black text-zinc-900 uppercase tracking-tight">"{n.theme}"</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{n.count}x</span>
                              <div className="flex text-amber-400 gap-0.5">
                                {[1, 2, 3, 4, 5].map(s => (
                                  <Star key={s} size={10} fill={s <= 2 ? "currentColor" : "none"} className={s > 2 ? "text-zinc-200" : ""} />
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 bg-zinc-900 rounded-2xl border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-500">
                        <Zap size={64} className="text-white" />
                      </div>
                      <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2 relative z-10">
                        <Zap size={14} fill="currentColor" /> AI Recommendation
                      </h5>
                      <ul className="space-y-3 relative z-10">
                        <li className="text-[11px] text-white/70 font-black flex items-start gap-2 uppercase tracking-tighter leading-relaxed">
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          "Improve on-time rate by extending prep time by +3 minutes during peak 12-1 PM window."
                        </li>
                        <li className="text-[11px] text-white/70 font-black flex items-start gap-2 uppercase tracking-tighter leading-relaxed">
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          "Fries reported as cold 18 times; check heat lamp holding temperature."
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'customer-insights' && (
          <motion.div
            key="customer-insights"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PERFORMANCE_DATA.customers.segments.map(s => (
                <Card key={s.label} className="border-zinc-200/60 hover:border-zinc-900 transition-all duration-300">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">{s.label} SEGMENT</p>
                  <div className="flex items-baseline justify-between transition-transform group-hover:translate-x-1">
                    <span className="text-4xl font-black text-zinc-900 tracking-tighter">{s.count}</span>
                    <Badge variant={s.trend.startsWith('+') ? 'success' : 'warning'} className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border-none px-2">{s.trend}</Badge>
                  </div>
                  <p className="text-[9px] text-zinc-400 font-black mt-3 uppercase tracking-widest">Growth vs Last Month</p>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card title="RETENTION DYNAMICS" className="lg:col-span-2 shadow-sm border-zinc-200/60 font-black">
                <div className="h-[300px] w-full mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { name: 'Week 1', rate: 35 },
                      { name: 'Week 2', rate: 45 },
                      { name: 'Week 3', rate: 42 },
                      { name: 'Week 4', rate: 58 },
                      { name: 'Week 5', rate: 52 }
                    ]}>
                      <defs>
                        <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#a1a1aa', fontWeight: 900, letterSpacing: '0.05em' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#a1a1aa', fontWeight: 900, letterSpacing: '0.05em' }} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '16px',
                          border: 'none',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(12px)',
                          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                          fontWeight: 500,
                          fontSize: '11px',
                          textTransform: 'uppercase'
                        }}
                      />
                      <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRetention)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-8 p-6 bg-zinc-50/50 rounded-2xl flex items-center justify-between border border-zinc-100">
                  <div className="flex items-center gap-8">
                    <div className="text-center md:text-left">
                      <p className="text-2xl font-semibold text-zinc-900 tracking-tighter">42.8%</p>
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mt-1">Net Retention</p>
                    </div>
                    <div className="h-10 w-[1px] bg-zinc-200" />
                    <div className="text-center md:text-left">
                      <p className="text-2xl font-semibold text-zinc-900 tracking-tighter">$187.20</p>
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mt-1">Target LTV</p>
                    </div>
                  </div>
                  <Badge variant="neutral" className="text-[9px] font-semibold tracking-widest uppercase bg-zinc-900 text-white border-none px-3">Sector Leading</Badge>
                </div>
              </Card>

              <Card title="LOYALTY EXCELLENCE" className="shadow-sm border-zinc-200/60 font-black">
                <div className="space-y-px mt-6 -mx-6">
                  {PERFORMANCE_DATA.customers.topCustomers.map((c, i) => (
                    <div key={c.name} className="flex items-center justify-between p-5 px-6 hover:bg-zinc-50/50 transition-all cursor-pointer group border-b border-zinc-50/30">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center text-[10px] font-semibold shadow-lg shadow-zinc-900/10 group-hover:scale-110 transition-transform">
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-900 uppercase tracking-tight">{c.name}</p>
                          <p className="text-[9px] font-medium text-zinc-400 uppercase tracking-widest mt-0.5">{c.orders} Orders • ${c.spent}</p>
                        </div>
                      </div>
                      <Badge variant="warning" className="text-[8px] font-semibold uppercase tracking-widest bg-amber-50 text-amber-600 border-none px-2">{c.segment}</Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="ghost" className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400 hover:text-zinc-900">Explore Full Audience</Button>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Modal Simulation */}
      <AnimatePresence>
        {isExportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-200/50"
            >
              {!isExportReady ? (
                <>
                  <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                    <div>
                      <h3 className="font-semibold text-zinc-900 text-sm tracking-tighter uppercase flex items-center gap-3">
                        <FileText size={18} className="text-zinc-400" /> Export System
                      </h3>
                      <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest mt-1">Generating Performance Ledger</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-zinc-900 rounded-full" onClick={() => setIsExportModalOpen(false)}><X size={20} /></Button>
                  </div>
                  <div className="p-10 space-y-10">
                    {exportProgress > 0 ? (
                      <div className="space-y-8 text-center py-6">
                        <div className="relative w-32 h-32 mx-auto">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-100" />
                            <motion.circle
                              cx="64"
                              cy="64"
                              r="60"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              className="text-zinc-900"
                              strokeDasharray={2 * Math.PI * 60}
                              initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                              animate={{ strokeDashoffset: 2 * Math.PI * 60 * (1 - exportProgress / 100) }}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-semibold tracking-tighter">{exportProgress}%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-zinc-900 uppercase tracking-widest animate-pulse">Processing Cluster Data...</p>
                          <p className="text-[9px] font-medium text-zinc-400 uppercase tracking-widest">Compiling financial metrics and customer segments</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Select Report Type</p>
                          <div className="grid grid-cols-2 gap-3">
                            {['Sales Summary', 'Operations Audit', 'Customer Insights', 'Full Analytics'].map((t, i) => (
                              <div key={t} className={cn(
                                "p-5 border rounded-2xl flex items-center gap-3 cursor-pointer group transition-all",
                                i === 3 ? "border-zinc-900 bg-zinc-900 text-white shadow-xl shadow-zinc-900/10" : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/50 hover:border-zinc-300"
                              )}>
                                <div className={cn(
                                  "w-5 h-5 rounded-full border flex items-center justify-center",
                                  i === 3 ? "border-white/50" : "border-zinc-300"
                                )}>
                                  {i === 3 && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                                </div>
                                <span className="text-[11px] font-semibold uppercase tracking-tight">{t}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4 pt-8 border-t border-zinc-100">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Export Format</p>
                            <div className="flex gap-6">
                              {['PDF', 'Excel', 'CSV'].map((f, i) => (
                                <div key={f} className="flex items-center gap-2 cursor-pointer group">
                                  <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-all", i === 0 ? "border-zinc-900 bg-zinc-900" : "border-zinc-300 group-hover:border-zinc-900")}>
                                    {i === 0 && <CheckCircle2 size={10} className="text-white" />}
                                  </div>
                                  <span className="text-[11px] font-semibold uppercase tracking-tighter text-zinc-600 group-hover:text-zinc-900">{f}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-4 pt-6">
                          <Button variant="outline" className="flex-1 font-semibold text-[10px] h-12 uppercase tracking-widest rounded-xl hover:bg-zinc-50" onClick={() => setIsExportModalOpen(false)}>CANCEL</Button>
                          <Button variant="primary" className="flex-1 font-semibold text-[10px] h-12 bg-zinc-900 text-white uppercase tracking-widest rounded-xl shadow-xl shadow-zinc-900/10 hover:bg-zinc-800" onClick={handleGenerateReport}>GENERATE REPORT</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-16 text-center space-y-10">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-2xl shadow-emerald-500/30"
                  >
                    <Download size={40} />
                  </motion.div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tighter">Report Complete</h3>
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Your digital analytics ledger is ready for download</p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      <Badge variant="neutral" className="text-[10px] font-semibold uppercase tracking-widest bg-zinc-100 text-zinc-500 border-none px-3">2.4 MB</Badge>
                      <Badge variant="neutral" className="text-[10px] font-semibold uppercase tracking-widest bg-zinc-100 text-zinc-500 border-none px-3">PDF Ledger</Badge>
                    </div>
                  </div>
                  <div className="pt-6 flex flex-col gap-3">
                    <Button className="h-14 bg-emerald-500 text-white font-semibold text-xs uppercase tracking-widest rounded-2xl hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-500/20 w-full" onClick={() => setIsExportModalOpen(false)}>
                      Download Report PDF
                    </Button>
                    <Button variant="ghost" className="h-10 text-zinc-400 font-semibold text-[10px] uppercase tracking-widest" onClick={() => setIsExportModalOpen(false)}>
                      Dismiss System
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Drill Down Modal */}
      <AnimatePresence>
        {drillDownData && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200/50"
            >
              <div className="bg-zinc-900 p-8 flex justify-between items-center text-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                    <MousePointer2 size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm tracking-tighter uppercase">{drillDownData.title}</h3>
                    <p className="text-[9px] font-semibold text-white/40 uppercase tracking-widest">Detailed Performance Node</p>
                  </div>
                </div>
                <button onClick={() => setDrillDownData(null)} className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  {drillDownData.data.map((item, i) => (
                    <div key={i} className="p-5 bg-zinc-50/50 border border-zinc-100 rounded-2xl group hover:border-zinc-900 transition-all">
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">{item.label}</p>
                      <p className="text-2xl font-semibold text-zinc-900 tracking-tighter group-hover:scale-105 transition-transform origin-left">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-8 border-t border-zinc-100 space-y-5">
                  <h4 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Performance Insights</h4>
                  <div className="flex items-start gap-4 p-5 bg-emerald-50 rounded-2xl border border-emerald-100/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform">
                      <TrendingUp size={48} className="text-emerald-500" />
                    </div>
                    <TrendingUp size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-emerald-800 font-semibold leading-relaxed uppercase tracking-tighter relative z-10">
                      This period outperformed the previous cycle by 8.4%. Consider increasing staffing for this specific window.
                    </p>
                  </div>
                </div>
                <Button className="w-full bg-zinc-900 text-white font-semibold text-[10px] h-12 uppercase tracking-widest rounded-xl hover:bg-zinc-800 shadow-xl shadow-zinc-900/10" onClick={() => setDrillDownData(null)}>
                  Acknowledge & Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Performance;
