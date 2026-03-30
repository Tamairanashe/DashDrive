
import React, { useEffect } from 'react';
import {
  Car,
  Navigation,
  Search,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  GraduationCap
} from 'lucide-react';

interface RidePageProps {
  onBack: () => void;
  onTaxiClick?: () => void;
  onRentalClick?: () => void;
  onSchoolClick?: () => void;
}

const RidePage: React.FC<RidePageProps> = ({ onBack, onTaxiClick, onRentalClick, onSchoolClick }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const categories = [
    { id: 'rides', label: 'Ride anywhere', icon: <Car size={18} />, active: true, action: () => { } },
    { id: 'order', label: 'Order Anytime', icon: <Navigation size={18} />, active: false, action: onTaxiClick },
    { id: 'deliver', label: 'Anything Delivered', icon: <Search size={18} />, active: false, action: onRentalClick },
    { id: 'pay', label: 'Just Pay', icon: <GraduationCap size={18} />, active: false, action: onSchoolClick },
  ];

  return (
    <div className="bg-white min-h-screen pt-24 animate-reveal overflow-hidden rounded-t-[48px] md:rounded-t-[100px] -mt-12 md:-mt-24 relative z-20">
      <section className="relative mx-6 md:mx-12 lg:mx-20 mt-8 mb-32 rounded-[20px_64px_20px_64px] md:rounded-[30px_100px_30px_100px] overflow-hidden min-h-[700px] flex items-center bg-[#050505] group">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-50 transition-opacity duration-[1.5s] ease-out">
          <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-[2s] ease-out" alt="Ride" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
        </div>

        <div className="container mx-auto px-12 md:px-24 relative z-10 grid lg:grid-cols-2 gap-20 items-center text-white">
          <div className="space-y-12">

            <h1 className="text-white text-7xl md:text-[9vw] font-light tracking-tight leading-[0.8] mb-12">
              Ride <br />
              <span className="text-[#00D665] font-black tracking-tighter italic">anywhere.</span>
            </h1>

            <p className="text-white/40 text-xl md:text-2xl font-medium max-w-xl leading-relaxed mb-16">
              Professional ride-hailing with a peer-to-peer approach. Connect with verified drivers instantly for any trip style.
            </p>

            <button className="group relative bg-[#00D665] text-black px-16 py-8 rounded-[12px_32px_12px_32px] font-black text-xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 hover:shadow-[0_40px_80px_rgba(0,214,101,0.3)] active:scale-95 flex items-center gap-4">
              <span className="relative z-10 uppercase tracking-tight">Request a Ride</span>
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
        <div className="flex flex-col lg:flex-row gap-24 items-start mb-24">
          <div className="lg:w-1/3 space-y-10">
            <div className="flex items-center gap-5">
              <span className="w-12 h-[2px] bg-[#00D665]"></span>
              <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-black/20">The Fleet</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">Your Trip. <br /><span className="text-[#00D665] italic">Your Price.</span></h2>
            <p className="text-2xl text-black/40 font-medium leading-relaxed">Negotiate with professional drivers and arrive on your terms.</p>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[
              { name: 'Comfort', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800' },
              { name: 'Executive', img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800' },
              { name: 'Max', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800' }
            ].map((service, i) => (
              <div key={i} className="group relative bg-[#050505] rounded-[20px_56px_20px_56px] overflow-hidden min-h-[500px] flex flex-col justify-end p-12 cursor-pointer transition-all duration-[0.8s] ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_64px_128px_-32px_rgba(0,0,0,0.3)] hover:-translate-y-4">
                {/* Handcrafted Rim */}
                <div className="absolute inset-0 border border-white/[0.04] rounded-[inherit] pointer-events-none z-20 group-hover:border-[#00D665]/20 transition-colors duration-700" />

                <div className="absolute inset-0 z-0 transition-transform duration-[1.5s] ease-out group-hover:scale-110">
                  <img src={service.img} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 grayscale group-hover:grayscale-0 transition-all duration-[1s]" alt={service.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
                </div>

                <div className="relative z-10 space-y-4">
                  <h4 className="text-4xl font-black tracking-tight text-white">{service.name}</h4>
                  <div className="w-12 h-[2px] bg-[#00D665] rounded-full group-hover:w-24 transition-all duration-700"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RidePage;
