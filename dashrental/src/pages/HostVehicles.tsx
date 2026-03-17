import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  Settings, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Moon, 
  Sun, 
  Zap, 
  ChevronRight, 
  Star,
  Fuel,
  Baby,
  IceCream,
  Wifi,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

interface VehicleExtra {
  id: string;
  name: string;
  price: number;
  icon: any;
  description: string;
}

const AVAILABLE_EXTRAS: VehicleExtra[] = [
  { id: 'refuel', name: 'Prepaid refuel', price: 65, icon: Fuel, description: 'Return the car at any fuel level' },
  { id: 'child_seat', name: 'Child seat', price: 30, icon: Baby, description: 'Safety for the little ones' },
  { id: 'cooler', name: 'Cooler', price: 15, icon: IceCream, description: 'Keep your drinks cold' },
  { id: 'wifi', name: 'Portable Wi-Fi', price: 10, icon: Wifi, description: 'High-speed internet on the go' },
];

export function HostVehicles() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [isExtrasModalOpen, setIsExtrasModalOpen] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, [user]);

  const fetchVehicles = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'cars'), where('hostId', '==', user.uid));
      const snapshot = await getDocs(q);
      const fetchedVehicles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVehicles(fetchedVehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to load fleet');
    } finally {
      setLoading(false);
    }
  };

  const toggleSnooze = async (vehicleId: string, currentSnooze: boolean) => {
    try {
      const vehicleRef = doc(db, 'cars', vehicleId);
      await updateDoc(vehicleRef, { isSnoozed: !currentSnooze });
      setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, isSnoozed: !currentSnooze } : v));
      toast.success(currentSnooze ? 'Listing reactivated!' : 'Listing snoozed');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.make.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Fleet Management</span>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{vehicles.length} Total Assets</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none">
            Your <span className="text-indigo-600">Vehicles</span>
          </h1>
          <p className="text-gray-500 mt-4 font-medium text-lg">Manage performance, pricing, and availability.</p>
        </motion.div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-indigo-600 text-white px-8 py-5 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-2xl shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          List New Vehicle
        </motion.button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by make, model..."
            className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-white border border-gray-100 focus:border-indigo-600 outline-none shadow-sm group-hover:shadow-md transition-all font-bold text-gray-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="px-8 py-5 bg-white border border-gray-100 rounded-[2rem] font-bold text-gray-600 flex items-center gap-3 hover:bg-gray-50 transition-all shadow-sm">
          <SlidersHorizontal className="w-5 h-5" />
          Advanced Filters
        </button>
      </div>

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredVehicles.map((vehicle, i) => (
            <motion.div
              key={vehicle.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "group relative bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500",
                vehicle.isSnoozed && "opacity-80 grayscale-[0.5]"
              )}
            >
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1000'} 
                  alt={vehicle.model}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    {vehicle.isSnoozed ? (
                      <span className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        <Moon className="w-3 h-3" /> Snoozed
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 px-3 py-1.5 bg-green-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        <Sun className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <button className="p-3 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-gray-900 rounded-2xl transition-all">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-black text-white leading-none mb-1">{vehicle.make} {vehicle.model}</h3>
                  <p className="text-white/70 text-sm font-bold uppercase tracking-widest">{vehicle.year} • {vehicle.type}</p>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-8 space-y-8">
                <div className="flex justify-between items-center bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Daily Rate</p>
                    <div className="text-2xl font-black text-gray-900 tracking-tight">${vehicle.pricePerDay}<span className="text-xs text-gray-400 ml-1">/day</span></div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Lifetime Earnings</p>
                    <div className="text-xl font-black text-indigo-600 tracking-tight">+$4,250</div>
                  </div>
                </div>

                <div className="flex items-center justify-around py-2">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-black text-gray-900">{vehicle.rating}</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rating</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100"></div>
                  <div className="text-center">
                    <div className="text-sm font-black text-gray-900 mb-1">{vehicle.trips}</div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trips</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100"></div>
                  <div className="text-center">
                    <div className="text-sm font-black text-indigo-600 mb-1">98%</div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Health</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setIsExtrasModalOpen(true);
                    }}
                    className="flex-1 px-4 py-4 rounded-2xl bg-white border border-gray-200 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-indigo-600" /> Extras
                  </button>
                  <button 
                    onClick={() => toggleSnooze(vehicle.id, vehicle.isSnoozed)}
                    className={cn(
                      "flex-1 px-4 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                      vehicle.isSnoozed 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {vehicle.isSnoozed ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {vehicle.isSnoozed ? 'Restore' : 'Snooze'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Extras Modal */}
      <AnimatePresence>
        {isExtrasModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExtrasModalOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-gray-50 bg-gray-50/30">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Vehicle Extras</h2>
                    <p className="text-gray-500 font-medium mt-2">Personalize the experience for <span className="text-indigo-600">{selectedVehicle?.make} {selectedVehicle?.model}</span></p>
                  </div>
                  <button 
                    onClick={() => setIsExtrasModalOpen(false)}
                    className="p-4 hover:bg-white rounded-2xl bg-gray-100 text-gray-400 transition-all"
                  >
                    <Plus className="w-6 h-6 rotate-45" />
                  </button>
                </div>
              </div>

              <div className="p-10 space-y-4">
                {AVAILABLE_EXTRAS.map((extra) => {
                  const Icon = extra.icon;
                  const isEnabled = selectedVehicle?.extras?.includes(extra.id);
                  return (
                    <button 
                      key={extra.id}
                      className={cn(
                        "w-full p-6 rounded-[2rem] border transition-all flex items-center justify-between group",
                        isEnabled 
                          ? "bg-indigo-50 border-indigo-200 shadow-sm" 
                          : "bg-white border-gray-100 hover:border-indigo-100"
                      )}
                    >
                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                          isEnabled ? "bg-indigo-600 text-white" : "bg-gray-50 text-gray-400 group-hover:text-indigo-600"
                        )}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <div className="text-left">
                          <h4 className="text-lg font-black text-gray-900 mb-1">{extra.name}</h4>
                          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{extra.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-gray-900 mb-1">${extra.price}</div>
                        <div className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                          isEnabled ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"
                        )}>
                          {isEnabled ? 'Active' : 'Disabled'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-10 bg-gray-50 flex gap-4">
                <button 
                  onClick={() => setIsExtrasModalOpen(false)}
                  className="flex-1 py-5 rounded-[1.5rem] bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all"
                >
                  Save Configuration
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
