import {
    Clock, Plus, Save,
    Copy, AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';

const days = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export function StoreHours() {
    const [selectedStores] = useState<string[]>(['ST-001', 'ST-002']);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Store Selection Banner */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <Clock size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-800 tracking-tight">Trading Hours</h3>
                        <p className="text-xs text-gray-400 font-medium">Managing schedules for <span className="text-blue-600 font-bold">{selectedStores.length} stores</span></p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-black transition-all">
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Schedule Editor */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden text-sm">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h4 className="font-black text-gray-800 uppercase tracking-widest text-xs">Standard Weekly Hours</h4>
                            <button className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest">
                                <Copy size={14} />
                                Copy to all days
                            </button>
                        </div>

                        <div className="divide-y divide-gray-50">
                            {days.map((day) => (
                                <div key={day} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-4 min-w-[120px]">
                                        <div className={cn(
                                            "size-2 rounded-full",
                                            day === 'Sunday' ? "bg-gray-300" : "bg-emerald-500"
                                        )} />
                                        <span className="font-bold text-gray-800">{day}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="time"
                                                defaultValue="09:00"
                                                className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                                            />
                                            <span className="text-gray-300">to</span>
                                            <input
                                                type="time"
                                                defaultValue="22:00"
                                                className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                                            />
                                        </div>
                                        <button className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                            <Plus className="rotate-45" size={20} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                            <span className="ml-3 text-xs font-black text-gray-400 uppercase tracking-widest">Open</span>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    <div className="bg-blue-600 rounded-[32px] p-8 text-white shadow-xl shadow-blue-100">
                        <h4 className="text-lg font-black tracking-tight mb-2">Pro Tip</h4>
                        <p className="text-sm opacity-80 leading-relaxed font-medium">You can set multiple sessions per day (e.g. Lunch and Dinner blocks) by clicking the plus icon next to the time slots.</p>
                        <div className="mt-6 flex items-center gap-3 p-4 bg-white/10 rounded-2xl border border-white/10">
                            <AlertCircle size={20} className="text-blue-200" />
                            <p className="text-xs font-bold">Changes will sync across all selected stores immediately.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
                        <h4 className="font-black text-gray-800 uppercase tracking-widest text-xs mb-6">Bulk Apply To</h4>
                        <div className="space-y-3">
                            {['Store 001', 'Store 002', 'One Restaurant'].map((store) => (
                                <label key={store} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm font-bold text-gray-600 group-hover:text-gray-800">{store}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
