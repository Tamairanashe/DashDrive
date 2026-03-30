import React, { useState } from 'react';
import {
 ShieldCheck,
 RotateCcw,
 Save,
 Info,
 CheckCircle2,
 Lock,
 Key,
 Globe,
 ExternalLink,
 Zap,
 LayoutDashboard,
 UserCheck,
 Shield
} from 'lucide-react';
import { cn } from '../utils';

export const FaceVerification: React.FC = () => {
 const [enabled, setEnabled] = useState(true);
 const [region, setRegion] = useState('us-east-1');
 const [accessKey, setAccessKey] = useState('');
 const [secretKey, setSecretKey] = useState('');

 const regions = [
 { id: 'us-east-1', name: 'US East (N. Virginia)' },
 { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)' },
 { id: 'eu-west-1', name: 'Europe (Ireland)' },
 { id: 'us-west-2', name: 'US West (Oregon)' }
 ];

 const renderHeader = () => (
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 mt-4">
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg">
 <ShieldCheck className="w-6 h-6" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-black text-slate-400 tracking-[0.2em]">Configuration</span>
 <div className="w-1 h-1 rounded-full bg-slate-200" />
 <span className="text-[10px] font-black text-[#0089D1] tracking-[0.2em]">Identity & Security</span>
 </div>
 <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mt-1">Face Verification</h1>
 </div>
 </div>
 <p className="text-base font-medium text-slate-500 max-w-lg leading-relaxed">
 Configure Amazon Rekognition to enable high-fidelity facial biometric identity verification.
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

 <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
 <div className="bg-white p-12 rounded-[80px] border border-slate-100 shadow-sm space-y-12 relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] -mr-48 -mt-48 transition-all group-hover:bg-blue-500/10" />

 <div className="flex items-center justify-between relative z-10">
 <div className="flex items-center gap-6">
 <div className="p-5 bg-blue-50 text-blue-500 rounded-[32px] shadow-sm">
 <Zap className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-3xl font-black text-slate-900 tracking-tight">Amazon Rekognition</h3>
 <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] mt-1 italic">AWS Biometric Engine</p>
 </div>
 </div>

 <div className="flex items-center gap-8">
 <button className="flex items-center gap-2 text-[10px] font-black text-[#0089D1] hover:underline">
 <ExternalLink className="w-4 h-4" /> How it Works
 </button>
 <label className="flex items-center gap-4 cursor-pointer">
 <span className="text-[10px] font-black text-slate-400 ">{enabled ? 'Enabled' : 'Disabled'}</span>
 <div
 onClick={() => setEnabled(!enabled)}
 className={cn(
 "w-14 h-7 rounded-full p-1 transition-all duration-500 flex items-center",
 enabled ? "bg-blue-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-5 h-5 bg-white rounded-full shadow-lg" />
 </div>
 </label>
 </div>
 </div>

 <div className="space-y-10 relative z-10">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] ml-4">Select Region *</label>
 <div className="relative group">
 <select
 value={region}
 onChange={(e) => setRegion(e.target.value)}
 className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[32px] text-xs font-bold text-slate-600 outline-none hover:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none"
 >
 {regions.map(r => (
 <option key={r.id} value={r.id}>{r.name}</option>
 ))}
 </select>
 <Globe className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
 </div>
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] ml-4">AWS Key Integrity</label>
 <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-[32px] flex items-center gap-4">
 <CheckCircle2 className="w-5 h-5 text-emerald-500" />
 <span className="text-[10px] font-black text-emerald-700 ">Credentials Secured</span>
 </div>
 </div>
 </div>

 <div className="space-y-8">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] ml-4">Access Key *</label>
 <div className="relative group">
 <input
 type="text"
 value={accessKey}
 onChange={(e) => setAccessKey(e.target.value)}
 placeholder="Enter AWS Access Key ID"
 className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[32px] text-xs font-mono text-slate-600 outline-none hover:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all"
 />
 <Key className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
 </div>
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] ml-4">Secret Access Key *</label>
 <div className="relative group">
 <input
 type="password"
 value={secretKey}
 onChange={(e) => setSecretKey(e.target.value)}
 placeholder="Enter AWS Secret Access Key"
 className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[32px] text-xs font-mono text-slate-600 outline-none hover:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all"
 />
 <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
 </div>
 </div>
 </div>
 </div>

 <div className="flex items-center gap-4 relative z-10 pt-4">
 <button
 onClick={() => { setAccessKey(''); setSecretKey(''); }}
 className="flex-1 py-6 bg-slate-50 text-slate-400 rounded-[40px] text-xs font-black tracking-[0.3em] hover:bg-slate-100 transition-all border border-slate-100"
 >
 Reset
 </button>
 <button className="flex-[2] py-6 bg-blue-500 text-white rounded-[40px] text-xs font-black tracking-[0.3em] shadow-2xl shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all">
 Save API Settings
 </button>
 </div>
 </div>

 <div className="mt-8 flex items-start gap-4 p-8 bg-blue-50/50 rounded-[40px] border border-blue-100/50">
 <Info className="w-6 h-6 text-blue-500 mt-1" />
 <div>
 <h4 className="text-sm font-black text-blue-900 ">Compliance Note</h4>
 <p className="text-xs font-medium text-blue-700 leading-relaxed mt-1">
 Facial biometric data is processed securely through Amazon Rekognition server-side.
 Ensure your AWS IAM role has the <code className="bg-white px-2 py-0.5 rounded">AmazonRekognitionFullAccess</code> policy attached for full functionality.
 </p>
 </div>
 </div>
 </div>
 </div>
 );
};
