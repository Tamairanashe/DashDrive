import React, { useRef } from 'react';
import { ArrowRight, ChevronDown, Play } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroBackground from './HeroBackground';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative w-full h-[115vh] min-h-[850px] flex items-center overflow-hidden bg-white z-0">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <HeroBackground />
      </motion.div>

      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="max-w-[1400px] mx-auto flex justify-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
            className="w-full max-w-[500px] bg-white rounded-[50px_10px_50px_10px] md:rounded-[110px_25px_110px_25px] p-10 md:p-14 shadow-[0_32px_96px_rgba(0,0,0,0.1)] flex flex-col gap-8"
          >
            <div className="space-y-5">
              <h1 className="text-[36px] md:text-[54px] font-bold text-black leading-[1.1] tracking-tight">
                Ride, Order,<br />Get, Pay
              </h1>
              <p className="text-[16px] md:text-[17px] text-black/60 font-medium leading-[1.5] max-w-[380px]">
                Request rides, order food, get anything delivered, and pay seamlessly in one app.
              </p>
            </div>

            <button className="w-fit border-[1.5px] border-black text-black px-8 py-4 rounded-full font-bold text-[17px] hover:bg-black hover:text-white transition-all duration-300">
              Download the app
            </button>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes slow-pan {
          0% { transform: scale(1.1) translateX(1%); }
          100% { transform: scale(1.05) translateX(-1%); }
        }
        .animate-slow-pan {
          animation: slow-pan 40s ease-in-out infinite alternate;
        }
      `}</style>
    </section>
  );
};

export default Hero;
