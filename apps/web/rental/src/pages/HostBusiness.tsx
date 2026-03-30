import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Download, 
  Filter,
  BarChart3,
  PieChart,
  Wallet,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Transaction {
  id: string;
  date: string;
  type: 'Payout' | 'Earnings' | 'Adjustment';
  amount: number;
  status: 'Completed' | 'Pending' | 'Processing';
  reference: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2024-03-15', type: 'Earnings', amount: 1240.50, status: 'Completed', reference: 'Trip TR-8821' },
  { id: '2', date: '2024-03-14', type: 'Payout', amount: -2500.00, status: 'Processing', reference: 'Bank Transfer' },
  { id: '3', date: '2024-03-12', type: 'Earnings', amount: 450.00, status: 'Completed', reference: 'Trip TR-7712' },
  { id: '4', date: '2024-03-10', type: 'Adjustment', amount: -65.00, status: 'Completed', reference: 'Insurance Fee' },
];

export function HostBusiness() {
  const [activeRange, setActiveRange] = useState<'month' | 'year' | 'all'>('month');

  // Simple custom SVG chart data
  const chartData = [40, 65, 45, 90, 85, 100, 75, 40, 80, 95, 110, 105];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Financial Hub</span>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Business Insights & Payouts</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none">
            Performance <span className="text-emerald-600">Analytics</span>
          </h1>
          <p className="text-gray-500 mt-4 font-medium text-lg">Detailed oversight of your fleet's financial health.</p>
        </motion.div>

        <div className="flex gap-3">
          <button className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
            <Download className="w-4 h-4" /> Export Data
          </button>
          <button className="px-6 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">
            <Wallet className="w-4 h-4" /> Payout Settings
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Net Earnings', value: '$12,450', icon: DollarSign, color: 'emerald', trend: '+12%', sub: 'vs last month' },
          { label: 'Utilisation Rate', value: '78%', icon: TrendingUp, color: 'indigo', trend: '+4%', sub: 'Across fleet' },
          { label: 'Avg. Daily Rate', value: '$112', icon: BarChart3, color: 'amber', trend: 'Stable', sub: 'Last 30 days' },
          { label: 'Active Trips', value: '14', icon: Calendar, color: 'blue', trend: '+2', sub: 'This month' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
          >
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-6 ring-1 ring-${stat.color}-100`}>
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{stat.value}</h3>
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider",
                stat.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
              )}>{stat.trend}</span>
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{stat.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Growth Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-8 bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col"
        >
          <div className="p-10 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Revenue Trajectory</h2>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Projected vs Actual Payouts</p>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-2xl">
              {(['month', 'year', 'all'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setActiveRange(range)}
                  className={cn(
                    "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    activeRange === range ? "bg-white text-gray-900 shadow-xl" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          
          <div className="px-10 pb-10 flex-1">
            <div className="relative h-64 w-full flex items-end justify-between px-4">
              {/* Custom SVG Line Chart */}
              <svg className="absolute inset-0 w-full h-full p-4 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d={`M 0 100 L ${chartData.map((d, i) => `${(i / (chartData.length - 1)) * 100} ${100 - (d / 120) * 100}`).join(' L ')} L 100 100 Z`}
                  fill="url(#chartGradient)"
                />
                <path 
                  d={`M ${chartData.map((d, i) => `${(i / (chartData.length - 1)) * 100} ${100 - (d / 120) * 100}`).join(' L ')}`}
                  fill="none" 
                  stroke="#4f46e5" 
                  strokeWidth="2" 
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Chart Bars (Invisible interaction area) */}
              {chartData.map((d, i) => (
                <div key={i} className="relative group w-full flex flex-col items-center">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(d / 120) * 100}%` }}
                    className="w-1.5 bg-gray-100 rounded-full group-hover:bg-indigo-600 transition-colors"
                  ></motion.div>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-12 bg-gray-900 text-white text-[10px] font-black py-1.5 px-3 rounded-lg pointer-events-none transition-all">
                    ${(d * 100).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-6 px-4">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                <span key={m} className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{m}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-4 bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col"
        >
          <div className="p-10 border-b border-gray-50 bg-gray-50/30">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Ledger</h2>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Recent Activity</p>
          </div>
          
          <div className="divide-y divide-gray-50 overflow-y-auto max-h-[400px]">
            {MOCK_TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="p-6 hover:bg-gray-50/50 transition-all group flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shadow-inner group-hover:shadow-md transition-all",
                    tx.amount > 0 ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400"
                  )}>
                    {tx.amount > 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 leading-none mb-1">{tx.reference}</h4>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn(
                    "text-sm font-black mb-1",
                    tx.amount > 0 ? "text-emerald-600" : "text-gray-900"
                  )}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{tx.status}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 border-t border-gray-50 bg-gray-50/30 mt-auto">
             <button className="w-full py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:shadow-md transition-all flex items-center justify-center gap-2">
                Full Statement <ArrowRight className="w-4 h-4" />
             </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
