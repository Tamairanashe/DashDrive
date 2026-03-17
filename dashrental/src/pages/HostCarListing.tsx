import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Car, 
  Image as ImageIcon, 
  MapPin, 
  DollarSign, 
  List as ListIcon, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Info,
  Sparkles,
  Zap,
  Globe,
  Camera,
  ShieldCheck,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function HostCarListing() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    location: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'Sedan',
    description: '',
    features: '',
    images: '',
    pricePerDay: 50,
  });

  if (!user || !profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6">
           <ShieldCheck className="w-10 h-10 text-gray-200" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Auth Required</h2>
        <p className="text-gray-400 font-medium">Please sign in to list your vehicle assets.</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep(s => Math.min(6, s + 1));
  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const carData = {
        hostId: user.uid,
        make: formData.make,
        model: formData.model,
        year: Number(formData.year),
        type: formData.type,
        pricePerDay: Number(formData.pricePerDay),
        description: formData.description,
        location: formData.location,
        images: formData.images.split(',').map(url => url.trim()).filter(Boolean),
        features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
        createdAt: new Date().toISOString(),
        isSnoozed: false,
        rating: 0,
        trips: 0,
        distance: 'Local Hub',
        host: {
          name: profile.displayName || 'Host',
          avatar: profile.photoURL || '',
          joined: 'Dec 2023',
          responseRate: 100,
          responseTime: 'within an hour'
        }
      };

      const docRef = await addDoc(collection(db, 'cars'), carData);
      toast.success('Asset published successfully!');
      navigate(`/car/${docRef.id}`);
    } catch (error) {
      console.error('Error listing car:', error);
      toast.error('Failed to publish asset');
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    { id: 1, title: 'Location', icon: MapPin },
    { id: 2, title: 'Spec', icon: Car },
    { id: 3, title: 'Details', icon: ListIcon },
    { id: 4, title: 'Media', icon: Camera },
    { id: 5, title: 'Pricing', icon: DollarSign },
    { id: 6, title: 'Review', icon: Globe },
  ];

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.location.trim().length > 0;
      case 2: return formData.make && formData.model && formData.year;
      case 3: return formData.description.trim().length > 10;
      case 4: return formData.images.trim().length > 0;
      case 5: return formData.pricePerDay > 0;
      default: return true;
    }
  };

  const currentStep = steps.find(s => s.id === step);

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Onboarding</span>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Listing Wizard</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none">
            New <span className="text-indigo-600">Listing</span>
          </h1>
          <p className="text-gray-500 mt-4 font-medium text-lg">Deploy a new vehicle to the global marketplace.</p>
        </motion.div>

        <div className="bg-white p-2 rounded-3xl border border-gray-100 shadow-xl flex items-center gap-1 overflow-x-auto no-scrollbar">
          {steps.map((s) => (
            <div
              key={s.id}
              className={cn(
                "px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shrink-0",
                step === s.id ? "bg-indigo-600 text-white shadow-lg" : 
                step > s.id ? "text-indigo-600 bg-indigo-50" : "text-gray-300"
              )}
            >
              <s.icon className="w-3 h-3" />
              {s.title}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            <div className="p-12 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  {step === 1 && (
                    <div className="space-y-8">
                       <h2 className="text-3xl font-black text-gray-900 tracking-tight">Geographic Hub</h2>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Hub Address or City</label>
                         <div className="relative">
                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-600 w-5 h-5" />
                            <input 
                              type="text" 
                              name="location" 
                              value={formData.location} 
                              onChange={handleChange} 
                              placeholder="e.g. London, UK" 
                              className="w-full pl-16 pr-6 py-6 rounded-2xl bg-gray-50 border border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-gray-900" 
                            />
                         </div>
                       </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-8">
                       <h2 className="text-3xl font-black text-gray-900 tracking-tight">Technical Specs</h2>
                       <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-3">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Manufacturer</label>
                           <input type="text" name="make" value={formData.make} onChange={handleChange} placeholder="e.g. Porsche" className="w-full p-5 rounded-2xl bg-gray-50 border border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-gray-900" />
                         </div>
                         <div className="space-y-3">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Model Variant</label>
                           <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="e.g. Taycan" className="w-full p-5 rounded-2xl bg-gray-50 border border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-gray-900" />
                         </div>
                         <div className="space-y-3">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Build Year</label>
                           <input type="number" name="year" value={formData.year} onChange={handleChange} className="w-full p-5 rounded-2xl bg-gray-50 border border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-gray-900" />
                         </div>
                         <div className="space-y-3">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Segment</label>
                           <select name="type" value={formData.type} onChange={handleChange} className="w-full p-5 rounded-2xl bg-gray-50 border border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-gray-900 bg-white">
                             <option>Sedan</option>
                             <option>SUV</option>
                             <option>Sport</option>
                             <option>Electric</option>
                             <option>Luxury</option>
                           </select>
                         </div>
                       </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-8">
                       <h2 className="text-3xl font-black text-gray-900 tracking-tight">Market Positioning</h2>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Public Description</label>
                         <textarea 
                           name="description" 
                           value={formData.description} 
                           onChange={handleChange} 
                           rows={6} 
                           placeholder="Capture the essence of this vehicle..." 
                           className="w-full p-6 rounded-2xl bg-gray-50 border border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-gray-900 resize-none" 
                         />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Features (CSV)</label>
                         <input 
                           type="text" 
                           name="features" 
                           value={formData.features} 
                           onChange={handleChange} 
                           placeholder="WiFi, Heated Seats, Autopilot..." 
                           className="w-full p-5 rounded-2xl bg-gray-50 border border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-gray-900" 
                         />
                       </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-8">
                       <h2 className="text-3xl font-black text-gray-900 tracking-tight">Media Assets</h2>
                       <div className="p-8 border-4 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/50 flex flex-col items-center justify-center text-center">
                          <Camera className="w-12 h-12 text-indigo-600 mb-4" />
                          <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Source Image Repository</h4>
                          <p className="text-xs font-medium text-gray-400 max-w-xs mb-6">Provide direct URLs to high-fidelity photography of your asset.</p>
                          <textarea 
                            name="images" 
                            value={formData.images} 
                            onChange={handleChange} 
                            rows={4} 
                            placeholder="https://images.unsplash.com/..." 
                            className="w-full p-6 rounded-2xl bg-white border border-gray-100 focus:border-indigo-600 outline-none transition-all font-mono text-xs text-indigo-600" 
                          />
                       </div>
                    </div>
                  )}

                  {step === 5 && (
                    <div className="space-y-8">
                       <h2 className="text-3xl font-black text-gray-900 tracking-tight">Financial Strategy</h2>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Base Daily Rate (USD)</label>
                         <div className="relative">
                            <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600 w-6 h-6" />
                            <input 
                              type="number" 
                              name="pricePerDay" 
                              value={formData.pricePerDay} 
                              onChange={handleChange} 
                              className="w-full pl-16 pr-6 py-8 rounded-2xl bg-gray-50 border border-transparent focus:border-emerald-600 outline-none transition-all font-black text-4xl text-gray-900" 
                            />
                         </div>
                       </div>
                    </div>
                  )}

                  {step === 6 && (
                    <div className="space-y-8">
                       <h2 className="text-3xl font-black text-gray-900 tracking-tight">Final Certification</h2>
                       <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                          <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />
                          <div className="grid grid-cols-2 gap-8 relative z-10">
                            <div>
                               <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1">Vehicle</p>
                               <p className="text-xl font-black">{formData.year} {formData.make} {formData.model}</p>
                            </div>
                            <div>
                               <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1">Pricing</p>
                               <p className="text-xl font-black">${formData.pricePerDay}/day</p>
                            </div>
                            <div className="col-span-2">
                               <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1">Hub Location</p>
                               <p className="text-xl font-black">{formData.location}</p>
                            </div>
                          </div>
                       </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="p-10 border-t border-gray-50 flex justify-between items-center bg-gray-50/20">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1 || saving}
                className={cn(
                  "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                  step === 1 ? "opacity-30 cursor-not-allowed" : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                Go Back
              </button>

              <div className="flex gap-4">
                {step < 6 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className={cn(
                      "px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all flex items-center gap-2",
                      !isStepValid() ? "bg-gray-100 text-gray-300 shadow-none" : "bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700 active:scale-95"
                    )}
                  >
                    Next Logic <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-600 text-white shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-2"
                  >
                    {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" /> : <Zap className="w-4 h-4 fill-current" />}
                    Finalise & Deploy
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
           <div className="bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <LayoutGrid className="absolute -top-4 -left-4 w-32 h-32 text-white/5" />
              <h3 className="text-xl font-black mb-4 tracking-tight">Onboarding Guidance</h3>
              <ul className="space-y-4">
                 {[
                   'Ensure at least 5 landscape photos for 20% more bookings.',
                   'Detail explicit maintenance history in the description.',
                   'Prices are automatically optimized but can be overridden.',
                   'Your host profile is automatically linked to this asset.'
                 ].map((tip, i) => (
                   <li key={i} className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} />
                      </div>
                      <p className="text-xs font-medium text-gray-400 leading-relaxed">{tip}</p>
                   </li>
                 ))}
              </ul>
           </div>

           <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">Safety First</h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Protection</p>
                 </div>
              </div>
              <p className="text-xs font-medium text-gray-500 leading-relaxed">
                 Every listing on DashRental is covered by our $1M liability policy and 24/7 roadside assistance. You are in safe hands.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
