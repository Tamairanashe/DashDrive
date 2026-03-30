import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const PROTOCOL_CATEGORIES = [
    {
        id: 'rides',
        label: 'Rides',
        subtitle: 'Mobility Grid',
        title: 'Ride',
        highlight: 'Protocols.',
        protocols: [
            {
                number: "1",
                title: "Upfront pricing",
                description: "See the estimated ride price in advance even before requesting. The final price is locked before you ride."
            },
            {
                number: "2",
                title: "Predictive Pickups",
                description: "Our AI predicts where drivers will be, cutting wait times to under 3 minutes in major city hubs."
            },
            {
                number: "3",
                title: "Strategic Points",
                description: "The app suggests nearby pickup points that can lower your fare by up to 20% by avoiding detours."
            }
        ]
    },
    {
        id: 'food',
        label: 'Food',
        subtitle: 'Culinary Network',
        title: 'Food',
        highlight: 'Protocols.',
        protocols: [
            {
                number: "1",
                title: "Live Kitchen Sync",
                description: "Real-time preparation tracking synced directly with the kitchen's terminal for precise timing."
            },
            {
                number: "2",
                title: "Thermal Mapping",
                description: "Couriers follow heat-optimized routes to ensure your order arrives at the intended temperature."
            },
            {
                number: "3",
                title: "Group Orders",
                description: "Collaborative order baskets with instant bill-splitting protocols for teams and families."
            }
        ]
    },
    {
        id: 'delivery',
        label: 'Delivery',
        subtitle: 'Logistics Mesh',
        title: 'Delivery',
        highlight: 'Protocols.',
        protocols: [
            {
                number: "1",
                title: "Handshake Protocol",
                description: "Secure, P2P encrypted verification codes ensuring items are only handled by authorized recipients."
            },
            {
                number: "2",
                title: "Dash Logistics",
                description: "Instant access to a massive fleet of bikes, vans, and trucks for anything from keys to furniture."
            },
            {
                number: "3",
                title: "Mesh Tracking",
                description: "High-fidelity mapping that shows exactly where your courier is, down to the meter."
            }
        ]
    },
    {
        id: 'payments',
        label: 'Payments',
        subtitle: 'Financial Bridge',
        title: 'Payment',
        highlight: 'Protocols.',
        protocols: [
            {
                number: "1",
                title: "Secure Vault",
                description: "Multi-layered encryption architecture protecting your credentials with banking-grade security."
            },
            {
                number: "2",
                title: "Peer-to-Peer Bridge",
                description: "Instant, fee-free money transfers to friends and family directly through the DashDrive network."
            },
            {
                number: "3",
                title: "Smart Receipts",
                description: "Interactive, data-rich transaction history that automatically categorizes your urban spending."
            }
        ]
    }
];

const AppFeatures: React.FC = () => {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <section ref={containerRef} className="relative h-[400vh] bg-white z-35">
            {/* Sticky Container */}
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
                <div className="container mx-auto px-6 md:px-12 lg:px-24">

                    {/* Static Branded Header Background */}
                    <div className="relative mb-12 md:mb-20">
                        <div className="flex items-center gap-5 mb-6">
                            <div className="h-[2px] w-12 bg-[#00D665]"></div>
                            <span className="text-[12px] font-black tracking-[0.4em] text-black/30 uppercase">Digital Ecosystem</span>
                        </div>
                    </div>

                    <div className="relative h-[550px] md:h-[600px]">
                        {PROTOCOL_CATEGORIES.map((category, catIndex) => {
                            const start = catIndex / PROTOCOL_CATEGORIES.length;
                            const end = (catIndex + 1) / PROTOCOL_CATEGORIES.length;
                            const mid = (start + end) / 2;

                            // Transitions: 
                            // First category stays visible at the start (0)
                            // Last category stays visible at the end (1)
                            const opacity = useTransform(
                                scrollYProgress,
                                catIndex === 0
                                    ? [0, mid, end]
                                    : catIndex === PROTOCOL_CATEGORIES.length - 1
                                        ? [start, mid, 1]
                                        : [start, mid - 0.05, mid + 0.05, end],
                                catIndex === 0
                                    ? [1, 1, 0]
                                    : catIndex === PROTOCOL_CATEGORIES.length - 1
                                        ? [0, 1, 1]
                                        : [0, 1, 1, 0]
                            );

                            const x = useTransform(
                                scrollYProgress,
                                catIndex === 0
                                    ? [0, mid, end]
                                    : catIndex === PROTOCOL_CATEGORIES.length - 1
                                        ? [start, mid, 1]
                                        : [start, mid, end],
                                catIndex === 0
                                    ? [0, 0, -50]
                                    : catIndex === PROTOCOL_CATEGORIES.length - 1
                                        ? [50, 0, 0]
                                        : [50, 0, -50]
                            );

                            return (
                                <motion.div
                                    key={category.id}
                                    style={{ opacity, x, pointerEvents: 'none' }}
                                    className="absolute inset-0 flex flex-col pointer-events-none"
                                >
                                    <div className="pointer-events-auto">
                                        <h2 className="text-5xl md:text-7xl lg:text-[6rem] font-light tracking-tighter leading-[0.8] text-black mb-12 md:mb-16">
                                            {category.title} <br />
                                            <span className="font-black text-[#00D665] tracking-tighter italic uppercase">{category.highlight}</span>
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                                            {category.protocols.map((protocol, index) => (
                                                <div key={index} className="space-y-6 group">
                                                    {/* Number Circle */}
                                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-[3px] border-[#00D665] flex items-center justify-center text-xl md:text-2xl font-bold text-black transition-all duration-700 group-hover:bg-[#00D665] group-hover:text-white">
                                                        {protocol.number}
                                                    </div>

                                                    <div className="space-y-4">
                                                        <h3 className="text-[20px] md:text-[24px] font-bold text-black leading-tight tracking-tight">
                                                            {protocol.title}
                                                        </h3>
                                                        <p className="text-[14px] md:text-[16px] text-black/60 font-medium leading-[1.4] max-w-[340px]">
                                                            {protocol.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppFeatures;
