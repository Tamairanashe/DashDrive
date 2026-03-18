import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'motion/react';
import {
    Car, User, Navigation, MapPin, Phone, MessageSquare,
    X, ChevronRight, Search, Globe, ShieldAlert,
    AlertCircle, LayoutGrid, Layers, Maximize2
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const INITIAL_VEHICLES = [
    { id: 'V-101', driver: 'Alex Rivera', status: 'Active', trip: 'Airport Transfer', lat: 23.7953, lng: 90.3825, type: 'Luxury', rating: 4.9, phone: '+1 555-0101', model: 'Tesla Model S', level: 'Gold', alerts: [] },
    { id: 'V-102', driver: 'Sarah Chen', status: 'On Trip', trip: 'Downtown Express', lat: 23.8103, lng: 90.4125, type: 'Standard', rating: 4.8, phone: '+1 555-0102', model: 'Toyota Camry', level: 'Silver', alerts: ['Abrupt Braking'] },
    { id: 'V-103', driver: 'Marco Rossi', status: 'Idle', trip: 'None', lat: 23.7853, lng: 90.4375, type: 'Bike', rating: 4.7, phone: '+1 555-0103', model: 'Yamaha R1', level: 'Bronze', alerts: [] },
    { id: 'V-104', driver: 'Elena Petrova', status: 'Active', trip: 'Shopping Mall', lat: 23.8253, lng: 90.3975, type: 'Standard', rating: 4.9, phone: '+1 555-0104', model: 'Honda Accord', level: 'Gold', alerts: [] },
    { id: 'V-105', driver: 'James Wilson', status: 'On Trip', trip: 'Corporate Office', lat: 23.8353, lng: 90.3725, type: 'Luxury', rating: 5.0, phone: '+1 555-0105', model: 'BMW 7 Series', level: 'Platinum', alerts: [] },
    { id: 'V-106', driver: 'Yuki Tanaka', status: 'Active', trip: 'Station Pick-up', lat: 23.8303, lng: 90.4475, type: 'Standard', rating: 4.6, phone: '+1 555-0106', model: 'Nissan Altima', level: 'Silver', alerts: [] },
];

const INITIAL_CUSTOMERS = [
    { id: 'C-201', name: 'Devid Jack', lat: 23.8003, lng: 90.3925, phone: '+1 555-0201', trips: 12, status: 'Waiting' },
    { id: 'C-202', name: 'Test User', lat: 23.8203, lng: 90.4225, phone: '+1 555-0202', trips: 5, status: 'On Trip', alerts: ['Safety Alert'] },
    { id: 'C-203', name: 'Emma Watson', lat: 23.8103, lng: 90.3625, phone: '+1 555-0203', trips: 28, status: 'Idle' },
];

const MapController = ({ selectedPos, zoom }: { selectedPos: [number, number] | null, zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        if (selectedPos) {
            map.setView(selectedPos, zoom, { animate: true });
        }
    }, [selectedPos, zoom, map]);
    return null;
};

const ZoomButtons = () => {
    const map = useMap();
    return (
        <>
            <button onClick={() => map.zoomIn()} className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors border-b border-slate-50">+</button>
            <button onClick={() => map.zoomOut()} className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors">-</button>
        </>
    );
};

const MaximizeButton = ({ isFullscreen, onToggle }: { isFullscreen: boolean, onToggle: () => void }) => {
    return (
        <button
            onClick={onToggle}
            className={cn(
                "w-10 h-10 bg-white shadow-lg rounded-xl flex items-center justify-center transition-colors border border-slate-100",
                isFullscreen ? "text-primary bg-primary/5" : "text-slate-600 hover:text-primary"
            )}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
            <Maximize2 className="w-4 h-4" />
        </button>
    );
};

export const FleetView = ({
    onCustomerClick,
    onDriverClick,
    initialTab = 'Drivers'
}: {
    onCustomerClick?: (id: string) => void,
    onDriverClick?: (id: string) => void,
    initialTab?: 'Drivers' | 'Customers'
}) => {
    const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
    const [customers] = useState(INITIAL_CUSTOMERS);
    const [activeTab, setActiveTab] = useState<'Drivers' | 'Customers'>(initialTab);
    const [driverFilter, setDriverFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
    const [mapType, setMapType] = useState<'Map' | 'Satellite'>('Map');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const mapContainerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!mapContainerRef.current) return;
        if (!document.fullscreenElement) {
            mapContainerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const filteredVehicles = vehicles.filter(v => {
        const matchesFilter = driverFilter === 'All' || v.status === driverFilter;
        const matchesSearch = v.driver.toLowerCase().includes(searchQuery.toLowerCase()) || v.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedEntity = activeTab === 'Drivers'
        ? vehicles.find(v => v.id === selectedEntityId)
        : customers.find(c => c.id === selectedEntityId);

    const currentItems = activeTab === 'Drivers' ? filteredVehicles : filteredCustomers;

    // Simulate vehicle movement
    useEffect(() => {
        const interval = setInterval(() => {
            setVehicles(prev => prev.map(v => {
                if (v.status === 'Idle') return v;
                const dx = (Math.random() - 0.5) * 0.001;
                const dy = (Math.random() - 0.5) * 0.001;
                return {
                    ...v,
                    lat: v.lat + dy,
                    lng: v.lng + dx,
                };
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleEntitySelect = (id: string) => {
        setSelectedEntityId(id);
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Header & Main Tabs */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Fleet Map</h2>
                        <p className="text-sm text-slate-500">Real-time operational tracking for drivers and customers</p>
                    </div>
                    <div className="flex items-center">
                        <Tabs
                            activeKey={activeTab}
                            onChange={(key) => { setActiveTab(key as 'Drivers' | 'Customers'); setSelectedEntityId(null); }}
                            items={[
                                { key: 'Drivers', label: 'All Drivers' },
                                { key: 'Customers', label: 'Customers' }
                            ]}
                            className="font-bold"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative md:col-span-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for a location, driver or customer"
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm shadow-sm appearance-none focus:ring-2 focus:ring-primary/20">
                            <option>All Over The World</option>
                            <option>Asia</option>
                            <option>Europe</option>
                        </select>
                    </div>
                    <div className="flex bg-white rounded-xl shadow-sm border border-slate-100 p-1">
                        <button
                            onClick={() => setMapType('Map')}
                            className={cn(
                                "flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all",
                                mapType === 'Map' ? "bg-slate-100 text-slate-800" : "text-slate-500"
                            )}
                        >
                            Map
                        </button>
                        <button
                            onClick={() => setMapType('Satellite')}
                            className={cn(
                                "flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all",
                                mapType === 'Satellite' ? "bg-slate-100 text-slate-800" : "text-slate-500"
                            )}
                        >
                            Satellite
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex gap-6 min-h-0">
                {/* Left Panel: Entity List */}
                <div className="w-80 bg-white rounded-[24px] shadow-soft border border-slate-100 flex flex-col overflow-hidden">
                    {activeTab === 'Drivers' && (
                        <div className="p-4 border-b border-slate-50 flex gap-2">
                            {['All', 'On Trip', 'Idle'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setDriverFilter(f)}
                                    className={cn(
                                        "flex-1 py-1.5 text-[10px] font-bold rounded-lg border transition-all",
                                        driverFilter === f ? "bg-primary/5 border-primary/20 text-primary" : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
                                    )}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
                        {activeTab === 'Drivers' ? (
                            filteredVehicles.map(v => (
                                <div
                                    key={v.id}
                                    onClick={() => handleEntitySelect(v.id)}
                                    className={cn(
                                        "p-3 rounded-xl border transition-all cursor-pointer group",
                                        selectedEntityId === v.id ? "bg-primary/5 border-primary/10" : "bg-transparent border-transparent hover:bg-slate-50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                                            <img src={`https://picsum.photos/seed/${v.id}/100/100`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-800 truncate">{v.driver}</p>
                                            <p className="text-[10px] text-slate-500 truncate">{v.phone}</p>
                                            <p className="text-[9px] text-primary font-medium">{v.model}</p>
                                        </div>
                                        {v.alerts.length > 0 && <ShieldAlert className="w-4 h-4 text-red-500" />}
                                    </div>
                                </div>
                            ))
                        ) : (
                            filteredCustomers.map(c => (
                                <div
                                    key={c.id}
                                    onClick={() => handleEntitySelect(c.id)}
                                    className={cn(
                                        "p-3 rounded-xl border transition-all cursor-pointer group",
                                        selectedEntityId === c.id ? "bg-primary/5 border-primary/10" : "bg-transparent border-transparent hover:bg-slate-50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                                            <img src={`https://picsum.photos/seed/${c.id}/100/100`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-800 truncate">{c.name}</p>
                                            <p className="text-[10px] text-slate-500 truncate">{c.phone}</p>
                                        </div>
                                        {c.alerts && c.alerts.length > 0 && <AlertCircle className="w-4 h-4 text-red-500" />}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Panel: Map Area */}
                <div
                    ref={mapContainerRef}
                    className={cn(
                        "flex-1 bg-white rounded-[24px] shadow-soft border border-slate-100 overflow-hidden relative",
                        isFullscreen && "rounded-none border-none"
                    )}
                >
                    <MapContainer
                        center={[23.8103, 90.4125]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                        attributionControl={false}
                    >
                        <TileLayer
                            url={mapType === 'Map'
                                ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                                : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            }
                        />

                        <MapController
                            selectedPos={selectedEntity ? [selectedEntity.lat, selectedEntity.lng] : null}
                            zoom={15}
                        />

                        <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-2">
                            <div className="bg-white shadow-lg rounded-xl border border-slate-100 overflow-hidden flex flex-col">
                                <ZoomButtons />
                            </div>
                            <MaximizeButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
                        </div>

                        {currentItems.map((item) => {
                            const isSelected = selectedEntityId === item.id;
                            return (
                                <Marker
                                    key={item.id}
                                    position={[item.lat, item.lng]}
                                    icon={L.divIcon({
                                        className: '',
                                        html: `
 <div class="relative transition-all duration-300 ${isSelected ? 'scale-125' : 'scale-100'}" style="transform: translate(-50%, -50%)">
 <div class="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-colors ${activeTab === 'Drivers'
                                                ? (item.status === 'On Trip' ? 'bg-[#00C4B4]' : 'bg-blue-500')
                                                : 'bg-amber-500'
                                            }">
 ${activeTab === 'Drivers'
                                                ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>'
                                                : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
                                            }
 ${item.alerts && item.alerts.length > 0 ? `
 <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
 <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
 </div>
 ` : ''}
 </div>
 <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm border border-slate-100 whitespace-nowrap">
 <span class="text-[9px] font-bold text-slate-700">${activeTab === 'Drivers' ? item.driver : item.name}</span>
 </div>
 </div>
 `,
                                        iconSize: [40, 40],
                                        iconAnchor: [20, 20],
                                    })}
                                    eventHandlers={{
                                        click: () => setSelectedEntityId(item.id),
                                    }}
                                />
                            );
                        })}
                    </MapContainer>

                    {/* Detail Pop-up Overlay (Floating) */}
                    <AnimatePresence>
                        {selectedEntity && (
                            <motion.div
                                key={`popup-${selectedEntity.id}`}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                className="absolute bottom-6 right-6 z-[1000] bg-white rounded-2xl shadow-2xl border border-slate-100 w-72 overflow-hidden"
                            >
                                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 overflow-hidden">
                                            <img src={`https://picsum.photos/seed/${(selectedEntity as any).id}/100/100`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800">{activeTab === 'Drivers' ? (selectedEntity as any).driver : (selectedEntity as any).name}</h4>
                                            <p className="text-[10px] text-slate-500 font-medium ">
                                                {activeTab === 'Drivers' ? `${(selectedEntity as any).level} â€¢ ${(selectedEntity as any).id}` : `Customer â€¢ ${(selectedEntity as any).id}`}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); setSelectedEntityId(null); }} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                                        <X className="w-4 h-4 text-slate-400" />
                                    </button>
                                </div>

                                <div className="p-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                            <p className="text-[10px] text-slate-400 font-bold mb-1">
                                                {activeTab === 'Drivers' ? 'Status' : 'Trips'}
                                            </p>
                                            <span className="text-xs font-bold text-slate-800">
                                                {activeTab === 'Drivers' ? (selectedEntity as any).status : (selectedEntity as any).trips}
                                            </span>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                            <p className="text-[10px] text-slate-400 font-bold mb-1">Rating</p>
                                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                                {activeTab === 'Drivers' ? (selectedEntity as any).rating : '4.5'} <span className="text-yellow-400">â˜…</span>
                                            </span>
                                        </div>
                                    </div>

                                    {activeTab === 'Drivers' && (
                                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                            <p className="text-[10px] text-slate-400 font-bold mb-1">Vehicle</p>
                                            <p className="text-xs font-bold text-slate-800">{(selectedEntity as any).model}</p>
                                        </div>
                                    )}

                                    {(selectedEntity as any).alerts && (selectedEntity as any).alerts.length > 0 && (
                                        <div className="bg-red-50 p-2 rounded-xl border border-red-100 flex items-center gap-2">
                                            <ShieldAlert className="w-4 h-4 text-red-500" />
                                            <span className="text-[10px] font-bold text-red-600 tracking-tight">
                                                {(selectedEntity as any).alerts[0]}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-2">
                                        {activeTab === 'Customers' ? (
                                            <button
                                                onClick={() => onCustomerClick?.((selectedEntity as any).id)}
                                                className="flex-1 bg-primary/10 text-primary py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors"
                                            >
                                                <User className="w-3 h-3" /> View Profile
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => onDriverClick?.((selectedEntity as any).id)}
                                                className="flex-1 bg-primary/10 text-primary py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors"
                                            >
                                                <Car className="w-3 h-3" /> View Profile
                                            </button>
                                        )}
                                        <button className="flex-1 bg-primary text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                                            <Phone className="w-3 h-3" /> Call
                                        </button>
                                        <button className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                                            <MessageSquare className="w-3 h-3" /> Chat
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
