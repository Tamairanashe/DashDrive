import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Search,
  Filter,
  Calendar,
  Banknote,
  History,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  PieChart,
  Activity,
  ArrowRight,
  Zap,
  ShieldCheck,
  Clock,
  LayoutDashboard,
  Receipt,
  Building2,
  ArrowUp,
  Terminal,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Card, Button, Badge } from './ui';

// --- Types ---
type FinanceTab = 'overview' | 'transactions' | 'payouts' | 'settings';

// --- Mock Data ---
const FINANCIAL_DATA = {
  overview: {
    grossRevenue: 12458.20,
    netProfit: 8652.45,
    avgOrderValue: 24.50,
    pendingPayout: 1245.80,
    revenueTrend: '+15.4%',
    profitTrend: '+8.2%',
    history: [
      { day: 'Mon', revenue: 1200, expense: 400 },
      { day: 'Tue', revenue: 1500, expense: 500 },
      { day: 'Wed', revenue: 1100, expense: 350 },
      { day: 'Thu', revenue: 1800, expense: 600 },
      { day: 'Fri', revenue: 2200, expense: 750 },
      { day: 'Sat', revenue: 2600, expense: 900 },
      { day: 'Sun', revenue: 1900, expense: 550 }
    ]
  },
  transactions: [
    { id: '#TR-12942', date: 'Mar 01, 2024', customer: 'John D.', total: 45.20, fees: 8.14, net: 37.06, status: 'Paid', method: 'Visa •••• 4242' },
    { id: '#TR-12941', date: 'Mar 01, 2024', customer: 'Sarah K.', total: 23.50, fees: 4.23, net: 19.27, status: 'Pending', method: 'Apple Pay' },
    { id: '#TR-12940', date: 'Feb 29, 2024', customer: 'Mike R.', total: 64.00, fees: 11.52, net: 52.48, status: 'Paid', method: 'MasterCard •••• 5555' },
    { id: '#TR-12939', date: 'Feb 29, 2024', customer: 'Emma W.', total: 12.80, fees: 2.30, net: 10.50, status: 'Paid', method: 'Visa •••• 1111' },
    { id: '#TR-12938', date: 'Feb 28, 2024', customer: 'James L.', total: 89.90, fees: 16.18, net: 73.72, status: 'Paid', method: 'Amex •••• 9999' }
  ],
  payouts: [
    { id: '#PO-8821', date: 'Mar 04, 2024', amount: 1245.80, status: 'Scheduled', bank: 'CHASE •••• 4242' },
    { id: '#PO-8820', date: 'Feb 26, 2024', amount: 980.50, status: 'Completed', bank: 'CHASE •••• 4242' },
    { id: '#PO-8819', date: 'Feb 19, 2024', amount: 1120.00, status: 'Completed', bank: 'CHASE •••• 4242' }
  ]
};

// --- Sub-components ---

const FinancialSync = ({ onComplete }: { onComplete: () => void }) => {
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
            <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Financial Command Core Sync</h2>
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
              { label: 'Processing core authentication', complete: progress > 25 },
              { label: 'Ledger reconciliation active', complete: progress > 50 },
              { label: 'Payout channel sync established', complete: progress > 75 },
              { label: 'Historical trend sync (100%)', complete: progress >= 100 },
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

export const Payments = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FinanceTab>('overview');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <FinancialSync onComplete={() => setIsLoading(false)} />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-zinc-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'transactions', label: 'Transactions', icon: Receipt },
            { id: 'payouts', label: 'Payouts', icon: Banknote },
            { id: 'settings', label: 'Bank Settings', icon: Building2 }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'outline'}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => setActiveTab(tab.id as FinanceTab)}
            >
              <tab.icon size={16} className="mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 font-semibold uppercase tracking-widest">
            <Download size={16} /> EXPORT PDF
          </Button>
          <Badge variant="success" className="font-mono text-[10px] h-9 px-3 flex items-center font-semibold uppercase tracking-widest">BALANCE: $12,458.20</Badge>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="relative overflow-hidden group">
                <h4 className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest shrink-0">Gross Revenue</h4>
                <div className="text-3xl font-semibold text-zinc-900 mt-2">${FINANCIAL_DATA.overview.grossRevenue.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-2">
                  <ArrowUpRight size={14} /> {FINANCIAL_DATA.overview.revenueTrend} <span className="text-zinc-400 font-medium ml-1">vs last month</span>
                </div>
              </Card>
              <Card className="relative overflow-hidden group">
                <h4 className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest shrink-0">Net Profit</h4>
                <div className="text-3xl font-semibold text-zinc-900 mt-2">${FINANCIAL_DATA.overview.netProfit.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-2">
                  <ArrowUpRight size={14} /> {FINANCIAL_DATA.overview.profitTrend} <span className="text-zinc-400 font-medium ml-1 lowercase">net margin: 69%</span>
                </div>
              </Card>
              <Card className="relative overflow-hidden group">
                <h4 className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest shrink-0">Avg Order Value</h4>
                <div className="text-3xl font-semibold text-zinc-900 mt-2">${FINANCIAL_DATA.overview.avgOrderValue.toFixed(2)}</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-red-600 mt-2">
                  <ArrowDownRight size={14} /> -2.4% <span className="text-zinc-400 font-medium ml-1">down from $25.10</span>
                </div>
              </Card>
              <Card className="bg-zinc-900 text-white border-none group">
                <h4 className="text-white/50 text-[10px] font-semibold uppercase tracking-widest shrink-0">Next Payout</h4>
                <div className="text-3xl font-semibold text-white mt-2">${FINANCIAL_DATA.overview.pendingPayout.toLocaleString()}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="info" className="text-[10px] font-semibold uppercase tracking-widest">MAR 04</Badge>
                  <span className="text-[10px] text-white/40 font-medium lowercase">Auto-transfer enabled</span>
                </div>
              </Card>
            </div>

            {/* Revenue & Expense Chart (Visualized with CSS) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card title="Revenue vs. Expense" className="lg:col-span-2">
                <div className="mt-8 flex items-end justify-between h-48 gap-2">
                  {FINANCIAL_DATA.overview.history.map((day) => {
                    const maxVal = 3000;
                    const revHeight = (day.revenue / maxVal) * 100;
                    const expHeight = (day.expense / maxVal) * 100;
                    return (
                      <div key={day.day} className="flex-1 flex flex-col items-center gap-2 group cursor-help relative">
                        <div className="w-full flex justify-center gap-1 items-end h-full">
                          <motion.div
                            className="w-3 bg-zinc-900 rounded-t-sm"
                            initial={{ height: 0 }}
                            animate={{ height: `${revHeight}%` }}
                            transition={{ duration: 1 }}
                          />
                          <motion.div
                            className="w-3 bg-zinc-200 rounded-t-sm"
                            initial={{ height: 0 }}
                            animate={{ height: `${expHeight}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">{day.day}</span>

                        {/* Tooltip */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-900 text-white p-2 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-xl uppercase tracking-widest">
                          <p className="font-semibold">Rev: ${day.revenue}</p>
                          <p className="text-white/50 font-medium">Exp: ${day.expense}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-50 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-zinc-900 rounded-sm" />
                    <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">Gross Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-zinc-200 rounded-sm" />
                    <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">Operating Expenses</span>
                  </div>
                </div>
              </Card>

              <Card title="Fee Attribution">
                <div className="space-y-6 mt-4">
                  {[
                    { label: 'Merchant Net', amount: 8652.45, percent: 69.4, color: 'bg-emerald-500' },
                    { label: 'Platform Fees', amount: 1868.73, percent: 15, color: 'bg-zinc-800' },
                    { label: 'Service Fees', amount: 1245.82, percent: 10, color: 'bg-zinc-400' },
                    { label: 'Transaction Tax', amount: 691.20, percent: 5.6, color: 'bg-zinc-200' }
                  ].map(item => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between items-center text-[11px] font-semibold">
                        <span className="text-zinc-500 uppercase tracking-widest">{item.label}</span>
                        <span className="text-zinc-900">${item.amount.toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-50 rounded-full overflow-hidden">
                        <motion.div
                          className={cn("h-full rounded-full", item.color)}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percent}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                      <div className="text-[9px] text-zinc-400 text-right">{item.percent}% of gross</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-50">
                  <Button variant="ghost" className="w-full text-[10px] font-semibold uppercase tracking-widest text-zinc-400">DETAILED FEE AUDIT</Button>
                </div>
              </Card>
            </div>

            {/* Recent Transactions List */}
            <Card title="Recent Ledger Entries" headerAction={<Button variant="ghost" size="sm" onClick={() => setActiveTab('transactions')}>VIEW ALL</Button>}>
              <div className="overflow-x-auto -mx-6">
                <table className="w-full text-left">
                  <thead className="bg-zinc-50 border-y border-zinc-100 font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                    <tr>
                      <th className="px-6 py-4">Transaction ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Net</th>
                      <th className="px-6 py-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 font-medium text-xs">
                    {FINANCIAL_DATA.transactions.slice(0, 3).map((tx) => (
                      <tr key={tx.id} className="hover:bg-zinc-50/50 transition-colors cursor-pointer group">
                        <td className="px-6 py-4 font-semibold text-zinc-900">#{tx.id}</td>
                        <td className="px-6 py-4 text-zinc-600 font-medium">{tx.customer}</td>
                        <td className="px-6 py-4 text-zinc-600 font-medium">${tx.total.toFixed(2)}</td>
                        <td className="px-6 py-4 font-semibold text-emerald-600 tracking-tight">${tx.net.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant={tx.status === 'Paid' ? 'success' : 'warning'} className="text-[8px] font-semibold uppercase tracking-widest">{tx.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'transactions' && (
          <motion.div
            key="transactions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="neutral" className="h-9 px-4 font-semibold uppercase tracking-widest">TOTAL TRANSACTIONS: 1,420</Badge>
                <Button variant="outline" size="sm" className="h-9 font-semibold uppercase tracking-widest"><Filter size={14} className="mr-2" /> PERIOD</Button>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                  <input type="text" placeholder="Search ID, customer..." className="pl-9 pr-4 py-2 text-xs border border-zinc-200 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all" />
                </div>
                <Button variant="primary" size="sm" className="h-9 font-semibold uppercase tracking-widest gap-2"><Download size={14} /> EXPORT CSV</Button>
              </div>
            </div>

            <Card className="p-0 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 border-b border-zinc-100 font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4 text-right">Total</th>
                    <th className="px-6 py-4 text-right">Fees</th>
                    <th className="px-6 py-4 text-right">Net</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-medium text-xs">
                  {FINANCIAL_DATA.transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-6 py-4 text-zinc-400 font-medium text-[10px] uppercase tracking-tight">{tx.date}</td>
                      <td className="px-6 py-4 font-semibold text-zinc-900">#{tx.id}</td>
                      <td className="px-6 py-4 text-zinc-600 font-medium">{tx.customer}</td>
                      <td className="px-6 py-4 text-zinc-400 flex items-center gap-1.5 uppercase text-[9px] font-semibold tracking-widest">
                        <CreditCard size={12} /> {tx.method}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-zinc-900">${tx.total.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right text-red-400 font-medium">-${tx.fees.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-semibold text-emerald-600 tracking-tight">${tx.net.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={tx.status === 'Paid' ? 'success' : 'warning'} className="text-[8px] font-semibold uppercase tracking-widest">{tx.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="text-zinc-300 group-hover:text-zinc-900 transition-colors">
                          <ChevronRight size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </motion.div>
        )}

        {activeTab === 'payouts' && (
          <motion.div
            key="payouts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-zinc-900 text-white border-none relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Banknote size={120} />
                </div>
                <div className="relative z-10">
                  <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-1">Expected Next Payout</p>
                  <p className="text-4xl font-semibold text-white tracking-tight">$1,245.80</p>
                  <div className="mt-6 flex items-center gap-2">
                    <Badge variant="info" className="font-semibold uppercase tracking-widest">ETA: MAR 04, 2024</Badge>
                    <Button size="sm" className="bg-white text-zinc-900 hover:bg-zinc-100 font-semibold text-[10px] py-1 px-4 uppercase tracking-widest">VIEW HOLDINGS</Button>
                  </div>
                </div>
              </Card>

              <Card title="Payment Gateway">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-900">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 uppercase tracking-tight">CHASE BUSINESS</h4>
                    <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">REF: CH-4242-SM-01</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-zinc-400 uppercase tracking-widest">Status:</span>
                    <span className="text-emerald-600 flex items-center gap-1 uppercase tracking-widest"><CheckCircle2 size={12} /> VERIFIED & ACTIVE</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-zinc-400 uppercase tracking-widest">Method:</span>
                    <span className="text-zinc-900 uppercase tracking-widest">INSTANT ACH</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-6 text-[10px] font-semibold h-9 uppercase tracking-widest">UPDATE BANK DETAILS</Button>
              </Card>

              <Card title="Auto-Payout Rules">
                <div className="space-y-4">
                  <div className="p-3 bg-zinc-50 rounded-lg flex items-center justify-between border border-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-zinc-700">Daily Transfers</span>
                    </div>
                    <Badge variant="success" className="text-[8px]">ACTIVE</Badge>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-lg flex items-center justify-between border border-zinc-100 opacity-50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-zinc-300" />
                      <span className="text-xs font-semibold text-zinc-700 uppercase tracking-tight">Minimum Threshold</span>
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-400 tracking-widest">$10.00</span>
                  </div>
                </div>
                <Button variant="ghost" className="w-full mt-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">CONFIGURE RULES</Button>
              </Card>
            </div>

            <Card title="Payout History">
              <div className="overflow-x-auto -mx-6">
                <table className="w-full text-left">
                  <thead className="bg-zinc-50 border-y border-zinc-100 font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                    <tr>
                      <th className="px-6 py-4">Transfer Date</th>
                      <th className="px-6 py-4">Transfer ID</th>
                      <th className="px-6 py-4">Bank Destination</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                      <th className="px-6 py-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 font-medium text-xs">
                    {FINANCIAL_DATA.payouts.map((po) => (
                      <tr key={po.id} className="hover:bg-zinc-50/50 transition-colors cursor-pointer group">
                        <td className="px-6 py-4 text-zinc-500 font-medium text-[10px] uppercase tracking-tight">{po.date}</td>
                        <td className="px-6 py-4 font-semibold text-zinc-900">#{po.id}</td>
                        <td className="px-6 py-4 text-zinc-400 flex items-center gap-1.5 uppercase text-[9px] font-semibold tracking-widest">
                          <Building2 size={12} /> {po.bank}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-zinc-900 tracking-tight">${po.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant={po.status === 'Completed' ? 'success' : 'info'} className="text-[8px] font-semibold uppercase tracking-widest">{po.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-2xl mx-auto py-8"
          >
            <Card title="Financial Settings">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <ShieldCheck size={14} /> SECURITY & TAXES
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 uppercase tracking-tight">Tax Identification Number</p>
                        <p className="text-[10px] text-zinc-500 font-medium font-mono">XX-XXXX942</p>
                      </div>
                      <Button variant="outline" size="sm" className="font-semibold text-[10px] uppercase tracking-widest">VERIFY</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 uppercase tracking-tight">Billing Address</p>
                        <p className="text-[10px] text-zinc-500 font-medium">123 Market St, San Francisco, CA 94103</p>
                      </div>
                      <Button variant="outline" size="sm" className="font-semibold text-[10px] uppercase tracking-widest">EDIT</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-zinc-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <Building2 size={14} /> BANK ACCOUNTS
                  </h4>
                  <div className="p-6 border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-zinc-50/50 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                      <Building2 size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-zinc-900">Add New Destination</p>
                      <p className="text-[10px] text-zinc-500 font-medium mt-1">Connect a bank account for direct deposits</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-zinc-100 flex gap-3">
                  <Button variant="primary" className="flex-1 font-semibold uppercase tracking-widest">SAVE ALL CHANGES</Button>
                  <Button variant="outline" className="flex-1 font-semibold uppercase tracking-widest">CANCEL</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payments;
