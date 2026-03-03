import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  ChevronDown,
  Star,
  MoreHorizontal,
  MessageCircle,
  Clock,
  ThumbsDown
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../types';
import { api } from '../api';

const Feedback = () => {
  const [activeSubTab, setActiveSubTab] = useState('Reviews');
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd get the store ID from a context
    api.customers.getFeedback({ store_id: 'default' })
      .then(res => setReviews(res.data))
      .finally(() => setLoading(false));
  }, []);

  const metrics = [
    { label: 'Customer reviews', value: '1,200' },
    { label: 'Awaiting replies', value: '4' },
    { label: 'Review offers redeemed', value: '250', hasInfo: true },
    { label: 'Review offers ROI', value: '6x', hasInfo: true },
  ];


  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Feedback</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        {['Overview', 'Reviews', 'Menu Items', 'Delivery Handoff'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={cn(
              "px-4 py-4 text-sm font-medium relative transition-colors",
              activeSubTab === tab ? "text-black" : "text-gray-500 hover:text-black"
            )}
          >
            {tab}
            {activeSubTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-black"
              />
            )}
          </button>
        ))}
      </div>

      {/* Filters Row 1 */}
      <div className="flex gap-4 mb-12">
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
          Stores (500) <ChevronDown size={16} />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
          2021/11/02 - 2021/11/16 <ChevronDown size={16} />
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-8 mb-16">
        {metrics.map((m, i) => (
          <div key={i} className="flex flex-col">
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
              {m.label}
              {m.hasInfo && <div className="w-3.5 h-3.5 rounded-full border border-gray-400 flex items-center justify-center text-[10px] text-gray-400">i</div>}
            </div>
            <div className="text-4xl font-bold tracking-tight">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Customer reviews</h2>
        <button className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
          Manage auto replies (0)
        </button>
      </div>

      {/* Banner */}
      <div className="bg-[#E6F4EA] p-6 rounded-xl flex items-center justify-between mb-8">
        <div className="flex gap-4 items-start">
          <div className="bg-[#0E8345] p-2 rounded-lg text-white">
            <MessageCircle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">You're getting a lot of customer reviews</h3>
            <p className="text-gray-700">Keep customers coming back by creating an auto reply to respond to their reviews in bulk.</p>
          </div>
        </div>
        <button className="bg-[#D1E9D6] hover:bg-[#C2E0C8] text-[#0E8345] px-6 py-2.5 rounded-full font-bold transition-colors">
          Create auto reply
        </button>
      </div>

      {/* Filters Row 2 */}
      <div className="flex gap-3 mb-10">
        {['Star rating', 'Review tags', 'Reply status', 'Comments'].map((f) => (
          <button key={f} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
            {f} <ChevronDown size={16} />
          </button>
        ))}
      </div>

      {/* Review List */}
      <div className="space-y-12">
        {reviews.map((r) => (
          <div key={r.id} className="flex gap-6 border-b border-gray-100 pb-12 last:border-0">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-[#D1E9D6] flex items-center justify-center border-4 border-white shadow-sm shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#0E8345] flex items-center justify-center text-white font-bold">
                {r.user.charAt(0)}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <h4 className="font-bold text-lg">{r.user}</h4>
                <div className="text-sm text-gray-500">Reviewed {r.date}</div>
              </div>
              <div className="text-sm text-gray-500 mb-4">{r.status}</div>

              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={cn(
                      i < r.rating ? "fill-black text-black" : "fill-gray-200 text-gray-200"
                    )}
                  />
                ))}
              </div>

              <h5 className="font-bold mb-1">{r.store}</h5>
              <p className="text-gray-700 mb-4">{r.comment}</p>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ThumbsDown size={14} />
                {r.items} items
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex flex-col items-end gap-4 min-w-[120px]">
              <div className="text-sm font-medium">Total {r.total}</div>
              <button className="bg-black text-white px-8 py-2.5 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                Reply
              </button>
              <div className="text-xs text-gray-500">{r.timeLeft}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
