import React, { useState } from 'react';
import {
 FileEdit,
 RotateCcw,
 Save,
 Plus,
 Search,
 Eye,
 EyeOff,
 Trash2,
 Edit3,
 Globe,
 FileText,
 Clock,
 User,
 Layout,
 Settings,
 CheckCircle2,
 Info,
 ArrowRight
} from 'lucide-react';
import { cn } from '../utils';

interface ContentPage {
 id: string;
 title: string;
 url: string;
 status: 'Active' | 'Draft';
 lastModified: string;
 author: string;
}

const PAGES_DATA: ContentPage[] = [
 { id: '1', title: 'About DashDrive', url: '/about', status: 'Active', lastModified: 'Oct 15, 2023', author: 'Admin' },
 { id: '2', title: 'Privacy Policy', url: '/privacy', status: 'Active', lastModified: 'Nov 02, 2023', author: 'Legal Team' },
 { id: '3', title: 'Terms & Conditions', url: '/terms', status: 'Active', lastModified: 'Nov 02, 2023', author: 'Legal Team' },
 { id: '4', title: 'FAQ & Support', url: '/faq', status: 'Draft', lastModified: 'Dec 10, 2023', author: 'Support Admin' },
 { id: '5', title: 'New Year Campaigns', url: '/promo/2024', status: 'Draft', lastModified: 'Dec 20, 2023', author: 'Marketing' },
];

export const PagesManager: React.FC = () => {
 const [searchTerm, setSearchTerm] = useState('');

 const renderHeader = () => (
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 mt-4">
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg">
 <FileEdit className="w-6 h-6 text-purple-400" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-black text-slate-400 tracking-[0.2em]">Content Management</span>
 <div className="w-1 h-1 rounded-full bg-slate-200" />
 <span className="text-[10px] font-black text-[#0089D1] tracking-[0.2em]">Static Pages</span>
 </div>
 <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mt-1">Pages</h1>
 </div>
 </div>
 <p className="text-base font-medium text-slate-500 max-w-lg leading-relaxed">
 Create and manage static website content, policies, and informational landing pages.
 </p>
 </div>

 <div className="flex items-center gap-4">
 <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-[24px] text-xs font-black hover:bg-slate-50 hover:text-slate-600 transition-all">
 <RotateCcw className="w-5 h-5" /> Reset
 </button>
 <button className="flex items-center gap-3 px-10 py-4 bg-[#0089D1] text-white rounded-[24px] text-xs font-black hover:bg-[#007AB8] transition-all shadow-xl shadow-[#0089D1]/20 font-display">
 <Save className="w-5 h-5" /> Persist Changes
 </button>
 </div>
 </div>
 );

 return (
 <div className="max-w-[1700px] mx-auto space-y-12 pb-20 px-4">
 {renderHeader()}

 <div className="space-y-8">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
 <div className="relative group">
 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#0089D1] transition-colors" />
 <input
 type="text"
 placeholder="Search pages..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[24px] text-xs font-bold text-slate-600 outline-none w-[300px] hover:border-slate-300 focus:ring-8 focus:ring-[#0089D1]/5 transition-all"
 />
 </div>
 <button className="flex items-center gap-3 px-8 py-4 bg-purple-600 text-white rounded-[24px] text-xs font-black transition-all shadow-lg shadow-purple-600/20 hover:bg-purple-700 hover:scale-[1.03] active:scale-95">
 <Plus className="w-5 h-5" /> Build New Page
 </button>
 </div>

 <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 px-4">
 <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-slate-50 border-b border-slate-100">
 <th className="px-10 py-6 text-[10px] font-black text-slate-400 ">Page Structure</th>
 <th className="px-10 py-6 text-[10px] font-black text-slate-400 ">Visibility</th>
 <th className="px-10 py-6 text-[10px] font-black text-slate-400 ">Versioning</th>
 <th className="px-10 py-6 text-[10px] font-black text-slate-400 ">Author</th>
 <th className="px-10 py-6 text-[10px] font-black text-slate-400 text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {PAGES_DATA.map((page) => (
 <tr key={page.id} className="group hover:bg-slate-50/50 transition-colors">
 <td className="px-10 py-8">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform">
 <FileText className="w-5 h-5" />
 </div>
 <div>
 <h4 className="text-sm font-black text-slate-900 group-hover:text-purple-600 transition-colors">{page.title}</h4>
 <p className="text-[10px] font-bold text-slate-400 tracking-tighter mt-0.5">{page.url}</p>
 </div>
 </div>
 </td>
 <td className="px-10 py-8">
 <div className={cn(
 "px-4 py-1.5 rounded-full text-[10px] font-black w-fit flex items-center gap-2",
 page.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
 )}>
 {page.status === 'Active' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
 {page.status}
 </div>
 </td>
 <td className="px-10 py-8">
 <div className="flex items-center gap-2 text-slate-500">
 <Clock className="w-4 h-4 text-slate-300" />
 <span className="text-[10px] font-black ">{page.lastModified}</span>
 </div>
 </td>
 <td className="px-10 py-8">
 <div className="flex items-center gap-2 text-slate-500">
 <User className="w-4 h-4 text-slate-300" />
 <span className="text-[10px] font-bold">{page.author}</span>
 </div>
 </td>
 <td className="px-10 py-8 text-right">
 <div className="flex items-center justify-end gap-2">
 <button className="p-3 bg-slate-50 text-slate-400 hover:text-[#0089D1] hover:bg-blue-50 rounded-2xl transition-all">
 <Edit3 className="w-5 h-5" />
 </button>
 <button className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all">
 <Trash2 className="w-5 h-5" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>

 {/* Bottom Logic Card */}
 <div className="max-w-4xl mx-auto p-12 bg-slate-900 rounded-[64px] text-white space-y-10 relative overflow-hidden shadow-2xl">
 <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />

 <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
 <div className="p-8 bg-white/10 rounded-[40px] text-white/90 shrink-0 border border-white/10 shadow-inner">
 <Layout className="w-12 h-12" />
 </div>
 <div>
 <h4 className="text-2xl font-black tracking-tight text-white italic">Digital Layout Control</h4>
 <p className="text-sm font-medium text-white/50 leading-relaxed mt-4">
 All static content is served via Global Edge CDN for sub-100ms delivery.
 Ensure that your policies are updated regularly to maintain compliance with regional data processing laws.
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
 <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-3 hover:bg-white/10 transition-colors">
 <div className="p-3 bg-white/10 w-fit rounded-xl text-purple-400">
 <Globe className="w-5 h-5" />
 </div>
 <h5 className="text-[10px] font-black text-white ">Global CDN</h5>
 <p className="text-[10px] font-medium text-white/40 leading-relaxed">Images and scripts distributed across 12 zones.</p>
 </div>
 <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-3 hover:bg-white/10 transition-colors">
 <div className="p-3 bg-white/10 w-fit rounded-xl text-indigo-400">
 <Settings className="w-5 h-5" />
 </div>
 <h5 className="text-[10px] font-black text-white ">SEO Auto-gen</h5>
 <p className="text-[10px] font-medium text-white/40 leading-relaxed">Meta tags are automatically extracted from page content.</p>
 </div>
 <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-3 hover:bg-white/10 transition-colors">
 <div className="p-3 bg-white/10 w-fit rounded-xl text-emerald-400">
 <CheckCircle2 className="w-5 h-5" />
 </div>
 <h5 className="text-[10px] font-black text-white ">Usage Guard</h5>
 <p className="text-[10px] font-medium text-white/40 leading-relaxed">System blocks deletion of assets currently in use by pages.</p>
 </div>
 </div>
 </div>
 </div>
 );
};
