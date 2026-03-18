import React, { useState } from 'react';
import {
 FileText,
 RotateCcw,
 Save,
 Plus,
 Search,
 Edit3,
 Trash2,
 Eye,
 EyeOff,
 CheckCircle2,
 XCircle,
 Image as ImageIcon,
 Globe,
 BarChart,
 Settings,
 MoreVertical,
 Calendar,
 User,
 ArrowRight,
 MessageSquare,
 Share2,
 Layout
} from 'lucide-react';
import { cn } from '../utils';

interface BlogPost {
 id: string;
 title: string;
 description: string;
 author: string;
 date: string;
 image: string;
 status: 'Published' | 'Draft';
 category: string;
}

export const BlogSetup: React.FC = () => {
 const [searchTerm, setSearchTerm] = useState('');
 const [posts, setPosts] = useState<BlogPost[]>([
 {
 id: '1',
 title: 'Expanding Your Fleet: A Guide for DashDrive Partners',
 description: 'Learn the best strategies to scale your fleet operations efficiently and maximize revenue.',
 author: 'Admin',
 date: 'Oct 12, 2023',
 image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=60',
 status: 'Published',
 category: 'Partnership'
 },
 {
 id: '2',
 title: 'Smart Logistics: The Future of Urban Delivery',
 description: 'How AI and machine learning are revolutionizing the way we think about last-mile delivery.',
 author: 'Admin',
 date: 'Nov 05, 2023',
 image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=60',
 status: 'Published',
 category: 'Technology'
 },
 {
 id: '3',
 title: 'Top 10 Cities for Real-Time Demand Density',
 description: 'A data-driven analysis of where the highest trip demand is currently occurring across North America.',
 author: 'Admin',
 date: 'Dec 01, 2023',
 image: 'https://images.unsplash.com/photo-1449156059431-78995541dca5?w=1200&auto=format&fit=crop&q=60',
 status: 'Draft',
 category: 'Data Analysis'
 }
 ]);

 const renderHeader = () => (
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 mt-4">
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg">
 <FileText className="w-6 h-6 text-[#0089D1]" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-black text-slate-400 tracking-[0.2em]">Configuration</span>
 <div className="w-1 h-1 rounded-full bg-slate-200" />
 <span className="text-[10px] font-black text-[#0089D1] tracking-[0.2em]">Content Management</span>
 </div>
 <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mt-1">Blog Setup</h1>
 </div>
 </div>
 <p className="text-base font-medium text-slate-500 max-w-lg leading-relaxed">
 Manage your platform's editorial content, marketing announcements, and SEO articles from a centralized dashboard.
 </p>
 </div>

 <div className="flex items-center gap-4">
 <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-[24px] text-xs font-black hover:bg-slate-50 hover:text-slate-600 transition-all">
 <RotateCcw className="w-5 h-5" /> Reset
 </button>
 <button className="flex items-center gap-3 px-10 py-4 bg-[#0089D1] text-white rounded-[24px] text-xs font-black hover:bg-[#007AB8] transition-all shadow-xl shadow-[#0089D1]/20 font-display">
 <Save className="w-5 h-5" /> Persist Changes
 </button>
 </div>
 </div>
 );

 const toggleStatus = (id: string) => {
 setPosts(posts.map(p =>
 p.id === id ? { ...p, status: p.status === 'Published' ? 'Draft' : 'Published' } : p
 ));
 };

 return (
 <div className="max-w-[1700px] mx-auto space-y-12 pb-20 px-4">
 {renderHeader()}

 <div className="flex flex-col lg:flex-row gap-10 min-h-[600px]">
 {/* Left Panel: Content Creation & Search */}
 <div className="lg:w-[400px] shrink-0 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
 <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
 <div className="space-y-4">
 <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] ml-4">Search Articles</label>
 <div className="relative group">
 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#0089D1] transition-colors" />
 <input
 type="text"
 placeholder="Keywords, titles..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[24px] text-xs font-bold text-slate-600 outline-none hover:border-slate-200 focus:ring-8 focus:ring-[#0089D1]/5 transition-all"
 />
 </div>
 </div>

 <button className="w-full py-6 bg-slate-900 text-white rounded-[32px] text-xs font-black tracking-[0.3em] shadow-xl shadow-slate-900/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
 <Plus className="w-5 h-5" /> Write New Post
 </button>

 <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100/50 space-y-4">
 <div className="flex items-center gap-3 text-blue-600">
 <Globe className="w-5 h-5" />
 <h4 className="text-[10px] font-black ">Global SEO Status</h4>
 </div>
 <div className="space-y-3">
 <div className="flex justify-between items-center text-[10px] font-bold tracking-tighter">
 <span className="text-slate-500">Indexing Velocity</span>
 <span className="text-blue-600">92%</span>
 </div>
 <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
 <div className="w-[92%] h-full bg-blue-500" />
 </div>
 </div>
 <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic">
 Search engine crawlers visited your blog 14 minutes ago. 2 posts are pending meta-description updates.
 </p>
 </div>
 </div>

 <div className="bg-slate-900 p-8 rounded-[48px] text-white space-y-6 relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:bg-blue-500/30 transition-all" />
 <div className="flex items-center gap-4 relative z-10">
 <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
 <BarChart className="w-6 h-6 text-blue-400" />
 </div>
 <div>
 <h4 className="text-lg font-black tracking-tight">Blog Analytics</h4>
 <p className="text-[10px] font-black text-white/40 ">Last 30 Days</p>
 </div>
 </div>
 <div className="grid grid-cols-2 gap-4 relative z-10">
 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
 <span className="text-[10px] font-black text-white/30 block mb-1">Reads</span>
 <span className="text-xl font-black">12.4K</span>
 </div>
 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
 <span className="text-[10px] font-black text-white/30 block mb-1">Conversions</span>
 <span className="text-xl font-black">4.8%</span>
 </div>
 </div>
 </div>
 </div>

 {/* Right Panel: Blog Posts Grid */}
 <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {posts.map((post) => (
 <div key={post.id} className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl hover:border-blue-100 transition-all duration-500">
 <div className="h-56 relative overflow-hidden shrink-0">
 <img
 src={post.image}
 alt={post.title}
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
 />
 <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-8">
 <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white border border-white/20">
 {post.category}
 </span>
 </div>
 <button
 onClick={() => toggleStatus(post.id)}
 className={cn(
 "absolute top-6 right-6 p-3 rounded-2xl backdrop-blur-md transition-all shadow-lg",
 post.status === 'Published'
 ? "bg-emerald-500/90 text-white hover:bg-emerald-600"
 : "bg-slate-700/90 text-white hover:bg-slate-800"
 )}
 >
 {post.status === 'Published' ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
 </button>
 </div>

 <div className="p-10 flex-1 flex flex-col justify-between space-y-6">
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black ">
 <Calendar className="w-4 h-4" /> {post.date}
 <div className="w-1 h-1 rounded-full bg-slate-200" />
 <User className="w-4 h-4" /> {post.author}
 </div>
 <span className={cn(
 "text-[10px] font-black px-3 py-1 rounded-full",
 post.status === 'Published' ? "text-emerald-500 bg-emerald-50" : "text-slate-400 bg-slate-50"
 )}>
 {post.status}
 </span>
 </div>
 <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-[#0089D1] transition-colors line-clamp-2">
 {post.title}
 </h3>
 <p className="text-sm font-medium text-slate-500 leading-relaxed line-clamp-3">
 {post.description}
 </p>
 </div>

 <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
 <div className="flex items-center -space-x-2">
 {[1, 2, 3].map((i) => (
 <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
 <img src={`https://i.pravatar.cc/150?u=${post.id}${i}`} alt="viewer" />
 </div>
 ))}
 <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">+12</div>
 </div>
 <div className="flex items-center gap-2">
 <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-2xl transition-all">
 <Edit3 className="w-5 h-5" />
 </button>
 <button className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
 <Trash2 className="w-5 h-5" />
 </button>
 </div>
 </div>
 </div>
 </div>
 ))}

 {/* Pagination Placeholder */}
 <div className="col-span-full py-8 flex items-center border border-dashed border-slate-200 rounded-[32px] justify-between px-10">
 <span className="text-[10px] font-black text-slate-400 italic">Showing 3 of 127 articles</span>
 <div className="flex items-center gap-4">
 <button className="p-3 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:bg-slate-50 transition-all opacity-50 pointer-events-none">
 <ArrowRight className="w-5 h-5 rotate-180" />
 </button>
 <div className="flex items-center gap-1.5">
 <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">1</div>
 <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 hover:bg-slate-100 transition-all cursor-pointer">2</div>
 <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 hover:bg-slate-100 transition-all cursor-pointer">3</div>
 <span className="text-slate-200">...</span>
 </div>
 <button className="p-3 bg-white border border-slate-100 text-[#0089D1] rounded-2xl hover:bg-blue-50 transition-all">
 <ArrowRight className="w-5 h-5" />
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Bottom SEO Helper Section */}
 <div className="max-w-4xl mx-auto p-12 bg-white rounded-[64px] border border-slate-100 shadow-sm space-y-10 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-[#0089D1]/5 rounded-full blur-[80px] -mr-32 -mt-32" />

 <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
 <div className="p-8 bg-blue-50 rounded-[40px] text-blue-500 shrink-0 border border-blue-100 shadow-inner">
 <Layout className="w-12 h-12" />
 </div>
 <div>
 <h4 className="text-2xl font-black tracking-tight text-slate-900 italic">Blog Architecture & SEO</h4>
 <p className="text-sm font-medium text-slate-500 leading-relaxed mt-4">
 All blog posts are automatically wrapped in JSON-LD Schema.org metadata for enhanced search appearance.
 Ensure high-resolution **featured images (1200x630px)** are provided for optimal social media share cards.
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
 <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-3">
 <div className="p-3 bg-white w-fit rounded-xl text-emerald-500">
 <Share2 className="w-5 h-5" />
 </div>
 <h5 className="text-[10px] font-black text-slate-900 ">Share Cards</h5>
 <p className="text-[10px] font-medium text-slate-500">Optimized for Facebook, X (Twitter), and LinkedIn previews.</p>
 </div>
 <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-3">
 <div className="p-3 bg-white w-fit rounded-xl text-blue-500">
 <MessageSquare className="w-5 h-5" />
 </div>
 <h5 className="text-[10px] font-black text-slate-900 ">Discussion Hub</h5>
 <p className="text-[10px] font-medium text-slate-500">Comment moderation and moderation API status: Active.</p>
 </div>
 <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-3">
 <div className="p-3 bg-white w-fit rounded-xl text-amber-500">
 <Settings className="w-5 h-5" />
 </div>
 <h5 className="text-[10px] font-black text-slate-900 ">RSS Endpoint</h5>
 <p className="text-[10px] font-medium text-slate-500">Auto-generated feed for external content aggregators.</p>
 </div>
 </div>
 </div>
 </div>
 );
};
