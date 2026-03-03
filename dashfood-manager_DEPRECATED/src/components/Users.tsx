import React from 'react';
import { Users as UsersIcon, UserPlus, Shield, Search, MoreVertical, Edit2, Mail, Store } from 'lucide-react';
import { cn } from '../types';

const users = [
    { id: 1, name: 'John Doe', role: 'Global Admin', email: 'john@dashdrive.com', stores: 'All', status: 'Active' },
    { id: 2, name: 'Jane Smith', role: 'Regional Manager', email: 'jane@dashdrive.com', stores: 'North Region', status: 'Active' },
    { id: 3, name: 'Mike Johnson', role: 'Store Manager', email: 'mike@starbucks.com', stores: 'Lynwood (82)', status: 'Active' },
    { id: 4, name: 'Sarah Wilson', role: 'Staff', email: 'sarah@starbucks.com', stores: 'Downtown (14)', status: 'Restricted' },
];

const Users = () => {
    return (
        <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">
            <div className="flex items-end justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-black tracking-tighter">Team & Access</h1>
                    <p className="text-lg text-gray-400 font-medium">Manage user permissions and role-based access control (RBAC).</p>
                </div>
                <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                    <UserPlus size={18} />
                    Invite Member
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Users', value: '142', icon: UsersIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Active Roles', value: '8', icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Pending Invitations', value: '12', icon: Mail, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <div className="relative w-96">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email or role..."
                            className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-black">All Roles</button>
                        <button className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-black">Store Filter</button>
                    </div>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-gray-100">
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Locations</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black">
                                            {user.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-black leading-none mb-1">{user.name}</div>
                                            <div className="text-[10px] text-gray-400 font-bold">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-900 rounded-md text-[10px] font-black uppercase tracking-tight">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-1.5 text-xs text-black font-bold">
                                        <Store size={14} className="text-gray-400" />
                                        {user.stores}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-1.5">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", user.status === 'Active' ? "bg-emerald-500" : "bg-amber-500")} />
                                        <span className="text-[10px] font-black text-black uppercase tracking-tight">{user.status}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-gray-400 hover:text-black transition-colors"><Edit2 size={16} /></button>
                                        <button className="p-2 text-gray-400 hover:text-black transition-colors"><MoreVertical size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
