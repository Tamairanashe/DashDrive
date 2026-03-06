import React from 'react';
import { Bell, Globe, Search, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header = () => {
 const { user, logout } = useAuth();
 return (
 <header className="h-20 bg-white border-b border-zinc-100 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
 <div className="flex items-center gap-4">
 <h1 className="text-2xl font-bold text-zinc-900">Welcome Super</h1>
 </div>

 <div className="flex items-center gap-6">
 <div className="relative hidden md:block">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
 <input
 type="text"
 placeholder="Search anything..."
 className="pl-10 pr-4 py-2 bg-zinc-50 border-none rounded-full text-sm focus:ring-2 focus:ring-zinc-900/10 w-64 transition-all"
 />
 </div>

 <div className="flex items-center gap-4">
 <button className="p-2 text-zinc-500 hover:bg-zinc-50 rounded-full transition-colors relative">
 <Bell className="w-5 h-5" />
 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
 </button>

 <button className="p-2 text-zinc-500 hover:bg-zinc-50 rounded-full transition-colors">
 <Globe className="w-5 h-5" />
 </button>

 <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

 <div className="flex items-center gap-3 hover:bg-zinc-50 p-1 pr-3 rounded-full transition-colors group relative cursor-pointer" tabIndex={0}>
 <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm text-white font-black">
 {user?.name?.charAt(0) || 'A'}
 </div>
 <div className="text-left hidden sm:block">
 <p className="text-sm font-semibold text-zinc-900 leading-none">{user?.name || 'Super Admin'}</p>
 <p className="text-xs text-zinc-500 mt-1 tracking-tighter font-bold">{user?.role?.replace('_', ' ') || 'Administrator'}</p>
 </div>
 <ChevronDown className="w-4 h-4 text-zinc-400" />

 {/* Simple Dropdown for Logout on Header too */}
 <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-zinc-100 rounded-2xl shadow-xl opacity-0 translate-y-2 pointer-events-none group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto transition-all z-50">
 <button
 onClick={logout}
 className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors rounded-2xl"
 >
 <LogOut className="w-4 h-4" />
 Logout Session
 </button>
 </div>
 </div>
 </div>
 </div>
 </header>
 );
};
