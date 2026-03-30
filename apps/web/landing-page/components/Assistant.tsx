
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Sparkles, Wand2 } from 'lucide-react';
import { getMobilityAssistantResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const Assistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Welcome to DashDrive Concierge. How may I assist your journey today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInputValue('');
    setIsLoading(true);

    const response = await getMobilityAssistantResponse(userMsg);
    setMessages(prev => [...prev, { role: 'assistant', content: response || "Pardon me, I'm experiencing a brief interruption." }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-10 right-10 z-[60]">
      {isOpen ? (
        <div className="bg-white/95 backdrop-blur-2xl rounded-[40px] shadow-[0_32px_128px_rgba(0,0,0,0.15)] w-[380px] md:w-[440px] h-[600px] flex flex-col border border-white/40 overflow-hidden animate-reveal">
          {/* Header */}
          <div className="p-8 brand-teal flex items-center justify-between shadow-xl shadow-emerald-900/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl">
                <Wand2 size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-black text-xl tracking-tight leading-none">DashDrive Concierge</span>
                <span className="text-black/50 text-xs font-black uppercase tracking-widest mt-1 flex items-center gap-1">
                  AI Powered <Sparkles size={10} />
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-3 bg-black/5 hover:bg-black/10 rounded-full transition-colors">
              <X size={20} className="text-black" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-transparent no-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${msg.role === 'user' ? 'bg-black text-white' : 'brand-teal text-black shadow-inner'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-5 rounded-[28px] text-[15px] font-medium leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-black text-white rounded-tr-none' : 'bg-white border border-gray-100 rounded-tl-none'}`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2 items-center bg-white p-5 rounded-[28px] shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-8 border-t border-gray-100 bg-white/50">
            <div className="flex items-center gap-4 bg-gray-50 rounded-[32px] px-6 py-3 border border-gray-100 focus-within:ring-2 focus-within:ring-[#00D665]/20 focus-within:bg-white transition-all">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Where would you like to go?"
                className="flex-1 bg-transparent outline-none text-[15px] font-bold py-2 placeholder:text-gray-400"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className={`p-3 rounded-2xl ${isLoading ? 'text-gray-300' : 'bg-black text-white hover:scale-105'} transition-all shadow-lg active:scale-95`}
              >
                <Send size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="brand-teal text-black w-20 h-20 rounded-[32px] shadow-[0_16px_48px_rgba(0,214,101,0.4)] flex items-center justify-center hover:scale-110 hover:shadow-[0_24px_64px_rgba(0,214,101,0.5)] transition-all duration-500 group relative"
        >
          <Wand2 size={32} strokeWidth={2.5} />
          <div className="absolute right-full mr-6 bg-black text-white px-6 py-3 rounded-2xl shadow-2xl text-base font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-x-4 group-hover:translate-x-0">
            Need help with your trip?
          </div>
          <div className="absolute -top-3 -right-3 bg-black text-white text-[12px] font-black px-3 py-1.5 rounded-full shadow-lg border-2 border-[#00D665] animate-pulse">
            AI
          </div>
        </button>
      )}
    </div>
  );
};

export default Assistant;
