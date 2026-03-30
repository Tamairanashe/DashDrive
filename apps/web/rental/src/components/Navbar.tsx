import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, Heart, MessageSquare, Car, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';

export function Navbar() {
  const location = useLocation();
  const { user, profile, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const navItems = [
    { name: 'Explore', path: '/', icon: Search },
    { name: 'Trips', path: '/trips', icon: Car },
    { name: 'Inbox', path: '/host/inbox', icon: MessageSquare }, // Updated to host inbox for now or guest inbox if it exists
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex items-center justify-between px-12 py-5 bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-black tracking-tighter text-indigo-600 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            DASHRENTAL
          </Link>
          <div className="flex items-center gap-8">
            <Link to="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-indigo-600 transition-all">Find a car</Link>
            <Link to="/host" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-indigo-600 transition-all">Switch to hosting</Link>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-6">
              <Link to="/profile" className="flex items-center gap-3 group">
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Authenticated</p>
                  <p className="text-sm font-bold text-gray-900 leading-none">{profile?.displayName?.split(' ')[0] || 'User'}</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 overflow-hidden group-hover:scale-110 transition-transform">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-600">
                      <User size={20} />
                    </div>
                  )}
                </div>
              </Link>
              <button 
                onClick={logout} 
                className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all active:scale-95"
            >
              Access Portal
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-gray-900/90 backdrop-blur-2xl rounded-[2rem] px-8 py-4 flex justify-between items-center z-50 shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                isActive ? "text-indigo-400 scale-110" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <Icon size={20} className={cn(isActive && "fill-indigo-400/20")} />
            </Link>
          );
        })}
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
