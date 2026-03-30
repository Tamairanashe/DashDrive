
import React from 'react';
import { MERCHANTS } from '../constants';
import { ArrowUpRight } from 'lucide-react';

const MerchantGrid: React.FC = () => {
  return (
    <section className="py-32 bg-[#F9F9FB]">
      <div className="max-w-[1500px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div>
            <h2 className="text-5xl font-black tracking-tighter mb-4">The Directory</h2>
            <p className="text-xl text-black/40 font-medium italic">Handpicked partners for the conscious shopper.</p>
          </div>
          <button className="text-lg font-bold flex items-center gap-2 group border-b-2 border-black pb-1 hover:text-black/60 hover:border-black/20 transition-all">
            Explore all stores
            <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {MERCHANTS.map((merchant) => (
            <div 
              key={merchant.id} 
              className="group bg-white rounded-[40px] p-8 border border-transparent hover:border-black/5 hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col"
            >
              <div className="aspect-square mb-8 overflow-hidden rounded-[32px] bg-gray-50 relative">
                <img 
                  src={merchant.logo} 
                  alt={merchant.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-md p-4 rounded-full shadow-lg">
                    <ArrowUpRight className="text-black w-6 h-6" />
                  </div>
                </div>
              </div>
              <div className="mt-auto">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-black/30 block mb-2">{merchant.category}</span>
                <h3 className="text-2xl font-black tracking-tight mb-2">{merchant.name}</h3>
                {merchant.offer && (
                  <span className="inline-flex items-center px-4 py-1.5 bg-[#00D665]/10 text-[#00D665] text-sm font-black rounded-full">
                    {merchant.offer}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MerchantGrid;
