
import React from 'react';
import { Play, ArrowLeft, Users, Target, Zap } from 'lucide-react';

interface AboutUsPageProps {
    onBack: () => void;
}

const AboutUsPage: React.FC<AboutUsPageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-white text-black pt-20 rounded-t-[48px] md:rounded-t-[100px] -mt-12 md:-mt-24 relative z-20 overflow-hidden">
            {/* Premium Editorial Hero */}
            <section className="relative h-[90vh] flex items-center bg-[#00D665] overflow-hidden">
                {/* Textured Motion Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00D665] via-[#00C05A] to-[#00A84D]" />
                    <div className="absolute top-0 right-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
                    {/* Cinematic Light Trails */}
                    <div className="absolute top-1/4 -right-20 w-[120%] h-[60%] blur-[120px] bg-white/20 rotate-12 animate-pulse" />
                    <div className="absolute bottom-1/4 -left-20 w-[100%] h-[40%] blur-[100px] bg-black/10 rotate-[-12deg]" />
                </div>

                <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
                    <div className="max-w-5xl">
                        <div className="flex flex-col items-start gap-8">
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/5 border border-black/5 backdrop-blur-md mb-4 translate-y-4 opacity-0 animate-[reveal_1s_cubic-bezier(0.23,1,0.32,1)_forwards]">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60">OUR AUTHENTIC STORY</span>
                            </div>

                            <h1 className="text-white text-[12vw] md:text-[8rem] font-light leading-[0.85] tracking-tight mb-12 animate-[reveal_1.2s_cubic-bezier(0.23,1,0.32,1)_forwards_0.2s] opacity-0">
                                BORN FROM A <br />
                                <span className="font-black italic tracking-tighter text-black">DASH</span> <br />
                                OF INSPIRATION.
                            </h1>

                            <div className="flex flex-wrap gap-6 animate-[reveal_1.2s_cubic-bezier(0.23,1,0.32,1)_forwards_0.4s] opacity-0">
                                <button className="group relative bg-white text-black px-12 py-6 rounded-full font-bold transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 hover:shadow-[0_32px_64px_rgba(0,0,0,0.15)] active:scale-95 flex items-center gap-4 text-lg">
                                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white group-hover:bg-[#00D665] group-hover:text-black transition-colors duration-500">
                                        <Play size={18} fill="currentColor" />
                                    </div>
                                    EXPLORE OUR JOURNEY
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subtle Scroll Hint */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
                    <div className="w-[1px] h-12 bg-black/20" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-black/40">SCROLL</span>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-24 md:py-48 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col md:flex-row items-center gap-20 md:gap-32">
                        <div className="w-full md:w-1/2 relative">
                            <div className="aspect-[4/5] rounded-[56px] md:rounded-[72px] overflow-hidden shadow-2xl relative bg-zinc-100">
                                <img
                                    src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000&auto=format&fit=crop"
                                    alt="London Streets"
                                    className="w-full h-full object-cover grayscale opacity-80"
                                />
                                <div className="absolute bottom-12 right-[-30px] bg-[#00D665] p-10 rounded-[40px] shadow-2xl border-8 border-white rotate-6 z-20">
                                    <div className="text-white text-sm font-black mb-1 uppercase tracking-widest">EST. LONDON</div>
                                    <div className="text-5xl font-black text-white">2019</div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2">
                            <span className="inline-block px-5 py-2.5 bg-[#00D665]/10 text-[#00D665] rounded-full text-sm font-black mb-10 uppercase tracking-widest">THE ORIGIN</span>
                            <h2 className="text-5xl md:text-8xl font-black mb-12 leading-[0.85] tracking-tighter uppercase">
                                IT STARTED WITH <br />A GAP IN <br />URBAN <br />EFFICIENCY
                            </h2>
                            <p className="text-xl md:text-2xl text-black/70 font-bold leading-relaxed max-w-xl">
                                DashDrive was founded in the heart of London with a single mission: to reclaim city lives. We saw a world of fragmented mobility and decided to build the ultimate unified dash.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="py-24 md:py-48 bg-zinc-50">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-32">
                        <span className="inline-block px-5 py-2.5 bg-white shadow-sm rounded-full text-sm font-black mb-10 uppercase tracking-widest">OUR DNA</span>
                        <h2 className="text-6xl md:text-[8rem] font-black tracking-tighter uppercase leading-[0.85]">
                            CORE VALUES <br />
                            <span className="relative inline-block mt-4">
                                <span className="relative z-10 text-white">THAT DRIVE US</span>
                                <div className="absolute inset-0 bg-[#00D665] -rotate-1 transform origin-bottom translate-y-4 h-[90%] z-0 rounded-2xl" />
                            </span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Speed Card */}
                        <div className="group bg-white rounded-[56px] p-4 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                            <div className="aspect-square relative rounded-[48px] overflow-hidden mb-10">
                                <img
                                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop"
                                    alt="Speed"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-8 left-8 flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#00D665] rounded-full flex items-center justify-center text-black">
                                        <Zap size={24} fill="currentColor" />
                                    </div>
                                    <h3 className="text-4xl font-black text-white uppercase italic">SPEED</h3>
                                </div>
                            </div>
                            <p className="px-6 pb-6 text-black/60 font-medium">Fast action, faster delivery. We value time above all else.</p>
                        </div>

                        {/* Integrity Card */}
                        <div className="group bg-white rounded-[56px] p-4 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                            <div className="aspect-square relative rounded-[48px] overflow-hidden mb-10">
                                <img
                                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop"
                                    alt="Integrity"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-8 left-8 flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#00D665] rounded-full flex items-center justify-center text-black">
                                        <Target size={24} />
                                    </div>
                                    <h3 className="text-4xl font-black text-white uppercase italic">INTEGRITY</h3>
                                </div>
                            </div>
                            <p className="px-6 pb-6 text-black/60 font-medium">Transparency in every transaction. No hidden fees, no compromises.</p>
                        </div>

                        {/* Freedom Card */}
                        <div className="group bg-white rounded-[56px] p-4 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                            <div className="aspect-square relative rounded-[48px] overflow-hidden mb-10">
                                <img
                                    src="https://images.unsplash.com/photo-1523206489230-c012c6a926a0?q=80&w=800&auto=format&fit=crop"
                                    alt="Freedom"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-8 left-8 flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#00D665] rounded-full flex items-center justify-center text-black">
                                        <Users size={24} />
                                    </div>
                                    <h3 className="text-4xl font-black text-white uppercase italic">FREEDOM</h3>
                                </div>
                            </div>
                            <p className="px-6 pb-6 text-black/60 font-medium">Giving you the freedom to move, eat, and pay on your own terms.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 md:py-48 bg-black text-white text-center overflow-hidden relative">
                <div className="container mx-auto px-6 max-w-5xl relative z-10">
                    <h2 className="text-6xl md:text-[9rem] font-black mb-16 uppercase tracking-tighter leading-[0.85]">
                        READY TO <br /><span className="text-[#00D665]">DASH?</span>
                    </h2>
                    <button
                        onClick={onBack}
                        className="bg-white text-black px-16 py-8 rounded-full text-2xl font-black flex items-center gap-4 mx-auto hover:bg-[#00D665] hover:text-white transition-all active:scale-95 uppercase tracking-widest shadow-2xl shadow-[#00D665]/20"
                    >
                        <ArrowLeft size={32} />
                        BACK TO HOME
                    </button>
                </div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#00D665]/10 rounded-full blur-[120px]" />
            </section>
        </div>
    );
};

export default AboutUsPage;
