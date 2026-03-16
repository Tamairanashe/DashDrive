import { Plus, Calendar as CalendarIcon, MapPin, Users, MoreVertical, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Event {
  id: string;
  title: string;
  start_time: string;
  venues: {
    name: string;
  };
  status: string;
  image_url: string;
  // Mocking these for now as they are calculated or in separate tables
  ticketsSold?: number;
  capacity?: number;
  revenue?: number;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*, venues(name)')
        .order('start_time', { ascending: true });

      if (error) throw error;
      
      // Transform data to match UI expectations if necessary
      const transformedEvents = (data || []).map(event => ({
        ...event,
        ticketsSold: Math.floor(Math.random() * 1000), // Placeholder until orders table is linked
        capacity: 5000,
        revenue: Math.floor(Math.random() * 50000)
      }));

      setEvents(transformedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
        <Link
          to="/events/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Create Event
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white shadow px-4 py-3 rounded-lg flex items-center justify-between">
        <div className="flex space-x-4">
          <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option>All Statuses</option>
            <option>On Sale</option>
            <option>Draft</option>
            <option>Past</option>
          </select>
          <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option>All Venues</option>
          </select>
        </div>
        <div className="text-sm text-gray-500">
          Showing {events.length} events
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {events.map((event) => (
              <li key={event.id}>
                <div className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6 flex items-center">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <img className="h-16 w-16 rounded object-cover" src={event.image_url || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=400&q=80'} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-indigo-600 truncate">{event.title}</p>
                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              event.status === 'UPCOMING' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {event.status}
                            </span>
                          </div>
                          <div className="mt-2 flex">
                            <div className="flex items-center text-sm text-gray-500">
                              <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                              <p>{new Date(event.start_time).toLocaleDateString()} • {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div className="ml-4 flex items-center text-sm text-gray-500">
                              <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                              <p>{event.venues?.name}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                        <div className="flex items-center space-x-8">
                          <div className="text-sm">
                            <p className="text-gray-900 font-medium">{event.ticketsSold} / {event.capacity}</p>
                            <p className="text-gray-500">Tickets Sold</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-900 font-medium">${(event.revenue || 0).toLocaleString()}</p>
                            <p className="text-gray-500">Revenue</p>
                          </div>
                          <button className="text-gray-400 hover:text-gray-500">
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {events.length === 0 && (
              <li className="p-12 text-center text-gray-500">
                No events found. Start by creating your first event!
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
