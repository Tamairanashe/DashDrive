import React from 'react';
import { Card, Button, Badge } from './ui';
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  Filter, 
  ChevronRight,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Mail
} from 'lucide-react';
import { cn } from '../lib/utils';

const REPORT_TYPES = [
  { id: 'payouts', name: 'Payout Summary', desc: 'Consolidated earnings and fees', icon: FileText },
  { id: 'orders', name: 'Order History', desc: 'Complete list of all orders', icon: BarChart3 },
  { id: 'accuracy', name: 'Order Accuracy', desc: 'Error rates and unfulfilled items', icon: TrendingUp },
  { id: 'feedback', name: 'Customer Reviews', desc: 'All ratings and comments', icon: PieChartIcon },
];

export const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card title="Request Report">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Report Type</label>
                <select className="w-full p-2.5 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none">
                  {REPORT_TYPES.map(t => <option key={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Date Range</label>
                <select className="w-full p-2.5 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>Custom Range</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {['PDF', 'CSV', 'XLS'].map(f => (
                    <button key={f} className={cn(
                      "py-2 text-xs font-bold rounded-lg border transition-all",
                      f === 'PDF' ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
                    )}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <Button variant="primary" className="w-full mt-4 gap-2">
                <Download size={16} /> Generate Report
              </Button>
            </div>
          </Card>

          <Card title="Scheduled Reports" className="bg-zinc-50 border-dashed border-2">
            <div className="space-y-4">
              <div className="p-3 bg-white rounded-xl border border-zinc-100">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="info">Weekly</Badge>
                  <button className="text-zinc-400 hover:text-red-600"><Clock size={14} /></button>
                </div>
                <p className="text-sm font-bold text-zinc-900">Weekly Payout Summary</p>
                <p className="text-xs text-zinc-500 mt-1">Every Monday at 8:00 AM</p>
              </div>
              <Button variant="outline" className="w-full text-xs gap-2">
                <Calendar size={14} /> Schedule New
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900">Available Report Types</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REPORT_TYPES.map(report => (
              <Card key={report.id} className="group hover:border-zinc-300 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-100 rounded-xl text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    <report.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-zinc-900">{report.name}</h4>
                    <p className="text-xs text-zinc-500 mt-1">{report.desc}</p>
                  </div>
                  <ChevronRight size={18} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                </div>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between mt-8">
            <h3 className="text-lg font-bold text-zinc-900">Recent Reports</h3>
            <Button variant="ghost" size="sm">View All History</Button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Monthly_Sales_Feb_2024.pdf', date: 'Today, 10:23 AM', size: '2.4 MB' },
              { name: 'Payout_Details_Feb_26.csv', date: 'Yesterday, 4:15 PM', size: '156 KB' },
              { name: 'Customer_Feedback_Q1.xlsx', date: 'Feb 25, 2024', size: '1.1 MB' },
            ].map((file, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-zinc-100 hover:border-zinc-300 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400 group-hover:text-zinc-900 transition-colors">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">{file.name}</p>
                    <p className="text-xs text-zinc-500">{file.date} • {file.size}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-900"><Download size={18} /></Button>
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-900"><Mail size={18} /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
