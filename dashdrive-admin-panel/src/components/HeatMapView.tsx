import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'motion/react';
import {
    MapPin, Info, Search, Filter, Layers, Calendar,
    Maximize2, Globe, CheckSquare, Square, RefreshCcw,
    ChevronDown, TrendingUp, X, Car, Package, Utensils,
    ShoppingBag, CreditCard, LayoutGrid, Zap, Activity,
    AlertCircle, Download, Share2, Users, Link2, Sparkles,
    ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Area, AreaChart,
    PieChart, Pie, Cell
} from 'recharts';
import { cn } from '../utils';
import { Tabs } from 'antd';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Coordinate mapping helper
const mapXToLng = (x: number) => 90.4125 + (x - 600) * 0.0001;
const mapYToLat = (y: number) => 23.8103 - (y - 400) * 0.0001;

const heatPoints = [
    { id: 1, lat: mapYToLat(300), lng: mapXToLng(200), radius: 800, intensity: 0.8, val: 48, label: 'Downtown', service: 'Ride', supply: 12 },
    { id: 2, lat: mapYToLat(200), lng: mapXToLng(500), radius: 1000, intensity: 0.9, val: 82, label: 'Airport', service: 'Ride', supply: 15 },
    { id: 3, lat: mapYToLat(450), lng: mapXToLng(800), radius: 700, intensity: 0.6, val: 28, label: 'Suburbs', service: 'Food', supply: 45 },
    { id: 4, lat: mapYToLat(600), lng: mapXToLng(350), radius: 900, intensity: 0.7, val: 54, label: 'Business Dist', service: 'Parcel', supply: 22 },
    { id: 5, lat: mapYToLat(150), lng: mapXToLng(700), radius: 600, intensity: 0.5, val: 19, label: 'North Port', service: 'Shopping', supply: 30 },
    { id: 6, lat: mapYToLat(700), lng: mapXToLng(150), radius: 750, intensity: 0.75, val: 38, label: 'West End', service: 'Payments', supply: 40 },
];

const serviceColors: Record<string, string> = {
    Ride: '#00A884',
    Food: '#FF7043',
    Parcel: '#26C6DA',
    Shopping: '#7E57C2',
    Payments: '#5C6BC0'
};

const fleetData = [
    { id: 1, lat: mapYToLat(310), lng: mapXToLng(210), type: 'Ride', status: 'Available' },
    { id: 2, lat: mapYToLat(320), lng: mapXToLng(205), type: 'Ride', status: 'Busy' },
    { id: 3, lat: mapYToLat(460), lng: mapXToLng(810), type: 'Food', status: 'Available' },
    { id: 4, lat: mapYToLat(610), lng: mapXToLng(360), type: 'Parcel', status: 'Idle' },
    { id: 5, lat: mapYToLat(160), lng: mapXToLng(710), type: 'Shopping', status: 'Busy' },
    { id: 6, lat: mapYToLat(210), lng: mapXToLng(510), type: 'Ride', status: 'Offline' },
];

const statusColors: Record<string, string> = {
    Available: '#22c55e',
    Busy: '#3b82f6',
    Idle: '#f97316',
    Offline: '#94a3b8'
};

const compareData = [
    {
        year: '2023',
        range: '01 Oct – 31 Dec',
        rides: 1,
        parcels: 2,
        points: [
            { lat: mapYToLat(150), lng: mapXToLng(100), val: 12 },
            { lat: mapYToLat(200), lng: mapXToLng(250), val: 8 }
        ]
    },
    {
        year: '2024',
        range: '01 Jan – 31 Dec',
        rides: 11,
        parcels: 16,
        points: [
            { lat: mapYToLat(140), lng: mapXToLng(120), val: 45 },
            { lat: mapYToLat(220), lng: mapXToLng(200), val: 32 },
            { lat: mapYToLat(80), lng: mapXToLng(50), val: 18 }
        ]
    },
    {
        year: '2025',
        range: '01 Jan – 31 Dec',
        rides: 6,
        parcels: 0,
        points: [
            { lat: mapYToLat(100), lng: mapXToLng(150), val: 24 },
            { lat: mapYToLat(180), lng: mapXToLng(80), val: 15 }
        ]
    },
];

const tripStatsData = [
    { year: '2023', trips: 15 },
    { year: '2024', trips: 42 },
    { year: '2025', trips: 36 },
    { year: '2026', trips: 28 },
];

const zones = [
    { id: 'all', name: 'All Zone', rides: 26, parcels: 22, checked: true },
    { id: 'world3', name: 'All Over The World #3', rides: 18, parcels: 18, checked: true },
    { id: 'asia4', name: 'Asia #4', rides: 8, parcels: 4, checked: false },
    { id: 'europe2', name: 'Europe #2', rides: 12, parcels: 10, checked: false },
    { id: 'america1', name: 'America #1', rides: 15, parcels: 12, checked: false },
];

const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom, { animate: true });
    }, [center, zoom, map]);
    return null;
};

// 🔄 Map Synchronization Component
const SyncMaps = ({ mapA, mapB, enabled = true }: { mapA: React.MutableRefObject<L.Map | null>, mapB: React.MutableRefObject<L.Map | null>, enabled?: boolean }) => {
    useEffect(() => {
        if (!enabled) return;

        const sync = (src: L.Map, dst: L.Map) => {
            const handleMove = () => {
                dst.setView(src.getCenter(), src.getZoom(), { animate: false });
            };
            src.on('move', handleMove);
            return () => src.off('move', handleMove);
        };

        let cleanupA: (() => void) | undefined;
        let cleanupB: (() => void) | undefined;

        if (mapA.current && mapB.current) {
            cleanupA = sync(mapA.current, mapB.current);
            cleanupB = sync(mapB.current, mapA.current);
        }

        return () => {
            if (cleanupA) cleanupA();
            if (cleanupB) cleanupB();
        };
    }, [mapA, mapB, enabled]);
    return null;
};

const MiniMap: React.FC<{ points: any[], year: string, range: string }> = ({ points, year, range }) => (
    <div className="flex-1 min-w-[300px] h-[200px] bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden relative group">
        <div className="absolute top-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm border border-slate-100">
            <p className="text-[10px] font-bold text-slate-800">{year}</p>
            <p className="text-[8px] text-slate-500">{range}</p>
        </div>

        <MapContainer
            center={points.length > 0 ? [points[0].lat, points[0].lng] : [23.8103, 90.4125]}
            zoom={14}
            style={{ height: '100%', width: '100%', pointerEvents: 'none' }}
            zoomControl={false}
            attributionControl={false}
        >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
            {points.map((p, i) => (
                <React.Fragment key={i}>
                    <Circle
                        center={[p.lat, p.lng]}
                        radius={500}
                        pathOptions={{ fillColor: 'var(--color-primary)', fillOpacity: 0.2, stroke: false }}
                    />
                    <Marker
                        position={[p.lat, p.lng]}
                        icon={L.divIcon({
                            className: '',
                            html: `<div class="w-6 h-6 rounded-full bg-primary border-2 border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-white">${p.val}</div>`,
                            iconSize: [24, 24],
                            iconAnchor: [12, 12]
                        })}
                    />
                </React.Fragment>
            ))}
        </MapContainer>
    </div>
);

const serviceBreakdownData = [
    { name: 'Ride', value: 40, color: '#00A884' },
    { name: 'Food', value: 25, color: '#FF7043' },
    { name: 'Mart', value: 15, color: '#FFA726' },
    { name: 'Parcel', value: 10, color: '#26C6DA' },
    { name: 'Shopping', value: 5, color: '#7E57C2' },
    { name: 'Payments', value: 5, color: '#5C6BC0' },
];

const kpiStats = [
    { label: 'Total Live Requests', value: '1,284', icon: Activity, color: 'text-primary' },
    { label: 'Active Drivers', value: '482', icon: Car, color: 'text-blue-500' },
    { label: 'Active Orders', value: '342', icon: Utensils, color: 'text-orange-500' },
    { label: 'Ongoing Deliveries', value: '156', icon: Package, color: 'text-cyan-500' },
    { label: 'Payment Trans.', value: '2,340', icon: CreditCard, color: 'text-indigo-500' },
    { label: 'Cancellation Rate', value: '2.4%', icon: AlertCircle, color: 'text-red-500' },
];

export const HeatMapView = () => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [activeService, setActiveService] = useState('All Services');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [mapType, setMapType] = useState<'Map' | 'Satellite'>('Map');
    const [heatMode, setHeatMode] = useState<'Demand' | 'Supply' | 'Imbalance' | 'Revenue' | 'Trips Density' | 'Payments'>('Demand');
    const [dateRange, setDateRange] = useState('Today');
    const [compareMode, setCompareMode] = useState('Time vs Time');
    const [dateA, setDateA] = useState('Today');
    const [dateB, setDateB] = useState('Yesterday');
    const [zoneA, setZoneA] = useState('Downtown');
    const [zoneB, setZoneB] = useState('Airport');

    // 🗺️ Full Ops Layer States
    const [syncLayers, setSyncLayers] = useState(true);
    const [showHeat, setShowHeat] = useState(true);
    const [showDriversLayer, setShowDriversLayer] = useState(true);
    const [showOrdersLayer, setShowOrdersLayer] = useState(true);
    const [showSurgeLayer, setShowSurgeLayer] = useState(true);
    const [showZonesLayer, setShowZonesLayer] = useState(true);
    const [showPaymentsLayer, setShowPaymentsLayer] = useState(false);

    // 🗺️ Layer States for Sync
    const [compareHeatA, setCompareHeatA] = useState(true);
    const [compareDriversA, setCompareDriversA] = useState(true);
    const [compareOrdersA, setCompareOrdersA] = useState(true);
    const [compareHeatB, setCompareHeatB] = useState(true);
    const [compareDriversB, setCompareDriversB] = useState(true);
    const [compareOrdersB, setCompareOrdersB] = useState(true);

    // 🖱️ Interaction States
    const [hoveredZone, setHoveredZone] = useState<string | null>(null);
    const [selectedZone, setSelectedZone] = useState<string | null>(null);

    const [showRide, setShowRide] = useState(true);
    const [showFood, setShowFood] = useState(true);
    const [showParcel, setShowParcel] = useState(true);
    const [showShopping, setShowShopping] = useState(true);
    const [showPayments, setShowPayments] = useState(true);
    const [showDrivers, setShowDrivers] = useState(true);
    const [showOrders, setShowOrders] = useState(true);
    const [alertActive, setAlertActive] = useState(true);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const mapRefA = useRef<L.Map | null>(null);
    const mapRefB = useRef<L.Map | null>(null);

    const alertCoord: [number, number] = [mapYToLat(300), mapXToLng(200)];

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

    // 🧭 Auto-Center Logic for Zone vs Zone
    useEffect(() => {
        if (activeTab === 'Compare' && compareMode === 'Zone vs Zone') {
            const zoneToCoord = (name: string): [number, number] => {
                const pt = heatPoints.find(p => p.label === name);
                return pt ? [pt.lat, pt.lng] : [23.8103, 90.4125];
            };

            if (mapRefA.current) mapRefA.current.flyTo(zoneToCoord(zoneA), 14);
            if (mapRefB.current) mapRefB.current.flyTo(zoneToCoord(zoneB), 14);
        }
    }, [zoneA, zoneB, compareMode, activeTab]);

    const services = [
        'All Services', 'Ride Hailing', 'Food Delivery',
        'Mart Delivery', 'Parcel Delivery', 'Shopping', 'Payments'
    ];

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* 🧭 ENTERPRISE NAVIGATION LAYER */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-slate-800">Heat map</h1>
                    <Tabs activeKey={activeTab} onChange={setActiveTab} items={[
                        { id: 'Overview', label: 'Overview' },
                        { id: 'SupplyDemand', label: 'Supply vs Demand' },
                        { id: 'Revenue', label: 'Revenue' },
                        { id: 'Compare', label: 'Compare' }
                    ].map(tab => ({ key: tab.id, label: tab.label }))} className="mb-6 font-bold" />
                </div>
            </div>

            {/* 3️⃣ HEAT MAP CONTROL BAR (PRIMARY FILTER PANEL) */}
            {(activeTab === 'Overview' || activeTab === 'SupplyDemand' || activeTab === 'Revenue') && (
                <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            {/* Service Filter */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 tracking-wide block">Service type</label>
                                <div className="relative min-w-[180px]">
                                    <select
                                        value={activeService}
                                        onChange={(e) => setActiveService(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        {services.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Date Range */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 tracking-wide block">Date range</label>
                                <div className="flex bg-slate-50 p-1 rounded-xl">
                                    {['Live', 'Today', 'Last 7 Days', 'Last 30 Days'].map((range) => (
                                        <button
                                            key={range}
                                            onClick={() => setDateRange(range)}
                                            className={cn(
                                                "px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all",
                                                dateRange === range ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                                            )}
                                        >
                                            {range === 'Live' && <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse" />}
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors" title="Refresh">
                                <RefreshCcw className="w-4.5 h-4.5" />
                            </button>
                            <button className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors" title="Export">
                                <Download className="w-4.5 h-4.5" />
                            </button>
                            <button className="bg-primary text-white pl-4 pr-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition-all flex items-center gap-2">
                                <Share2 className="w-4 h-4" />
                                Heat Report
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 4️⃣ MAIN HEAT MAP SECTION (CORE VISUAL) */}
            <div className="flex-1 flex gap-6 min-h-0">
                {/* 🧪 CONDITIONAL MAIN CONTENT BASED ON ACTIVE TAB */}
                {activeTab === 'Compare' ? (
                    <div className="flex-1 flex flex-col gap-5 overflow-hidden pb-4">
                        {/* 1. Full Ops Header Control Bar */}
                        <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 p-3.5 px-5">
                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-5">
                                    {/* Service Selector */}
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-slate-400 pl-0.5">Service</label>
                                        <div className="relative group">
                                            <select
                                                value={activeService}
                                                onChange={(e) => setActiveService(e.target.value)}
                                                className="bg-slate-50 border-none rounded-xl pl-3 pr-8 py-2 text-[11px] font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-teal-500/20 w-36"
                                            >
                                                {services.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="h-8 w-px bg-slate-100" />

                                    {/* Mode & Periods */}
                                    <div className="flex items-center gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-slate-400 pl-0.5">Mode</label>
                                            <div className="relative group">
                                                <select
                                                    value={compareMode}
                                                    onChange={(e) => setCompareMode(e.target.value)}
                                                    className="bg-slate-50 border-none rounded-xl pl-3 pr-8 py-2 text-[11px] font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-teal-500/20 w-32"
                                                >
                                                    <option>Time vs Time</option>
                                                    <option>Service vs Service</option>
                                                    <option>Zone vs Zone</option>
                                                </select>
                                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-slate-400 pl-0.5">
                                                {compareMode === 'Time vs Time' ? 'Period A' : compareMode === 'Service vs Service' ? 'Service A' : 'Zone A'}
                                            </label>
                                            <div className="relative group">
                                                <select
                                                    value={compareMode === 'Zone vs Zone' ? zoneA : dateA}
                                                    onChange={(e) => compareMode === 'Zone vs Zone' ? setZoneA(e.target.value) : setDateA(e.target.value)}
                                                    className="bg-slate-50 border-none rounded-xl pl-3 pr-8 py-2 text-[11px] font-bold text-slate-700 appearance-none w-36"
                                                >
                                                    {compareMode === 'Time vs Time' ? (
                                                        <>
                                                            <option>Today (Live)</option>
                                                            <option>Yesterday</option>
                                                            <option>Same Day LW</option>
                                                            <option>Monthly Peak</option>
                                                        </>
                                                    ) : compareMode === 'Service vs Service' ? (
                                                        <>
                                                            <option>Ride (Hailing)</option>
                                                            <option>Food (Delivery)</option>
                                                            <option>Mart (Shopping)</option>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <option>Downtown</option>
                                                            <option>Airport</option>
                                                            <option>Suburbs</option>
                                                            <option>Business Dist</option>
                                                        </>
                                                    )}
                                                </select>
                                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="pt-4 text-slate-300 font-bold text-[10px]">VS</div>

                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-slate-400 pl-0.5">
                                                {compareMode === 'Time vs Time' ? 'Period B' : compareMode === 'Service vs Service' ? 'Service B' : 'Zone B'}
                                            </label>
                                            <div className="relative group">
                                                <select
                                                    value={compareMode === 'Zone vs Zone' ? zoneB : dateB}
                                                    onChange={(e) => compareMode === 'Zone vs Zone' ? setZoneB(e.target.value) : setDateB(e.target.value)}
                                                    className="bg-slate-50 border-none rounded-xl pl-3 pr-8 py-2 text-[11px] font-bold text-slate-700 appearance-none w-36"
                                                >
                                                    {compareMode === 'Time vs Time' ? (
                                                        <>
                                                            <option>Last 7 Days</option>
                                                            <option>Previous QTR</option>
                                                            <option>Peak Holiday</option>
                                                        </>
                                                    ) : compareMode === 'Service vs Service' ? (
                                                        <>
                                                            <option>Food (Delivery)</option>
                                                            <option>Parcel (Express)</option>
                                                            <option>Payments (Live)</option>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <option>Downtown</option>
                                                            <option>Airport</option>
                                                            <option>Suburbs</option>
                                                            <option>Business Dist</option>
                                                        </>
                                                    )}
                                                </select>
                                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="h-8 w-px bg-slate-100 mx-2" />

                                        {/* Global Date Range Context */}
                                        {compareMode === 'Time vs Time' && (
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-slate-400 pl-0.5">Date Range</label>
                                                <div className="relative group">
                                                    <select
                                                        value={dateRange}
                                                        onChange={(e) => setDateRange(e.target.value)}
                                                        className="bg-slate-50 border-none rounded-xl pl-3 pr-8 py-2 text-[11px] font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-teal-500/20 w-32"
                                                    >
                                                        <option>Today</option>
                                                        <option>Yesterday</option>
                                                        <option>Last 7 Days</option>
                                                        <option>Last 30 Days</option>
                                                    </select>
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                </div>
                                            </div>
                                        )}

                                        {compareMode === 'Time vs Time' && <div className="h-8 w-px bg-slate-100" />}

                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    {/* Heat Mode Selector */}
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-slate-400 pl-0.5">Heat mode</label>
                                        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200/50 overflow-x-auto scrollbar-hide max-w-[280px]">
                                            {(['Demand', 'Supply', 'Imbalance', 'Revenue', 'Payments'] as const).map((mode) => (
                                                <button
                                                    key={mode}
                                                    onClick={() => setHeatMode(mode)}
                                                    className={cn(
                                                        "px-2.5 py-1 text-[9px] font-bold rounded-lg transition-all whitespace-nowrap",
                                                        heatMode === mode ? "bg-white text-primary shadow-sm border border-slate-200/50" : "text-slate-400 hover:text-slate-600"
                                                    )}
                                                >
                                                    {mode}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="h-8 w-px bg-slate-100" />

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setSyncLayers(!syncLayers)}
                                            className={cn(
                                                "p-2 rounded-xl transition-all border",
                                                syncLayers ? "bg-teal-50 border-teal-200 text-teal-600" : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600"
                                            )}
                                            title="Toggle Layer Sync"
                                        >
                                            <Link2 className="w-4 h-4" />
                                        </button>
                                        <button className="bg-primary hover:bg-teal-600 text-white px-5 py-2.5 rounded-xl text-[11px] font-bold shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2">
                                            <Download className="w-3.5 h-3.5" />
                                            Full Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Dual Map Canvas — The Hero Component */}
                        <div className="flex-1 flex gap-5 min-h-0 relative">
                            {[
                                { id: 'A', ref: mapRefA, title: compareMode === 'Zone vs Zone' ? `${zoneA} Cluster` : dateA, stats: { trips: 142, drivers: 52, eta: 4.8, revenue: '$2.4k' } },
                                { id: 'B', ref: mapRefB, title: compareMode === 'Zone vs Zone' ? `${zoneB} Cluster` : dateB, stats: { trips: 184, drivers: 38, eta: 6.2, revenue: '$3.1k' } }
                            ].map((m, idx) => (
                                <div key={m.id} className="flex-1 rounded-[32px] border border-slate-200/60 shadow-soft overflow-hidden relative group">
                                    {/* Map Header Floating Overlay */}
                                    <div className="absolute top-5 left-5 z-[1000] flex items-center gap-3">
                                        <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/50 shadow-lg flex items-center gap-3">
                                            <div className={cn("w-2 h-2 rounded-full animate-pulse", m.id === 'A' ? "bg-slate-400" : "bg-primary")} />
                                            <span className="text-[11px] font-bold text-slate-700 tracking-tight">{m.title}</span>
                                        </div>
                                    </div>

                                    {/* 🕹️ Floating Vertical Layer Controls */}
                                    <div className="absolute top-20 left-5 z-[1000] flex flex-col gap-2">
                                        {[
                                            { id: 'heat', icon: Layers, label: 'Heat Layer', active: showHeat, set: setShowHeat },
                                            { id: 'drivers', icon: Car, label: 'Drivers', active: showDriversLayer, set: setShowDriversLayer },
                                            { id: 'orders', icon: Package, label: 'Orders', active: showOrdersLayer, set: setShowOrdersLayer },
                                            { id: 'surge', icon: Zap, label: 'Surge Zones', active: showSurgeLayer, set: setShowSurgeLayer },
                                            { id: 'zones', icon: MapPin, label: 'Boundaries', active: showZonesLayer, set: setShowZonesLayer },
                                        ].map((btn) => (
                                            <button
                                                key={btn.id}
                                                onClick={() => btn.set(!btn.active)}
                                                className={cn(
                                                    "w-10 h-10 rounded-xl backdrop-blur-md border shadow-lg flex items-center justify-center transition-all group/btn",
                                                    btn.active
                                                        ? "bg-primary border-primary/20 text-white shadow-teal-500/20"
                                                        : "bg-white/90 border-slate-200/50 text-slate-400 hover:text-slate-600 hover:bg-white"
                                                )}
                                                title={btn.label}
                                            >
                                                <btn.icon className="w-4.5 h-4.5" />
                                                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-[9px] font-bold rounded opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                                                    {btn.label}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Floating Stats Card — Core OPS View */}
                                    <div className="absolute top-5 right-5 z-[1000] w-52">
                                        <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 p-4 shadow-2xl space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    <span className="text-[9px] font-bold text-slate-400 ">Ops status</span>
                                                </div>
                                                <Activity className="w-3 h-3 text-primary" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                                <div>
                                                    <p className="text-[14px] font-bold text-white leading-none">{m.stats.trips}</p>
                                                    <p className="text-[8px] font-bold text-slate-500 mt-1">Trips</p>
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-bold text-white leading-none">{m.stats.drivers}</p>
                                                    <p className="text-[8px] font-bold text-slate-500 mt-1">Agents</p>
                                                </div>
                                                <div className="col-span-1 pt-1 border-t border-white/5">
                                                    <p className="text-[12px] font-bold text-primary leading-none">{m.stats.eta}m</p>
                                                    <p className="text-[8px] font-bold text-slate-500 mt-1">ETA</p>
                                                </div>
                                                <div className="col-span-1 pt-1 border-t border-white/5">
                                                    <p className="text-[12px] font-bold text-white leading-none">{m.stats.revenue}</p>
                                                    <p className="text-[8px] font-bold text-slate-500 mt-1">Rev</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Operational Heat Map */}
                                    <MapContainer
                                        center={[23.8103, 90.4125]}
                                        zoom={13}
                                        style={{ height: '100%', width: '100%' }}
                                        zoomControl={false}
                                        attributionControl={false}
                                        ref={m.ref}
                                    >
                                        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />

                                        {/* Heat & Operational Layers Logic */}
                                        {showHeat && heatPoints.map((p) => (
                                            <Circle
                                                key={`${m.id}-${p.id}`}
                                                center={[p.lat, p.lng]}
                                                radius={p.radius}
                                                pathOptions={{
                                                    fillColor: heatMode === 'Imbalance'
                                                        ? (p.val > p.supply * 3 ? '#ef4444' : p.val < p.supply ? '#3b82f6' : '#10b981')
                                                        : heatMode === 'Revenue' ? '#7c3aed'
                                                            : heatMode === 'Payments' ? '#ec4899'
                                                                : heatMode === 'Supply' ? '#10b981'
                                                                    : m.id === 'A' ? (compareMode === 'Service vs Service' ? serviceColors['Food'] : '#94a3b8') : serviceColors[p.service],
                                                    fillOpacity: 0.35,
                                                    stroke: false
                                                }}
                                                eventHandlers={{
                                                    mouseover: () => setHoveredZone(p.label),
                                                    mouseout: () => setHoveredZone(null),
                                                    click: () => setSelectedZone(p.label)
                                                }}
                                            />
                                        ))}

                                        {/* Surge Zones Visualization (Enhanced Logic) */}
                                        {showSurgeLayer && heatPoints.filter(p => (heatMode === 'Imbalance' && p.val > p.supply * 2.5) || (heatMode === 'Demand' && p.intensity > 0.8)).map(p => (
                                            <Circle
                                                key={`surge-${m.id}-${p.id}`}
                                                center={[p.lat, p.lng]}
                                                radius={p.radius * 0.55}
                                                pathOptions={{
                                                    fillColor: '#f59e0b',
                                                    fillOpacity: 0.25,
                                                    weight: 2,
                                                    color: '#f59e0b',
                                                    dashArray: '4, 6'
                                                }}
                                            />
                                        ))}

                                        {/* Driver Icons Layer */}
                                        {showDriversLayer && fleetData.map((d) => (
                                            <Marker
                                                key={`${m.id}-${d.id}`}
                                                position={[d.lat, d.lng]}
                                                icon={L.divIcon({
                                                    className: 'custom-div-icon',
                                                    html: `<div class="w-3 h-3 rounded-full border-2 border-white shadow-xl ${d.status === 'Available' ? 'bg-green-500' : 'bg-amber-500'}" />`,
                                                    iconSize: [12, 12]
                                                })}
                                            />
                                        ))}

                                        {/* Order Pins Layer */}
                                        {showOrdersLayer && idx === 1 && heatPoints.slice(0, 4).map(p => (
                                            <Marker
                                                key={`order-${p.id}`}
                                                position={[p.lat + 0.001, p.lng - 0.001]}
                                                icon={L.divIcon({
                                                    className: 'order-pin',
                                                    html: `<div class="bg-primary text-white px-1.5 py-1 rounded-lg shadow-xl flex items-center gap-1.5 border border-white/20"><div class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div> <span class="text-[9px] font-bold tracking-tight">REQ</span></div>`,
                                                    iconSize: [40, 20],
                                                    iconAnchor: [20, 10]
                                                })}
                                            />
                                        ))}

                                        {idx === 1 && <SyncMaps mapA={mapRefA} mapB={mapRefB} enabled={compareMode !== 'Zone vs Zone'} />}
                                    </MapContainer>

                                    {/* Bottom Right Legend */}
                                    <div className="absolute bottom-5 right-5 z-[1000] bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200/50 shadow-lg">
                                        <p className="text-[9px] font-bold text-slate-400 mb-2">Ops Legend</p>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                                <span className="text-[9px] font-bold text-slate-600">Surge Area</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                                <span className="text-[9px] font-bold text-slate-600">Available</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                <span className="text-[9px] font-bold text-slate-600">Oversupply</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                                <span className="text-[9px] font-bold text-slate-600">Active Trip</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sync Indicator */}
                                    {compareMode !== 'Zone vs Zone' && (
                                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[1000]">
                                            <div className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200/50 shadow-sm flex items-center gap-2">
                                                <Link2 className="w-3 h-3 text-primary" />
                                                <span className="text-[9px] font-bold text-slate-500 ">Synced Camera</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* 🖱️ INTERACTIVE OVERLAYS (TOOLTIP & MODAL) */}
                        <AnimatePresence>
                            {hoveredZone && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute bottom-32 left-1/2 -translate-x-1/2 z-[2000] bg-slate-900 text-white rounded-2xl shadow-2xl border border-white/10 p-5 flex items-center gap-8 min-w-[500px]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20">
                                            <Globe className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">{hoveredZone} Cluster</h4>
                                            <p className="text-[10px] font-bold text-primary mt-1">AI Usage Analysis</p>
                                        </div>
                                    </div>

                                    <div className="h-10 w-px bg-white/10" />

                                    <div className="flex-1 grid grid-cols-2 gap-6">
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-[9px] font-bold text-slate-500 ">
                                                    {compareMode === 'Zone vs Zone' ? 'Zone A Usage' : 'Period A Usage'}
                                                </span>
                                                <span className="text-[11px] font-bold text-slate-300">42%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-slate-500 w-[42%]" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-[9px] font-bold text-slate-500 ">
                                                    {compareMode === 'Zone vs Zone' ? 'Zone B Usage' : 'Period B Usage'}
                                                </span>
                                                <span className="text-[11px] font-bold text-primary">+27% Delta</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary w-[69%]" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-primary/10 px-3 py-2 rounded-xl border border-primary/20 max-w-[140px]">
                                        <p className="text-[9px] font-bold text-primary leading-tight">AI Advice: Add 12 drivers to offset saturation.</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* 📈 AI PERFORMANCE DELTA BAR */}
                        <div className="bg-slate-900 border-t border-white/5 p-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-bold text-white leading-none">+18.4%</p>
                                        <p className="text-[9px] font-bold text-slate-500 mt-1">Global Variance</p>
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-white/5" />
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/20">
                                        <Activity className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-bold text-white leading-none">2,482</p>
                                        <p className="text-[9px] font-bold text-slate-500 mt-1">Order Shift</p>
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-white/5" />
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center border border-orange-500/20">
                                        <Users className="w-4 h-4 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-bold text-white leading-none">-4.2%</p>
                                        <p className="text-[9px] font-bold text-slate-500 mt-1">Agent Density</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                                <div className="flex items-center -space-x-2">
                                    {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-700" />)}
                                </div>
                                <p className="text-[10px] font-bold text-slate-400">
                                    <span className="text-white">AI Verdict:</span> Growth in {compareMode === 'Zone vs Zone' ? zoneB : 'Period B'} driven by {compareMode === 'Service vs Service' ? 'Parcel' : 'Holiday Demand'}.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* 🔽 REST OF THE TABS (Overview, Supply vs Demand, Revenue) */}
                        <div className="w-[380px] flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
                            {/* Live KPI Cards */}
                            <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 p-6">
                                <h3 className="text-xs font-bold text-slate-800 mb-5 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-primary" />
                                    Live insights
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {kpiStats.map((stat) => (
                                        <div key={stat.label} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 group hover:bg-white hover:shadow-md transition-all">
                                            <stat.icon className={cn("w-5 h-5 mb-3", stat.color)} />
                                            <p className="text-[20px] font-bold text-slate-800 leading-none">{stat.value}</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1.5 tracking-wide group-hover:text-slate-500">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hot Zones List */}
                            <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-orange-500" />
                                        Top demand zones
                                    </h3>
                                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Live</span>
                                </div>
                                <div className="space-y-2">
                                    {[
                                        { name: 'Dhaka Central', val: 'High', color: 'bg-red-500' },
                                        { name: 'Airport Perimeter', val: 'High', color: 'bg-red-500' },
                                        { name: 'Gulshan North', val: 'Medium', color: 'bg-orange-500' },
                                        { name: 'Banani Residential', val: 'Medium', color: 'bg-orange-500' },
                                        { name: 'Mirpur Sector 10', val: 'Low', color: 'bg-green-500' },
                                    ].map((zone) => (
                                        <div key={zone.name} className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-2xl border border-slate-50 border-transparent hover:border-slate-100/50 hover:bg-white transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-2 h-2 rounded-full", zone.color)} />
                                                <span className="text-[13px] font-semibold text-slate-700">{zone.name}</span>
                                            </div>
                                            <span className={cn(
                                                "text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wide",
                                                zone.val === 'High' ? "text-red-600 bg-red-50" : zone.val === 'Medium' ? "text-orange-600 bg-orange-50" : "text-green-600 bg-green-50"
                                            )}>{zone.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Service Breakdown Chart */}
                            <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 p-6">
                                <h3 className="text-xs font-bold text-slate-800 mb-6">Service breakdown</h3>
                                <div className="h-[200px] w-full relative">
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                        <PieChart>
                                            <Pie
                                                data={serviceBreakdownData}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {serviceBreakdownData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-[24px] font-bold text-slate-800">100%</span>
                                        <span className="text-[10px] font-bold text-slate-400 tracking-wide">Growth</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    {serviceBreakdownData.map((item) => (
                                        <div key={item.name} className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-[11px] font-bold text-slate-600">{item.name}</span>
                                            <span className="text-[11px] font-bold text-slate-400 ml-auto">{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 🌍 5️⃣ RIGHT PANEL — INTERACTIVE HEAT MAP */}
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
                                ref={mapRef}
                            >
                                <TileLayer
                                    url={mapType === 'Map'
                                        ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                                        : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                    }
                                />


                                {/* Heat Points Visualization */}
                                {heatPoints.map((point) => {
                                    const isVisible =
                                        (point.service === 'Ride' && showRide) ||
                                        (point.service === 'Food' && showFood) ||
                                        (point.service === 'Parcel' && showParcel) ||
                                        (point.service === 'Shopping' && showShopping) ||
                                        (point.service === 'Payments' && showPayments);

                                    if (!isVisible) return null;

                                    // 📊 LOGIC BASED ON ACTIVE TAB
                                    let color = serviceColors[point.service];
                                    let val = point.val;
                                    let label = 'Requests';

                                    if (activeTab === 'SupplyDemand') {
                                        const ratio = point.supply / point.val;
                                        if (ratio < 0.3) {
                                            color = '#ef4444'; // Red - Shortage
                                            label = 'Critical Shortage';
                                        } else if (ratio > 1.2) {
                                            color = '#3b82f6'; // Blue - Oversupply
                                            label = 'Oversupply';
                                        } else {
                                            color = '#22c55e'; // Green - Balanced
                                            label = 'Balanced';
                                        }
                                        val = Math.round(ratio * 100);
                                    } else if (activeTab === 'Revenue') {
                                        // Mock revenue color scale
                                        const revWeight = point.val / 100;
                                        color = revWeight > 0.7 ? '#10b981' : revWeight > 0.4 ? '#3b82f6' : '#6366f1';
                                        label = 'Revenue Growth';
                                        val = Math.round(point.val * 12.5); // Mock revenue value
                                    }

                                    return (
                                        <React.Fragment key={point.id}>
                                            <Circle
                                                center={[point.lat, point.lng]}
                                                radius={point.radius}
                                                pathOptions={{
                                                    fillColor: color,
                                                    fillOpacity: 0.15,
                                                    stroke: false
                                                }}
                                            />
                                            <Circle
                                                center={[point.lat, point.lng]}
                                                radius={point.radius / 2}
                                                pathOptions={{
                                                    fillColor: color,
                                                    fillOpacity: 0.35,
                                                    stroke: false
                                                }}
                                            />
                                            <Marker
                                                position={[point.lat, point.lng]}
                                                icon={L.divIcon({
                                                    className: '',
                                                    html: `
 <div class="relative group cursor-pointer" style="transform: translate(-50%, -50%)">
 <div class="w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold transition-transform group-hover:scale-110" style="background-color: ${color}">
 ${activeTab === 'Revenue' ? '$' + val : (activeTab === 'SupplyDemand' ? val + '%' : val)}
 </div>
 <div class="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white px-2 py-1 rounded-md shadow-md text-[9px] font-bold text-slate-600 border border-slate-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
 ${point.label} • ${label}
 </div>
 </div>
 `,
                                                    iconSize: [40, 40],
                                                    iconAnchor: [20, 20]
                                                })}
                                            />
                                        </React.Fragment>
                                    );
                                })}

                                {/* Fleet Layer (Only in Supply vs Demand Mode) */}
                                {activeTab === 'SupplyDemand' && fleetData.map((agent) => (
                                    <Marker
                                        key={`agent-${agent.id}`}
                                        position={[agent.lat, agent.lng]}
                                        icon={L.divIcon({
                                            className: '',
                                            html: `
 <div class="relative flex items-center justify-center">
 <div class="w-3 h-3 rounded-full border-2 border-white shadow-sm" style="background-color: ${statusColors[agent.status]}"></div>
 </div>
 `,
                                            iconSize: [12, 12],
                                            iconAnchor: [6, 6]
                                        })}
                                    />
                                ))}

                                {/* Sonar Pulse Highlight for Alerts */}
                                {alertActive && (
                                    <Marker
                                        position={alertCoord}
                                        icon={L.divIcon({
                                            className: '',
                                            html: `
 <div class="relative flex items-center justify-center">
 <div class="absolute w-12 h-12 bg-orange-500 rounded-full animate-sonar opacity-60"></div>
 <div class="absolute w-24 h-24 bg-orange-500 rounded-full animate-sonar opacity-30" style="animation-delay: 0.5s"></div>
 <div class="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg relative z-10"></div>
 </div>
 `,
                                            iconSize: [40, 40],
                                            iconAnchor: [20, 20]
                                        })}
                                    />
                                )}

                                {/* Floating Map Controls */}
                                <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-1.5 grayscale-[0.2]">
                                    {/* Map Type Toggle */}
                                    <button
                                        onClick={() => setMapType(mapType === 'Map' ? 'Satellite' : 'Map')}
                                        className="w-8 h-8 bg-white shadow-lg rounded-lg flex items-center justify-center transition-all border border-slate-100 text-slate-500 hover:text-primary active:scale-95 group"
                                        title={`Switch to ${mapType === 'Map' ? 'Satellite' : 'Map'}`}
                                    >
                                        {mapType === 'Map' ? <Globe className="w-4 h-4" /> : <MapPin className="w-4 h-4 text-primary" />}
                                    </button>

                                    {/* Layer Toggles */}
                                    <button
                                        onClick={() => setShowRide(!showRide)}
                                        className={cn(
                                            "w-8 h-8 flex items-center justify-center rounded-lg shadow-lg border transition-all active:scale-95",
                                            showRide ? "bg-[#00A884] text-white border-[#00A884]" : "bg-white text-slate-500 border-slate-100 hover:text-[#00A884]"
                                        )}
                                        title="Toggle Ride Heat"
                                    >
                                        <Car className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={() => setShowFood(!showFood)}
                                        className={cn(
                                            "w-8 h-8 flex items-center justify-center rounded-lg shadow-lg border transition-all active:scale-95",
                                            showFood ? "bg-[#FF7043] text-white border-[#FF7043]" : "bg-white text-slate-500 border-slate-100 hover:text-[#FF7043]"
                                        )}
                                        title="Toggle Food Heat"
                                    >
                                        <Utensils className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={() => setShowParcel(!showParcel)}
                                        className={cn(
                                            "w-8 h-8 flex items-center justify-center rounded-lg shadow-lg border transition-all active:scale-95",
                                            showParcel ? "bg-[#26C6DA] text-white border-[#26C6DA]" : "bg-white text-slate-500 border-slate-100 hover:text-[#26C6DA]"
                                        )}
                                        title="Toggle Parcel Heat"
                                    >
                                        <Package className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={() => setShowShopping(!showShopping)}
                                        className={cn(
                                            "w-8 h-8 flex items-center justify-center rounded-lg shadow-lg border transition-all active:scale-95",
                                            showShopping ? "bg-[#7E57C2] text-white border-[#7E57C2]" : "bg-white text-slate-500 border-slate-100 hover:text-[#7E57C2]"
                                        )}
                                        title="Toggle Shopping Heat"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={() => setShowPayments(!showPayments)}
                                        className={cn(
                                            "w-8 h-8 flex items-center justify-center rounded-lg shadow-lg border transition-all active:scale-95",
                                            showPayments ? "bg-[#5C6BC0] text-white border-[#5C6BC0]" : "bg-white text-slate-500 border-slate-100 hover:text-[#5C6BC0]"
                                        )}
                                        title="Toggle Payments Heat"
                                    >
                                        <CreditCard className="w-4 h-4" />
                                    </button>

                                    {/* Heat Mode Toggles */}
                                    <button
                                        onClick={() => setHeatMode('Demand')}
                                        className={cn(
                                            "w-8 h-8 flex items-center justify-center rounded-lg shadow-lg border transition-all active:scale-95",
                                            heatMode === 'Demand' ? "bg-primary text-white border-primary" : "bg-white text-slate-500 border-slate-100 hover:text-primary"
                                        )}
                                        title="Show Demand Heatmap"
                                    >
                                        <TrendingUp className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setHeatMode('Imbalance')}
                                        className={cn(
                                            "w-8 h-8 flex items-center justify-center rounded-lg shadow-lg border transition-all active:scale-95",
                                            heatMode === 'Imbalance' ? "bg-primary text-white border-primary" : "bg-white text-slate-500 border-slate-100 hover:text-primary"
                                        )}
                                        title="Show Supply vs Demand"
                                    >
                                        <Zap className="w-4 h-4" />
                                    </button>

                                    {/* Fullscreen Toggle */}
                                    <button
                                        onClick={toggleFullscreen}
                                        className="w-8 h-8 bg-white shadow-lg rounded-lg flex items-center justify-center transition-all border border-slate-100 text-slate-500 hover:text-primary active:scale-95"
                                        title="Toggle Fullscreen"
                                    >
                                        <Maximize2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Map Legend */}
                                <div className="absolute bottom-6 right-6 z-[1000]">
                                    <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border border-slate-200/50 p-4 min-w-[160px]">
                                        <h4 className="text-[10px] font-bold text-slate-500 mb-2">Legend</h4>
                                        <div className="flex flex-col gap-2">
                                            {activeTab === 'Overview' ? (
                                                Object.entries(serviceColors).map(([service, color]) => (
                                                    <div key={service} className="flex items-center gap-2">
                                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                                                        <span className="text-[10px] font-medium text-slate-600">{service} Demand</span>
                                                    </div>
                                                ))
                                            ) : activeTab === 'Revenue' ? (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                                                        <span className="text-[10px] font-medium text-slate-600">High Revenue (&gt; $1k)</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                                                        <span className="text-[10px] font-medium text-slate-600">Stable Rev ($500-1k)</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" />
                                                        <span className="text-[10px] font-medium text-slate-600">Low Rev (&lt; $500)</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                                                        <span className="text-[10px] font-medium text-slate-600">Shortage Zone</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                                                        <span className="text-[10px] font-medium text-slate-600">Balanced Zone</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                                                        <span className="text-[10px] font-medium text-slate-600">Oversupply Zone</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 📊 6️⃣ REAL-TIME FLOATING ANALYTICS PANEL (OVER MAP) */}
                                <div className="absolute top-6 right-6 z-[1000]">
                                    <div className="bg-white/80 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] rounded-[28px] border border-white/50 p-5 w-64">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-[10px] font-bold text-slate-500 ">Live status</h4>
                                            <div className="flex gap-1">
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            {(activeTab === 'Revenue' ? [
                                                { label: 'Total Revenue', value: '$84,200', color: 'text-emerald-500' },
                                                { label: 'Commission (Live)', value: '$12,450', color: 'text-primary' },
                                                { label: 'Highest Zone', value: 'Downtown', color: 'text-slate-800' },
                                                { label: 'Avg Basket Size', value: '$42.50', color: 'text-indigo-500' },
                                                { label: 'Growth (HoH)', value: '+14.2%', color: 'text-emerald-500' },
                                            ] : [
                                                { label: 'Live trips', value: '128', color: 'text-primary' },
                                                { label: 'Live orders', value: '342', color: 'text-orange-500' },
                                                { label: 'Active drivers', value: '89', color: 'text-blue-500' },
                                                { label: 'Avg ETA', value: '6.2 min', color: 'text-indigo-500' },
                                                { label: 'Revenue (live)', value: '$2,340', color: 'text-slate-800' },
                                            ]).map((stat) => (
                                                <div key={stat.label} className="flex items-center justify-between">
                                                    <span className="text-[11px] font-bold text-slate-400 tracking-wide">{stat.label}</span>
                                                    <span className={cn("text-[13px] font-bold", stat.color)}>{stat.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* ⚡ 8️⃣ SMART ALERT BANNER (DYNAMIC) */}
                                <div className="absolute top-32 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-sm px-4">
                                    <AnimatePresence>
                                        {alertActive && (
                                            <motion.div
                                                initial={{ y: -20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -20, opacity: 0 }}
                                                onClick={() => {
                                                    mapRef.current?.setView(alertCoord, 15, { animate: true });
                                                }}
                                                className="bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-4 border border-white/10 cursor-pointer group hover:bg-slate-800 transition-all active:scale-95"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                                                        <Zap className="w-4 h-4 text-orange-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-bold leading-tight">High Demand Surge</p>
                                                        <p className="text-[10px] text-slate-400 mt-0.5">Peak activity in Dhaka Central • Click to view</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setAlertActive(false);
                                                    }}
                                                    className="text-slate-500 hover:text-white transition-colors p-1"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </MapContainer>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
