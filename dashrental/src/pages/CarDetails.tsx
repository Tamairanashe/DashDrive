import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Star, MapPin, Check, ChevronLeft, Heart, Share, Calendar, ShieldCheck } from 'lucide-react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';
import { Car } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/style.css';
import { format, parse } from 'date-fns';

export function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [hostProfile, setHostProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [bookedDates, setBookedDates] = useState<{from: Date, to: Date}[]>([]);
  
  const isBookingSuccess = location.state?.bookingSuccess;
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [monthsToShow, setMonthsToShow] = useState(window.innerWidth > 768 ? 2 : 1);

  useEffect(() => {
    const handleResize = () => {
      setMonthsToShow(window.innerWidth > 768 ? 2 : 1);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCarAndBookings = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'cars', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const carData = { id: docSnap.id, ...docSnap.data() } as Car;
          setCar(carData);
          
          // Fetch host profile
          if (carData.hostId) {
            const hostRef = doc(db, 'users', carData.hostId);
            const hostSnap = await getDoc(hostRef);
            if (hostSnap.exists()) {
              setHostProfile(hostSnap.data());
            }
          }
        }

        // Fetch bookings for availability calendar
        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef, where('carId', '==', id), where('status', 'in', ['pending', 'confirmed']));
        const querySnapshot = await getDocs(q);
        
        const dates: {from: Date, to: Date}[] = [];
        querySnapshot.forEach((doc) => {
          const booking = doc.data();
          const startStr = booking.startDate.split('T')[0];
          const endStr = booking.endDate.split('T')[0];
          dates.push({
            from: parse(startStr, 'yyyy-MM-dd', new Date()),
            to: parse(endStr, 'yyyy-MM-dd', new Date())
          });
        });
        setBookedDates(dates);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarAndBookings();
  }, [id]);

  const handleContinue = async () => {
    if (!user) {
      toast.error('Please log in to book a car');
      return;
    }
    if (!startDate || !endDate) {
      toast.error('Please select trip dates');
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      toast.error('End date must be after start date');
      return;
    }
    
    setCheckingAvailability(true);
    try {
      // Check for overlapping bookings
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('carId', '==', id), where('status', 'in', ['pending', 'confirmed']));
      const querySnapshot = await getDocs(q);
      
      const requestedStart = new Date(startDate).getTime();
      const requestedEnd = new Date(endDate).getTime();
      
      let isAvailable = true;
      querySnapshot.forEach((doc) => {
        const booking = doc.data();
        const bookingStart = new Date(booking.startDate).getTime();
        const bookingEnd = new Date(booking.endDate).getTime();
        
        // Check if requested dates overlap with existing booking
        if (requestedStart < bookingEnd && requestedEnd > bookingStart) {
          isAvailable = false;
        }
      });
      
      if (!isAvailable) {
        toast.error('Car is not available for the selected dates');
        setCheckingAvailability(false);
        return;
      }
      
      // Calculate days
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      navigate(`/checkout/${id}`, {
        state: { startDate, endDate, days, car }
      });
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Failed to check availability');
    } finally {
      setCheckingAvailability(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!car) {
    return <div className="p-12 text-center text-xl text-gray-500">Car not found</div>;
  }

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-0">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 bg-white border-b px-4 py-3 flex justify-between items-center">
        <Link to="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Share className="w-5 h-5" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={cn("w-5 h-5", isFavorite && "fill-red-500 text-red-500")} />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto md:px-6 md:pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 md:rounded-2xl overflow-hidden h-[40vh] md:h-[60vh]">
          <div className="w-full h-full">
            <img src={car.images[0] || 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1000'} alt={car.model} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-4">
            <img src={car.images[1] || 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&q=80&w=1000'} alt={car.model} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="bg-gray-200 flex items-center justify-center relative group cursor-pointer">
              <img src={car.images[0] || 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1000'} alt={car.model} className="w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity" referrerPolicy="no-referrer" />
              <span className="absolute text-white font-semibold text-lg">View all photos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          
          {/* Header Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {car.make} {car.model} {car.year}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-indigo-600 text-indigo-600" />
                <span className="font-semibold text-gray-900">{car.rating || 'New'}</span>
                <span>({car.trips || 0} trips)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{car.location}</span>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Host Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {hostProfile?.photoURL || car.host?.avatar ? (
                  <img src={hostProfile?.photoURL || car.host?.avatar} alt={hostProfile?.displayName || car.host?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-xl font-bold text-gray-500">{(hostProfile?.displayName || car.host?.name || 'H').charAt(0)}</span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Hosted by {hostProfile?.displayName || car.host?.name || 'Host'}</h3>
                <p className="text-sm text-gray-500">Joined {car.host?.joined || 'Recently'}</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{car.host?.responseRate || 100}% response rate</p>
              <p className="text-sm text-gray-500">Responds {car.host?.responseTime || 'quickly'}</p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {car.description}
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                {car.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-indigo-600" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <hr className="border-gray-200" />

          {/* Availability Calendar */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Availability</h2>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-x-auto">
              <DayPicker
                mode="range"
                disabled={[
                  { before: new Date() },
                  ...bookedDates
                ]}
                selected={{
                  from: startDate ? parse(startDate, 'yyyy-MM-dd', new Date()) : undefined,
                  to: endDate ? parse(endDate, 'yyyy-MM-dd', new Date()) : undefined
                }}
                onSelect={(range) => {
                  if (range?.from) setStartDate(format(range.from, 'yyyy-MM-dd'));
                  else setStartDate('');
                  
                  if (range?.to) setEndDate(format(range.to, 'yyyy-MM-dd'));
                  else setEndDate('');
                }}
                numberOfMonths={monthsToShow}
                className="font-sans mx-auto"
              />
            </div>
          </div>

        </div>

        {/* Booking Sidebar */}
        <div className="hidden lg:block">
          {isBookingSuccess ? (
            <div className="sticky top-24 bg-white border border-green-200 rounded-2xl p-6 shadow-xl text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-6">Your trip has been successfully booked.</p>
              <Link to="/trips" className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition-colors mb-4">
                View your bookings
              </Link>
              <button onClick={() => navigate('.', { replace: true, state: {} })} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                Book another trip
              </button>
            </div>
          ) : (
            <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-2xl font-bold text-gray-900">${car.pricePerDay}</span>
                  <span className="text-gray-500"> / day</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-indigo-600 text-indigo-600" />
                  <span className="font-semibold">{car.rating || 'New'}</span>
                  <span className="text-gray-500">({car.trips || 0})</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="border border-gray-300 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-2 border-b border-gray-300">
                    <div className="p-3 border-r border-gray-300">
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Trip Start</label>
                      <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full text-sm outline-none bg-transparent" 
                      />
                    </div>
                    <div className="p-3">
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Trip End</label>
                      <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        className="w-full text-sm outline-none bg-transparent" 
                      />
                    </div>
                  </div>
                  <div className="p-3">
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Pickup & Return</label>
                    <select className="w-full text-sm outline-none bg-transparent">
                      <option>{car.location}</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleContinue}
                disabled={checkingAvailability}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-4 rounded-xl transition-colors mb-4 flex justify-center items-center"
              >
                {checkingAvailability ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Continue'
                )}
              </button>

              <div className="flex items-start gap-3 text-sm text-gray-500">
                <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p>Insurance via Travelers. You won't be charged until the host confirms.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 pb-safe flex justify-between items-center z-50">
        {isBookingSuccess ? (
          <>
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <Check className="w-5 h-5" /> Confirmed
            </div>
            <Link to="/trips" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              View Bookings
            </Link>
          </>
        ) : (
          <>
            <div>
              <span className="text-xl font-bold text-gray-900">${car.pricePerDay}</span>
              <span className="text-gray-500 text-sm"> / day</span>
              <div className="flex items-center gap-1 text-xs mt-1">
                <Star className="w-3 h-3 fill-indigo-600 text-indigo-600" />
                <span className="font-semibold">{car.rating || 'New'}</span>
              </div>
            </div>
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                toast('Please select dates at the top of the page', { icon: '📅' });
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Book
            </button>
          </>
        )}
      </div>
    </div>
  );
}
