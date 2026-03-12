import React, { useState } from 'react';
import {
 LayoutDashboard,
 Map,
 Car,
 MapPin,
 Navigation,
 Package,
 Box,
 Image as ImageIcon,
 Ticket,
 Percent,
 Bell,
 Rocket,
 Utensils,
 ShoppingBag,
 ShoppingCart,
 CreditCard,
 Users,
 UserCheck,
 ShieldCheck,
 UserPlus,
 Briefcase,
 Wallet,
 Send,
 AlertCircle,
 Settings,
 HelpCircle,
 LogOut,
 ChevronLeft,
 Search,
 Plus,
 ArrowRight,
 TrendingUp,
 Activity,
 User,
 Star,
 Zap,
 Clock,
 CheckCircle2,
 Calendar,
 MessageSquare,
 Shield,
 FileText,
 Smartphone,
 Info,
 Truck,
 Flag,
 Mail,
 FileEdit,
 ShieldAlert,
 List,
 PlusSquare,
 BarChart3,
 BookOpen,
 LifeBuoy,
 ClipboardList,
 History,
 Dna,
 Layers,
 FileSearch,
 Trophy,
 Award,
 Settings2,
 Lock,
 Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils';

interface NavItem {
 icon: any;
 label: string;
 subItems?: string[];
}

interface SidebarProps {
 currentView: string;
 onNavigate: (view: string) => void;
 isCollapsed: boolean;
 setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
 currentView,
 onNavigate,
 isCollapsed,
 setIsCollapsed
}) => {
 const { user, logout } = useAuth();
 const [expandedItems, setExpandedItems] = useState<string[]>(['Insights', 'Management', 'Shopping', 'Parcel Delivery', 'SERVICES']);

 const navGroups: { group: string; items: NavItem[] }[] = [
 {
 group: 'MAIN DASHBOARD',
 items: [
 { icon: LayoutDashboard, label: 'Dashboard' },
 { icon: Map, label: 'Heat Map' },
 { icon: Navigation, label: 'Fleet View' },
 { icon: TrendingUp, label: 'Analytics' }
 ]
 },
 {
 group: 'SERVICES',
 items: [
 {
 icon: Car,
 label: 'Ride Hailing',
 subItems: ['Ride Dashboard', 'Ride Requests', 'Trips', 'Ride Drivers', 'Fare Setup', 'Surge Pricing']
 },
 {
 icon: Utensils,
 label: 'Food Delivery',
 subItems: ['Food Dashboard', 'Food Orders', 'Restaurant Management', 'Menu Management', 'Food Delivery Zones', 'Promotions Management']
 },
 {
 icon: ShoppingBag,
 label: 'Mart Delivery',
 subItems: ['Mart Orders', 'Stores', 'Products / Inventory', 'Categories', 'Delivery Fees']
 },
 {
 icon: ShoppingCart,
 label: 'Shopping',
 subItems: ['PShopping Dashboard', 'Shopping Products', 'Shopping Categories', 'Shopping Orders', 'Vendors / Merchants', 'Reviews & Ratings']
 },
 {
 icon: Box,
 label: 'Parcel Delivery',
 subItems: ['Parcel Dashboard', 'Parcel Orders', 'Parcel Categories', 'Parcel Weights', 'Parcel Attributes', 'Refund Requests']
 },
 {
 icon: CreditCard,
 label: 'Payments & Fintech',
 subItems: [
 'Fintech Dashboard',
 'Transactions',
 'Customer Wallet',
 'Driver Wallet',
 'Withdraw Requests',
 'Cashless Payments',
 'Pay Bills',
 'PayLater (BNPL)',
 'Loans',
 'Donations',
 'Payment Reports',
 'DFS (Financial Scores)'
 ]
 },
 ]
 },
 {
 group: 'DRIVERS',
 items: [
 { icon: UserCheck, label: 'Driver List' },
 { icon: ShieldCheck, label: 'Driver Verification' },
 { icon: Trophy, label: 'Driver Leaderboard' },
 {
 icon: Award,
 label: 'Driver Rewards',
 subItems: ['Tier Overview', 'Tier Rules', 'Benefits Setup', 'Tier History', 'Global Settings']
 },
 ]
 },
 {
 group: 'USER MANAGEMENT',
 items: [
 { icon: Users, label: 'Customers' },
 { icon: UserPlus, label: 'Customer Level Setup' },
 { icon: Briefcase, label: 'Employees' },
 { icon: Wallet, label: 'User Wallet' }
 ]
 },
 {
 group: 'OPERATIONS',
 items: [
 { icon: MapPin, label: 'Zone Setup' },
 { icon: Zap, label: 'Dispatch Management' },
 { icon: ShieldAlert, label: 'Solved Alert List' },
 { icon: History, label: 'Live Tracking' },
 { icon: FileSearch, label: 'System Logs' }
 ]
 },
 {
 group: 'PROMOTION & MARKETING',
 items: [
 { icon: Flag, label: 'Banner Setup' },
 { icon: Ticket, label: 'Coupon Setup' },
 { icon: Percent, label: 'Discount Setup' },
 { icon: Send, label: 'Send Notifications' },
 { icon: Mail, label: 'Newsletter' }
 ]
 },
 {
 group: 'VEHICLE MANAGEMENT',
 items: [
 { icon: Layers, label: 'Vehicle Attribute' },
 { icon: List, label: 'Vehicle List' },
 { icon: Dna, label: 'Vehicle Request' },
 { icon: PlusSquare, label: 'Add New Vehicle' }
 ]
 },
 {
 group: 'FINANCE & REPORTS',
 items: [
 { icon: ClipboardList, label: 'Transactions' },
 { icon: BarChart3, label: 'Earnings Reports' },
 { icon: FileText, label: 'Commission Reports' },
 { icon: TrendingUp, label: 'Financial Analytics' }
 ]
 },
 {
 group: 'CONTENT MANAGEMENT',
 items: [
 { icon: BookOpen, label: 'Blog Setup' },
 { icon: FileEdit, label: 'Pages' },
 { icon: ImageIcon, label: 'Media Library' }
 ]
 },
 {
 group: 'HELP & SUPPORT',
 items: [
 {
 icon: MessageSquare,
 label: 'Chatting',
 subItems: ['Active', 'Agents', 'Performance', 'Settings']
 }
 ]
 },
 {
 group: 'ENTERPRISE & GOVERNANCE',
 items: [
 {
 icon: Building2,
 label: 'Enterprise Business Setup',
 subItems: [
 'Business Info', 'Operations', 'Driver Setup', 'Customer Setup',
 'Fare & Penalty', 'Trips Logic', 'Parcel Logic', 'Mart Logic',
 'Refund Policy', 'Safety & Security', 'Referral Logic',
 'Shopping Logic', 'Food Delivery Logic', 'Chatting Setup'
 ]
 },
 {
 icon: Settings2,
 label: 'Configuration',
 subItems: [
 'Logic Engine', 'Service Groups', 'Feature Flags', 'App Versioning',
 'Notifications', '3rd Party', 'Face Verification API', 'AI Setup',
 'Blog Setup', 'App Download Setup', 'Priority Setup'
 ]
 },
 {
 icon: Lock,
 label: 'Roles & Permissions',
 subItems: ['Roles Overview', 'Employee Management', 'Permission Matrix']
 },
 {
 icon: Settings,
 label: 'System Settings',
 subItems: ['Infrastructure', 'Integrations', 'Security Policies', 'Webhooks']
 }
 ]
 }
 ];

 const toggleExpand = (label: string) => {
 setExpandedItems(prev =>
 prev.includes(label)
 ? prev.filter(i => i !== label)
 : [...prev, label]
 );
 };

 return (
 <div className={cn(
 "fixed left-0 top-0 bottom-0 flex flex-col bg-white border-r border-zinc-100 transition-all duration-500 ease-in-out z-50 shadow-2xl shadow-zinc-200/50",
 isCollapsed ? "w-24" : "w-72"
 )}>
 {/* Sidebar Header */}
 <div className="p-8 pb-4 flex items-center justify-between">
 {!isCollapsed && (
 <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
 <div className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-900/10">
 <Rocket className="w-5 h-5 text-zinc-50" />
 </div>
 <span className="text-xl font-sans font-black text-zinc-900 tracking-tight">DashDrive</span>
 </div>
 )}
 <button
 onClick={() => setIsCollapsed(!isCollapsed)}
 className={cn(
 "p-2.5 rounded-xl bg-zinc-50 text-zinc-400 hover:text-zinc-900 transition-all duration-300 border border-zinc-100",
 isCollapsed && "mx-auto"
 )}
 >
 <ChevronLeft className={cn("w-5 h-5 transition-transform duration-500", isCollapsed && "rotate-180")} />
 </button>
 </div>

 {/* Nav Groups */}
 <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide space-y-8">
 {navGroups.map((group) => (
 <div key={group.group} className="space-y-4">
 {!isCollapsed && (
 <h3 className="text-[10px] font-bold text-zinc-300 tracking-[0.2em] ml-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
 {group.group}
 </h3>
 )}
 <div className="space-y-1">
 {group.items.map((item) => (
 <div key={item.label}>
 <button
 onClick={() => {
 if (item.subItems) {
 toggleExpand(item.label);
 } else {
 onNavigate(item.label);
 }
 }}
 className={cn(
 "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
 currentView === item.label
 ? "bg-zinc-900 text-white shadow-xl shadow-zinc-900/20"
 : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50",
 isCollapsed && "justify-center"
 )}
 >
 <item.icon className={cn(
 "w-5 h-5 transition-transform duration-300",
 currentView === item.label ? "scale-110" : "group-hover:scale-110"
 )} />
 {!isCollapsed && (
 <span className="text-sm font-bold tracking-tight flex-1 text-left">{item.label}</span>
 )}
 {!isCollapsed && item.subItems && (
 <Plus className={cn(
 "w-3.5 h-3.5 transition-transform duration-500 text-slate-300",
 expandedItems.includes(item.label) && "rotate-45"
 )} />
 )}
 </button>

 {!isCollapsed && item.subItems && expandedItems.includes(item.label) && (
 <div className="mt-2 ml-10 space-y-1 animate-in slide-in-from-top-2 duration-300">
 {item.subItems.map((subItem) => (
 <button
 key={subItem}
 onClick={() => onNavigate(subItem)}
 className={cn(
 "w-full text-left px-4 py-2 text-xs font-bold transition-all duration-300 rounded-xl relative",
 currentView === subItem
 ? "text-zinc-900"
 : "text-zinc-400 hover:text-zinc-900 hover:translate-x-1"
 )}
 >
 <div className={cn(
 "absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-300 scale-0",
 currentView === subItem && "bg-zinc-900 scale-100"
 )} />
 {subItem}
 </button>
 ))}
 </div>
 )}
 </div>
 ))}
 </div>
 </div>
 ))}
 </div>

 {/* Profile Section */}
 <div className="p-6 border-t border-slate-50 bg-slate-50/30">
 <div className={cn(
 "flex items-center gap-4",
 isCollapsed && "flex-col items-center"
 )}>
 <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white font-black shadow-lg">
 {user?.name?.charAt(0) || 'A'}
 </div>
 {!isCollapsed && (
 <div className="flex-1 min-w-0">
 <p className="text-sm font-black text-zinc-900 truncate">{user?.name || 'Admin'}</p>
 <p className="text-[10px] font-bold text-zinc-400 ">{user?.role?.replace('_', ' ') || 'Administrator'}</p>
 </div>
 )}
 {!isCollapsed && (
 <button
 onClick={logout}
 className="p-2 text-zinc-300 hover:text-rose-500 transition-colors"
 >
 <LogOut className="w-5 h-5" />
 </button>
 )}
 </div>
 </div>
 </div>
 );
};
