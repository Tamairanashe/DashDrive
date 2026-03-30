import {
    ArrowLeft, MapPin, Clock, Calendar,
    Edit2, XCircle
} from 'lucide-react';

interface StoreInfoProps {
    storeId: string;
    onBack: () => void;
    onManageRegularHours: () => void;
    onManageHolidayHours: () => void;
}

export function StoreInfo({ storeId, onBack, onManageRegularHours, onManageHolidayHours }: StoreInfoProps) {
    // Mock data for the specific store
    const store = {
        id: storeId,
        name: 'One Restaurant & Bar',
        address: '219 King Street',
        city: 'San Francisco',
        zip: '94103',
        phone: '+12345678901',
        status: 'Closed',
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=2000&h=1000',
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Actions */}
            <div className="flex flex-col gap-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-800 transition-colors w-fit"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-4xl font-black text-gray-800 tracking-tighter">Store info</h2>
                    <div className="flex items-center gap-2 mt-2 text-gray-400 font-medium">
                        <XCircle size={16} />
                        <span className="text-sm">{store.status}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Map Section */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="relative aspect-[16/9] w-full bg-gray-100 rounded-[40px] overflow-hidden border border-gray-100 shadow-inner group">
                        {/* Mock Map Background */}
                        <div className="absolute inset-0 bg-[#f8f9fa] flex items-center justify-center">
                            <div className="absolute inset-0 opacity-20 pointer-events-none"
                                style={{
                                    backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
                                    backgroundSize: '24px 24px'
                                }}
                            />
                            <div className="relative">
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white p-3 rounded-2xl shadow-xl animate-bounce">
                                    <div className="size-6 flex items-center justify-center">
                                        <MapPin size={24} className="fill-white/20" />
                                    </div>
                                </div>
                                <div className="size-16 bg-blue-600/10 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                    <div className="size-4 bg-blue-600 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Adjust Pin Button */}
                        <button className="absolute top-6 right-6 px-6 py-2.5 bg-black text-white rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                            Adjust Pin
                        </button>
                    </div>
                </div>

                {/* Right: Info Section */}
                <div className="lg:col-span-4 space-y-12">
                    {/* Contact Details */}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black text-gray-800 tracking-tight leading-none uppercase">{store.name}</h3>
                            <p className="text-sm text-gray-400 font-medium">{store.address}</p>
                            <p className="text-sm text-gray-400 font-medium">{store.city}, {store.zip}</p>
                        </div>
                    </div>

                    {/* Large Action Buttons */}
                    <div className="space-y-4">
                        <button
                            onClick={onManageRegularHours}
                            className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 rounded-3xl group transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm text-gray-400 group-hover:text-blue-600 transition-colors">
                                    <Clock size={24} />
                                </div>
                                <span className="text-lg font-black text-gray-800 tracking-tight">Manage Regular Hours</span>
                            </div>
                            <ArrowLeft className="rotate-180 text-gray-300 group-hover:text-blue-600 transition-all" size={24} />
                        </button>

                        <button
                            onClick={onManageHolidayHours}
                            className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 rounded-3xl group transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm text-gray-400 group-hover:text-blue-600 transition-colors">
                                    <Calendar size={24} />
                                </div>
                                <span className="text-lg font-black text-gray-800 tracking-tight">Manage Holiday Hours</span>
                            </div>
                            <ArrowLeft className="rotate-180 text-gray-300 group-hover:text-blue-600 transition-all" size={24} />
                        </button>
                    </div>

                    {/* Phone Section */}
                    <div className="space-y-1 py-4 border-t border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</p>
                        <p className="text-lg font-bold text-gray-800">{store.phone}</p>
                    </div>

                    {/* Edit Button */}
                    <button className="flex items-center gap-3 px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl text-sm font-black uppercase tracking-widest transition-all">
                        <Edit2 size={18} />
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
}
