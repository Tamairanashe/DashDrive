import React, { useState } from 'react';
import { Rocket, Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { cn } from '../utils';
import carImage from '../assets/login-car.png';

export const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post('/auth/login', { email, password });
            const { user, access_token } = response.data;
            login(user, access_token);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#09090b] font-sans overflow-hidden select-none relative">
            {/* Left Side: Login Card Container */}
            <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:pl-24 z-20">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-white w-full max-w-[420px] rounded-[32px] p-10 lg:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white/10"
                >
                    {/* Branding */}
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-8">
                            <span className="text-2xl font-black tracking-tighter text-[#00ff90] bg-[#09090b] px-3 py-1 rounded-xl">DASH</span>
                            <span className="text-2xl font-black tracking-tighter text-[#09090b]">Drive</span>
                        </div>

                        <h1 className="text-3xl font-black text-[#09090b] tracking-tight mb-1">Log in</h1>
                        <p className="text-zinc-400 font-bold text-xs">Continue to DashDrive Admin Portal</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                                    <p className="text-xs font-bold text-red-600">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <div className="relative group">
                                <label className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest transition-colors group-focus-within:text-[#00ff90] z-10">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white border-2 border-zinc-100 rounded-2xl py-3.5 px-6 text-sm font-bold text-[#09090b] placeholder:text-zinc-200 focus:border-[#00ff90] transition-all outline-none"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="relative group">
                                <label className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest transition-colors group-focus-within:text-[#00ff90] z-10">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white border-2 border-zinc-100 rounded-2xl py-3.5 px-6 text-sm font-bold text-[#09090b] placeholder:text-zinc-200 focus:border-[#00ff90] transition-all outline-none"
                                    placeholder="Enter your password"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black self-center pointer-events-none">
                                    <Lock className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-fit bg-[#09090b] text-white rounded-2xl py-4 px-12 text-sm font-light tracking-wide uppercase shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_24px_48px_-8px_rgba(0,0,0,0.4)] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Submit
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </form>

                    <div className="mt-10 flex items-center justify-between">
                        <div className="flex gap-4">
                            <button className="text-xs font-bold text-zinc-400 hover:text-black transition-colors">Help</button>
                            <button className="text-xs font-bold text-zinc-400 hover:text-black transition-colors">Privacy</button>
                            <button className="text-xs font-bold text-zinc-400 hover:text-black transition-colors">Terms</button>
                        </div>
                        <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Â© 2026 DashDrive</p>
                    </div>
                </motion.div>
            </div>

            {/* Right Side: Car Image Container (Split Screen) */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-[#09090b]">
                {/* Image with subtle animation */}
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    <img
                        src={carImage}
                        alt="Metallic Green Car"
                        className="w-full h-full object-cover grayscale-[0.2] brightness-[0.8]"
                    />
                </motion.div>

                {/* Overlays for depth and branding integration */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-transparent to-transparent z-10" />
                <div className="absolute inset-0 bg-[#00ff90]/5 mix-blend-overlay z-10" />

                {/* Decorative Geometric Shapes (Subtle) */}
                <div className="absolute top-0 right-0 w-full h-full pointer-events-none z-20">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="absolute -right-[10%] -top-[10%] w-[60%] h-[80%] bg-[#00ff90] rounded-full blur-[150px]"
                    />
                </div>

                {/* Tagline or subtle info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="absolute bottom-16 right-16 z-30 text-right"
                >
                    <p className="text-[#00ff90] font-black text-sm uppercase tracking-widest mb-2">Innovation Redefined</p>
                    <h2 className="text-white text-5xl font-black tracking-tighter leading-none">
                        DASH<br />DRIVE
                    </h2>
                </motion.div>
            </div>

            {/* Mobile design adjustment overlay */}
            <div className="absolute inset-0 z-0 lg:hidden overflow-hidden">
                <img
                    src={carImage}
                    alt="Metallic Green Car"
                    className="w-full h-full object-cover opacity-20 scale-125"
                />
                <div className="absolute inset-0 bg-[#09090b]/80" />
            </div>
        </div>
    );
};
