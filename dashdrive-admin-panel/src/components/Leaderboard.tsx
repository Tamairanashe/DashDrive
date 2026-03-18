import React, { useState } from 'react';
import { Trophy, Medal } from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

const users = [
 { id: 1, name: 'John Doe', trips: 145, rating: 4.9, avatar: 'https://picsum.photos/seed/u1/100/100' },
 { id: 2, name: 'Sarah Smith', trips: 132, rating: 4.8, avatar: 'https://picsum.photos/seed/u2/100/100' },
 { id: 3, name: 'Mike Johnson', trips: 128, rating: 4.7, avatar: 'https://picsum.photos/seed/u3/100/100' },
 { id: 4, name: 'Emily Brown', trips: 115, rating: 4.9, avatar: 'https://picsum.photos/seed/u4/100/100' },
 { id: 5, name: 'David Wilson', trips: 98, rating: 4.6, avatar: 'https://picsum.photos/seed/u5/100/100' },
];

const tabs = ['Today', 'This Week', 'This Month', 'All Time'];

export const Leaderboard = () => {
 const [activeTab, setActiveTab] = useState('This Month');

 return (
 <div className="bg-white p-6 rounded-[20px] shadow-soft border border-slate-50 flex flex-col h-full">
 <div className="flex items-center justify-between mb-6">
 <h3 className="text-lg font-bold text-slate-800">Leader Board</h3>
 </div>

 <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs.map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />

 <div className="flex justify-between items-end mb-8 px-4">
 {/* 2nd Place */}
 <div className="flex flex-col items-center gap-2">
 <div className="relative">
 <div className="w-16 h-16 rounded-full border-4 border-slate-100 overflow-hidden">
 <img src={users[1].avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
 </div>
 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">2</div>
 </div>
 <p className="text-xs font-semibold text-slate-700">{users[1].name}</p>
 </div>

 {/* 1st Place */}
 <div className="flex flex-col items-center gap-2 -translate-y-4">
 <div className="relative">
 <Trophy className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-400 w-6 h-6" />
 <div className="w-20 h-20 rounded-full border-4 border-yellow-400 overflow-hidden shadow-lg">
 <img src={users[0].avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
 </div>
 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">1</div>
 </div>
 <p className="text-sm font-bold text-slate-800">{users[0].name}</p>
 </div>

 {/* 3rd Place */}
 <div className="flex flex-col items-center gap-2">
 <div className="relative">
 <div className="w-16 h-16 rounded-full border-4 border-orange-100 overflow-hidden">
 <img src={users[2].avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
 </div>
 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3</div>
 </div>
 <p className="text-xs font-semibold text-slate-700">{users[2].name}</p>
 </div>
 </div>

 <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-hide">
 {users.slice(3).map((user, idx) => (
 <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100">
 <div className="flex items-center gap-3">
 <span className="text-xs font-bold text-slate-400 w-4">{idx + 4}</span>
 <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
 <div>
 <p className="text-xs font-semibold text-slate-800">{user.name}</p>
 <p className="text-[10px] text-slate-500">{user.trips} Trips</p>
 </div>
 </div>
 <div className="flex items-center gap-1">
 <span className="text-xs font-bold text-slate-700">{user.rating}</span>
 <span className="text-yellow-400 text-xs">â˜…</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
};
