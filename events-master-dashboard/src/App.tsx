import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket, Calendar, MapPin, CheckCircle, Clock, Users, Search, ChevronDown, User, HelpCircle, Gift, Tag, Building2, Star, Heart, List, ChevronUp, ChevronRight, Check, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Venue3D from './components/Venue3D';
import OrganizerDashboard from './components/OrganizerDashboard';

// Types
type Event = {
  id: number;
  name: string;
  venue: string;
  date: string;
  totalSeats: number;
  category: string;
  image: string;
};

type Seat = {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'locked' | 'sold';
  lockedBy: string | null;
  lockExpiry: number | null;
};

type Order = {
  id: string;
  eventId: number;
  seatId: string;
  userId: string;
  email: string;
  status: string;
  qrCode: string;
  createdAt: string;
};

// Generate a unique user ID for this session
const SESSION_USER_ID = uuidv4();

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [email, setEmail] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [view, setView] = useState<'user' | 'organizer' | 'auth'>('user');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [regStep, setRegStep] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  
  // Registration State
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regCountry, setRegCountry] = useState('United States');
  const [regZip, setRegZip] = useState('');
  
  const [queueStatus, setQueueStatus] = useState<'none' | 'waiting' | 'active'>('none');
  const [queuePosition, setQueuePosition] = useState<number>(0);
  const [toast, setToast] = useState<{ message: string, type: 'error' | 'success' } | null>(null);

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchEvents();
    if (accessToken) {
      // Potentially verify token or refresh here
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        localStorage.setItem('accessToken', data.accessToken);
        setUser(data.user);
        setView(data.user.role === 'organizer' ? 'organizer' : 'user');
        showToast('Logged in successfully!', 'success');
      } else {
        showToast(data.error || 'Login failed');
      }
    } catch (error) {
      showToast('An error occurred during login');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regStep === 1) {
      setRegStep(2);
      return;
    }
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: regEmail, 
          password: regPassword,
          firstName: regFirstName,
          lastName: regLastName,
          country: regCountry,
          zip: regZip
        })
      });
      const data = await res.json();
      if (data.success) {
        setRegStep(3);
        showToast('Registration successful!', 'success');
      } else {
        showToast(data.error || 'Registration failed');
      }
    } catch (error) {
      showToast('An error occurred during registration');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    setUser(null);
    setView('user');
    showToast('Logged out');
  };

  // Polling for queue status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedEvent && isBooking && queueStatus === 'waiting') {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/events/${selectedEvent.id}/queue/status?userId=${SESSION_USER_ID}`);
          const data = await res.json();
          if (data.status === 'active') {
            setQueueStatus('active');
            fetchSeats(selectedEvent.id);
          } else if (data.status === 'waiting') {
            setQueuePosition(data.position);
          }
        } catch (error) {
          console.error('Failed to poll queue status', error);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [selectedEvent, isBooking, queueStatus]);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events', error);
    }
  };

  const fetchSeats = async (eventId: number) => {
    try {
      const res = await fetch(`/api/events/${eventId}/seats`);
      const data = await res.json();
      setSeats(data);
    } catch (error) {
      console.error('Failed to fetch seats', error);
    }
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setSelectedSeat(null);
    setOrder(null);
    setQueueStatus('none');
    setIsBooking(false);
    window.scrollTo(0, 0);
  };

  const handleFindTickets = async () => {
    if (!selectedEvent) return;
    setIsBooking(true);
    
    // Join queue
    try {
      const res = await fetch(`/api/events/${selectedEvent.id}/queue/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: SESSION_USER_ID })
      });
      const data = await res.json();
      
      setQueueStatus(data.status);
      if (data.status === 'active') {
        fetchSeats(selectedEvent.id);
      } else if (data.status === 'waiting') {
        setQueuePosition(data.position);
      }
    } catch (error) {
      console.error('Failed to join queue', error);
      showToast('Failed to join queue');
    }
  };

  const handleLeaveQueue = async () => {
    if (selectedEvent && queueStatus !== 'none') {
      try {
        await fetch(`/api/events/${selectedEvent.id}/queue/leave`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: SESSION_USER_ID })
        });
      } catch (error) {
        console.error('Failed to leave queue', error);
      }
    }
    setSelectedEvent(null);
    setSelectedSeat(null);
    setQueueStatus('none');
  };

  const handleSeatSelect = async (seat: Seat) => {
    if (seat.status === 'sold') {
      showToast(`Seat ${seat.id} was just sold`);
      return;
    }
    if (seat.status === 'locked' && seat.lockedBy !== SESSION_USER_ID) {
      showToast(`Seat ${seat.id} is already locked`);
      return;
    }
    if (seat.status === 'locked' && seat.lockedBy === SESSION_USER_ID) {
      setSelectedSeat(seat);
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/seats/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEvent?.id,
          seatId: seat.id,
          userId: SESSION_USER_ID
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setSelectedSeat(data.seat);
        // Refresh seats to show lock
        if (selectedEvent) fetchSeats(selectedEvent.id);
      } else {
        showToast(data.error || 'Failed to lock seat');
        // Refresh seats to show updated status
        if (selectedEvent) fetchSeats(selectedEvent.id);
      }
    } catch (error) {
      console.error('Failed to lock seat', error);
      showToast('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !selectedSeat || !email) return;

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          seatId: selectedSeat.id,
          userId: SESSION_USER_ID,
          email
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
        setQueueStatus('none'); // Left queue after purchase
        showToast('Order completed successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to complete order');
      }
    } catch (error) {
      console.error('Failed to checkout', error);
      showToast('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (view === 'auth') {
    return (
      <div className="min-h-screen bg-white flex overflow-hidden">
        {/* Left Side: Welcome Panel (Matching Screenshot) */}
        <div className="hidden lg:flex w-1/3 bg-[#111] text-white p-12 flex-col justify-between relative">
          <div>
            <div className="flex items-center gap-2 font-bold text-2xl tracking-tight mb-20 cursor-pointer" onClick={() => setView('user')}>
              <Ticket className="w-8 h-8 text-[#026cdf]" />
              <span className="text-white">dashticket</span>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-6xl font-black mb-8 leading-tight tracking-tighter"
            >
              WELCOME
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-12 h-1 bg-[#026cdf] mb-8"
            />
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-zinc-400 font-medium max-w-xs leading-relaxed"
            >
              {regStep === 1 ? "Discover millions of events, get alerts about your favorite artists, teams, plays and more — plus always- secure, effortless ticketing." : 
               regStep === 2 ? "This is it — millions of live events, up to the minute alerts for your favorite artists and teams and, of course, always safe, secure ticketing." :
               "Just one more step before we can get you in the door (it's basically the digital equivalent to a friendly bouncer checking your ID)."}
            </motion.p>
          </div>
          
          <div className="text-5xl font-black opacity-10 select-none">t</div>
        </div>

        {/* Right Side: Form Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 lg:bg-white overflow-y-auto no-scrollbar">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {authMode === 'login' && (
                <motion.div 
                  key="login"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">Sign In</h2>
                    <p className="text-slate-500 text-sm font-medium">Please enter your details below.</p>
                  </div>
                  
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Email Address</label>
                      <input name="email" type="email" required className="w-full px-4 py-4 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#026cdf] outline-none transition-all font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Password</label>
                      <input name="password" type="password" required className="w-full px-4 py-4 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#026cdf] outline-none transition-all font-bold" />
                    </div>
                    <button type="submit" className="w-full bg-[#026cdf] text-white py-4 rounded-lg font-black uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10 active:scale-[0.98]">
                      Sign In
                    </button>
                  </form>
                  
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-center gap-4">
                    <p className="text-sm text-slate-500 font-medium">New to dashticket?</p>
                    <button onClick={() => { setAuthMode('register'); setRegStep(1); }} className="text-[#026cdf] font-black uppercase text-xs tracking-widest hover:underline">Create Account</button>
                  </div>
                </motion.div>
              )}

              {authMode === 'register' && (
                <motion.div 
                  key={`register-${regStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {regStep === 1 && (
                    <>
                      <div className="space-y-2">
                        <h2 className="text-2xl font-black uppercase tracking-tight">Sign In or Create Account</h2>
                        <p className="text-zinc-500 text-sm">If you don't have an account you will be prompted to create one.</p>
                      </div>
                      <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-1">
                          <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Email Address</label>
                          <input 
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            type="email" required className="w-full px-4 py-4 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#026cdf] outline-none transition-all font-bold" 
                          />
                        </div>
                        <button type="submit" className="w-full bg-[#026cdf] text-white py-4 rounded-lg font-black uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10">
                          Continue
                        </button>
                        
                        <div className="relative py-4 flex items-center justify-center">
                          <div className="absolute inset-x-0 h-px bg-slate-100"></div>
                          <span className="relative z-10 bg-white px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">OR</span>
                        </div>
                        
                        <button type="button" className="w-full flex items-center justify-center gap-2 py-4 rounded-lg border border-slate-200 font-bold text-sm hover:bg-slate-50 transition-colors">
                          <span className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center">?</span>
                          Sign In With A Passkey
                        </button>
                      </form>
                      
                      <div className="pt-8 text-center">
                        <button onClick={() => setAuthMode('login')} className="text-slate-500 font-bold text-sm hover:underline">Back to Sign In</button>
                      </div>
                    </>
                  )}

                  {regStep === 2 && (
                    <>
                      <div className="space-y-2">
                        <h2 className="text-2xl font-black uppercase tracking-tight">Sign Up</h2>
                        <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                           <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                             <Check className="w-2 h-2 text-white" />
                           </div>
                           <span className="text-xs font-bold text-zinc-600">{regEmail}</span>
                        </div>
                      </div>
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Password</label>
                          <input 
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            type="password" required className="w-full px-4 py-4 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#026cdf] outline-none transition-all font-bold" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-black uppercase text-slate-500 tracking-wider">First Name</label>
                            <input 
                              value={regFirstName}
                              onChange={(e) => setRegFirstName(e.target.value)}
                              type="text" required className="w-full px-4 py-4 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#026cdf] outline-none transition-all font-bold" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Last Name</label>
                            <input 
                              value={regLastName}
                              onChange={(e) => setRegLastName(e.target.value)}
                              type="text" required className="w-full px-4 py-4 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#026cdf] outline-none transition-all font-bold" 
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Country of Residence</label>
                          <select 
                            value={regCountry}
                            onChange={(e) => setRegCountry(e.target.value)}
                            className="w-full px-4 py-4 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#026cdf] outline-none transition-all font-bold"
                          >
                            <option>United States</option>
                            <option>Zimbabwe</option>
                            <option>United Kingdom</option>
                            <option>Canada</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Zip/Postal Code</label>
                          <input 
                            value={regZip}
                            onChange={(e) => setRegZip(e.target.value)}
                            type="text" required className="w-full px-4 py-4 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#026cdf] outline-none transition-all font-bold" 
                          />
                        </div>
                        
                        <div className="py-4 space-y-4">
                           <label className="flex gap-3 cursor-pointer group">
                             <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-[#026cdf] focus:ring-[#026cdf]" />
                             <span className="text-[10px] text-slate-500 leading-tight">Hear about what's coming up. (including news, exclusive presales and offers - by email, SMS, etc)</span>
                           </label>
                           <label className="flex gap-3 cursor-pointer group">
                             <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-slate-300 text-[#026cdf] focus:ring-[#026cdf]" />
                             <span className="text-[10px] text-slate-500 leading-tight font-bold">I acknowledge that I have read and agree to the current Terms of Use and Privacy Policy.</span>
                           </label>
                        </div>

                        <button type="submit" className="w-full bg-[#026cdf] text-white py-4 rounded-lg font-black uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10">
                          Next
                        </button>
                        <button type="button" onClick={() => setRegStep(1)} className="w-full text-slate-500 font-bold text-sm py-2 hover:underline">Back</button>
                      </form>
                    </>
                  )}

                  {regStep === 3 && (
                    <>
                      <div className="space-y-4">
                        <h2 className="text-4xl font-black uppercase tracking-tight leading-none">ALMOST THERE</h2>
                        <p className="text-zinc-500 text-sm font-medium">To keep your account secure, we need to verify both your email and phone.</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4">
                           <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                 <Ticket className="w-5 h-5 text-slate-400" />
                               </div>
                               <div>
                                 <p className="text-sm font-black uppercase tracking-tight">Verify your email</p>
                               </div>
                             </div>
                             <span className="text-[10px] font-black uppercase bg-slate-100 px-2 py-1 rounded text-slate-500">Required</span>
                           </div>
                           <p className="text-xs text-slate-500">To verify your email, we'll send you a one-time code.</p>
                           <button onClick={() => setAuthMode('login')} className="w-full bg-[#026cdf] text-white py-3 rounded-lg font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all">Verify My Email</button>
                        </div>

                        <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4 opacity-100">
                           <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                 <Plus className="w-5 h-5 text-slate-400" />
                               </div>
                               <div>
                                 <p className="text-sm font-black uppercase tracking-tight">Add & Verify Your Phone Number</p>
                               </div>
                             </div>
                             <span className="text-[10px] font-black uppercase bg-slate-100 px-2 py-1 rounded text-slate-500">Required</span>
                           </div>
                           <p className="text-xs text-slate-500">To verify your phone number, we'll send you a one-time code.</p>
                           <button className="w-full bg-[#026cdf] text-white py-3 rounded-lg font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all">Add My Phone</button>
                        </div>
                      </div>
                      
                      <div className="pt-8 text-center flex flex-col gap-4">
                        <button className="text-[#026cdf] font-black uppercase text-xs tracking-widest hover:underline">Need Assistance? Visit our Help Center</button>
                        <button onClick={() => setAuthMode('login')} className="text-slate-500 font-bold text-sm hover:underline">Skip for now (Go to Login)</button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'organizer') {
    if (!accessToken) {
      setView('auth');
      return null;
    }
    return (
      <div className="min-h-screen bg-slate-50">
        <OrganizerDashboard onLogout={handleLogout} userEmail={user?.email} />
        <button 
          onClick={() => setView('user')}
          className="fixed bottom-6 left-6 bg-white text-[#1e293b] font-bold px-4 py-2 rounded-lg border border-slate-200 shadow-lg hover:bg-slate-50 transition-colors z-20 flex items-center gap-2"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Switch to User View
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      {/* Top Black Bar */}
      <div className="bg-[#111111] text-white text-xs py-2 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-bold">UK</span>
          <span className="text-zinc-400">|</span>
          <span>All of United Kingdom</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">Gift Cards</a>
          <a href="#" className="hover:underline">Sell Tickets</a>
          <a href="#" className="hover:underline">Hotels</a>
          <a href="#" className="hover:underline">VIP</a>
        </div>
      </div>

      {/* Main Blue Navbar */}
      <header className="bg-[#026cdf] text-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 font-bold text-2xl tracking-tight cursor-pointer" onClick={() => {
              setSelectedEvent(null);
              setSelectedSeat(null);
              setOrder(null);
              setQueueStatus('none');
            }}>
              <Ticket className="w-8 h-8" />
              <span>dashticket</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a href="#" className="hover:text-blue-200 transition-colors">Music</a>
              <a href="#" className="hover:text-blue-200 transition-colors">Sport</a>
              <a href="#" className="hover:text-blue-200 transition-colors">Arts</a>
              <a href="#" className="hover:text-blue-200 transition-colors">Theatre</a>
              <button 
                onClick={() => setView(accessToken ? 'organizer' : 'auth')}
                className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold hover:bg-white/20 transition-colors"
              >
                For Organizers
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {selectedEvent && !order && (
              <button 
                onClick={handleLeaveQueue}
                className="text-sm font-medium text-blue-200 hover:text-white transition-colors mr-4"
              >
                Back to Events
              </button>
            )}
            {accessToken ? (
              <div className="flex items-center gap-2 group cursor-pointer relative">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                  {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="hidden lg:block">
                  <p className="text-[10px] font-black uppercase tracking-tight leading-none opacity-60">My Account</p>
                  <p className="text-xs font-bold leading-tight">{user?.firstName || 'Guest'}</p>
                </div>
                
                {/* Simple Dropdown on hover */}
                <div className="absolute top-full right-0 w-48 bg-white text-zinc-900 rounded-xl shadow-2xl border border-zinc-100 p-2 mt-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all pointer-events-none group-hover:pointer-events-auto">
                   <div className="p-3 border-b border-zinc-50">
                     <p className="text-[10px] font-black uppercase text-zinc-400">Logged in as</p>
                     <p className="text-xs font-bold truncate">{user?.email}</p>
                   </div>
                   <button onClick={() => setView('organizer')} className="w-full text-left p-3 text-xs font-bold hover:bg-zinc-50 rounded-lg flex items-center gap-2">
                     Organizer Portal
                   </button>
                   <button onClick={handleLogout} className="w-full text-left p-3 text-xs font-bold hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                     Sign Out
                   </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setView('auth')}
                className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[10px] bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all border border-white/20 shadow-lg shadow-black/10 active:scale-95"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          {!selectedEvent ? (
            <motion.div 
              key="events"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero Section */}
              <div className="relative h-[500px] bg-zinc-900 overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/jill/1920/1080" 
                  alt="Hero" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                {/* Search Bar - Overlapping */}
                <div className="absolute top-0 left-0 w-full bg-[#026cdf] pb-6">
                  <div className="max-w-4xl mx-auto px-6">
                    <div className="bg-white rounded-md flex items-center h-14 shadow-lg overflow-hidden text-zinc-900">
                      <div className="flex-1 flex items-center px-4 border-r border-zinc-200 cursor-pointer hover:bg-zinc-50 h-full">
                        <MapPin className="w-5 h-5 text-[#026cdf] mr-3" />
                        <div>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase">Location</p>
                          <p className="text-sm font-medium">All of United Kingdom</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-zinc-400 ml-auto" />
                      </div>
                      <div className="flex-1 flex items-center px-4 border-r border-zinc-200 cursor-pointer hover:bg-zinc-50 h-full">
                        <Calendar className="w-5 h-5 text-[#026cdf] mr-3" />
                        <div>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase">Dates</p>
                          <p className="text-sm font-medium">All Dates</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-zinc-400 ml-auto" />
                      </div>
                      <div className="flex-[2] flex items-center px-4 h-full">
                        <Search className="w-5 h-5 text-[#026cdf] mr-3" />
                        <input 
                          type="text" 
                          placeholder="Artist, Event or Venue" 
                          className="w-full outline-none text-sm font-medium bg-transparent"
                        />
                      </div>
                      <div className="px-2 h-full flex items-center">
                        <button className="bg-[#026cdf] text-white px-8 py-2.5 rounded font-bold hover:bg-blue-700 transition-colors">
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-12 left-0 w-full">
                  <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-5xl font-bold text-white mb-4">Jill Scott</h1>
                    <p className="text-xl text-white font-medium max-w-2xl">
                      Jill Scott has announced her To Whom This May Concern World Tour
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="max-w-7xl mx-auto px-6 py-12 flex gap-8">
                <div className="flex-1">
                  <h2 className="text-xl font-bold tracking-tight mb-6 uppercase border-b-2 border-black pb-2 inline-block">Popular Tickets</h2>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {events.map(event => (
                      <div 
                        key={event.id}
                        onClick={() => handleEventSelect(event)}
                        className="group cursor-pointer"
                      >
                        <div className="aspect-[3/2] overflow-hidden rounded-md mb-3">
                          <img 
                            src={event.image} 
                            alt={event.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">{event.category}</p>
                        <h3 className="text-lg font-bold group-hover:underline">{event.name}</h3>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-16">
                    <h2 className="text-xl font-bold tracking-tight mb-6 uppercase border-b-2 border-black pb-2 inline-block">Discover</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                       <div className="group cursor-pointer">
                         <div className="aspect-[3/2] bg-zinc-900 rounded-md mb-3 flex items-center justify-center overflow-hidden">
                           <img src="https://picsum.photos/seed/festival/600/400" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                         </div>
                         <h3 className="text-lg font-bold group-hover:underline mb-2">Festival Finder</h3>
                         <p className="text-sm text-zinc-600">With some huge line ups already announced where will you be heading to in 2026?</p>
                         <p className="text-xs font-bold text-[#026cdf] mt-3 uppercase">Discover More</p>
                       </div>
                       <div className="group cursor-pointer">
                         <div className="aspect-[3/2] bg-zinc-900 rounded-md mb-3 flex items-center justify-center overflow-hidden">
                           <img src="https://picsum.photos/seed/theatre/600/400" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                         </div>
                         <h3 className="text-lg font-bold group-hover:underline mb-2">West End Guide</h3>
                         <p className="text-sm text-zinc-600">Make it a night to remember! Enjoy up to 55% off top West End shows.</p>
                         <p className="text-xs font-bold text-[#026cdf] mt-3 uppercase">Discover More</p>
                       </div>
                       <div className="group cursor-pointer">
                         <div className="aspect-[3/2] bg-zinc-900 rounded-md mb-3 flex items-center justify-center overflow-hidden">
                           <img src="https://picsum.photos/seed/comedy/600/400" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                         </div>
                         <h3 className="text-lg font-bold group-hover:underline mb-2">Things To Do Guide</h3>
                         <p className="text-sm text-zinc-600">From cozy indoor fun to thrilling outdoor adventures, start the year with a bang!</p>
                         <p className="text-xs font-bold text-[#026cdf] mt-3 uppercase">Discover More</p>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-80 hidden lg:block space-y-8">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b-2 border-black pb-2 inline-block">Featured</h3>
                    <div className="bg-zinc-100 rounded-md overflow-hidden cursor-pointer group">
                      <img src="https://picsum.photos/seed/guide/400/250" alt="Guide" className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <div className="p-4">
                        <h4 className="font-bold mb-1 group-hover:underline">Check out the latest gig news</h4>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-900 text-white rounded-md p-6 cursor-pointer group overflow-hidden relative">
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-1">WHAT'S ON</h3>
                      <h3 className="text-2xl font-bold text-[#00e6e6] mb-4">NEAR YOU?</h3>
                      <div className="flex items-center gap-2 font-bold">
                        <span>dashticket</span>
                        <span className="text-[#00e6e6]">LOCAL</span>
                      </div>
                    </div>
                    <MapPin className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  
                  <div className="bg-[#026cdf] text-white rounded-md p-6 cursor-pointer group overflow-hidden relative">
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 font-bold mb-4">
                        <span>dashticket</span>
                        <span className="font-normal">Gift Card</span>
                      </div>
                      <h3 className="text-xl font-bold mt-12">Give the gift of live</h3>
                    </div>
                    <Gift className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <footer className="bg-[#111111] text-white pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="grid md:grid-cols-5 gap-8 mb-12">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 font-bold text-2xl tracking-tight mb-6">
                        <Ticket className="w-8 h-8" />
                        <span>dashticket</span>
                      </div>
                      <p className="text-sm font-bold mb-4">Let's connect</p>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 bg-zinc-800 rounded flex items-center justify-center hover:bg-zinc-700 cursor-pointer transition-colors">f</div>
                        <div className="w-8 h-8 bg-zinc-800 rounded flex items-center justify-center hover:bg-zinc-700 cursor-pointer transition-colors">X</div>
                        <div className="w-8 h-8 bg-zinc-800 rounded flex items-center justify-center hover:bg-zinc-700 cursor-pointer transition-colors">in</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold mb-4">Get Help</h4>
                      <ul className="space-y-3 text-sm text-zinc-400">
                        <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-4">Looking For Help</h4>
                      <ul className="space-y-3 text-sm text-zinc-400">
                        <li><a href="#" className="hover:text-white transition-colors">Sell Tickets</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Where Are My Tickets?</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">My Account</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Accessible Tickets</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-4">Entertainment Guides</h4>
                      <ul className="space-y-3 text-sm text-zinc-400">
                        <li><a href="#" className="hover:text-white transition-colors">Festival Finder</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">West End Theatre</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Concerts & Tours</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Sport</a></li>
                      </ul>
                    </div>
                  </div>
                  <div className="border-t border-zinc-800 pt-8 text-xs text-zinc-500 flex flex-col md:flex-row justify-between items-center">
                    <p>© 2026 dashticket. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                      <a href="#" className="hover:text-white transition-colors">Purchase Policy</a>
                      <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                      <a href="#" className="hover:text-white transition-colors">Modern Slavery Statement</a>
                    </div>
                  </div>
                </div>
              </footer>
            </motion.div>
          ) : !isBooking ? (
            <motion.div
              key="artist-details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white"
            >
              {/* Hero Section */}
              <div className="relative h-[400px] bg-black text-white overflow-hidden">
                <div className="absolute inset-0 flex justify-end">
                  <img 
                    src={selectedEvent.image} 
                    alt={selectedEvent.name} 
                    className="h-full w-2/3 object-cover object-top opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent w-full"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
                  <div className="text-xs font-bold text-zinc-400 mb-8 flex items-center gap-2">
                    <a href="#" className="hover:underline">Home</a>
                    <span>/</span>
                    <a href="#" className="hover:underline">Music</a>
                    <span>/</span>
                    <a href="#" className="hover:underline">{selectedEvent.category}</a>
                    <span>/</span>
                    <span className="text-white">{selectedEvent.name} Tickets</span>
                  </div>
                  <p className="text-sm font-bold mb-2">{selectedEvent.category}</p>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">{selectedEvent.name} Tickets</h1>
                  <div className="flex items-center gap-4">
                    <button className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white/10 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 border border-white px-3 py-1.5 rounded text-sm font-bold">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>4.6</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-navigation */}
              <div className="border-b border-zinc-200 sticky top-16 bg-white z-10">
                <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 overflow-x-auto no-scrollbar">
                  {['CONCERTS', 'GALLERY', 'ABOUT', 'SETLISTS', 'REVIEWS', 'FANS ALSO VIEWED'].map((tab, idx) => (
                    <button 
                      key={tab}
                      className={`py-4 text-xs font-bold tracking-widest whitespace-nowrap ${idx === 0 ? 'border-b-4 border-black text-black' : 'text-zinc-500 hover:text-black'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
                {/* Left Column - Main Content */}
                <div className="flex-1 space-y-16">
                  
                  {/* Concerts Section */}
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold tracking-tight uppercase">CONCERTS</h2>
                        <span className="text-xl text-zinc-500">• 1 RESULTS</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-full border border-zinc-300 flex items-center justify-center hover:bg-zinc-50">
                          <List className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                          <Calendar className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
                      <div className="p-6 border-b border-zinc-200">
                        <div className="flex items-center gap-2 text-sm font-bold text-zinc-700 mb-6 border border-zinc-300 rounded inline-flex px-3 py-2 cursor-pointer hover:bg-zinc-50">
                          <Calendar className="w-4 h-4 text-[#026cdf]" />
                          <span>All Dates</span>
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </div>
                        <h3 className="text-xl font-bold">Concerts in United Kingdom</h3>
                      </div>
                      
                      <div className="divide-y divide-zinc-200">
                        {/* Single Event Row */}
                        <div className="p-6 flex flex-col md:flex-row md:items-center gap-6 hover:bg-zinc-50 transition-colors">
                          <div className="flex flex-col items-center justify-center w-16 h-16 bg-zinc-100 rounded">
                            <span className="text-xs font-bold text-zinc-500 uppercase">{new Date(selectedEvent.date).toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-xl font-bold">{new Date(selectedEvent.date).getDate()}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
                              <span>{new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'short' })} • 18:00</span>
                              <HelpCircle className="w-3 h-3" />
                            </div>
                            <h4 className="font-bold text-lg">{selectedEvent.venue}</h4>
                            <p className="text-zinc-500">{selectedEvent.name}</p>
                          </div>
                          <button 
                            onClick={handleFindTickets}
                            className="bg-[#026cdf] text-white font-bold px-8 py-3 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 w-full md:w-auto"
                          >
                            Find tickets <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* About Section */}
                  <section>
                    <h2 className="text-2xl font-bold tracking-tight uppercase mb-8 border-b-2 border-black pb-2 inline-block">ABOUT</h2>
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1 space-y-4 text-zinc-700">
                        <p className="font-bold text-lg text-black">A spectacular live performance you won't want to miss.</p>
                        <p>Experience the magic of {selectedEvent.name} live in concert. With a career spanning decades and countless hits, this is a show that promises to deliver unforgettable memories.</p>
                        <p>Join thousands of fans at {selectedEvent.venue} for an evening of incredible music, stunning visuals, and an atmosphere like no other.</p>
                        <button className="bg-black text-white font-bold px-6 py-2 rounded-full text-sm hover:bg-zinc-800 transition-colors mt-4 flex items-center gap-2">
                          Show less <ChevronUp className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="w-full md:w-1/3 aspect-square rounded-lg overflow-hidden">
                        <img src={selectedEvent.image} alt="About" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    </div>
                  </section>

                  {/* Fans Also Viewed Section */}
                  <section>
                    <h2 className="text-2xl font-bold tracking-tight uppercase mb-8 border-b-2 border-black pb-2 inline-block">FANS ALSO VIEWED</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { name: 'Lewis Capaldi', img: 'https://picsum.photos/seed/lewis/400/300' },
                        { name: 'Peter Kay', img: 'https://picsum.photos/seed/peter/400/300' },
                        { name: 'Harry Styles', img: 'https://picsum.photos/seed/harry/400/300' },
                        { name: 'James Arthur', img: 'https://picsum.photos/seed/james/400/300' },
                      ].map((artist, i) => (
                        <div key={i} className="group cursor-pointer">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3">
                            <img src={artist.img} alt={artist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                          </div>
                          <h4 className="font-bold group-hover:underline">{artist.name}</h4>
                        </div>
                      ))}
                    </div>
                  </section>

                </div>

                {/* Right Column - Sidebar */}
                <div className="w-full lg:w-80 space-y-8">
                  <div className="bg-zinc-100 h-[600px] flex items-center justify-center text-zinc-400 border border-zinc-200 rounded">
                    Advertisement
                  </div>
                </div>
              </div>
            </motion.div>
          ) : queueStatus === 'waiting' ? (
            <motion.div 
              key="waiting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto mt-12 px-6"
            >
              <div className="bg-white p-10 rounded-xl border border-zinc-200 shadow-lg text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#026cdf]"></div>
                
                <div className="w-16 h-16 bg-blue-50 text-[#026cdf] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8" />
                </div>
                
                <h2 className="text-2xl font-bold mb-4">You are in line</h2>
                <p className="text-zinc-500 mb-8 leading-relaxed">
                  Due to high demand for <strong>{selectedEvent.name}</strong>, you have been placed in a virtual waiting room. Please do not refresh this page.
                </p>
                
                <div className="bg-zinc-50 rounded-lg p-6 border border-zinc-100 mb-8">
                  <div className="text-5xl font-bold text-[#026cdf] mb-2">{queuePosition}</div>
                  <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">People ahead of you</p>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-4 border-blue-100 border-t-[#026cdf] rounded-full animate-spin"></div>
                </div>
              </div>
            </motion.div>
          ) : !order ? (
            <motion.div 
              key="booking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10"
            >
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex gap-6 items-center">
                  <img src={selectedEvent.image} alt={selectedEvent.name} className="w-32 h-32 object-cover rounded-md" referrerPolicy="no-referrer" />
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">{selectedEvent.category}</p>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">{selectedEvent.name}</h1>
                    <p className="text-zinc-500 flex items-center gap-2 font-medium">
                      <MapPin className="w-4 h-4" /> {selectedEvent.venue} &bull; {new Date(selectedEvent.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-2 rounded-xl border border-zinc-200 shadow-sm">
                  <Venue3D 
                    seats={seats} 
                    selectedSeat={selectedSeat} 
                    onSeatSelect={handleSeatSelect} 
                    userId={SESSION_USER_ID}
                  />

                  <div className="mt-6 mb-4 flex justify-center gap-6 text-sm font-medium">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-emerald-500 border border-emerald-600"></div><span className="text-zinc-600">Available</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-amber-500 border border-amber-600"></div><span className="text-zinc-600">Locked</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-zinc-400 border border-zinc-500"></div><span className="text-zinc-600">Sold</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-[#026cdf] border border-blue-700"></div><span className="text-zinc-600">Selected</span></div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 sticky top-24">
                  <h3 className="text-lg font-bold mb-4">Your Selection</h3>
                  
                  {!selectedSeat ? (
                    <div className="text-center py-12 text-zinc-500 bg-zinc-50 rounded-lg border border-dashed border-zinc-300">
                      <Ticket className="w-8 h-8 mx-auto mb-3 text-zinc-400" />
                      <p className="font-medium">Select a seat from the 3D map to continue.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
                        <div>
                          <p className="text-sm text-zinc-500 font-medium">Seat</p>
                          <p className="text-2xl font-mono font-bold text-[#026cdf]">{selectedSeat.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-zinc-500 font-medium">Price</p>
                          <p className="text-xl font-bold">$45.00</p>
                        </div>
                      </div>

                      <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm flex items-start gap-2 border border-amber-200">
                        <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                        <p className="font-medium">Seat locked for 5 minutes. Please complete your purchase.</p>
                      </div>

                      <form onSubmit={handleCheckout} className="space-y-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-bold text-zinc-700 mb-1">Email Address</label>
                          <input 
                            type="email" 
                            id="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-md border border-zinc-300 focus:ring-2 focus:ring-[#026cdf] focus:border-transparent outline-none transition-all font-medium"
                            placeholder="you@example.com"
                          />
                        </div>
                        <button 
                          type="submit" 
                          disabled={loading || !email}
                          className="w-full bg-[#026cdf] text-white font-bold py-3.5 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                          {loading ? 'Processing...' : 'Complete Purchase'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="ticket"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto py-12 px-6"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">You're going!</h1>
                <p className="text-zinc-500 font-medium">Your ticket has been sent to {order.email}</p>
              </div>

              <div className="bg-white rounded-xl border border-zinc-200 shadow-lg overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#026cdf]"></div>
                
                <div className="p-8 pb-6 border-b border-dashed border-zinc-300 relative">
                  <div className="absolute -left-3 -bottom-3 w-6 h-6 bg-zinc-50 rounded-full border-r border-zinc-200"></div>
                  <div className="absolute -right-3 -bottom-3 w-6 h-6 bg-zinc-50 rounded-full border-l border-zinc-200"></div>
                  
                  <h2 className="text-2xl font-bold mb-1">{selectedEvent.name}</h2>
                  <p className="text-zinc-500 mb-6 font-medium">{selectedEvent.venue}</p>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold mb-1">Date</p>
                      <p className="font-bold">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold mb-1">Seat</p>
                      <p className="text-3xl font-mono font-bold text-[#026cdf]">{order.seatId}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 pt-6 bg-zinc-50 flex flex-col items-center justify-center">
                  <img src={order.qrCode} alt="Ticket QR Code" className="w-48 h-48 mix-blend-multiply" />
                  <p className="mt-4 text-xs text-zinc-400 font-mono font-bold">ORDER #{order.id.split('-')[0].toUpperCase()}</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => {
                    setSelectedEvent(null);
                    setSelectedSeat(null);
                    setOrder(null);
                    setEmail('');
                  }}
                  className="text-[#026cdf] font-bold hover:text-blue-800 transition-colors"
                >
                  Book another ticket
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-xl text-white font-medium z-50 flex items-center gap-3 ${
              toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
            }`}
          >
            {toast.type === 'error' ? <HelpCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
