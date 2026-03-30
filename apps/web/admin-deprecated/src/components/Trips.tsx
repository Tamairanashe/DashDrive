import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Map as MapIcon, 
  ArrowRight, 
  ChevronRight, 
  MoreVertical, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Clock, 
  Car 
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';
import { TripDetails } from './TripDetails';

interface Trip {
  id: string;
  rider: string;
  driver: string;
  pickup: string;
  drop: string;
  distance: string;
  fare: string;
  status: 'Ongoing' | 'Completed' | 'Cancelled' | 'Returned' | 'Scheduled';
  payment: string;
  time: string;
}

const mockTrips: Trip[] = [
  { id: 'TRIP-8821', rider: 'John Doe', driver: 'Robert Fox', pickup: '742 Evergreen Terrace', drop: 'Springfield Airport', distance: '15.4 km', fare: '$42.50', status: 'Completed', payment: 'Wallet', time: '42 mins' },
  { id: 'TRIP-8822', rider: 'Jane Smith', driver: 'Jenny Wilson', pickup: 'Central Park West', drop: 'Grand Central', distance: '4.2 km', fare: '$12.80', status: 'Ongoing', payment: 'Cash', time: '12 mins (ongoing)' },
  { id: 'TRIP-8823', rider: 'William Bell', driver: 'Cody Fisher', pickup: 'University Lib', drop: 'Sunset Blvd', distance: '8.1 km', fare: '$22.00', status: 'Completed', payment: 'Wallet', time: '28 mins' },
  { id: 'TRIP-100053', rider: 'RAJEEV Kr', driver: 'N/A', pickup: '6X7M+M56, Rajabazar', drop: 'Patna, Bihar', distance: '49.73 Km', fare: '$0.00', status: 'Cancelled', payment: 'Unpaid', time: '05:29 am' },
  { id: 'TRIP-100023', rider: 'Jhon Jack', driver: 'Test Driver', pickup: 'Mirpur-9, Dhaka', drop: 'Dhaka Wetland', distance: '2.67 Km', fare: '$256.85', status: 'Returned', payment: 'Paid', time: '11:28 am' },
  { id: 'TRIP-100046', rider: 'Test User', driver: 'N/A', pickup: '1005 Avenue 11, Dhaka', drop: 'V92G+6C5, Dhaka', distance: '4.08 Km', fare: '$652.08', status: 'Scheduled', payment: 'Pending', time: '04:57 pm' }
];

export const Trips: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Ongoing' | 'Completed' | 'Cancelled' | 'Returned' | 'Scheduled'>('All');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleTripClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setDrawerVisible(true);
  };

  const filteredTrips = activeTab === 'All' ? mockTrips : mockTrips.filter(t => t.status === activeTab);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Trips Management</h2>
          <p className="text-sm text-slate-400 font-medium mt-1">Monitor and manage all ongoing and completed rides</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold font-small-caps text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Calendar className="w-3.5 h-3.5" />
            Monthly Logs
          </button>
        </div>
      </div>

      <Tabs activeKey={activeTab} onChange={(k) => setActiveTab(k as any)} items={['All', 'Ongoing', 'Completed', 'Cancelled', 'Returned', 'Scheduled'].map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />

      <div className="bg-white rounded-[32px] shadow-soft border border-slate-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/30">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Trip Analysis</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Assignment</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Trajectory</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Financials</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Lifecycle</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTrips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => handleTripClick(trip)}>
                  <td className="px-8 py-6">
                    <span className="text-sm font-display font-extrabold text-slate-900 tracking-tight">{trip.id}</span>
                    <div className="flex items-center gap-2 mt-2"><Clock className="w-3 h-3 text-slate-400" /><span className="text-[10px] text-slate-400 font-bold font-small-caps ">{trip.time}</span></div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]" /><span className="text-sm font-display font-bold text-slate-700 tracking-tight">{trip.rider}</span></div>
                      <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]" /><span className="text-[11px] font-medium text-slate-500">{trip.driver}</span></div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="text-right"><p className="text-[9px] font-bold text-slate-400 font-small-caps ">Origin</p><p className="text-xs font-semibold text-slate-800 truncate max-w-[130px] mt-1">{trip.pickup}</p></div>
                      <div className="relative flex items-center justify-center"><div className="w-8 h-[1px] bg-slate-100" /></div>
                      <div><p className="text-[9px] font-bold text-slate-400 font-small-caps ">Target</p><p className="text-xs font-semibold text-slate-800 truncate max-w-[130px] mt-1">{trip.drop}</p></div>
                    </div>
                  </td>
                  <td className="px-8 py-6"><p className="text-sm font-display font-extrabold text-slate-900 tracking-tight">{trip.fare}</p><p className="text-[10px] text-slate-400 font-bold font-small-caps mt-1.5">{trip.distance} • {trip.payment}</p></td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "inline-flex items-center px-3.5 py-1.5 rounded-xl text-[10px] font-bold font-small-caps ",
                      trip.status === 'Completed' && "bg-emerald-50 text-emerald-700 border border-emerald-100/50",
                      trip.status === 'Ongoing' && "bg-blue-50 text-blue-700 border border-blue-100/50",
                      trip.status === 'Cancelled' && "bg-red-50 text-red-700 border border-red-100/50",
                      trip.status === 'Returned' && "bg-amber-50 text-amber-700 border border-amber-100/50",
                      trip.status === 'Scheduled' && "bg-zinc-100 text-zinc-600 border border-zinc-200"
                    )}>{trip.status}</span>
                  </td>
                  <td className="px-8 py-6 text-right"><button className="p-2.5 hover:bg-slate-50 text-slate-300 rounded-xl transition-all hover:text-primary active:scale-90 border border-transparent hover:border-slate-100"><MoreVertical className="w-4.5 h-4.5" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <TripDetails visible={drawerVisible} onClose={() => setDrawerVisible(false)} trip={selectedTrip} />
    </div>
  );
};
