import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, Calendar, Car, Star, ChevronRight, Clock, Zap, ShieldCheck } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { parse } from 'date-fns';
import { motion } from 'motion/react';

export function HostDashboard() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    monthlyEarnings: 0,
    upcomingTrips: 0,
    activeVehicles: 0,
    rating: 4.95
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        const carsRef = collection(db, 'cars');
        const carsQuery = query(carsRef, where('hostId', '==', user.uid));
        const carsSnapshot = await getDocs(carsQuery);
        const hostCars = carsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const carIds = hostCars.map(car => car.id);
        
        let upcomingCount = 0;
        let earnings = 0;
        const bookingsData: any[] = [];
        
        if (carIds.length > 0) {
          const bookingsRef = collection(db, 'bookings');
          const bookingsSnapshot = await getDocs(bookingsRef);
          
          const now = new Date(new Date().setHours(0,0,0,0));
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          bookingsSnapshot.forEach(doc => {
            const booking = { id: doc.id, ...doc.data() } as any;
            if (carIds.includes(booking.carId)) {
              booking.car = hostCars.find(c => c.id === booking.carId);
              bookingsData.push(booking);
              
              const startDate = parse(booking.startDate.split('T')[0], 'yyyy-MM-dd', new Date());
              if (startDate >= now && booking.status !== 'cancelled') {
                upcomingCount++;
              }
              if (startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear && booking.status !== 'cancelled') {
                earnings += booking.totalPrice || 0;
              }
            }
          });
        }
        
        bookingsData.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        
        setStats(prev => ({
          ...prev,
          monthlyEarnings: earnings,
          upcomingTrips: upcomingCount,
          activeVehicles: hostCars.length
        }));
        
        setRecentBookings(bookingsData.filter(b => parse(b.startDate.split('T')[0], 'yyyy-MM-dd', new Date()) >= new Date(new Date().setHours(0,0,0,0)) && b.status !== 'cancelled').slice(0, 3));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Synchronizing Fleet Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Pro Host</span>
            <span className="flex items-center gap-1 text-green-600 text-xs font-bold ring-1 ring-green-100 bg-green-50 px-2 py-1 rounded-full">
              <Zap className="w-3 h-3 fill-current" /> Live
            </span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none">
            Command <span className="text-indigo-600">Center</span>
          </h1>
          <p className="text-gray-500 mt-4 font-medium text-lg">Elevating your {profile?.displayName || 'Host'} empire today.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-2 rounded-[2rem] border border-gray-100 shadow-2xl flex items-center gap-4 pr-8"
        >
          <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Protection Level</div>
            <div className="text-xl font-black text-gray-900 leading-none">Standard Plan</div>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Monthly Revenue', value: `$${stats.monthlyEarnings.toLocaleString()}`, icon: DollarSign, color: 'emerald', trend: '+18.4%' },
          { label: 'Upcoming Trips', value: stats.upcomingTrips, icon: Calendar, color: 'indigo', trend: 'Active' },
          { label: 'Fleet Velocity', value: stats.activeVehicles, icon: Car, color: 'blue', trend: 'Stable' },
          { label: 'Host Quality', value: stats.rating, icon: Star, color: 'amber', trend: 'Top 1%' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-500">
              <stat.icon size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center ring-1 ring-${stat.color}-100`}>
                  <stat.icon size={24} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-${stat.color}-50 text-${stat.color}-600 ring-1 ring-${stat.color}-100`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upcoming Trips List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-8 bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Operations</h2>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Pending Check-ins & Routes</p>
            </div>
            <Link to="/host/trips" className="px-6 py-3 bg-white text-indigo-600 rounded-2xl text-sm font-black border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center uppercase tracking-widest">
              Fleet Log <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          
          <div className="divide-y divide-gray-50">
            {recentBookings.length === 0 ? (
              <div className="p-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">No Active Trips</h3>
                <p className="text-gray-400 max-w-xs mx-auto font-medium">Your fleet is ready for new bookings. Performance is stable across all verticals.</p>
              </div>
            ) : (
              recentBookings.map((booking, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  key={booking.id} 
                  className="p-8 hover:bg-gray-50/50 transition-all group flex flex-col sm:flex-row gap-8 items-start sm:items-center justify-between"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-20 rounded-[1.5rem] overflow-hidden bg-gray-100 flex-shrink-0 shadow-inner group-hover:shadow-xl transition-shadow duration-500">
                      {booking.car?.images?.[0] && (
                        <img src={booking.car.images[0]} alt={booking.car.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-gray-900 leading-none mb-2">{booking.car?.make} {booking.car?.model}</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <Clock className="w-3 h-3 mr-2 text-indigo-500" />
                          {parse(booking.startDate.split('T')[0], 'yyyy-MM-dd', new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                        <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Confirmed Trip</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                    <div className="text-2xl font-black text-gray-900 tracking-tight">${booking.totalPrice}</div>
                    <button className="px-5 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                      Manage Trip
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-4 space-y-6"
        >
          <div className="bg-indigo-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-black mb-6 tracking-tight">Expansion</h2>
              <div className="space-y-4">
                <Link to="/host/new" className="flex items-center justify-between p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                      <Car className="w-5 h-5" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-[10px]">Add Listing</span>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
                
                <button className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-[10px]">Instant Book</span>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-8 tracking-tight">Notifications</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-2 h-2 mt-2 bg-indigo-600 rounded-full ring-4 ring-indigo-50 shrink-0"></div>
                <div>
                  <p className="text-sm font-black text-gray-900 leading-tight">Safety inspection required</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 mt-2 bg-amber-500 rounded-full ring-4 ring-amber-50 shrink-0"></div>
                <div>
                  <p className="text-sm font-black text-gray-900 leading-tight">Payout of $1,240 initiated</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
