import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Image as ImageIcon,
  Paperclip,
  CheckCheck,
  Zap,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Chat {
  id: string;
  user: {
    name: string;
    avatar: string;
    status: 'online' | 'offline';
  };
  lastMessage: string;
  time: string;
  unread: number;
}

const MOCK_CHATS: Chat[] = [
  { 
    id: '1', 
    user: { name: 'Sarah Miller', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', status: 'online' },
    lastMessage: 'I am about 5 minutes away from the pickup location.',
    time: '2m ago',
    unread: 1
  },
  { 
    id: '2', 
    user: { name: 'David Lucas', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', status: 'offline' },
    lastMessage: 'The car was amazing, thank you so much!',
    time: '1h ago',
    unread: 0
  }
];

export function HostMessages() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(MOCK_CHATS[0]);
  const [message, setMessage] = useState('');

  return (
    <div className="h-[calc(100vh-12rem)] flex bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-96 border-r border-gray-50 flex flex-col">
        <div className="p-10 border-b border-gray-50">
          <div className="flex items-center gap-3 mb-8">
            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Secure Hub</span>
            <span className="flex items-center gap-1 text-green-600 text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-green-50 rounded-lg">
              <Zap className="w-3 h-3 fill-current" /> Encrypted
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-6">Messages</h1>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search conversations..."
              className="w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-600 outline-none transition-all text-sm font-bold"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {MOCK_CHATS.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={cn(
                "w-full p-8 flex items-center gap-4 transition-all hover:bg-gray-50/50 text-left",
                selectedChat?.id === chat.id && "bg-indigo-50/30 border-l-4 border-indigo-600"
              )}
            >
              <div className="relative flex-shrink-0">
                <img src={chat.user.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-md" alt={chat.user.name} />
                {chat.user.status === 'online' && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-black text-gray-900 text-sm truncate">{chat.user.name}</h4>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{chat.time}</span>
                </div>
                <p className={cn(
                  "text-xs truncate",
                  chat.unread > 0 ? "font-black text-gray-900" : "font-medium text-gray-400"
                )}>
                  {chat.lastMessage}
                </p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-indigo-600 text-white text-[10px] font-black rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/30">
        <AnimatePresence mode="wait">
          {selectedChat ? (
            <motion.div 
              key={selectedChat.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full flex flex-col bg-white"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={selectedChat.user.avatar} className="w-12 h-12 rounded-xl object-cover" alt="" />
                  <div>
                    <h3 className="font-black text-gray-900 leading-none">{selectedChat.user.name}</h3>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Booking #TR-8821</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"><Phone size={20} /></button>
                  <button className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"><Video size={20} /></button>
                  <button className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"><MoreVertical size={20} /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-12 space-y-8">
                {/* Outgoing */}
                <div className="flex justify-end gap-3">
                  <div className="max-w-md space-y-2">
                    <div className="bg-indigo-600 text-white p-6 rounded-[2rem] rounded-tr-none shadow-xl shadow-indigo-100">
                      <p className="text-sm font-bold leading-relaxed">Hello Sarah! I've just prepared the Tesla for you. It's fully charged and waiting at the arrival terminal. Safe travels!</p>
                    </div>
                    <div className="flex items-center justify-end gap-2 px-4">
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">10:42 AM</span>
                      <CheckCheck size={12} className="text-indigo-600" />
                    </div>
                  </div>
                </div>

                {/* Incoming */}
                <div className="flex justify-start gap-3">
                  <div className="max-w-md space-y-2">
                    <div className="bg-gray-100 text-gray-900 p-6 rounded-[2rem] rounded-tl-none">
                      <p className="text-sm font-bold leading-relaxed">Perfect, thank you! I am about 5 minutes away from the pickup location.</p>
                    </div>
                    <div className="px-4">
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">10:45 AM</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-50">
                <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-[2rem] focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-600 transition-all">
                  <button className="p-3 text-gray-400 hover:text-indigo-600 transition-colors"><Paperclip size={20} /></button>
                  <input 
                    type="text" 
                    placeholder="Type your secure message..."
                    className="flex-1 bg-transparent border-none outline-none font-bold text-sm text-gray-900 py-3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <button className="p-3 text-gray-400 hover:text-indigo-600 transition-colors"><ImageIcon size={20} /></button>
                    <button className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 hover:scale-105 transition-transform">
                      <Send size={18} className="rotate-[-10deg]" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center text-center px-12">
              <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-xl border border-gray-100 mb-8">
                <MessageSquare className="w-10 h-10 text-gray-200" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Select a Conversation</h2>
              <p className="text-gray-400 font-medium max-w-xs">Communicate securely with your guests through our encrypted messaging hub.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
