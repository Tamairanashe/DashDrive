
import React from 'react';
import { BadgeDollarSign, Users, Scale, ArrowRight, Handshake } from 'lucide-react';
import { motion } from 'framer-motion';

const Features: React.FC = () => {
  const steps = [
    {
      icon: <BadgeDollarSign className="w-8 h-8 text-black" strokeWidth={1.5} />,
      title: "Set your price",
      label: "Step 01",
      desc: "You request a service and set your own price. No hidden algorithms or automated surges—just a fair offer from you to the community."
    },
    {
      icon: <Handshake className="w-8 h-8 text-black" strokeWidth={1.5} />,
      title: "Get offers",
      label: "Step 02",
      desc: "Service providers see your request and can either accept, reject, or send a counteroffer. You keep total control over the negotiation."
    },
    {
      icon: <Users className="w-8 h-8 text-black" strokeWidth={1.5} />,
      title: "Choose & Pay",
      label: "Step 03",
      desc: "Select your preferred driver and pay them directly. By cutting out the middleman's price manipulation, we keep costs lower for everyone."
    }
  ];

  return (
    <section className="py-24 md:py-48 bg-[#050505] text-white overflow-hidden relative rounded-t-[48px] md:rounded-t-[100px] -mt-8 md:-mt-16 z-30">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00D665]/10 blur-[160px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00D665]/5 blur-[140px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 max-w-[1700px] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-32 gap-16"
        >
          <div className="flex-1 space-y-10">
            <div className="flex items-center gap-5">
              <span className="w-12 h-[2px] bg-[#00D665]"></span>
              <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-white/20">The Method</span>
            </div>
            <h2 className="text-7xl md:text-9xl lg:text-[11rem] font-light tracking-tight leading-[0.8] text-white">
              Freedom from <br />
              <span className="text-[#00D665] font-black tracking-tighter italic">Algorithms.</span>
            </h2>
          </div>
          <div className="max-w-md lg:mb-6">
            <p className="text-white/40 text-xl md:text-2xl font-medium leading-relaxed mb-8">
              We believe in fair offers and human-to-human agreements. No surge pricing, no automated bias. Just transparency.
            </p>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
              <Scale className="text-[#00D665]" size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Fairness Protocol v2.4</span>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: i * 0.15 }}
              className="group relative bg-white/[0.02] border border-white/[0.06] p-12 md:p-16 rounded-[48px] overflow-hidden transition-all duration-[0.8s] ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white/[0.04] hover:-translate-y-3"
            >
              {/* Handcrafted Rim */}
              <div className="absolute inset-0 border border-white/[0.04] rounded-[inherit] pointer-events-none z-20 group-hover:border-[#00D665]/20 transition-colors duration-700" />

              <div className="flex justify-between items-start mb-16">
                <div className="relative">
                  <div className="w-20 h-20 bg-[#00D665] rounded-[24px] flex items-center justify-center shadow-[0_24px_48px_rgba(0,214,101,0.2)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
                    {step.icon}
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-[3px] border-[#00D665] animate-ping" />
                </div>
                <span className="text-white/5 font-black text-5xl tracking-tighter group-hover:text-[#00D665]/10 transition-colors duration-700">{step.label}</span>
              </div>

              <h3 className="text-3xl font-black tracking-tight mb-6 group-hover:text-[#00D665] transition-colors duration-500">{step.title}</h3>
              <p className="text-white/30 text-lg md:text-xl leading-relaxed font-medium group-hover:text-white/70 transition-colors duration-700">{step.desc}</p>

              {/* Engineering Detail Overlay */}
              <div className="absolute bottom-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                <div className="text-[60px] font-black italic">DASH</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 flex flex-col md:flex-row items-center justify-center gap-16">
          <button className="group relative bg-[#00D665] text-black px-16 py-8 rounded-full font-black text-xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 hover:shadow-[0_40px_80px_rgba(0,214,101,0.3)] active:scale-95 flex items-center gap-4">
            <span className="relative z-10">OPEN FAIR ACCESS</span>
            <ArrowRight size={24} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;
