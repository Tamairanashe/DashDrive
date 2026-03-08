import {
    TrendingUp, Wallet, ArrowUpRight,
    Calendar, Info, ArrowRight, Download, CreditCard, Banknote,
    AlertCircle
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';
import { cn } from '../utils/cn';
import { useState } from 'react';

const revenueData = [
    { name: 'Mon', gross: 2400, net: 2040 },
    { name: 'Tue', gross: 1398, net: 1188 },
    { name: 'Wed', gross: 9800, net: 8330 },
    { name: 'Thu', gross: 3908, net: 3321 },
    { name: 'Fri', gross: 4800, net: 4080 },
    { name: 'Sat', gross: 3800, net: 3230 },
    { name: 'Sun', gross: 4300, net: 3655 },
];

const transactionHistory = [
    { id: '#TR-82734', date: 'Feb 21, 2026', orderId: '#GR-284730', customer: 'Darrell Steward', gross: 153.50, fee: 23.02, net: 130.48, status: 'Pending' },
    { id: '#TR-82733', date: 'Feb 21, 2026', orderId: '#GR-284640', customer: 'Esther Howard', gross: 42.00, fee: 6.30, net: 35.70, status: 'Completed' },
    { id: '#TR-82732', date: 'Feb 20, 2026', orderId: '#GR-284530', customer: 'Dianne Russell', gross: 135.00, fee: 20.25, net: 114.75, status: 'Completed' },
    { id: '#TR-82731', date: 'Feb 20, 2026', orderId: '#GR-284430', customer: 'Arlene McCoy', gross: 89.20, fee: 13.38, net: 75.82, status: 'Completed' },
];

const payoutHistory = [
    { id: '#PY-1002', date: 'Feb 15, 2026', amount: 2430.50, method: 'Bank Transfer (**** 4291)', status: 'Success' },
    { id: '#PY-1001', date: 'Feb 01, 2026', amount: 3120.00, method: 'Bank Transfer (**** 4291)', status: 'Success' },
    { id: '#PY-1000', date: 'Jan 15, 2026', amount: 1890.75, method: 'Bank Transfer (**** 4291)', status: 'Success' },
];

interface FinancialsProps {
    token: string | null;
    merchant: any;
}

export function Financials({ token, merchant }: FinancialsProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isRequesting, setIsRequesting] = useState(false);
    const [balance, setBalance] = useState<number>(0);
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);

    // Simulated fetch of live financial data
    useState(() => {
        setTimeout(() => {
            setBalance(1452.80);
            setIsLoading(false);
        }, 1200);
    });

    const handlePayoutRequest = async () => {
        if (balance <= 0) return;
        setIsRequesting(true);
        // Simulate API delay
        setTimeout(() => {
            setBalance(0);
            setIsRequesting(false);
            setShowSuccessMsg(true);
            setTimeout(() => setShowSuccessMsg(false), 3000);
        }, 1500);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-24">
                <div className="size-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Top Banner: Next Payout */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[32px] p-8 text-white shadow-xl shadow-blue-100/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 opacity-80">
                            <Calendar size={16} />
                            <span className="text-xs font-black uppercase tracking-widest">Next Scheduled Payout</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter italic">Feb 28, 2026</h2>
                        <p className="text-sm font-medium opacity-70">Estimated amount: <span className="font-black text-white">${(balance + 3368.65).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></p>
                    </div>
                    
                    <button 
                        onClick={handlePayoutRequest}
                        disabled={isRequesting || balance <= 0}
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex items-center gap-4 transition-all duration-300 active:scale-95 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="absolute inset-0 bg-white/5 w-0 group-hover:w-full transition-all duration-500 ease-out" />
                        <div className="p-3 bg-white text-blue-600 rounded-xl relative z-10">
                            <Banknote size={24} />
                        </div>
                        <div className="text-left relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                {isRequesting ? 'Processing...' : 'Available Balance'}
                            </p>
                            <p className="text-xl font-black tracking-tight">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <ArrowRight className="ml-4 opacity-40 group-hover:translate-x-1 group-hover:opacity-100 transition-all relative z-10" />
                    </button>
                </div>
            </div>
            
            {showSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-6 py-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <div className="size-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <ArrowUpRight size={16} className="text-emerald-600" />
                    </div>
                    <div>
                        <p className="font-bold text-sm">Payout Requested Successfully!</p>
                        <p className="text-xs opacity-80">Funds will arrive in your linked bank account within 1-3 business days.</p>
                    </div>
                </div>
            )}

            {/* Primary Financial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+14.2%</span>
                    </div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Gross Revenue</p>
                    <p className="text-3xl font-black text-gray-800 tracking-tighter mt-1">$24,842.00</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-4">Calculated from 542 orders this month</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group overflow-hidden">
                    <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-colors duration-500" />
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                            <ArrowUpRight size={20} />
                        </div>
                        <div className="group/info">
                            <Info size={16} className="text-gray-300 pointer-events-none" />
                            <div className="absolute right-6 top-14 bg-gray-900 text-white text-[10px] p-3 rounded-xl opacity-0 group-hover/info:opacity-100 transition-opacity z-20 w-48 font-medium">
                                Platform fee (15%) + processing fees.
                            </div>
                        </div>
                    </div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Platform Fees</p>
                    <p className="text-3xl font-black text-gray-800 tracking-tighter mt-1">-$3,726.30</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-4">15% Commission (DashDrive Marketplace)</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm ring-2 ring-blue-600/5 ring-inset">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Wallet size={20} />
                        </div>
                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">Net Profit</span>
                    </div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Net Payouts</p>
                    <p className="text-3xl font-black text-blue-600 tracking-tighter mt-1">$21,115.70</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-4">Your final earnings after all deductions</p>
                </div>
            </div>

            {/* Main Revenue Chart */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-xl font-black text-gray-800 tracking-tight">Revenue Trends</h3>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">Comparing gross sales vs net earnings</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-6 mr-6">
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-blue-500" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gross</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-emerald-500" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Net</span>
                            </div>
                        </div>
                        <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest outline-none cursor-pointer">
                            <option>Last 7 Days</option>
                            <option>This Month</option>
                        </select>
                    </div>
                </div>
                <div className="h-[360px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    padding: '12px'
                                }}
                                labelStyle={{ fontWeight: 900, color: '#1e293b', marginBottom: '8px', fontSize: '12px' }}
                            />
                            <Area type="monotone" dataKey="gross" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorGross)" />
                            <Area type="monotone" dataKey="net" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorNet)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Transaction Ledger */}
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-gray-800 tracking-tight">Recent Transactions</h3>
                            <button className="text-xs font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest">Download CSV</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b border-gray-50">
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Fee</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Net</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {transactionHistory.map((tr) => (
                                        <tr key={tr.id} className="group hover:bg-gray-50/50 transition-all">
                                            <td className="py-4">
                                                <p className="text-sm font-bold text-gray-800 leading-none">{tr.orderId}</p>
                                                <p className="text-[10px] text-gray-400 mt-1.5 font-medium">{tr.date}</p>
                                            </td>
                                            <td className="py-4 text-right">
                                                <p className="text-xs font-medium text-red-500 leading-none">-${tr.fee.toFixed(2)}</p>
                                            </td>
                                            <td className="py-4 text-right">
                                                <p className="text-sm font-black text-gray-800 leading-none">${tr.net.toFixed(2)}</p>
                                                <span className={cn(
                                                    "text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md mt-1.5 inline-block",
                                                    tr.status === 'Completed' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                                                )}>
                                                    {tr.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Payout History */}
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-gray-800 tracking-tight">Payout History</h3>
                            <div className="size-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                <CreditCard size={16} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {payoutHistory.map((p) => (
                                <div key={p.id} className="p-5 rounded-3xl bg-gray-50/50 border border-gray-100/50 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all cursor-default">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-200/50 shrink-0">
                                            <Download size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-800 tracking-tight uppercase">{p.id}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">{p.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-base font-black text-gray-800 tracking-tighter">${p.amount.toLocaleString()}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">{p.method}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 bg-blue-50/50 rounded-3xl p-6 border border-blue-50 flex items-start gap-4">
                            <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={18} />
                            <div>
                                <p className="text-xs font-bold text-blue-900 leading-tight">Payout Verification</p>
                                <p className="text-[10px] text-blue-700/70 mt-1 leading-normal font-medium">Standard payouts take 3-5 business days to appear in your bank account once "Success" is triggered.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
