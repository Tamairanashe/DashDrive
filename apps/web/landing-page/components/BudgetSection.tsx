
import React from 'react';
import { BadgeDollarSign, UserCheck, SlidersHorizontal, Star, Shield } from 'lucide-react';

const BudgetSection: React.FC = () => {
  const items = [
    {
      icon: <BadgeDollarSign className="w-8 h-8 text-emerald-500" strokeWidth={1.5} />,
      title: "Fair Fare",
      subtitle: "Negotiate with clarity",
      desc: "Bid farewell to rigid algorithms. Propose your price and connect directly with drivers who value your trip as much as you do."
    },
    {
      icon: <UserCheck className="w-8 h-8 text-emerald-500" strokeWidth={1.5} />,
      title: "Elite Verification",
      subtitle: "Safety without compromise",
      desc: "Our multi-stage verification process ensures every journey is helmed by a professional who meets our stringent safety benchmarks."
    },
    {
      icon: <SlidersHorizontal className="w-8 h-8 text-emerald-500" strokeWidth={1.5} />,
      title: "Total Control",
      subtitle: "Personalize every detail",
      desc: "Curate your experience by selecting drivers based on vehicle class, real-time ratings, and transparent counter-offers."
    }
  ];

  return (
    <section className="relative pt-24 pb-32 md:pt-40 md:pb-40 bg-white overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-50/30 to-transparent pointer-events-none -z-10"></div>
      
      <div className="container mx-auto px-6 md:px-12 max-w-[1700px]">
        {/* Top Hero Layout */}
        <div className="flex flex-col lg:flex-row gap-20 items-center mb-32 md:mb-40">
          {/* Left: Heading and Narrative */}
          <div className="w-full lg:w-3/5 space-y-12 animate-reveal">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="w-10 h-[2px] bg-[#00D665]"></span>
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-black/30">Standards</span>
              </div>
              <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.8] text-black">
                Redefining <br />
                <span className="text-[#00D665]">Movement.</span>
              </h2>
            </div>
            
            <div className="max-w-xl">
              <p className="text-2xl md:text-3xl text-black/40 font-medium leading-tight">
                An ecosystem built on <span className="text-black font-bold">transparency</span> and <span className="text-black font-bold">mutual respect</span>. Luxury isn't just the car; it's the freedom to decide.
              </p>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-14 h-14 rounded-full border-4 border-white overflow-hidden bg-gray-100 shadow-md">
                    <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="User" />
                  </div>
                ))}
                <div className="w-14 h-14 rounded-full border-4 border-white bg-black flex items-center justify-center text-white text-xs font-bold shadow-md">
                  +2M
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex gap-1 text-[#00D665]">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-sm font-bold text-black/60 tracking-tight">Trusted by millions globally</p>
              </div>
            </div>
          </div>
          
          {/* Right: Premium Visual Stack */}
          <div className="w-full lg:w-2/5 relative animate-reveal [animation-delay:0.2s]">
            <div className="relative z-10 aspect-[4/5] rounded-[80px] overflow-hidden shadow-[0_60px_120px_-20px_rgba(0,0,0,0.2)] lg:rotate-3 hover:rotate-0 transition-all duration-[1.2s] ease-[cubic-bezier(0.23,1,0.32,1)] group will-change-transform">
              <img 
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop" 
                alt="Premium Vehicle Interior" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent"></div>
              
              {/* Floating Glass UI Card */}
              <div className="absolute bottom-10 left-6 right-6 bg-white/10 backdrop-blur-3xl border border-white/20 p-8 rounded-[40px] shadow-2xl transition-all duration-700 group-hover:translate-y-[-10px]">
                <div className="flex justify-between items-center mb-5">
                  <div className="bg-[#00D665] px-4 py-1.5 rounded-full text-[11px] font-bold text-white shadow-lg shadow-emerald-500/20">Active trip</div>
                  <span className="text-white/80 text-xs font-bold font-mono">ETA: 12:04 PM</span>
                </div>
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-white/10">
                      <UserCheck className="text-emerald-500" size={28} strokeWidth={2} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div>
                    <p className="text-white font-black text-2xl leading-none tracking-tight">James Miller</p>
                    <p className="text-white/50 text-xs font-bold mt-2 flex items-center gap-2">
                      <Shield size={12} /> Verified partner
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -z-10 -bottom-10 -right-10 w-full h-full border-2 border-emerald-100 rounded-[80px] transform -rotate-3 transition-transform duration-1000 group-hover:-rotate-1"></div>
            
            <div className="absolute -z-20 -top-10 -left-10 w-40 h-40 bg-emerald-400/20 blur-[80px] rounded-full animate-pulse"></div>
            <div className="absolute -z-20 -bottom-20 -right-20 w-64 h-64 bg-emerald-300/10 blur-[100px] rounded-full [animation-delay:1s] animate-pulse"></div>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid lg:grid-cols-3 gap-0 border-t border-black/5">
          {items.map((item, idx) => (
            <div 
              key={idx} 
              className={`relative flex flex-col gap-10 group px-12 py-20 transition-all duration-700 hover:bg-emerald-50/30 overflow-hidden ${
                idx !== 0 ? 'lg:border-l lg:border-black/5' : ''
              }`}
            >
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 bg-emerald-500/5 rounded-[36px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative w-24 h-24 bg-white rounded-[40px] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 group-hover:shadow-emerald-200/40 group-hover:border-emerald-100 group-hover:-translate-y-2 transition-all duration-700">
                  <div className="p-5 bg-emerald-50/50 rounded-[32px] group-hover:bg-emerald-100/50 transition-colors">
                    {item.icon}
                  </div>
                </div>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-1">
                  <p className="text-[12px] font-bold text-emerald-500/80 mb-2">{item.subtitle}</p>
                  <h3 className="text-5xl font-black tracking-tighter leading-none text-black group-hover:text-emerald-950 transition-colors">{item.title}</h3>
                </div>
                <p className="text-black/40 text-xl leading-relaxed font-medium max-w-xs group-hover:text-black/60 transition-colors">{item.desc}</p>
              </div>
              
              <div className="absolute bottom-0 left-12 right-12 h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BudgetSection;
