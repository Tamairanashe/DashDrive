import React from 'react';
import { Clock, Save } from 'lucide-react';

const days = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const StoreHours = ({ store }: { store?: any }) => {
    if (!store) {
        return (
            <div className="flex-1 bg-white flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock size={40} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No store selected</h2>
                    <p className="text-gray-500 mb-8">Please select a store from the Stores list to manage its operating hours.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-white overflow-y-auto">
            <div className="max-w-7xl mx-auto py-8 px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Store Hours</h1>
                        <p className="text-gray-600 font-medium">{store.name}</p>
                        <p className="text-gray-400 text-sm">{store.address}</p>
                    </div>
                    <button className="bg-emerald-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg">
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="grid grid-cols-1 divide-y divide-gray-100">
                        {days.map((day) => (
                            <div key={day} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4 w-48">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                        <Clock size={20} />
                                    </div>
                                    <span className="font-bold">{day}</span>
                                </div>

                                <div className="flex-1 flex items-center gap-8">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-500">From</span>
                                        <input
                                            type="time"
                                            defaultValue="09:00"
                                            className="bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-500">To</span>
                                        <input
                                            type="time"
                                            defaultValue="22:00"
                                            className="bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Open</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                        <Clock size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-amber-900 mb-1">Coming early?</h3>
                        <p className="text-sm text-amber-800 opacity-80">
                            Customers love it when you open early. Make sure your hours are accurate to avoid missing orders or disappointing hungry customers!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreHours;
