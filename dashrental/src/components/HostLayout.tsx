import { LayoutDashboard, Car, Calendar, MessageSquare, BarChart3, Settings, LogOut, User, ShieldAlert } from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';

export function HostLayout() {
  const location = useLocation();
  const { profile, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/host', icon: LayoutDashboard },
    { name: 'Trips', path: '/host/trips', icon: Calendar },
    { name: 'Vehicles', path: '/host/vehicles', icon: Car },
    { name: 'Inbox', path: '/host/inbox', icon: MessageSquare },
    { name: 'Claims', path: '/host/claims', icon: ShieldAlert },
    { name: 'Business', path: '/host/business', icon: BarChart3 },
    { name: 'Settings', path: '/host/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-900 pb-20 md:pb-0">
      {/* Desktop Host Navbar */}
      <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-black tracking-tighter text-indigo-600 flex items-center">
            DASH<span className="text-gray-900">RENTAL</span>
            <span className="ml-2 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md uppercase tracking-widest border border-indigo-100">Host</span>
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/host' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "relative flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300",
                    isActive 
                      ? "text-indigo-600 bg-indigo-50/50" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive && "stroke-[2.5px]")} />
                  {item.name}
                  {isActive && (
                    <motion.div 
                      layoutId="active-tab"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors">
            Switch to guest
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/host/settings" className="flex items-center gap-3 bg-white hover:bg-gray-50 p-1.5 pr-4 rounded-2xl transition-all border border-gray-100 shadow-sm group">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold overflow-hidden">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
                ) : (
                  profile?.displayName?.[0] || <User className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 leading-none mb-1 group-hover:text-indigo-600 transition-colors">
                  {profile?.displayName?.split(' ')[0] || 'Host'}
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Primary Host</div>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-2 py-3 flex justify-around items-center z-50 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/host' && location.pathname.startsWith(item.path));
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={cn(
                "relative flex flex-col items-center gap-1.5 w-14 transition-all duration-300",
                isActive ? "text-indigo-600" : "text-gray-400 hover:text-gray-900"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                isActive ? "bg-indigo-50 scale-110" : "bg-transparent"
              )}>
                <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <Outlet />
      </main>
    </div>
  );
}
