
import React, { useEffect } from 'react';
import {
  Car,
  Utensils,
  Package,
  Store,
  Wallet,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  TrendingUp,
  Users,
  CheckCircle2
} from 'lucide-react';

interface PartnersPageProps {
  onBack: () => void;
}

const PartnersPage: React.FC<PartnersPageProps> = ({ onBack }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const partnerTypes = [
    {
      id: 'driver',
      title: "DashDrive Driver",
      subtitle: "The Mobility Partner",
      desc: "Revolutionizing ride-hailing with fair-fare negotiation. Set your own prices and build your local business.",
      icon: <Car size={32} />,
      color: "bg-[#00D665]",
      benefits: ["Keep 90% of your earnings", "Instant daily payouts", "Set your own schedule"]
    },
    {
      id: 'food-delivery',
      title: "Food Delivery",
      subtitle: "The Culinary Courier",
      desc: "Connect local kitchens with hungry neighbors. Earn consistently with our high-demand dining network.",
      icon: <Utensils size={32} />,
      color: "bg-[#5B6BF3]",
      benefits: ["High peak-hour bonuses", "Fuel & insurance perks", "Flexible city zones"]
    },
    {
      id: 'express-delivery',
      title: "Express Delivery",
      subtitle: "The Logistics Expert",
      desc: "For the professional courier. Deliver packages and essential goods across the city with optimized routes.",
      icon: <Package size={32} />,
      color: "bg-zinc-900",
      benefits: ["Bulk order assignments", "Dedicated support rail", "Enterprise route AI"]
    },
    {
      id: 'merchant',
      title: "Food & Shop Merchant",
      subtitle: "The Growth Partner",
      desc: "Scale your store or restaurant. Reach millions of DashDrive users and manage your orders with ease.",
      icon: <Store size={32} />,
      color: "bg-[#F8F9FA]",
      textColor: "text-black",
      benefits: ["0% commission for 30 days", "Smart inventory insights", "In-app marketing tools"]
    },
    {
      id: 'pay-merchant',
      title: "Pay Merchant",
      subtitle: "The Financial Partner",
      desc: "Integrate with our fintech ecosystem. Accept DashDrive Pay and offer your customers a modern way to spend.",
      icon: <Wallet size={32} />,
      color: "bg-[#003B21]",
      benefits: ["Direct bank settlement", "Lowest MDR in the region", "Fraud-free protection"]
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-32 animate-reveal overflow-hidden rounded-t-[48px] md:rounded-t-[100px] -mt-12 md:-mt-24 relative z-20">
      {/* Hero Section */}
      <section className="max-w-[1700px] mx-auto px-6 md:px-12 mb-40">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16">
          <div className="space-y-10 flex-1">
            <div className="flex items-center gap-5">
              <span className="w-12 h-[2px] bg-[#00D665]"></span>
              <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-black/20">Partnership Program</span>
            </div>
            <h1 className="text-black text-7xl md:text-[10vw] font-light tracking-tight leading-[0.8]">
              Empower your <br /> <span className="text-[#00D665] font-black tracking-tighter italic">ambition.</span>
            </h1>
          </div>
          <div className="max-w-xl pt-10 border-t border-black/5 lg:border-none">
            <p className="text-2xl md:text-3xl text-zinc-400 font-medium leading-relaxed mb-12">
              Join a global network of over <span className="text-black font-bold">2.5M</span> elite partners setting the technical standard for mobility.
            </p>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-black/20">
              <div className="w-2 h-2 rounded-full bg-[#00D665] animate-pulse" />
              Live Protocol v4.0
            </div>
          </div>
        </div>
      </section>

      {/* Main Partners Grid */}
      <section className="max-w-[1700px] mx-auto px-6 md:px-12 mb-48">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {partnerTypes.map((partner) => (
            <div
              key={partner.id}
              className={`group relative p-12 rounded-[20px_64px_20px_64px] min-h-[550px] flex flex-col justify-between transition-all duration-[0.8s] ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_64px_128px_-32px_rgba(0,0,0,0.1)] hover:-translate-y-4 border border-black/[0.03] ${partner.color} ${partner.textColor || 'text-white'} overflow-hidden`}
            >
              {/* Handcrafted Rim */}
              <div className="absolute inset-0 border border-white/[0.04] rounded-[inherit] pointer-events-none z-20 group-hover:border-[#00D665]/20 transition-colors duration-700" />

              <div className="space-y-10 relative z-10">
                <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center shadow-xl ${partner.id === 'merchant' ? 'bg-zinc-100 text-[#00D665]' : 'bg-white/10 text-[#00D665] backdrop-blur-md'}`}>
                  {partner.icon}
                </div>
                <div>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-none">{partner.title}</h2>
                  <p className={`text-xl font-medium opacity-60 leading-relaxed`}>{partner.desc}</p>
                </div>
              </div>

              <div className="space-y-6 pt-12 relative z-10 border-t border-black/5 group-hover:border-white/10 transition-colors">
                <div className="grid grid-cols-1 gap-4">
                  {partner.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${partner.id === 'merchant' ? 'bg-[#00D665] text-black' : 'bg-white/20 text-white'}`}>
                        <CheckCircle2 size={12} />
                      </div>
                      <span className="text-sm font-bold opacity-80">{benefit}</span>
                    </div>
                  ))}
                </div>
                <button className={`mt-8 w-full py-8 rounded-[32px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-500 ${partner.id === 'merchant' ? 'bg-black text-[#00D665] hover:bg-[#00D665] hover:text-black' : 'bg-white text-black hover:scale-[1.02] active:scale-95'}`}>
                  EXPLORE <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Metrics */}
      <section className="bg-zinc-950 py-40 md:py-56 rounded-[30px_100px_30px_100px] mx-6 md:mx-12 mb-40 overflow-hidden relative group">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00D665]/10 blur-[200px] rounded-full group-hover:bg-[#00D665]/20 transition-all duration-1000"></div>

        <div className="container mx-auto px-12 max-w-[1400px] relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-20 mb-32">
            <div className="space-y-10 flex-1">
              <div className="flex items-center gap-5">
                <span className="w-12 h-[2px] bg-[#00D665]"></span>
                <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-[#00D665]">The Advantage</span>
              </div>
              <h2 className="text-white text-6xl md:text-9xl font-black tracking-tighter leading-[0.85]">Built for <br /><span className="text-[#00D665] italic">Business.</span></h2>
            </div>
            <p className="text-white/40 text-2xl font-medium max-w-lg leading-relaxed mb-4">
              Our technical mesh is engineered to put more direct value back into the hands of those who build our city.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-12">
            {[
              { icon: <TrendingUp className="text-[#00D665]" />, label: "Growth", value: "3.5x", desc: "Average merchant growth YoY" },
              { icon: <ShieldCheck className="text-[#00D665]" />, label: "Security", value: "100%", desc: "Encrypted transaction protocol" },
              { icon: <Users className="text-[#00D665]" />, label: "Support", value: "24/7", desc: "Priority partner assistance" },
              { icon: <Zap className="text-[#00D665]" />, label: "Payouts", value: "Real-time", desc: "Access your capital instantly" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 p-12 rounded-[20px_56px_20px_56px] text-center space-y-6 group/stat hover:bg-[#00D665]/5 hover:border-[#00D665]/20 transition-all duration-700">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/5 group-hover/stat:scale-110 transition-all">
                  {stat.icon}
                </div>
                <div className="text-white text-5xl font-black tracking-tighter">{stat.value}</div>
                <div className="text-[#00D665] text-[11px] font-black uppercase tracking-[0.3em] mb-4">{stat.label}</div>
                <p className="text-white/20 text-sm font-medium leading-relaxed group-hover/stat:text-white/40 transition-colors">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-48 text-center bg-white relative overflow-hidden">
        <h2 className="text-8xl md:text-[14rem] font-black tracking-tighter mb-24 leading-[0.8] text-black italic uppercase">
          Be the <br /> <span className="text-[#00D665] not-italic">Standard.</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-10">
          <button className="bg-black text-white px-20 py-10 rounded-full font-black text-2xl hover:scale-105 hover:bg-[#00D665] hover:text-black transition-all duration-700 shadow-[0_40px_80px_rgba(0,0,0,0.15)]">Create Account</button>
          <button onClick={onBack} className="bg-zinc-50 text-black/40 px-16 py-10 rounded-full font-black text-2xl hover:bg-zinc-100 hover:text-black transition-all">Back Home</button>
        </div>
      </section>
    </div>
  );
};

export default PartnersPage;
