
import React, { useEffect, useState } from 'react';
import {
  Crown,
  Zap,
  Car,
  Utensils,
  ShoppingBag,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Globe,
  Plus,
  ChevronDown,
  Sparkles,
  Bike,
  Heart
} from 'lucide-react';

interface DashDrivePlusProps {
  onBack: () => void;
}

const DashDrivePlus: React.FC<DashDrivePlusProps> = ({ onBack }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const coreBenefits = [
    {
      title: "Infinite Express",
      subtitle: "$0 Delivery on all Food & Grocery",
      desc: "Save an average of $3.50 on every order. No minimums on DashDrive Instant.",
      image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800",
      color: "bg-[#00D665]",
      textColor: "text-black"
    },
    {
      title: "Elite Rebates",
      subtitle: "10% Credit Back on 10 Rides",
      desc: "Every trip earns you capital. Credits applied instantly to your DashDrive Wallet.",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
      color: "bg-zinc-950",
      textColor: "text-white"
    },
    {
      title: "Social Dining",
      subtitle: "Buy 1 Get 1 at Elite Spots",
      desc: "Unlock premium brunches and fine dining deals only available to Plus members.",
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800",
      color: "bg-[#EBFFF5]",
      textColor: "text-zinc-900"
    }
  ];

  return (
    <div className="bg-[#FBFBFB] min-h-screen pt-32 animate-reveal overflow-hidden rounded-t-[48px] md:rounded-t-[100px] -mt-12 md:-mt-24 relative z-20">
      {/* Hero: The Elite Upgrade */}
      <section className="max-w-[1700px] mx-auto px-6 md:px-12 mb-40">
        <div className="relative rounded-[30px_100px_30px_100px] overflow-hidden min-h-[850px] flex items-center bg-[#050505] group">
          {/* Grain & Depth Layers */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

          <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-[2s]">
            <img
              src="https://images.unsplash.com/photo-1512428559083-a400a3b8445e?auto=format&fit=crop&q=80&w=2400"
              className="w-full h-full object-cover grayscale scale-105 group-hover:scale-100 transition-all duration-[3s] ease-out"
              alt="Elite Lifestyle"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
          </div>

          <div className="container mx-auto px-12 md:px-24 relative z-20">
            <div className="max-w-4xl space-y-16">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#00D665] rounded-3xl flex items-center justify-center text-black shadow-[0_20px_40px_rgba(0,214,101,0.3)]">
                  <Crown size={32} fill="currentColor" />
                </div>
                <div className="space-y-1">
                  <span className="text-[12px] font-black uppercase tracking-[0.5em] text-white">Platinum Membership</span>
                  <div className="h-[2px] w-full bg-[#00D665]/40" />
                </div>
              </div>

              <h1 className="text-white text-7xl md:text-[10vw] font-light tracking-tight leading-[0.8]">
                Upgrade your <br /> <span className="text-[#00D665] font-black tracking-tighter italic uppercase">standard.</span>
              </h1>

              <p className="text-zinc-400 text-2xl md:text-3xl font-medium max-w-2xl leading-relaxed">
                Unlock peer-to-peer verified savings across mobility and commerce. Engineered for those who move with technical purpose.
              </p>

              <div className="flex flex-wrap gap-10 items-center">
                <button className="group relative bg-[#00D665] text-black px-20 py-10 rounded-full font-black text-2xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 hover:shadow-[0_40px_80px_rgba(0,214,101,0.3)] active:scale-95">
                  <span className="relative z-10">JOIN FOR $19 / MO</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
                <div className="flex flex-col border-l border-white/10 pl-10 space-y-2">
                  <span className="text-white font-black text-2xl tracking-tighter">Save $100+ <span className="text-[#00D665] italic">Direct.</span></span>
                  <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Protocol return rate</span>
                </div>
              </div>
            </div>
          </div>

          {/* High-End Mobile Preview */}
          <div className="hidden xl:block absolute right-32 bottom-[-100px] w-[380px] h-[760px] bg-[#0A0A0A] rounded-[72px] shadow-[0_128px_256px_-64px_rgba(0,0,0,1)] border-[1px] border-white/10 p-4 transition-transform duration-[2s] group-hover:-translate-y-10 group-hover:rotate-1">
            <div className="w-full h-full bg-[#050505] rounded-[60px] border border-white/5 overflow-hidden p-10 space-y-8">
              <div className="flex justify-between items-center opacity-40">
                <div className="w-12 h-1 bg-white rounded-full"></div>
                <div className="w-4 h-4 rounded-full border border-white/20"></div>
              </div>
              <div className="bg-[#00D665]/10 border border-[#00D665]/20 p-10 rounded-[15px_48px_15px_48px] space-y-6 group/preview relative overflow-hidden">
                <div className="absolute inset-0 bg-[#00D665]/5 blur-3xl rounded-full" />
                <div className="relative z-10 w-12 h-12 bg-[#00D665] rounded-2xl flex items-center justify-center text-black shadow-2xl">
                  <Crown size={24} fill="currentColor" />
                </div>
                <h4 className="relative z-10 font-black text-3xl text-white tracking-tighter leading-none">ELITE <br /> MEMBER</h4>
                <div className="relative z-10 h-[1px] w-full bg-white/10" />
                <p className="relative z-10 text-[10px] font-black text-[#00D665] uppercase tracking-widest">Savings: $1,245.00</p>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-white/[0.02] rounded-3xl border border-white/5">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#00D665]"><Sparkles size={16} /></div>
                    <div className="h-2 w-32 bg-white/10 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Breakdown */}
      <section className="max-w-[1700px] mx-auto px-6 md:px-12 mb-48">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {coreBenefits.map((benefit, i) => (
            <div key={i} className={`group relative p-14 rounded-[30px_80px_30px_80px] min-h-[650px] flex flex-col justify-end overflow-hidden transition-all duration-[0.8s] ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-4 hover:shadow-[0_64px_128px_-32px_rgba(0,0,0,0.15)] ${benefit.color} ${benefit.textColor}`}>
              <div className="absolute inset-0 border border-black/[0.02] group-hover:border-[#00D665]/20 rounded-[inherit] pointer-events-none z-20 transition-colors duration-700" />

              <div className="absolute inset-0 z-0 pointer-events-none opacity-20 transition-opacity duration-700 group-hover:opacity-40">
                <img src={benefit.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-transform duration-[3s] ease-out" alt={benefit.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>

              <div className="relative z-10 space-y-10">
                <h3 className="text-5xl font-black tracking-tighter leading-[0.9]">{benefit.title}</h3>
                <div className="space-y-4">
                  <p className="font-black text-sm uppercase tracking-[0.3em] opacity-40">{benefit.subtitle}</p>
                  <p className="text-xl font-medium opacity-80 leading-relaxed max-w-[300px]">{benefit.desc}</p>
                </div>
                <button className={`w-20 h-20 rounded-full flex items-center justify-center border ${benefit.textColor === 'text-white' ? 'border-white/20 hover:bg-white hover:text-black' : 'border-black/10 hover:bg-black hover:text-white'} transition-all duration-500 group-hover:scale-110`}>
                  <ArrowRight size={32} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The "Plus" Perks Grid */}
      <section className="py-40 bg-zinc-950 rounded-[30px_100px_30px_100px] mx-6 md:mx-12 mb-48 relative overflow-hidden group">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="container mx-auto px-12 max-w-[1500px] relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-16 mb-32">
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <span className="w-12 h-[2px] bg-[#00D665]"></span>
                <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-[#00D665]">The Ecosystem</span>
              </div>
              <h2 className="text-white text-6xl md:text-8xl font-black tracking-tighter leading-[0.95]">More to <br /><span className="text-[#00D665] italic uppercase tracking-tighter">Elite.</span></h2>
            </div>
            <p className="text-white/20 text-2xl font-medium max-w-md leading-relaxed mb-4">A unified protocol of savings spanning across every technical layer of our city grid.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { icon: <Bike size={32} />, title: "30% off Mobility", desc: "Infinite city cycles verified." },
              { icon: <Globe size={32} />, title: "Zero Bridge", desc: "Eliminate remittance fees." },
              { icon: <Zap size={32} />, title: "Home Grid", desc: "10% off human cleaning." },
              { icon: <ShieldCheck size={32} />, title: "Red Protocol", desc: "Priority 30s response." },
            ].map((perk, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 p-12 rounded-[20px_56px_20px_56px] text-left space-y-8 hover:bg-white/[0.08] hover:border-[#00D665]/40 transition-all duration-[0.8s] ease-[cubic-bezier(0.23,1,0.32,1)] group/perk">
                <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center text-[#00D665] border border-white/5 group-hover/perk:bg-[#00D665] group-hover/perk:text-black transition-all duration-700">
                  {perk.icon}
                </div>
                <div className="space-y-3">
                  <h4 className="text-3xl font-black text-white tracking-tighter leading-none">{perk.title}</h4>
                  <p className="text-white/20 font-medium text-lg group-hover/perk:text-white/40 transition-colors">{perk.desc}</p>
                </div>
                <div className="h-[1px] w-8 bg-white/10 group-hover/perk:w-full transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Join */}
      <section className="max-w-[1700px] mx-auto px-6 md:px-12 mb-48">
        <div className="mb-32 space-y-10 group text-center">
          <div className="flex items-center justify-center gap-5">
            <span className="w-12 h-[2px] bg-[#00D665] origin-right group-hover:scale-x-150 transition-transform duration-700"></span>
            <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-black/20">The Onboarding</span>
          </div>
          <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] text-black italic">
            Three steps <br />
            <span className="text-[#00D665] not-italic">to Elite.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            { step: "01", title: "Select Elite", desc: "Enter the 'Titan' portal in your primary DashDrive terminal." },
            { step: "02", title: "Authorize", desc: "Single-handshake verification with your secure wallet." },
            { step: "03", title: "Access", desc: "Immediate execution of all savings and priority perks." },
          ].map((s, i) => (
            <div key={i} className="relative p-14 bg-white rounded-[20px_64px_20px_64px] border border-black/[0.03] shadow-sm overflow-hidden group hover:border-[#00D665]/40 transition-all duration-700">
              <span className="absolute top-0 right-[-20%] text-[15rem] font-black text-black/[0.02] -translate-y-[20%] group-hover:text-[#00D665]/5 transition-colors duration-1000">{s.step}</span>
              <div className="relative z-10 space-y-10">
                <div className="w-16 h-16 bg-black text-[#00D665] rounded-3xl flex items-center justify-center font-black text-3xl shadow-2xl group-hover:scale-110 transition-transform">{s.step}</div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-black tracking-tighter leading-none">{s.title}</h3>
                  <p className="text-xl text-zinc-400 font-medium leading-relaxed group-hover:text-black/60 transition-colors">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-40 bg-[#FBFBFB] border-y border-black/[0.03] mx-6 md:mx-12 mb-48 rounded-[30px_100px_30px_100px] overflow-hidden relative">
        <div className="max-w-[1200px] mx-auto px-12">
          <div className="mb-24 space-y-10 group text-center">
            <div className="flex items-center justify-center gap-5">
              <span className="w-12 h-[2px] bg-[#00D665]"></span>
              <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-black/20">System Protocol</span>
            </div>
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] text-black">
              Titan <br />
              <span className="text-[#00D665] italic">Questions.</span>
            </h2>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {[
              { q: "What is DashDrive Plus?", a: "DashDrive Plus is our elite membership that consolidates all technical savings across our mesh—offering zero-fee delivery, ride rebates, and exclusive dining protocols for one flat monthly value." },
              { q: "Can I cancel anytime?", a: "Affirmative. We offer total autonomy. Cancel with one handshake in the app and retain permissions until the end of your protocol cycle." },
              { q: "Do the ride rebates expire?", a: "Elite credits remain in the Dash-Vault for 12 months, ready for immediate execution on any service layer." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-[15px_48px_15px_48px] overflow-hidden border border-black/[0.03] hover:border-[#00D665]/40 transition-all duration-[0.8s] ease-[cubic-bezier(0.23,1,0.32,1)]">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-12 flex items-center justify-between text-left group"
                >
                  <h4 className="text-3xl font-black tracking-tight group-hover:text-[#00D665] transition-colors">{item.q}</h4>
                  <div className={`w-12 h-12 rounded-full border border-black/5 flex items-center justify-center transition-all ${openFaq === idx ? 'bg-[#00D665] text-black rotate-180 border-transparent' : 'text-black/20 group-hover:border-black/20'}`}>
                    <ChevronDown size={24} />
                  </div>
                </button>
                {openFaq === idx && (
                  <div className="px-12 pb-12 animate-reveal">
                    <p className="text-xl text-zinc-400 font-medium leading-relaxed pt-10 border-t border-black/5">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-48 text-center bg-white relative overflow-hidden group">
        <h2 className="relative z-10 text-8xl md:text-[14rem] font-black tracking-tighter mb-24 leading-[0.8] text-black italic uppercase">
          Join the <br /> <span className="text-[#00D665] not-italic">Standard.</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-10 relative z-10">
          <button className="bg-black text-white px-24 py-10 rounded-full font-black text-3xl hover:bg-[#00D665] hover:text-black transition-all duration-700 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.3)]">ACTIVATE ELITE</button>
          <button onClick={onBack} className="bg-zinc-50 text-black/20 px-16 py-10 rounded-full font-black text-2xl hover:bg-zinc-100 hover:text-black transition-all">Defer membership</button>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-2 bg-[#00D665] scale-x-0 group-hover:scale-x-100 transition-transform duration-[1.5s] origin-center opacity-40"></div>
      </section>
    </div>
  );
};

export default DashDrivePlus;
