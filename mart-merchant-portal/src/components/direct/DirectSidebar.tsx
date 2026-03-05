import { Layout, Menu, Typography } from 'antd';
import { Truck, LayoutDashboard, Send, MapPin, Receipt, Settings, LogOut, Package, Code } from 'lucide-react';
import type { MenuProps } from 'antd';

const { Sider } = Layout;
const { Text } = Typography;

interface DirectSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout?: () => void;
}

export function DirectSidebar({ activeTab, setActiveTab, onLogout }: DirectSidebarProps) {
    const mainMenuItems: MenuProps['items'] = [
        {
            key: 'overview',
            icon: <LayoutDashboard size={18} />,
            label: <span className="font-medium">Overview</span>,
        },
        {
            key: 'deliveries',
            icon: <Package size={18} />,
            label: <span className="font-medium">Deliveries</span>,
        },
        {
            key: 'create-delivery',
            icon: <Send size={18} />,
            label: <span className="font-medium">Create Delivery</span>,
        },
        {
            key: 'tracking',
            icon: <MapPin size={18} />,
            label: <span className="font-medium">Tracking</span>,
        },
        {
            key: 'billing',
            icon: <Receipt size={18} />,
            label: <span className="font-medium">Billing</span>,
        },
        {
            key: 'developer',
            icon: <Code size={18} />,
            label: <span className="font-medium">Developer</span>,
        },
    ];

    const bottomMenuItems: MenuProps['items'] = [
        {
            key: 'settings',
            icon: <Settings size={18} />,
            label: <span className="font-medium">Settings</span>,
        },
        {
            key: 'logout',
            icon: <LogOut size={18} />,
            label: <span className="font-medium">Sign Out</span>,
            danger: true,
        },
    ];

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === 'logout') {
            onLogout?.();
        } else {
            setActiveTab(e.key);
        }
    };

    return (
        <Sider
            width={260}
            theme="light"
            className="border-r border-gray-100 flex flex-col h-screen overflow-hidden bg-white shadow-sm"
            style={{
                position: 'sticky',
                top: 0,
                left: 0,
            }}
        >
            <div className="flex flex-col h-full items-between px-3 py-6">
                <div className="flex-1">
                    <div className="px-6 mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-8 bg-black rounded-lg flex items-center justify-center shadow-md">
                                <Truck size={18} className="text-emerald-400" />
                            </div>
                            <span className="text-black font-black text-xl tracking-tight leading-none">DashDrive<span className="text-emerald-500">Direct</span></span>
                        </div>
                    </div>

                    <div className="mb-2 px-4">
                        <Text type="secondary" className="text-xs font-semibold tracking-wider uppercase pl-2 mb-2 block">
                            Dispatch
                        </Text>
                        <Menu
                            mode="inline"
                            selectedKeys={[activeTab]}
                            onClick={handleMenuClick}
                            items={mainMenuItems}
                            className="border-none bg-transparent"
                            style={{ padding: 0 }}
                        />
                    </div>
                </div>

                <div className="mt-auto px-4 pt-4 border-t border-gray-100">
                    <Menu
                        mode="inline"
                        selectedKeys={[activeTab]}
                        onClick={handleMenuClick}
                        items={bottomMenuItems}
                        className="border-none bg-transparent"
                        style={{ padding: 0 }}
                    />

                    <div className="mt-4 mx-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs ring-4 ring-white">
                                ED
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">Express Disp.</p>
                                <p className="text-xs text-gray-500 truncate">Enterprise API</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Sider>
    );
}
