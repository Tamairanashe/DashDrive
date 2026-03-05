import React, { useState } from 'react';
import {
    Lock,
    Shield,
    Users,
    ChevronRight,
    Plus,
    Search,
    Check,
    X,
    MoreVertical,
    UserCheck,
    ShieldAlert,
    Clock,
    Key,
    LayoutGrid,
    FileText,
    Smartphone,
import {
        Eye,
        Edit,
        Trash
    } from 'lucide-react';
import { cn } from '../utils';
import { adminApi } from '../api/adminApi';

interface RolesPermissionsProps {
    activeTab?: string;
}

export const RolesPermissions: React.FC<RolesPermissionsProps> = ({ activeTab: externalTab }) => {
    // Mapping from sidebar labels to component tab names
    const tabMapping: Record<string, string> = {
        'Roles Overview': 'Roles',
        'Employee Management': 'Users',
        'Permission Matrix': 'Policies'
    };

    const activeTab = (externalTab && tabMapping[externalTab]) || 'Roles';

    const permissions = [
        { module: 'User Management', read: true, write: true, delete: false },
        { module: 'Driver Approvals', read: true, write: true, delete: true },
        { module: 'Financial Reports', read: true, write: false, delete: false },
        { module: 'Marketing Ops', read: true, write: true, delete: false },
        { module: 'System Config', read: true, write: false, delete: false },
    ];

    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await adminApi.users.roles();
                if (response.data?.success) {
                    setRoles(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch roles:', error);
            } finally {
                setLoading(false);
            }
        };

        if (activeTab === 'Roles') {
            fetchRoles();
        }
    }, [activeTab]);

    const renderRoles = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Active Roles', value: '14', icon: Shield, color: 'text-[#0089D1]', bg: 'bg-[#0089D1]/5' },
                    { label: 'Privileged Users', value: '85', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                    { label: 'Pending Audits', value: '3', icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-50' },
                    { label: 'Security Score', value: '98%', icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                        <div className="p-4 bg-slate-50 rounded-2xl w-fit mb-6 text-slate-400 group-hover:text-[#0089D1] transition-colors">
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Roles Table */}
                <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Administration Roles</h3>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" className="w-64 pl-12 pr-6 py-3 bg-slate-50 border-none rounded-xl text-[11px] font-bold" placeholder="Search roles..." />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center p-8 text-slate-400">Loading roles...</div>
                        ) : roles.map((role, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                                <div className="flex items-center gap-6">
                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white", role.color || 'bg-slate-900')}>
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900">{role.name}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{role.members} Members</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                                            <span className="text-[10px] font-black text-[#0089D1] uppercase tracking-widest">{role.permissions || 0} Rules</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-[10px] font-bold text-slate-300 italic">Updated Just Now</span>
                                    <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Permissions Quick Matrix */}
                <div className="col-span-12 lg:col-span-4 bg-slate-900 p-10 rounded-[40px] text-white">
                    <h3 className="text-xl font-black mb-10 tracking-tight">Scope Matrix</h3>
                    <div className="space-y-8">
                        {permissions.map((p, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <span className="text-xs font-black opacity-60 group-hover:opacity-100 transition-opacity">{p.module}</span>
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-all", p.read ? "bg-white/10 text-emerald-400" : "bg-white/5 text-slate-700")}>
                                        <Eye className="w-4 h-4" />
                                    </div>
                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-all", p.write ? "bg-white/10 text-[#0089D1]" : "bg-white/5 text-slate-700")}>
                                        <Edit size={16} />
                                    </div>
                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-all", p.delete ? "bg-white/10 text-rose-400" : "bg-white/5 text-slate-700")}>
                                        <Trash size={16} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-10 py-5 bg-white/10 hover:bg-white/20 rounded-[28px] text-xs font-black uppercase tracking-widest transition-all border border-white/5">Modify Matrix</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em]">Security</span>
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em]">RBAC</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">Roles & Permissions</h1>
                    <p className="text-sm font-medium text-slate-400 mt-4 max-w-md">Enterprise governance engine for role-based access orchestration.</p>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-3 px-10 py-4 bg-white border border-slate-200 text-slate-400 rounded-[24px] text-xs font-black uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 transition-all">
                        <RotateCcw className="w-5 h-5" /> Reset
                    </button>
                    <button className="flex items-center gap-3 px-10 py-4 bg-[#0089D1] text-white rounded-[24px] text-xs font-black uppercase tracking-widest hover:bg-[#007AB8] transition-all shadow-xl shadow-[#0089D1]/20">
                        <Plus className="w-5 h-5" /> New Admin Role
                    </button>
                </div>
            </div>

            {activeTab === 'Roles' && renderRoles()}
            {activeTab !== 'Roles' && (
                <div className="h-[60vh] bg-white rounded-[60px] border border-slate-100 flex flex-col items-center justify-center text-slate-300">
                    <Lock className="w-20 h-20 mb-6 opacity-20" />
                    <h2 className="text-xl font-bold">{activeTab} Manager</h2>
                    <p className="text-sm font-medium">Standardizing {activeTab.toLowerCase()} protocols for platform compliance.</p>
                </div>
            )}
        </div>
    );
};

// Fixing missing icons if needed
const Edit = ({ size, className }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
);

const Trash = ({ size, className }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);
