
import React from 'react';
import { ArrowUpRight, Car, User, ShieldCheck, Sparkles } from 'lucide-react';

interface PremiumBlockProps {
  label: string;
  title: string;
  desc: string;
  image: string;
  buttonText: string;
  isDark?: boolean;
}

const PremiumBlock: React.FC<PremiumBlockProps> = ({ label, title, desc, image, buttonText, isDark = false }) => {
  return (
    <div className={`relative group overflow-hidden rounded-[64px] min-h-[700px] flex flex-col justify-end p-10 md:p-16 transition-all duration-1000 cursor-pointer ${isDark ? 'bg-zinc-900 text-white' : 'bg-[#F8F9FA] text-black shadow-xl shadow-black/5'}`}>
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110 opacity-40 group-hover:opacity-60 grayscale group-hover:grayscale-0"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black via-black/40 to-transparent' : 'from-white via-white/40 to-transparent'}`}></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 space-y-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="w-10 h-[2px] bg-[#00D665]"></span>
            <span className={`text-[11px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-white/40' : 'text-black/30'}`}>
              {label}
            </span>
          </div>
          
          <h3 
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] break-keep whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          
          <p className={`text-xl md:text-2xl font-medium max-w-md leading-relaxed ${isDark ? 'text-white/50' : 'text-black/40'}`}>
            {desc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-4">
          <button className={`px-12 py-6 rounded-full font-black text-lg transition-all shadow-2xl active:scale-95 flex items-center gap-3 ${isDark ? 'bg-[#00D665] text-black hover:bg-white' : 'bg-black text-white hover:bg-[#00D665] hover:text-black'}`}>
            {buttonText}
            <ArrowUpRight size={20} />
          </button>
          
          <div className="flex items-center gap-3">
             <div className={`w-12 h-12 rounded-full border flex items-center justify-center ${isDark ? 'border-white/10 text-[#00D665]' : 'border-black/5 text-emerald-600'}`}>
                {isDark ? <ShieldCheck size={20} /> : <Sparkles size={20} />}
             </div>
             <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                {isDark ? 'Verified Program' : 'Elite Access'}
             </span>
          </div>
        </div>
      </div>

      {/* Top Right Icon Decoration */}
      <div className="absolute top-12 right-12 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
         <div className={`w-20 h-20 rounded-[32px] border flex items-center justify-center ${isDark ? 'border-white/10' : 'border-black/10'}`}>
            {isDark ? <Car size={32} /> : <User size={32} />}
         </div>
      </div>
    </div>
  );
};

const ContentBlocks: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Driver Block */}
          <PremiumBlock 
            label="Empowerment"
            title="Be your <br /><span className='text-[#00D665]'>own boss.</span>"
            desc="Set your schedule, define your earnings, and drive on your own terms. The most transparent driver platform globally."
            image="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1600"
            buttonText="Apply to drive"
            isDark={true}
          />

          {/* Passenger Block */}
          <PremiumBlock 
            label="Independence"
            title="Ride <br /><span className='text-[#00D665]'>Anywhere.</span>"
            desc="No hidden algorithms or surge pricing. Negotiate directly with drivers for a fair price every single time."
            image="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=1600"
            buttonText="Request a ride"
            isDark={false}
          />
        </div>

        {/* Bottom stats band */}
        <div className="mt-20 flex flex-wrap justify-between items-center gap-10 py-12 border-t border-black/5">
           <div className="flex items-center gap-6">
              <span className="text-5xl font-black text-black tracking-tighter">98%</span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 leading-tight">Partner<br />Satisfaction</p>
           </div>
           <div className="h-10 w-[1px] bg-black/5 hidden md:block"></div>
           <div className="flex items-center gap-6">
              <span className="text-5xl font-black text-black tracking-tighter">0.0s</span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 leading-tight">Response<br />Latency</p>
           </div>
           <div className="h-10 w-[1px] bg-black/5 hidden md:block"></div>
           <div className="flex items-center gap-6">
              <span className="text-5xl font-black text-black tracking-tighter">24/7</span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 leading-tight">Strategic<br />Support</p>
           </div>
           <button className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors group">
              View all programs
              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
           </button>
        </div>
      </div>
    </section>
  );
};

export default ContentBlocks;
