import React from 'react';
import { FileText, Download, Calendar, Search, Filter, TrendingUp, BarChart, PieChart as PieIcon, ArrowRight } from 'lucide-react';
import { cn } from '../types';

const reports = [
    { title: 'Monthly Financial Statement', category: 'Financial', frequency: 'Monthly', lastGenerated: '2026-02-01', size: '2.4 MB' },
    { title: 'Daily Operational Health', category: 'Operations', frequency: 'Daily', lastGenerated: '2026-02-27', size: '1.2 MB' },
    { title: 'Store Ranking Benchmark', category: 'Growth', frequency: 'Weekly', lastGenerated: '2026-02-24', size: '3.8 MB' },
    { title: 'Tax & Compliance Audit', category: 'Financial', frequency: 'Yearly', lastGenerated: '2026-01-15', size: '8.1 MB' },
];

const Reports = () => {
    return (
        <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">
            <div className="flex items-end justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-black tracking-tighter">Knowledge Center</h1>
                    <p className="text-lg text-gray-400 font-medium">Export and schedule advanced analytical reports.</p>
                </div>
                <button className="bg-black text-white px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg">
                    <Calendar size={18} />
                    Schedule Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Financials', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Operations', icon: BarChart, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Growth', icon: PieIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Audit', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-100 transition-all cursor-pointer group">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors", item.bg, item.color)}>
                            <item.icon size={24} />
                        </div>
                        <h3 className="text-sm font-black text-black uppercase tracking-widest">{item.label}</h3>
                        <p className="text-xs text-gray-400 font-bold mt-1">12 Available Reports</p>
                        <ArrowRight size={16} className="mt-4 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="text-xl font-black text-black">Recent Generations</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative w-64">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search reports..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            />
                        </div>
                        <button className="text-xs font-black text-emerald-600 hover:underline">Clear History</button>
                    </div>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-gray-100 bg-gray-50/50">
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Report Title</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Frequency</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Run</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {reports.map((report, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <FileText size={18} className="text-emerald-600" />
                                        <span className="text-sm font-black text-black">{report.title}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{report.category}</span>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-900 rounded-md text-[10px] font-black uppercase tracking-tight">
                                        {report.frequency}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="text-xs font-black text-black">{report.lastGenerated}</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{report.size}</div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button className="bg-white border border-gray-200 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all ml-auto">
                                        <Download size={14} />
                                        Download
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Reports;
