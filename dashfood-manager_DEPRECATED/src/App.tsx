/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Home,
  Store,
  ClipboardList,
  BarChart2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  LogOut,
  Megaphone,
  Utensils,
  CreditCard,
  Users as UsersIcon,
  Settings as SettingsIcon,
  Search,
  Bell,
  ChefHat,
  Package,
  MessageSquare,
  Globe,
  Calendar,
  Clock,
  FileText,
  Star,
  AlertCircle,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './types';

// Components
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import MenuMaker from './components/MenuMaker';
import Feedback from './components/Feedback';
import Kitchen from './components/Kitchen';
import Inventory from './components/Inventory';
import Stores, { StoreInfo } from './components/Stores';
import StoreHours from './components/StoreHours';
import HolidayHours from './components/HolidayHours';
import Users from './components/Users';
import Reports from './components/Reports';
import Issues from './components/Issues';
import Settings from './components/Settings';
import Sales from './components/Sales';
import Operations from './components/Operations';
import TopEats from './components/TopEats';
import Marketing from './components/Marketing';
import CustomerInsights from './components/CustomerInsights';
import Payments from './components/Payments';

type Tab = 'home' | 'orders' | 'performance-sales' | 'performance-operations' | 'performance-top-eats' | 'menu' | 'stores-list' | 'store-info' | 'store-hours' | 'holiday-hours' | 'users' | 'reports' | 'issues' | 'settings' | 'feedback' | 'customers-insights' | 'marketing' | 'payments';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(false);
  const [isStoresOpen, setIsStoresOpen] = useState(false);
  const [isCustomersOpen, setIsCustomersOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [selectedOrg, setSelectedOrg] = useState('DashFood Group');

  const sidebarItems = [
    {
      title: 'MENU', items: [
        { id: 'home', label: 'Dashboard', icon: Home },
        { id: 'orders', label: 'Order Hub', icon: ClipboardList },
        { id: 'menu', label: 'Menu Editor', icon: Utensils },
      ]
    },
    {
      title: 'OPERATIONS', items: [
        {
          id: 'performance',
          label: 'Performance',
          icon: BarChart2,
          hasChevron: true,
          isOpen: isPerformanceOpen,
          setOpen: setIsPerformanceOpen,
          subItems: [
            { id: 'performance-sales', label: 'Sales Analytics' },
            { id: 'performance-operations', label: 'Ops Efficiency' },
            { id: 'performance-top-eats', label: 'Top Performance' },
          ]
        },
        {
          id: 'stores',
          label: 'Storefronts',
          icon: Store,
          hasChevron: true,
          isOpen: isStoresOpen,
          setOpen: setIsStoresOpen,
          subItems: [
            { id: 'stores-list', label: 'View All' },
            { id: 'store-info', label: 'Basic Info' },
            { id: 'store-hours', label: 'Hours' },
            { id: 'holiday-hours', label: 'Holidays' },
          ]
        },
      ]
    },
    {
      title: 'SUPPORT & CRM', items: [
        { id: 'marketing', label: 'Campaigns', icon: Megaphone },
        {
          id: 'customers',
          label: 'Relationships',
          icon: UsersIcon,
          hasChevron: true,
          isOpen: isCustomersOpen,
          setOpen: setIsCustomersOpen,
          subItems: [
            { id: 'feedback', label: 'Feedback' },
            { id: 'customers-insights', label: 'Insights' },
          ]
        },
        { id: 'issues', label: 'Support Ops', icon: AlertCircle },
      ]
    },
    {
      title: 'BUSINESS', items: [
        { id: 'payments', label: 'Financials', icon: CreditCard },
        { id: 'reports', label: 'Business Reports', icon: FileText },
        { id: 'users', label: 'Team Access', icon: ChefHat },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
      ]
    }
  ];

  const handleSelectStore = (store: any) => {
    setSelectedStore(store);
    setActiveTab('store-info');
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9] text-[#1C2434] font-sans overflow-hidden">
      {/* TailAdmin Sidebar */}
      <aside className={cn(
        "bg-[#1C2434] flex flex-col overflow-y-auto shrink-0 transition-all duration-300 z-50",
        sidebarOpen ? "w-72" : "w-0 -ml-72 lg:w-72 lg:ml-0"
      )}>
        <div className="flex items-center justify-between px-6 py-8 border-b border-[#2E3A47]">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-[#00ff90] rounded-lg flex items-center justify-center text-black shadow-lg">
              <Globe size={24} />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">DashDrive</span>
          </div>
          <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="flex-1 px-6 py-6 overflow-y-auto no-scrollbar">
          <nav className="space-y-8">
            {sidebarItems.map((group, groupIdx) => (
              <div key={groupIdx}>
                <h3 className="mb-4 ml-4 text-xs font-semibold text-[#8A99AF] uppercase tracking-widest">{group.title}</h3>
                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          if (item.setOpen) {
                            item.setOpen(!item.isOpen);
                          } else {
                            setActiveTab(item.id as Tab);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center gap-3.5 px-4 py-2.5 rounded-sm font-medium transition-all duration-200 relative group",
                          activeTab === item.id || (item.subItems && item.subItems.some(s => s.id === activeTab))
                            ? "bg-[#333A48] text-white"
                            : "text-[#8A99AF] hover:bg-[#333A48] hover:text-white"
                        )}
                      >
                        <item.icon size={18} />
                        <span className="flex-1 text-left text-sm">{item.label}</span>
                        {item.hasChevron && (
                          <ChevronDown size={14} className={cn("transition-transform duration-300", item.isOpen ? "rotate-180" : "rotate-0")} />
                        )}
                      </button>

                      {item.subItems && item.isOpen && (
                        <ul className="mt-4 mb-2 pl-6 space-y-2.5">
                          {item.subItems.map((sub) => (
                            <li key={sub.id}>
                              <button
                                onClick={() => setActiveTab(sub.id as Tab)}
                                className={cn(
                                  "w-full text-left text-sm transition-all duration-200",
                                  activeTab === sub.id ? "text-white" : "text-[#8A99AF] hover:text-white"
                                )}
                              >
                                {sub.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* TailAdmin Header */}
        <header className="h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8 shrink-0 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              className="p-2 lg:hidden text-gray-600 hover:bg-gray-100 rounded-md"
              onClick={() => setSidebarOpen(true)}
            >
              <Search size={20} />
            </button>
            <div className="hidden lg:flex items-center gap-3">
              <Search size={20} className="text-[#64748B]" />
              <input
                type="text"
                placeholder="Search command or module..."
                className="bg-transparent border-none focus:ring-0 text-sm font-medium text-[#1C2434] w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="relative w-10 h-10 flex items-center justify-center bg-[#EFF4FB] rounded-full text-[#64748B] hover:text-black transition-colors">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <button className="relative w-10 h-10 flex items-center justify-center bg-[#EFF4FB] rounded-full text-[#64748B] hover:text-black transition-colors">
                <MessageSquare size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
            </div>

            <div className="h-8 w-[1px] bg-[#E2E8F0]"></div>

            <div className="flex items-center gap-4 cursor-pointer group">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold text-[#1C2434]">Justin Chithu</span>
                <span className="text-xs text-[#64748B] font-medium uppercase tracking-wider">Group CEO</span>
              </div>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#E2E8F0] group-hover:border-[#00ff90] transition-colors">
                <div className="w-full h-full bg-[#3C50E0] flex items-center justify-center text-white font-black">
                  JC
                </div>
              </div>
              <ChevronDown size={14} className="text-[#64748B]" />
            </div>
          </div>
        </header>

        {/* Scrollable Body area */}
        <main className="flex-1 overflow-y-auto bg-[#F1F5F9] no-scrollbar">
          <div className="max-w-[1400px] mx-auto p-4 md:p-6 2xl:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'home' && <Dashboard />}
                {activeTab === 'orders' && <Orders />}
                {activeTab === 'stores-list' && <Stores onSelectStore={handleSelectStore} />}
                {activeTab === 'store-info' && <StoreInfo store={selectedStore} onBack={() => setActiveTab('stores-list')} setActiveTab={setActiveTab} />}
                {activeTab === 'menu' && <MenuMaker />}
                {activeTab === 'performance-sales' && <Sales />}
                {activeTab === 'performance-operations' && <Operations />}
                {activeTab === 'performance-top-eats' && <TopEats />}
                {activeTab === 'feedback' && <Feedback />}
                {activeTab === 'customers-insights' && <CustomerInsights />}
                {activeTab === 'store-hours' && <StoreHours store={selectedStore} />}
                {activeTab === 'holiday-hours' && <HolidayHours store={selectedStore} />}
                {activeTab === 'users' && <Users />}
                {activeTab === 'reports' && <Reports />}
                {activeTab === 'issues' && <Issues />}
                {activeTab === 'marketing' && <Marketing />}
                {activeTab === 'payments' && <Payments />}
                {activeTab === 'settings' && <Settings />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
