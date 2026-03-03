import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search,
  MoreHorizontal,
  ArrowRight,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Mail,
  Phone,
  Gift,
  Search as SearchIcon,
  Download,
  Bell,
  ChevronRight,
  LayoutDashboard,
  ShieldCheck,
  ShoppingBag,
  Terminal,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Card, Button, Badge } from './ui';

// --- Types ---
type CustomersTab = 'dashboard' | 'groups' | 'reviews' | 'details';

// --- Mock Data ---
const CUSTOMER_DATA = {
  summary: {
    totalActive: 146,
    new: 45,
    returning: 78,
    lapsed: 23,
    overallRating: 4.2,
    totalReviews: 147,
    distribution: {
      5: 106,
      4: 22,
      3: 9,
      2: 6,
      1: 4
    }
  },
  topCustomers: [
    { id: '1', name: 'Michael R.', orders: 23, spent: 487, lastOrder: 'Today' },
    { id: '2', name: 'Sarah J.', orders: 18, spent: 412, lastOrder: 'Yesterday' },
    { id: '3', name: 'David K.', orders: 15, spent: 328, lastOrder: '2 days ago' },
    { id: '4', name: 'Emily R.', orders: 12, spent: 267, lastOrder: 'Today' },
    { id: '5', name: 'James L.', orders: 10, spent: 215, lastOrder: 'Yesterday' }
  ],
  reviews: [
    {
      id: 'rev_1',
      customer: 'John D.',
      rating: 5,
      time: '2 hours ago',
      text: "Best pepperoni pizza in town! Fast delivery.",
      tags: ['#great_food', '#fast_delivery'],
      orderId: '12492',
      items: 2,
      total: 31.50,
      needsResponse: false
    },
    {
      id: 'rev_2',
      customer: 'Sarah K.',
      rating: 2,
      time: '5 hours ago',
      text: "Food was good but fries were cold and soggy. Delivery took forever.",
      tags: ['#cold_fries', '#slow_delivery'],
      orderId: '12478',
      items: 3,
      total: 42.75,
      needsResponse: true
    },
    {
      id: 'rev_3',
      customer: 'Mike T.',
      rating: 4,
      time: 'Yesterday',
      text: "Solid pasta, generous portions. Will order again.",
      tags: ['#good_value', '#great_portions'],
      orderId: '12465',
      items: 1,
      total: 13.99,
      needsResponse: false
    }
  ],
  insights: {
    themes: {
      positive: [
        { theme: "Great pizza", mentions: 45, rating: 5.0 },
        { theme: "Fast delivery", mentions: 32, rating: 4.5 },
        { theme: "Friendly staff", mentions: 15, rating: 5.0 }
      ],
      negative: [
        { theme: "Cold fries", mentions: 18, rating: 2.1 },
        { theme: "Missing items", mentions: 12, rating: 2.0 }
      ]
    },
    recommendations: [
      "Address 'cold fries' complaints - check holding temperature",
      "Highlight 'great pizza' in marketing",
      "Respond to recent 2-star reviews to show engagement"
    ]
  }
};

const COHORT_DATA = [
  { month: 'Oct 2023', new: 52, r30: '18 (35%)', r60: '12 (23%)', r90: '8 (15%)' },
  { month: 'Nov 2023', new: 48, r30: '16 (33%)', r60: '10 (21%)', r90: '-' },
  { month: 'Dec 2023', new: 55, r30: '20 (36%)', r60: '-', r90: '-' },
  { month: 'Jan 2024', new: 45, r30: '-', r60: '-', r90: '-' }
];

const SEGMENT_CUSTOMERS = {
  new: [
    { name: 'Amanda L.', date: 'Jan 15, 2024', value: 32.50, items: 'Pizza, Salad' },
    { name: 'Brian T.', date: 'Jan 14, 2024', value: 18.99, items: 'Pizza' },
    { name: 'Christina W.', date: 'Jan 14, 2024', value: 24.75, items: 'Pasta, Drink' },
    { name: 'David M.', date: 'Jan 13, 2024', value: 41.20, items: 'Family Meal' }
  ]
};

// --- Sub-components ---

const LoadingState = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center bg-transparent min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl p-8 bg-white border-2 border-zinc-100 shadow-2xl rounded-[32px]"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white">
            <Terminal size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Syncing Customer Database</h2>
            <p className="text-sm text-zinc-500 font-medium">Main Street Kitchen</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              <span>Loading progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-zinc-900"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Segment aggregation complete', complete: progress > 25 },
              { label: 'LTV metric reconciliation stable', complete: progress > 50 },
              { label: 'Review history secure sync', complete: progress > 75 },
              { label: 'AI affinity mapping (100%)', complete: progress >= 100 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-medium">
                {item.complete ? (
                  <div className="text-emerald-500"><Check size={16} /></div>
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-200 border-t-zinc-900 animate-spin" />
                )}
                <span className={cn(item.complete ? "text-zinc-900" : "text-zinc-400 text-[10px] lowercase")}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App Component ---

export const Customers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CustomersTab>('dashboard');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [activeReview, setActiveReview] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 tracking-tighter uppercase mb-1">Customer Command</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <p className="text-xs font-semibold text-zinc-400 tracking-widest uppercase">Center Online // 146 Nodes Monitored</p>
          </div>
        </div>
      </div>

      {/* Engagement Modals */}
      <AnimatePresence>
        {isReplyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-200"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                <h3 className="text-xs font-semibold text-zinc-900 flex items-center gap-2 uppercase tracking-widest">
                  <MessageSquare size={18} className="text-zinc-400" /> REPLY TO REVIEW
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setIsReplyModalOpen(false)}>×</Button>
              </div>
              <div className="p-6 space-y-6">
                {activeReview && (
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                    <p className="text-[10px] font-semibold text-zinc-400 mb-1 uppercase tracking-widest">{activeReview.customer} said:</p>
                    <p className="text-sm italic text-zinc-600">"{activeReview.text}"</p>
                  </div>
                )}
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-4 cursor-pointer hover:bg-emerald-100 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0">
                      <Zap size={16} fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-emerald-900 uppercase tracking-widest">AI Suggested Response</p>
                      <p className="text-[11px] text-emerald-700 mt-1 font-medium italic">"Hi {activeReview?.customer.split(' ')[0]}, thank you for the 5-star review! We're thrilled you loved the pepperoni pizza. Hope to serve you again soon!"</p>
                    </div>
                  </div>
                  <textarea
                    className="w-full h-32 p-4 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 resize-none"
                    placeholder="Type your response here..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 font-semibold" onClick={() => setIsReplyModalOpen(false)}>CANCEL</Button>
                  <Button variant="primary" className="flex-1 font-semibold">SEND REPLY</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isOfferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-200"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                <h3 className="text-xs font-semibold text-zinc-900 flex items-center gap-2 uppercase tracking-widest">
                  <Gift size={18} className="text-amber-500" /> SEND PERSONAL OFFER
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setIsOfferModalOpen(false)}>×</Button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 text-white flex items-center justify-center font-black">
                    {selectedCustomer?.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">{selectedCustomer?.name}</p>
                    <Badge variant="warning">VIP CUSTOMER</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Free Item', desc: 'Add item to next order', icon: ShoppingBag },
                    { label: '15% Off', desc: 'On next 3 orders', icon: Zap },
                    { label: '$10 Credit', desc: 'Stored in wallet', icon: Users },
                    { label: 'Free Delivery', desc: 'For 30 days', icon: Star }
                  ].map(offer => (
                    <div key={offer.label} className="p-4 border border-zinc-100 rounded-xl hover:border-zinc-900 hover:bg-zinc-50 cursor-pointer transition-all group">
                      <offer.icon size={20} className="text-zinc-400 mb-3 group-hover:text-zinc-900" />
                      <p className="text-xs font-black text-zinc-900">{offer.label}</p>
                      <p className="text-[10px] text-zinc-500 mt-1">{offer.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 font-bold" onClick={() => setIsOfferModalOpen(false)}>CANCEL</Button>
                  <Button variant="primary" className="flex-1 font-bold">SEND OFFER</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-zinc-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'groups', label: 'Customer Groups', icon: Users },
            { id: 'reviews', label: 'Feedback & Reviews', icon: Star },
            { id: 'details', label: 'Customer Details', icon: Smartphone }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'outline'}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => {
                setActiveTab(tab.id as CustomersTab);
                setSelectedSegment(null);
                setSelectedCustomer(null);
              }}
            >
              <tab.icon size={16} className="mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={16} /> EXPORT
          </Button>
          <Button variant="primary" size="sm" className="gap-2">
            <Bell size={16} /> ALERTS
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Snapshot Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Users size={64} />
                </div>
                <h4 className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest shrink-0">Total Active</h4>
                <div className="text-3xl font-semibold text-zinc-900 mt-2">{CUSTOMER_DATA.summary.totalActive}</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-2">
                  <ArrowUpRight size={14} /> +12% <span className="text-zinc-400 font-medium ml-1">vs last month</span>
                </div>
              </Card>
              <Card className="relative overflow-hidden group">
                <h4 className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest shrink-0">New Customers</h4>
                <div className="text-3xl font-semibold text-zinc-900 mt-2">{CUSTOMER_DATA.summary.new}</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-2">
                  <ArrowUpRight size={14} /> +8% <span className="text-zinc-400 font-medium ml-1">vs last month</span>
                </div>
              </Card>
              <Card className="relative overflow-hidden group">
                <h4 className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest shrink-0">Returning</h4>
                <div className="text-3xl font-semibold text-zinc-900 mt-2">{CUSTOMER_DATA.summary.returning}</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-red-600 mt-2">
                  <ArrowDownRight size={14} /> -3% <span className="text-zinc-400 font-medium ml-1">vs last month</span>
                </div>
              </Card>
              <Card className="relative overflow-hidden group">
                <h4 className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest shrink-0">Lapsed</h4>
                <div className="text-3xl font-semibold text-zinc-900 mt-2">{CUSTOMER_DATA.summary.lapsed}</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-red-600 mt-2">
                  <ArrowUpRight size={14} /> +5% <span className="text-zinc-400 font-medium ml-1">at churn risk</span>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Rating Breakdown */}
              <Card title="Overall Rating">
                <div className="flex flex-col items-center py-4 border-b border-zinc-50 mb-4">
                  <div className="text-5xl font-semibold text-zinc-900 mb-1">{CUSTOMER_DATA.summary.overallRating}</div>
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill={i <= 4 ? "currentColor" : "none"} />)}
                  </div>
                  <p className="text-xs text-zinc-500 font-medium">({CUSTOMER_DATA.summary.totalReviews} reviews)</p>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = (CUSTOMER_DATA.summary.distribution as any)[star];
                    const percentage = Math.round((count / CUSTOMER_DATA.summary.totalReviews) * 100);
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-[10px] font-semibold text-zinc-400 w-4 uppercase tracking-tighter">{star}★</span>
                        <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-zinc-900 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                        <span className="text-[10px] font-semibold text-zinc-900 w-8">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Top Customers */}
              <Card title="Top Customers" headerAction={<Button variant="ghost" size="sm" className="text-[10px] font-semibold uppercase tracking-widest">VIEW ALL</Button>}>
                <div className="space-y-4">
                  {CUSTOMER_DATA.topCustomers.map((cust, i) => (
                    <div key={cust.id} className="flex items-center justify-between group cursor-pointer hover:bg-zinc-50 p-2 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-semibold text-xs group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">{cust.name}</p>
                          <p className="text-[10px] text-zinc-500 font-medium">{cust.orders} orders • ${cust.spent} spent</p>
                        </div>
                      </div>
                      <Badge variant="neutral" className="text-[8px] font-semibold tracking-widest">{cust.lastOrder.toUpperCase()}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Feedback Snippet */}
              <Card title="Recent Feedback" headerAction={<Button variant="ghost" size="sm" className="text-[10px] font-semibold uppercase tracking-widest">MANAGE</Button>}>
                <div className="space-y-4">
                  {CUSTOMER_DATA.reviews.slice(0, 2).map((rev) => (
                    <div key={rev.id} className="p-3 bg-zinc-50/50 rounded-xl border border-zinc-100 relative group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center text-amber-500">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill={i <= rev.rating ? "currentColor" : "none"} />)}
                          </div>
                          <span className="text-[10px] font-semibold text-zinc-900">{rev.customer}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-medium">{rev.time}</span>
                      </div>
                      <p className="text-xs text-zinc-600 line-clamp-2 italic font-medium leading-relaxed">"{rev.text}"</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex gap-1">
                          {rev.tags.slice(0, 1).map(tag => (
                            <span key={tag} className="text-[8px] font-semibold text-zinc-400 bg-white px-1.5 py-0.5 rounded border border-zinc-100 uppercase tracking-widest">{tag}</span>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-[9px] font-semibold group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all uppercase tracking-widest"
                            onClick={() => {
                              setActiveReview(rev);
                              setIsReplyModalOpen(true);
                            }}
                          >
                            REPLY
                          </Button>
                        </div>
                      </div>
                      {rev.needsResponse && (
                        <div className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* AI-Powered Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 text-white border-none relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Zap size={128} />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">AI Customer Insights</h3>
                      <p className="text-white/50 text-xs">Generated based on last 147 reviews</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Top Themes</p>
                      <div className="space-y-2">
                        {CUSTOMER_DATA.insights.themes.positive.map(theme => (
                          <div key={theme.theme} className="flex items-center justify-between">
                            <span className="text-xs text-white/80 font-medium">• "{theme.theme}"</span>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-bold text-white/50">{theme.mentions}</span>
                              <Star size={8} className="text-amber-500" fill="currentColor" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                      <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-3">Attention Needed</p>
                      <div className="space-y-2">
                        {CUSTOMER_DATA.insights.themes.negative.map(theme => (
                          <div key={theme.theme} className="flex items-center justify-between">
                            <span className="text-xs text-white/80 font-medium">• "{theme.theme}"</span>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-bold text-white/50">{theme.mentions}</span>
                              <Star size={8} className="text-red-400" fill="currentColor" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Recommendations" className="bg-zinc-50 border-dashed border-2 border-zinc-200">
                <div className="space-y-4">
                  {CUSTOMER_DATA.insights.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-zinc-900 mb-2 leading-relaxed">{rec}</p>
                        <Button size="sm" variant="outline" className="h-7 text-[10px] font-bold group">
                          EXECUTE TASK <ArrowRight size={10} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'groups' && (
          <motion.div
            key="groups"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Segment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'new', label: 'New Customers', count: 45, desc: 'First order in last 30 days', color: 'emerald', trend: '+12%', metrics: 'Avg order: $24.50 • Retention: 35%', icon: Zap },
                { id: 'returning', label: 'Returning Customers', count: 78, desc: '2+ orders in last 30 days', color: 'blue', trend: '-5%', metrics: 'Avg order: $28.75 • Frequency: 12 days', icon: TrendingUp },
                { id: 'lapsed', label: 'Lapsed Customers', count: 23, desc: 'No orders in last 30 days', color: 'zinc', trend: '+8%', metrics: 'Previously active • Avg LTV: $156', icon: Clock },
                { id: 'vip', label: 'VIP Customers', count: 12, desc: 'Top 10% by spend', color: 'amber', trend: 'stable', metrics: 'Avg spend: $450+ • Avg orders: 18', icon: Star }
              ].map(seg => (
                <Card key={seg.id} className="group hover:border-zinc-400 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                        seg.color === 'emerald' ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white" :
                          seg.color === 'blue' ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" :
                            seg.color === 'amber' ? "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white" :
                              "bg-zinc-100 text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white"
                      )}>
                        <seg.icon size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-zinc-900">{seg.label}</h3>
                          <Badge variant="neutral">{seg.count}</Badge>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium mt-0.5">{seg.desc}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "text-xs font-bold",
                      seg.trend.startsWith('+') ? "text-emerald-600" : seg.trend === 'stable' ? "text-zinc-400" : "text-red-500"
                    )}>
                      {seg.trend}
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-zinc-50 rounded-lg text-[11px] font-bold text-zinc-500 uppercase tracking-tight">
                    {seg.metrics}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-[10px] font-bold" onClick={() => setSelectedSegment(seg.id)}>VIEW LIST</Button>
                    <Button variant="primary" size="sm" className="flex-1 text-[10px] font-bold">ENGAGE</Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Cohort Analysis" subtitle="Customer retention over time">
                <div className="overflow-x-auto mt-4 -mx-6">
                  <table className="w-full text-left">
                    <thead className="bg-zinc-50 border-y border-zinc-100 font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                      <tr>
                        <th className="px-6 py-3">Month</th>
                        <th className="px-6 py-3 text-center">New</th>
                        <th className="px-6 py-3 text-center">30d</th>
                        <th className="px-6 py-3 text-center">60d</th>
                        <th className="px-6 py-3 text-center">90d</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50 font-mono text-[11px]">
                      {COHORT_DATA.map((row) => (
                        <tr key={row.month} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-zinc-900">{row.month}</td>
                          <td className="px-6 py-4 text-center text-zinc-600">{row.new}</td>
                          <td className="px-6 py-4 text-center font-bold text-emerald-600">{row.r30}</td>
                          <td className="px-6 py-4 text-center text-zinc-600">{row.r60}</td>
                          <td className="px-6 py-4 text-center text-zinc-400">{row.r90}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-50 flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-500" />
                  <p className="text-xs font-bold text-zinc-900">34% avg retention <span className="text-zinc-400 font-medium ml-1">(Higher than industry avg: 30%)</span></p>
                </div>
              </Card>

              <Card title="Customer Lifetime Value" subtitle="LTV distribution across segments">
                <div className="space-y-6 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Average LTV</p>
                      <p className="text-2xl font-black text-zinc-900 mt-1">$187</p>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">VIP Average</p>
                      <p className="text-2xl font-black text-amber-600 mt-1">$487</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: '$500+', percent: 5, color: 'bg-zinc-900' },
                      { label: '$251-500', percent: 20, color: 'bg-zinc-700' },
                      { label: '$101-250', percent: 40, color: 'bg-zinc-500' },
                      { label: '$0-100', percent: 35, color: 'bg-zinc-300' }
                    ].map(bar => (
                      <div key={bar.label} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                          <span className="text-zinc-500">{bar.label}</span>
                          <span className="text-zinc-900">{bar.percent}%</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                          <motion.div
                            className={cn("h-full rounded-full", bar.color)}
                            initial={{ width: 0 }}
                            animate={{ width: `${bar.percent}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card title="Review Summary" className="lg:col-span-1">
                <div className="flex flex-col items-center py-6">
                  <div className="text-5xl font-black text-zinc-900 mb-2">4.2</div>
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill={i <= 4 ? "currentColor" : "none"} />)}
                  </div>
                  <p className="text-sm text-zinc-500 font-medium tracking-tight">Based on 147 reviews</p>
                </div>
                <div className="space-y-3 mt-4">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = (CUSTOMER_DATA.summary.distribution as any)[star];
                    const percentage = Math.round((count / CUSTOMER_DATA.summary.totalReviews) * 100);
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-zinc-500 w-3">{star}</span>
                        <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-zinc-900 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-zinc-400 w-8">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card title="Mentions Analysis" className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ThumbsUp size={16} className="text-emerald-500" />
                      <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Positive Themes</h4>
                    </div>
                    {CUSTOMER_DATA.insights.themes.positive.map(theme => (
                      <div key={theme.theme} className="space-y-1">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-zinc-900">"{theme.theme}"</span>
                          <span className="text-zinc-400">{theme.mentions} mentions</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${(theme.mentions / 45) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ThumbsDown size={16} className="text-red-500" />
                      <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Negative Themes</h4>
                    </div>
                    {CUSTOMER_DATA.insights.themes.negative.map(theme => (
                      <div key={theme.theme} className="space-y-1">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-zinc-900">"{theme.theme}"</span>
                          <span className="text-zinc-400">{theme.mentions} mentions</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden">
                          <div className="h-full bg-red-400" style={{ width: `${(theme.mentions / 45) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8">
              <div className="flex items-center gap-2">
                <Button variant="primary" size="sm" className="h-9 font-bold px-6">ALL REVIEWS</Button>
                <Button variant="outline" size="sm" className="h-9 font-bold px-6 border-red-100 text-red-600 hover:bg-red-50">⚠️ NEEDS RESPONSE (6)</Button>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                  <input type="text" placeholder="Search reviews..." className="pl-9 pr-4 py-2 text-xs border border-zinc-200 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all" />
                </div>
                <Button variant="outline" size="sm" className="h-9 font-semibold uppercase tracking-widest"><Filter size={14} className="mr-2" /> RATING</Button>
              </div>
            </div>

            <div className="space-y-4">
              {CUSTOMER_DATA.reviews.map(rev => (
                <Card key={rev.id} className={cn("group hover:border-zinc-300 transition-all", rev.needsResponse && "border-red-100 bg-red-50/5")}>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center font-semibold text-zinc-400 border border-zinc-200 mb-2 uppercase tracking-widest">
                        {rev.customer[0]}
                      </div>
                      <Badge variant="neutral" className="text-[9px] font-semibold uppercase tracking-widest">{rev.customer.split(' ')[0]}</Badge>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-amber-500">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill={i <= rev.rating ? "currentColor" : "none"} />)}
                          </div>
                          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">• {rev.time}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 uppercase font-semibold tracking-widest">
                          Order <span className="text-zinc-900 font-bold">#{rev.orderId}</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-zinc-800 leading-relaxed">"{rev.text}"</p>
                      <div className="flex gap-2">
                        {rev.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-semibold text-zinc-400 border border-zinc-100 px-2 py-0.5 rounded-md bg-zinc-50 uppercase tracking-widest">{tag}</span>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                        <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-tight">
                          {rev.items} items • <span className="font-semibold text-zinc-900">${rev.total.toFixed(2)}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-[10px] font-semibold uppercase tracking-widest group-hover:bg-zinc-900 group-hover:text-white transition-all"
                            onClick={() => {
                              setActiveReview(rev);
                              setIsReplyModalOpen(true);
                            }}
                          >
                            REPLY
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 text-[10px] font-semibold uppercase tracking-widest">VIEW ORDER</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {rev.needsResponse && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-[8px] font-semibold px-2 py-1 rounded animate-pulse tracking-widest uppercase">
                      NEEDS RESPONSE
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            {/* Customer profile selection if no customer is selected */}
            {!selectedCustomer ? (
              <Card title="Customer Search & Management">
                <div className="space-y-6">
                  <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search by name, phone, email, or order #..."
                      className="w-full pl-12 pr-4 py-4 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 shadow-sm transition-all"
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Frequent Customers</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {CUSTOMER_DATA.topCustomers.map(cust => (
                        <div
                          key={cust.id}
                          onClick={() => setSelectedCustomer(cust)}
                          className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-xl hover:border-zinc-900 hover:shadow-lg transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-semibold text-xs uppercase tracking-widest">
                              {cust.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-zinc-900">{cust.name}</p>
                              <p className="text-[10px] text-zinc-500 font-medium">VIP • 23 Orders</p>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row gap-6 bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Users size={160} />
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 left-4 font-semibold text-[10px] tracking-widest text-zinc-400 uppercase"
                    onClick={() => setSelectedCustomer(null)}
                  >
                    ← BACK TO SEARCH
                  </Button>

                  <div className="shrink-0 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-semibold text-2xl mb-4 relative ring-8 ring-zinc-50 uppercase tracking-widest">
                      {selectedCustomer.name.split(' ').map((n: string) => n[0]).join('')}
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-500 text-zinc-900 border-4 border-white flex items-center justify-center">
                        <Zap size={14} fill="currentColor" />
                      </div>
                    </div>
                    <Badge variant="warning" className="w-full text-center">VIP CUSTOMER</Badge>
                  </div>

                  <div className="flex-1 lg:pl-4 space-y-6 z-10">
                    <div>
                      <h2 className="text-3xl font-semibold text-zinc-900 tracking-tight">{selectedCustomer.name}</h2>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                          <Phone size={14} className="text-zinc-400" /> (555) 123-4567
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                          <Mail size={14} className="text-zinc-400" /> michael.r@email.com
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                          <Calendar size={14} className="text-zinc-400" /> Member since Jan 2023
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-zinc-100">
                      <div>
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">Total Orders</p>
                        <p className="text-xl font-semibold text-zinc-900">23</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">Total Spent</p>
                        <p className="text-xl font-semibold text-zinc-900">$487.50</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">Average Order</p>
                        <p className="text-xl font-semibold text-zinc-900">$21.19</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">Avg Rating</p>
                        <div className="flex items-center gap-1">
                          <p className="text-xl font-semibold text-zinc-900">4.8</p>
                          <Star size={14} className="text-amber-500" fill="currentColor" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4">
                      <Button variant="primary" className="h-10 px-6 font-semibold text-xs gap-2 uppercase tracking-widest"><Mail size={16} /> SEND MESSAGE</Button>
                      <Button
                        variant="outline"
                        className="h-10 px-6 font-semibold text-xs gap-2 uppercase tracking-widest"
                        onClick={() => setIsOfferModalOpen(true)}
                      >
                        <Gift size={16} /> SEND OFFER
                      </Button>
                      <Button variant="outline" size="icon" className="h-10 w-10 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-600 transition-colors"><AlertCircle size={18} /></Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card title="Order History" className="lg:col-span-2">
                    <div className="overflow-x-auto -mx-6">
                      <table className="w-full text-left">
                        <thead className="bg-zinc-50 border-y border-zinc-100 font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                          <tr>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Order #</th>
                            <th className="px-6 py-4">Items</th>
                            <th className="px-6 py-4 text-right">Total</th>
                            <th className="px-6 py-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 font-medium text-xs">
                          {[
                            { date: 'Jan 15, 2024', id: '#12492', items: 'Pizza, Salad', total: '$31.50', status: 'Delivered' },
                            { date: 'Jan 12, 2024', id: '#12430', items: 'Pizza, Fries', total: '$24.50', status: 'Delivered' },
                            { date: 'Jan 08, 2024', id: '#12389', items: 'Pasta, Drink', total: '$18.75', status: 'Delivered' },
                            { date: 'Jan 05, 2024', id: '#12345', items: '2 Pizzas', total: '$38.99', status: 'Delivered' },
                            { date: 'Dec 30, 2023', id: '#12298', items: 'Salad, Drink', total: '$14.50', status: 'Delivered' }
                          ].map((order, i) => (
                            <tr key={i} className="hover:bg-zinc-50/50 transition-colors">
                              <td className="px-6 py-4 text-zinc-500 font-medium text-[10px] uppercase tracking-tight">{order.date}</td>
                              <td className="px-6 py-4 font-semibold text-zinc-900">#{order.id}</td>
                              <td className="px-6 py-4 text-zinc-600 font-medium italic">"{order.items}"</td>
                              <td className="px-6 py-4 text-right font-semibold text-zinc-900">${order.total}</td>
                              <td className="px-6 py-4 text-center">
                                <Badge variant="success" className="text-[8px] font-semibold uppercase tracking-widest">{order.status}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Button variant="ghost" className="w-full mt-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">VIEW ALL 23 ORDERS</Button>
                  </Card>

                  <Card title="Preferences & Feedback">
                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">Favorite Items</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-zinc-50 rounded-lg">
                            <span className="text-xs font-semibold text-zinc-700 uppercase tracking-tight">• Pepperoni Pizza</span>
                            <span className="text-[10px] font-semibold text-zinc-400 tracking-widest">12x</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-zinc-50 rounded-lg">
                            <span className="text-xs font-semibold text-zinc-700 uppercase tracking-tight">• Caesar Salad</span>
                            <span className="text-[10px] font-semibold text-zinc-400 tracking-widest">8x</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-zinc-100">
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">Recent Review</p>
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                          <div className="flex items-center gap-1 text-amber-500 mb-2">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                          </div>
                          <p className="text-xs text-emerald-900 font-medium leading-relaxed italic">"Great as always! The crust was perfect this time."</p>
                          <p className="text-[10px] text-emerald-600 font-semibold mt-2 uppercase tracking-widest">Jan 12, 2024</p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-zinc-100">
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">Special Instructions</p>
                        <div className="bg-zinc-50 p-3 rounded-lg border border-dashed border-zinc-200">
                          <p className="text-xs text-zinc-500 font-medium italic leading-relaxed">"Extra napkins, Well done pizza - no exceptions please."</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Customers;
