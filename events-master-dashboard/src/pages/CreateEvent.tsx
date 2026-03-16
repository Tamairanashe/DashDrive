import { useState, useEffect } from 'react';
import { Check, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const steps = [
  { id: '01', name: 'Event Details', status: 'current' },
  { id: '02', name: 'Venue Setup', status: 'upcoming' },
  { id: '03', name: 'Ticket Types', status: 'upcoming' },
];

interface Venue {
  id: string;
  name: string;
}

export default function CreateEvent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Music',
    description: '',
    date: '',
    time: '',
    venueId: '',
    address: '',
    reservedSeating: false,
    ticketPrice: 50,
    ticketQuantity: 1000
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  async function fetchVenues() {
    const { data, error } = await supabase.from('venues').select('id, name');
    if (data) setVenues(data);
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      publishEvent();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  async function publishEvent() {
    setIsSubmitting(true);
    try {
      // 1. Combine date and time
      const startTime = `${formData.date}T${formData.time}:00`;

      // 2. Insert Event
      const { data: event, error } = await supabase
        .from('events')
        .insert({
          title: formData.title,
          description: formData.description,
          start_time: startTime,
          venue_id: formData.venueId,
          status: 'UPCOMING',
          image_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80'
        })
        .select()
        .single();

      if (error) throw error;

      // 3. Create Event Seats (Standard 7x8 Grid)
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
      const seatsPerRow = 8;
      const seatInserts = [];

      for (const row of rows) {
        for (let i = 1; i <= seatsPerRow; i++) {
          seatInserts.push({
            event_id: event.id,
            seat_id: `${row}${i}`,
            section: 'General',
            price: formData.ticketPrice,
            status: 'AVAILABLE'
          });
        }
      }

      const { error: seatsError } = await supabase
        .from('event_seats')
        .insert(seatInserts);

      if (seatsError) throw seatsError;

      alert('Event published successfully with ' + seatInserts.length + ' seats!');
      navigate('/events');
    } catch (err) {
      console.error('Error publishing event:', err);
      alert('Failed to publish event. Please check console.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Create New Event</h1>
      </div>

      {/* Progress Bar */}
      <nav aria-label="Progress">
        <ol role="list" className="border border-gray-300 rounded-md divide-y divide-gray-300 md:flex md:divide-y-0">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="relative md:flex-1 md:flex">
              {stepIdx < currentStep ? (
                <div className="group flex items-center w-full">
                  <span className="px-6 py-4 flex items-center text-sm font-medium">
                    <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-full group-hover:bg-indigo-800">
                      <Check className="w-6 h-6 text-white" aria-hidden="true" />
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-900">{step.name}</span>
                  </span>
                </div>
              ) : stepIdx === currentStep ? (
                <div className="px-6 py-4 flex items-center text-sm font-medium" aria-current="step">
                  <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-indigo-600 rounded-full">
                    <span className="text-indigo-600">{step.id}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-indigo-600">{step.name}</span>
                </div>
              ) : (
                <div className="group flex items-center">
                  <span className="px-6 py-4 flex items-center text-sm font-medium">
                    <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                      <span className="text-gray-500 group-hover:text-gray-900">{step.id}</span>
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">{step.name}</span>
                  </span>
                </div>
              )}

              {stepIdx !== steps.length - 1 ? (
                <>
                  <div className="hidden md:block absolute top-0 right-0 h-full w-5" aria-hidden="true">
                    <svg
                      className="h-full w-full text-gray-300"
                      viewBox="0 0 22 80"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 -2L20 40L0 82"
                        vectorEffect="non-scaling-stroke"
                        stroke="currentcolor"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </>
              ) : null}
            </li>
          ))}
        </ol>
      </nav>

      {/* Form Content */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Event Details</h3>
                <p className="mt-1 text-sm text-gray-500">Provide basic information about your event.</p>
              </div>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Event Title
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Summer Music Festival"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <div className="mt-1">
                    <select
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option>Music</option>
                      <option>Business</option>
                      <option>Food & Drink</option>
                      <option>Arts</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      rows={3}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <div className="mt-1">
                    <input
                      type="time"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Venue Setup</h3>
                <p className="mt-1 text-sm text-gray-500">Where is your event taking place?</p>
              </div>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="venue-name" className="block text-sm font-medium text-gray-700">
                    Select Venue
                  </label>
                  <div className="mt-1">
                    <select
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={formData.venueId}
                      onChange={(e) => setFormData({...formData, venueId: e.target.value})}
                    >
                      <option value="">Select a venue...</option>
                      {venues.map(v => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address / Details
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="reserved-seating"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={formData.reservedSeating}
                        onChange={(e) => setFormData({...formData, reservedSeating: e.target.checked})}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="reserved-seating" className="font-medium text-gray-700">
                        Enable Reserved Seating
                      </label>
                      <p className="text-gray-500">Allow attendees to pick specific seats from a venue map.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Ticket Types</h3>
                <p className="mt-1 text-sm text-gray-500">Define the tickets available for purchase.</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-4 sm:gap-x-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Ticket Name</label>
                    <input type="text" defaultValue="General Admission" className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                    <input 
                      type="number" 
                      className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                      value={formData.ticketPrice}
                      onChange={(e) => setFormData({...formData, ticketPrice: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input 
                      type="number" 
                      className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                      value={formData.ticketQuantity}
                      onChange={(e) => setFormData({...formData, ticketQuantity: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Add Another Ticket Type
              </button>
            </div>
          )}
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between rounded-b-lg">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0 || isSubmitting}
            className={`inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Back
          </button>
          <button
            type="button"
            onClick={nextStep}
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              currentStep === steps.length - 1 ? 'Publish Event' : 'Next'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
