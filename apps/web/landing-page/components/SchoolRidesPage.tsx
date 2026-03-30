
import React, { useEffect } from 'react';
import {
  Car,
  Navigation,
  Search,
  ArrowRight,
  Zap,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Wallet,
  CreditCard,
  Handshake
} from 'lucide-react';

interface SchoolRidesPageProps {
  onBack: () => void;
  onRideClick?: () => void;
  onTaxiClick?: () => void;
  onRentalClick?: () => void;
}

const SchoolRidesPage: React.FC<SchoolRidesPageProps> = ({ onBack, onRideClick, onTaxiClick, onRentalClick }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const categories = [
    { id: 'rides', label: 'Ride anywhere', icon: <Car size={18} />, active: false, action: onRideClick },
    { id: 'order', label: 'Order Anytime', icon: <Navigation size={18} />, active: false, action: onTaxiClick },
    { id: 'deliver', label: 'Anything Delivered', icon: <Search size={18} />, active: false, action: onRentalClick },
    { id: 'pay', label: 'Just Pay', icon: <GraduationCap size={18} />, active: true, action: () => { } },
  ];

  return (
    <div className="bg-white min-h-screen pt-24 animate-reveal">
      <section className="relative mx-6 md:mx-12 lg:mx-20 mt-8 mb-24 rounded-[64px] overflow-hidden min-h-[600px] flex items-center bg-[#003B21]">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover" alt="Payments" />
        </div>

        <div className="container mx-auto px-12 md:px-20 relative z-10 grid lg:grid-cols-2 gap-12 items-center text-white">
          <div className="space-y-10">
            <h1 className="text-white text-6xl md:text-[8vw] font-black tracking-tighter leading-[0.85]">
              Just <br />
              <span className="text-[#00D665]">Pay.</span>
            </h1>
            <p className="text-white/80 text-xl md:text-2xl font-medium max-w-xl leading-relaxed">
              Transparent payments, direct negotiation, and secure digital wallets. The fintech heart of mobility.
            </p>
            <button className="bg-[#00D665] text-black px-12 py-6 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl flex items-center gap-3">
              Open Wallet <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Switcher */}
      <section className="mb-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={cat.action}
                className={`flex items-center gap-3 px-8 py-4 rounded-full font-black text-sm transition-all border ${cat.active
                    ? 'bg-[#00D665] text-black border-transparent shadow-xl'
                    : 'bg-zinc-50 text-zinc-400 border-transparent hover:bg-zinc-100'
                  }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 max-w-[1400px] mx-auto px-6 text-center">
        <h2 className="text-5xl font-black tracking-tighter mb-20">Financial Freedom.</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Direct Hailing", desc: "No middleman price cuts.", icon: <Handshake size={32} />, img: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=800" },
            { title: "Secure Wallet", desc: "Safe digital transactions.", icon: <Wallet size={32} />, img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800" },
            { title: "Easy Billing", desc: "Corporate and personal accounts.", icon: <CreditCard size={32} />, img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800" }
          ].map((f, i) => (
            <div key={i} className="group relative min-h-[500px] bg-zinc-900 rounded-[56px] overflow-hidden flex flex-col justify-end p-14 text-left hover:shadow-2xl transition-all">
              <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110">
                <img src={f.img} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 grayscale group-hover:grayscale-0 transition-all" alt={f.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              </div>
              <div className="relative z-10 w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-8 text-[#00D665] shadow-sm group-hover:scale-110 group-hover:bg-[#00D665] group-hover:text-black transition-all">
                {f.icon}
              </div>
              <h3 className="relative z-10 text-3xl font-black text-white mb-4 tracking-tighter">{f.title}</h3>
              <p className="relative z-10 text-white/60 font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SchoolRidesPage;
