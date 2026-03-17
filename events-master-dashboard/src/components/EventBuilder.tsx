import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Tag, 
  Image as ImageIcon, 
  Plus, 
  Minus, 
  DollarSign, 
  Check,
  Grid3X3,
  Layout,
  Info
} from 'lucide-react';

interface Seat {
  id: string;
  row: string;
  number: number;
  price: number;
  category: 'standard' | 'vip' | 'premium';
}

interface EventData {
  name: string;
  venue: string;
  date: string;
  category: string;
  image: string;
  seats: Seat[];
}

interface EventBuilderProps {
  onBack: () => void;
  onPublish: (event: EventData) => void;
}

export default function EventBuilder({ onBack, onPublish }: EventBuilderProps) {
  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState<EventData>({
    name: '',
    venue: '',
    date: '',
    category: 'Music',
    image: 'https://picsum.photos/seed/newevent/600/400',
    seats: []
  });

  const [rowCount, setRowCount] = useState(4);
  const [seatsPerRow, setSeatsPerRow] = useState(4);
  const [basePrice, setBasePrice] = useState(50);

  const categories = ['Music', 'Sport', 'Arts', 'Theatre', 'Comedy', 'Family'];

  const generateSeats = () => {
    const newSeats: Seat[] = [];
    const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    for (let i = 0; i < rowCount; i++) {
      for (let j = 1; j <= seatsPerRow; j++) {
        newSeats.push({
          id: `${rows[i]}${j}`,
          row: rows[i],
          number: j,
          price: basePrice,
          category: 'standard'
        });
      }
    }
    setEventData({ ...eventData, seats: newSeats });
  };

  const nextStep = () => {
    if (step === 2 && eventData.seats.length === 0) {
      generateSeats();
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar */}
      <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
          <h1 className="text-xl font-black tracking-tight uppercase text-slate-900 line-clamp-1">
            {step === 1 ? 'Create New Event' : step === 2 ? 'Design Seat Map' : 'Review & Publish'}
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step === s ? 'bg-[#026cdf] text-white shadow-lg shadow-blue-500/20 scale-110' : 
                  step > s ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
            ))}
          </div>
          <button 
            onClick={step === 3 ? () => onPublish(eventData) : nextStep}
            className="bg-[#026cdf] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95"
          >
            {step === 3 ? 'Publish Event' : 'Continue'}
            {step < 3 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-12 flex justify-center no-scrollbar">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-2xl space-y-8"
            >
              <div className="space-y-6 bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Info className="w-5 h-5 text-[#026cdf]" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">General Information</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Event Name</label>
                    <input 
                      type="text" 
                      value={eventData.name}
                      onChange={(e) => setEventData({...eventData, name: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#026cdf] focus:bg-white transition-all font-medium"
                      placeholder="e.g. Summer Music Festival 2026"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Venue</label>
                      <div className="relative">
                        <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" 
                          value={eventData.venue}
                          onChange={(e) => setEventData({...eventData, venue: e.target.value})}
                          className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#026cdf] focus:bg-white transition-all font-medium"
                          placeholder="Wembley Stadium"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
                      <div className="relative">
                        <Calendar className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                          type="date" 
                          value={eventData.date}
                          onChange={(e) => setEventData({...eventData, date: e.target.value})}
                          className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#026cdf] focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setEventData({...eventData, category: cat})}
                          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                            eventData.category === cat 
                              ? 'bg-[#026cdf] text-white shadow-md' 
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image URL</label>
                    <div className="relative">
                      <ImageIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        value={eventData.image}
                        onChange={(e) => setEventData({...eventData, image: e.target.value})}
                        className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#026cdf] focus:bg-white transition-all font-medium"
                      />
                    </div>
                    <div className="mt-4 rounded-2xl overflow-hidden aspect-video border border-slate-200 bg-slate-100 flex items-center justify-center">
                      <img src={eventData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-6xl flex gap-10"
            >
              {/* Controls */}
              <div className="w-80 flex-shrink-0 space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <Grid3X3 className="w-5 h-5 text-[#026cdf]" />
                    <h3 className="font-bold">Layout Controls</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-600 uppercase">Rows</span>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setRowCount(Math.max(1, rowCount - 1))} className="p-1 hover:bg-slate-100 rounded-lg"><Minus className="w-4 h-4" /></button>
                        <span className="font-mono font-bold w-6 text-center">{rowCount}</span>
                        <button onClick={() => setRowCount(Math.min(10, rowCount + 1))} className="p-1 hover:bg-slate-100 rounded-lg"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-600 uppercase">Seats / Row</span>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setSeatsPerRow(Math.max(1, seatsPerRow - 1))} className="p-1 hover:bg-slate-100 rounded-lg"><Minus className="w-4 h-4" /></button>
                        <span className="font-mono font-bold w-6 text-center">{seatsPerRow}</span>
                        <button onClick={() => setSeatsPerRow(Math.min(10, seatsPerRow + 1))} className="p-1 hover:bg-slate-100 rounded-lg"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="pt-2">
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Base Ticket Price ($)</label>
                       <div className="relative">
                         <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                         <input 
                           type="number" 
                           value={basePrice}
                           onChange={(e) => setBasePrice(parseInt(e.target.value))}
                           className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#026cdf] font-bold"
                         />
                       </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={generateSeats}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Layout className="w-4 h-4" />
                    Regenerate Map
                  </button>
                </div>

                <div className="bg-blue-600 p-8 rounded-3xl text-white">
                  <h4 className="font-bold flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4" />
                    Pro Tip
                  </h4>
                  <p className="text-sm opacity-90 leading-relaxed">
                    Event organizers with clear seat labels see 15% higher ticket sales on average.
                  </p>
                </div>
              </div>

              {/* Visual Seat Map */}
              <div className="flex-1 bg-white p-12 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
                <div className="w-full max-w-lg mb-12">
                   <div className="h-4 bg-slate-200 rounded-full w-full mb-2"></div>
                   <p className="text-[10px] text-slate-400 font-bold text-center tracking-[0.2em] uppercase">Stage / Front</p>
                </div>

                <div className="space-y-4">
                  {Array.from({ length: rowCount }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="w-6 text-xs font-black text-slate-300">{'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i]}</span>
                      <div className="flex gap-2">
                        {Array.from({ length: seatsPerRow }).map((_, j) => (
                          <div 
                            key={j} 
                            className="w-10 h-10 rounded-lg bg-emerald-500 shadow-sm flex items-center justify-center text-white text-[10px] font-bold group relative cursor-pointer hover:scale-110 transition-all"
                          >
                            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i]}{j+1}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white rounded text-[8px] opacity-0 group-hover:opacity-100 whitespace-nowrap z-30 transition-opacity">
                              ${basePrice} Standard
                            </div>
                          </div>
                        ))}
                      </div>
                      <span className="w-6 text-xs font-black text-slate-300">{'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i]}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-12 border-t border-slate-100 w-full flex justify-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-emerald-500"></div>
                    <span className="text-xs font-bold text-slate-600">Standard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500"></div>
                    <span className="text-xs font-bold text-slate-600">VIP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-slate-200"></div>
                    <span className="text-xs font-bold text-slate-600">Blocked</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-4xl space-y-8"
            >
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex h-96">
                <div className="w-1/2 h-full">
                  <img src={eventData.image} alt="Event" className="w-full h-full object-cover" />
                </div>
                <div className="w-1/2 p-10 flex flex-col">
                  <div className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-[#026cdf] mb-2">
                    <Tag className="w-3 h-3" />
                    {eventData.category}
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 leading-tight mb-4">{eventData.name || 'Untitled Event'}</h2>
                  
                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center gap-3 text-slate-500 font-bold">
                      <Calendar className="w-5 h-5" />
                      {eventData.date || 'Date TBD'}
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 font-bold">
                      <MapPin className="w-5 h-5" />
                      {eventData.venue || 'Venue TBD'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Ticket Summary</p>
                   <div className="flex items-end justify-between">
                     <div>
                       <p className="text-3xl font-black text-slate-900">{eventData.seats.length}</p>
                       <p className="text-sm font-bold text-slate-500">Total Tickets</p>
                     </div>
                     <div className="text-right">
                       <p className="text-3xl font-black text-[#026cdf]">${basePrice}</p>
                       <p className="text-sm font-bold text-slate-500 text-slate-500">Starting At</p>
                     </div>
                   </div>
                 </div>
                 <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-lg flex flex-col justify-center items-center text-center">
                    <p className="text-blue-400 font-black text-xs uppercase tracking-widest mb-1">Ready to launch?</p>
                    <p className="text-white text-sm opacity-70">Your event will be visible to all users immediately after publishing.</p>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
