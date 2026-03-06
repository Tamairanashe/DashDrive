import React, { useState } from 'react';
import {
 Settings2,
 ToggleLeft,
 Smartphone,
 Layers,
 Zap,
 Clock,
 ChevronRight,
 Save,
 Rocket,
 Shield,
 RefreshCw,
 Package,
 Bell,
 Flag,
 LayoutGrid,
 Activity,
 Box,
 CreditCard,
 Brain,
 Scan,
 Share2,
 Sparkles,
 ShieldCheck,
 Cpu,
 Network,
 MessageSquare,
 Globe,
 Lock,
 Eye,
 ZapOff,
 Monitor,
 Key,
 UserCheck,
 RotateCcw,
 Bot
} from 'lucide-react';
import { cn } from '../utils';

interface GeneralConfigProps {
 activeTab?: string;
}

export const GeneralConfig: React.FC<GeneralConfigProps> = ({ activeTab: externalTab }) => {
 // Internal mapping from sidebar labels to component tab names
 const tabMapping: Record<string, string> = {
 'Logic Engine': 'Logic',
 'Service Groups': 'Service',
 'Feature Flags': 'Feature',
 'App Versioning': 'Versioning',
 'Notifications': 'Notifications',
 '3rd Party APIs': '3rd Party',
 'Face Verification': 'Face Verification',
 'AI Setup': 'AI Setup'
 };

 const activeTab = (externalTab && tabMapping[externalTab]) || 'Logic';

 const [activeInternalTab, setActiveInternalTab] = useState(activeTab);

 // Keep internal state in sync with external prop if it changes
 React.useEffect(() => {
 if (externalTab && tabMapping[externalTab]) {
 setActiveInternalTab(tabMapping[externalTab]);
 }
 }, [externalTab]);

 // Notifications State
 const [emailEnabled, setEmailEnabled] = useState(true);
 const [pushEnabled, setPushEnabled] = useState(true);
 const [smsEnabled, setSmsEnabled] = useState(false);
 const [criticalAlerts, setCriticalAlerts] = useState(true);

 // 3rd Party State
 const [googleCloudKey, setGoogleCloudKey] = useState('AIzaSyD-Lq9...');
 const [awsAccessKey, setAwsAccessKey] = useState('AKIA...');
 const [firebaseStatus, setFirebaseStatus] = useState('Active');

 // Face Verification State
 const [verificationThreshold, setVerificationThreshold] = useState(0.85);
 const [livenessCheck, setLivenessCheck] = useState(true);
 const [maskDetection, setMaskDetection] = useState(false);

 // AI Setup State
 const [selectedModel, setSelectedModel] = useState('GPT-4o');
 const [aiRole, setAiRole] = useState('Negotiation Assistant');
 const [maxTokens, setMaxTokens] = useState(2048);
 const [temperature, setTemperature] = useState(0.7);

 const featureFlags = [
 { name: 'AI Price Negotiation', description: 'Enable machine learning assisted bidding for drivers.', status: true, risky: true },
 { name: 'Instant Payout v2', description: 'Real-time fund transfer to driver wallets via API.', status: true, risky: false },
 { name: 'Dark Mode App v3', description: 'Beta access for 5% of user base.', status: false, risky: false },
 { name: 'Loyalty Rewards Hub', description: 'New points-to-cash redemption system.', status: true, risky: false },
 { name: 'Multi-Stop Delivery', description: 'Allow users to add up to 3 stops per trip.', status: false, risky: true },
 ];

 const renderLogic = () => (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-black">
 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center gap-4 mb-2">
 <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500">
 <Rocket className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900">Platform Logic</h3>
 <p className="text-xs font-medium text-slate-400">Core operational behavior and limits.</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {[
 { label: 'Booking Distance Limit', value: '15.0 km', icon: Flag },
 { label: 'Merchant Comm. Rate', value: '15.0%', icon: CreditCard },
 { label: 'Order Auto-Cancel (min)', value: '10 min', icon: Clock },
 { label: 'Min Wallet Balance', value: '₦ 500.00', icon: Package },
 { label: 'Max Driver Search Radius', value: '5.0 km', icon: Globe },
 { label: 'Idle Timeout', value: '300s', icon: Activity }
 ].map((logic, i) => (
 <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100 group hover:border-[#0089D1]/30 transition-all duration-300">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-white rounded-xl text-slate-400 group-hover:text-[#0089D1] transition-colors shadow-sm">
 <logic.icon className="w-4 h-4" />
 </div>
 <span className="text-xs font-black text-slate-900">{logic.label}</span>
 </div>
 <div className="flex items-center gap-4">
 <span className="text-sm font-black text-[#0089D1]">{logic.value}</span>
 <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors"><Settings2 className="w-4 h-4" /></button>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 );

 const renderService = () => (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {[
 { title: 'Ride Hailing', type: 'High Priority', limit: '500 active/hr', icon: Rocket, users: '45.2k' },
 { title: 'Food Delivery', type: 'Medium Priority', limit: '1.2k active/hr', icon: Package, users: '128k' },
 { title: 'Mart Logistics', type: 'Critical', limit: '200 active/hr', icon: Box, users: '12.5k' }
 ].map((service, i) => (
 <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
 <div className="flex items-center justify-between">
 <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-200">
 <service.icon className="w-6 h-6" />
 </div>
 <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">Active</span>
 </div>
 <div>
 <h4 className="text-lg font-black text-slate-900">{service.title}</h4>
 <p className="text-[10px] font-bold text-slate-400 mt-1">{service.type}</p>
 </div>
 <div className="pt-4 border-t border-slate-50 space-y-3">
 <div className="flex justify-between text-[10px] font-black text-slate-400">
 <span>Concurrency Limit</span>
 <span className="text-slate-900">{service.limit}</span>
 </div>
 <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
 <div className="h-full bg-[#0089D1] w-[65%]" />
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 );

 const renderFeature = () => (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center justify-between mb-2">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-amber-50 rounded-2xl text-amber-500">
 <Zap className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900">Feature Flags</h3>
 <p className="text-xs font-medium text-slate-400">Manage dynamic UI and operational switches.</p>
 </div>
 </div>
 <span className="text-[10px] font-black text-slate-300 ">v2.4.0 Logic Engine</span>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {featureFlags.map((flag, i) => (
 <div key={i} className="flex items-center justify-between p-8 bg-slate-50 rounded-[40px] border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 group">
 <div className="flex-1 mr-6">
 <div className="flex items-center gap-2">
 <h4 className="text-sm font-black text-slate-900">{flag.name}</h4>
 {flag.risky && <span className="text-[7px] font-black bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full tracking-tighter border border-rose-200">Experimental</span>}
 </div>
 <p className="text-xs font-medium text-slate-400 mt-2 line-clamp-2">{flag.description}</p>
 </div>
 <button
 className={cn(
 "w-14 h-8 rounded-full p-1.5 transition-all duration-300 flex items-center shadow-inner",
 flag.status ? "bg-emerald-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-5 h-5 bg-white rounded-full shadow-md" />
 </button>
 </div>
 ))}
 </div>
 </div>
 </div>
 );

 const renderVersioning = () => (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
 <div className="flex items-center justify-between mb-10">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500">
 <RefreshCw className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900">App Governance</h3>
 <p className="text-xs font-medium text-slate-400 mt-1">Version compatibility and rollout management.</p>
 </div>
 </div>
 <button className="px-8 py-3.5 bg-rose-50 text-rose-500 border border-rose-100 rounded-2xl text-[10px] font-black hover:bg-rose-500 hover:text-white transition-all">Force All Updates</button>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {[
 { os: 'iOS Platform', current: '2.4.12', min: '2.4.0', rollout: '100%', icon: Smartphone, color: 'text-indigo-500', build: '2401A' },
 { os: 'Android OS', current: '2.4.15', min: '2.3.8', rollout: '95%', icon: LayoutGrid, color: 'text-emerald-500', build: '2401B' }
 ].map((app, i) => (
 <div key={i} className="p-10 bg-slate-50 rounded-[48px] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-2xl transition-all duration-500">
 <div className="flex items-center gap-8">
 <div className={cn("p-6 rounded-[28px] bg-white shadow-lg transition-transform group-hover:scale-110", app.color)}>
 <app.icon className="w-10 h-10" />
 </div>
 <div>
 <h4 className="text-lg font-black text-slate-900 mb-2">{app.os}</h4>
 <div className="flex items-center gap-4">
 <div className="px-3 py-1 bg-white rounded-lg border border-slate-100 shadow-sm">
 <span className="text-[10px] font-black text-slate-900 ">v{app.current}</span>
 </div>
 <span className="text-[10px] font-bold text-slate-400 ">Build {app.build}</span>
 </div>
 <div className="mt-4 flex items-center gap-2">
 <span className="text-[9px] font-black text-rose-500 tracking-tighter">Min Required: v{app.min}</span>
 </div>
 </div>
 </div>
 <div className="text-right">
 <p className="text-[10px] font-black text-slate-400 mb-2">Rollout Status</p>
 <p className="text-3xl font-black text-slate-900 leading-none">{app.rollout}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 );

 const renderNotifications = () => (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500">
 <Bell className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900">Push & Alert Channels</h3>
 <p className="text-xs font-medium text-slate-400">System broadcast and user notification routing.</p>
 </div>
 </div>

 <div className="space-y-4">
 {[
 { label: 'Email Notifications', enabled: emailEnabled, setter: setEmailEnabled, icon: MessageSquare },
 { label: 'Push Notifications', enabled: pushEnabled, setter: setPushEnabled, icon: Smartphone },
 { label: 'SMS Gateway', enabled: smsEnabled, setter: setSmsEnabled, icon: Monitor },
 { label: 'Critical System Alerts', enabled: criticalAlerts, setter: setCriticalAlerts, icon: Zap }
 ].map((notif, i) => (
 <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-white rounded-xl text-slate-400 shadow-sm">
 <notif.icon className="w-4 h-4" />
 </div>
 <span className="text-xs font-black text-slate-900">{notif.label}</span>
 </div>
 <button
 onClick={() => notif.setter(!notif.enabled)}
 className={cn(
 "w-12 h-7 rounded-full p-1 transition-all duration-300 flex items-center shadow-inner",
 notif.enabled ? "bg-indigo-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-5 h-5 bg-white rounded-full shadow-md" />
 </button>
 </div>
 ))}
 </div>
 </div>

 <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl space-y-8 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
 <div className="flex items-center gap-4 relative z-10">
 <div className="p-4 bg-white/10 rounded-2xl text-indigo-400">
 <Layers className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black">Escalation Logic</h3>
 <p className="text-xs font-medium text-white/40">Automated retry and fallback strategies.</p>
 </div>
 </div>
 <div className="space-y-6 relative z-10">
 <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] space-y-4">
 <p className="text-[10px] font-black text-indigo-300">Retry Policy (Internal)</p>
 <div className="flex items-center justify-between text-sm font-black">
 <span>Max Retries</span>
 <span className="text-indigo-400">3 Attempts</span>
 </div>
 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
 <div className="h-full bg-indigo-500 w-[60%]" />
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );

 const renderThirdParty = () => (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-10">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-slate-900 text-white rounded-2xl">
 <Share2 className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900">External Ecosystem</h3>
 <p className="text-xs font-medium text-slate-400">Connected services and integration health.</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {[
 { name: 'Google Cloud Platform', key: googleCloudKey, status: 'Connected', icon: Globe, color: 'text-blue-500' },
 { name: 'Amazon Web Services', key: awsAccessKey, status: 'Limited', icon: Network, color: 'text-amber-500' },
 { name: 'Firebase / FCM', key: 'Active Tunnel', status: firebaseStatus, icon: Zap, color: 'text-orange-500' }
 ].map((svc, i) => (
 <div key={svc.name} className="p-8 bg-slate-50 border border-slate-100 rounded-[40px] space-y-6 group hover:border-slate-300 transition-all">
 <div className="flex items-center justify-between">
 <svc.icon className={cn("w-6 h-6", svc.color)} />
 <span className={cn(
 "px-3 py-1 rounded-full text-[8px] font-black ",
 svc.status === 'Connected' || svc.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
 )}>{svc.status}</span>
 </div>
 <div>
 <h4 className="text-sm font-black text-slate-900">{svc.name}</h4>
 <div className="mt-3 p-4 bg-white border border-slate-100 rounded-2xl relative overflow-hidden">
 <code className="text-[10px] font-bold text-slate-400 block truncate">{svc.key}</code>
 <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900"><Key className="w-3 h-3" /></button>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 );

 const renderFaceVerification = () => (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
 <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
 <div className="space-y-8 relative z-10">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-white/10 rounded-2xl text-rose-400">
 <Scan className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black">Biometric Engine</h3>
 <p className="text-xs font-medium text-white/40">Face matching and liveness detection parameters.</p>
 </div>
 </div>

 <div className="space-y-8">
 <div className="space-y-4">
 <div className="flex items-center justify-between text-[10px] font-black text-rose-300">
 <span>Match Confidence Threshold</span>
 <span>{(verificationThreshold * 100).toFixed(0)}%</span>
 </div>
 <input
 type="range"
 min="0.5"
 max="1.0"
 step="0.01"
 value={verificationThreshold}
 onChange={(e) => setVerificationThreshold(parseFloat(e.target.value))}
 className="w-full h-1.5 bg-white/10 rounded-full appearance-none outline-none cursor-pointer accent-rose-500"
 />
 </div>

 <div className="grid grid-cols-2 gap-4">
 {[
 { label: 'Liveness Check', enabled: livenessCheck, setter: setLivenessCheck },
 { label: 'Mask Detection', enabled: maskDetection, setter: setMaskDetection }
 ].map((opt, i) => (
 <button
 key={i}
 onClick={() => opt.setter(!opt.enabled)}
 className={cn(
 "p-6 rounded-[32px] border transition-all duration-500 text-left",
 opt.enabled ? "bg-rose-500 border-rose-400 shadow-lg shadow-rose-900/40" : "bg-white/5 border-white/10 text-white/40"
 )}
 >
 <p className="text-[10px] font-black mb-1">{opt.label}</p>
 <p className="text-sm font-black text-white">{opt.enabled ? 'ENABLED' : 'DISABLED'}</p>
 </button>
 ))}
 </div>
 </div>
 </div>
 <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-between relative z-10">
 <div className="flex items-center gap-3">
 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
 <span className="text-[10px] font-black ">Active Provider: AWS Rekognition</span>
 </div>
 <Settings2 className="w-4 h-4 text-white/20" />
 </div>
 </div>

 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8 flex flex-col justify-center">
 <div className="text-center space-y-6">
 <div className="w-32 h-32 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center mx-auto relative">
 <UserCheck className="w-12 h-12 text-slate-300" />
 <div className="absolute inset-0 border-2 border-slate-900 rounded-full border-t-transparent animate-spin" />
 </div>
 <div>
 <h4 className="text-lg font-black text-slate-900 tracking-tight">Real-time Verification Stream</h4>
 <p className="text-xs font-medium text-slate-400">System is ready for driver onboarding biometrics.</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 );

 const renderAISetup = () => (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-12">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl">
 <Brain className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">AI Intelligence Governance</h3>
 <p className="text-xs font-medium text-slate-400 mt-1">LLM orchestration and automated logic models.</p>
 </div>
 </div>
 <div className="flex items-center gap-4">
 <button className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black hover:bg-slate-100 transition-all">Cost Analytics</button>
 <button className="px-6 py-3 bg-[#0089D1] text-white rounded-2xl text-[10px] font-black shadow-lg shadow-[#0089D1]/20">Deploy Model</button>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
 <div className="lg:col-span-2 space-y-10">
 <div className="space-y-4">
 <label className="text-[10px] font-black text-slate-400 ml-1">Foundation Model</label>
 <div className="grid grid-cols-2 gap-4">
 {['GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro', 'Llama 3 (Self-host)'].map(model => (
 <button
 key={model}
 onClick={() => setSelectedModel(model)}
 className={cn(
 "px-8 py-5 rounded-[32px] border text-xs font-black transition-all text-left group",
 selectedModel === model ? "bg-slate-900 border-slate-900 text-white shadow-2xl" : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300"
 )}
 >
 <div className="flex items-center justify-between mb-2">
 <Bot className={cn("w-4 h-4", selectedModel === model ? "text-indigo-400" : "text-slate-300")} />
 {selectedModel === model && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />}
 </div>
 {model}
 </button>
 ))}
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-black text-slate-400 ml-1">AI operational role</label>
 <select
 value={aiRole}
 onChange={(e) => setAiRole(e.target.value)}
 className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[32px] text-xs font-black text-slate-900 outline-none hover:border-[#0089D1]/30 transition-all appearance-none"
 >
 <option>Negotiation Assistant</option>
 <option>Logistics Router</option>
 <option>Customer Sentiment Bot</option>
 <option>Fraud Detector</option>
 </select>
 </div>
 </div>

 <div className="lg:col-span-2 bg-slate-50 rounded-[48px] border border-slate-100 p-10 space-y-10">
 <div className="space-y-3">
 <div className="flex items-center justify-between text-[10px] font-black text-slate-900 ">
 <span>Model Temperature</span>
 <span className="text-[#0089D1]">{temperature}</span>
 </div>
 <input
 type="range"
 min="0"
 max="1.0"
 step="0.1"
 value={temperature}
 onChange={(e) => setTemperature(parseFloat(e.target.value))}
 className="w-full h-1.5 bg-slate-200 rounded-full appearance-none outline-none cursor-pointer accent-slate-900"
 />
 <div className="flex justify-between text-[8px] font-black text-slate-300 mt-2">
 <span>Deterministic</span>
 <span>Creative</span>
 </div>
 </div>

 <div className="pt-10 border-t border-slate-200 grid grid-cols-2 gap-8">
 <div>
 <p className="text-[10px] font-black text-slate-400 mb-2">Context Window</p>
 <p className="text-2xl font-black text-slate-900 tracking-tighter">128k <span className="text-[10px] text-slate-300">TOKENS</span></p>
 </div>
 <div>
 <p className="text-[10px] font-black text-slate-400 mb-2">Latency (Avg)</p>
 <p className="text-2xl font-black text-slate-900 tracking-tighter">840ms <span className="text-[10px] text-slate-300">P95</span></p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );

 return (
 <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <div className="flex items-center gap-2 mb-2">
 <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em]">Governance</span>
 <ChevronRight className="w-3 h-3 text-slate-300" />
 <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em]">Logic</span>
 </div>
 <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">General Config</h1>
 <p className="text-sm font-medium text-slate-400 mt-4 max-w-md">Platform behavior orchestration, feature flags, and versioning.</p>
 </div>

 <div className="flex items-center gap-4 shrink-0">
 <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-[24px] text-xs font-black hover:bg-slate-50 hover:text-slate-600 transition-all">
 <RotateCcw className="w-5 h-5" /> Reset
 </button>
 <button className="flex items-center gap-3 px-10 py-4 bg-[#0089D1] text-white rounded-[24px] text-xs font-black hover:bg-[#007AB8] transition-all shadow-xl shadow-[#0089D1]/20">
 <Save className="w-5 h-5" /> Persist Changes
 </button>
 </div>
 </div>

 {activeInternalTab === 'Logic' && renderLogic()}
 {activeInternalTab === 'Service' && renderService()}
 {activeInternalTab === 'Feature' && renderFeature()}
 {activeInternalTab === 'Versioning' && renderVersioning()}
 {activeInternalTab === 'Notifications' && renderNotifications()}
 {activeInternalTab === '3rd Party' && renderThirdParty()}
 {activeInternalTab === 'Face Verification' && renderFaceVerification()}
 {activeInternalTab === 'AI Setup' && renderAISetup()}
 </div>
 );
};
