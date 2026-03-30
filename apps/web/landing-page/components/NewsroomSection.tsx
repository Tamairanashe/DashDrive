
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const NewsroomSection: React.FC = () => {
  const news = [
    {
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
      date: "Feb 12, 2025",
      title: "DashDrive Reports Fourth Quarter and Full Year 2024 Results with Record Growth",
    },
    {
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600",
      date: "Feb 10, 2025",
      title: "Strategic Financial Roadmap: Accelerating Payments Integration Globally",
    },
    {
      image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=600",
      date: "Feb 09, 2025",
      title: "DashDrive and Partners Announce Strategic Tech Alignment for Smart Cities",
    },
    {
      image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=600",
      date: "Feb 05, 2025",
      title: "Tap to Pay: Empowering Local Merchants to Accept Cashless Payments Instantly",
    }
  ];

  return (
    <section className="py-32 md:py-48 bg-[#030303] text-white relative overflow-hidden rounded-t-[48px] md:rounded-t-[100px] -mt-12 md:-mt-24 z-50">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00D665]/5 blur-[180px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-16 mb-32"
        >
          <div className="flex-1 space-y-10 group">
            <div className="flex items-center gap-5">
              <span className="w-12 h-[2px] bg-[#00D665] origin-left group-hover:scale-x-150 transition-transform duration-700"></span>
              <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-white/20">The Desk</span>
            </div>
            <h2 className="text-7xl md:text-9xl lg:text-[11rem] font-light tracking-tight leading-[0.8] text-white">
              Latest from <br />
              <span className="text-[#00D665] font-black tracking-tighter italic whitespace-nowrap">the Intel.</span>
            </h2>
          </div>
          <button className="hidden md:flex items-center gap-4 text-xl font-bold text-white/40 hover:text-[#00D665] transition-all duration-500 border-b border-white/5 hover:border-[#00D665] pb-2 lg:mb-8 group">
            Browse newsroom
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-500" />
          </button>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {news.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: idx * 0.1 }}
              className="group bg-white/[0.02] border border-white/[0.04] rounded-[56px] p-10 hover:bg-white/[0.04] transition-all duration-[0.8s] ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer flex flex-col relative overflow-hidden"
            >
              {/* Handcrafted Rim */}
              <div className="absolute inset-0 border border-white/[0.02] rounded-[inherit] pointer-events-none z-20 group-hover:border-[#00D665]/20 transition-colors duration-700" />

              <div className="aspect-[4/3] overflow-hidden rounded-[32px] mb-10 relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-[1.2s] ease-out opacity-60 group-hover:opacity-100"
                />
                <div className="absolute top-4 left-4">
                  <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/80">INTEL v4.0</span>
                  </div>
                </div>
              </div>

              <span className="text-[12px] font-bold text-[#00D665] uppercase tracking-widest mb-6 block">{item.date}</span>
              <h3 className="text-2xl font-bold leading-[1.25] mb-12 flex-1 text-white/70 group-hover:text-white transition-colors duration-500 tracking-tight">
                {item.title}
              </h3>

              <div className="flex items-center justify-between pt-8 border-t border-white/[0.04]">
                <div className="text-white/20 group-hover:text-[#00D665] font-bold text-[11px] uppercase tracking-widest flex items-center gap-3 transition-colors duration-500">
                  Read article
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-500" />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00D665] animate-pulse" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 md:hidden">
          <button className="w-full py-8 rounded-[32px] bg-[#00D665] text-black font-black text-xl hover:scale-[0.98] transition-all">
            SEE ALL INTEL
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsroomSection;
