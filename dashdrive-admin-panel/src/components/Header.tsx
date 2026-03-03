import React from 'react';
import { Bell, Globe, Search, ChevronDown } from 'lucide-react';

export const Header = () => {
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

          <button className="flex items-center gap-3 hover:bg-zinc-50 p-1 pr-3 rounded-full transition-colors">
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
              <img
                src="https://picsum.photos/seed/admin/100/100"
                alt="Profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-zinc-900 leading-none">Super Admin</p>
              <p className="text-xs text-zinc-500 mt-1">Administrator</p>
            </div>
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
