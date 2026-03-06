import React, { useState } from 'react';
import {
 Download,
 RotateCcw,
 Save,
 Smartphone,
 Globe,
 ExternalLink,
 SmartphoneNfc,
 Monitor,
 Tablet,
 Layout,
 ImageIcon,
 Link,
 Shield,
 Info,
 CheckCircle2,
 XCircle,
 Copy,
 Share2,
 Zap,
 Store,
 ArrowRight
} from 'lucide-react';
import { cn } from '../utils';

export const AppDownloadSetup: React.FC = () => {
 const [enabled, setEnabled] = useState(true);
 const [playStoreUrl, setPlayStoreUrl] = useState('https://play.google.com/store/apps/details?id=com.dashdrive.app');
 const [appStoreUrl, setAppStoreUrl] = useState('https://apps.apple.com/app/dashdrive/id123456789');
 const [downloadTitle, setDownloadTitle] = useState('Download Our Super App');
 const [downloadDesc, setDownloadDesc] = useState('Available on all platforms. Get the app now to start your journey.');

 const renderHeader = () => (
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 mt-4">
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg">
 <Download className="w-6 h-6 text-emerald-400" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-black text-slate-400 tracking-[0.2em]">Configuration</span>
 <div className="w-1 h-1 rounded-full bg-slate-200" />
 <span className="text-[10px] font-black text-[#0089D1] tracking-[0.2em]">Growth & Distribution</span>
 </div>
 <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mt-1">App Download Setup</h1>
 </div>
 </div>
 <p className="text-base font-medium text-slate-500 max-w-lg leading-relaxed">
 Configure mobile store links, promotional messaging, and platform-wide app distribution settings.
 </p>
 </div>

 <div className="flex items-center gap-4">
 <button
 onClick={() => {
 setPlayStoreUrl('');
 setAppStoreUrl('');
 setDownloadTitle('');
 setDownloadDesc('');
 }}
 className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-[24px] text-xs font-black hover:bg-slate-50 hover:text-slate-600 transition-all focus:ring-4 focus:ring-slate-100"
 >
 <RotateCcw className="w-5 h-5" /> Reset
 </button>
 <button className="flex items-center gap-3 px-10 py-4 bg-[#0089D1] text-white rounded-[24px] text-xs font-black hover:bg-[#007AB8] transition-all shadow-xl shadow-[#0089D1]/20 font-display focus:ring-4 focus:ring-[#007AB8]/20">
 <Save className="w-5 h-5" /> Persist Changes
 </button>
 </div>
 </div>
 );

 return (
 <div className="max-w-[1700px] mx-auto space-y-12 pb-20 px-4">
 {renderHeader()}

 <div className="flex flex-col lg:flex-row gap-10 min-h-[600px] animate-in fade-in slide-in-from-bottom-8 duration-700">
 {/* Left Panel: Store Link Configuration */}
 <div className="lg:w-1/2 space-y-10">
 <div className="bg-white p-12 rounded-[60px] border border-slate-100 shadow-sm space-y-10 relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-32 -mt-32 transition-all group-hover:bg-emerald-500/10" />

 <div className="flex items-center justify-between relative z-10">
 <div className="flex items-center gap-6">
 <div className="p-5 bg-emerald-50 text-emerald-600 rounded-[30px] shadow-sm">
 <Store className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Store Logic</h3>
 <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] mt-2">Mobile Application Distribution</p>
 </div>
 </div>
 <label className="flex items-center gap-4 cursor-pointer">
 <span className={cn(
 "text-[10px] font-black transition-colors",
 enabled ? "text-emerald-500" : "text-slate-400"
 )}>
 {enabled ? 'Active' : 'Hidden'}
 </span>
 <div
 onClick={() => setEnabled(!enabled)}
 className={cn(
 "w-14 h-7 rounded-full p-1 transition-all duration-500 flex items-center relative shadow-inner",
 enabled ? "bg-emerald-500" : "bg-slate-200"
 )}
 >
 <div className={cn(
 "w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-500 transform",
 enabled ? "translate-x-7" : "translate-x-0"
 )} />
 </div>
 </label>
 </div>

 <div className="space-y-8 relative z-10">
 <div className="space-y-4">
 <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] ml-4">Google Play Store URL</label>
 <div className="relative group/field">
 <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-white rounded-xl text-slate-300 group-focus-within/field:text-emerald-600 transition-colors">
 <SmartphoneNfc className="w-5 h-5" />
 </div>
 <input
 type="url"
 value={playStoreUrl}
 onChange={(e) => setPlayStoreUrl(e.target.value)}
 placeholder="https://play.google.com/store/apps/..."
 className="w-full pl-16 pr-20 py-5 bg-slate-50 border border-slate-100 rounded-[32px] text-xs font-bold text-slate-600 outline-none hover:border-emerald-200 focus:ring-8 focus:ring-emerald-500/5 transition-all shadow-sm"
 />
 <button className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[10px] font-black text-[#0089D1] hover:bg-white px-3 py-1.5 rounded-full transition-all">
 <ExternalLink className="w-4 h-4" /> Visit
 </button>
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] ml-4">Apple App Store URL</label>
 <div className="relative group/field">
 <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-white rounded-xl text-slate-300 group-focus-within/field:text-blue-600 transition-colors">
 <Monitor className="w-5 h-5" />
 </div>
 <input
 type="url"
 value={appStoreUrl}
 onChange={(e) => setAppStoreUrl(e.target.value)}
 placeholder="https://apps.apple.com/app/..."
 className="w-full pl-16 pr-20 py-5 bg-slate-50 border border-slate-100 rounded-[32px] text-xs font-bold text-slate-600 outline-none hover:border-blue-200 focus:ring-8 focus:ring-blue-500/5 transition-all shadow-sm"
 />
 <button className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[10px] font-black text-[#0089D1] hover:bg-white px-3 py-1.5 rounded-full transition-all">
 <ExternalLink className="w-4 h-4" /> Visit
 </button>
 </div>
 </div>
 </div>

 <div className="pt-6 relative z-10 flex flex-col gap-6">
 <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-6">
 <div className="flex items-center justify-between">
 <h4 className="text-[10px] font-black text-slate-900 ">Active Channels</h4>
 <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 italic">2 Stable Releases</span>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 group/chan hover:border-[#0089D1] transition-all cursor-pointer">
 <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
 <span className="text-[10px] font-black text-slate-600 ">Production Hub</span>
 </div>
 <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 group/chan hover:border-amber-400 transition-all cursor-pointer">
 <div className="w-3 h-3 rounded-full bg-slate-300 shrink-0" />
 <span className="text-[10px] font-black text-slate-400 italic group-hover/chan:text-amber-500 transition-colors">Staging Dev</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Right Panel: Content & Branding */}
 <div className="lg:w-1/2 space-y-10">
 <div className="bg-slate-900 p-12 rounded-[60px] text-white space-y-10 shadow-2xl relative overflow-hidden group">
 <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#0089D1]/10 rounded-full blur-[100px] -mr-40 -mb-40" />

 <div className="flex items-center gap-6 relative z-10">
 <div className="p-5 bg-white/10 rounded-[30px] border border-white/10 text-[#0089D1]">
 <Layout className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-3xl font-black tracking-tight leading-none">Banner Content</h3>
 <p className="text-[10px] font-black text-white/40 tracking-[0.2em] mt-2 italic">Landing Page Promotion</p>
 </div>
 </div>

 <div className="space-y-8 relative z-10">
 <div className="space-y-4">
 <label className="text-[10px] font-black text-white/30 tracking-[0.2em] ml-4">Download Section Title</label>
 <input
 type="text"
 value={downloadTitle}
 onChange={(e) => setDownloadTitle(e.target.value)}
 placeholder="Enter CTA Title"
 className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[32px] text-xs font-bold text-white outline-none hover:border-white/20 focus:ring-8 focus:ring-white/5 transition-all shadow-inner"
 />
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-black text-white/30 tracking-[0.2em] ml-4">Marketing Description</label>
 <textarea
 rows={4}
 value={downloadDesc}
 onChange={(e) => setDownloadDesc(e.target.value)}
 placeholder="Enter secondary marketing text..."
 className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[40px] text-xs font-medium text-white/80 outline-none hover:border-white/20 focus:ring-8 focus:ring-white/5 transition-all shadow-inner resize-none"
 />
 </div>
 </div>

 <div className="pt-6 relative z-10 grid grid-cols-2 gap-6">
 <button className="flex items-center justify-center gap-3 w-full py-5 bg-white text-slate-900 rounded-[32px] text-[10px] font-black tracking-[0.2em] hover:scale-[1.03] active:scale-95 transition-all">
 <ImageIcon className="w-5 h-5" /> Change Assets
 </button>
 <button className="flex items-center justify-center gap-3 w-full py-5 bg-blue-500 text-white rounded-[32px] text-[10px] font-black tracking-[0.2em] hover:bg-blue-600 transition-all">
 <Share2 className="w-5 h-5" /> Share Report
 </button>
 </div>
 </div>

 <div className="p-10 bg-emerald-50/50 rounded-[50px] border border-emerald-100 flex items-start gap-6 group hover:bg-emerald-50 transition-colors duration-500">
 <div className="p-4 bg-white rounded-[24px] text-emerald-500 shadow-sm border border-emerald-50 group-hover:scale-110 transition-transform">
 <Zap className="w-6 h-6" />
 </div>
 <div className="space-y-3">
 <h4 className="text-sm font-black text-emerald-900 ">Growth Engine Active</h4>
 <p className="text-[10px] font-medium text-emerald-800/60 leading-relaxed">
 Linking your apps to the official stores directly impacts your **Organic Acquisition Rate (OAR)**.
 Ensure you've updated the **App-Ads.txt** file on your root domain for monetization compliance.
 </p>
 <button className="flex items-center gap-2 text-[10px] font-black text-emerald-600 hover:underline transition-all">
 Learn More <ArrowRight className="w-3 h-3" />
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};
