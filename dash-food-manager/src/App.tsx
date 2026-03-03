/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { cn } from './lib/utils';
import { Card, Button, Badge } from './components/ui';
import { MenuMaker } from './components/MenuMaker';
import { Performance } from './components/Performance';
import { Customers } from './components/Customers';
import { StoreManagement } from './components/StoreManagement';
import { Marketing } from './components/Marketing';
import { Payments } from './components/Payments';
import { Reports } from './components/Reports';
import { UsersList } from './components/UsersList';
import { Settings } from './components/Settings';
import Orders from './components/Orders';
import { api } from './api';

// --- Types ---
type Tab = 'dashboard' | 'store' | 'menu' | 'orders' | 'performance' | 'customers' | 'marketing' | 'payments' | 'reports' | 'users' | 'settings';

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

const TOP_ITEMS = [
  { name: 'Truffle Burger', sales: 145, revenue: 2175, rating: 4.8 },
  { name: 'Sweet Potato Fries', sales: 98, revenue: 588, rating: 4.5 },
  { name: 'Classic Cheeseburger', sales: 87, revenue: 1044, rating: 4.7 },
  { name: 'Vanilla Milkshake', sales: 64, revenue: 384, rating: 4.2 },
];

const RECENT_ORDERS = [
  { id: '#12345', customer: 'John D.', items: 2, total: 32.50, status: 'Preparing', time: '12:34' },
  { id: '#12344', customer: 'Sarah K.', items: 1, total: 18.20, status: 'Ready', time: '12:28' },
  { id: '#12343', customer: 'Mike R.', items: 4, total: 64.00, status: 'Completed', time: '11:55' },
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

const AlertCard = ({ type, message, action }: { type: 'error' | 'warning' | 'info', message: string, action: string }) => {
  const styles = {
    error: "bg-red-50 border-red-100 text-red-900",
    warning: "bg-amber-50 border-amber-100 text-amber-900",
    info: "bg-blue-50 border-blue-100 text-blue-900",
  };
  const icons = {
    error: <AlertCircle size={18} className="text-red-500" />,
    warning: <AlertCircle size={18} className="text-amber-500" />,
    info: <Info size={18} className="text-blue-500" />,
  };

  return (
    <div className={cn("flex items-center justify-between p-4 rounded-xl border mb-4", styles[type])}>
      <div className="flex items-center gap-3">
        {icons[type]}
        <p className="text-sm font-medium">{message}</p>
      </div>
      <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-wider hover:bg-black/5">
        {action}
      </Button>
    </div>
  );
};

const BackendStatusAlert = () => {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');

  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${(import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000')}/health`);
        if (response.ok) {
          setStatus('online');
        } else {
          setStatus('offline');
        }
      } catch (err) {
        setStatus('offline');
      }
    };
    checkStatus();
  }, []);

  if (status === 'loading') return null;

  return (
    <AlertCard
      type={status === 'online' ? 'info' : 'error'}
      message={status === 'online' ? "Backend systems are online and connected." : "Backend system connection failed. Please check your network or server status."}
      action={status === 'online' ? "System Live" : "Retry Connection"}
    />
  );
};

// --- Pages ---

const Dashboard = () => (
  <div className="space-y-6">
    {/* Alerts */}
    <div className="grid grid-cols-1">
      <BackendStatusAlert />
      <AlertCard
        type="error"
        message="Your store was offline for 15 minutes yesterday due to POS disconnection."
        action="View Details"
      />
      <AlertCard
        type="warning"
        message="Low inventory: Truffle Burger ingredients are running low."
        action="Update Stock"
      />
    </div>

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

      {/* Quick Actions & Recommendations */}
      <div className="space-y-6">
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
            <Button variant="outline" className="flex-col gap-2 h-24 text-zinc-600">
              <Tag size={20} />
              <span>Add Offer</span>
            </Button>
            <Button variant="outline" className="flex-col gap-2 h-24 text-zinc-600">
              <Clock size={20} />
              <span>Adjust Hours</span>
            </Button>
          </div>
        </Card>

        <Card title="Growth Recommendations" className="bg-zinc-900 text-white border-none">
          <div className="space-y-4">
            <div className="p-3 bg-white/10 rounded-lg border border-white/10">
              <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1">AI Suggestion</p>
              <p className="text-sm">Run a lunch offer - your orders dip between 2-4 PM.</p>
              <Button size="sm" className="mt-3 w-full bg-white text-zinc-900 hover:bg-zinc-100">Apply Now</Button>
            </div>
            <div className="p-3 bg-white/10 rounded-lg border border-white/10">
              <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1">Content Tip</p>
              <p className="text-sm">Add photos to your 3 top-selling items without images.</p>
              <Button size="sm" variant="ghost" className="mt-3 w-full text-white hover:bg-white/10">View Items</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Activity */}
      <Card title="Recent Activity" headerAction={<Button variant="ghost" size="sm">View All</Button>}>
        <div className="space-y-6">
          {RECENT_ORDERS.map((order) => (
            <div key={order.id} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold text-xs">
                  {order.customer.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{order.customer}</p>
                  <p className="text-xs text-zinc-500">{order.items} items • ${order.total.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs font-medium text-zinc-900">{order.time}</p>
                  <Badge variant={order.status === 'Completed' ? 'success' : 'warning'}>{order.status}</Badge>
                </div>
                <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Selling Items */}
      <Card title="Top Selling Items">
        <div className="space-y-4">
          {TOP_ITEMS.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-zinc-100 overflow-hidden">
                  <img src={`https://picsum.photos/seed/${item.name}/100/100`} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{item.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-xs font-bold ml-1">{item.rating}</span>
                    </div>
                    <span className="text-zinc-300">•</span>
                    <span className="text-xs text-zinc-500">{item.sales} sold</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-zinc-900">${item.revenue}</p>
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);



// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'orders': return <Orders />;
      case 'menu': return <MenuMaker />;
      case 'performance': return <Performance />;
      case 'customers': return <Customers />;
      case 'store': return <StoreManagement />;
      case 'marketing': return <Marketing />;
      case 'payments': return <Payments />;
      case 'reports': return <Reports />;
      case 'users': return <UsersList />;
      case 'settings': return <Settings />;
      default: return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-400">
          <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
            <LayoutDashboard size={40} className="opacity-20" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-600">Module Coming Soon</h2>
          <p className="text-sm max-w-xs text-center mt-2">The {activeTab} module is currently under development to provide you with the best experience.</p>
          <Button variant="primary" className="mt-8" onClick={() => setActiveTab('dashboard')}>Back to Dashboard</Button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex font-sans text-zinc-900">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white border-r border-zinc-200 transition-all duration-300 ease-in-out",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="h-full flex flex-col p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-black text-xl italic">
              E
            </div>
            {isSidebarOpen && <span className="font-bold text-lg tracking-tight">Eats Manager</span>}
          </div>

          {/* Nav Items */}
          <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} isCollapsed={!isSidebarOpen} />
            <SidebarItem icon={Store} label="Store Management" active={activeTab === 'store'} onClick={() => setActiveTab('store')} isCollapsed={!isSidebarOpen} />
            <SidebarItem icon={MenuIcon} label="Menu Maker" active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} isCollapsed={!isSidebarOpen} />
            <SidebarItem icon={ShoppingBag} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} isCollapsed={!isSidebarOpen} />
            <div className="my-4 border-t border-zinc-100" />
            <SidebarItem icon={BarChart3} label="Performance" active={activeTab === 'performance'} onClick={() => setActiveTab('performance')} isCollapsed={!isSidebarOpen} />
            <SidebarItem icon={Users} label="Customers" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} isCollapsed={!isSidebarOpen} />
            <SidebarItem icon={Megaphone} label="Marketing" active={activeTab === 'marketing'} onClick={() => setActiveTab('marketing')} isCollapsed={!isSidebarOpen} />
            <div className="my-4 border-t border-zinc-100" />
            <SidebarItem icon={CreditCard} label="Payments" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} isCollapsed={!isSidebarOpen} />
            <SidebarItem icon={FileText} label="Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} isCollapsed={!isSidebarOpen} />
            <SidebarItem icon={UserCircle} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} isCollapsed={!isSidebarOpen} />
            <SidebarItem icon={SettingsIcon} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} isCollapsed={!isSidebarOpen} />
          </nav>

          {/* User Profile */}
          <div className="mt-auto pt-4 border-t border-zinc-100">
            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden">
                <img src="https://picsum.photos/seed/user/100/100" alt="User" />
              </div>
              {isSidebarOpen && (
                <div className="text-left">
                  <p className="text-xs font-bold text-zinc-900">The Burger Joint</p>
                  <p className="text-[10px] text-zinc-500">Admin Account</p>
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        isSidebarOpen ? "ml-64" : "ml-20"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-500"
            >
              <MenuIcon size={20} />
            </button>
            <div className="h-6 w-px bg-zinc-200 mx-2" />
            <div className="flex items-center gap-2 cursor-pointer hover:bg-zinc-50 px-3 py-1.5 rounded-lg transition-colors group">
              <span className="text-sm font-bold text-zinc-900">The Burger Joint - Downtown</span>
              <ChevronDown size={14} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input
                type="text"
                placeholder="Search anything..."
                className="pl-10 pr-4 py-2 text-sm bg-zinc-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-900/10 w-64"
              />
            </div>
            <button className="relative p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-6 w-px bg-zinc-200" />
            <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
              <Calendar size={16} />
              Last 7 Days
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {!['marketing', 'performance', 'customers', 'orders'].includes(activeTab) && (
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-zinc-900 capitalize tracking-tight">{activeTab}</h1>
                  <p className="text-zinc-500 text-sm mt-1">
                    {activeTab === 'dashboard' ? 'Welcome back! Here is what is happening with your store today.' : `Manage your ${activeTab} and settings.`}
                  </p>
                </div>
              )}
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
