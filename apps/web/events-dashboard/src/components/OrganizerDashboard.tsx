import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Calendar, 
  Plus, 
  Settings, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Ticket,
  ChevronRight,
  MoreVertical,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  LogOut
} from 'lucide-react';
import EventBuilder from './EventBuilder';

interface OrganizerDashboardProps {
  onLogout: () => void;
  userEmail?: string;
}

export default function OrganizerDashboard({ onLogout, userEmail }: OrganizerDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBuildingEvent, setIsBuildingEvent] = useState(false);

  const stats = [
    { name: 'Total Revenue', value: '$128,430', change: '+12.5%', trend: 'up', icon: DollarSign },
    { name: 'Tickets Sold', value: '2,450', change: '+18.2%', trend: 'up', icon: Ticket },
    { name: 'Active Events', value: '12', change: '0%', trend: 'neutral', icon: Calendar },
    { name: 'New Customers', value: '520', change: '-2.4%', trend: 'down', icon: Users },
  ];

  const recentEvents = [
    { id: 1, name: 'Summer Music Festival 2026', date: 'Aug 15, 2026', status: 'Live', sales: 1200, revenue: '$45,000' },
    { id: 2, name: 'Tech Conference Q3', date: 'Sep 22, 2026', status: 'Upcoming', sales: 450, revenue: '$18,500' },
    { id: 3, name: 'Charity Gala Dinner', date: 'Oct 05, 2026', status: 'Draft', sales: 0, revenue: '$0' },
  ];

  const handlePublishEvent = async (eventData: any) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(eventData)
      });
      const data = await res.json();
      if (data.success) {
        setIsBuildingEvent(false);
        alert('Event published successfully!');
        window.location.reload(); // Refresh to show new event
      } else {
        alert(data.error || 'Failed to publish event');
      }
    } catch (error) {
      alert('An error occurred while publishing the event');
    }
  };

  if (isBuildingEvent) {
    return <EventBuilder onBack={() => setIsBuildingEvent(false)} onPublish={handlePublishEvent} />;
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] text-slate-300 flex flex-col pt-8">
        <div className="px-6 mb-8 flex items-center gap-2">
          <Ticket className="w-8 h-8 text-[#026cdf]" />
          <span className="font-bold text-xl text-white tracking-tight">dashticket</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <SidebarLink icon={LayoutDashboard} label="Dashboard" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarLink icon={Calendar} label="Events" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
          <SidebarLink icon={Users} label="Attendees" active={activeTab === 'attendees'} onClick={() => setActiveTab('attendees')} />
          <SidebarLink icon={TrendingUp} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          <SidebarLink icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex flex-col gap-2">
            <div className="bg-[#026cdf] text-white p-4 rounded-xl flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center font-bold">
                  {userEmail ? userEmail[0].toUpperCase() : 'JD'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold leading-none truncate">{userEmail || 'Jane Doe'}</p>
                  <p className="text-[10px] text-blue-200 mt-1 uppercase">Organizer</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-2xl font-bold tracking-tight">Organizer Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search events..." 
                className="pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#026cdf] w-64 transition-all"
              />
            </div>
            <button 
              onClick={() => setIsBuildingEvent(true)}
              className="bg-[#026cdf] text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Welcome Message */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-[#1e293b]">Good Morning, {userEmail?.split('@')[0] || 'Jane'}!</h2>
              <p className="text-slate-500 font-medium mt-1">Here's what's happening with your events today.</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50">
              <Calendar className="w-4 h-4 text-slate-400" />
              Mar 17, 2026 - Mar 24, 2026
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold ${
                    stat.trend === 'up' ? 'text-emerald-600' : stat.trend === 'down' ? 'text-rose-600' : 'text-slate-500'
                  }`}>
                    {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                    {stat.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.name}</p>
                <p className="text-2xl font-black mt-1 text-[#1e293b]">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Events Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-bold tracking-tight">Recent Events</h3>
                <button className="text-[#026cdf] text-sm font-bold hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <th className="px-6 py-4">Event Name</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Sales</th>
                      <th className="px-6 py-4">Revenue</th>
                      <th className="px-6 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#1e293b]">{event.name}</p>
                          <p className="text-xs text-slate-500">{event.date}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            event.status === 'Live' ? 'bg-emerald-100 text-emerald-700' : 
                            event.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-600">{event.sales}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-600">{event.revenue}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 hover:bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-4 h-4 text-slate-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sales Channel Card (Empty/Mock) */}
            <div className="bg-[#111111] rounded-2xl p-8 text-white flex flex-col relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Grow your audience</h3>
                <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                  Start selling tickets on social media and reach thousands of fans instantly.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl border border-white/10">
                    <div className="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center font-bold">IG</div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">Instagram Shop</p>
                      <p className="text-xs text-zinc-500">Enable checkout</p>
                    </div>
                    <button className="text-xs font-bold bg-white text-black px-3 py-1.5 rounded-lg">Sync</button>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl border border-white/10 opacity-50">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center font-bold">f</div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">Facebook Market</p>
                      <p className="text-xs text-zinc-500">Coming soon</p>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-[#026cdf] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                  Upgrade Analytics
                </button>
              </div>
              <DollarSign className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 rotate-12" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
        active 
          ? 'bg-[#026cdf] text-white shadow-lg shadow-blue-500/20' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-500'}`} />
      {label}
    </button>
  );
}
