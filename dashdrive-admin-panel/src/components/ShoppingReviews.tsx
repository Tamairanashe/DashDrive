import React, { useState } from 'react';
import {
 Search,
 Filter,
 MoreVertical,
 Eye,
 Trash2,
 CheckCircle2,
 XCircle,
 Star,
 Calendar,
 Download,
 Flag,
 MessageSquare,
 Store,
 Package,
 ShieldCheck,
 ChevronRight,
 TrendingUp,
 ShieldAlert
} from 'lucide-react';
import { cn } from '../utils';

interface ShoppingReview {
 id: string;
 customer: {
 name: string;
 avatar: string;
 };
 product: string;
 vendor: string;
 rating: number;
 comment: string;
 date: string;
 status: 'Published' | 'Hidden' | 'Reported';
}

const mockReviews: ShoppingReview[] = [
 {
 id: 'REV-SHP-101',
 customer: { name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?u=alex' },
 product: 'Ultra-Slim Smart Watch 4',
 vendor: 'ElectroHub Store',
 rating: 5,
 comment: 'Absolutely love the battery life on this watch. Highly recommend it to everyone!',
 date: 'Oct 12, 2023',
 status: 'Published'
 },
 {
 id: 'REV-SHP-102',
 customer: { name: 'Sarah Miller', avatar: 'https://i.pravatar.cc/150?u=sarah' },
 product: 'Premium Leather Tote Bag',
 vendor: 'Urban Fashion',
 rating: 4,
 comment: 'Great quality, but the strap is a bit shorter than expected. Still beautiful.',
 date: 'Oct 11, 2023',
 status: 'Published'
 },
 {
 id: 'REV-SHP-103',
 customer: { name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?u=michael' },
 product: '4K OLED Gaming Monitor',
 vendor: 'Gadget World',
 rating: 1,
 comment: 'The monitor arrived with a cracked screen. Terrible packaging. Need a refund.',
 date: 'Oct 10, 2023',
 status: 'Reported'
 },
 {
 id: 'REV-SHP-104',
 customer: { name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?u=emma' },
 product: 'Moisturizing Face Serum',
 vendor: 'Beauty Palace',
 rating: 5,
 comment: 'Best serum I have ever used. My skin feels so soft and hydrated.',
 date: 'Oct 09, 2023',
 status: 'Hidden'
 }
];

export const ShoppingReviews: React.FC = () => {
 const [searchQuery, setSearchQuery] = useState('');
 const [activeFilter, setActiveFilter] = useState('All Reviews');

 const filters = ['All Reviews', 'Published', 'Reported', 'Hidden', 'Flagged by AI'];

 return (
 <div className="space-y-8 animate-in fade-in duration-700">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Trust & Moderation</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Monitor marketplace feedback, handle reported content, and analyze rating trends</p>
 </div>
 <div className="flex items-center gap-4">
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold font-small-caps text-slate-600 hover:bg-slate-50 transition-all shadow-sm group">
 <TrendingUp className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
 Rating Analytics
 </button>
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-bold font-small-caps shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">
 <ShieldCheck className="w-4 h-4 text-white/50" />
 Moderation Rules
 </button>
 </div>
 </div>

 {/* Filter Pills / AI Insights */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
 <div className="lg:col-span-8 flex bg-slate-100 p-1.5 rounded-2xl w-fit overflow-x-auto scrollbar-hide border border-slate-200/50 h-fit">
 {filters.map((f) => (
 <button
 key={f}
 onClick={() => setActiveFilter(f)}
 className={cn(
 "px-6 py-2.5 rounded-xl text-[10px] font-bold font-small-caps transition-all whitespace-nowrap",
 activeFilter === f
 ? "bg-white text-primary shadow-sm border border-slate-200/50"
 : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
 )}
 >
 {f}
 {f === 'Reported' && <span className="ml-2 px-1.5 py-0.5 bg-rose-100 text-rose-600 rounded-md text-[9px] font-black">04</span>}
 </button>
 ))}
 </div>
 <div className="lg:col-span-4 bg-emerald-50 border border-emerald-100/50 p-4 rounded-3xl flex items-center gap-4">
 <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600">
 <ShieldCheck className="w-5 h-5" />
 </div>
 <div>
 <p className="text-[10px] font-black text-emerald-800 leading-none mb-1">AI Auto-Moderation</p>
 <p className="text-[11px] font-medium text-emerald-700/60 leading-tight">98.2% of spam reviews are being intercepted automatically.</p>
 </div>
 </div>
 </div>

 {/* Search & Global Controls */}
 <div className="flex flex-col md:flex-row items-center justify-between gap-6">
 <div className="relative w-full md:w-[450px] group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search by Product, Vendor, or Reviewer..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:border-primary/30 outline-none transition-all shadow-sm"
 />
 </div>
 <div className="flex items-center gap-3">
 <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm">
 <Star className="w-5 h-5" />
 </button>
 <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm">
 <Download className="w-5 h-5" />
 </button>
 </div>
 </div>

 {/* Reviews Table */}
 <div className="bg-white rounded-[40px] shadow-soft border border-slate-100/50 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-slate-50 bg-slate-50/20">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Verified Reviewer</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Product & Source</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Customer Experience</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">State</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Operations</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {mockReviews.map((review) => (
 <tr key={review.id} className="hover:bg-slate-50/50 transition-colors group">
 <td className="px-8 py-6">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full border border-slate-100 overflow-hidden shadow-sm">
 <img src={review.customer.avatar} className="w-full h-full object-cover" alt="" />
 </div>
 <div>
 <p className="text-sm font-bold text-slate-800 leading-tight">{review.customer.name}</p>
 <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-tighter">{review.date}</p>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1.5">
 <div className="flex items-center gap-2">
 <Package className="w-3.5 h-3.5 text-primary/60" />
 <span className="text-sm font-bold text-slate-700 max-w-[150px] truncate">{review.product}</span>
 </div>
 <div className="flex items-center gap-2">
 <Store className="w-3.5 h-3.5 text-slate-400" />
 <span className="text-[11px] font-medium text-slate-500">{review.vendor}</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="max-w-md space-y-2">
 <div className="flex items-center gap-0.5">
 {[...Array(5)].map((_, i) => (
 <Star
 key={i}
 className={cn(
 "w-3.5 h-3.5",
 i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
 )}
 />
 ))}
 </div>
 <p className="text-xs text-slate-600 font-medium leading-relaxed italic group-hover:not-italic group-hover:text-slate-900 transition-all truncate group-hover:whitespace-normal">
 "{review.comment}"
 </p>
 </div>
 </td>
 <td className="px-8 py-6">
 <ReviewStatusBadge status={review.status} />
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
 <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-primary hover:bg-white border border-transparent hover:border-slate-100 shadow-sm transition-all" title="View Full Log">
 <MessageSquare className="w-4.5 h-4.5" />
 </button>
 {review.status === 'Reported' ? (
 <button className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm" title="Resolve Issue">
 <CheckCircle2 className="w-4.5 h-4.5" />
 </button>
 ) : (
 <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-amber-500 hover:bg-white border border-transparent hover:border-slate-100 shadow-sm transition-all" title="Hide Review">
 <XCircle className="w-4.5 h-4.5" />
 </button>
 )}
 <div className="w-px h-6 bg-slate-100 mx-1" />
 <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-red-500 hover:bg-white border border-transparent hover:border-slate-100 shadow-sm transition-all" title="Permanently Delete">
 <Trash2 className="w-4.5 h-4.5" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Table Footer */}
 <div className="px-8 py-5 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
 <div className="flex items-center gap-4">
 <span className="text-[10px] font-bold text-slate-400 leading-none">Showing 1-10 of 2,420 Submissions</span>
 </div>
 <div className="flex items-center gap-2">
 <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition-all">Prev</button>
 <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold">Next</button>
 </div>
 </div>
 </div>

 {/* AI Trust Guard Summary */}
 <div className="bg-slate-900 rounded-[48px] p-12 relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
 <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
 <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[32px] flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 shadow-2xl">
 <ShieldAlert className="w-10 h-10" />
 </div>
 <div className="space-y-2">
 <h4 className="text-xl font-display font-black text-white tracking-tight">Active Reputation Engine</h4>
 <p className="text-sm text-white/50 font-medium max-w-xl">
 Low-rated reviews are automatically flagged for <span className="text-primary font-bold">Priority Moderation</span>. Multiple reports for the same product may trigger an automatic Vendor Quality Audit.
 </p>
 </div>
 <div className="md:ml-auto">
 <button className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[11px] font-bold font-small-caps shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
 Review AI Logs
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>
 </div>
 );
};

const ReviewStatusBadge: React.FC<{ status: ShoppingReview['status'] }> = ({ status }) => (
 <span className={cn(
 "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black border",
 status === 'Published' && "bg-emerald-50 text-emerald-600 border-emerald-100/50",
 status === 'Reported' && "bg-rose-50 text-rose-600 border-rose-100/50 animate-pulse",
 status === 'Hidden' && "bg-slate-100 text-slate-400 border-slate-200/50"
 )}>
 <div className={cn(
 "w-1.5 h-1.5 rounded-full",
 status === 'Published' && "bg-emerald-500",
 status === 'Reported' && "bg-rose-500",
 status === 'Hidden' && "bg-slate-400"
 )} />
 {status}
 </span>
);
