import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const AboutUsSection: React.FC = () => {
    return (
        <section className="py-24 md:py-48 bg-black text-white overflow-hidden relative rounded-t-[48px] md:rounded-t-[100px] -mt-12 md:-mt-24 z-30">
            <div className="container mx-auto px-6 md:px-12 max-w-[1700px] relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">

                    {/* Content Side */}
                    <div className="flex-1 space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                            className="space-y-10"
                        >
                            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none text-white">
                                About us
                            </h2>
                            <p className="text-white/60 text-xl md:text-2xl font-medium leading-relaxed max-w-xl">
                                DashDrive's purpose is to simplify and improve the lives of people
                                and build an awesome organization that inspires. Learn more
                                about our purpose, people and services.
                            </p>

                            <button
                                className="group relative bg-[#00D665] text-black px-12 py-6 rounded-2xl font-black text-lg overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,214,101,0.2)] flex items-center gap-3"
                            >
                                <span className="relative z-10">Read more</span>
                                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>

                    {/* Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                        className="flex-1 w-full"
                    >
                        <div className="relative aspect-video lg:aspect-square overflow-hidden rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.1)]">
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000"
                                alt="Our Team"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent" />

                            {/* Floating Badge */}
                            <div className="absolute top-10 right-10 p-6 backdrop-blur-3xl bg-white/5 border border-white/10 rounded-3xl shadow-xl hidden md:block">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#00D665] flex items-center justify-center">
                                        <span className="text-black font-black">DD</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Our Mission</p>
                                        <p className="text-[12px] font-bold text-white tracking-tight">Driving Change Globally</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default AboutUsSection;
