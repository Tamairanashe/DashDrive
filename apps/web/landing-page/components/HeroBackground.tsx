import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
    {
        url: '/assets/pictures/free_woman.png',
        alt: 'Premium Executive Travel'
    }
];

const HeroBackground: React.FC = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1.05 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        opacity: { duration: 2, ease: "linear" },
                        scale: { duration: 10, ease: "linear" }
                    }}
                    className="absolute inset-0"
                >
                    <img
                        src={images[index].url}
                        alt={images[index].alt}
                        className="w-full h-full object-cover brightness-[0.8] grayscale-[0.2]"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Editorial Gradients for depth */}
            <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
        </div>
    );
};

export default HeroBackground;
