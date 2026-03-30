
import React, { useEffect } from 'react';
import {
  Car,
  Navigation,
  Search,
  ArrowRight,
  Zap,
  GraduationCap,
  ShieldCheck,
  Globe,
  Clock,
  Package
} from 'lucide-react';

interface RentalPageProps {
  onBack: () => void;
  onRideClick?: () => void;
  onTaxiClick?: () => void;
  onSchoolClick?: () => void;
}

const RentalPage: React.FC<RentalPageProps> = ({ onBack, onRideClick, onTaxiClick, onSchoolClick }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const categories = [
    { id: 'rides', label: 'Ride anywhere', icon: <Car size={18} />, active: false, action: onRideClick },
    { id: 'order', label: 'Order Anytime', icon: <Navigation size={18} />, active: false, action: onTaxiClick },
    { id: 'deliver', label: 'Anything Delivered', icon: <Search size={18} />, active: true, action: () => { } },
    { id: 'pay', label: 'Just Pay', icon: <GraduationCap size={18} />, active: false, action: onSchoolClick },
  ];

  return (
    <div className="bg-white min-h-screen pt-24 animate-reveal overflow-hidden">
      <section className="relative mx-6 md:mx-12 lg:mx-20 mt-8 mb-32 rounded-[64px] overflow-hidden min-h-[700px] flex items-center bg-[#0A0A0A] group">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-[1.5s]">
          <img src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s] scale-105 group-hover:scale-100" alt="Delivery" />
        </div>

        <div className="container mx-auto px-12 md:px-24 relative z-10 grid lg:grid-cols-2 gap-20 items-center text-white">
          <div className="space-y-12">
            <div className="inline-flex items-center gap-4 px-5 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-md">
              <Package className="text-[#00D665]" size={14} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">Logi-Sys v4.0 Platinum</span>
            </div>

            <h1 className="text-white text-7xl md:text-[9vw] font-light tracking-tight leading-[0.8] mb-12">
              Anything <br />
              <span className="text-[#00D665] font-black tracking-tighter italic">Delivered.</span>
            </h1>

            <p className="text-white/40 text-xl md:text-2xl font-medium max-w-xl leading-relaxed mb-16">
              From small parcels to heavy freight. Same-day professional delivery across your city with a technical edge.
            </p>

            <button className="group relative bg-[#00D665] text-black px-16 py-8 rounded-[32px] font-black text-xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 hover:shadow-[0_40px_80px_rgba(0,214,101,0.3)] active:scale-95 flex items-center gap-4">
              <span className="relative z-10 uppercase tracking-tight">Send Item Now</span>
              <ArrowRight size={24} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </section>

      {/* Switcher */}
      <section className="mb-40">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={cat.action}
                className={`flex items-center gap-4 px-10 py-5 rounded-full font-bold text-[13px] uppercase tracking-widest transition-all duration-500 border ${cat.active
                  ? 'bg-[#00D665] text-black border-transparent shadow-[0_20px_40px_rgba(0,214,101,0.2)]'
                  : 'bg-white text-black/20 border-black/5 hover:border-[#00D665]/40 hover:text-black hover:bg-zinc-50'
                  }`}
              >
                <span className={`${cat.active ? 'text-black' : 'text-[#00D665]'}`}>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 max-w-[1700px] mx-auto px-6 md:px-12 border-t border-black/[0.03]">
        <div className="mb-32 space-y-10 group">
          <div className="flex items-center gap-5">
            <span className="w-12 h-[2px] bg-[#00D665] origin-left group-hover:scale-x-150 transition-transform duration-700"></span>
            <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-black/20">The Grid</span>
          </div>
          <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] text-black">
            Seamless <br />
            <span className="text-[#00D665] italic">Logistics.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            { title: "Same-Day Courier", icon: <Package size={32} />, img: "https://images.unsplash.com/photo-1586528116311-ad86d705d330?auto=format&fit=crop&q=80&w=800" },
            { title: "Heavy Freight", icon: <Car size={32} />, img: "https://images.unsplash.com/photo-1519003722824-194516bb3346?auto=format&fit=crop&q=80&w=800" },
            { title: "Global Shipping", icon: <Globe size={32} />, img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800" }
          ].map((f, i) => (
            <div key={i} className="group relative min-h-[550px] bg-[#050505] rounded-[64px] overflow-hidden flex flex-col justify-end p-14 text-left hover:shadow-[0_64px_128px_-32px_rgba(0,0,0,0.3)] transition-all duration-[0.8s] ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-4">
              <div className="absolute inset-0 z-0 transition-transform duration-[1.5s] ease-out group-hover:scale-110">
                <img src={f.img} className="w-full h-full object-cover opacity-30 group-hover:opacity-60 grayscale group-hover:grayscale-0 transition-all duration-[1s]" alt={f.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
              </div>

              {/* Handcrafted Rim */}
              <div className="absolute inset-0 border border-white/[0.04] rounded-[inherit] pointer-events-none z-20 group-hover:border-[#00D665]/20 transition-colors duration-700" />

              <div className="relative z-10 w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-[40px] flex items-center justify-center mb-10 text-[#00D665] shadow-sm group-hover:bg-[#00D665] group-hover:text-black transition-all duration-700 group-hover:scale-110">
                {f.icon}
              </div>

              <div className="relative z-10 space-y-4">
                <h3 className="text-4xl font-black text-white tracking-tighter leading-none">{f.title}</h3>
                <div className="w-10 h-[2px] bg-[#00D665] rounded-full group-hover:w-20 transition-all duration-700"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RentalPage;
