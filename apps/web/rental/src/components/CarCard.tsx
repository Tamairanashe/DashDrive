import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Star, Heart, Zap, ShieldCheck } from 'lucide-react';
import { Car } from '../data/mockData';
import { cn } from '../lib/utils';

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link to={`/car/${car.id}`} className="block">
        <div className="relative aspect-[16/11] rounded-[2.5rem] overflow-hidden mb-6 shadow-2xl shadow-indigo-100/20 ring-1 ring-gray-100">
          <img 
            src={car.images[0]} 
            alt={`${car.make} ${car.model}`} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute top-6 left-6 flex gap-2">
            <div className="px-3 py-1.5 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 flex items-center gap-2">
              <Zap size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Instant</span>
            </div>
          </div>

          <button 
            className="absolute top-6 right-6 p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/30 transition-all active:scale-90"
            onClick={(e) => {
              e.preventDefault();
              // Favorite logic
            }}
          >
            <Heart size={18} />
          </button>

          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 backdrop-blur-md rounded-lg border border-emerald-500/30">
                <ShieldCheck size={10} className="text-emerald-400" />
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">DashProtect</span>
             </div>
          </div>
        </div>
        
        <div className="px-2">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{car.type}</p>
              <h3 className="font-black text-xl text-gray-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                {car.make} {car.model}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-gray-900 leading-none mb-1">
                ${car.pricePerDay}
              </p>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Est. Total</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-indigo-600 text-indigo-600" />
              <span className="text-xs font-black text-gray-900">{car.rating}</span>
              <span className="text-xs font-bold text-gray-400">({car.trips} trips)</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-gray-200" />
            <p className="text-xs font-bold text-gray-400">{car.distance}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
