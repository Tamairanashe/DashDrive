import {
    Calendar, Plus, Trash2, Edit2,
    AlertCircle, ShieldCheck, ArrowRight
} from 'lucide-react';
import { cn } from '../../utils/cn';

const holidays = [
    { id: 1, name: 'Christmas Day', date: 'Dec 25, 2026', type: 'Full Day Closure', reason: 'National Holiday', status: 'Upcoming' },
    { id: 2, name: "New Year's Eve", date: 'Dec 31, 2026', type: 'Limited Hours', reason: 'Early Closure', status: 'Upcoming' },
    { id: 3, name: 'Staff Training', date: 'Mar 12, 2026', type: 'Full Day Closure', reason: 'Internal Event', status: 'Confirmed' },
];

export function HolidayHours() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">Holiday & Special Hours</h2>
                    <p className="text-sm text-gray-400 font-medium">Management of non-standard trading dates and events</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-[20px] text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                    <Plus size={20} />
                    Add Exception
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-4">
                    {holidays.map((holiday) => (
                        <div key={holiday.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center gap-6 group hover:shadow-xl hover:shadow-gray-100 transition-all">
                            <div className="size-16 bg-blue-50 text-blue-600 rounded-2xl flex flex-col items-center justify-center shrink-0">
                                <Calendar size={20} />
                                <span className="text-[10px] font-black uppercase mt-1">{holiday.date.split(' ')[0]}</span>
                            </div>

                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-black text-gray-800 tracking-tight uppercase">{holiday.name}</h3>
                                    <span className={cn(
                                        "text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest",
                                        holiday.status === 'Confirmed' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                                    )}>
                                        {holiday.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                                    <span className="flex items-center gap-1.5"><AlertCircle size={14} className="text-amber-500" /> {holiday.reason}</span>
                                    <span className="size-1 rounded-full bg-gray-200" />
                                    <span>{holiday.type}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                    <Edit2 size={18} />
                                </button>
                                <button className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="bg-emerald-600 rounded-[32px] p-8 text-white shadow-xl shadow-emerald-100">
                        <ShieldCheck size={32} className="mb-6 opacity-40" />
                        <h4 className="text-lg font-black tracking-tight mb-2">Automated Sync</h4>
                        <p className="text-sm opacity-80 leading-relaxed font-medium">Holiday hours take precedence over standard weekly hours. Your storefront will automatically update to reflects these changes.</p>
                        <button className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                            Learn more <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
                        <h4 className="font-black text-gray-800 uppercase tracking-widest text-xs mb-6">Upcoming Public Holidays</h4>
                        <div className="space-y-6">
                            {[
                                { name: 'Easter Monday', date: 'April 05' },
                                { name: 'Bank Holiday', date: 'May 03' },
                                { name: 'Summer Solstice', date: 'June 21' }
                            ].map((h) => (
                                <div key={h.name} className="flex justify-between items-center group cursor-pointer">
                                    <div>
                                        <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors uppercase">{h.name}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">{h.date}</p>
                                    </div>
                                    <Plus size={16} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
