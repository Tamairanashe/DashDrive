import React from 'react';
import {
 ShieldCheck,
 CreditCard,
 Smartphone,
 QrCode,
 ToggleRight,
 Settings,
 AlertCircle,
 TrendingUp,
 Activity,
 ArrowRight,
 Zap,
 Globe,
 Trash2,
 Banknote
} from 'lucide-react';
import { cn } from '../utils';

export const CashlessPayments: React.FC = () => {
 const gateways = [
 { name: 'Stripe (International)', status: 'Online', uptime: '99.99%', latency: '120ms', failRate: '0.02%', methods: ['Visa', 'Mastercard', 'Apple Pay'] },
 { name: 'Adyen (Global)', status: 'Online', uptime: '99.98%', latency: '145ms', failRate: '0.04%', methods: ['Google Pay', 'AMEX', 'Discover'] },
 { name: 'Local Bank Transfer (Direct)', status: 'Maintenace', uptime: '94.2%', latency: '2s', failRate: '1.2%', methods: ['Direct Debit'] },
 ];

 const paymentMethods = [
 { name: 'Dash Wallet', type: 'Internal', active: true, usage: '42.5%', limit: '$5,000' },
 { name: 'Credit / Debit Card', type: 'Gateway', active: true, usage: '38.0%', limit: '$2,500' },
 { name: 'Apple Pay', type: 'Digital Wallet', active: true, usage: '8.2%', limit: '$10,000' },
 { name: 'Google Pay', type: 'Digital Wallet', active: true, usage: '7.4%', limit: '$10,000' },
 { name: 'Cash on Delivery', type: 'Physical', active: true, usage: '1.5%', limit: '$100' },
 { name: 'PayLater (BNPL)', type: 'Credit', active: false, usage: '2.4%', limit: '$500' },
 ];

 return (
 <div className="space-y-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Payment Methods &amp; Gateways</h2>
 <p className="text-slate-500 text-sm font-medium">Configure global payment rules, limits, and gateway integrations.</p>
 </div>
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform">
 <Zap className="w-4 h-4 text-primary" />
 Add New Gateway
 </button>
 </div>
 </div>

 {/* Gateway Status Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {gateways.map((gw) => (
 <div key={gw.name} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
 <div className="relative z-10">
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
 <Globe className="w-5 h-5" />
 </div>
 <h4 className="text-sm font-black text-slate-900">{gw.name}</h4>
 </div>
 <div className={cn(
 "px-2 py-1 rounded-lg text-[10px] font-black ",
 gw.status === 'Online' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
 )}>
 {gw.status}
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4 mb-6">
 <div>
 <p className="text-[10px] font-bold text-slate-400 ">Uptime</p>
 <p className="text-sm font-black text-slate-900">{gw.uptime}</p>
 </div>
 <div>
 <p className="text-[10px] font-bold text-slate-400 ">Latency</p>
 <p className="text-sm font-black text-slate-900">{gw.latency}</p>
 </div>
 </div>

 <div className="space-y-2">
 <p className="text-[10px] font-bold text-slate-400 ">Accepted Methods</p>
 <div className="flex flex-wrap gap-2">
 {gw.methods.map(m => (
 <span key={m} className="px-2 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-600">{m}</span>
 ))}
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* Payment Method Control Panel */}
 <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
 <div className="p-8 border-b border-slate-50 flex justify-between items-center">
 <h3 className="text-lg font-black text-slate-900 tracking-tight">Super App Payment Rules</h3>
 <button className="text-xs font-bold text-primary hover:underline">Reset to Default</button>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Method</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Usage %</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Trans. Limit</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Status</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em] text-right">Settings</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {paymentMethods.map((pm) => (
 <tr key={pm.name} className="group hover:bg-slate-50/50 transition-all duration-300">
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
 {pm.type === 'Internal' && <ShieldCheck className="w-5 h-5" />}
 {pm.type === 'Gateway' && <CreditCard className="w-5 h-5" />}
 {pm.type === 'Digital Wallet' && <Smartphone className="w-5 h-5" />}
 {pm.type === 'Physical' && <Banknote className="w-5 h-5" />}
 {pm.type === 'Credit' && <Zap className="w-5 h-5" />}
 </div>
 <div>
 <p className="text-sm font-black text-slate-900">{pm.name}</p>
 <p className="text-[10px] font-bold text-slate-400 ">{pm.type}</p>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <span className="text-sm font-bold text-slate-700 w-10">{pm.usage}</span>
 <div className="h-1.5 flex-1 bg-slate-50 rounded-full overflow-hidden max-w-[100px]">
 <div className="h-full bg-primary rounded-full" style={{ width: pm.usage }} />
 </div>
 </div>
 </td>
 <td className="px-8 py-6 text-sm font-black text-slate-900">
 {pm.limit}
 </td>
 <td className="px-8 py-6">
 <button className={cn(
 "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
 pm.active ? 'bg-primary' : 'bg-slate-200'
 )}>
 <span className={cn(
 "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
 pm.active ? 'translate-x-6' : 'translate-x-1'
 )} />
 </button>
 </td>
 <td className="px-8 py-6 text-right">
 <div className="flex items-center justify-end gap-2">
 <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
 <Settings className="w-5 h-5" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Security Info Card */}
 <div className="bg-slate-900 p-10 rounded-[48px] text-white relative overflow-hidden flex flex-col lg:flex-row items-center gap-10 shadow-2xl shadow-slate-900/30">
 <div className="lg:w-1/3 relative">
 <div className="w-32 h-32 rounded-[40px] bg-primary/20 flex items-center justify-center backdrop-blur-3xl border border-white/10 mx-auto lg:mx-0">
 <ShieldCheck className="w-16 h-16 text-primary" />
 </div>
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/30 blur-[60px] rounded-full -z-10" />
 </div>
 <div className="lg:w-2/3 space-y-4 text-center lg:text-left">
 <h3 className="text-2xl font-black tracking-tight italic">PCI-DSS Tier 1 Compliance</h3>
 <p className="text-lg opacity-60 font-medium leading-relaxed">
 DashDrive Fintech servers are fully audited for maximum security. All card data is tokenized via Stripe &amp; Adyen.
 Gateway switches automatically trigger if latency exceeds 500ms for more than 3 consecutive requests.
 </p>
 <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
 <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
 <Activity className="w-4 h-4 text-emerald-400" />
 <span className="text-xs font-bold text-emerald-400">Low Fail-Rate Mode Active</span>
 </div>
 <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
 <Globe className="w-4 h-4 text-blue-400" />
 <span className="text-xs font-bold ">Global CDN Active</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};
