import React, { useState, useEffect } from 'react';
import { Car, Calendar, MapPin } from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { parse } from 'date-fns';

interface BookingWithCar {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
  car: any;
}

export function Trips() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingWithCar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'bookings'), where('guestId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const bookingsData = await Promise.all(
          querySnapshot.docs.map(async (bookingDoc) => {
            const data = bookingDoc.data();
            const carDoc = await getDoc(doc(db, 'cars', data.carId));
            return {
              id: bookingDoc.id,
              ...data,
              car: carDoc.exists() ? { id: carDoc.id, ...carDoc.data() } : null
            } as BookingWithCar;
          })
        );
        
        // Sort by start date (newest first)
        bookingsData.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-500">You need to be logged in to view your trips.</p>
        </div>
      </div>
    );
  }

  const upcomingTrips = bookings.filter(b => parse(b.endDate.split('T')[0], 'yyyy-MM-dd', new Date()) >= new Date(new Date().setHours(0,0,0,0)));
  const pastTrips = bookings.filter(b => parse(b.endDate.split('T')[0], 'yyyy-MM-dd', new Date()) < new Date(new Date().setHours(0,0,0,0)));

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Trips</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex gap-6">
            <button className="text-sm font-semibold text-indigo-600 border-b-2 border-indigo-600 pb-4 -mb-4">Booked</button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900 pb-4 -mb-4 transition-colors">History</button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Trips</h2>
                
                {upcomingTrips.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 mb-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Car className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming trips</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">You don't have any booked trips right now. Find a car and hit the road!</p>
                    <Link to="/" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors inline-block">
                      Explore cars
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6 mb-12">
                    {upcomingTrips.map(trip => (
                      <TripCard key={trip.id} trip={trip} />
                    ))}
                  </div>
                )}

                <h2 className="text-xl font-semibold text-gray-900 mb-6 mt-12">Past Trips</h2>
                
                {pastTrips.length === 0 ? (
                  <p className="text-gray-500">No past trips found.</p>
                ) : (
                  <div className="space-y-6">
                    {pastTrips.map(trip => (
                      <TripCard key={trip.id} trip={trip} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TripCard({ trip, key }: { trip: BookingWithCar, key?: React.Key }) {
  if (!trip.car) return null;
  
  const isPast = new Date(trip.endDate) < new Date();

  return (
    <div className="flex flex-col md:flex-row gap-6 border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
        <img src={trip.car.images?.[0] || 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1000'} alt={trip.car.model} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900">{trip.car.make} {trip.car.model} {trip.car.year}</h3>
            <span className={`text-xs font-semibold px-2 py-1 rounded-md uppercase tracking-wider ${isPast ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-800'}`}>
              {isPast ? 'Completed' : trip.status}
            </span>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{parse(trip.startDate.split('T')[0], 'yyyy-MM-dd', new Date()).toLocaleDateString()} - {parse(trip.endDate.split('T')[0], 'yyyy-MM-dd', new Date()).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{trip.car.location}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex gap-3">
          <button className="flex-1 md:flex-none border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors text-sm">
            View receipt
          </button>
          <Link to={`/car/${trip.car.id}`} className="flex-1 md:flex-none bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-4 py-2 rounded-lg transition-colors text-sm text-center">
            Book again
          </Link>
        </div>
      </div>
    </div>
  );
}
