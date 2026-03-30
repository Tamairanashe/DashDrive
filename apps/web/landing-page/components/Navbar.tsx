
import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  User,
  Navigation,
  X,
  Car,
  Bike,
  Search,
  GraduationCap,
  Utensils,
  Smile,
  Zap,
  Store,
  Stethoscope,
  Smartphone,
  Package,
  Wallet,
  Send,
  Globe,
  ArrowRight,
  ShoppingBag,
  ChevronDown,
  Briefcase,
  Crown,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onLogoClick?: () => void;
  onNavigate?: (page: 'home' | 'mobility' | 'order' | 'delivery' | 'payment' | 'partners' | 'plus' | 'about') => void;
  isHidden?: boolean;
}

const PremiumMenuIcon = ({ isOpen, color = 'white' }: { isOpen: boolean; color?: string }) => {
  return (
    <div className="flex flex-col gap-[6px] items-end px-1">
      <motion.div
        animate={{
          rotate: isOpen ? 45 : 0,
          y: isOpen ? 8 : 0,
          width: 24
        }}
        className={`h-[1.5px] rounded-full transition-colors duration-500`}
        style={{ backgroundColor: color }}
      />
      <motion.div
        animate={{
          opacity: isOpen ? 0 : 1,
          width: isOpen ? 0 : 16
        }}
        className={`h-[1.5px] rounded-full transition-colors duration-500`}
        style={{ backgroundColor: color }}
      />
      <motion.div
        animate={{
          rotate: isOpen ? -45 : 0,
          y: isOpen ? -8 : 0,
          width: 24
        }}
        className={`h-[1.5px] rounded-full transition-colors duration-500`}
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

const Navbar: React.FC<NavbarProps> = ({ onLogoClick, onNavigate, isHidden = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const languageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) setIsLanguageOpen(false);
    };

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleServiceClick = (page: any) => {
    onNavigate?.(page);
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className={`absolute top-0 left-0 w-full z-50 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="mx-auto w-full">
          <nav className="flex items-center justify-between px-6 md:px-12 py-6 md:py-10 pointer-events-auto">
            <div onClick={onLogoClick} className="flex items-center gap-3 cursor-pointer group">
              <span className="text-2xl md:text-3xl font-bold tracking-[-0.03em] text-white">
                DashDrive
              </span>
            </div>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="group w-10 h-10 flex items-center justify-center hover:scale-110 transition-all focus:outline-none"
            >
              <PremiumMenuIcon isOpen={isMenuOpen} color="white" />
            </button>
          </nav>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white z-[100] overflow-y-auto"
          >
            <div className="container mx-auto px-6 py-8 md:py-12 max-w-[1440px] h-full flex flex-col">
              <div className="flex items-center justify-between mb-16">
                <div onClick={() => { setIsMenuOpen(false); onLogoClick?.(); }} className="flex items-center gap-3 cursor-pointer">
                  <span className="text-2xl md:text-3xl font-bold tracking-[-0.03em] text-black">DashDrive</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="group w-10 h-10 flex items-center justify-center hover:scale-110 transition-all focus:outline-none"
                >
                  <X size={24} strokeWidth={1.5} className="text-zinc-500" />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="flex flex-col gap-5">
                  {[
                    { id: 'mobility', label: 'Rides' },
                    { id: 'order', label: 'Eats' },
                    { id: 'delivery', label: 'Delivery' },
                    { id: 'payment', label: 'Payments' }
                  ].map((service) => (
                    <motion.button
                      key={service.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      onClick={() => handleServiceClick(service.id)}
                      className="text-2xl md:text-3xl font-medium text-black hover:text-[#00D665] transition-colors text-left"
                    >
                      {service.label}
                    </motion.button>
                  ))}
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl md:text-3xl font-medium text-black/40 hover:text-black transition-colors text-left"
                  >
                    Download the app
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl md:text-3xl font-medium text-black/40 hover:text-black transition-colors text-left"
                  >
                    Sign in
                  </motion.button>
                </div>

                <div className="mt-8 pt-8 border-t border-zinc-100">
                  <div className="relative" ref={languageRef}>
                    <button
                      onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                      className="flex items-center gap-2 text-[15px] text-zinc-400 hover:text-black transition-all"
                    >
                      <Globe size={18} strokeWidth={1.5} />
                      <span>{currentLang === 'EN' ? 'United Kingdom (English)' : 'United Kingdom (العربية)'}</span>
                    </button>

                    {isLanguageOpen && (
                      <div className="absolute bottom-full left-0 mb-3 w-56 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-zinc-100 p-1.5 z-20">
                        {[
                          { id: 'EN', label: 'English' },
                          { id: 'AR', label: 'العربية' }
                        ].map(lang => (
                          <button
                            key={lang.id}
                            onClick={() => { setCurrentLang(lang.id); setIsLanguageOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentLang === lang.id ? 'bg-zinc-50 text-[#00D665]' : 'hover:bg-zinc-50'}`}
                          >
                            {lang.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
