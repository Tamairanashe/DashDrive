import React, { useState } from 'react';
import { Tabs } from 'antd';
import {
    CreditCard,
    MessageSquare,
    Key,
    Mail,
    Map as MapIcon,
    Shield,
    RotateCcw,
    Save,
    Info,
    CheckCircle2,
    Search,
    ChevronDown,
    Image as ImageIcon,
    Upload,
    Smartphone,
    Globe,
    Zap,
    Lock,
    ExternalLink,
    AlertCircle
} from 'lucide-react';
import { cn } from '../utils';

type ThirdPartyTab = 'Payment' | 'SMS' | 'Firebase' | 'Email' | 'Maps' | 'ReCaptcha';

export const ThirdPartyConfig: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ThirdPartyTab>('Payment');

    const renderHeader = () => (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 mt-4">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 tracking-[0.2em]">Configuration</span>
                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                            <span className="text-[10px] font-black text-[#0089D1] tracking-[0.2em]">3rd Party Services</span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mt-1">Integration Hub</h1>
                    </div>
                </div>
                <p className="text-base font-medium text-slate-500 max-w-lg leading-relaxed">
                    Connect and manage external gateways for payments, messaging, maps, and security.
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

    const renderTabs = () => {
        const items = [
            { id: 'Payment', label: 'Payment Methods', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'SMS', label: 'SMS Gateways', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'Firebase', label: 'Firebase OTP', icon: <Smartphone className="w-4 h-4" /> },
            { id: 'Email', label: 'Email Config', icon: <Mail className="w-4 h-4" /> },
            { id: 'Maps', label: 'Google Map API', icon: <MapIcon className="w-4 h-4" /> },
            { id: 'ReCaptcha', label: 'ReCaptcha', icon: <Shield className="w-4 h-4" /> },
        ].map(tab => ({
            key: tab.id,
            label: (
                <span className="flex items-center gap-2">
                    {tab.icon}
                    {tab.label}
                </span>
            )
        }));

        return (
            <div className="px-4">
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key as ThirdPartyTab)}
                    items={items}
                    className="mb-6 font-bold"
                />
            </div>
        );
    };

    const renderPaymentMethods = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {[
                { name: 'PayPal', fields: ['Client ID', 'Client Secret'], color: 'blue' },
                { name: 'Stripe', fields: ['API Key', 'Published Key'], color: 'indigo' },
                { name: 'Razor Pay', fields: ['API Key', 'API Secret'], color: 'sky' },
                { name: 'MercadoPago', fields: ['Access Token', 'Public Key'], color: 'cyan' },
                { name: 'Paytm', fields: ['Merchant Key', 'Merchant ID', 'Merchant Website Link'], color: 'blue' },
                { name: 'Paytabs', fields: ['Profile ID', 'Server Key', 'Base URL'], color: 'orange' },
                { name: 'Bkash', fields: ['App Key', 'App Secret', 'Username', 'Password'], color: 'rose' },
                { name: 'Flutterwave', fields: ['Public Key', 'Secret Key', 'Hash'], color: 'amber' },
                { name: 'Paystack', fields: ['Public Key', 'Secret Key', 'Merchant Email'], color: 'emerald' },
                { name: 'SSL Commerz', fields: ['Store ID', 'Store Password'], color: 'indigo' },
                { name: 'LiqPay', fields: ['Private Key', 'Public Key'], color: 'blue' },
                { name: 'Senang Pay', fields: ['Callback URL', 'Secret Key', 'Merchant ID'], color: 'rose' },
                { name: 'Paymob Accept', fields: ['API Key', 'Iframe ID', 'Integration ID', 'HMAC'], color: 'slate' }
            ].map((gw, i) => (
                <div key={i} className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm space-y-8 group hover:shadow-2xl hover:border-blue-100 transition-all duration-500">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={cn("p-4 rounded-2xl text-white shadow-lg", `bg-${gw.color}-500`)}>
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">{gw.name}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
                                    <span className="text-[10px] font-black text-slate-400 ">Active</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-full">
                            <button className="px-3 py-1 bg-white text-[10px] font-black text-slate-900 rounded-full shadow-sm">Test</button>
                            <button className="px-3 py-1 text-[10px] font-black text-slate-400">Live</button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {gw.fields.map((f, j) => (
                            <div key={j} className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 ml-1">{f} *</label>
                                <input
                                    type="text"
                                    placeholder={`Enter ${f}`}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 outline-none hover:border-slate-300 focus:ring-4 focus:ring-blue-500/5 transition-all"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:border-blue-200 transition-colors">
                                <ImageIcon className="w-5 h-5 text-slate-300" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 ">Logo (PNG, Max 1MB)</span>
                        </div>
                        <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                            <Upload className="w-4 h-4" />
                        </button>
                    </div>

                    <button className="w-full py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black tracking-[0.2em] shadow-sm hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300">
                        Update {gw.name}
                    </button>
                </div>
            ))}
        </div>
    );

    const renderSMSGateways = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {[
                { name: 'Twilio', fields: ['SID', 'Messaging Service SID', 'Token', 'From', 'OTP Template'] },
                { name: 'Msg91', fields: ['Template ID', 'Auth Key'] },
                { name: 'Nexmo (Vonage)', fields: ['API Key', 'API Secret', 'Token', 'From', 'OTP Template'] },
                { name: '2Factor', fields: ['API Key'] },
                { name: 'Releans', fields: ['API Key', 'From', 'OTP Template'] }
            ].map((gw, i) => (
                <div key={i} className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-blue-50 text-blue-500 rounded-[28px]">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{gw.name}</h3>
                                <p className="text-[10px] font-black text-slate-400 mt-1">SMS Provider</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-400 ">Active</span>
                            <button className="w-12 h-6 rounded-full p-1 bg-blue-500 flex justify-end items-center">
                                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {gw.fields.map((f, j) => (
                            <div key={j} className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 ml-2">{f} *</label>
                                <input
                                    type="text"
                                    placeholder={`Enter ${f}`}
                                    className="w-full px-8 py-4 bg-slate-50 border border-slate-100 rounded-[28px] text-xs font-bold text-slate-600 outline-none"
                                />
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-5 bg-blue-500 text-white rounded-[28px] text-xs font-black tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                        Update {gw.name}
                    </button>
                </div>
            ))}
        </div>
    );

    const renderFirebaseOTP = () => (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white p-12 rounded-[80px] border border-slate-100 shadow-sm space-y-12">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-orange-50 text-orange-500 rounded-[32px] shadow-sm">
                        <Smartphone className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Firebase OTP</h3>
                        <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] mt-1">Phone Authentication Hub</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-black text-slate-900 ">Verification Status</span>
                            <p className="text-[10px] font-black text-slate-400 mt-1 italic">Control Firebase Auth activation</p>
                        </div>
                        <button className="w-16 h-8 rounded-full p-1.5 bg-orange-500 flex justify-end items-center transition-all">
                            <div className="w-5 h-5 bg-white rounded-full shadow-lg" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-4">
                            <label className="text-[10px] font-black text-slate-400 ">Web API Key *</label>
                            <span className="text-[10px] font-black text-[#0089D1] cursor-pointer hover:underline flex items-center gap-1">
                                <Info className="w-3 h-3" /> Get Key from Console
                            </span>
                        </div>
                        <input
                            type="text"
                            placeholder="AIzaSyA..."
                            className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[40px] text-xs font-mono text-slate-600 outline-none hover:border-orange-200 focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-[32px] text-xs font-black hover:bg-slate-100 transition-all">Reset</button>
                    <button className="flex-2 py-5 bg-orange-500 text-white rounded-[32px] text-xs font-black shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all px-12">Save Information</button>
                </div>
            </div>
        </div>
    );

    const renderEmailConfig = () => (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white p-12 rounded-[80px] border border-slate-100 shadow-sm space-y-12">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-indigo-50 text-indigo-600 rounded-[32px] shadow-sm">
                        <Mail className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Email Server</h3>
                        <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] mt-1">SMTP Transmission Hub</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { label: 'Mailer Name', placeholder: 'DriveMond Support' },
                        { label: 'Host', placeholder: 'smtp.gmail.com' },
                        { label: 'Driver', placeholder: 'SMTP' },
                        { label: 'Port', placeholder: '587' },
                        { label: 'Username', placeholder: 'user@example.com' },
                        { label: 'Email ID', placeholder: 'noreply@example.com' },
                        { label: 'Encryption', placeholder: 'TLS' },
                        { label: 'Password', placeholder: 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢', type: 'password' }
                    ].map((f, i) => (
                        <div key={i} className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] ml-4">{f.label} *</label>
                            <input
                                type={f.type || 'text'}
                                placeholder={f.placeholder}
                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[32px] text-xs font-bold text-slate-600 outline-none hover:border-indigo-200 transition-all"
                            />
                        </div>
                    ))}
                </div>

                <button className="w-full py-6 bg-indigo-600 text-white rounded-[40px] text-sm font-black tracking-[0.3em] shadow-2xl shadow-indigo-600/20 hover:scale-[1.01] active:scale-95 transition-all">Submit Configuration</button>
            </div>
        </div>
    );

    const renderMaps = () => (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
            <div className="bg-emerald-50/50 p-8 rounded-[40px] border border-emerald-100 flex items-start gap-4">
                <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg">
                    <Info className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                    <h4 className="text-sm font-black text-emerald-900 ">Google Map API Instructions</h4>
                    <p className="text-xs font-medium text-emerald-700 leading-relaxed">
                        Client key must enable Maps JavaScript API. Server key must enable Places API.
                        Same API key can be used for both fields if restrictions are managed accordingly.
                    </p>
                </div>
            </div>

            <div className="bg-white p-12 rounded-[80px] border border-slate-100 shadow-sm space-y-12">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-emerald-50 text-emerald-500 rounded-[32px]">
                        <MapIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Map Services</h3>
                        <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] mt-1">Geocoding & Location Hub</p>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-4">
                            <label className="text-[10px] font-black text-slate-400 ">Map API Key (Client) *</label>
                            <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1 cursor-pointer">
                                <RotateCcw className="w-3 h-3" /> Refresh
                            </span>
                        </div>
                        <input
                            type="text"
                            className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[40px] text-xs font-mono text-slate-600 outline-none"
                            placeholder="AIza..."
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 ml-4">Map API Key (Server) *</label>
                        <input
                            type="text"
                            className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[40px] text-xs font-mono text-slate-600 outline-none"
                            placeholder="AIza..."
                        />
                    </div>
                </div>

                <button className="w-full py-6 bg-emerald-500 text-white rounded-[40px] text-sm font-black tracking-[0.3em] shadow-2xl shadow-emerald-500/20">Save API Keys</button>
            </div>
        </div>
    );

    const renderReCaptcha = () => (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-12 rounded-[60px] border border-slate-100 shadow-sm space-y-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-slate-900 text-white rounded-[24px]">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">ReCaptcha V3</h3>
                        </div>
                        <button className="w-14 h-7 rounded-full p-1 bg-emerald-500 flex justify-end items-center transition-all">
                            <div className="w-5 h-5 bg-white rounded-full shadow-md" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 ml-1">Site Key *</label>
                            <input type="text" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-xs font-mono text-slate-500 outline-none" placeholder="6L..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 ml-1">Secret Key *</label>
                            <input type="password" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-xs font-mono text-slate-500 outline-none" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" />
                        </div>
                    </div>

                    <button className="w-full py-5 bg-slate-900 text-white rounded-[28px] text-xs font-black tracking-[0.2em] shadow-xl shadow-slate-900/20">Save Credentials</button>
                </div>

                <div className="bg-slate-900 p-10 rounded-[60px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
                    <div className="space-y-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-2xl text-emerald-400">
                                <ExternalLink className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-black italic tracking-tighter">Setup Guide</h3>
                        </div>

                        <div className="space-y-4">
                            {[
                                'Go to Google reCaptcha Admin Console',
                                'Select reCAPTCHA v3',
                                'Add your domain (dashdrive.com)',
                                'Copy and paste keys here'
                            ].map((step, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-black group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all">{i + 1}</div>
                                    <span className="text-xs font-medium text-white/60 group-hover:text-white transition-colors">{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="w-full py-5 bg-white text-slate-900 rounded-[28px] text-[10px] font-black relative z-10 hover:scale-[1.02] transition-all">
                        Google Credential Page
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-[1700px] mx-auto space-y-12 pb-20">
            {renderHeader()}
            <div className="space-y-10">
                {renderTabs()}
                <div className="px-4 min-h-[60vh]">
                    {activeTab === 'Payment' && renderPaymentMethods()}
                    {activeTab === 'SMS' && renderSMSGateways()}
                    {activeTab === 'Firebase' && renderFirebaseOTP()}
                    {activeTab === 'Email' && renderEmailConfig()}
                    {activeTab === 'Maps' && renderMaps()}
                    {activeTab === 'ReCaptcha' && renderReCaptcha()}
                </div>
            </div>
        </div>
    );
};
