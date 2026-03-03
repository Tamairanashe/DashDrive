import React, { useState } from 'react';
import { Card, Button, Badge } from './ui';
import { 
  Users, 
  Plus, 
  Search, 
  MoreVertical, 
  Shield, 
  Mail, 
  Clock,
  UserPlus,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronDown,
  Send,
  Filter,
  History,
  Activity,
  User,
  Settings,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface AuditLogEntry {
  id: string;
  action: 'role_change' | 'invite_sent' | 'user_deleted';
  targetUser: string;
  details: string;
  timestamp: string;
  performedBy: string;
}

const INITIAL_TEAM = [
  { id: '1', name: 'Alex Chen', email: 'alex@burgerjoint.com', role: 'Admin', lastActive: 'Today 10:23 AM', status: 'Active' },
  { id: '2', name: 'Jamie Smith', email: 'jamie@burgerjoint.com', role: 'Manager', lastActive: 'Yesterday', status: 'Active' },
  { id: '3', name: 'Taylor Wu', email: 'taylor@burgerjoint.com', role: 'Staff', lastActive: 'Never', status: 'Invited' },
  { id: '4', name: 'Jordan Lee', email: 'jordan@burgerjoint.com', role: 'Staff', lastActive: 'Feb 28, 2024', status: 'Active' },
];

const ROLES = ['Admin', 'Manager', 'Staff'];

export const UsersList = () => {
  const [team, setTeam] = useState(INITIAL_TEAM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Staff');
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const selectedUser = team.find(u => u.id === selectedUserId);

  const addLog = (action: AuditLogEntry['action'], targetUser: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      targetUser,
      details,
      timestamp: new Date().toLocaleString(),
      performedBy: 'Current User' // In a real app, this would be the logged-in user
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleRoleChange = (id: string, newRole: string) => {
    const user = team.find(u => u.id === id);
    if (user) {
      addLog('role_change', user.name, `Changed role from ${user.role} to ${newRole}`);
    }
    setTeam(prev => prev.map(user => 
      user.id === id ? { ...user, role: newRole } : user
    ));
    setEditingId(null);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      lastActive: 'Never',
      status: 'Invited'
    };

    setTeam(prev => [newUser, ...prev]);
    addLog('invite_sent', newUser.name, `Sent invitation with ${inviteRole} role`);
    setInviteEmail('');
    setInviteRole('Staff');
    setIsInviteModalOpen(false);
    // In a real app, you'd call an API here to send the email
    alert(`Invitation link sent to ${inviteEmail}`);
  };

  const handleDelete = () => {
    if (userToDelete) {
      addLog('user_deleted', userToDelete.name, `Removed user from team`);
      setTeam(prev => prev.filter(user => user.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const filteredTeam = team.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: team.length,
    admins: team.filter(u => u.role === 'Admin').length,
    managers: team.filter(u => u.role === 'Manager').length,
    staff: team.filter(u => u.role === 'Staff').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input 
            type="text" 
            placeholder="Search team members..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-3 py-1.5">
            <Filter size={14} className="text-zinc-400" />
            <select 
              className="text-xs font-medium text-zinc-600 bg-transparent outline-none cursor-pointer"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-3 py-1.5">
            <select 
              className="text-xs font-medium text-zinc-600 bg-transparent outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Invited">Invited</option>
            </select>
          </div>
          {(roleFilter !== 'All' || statusFilter !== 'All' || searchQuery !== '') && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-900"
              onClick={() => {
                setRoleFilter('All');
                setStatusFilter('All');
                setSearchQuery('');
              }}
            >
              Clear
            </Button>
          )}
          <div className="h-8 w-px bg-zinc-200 mx-2 hidden md:block" />
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-zinc-400 hover:text-zinc-900"
            onClick={() => {
              setHistoryFilter(null);
              setIsHistoryModalOpen(true);
            }}
          >
            <History size={20} />
          </Button>
          <Button variant="primary" className="gap-2 whitespace-nowrap" onClick={() => setIsInviteModalOpen(true)}>
            <UserPlus size={16} /> Add Member
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isHistoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                    <Activity size={18} className="text-zinc-400" />
                    {historyFilter ? `Activity: ${historyFilter}` : 'Team Activity Log'}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Tracking all administrative actions</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsHistoryModalOpen(false)}>
                  <X size={20} />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {(historyFilter ? auditLogs.filter(log => log.targetUser === historyFilter) : auditLogs).length === 0 ? (
                  <div className="text-center py-12">
                    <History size={40} className="mx-auto text-zinc-200 mb-3" />
                    <p className="text-sm text-zinc-400">No activity recorded yet.</p>
                  </div>
                ) : (
                  (historyFilter ? auditLogs.filter(log => log.targetUser === historyFilter) : auditLogs).map((log) => (
                    <div key={log.id} className="relative pl-6 border-l-2 border-zinc-100">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-zinc-200" />
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-zinc-900">
                            {log.action === 'role_change' && 'Role Updated'}
                            {log.action === 'invite_sent' && 'Invitation Sent'}
                            {log.action === 'user_deleted' && 'User Removed'}
                          </p>
                          <p className="text-xs text-zinc-600 mt-1">
                            <span className="font-medium text-zinc-900">{log.targetUser}</span>: {log.details}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-medium px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded uppercase tracking-wider">
                              By {log.performedBy}
                            </span>
                            <span className="text-[10px] text-zinc-400">{log.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setIsHistoryModalOpen(false)}>Close</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                  <UserPlus size={18} />
                  Invite Team Member
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setIsInviteModalOpen(false)}>
                  <X size={20} />
                </Button>
              </div>
              <form onSubmit={handleInvite}>
                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input 
                        type="email" 
                        required
                        placeholder="colleague@company.com" 
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900/5" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Assign Role</label>
                    <div className="grid grid-cols-3 gap-2">
                      {ROLES.map(role => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setInviteRole(role)}
                          className={cn(
                            "py-2 text-xs font-medium rounded-lg border transition-all",
                            inviteRole === role 
                              ? "bg-zinc-900 text-white border-zinc-900 shadow-sm" 
                              : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
                          )}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-xl">
                    <p className="text-[10px] text-zinc-500 leading-relaxed">
                      An invitation email will be sent to this address. They will have <strong>{inviteRole}</strong> level access once they accept.
                    </p>
                  </div>
                </div>
                <div className="p-6 bg-zinc-50 flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsInviteModalOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="primary" className="flex-1 gap-2">
                    <Send size={16} />
                    Send Invite
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={32} />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">Remove Team Member?</h3>
                <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                  Are you sure you want to remove <strong>{userToDelete?.name}</strong>? This action cannot be undone and they will lose all access.
                </p>
              </div>
              <div className="p-6 bg-zinc-50 flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setUserToDelete(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1 bg-red-600 hover:bg-red-700 border-red-600" 
                  onClick={handleDelete}
                >
                  Remove
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedUserId && selectedUser && (
          <div className="fixed inset-0 z-50 flex justify-end bg-zinc-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                  <User size={18} className="text-zinc-400" />
                  Team Member Profile
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setSelectedUserId(null)}>
                  <X size={20} />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* Profile Header */}
                <div className="p-8 text-center border-b border-zinc-50">
                  <div className="w-24 h-24 rounded-full bg-zinc-100 mx-auto mb-4 overflow-hidden border-4 border-white shadow-md">
                    <img src={`https://picsum.photos/seed/${selectedUser.name}/200/200`} alt={selectedUser.name} referrerPolicy="no-referrer" />
                  </div>
                  <h4 className="text-xl font-black text-zinc-900">{selectedUser.name}</h4>
                  <p className="text-sm text-zinc-500">{selectedUser.email}</p>
                  <div className="flex justify-center gap-2 mt-4">
                    <Badge variant={selectedUser.status === 'Active' ? 'success' : 'warning'}>{selectedUser.status}</Badge>
                    <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 border-none">
                      <Shield size={12} className="mr-1" />
                      {selectedUser.role}
                    </Badge>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 space-y-6">
                  <div>
                    <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Account Details</h5>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <ShieldCheck size={18} className="text-zinc-400" />
                          <div>
                            <p className="text-xs font-bold text-zinc-900">Access Level</p>
                            <p className="text-[10px] text-zinc-500">Current assigned role</p>
                          </div>
                        </div>
                        <select 
                          className="text-xs font-bold bg-white border border-zinc-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-zinc-900/5"
                          value={selectedUser.role}
                          onChange={(e) => handleRoleChange(selectedUser.id, e.target.value)}
                        >
                          {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Clock size={18} className="text-zinc-400" />
                          <div>
                            <p className="text-xs font-bold text-zinc-900">Last Activity</p>
                            <p className="text-[10px] text-zinc-500">{selectedUser.lastActive}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Recent Activity</h5>
                    <div className="space-y-4">
                      {auditLogs.filter(log => log.targetUser === selectedUser.name).length === 0 ? (
                        <div className="text-center py-8 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                          <Activity size={24} className="mx-auto text-zinc-300 mb-2" />
                          <p className="text-xs text-zinc-400">No recent activity found.</p>
                        </div>
                      ) : (
                        auditLogs
                          .filter(log => log.targetUser === selectedUser.name)
                          .slice(0, 5)
                          .map((log) => (
                            <div key={log.id} className="flex gap-3">
                              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-zinc-900 shrink-0" />
                              <div>
                                <p className="text-xs font-bold text-zinc-900">
                                  {log.action === 'role_change' && 'Role Updated'}
                                  {log.action === 'invite_sent' && 'Invitation Sent'}
                                  {log.action === 'user_deleted' && 'User Removed'}
                                </p>
                                <p className="text-[10px] text-zinc-500 mt-0.5">{log.details}</p>
                                <p className="text-[10px] text-zinc-400 mt-1">{log.timestamp}</p>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={() => {
                    setHistoryFilter(selectedUser.name);
                    setIsHistoryModalOpen(true);
                  }}
                >
                  <History size={16} />
                  Full History
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1 bg-red-600 hover:bg-red-700 border-red-600 gap-2"
                  onClick={() => {
                    setUserToDelete(selectedUser);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <Trash2 size={16} />
                  Remove
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-zinc-900 text-white border-none">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Total Team</p>
          <div className="text-3xl font-black mt-1">{stats.total}</div>
          <div className="mt-4 flex -space-x-2">
            {team.slice(0, 5).map((user, i) => (
              <div key={user.id} className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 overflow-hidden">
                <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="user" />
              </div>
            ))}
            {stats.total > 5 && (
              <div className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                +{stats.total - 5}
              </div>
            )}
          </div>
        </Card>
        <Card>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Admins</p>
          <div className="text-3xl font-black text-zinc-900 mt-1">{stats.admins}</div>
          <p className="text-xs text-zinc-400 mt-2">Full system access</p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Managers</p>
          <div className="text-3xl font-black text-zinc-900 mt-1">{stats.managers}</div>
          <p className="text-xs text-zinc-400 mt-2">Operational access</p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Staff</p>
          <div className="text-3xl font-black text-zinc-900 mt-1">{stats.staff}</div>
          <p className="text-xs text-zinc-400 mt-2">Limited access</p>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-100">
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Last Active</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredTeam.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-zinc-400">
                    <Search size={32} className="opacity-20" />
                    <p className="text-sm font-medium">No team members found matching your filters.</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 text-xs"
                      onClick={() => {
                        setRoleFilter('All');
                        setStatusFilter('All');
                        setSearchQuery('');
                      }}
                    >
                      Clear all filters
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTeam.map((user) => (
              <tr 
                key={user.email} 
                className="hover:bg-zinc-50/50 transition-colors group cursor-pointer"
                onClick={() => setSelectedUserId(user.id)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 overflow-hidden">
                      <img src={`https://picsum.photos/seed/${user.name}/100/100`} alt={user.name} referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">{user.name}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  {editingId === user.id ? (
                    <div className="flex items-center gap-2">
                      <select 
                        className="text-sm border border-zinc-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        autoFocus
                      >
                        {ROLES.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-zinc-400 hover:text-red-600"
                        onClick={() => setEditingId(null)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="flex items-center gap-2 cursor-pointer hover:bg-zinc-100 px-2 py-1 rounded-lg transition-colors w-fit"
                      onClick={() => setEditingId(user.id)}
                    >
                      <Shield size={14} className={cn(
                        user.role === 'Admin' ? "text-zinc-900" : "text-zinc-400"
                      )} />
                      <span className="text-sm text-zinc-600">{user.role}</span>
                      <ChevronDown size={12} className="text-zinc-400 opacity-0 group-hover:opacity-100" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Clock size={14} />
                    {user.lastActive}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={user.status === 'Active' ? 'success' : 'warning'}>{user.status}</Badge>
                </td>
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-zinc-400 hover:text-zinc-900"
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setEditingId(user.id);
                      }}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-zinc-400 hover:text-red-600"
                      onClick={() => {
                        setUserToDelete(user);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-zinc-400 hover:text-zinc-900"
                      onClick={() => {
                        setHistoryFilter(user.name);
                        setIsHistoryModalOpen(true);
                      }}
                    >
                      <History size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-zinc-400"><MoreVertical size={16} /></Button>
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
