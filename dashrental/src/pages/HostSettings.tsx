import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Users, 
  User, 
  Shield, 
  Plus, 
  Mail, 
  CheckCircle2, 
  Trash2, 
  UserPlus,
  BadgeCheck,
  Zap,
  ChevronRight,
  Info,
  Camera
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Co-host' | 'Cleaner' | 'Fleet Manager';
  status: 'Active' | 'Pending';
}

const MOCK_TEAM: TeamMember[] = [
  { id: '1', name: 'Marcus Chen', email: 'marcus@example.com', role: 'Fleet Manager', status: 'Active' },
  { id: '2', name: 'Alisa Volkov', email: 'alisa@example.com', role: 'Cleaner', status: 'Pending' },
];

export function HostSettings() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'hosting'>('profile');
  const [team] = useState<TeamMember[]>(MOCK_TEAM);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Console</span>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Configuration & Access</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none">
            Host <span className="text-indigo-600">Settings</span>
          </h1>
          <p className="text-gray-500 mt-4 font-medium text-lg">Manage your identity, permissions, and operations team.</p>
        </motion.div>

        <div className="bg-white p-2 rounded-3xl border border-gray-100 shadow-xl flex items-center gap-1">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'team', label: 'Hosting Team', icon: Users },
            { id: 'hosting', label: 'About', icon: Info },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-all",
                activeTab === tab.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                  : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-12">
                <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Public Profile</h2>
                <div className="flex flex-col sm:flex-row gap-12 items-center sm:items-start mb-12">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-50 flex items-center justify-center overflow-hidden border-4 border-white shadow-2xl">
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-indigo-400" />
                    )}
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl border-4 border-white shadow-xl hover:scale-110 transition-transform">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 space-y-6 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Display Name</label>
                        <input type="text" defaultValue={profile?.displayName} className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-gray-900 outline-none focus:border-indigo-600 transition-all" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Email Address</label>
                        <input type="email" defaultValue={profile?.email} className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-gray-900 outline-none focus:border-indigo-600 transition-all opacity-60" disabled />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-indigo-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <BadgeCheck className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />
                <h3 className="text-xl font-black mb-4 tracking-tight">Verified Host</h3>
                <p className="text-indigo-100/70 text-sm font-medium leading-relaxed mb-6">
                  You have successfully completed all safety and identity checks. Your profile is boosted in search results.
                </p>
                <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">
                  View Badges
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'team' && (
          <motion.div
            key="team"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Operations Team</h2>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Manage secondary access & cleaning staff</p>
                </div>
                <button 
                  onClick={() => setIsInviteModalOpen(true)}
                  className="px-6 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3"
                >
                  <UserPlus className="w-4 h-4" /> Invite Member
                </button>
              </div>
              
              <div className="divide-y divide-gray-50">
                {team.map((member) => (
                  <div key={member.id} className="p-8 hover:bg-gray-50/50 transition-all group flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-gray-400">
                        {member.name[0]}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-gray-900 leading-none mb-2">{member.name}</h4>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {member.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-1">
                          {member.role}
                        </div>
                        <div className={cn(
                          "text-[9px] font-black uppercase tracking-widest",
                          member.status === 'Active' ? "text-green-600" : "text-amber-500"
                        )}>
                          {member.status}
                        </div>
                      </div>
                      <button className="p-4 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-2xl transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100 flex items-start gap-6">
              <div className="p-4 bg-white rounded-2xl border border-amber-200 text-amber-600">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-amber-900 font-black uppercase tracking-widest text-[10px] mb-2">Permission Safeguard</h4>
                <p className="text-amber-900/70 text-sm font-medium leading-relaxed max-w-2xl">
                  Co-hosts can manage bookings and check-ins but cannot modify payout details or delete vehicle listings. Always verify identity before inviting team members.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute inset-0 bg-indigo-900/60 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-gray-50 bg-gray-50/30">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Expand Team</h2>
                <p className="text-gray-500 font-medium mt-2">Grant operational access to a new member.</p>
              </div>

              <div className="p-10 space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Full Name</label>
                  <input type="text" placeholder="e.g. John Doe" className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-gray-900 outline-none focus:border-indigo-600 transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-gray-900 outline-none focus:border-indigo-600 transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Operational Role</label>
                  <select className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-gray-900 outline-none focus:border-indigo-600 transition-all">
                    <option>Co-host</option>
                    <option>Cleaner (Check-in only)</option>
                    <option>Fleet Manager</option>
                  </select>
                </div>
              </div>

              <div className="p-10 bg-gray-50 flex gap-4">
                <button 
                  onClick={() => {
                    toast.success('Invitation dispatched!');
                    setIsInviteModalOpen(false);
                  }}
                  className="flex-1 py-5 rounded-[2rem] bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all"
                >
                  Send Access Link
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
