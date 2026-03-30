import { useState } from 'react';
import {
    Search, Filter, ArrowRight,
    CheckCircle2, XCircle
} from 'lucide-react';
import { StoreInfo } from './StoreInfo';

const stores = [
    {
        id: 'ST-001',
        name: 'Little Pub Toast Test Store (Infosys Dev)',
        address: '294d6f7c-358a-483a-930...',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=200&h=200',
        status: 'Accepting orders',
        statusSince: '11:00 AM',
        sales: 0,
        orders: 0,
    },
    {
        id: 'ST-002',
        name: 'Revel Test Store (Infosys UAT)',
        address: '1400 Broadway, New York, ...',
        image: 'https://images.unsplash.com/photo-1559925393-8be0ec47b518?auto=format&fit=crop&q=80&w=200&h=200',
        status: 'Accepting orders',
        statusSince: '2:41 PM',
        sales: 0,
        orders: 0,
    }
];

const closedStores = [
    {
        id: 'ST-003',
        name: 'One Restaurant & Bar',
        address: '219 King Street',
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=200&h=200',
        status: 'Closed',
        opensAt: '1:30 PM Wednesday',
        sales: 0,
        orders: 0,
    }
];

export function Stores({ onNavigate }: { onNavigate?: (tab: string) => void }) {
    const [view, setView] = useState<'list' | 'info'>('list');
    const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

    const handleStoreClick = (id: string) => {
        setSelectedStoreId(id);
        setView('info');
    };

    if (view === 'info' && selectedStoreId) {
        return (
            <StoreInfo
                storeId={selectedStoreId}
                onBack={() => setView('list')}
                onManageRegularHours={() => onNavigate?.('store-hours')}
                onManageHolidayHours={() => onNavigate?.('holiday-hours')}
            />
        );
    }
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search stores by name or address..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
                        <Filter size={18} />
                        Filters
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-black text-gray-800 tracking-tight">Accepting Orders (2)</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {stores.map((store) => (
                        <div
                            key={store.id}
                            onClick={() => handleStoreClick(store.id)}
                            className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all group cursor-pointer"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                <div className="relative shrink-0">
                                    <img src={store.image} alt={store.name} className="w-20 h-20 rounded-2xl object-cover shadow-lg shadow-gray-200" />
                                    <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full">
                                        <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-500/10" />
                                    </div>
                                </div>

                                <div className="flex-1 space-y-1">
                                    <h3 className="text-lg font-black text-gray-800 tracking-tight group-hover:text-blue-600 transition-colors uppercase">{store.name}</h3>
                                    <p className="text-xs text-gray-400 font-medium">{store.address}</p>
                                </div>

                                <div className="flex items-center gap-8 md:px-8 border-x border-gray-50">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md mb-2">{store.status}</span>
                                        <p className="text-[10px] font-bold text-gray-400">Since {store.statusSince}</p>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-lg font-black text-gray-800 tracking-tighter">${store.sales}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sales</p>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-lg font-black text-gray-800 tracking-tighter">{store.orders}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Orders</p>
                                    </div>
                                </div>

                                <ArrowRight className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={24} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-black text-gray-400 tracking-tight">Closed (1)</h2>
                </div>

                <div className="grid grid-cols-1 gap-4 opacity-70">
                    {closedStores.map((store) => (
                        <div
                            key={store.id}
                            onClick={() => handleStoreClick(store.id)}
                            className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-gray-200 transition-all group cursor-pointer"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                <div className="relative shrink-0 grayscale">
                                    <img src={store.image} alt={store.name} className="w-20 h-20 rounded-2xl object-cover" />
                                    <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full">
                                        <XCircle size={16} className="text-gray-400" />
                                    </div>
                                </div>

                                <div className="flex-1 space-y-1">
                                    <h3 className="text-lg font-black text-gray-400 tracking-tight uppercase">{store.name}</h3>
                                    <p className="text-xs text-gray-400 font-medium">{store.address}</p>
                                </div>

                                <div className="flex items-center gap-8 md:px-8 border-x border-gray-50">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md mb-2">{store.status}</span>
                                        <p className="text-[10px] font-bold text-gray-400">Opens {store.opensAt}</p>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-lg font-black text-gray-400 tracking-tighter">${store.sales}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sales</p>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-lg font-black text-gray-400 tracking-tighter">{store.orders}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Orders</p>
                                    </div>
                                </div>

                                <ArrowRight className="text-gray-200 transition-all" size={24} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
