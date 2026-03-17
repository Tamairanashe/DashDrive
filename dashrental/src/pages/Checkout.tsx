import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';
import { ShieldCheck, CreditCard, Calendar, MapPin } from 'lucide-react';
import { Car } from '../data/mockData';
import { parse } from 'date-fns';

export function Checkout() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);

  const state = location.state as { startDate: string, endDate: string, days: number, car: Car } | null;

  if (!state || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Session</h2>
          <button onClick={() => navigate('/')} className="text-indigo-600 hover:underline">Return Home</button>
        </div>
      </div>
    );
  }

  const { startDate, endDate, days, car } = state;
  const tripPrice = car.pricePerDay * days;
  const tripFee = Math.round(tripPrice * 0.1); // 10% fee
  const total = tripPrice + tripFee;

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create booking in Firestore
      const bookingData = {
        carId: car.id,
        guestId: user.uid,
        hostId: car.hostId || 'mock-host-id',
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalPrice: total,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'bookings'), bookingData);
      
      toast.success('Booking confirmed! Email sent to you and the host.');
      navigate(`/car/${car.id}`, { state: { bookingSuccess: true } });
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process booking');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column - Details */}
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Trip Details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{parse(startDate, 'yyyy-MM-dd', new Date()).toLocaleDateString()} - {parse(endDate, 'yyyy-MM-dd', new Date()).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">{days} days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Pickup & Return</p>
                  <p className="text-sm text-gray-500">{car.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              Payment Method
            </h2>
            <div className="p-4 border border-gray-300 rounded-xl flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-[10px] font-bold italic">VISA</div>
                <span className="font-medium text-gray-900">•••• 4242</span>
              </div>
              <span className="text-sm text-indigo-600 font-medium cursor-pointer">Edit</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">This is a mock payment gateway. No real charges will be made.</p>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
            <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
              <img src={car.images[0] || 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1000'} alt={car.model} className="w-24 h-20 object-cover rounded-lg" referrerPolicy="no-referrer" />
              <div>
                <h3 className="font-bold text-gray-900">{car.make} {car.model} {car.year}</h3>
                <p className="text-sm text-gray-500">{car.rating || 'New'} • {car.trips || 0} trips</p>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Price breakdown</h2>
            
            <div className="space-y-3 text-gray-600 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between">
                <span>${car.pricePerDay} x {days} days</span>
                <span>${tripPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Trip fee</span>
                <span>${tripFee}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">${total}</span>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={processing}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-4 rounded-xl transition-colors mb-4 flex justify-center items-center"
            >
              {processing ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Confirm and pay'
              )}
            </button>

            <div className="flex items-start gap-3 text-sm text-gray-500">
              <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p>You agree to the Terms of Service and Cancellation Policy.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
