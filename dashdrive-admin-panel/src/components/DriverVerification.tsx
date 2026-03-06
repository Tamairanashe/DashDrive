import React, { useState } from 'react';
import {
 ShieldCheck,
 ShieldAlert,
 Clock,
 Search,
 Filter,
 Eye,
 CheckCircle2,
 XCircle,
 FileText,
 Download,
 MoreVertical,
 ChevronRight,
 User,
 Mail,
 Car,
 CreditCard,
 Image as ImageIcon,
 AlertCircle,
 ArrowRight,
 ExternalLink,
 Ban,
 Zap,
 Scale,
 Fingerprint,
 Info,
 MapPin,
 Truck,
 ShoppingBag,
 Utensils,
 Wallet,
 History,
 FileSearch,
 Lock,
 Unlock,
 Settings,
 UserCheck,
 Briefcase,
 BadgeCheck,
 Activity,
 Camera,
 ArrowLeft,
 RefreshCw,
 Star,
 Award,
 UserCircle,
 Smartphone as MobileIcon
} from 'lucide-react';
import { cn } from '../utils';

type VerificationStatus = 'Pending Verification' | 'Approved Drivers' | 'Rejected Drivers' | 'Under Review';

interface DriverProfile {
 id: string;
 name: string;
 avatar: string;
 phone: string;
 email: string;
 address: string;
 zone: string;
 source: string;
 serviceType: 'Ride' | 'Food' | 'Mart' | 'Parcel';
 vehicleType: 'Bike' | 'Car' | 'Van';
 kycStatus: 'Pending' | 'Verified' | 'Rejected' | 'Under Review';
 docStatus: 'Complete' | 'Missing';
 bgCheck: 'Passed' | 'Failed' | 'Pending';
 regDate: string;
 riskScore: number;
 confidence: number;
 plateNumber: string;
 vehicleModel: string;
 vehicleYear: string;
 fintechStatus: 'Active' | 'Blocked';
}

export const DriverVerification: React.FC = () => {
 const [mainTab, setMainTab] = useState<VerificationStatus>('Pending Verification');
 const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
 const [selectedId, setSelectedId] = useState<string | null>(null);
 const [activeAuditSection, setActiveAuditSection] = useState<'Overview' | 'Documents' | 'Vehicle' | 'Security' | 'Services' | 'Finance'>('Overview');
 const [activeEvidenceSource, setActiveEvidenceSource] = useState<'ID_FRONT' | 'ID_BACK' | 'SELFIE' | 'LICENSE' | 'VEHICLE_FRONT' | 'INSURANCE'>('ID_FRONT');

 const drivers: DriverProfile[] = [
 {
 id: 'DRV-001',
 name: 'John Doe',
 avatar: 'https://images.unsplash.com/photo-1540569014015-19a7ee504e3a?auto=format&fit=crop&q=80&w=150',
 phone: '+1 234 567 890',
 email: 'john.doe@example.com',
 address: 'Dhaka Central',
 zone: 'Dhaka Central',
 source: 'Mobile App',
 serviceType: 'Ride',
 vehicleType: 'Car',
 kycStatus: 'Pending',
 docStatus: 'Complete',
 bgCheck: 'Pending',
 regDate: '2026-01-12',
 riskScore: 62,
 confidence: 92,
 plateNumber: 'DHK-METRO-GA-12-3456',
 vehicleModel: 'Toyota Axio 2022',
 vehicleYear: '2022',
 fintechStatus: 'Active'
 },
 {
 id: 'DRV-002',
 name: 'Sarah Smith',
 avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
 phone: '+1 987 654 321',
 email: 'sarah.s@example.com',
 address: 'London North',
 zone: 'London North',
 source: 'Admin Portal',
 serviceType: 'Food',
 vehicleType: 'Bike',
 kycStatus: 'Under Review',
 docStatus: 'Complete',
 bgCheck: 'Passed',
 regDate: '2026-02-13',
 riskScore: 15,
 confidence: 98,
 plateNumber: 'BK-9901',
 vehicleModel: 'Honda CB350',
 vehicleYear: '2022',
 fintechStatus: 'Active'
 }
 ];

 const selectedDriver = drivers.find(d => d.id === selectedId);
 const mainTabs: VerificationStatus[] = ['Pending Verification', 'Approved Drivers', 'Rejected Drivers', 'Under Review'];

 const handleReview = (id: string) => {
 setSelectedId(id);
 setViewMode('detail');
 };

 const renderListView = () => (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
 {/* List Header Area */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <div className="flex items-center gap-2 mb-2">
 <span className="text-[10px] font-medium text-slate-400">User Mgmt</span>
 <ChevronRight className="w-3 h-3 text-slate-300" />
 <span className="text-[10px] font-medium text-slate-400">Driver Setup</span>
 <ChevronRight className="w-3 h-3 text-slate-300" />
 <span className="text-[10px] font-medium text-slate-400">Verification</span>
 </div>
 <h1 className="text-2xl font-bold text-slate-900 leading-none">Driver Verification</h1>
 </div>
 <div className="flex items-center gap-3">
 <div className="relative group w-[320px]">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
 <input
 type="text"
 placeholder="Search driver by name or phone."
 className="w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-full text-xs font-medium outline-none focus:bg-white focus:ring-1 focus:ring-slate-200 transition-all border-none"
 />
 </div>
 <button className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-all">
 <Filter className="w-4 h-4" />
 </button>
 <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 text-[11px] font-bold hover:bg-slate-50 transition-all">
 <Download className="w-4 h-4" /> Export
 </button>
 <button className="px-6 py-2.5 bg-[#0089D1] text-white rounded-lg text-[11px] font-bold hover:bg-[#007AB8] transition-all shadow-md">
 Bulk Approve
 </button>
 </div>
 </div>

 {/* List Table Container */}
 <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
 {/* Navigation Tabs */}
 <div className="px-8 pt-6 border-b border-slate-100 flex items-center justify-between">
 <div className="flex items-center gap-8">
 {(['All', 'Pending', 'Under Review', 'Approved', 'Rejected'] as const).map(tab => (
 <button
 key={tab}
 onClick={() => setMainTab(tab as any)}
 className={cn(
 "pb-4 text-[11px] font-bold transition-all relative",
 (tab === 'All' && mainTab === 'Pending Verification') || mainTab === tab
 ? "text-[#0089D1] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#0089D1]"
 : "text-slate-400 hover:text-slate-600"
 )}
 >
 {tab}
 </button>
 ))}
 </div>
 </div>

 {/* Table */}
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-10 py-5 text-[9px] font-bold text-slate-400 ">DRIVER INFO</th>
 <th className="px-10 py-5 text-[9px] font-bold text-slate-400 ">SERVICE TYPE</th>
 <th className="px-10 py-5 text-[9px] font-bold text-slate-400 ">KYC STATUS</th>
 <th className="px-10 py-5 text-[9px] font-bold text-slate-400 ">RISK SCORE</th>
 <th className="px-10 py-5 text-[9px] font-bold text-slate-400 text-right">ACTIONS</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {drivers.map((driver, idx) => (
 <tr key={driver.id} className="group hover:bg-slate-50/50 transition-all duration-300">
 <td className="px-10 py-5">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
 <img src={driver.avatar} alt="" className="w-full h-full object-cover" />
 </div>
 <div>
 <p className="text-xs font-bold text-slate-900">{driver.name}</p>
 <p className="text-[10px] font-medium text-slate-400 mt-0.5">{driver.phone}</p>
 </div>
 </div>
 </td>
 <td className="px-10 py-5">
 <div className="flex items-center gap-2">
 <span className="text-[9px] font-bold text-slate-400 ">RIDE</span>
 <span className="text-[9px] font-bold text-slate-400 ">FOOD</span>
 <span className="text-[9px] font-bold text-slate-400 ">PARCEL</span>
 </div>
 </td>
 <td className="px-10 py-5">
 <span className={cn(
 "px-3 py-1 rounded-full text-[9px] font-bold whitespace-nowrap",
 driver.kycStatus === 'Pending' ? "bg-amber-100 text-amber-600" :
 driver.kycStatus === 'Under Review' ? "bg-blue-100 text-blue-600" :
 "bg-emerald-100 text-emerald-600"
 )}>
 {driver.kycStatus === 'Pending' ? 'Pending' : 'Under Review'}
 </span>
 </td>
 <td className="px-10 py-5">
 <div className="flex items-center gap-3">
 <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
 <div
 className={cn(
 "h-full rounded-full transition-all duration-1000",
 driver.riskScore > 50 ? "bg-rose-500" : "bg-emerald-500"
 )}
 style={{ width: `${driver.riskScore}%` }}
 />
 </div>
 <span className="text-[10px] font-bold text-slate-400">{driver.riskScore}</span>
 </div>
 </td>
 <td className="px-10 py-5">
 <div className="flex items-center justify-end gap-2">
 <button
 onClick={() => handleReview(driver.id)}
 className="p-1.5 text-slate-300 hover:text-[#0089D1] transition-colors"
 >
 <Eye className="w-4 h-4" />
 </button>
 <button className="p-1.5 text-slate-300 hover:text-emerald-500 transition-colors">
 <CheckCircle2 className="w-4 h-4" />
 </button>
 <button className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors">
 <XCircle className="w-4 h-4" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Footer Strip */}
 <div className="p-8 border-t border-slate-50 flex items-center justify-between">
 <p className="text-[10px] font-black text-slate-400 italic">Snapshot: 1,402 Active Compliance Logs Today</p>
 <div className="flex items-center gap-2">
 {[1, 2, 3, '...', 12].map((p, i) => (
 <button key={i} className={cn("w-10 h-10 rounded-xl text-[10px] font-black transition-all", p === 1 ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50")}>{p}</button>
 ))}
 </div>
 </div>
 </div>
 </div>
 );

 const renderDetailView = () => {
 if (!selectedDriver) return null;

 return (
 <div className="fixed inset-0 z-[9999] flex justify-end">
 {/* Backdrop */}
 <div
 className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500"
 onClick={() => setViewMode('list')}
 />

 {/* Side Drawer */}
 <div className="relative w-full max-w-[1200px] bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col overflow-hidden">
 {/* Header */}
 <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
 <div className="flex items-center gap-6">
 <div>
 <h2 className="text-xl font-bold text-slate-900 leading-none">Driver Verification</h2>
 <div className="flex items-center gap-3 mt-2">
 <span className="text-xs font-medium text-slate-400">ID: {selectedDriver.id}</span>
 <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-600 text-[10px] font-bold">Pending</span>
 </div>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <button className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-all">
 Under Review
 </button>
 <button className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg text-xs font-bold transition-all">
 Reject
 </button>
 <button className="px-6 py-2.5 bg-[#00A65A] text-white rounded-lg text-xs font-bold hover:bg-[#008D4C] transition-all">
 Approve Driver
 </button>
 <button
 onClick={() => setViewMode('list')}
 className="ml-4 p-2 text-slate-400 hover:text-slate-600 transition-all"
 >
 <XCircle className="w-5 h-5" />
 </button>
 </div>
 </div>

 {/* Main Content Area - Scrollable */}
 <div className="flex-1 overflow-y-auto bg-slate-50/30">
 <div className="p-10 grid grid-cols-12 gap-8">

 {/* LEFT COLUMN: Profile & Stats */}
 <div className="col-span-12 lg:col-span-4 space-y-6">
 {/* Profile Card */}
 <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
 <div className="flex flex-col items-center text-center">
 <div className="relative mb-6">
 <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100">
 <img src={selectedDriver.avatar} alt="" className="w-full h-full object-cover" />
 </div>
 <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-[#00A65A] rounded-full border-4 border-white flex items-center justify-center">
 <BadgeCheck className="w-4 h-4 text-white" />
 </div>
 </div>
 <h3 className="text-lg font-bold text-slate-900 leading-none mb-1">{selectedDriver.name}</h3>
 <p className="text-xs font-medium text-slate-400">{selectedDriver.email}</p>
 </div>

 <div className="mt-8 space-y-4 pt-6 border-t border-slate-50">
 <div className="flex justify-between items-center text-[11px]">
 <span className="text-slate-400 font-medium">Phone</span>
 <span className="text-slate-900 font-bold">{selectedDriver.phone}</span>
 </div>
 <div className="flex justify-between items-center text-[11px]">
 <span className="text-slate-400 font-medium">Zone</span>
 <span className="text-slate-900 font-bold">{selectedDriver.zone}</span>
 </div>
 <div className="flex justify-between items-center text-[11px]">
 <span className="text-slate-400 font-medium">Reg. Date</span>
 <span className="text-slate-900 font-bold">{selectedDriver.regDate}</span>
 </div>
 </div>
 </div>

 {/* Risk & Fraud Analytics */}
 <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
 <h4 className="text-[10px] font-bold text-slate-400 ">RISK & FRAUD ANALYTICS</h4>

 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-[11px] font-bold text-slate-900">AI Risk Score</span>
 <span className="text-xs font-bold text-rose-500">{selectedDriver.riskScore} (Medium)</span>
 </div>
 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
 <div
 className="h-full bg-rose-500 rounded-full"
 style={{ width: `${selectedDriver.riskScore}%` }}
 />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
 <p className="text-[10px] font-bold text-slate-400 mb-1">FACE MATCH</p>
 <p className="text-xs font-bold text-emerald-500">{selectedDriver.confidence}%</p>
 </div>
 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
 <p className="text-[10px] font-bold text-slate-400 mb-1">DUPLICATES</p>
 <p className="text-xs font-bold text-slate-900">None</p>
 </div>
 </div>
 </div>

 {/* Service Eligibility */}
 <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
 <h4 className="text-[10px] font-bold text-slate-400 ">SERVICE ELIGIBILITY</h4>

 <div className="space-y-5">
 {[
 { label: 'Ride', active: true },
 { label: 'Food', active: true },
 { label: 'Mart', active: true },
 { label: 'Parcel', active: true },
 { label: 'Shopping', active: false },
 { label: 'Fintech', active: true }
 ].map(service => (
 <div key={service.label} className="flex items-center justify-between">
 <span className="text-xs font-bold text-slate-600">{service.label}</span>
 <button className={cn(
 "w-10 h-5 rounded-full relative transition-all",
 service.active ? "bg-[#0089D1]" : "bg-slate-200"
 )}>
 <div className={cn(
 "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all",
 service.active ? "right-0.5" : "left-0.5"
 )} />
 </button>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* RIGHT COLUMN: Documents & Logs */}
 <div className="col-span-12 lg:col-span-8 space-y-8">
 <div className="flex items-center justify-between px-2">
 <h4 className="text-sm font-bold text-slate-900 flex items-center gap-3">
 <div className="p-1.5 bg-blue-50 rounded-lg text-blue-500">
 <FileSearch className="w-4 h-4" />
 </div>
 KYC & Documents Verification
 </h4>
 <span className="text-[11px] font-bold text-slate-400 ">3 Documents</span>
 </div>

 {/* Documents Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {[
 { title: 'National ID', status: 'Pending', img: 'https://images.unsplash.com/photo-1590483736622-39da8af75bba?auto=format&fit=crop&q=80&w=600' },
 { title: 'Driving License', status: 'Approved', img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600' },
 { title: 'Selfie Verification', status: 'Pending', img: 'https://images.unsplash.com/photo-1540569014015-19a7ee504e3a?auto=format&fit=crop&q=80&w=600' }
 ].map(doc => (
 <div key={doc.title} className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden group">
 <div className="relative aspect-video">
 <img src={doc.img} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
 <div className="absolute top-4 right-4">
 <span className={cn(
 "px-3 py-1 rounded-full text-[9px] font-black shadow-lg",
 doc.status === 'Approved' ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
 )}>
 {doc.status}
 </span>
 </div>
 </div>
 <div className="p-5">
 <div className="flex items-center justify-between mb-4">
 <h5 className="text-xs font-bold text-slate-900">{doc.title}</h5>
 <button className="text-slate-300 hover:text-slate-600 transition-colors">
 <MoreVertical className="w-4 h-4" />
 </button>
 </div>
 <div className="grid grid-cols-2 gap-3">
 <button className="py-2.5 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-xl border border-emerald-100/50 transition-all">
 Approve
 </button>
 <button className="py-2.5 bg-rose-50/50 hover:bg-rose-50 text-rose-500 text-[10px] font-bold rounded-xl border border-rose-100/50 transition-all">
 Reject
 </button>
 </div>
 </div>
 </div>
 ))}

 {/* Vehicle Info Card */}
 <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden p-6 space-y-6">
 <div className="flex items-center justify-between">
 <h5 className="text-xs font-bold text-slate-900 flex items-center gap-2">
 <Car className="w-4 h-4 text-blue-500" />
 Vehicle Information
 </h5>
 <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-[9px] font-black ">Pending</span>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
 <p className="text-[9px] font-bold text-slate-400 mb-1">VEHICLE MODEL</p>
 <p className="text-xs font-bold text-slate-900">{selectedDriver.vehicleModel}</p>
 </div>
 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
 <p className="text-[9px] font-bold text-slate-400 mb-1">PLATE NUMBER</p>
 <p className="text-xs font-bold text-slate-900">{selectedDriver.plateNumber}</p>
 </div>
 </div>

 <div className="relative aspect-video rounded-2xl overflow-hidden group">
 <img src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=600" alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
 <div className="absolute top-4 right-4">
 <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-[9px] font-black shadow-lg">Pending</span>
 </div>
 </div>
 </div>
 </div>

 {/* Activity Log Table */}
 <div className="space-y-4">
 <h4 className="text-sm font-bold text-slate-900 flex items-center gap-3 px-2">
 <div className="p-1.5 bg-blue-50 rounded-lg text-blue-500">
 <Clock className="w-4 h-4" />
 </div>
 Verification Activity Log
 </h4>

 <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-8 py-4 text-[9px] font-bold text-slate-400 ">DATE</th>
 <th className="px-8 py-4 text-[9px] font-bold text-slate-400 ">ADMIN</th>
 <th className="px-8 py-4 text-[9px] font-bold text-slate-400 ">ACTION</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {[
 { date: '2026-02-12', admin: 'System', action: 'Documents Uploaded' },
 { date: '2026-02-13', admin: 'Admin B', action: 'License Reviewed' }
 ].map((log, i) => (
 <tr key={i} className="text-xs">
 <td className="px-8 py-5 text-slate-400 font-medium">{log.date}</td>
 <td className="px-8 py-5 text-slate-900 font-bold">{log.admin}</td>
 <td className="px-8 py-5 text-slate-600 font-medium">{log.action}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Footer Actions */}
 <div className="px-10 py-6 border-t border-slate-100 bg-white sticky bottom-0 z-10">
 <div className="mb-6">
 <h5 className="text-[10px] font-bold text-slate-400 mb-3 italic">INTERNAL ADMIN NOTES</h5>
 <textarea
 placeholder="Add notes about this verification..."
 className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[24px] text-xs font-medium outline-none focus:bg-white focus:ring-1 focus:ring-slate-200 transition-all resize-none h-24 shadow-inner"
 />
 </div>
 <div className="flex items-center justify-end gap-3">
 <button
 onClick={() => setViewMode('list')}
 className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-[11px] font-bold transition-all"
 >
 Cancel
 </button>
 <button className="px-12 py-3.5 bg-[#0089D1] text-white rounded-2xl text-[11px] font-bold hover:bg-[#007AB8] transition-all shadow-lg flex items-center gap-3 group">
 Confirm Action
 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
 </button>
 </div>
 </div>
 </div>
 </div>
 );
 };

 return (
 <div className="h-full flex flex-col gap-8">
 {viewMode === 'list' ? renderListView() : renderDetailView()}
 </div>
 );
};
