import React, { useState } from 'react';
import { Card, Button, Badge } from './ui';
import { 
  Store, 
  Clock, 
  FileText, 
  MapPin, 
  Phone, 
  Globe, 
  Upload, 
  Plus, 
  Copy,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Trash2,
  Calendar,
  Smartphone,
  Zap,
  Shield,
  Package,
  Receipt,
  Search,
  ExternalLink,
  Info,
  Star,
  Timer,
  AlertTriangle,
  Settings as SettingsIcon,
  Palette,
  Layout,
  Share2,
  BarChart2,
  RefreshCw,
  Eye,
  Edit2,
  Bell,
  Users
} from 'lucide-react';
import { cn } from '../lib/utils';

type StoreTab = 'dashboard' | 'info' | 'hours' | 'prep' | 'docs' | 'customer' | 'webshop' | 'packaging' | 'tax';

export const StoreManagement = () => {
  const [activeTab, setActiveTab] = useState<StoreTab>('dashboard');

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Store Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Status', value: 'ONLINE', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Menu Complete', value: '92%', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Prep Time', value: '18 min', icon: Timer, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Rating', value: '4.2 ★', icon: Star, color: 'text-zinc-900', bg: 'bg-zinc-100' },
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", stat.bg, stat.color)}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-sm font-bold text-zinc-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setActiveTab('info')}><Edit2 size={14} /> Edit Info</Button>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setActiveTab('hours')}><Clock size={14} /> Update Hours</Button>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setActiveTab('docs')}><Plus size={14} /> Add Document</Button>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setActiveTab('dashboard')}><SettingsIcon size={14} /> Configure</Button>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { id: 'info', title: 'Shop Info', desc: 'Restaurant details, address, pickup instructions, contact', icon: Store },
          { id: 'hours', title: 'Hours', desc: 'Operating hours, holidays, special schedules, timezone', icon: Clock },
          { id: 'prep', title: 'Preparation Times', desc: 'Prep time settings, busy mode, auto-adjust thresholds', icon: Timer },
          { id: 'docs', title: 'Documents', desc: 'License, permits, insurance, tax documents', icon: FileText },
          { id: 'customer', title: 'Customer Options', desc: 'Special requests, allergies, ordering preferences', icon: Users },
          { id: 'webshop', title: 'Webshop', desc: 'Custom URL, appearance, branding, SEO', icon: Globe },
          { id: 'packaging', title: 'Packaging', desc: 'Packaging types, eco options, sustainability settings', icon: Package },
          { id: 'tax', title: 'Tax Information', desc: 'Tax rates, tax ID, exemption certificates', icon: Receipt },
        ].map((section) => (
          <Card key={section.id} className="p-6 group hover:border-zinc-900 transition-all cursor-pointer" onClick={() => setActiveTab(section.id as StoreTab)}>
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="p-3 bg-zinc-50 rounded-xl text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                  <section.icon size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">{section.title}</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">{section.desc}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-wider text-zinc-400 group-hover:text-zinc-900">Manage</Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Recent Activity">
            <div className="space-y-4">
              {[
                { time: 'Today 9:32 AM', desc: 'Shop info updated (phone number)' },
                { time: 'Yesterday 4:15 PM', desc: 'Hours updated for Valentine\'s Day' },
                { time: 'Jan 14, 2024', desc: 'New document uploaded (Health Permit)' },
              ].map((activity, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1" />
                  <p className="text-zinc-500">
                    <span className="font-bold text-zinc-900">{activity.time}</span> — {activity.desc}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Card title="Pending Tasks" className="bg-amber-50 border-amber-100">
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900">Tax information needs review - expires in 30 days</p>
            </div>
            <div className="flex gap-3 items-start">
              <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900">3 menu items missing preparation time</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderShopInfo = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card title="Basic Information">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Restaurant Name</label>
              <div className="relative">
                <input type="text" defaultValue="Main Street Kitchen" className="w-full p-2.5 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none pr-10" />
                <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
              </div>
              <p className="text-[10px] text-zinc-400">24/50 characters</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Cuisine Type</label>
              <div className="flex gap-2">
                <div className="flex-1 p-2.5 text-sm border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-600">Italian, American, Pizza</div>
                <Button variant="outline" size="sm"><Plus size={14} /> Add</Button>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Contact Information">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                  <input type="text" defaultValue="(555) 123-4567" className="w-full pl-10 pr-10 py-2.5 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none" />
                  <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <input type="text" defaultValue="info@mainstreetkitchen.com" className="w-full p-2.5 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none pr-10" />
                  <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Website</label>
              <input type="text" defaultValue="https://www.mainstreetkitchen.com" className="w-full p-2.5 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none" />
            </div>
          </div>
        </Card>

        <Card title="Location">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Street Address</label>
              <input type="text" defaultValue="123 Main St" className="w-full p-2.5 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">City</label>
                <input type="text" defaultValue="San Francisco" className="w-full p-2.5 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">State</label>
                <input type="text" defaultValue="CA" className="w-full p-2.5 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">ZIP Code</label>
                <input type="text" defaultValue="94105" className="w-full p-2.5 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2"><MapPin size={14} /> Show on Map</Button>
              <Button variant="outline" size="sm">Verify Address</Button>
            </div>
          </div>
        </Card>

        <Card title="Delivery & Pickup Instructions">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Pickup Instructions (for customers)</label>
              <textarea defaultValue="When you arrive, please call and we'll bring your order out. Look for the red awning." className="w-full p-3 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none min-h-[80px]" />
              <p className="text-[10px] text-zinc-400">142/200 characters • Clear instructions reduce wait times</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Delivery Instructions (for couriers)</label>
              <textarea defaultValue="Enter through the side door on 2nd Street. Orders are ready at the pickup counter." className="w-full p-3 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none min-h-[80px]" />
            </div>
          </div>
        </Card>

        <Card title="Branding & Media">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Restaurant Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400 border border-zinc-200">
                    <Store size={32} />
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">Upload New</Button>
                    <p className="text-[10px] text-zinc-400">Recommended: 400x400px</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Cover Photo</label>
                <div className="w-full h-20 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400">
                  <Layout size={32} />
                </div>
                <Button variant="outline" size="sm" className="w-full">Upload New</Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setActiveTab('dashboard')}>Cancel</Button>
          <Button variant="primary" className="px-8">Save Changes</Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card title="Live Preview" className="bg-zinc-900 border-none sticky top-24">
          <div className="aspect-[9/16] bg-white rounded-3xl overflow-hidden shadow-2xl relative border-8 border-zinc-800">
            <div className="h-32 bg-zinc-200 relative">
              <img src="https://picsum.photos/seed/burger/400/200" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute -bottom-6 left-4 w-16 h-16 bg-white rounded-xl shadow-lg p-1.5">
                <div className="w-full h-full bg-zinc-900 rounded-lg flex items-center justify-center text-white font-black italic text-lg">M</div>
              </div>
            </div>
            <div className="mt-8 px-4">
              <div className="flex justify-between items-start">
                <h4 className="text-lg font-black text-zinc-900">Main Street Kitchen</h4>
                <div className="flex items-center gap-1 bg-zinc-100 px-1.5 py-0.5 rounded text-[10px] font-bold">
                  <span>4.2</span>
                  <Star size={8} className="fill-zinc-900" />
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Italian • American • 0.3 mi away</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-zinc-600">
                  <MapPin size={10} /> 123 Main St, San Francisco
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-600">
                  <Clock size={10} /> Open until 10:00 PM • 18-25 min
                </div>
              </div>
              <div className="mt-6 border-t border-zinc-100 pt-4">
                <div className="h-3 bg-zinc-100 rounded w-1/2 mb-2" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-square bg-zinc-50 rounded-lg" />
                  <div className="aspect-square bg-zinc-50 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderHours = () => (
    <div className="space-y-6">
      <Card title="Operating Hours" headerAction={<Button variant="outline" size="sm" className="gap-2"><Copy size={14} /> Copy to Weekdays</Button>}>
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm font-bold text-emerald-900">OPEN NOW • Closes at 10:00 PM</p>
            </div>
            <p className="text-xs text-emerald-700">2 hours 15 minutes left</p>
          </div>

          <div className="space-y-1.5 mb-6">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Store Time Zone</label>
            <select className="w-full p-2.5 text-sm border border-zinc-200 rounded-lg outline-none">
              <option>(GMT-8:00) Pacific Time (US & Canada)</option>
            </select>
          </div>

          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-b">
                <tr className="text-left">
                  <th className="px-4 py-3 font-bold text-zinc-500 uppercase text-[10px]">Day</th>
                  <th className="px-4 py-3 font-bold text-zinc-500 uppercase text-[10px]">Open</th>
                  <th className="px-4 py-3 font-bold text-zinc-500 uppercase text-[10px]">Close</th>
                  <th className="px-4 py-3 font-bold text-zinc-500 uppercase text-[10px]">Total</th>
                  <th className="px-4 py-3 font-bold text-zinc-500 uppercase text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <tr key={day} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 font-bold">{day}</td>
                    <td className="px-4 py-3"><input type="time" defaultValue="09:00" className="bg-transparent border-none p-0 focus:ring-0" /></td>
                    <td className="px-4 py-3"><input type="time" defaultValue="22:00" className="bg-transparent border-none p-0 focus:ring-0" /></td>
                    <td className="px-4 py-3 text-zinc-500">13 hrs</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 size={14} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Copy size={14} /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <Card title="Holiday & Special Hours">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2"><Plus size={14} /> Add Holiday Hours</Button>
            <Button variant="outline" size="sm" className="gap-2"><Plus size={14} /> Add Special Event</Button>
          </div>
          <div className="space-y-3">
            {[
              { date: 'Feb 14, 2024', name: 'Valentine\'s Day', hours: '9:00 AM - 11:00 PM', type: 'Extended' },
              { date: 'Feb 19, 2024', name: 'Presidents Day', hours: 'Closed All Day', type: 'Closed' },
            ].map((exp) => (
              <div key={exp.name} className="p-4 border border-zinc-100 rounded-xl flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{exp.date} — {exp.name}</p>
                    <p className="text-sm font-bold text-zinc-900">{exp.hours}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-600"><Trash2 size={14} /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setActiveTab('dashboard')}>Cancel</Button>
        <Button variant="primary" className="px-8">Save All Changes</Button>
      </div>
    </div>
  );

  const renderDocs = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-2 bg-zinc-100 rounded-lg text-zinc-600"><FileText size={20} /></div>
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Files</p>
            <p className="text-sm font-bold text-zinc-900">8 files</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><CheckCircle2 size={20} /></div>
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Current</p>
            <p className="text-sm font-bold text-zinc-900">6 valid</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 bg-amber-50 border-amber-100">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><AlertTriangle size={20} /></div>
          <div>
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Expiring Soon</p>
            <p className="text-sm font-bold text-amber-900">2 files</p>
          </div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="primary" size="sm" className="gap-2"><Upload size={14} /> Upload Document</Button>
          <Button variant="outline" size="sm" className="gap-2"><Plus size={14} /> Create Folder</Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
          <input type="text" placeholder="Search documents..." className="pl-9 pr-4 py-1.5 text-xs border border-zinc-200 rounded-lg outline-none w-48" />
        </div>
      </div>

      <div className="space-y-4">
        {[
          { title: 'Business Licenses', count: 2, docs: [
            { name: 'SF Business License', file: 'sf_license_2023.pdf', status: 'Valid', exp: 'Jan 31, 2024' },
            { name: 'Food Permit', file: 'food_permit.pdf', status: 'Valid', exp: 'Feb 1, 2024' }
          ]},
          { title: 'Tax Documents', count: 3, docs: [
            { name: 'W-9 Form', file: 'w9_2024.pdf', status: 'Valid', exp: 'N/A' }
          ]},
        ].map((cat) => (
          <div key={cat.title} className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors">
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">{cat.title} ({cat.count} files)</span>
              <ChevronRight size={14} className="text-zinc-400" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
              {cat.docs.map(doc => (
                <Card key={doc.name} className="p-4 group">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="p-2 bg-zinc-100 rounded-lg text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-zinc-900">{doc.name}</h5>
                        <p className="text-[10px] text-zinc-500">{doc.file}</p>
                        <p className="text-[10px] text-zinc-400 mt-1">Expires: {doc.exp}</p>
                      </div>
                    </div>
                    <Badge variant="success">{doc.status}</Badge>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-[10px]">View</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400"><Trash2 size={14} /></Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWebshop = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card title="Webshop Status">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <div>
                <p className="text-sm font-bold text-zinc-900">WEBSHOP IS LIVE</p>
                <p className="text-xs text-zinc-500">URL: https://order.mainstreetkitchen.com</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2"><Copy size={14} /> Copy Link</Button>
              <Button variant="outline" size="sm" className="gap-2"><Smartphone size={14} /> Mobile View</Button>
            </div>
          </div>
        </Card>

        <Card title="Custom URL">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Your Uber-provided URL</label>
              <div className="p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-500">
                https://www.ubereats.com/store/main-street-kitchen/abc123xyz
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-900">Enable custom domain</label>
                <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 p-2.5 border border-zinc-200 rounded-lg bg-zinc-50">
                  <span className="text-xs text-zinc-400">order.</span>
                  <input type="text" defaultValue="mainstreetkitchen" className="flex-1 bg-transparent text-xs outline-none" />
                  <span className="text-xs text-zinc-400">.com</span>
                </div>
                <Button variant="primary" size="sm">Verify Domain</Button>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Appearance">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="p-3 border rounded-xl text-xs font-bold border-zinc-200 hover:border-zinc-900 transition-all">Light</button>
                  <button className="p-3 border rounded-xl text-xs font-bold border-zinc-900 bg-zinc-900 text-white">Dark</button>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Menu Display</label>
                <select className="w-full p-2.5 text-xs border border-zinc-200 rounded-lg outline-none">
                  <option>Grid</option>
                  <option>List</option>
                  <option>Cards</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Hero Banner Configuration">
          <div className="space-y-4">
            <div className="p-6 bg-zinc-900 rounded-xl text-center text-white space-y-4">
              <h5 className="text-xl font-black">WELCOME TO MAIN STREET KITCHEN</h5>
              <p className="text-xs text-white/60">Family-owned since 1995</p>
              <div className="flex justify-center gap-2">
                <Button size="sm" className="bg-white text-zinc-900">Order Now</Button>
                <Button size="sm" variant="outline" className="border-white text-white hover:bg-white/10">View Menu</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Headline</label>
                <input type="text" defaultValue="Welcome to Main Street Kitchen" className="w-full p-2.5 text-xs border border-zinc-200 rounded-lg outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Subheadline</label>
                <input type="text" defaultValue="Family-owned since 1995" className="w-full p-2.5 text-xs border border-zinc-200 rounded-lg outline-none" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Webshop Sections">
          <div className="space-y-2">
            {[
              { label: 'Hero Banner', enabled: true },
              { label: 'Featured Items', enabled: true },
              { label: 'Today\'s Specials', enabled: true },
              { label: 'Categories', enabled: true },
              { label: 'Popular Items', enabled: true },
              { label: 'Reviews', enabled: true },
              { label: 'About Us', enabled: true },
              { label: 'Contact', enabled: true },
            ].map(section => (
              <div key={section.label} className="flex items-center justify-between p-2 hover:bg-zinc-50 rounded-lg transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-zinc-300 flex items-center justify-center bg-emerald-500 border-emerald-500">
                    <CheckCircle2 size={10} className="text-white" />
                  </div>
                  <span className="text-xs font-medium text-zinc-700">{section.label}</span>
                </div>
                <div className="cursor-move text-zinc-300">
                  <Layout size={14} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="SEO Settings">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Meta Title</label>
              <input type="text" defaultValue="Main Street Kitchen | Pizza & Pasta" className="w-full p-2.5 text-xs border border-zinc-200 rounded-lg outline-none" />
            </div>
            <Button variant="outline" size="sm" className="w-full gap-2"><Zap size={14} /> AI Generate SEO</Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderCustomerOptions = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Special Requests">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-900">Allow special instructions</p>
                  <p className="text-xs text-zinc-500">Customers can add notes to their orders</p>
                </div>
                <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
              <div className="space-y-3 pl-4 border-l-2 border-zinc-100">
                {[
                  { label: 'Order notes (e.g., "Ring bell")', enabled: true },
                  { label: 'Request extra items (napkins, utensils)', enabled: true },
                  { label: 'Dietary accommodations', enabled: true },
                ].map(opt => (
                  <div key={opt.label} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border border-zinc-300 bg-emerald-500 border-emerald-500 flex items-center justify-center">
                      <CheckCircle2 size={10} className="text-white" />
                    </div>
                    <span className="text-xs text-zinc-600">{opt.label}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Display message to customers</label>
                <textarea defaultValue="We'll do our best to accommodate special requests. Additional charges may apply for extra items." className="w-full p-3 text-sm border border-zinc-200 rounded-lg outline-none min-h-[80px]" />
              </div>
            </div>
          </Card>

          <Card title="Allergy & Dietary Options">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-900">Enable allergy flags</p>
                  <p className="text-xs text-zinc-500">Allow customers to flag specific allergies</p>
                </div>
                <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['Gluten', 'Dairy', 'Nuts', 'Shellfish', 'Egg', 'Soy'].map(allergy => (
                  <div key={allergy} className="flex items-center gap-2 p-2 border border-zinc-100 rounded-lg">
                    <div className="w-4 h-4 rounded border border-zinc-300 bg-emerald-500 border-emerald-500 flex items-center justify-center">
                      <CheckCircle2 size={10} className="text-white" />
                    </div>
                    <span className="text-xs text-zinc-700">{allergy} Allergy</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3">
                <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-900 uppercase tracking-wider">Handling Procedure</p>
                  <p className="text-[10px] text-red-800 mt-1 leading-relaxed">
                    When an allergy flag is present, the order will be highlighted in <span className="font-bold">RED</span> and require manual acknowledgment from your staff before preparation begins.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Utensil & Condiment Preferences">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Utensil Options</label>
                <div className="space-y-2">
                  {['No utensils needed', 'Include utensils (fork, knife, spoon) - DEFAULT', 'Include chopsticks', 'Include straw'].map(opt => (
                    <div key={opt} className="flex items-center gap-3 p-3 border border-zinc-100 rounded-xl hover:bg-zinc-50 transition-colors">
                      <div className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center",
                        opt.includes('DEFAULT') ? "border-zinc-900" : "border-zinc-300"
                      )}>
                        {opt.includes('DEFAULT') && <div className="w-2 h-2 rounded-full bg-zinc-900" />}
                      </div>
                      <span className="text-xs text-zinc-700">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Order Preferences">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Contact Method</label>
                <select className="w-full p-2.5 text-xs border border-zinc-200 rounded-lg outline-none">
                  <option>SMS text for updates</option>
                  <option>Phone call for issues</option>
                  <option>In-app chat only</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Substitution Rule</label>
                <select className="w-full p-2.5 text-xs border border-zinc-200 rounded-lg outline-none">
                  <option>Use pre-set substitution rules</option>
                  <option>Contact customer for substitution</option>
                  <option>Cancel item and refund</option>
                </select>
              </div>
            </div>
          </Card>

          <Card title="Automated Messages">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Order Ready Message</label>
                <textarea defaultValue="Your order from Main Street Kitchen is ready for pickup! Order #: [order_number]. Please come to the pickup counter." className="w-full p-2.5 text-[10px] border border-zinc-200 rounded-lg outline-none min-h-[60px]" />
              </div>
              <Button variant="outline" size="sm" className="w-full text-[10px]">Restore Default</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderPackaging = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Default Packaging">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Standard Packaging</label>
                <select className="w-full p-2.5 text-sm border border-zinc-200 rounded-lg outline-none">
                  <option>Standard takeout containers - Plastic #5</option>
                  <option>Paper-based eco containers</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Hot Food Packaging</label>
                <select className="w-full p-2.5 text-sm border border-zinc-200 rounded-lg outline-none">
                  <option>Aluminum foil containers with paper lids</option>
                  <option>Insulated paper boxes</option>
                </select>
              </div>
            </div>
          </Card>

          <Card title="Sustainability Options">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-900">Use eco-friendly packaging</p>
                  <p className="text-xs text-zinc-500">Show sustainability badge to customers</p>
                </div>
                <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['Compostable', 'Recyclable', 'Made from recycled materials', 'Biodegradable'].map(opt => (
                  <div key={opt} className="flex items-center gap-2 p-2 border border-zinc-100 rounded-lg">
                    <div className="w-4 h-4 rounded border border-zinc-300 bg-emerald-500 border-emerald-500 flex items-center justify-center">
                      <CheckCircle2 size={10} className="text-white" />
                    </div>
                    <span className="text-[10px] text-zinc-700">{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Packaging Costs">
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Fee Collection</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-zinc-300" />
                    <span className="text-xs text-zinc-600">Item price (absorbed)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-zinc-900 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-zinc-900" />
                    </div>
                    <span className="text-xs text-zinc-900 font-bold">Pass to customer as separate fee</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                  <input type="text" defaultValue="0.50" className="w-full pl-6 pr-4 py-2 text-xs border border-zinc-200 rounded-lg outline-none" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderTaxInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Business Tax Information">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Legal Business Name</label>
                <input type="text" defaultValue="Main Street Kitchen LLC" className="w-full p-2.5 text-sm border border-zinc-200 rounded-lg outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tax ID / EIN</label>
                  <input type="text" defaultValue="XX-XXXXXXX" className="w-full p-2.5 text-sm border border-zinc-200 rounded-lg outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Business Structure</label>
                  <select className="w-full p-2.5 text-sm border border-zinc-200 rounded-lg outline-none">
                    <option>Limited Liability Company (LLC)</option>
                    <option>Sole Proprietorship</option>
                    <option>Corporation</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Tax Rates">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-900">Default Tax Rate</p>
                  <p className="text-xs text-zinc-500">San Francisco Sales Tax</p>
                </div>
                <div className="flex items-center gap-2">
                  <input type="text" defaultValue="8.5" className="w-16 p-2 text-sm border border-zinc-200 rounded-lg text-center outline-none" />
                  <span className="text-sm font-bold text-zinc-900">%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Collection & Remittance">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <p className="text-xs font-bold text-emerald-900">Uber collects and remits</p>
              </div>
              <p className="text-[10px] text-emerald-800 leading-relaxed">
                Uber will automatically calculate, collect, and remit taxes to the appropriate authorities on your behalf.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderPrepTimes = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Preparation Time Configuration">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-900">Current Prep Time</p>
                  <p className="text-xs text-zinc-500">Displayed to customers before ordering</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-zinc-900">15-25 min</p>
                  <Badge variant="success">Accurate</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Time Slot Configuration</h5>
                <div className="space-y-3">
                  {[
                    { slot: 'Lunch Rush', range: '20-30 min', time: '11:00 AM - 2:00 PM' },
                    { slot: 'Dinner Rush', range: '20-30 min', time: '5:00 PM - 9:00 PM' },
                    { slot: 'Normal Pace', range: '15-20 min', time: 'All other times' },
                  ].map(slot => (
                    <div key={slot.slot} className="p-4 border border-zinc-100 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-zinc-900">{slot.slot}</p>
                        <p className="text-[10px] text-zinc-500">{slot.time}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-zinc-900">{slot.range}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 size={14} /></Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full gap-2"><Plus size={14} /> Add Time Slot</Button>
              </div>
            </div>
          </Card>

          <Card title="Busy Mode Automation">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-900">Enable Busy Mode</p>
                  <p className="text-xs text-zinc-500">Automatically extend prep times during rushes</p>
                </div>
                <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Automatic Thresholds</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border border-emerald-500 bg-emerald-500 flex items-center justify-center">
                      <CheckCircle2 size={10} className="text-white" />
                    </div>
                    <span className="text-xs text-zinc-600">Orders exceed 25 per hour</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border border-emerald-500 bg-emerald-500 flex items-center justify-center">
                      <CheckCircle2 size={10} className="text-white" />
                    </div>
                    <span className="text-xs text-zinc-600">Order backlog &gt; 5 orders</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="AI Optimization">
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
                <Zap size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-800 leading-relaxed">
                  Based on your last 30 days, you're 15% slower during lunch rush. Consider adjusting lunch prep to 18-28 min.
                </p>
              </div>
              <Button variant="primary" size="sm" className="w-full">Apply Suggestion</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'info': return renderShopInfo();
      case 'hours': return renderHours();
      case 'prep': return renderPrepTimes();
      case 'docs': return renderDocs();
      case 'webshop': return renderWebshop();
      case 'customer': return renderCustomerOptions();
      case 'packaging': return renderPackaging();
      case 'tax': return renderTaxInfo();
      default: return (
        <div className="flex flex-col items-center justify-center p-12 text-zinc-400">
          <Info size={48} className="mb-4 opacity-20" />
          <p className="text-sm font-bold">Section Under Development</p>
          <p className="text-xs mt-1">The {activeTab} section is being enhanced with new features.</p>
          <Button variant="primary" size="sm" className="mt-6" onClick={() => setActiveTab('dashboard')}>Back to Dashboard</Button>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-px">
        <div className="flex gap-6">
          {['dashboard', 'info', 'hours', 'prep', 'docs', 'customer', 'webshop', 'packaging', 'tax'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as StoreTab)}
              className={cn(
                "pb-4 text-sm font-bold transition-all relative capitalize whitespace-nowrap",
                activeTab === tab ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              {tab === 'dashboard' ? 'Overview' : tab === 'prep' ? 'Prep Times' : tab.replace(/([A-Z])/g, ' $1')}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900" />}
            </button>
          ))}
        </div>
        {activeTab !== 'dashboard' && (
          <Button variant="ghost" size="sm" onClick={() => setActiveTab('dashboard')} className="text-zinc-400 hover:text-zinc-900">
            Back to Dashboard
          </Button>
        )}
      </div>

      {renderContent()}
    </div>
  );
};
