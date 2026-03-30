
import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Zap,
  Plus,
  Smartphone,
  Store,
  Stethoscope,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

const DeliveryPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'instant' | 'electronics' | 'supermarkets' | 'pharmacy'>('instant');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [activeTab]);

  const subTabs = [
    { id: 'instant', label: '15-Min Delivery', icon: <Zap size={18} /> },
    { id: 'supermarkets', label: 'Grocery', icon: <Store size={18} /> },
    { id: 'pharmacy', label: 'Health', icon: <Stethoscope size={18} /> },
    { id: 'electronics', label: 'Tech', icon: <Smartphone size={18} /> },
  ];

  const HubSwitcher = () => (
    <div className="flex flex-wrap justify-center gap-3 p-2 bg-zinc-50 rounded-[48px] w-fit mx-auto border border-zinc-100 mb-20 overflow-hidden">
      {subTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`flex items-center gap-2.5 px-7 py-3.5 rounded-[32px] font-black text-[13px] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#00D665] text-black shadow-lg' : 'text-zinc-400 hover:text-black'
            }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );

  const InstantHub = () => (
    <div className="animate-reveal">
      <section className="mx-6 md:mx-12 lg:mx-20 mt-8 mb-24 rounded-[64px] overflow-hidden min-h-[600px] flex items-center bg-[#F1F3F2] relative group">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover" alt="Fresh" />
        </div>
        <div className="container mx-auto px-12 md:px-24 relative z-20">
          <div className="max-w-2xl space-y-8">
            <div className="flex items-center gap-3">
              <Zap size={40} className="text-[#00D665]" fill="#00D665" />
              <h2 className="text-4xl font-black tracking-tighter">DashDrive <span className="text-[#00D665]">Instant</span></h2>
            </div>
            <h1 className="text-zinc-900 text-6xl md:text-[9vw] font-black tracking-tighter leading-[0.8] mb-12">
              Fresh food, <br /> <span className="text-[#00D665]">fast.</span>
            </h1>
            <div className="flex items-center gap-6">
              <div className="bg-white rounded-full px-8 py-5 shadow-xl flex items-center gap-4">
                <span className="text-5xl font-black text-[#00D665]">15</span>
                <span className="text-sm font-black uppercase text-zinc-400">min delivery</span>
              </div>
              <button className="bg-[#00D665] text-black px-12 py-8 rounded-[32px] font-black text-xl hover:scale-105 transition-all">Order Now</button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 text-center mb-32">
        <h2 className="text-7xl font-black tracking-tighter mb-12">Get it now.</h2>
        <HubSwitcher />
        <p className="text-2xl text-zinc-500 font-medium max-w-3xl mx-auto">Skip the lines. Get fresh produce and household staples delivered in 15 minutes or less, at local supermarket prices.</p>
      </div>
    </div>
  );

  const PharmacyHub = () => (
    <div className="animate-reveal">
      <section className="mx-6 md:mx-12 lg:mx-20 mt-8 mb-12 rounded-[64px] overflow-hidden min-h-[500px] flex items-center bg-[#5B21B6] relative group">
        <div className="container mx-auto px-12 md:px-24 relative z-20 flex flex-col lg:flex-row items-center justify-between gap-12 py-20">
          <div className="space-y-8 max-w-xl">
            <h1 className="text-white text-6xl md:text-[7vw] font-black tracking-tighter leading-[0.85]">
              Health, <br /> <span className="text-[#00D665]">delivered.</span>
            </h1>
            <button className="bg-[#00D665] text-black px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all">Order Pharmacy</button>
          </div>
          <img src="https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=1200" className="w-full max-w-[500px] rounded-[48px]" alt="Pharmacy" />
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 text-center mt-20 mb-32">
        <h2 className="text-7xl font-black tracking-tighter mb-12">Wellness simplified.</h2>
        <HubSwitcher />
        <p className="text-2xl text-zinc-500 font-medium max-w-3xl mx-auto">Get your medicine cabinet and wellness essentials without leaving your home. Verified pharmacies at your fingertips.</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pt-24 animate-reveal overflow-hidden rounded-t-[48px] md:rounded-t-[100px] -mt-12 md:-mt-24 relative z-20">
      {activeTab === 'pharmacy' ? (
        <div className="animate-reveal">
          <section className="relative mx-6 md:mx-12 lg:mx-20 mt-8 mb-32 rounded-[20px_64px_20px_64px] md:rounded-[30px_100px_30px_100px] overflow-hidden min-h-[700px] flex items-center bg-[#312E81] group">
            {/* Dark Cinematic Backdrop */}
            <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity duration-[2s]">
              <img src="https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover grayscale" alt="Pharmacy" />
            </div>

            <div className="container mx-auto px-12 md:px-24 relative z-20 flex flex-col lg:flex-row items-center justify-between gap-24 py-20">
              <div className="space-y-12 max-w-2xl">

                <h1 className="text-white text-7xl md:text-[9vw] font-light tracking-tight leading-[0.8]">
                  Wellness, <br /> <span className="text-[#00D665] font-black tracking-tighter italic">delivered.</span>
                </h1>

                <p className="text-white/40 text-2xl font-medium max-w-lg leading-relaxed mb-12">
                  Get your medical essentials with peer-to-peer verification and rapid response.
                </p>

                <button className="group relative bg-[#00D665] text-black px-16 py-8 rounded-[32px] font-black text-xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 hover:shadow-[0_40px_80px_rgba(0,214,101,0.3)] active:scale-95 flex items-center gap-4">
                  <span className="relative z-10 uppercase tracking-tight">Access PHARMACY</span>
                </button>
              </div>
              <div className="relative w-full lg:w-1/2 rounded-[64px] overflow-hidden shadow-[0_64px_128px_-32px_rgba(0,0,0,0.5)]">
                <img src="https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" alt="Pharmacy Hub" />
              </div>
            </div>
          </section>

          <div className="max-w-[1700px] mx-auto px-6 md:px-12 text-center mb-40">
            <h2 className="text-7xl font-black tracking-tighter mb-12 text-black">Simplified.</h2>
            <HubSwitcher />
            <p className="text-2xl text-zinc-400 font-medium max-w-3xl mx-auto leading-relaxed">Every essential verified to elite safety standards by our technical logistics network.</p>
          </div>
        </div>
      ) : (
        <div className="animate-reveal">
          <section className="relative mx-6 md:mx-12 lg:mx-20 mt-8 mb-32 rounded-[20px_64px_20px_64px] md:rounded-[30px_100px_30px_100px] overflow-hidden min-h-[700px] flex items-center bg-[#F1F3F2] group">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-[2s]">
              <img src="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="Fresh" />
            </div>

            <div className="container mx-auto px-12 md:px-24 relative z-20">
              <div className="max-w-3xl space-y-12">

                <h1 className="text-zinc-900 text-7xl md:text-[9vw] font-light tracking-tight leading-[0.8] mb-12">
                  Fresh essentials, <br /> <span className="text-[#00D665] font-black tracking-tighter italic">now.</span>
                </h1>

                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="bg-white rounded-[40px] px-10 py-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex items-center gap-6 border border-black/[0.03]">
                    <span className="text-6xl font-black text-[#00D665] tracking-tighter">15</span>
                    <span className="text-[13px] font-bold uppercase tracking-[0.2em] text-black/30 leading-tight">min <br /> delivery</span>
                  </div>
                  <button className="w-full md:w-auto group relative bg-[#00D665] text-black px-16 py-8 rounded-[32px] font-black text-xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 active:scale-95 flex items-center justify-center gap-4">
                    <span className="relative z-10">START ORDER</span>
                    <ArrowRight size={24} className="relative z-10" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="max-w-[1700px] mx-auto px-6 md:px-12 text-center mb-40">
            <h2 className="text-7xl font-black tracking-tighter mb-12">Get it now.</h2>
            <HubSwitcher />
            <p className="text-2xl text-zinc-400 font-medium max-w-3xl mx-auto italic leading-relaxed">Skip the line. Engineering-grade delivery for your daily staples.</p>
          </div>
        </div>
      )}

      <section className="py-40 bg-[#0A0A0A] rounded-[30px_80px_30px_80px] mx-6 md:mx-12 lg:mx-20 mb-40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        <div className="max-w-[1200px] mx-auto px-12 relative z-10">
          <div className="mb-24 space-y-10 group text-center">
            <div className="flex items-center justify-center gap-5">
              <span className="w-12 h-[2px] bg-[#00D665]"></span>
              <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-white/20">Operational Intel</span>
            </div>
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] text-white">
              Delivery <br />
              <span className="text-[#00D665] italic">Protocol.</span>
            </h2>
          </div>

          <div className="space-y-8 max-w-4xl mx-auto">
            {[
              { q: "Is delivery truly 15 minutes?", a: "95% of Instant orders arrive within 15 minutes. Our technical mesh prioritizes your order in real-time." },
              { q: "Can I return items?", a: "Yes, simple peer-verified returns are available for most grocery staples if they don't meet our Platinum standard." }
            ].map((item, idx) => (
              <div key={idx} className="group bg-white/[0.02] border border-white/5 rounded-[48px] p-12 cursor-pointer hover:bg-white/[0.05] hover:border-[#00D665]/40 transition-all duration-[0.8s] ease-[cubic-bezier(0.23,1,0.32,1)]" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                <div className="flex justify-between items-center">
                  <h4 className="text-3xl font-black tracking-tight text-white/80 group-hover:text-white transition-colors">{item.q}</h4>
                  <div className={`w-12 h-12 rounded-full border border-white/5 flex items-center justify-center transition-all ${openFaq === idx ? 'bg-[#00D665] text-black rotate-180 border-transparent' : 'text-white/20 group-hover:border-white/20'}`}>
                    <ChevronDown size={24} />
                  </div>
                </div>
                {openFaq === idx && <p className="mt-10 text-xl text-white/40 font-medium leading-relaxed animate-reveal">{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-48 bg-[#00D665] text-black text-center rounded-[30px_80px_30px_80px] mx-6 md:mx-12 lg:mx-20 mb-32 relative group overflow-hidden">
        <h2 className="relative z-10 text-8xl md:text-[11rem] font-black tracking-tighter mb-16 leading-[0.8] uppercase italic">
          More choice. <br /> <span className="text-white not-italic">DashDrive.</span>
        </h2>
        <button onClick={onBack} className="relative z-10 bg-black text-[#00D665] px-20 py-10 rounded-full font-black text-2xl hover:scale-105 transition-all duration-700 shadow-2xl">
          BACK TO GRID
        </button>
        <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
      </section>
    </div>
  );
};

export default DeliveryPage;
