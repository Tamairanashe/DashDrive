import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    BarChart3,
    Settings,
    HelpCircle,
    LogOut,
    Leaf,
    Wallet,
    Store,
    Clock,
    CalendarDays,
    Megaphone,
    Tag,
    Zap,
    Star
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRealTime } from '../hooks/useRealTime';
import { usePermissions } from '../hooks/usePermissions';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout?: () => void;
    merchant?: any;
}

export function Sidebar({ activeTab, setActiveTab, onLogout, merchant }: SidebarProps) {
    const { canManageOrders, canManageInventory, canViewFinancials, canManageSettings, canManageMarketing, canViewReports } = usePermissions(merchant);
    const { lastUpdated } = useRealTime('orders', null);
    const [showOrderDot, setShowOrderDot] = useState(false);

    useEffect(() => {
        if (lastUpdated && activeTab !== 'orders') {
            setShowOrderDot(true);
        }
    }, [lastUpdated, activeTab]);

    useEffect(() => {
        if (activeTab === 'orders') {
            setShowOrderDot(false);
        }
    }, [activeTab]);

    const items = [
        { key: 'dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
        canManageSettings && {
            key: 'stores-group',
            icon: <Store size={18} />,
            label: 'Stores',
            children: [
                { key: 'stores', icon: <Store size={16} />, label: 'Stores' },
                { key: 'store-hours', icon: <Clock size={16} />, label: 'Store Hours' },
                { key: 'holiday-hours', icon: <CalendarDays size={16} />, label: 'Holiday Hours' },
            ]
        },
        canManageMarketing && {
            key: 'marketing-group',
            icon: <Megaphone size={18} />,
            label: 'Marketing',
            children: [
                { key: 'marketing-overview', icon: <Megaphone size={16} />, label: 'Overview' },
                { key: 'campaigns', icon: <Zap size={16} />, label: 'Campaigns' },
                { key: 'offers', icon: <Tag size={16} />, label: 'Coupons/Offers' },
                { key: 'featured-products', icon: <Star size={16} />, label: 'Featured Products' },
                { key: 'promotions', icon: <Megaphone size={16} />, label: 'Push Promotions' },
            ]
        },
        canManageOrders && {
            key: 'orders',
            icon: <ShoppingBag size={18} />,
            label: (
                <div className="flex items-center justify-between">
                    <span>Orders</span>
                    {showOrderDot && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-2" />}
                </div>
            )
        },
        canManageInventory && { key: 'inventory', icon: <Package size={18} />, label: 'Inventory' },
        canManageOrders && { key: 'customers', icon: <Users size={18} />, label: 'Customers' },
        canViewReports && { key: 'performance', icon: <BarChart3 size={18} />, label: 'Performance' },
        canViewFinancials && { key: 'financials', icon: <Wallet size={18} />, label: 'Financials' },
        { type: 'divider' },
        canManageSettings && { key: 'settings', icon: <Settings size={18} />, label: 'Settings' },
        { key: 'help', icon: <HelpCircle size={18} />, label: 'Help/Support' },
        { key: 'logout', icon: <LogOut size={18} />, label: 'Logout' },
    ].filter(Boolean);

    // Determine default open keys based on activeTab
    const defaultOpenKeys = (items as any[])
        .filter((item: any) => item.children?.some((child: any) => child.key === activeTab))
        .map((item: any) => item.key as string);

    return (
        <Sider
            width={260}
            theme="light"
            style={{
                borderRight: '1px solid #f0f0f0',
                height: '100vh',
                position: 'sticky',
                top: 0,
                zIndex: 20
            }}
        >
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white shadow-md">
                    <Leaf size={18} fill="currentColor" className="text-emerald-400" />
                </div>
                <span className="text-lg font-bold text-zinc-900 tracking-tight">DashDrive <span className="text-zinc-500 font-normal">Mart</span></span>
            </div>

            <div className="flex flex-col h-[calc(100vh-80px)]">
                <Menu
                    mode="inline"
                    selectedKeys={[activeTab]}
                    defaultOpenKeys={defaultOpenKeys.length > 0 ? defaultOpenKeys : ['stores-group', 'marketing-group']}
                    onClick={(e) => {
                        if (e.key === 'logout') {
                            if (onLogout) {
                                onLogout();
                            } else {
                                alert('Successfully logged out!');
                                setActiveTab('dashboard'); // Redirect to dashboard after 'logout'
                            }
                        } else {
                            setActiveTab(e.key);
                        }
                    }}
                    items={items as any}
                    style={{
                        borderRight: 0,
                        flex: 1,
                        overflowY: 'auto',
                        padding: '0 12px',
                        fontWeight: 400
                    }}
                />

                <div className="p-5 mt-auto">
                    <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                        <p className="text-sm font-semibold text-zinc-800 mb-1">Need Help?</p>
                        <p className="text-xs text-zinc-500 mb-4">Contact support team</p>
                        <button className="w-full bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 text-zinc-800 text-xs font-semibold py-2 rounded-xl transition-all shadow-sm">
                            Get Support
                        </button>
                    </div>
                </div>
            </div>
        </Sider>
    );
}
