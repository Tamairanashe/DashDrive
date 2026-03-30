
import React from 'react';
import { ChevronDown, Globe, Navigation } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-40 pb-16 border-t border-black/[0.03] overflow-hidden relative">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-16 mb-40">
          <div className="col-span-2 space-y-12">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-14 h-14 bg-[#00D665] rounded-2xl flex items-center justify-center text-black shadow-[0_20px_40px_rgba(0,214,101,0.2)] group-hover:scale-110 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
                <Navigation size={24} fill="currentColor" />
              </div>
              <span className="font-black text-4xl tracking-tighter uppercase italic">DashDrive</span>
            </div>
            <p className="text-black/30 text-xl font-medium leading-relaxed max-w-xs">
              Direct-to-user mobility systems.
              Built for urban efficiency, engineered for transparency.
            </p>
          </div>

          {[
            {
              title: "Services",
              links: ["Everyday rides", "Intercity", "Courier", "Freight", "Corporate"]
            },
            {
              title: "Driver",
              links: ["Drive with us", "Driver portal", "Safety guides", "Success stories"]
            },
            {
              title: "Company",
              links: ["About us", "Contact", "Press", "Careers"]
            },
            {
              title: "Legal",
              links: ["Privacy policy", "Terms of use", "Licenses"]
            }
          ].map((col, i) => (
            <div key={i} className="space-y-8">
              <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.3em]">{col.title}</h4>
              <div className="space-y-5 flex flex-col">
                {col.links.map((link, j) => (
                  <a key={j} href="#" className="text-[15px] font-semibold text-black/60 hover:text-[#00D665] transition-all duration-500 hover:translate-x-1 inline-block">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-16 pt-16 border-t border-black/[0.04]">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-12">
            <div className="group relative">
              <div className="flex items-center gap-4 px-8 py-4 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all duration-700 cursor-pointer group">
                <Globe size={18} className="text-black/20 group-hover:text-[#00D665] transition-colors" />
                <span className="text-sm font-bold uppercase tracking-widest">Global / EN</span>
                <ChevronDown size={14} className="opacity-40 group-hover:rotate-180 transition-transform duration-500" />
              </div>
            </div>
            <p className="text-[11px] font-bold text-black/20 uppercase tracking-widest leading-loose max-w-md">
              © 2025 DashDrive Mobility Systems. <br />
              All trip offers are subject to peer-to-peer verification.
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-10">
            <div className="flex gap-12 text-sm font-bold text-black/30">
              {["Instagram", "X (Twitter)", "LinkedIn", "Facebook"].map((s, i) => (
                <a key={i} href="#" className="hover:text-black transition-colors duration-500 relative py-2 block group">
                  {s}
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#00D665] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Watermark */}
      <div className="absolute bottom-[-10%] right-[-5%] text-[50vh] font-black text-black/[0.02] italic select-none pointer-events-none tracking-tighter">
        DASH
      </div>
    </footer>
  );
};

export default Footer;
