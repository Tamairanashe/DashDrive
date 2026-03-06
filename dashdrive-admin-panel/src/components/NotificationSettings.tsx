import React, { useState } from 'react';
import {
 Bell,
 MessageSquare,
 Smartphone,
 Share2,
 Shield,
 RotateCcw,
 Save,
 ChevronRight,
 Search,
 Lock,
 Eye,
 EyeOff,
 RefreshCw,
 Clock,
 Zap,
 Rocket,
 Package,
 Gift,
 ShieldCheck,
 AlertTriangle,
 Info,
 CheckCircle2,
 Database,
 Globe,
 Network,
 Key,
 UserCheck,
 Star,
 Percent,
 Ticket,
 Truck,
 CreditCard,
 BookOpen,
 ShoppingBag,
 ShoppingCart,
 Utensils
} from 'lucide-react';
import { cn } from '../utils';

interface NotificationSettingsProps {
 activeTab?: string;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ activeTab: externalTab }) => {
 // Top-level tabs
 const [mainTab, setMainTab] = useState<'Message' | 'Firebase'>('Message');

 // Sub-tabs for Notification Message
 const [categoryTab, setCategoryTab] = useState<'Chatting' | 'Regular' | 'Parcel' | 'Driver' | 'Other' | 'Mart' | 'Shopping' | 'Food' | 'Fintech'>('Chatting');

 // Chatting Settings State
 const [chatTripAcceptedOn, setChatTripAcceptedOn] = useState(true);
 const [chatTripAcceptedMsg, setChatTripAcceptedMsg] = useState("Your trip is accepted by {driverName}. Trip ID: {tripId}");
 const [chatArrivalOn, setChatArrivalOn] = useState(true);
 const [chatArrivalMsg, setChatArrivalMsg] = useState("{driverName} has arrived at your location.");

 // Regular Trip State - Customer
 const [tripStartedOn, setTripStartedOn] = useState(true);
 const [tripStartedMsg, setTripStartedMsg] = useState("Your trip is started.");
 const [tripCompletedOn, setTripCompletedOn] = useState(true);
 const [tripCompletedMsg, setTripCompletedMsg] = useState("Your trip is completed. Total paid: {paidAmount}");

 // Firebase State
 const [serviceAccount, setServiceAccount] = useState("");
 const [firebaseApiKey, setFirebaseApiKey] = useState("");
 const [projectId, setProjectId] = useState("dashdrive-enterprise-fcm");

 const renderChatting = () => (
 <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {/* Customer Chat Notifications */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-indigo-50 rounded-[28px] text-indigo-500">
 <MessageSquare className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Customer Chat</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Automated User Comms</p>
 </div>
 </div>

 <div className="space-y-6">
 {[
 { label: 'Trip Accepted', on: chatTripAcceptedOn, setOn: setChatTripAcceptedOn, msg: chatTripAcceptedMsg, setMsg: setChatTripAcceptedMsg },
 { label: 'Driver Arrival', on: chatArrivalOn, setOn: setChatArrivalOn, msg: chatArrivalMsg, setMsg: setChatArrivalMsg }
 ].map((item, i) => (
 <div key={i} className="space-y-4 p-8 bg-slate-50 rounded-[40px] border border-slate-100 group hover:border-indigo-200 transition-all">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="text-sm font-black text-slate-900">{item.label}</span>
 <Info className="w-3 h-3 text-slate-300" />
 </div>
 <button
 onClick={() => item.setOn(!item.on)}
 className={cn(
 "w-12 h-6 rounded-full p-1 transition-all duration-500 flex items-center",
 item.on ? "bg-indigo-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
 </button>
 </div>
 <textarea
 value={item.msg}
 onChange={(e) => item.setMsg(e.target.value)}
 className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20"
 rows={2}
 />
 </div>
 ))}
 </div>
 </div>

 {/* Driver Chat Notifications */}
 <div className="bg-slate-900 p-10 rounded-[60px] text-white shadow-2xl space-y-8 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32" />
 <div className="flex items-center gap-4 relative z-10">
 <div className="p-4 bg-white/10 rounded-[28px] text-indigo-400">
 <Smartphone className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black">Driver Chat</h3>
 <p className="text-[10px] font-black text-white/30 mt-1">Automation for Drivers</p>
 </div>
 </div>

 <div className="space-y-6 relative z-10">
 <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-sm font-black">New Trip Request</span>
 <button className="w-12 h-6 rounded-full p-1 bg-emerald-500 flex flex-row-reverse items-center">
 <div className="w-4 h-4 bg-white rounded-full" />
 </button>
 </div>
 <textarea
 className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white/60 outline-none"
 defaultValue="You have a new trip request. Please respond quickly."
 rows={2}
 />
 </div>
 </div>
 </div>
 </div>
 </div>
 );

 const renderRegularTrip = () => (
 <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm">
 <div className="flex items-center justify-between mb-10">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-emerald-50 rounded-[28px] text-emerald-500">
 <Rocket className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900">Regular Trip Lifecycle</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Customer & Driver Push Alerts</p>
 </div>
 </div>
 <div className="flex items-center gap-2 text-[10px] font-black text-[#0089D1] ">
 <Info className="w-4 h-4" />
 Read Instruction
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {/* Customer Section */}
 <div className="space-y-6">
 <h4 className="text-xs font-black text-slate-400 ml-4 mb-4">Customer Events</h4>
 {[
 { label: 'Trip Started', on: tripStartedOn, setOn: setTripStartedOn, msg: tripStartedMsg, setMsg: setTripStartedMsg },
 { label: 'Trip Completed', on: tripCompletedOn, setOn: setTripCompletedOn, msg: tripCompletedMsg, setMsg: setTripCompletedMsg },
 { label: 'Trip Canceled', on: true, setOn: () => { }, msg: 'Your trip is cancelled.', setMsg: () => { } },
 { label: 'Payment Successful', on: true, setOn: () => { }, msg: '{paidAmount} payment successful on this trip by {methodName}.', setMsg: () => { } }
 ].map((ev, i) => (
 <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-[32px] space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-sm font-black text-slate-900">{ev.label}</span>
 <button
 onClick={() => ev.setOn(!ev.on)}
 className={cn(
 "w-10 h-5 rounded-full p-0.5 transition-all duration-500 flex items-center",
 ev.on ? "bg-emerald-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-4 h-4 bg-white rounded-full shadow-xs" />
 </button>
 </div>
 <textarea
 value={ev.msg}
 onChange={(e) => ev.setMsg(e.target.value)}
 className="w-full px-5 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-500 outline-none"
 rows={2}
 />
 </div>
 ))}
 </div>

 {/* Driver Section */}
 <div className="space-y-6">
 <h4 className="text-xs font-black text-slate-400 ml-4 mb-4">Driver Events</h4>
 {[
 { label: 'New Ride Request', on: true, msg: 'You have a new ride request.' },
 { label: 'Bid Accepted', on: true, msg: 'Customer confirmed your bid.' },
 { label: 'Customer Canceled Trip', on: true, msg: 'Customer just declined a request.' },
 { label: 'Tips From Customer', on: true, msg: 'You received a tip of {tipsAmount}!' }
 ].map((ev, i) => (
 <div key={i} className="p-6 bg-slate-900 rounded-[32px] border border-white/5 space-y-4 shadow-xl">
 <div className="flex items-center justify-between">
 <span className="text-sm font-black text-white">{ev.label}</span>
 <button className="w-10 h-5 rounded-full p-0.5 bg-sky-500 flex flex-row-reverse items-center">
 <div className="w-4 h-4 bg-white rounded-full" />
 </button>
 </div>
 <textarea
 defaultValue={ev.msg}
 className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold text-white/40 outline-none"
 rows={2}
 />
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 );

 const renderParcel = () => (
 <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-amber-50 rounded-[28px] text-amber-500">
 <Package className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Parcel Updates</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Delivery Lifecycle (Customer)</p>
 </div>
 </div>
 <div className="space-y-6">
 {[
 { label: 'New Parcel Request', msg: 'You have a new parcel request.' },
 { label: 'Parcel Picked Up', msg: 'Parcel Picked-up.' },
 { label: 'Parcel Delivery Completed', msg: 'Parcel delivered successfully.' },
 { label: 'Refunded To Wallet', msg: 'Admin refunded {approximateAmount} for Parcel {parcelId}.' }
 ].map((ev, i) => (
 <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-[32px] space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-sm font-black text-slate-900">{ev.label}</span>
 <button className="w-10 h-5 rounded-full p-0.5 bg-emerald-500 flex flex-row-reverse items-center">
 <div className="w-4 h-4 bg-white rounded-full" />
 </button>
 </div>
 <textarea defaultValue={ev.msg} className="w-full px-5 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-500 outline-none" rows={2} />
 </div>
 ))}
 </div>
 </div>

 <div className="bg-slate-900 p-10 rounded-[60px] text-white shadow-2xl space-y-8 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
 <div className="flex items-center gap-4 relative z-10">
 <div className="p-4 bg-white/10 rounded-[28px] text-amber-400">
 <Truck className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black">Driver Logistics</h3>
 <p className="text-[10px] font-black text-white/30 mt-1">Penalties & Refund Alerts</p>
 </div>
 </div>
 <div className="space-y-6 relative z-10">
 {[
 { label: 'Parcel Amount Deducted', msg: 'Deduction due to damage claim: {approximateAmount}' },
 { label: 'Parcel Return Penalty', msg: 'Penalty for late return of Parcel {parcelId}.' }
 ].map((ev, i) => (
 <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[40px] space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-sm font-black">{ev.label}</span>
 <button className="w-10 h-5 rounded-full p-0.5 bg-amber-500 flex flex-row-reverse items-center">
 <div className="w-4 h-4 bg-white rounded-full" />
 </button>
 </div>
 <textarea defaultValue={ev.msg} className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold text-white/40 outline-none" rows={2} />
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 );

 const renderDriverRegistration = () => (
 <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
 <div className="bg-white p-12 rounded-[60px] border border-slate-100 shadow-sm space-y-10">
 <div className="flex items-center gap-6">
 <div className="p-5 bg-blue-50 rounded-[32px] text-blue-500 shadow-sm">
 <UserCheck className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Driver Onboarding</h3>
 <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] mt-1">Lifecycle Approval Workflow</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {[
 { label: 'Registration Approved', msg: 'Admin approved your registration. You can login now.', color: 'emerald' },
 { label: 'Vehicle Request Approved', msg: 'Your vehicle is approved by admin.', color: 'blue' },
 { label: 'Identity Image Approved', msg: 'Your identity image update request is approved.', color: 'sky' },
 { label: 'Vehicle Request Denied', msg: 'Your vehicle request is denied.', color: 'rose' },
 { label: 'Identity Image Rejected', msg: 'Your identity image update request is rejected.', color: 'rose' },
 { label: 'Vehicle Active', msg: 'Your vehicle status has been activated by admin.', color: 'emerald' }
 ].map((ev, i) => (
 <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[48px] space-y-5 group hover:bg-white hover:shadow-2xl transition-all duration-500">
 <div className="flex items-center justify-between">
 <span className="text-xs font-black text-slate-900">{ev.label}</span>
 <button className={cn(
 "w-12 h-6 rounded-full p-1 flex transition-all",
 ev.color === 'rose' ? "bg-slate-200 justify-start" : `bg-${ev.color}-500 justify-end`
 )}>
 <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
 </button>
 </div>
 <textarea defaultValue={ev.msg} className="w-full px-6 py-4 bg-white border border-slate-100 rounded-[28px] text-[11px] font-bold text-slate-500 outline-none group-hover:border-blue-200 transition-colors" rows={3} />
 </div>
 ))}
 </div>
 </div>
 </div>
 );

 const renderMart = () => (
 <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm">
 <div className="flex items-center gap-4 mb-10">
 <div className="p-4 bg-orange-50 rounded-[28px] text-orange-500">
 <ShoppingBag className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900">Mart Order Lifecycle</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Multi-Retailer Push Alerts</p>
 </div>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {[
 { label: 'Order Placed', msg: 'Your mart order {orderId} has been placed successfully.' },
 { label: 'Store Accepted', msg: 'The store has accepted your order and is processing it.' },
 { label: 'Order Prepared', msg: 'Your items are packed and ready for pickup.' },
 { label: 'In Transit', msg: 'A rider is on the way with your mart order.' },
 { label: 'Delivered', msg: 'Order {orderId} delivered! Enjoy your items.' },
 { label: 'Order Canceled', msg: 'Your mart order was canceled due to {reason}.' }
 ].map((ev, i) => (
 <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[48px] space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-xs font-black text-slate-900">{ev.label}</span>
 <button className="w-10 h-5 rounded-full p-0.5 bg-orange-500 flex flex-row-reverse items-center">
 <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
 </button>
 </div>
 <textarea defaultValue={ev.msg} className="w-full px-5 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-500 outline-none" rows={2} />
 </div>
 ))}
 </div>
 </div>
 </div>
 );

 const renderShopping = () => (
 <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm">
 <div className="flex items-center gap-4 mb-10">
 <div className="p-4 bg-purple-50 rounded-[28px] text-purple-500">
 <ShoppingCart className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900">Global Shopping</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">E-commerce Fulfillment Alerts</p>
 </div>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {[
 { label: 'Order Confirmed', msg: 'Your shopping order {orderId} is confirmed.' },
 { label: 'Vendor Packing', msg: 'The vendor is currently packing your products.' },
 { label: 'Shipped', msg: 'Your parcel is shipped. Tracking: {trackingId}' },
 { label: 'Out for Local Delivery', msg: 'Your order will be delivered by {eta}.' },
 { label: 'Return Approved', msg: 'Your return request for {orderId} is approved.' },
 { label: 'Refund Processed', msg: 'Refund for {orderId} has been credited to your wallet.' }
 ].map((ev, i) => (
 <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[48px] space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-xs font-black text-slate-900">{ev.label}</span>
 <button className="w-10 h-5 rounded-full p-0.5 bg-purple-500 flex flex-row-reverse items-center">
 <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
 </button>
 </div>
 <textarea defaultValue={ev.msg} className="w-full px-5 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-500 outline-none" rows={2} />
 </div>
 ))}
 </div>
 </div>
 </div>
 );

 const renderFood = () => (
 <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
 <div className="bg-slate-900 p-12 rounded-[80px] text-white shadow-2xl relative overflow-hidden">
 <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] -mr-48 -mt-48" />
 <div className="flex items-center gap-4 mb-10 relative z-10">
 <div className="p-4 bg-rose-500 rounded-[28px] text-white shadow-lg">
 <Utensils className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black italic tracking-tighter">Foodie Pulse</h3>
 <p className="text-[10px] font-black text-rose-500 mt-1">Real-time Culinary Alerts</p>
 </div>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
 {[
 { label: 'Restaurant Confirmed', msg: 'Chef is starting your meal!' },
 { label: 'Chef Cooking', msg: 'Your food is sizzling on the stove.' },
 { label: 'Order Ready', msg: 'Rider is picking up your hot meal.' },
 { label: 'Out for Delivery', msg: 'Your food is {distance} away from your door!' }
 ].map((ev, i) => (
 <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-[40px] space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-[11px] font-black text-white/60">{ev.label}</span>
 <button className="w-10 h-5 rounded-full p-0.5 bg-rose-500 flex flex-row-reverse items-center">
 <div className="w-4 h-4 bg-white rounded-full" />
 </button>
 </div>
 <textarea defaultValue={ev.msg} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white outline-none" rows={2} />
 </div>
 ))}
 </div>
 </div>
 </div>
 );

 const renderFintech = () => (
 <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm">
 <div className="flex items-center gap-6 mb-10">
 <div className="p-4 bg-indigo-900 text-white rounded-[28px] shadow-xl shadow-indigo-200">
 <CreditCard className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Financial Intelligence</h3>
 <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] mt-1">Digital Wallet & Loan Alerts</p>
 </div>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-6">
 <h4 className="text-[10px] font-black text-indigo-500 ml-4">Wallet & Payments</h4>
 {[
 { label: 'Deposit Successful', msg: '{amount} {currency} added to your wallet.' },
 { label: 'Payment Received', msg: 'Payment of {amount} received from {source}.' },
 { label: 'Withdrawal Processed', msg: 'Your withdrawal of {amount} is sent to your bank.' }
 ].map((ev, i) => (
 <div key={i} className="p-6 bg-indigo-50/30 border border-indigo-100 rounded-[32px] space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-xs font-black text-slate-900">{ev.label}</span>
 <button className="w-8 h-4 rounded-full p-0.5 bg-indigo-600 flex flex-row-reverse items-center">
 <div className="w-3 h-3 bg-white rounded-full" />
 </button>
 </div>
 <textarea defaultValue={ev.msg} className="w-full px-4 py-2 bg-white border border-indigo-100 rounded-xl text-[11px] font-bold text-slate-500 outline-none" rows={2} />
 </div>
 ))}
 </div>
 <div className="space-y-6">
 <h4 className="text-[10px] font-black text-emerald-500 ml-4">Loans & BNPL</h4>
 {[
 { label: 'Loan Approved', msg: 'Congratulations! Your loan of {amount} is approved.' },
 { label: 'BNPL Payment Due', msg: 'Reminder: Your PayLater bill of {amount} is due tomorrow.' },
 { label: 'Disbursement Complete', msg: 'Loan funds have been disbursed to your account.' }
 ].map((ev, i) => (
 <div key={i} className="p-6 bg-emerald-50/30 border border-emerald-100 rounded-[32px] space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-xs font-black text-slate-900">{ev.label}</span>
 <button className="w-8 h-4 rounded-full p-0.5 bg-emerald-600 flex flex-row-reverse items-center">
 <div className="w-3 h-3 bg-white rounded-full" />
 </button>
 </div>
 <textarea defaultValue={ev.msg} className="w-full px-4 py-2 bg-white border border-emerald-100 rounded-xl text-[11px] font-bold text-slate-500 outline-none" rows={2} />
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 );

 const renderOther = () => (
 <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
 {[
 { section: 'Coupon', icon: Ticket, items: ['Coupon Applied', 'Coupon Removed'] },
 { section: 'Review', icon: Star, items: ['Review From Customer', 'Review From Driver'] },
 { section: 'Referral', icon: Share2, items: ['Someone Used Code', 'Reward Received'] },
 { section: 'Safety', icon: Shield, items: ['Alert Sent', 'Problem Resolved'] },
 { section: 'Finance', icon: CreditCard, items: ['Fund Added Digitally', 'Digital Payment Success'] },
 { section: 'Level System', icon: Zap, items: ['Level Up'] },
 { section: 'Policy', icon: BookOpen, items: ['T&C Updated', 'Legal Updated'] },
 { section: 'Chatting', icon: MessageSquare, items: ['New Message', 'Admin Message'] }
 ].map((s, i) => (
 <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-slate-900 text-white rounded-2xl">
 <s.icon className="w-4 h-4" />
 </div>
 <h4 className="text-sm font-black text-slate-900">{s.section}</h4>
 </div>
 <div className="space-y-4">
 {s.items.map((item, j) => (
 <div key={j} className="space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-bold text-slate-400 ">{item}</span>
 <button className="w-8 h-4 rounded-full p-0.5 bg-emerald-500 flex flex-row-reverse items-center">
 <div className="w-3 h-3 bg-white rounded-full" />
 </button>
 </div>
 <textarea className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-medium text-slate-500 outline-none" defaultValue={`Notify: ${item}`} rows={1} />
 </div>
 ))}
 </div>
 </div>
 ))}
 </div>
 </div>
 );

 const renderFirebase = () => (
 <div className="space-y-8 animate-in mt-2 fade-in slide-in-from-bottom-4 duration-700 pb-20">
 <div className="bg-white p-12 rounded-[80px] border border-slate-100 shadow-sm space-y-12">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-6">
 <div className="p-5 bg-orange-50 rounded-[32px] text-orange-500 shadow-sm">
 <Database className="w-10 h-10" />
 </div>
 <div>
 <div className="flex items-center gap-3 mb-1">
 <span className="text-[10px] font-black text-slate-400 tracking-[0.2em]">External Core</span>
 <div className="w-1 h-1 rounded-full bg-slate-200" />
 <span className="text-[10px] font-black text-orange-500 tracking-[0.2em]">FCM Registry</span>
 </div>
 <h3 className="text-4xl font-black text-slate-900 tracking-tight">Firebase Configuration</h3>
 </div>
 </div>
 <button className="flex items-center gap-3 px-8 py-4 bg-slate-50 border border-slate-100 rounded-[24px] text-[10px] font-black hover:bg-slate-100 transition-all">
 <Info className="w-4 h-4" /> How it work
 </button>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
 <div className="lg:col-span-2 space-y-8">
 <div className="space-y-4">
 <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] ml-2">Service Account Content (JSON)</label>
 <textarea
 value={serviceAccount}
 onChange={(e) => setServiceAccount(e.target.value)}
 className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[40px] text-xs font-mono text-slate-600 outline-none hover:border-orange-200 focus:ring-4 focus:ring-orange-500/5 transition-all"
 rows={10}
 placeholder='{ "type": "service_account", ... }'
 />
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {[
 { label: 'API Key', value: firebaseApiKey, setter: setFirebaseApiKey },
 { label: 'Auth Domain', value: 'dashdrive-fcm.firebaseapp.com' },
 { label: 'Project ID', value: projectId, setter: setProjectId },
 { label: 'Storage Bucket', value: 'dashdrive-fcm.appspot.com' },
 { label: 'Messaging Sender ID', value: '1092837465' },
 { label: 'App ID', value: '1:109283:web:a9b8c7d6' }
 ].map((field, i) => (
 <div key={i} className="space-y-2">
 <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] ml-2">{field.label}</label>
 <input
 type="text"
 defaultValue={field.value}
 className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-900 outline-none"
 />
 </div>
 ))}
 </div>
 </div>

 <div className="space-y-8">
 <div className="bg-slate-900 p-10 rounded-[60px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
 <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
 <div className="space-y-8 relative z-10">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-white/10 rounded-2xl text-orange-400">
 <Zap className="w-6 h-6" />
 </div>
 <h3 className="text-xl font-black">Live Deployment</h3>
 </div>
 <div className="space-y-6">
 <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-between">
 <span className="text-[10px] font-black text-white/40">Status</span>
 <span className="flex items-center gap-2 text-[10px] font-black text-emerald-400 ">
 <CheckCircle2 className="w-3 h-3" /> Connected
 </span>
 </div>
 <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-between">
 <span className="text-[10px] font-black text-white/40">Last Sync</span>
 <span className="text-[10px] font-black text-white/60 ">2 min ago</span>
 </div>
 </div>
 </div>
 <button className="w-full py-5 bg-orange-500 text-white rounded-[28px] text-[10px] font-black shadow-xl shadow-orange-900/40 relative z-10 hover:scale-[1.02] active:scale-95 transition-all">Test Certificate</button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );

 return (
 <div className="max-w-[1700px] mx-auto space-y-10 pb-20">
 {/* Header Area */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 mt-4">
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg">
 <Bell className="w-6 h-6" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-black text-slate-400 tracking-[0.2em]">Configuration</span>
 <div className="w-1 h-1 rounded-full bg-slate-200" />
 <span className="text-[10px] font-black text-[#0089D1] tracking-[0.2em]">Notifications</span>
 </div>
 <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mt-1">Global Alerts</h1>
 </div>
 </div>
 <p className="text-base font-medium text-slate-500 max-w-lg leading-relaxed">
 Orchestrate platform-wide automated messaging and technical push delivery infrastructure.
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

 {/* Navigation Tabs */}
 <div className="flex flex-col gap-8 px-4">
 <div className="flex items-center gap-8 border-b border-slate-100">
 {[
 { id: 'Message', label: 'Notification Message' },
 { id: 'Firebase', label: 'Firebase Configuration' }
 ].map(tab => (
 <button
 key={tab.id}
 onClick={() => setMainTab(tab.id as any)}
 className={cn(
 "pb-6 text-sm font-black tracking-[0.2em] transition-all relative",
 mainTab === tab.id ? "text-slate-900" : "text-slate-300 hover:text-slate-500"
 )}
 >
 {tab.label}
 {mainTab === tab.id && (
 <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0089D1] rounded-t-full" />
 )}
 </button>
 ))}
 </div>

 {mainTab === 'Message' && (
 <div className="flex flex-wrap items-center gap-3 p-2 bg-slate-100 rounded-[28px] w-fit">
 {['Chatting', 'Regular', 'Parcel', 'Driver', 'Mart', 'Shopping', 'Food', 'Fintech', 'Other'].map(cat => (
 <button
 key={cat}
 onClick={() => setCategoryTab(cat as any)}
 className={cn(
 "px-8 py-3 rounded-[22px] text-[10px] font-black transition-all",
 categoryTab === cat ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
 )}
 >
 {cat === 'Regular' ? 'Regular Trip' : cat === 'Driver' ? 'Driver Registration' : cat}
 </button>
 ))}
 </div>
 )}
 </div>

 {/* Content Area */}
 <div className="px-4 min-h-[60vh]">
 {mainTab === 'Firebase' ? renderFirebase() : (
 <>
 {categoryTab === 'Chatting' && renderChatting()}
 {categoryTab === 'Regular' && renderRegularTrip()}
 {categoryTab === 'Parcel' && renderParcel()}
 {categoryTab === 'Driver' && renderDriverRegistration()}
 {categoryTab === 'Mart' && renderMart()}
 {categoryTab === 'Shopping' && renderShopping()}
 {categoryTab === 'Food' && renderFood()}
 {categoryTab === 'Fintech' && renderFintech()}
 {categoryTab === 'Other' && renderOther()}
 </>
 )}
 </div>
 </div>
 );
};
