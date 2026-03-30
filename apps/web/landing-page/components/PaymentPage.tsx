
import React, { useState, useEffect } from 'react';
import {
  Wallet,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Globe,
  CheckCircle2,
  Send,
  ChevronDown,
  Info
} from 'lucide-react';

const PaymentPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'pay' | 'send'>('pay');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sendAmount, setSendAmount] = useState<string>('100.00');

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [activeTab]);

  const countries = [
    { name: 'UK', flag: '🇬🇧' }, { name: 'India', flag: '🇮🇳' }, { name: 'Pakistan', flag: '🇵🇰' },
    { name: 'Egypt', flag: '🇪🇬' }, { name: 'Canada', flag: '🇨🇦' }, { name: 'Philippines', flag: '🇵🇭' }
  ];

  const SendMoneyHub = () => (
    <div className="animate-reveal">
      <section className="mx-6 md:mx-12 lg:mx-20 mt-8 mb-12 rounded-[64px] overflow-hidden min-h-[600px] flex items-center bg-[#1E293B] relative group">
        <div className="container mx-auto px-12 md:px-24 relative z-20 flex flex-col lg:flex-row items-center justify-between gap-20 py-20">
          <div className="space-y-10 max-w-xl">
            <h1 className="text-[#00D665] text-6xl md:text-[7vw] font-black tracking-tighter leading-[0.9]">
              Send money <br /> <span className="text-white">home, instantly.</span>
            </h1>
            <p className="text-white text-xl font-bold leading-relaxed opacity-90">
              Low-cost transfers to 30+ countries. Real-time rates, zero hidden fees, and absolute peace of mind.
            </p>
            <button className="bg-white text-black px-12 py-5 rounded-2xl font-black text-xl hover:bg-[#00D665] transition-all">Send Now</button>
          </div>

          <div className="w-full lg:w-[460px] bg-white rounded-[40px] p-10 shadow-2xl space-y-8 relative z-30">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400">You send (USD)</label>
                <input type="text" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} className="w-full p-6 bg-zinc-50 rounded-2xl border border-zinc-100 text-4xl font-black outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400">Recipient gets (INR)</label>
                <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 text-4xl font-black text-zinc-300">{(parseFloat(sendAmount || '0') * 83.4).toFixed(2)}</div>
              </div>
            </div>
            <button className="w-full py-6 bg-[#00D665] text-black font-black text-xl rounded-2xl shadow-xl">Complete Transfer</button>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 text-center mt-20 mb-32">
        <h2 className="text-7xl font-black tracking-tighter mb-12">Global Reach.</h2>
        <div className="flex justify-center gap-12">
          {countries.map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-6xl">{c.flag}</span>
              <span className="font-black text-zinc-400">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PayHub = () => (
    <div className="animate-reveal">
      <section className="mx-6 md:mx-12 lg:mx-20 mt-8 mb-12 rounded-[64px] overflow-hidden min-h-[600px] flex items-center bg-[#1E293B] relative group">
        <div className="container mx-auto px-12 md:px-24 relative z-20 flex flex-col lg:flex-row items-center justify-between gap-12 py-20">
          <div className="space-y-10 max-w-xl">
            <h1 className="text-white text-6xl md:text-[8vw] font-black tracking-tighter leading-[0.85]">
              Pay anything, <br /> <span className="text-[#00D665]">seamlessly.</span>
            </h1>
            <p className="text-white/60 text-2xl font-medium">Split bills with friends, settle utility payments, or pay for rides with one tap. Financial freedom starts here.</p>
            <button className="bg-[#00D665] text-black px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-all">Open Wallet</button>
          </div>
          <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800" className="w-full max-w-lg rounded-[64px] shadow-2xl" alt="Fintech" />
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 text-center mt-20 mb-32">
        <h2 className="text-7xl font-black tracking-tighter mb-12">Pay smarter.</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Safe", desc: "Top-tier encryption keeps your data and money 100% secure.", icon: <ShieldCheck size={40} /> },
            { title: "Fast", desc: "Payments settle in seconds. No more waiting for bank cycles.", icon: <Zap size={40} /> },
            { title: "Simple", desc: "All your bills and transfers in one easy-to-use dashboard.", icon: <CheckCircle2 size={40} /> }
          ].map((item, i) => (
            <div key={i} className="bg-zinc-50 p-12 rounded-[48px] border border-transparent hover:bg-white hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-[#00D665] mx-auto mb-8">{item.icon}</div>
              <h4 className="text-3xl font-black mb-4">{item.title}</h4>
              <p className="text-xl text-zinc-500 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pt-24 animate-reveal overflow-hidden rounded-t-[48px] md:rounded-t-[100px] -mt-12 md:-mt-24 relative z-20">
      <div className="flex justify-center gap-6 mb-20">
        <button onClick={() => setActiveTab('pay')} className={`px-12 py-5 rounded-full font-bold text-[13px] uppercase tracking-[0.3em] transition-all duration-500 border ${activeTab === 'pay' ? 'bg-[#00D665] text-black border-transparent shadow-[0_20px_40px_rgba(0,214,101,0.2)]' : 'text-black/20 hover:text-black hover:bg-zinc-50 border-transparent'}`}>Local Pay</button>
        <button onClick={() => setActiveTab('send')} className={`px-12 py-5 rounded-full font-bold text-[13px] uppercase tracking-[0.3em] transition-all duration-500 border ${activeTab === 'send' ? 'bg-[#00D665] text-black border-transparent shadow-[0_20px_40px_rgba(0,214,101,0.2)]' : 'text-black/20 hover:text-black hover:bg-zinc-50 border-transparent'}`}>Remittance</button>
      </div>

      {activeTab === 'pay' ? (
        <div className="animate-reveal">
          <section className="mx-6 md:mx-12 lg:mx-20 mt-8 mb-32 rounded-[20px_64px_20px_64px] md:rounded-[30px_100px_30px_100px] overflow-hidden min-h-[700px] flex items-center bg-[#0A0A0A] group relative">
            <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity duration-1000">
              <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover grayscale" alt="Fintech" />
            </div>

            <div className="container mx-auto px-12 md:px-24 relative z-20 flex flex-col lg:flex-row items-center justify-between gap-24 py-20">
              <div className="space-y-12 max-w-2xl">

                <h1 className="text-white text-7xl md:text-[9vw] font-light tracking-tight leading-[0.8] mb-12">
                  Pay anything, <br /> <span className="text-[#00D665] font-black tracking-tighter italic">seamlessly.</span>
                </h1>

                <p className="text-white/40 text-2xl font-medium max-w-xl leading-relaxed">Financial freedom starts with peer-to-peer verification. Open your secure wallet instantly.</p>

                <button className="group relative bg-[#00D665] text-black px-16 py-8 rounded-[32px] font-black text-xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 active:scale-95 flex items-center gap-4">
                  <span className="relative z-10">OPEN SECURE WALLET</span>
                </button>
              </div>
              <div className="relative w-full lg:w-1/2 rounded-[64px] overflow-hidden shadow-[0_64px_128px_-32px_rgba(0,0,0,0.8)] border border-white/5">
                <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.5s] scale-105 group-hover:scale-100" alt="Payment Hub" />
              </div>
            </div>
          </section>

          <div className="max-w-[1700px] mx-auto px-6 md:px-12 text-center mb-40">
            <h2 className="text-7xl font-black tracking-tighter mb-12 text-black">Pay Smarter.</h2>
            <div className="grid md:grid-cols-3 gap-10">
              {[
                { title: "Vault Safe", desc: "Military-grade encryption for every single P2P handshake.", icon: <ShieldCheck size={40} /> },
                { title: "Instant Settle", desc: "Technical mesh settlements in under 400ms globally.", icon: <Zap size={40} /> },
                { title: "Pure Logic", desc: "No middle-man fees. Just peer-to-peer transparency.", icon: <CheckCircle2 size={40} /> }
              ].map((item, i) => (
                <div key={i} className="group bg-[#FBFBFB] border border-black/[0.03] p-16 rounded-[20px_64px_20px_64px] hover:bg-[#0A0A0A] transition-all duration-[0.8s] ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-4">
                  <div className="w-20 h-20 bg-black/5 group-hover:bg-[#00D665] rounded-3xl flex items-center justify-center text-black/20 group-hover:text-black mx-auto mb-12 transition-all duration-700 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <h4 className="text-4xl font-black mb-6 text-black group-hover:text-white transition-colors">{item.title}</h4>
                  <p className="text-xl text-black/30 group-hover:text-white/40 font-medium leading-relaxed transition-colors">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-reveal">
          <section className="mx-6 md:mx-12 lg:mx-20 mt-8 mb-32 rounded-[20px_64px_20px_64px] md:rounded-[30px_100px_30px_100px] overflow-hidden min-h-[700px] flex items-center bg-[#0F172A] group relative">
            <div className="container mx-auto px-12 md:px-24 relative z-20 flex flex-col lg:flex-row items-center justify-between gap-24 py-20">
              <div className="space-y-12 max-w-xl">

                <h1 className="text-white text-7xl md:text-[9vw] font-light tracking-tight leading-[0.8] mb-12">
                  Send home, <br /> <span className="text-[#00D665] font-black tracking-tighter italic">instantly.</span>
                </h1>

                <p className="text-white/40 text-2xl font-medium leading-relaxed mb-12">Low-cost transfers to 30+ peer networks. Pure transparency at global scale.</p>

                <div className="flex gap-10">
                  {countries.slice(0, 3).map((c, i) => (
                    <div key={i} className="flex flex-col items-center gap-4 opacity-40 group-hover:opacity-100 transition-opacity duration-1000" style={{ transitionDelay: `${i * 200}ms` }}>
                      <span className="text-5xl drop-shadow-2xl">{c.flag}</span>
                      <span className="font-bold text-[10px] uppercase tracking-widest text-white/60">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-[500px] bg-white rounded-[64px] p-12 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.5)] space-y-10 relative z-30 border border-black/5">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20">Source / USD</label>
                    <div className="relative">
                      <input type="text" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} className="w-full p-8 bg-zinc-50 rounded-[32px] border border-black/5 text-5xl font-black outline-none focus:border-[#00D665] transition-all" />
                      <span className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl font-black text-black/10">USD</span>
                    </div>
                  </div>
                  <div className="flex justify-center -my-4 relative z-10">
                    <div className="w-14 h-14 bg-[#00D665] rounded-2xl flex items-center justify-center text-black shadow-xl">
                      <ArrowRight size={20} className="rotate-90" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20">Target / INR</label>
                    <div className="p-8 bg-zinc-50 rounded-[32px] border border-black/5 text-5xl font-black text-black/20">{(parseFloat(sendAmount || '0') * 83.4).toFixed(2)}</div>
                  </div>
                </div>
                <button className="w-full py-10 bg-black text-[#00D665] font-black text-2xl rounded-[32px] shadow-2xl hover:scale-[1.02] transition-all active:scale-98">EXECUTE TRANSFER</button>
              </div>
            </div>
          </section>
        </div>
      )}

      <section className="py-40 bg-[#0A0A0A] rounded-[30px_80px_30px_80px] mx-6 md:mx-12 lg:mx-20 mb-40 relative overflow-hidden group">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        <div className="max-w-4xl mx-auto px-12 relative z-10">
          <div className="mb-24 space-y-10 text-center">
            <div className="flex items-center justify-center gap-5">
              <span className="w-12 h-[2px] bg-[#00D665]"></span>
              <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-white/20">Financial Protocol</span>
            </div>
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] text-white">
              Capital <br />
              <span className="text-[#00D665] italic">Direct.</span>
            </h2>
          </div>

          <div className="space-y-8">
            {[
              { q: "Is my capital secure?", a: "DashDrive uses peer-to-peer vaulting with multi-sig verification for absolute safety." },
              { q: "Are there middle-man fees?", a: "None. We use a technical mesh to bridge networks directly, ensuring zero leakage of your value." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 rounded-[48px] p-12 transition-all hover:bg-white/10" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                <h4 className="text-3xl font-black tracking-tight text-white/80">{item.q}</h4>
                {openFaq === idx && <p className="mt-10 text-xl text-white/40 leading-relaxed animate-reveal">{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-48 bg-black text-white text-center rounded-[30px_80px_30px_80px] mx-6 md:mx-12 lg:mx-20 mb-32 relative group overflow-hidden">
        <h2 className="relative z-10 text-8xl md:text-[11rem] font-black tracking-tighter mb-20 leading-[0.8] uppercase italic">
          Zero stress. <br /> <span className="text-[#00D665] not-italic">Pure Value.</span>
        </h2>
        <button onClick={onBack} className="relative z-10 bg-white text-black px-20 py-10 rounded-full font-black text-2xl hover:bg-[#00D665] transition-all duration-700 shadow-2xl">
          BACK TO GRID
        </button>
      </section>
    </div>
  );
};

export default PaymentPage;
