import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  AlertCircle,
  MoreVertical,
  Filter,
  Search,
  Zap,
  Star as StarIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { parse } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function HostTrips() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'active' | 'past'>('upcoming');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('hostId', '==', user.uid));
      const snapshot = await getDocs(q);
      
      const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

      const carIds = [...new Set(bookingsData.map(b => b.carId))];
      const carsData: Record<string, any> = {};
      
      if (carIds.length > 0) {
        const carsRef = collection(db, 'cars');
        const carsQuery = query(carsRef, where('hostId', '==', user.uid));
        const carsSnapshot = await getDocs(carsQuery);
        carsSnapshot.docs.forEach(doc => {
          carsData[doc.id] = { id: doc.id, ...doc.data() };
        });
      }

      const enrichedBookings = bookingsData.map(booking => ({
        ...booking,
        car: carsData[booking.carId] || null
      }));

      enrichedBookings.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      
      setBookings(enrichedBookings);
    } catch (error) {
      console.error("Error fetching host trips:", error);
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setProcessingId(bookingId);
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { status: newStatus });
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      toast.success(`Trip marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update trip status");
    } finally {
      setProcessingId(null);
    }
  };

  const now = new Date(new Date().setHours(0,0,0,0));

  const filteredBookings = bookings.filter(booking => {
    const startDate = parse(booking.startDate.split('T')[0], 'yyyy-MM-dd', new Date());
    const endDate = parse(booking.endDate.split('T')[0], 'yyyy-MM-dd', new Date());
    
    let currentStatus = booking.status;
    if (currentStatus === 'confirmed') {
      if (now > endDate) currentStatus = 'completed';
      else if (now >= startDate && now <= endDate) currentStatus = 'active';
    }

    const matchesTab = activeTab === 'upcoming' 
      ? (currentStatus === 'confirmed' && startDate > now)
      : activeTab === 'active'
      ? (currentStatus === 'active' || (currentStatus === 'confirmed' && now >= startDate && now <= endDate))
      : (currentStatus === 'completed' || currentStatus === 'cancelled' || endDate < now);

    const matchesSearch = booking.car?.make?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          booking.car?.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Accessing Logistics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Manifest</span>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Fleet Operations</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none">
            Operation <span className="text-indigo-600">Log</span>
          </h1>
          <p className="text-gray-500 mt-4 font-medium text-lg">Real-time oversight of all guest movements.</p>
        </motion.div>

        <div className="bg-white p-2 rounded-3xl border border-gray-100 shadow-xl flex items-center gap-1">
          {(['upcoming', 'active', 'past'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === tab 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                  : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by vehicle or ID..."
            className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-white border border-gray-100 focus:border-indigo-600 outline-none shadow-sm group-hover:shadow-md transition-all font-bold text-gray-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="px-8 py-5 bg-white border border-gray-100 rounded-[2rem] font-bold text-gray-600 flex items-center gap-3 hover:bg-gray-50 transition-all shadow-sm">
          <Filter className="w-5 h-5" />
          Refine
        </button>
      </div>

      {/* Trips List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredBookings.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                <Calendar className="w-10 h-10 text-gray-200" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Zero Activity Found</h3>
              <p className="text-gray-400 max-w-sm mx-auto font-medium">
                Adjust your filters or switch tabs to see other fleet operations.
              </p>
            </motion.div>
          ) : (
            filteredBookings.map((booking, i) => {
              const startDate = parse(booking.startDate.split('T')[0], 'yyyy-MM-dd', new Date());
              const endDate = parse(booking.endDate.split('T')[0], 'yyyy-MM-dd', new Date());
              const isProcessing = processingId === booking.id;
              
              let displayStatus = booking.status;
              if (displayStatus === 'confirmed' && now > endDate) displayStatus = 'completed';
              else if (displayStatus === 'confirmed' && now >= startDate && now <= endDate) displayStatus = 'active';

              return (
                <motion.div 
                  key={booking.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col md:flex-row group"
                >
                  {/* Car Image Profile */}
                  <div className="w-full md:w-80 h-64 md:h-auto bg-gray-100 flex-shrink-0 relative overflow-hidden">
                    {booking.car?.images?.[0] ? (
                      <img src={booking.car.images[0]} alt={booking.car.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <CarIcon size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                    <div className="absolute top-6 left-6">
                      <span className={cn(
                        "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-xl border border-white/20",
                        displayStatus === 'active' ? 'bg-green-500 text-white' :
                        displayStatus === 'confirmed' ? 'bg-indigo-600 text-white' :
                        displayStatus === 'cancelled' ? 'bg-red-500 text-white' :
                        'bg-gray-900 text-white'
                      )}>
                        {displayStatus}
                      </span>
                    </div>
                  </div>

                  {/* Operational Details */}
                  <div className="p-10 flex-1 flex flex-col justify-between space-y-8">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{booking.id.substring(0, 8)}</span>
                             <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Digital Auth</span>
                          </div>
                          <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
                            {booking.car ? `${booking.car.make} ${booking.car.model}` : 'Unknown Asset'}
                          </h3>
                          <div className="flex items-center gap-2 mt-4">
                             <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                               <User size={12} className="text-gray-400" />
                             </div>
                             <p className="text-xs font-bold text-gray-500">Verified Guest • {booking.guestId.substring(0, 6)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-black text-gray-900 tracking-tighter tabular-nums">${booking.totalPrice}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Gross Payout</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                        <div className="flex items-center gap-4 bg-gray-50/50 p-5 rounded-[2rem] border border-gray-100">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                            <Calendar size={18} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Route Schedule</p>
                            <p className="text-xs font-black text-gray-700">{startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 bg-gray-50/50 p-5 rounded-[2rem] border border-gray-100">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                            <MapPin size={18} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Base Hub</p>
                            <p className="text-xs font-black text-gray-700 truncate max-w-[120px]">{booking.car?.location || 'Central Park'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Operational Actions */}
                    <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-gray-50">
                      {displayStatus === 'confirmed' && activeTab === 'upcoming' && (
                        <>
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => updateBookingStatus(booking.id, 'active')}
                            disabled={isProcessing}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 flex items-center gap-2 disabled:opacity-50 transition-all"
                          >
                            <Zap size={14} className="fill-current" />
                            Initialize Check-in
                          </motion.button>
                          <button 
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            disabled={isProcessing}
                            className="bg-red-50 text-red-600 hover:bg-red-100 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50"
                          >
                            Refuse Trip
                          </button>
                        </>
                      )}

                      {displayStatus === 'active' && (
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          disabled={isProcessing}
                          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-100 flex items-center gap-2 disabled:opacity-50 transition-all"
                        >
                          <CheckCircle2 size={14} />
                          Finalise Check-out
                        </motion.button>
                      )}

                      {displayStatus === 'completed' && (
                        <button className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all">
                          <StarIcon size={14} className="fill-current" />
                          Rate Performance
                        </button>
                      )}

                      <button className="ml-auto w-12 h-12 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-white border border-gray-100 rounded-xl flex items-center justify-center transition-all group-hover:border-indigo-100">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CarIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}
