import React, { useState, useEffect } from 'react';
import {
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Calendar,
    DollarSign,
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../types';
import { api } from '../api';

export default function Payments() {
    const [summary, setSummary] = useState<any>(null);
    const [payouts, setPayouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.payments.getSummary(),
            api.payments.getPayouts()
        ]).then(([sumRes, payRes]) => {
            setSummary(sumRes.data);
            setPayouts(payRes.data);
        }).catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const stats = [
        { label: 'Pending Balance', value: summary ? `$${summary.pending_balance.toFixed(2)}` : '$0.00', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Next Payout', value: 'Mar 5, 2026', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'YTD Earnings', value: '$42,850', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="p-8 pb-20 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
                                <CreditCard size={22} />
                            </div>
                            <h1 className="text-3xl font-black tracking-tightest">Payments & Financials</h1>
                        </div>
                        <p className="text-gray-500 font-medium tracking-tight">Track your earnings, manage payouts, and download tax invoices.</p>
                    </div>

                    <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-gray-200">
                        <Download size={20} />
                        Export Statements
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                                    <stat.icon className={stat.color} size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-black">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Payouts */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-xl font-black tracking-tighter">Payout History</h2>
                            <button className="text-xs font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700">View All</button>
                        </div>

                        <div className="divide-y divide-gray-50">
                            {payouts.length > 0 ? payouts.map((payout: any) => (
                                <div key={payout.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center",
                                            payout.status === 'paid' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                        )}>
                                            {payout.status === 'paid' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-black tracking-tight">{new Date(payout.payout_date).toLocaleDateString()}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Period: {new Date(payout.period_start).toLocaleDateString()} - {new Date(payout.period_end).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-black">${Number(payout.amount).toFixed(2)}</div>
                                        <div className={cn(
                                            "text-[10px] font-black uppercase tracking-widest",
                                            payout.status === 'paid' ? "text-emerald-600" : "text-amber-600"
                                        )}>{payout.status}</div>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-200">
                                        <Calendar size={32} />
                                    </div>
                                    <p className="text-sm font-bold text-gray-400">No payout history found for this period.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tax & Invoices */}
                    <div className="space-y-6">
                        <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl -mr-10 -mt-10"></div>
                            <h3 className="text-lg font-black tracking-tighter mb-4 relative z-10">Instant Payouts</h3>
                            <p className="text-xs text-emerald-100/70 font-medium mb-6 relative z-10 leading-relaxed">
                                Need your funds early? Get your pending balance transferred to your bank account in minutes for a small fee.
                            </p>
                            <button className="w-full py-3 bg-white text-emerald-900 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-50 transition-all relative z-10">
                                Request Early Payout
                            </button>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-black tracking-tighter mb-6 flex items-center gap-2">
                                <FileText size={20} />
                                Tax Invoices
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { month: 'January 2026', date: 'Feb 01, 2026' },
                                    { month: 'December 2025', date: 'Jan 01, 2026' },
                                    { month: 'November 2025', date: 'Dec 01, 2025' },
                                ].map((invoice, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                                        <div>
                                            <div className="text-xs font-black">{invoice.month}</div>
                                            <div className="text-[10px] font-bold text-gray-400">{invoice.date}</div>
                                        </div>
                                        <Download size={16} className="text-gray-400 hover:text-black" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
