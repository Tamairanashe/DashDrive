import React from 'react';
import { Settings as SettingsIcon, Globe, Bell, Shield, Wallet, Laptop, Store, ChevronRight } from 'lucide-react';
import { cn } from '../types';

const sections = [
    { id: 'general', title: 'General configuration', description: 'Business info, branding and core settings.', icon: Globe },
    { id: 'locations', title: 'Location hierarchy', description: 'Manage regions and zone assignments.', icon: Store },
    { id: 'security', title: 'Security & Auth', description: 'MFA, SSO and session management.', icon: Shield },
    { id: 'notifications', title: 'Communication policy', description: 'Push, email and SMS notification rules.', icon: Bell },
    { id: 'billing', title: 'Plan & Billing', description: 'Subscription management and payouts.', icon: Wallet },
    { id: 'devices', title: 'POS & Hardware', description: 'Integration settings and device monitoring.', icon: Laptop },
];

const Settings = () => {
    return (
        <div className="max-w-5xl mx-auto px-8 py-10 space-y-10">
            <div className="space-y-1">
                <h1 className="text-4xl font-black text-black tracking-tighter">System Settings</h1>
                <p className="text-lg text-gray-400 font-medium">Configure global parameters for your DashDrive organization.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {sections.map((section) => (
                    <div key={section.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-100 hover:shadow-md transition-all cursor-pointer group flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                            <section.icon size={28} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-black text-black tracking-tight">{section.title}</h3>
                            <p className="text-sm text-gray-400 font-medium">{section.description}</p>
                        </div>
                        <ChevronRight size={20} className="text-gray-200 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </div>
                ))}
            </div>

            <div className="p-8 bg-black rounded-3xl text-white relative overflow-hidden">
                <div className="relative z-10 max-w-md">
                    <h2 className="text-2xl font-black mb-2 tracking-tight">Need assistance?</h2>
                    <p className="text-gray-400 text-sm font-medium mb-6">Our enterprise support team is available 24/7 for configuration help.</p>
                    <button className="bg-white text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
                        Contact Enterprise Support
                    </button>
                </div>
                <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-emerald-600/20 to-transparent pointer-events-none"></div>
            </div>
        </div>
    );
};

export default Settings;
