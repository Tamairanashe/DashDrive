import React, { useState } from 'react';
import {
 User, Phone, Mail, CheckCircle2, XCircle,
 TrendingUp, Star, Download, FileText,
 Search, Filter, ChevronRight, ArrowLeft,
 CreditCard, History, ShieldCheck, AlertCircle,
 Eye, MoreVertical, Trash2, Activity, Edit3,
 Ban, Bike, Car, Settings, Wallet, DollarSign,
 Clock, PieChart, Banknote, ArrowUpRight,
 Crown, Award, Diamond, Target, Gift, Zap, Percent
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

interface DriverDetailsProps {
 driverId: string;
 onBack: () => void;
}

export const DriverDetails: React.FC<DriverDetailsProps> = ({ driverId, onBack }) => {
 const [activeTab, setActiveTab] = useState('Overview');
 const [reviewTab, setReviewTab] = useState('From Customer');
 const [isActive, setIsActive] = useState(true);

 const driver = {
 id: driverId,
 name: 'Devid Jack',
 phone: '+1 555-****-0101',
 email: 'devid.jack@example.com',
 avatar: `https://picsum.photos/seed/${driverId}/200/200`,
 tier: 'Platinum',
 points: 16250,
 peakPoints: 12450,
 nextTierPoints: 25500,
 acceptanceRate: 98.5,
 rating: 5.0,
 services: ['Ride Request', 'Parcel (Capacity Unlimited)'],
 stats: {
 avgEarning: 96.79,
 positiveReview: 100,
 successRate: 85.71,
 cancellationRate: 14.29,
 idleHourRate: 0,
 completedTrips: 6,
 cancelTrips: 1,
 lowestPrice: 15.00,
 highestPrice: 120.00
 },
 wallet: {
 collectableCash: 0.00,
 pendingWithdraw: 100.00,
 alreadyWithdrawn: 0.00,
 withdrawableAmount: 36.11,
 totalEarning: 466.48
 },
 vehicle: {
 image: 'https://picsum.photos/seed/bike/400/300',
 ownership: 'Owner driver',
 category: 'Bike',
 brand: 'Honda',
 model: 'R15',
 tripRate: 100,
 parcelRate: 100,
 specs: {
 vin: 'VIN1234567890',
 licensePlate: 'ABC-1234',
 fuelType: 'Petrol',
 engineType: '150cc',
 licenseExpiry: '2025-12-31',
 seatCapacity: '2',
 transmission: 'Manual',
 hatchBag: 'None'
 }
 }
 };

 const driverTransactions = [
 { id: 'TXN-7721-1001', type: 'Received balance', to: 'Devid Jack', debit: 0, credit: 450.00, balance: 450.00, date: '2024-02-20 10:00' },
 { id: 'TXN-7721-1002', type: 'Payable', to: 'System', debit: 20.00, credit: 0, balance: 430.00, date: '2024-02-21 14:30' },
 { id: 'TXN-7721-1003', type: 'Withdraw', to: 'Devid Jack', debit: 100.00, credit: 0, balance: 330.00, date: '2024-02-22 09:15' },
 ];

 const driverTrips = [
 { id: 'TRP-1001', date: '2024-02-22 14:30', customer: 'Test User', cost: 25.00, discount: 5.00, status: 'Completed', payment: 'Paid' },
 { id: 'TRP-1002', date: '2024-02-21 09:15', customer: 'Jane Doe', cost: 18.50, discount: 0.00, status: 'Completed', payment: 'Paid' },
 { id: 'TRP-1003', date: '2024-02-20 18:45', customer: 'John Smith', cost: 42.00, discount: 10.00, status: 'Cancelled', payment: 'Unpaid' },
 ];

 const handleExportTransactions = () => {
 const headers = ['Transaction ID', 'Type', 'To', 'Debit', 'Credit', 'Balance', 'Date'];
 const csvContent = [
 headers.join(','),
 ...driverTransactions.map(txn => [
 txn.id,
 txn.type,
 txn.to,
 txn.debit,
 txn.credit,
 txn.balance,
 txn.date
 ].join(','))
 ].join('\n');

 const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
 const link = document.createElement('a');
 const url = URL.createObjectURL(blob);
 link.setAttribute('href', url);
 link.setAttribute('download', `driver_${driverId}_transactions.csv`);
 link.style.visibility = 'hidden';
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 };

 const handleExportTrips = () => {
 const headers = ['Trip ID', 'Date', 'Customer', 'Cost', 'Status'];
 const csvContent = [
 headers.join(','),
 ...driverTrips.map(trip => [
 trip.id,
 trip.date,
 trip.customer,
 trip.cost,
 trip.status
 ].join(','))
 ].join('\n');

 const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
 const link = document.createElement('a');
 const url = URL.createObjectURL(blob);
 link.setAttribute('href', url);
 link.setAttribute('download', `driver_${driverId}_trips.csv`);
 link.style.visibility = 'hidden';
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 };

 return (
 <div className="flex flex-col h-full space-y-6">
 {/* Top Header: ID & Actions */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="flex items-center gap-4">
 <button
 onClick={onBack}
 className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
 >
 <ArrowLeft className="w-5 h-5" />
 </button>
 <div>
 <h2 className="text-xl font-bold text-slate-800">Driver #{driver.id}</h2>
 <p className="text-sm text-slate-500">Operational profile & performance dashboard</p>
 </div>
 </div>
 <div className="flex items-center gap-2 flex-wrap">
 <button className="p-2 bg-white border border-slate-100 rounded-xl text-slate-500 hover:text-red-500 transition-colors shadow-sm">
 <Trash2 className="w-4 h-4" />
 </button>
 <button className="p-2 bg-white border border-slate-100 rounded-xl text-slate-500 hover:text-primary transition-colors shadow-sm">
 <Activity className="w-4 h-4" />
 </button>
 <div className="flex items-center gap-2 bg-white border border-slate-100 px-3 py-1.5 rounded-xl shadow-sm">
 <span className="text-[10px] font-bold text-slate-400 ">Status</span>
 <button
 onClick={() => setIsActive(!isActive)}
 className={cn(
 "w-10 h-5 rounded-full relative transition-colors",
 isActive ? "bg-primary" : "bg-slate-200"
 )}
 >
 <div className={cn(
 "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
 isActive ? "right-1" : "left-1"
 )} />
 </button>
 </div>
 <button className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all">
 Suspend Driver
 </button>
 <button className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-sm flex items-center gap-2">
 <Edit3 className="w-3.5 h-3.5" /> Edit
 </button>
 </div>
 </div>

 {/* Row 1: Info & Analytics */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Driver Info Card */}
 <div className="bg-white p-6 rounded-[24px] shadow-soft border border-slate-100 flex flex-col items-center text-center space-y-4">
 <div className="relative">
 <div className="w-24 h-24 rounded-full border-4 border-slate-50 overflow-hidden shadow-inner">
 <img src={driver.avatar} alt={driver.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
 </div>
 <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full border-4 border-white flex items-center justify-center">
 <ShieldCheck className="w-4 h-4 text-white" />
 </div>
 </div>
 <div>
 <h3 className="text-xl font-bold text-slate-800">{driver.name}</h3>
 <div className="flex items-center justify-center gap-2 mt-1">
 <span className={cn(
 "px-2 py-0.5 rounded text-[10px] font-bold ",
 driver.tier === 'Gold' ? "bg-yellow-50 text-yellow-600 border border-yellow-200" : "bg-slate-100 text-slate-600"
 )}>{driver.tier} Tier</span>
 <div className="flex items-center gap-1 text-yellow-400">
 <Star className="w-3 h-3 fill-yellow-400" />
 <span className="text-xs font-bold text-slate-700">{driver.rating}</span>
 </div>
 </div>
 </div>
 <div className="w-full pt-4 border-t border-slate-50 space-y-3">
 <div className="flex items-center gap-3 text-slate-500">
 <Phone className="w-4 h-4" />
 <span className="text-xs font-medium">{driver.phone}</span>
 </div>
 <div className="flex items-center gap-3 text-slate-500">
 <Mail className="w-4 h-4" />
 <span className="text-xs font-medium">{driver.email}</span>
 </div>
 <div className="flex flex-wrap gap-2 pt-2">
 {driver.services.map(s => (
 <span key={s} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-bold ">{s}</span>
 ))}
 </div>
 </div>
 </div>

 {/* Analytics Card */}
 <div className="lg:col-span-2 bg-white p-6 rounded-[24px] shadow-soft border border-slate-100">
 <h3 className="text-sm font-bold text-slate-800 mb-6">Driver Rate Info</h3>
 <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
 {[
 { label: 'Avg Earning', value: driver.stats.avgEarning, color: 'text-primary' },
 { label: 'Positive Review', value: driver.stats.positiveReview, color: 'text-emerald-500' },
 { label: 'Success Rate', value: driver.stats.successRate, color: 'text-blue-500' },
 { label: 'Cancellation', value: driver.stats.cancellationRate, color: 'text-red-500' },
 { label: 'Idle Hour', value: driver.stats.idleHourRate, color: 'text-amber-500' },
 ].map((stat) => (
 <div key={stat.label} className="flex flex-col items-center gap-3">
 <div className="relative w-16 h-16">
 <svg className="w-full h-full" viewBox="0 0 36 36">
 <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
 <path className={stat.color} strokeWidth="3" strokeDasharray={`${stat.value}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
 </svg>
 <div className="absolute inset-0 flex items-center justify-center">
 <span className="text-[10px] font-bold text-slate-800">{stat.value}%</span>
 </div>
 </div>
 <span className="text-[9px] font-bold text-slate-400 text-center leading-tight">{stat.label}</span>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Row 2: Wallet Info Section */}
 <div className="bg-white p-6 rounded-[24px] shadow-soft border border-slate-100">
 <div className="flex items-center gap-2 mb-6">
 <Wallet className="w-5 h-5 text-primary" />
 <h3 className="text-sm font-bold text-slate-800 ">Wallet Info</h3>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
 {/* Large Card: Collectable Cash */}
 <div className="lg:col-span-2 bg-slate-50/50 rounded-[20px] border border-slate-100 p-8 flex flex-col items-center justify-center text-center space-y-4">
 <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center">
 <Banknote className="w-8 h-8 text-emerald-500" />
 </div>
 <div>
 <p className="text-4xl font-bold text-slate-800">$ {driver.wallet.collectableCash.toFixed(2)}</p>
 <p className="text-xs font-bold text-slate-400 tracking-wide mt-1">Collectable Cash</p>
 </div>
 </div>

 {/* 2x2 Grid: Other Stats */}
 <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
 {[
 { label: 'Pending Withdraw', value: driver.wallet.pendingWithdraw, icon: <Clock className="text-amber-500" /> },
 { label: 'Already Withdrawn', value: driver.wallet.alreadyWithdrawn, icon: <ArrowUpRight className="text-emerald-500" /> },
 { label: 'Withdrawable Amount', value: driver.wallet.withdrawableAmount, icon: <CreditCard className="text-blue-500" /> },
 { label: 'Total Earning', value: driver.wallet.totalEarning, icon: <Wallet className="text-primary" /> },
 ].map((card) => (
 <div key={card.label} className="bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
 <div>
 <p className="text-2xl font-bold text-slate-800">$ {card.value.toFixed(2)}</p>
 <p className="text-[10px] font-bold text-slate-400 tracking-wide mt-1">{card.label}</p>
 </div>
 <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
 {React.cloneElement(card.icon as React.ReactElement, { className: "w-6 h-6" })}
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Tab Navigation */}
 <Tabs activeKey={activeTab} onChange={setActiveTab} items={['Overview', 'Vehicle', 'Trips', 'Transaction', 'Rewards & Tier', 'Review'].map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />

 {/* Tab Content */}
 <div className="flex-1 min-h-0">
 {activeTab === 'Overview' && (
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="lg:col-span-2 bg-white p-6 rounded-[24px] shadow-soft border border-slate-100">
 <div className="flex items-center justify-between mb-6">
 <h3 className="text-sm font-bold text-slate-800 ">Performance Stats</h3>
 <div className="flex bg-slate-50 rounded-lg p-1">
 {['Trip', 'Duty & Review', 'Wallet'].map(s => (
 <button key={s} className="px-3 py-1 text-[10px] font-bold rounded-md hover:bg-white hover:shadow-sm transition-all text-slate-500 hover:text-slate-800">
 {s}
 </button>
 ))}
 </div>
 </div>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
 {[
 { label: 'Completed Trips', value: driver.stats.completedTrips, icon: <CheckCircle2 className="text-emerald-500" /> },
 { label: 'Cancel Trips', value: driver.stats.cancelTrips, icon: <XCircle className="text-red-500" /> },
 { label: 'Lowest Price', value: `$${driver.stats.lowestPrice}`, icon: <TrendingUp className="text-blue-500 rotate-180" /> },
 { label: 'Highest Price', value: `$${driver.stats.highestPrice}`, icon: <TrendingUp className="text-primary" /> },
 ].map((item) => (
 <div key={item.label} className="space-y-2">
 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
 {React.cloneElement(item.icon as React.ReactElement, { className: "w-5 h-5" })}
 </div>
 <div>
 <p className="text-lg font-bold text-slate-800">{item.value}</p>
 <p className="text-[10px] text-slate-400 font-bold ">{item.label}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 <div className="bg-white p-6 rounded-[24px] shadow-soft border border-slate-100">
 <h3 className="text-sm font-bold text-slate-800 mb-6">Documents</h3>
 <div className="space-y-4">
 {['Identity_Verification.jpg', 'License_Front.png'].map((doc) => (
 <div key={doc} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 group">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-slate-200">
 <FileText className="w-5 h-5 text-slate-400" />
 </div>
 <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{doc}</p>
 </div>
 <button className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-primary">
 <Download className="w-4 h-4" />
 </button>
 </div>
 ))}
 </div>
 </div>
 </div>
 )}

 {activeTab === 'Vehicle' && (
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="bg-white p-6 rounded-[24px] shadow-soft border border-slate-100 space-y-6">
 <div className="aspect-video rounded-xl overflow-hidden border border-slate-100">
 <img src={driver.vehicle.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
 </div>
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <h3 className="text-lg font-bold text-slate-800">{driver.vehicle.brand} {driver.vehicle.model}</h3>
 <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-bold ">{driver.vehicle.category}</span>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
 <p className="text-[10px] text-slate-400 font-bold mb-1">Ownership</p>
 <p className="text-xs font-bold text-slate-800">{driver.vehicle.ownership}</p>
 </div>
 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
 <p className="text-[10px] text-slate-400 font-bold mb-1">Trip Rate</p>
 <p className="text-xs font-bold text-emerald-500">{driver.vehicle.tripRate}%</p>
 </div>
 </div>
 </div>
 </div>
 <div className="lg:col-span-2 bg-white rounded-[24px] shadow-soft border border-slate-100 overflow-hidden">
 <div className="p-6 border-b border-slate-50">
 <h3 className="text-sm font-bold text-slate-800 ">Vehicle Specifications</h3>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-slate-50">
 <div className="divide-y divide-slate-50">
 {Object.entries(driver.vehicle.specs).slice(0, 4).map(([key, value]) => (
 <div key={key} className="px-6 py-4 flex justify-between items-center">
 <span className="text-xs font-bold text-slate-400 tracking-tight">{key.replace(/([A-Z])/g, ' $1')}</span>
 <span className="text-xs font-bold text-slate-800">{value}</span>
 </div>
 ))}
 </div>
 <div className="divide-y divide-slate-50">
 {Object.entries(driver.vehicle.specs).slice(4).map(([key, value]) => (
 <div key={key} className="px-6 py-4 flex justify-between items-center">
 <span className="text-xs font-bold text-slate-400 tracking-tight">{key.replace(/([A-Z])/g, ' $1')}</span>
 <span className="text-xs font-bold text-slate-800">{value}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 )}

 {activeTab === 'Transaction' && (
 <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 overflow-hidden">
 <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="relative flex-1 max-w-md">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
 <input type="text" placeholder="Search by Transaction ID..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all" />
 </div>
 <div className="flex items-center gap-3">
 <button
 onClick={handleExportTransactions}
 className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all"
 >
 <Download className="w-4 h-4" /> Export
 </button>
 </div>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 ">Transaction ID</th>
 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 ">Type</th>
 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 ">Transaction To</th>
 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 ">Debit</th>
 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 ">Credit</th>
 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 ">Balance</th>
 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 ">Date</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {driverTransactions.map((txn) => (
 <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
 <td className="px-6 py-4">
 <span className="text-xs font-mono text-slate-500">{txn.id}</span>
 </td>
 <td className="px-6 py-4">
 <span className={cn(
 "text-[10px] font-bold px-2 py-1 rounded-lg ",
 txn.type === 'Received balance' ? "bg-emerald-50 text-emerald-600" :
 txn.type === 'Withdraw' ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
 )}>
 {txn.type}
 </span>
 </td>
 <td className="px-6 py-4">
 <span className="text-xs font-medium text-slate-700">{txn.to}</span>
 </td>
 <td className="px-6 py-4">
 <span className="text-xs font-bold text-red-500">{txn.debit > 0 ? `-$${txn.debit.toFixed(2)}` : '-'}</span>
 </td>
 <td className="px-6 py-4">
 <span className="text-xs font-bold text-emerald-500">{txn.credit > 0 ? `+$${txn.credit.toFixed(2)}` : '-'}</span>
 </td>
 <td className="px-6 py-4">
 <span className="text-xs font-bold text-slate-800">${txn.balance.toFixed(2)}</span>
 </td>
 <td className="px-6 py-4">
 <span className="text-xs text-slate-400">{txn.date}</span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {activeTab === 'Trips' && (
 <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 overflow-hidden">
 <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="relative flex-1 max-w-md">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
 <input type="text" placeholder="Search by Trip ID..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all" />
 </div>
 <div className="flex items-center gap-3">
 <button
 onClick={handleExportTrips}
 className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all"
 >
 <Download className="w-4 h-4" /> Export
 </button>
 </div>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 ">Trip ID</th>
 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 ">Date & Time</th>
 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 ">Customer</th>
 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 ">Cost</th>
 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 ">Status</th>
 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 text-right">Action</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {driverTrips.map((trip) => (
 <tr key={trip.id} className="hover:bg-slate-50/50 transition-colors group">
 <td className="px-6 py-4">
 <span className="text-xs font-bold text-slate-800">{trip.id}</span>
 </td>
 <td className="px-6 py-4">
 <span className="text-xs text-slate-500">{trip.date}</span>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden">
 <img src={`https://picsum.photos/seed/${trip.customer}/50/50`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
 </div>
 <span className="text-xs font-medium text-slate-700">{trip.customer}</span>
 </div>
 </td>
 <td className="px-6 py-4">
 <span className="text-xs font-bold text-slate-800">${trip.cost.toFixed(2)}</span>
 </td>
 <td className="px-6 py-4">
 <span className={cn(
 "text-[10px] font-bold px-2 py-1 rounded-lg ",
 trip.status === 'Completed' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
 )}>
 {trip.status}
 </span>
 </td>
 <td className="px-6 py-4 text-right">
 <button className="p-2 hover:bg-primary/10 rounded-lg transition-all text-slate-400 hover:text-primary">
 <Eye className="w-4 h-4" />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {activeTab === 'Rewards & Tier' && (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
 {/* Tier Progress Card */}
 <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-yellow-50 rounded-2xl border border-yellow-200">
 <Award className="w-8 h-8 text-yellow-600" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 leading-none">{driver.tier} Tier</h3>
 <p className="text-xs font-bold text-slate-400 mt-2 ">Active Status</p>
 </div>
 </div>
 <div className="text-right">
 <p className="text-2xl font-black text-slate-900">{driver.points.toLocaleString()}</p>
 <p className="text-[10px] font-bold text-slate-400 leading-none mt-1">Total Points</p>
 <div className="mt-2 flex items-center justify-end gap-1.5 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
 <Zap className="w-2.5 h-2.5 fill-amber-600" />
 <span className="text-[9px] font-black">{driver.peakPoints.toLocaleString()} Peak Points</span>
 </div>
 </div>
 </div>

 <div className="space-y-4">
 <div className="flex justify-between items-end text-[11px] font-bold">
 <span className="text-slate-400">NEXT TIER: DIAMOND</span>
 <span className="text-primary">{Math.round((driver.points / driver.nextTierPoints) * 100)}% Complete</span>
 </div>
 <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
 <div
 className="h-full bg-[#0089D1] rounded-full transition-all duration-1000 shadow-lg shadow-[#0089D1]/20"
 style={{ width: `${(driver.points / driver.nextTierPoints) * 100}%` }}
 />
 </div>
 <p className="text-[10px] font-medium text-slate-400 text-center italic">Earn {(driver.nextTierPoints - driver.points).toLocaleString()} more points to reach Diamond</p>
 </div>

 <div className="grid grid-cols-2 gap-4 pt-4">
 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
 <Target className="w-5 h-5 text-emerald-500 mb-2" />
 <p className="text-lg font-bold text-slate-900">{driver.acceptanceRate}%</p>
 <p className="text-[10px] font-bold text-slate-400 ">Acceptance Rate</p>
 </div>
 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
 <Clock className="w-5 h-5 text-indigo-500 mb-2" />
 <p className="text-lg font-bold text-slate-900">105/150</p>
 <p className="text-[10px] font-bold text-slate-400 ">Monthly Trips</p>
 </div>
 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
 <Star className="w-5 h-5 text-amber-500 mb-2" />
 <p className="text-lg font-bold text-slate-900">4.92</p>
 <p className="text-[10px] font-bold text-slate-400 ">Avg. Rating</p>
 </div>
 </div>
 </div>

 {/* Active Benefits Card */}
 <div className="bg-slate-900 p-8 rounded-[32px] text-white space-y-8 relative overflow-hidden">
 <div className="absolute -right-10 -top-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl" />
 <div className="flex items-center gap-3">
 <Gift className="w-5 h-5 text-yellow-500" />
 <h3 className="text-sm font-bold opacity-60">Active Benefits</h3>
 </div>

 <div className="space-y-4">
 {[
 { label: 'Platform Commission', value: '8%', icon: Percent },
 { label: 'Bidding Advantage', value: 'Early Access', icon: Zap },
 { label: 'Zero-Comm Rides', value: '5/wk Left', icon: Activity },
 ].map((benefit) => (
 <div key={benefit.label} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
 <div className="flex items-center gap-4">
 <div className="p-2 bg-white/10 rounded-xl">
 <benefit.icon className="w-4 h-4 text-yellow-500" />
 </div>
 <span className="text-[11px] font-bold opacity-80 tracking-tight">{benefit.label}</span>
 </div>
 <span className="text-xs font-black text-white">{benefit.value}</span>
 </div>
 ))}
 </div>

 <button className="w-full py-4 bg-white text-slate-900 rounded-[20px] text-[11px] font-bold hover:bg-slate-100 transition-all">
 View All Rewards
 </button>
 </div>

 {/* Loyalty History (Small Table) */}
 <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
 <div className="flex items-center gap-3 mb-6">
 <History className="w-5 h-5 text-slate-400" />
 <h3 className="text-sm font-bold text-slate-800 ">Rewards History</h3>
 </div>
 <table className="w-full text-left">
 <thead>
 <tr className="border-b border-slate-50">
 <th className="pb-4 text-[9px] font-bold text-slate-400 text-left">EVENT</th>
 <th className="pb-4 text-[9px] font-bold text-slate-400 text-center">POINTS</th>
 <th className="pb-4 text-[9px] font-bold text-slate-400 text-right">DATE</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {[
 { event: 'Tier Promotion: Gold', points: '+1500', date: 'Feb 12, 2024' },
 { event: 'Completed 100 Trips Bonus', points: '+250', date: 'Feb 10, 2024' },
 { event: 'Weekend Surge Bonus', points: '+50', date: 'Feb 05, 2024' },
 ].map((h, i) => (
 <tr key={i} className="group">
 <td className="py-4 text-xs font-bold text-slate-800">{h.event}</td>
 <td className="py-4 text-xs font-bold text-emerald-500 text-center">{h.points}</td>
 <td className="py-4 text-xs font-bold text-slate-400 text-right">{h.date}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {/* Review tab would follow similar table patterns as CustomerDetails */}
 {activeTab === 'Review' && (
 <div className="bg-white p-12 rounded-[24px] shadow-soft border border-slate-100 flex flex-col items-center justify-center text-slate-400">
 <Activity className="w-16 h-16 mb-4 opacity-10" />
 <p className="text-sm font-medium">Detailed {activeTab} history for Driver #{driver.id}</p>
 <p className="text-xs mt-1">This module is synchronized with the operational ledger.</p>
 </div>
 )}
 </div>
 </div>
 );
};
