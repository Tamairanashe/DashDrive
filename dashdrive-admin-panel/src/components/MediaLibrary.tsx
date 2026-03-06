import React, { useState } from 'react';
import {
 ImageIcon,
 RotateCcw,
 Save,
 Plus,
 Search,
 Eye,
 Trash2,
 Upload,
 Globe,
 Settings,
 CheckCircle2,
 Layout,
 Info,
 ArrowRight,
 Filter,
 Image as ImageIconAlt,
 Clock
} from 'lucide-react';
import { cn } from '../utils';

interface MediaAsset {
 id: string;
 name: string;
 type: string;
 size: string;
 url: string;
 date: string;
}

const MEDIA_DATA: MediaAsset[] = [
 { id: '1', name: 'homepage-banner.jpg', type: 'JPG', size: '4.2 MB', url: 'https://images.unsplash.com/photo-1449156059431-78995541dca5?w=400&auto=format&fit=crop&q=60', date: 'Oct 12, 2023' },
 { id: '2', name: 'app-logo-white.png', type: 'PNG', size: '156 KB', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&auto=format&fit=crop&q=60', date: 'Oct 15, 2023' },
 { id: '3', name: 'delivery-icon.svg', type: 'SVG', size: '12 KB', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=60', date: 'Nov 05, 2023' },
 { id: '4', name: 'campaign-2024.png', type: 'PNG', size: '2.1 MB', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=60', date: 'Dec 20, 2023' },
 { id: '5', name: 'driver-hero.webp', type: 'WEBP', size: '890 KB', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop&q=60', date: 'Jan 05, 2024' },
 { id: '6', name: 'footer-background.jpg', type: 'JPG', size: '3.4 MB', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&auto=format&fit=crop&q=60', date: 'Jan 12, 2024' },
];

export const MediaLibrary: React.FC = () => {
 const [searchTerm, setSearchTerm] = useState('');

 const renderHeader = () => (
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 mt-4">
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg">
 <ImageIcon className="w-6 h-6 text-indigo-400" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-black text-slate-400 tracking-[0.2em]">Management</span>
 <div className="w-1 h-1 rounded-full bg-slate-200" />
 <span className="text-[10px] font-black text-[#0089D1] tracking-[0.2em]">Visual Assets</span>
 </div>
 <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mt-1">Media Library</h1>
 </div>
 </div>
 <p className="text-base font-medium text-slate-500 max-w-lg leading-relaxed">
 Centralized storage for all platform visual assets, promotional banners, and branding icons.
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
 placeholder="Search assets..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[24px] text-xs font-bold text-slate-600 outline-none w-[300px] hover:border-slate-300 focus:ring-8 focus:ring-[#0089D1]/5 transition-all"
 />
 </div>
 <button className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-[24px] text-xs font-black transition-all shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-[1.03] active:scale-95">
 <Upload className="w-5 h-5" /> Upload Assets
 </button>
 </div>

 <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 px-4">
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
 {MEDIA_DATA.map((asset) => (
 <div key={asset.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl hover:border-indigo-100 transition-all duration-500">
 <div className="h-48 relative overflow-hidden bg-slate-50">
 <img
 src={asset.url}
 alt={asset.name}
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
 />
 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
 <button className="p-3 bg-white text-slate-900 rounded-2xl hover:bg-[#0089D1] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
 <Eye className="w-5 h-5" />
 </button>
 <button className="p-3 bg-white text-slate-900 rounded-2xl hover:bg-rose-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75">
 <Trash2 className="w-5 h-5" />
 </button>
 </div>
 <div className="absolute top-4 left-4">
 <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black text-white border border-white/20">
 {asset.type}
 </span>
 </div>
 </div>
 <div className="p-6 space-y-3">
 <h5 className="text-[11px] font-black text-slate-900 truncate tracking-tight">{asset.name}</h5>
 <div className="flex items-center justify-between text-[9px] font-black text-slate-400 ">
 <span>{asset.size}</span>
 <span>{asset.date}</span>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Bottom Logic Card */}
 <div className="max-w-4xl mx-auto p-12 bg-slate-900 rounded-[64px] text-white space-y-10 relative overflow-hidden shadow-2xl">
 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />

 <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
 <div className="p-8 bg-white/10 rounded-[40px] text-white/90 shrink-0 border border-white/10 shadow-inner">
 <ImageIconAlt className="w-12 h-12" />
 </div>
 <div>
 <h4 className="text-2xl font-black tracking-tight text-white italic">Centralized Asset Pipeline</h4>
 <p className="text-sm font-medium text-white/50 leading-relaxed mt-4">
 Your visual media is processed and served via Global Edge CDN for sub-100ms delivery.
 Supported formats: PNG, JPG, WebP, SVG. Max file size: 10MB per asset.
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
 <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-3 hover:bg-white/10 transition-colors">
 <div className="p-3 bg-white/10 w-fit rounded-xl text-indigo-400">
 <Globe className="w-5 h-5" />
 </div>
 <h5 className="text-[10px] font-black text-white ">Edge CDN Delivery</h5>
 <p className="text-[10px] font-medium text-white/40 leading-relaxed">Images distributed across 12 strategic zones.</p>
 </div>
 <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-3 hover:bg-white/10 transition-colors">
 <div className="p-3 bg-white/10 w-fit rounded-xl text-emerald-400">
 <Settings className="w-5 h-5" />
 </div>
 <h5 className="text-[10px] font-black text-white ">Auto-Compression</h5>
 <p className="text-[10px] font-medium text-white/40 leading-relaxed">Assets are automatically optimized for web performance.</p>
 </div>
 <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-3 hover:bg-white/10 transition-colors">
 <div className="p-3 bg-white/10 w-fit rounded-xl text-blue-400">
 <CheckCircle2 className="w-5 h-5" />
 </div>
 <h5 className="text-[10px] font-black text-white ">Redundancy Layer</h5>
 <p className="text-[10px] font-medium text-white/40 leading-relaxed">Multi-cloud storage ensures 99.99% asset uptime.</p>
 </div>
 </div>
 </div>
 </div>
 );
};
