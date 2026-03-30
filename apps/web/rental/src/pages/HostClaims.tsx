import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Plus, 
  FileText, 
  Camera, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Zap,
  DollarSign
} from 'lucide-react';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

interface Claim {
  id: string;
  vehicle: string;
  tripId: string;
  date: string;
  category: string;
  status: 'Open' | 'Under Review' | 'Resolution Paid' | 'Closed';
  amount: number;
}

const MOCK_CLAIMS: Claim[] = [
  { id: '1', vehicle: 'Tesla Model 3', tripId: 'TR-8821', date: '2024-03-10', category: 'Exterior Dent', status: 'Under Review', amount: 450 },
  { id: '2', vehicle: 'BMW M4', tripId: 'TR-7712', date: '2024-02-15', category: 'Tire Damage', status: 'Resolution Paid', amount: 280 },
];

export function HostClaims() {
  const [claims] = useState<Claim[]>(MOCK_CLAIMS);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Claims & Protection</span>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Trust & Safety Platform</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none">
            Damage <span className="text-red-600">Reports</span>
          </h1>
          <p className="text-gray-500 mt-4 font-medium text-lg">Report incidents and track your protection payouts.</p>
        </motion.div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsReportModalOpen(true)}
          className="bg-gray-900 text-white px-8 py-5 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-2xl shadow-gray-200"
        >
          <Plus className="w-5 h-5" />
          Report New Damage
        </motion.button>
      </div>

      {/* Trust Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Protection Plan', value: 'Premier Plus', icon: ShieldCheck, color: 'indigo', detail: '80% Earning Share' },
          { label: 'Claims Resolved', value: '12', icon: CheckCircle2, color: 'emerald', detail: 'Avg. 4 days' },
          { label: 'Recovered funds', value: '$3,420', icon: DollarSign, color: 'amber', detail: 'Lifetime total' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6"
          >
            <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center ring-1 ring-${stat.color}-100`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
              <p className={`text-[10px] font-bold text-${stat.color}-600 uppercase tracking-widest mt-1`}>{stat.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Claims List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Claims</h2>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-white text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100 italic">Filter by Date</span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-50">
          {claims.map((claim, i) => (
            <motion.div 
              key={claim.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="p-8 hover:bg-gray-50/50 transition-all group flex flex-col sm:flex-row gap-8 items-start sm:items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:shadow-md transition-all",
                  claim.status === 'Under Review' ? "bg-amber-50 text-amber-500" : "bg-emerald-50 text-emerald-500"
                )}>
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-gray-900 leading-none mb-2">{claim.vehicle}</h4>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{claim.tripId}</span>
                    <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{claim.category}</span>
                    <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{claim.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    claim.status === 'Under Review' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                  )}>
                    {claim.status}
                  </span>
                  <div className="text-xl font-black text-gray-900 tracking-tight">${claim.amount}</div>
                </div>
                <button className="text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                  View Timeline <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Report Modal */}
      <AnimatePresence>
        {isReportModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReportModalOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-gray-50 bg-gray-50/30">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Report Incident</h2>
                    <p className="text-gray-500 font-medium mt-2 italic px-3 py-1 bg-white border border-gray-100 rounded-full inline-block text-xs">Case #NEW-INC-0000</p>
                  </div>
                  <button 
                    onClick={() => setIsReportModalOpen(false)}
                    className="p-4 hover:bg-white rounded-2xl bg-gray-100 text-gray-400 transition-all"
                  >
                    <Plus className="w-6 h-6 rotate-45" />
                  </button>
                </div>
              </div>

              <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Subject Vehicle</label>
                    <select className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-gray-900 outline-none focus:border-indigo-600 transition-all">
                      <option>Tesla Model 3</option>
                      <option>BMW M4</option>
                      <option>Porsche 911</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Trip Reference</label>
                    <input type="text" placeholder="TR-XXXX" className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-gray-900 outline-none focus:border-indigo-600 transition-all" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Damage Description</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe exactly what happened and the extent of the damage..."
                    className="w-full p-6 rounded-[2.5rem] bg-gray-50 border border-gray-100 font-bold text-gray-900 outline-none focus:border-red-600 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <button className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-100 rounded-[2.5rem] hover:border-indigo-600 group transition-all">
                    <Camera className="w-10 h-10 text-gray-300 group-hover:text-indigo-600 transition-colors mb-4" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload Evidence</span>
                  </button>
                  <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100 relative overflow-hidden">
                    <AlertCircle className="absolute -bottom-4 -right-4 w-20 h-20 text-amber-500/10" />
                    <h4 className="text-amber-800 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                       Safety Notice
                    </h4>
                    <p className="text-[11px] text-amber-900/70 font-bold leading-relaxed">
                      Ensure all trip photos are uploaded before submitting. Once filed, our team will review the claim within 48 hours.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-10 bg-gray-50 flex gap-4">
                <button 
                  onClick={() => {
                    toast.success('Report submitted successfully!');
                    setIsReportModalOpen(false);
                  }}
                  className="flex-1 py-5 rounded-[1.5rem] bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all"
                >
                  File Damage Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
