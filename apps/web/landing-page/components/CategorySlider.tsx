import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

interface CategorySliderProps {
  onExploreRide: () => void;
  onExploreOrder: () => void;
  onExploreDeliver: () => void;
  onExplorePay: () => void;
}

const ServiceCard: React.FC<{
  title: string;
  highlight: string;
  image: string;
  buttonText: string;
  bgColor?: string;
  onExplore?: () => void;
  index: number;
}> = ({ title, highlight, image, buttonText, bgColor = 'bg-zinc-900', onExplore, index }) => {
  return (
    <div
      className={`relative min-w-[320px] md:min-w-[500px] lg:min-w-[700px] h-[450px] md:h-[580px] ${bgColor} rounded-[60px_20px_60px_20px] md:rounded-[140px_40px_140px_40px] overflow-hidden group shrink-0 shadow-[0_32px_80px_rgba(0,0,0,0.4)] transition-all duration-700 hover:scale-[1.01] cursor-pointer border border-white/[0.05]`}
      onClick={onExplore}
    >
      {/* Handcrafted Rim */}
      <div className="absolute inset-0 border border-white/[0.03] rounded-[inherit] pointer-events-none z-20 group-hover:border-[#00D665]/20 transition-colors duration-700" />

      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-[1.5s] ease-out opacity-70"
      />

      {/* Surface Depth & Noise (Simulated with Gradient) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/20 to-transparent opacity-60 z-0" />


      <div className="absolute bottom-12 left-12 right-12 md:bottom-16 md:left-16 md:right-16 z-20">
        <div className="backdrop-blur-xl bg-black/10 border border-white/5 p-8 md:p-10 rounded-[40px_15px_40px_15px] md:rounded-[60px_20px_60px_20px] overflow-hidden group/content transition-all duration-700 hover:bg-black/20 hover:border-white/10">
          <h3 className="text-3xl md:text-5xl font-light italic text-white/60 leading-tight lowercase tracking-tight group-hover:text-white transition-colors duration-500">
            {title}
          </h3>
          <h4 className="text-4xl md:text-7xl font-black text-[#00D665] tracking-tighter -mt-2 uppercase leading-none mb-8">
            {highlight}
          </h4>

          <div className="flex items-center justify-between">
            <button className="relative overflow-hidden bg-white text-black px-10 py-4 rounded-full font-black text-[12px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl group/btn">
              <span className="relative z-10 font-black">{buttonText}</span>
              <div className="absolute inset-0 bg-[#00D665] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
            </button>
            <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:border-[#00D665] group-hover:text-[#00D665] transition-all duration-700 group-hover:rotate-45">
              <ArrowUpRight size={28} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Light-Sweep effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-[cubic-bezier(0.23,1,0.32,1)]" />
    </div>
  );
};

const CategorySlider: React.FC<CategorySliderProps> = ({ onExploreRide, onExploreOrder, onExploreDeliver, onExplorePay }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Calculate horizontal shift based on 4 cards + spacers
  // 600vh height = Snappier, more direct feel
  // -250% shift ensures the final big text lands centered
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-265%"]);

  // Opacity of the background text
  const textOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);

  const services = [
    {
      id: 'ride',
      title: 'ride,',
      highlight: 'anywhere',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=2000',
      buttonText: 'Request Rides',
      bgColor: 'bg-[#0A0A0A]',
      onExplore: onExploreRide
    },
    {
      id: 'order',
      title: 'order,',
      highlight: 'anytime',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=2000',
      buttonText: 'Order Food',
      bgColor: 'bg-[#0A0A0A]',
      onExplore: onExploreOrder
    },
    {
      id: 'deliver',
      title: 'anything,',
      highlight: 'delivered',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000',
      buttonText: 'Get Anything',
      bgColor: 'bg-[#101010]',
      onExplore: onExploreDeliver
    },
    {
      id: 'pay',
      title: 'just,',
      highlight: 'pay',
      image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=2000',
      buttonText: 'Make Payments',
      bgColor: 'bg-[#00D665]/20',
      onExplore: onExplorePay
    }
  ];

  return (
    <section ref={targetRef} id="services-slider" className="relative h-[600vh] bg-[#050505] -mt-24 md:-mt-40 z-20 antialiased">
      {/* STRICT STICKY BOX */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden bg-white rounded-t-[48px] md:rounded-t-[100px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">

        {/* Text Layer (Fixed in center) */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-24 pointer-events-none z-0"
        >
          <div className="flex items-center gap-5 mb-8">
            <div className="h-[2px] w-12 bg-[#00D665]"></div>
            <span className="text-[12px] font-black tracking-[0.4em] text-black/30 uppercase">The Ecosystem</span>
          </div>
          <h2 className="text-6xl md:text-8xl lg:text-[9rem] font-light tracking-tighter leading-[0.8] text-black">
            Simply <br />
            <span className="font-black text-[#00D665] tracking-tighter italic">Better.</span>
          </h2>
        </motion.div>

        {/* The Moving Cards Track */}
        <motion.div
          style={{ x, willChange: "transform" }}
          className="flex gap-12 px-6 md:px-12 lg:px-24 items-center z-10 relative mt-16 md:mt-24"
        >
          {/* Spacer to let text be seen first */}
          <div className="min-w-[50vw] h-[10px] shrink-0" />

          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              index={index}
              title={service.title}
              highlight={service.highlight}
              image={service.image}
              buttonText={service.buttonText}
              bgColor={service.bgColor}
              onExplore={service.onExplore}
            />
          ))}


          {/* Concluding Text Section */}
          <div className="min-w-[100vw] flex flex-col justify-center px-8 md:px-12 lg:px-24">
            <h2 className="text-6xl md:text-8xl lg:text-[9rem] font-light tracking-tighter leading-[0.8] text-black">
              One App, <br />
              <span className="font-black text-[#00D665] tracking-tighter italic">Many Ways.</span>
            </h2>
          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default CategorySlider;
