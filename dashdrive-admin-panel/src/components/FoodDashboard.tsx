import React from 'react';
import {
    Utensils,
    Store,
    Bike,
    Clock,
    Activity,
    TrendingUp,
    MoreVertical,
    ChevronRight,
    Map as MapIcon,
    Star
} from 'lucide-react';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { StatCard } from './StatCard';
import { cn } from '../utils';

// Coordinate mapping helper
const mapXToLng = (x: number) => 90.4125 + (x - 600) * 0.0001;
const mapYToLat = (y: number) => 23.8103 - (y - 400) * 0.0001;

const heatPoints = [
    { id: 1, lat: mapYToLat(300), lng: mapXToLng(200), radius: 800, intensity: 0.8 },
    { id: 2, lat: mapYToLat(200), lng: mapXToLng(500), radius: 1000, intensity: 0.9 },
    { id: 3, lat: mapYToLat(450), lng: mapXToLng(800), radius: 700, intensity: 0.6 },
    { id: 4, lat: mapYToLat(600), lng: mapXToLng(350), radius: 900, intensity: 0.7 },
];

const peakHoursData = [
    { hour: '08:00', orders: 40 },
    { hour: '10:00', orders: 65 },
    { hour: '12:00', orders: 120 },
    { hour: '14:00', orders: 95 },
    { hour: '16:00', orders: 70 },
    { hour: '18:00', orders: 150 },
    { hour: '20:00', orders: 180 },
    { hour: '22:00', orders: 110 },
];

const statusData = [
    { name: 'Delivered', value: 720, color: '#10b981' },
    { name: 'Preparing', value: 145, color: '#f59e0b' },
    { name: 'Pending', value: 48, color: '#3b82f6' },
    { name: 'Cancelled', value: 24, color: '#ef4444' },
];

export const FoodDashboard: React.FC = () => {
    return (
        <div className="space-y-10 pb-8">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                <StatCard
                    title="Total Orders"
                    value="1,248"
                    icon={<Utensils />}
                    color="bg-primary"
                    trend="+14% vs avg"
                />
                <StatCard
                    title="Active Vendors"
                    value="182"
                    icon={<Store />}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Riders Online"
                    value="42"
                    icon={<Bike />}
                    color="bg-blue-500"
                    trend="Stable"
                />
                <StatCard
                    title="Avg Delivery"
                    value="28 min"
                    icon={<Clock />}
                    color="bg-amber-500"
                    trend="-2 min improved"
                />
                <StatCard
                    title="Completion"
                    value="98.2%"
                    icon={<Activity />}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Food Revenue"
                    value="$12.4k"
                    icon={<TrendingUp />}
                    color="bg-rose-500"
                    trend="+22% growth"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left: Heat Map */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100/50">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-display font-extrabold text-slate-800 tracking-tight">Food Order Hotspots</h3>
                                <p className="text-sm text-slate-400 font-medium">Live demand density across restaurant clusters</p>
                            </div>
                            <button className="flex items-center gap-2 px-6 py-2 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold font-small-caps text-slate-500 rounded-xl transition-all border border-slate-100/50">
                                Expand Detail <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>

                        <div className="h-[400px] bg-slate-50 rounded-[28px] overflow-hidden border border-slate-100 relative group">
                            <MapContainer
                                center={[23.8103, 90.4125]}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                                zoomControl={false}
                                attributionControl={false}
                            >
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
                                {heatPoints.map((p) => (
                                    <Circle
                                        key={p.id}
                                        center={[p.lat, p.lng]}
                                        radius={p.radius}
                                        pathOptions={{
                                            fillColor: '#FF7043',
                                            fillOpacity: 0.3 * p.intensity,
                                            stroke: false
                                        }}
                                    />
                                ))}
                            </MapContainer>

                            <div className="absolute top-6 left-6 z-[1000] bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100 shadow-lg flex items-center gap-3">
                                <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
                                <span className="text-[10px] font-bold text-slate-600 font-small-caps tracking-widest uppercase">Analyzing 1,240 Current Reqs</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100/50">
                            <h4 className="text-[10px] font-small-caps font-bold text-slate-400 tracking-[0.25em] mb-8">Peak Order Velocity</h4>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <AreaChart data={peakHoursData}>
                                        <defs>
                                            <linearGradient id="foodGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#00A89D" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#00A89D" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="orders" stroke="#00A89D" strokeWidth={3} fillOpacity={1} fill="url(#foodGradient)" />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '12px' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100/50">
                            <h4 className="text-[10px] font-small-caps font-bold text-slate-400 tracking-[0.25em] mb-8">Top Performer Ranking</h4>
                            <div className="space-y-6">
                                {[
                                    { name: "Burger King", orders: "420", rating: 4.8 },
                                    { name: "Sultan's Dine", orders: "385", rating: 4.9 },
                                    { name: "Pizza Hut", orders: "310", rating: 4.5 }
                                ].map((res, i) => (
                                    <div key={res.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-display font-black text-xs border border-slate-100/50">
                                                0{i + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-display font-bold text-slate-800 tracking-tight">{res.name}</p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                                                    <span className="text-[10px] font-bold text-slate-400">{res.rating} rating</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-display font-extrabold text-slate-900">{res.orders}</p>
                                            <p className="text-[9px] text-slate-400 font-bold font-small-caps">orders</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Order Distribution & Alerts */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100/50">
                        <h3 className="text-[10px] font-small-caps font-bold text-slate-400 tracking-[0.25em] mb-8">Real-time Order Status</h3>
                        <div className="h-[240px] relative">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        innerRadius={65}
                                        outerRadius={95}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-display font-black text-slate-800">937</span>
                                <span className="text-[9px] font-bold text-slate-400 font-small-caps tracking-widest uppercase">Total Active</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            {statusData.map((s) => (
                                <div key={s.name} className="flex items-center gap-2.5 py-1">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                                    <span className="text-[10px] font-bold text-slate-500 font-small-caps tracking-wider">{s.name} ({s.value})</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[32px] shadow-2xl shadow-slate-900/10 border border-white/5">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-[10px] font-small-caps font-bold text-white/40 tracking-[0.25em]">Operational Alerts</h3>
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        </div>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                                    <Clock className="w-4.5 h-4.5 text-red-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-display font-bold text-white tracking-tight">Delivery Lag in Zone A</p>
                                    <p className="text-[11px] text-white/50 mt-1.5 leading-relaxed font-medium">Avg wait reached 45 mins. Recommendation: Boost rider commission.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                                    <Activity className="w-4.5 h-4.5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-display font-bold text-white tracking-tight">System Spike</p>
                                    <p className="text-[11px] text-white/50 mt-1.5 leading-relaxed font-medium">Order volume +40% since 18:00. Scaling background workers.</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 text-white/60 rounded-xl text-[10px] font-bold font-small-caps tracking-widest border border-white/10 transition-all uppercase">
                            View All System Health
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
