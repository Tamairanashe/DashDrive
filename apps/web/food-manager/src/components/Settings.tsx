import React from 'react';
import { Card, Button, Badge } from './ui';
import { cn } from '../lib/utils';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Smartphone, 
  Globe, 
  Lock, 
  Eye, 
  ChevronRight,
  Clock,
  Zap,
  Timer,
  Plus,
  Trash2,
  AlertTriangle
} from 'lucide-react';

const SETTINGS_GROUPS = [
  {
    title: 'General',
    items: [
      { id: 'notifications', name: 'Notifications', desc: 'Manage push and email alerts', icon: Bell },
      { id: 'security', name: 'Security', desc: 'Password and two-factor auth', icon: Lock },
    ]
  },
  {
    title: 'Operations',
    items: [
      { id: 'busy', name: 'Busy Mode', desc: 'Auto-extend times during rushes', icon: Zap },
      { id: 'requests', name: 'Special Requests', desc: 'Enable/disable customer notes', icon: Globe },
      { id: 'allergy', name: 'Allergy Flags', desc: 'Manage allergy warning system', icon: Shield },
    ]
  }
];

const Toggle = ({ enabled, onChange }: { enabled: boolean, onChange?: () => void }) => (
  <button 
    onClick={onChange}
    className={cn(
      "w-11 h-6 rounded-full transition-colors relative",
      enabled ? "bg-emerald-500" : "bg-zinc-200"
    )}
  >
    <div className={cn(
      "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
      enabled ? "translate-x-6" : "translate-x-1"
    )} />
  </button>
);

export const Settings = () => {
  const [toggles, setToggles] = React.useState({
    busy: false,
    requests: true,
    allergy: true
  });

  const [prepTime, setPrepTime] = React.useState(18);
  const [busyThreshold, setBusyThreshold] = React.useState(8);
  const [busyExtension, setBusyExtension] = React.useState(10);
  const [busyDuration, setBusyDuration] = React.useState(30);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Preparation Time Manager */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Preparation Time Manager</h3>
            <Card className="p-0 overflow-hidden">
              <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-900 text-white rounded-lg">
                      <Timer size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900">Average Preparation Time</h4>
                      <p className="text-xs text-zinc-500">Currently calculated based on last 50 orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-zinc-900">{prepTime}m</div>
                    <Badge variant="success">Optimal</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Manual Override</label>
                    <span className="text-xs font-bold text-zinc-900">{prepTime} minutes</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="60" 
                    value={prepTime} 
                    onChange={(e) => setPrepTime(parseInt(e.target.value))}
                    className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">
                    <span>5m</span>
                    <span>15m</span>
                    <span>30m</span>
                    <span>45m</span>
                    <span>60m</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-sm font-bold text-zinc-900">Schedule-based Prep Times</h5>
                    <Button variant="outline" size="sm" className="h-8 text-[10px] gap-1">
                      <Plus size={12} /> Add Schedule
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: 'Lunch Rush', time: '11:00 AM - 2:00 PM', prep: '25m', active: true },
                      { name: 'Dinner Rush', time: '5:00 PM - 9:00 PM', prep: '30m', active: true },
                      { name: 'Late Night', time: '10:00 PM - 2:00 AM', prep: '15m', active: false },
                    ].map((slot) => (
                      <div key={slot.name} className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 hover:bg-zinc-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            slot.active ? "bg-emerald-500" : "bg-zinc-300"
                          )} />
                          <div>
                            <p className="text-xs font-bold text-zinc-900">{slot.name}</p>
                            <p className="text-[10px] text-zinc-500">{slot.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-zinc-900">{slot.prep}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-600">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-zinc-900">Busy Mode Threshold</h5>
                      <p className="text-xs text-zinc-500">Trigger Busy Mode when active orders exceed this limit</p>
                    </div>
                    <div className="flex items-center gap-3 bg-zinc-100 p-1 rounded-lg">
                      <button 
                        onClick={() => setBusyThreshold(Math.max(1, busyThreshold - 1))}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-zinc-600 hover:text-zinc-900"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-zinc-900">{busyThreshold}</span>
                      <button 
                        onClick={() => setBusyThreshold(busyThreshold + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-zinc-600 hover:text-zinc-900"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-zinc-900">Prep Time Extension</h5>
                      <p className="text-xs text-zinc-500">Minutes to add to prep time when Busy Mode is active</p>
                    </div>
                    <div className="flex items-center gap-3 bg-zinc-100 p-1 rounded-lg">
                      <button 
                        onClick={() => setBusyExtension(Math.max(1, busyExtension - 1))}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-zinc-600 hover:text-zinc-900"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-zinc-900">{busyExtension}</span>
                      <button 
                        onClick={() => setBusyExtension(busyExtension + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-zinc-600 hover:text-zinc-900"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-zinc-900">Busy Mode Duration</h5>
                      <p className="text-xs text-zinc-500">How long (in minutes) Busy Mode stays active once triggered</p>
                    </div>
                    <div className="flex items-center gap-3 bg-zinc-100 p-1 rounded-lg">
                      <button 
                        onClick={() => setBusyDuration(Math.max(5, busyDuration - 5))}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-zinc-600 hover:text-zinc-900"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-zinc-900">{busyDuration}</span>
                      <button 
                        onClick={() => setBusyDuration(busyDuration + 5)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-zinc-600 hover:text-zinc-900"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                    <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-800 leading-relaxed">
                      When triggered, prep times will automatically increase by <span className="font-bold">{busyExtension} minutes</span> for the next <span className="font-bold">{busyDuration} minutes</span>. Your store may also be temporarily hidden from far-away customers.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {SETTINGS_GROUPS.map((group) => (
            <div key={group.title} className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">{group.title}</h3>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <Card key={item.id} className="p-0 group cursor-pointer hover:border-zinc-300 transition-all">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-zinc-50 rounded-xl text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                          <item.icon size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-900">{item.name}</h4>
                          <p className="text-xs text-zinc-500">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <Card title="Operational Toggles">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-900">Busy Mode</p>
                  <p className="text-xs text-zinc-500">Auto-extend prep times</p>
                </div>
                <Toggle enabled={toggles.busy} onChange={() => setToggles({...toggles, busy: !toggles.busy})} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-900">Special Requests</p>
                  <p className="text-xs text-zinc-500">Allow customer notes</p>
                </div>
                <Toggle enabled={toggles.requests} onChange={() => setToggles({...toggles, requests: !toggles.requests})} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-900">Allergy Flags</p>
                  <p className="text-xs text-zinc-500">Show allergy warnings</p>
                </div>
                <Toggle enabled={toggles.allergy} onChange={() => setToggles({...toggles, allergy: !toggles.allergy})} />
              </div>
            </div>
          </Card>

          <Card title="System Info" className="bg-zinc-50 border-dashed border-2">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">App Version</span>
                  <span className="font-bold text-zinc-900">v2.4.12</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Last Synced</span>
                  <span className="font-bold text-zinc-900">2 mins ago</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">POS Connection</span>
                  <Badge variant="success">Stable</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full text-xs gap-2">
                <Smartphone size={14} /> Check for Updates
              </Button>
            </div>
          </Card>

          <div className="p-6 rounded-2xl bg-zinc-900 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-sm font-bold mb-1">Need help?</h4>
              <p className="text-xs text-white/60 mb-4">Our support team is available 24/7 for any operational issues.</p>
              <Button size="sm" className="bg-white text-zinc-900 hover:bg-zinc-100 w-full">Contact Support</Button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
              <Globe size={100} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
