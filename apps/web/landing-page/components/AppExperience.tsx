import React from 'react';
import { MapPin, MessageSquare, Navigation, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const AppExperience: React.FC = () => {
    const features = [
        {
            icon: <MapPin className="text-black" size={32} strokeWidth={1.5} />,
            title: "Add stops",
            desc: "Change your route if you need to pick up your kids or a friend along the way."
        },
        {
            icon: <MessageSquare className="text-black" size={32} strokeWidth={1.5} />,
            title: "In-app chat",
            desc: "Message your driver directly in the app. No need to share your personal phone number."
        },
        {
            icon: <Navigation className="text-black" size={32} strokeWidth={1.5} />,
            title: "Track your driver",
            desc: "See exactly where your driver is on the map and when they'll arrive at your door."
        },
        {
            icon: <ShieldCheck className="text-black" size={32} strokeWidth={1.5} />,
            title: "Share your trip",
            desc: "Send your real-time location to friends or family so they know you've arrived safely."
        }
    ];

    return (
        <section className="py-24 md:py-48 bg-[#00D665] text-black overflow-hidden relative rounded-t-[48px] md:rounded-t-[100px] -mt-12 md:-mt-24 z-40">
            <div className="max-w-[1700px] mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">

                    {/* Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                        className="flex-1 w-full"
                    >
                        <div className="relative group">
                            {/* Handcrafted Rim */}
                            <div className="absolute inset-0 border border-black/[0.1] rounded-[48px] md:rounded-[64px] pointer-events-none z-20 transition-colors duration-700" />

                            <div className="relative aspect-[4/5] md:aspect-square overflow-hidden rounded-[48px] md:rounded-[64px] shadow-[0_40px_100px_rgba(0,0,0,0.2)]">
                                <img
                                    src="/assets/pictures/simple_group.png"
                                    alt="Premium App Experience"
                                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-all duration-[1.5s] ease-out"
                                />

                                {/* Glossy Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />

                                {/* Floating Tech Badge */}
                                <div className="absolute bottom-10 left-10 p-6 backdrop-blur-3xl bg-white/90 border border-black/5 rounded-3xl shadow-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-black/30">Active System</p>
                                            <p className="text-[12px] font-bold text-black tracking-tight">London Central // TRK_904</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Side */}
                    <div className="flex-1 space-y-12 md:space-y-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                        >
                            <div className="flex items-center gap-5 mb-8">
                                <span className="w-12 h-[2px] bg-black/20"></span>
                                <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-black/40">The Interface</span>
                            </div>
                            <h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight leading-[0.8] text-black">
                                Simple and <br />
                                <span className="text-black font-black tracking-tighter italic">Easy.</span>
                            </h2>
                        </motion.div>

                        <div className="grid sm:grid-cols-1 gap-10 md:gap-12">
                            {features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.23, 1, 0.32, 1] }}
                                    className="flex gap-8 group"
                                >
                                    <div className="shrink-0 w-16 h-16 rounded-2xl bg-black/5 border border-black/5 flex items-center justify-center transition-all duration-500">
                                        {feature.icon}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold tracking-tight text-black">{feature.title}</h3>
                                        <p className="text-black/60 text-lg leading-relaxed max-w-md">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AppExperience;
