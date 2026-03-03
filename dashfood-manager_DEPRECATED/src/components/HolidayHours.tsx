import React from 'react';
import { Calendar, Plus, Trash2, Save } from 'lucide-react';

const upcomingHolidays = [
    { name: 'Easter Monday', date: 'April 21, 2025', status: 'Closed' },
    { name: 'Early May Bank Holiday', date: 'May 5, 2025', status: 'Closed' },
    { name: 'Spring Bank Holiday', date: 'May 26, 2025', status: 'Closed' },
];

export const HolidayHours = ({ store }: { store?: any }) => {
    if (!store) {
        return (
            <div className="flex-1 bg-white flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar size={40} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No store selected</h2>
                    <p className="text-gray-500 mb-8">Please select a store from the Stores list to manage its holiday hours.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-white overflow-y-auto">
            <div className="max-w-7xl mx-auto py-8 px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Holiday Hours</h1>
                        <p className="text-gray-600 font-medium">{store.name}</p>
                        <p className="text-gray-400 text-sm">{store.address}</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-gray-100 text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
                            <Plus size={18} />
                            Add Custom Date
                        </button>
                        <button className="bg-emerald-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg">
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-8">
                    <div className="grid grid-cols-1 divide-y divide-gray-100">
                        {upcomingHolidays.map((holiday) => (
                            <div key={holiday.name} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{holiday.name}</h3>
                                        <p className="text-sm text-gray-500">{holiday.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full inline-block mb-1">
                                            {holiday.status}
                                        </div>
                                        <p className="text-xs text-gray-400">All day</p>
                                    </div>
                                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                        <Plus className="text-gray-400" size={32} />
                    </div>
                    <h3 className="font-bold mb-1">Set a custom closure</h3>
                    <p className="text-sm text-gray-500 max-w-sm mb-6">
                        Need to close for maintenance or a private event? You can set custom hours for any specific date.
                    </p>
                    <button className="bg-white border border-gray-200 px-6 py-2 rounded-full text-sm font-bold hover:bg-white hover:border-black transition-all">
                        Pick a Date
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HolidayHours;
