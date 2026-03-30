
import React, { useState, useEffect } from 'react';
import {
  Utensils,
  ShoppingBag,
  ArrowRight,
  Star,
  Clock,
  Plus,
  Smile,
  Store,
  Search,
  ChevronDown,
  Info,
  ArrowLeft,
  X,
  Heart,
  MoreHorizontal,
  Share2,
  ChevronRight
} from 'lucide-react';

import MerchantGrid from './MerchantGrid';

const OrderPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [view, setView] = useState<'hub' | 'directory' | 'menu'>('hub');
  const [activeTab, setActiveTab] = useState<'food' | 'dineout' | 'markets'>('food');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  const [selectedPartnerForInfo, setSelectedPartnerForInfo] = useState<any | null>(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [view, activeTab]);

  const tabs = [
    { id: 'food', label: 'Takeout', icon: <Utensils size={18} /> },
    { id: 'dineout', label: 'Reservations', icon: <Smile size={18} /> },
  ];

  const partners = [
    {
      name: 'The Wok Shop',
      logo: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400',
      banner: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1600',
      category: 'Asian Fusion',
      rating: '4.8',
      reviews: '5k+',
      deliveryFee: '$1.00',
      address: 'Central Plaza, DashDrive District',
      description: 'Modern takes on classic Asian street food. Fresh ingredients, bold spices, and lightning-fast preparation.',
      menu: [
        {
          category: 'Bestsellers',
          items: [
            { id: 1, name: 'Chilli Garlic Crunch Noodles', price: '$10.00', popularity: '98%', ratingCount: 1200, badge: 'Top Choice', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400', desc: 'Sizzling noodles tossed in our secret spicy garlic oil.' },
            { id: 2, name: 'Tofu Soya Bowl (VG)', price: '$9.00', popularity: '95%', ratingCount: 450, image: 'https://images.unsplash.com/photo-158503222665a-71d2c88275f5?auto=format&fit=crop&q=80&w=400', desc: 'Protein-packed bowl with crisp greens and silken tofu.' }
          ]
        }
      ]
    },
    { name: 'Burger Hub', logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400', category: 'Gourmet Burgers' },
    { name: 'Pizza Roma', logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400', category: 'Italian' }
  ];

  const DineOutHub = () => (
    <div className="animate-reveal">
      <section className="mx-6 md:mx-12 lg:mx-20 mt-8 mb-24 rounded-[64px] overflow-hidden min-h-[600px] flex items-center bg-[#EBFFF5] relative group">
        <div className="container mx-auto px-12 md:px-24 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-zinc-900 text-6xl md:text-[8vw] font-black tracking-tighter leading-[0.85]">
              Dine better, <br /> <span className="text-[#00D665]">pay less.</span>
            </h1>
            <p className="text-2xl text-zinc-500 font-medium">Book tables at 1,000+ spots and save up to 50% on your total bill.</p>
            <button className="bg-[#00D665] text-black px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl flex items-center gap-4">
              Find a Table <ArrowRight size={24} />
            </button>
          </div>
          <div className="hidden lg:block aspect-video rounded-[48px] overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Dining" />
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 text-center mb-32">
        <h2 className="text-7xl font-black tracking-tighter mb-12">Eat Out</h2>
        <HubSwitcher />
        <p className="text-2xl text-zinc-500 font-medium max-w-2xl mx-auto">Discover local gems and unlock exclusive member-only discounts at the city's finest restaurants.</p>
      </div>
    </div>
  );

  const FoodHub = () => (
    <div className="animate-reveal">
      <section className="mx-6 md:mx-12 lg:mx-20 mt-8 mb-24 rounded-[64px] overflow-hidden min-h-[600px] flex items-center bg-[#00D665] relative group">
        <div className="container mx-auto px-12 md:px-24 relative z-10">
          <div className="max-w-2xl space-y-8">
            <h1 className="text-white text-6xl md:text-[8vw] font-black tracking-tighter leading-[0.85]">
              Everything you crave, <br /> <span className="text-zinc-900 italic">instantly.</span>
            </h1>
            <button className="bg-zinc-900 text-[#00D665] px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl flex items-center gap-4">
              View Menus <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-[1400px] mx-auto px-6 text-center">
        <h2 className="text-7xl font-black tracking-tighter mb-12">Order Food</h2>
        <HubSwitcher />
        <p className="text-2xl text-zinc-500 font-medium leading-relaxed max-w-3xl mx-auto">
          From morning coffee to late-night snacks. Choose from thousands of local kitchens and global brands, delivered hot to your door.
        </p>
      </section>

      <section className="py-24 mx-6 md:mx-12 lg:mx-20">
        <div className="bg-[#EBFFF5] rounded-[64px] p-12 md:p-24 grid lg:grid-cols-2 gap-20 items-center overflow-hidden">
          <div className="space-y-12 relative z-10">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              Free delivery <br />
              <span className="text-[#00D665]">with Elite.</span>
            </h2>
            <p className="text-2xl text-zinc-600 font-medium max-w-lg leading-relaxed">
              Join Elite Access for $5/month and pay zero delivery fees on every single order.
            </p>
            <button className="bg-black text-white px-12 py-6 rounded-2xl font-black text-xl hover:bg-[#00D665] hover:text-black transition-all">
              Go Elite
            </button>
          </div>
          <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800" className="w-full rounded-[48px] shadow-2xl" alt="Elite Access" />
        </div>
      </section>
    </div>
  );

  const HubSwitcher = () => (
    <div className="flex justify-center gap-4 p-2 bg-zinc-50 rounded-[32px] w-fit mx-auto border border-zinc-100 mb-20">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`flex items-center gap-3 px-10 py-4 rounded-[24px] font-black text-sm transition-all ${activeTab === tab.id ? 'bg-[#00D665] text-black shadow-lg' : 'text-zinc-400 hover:text-black'}`}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-white min-h-screen pt-24 animate-reveal overflow-hidden rounded-t-[48px] md:rounded-t-[100px] -mt-12 md:-mt-24 relative z-20">
      {activeTab === 'food' ? (
        <div className="animate-reveal">
          <section className="relative mx-6 md:mx-12 lg:mx-20 mt-8 mb-32 rounded-[20px_64px_20px_64px] md:rounded-[30px_100px_30px_100px] overflow-hidden min-h-[700px] flex items-center bg-[#00D665] group">
            {/* Cinematic Background Layer */}
            <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-[1.5s]">
              <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-[2s] ease-out" alt="Food" />
            </div>

            <div className="container mx-auto px-12 md:px-24 relative z-10">
              <div className="max-w-3xl space-y-12">

                <h1 className="text-zinc-900 text-7xl md:text-[9vw] font-light tracking-tight leading-[0.8] mb-12">
                  Everything you crave, <br /><span className="text-white font-black tracking-tighter italic">instantly.</span>
                </h1>

                <button className="group relative bg-zinc-900 text-[#00D665] px-16 py-8 rounded-[32px] font-black text-xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 hover:shadow-[0_40px_80px_rgba(0,0,0,0.3)] active:scale-95 flex items-center gap-4">
                  <span className="relative z-10 uppercase tracking-tight">View Full Menus</span>
                  <ArrowRight size={24} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
              </div>
            </div>
          </section>

          <section className="py-32 max-w-[1700px] mx-auto px-6 md:px-12 text-center">
            <div className="mb-20 space-y-8">
              <div className="flex items-center justify-center gap-5">
                <span className="w-12 h-[2px] bg-[#00D665]"></span>
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-black/20">The Catalog</span>
              </div>
              <h2 className="text-7xl font-black tracking-tighter">Order Food.</h2>
            </div>
            <HubSwitcher />
            <p className="text-2xl text-zinc-500 font-medium leading-relaxed max-w-2xl mx-auto">
              Choose from thousands of curated local kitchens and global brands, delivered with technical precision.
            </p>
          </section>

          <section className="py-32 mx-6 md:mx-12 lg:mx-20">
            <div className="bg-[#EBFFF5] border border-[#00D665]/10 rounded-[30px_80px_30px_80px] p-16 md:p-32 grid lg:grid-cols-2 gap-24 items-center overflow-hidden relative group">
              <div className="space-y-12 relative z-10">
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85]">
                  Free delivery <br />
                  <span className="text-[#00D665] italic">with Elite.</span>
                </h2>
                <p className="text-2xl text-zinc-600 font-medium max-w-lg leading-relaxed">
                  Join Elite Access for a premium standard. Pay zero delivery fees and unlock exclusive merchant perks.
                </p>
                <button className="bg-black text-white px-16 py-8 rounded-[32px] font-black text-xl hover:bg-[#00D665] hover:text-black transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-2xl">
                  GO ELITE NOW
                </button>
              </div>
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800" className="w-full rounded-[64px] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.2)] grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Elite Access" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#00D665] rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity"></div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="animate-reveal">
          <section className="relative mx-6 md:mx-12 lg:mx-20 mt-8 mb-32 rounded-[64px] overflow-hidden min-h-[700px] flex items-center bg-[#EBFFF5] group">
            {/* Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="container mx-auto px-12 md:px-24 relative z-10 grid lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-12">

                <h1 className="text-zinc-900 text-7xl md:text-[9vw] font-light tracking-tight leading-[0.8] mb-12">
                  Dine better, <br /><span className="text-[#00D665] font-black tracking-tighter italic">pay less.</span>
                </h1>

                <p className="text-2xl text-zinc-500 font-medium max-w-xl leading-relaxed">Book tables at 1,000+ elite spots and save up to 50% on your total bill automatically.</p>

                <button className="group relative bg-[#00D665] text-black px-16 py-8 rounded-[32px] font-black text-xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 hover:shadow-[0_40px_80px_rgba(0,214,101,0.3)] flex items-center gap-4">
                  <span className="relative z-10 uppercase tracking-tight">Find a Table</span>
                  <ArrowRight size={24} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
                </button>
              </div>
              <div className="relative aspect-[16/10] rounded-[64px] overflow-hidden shadow-[0_64px_128px_-32px_rgba(0,0,0,0.15)] group-hover:shadow-[0_80px_160px_-40px_rgba(0,0,0,0.2)] transition-shadow duration-[1.5s]">
                <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-[2s]" alt="Dining" />
              </div>
            </div>
          </section>

          <div className="max-w-[1700px] mx-auto px-6 md:px-12 text-center mb-40">
            <h2 className="text-7xl font-black tracking-tighter mb-12">Eat Out.</h2>
            <HubSwitcher />
            <p className="text-2xl text-zinc-500 font-medium max-w-3xl mx-auto leading-relaxed">Discover local gems and unlock exclusive member-only agreements at the city's finest architectural kitchens.</p>
          </div>
        </div>
      )}

      <MerchantGrid />

      <section className="py-40 bg-[#FBFBFB] border-y border-black/[0.03] mx-6 md:mx-12 lg:mx-20 mb-40 rounded-[30px_80px_30px_80px] overflow-hidden relative">
        {/* Handcrafted Rim */}
        <div className="absolute inset-0 border border-black/[0.02] rounded-[inherit] pointer-events-none z-20" />

        <div className="max-w-[1200px] mx-auto px-12">
          <div className="mb-24 space-y-10 group text-center">
            <div className="flex items-center justify-center gap-5">
              <span className="w-12 h-[2px] bg-[#00D665]"></span>
              <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-black/20">Knowledge Base</span>
            </div>
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] text-black">
              System <br />
              <span className="text-[#00D665] italic">Protocol.</span>
            </h2>
          </div>

          <div className="space-y-8">
            {[
              { q: "Can I schedule orders?", a: "Yes, you can pre-order up to 24 hours in advance. Our predictive grid ensures arrival within a ±5 min window." },
              { q: "How do I use Elite benefits?", a: "Elite benefits are applied automatically at checkout once your human-verified subscription is active." },
              { q: "My order is wrong, what now?", a: "Contact human support via the 'Refine' button for an instant manual correction or refund." }
            ].map((item, idx) => (
              <div key={idx} className="group bg-white rounded-[48px] p-12 cursor-pointer border border-black/[0.03] hover:border-[#00D665]/40 transition-all duration-[0.8s] ease-[cubic-bezier(0.23,1,0.32,1)]" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                <div className="flex justify-between items-center">
                  <h4 className="text-3xl font-black tracking-tight group-hover:text-black transition-colors">{item.q}</h4>
                  <div className={`w-10 h-10 rounded-full border border-black/5 flex items-center justify-center transition-all duration-500 ${openFaq === idx ? 'bg-[#00D665] border-transparent text-black rotate-180' : 'group-hover:border-black/20'}`}>
                    <ChevronDown size={20} />
                  </div>
                </div>
                {openFaq === idx && <p className="mt-10 text-xl text-zinc-400 font-medium leading-relaxed animate-reveal">{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-48 bg-zinc-950 text-white text-center rounded-[30px_80px_30px_80px] mx-6 md:mx-12 lg:mx-20 mb-32 relative overflow-hidden group">
        <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#00D665] blur-[200px] rounded-full"></div>
        </div>

        <h2 className="relative z-10 text-8xl md:text-[11rem] font-black tracking-tighter mb-20 leading-[0.8] italic uppercase">
          Eat local <br /> <span className="text-[#00D665] not-italic">DashDrive.</span>
        </h2>

        <button onClick={onBack} className="relative z-10 bg-white text-black px-20 py-10 rounded-full font-black text-2xl hover:scale-105 hover:bg-[#00D665] transition-all duration-500 ease-out shadow-2xl">
          RETURN TO GRID
        </button>
      </section>
    </div>
  );
};

export default OrderPage;
