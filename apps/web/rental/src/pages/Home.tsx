import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Map, List, Filter, Sparkles, MapPin, Calendar, Compass, Zap, ArrowRight, LayoutGrid, ShieldCheck } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CarCard } from '../components/CarCard';
import { cn } from '../lib/utils';
import { Car } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = [
  { id: 'SUV', title: 'Luxury SUVs', icon: MapPin },
  { id: 'Sport', title: 'Performance', icon: Zap },
  { id: 'Electric', title: 'Future Fleet', icon: Compass },
  { id: 'Luxury', title: 'Executive', icon: Sparkles },
];

export function Home() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const q = query(collection(db, 'cars'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedCars = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Car[];
        setCars(fetchedCars);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const filteredCars = cars.filter(car => {
    const matchesLocation = car.location?.toLowerCase().includes(searchLocation.toLowerCase()) ||
                            car.make?.toLowerCase().includes(searchLocation.toLowerCase()) ||
                            car.model?.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesType = searchType ? car.type?.toLowerCase() === searchType.toLowerCase() : true;
    const matchesPrice = maxPrice ? car.pricePerDay <= Number(maxPrice) : true;
    
    return matchesLocation && matchesType && matchesPrice;
  });

  const isSearching = searchLocation || searchType || maxPrice;
  const regularCars = isSearching ? filteredCars : cars;

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2500" 
            className="w-full h-full object-cover opacity-60 scale-105"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-transparent to-white" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="space-y-8"
           >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                <Sparkles size={12} className="text-amber-400" />
                The Future of Fractional Mobility
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] max-w-4xl mx-auto">
                DRIVE THE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200">IMPOSSIBLE.</span>
              </h1>
              
              <p className="text-xl text-indigo-100/80 font-medium max-w-2xl mx-auto leading-relaxed">
                Unlock local access to thousands of premium vehicles from verified hosts across the globe.
              </p>

              {/* Redesigned Discovery Bar */}
              <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-3xl rounded-[2.5rem] p-3 shadow-2xl flex flex-col md:flex-row items-center gap-2 mt-12 ring-8 ring-black/5">
                <div className="flex-1 flex items-center gap-4 px-6 border-r border-gray-100">
                  <MapPin size={20} className="text-indigo-600" />
                  <div className="flex-1 text-left">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-0.5">Destination</p>
                    <input 
                      type="text" 
                      placeholder="Search hub or city..." 
                      className="w-full bg-transparent border-none outline-none font-bold text-gray-900 placeholder:text-gray-300"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex-1 flex items-center gap-4 px-6 border-r border-gray-100">
                  <Calendar size={20} className="text-indigo-600" />
                  <div className="flex-1 text-left">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-0.5">Scheduling</p>
                    <button className="font-bold text-gray-900 text-sm">Add Dates</button>
                  </div>
                </div>

                <button 
                  onClick={() => setShowFilters(true)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shrink-0 flex items-center gap-2"
                >
                  <Filter size={16} />
                  Filters
                </button>

                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all flex items-center gap-2 shrink-0">
                  <Search size={16} />
                   Locate
                </button>
              </div>
           </motion.div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="max-w-7xl mx-auto px-6 -translate-y-12 relative z-20">
         <div className="bg-white rounded-[3rem] p-4 shadow-xl border border-gray-50 flex flex-wrap items-center justify-center gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSearchType(searchType === cat.id ? '' : cat.id)}
                className={cn(
                  "px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all",
                  searchType === cat.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                )}
              >
                <cat.icon size={14} />
                {cat.title}
              </button>
            ))}
         </div>
      </section>

      {/* Main Inventory Content */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
               <span className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full">Available Now</span>
               <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Global Inventory</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">
              {isSearching ? 'Curated Search Results' : 'Explore the Fleet'}
            </h2>
          </motion.div>
          
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100">
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "p-3 rounded-xl transition-all",
                viewMode === 'list' ? "bg-white text-indigo-600 shadow-md ring-1 ring-gray-100" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={cn(
                "p-3 rounded-xl transition-all",
                viewMode === 'map' ? "bg-white text-indigo-600 shadow-md ring-1 ring-gray-100" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Map size={20} />
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[1,2,3,4,5,6,7,8].map(i => (
                 <div key={i} className="space-y-4 animate-pulse">
                    <div className="aspect-[16/11] bg-gray-100 rounded-[2.5rem]" />
                    <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                    <div className="h-4 bg-gray-100 rounded-full w-1/2" />
                 </div>
               ))}
            </div>
          ) : regularCars.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
            >
              {regularCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-4 border-dashed border-gray-100">
               <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <Search size={32} className="text-indigo-600" />
               </div>
               <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">No Matches Found</h3>
               <p className="text-gray-400 font-medium max-w-sm mx-auto mb-10">Expand your search reach or reconsider your spec requirements.</p>
               <button 
                 onClick={() => {
                   setSearchLocation('');
                   setSearchType('');
                   setMaxPrice('');
                 }} 
                 className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100"
               >
                 Flush Search Buffers
               </button>
            </div>
          )
        ) : (
          <div className="bg-gray-900/5 backdrop-blur-sm rounded-[4rem] h-[600px] flex items-center justify-center border-4 border-dashed border-gray-100 relative overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
              className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm group-hover:blur-none transition-all duration-1000"
              alt="Map Background"
            />
            <div className="text-center relative z-10 bg-white/80 backdrop-blur-2xl p-12 rounded-[3rem] shadow-2xl border border-white/40 max-w-md mx-6">
              <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100 rotate-6">
                 <Map size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-4">Cartographic View</h3>
              <p className="text-gray-500 font-medium mb-8 leading-relaxed">Spatial discovery and cluster-based mapping is currently in development.</p>
              <button 
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2 mx-auto text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:gap-4 transition-all"
              >
                Return to Linear Discovery <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Premium CTA Section */}
      <section className="bg-gray-900 py-32 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] translate-y-1/2 translate-x-1/2" />
         </div>

         <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Monetize Your Assets</span>
               <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
                  TURN YOUR <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200">CAR INTO CAPITAL.</span>
               </h2>
               <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-lg">
                  Join thousands of hosts earning $10,000+ per year by sharing their vehicles on the DashRental network.
               </p>
               <Link 
                 to="/host" 
                 className="inline-flex items-center gap-4 bg-white text-gray-900 px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-2xl shadow-indigo-500/10"
               >
                 Bootstrap Your Business <ArrowRight size={16} />
               </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 className="space-y-4"
               >
                  <div className="p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10">
                     <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white">
                        <Zap size={24} />
                     </div>
                     <h4 className="text-lg font-black text-white mb-2">Automated Payouts</h4>
                     <p className="text-xs text-gray-500 font-medium">Earnings deposited daily to your digital hub.</p>
                  </div>
                  <div className="p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10">
                     <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white">
                        <ShieldCheck size={24} />
                     </div>
                     <h4 className="text-lg font-black text-white mb-2">$1M Protection</h4>
                     <p className="text-xs text-gray-500 font-medium">Standard liability coverage for every operational trip.</p>
                  </div>
               </motion.div>
               <motion.div 
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 className="space-y-4 translate-y-8"
               >
                  <div className="p-8 bg-indigo-600 rounded-[2.5rem] shadow-2xl shadow-indigo-500/20">
                     <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 text-white">
                        <Sparkles size={24} />
                     </div>
                     <h4 className="text-lg font-black text-white mb-2">Host Concierge</h4>
                     <p className="text-xs text-indigo-100 font-medium">24/7 dedicated support for professional fleet owners.</p>
                  </div>
                  <div className="p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10">
                     <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white">
                        <LayoutGrid size={24} />
                     </div>
                     <h4 className="text-lg font-black text-white mb-2">Fleet Hub</h4>
                     <p className="text-xs text-gray-500 font-medium">Manage 1 to 100+ assets with professional tooling.</p>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>
    </div>
  );
}
