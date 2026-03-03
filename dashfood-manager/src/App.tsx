import React, { useState } from 'react';
import {
    LayoutDashboard,
    Store,
    Menu as MenuIcon,
    ShoppingBag,
    BarChart3,
    Users,
    Megaphone,
    CreditCard,
    FileText,
    UserCircle,
    Settings as SettingsIcon,
    ChevronDown,
    Bell,
    Search,
    Calendar,
    TrendingUp,
    Star,
    Clock,
    Pencil,
    Tag,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    Info,
    Smartphone,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { cn } from './lib/utils';
import { Card, Button, Badge } from './components/ui';
import Marketing from './components/Marketing';

// --- Types ---
type Tab = 'dashboard' | 'marketing';

// --- Mock Data ---
const SALES_DATA = [
    { time: '8am', sales: 120 },
    { time: '10am', sales: 340 },
    { time: '12pm', sales: 890 },
    { time: '2pm', sales: 450 },
    { time: '4pm', sales: 560 },
    { time: '6pm', sales: 1200 },
    { time: '8pm', sales: 980 },
    { time: '10pm', sales: 430 },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, isCollapsed }: { icon: any, label: string, active: boolean, onClick: () => void, isCollapsed: boolean }) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group",
            active ? "bg-zinc-900 text-white shadow-md" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
            isCollapsed && "justify-center px-0"
        )}
        title={isCollapsed ? label : undefined}
    >
        <Icon size={18} className={cn("transition-transform group-hover:scale-110 shrink-0", active ? "text-white" : "text-zinc-400")} />
        {!isCollapsed && <span className="text-sm font-medium truncate">{label}</span>}
    </button>
);

const StatCard = ({ title, value, trend, trendValue, icon: Icon, onClick }: any) => (
    <Card className="cursor-pointer hover:border-zinc-300 transition-all group" onClick={onClick}>
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-zinc-50 rounded-lg group-hover:bg-zinc-100 transition-colors">
                <Icon size={20} className="text-zinc-600" />
            </div>
            <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trend === 'up' ? "text-emerald-600" : "text-red-600"
            )}>
                {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {trendValue}
            </div>
        </div>
        <h4 className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{title}</h4>
        <div className="text-2xl font-bold text-zinc-900 mt-1">{value}</div>
    </Card>
);

const Dashboard = () => (
    <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Live Sales" value="$1,245.00" trend="up" trendValue="+12%" icon={TrendingUp} />
            <StatCard title="Order Volume" value="42" trend="up" trendValue="+8%" icon={ShoppingBag} />
            <StatCard title="Avg. Ticket" value="$29.64" trend="down" trendValue="-2%" icon={CreditCard} />
            <StatCard title="Customer Rating" value="4.8" trend="up" trendValue="+0.2" icon={Star} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Chart */}
            <Card title="Sales Performance" subtitle="Hourly breakdown of today's revenue" className="lg:col-span-2">
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%" minHeight={0}>
                        <LineChart data={SALES_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="time"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#94a3b8' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#94a3b8' }}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="sales"
                                stroke="#18181b"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#18181b', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card title="Quick Actions">
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="flex-col gap-2 h-24 text-zinc-600">
                        <Pencil size={20} />
                        <span>Edit Menu</span>
                    </Button>
                    <Button variant="outline" className="flex-col gap-2 h-24 text-zinc-600">
                        <Megaphone size={20} />
                        <span>Create Ad</span>
                    </Button>
                </div>
            </Card>
        </div>
    </div>
);

export default function App() {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-zinc-50 flex font-sans text-zinc-900">
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 bg-white border-r border-zinc-200 transition-all duration-300 ease-in-out",
                isSidebarOpen ? "w-64" : "w-20"
            )}>
                <div className="h-full flex flex-col p-4">
                    <div className="flex items-center gap-3 px-2 mb-8">
                        <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-black text-xl italic">
                            D
                        </div>
                        {isSidebarOpen && <span className="font-bold text-lg tracking-tight">Dashfood</span>}
                    </div>

                    <nav className="flex-1 space-y-1">
                        <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} isCollapsed={!isSidebarOpen} />
                        <SidebarItem icon={Megaphone} label="Marketing" active={activeTab === 'marketing'} onClick={() => setActiveTab('marketing')} isCollapsed={!isSidebarOpen} />
                    </nav>
                </div>
            </aside>

            <main className={cn(
                "flex-1 transition-all duration-300",
                isSidebarOpen ? "ml-64" : "ml-20"
            )}>
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-500">
                            <MenuIcon size={20} />
                        </button>
                        <h1 className="text-lg font-bold text-zinc-900 capitalize">{activeTab}</h1>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'dashboard' ? <Dashboard /> : <Marketing />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
