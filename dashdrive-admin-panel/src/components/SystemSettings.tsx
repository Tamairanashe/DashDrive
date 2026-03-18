import React, { useState } from 'react';
import {
 Settings,
 Key,
 Mail,
 Smartphone,
 Shield,
 Globe,
 Database,
 Cpu,
 Zap,
 Lock,
 Eye,
 EyeOff,
 Save,
 RefreshCw,
 ChevronRight,
 AlertTriangle,
 Server,
 Code,
 Apple,
 CheckCircle2,
 History,
 Activity,
 Trash2,
 RotateCcw,
 Monitor,
 Bell,
 CreditCard,
 Map,
 MessageSquare,
 BarChart3,
 Fingerprint,
 ShieldCheck,
 UserPlus,
 Webhook,
 Link as LinkIcon,
 AlertCircle,
 Terminal,
 MapPin,
 Radio
} from 'lucide-react';
import { cn } from '../utils';

interface SystemSettingsProps {
 activeTab?: string;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({ activeTab: externalTab }) => {
 // Internal mapping from sidebar labels to component tab names
 const tabMapping: Record<string, string> = {
 'Infrastructure': 'General',
 'Integrations': 'Integrations',
 'Security Policies': 'Security',
 'Webhooks': 'Webhooks'
 };

 const activeTab = (externalTab && tabMapping[externalTab]) || 'General';

 const [activeInternalTab, setActiveInternalTab] = useState(activeTab);

 // Keep internal state in sync with external prop if it changes
 React.useEffect(() => {
 if (externalTab && tabMapping[externalTab]) {
 setActiveInternalTab(tabMapping[externalTab]);
 }
 }, [externalTab]);

 const [showApiKey, setShowApiKey] = useState(false);
 const [isMaintenance, setIsMaintenance] = useState(false);

 // Expanded System States
 const [environment, setEnvironment] = useState('Production');
 const [minAndroidVersion, setMinAndroidVersion] = useState('2.4.0');
 const [minIosVersion, setMinIosVersion] = useState('2.3.5');
 const [forceUpdate, setForceUpdate] = useState(false);
 const [isCleaningDB, setIsCleaningDB] = useState(false);
 const [lastCleanDate, setLastCleanDate] = useState('2026-02-23');

 // Integrations State
 const [activeGateways, setActiveGateways] = useState(['Stripe', 'PayPal']);
 const [mapProvider, setMapProvider] = useState('Google Maps');
 const [smsProvider, setSmsProvider] = useState('Twilio');
 const [emailProvider, setEmailProvider] = useState('SendGrid');

 // Security State
 const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
 const [passwordStrength, setPasswordStrength] = useState('Strong');
 const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
 const [sessionTimeout, setSessionTimeout] = useState(30);

 // Webhooks State
 const [webhookUrl, setWebhookUrl] = useState('https://api.external-service.com/hooks');
 const [webhookSecret, setWebhookSecret] = useState('whsec_51M3vBfDashDrive_... ');
 const [selectedEvents, setSelectedEvents] = useState(['trip.created', 'trip.completed', 'payment.success']);

 const renderGeneral = () => (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {/* Core Infrastructure */}
 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center gap-4 mb-2">
 <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500">
 <Server className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900">Core Infrastructure</h3>
 <p className="text-xs font-medium text-slate-400">Environment and server-side parameters.</p>
 </div>
 </div>

 <div className="space-y-6">
 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
 <div>
 <p className="text-xs font-black text-slate-900">Maintenance Mode</p>
 <p className="text-[10px] font-medium text-slate-400 mt-1">Suspend all client-side requests.</p>
 </div>
 <button
 onClick={() => setIsMaintenance(!isMaintenance)}
 className={cn(
 "w-14 h-8 rounded-full p-1 transition-all duration-300",
 isMaintenance ? "bg-rose-500" : "bg-slate-200"
 )}
 >
 <div className={cn(
 "w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-sm",
 isMaintenance ? "translate-x-6" : "translate-x-0"
 )} />
 </button>
 </div>

 <div className="space-y-2">
 <label className="text-[10px] font-black text-slate-400 ml-1">Environment URL</label>
 <div className="flex items-center gap-3">
 <input
 type="text"
 value="https://api.dashdrive.io/v2"
 disabled
 className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-500"
 />
 <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"><RefreshCw className="w-4 h-4" /></button>
 </div>
 </div>
 </div>
 </div>

 {/* API & Security */}
 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8 text-black">
 <div className="flex items-center gap-4 mb-2">
 <div className="p-3 bg-amber-50 rounded-2xl text-amber-500">
 <Key className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900">API Gateway</h3>
 <p className="text-xs font-medium text-slate-400">Authentication and external integrations.</p>
 </div>
 </div>

 <div className="space-y-6">
 <div className="space-y-2">
 <label className="text-[10px] font-black text-slate-400 ml-1">Master API Key</label>
 <div className="relative">
 <input
 type={showApiKey ? "text" : "password"}
 value="sk_live_51M3vBfDashDrive_90jK2L_Xyz987"
 disabled
 className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900"
 />
 <button
 onClick={() => setShowApiKey(!showApiKey)}
 className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-900 transition-colors"
 >
 {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
 </button>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <button className="py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black hover:bg-slate-800 transition-all">Rotate Keys</button>
 <button className="py-4 bg-white border border-slate-100 text-slate-900 rounded-2xl text-[10px] font-black hover:bg-slate-50 transition-all">Documentation</button>
 </div>
 </div>
 </div>

 {/* 3. Cloud Engine Setup */}
 <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32" />
 <div className="flex items-center gap-4 mb-8 relative z-10">
 <div className="p-3 bg-white/10 rounded-2xl text-emerald-400">
 <Cpu className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-xl font-black">Cloud Engine</h3>
 <p className="text-[10px] font-black text-white/30 mt-1">Infrastructure Setup</p>
 </div>
 </div>

 <div className="space-y-4 relative z-10">
 {['Development', 'Staging', 'Production'].map((env) => (
 <button
 key={env}
 onClick={() => setEnvironment(env)}
 className={cn(
 "w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group",
 environment === env
 ? env === 'Production'
 ? "bg-emerald-600 border-emerald-500"
 : "bg-white/10 border-white/20"
 : "bg-white/5 border-white/5 hover:border-white/20"
 )}
 >
 <div className="flex items-center gap-3">
 <div className={cn(
 "w-2 h-2 rounded-full",
 env === 'Production' ? "bg-emerald-400" : env === 'Staging' ? "bg-amber-400" : "bg-blue-400"
 )} />
 <span className="font-black text-[10px]">{env}</span>
 </div>
 {environment === env && <CheckCircle2 className="w-4 h-4 text-white/50" />}
 </button>
 ))}
 </div>
 </div>

 {/* 4. App Version Governance */}
 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-500">
 <Monitor className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900">Version Governance</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Platform Thresholds</p>
 </div>
 </div>
 <button
 onClick={() => setForceUpdate(!forceUpdate)}
 className={cn(
 "w-10 h-5 rounded-full p-0.5 transition-all duration-300 flex items-center",
 forceUpdate ? "bg-rose-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
 </button>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
 <p className="text-[8px] font-black text-slate-400 ">Android Min</p>
 <input
 type="text"
 value={minAndroidVersion}
 onChange={(e) => setMinAndroidVersion(e.target.value)}
 className="w-full bg-transparent text-lg font-black text-slate-900 outline-none"
 />
 </div>
 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
 <p className="text-[8px] font-black text-slate-400 ">iOS Min Build</p>
 <input
 type="text"
 value={minIosVersion}
 onChange={(e) => setMinIosVersion(e.target.value)}
 className="w-full bg-transparent text-lg font-black text-slate-900 outline-none"
 />
 </div>
 </div>
 </div>

 {/* 5. Database Maintenance Hub */}
 <div className="col-span-full bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
 <div className="flex items-center gap-6">
 <div className={cn(
 "p-6 rounded-[28px] transition-all duration-500",
 isCleaningDB ? "bg-emerald-600 text-white animate-spin-slow" : "bg-slate-900 text-white"
 )}>
 <Database className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900">Database Maintenance</h3>
 <div className="flex items-center gap-3 mt-2">
 <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full">
 <History className="w-2.5 h-2.5 text-slate-400" />
 <span className="text-[8px] font-black text-slate-500 ">Last: {lastCleanDate}</span>
 </div>
 <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full">
 <Activity className="w-2.5 h-2.5 text-emerald-500" />
 <span className="text-[8px] font-black text-emerald-600 ">Health: 98%</span>
 </div>
 </div>
 </div>
 </div>

 <button
 disabled={isCleaningDB}
 onClick={() => {
 setIsCleaningDB(true);
 setTimeout(() => {
 setIsCleaningDB(false);
 setLastCleanDate(new Date().toISOString().split('T')[0]);
 }, 2000);
 }}
 className={cn(
 "flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black transition-all",
 isCleaningDB ? "bg-slate-100 text-slate-400" : "bg-rose-500 text-white shadow-lg shadow-rose-200"
 )}
 >
 {isCleaningDB ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
 {isCleaningDB ? "Purging..." : "Clean Cache"}
 </button>
 </div>
 </div>
 </div>

 {/* Integration Providers */}
 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
 <h3 className="text-xl font-black text-slate-900 mb-10 tracking-tight">External Providers</h3>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {[
 { name: 'SMTP (AWS SES)', icon: Mail, status: 'Connected', usage: 'Email Notifications' },
 { name: 'SMS (Twilio)', icon: Smartphone, status: 'Connected', usage: 'OTP & Verification' },
 { name: 'Maps (Google)', icon: Globe, status: 'Connected', usage: 'Routing & Geofencing' },
 { name: 'Payment (Stripe)', icon: Database, status: 'Limited', usage: 'Driver Payouts' },
 { name: 'Compute (EC2)', icon: Cpu, status: 'Healthy', usage: 'Backend Processor' },
 { name: 'Storage (S3)', icon: Database, status: 'Healthy', usage: 'Static Asset Store' }
 ].map((provider, i) => (
 <div key={i} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:border-[#0089D1]/30 transition-all duration-300">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-white rounded-2xl text-slate-400 group-hover:text-[#0089D1] transition-colors shadow-sm">
 <provider.icon className="w-5 h-5" />
 </div>
 <div>
 <h4 className="text-xs font-black text-slate-900">{provider.name}</h4>
 <p className="text-[10px] font-bold text-slate-400 mt-0.5">{provider.usage}</p>
 </div>
 </div>
 <div className={cn(
 "px-2 py-1 rounded-lg text-[8px] font-black ",
 provider.status === 'Connected' || provider.status === 'Healthy' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
 )}>
 {provider.status}
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 );

 const renderIntegrations = () => (
 <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-indigo-50 rounded-[28px] text-indigo-500">
 <CreditCard className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900">Payments</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Transaction Gateways</p>
 </div>
 </div>
 <div className="space-y-4 flex-1">
 {['Stripe', 'PayPal', 'Flutterwave', 'Razorpay'].map((gateway) => (
 <div key={gateway} className="flex items-center justify-between p-5 bg-slate-50 rounded-[32px] border border-slate-100 group hover:border-indigo-200 transition-all">
 <span className="text-xs font-black text-slate-900 ">{gateway}</span>
 <button
 onClick={() => {
 if (activeGateways.includes(gateway)) {
 setActiveGateways(activeGateways.filter(g => g !== gateway));
 } else {
 setActiveGateways([...activeGateways, gateway]);
 }
 }}
 className={cn(
 "w-12 h-6 rounded-full p-1 transition-all duration-300 flex items-center",
 activeGateways.includes(gateway) ? "bg-indigo-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
 </button>
 </div>
 ))}
 </div>
 </div>

 <div className="bg-slate-900 p-10 rounded-[60px] text-white shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32" />
 <div className="flex items-center gap-4 mb-8 relative z-10">
 <div className="p-4 bg-white/10 rounded-[28px] text-emerald-400">
 <MapPin className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black">Map & Location</h3>
 <p className="text-[10px] font-black text-white/30 mt-1">Geospatial Engine</p>
 </div>
 </div>
 <div className="space-y-4 relative z-10">
 {['Google Maps', 'Mapbox', 'OpenStreetMap'].map((provider) => (
 <button
 key={provider}
 onClick={() => setMapProvider(provider)}
 className={cn(
 "w-full p-5 rounded-[32px] border transition-all duration-300 flex items-center justify-between group",
 mapProvider === provider ? "bg-emerald-600 border-emerald-500 shadow-xl" : "bg-white/5 border-white/5 hover:border-white/20"
 )}
 >
 <span className="text-xs font-black ">{provider}</span>
 {mapProvider === provider && <CheckCircle2 className="w-5 h-5 text-white/50" />}
 </button>
 ))}
 </div>
 </div>

 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-amber-50 rounded-[28px] text-amber-500">
 <MessageSquare className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Communication</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">SMS & Notification</p>
 </div>
 </div>
 <div className="space-y-6">
 <div className="space-y-2">
 <label className="text-[10px] font-black text-slate-400 ml-1">SMS Provider</label>
 <select
 value={smsProvider}
 onChange={(e) => setSmsProvider(e.target.value)}
 className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[28px] text-xs font-black text-slate-900 outline-none"
 >
 <option>Twilio</option>
 <option>Nexmo (Vonage)</option>
 <option>Firebase FCM</option>
 </select>
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-slate-400 ml-1">Email System</label>
 <select
 value={emailProvider}
 onChange={(e) => setEmailProvider(e.target.value)}
 className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[28px] text-xs font-black text-slate-900 outline-none"
 >
 <option>SendGrid</option>
 <option>Mailgun</option>
 <option>AWS SES</option>
 </select>
 </div>
 </div>
 </div>
 </div>
 </div>
 );

 const renderSecurity = () => (
 <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-rose-50 rounded-[28px] text-rose-500">
 <ShieldCheck className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900">Authentication</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Access Control Policies</p>
 </div>
 </div>
 <div className="space-y-6">
 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100">
 <div>
 <p className="text-xs font-black text-slate-900">Two-Factor Authentication (2FA)</p>
 <p className="text-[10px] font-medium text-slate-400 mt-1">Mandatory for all admin staff.</p>
 </div>
 <button
 onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
 className={cn(
 "w-14 h-8 rounded-full p-1 transition-all duration-300",
 twoFactorEnabled ? "bg-emerald-500" : "bg-slate-200"
 )}
 >
 <div className={cn(
 "w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-sm",
 twoFactorEnabled ? "translate-x-6" : "translate-x-0"
 )} />
 </button>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div className="p-6 bg-white border border-slate-100 rounded-[32px] space-y-3">
 <p className="text-[10px] font-black text-slate-400 ">Password Strength</p>
 <select
 value={passwordStrength}
 onChange={(e) => setPasswordStrength(e.target.value)}
 className="w-full bg-transparent text-xs font-black text-slate-900 outline-none"
 >
 <option>Standard</option>
 <option>Strong</option>
 <option>Enterprise</option>
 </select>
 </div>
 <div className="p-6 bg-white border border-slate-100 rounded-[32px] space-y-3">
 <p className="text-[10px] font-black text-slate-400 ">Session TTL (Min)</p>
 <input
 type="number"
 value={sessionTimeout}
 onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
 className="w-full bg-transparent text-xs font-black text-slate-900 outline-none"
 />
 </div>
 </div>
 </div>
 </div>

 <div className="bg-slate-900 p-10 rounded-[60px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32" />
 <div className="space-y-8 relative z-10">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-white/10 rounded-[28px] text-rose-400">
 <AlertTriangle className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black">Intrusion Shield</h3>
 <p className="text-[10px] font-black text-white/30 mt-1">Brute Force Prevention</p>
 </div>
 </div>
 <div className="space-y-6">
 <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-between">
 <span className="text-xs font-black text-white/60">Max Failed Attempts</span>
 <input
 type="number"
 value={maxLoginAttempts}
 onChange={(e) => setMaxLoginAttempts(parseInt(e.target.value))}
 className="w-16 bg-transparent text-right font-black text-white outline-none"
 />
 </div>
 <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-between">
 <span className="text-xs font-black text-white/60">Lockout Duration</span>
 <span className="font-black text-white">30 MIN</span>
 </div>
 </div>
 </div>
 </div>

 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm lg:col-span-2 flex flex-col md:flex-row gap-10">
 <div className="flex-1 space-y-8">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-sky-50 rounded-[28px] text-sky-500">
 <UserPlus className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900">Governance Roles</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Cross-Module Access Control</p>
 </div>
 </div>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 {['Super Admin', 'Operator', 'Finance', 'Support'].map(role => (
 <div key={role} className="p-6 bg-slate-50 border border-slate-100 rounded-[32px] text-center">
 <p className="text-[10px] font-black text-slate-900 ">{role}</p>
 <p className="text-[8px] font-bold text-slate-400 mt-2">12 POLICIES</p>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 );

 const renderWebhooks = () => (
 <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-10">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-slate-900 rounded-[28px] text-white">
 <Webhook className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">External Automation</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Real-time Event Webhooks</p>
 </div>
 </div>
 <div className="flex gap-4">
 <button className="px-8 py-4 bg-slate-50 border border-slate-100 rounded-[24px] text-[10px] font-black hover:bg-slate-100 transition-all">Test Webhook</button>
 <button className="px-8 py-4 bg-slate-900 text-white rounded-[24px] text-[10px] font-black shadow-xl shadow-slate-200 hover:scale-[1.02] transition-all">Add Endpoint</button>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 space-y-6">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1 flex items-center gap-2">
 <LinkIcon className="w-3 h-3" /> Endpoint URL
 </label>
 <input
 type="text"
 value={webhookUrl}
 onChange={(e) => setWebhookUrl(e.target.value)}
 className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[32px] text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
 />
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1 flex items-center gap-2">
 <Lock className="w-3 h-3" /> Signing Secret
 </label>
 <div className="relative">
 <input
 type="password"
 value={webhookSecret}
 readOnly
 className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[32px] text-sm font-bold text-slate-400 outline-none"
 />
 <button className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 font-black text-[10px] ">Reveal</button>
 </div>
 </div>
 </div>
 <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-6">
 <h4 className="text-[10px] font-black text-slate-900 ">Active Event Triggers</h4>
 <div className="space-y-3">
 {['trip.created', 'trip.completed', 'payment.success', 'refund.processed'].map(event => (
 <div key={event} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
 <span className="text-[10px] font-bold text-slate-600">{event}</span>
 <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-sm shadow-emerald-200" />
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>

 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm">
 <div className="flex items-center gap-4 mb-8">
 <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500">
 <Terminal className="w-5 h-5" />
 </div>
 <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Deliveries</h3>
 </div>
 <div className="space-y-4">
 {[1, 2, 3].map(i => (
 <div key={i} className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-[32px] group hover:bg-white hover:shadow-lg transition-all cursor-pointer">
 <div className="flex items-center gap-6">
 <div className="p-3 bg-white rounded-xl text-emerald-500 shadow-sm">
 <CheckCircle2 className="w-4 h-4" />
 </div>
 <div>
 <p className="text-[10px] font-black text-slate-900 ">trip.completed</p>
 <p className="text-[8px] font-bold text-slate-400 mt-1">ID: evt_0lx95sh28f â€¢ {i * 2}m ago</p>
 </div>
 </div>
 <div className="flex items-center gap-4">
 <span className="text-[10px] font-black text-slate-300 ">200 OK</span>
 <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 );

 return (
 <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <div className="flex items-center gap-2 mb-2">
 <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em]">Business & Config</span>
 <ChevronRight className="w-3 h-3 text-slate-300" />
 <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em]">System</span>
 </div>
 <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">System Settings</h1>
 <p className="text-sm font-medium text-slate-400 mt-4 max-w-md">Technical infrastructure management and external service orchestration.</p>
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

 {activeInternalTab === 'General' && renderGeneral()}
 {activeInternalTab === 'Integrations' && renderIntegrations()}
 {activeInternalTab === 'Security' && renderSecurity()}
 {activeInternalTab === 'Webhooks' && renderWebhooks()}
 </div>
 );
};
