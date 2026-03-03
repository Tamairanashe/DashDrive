import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Moon,
  CheckCircle2,
  MessageCircle,
  X,
  ArrowLeft,
  MapPin,
  Phone,
  Edit2,
  Plus,
  Search,
  Store as StoreIcon,
  Clock,
  Calendar,
  Settings,
  Activity,
  Zap,
  Shield,
  Layout,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../types';

interface Store {
  id: string;
  name: string;
  address: string;
  status: 'open' | 'closed';
  info: string;
  sales: string;
  orders: number;
  image: string;
}

const openStores: Store[] = [
  {
    id: '294d6f7c-358a-483a-930...',
    name: 'Starbucks (82) Lynwood',
    address: '476e91d7-3b2a-4e83-680a-7f61ff95bf3c',
    status: 'open',
    info: 'Since 11:00 AM',
    sales: '$14,204',
    orders: 412,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=200'
  },
  {
    id: '1400 Broadway, New York, ...',
    name: 'Starbucks (14) Downtown',
    address: '1400 Broadway, New York, NY',
    status: 'open',
    info: 'Since 2:41 PM',
    sales: '$8,432',
    orders: 198,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=200'
  }
];

const closedStores: Store[] = [
  {
    id: '219 King Street',
    name: 'One Restaurant & Bar',
    address: '219 King Street',
    status: 'closed',
    info: 'Opens 1:30 PM Wednesday',
    sales: '$0',
    orders: 0,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=200'
  }
];

const Stores = ({ onSelectStore }: { onSelectStore: (store: Store) => void }) => {
  const [region, setRegion] = useState('All Regions');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex-1 bg-transparent overflow-y-auto relative animate-in fade-in duration-700">
      <div className="max-w-[1400px] mx-auto py-12 px-8 space-y-10">
        {/* Header Section */}
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-black tracking-tighter">Locations</h1>
            <p className="text-zinc-500 font-medium text-lg">Central hub for your 84 operational nodes.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white p-1.5 rounded-[20px] shadow-sm border border-zinc-50 flex items-center">
              {['All Regions', 'North', 'South'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={cn(
                    "px-6 py-2.5 rounded-[15px] text-[11px] font-black uppercase tracking-widest transition-all",
                    region === r ? "bg-black text-white shadow-lg" : "text-zinc-400 hover:text-black"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
            <button className="bg-black text-[#00ff90] px-8 py-4 rounded-[24px] font-black text-xs uppercase tracking-[0.15em] hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center gap-3">
              <Plus size={18} />
              Add Node
            </button>
          </div>
        </div>

        {/* Search & Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 relative group">
            <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors" />
            <input
              type="text"
              placeholder="Identify node by name, ID or signal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white border border-transparent rounded-[24px] text-sm font-bold shadow-sm focus:ring-4 focus:ring-zinc-100 outline-none transition-all"
            />
          </div>
          <div className="bg-white rounded-[24px] p-5 shadow-sm border border-zinc-50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00ff90]/10 flex items-center justify-center text-[#00ff90]">
              <Activity size={24} />
            </div>
            <div>
              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Active Nodes</div>
              <div className="text-xl font-black text-black leading-none">82 / 84</div>
            </div>
          </div>
          <div className="bg-white rounded-[24px] p-5 shadow-sm border border-zinc-50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-[#00ff90]">
              <Zap size={24} />
            </div>
            <div>
              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Global Health</div>
              <div className="text-xl font-black text-black leading-none">Excellent</div>
            </div>
          </div>
        </div>

        {/* Global Store Pipeline */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-sm font-black text-black uppercase tracking-[0.2em]">Operational Nodes</h2>
            <div className="flex items-center gap-2 text-[11px] font-black text-zinc-400 uppercase tracking-widest">
              Sort by <span className="text-black inline-flex items-center gap-1 cursor-pointer">Revenue <ChevronDown size={14} /></span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {openStores.map((store) => (
              <motion.div
                layout
                key={store.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => onSelectStore(store)}
                className="card-premium p-6 group hover:bg-black transition-all duration-300 cursor-pointer overflow-hidden border-none"
              >
                <div className="flex items-center gap-8 relative z-10">
                  <div className="relative shrink-0">
                    <img src={store.image} alt="" className="w-20 h-20 rounded-[20px] object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-3 h-3 bg-[#00ff90] rounded-full animate-pulse shadow-[0_0_8px_#00ff90]" />
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-4 gap-8">
                    <div className="col-span-1 space-y-1">
                      <h3 className="text-lg font-black text-black group-hover:text-white transition-colors">{store.name}</h3>
                      <div className="flex items-center gap-2 text-zinc-400 group-hover:text-zinc-500">
                        <MapPin size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest truncate">{store.address.split(',')[0]}</span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00ff90]" />
                        <span className="text-[10px] font-black text-black group-hover:text-[#00ff90] uppercase tracking-widest">Active Pipeline</span>
                      </div>
                      <div className="text-[11px] font-bold text-zinc-500">{store.info}</div>
                    </div>

                    <div className="flex flex-col justify-center border-l border-zinc-100 group-hover:border-zinc-800 pl-8 transition-colors">
                      <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Real-time Rev</div>
                      <div className="text-xl font-black text-black group-hover:text-white leading-none tracking-tight">{store.sales}</div>
                    </div>

                    <div className="flex flex-col justify-center border-l border-zinc-100 group-hover:border-zinc-800 pl-8 transition-colors">
                      <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Thruput</div>
                      <div className="text-xl font-black text-black group-hover:text-white leading-none tracking-tight">{store.orders} <span className="text-[11px] text-zinc-400">units</span></div>
                    </div>
                  </div>

                  <div className="w-12 h-12 rounded-full bg-zinc-50 group-hover:bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Offline Nodes */}
        <div className="space-y-6 pt-10">
          <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] px-4">Inactive Nodes ({closedStores.length})</h2>
          <div className="grid grid-cols-1 gap-4 opacity-60">
            {closedStores.map((store) => (
              <div
                key={store.id}
                onClick={() => onSelectStore(store)}
                className="card-premium p-6 flex items-center gap-8 border-none bg-zinc-50/50 hover:bg-zinc-50 transition-all cursor-pointer group"
              >
                <img src={store.image} className="w-16 h-16 rounded-[15px] grayscale object-cover" />
                <div className="flex-1">
                  <h3 className="font-black text-black">{store.name}</h3>
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">{store.address}</p>
                </div>
                <div className="flex items-center gap-3 pr-8">
                  <Moon size={16} className="text-zinc-300" />
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{store.info}</span>
                </div>
                <ChevronRight size={20} className="text-zinc-200" />
              </div>
            ))}
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center justify-center gap-10 pt-12 border-t border-zinc-100">
          <button className="flex items-center gap-3 text-xs font-black text-zinc-400 hover:text-black uppercase tracking-widest transition-all">
            <Edit2 size={16} /> Bulk Node Update
          </button>
          <button className="flex items-center gap-3 text-xs font-black text-zinc-400 hover:text-black uppercase tracking-widest transition-all">
            <Calendar size={16} /> Temporal Scheduling
          </button>
          <button className="flex items-center gap-3 text-xs font-black text-zinc-400 hover:text-black uppercase tracking-widest transition-all">
            <Settings size={16} /> Protocol Config
          </button>
        </div>
      </div>
    </div>
  );
};

export const StoreInfo = ({ store, onBack, setActiveTab }: { store: Store | null, onBack: () => void, setActiveTab: (tab: any) => void }) => {
  const currentStore = store || openStores[0];

  return (
    <div className="flex-1 bg-transparent overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="max-w-[1000px] mx-auto py-12 px-8 space-y-10">
        {/* Detail Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="group flex items-center gap-4 text-[11px] font-black text-zinc-400 hover:text-black uppercase tracking-[0.2em] transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
              <ArrowLeft size={18} />
            </div>
            Back to Nodes
          </button>
          <div className="flex items-center gap-4">
            <button className="px-8 py-4 bg-white border border-zinc-100 rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all shadow-sm">
              Preview Storefront
            </button>
            <button className="px-10 py-4 bg-black text-[#00ff90] rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10">
              Save Convergence
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="card-premium border-none overflow-hidden group">
          <div className="h-[300px] relative">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 flex items-end gap-8">
              <div className="w-32 h-32 rounded-[32px] border-4 border-white bg-white shadow-2xl overflow-hidden shrink-0">
                <img src={currentStore.image} className="w-full h-full object-cover" />
              </div>
              <div className="mb-2 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#00ff90] text-black text-[9px] font-black uppercase tracking-[0.2em] rounded-full">Operational Node</span>
                  <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">ID: {currentStore.id.slice(0, 12)}</span>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter">{currentStore.name}</h1>
                <p className="text-zinc-300 font-bold flex items-center gap-2 text-sm uppercase tracking-widest">
                  <MapPin size={16} className="text-[#00ff90]" /> {currentStore.address}
                </p>
              </div>
            </div>
            <button className="absolute top-6 right-6 p-4 bg-black/40 backdrop-blur-md text-white rounded-2xl hover:bg-black transition-colors">
              <Camera size={20} />
            </button>
          </div>

          <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-12 bg-white">
            <div className="col-span-2 space-y-12">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <Layout className="text-[#00ff90]" size={20} />
                  <h3 className="text-xs font-black text-black uppercase tracking-[0.3em]">Pick-up Protocols</h3>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-2">Customer Direct Instructions</label>
                    <div className="relative">
                      <textarea
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-[24px] p-6 text-sm font-bold focus:ring-4 focus:ring-[#00ff90]/10 outline-none transition-all resize-none h-32"
                        defaultValue="Standard protocol: Direct customers to the dedicated digital pickup counter at the east wing."
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-2">Fleet Provider Signal</label>
                    <div className="relative">
                      <textarea
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-[24px] p-6 text-sm font-bold focus:ring-4 focus:ring-[#00ff90]/10 outline-none transition-all resize-none h-32"
                        defaultValue="Logistics partners should park in designated Zone-A and verify digital signature upon arrival."
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <Shield className="text-[#00ff90]" size={20} />
                  <h3 className="text-xs font-black text-black uppercase tracking-[0.3em]">Infrastructure Tags</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['Eco-Friendly Packaging', '24/7 Monitoring', 'Priority Dispatch', 'Digital Check-in', 'Thermal Logistics'].map((tag) => (
                    <div key={tag} className="px-6 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:border-[#00ff90] hover:text-black transition-all cursor-pointer">
                      {tag}
                    </div>
                  ))}
                  <button className="px-6 py-3 bg-black text-[#00ff90] rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Plus size={14} /> Add Capability
                  </button>
                </div>
              </section>
            </div>

            <div className="space-y-10 border-l border-zinc-50 pl-10">
              <section className="space-y-6">
                <h3 className="text-xs font-black text-black uppercase tracking-[0.3em]">Node Operations</h3>
                <div className="space-y-3">
                  <button className="w-full group p-5 bg-zinc-50 border border-zinc-100 rounded-[24px] flex items-center justify-between hover:bg-black transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <Clock className="text-zinc-400 group-hover:text-[#00ff90]" size={20} />
                      <div className="text-left">
                        <p className="text-sm font-black text-black group-hover:text-white">Active Hours</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Normal Ops Schedule</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-zinc-300 group-hover:text-white" />
                  </button>

                  <button className="w-full group p-5 bg-zinc-50 border border-zinc-100 rounded-[24px] flex items-center justify-between hover:bg-black transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <Calendar className="text-zinc-400 group-hover:text-[#00ff90]" size={20} />
                      <div className="text-left">
                        <p className="text-sm font-black text-black group-hover:text-white">Holiday Logic</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Temporal Overrides</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-zinc-300 group-hover:text-white" />
                  </button>
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-xs font-black text-black uppercase tracking-[0.3em]">Quick Directives</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button className="flex items-center gap-3 p-4 border border-zinc-100 rounded-2xl text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:bg-zinc-50 transition-all">
                    <ExternalLink size={16} /> Public Node Link
                  </button>
                  <button className="flex items-center gap-3 p-4 border border-rose-100 bg-rose-50/20 rounded-2xl text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-50 transition-all">
                    <X size={16} /> Emergency Shutdown
                  </button>
                </div>
              </section>

              <div className="p-6 bg-zinc-900 rounded-[32px] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Local Health</span>
                  <span className="text-[10px] font-black text-[#00ff90] uppercase tracking-widest">Optimal</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-[#00ff90] animate-pulse" />
                </div>
                <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                  This node is operating within normal parameters. All sync signals are active.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stores;

const ChevronDown = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
);

const Camera = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
);
