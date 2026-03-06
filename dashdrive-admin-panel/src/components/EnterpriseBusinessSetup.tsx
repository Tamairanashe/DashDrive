import React, { useState } from 'react';
import {
 Settings2,
 Shield,
 Globe,
 Clock,
 CreditCard,
 Building2,
 Save,
 Upload,
 Mail,
 Phone,
 MapPin,
 Palette,
 FileText,
 Power,
 ChevronDown,
 RefreshCw,
 Zap,
 Navigation,
 Lock,
 Hash,
 RotateCcw,
 Activity,
 Server,
 ShieldCheck,
 UserCheck,
 Users,
 Banknote,
 Map,
 Package,
 Store,
 Box,
 Utensils,
 ShoppingBag,
 Undo2,
 HeartPulse,
 Gift,
 MessageSquare,
 AlertTriangle,
 CheckCircle2,
 Star,
 Trophy,
 Calendar,
 Bell,
 TrendingUp,
 XCircle,
 Plus,
 Search,
 Truck,
 Scale,
 Link,
 Timer,
 ArrowLeftRight,
 Ban,
 FileSearch,
 History,
 FileCheck,
 Monitor,
 Smartphone,
 Apple,
 Database,
 Mic,
 ShieldAlert,
 BellRing,
 ClipboardList,
 Clock3,
 Percent,
 ChefHat,
 Bike,
 Boxes,
 Layers,
 Edit,
 Trash2,
 Image as ImageIcon
} from 'lucide-react';
import { cn } from '../utils';

interface EnterpriseBusinessSetupProps {
 activeTab?: string;
}

export const EnterpriseBusinessSetup: React.FC<EnterpriseBusinessSetupProps> = ({ activeTab: externalTab }) => {
 const [maintenanceMode, setMaintenanceMode] = useState(false);
 const [fareBidding, setFareBidding] = useState(true);

 // Internal mapping from sidebar labels to component tab names
 const tabMapping: Record<string, string> = {
 'Business Info': 'Business Info',
 'Operations': 'Operations',
 'Driver Setup': 'Driver',
 'Customer Setup': 'Customer',
 'Fare & Penalty': 'Fare & Penalty',
 'Trips Logic': 'Trips',
 'Parcel Logic': 'Parcel',
 'Mart Logic': 'Mart',
 'Refund Policy': 'Refund',
 'Safety & Security': 'Safety',
 'Referral Logic': 'Referral',
 'Shopping Logic': 'Shopping',
 'Food Delivery Logic': 'Food',
 'Chatting Setup': 'Chatting'
 };

 const activeTab = (externalTab && tabMapping[externalTab]) || 'Business Info';

 const renderBusinessInfo = () => (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
 {/* Maintenance Mode Hero */}
 <div className={cn(
 "p-10 rounded-[60px] border-2 transition-all duration-500 flex items-center justify-between",
 maintenanceMode
 ? "bg-rose-50/50 border-rose-100 shadow-2xl shadow-rose-200/20"
 : "bg-emerald-50/50 border-emerald-100 shadow-2xl shadow-emerald-200/20"
 )}>
 <div className="flex items-center gap-6">
 <div className={cn(
 "p-5 rounded-[28px] shadow-lg transition-all duration-500",
 maintenanceMode ? "bg-rose-500 text-white rotate-12" : "bg-emerald-500 text-white"
 )}>
 <Power className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Maintenance Mode</h3>
 <p className="text-sm font-medium text-slate-500 mt-1 max-w-md">
 {maintenanceMode
 ? "Platform is currently offline for users. Only admins can access management consoles."
 : "Platform is live. Users and drivers can perform operations globally."}
 </p>
 </div>
 </div>
 <button
 onClick={() => setMaintenanceMode(!maintenanceMode)}
 className={cn(
 "w-24 h-12 rounded-full p-1.5 transition-all duration-500 flex items-center shadow-inner relative overflow-hidden",
 maintenanceMode ? "bg-rose-500 justify-end" : "bg-emerald-500 justify-start"
 )}
 >
 <div className="w-9 h-9 bg-white rounded-full shadow-xl relative z-10" />
 {maintenanceMode && <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-400 animate-pulse" />}
 </button>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {/* Basic Information */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-10">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-slate-900 rounded-[24px] text-white">
 <Building2 className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Basic Information</h3>
 <p className="text-xs font-bold text-slate-400 mt-1">Core Identity & Contact</p>
 </div>
 </div>

 <div className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-[10px] font-black text-slate-400 ml-1">Business Name</label>
 <input type="text" defaultValue="DashDrive" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[24px] text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0089D1]/20 transition-all" />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-slate-400 ml-1">Country</label>
 <div className="relative">
 <input type="text" defaultValue="Nigeria" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[24px] text-xs font-bold text-slate-900" />
 <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-[10px] font-black text-slate-400 ml-1">Contact Phone</label>
 <div className="relative">
 <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
 <input type="text" defaultValue="+234 812 345 6789" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[24px] text-xs font-bold text-slate-900" />
 </div>
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-slate-400 ml-1">Contact Email</label>
 <div className="relative">
 <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
 <input type="email" defaultValue="hi@dashdrive.io" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[24px] text-xs font-bold text-slate-900" />
 </div>
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-[10px] font-black text-slate-400 ml-1">Business Address</label>
 <div className="relative">
 <MapPin className="absolute left-6 top-6 w-4 h-4 text-[#0089D1]" />
 <textarea className="w-full pl-14 pr-6 py-6 bg-slate-50 border border-slate-100 rounded-[32px] text-xs font-bold text-slate-900 h-32 resize-none" defaultValue="45 Tech Plaza, Lagos, Nigeria" />
 <button className="absolute right-6 bottom-6 bg-white shadow-lg border border-slate-100 p-3 rounded-2xl hover:scale-105 transition-transform">
 <MapPin className="w-4 h-4 text-slate-400" />
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* Regional & Financial Setup */}
 <div className="space-y-8">
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-10">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-indigo-50 rounded-[24px] text-indigo-500">
 <Globe className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">General Setup</h3>
 <p className="text-xs font-bold text-slate-400 mt-1">Regional & Financial Settings</p>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-[10px] font-black text-slate-400 ml-1">Time Zone</label>
 <div className="px-6 py-4 bg-slate-50 rounded-[24px] flex items-center justify-between">
 <span className="text-xs font-bold text-slate-900">Africa/Lagos</span>
 <Clock className="w-4 h-4 text-slate-300" />
 </div>
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-slate-400 ml-1">Currency</label>
 <div className="px-6 py-4 bg-slate-50 rounded-[24px] flex items-center justify-between group">
 <span className="text-xs font-bold text-slate-900">NGN (₦)</span>
 <CreditCard className="w-4 h-4 text-slate-300 group-hover:text-[#0089D1] transition-colors" />
 </div>
 </div>
 </div>
 </div>

 <div className="bg-slate-900 p-10 rounded-[60px] shadow-2xl shadow-slate-900/40 space-y-8 relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-64 h-64 bg-[#0089D1]/10 rounded-full blur-[100px] -mr-32 -mt-32 transition-transform duration-700" />

 <div className="flex items-center gap-4 relative z-10">
 <div className="p-4 bg-white/10 rounded-[24px] text-white">
 <FileText className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-white tracking-tight">Legal & Copyright</h3>
 <p className="text-xs font-bold text-white/40 mt-1">Compliance & Branding</p>
 </div>
 </div>

 <div className="space-y-6 relative z-10">
 <div className="space-y-2">
 <label className="text-[10px] font-black text-white/30 ml-1">Trade License Number</label>
 <input type="text" defaultValue="RC-90123-NG-2023" className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[28px] text-sm font-black text-white placeholder:text-white/20 focus:bg-white/10 transition-all" />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-white/30 ml-1">Company Copyright</label>
 <input type="text" defaultValue="© 2024 DashDrive Technologies. All rights reserved." className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[28px] text-sm font-bold text-white/80" />
 </div>
 </div>
 </div>
 </div>
 </div>

 </div>
 );

 const renderOperations = () => (
 <div className="space-y-8 animate-in mt-2 fade-in slide-in-from-bottom-4 duration-700 pb-10">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Business Configuration */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-sky-50 rounded-[28px] text-sky-500">
 <Zap className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Business Config</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Commission & Tax Scale</p>
 </div>
 </div>

 <div className="space-y-6">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">Trip Commission (%)</label>
 <input type="number" defaultValue="20" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black text-slate-900" />
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">VAT (%)</label>
 <input type="number" defaultValue="5" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black text-slate-900" />
 </div>
 </div>
 </div>

 {/* Real-Time Tracking */}
 <div className="lg:col-span-2 bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-orange-50 rounded-[28px] text-orange-500">
 <Navigation className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Real-Time & Location</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Socket & Radius</p>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-8">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">WebSocket URL</label>
 <input type="text" defaultValue="ws://dashdrive.api" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-bold" />
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">WebSocket Port</label>
 <input type="number" defaultValue="6001" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black" />
 </div>
 </div>
 </div>

 {/* Login & Security */}
 <div className="lg:col-span-3 bg-slate-900 p-12 rounded-[80px] text-white shadow-2xl relative overflow-hidden group">
 <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0089D1]/10 rounded-full blur-[120px]" />
 <div className="flex items-center gap-4 mb-10">
 <Lock className="w-8 h-8 text-[#0089D1]" />
 <h3 className="text-2xl font-black tracking-tight">System Security Gates</h3>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
 {[
 { label: 'Max Login Attempts', value: '10' },
 { label: 'Login Block (Sec)', value: '30' },
 { label: 'Max OTP Attempts', value: '5' },
 { label: 'OTP Block (Sec)', value: '60' }
 ].map((item, i) => (
 <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-[32px]">
 <p className="text-[10px] font-black text-white/40 mb-3">{item.label}</p>
 <input type="number" defaultValue={item.value} className="bg-transparent text-2xl font-black text-white w-full outline-none" />
 </div>
 ))}
 </div>
 </div>
 </div>

 </div>
 );

 const [driverSelfReg, setDriverSelfReg] = useState(true);
 const [driverVerification, setDriverVerification] = useState(true);
 const [driverReviewCustomer, setDriverReviewCustomer] = useState(true);
 const [driverLevelFeature, setDriverLevelFeature] = useState(true);
 const [driverLoyaltyPoints, setDriverLoyaltyPoints] = useState(true);
 const [faceVerification, setFaceVerification] = useState(true);

 const [customerVerification, setCustomerVerification] = useState(true);
 const [customerReviewSystem, setCustomerReviewSystem] = useState(true);
 const [customerLevelFeature, setCustomerLevelFeature] = useState(true);
 const [customerLoyaltyPoints, setCustomerLoyaltyPoints] = useState(true);
 const [customerWalletSystem, setCustomerWalletSystem] = useState(true);

 const [extraStops, setExtraStops] = useState(true);
 const [driverOtpConfirmation, setDriverOtpConfirmation] = useState(true);
 const [scheduleTrip, setScheduleTrip] = useState(true);
 const [increaseFareRate, setIncreaseFareRate] = useState(true);

 const [parcelTrackingLink, setParcelTrackingLink] = useState(true);
 const [parcelReturnModule, setParcelReturnModule] = useState(true);
 const [noChargeOnDriverCancel, setNoChargeOnDriverCancel] = useState(true);
 const [parcelWeightLimitEnable, setParcelWeightLimitEnable] = useState(true);

 const [autoRefundSmallOrders, setAutoRefundSmallOrders] = useState(true);
 const [refundWalletCrediting, setRefundWalletCrediting] = useState(true);
 const [refundParcel, setRefundParcel] = useState(true);
 const [refundFood, setRefundFood] = useState(true);
 const [refundMart, setRefundMart] = useState(true);
 const [refundShopping, setRefundShopping] = useState(true);

 // Advanced Safety Settings
 const [safetyFeatureOn, setSafetyFeatureOn] = useState(true);
 const [tripDelayMins, setTripDelayMins] = useState(15);
 const [afterTripWindowMins, setAfterTripWindowMins] = useState(3);
 const [emergencyCallOn, setEmergencyCallOn] = useState(true);
 const [emergencyNumberType, setEmergencyNumberType] = useState('Hotline');
 const [hotlineNum, setHotlineNum] = useState('999');

 const [emergencyContacts, setEmergencyContacts] = useState([
 { title: 'Medical', phone: '+880 1122334455', status: true },
 { title: 'Police', phone: '+880 1122334477', status: true }
 ]);

 const [safetyReasons, setSafetyReasons] = useState([
 { id: 1, reason: "Lost item reported", forWhom: 'Customer', status: true },
 { id: 2, reason: "Driver stopped unexpectedly", forWhom: 'Customer', status: true },
 { id: 3, reason: "Abrupt braking detected", forWhom: 'Both', status: true },
 { id: 4, reason: "Vehicle exceeded speed limits", forWhom: 'Both', status: true }
 ]);

 const [safetyPrecautions, setSafetyPrecautions] = useState([
 { id: 1, title: 'Verify Details', description: 'Check driver and vehicle details before starting.', target: 'Customer', status: true },
 { id: 2, title: 'Trust Instincts', description: 'If you feel unsafe, end the trip immediately.', target: 'Both', status: true }
 ]);

 // Referral Earning States
 const [customerReferralOn, setCustomerReferralOn] = useState(true);
 const [customerReferrerReward, setCustomerReferrerReward] = useState(100);
 const [customerRefereeDiscountOn, setCustomerRefereeDiscountOn] = useState(true);
 const [customerRefereeDiscountPercent, setCustomerRefereeDiscountPercent] = useState(30);
 const [customerRefereeValidity, setCustomerRefereeValidity] = useState(10);

 const [driverReferralOn, setDriverReferralOn] = useState(true);
 const [driverReferrerReward, setDriverReferrerReward] = useState(500);
 const [driverRefereeBonus, setDriverRefereeBonus] = useState(1000);

 // Chatting Setup States
 const [chattingFeatureOn, setChattingFeatureOn] = useState(true);
 const [canChatCustomerDriver, setCanChatCustomerDriver] = useState(true);
 const [canChatAdminSupport, setCanChatAdminSupport] = useState(true);

 const [chatTimingBefore, setChatTimingBefore] = useState(false);
 const [chatTimingDuring, setChatTimingDuring] = useState(true);
 const [chatTimingAfter, setChatTimingAfter] = useState(true);
 const [chatAfterWindowMins, setChatAfterWindowMins] = useState(5);

 const [mediaSharingImages, setMediaSharingImages] = useState(true);
 const [mediaSharingFiles, setMediaSharingFiles] = useState(false);
 const [mediaSharingVoice, setMediaSharingVoice] = useState(false);

 const [chatMonitoringOn, setChatMonitoringOn] = useState(true);
 const [chatPushNotifications, setChatPushNotifications] = useState(true);

 // Food Delivery States
 const [foodDeliveryOn, setFoodDeliveryOn] = useState(true);
 const [vendorAutoApproval, setVendorAutoApproval] = useState(false);
 const [foodCommission, setFoodCommission] = useState(15);
 const [foodDeliveryChargeType, setFoodDeliveryChargeType] = useState('Distance-based');
 const [foodDefaultPrepTime, setFoodDefaultPrepTime] = useState(25);
 const [foodMinOrderValue, setFoodMinOrderValue] = useState(10);
 const [foodAssignmentMode, setFoodAssignmentMode] = useState('Auto-assign nearest');
 const [foodPaymentCOD, setFoodPaymentCOD] = useState(true);

 // Shopping States
 const [shoppingOn, setShoppingOn] = useState(true);
 const [shoppingVendorAutoApproval, setShoppingVendorAutoApproval] = useState(false);
 const [shoppingCommission, setShoppingCommission] = useState(10);
 const [shoppingStockMode, setShoppingStockMode] = useState('Manual');
 const [shoppingDeliveryChargeType, setShoppingDeliveryChargeType] = useState('Fixed delivery fee');
 const [shoppingPrepTime, setShoppingPrepTime] = useState(45);
 const [shoppingBatchDelivery, setShoppingBatchDelivery] = useState(true);
 const [shoppingMinOrder, setShoppingMinOrder] = useState(25);
 const [shoppingPaymentCOD, setShoppingPaymentCOD] = useState(true);

 // Mart States
 const [martOn, setMartOn] = useState(true);
 const [martStoreAutoApproval, setMartStoreAutoApproval] = useState(false);
 const [martCommission, setMartCommission] = useState(12);
 const [martStockSync, setMartStockSync] = useState('Automatic');
 const [martDeliveryRadius, setMartDeliveryRadius] = useState(5);
 const [martPackagingFee, setMartPackagingFee] = useState(150);
 const [martMinOrderAmount, setMartMinOrderAmount] = useState(15);
 const [martPaymentCOD, setMartPaymentCOD] = useState(true);

 // Refined Mart States (12-Section Spec)
 const [martBaseCharge, setMartBaseCharge] = useState(500);
 const [martDistanceFee, setMartDistanceFee] = useState(50);
 const [martSurgeCharge, setMartSurgeCharge] = useState(false);
 const [martEstDeliveryTime, setMartEstDeliveryTime] = useState(45);
 const [martPrepTime, setMartPrepTime] = useState(15);
 const [martScheduledDelivery, setMartScheduledDelivery] = useState(true);
 const [martDriverAssignLogic, setMartDriverAssignLogic] = useState('Auto');
 const [martBatchDelivery, setMartBatchDelivery] = useState(true);
 const [martOrderConfirmation, setMartOrderConfirmation] = useState('Auto');
 const [martCancelLimit, setMartCancelLimit] = useState(5);
 const [martCancelCharge, setMartCancelCharge] = useState(200);
 const [martPaymentWallet, setMartPaymentWallet] = useState(true);
 const [martPaymentOnline, setMartPaymentOnline] = useState(true);
 const [martMaxWeight, setMartMaxWeight] = useState(20);
 const [martHandlingCharge, setMartHandlingCharge] = useState(500);
 const [martNotifySMS, setMartNotifySMS] = useState(true);
 const [martNotifyPush, setMartNotifyPush] = useState(true);

 const renderDriver = () => (
 <div className="space-y-8 animate-in mt-2 fade-in slide-in-from-bottom-4 duration-700 pb-20">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Registration & Basic Verification */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-sky-50 rounded-[28px] text-sky-500">
 <UserCheck className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Onboarding</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Signup & Identity</p>
 </div>
 </div>

 <div className="space-y-6 flex-1">
 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px]">
 <div>
 <p className="text-sm font-black text-slate-900 leading-none">Self Registration</p>
 <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-tighter">Via Driver App</p>
 </div>
 <button
 onClick={() => setDriverSelfReg(!driverSelfReg)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 driverSelfReg ? "bg-sky-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>

 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px]">
 <div>
 <p className="text-sm font-black text-slate-900 leading-none">Strict Verification</p>
 <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-tighter">Document Required</p>
 </div>
 <button
 onClick={() => setDriverVerification(!driverVerification)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 driverVerification ? "bg-emerald-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>

 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px]">
 <div>
 <p className="text-sm font-black text-slate-900 leading-none">Review Customer</p>
 <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-tighter">Two-way ratings</p>
 </div>
 <button
 onClick={() => setDriverReviewCustomer(!driverReviewCustomer)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 driverReviewCustomer ? "bg-indigo-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 </div>
 </div>

 {/* Gamification & Points */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-amber-50 rounded-[28px] text-amber-500">
 <Gift className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Gamification</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Levels & Retention</p>
 </div>
 </div>

 <div className="space-y-6 flex-1">
 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px]">
 <div>
 <p className="text-sm font-black text-slate-900 leading-none">Active Leveling</p>
 <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-tighter">Tiered Rewards</p>
 </div>
 <button
 onClick={() => setDriverLevelFeature(!driverLevelFeature)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 driverLevelFeature ? "bg-amber-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>

 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px]">
 <div>
 <p className="text-sm font-black text-slate-900 leading-none">Loyalty Points</p>
 <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-tighter">Earn per trip</p>
 </div>
 <button
 onClick={() => setDriverLoyaltyPoints(!driverLoyaltyPoints)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 driverLoyaltyPoints ? "bg-rose-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>

 <div className="space-y-3 pt-2">
 <label className="text-[10px] font-black text-slate-400 ml-1">$1.00 Equivalent To Points</label>
 <input type="number" defaultValue="10" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black text-slate-900" />
 </div>
 </div>
 </div>

 {/* Parcel & Hand-over */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-orange-50 rounded-[28px] text-orange-500">
 <Package className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Logistics Limits</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Workload Management</p>
 </div>
 </div>

 <div className="space-y-6 flex-1">
 <div className="space-y-3">
 <div className="flex items-center justify-between px-1">
 <label className="text-[10px] font-black text-slate-400 ">Max Parcel Limit</label>
 <div className="w-8 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
 </div>
 </div>
 <input type="number" defaultValue="4" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black text-slate-900" />
 <p className="text-[9px] font-bold text-slate-400 px-2 leading-relaxed">Limit concurrent jobs to prevent overloading.</p>
 </div>

 <div className="pt-4 border-t border-slate-50 space-y-4">
 <h4 className="text-[10px] font-black text-slate-900 ml-1">Cash Handling Setup</h4>
 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-2">
 <p className="text-[9px] font-black text-slate-400 tracking-tighter">Max to Hold ($)</p>
 <input type="number" defaultValue="100" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[20px] text-xs font-black" />
 </div>
 <div className="space-y-2">
 <p className="text-[9px] font-black text-slate-400 tracking-tighter">Min to Pay ($)</p>
 <input type="number" defaultValue="20" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[20px] text-xs font-black" />
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Vehicle Approval Settings */}
 <div className="lg:col-span-2 bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-10">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-indigo-50 rounded-[28px] text-indigo-500">
 <CheckCircle2 className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Vehicle Management Approval</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Review required before update lives</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {[
 { label: 'Vehicle Brand', icon: Building2 },
 { label: 'Vehicle Category', icon: Settings2 },
 { label: 'License Plate', icon: Hash },
 { label: 'License Expiry', icon: Clock }
 ].map((item, i) => (
 <div key={i} className="group cursor-pointer p-6 bg-slate-50 rounded-[40px] border-2 border-transparent hover:border-indigo-500/20 hover:bg-white transition-all flex flex-col items-center text-center space-y-4">
 <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-indigo-500 transition-colors">
 <item.icon className="w-5 h-5" />
 </div>
 <p className="text-[10px] font-black text-slate-900 ">{item.label}</p>
 <div className="w-10 h-10 rounded-full bg-slate-200 p-1 flex items-center justify-center overflow-hidden">
 <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-500" />
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Identity Verification (Face ID) */}
 <div className="lg:col-span-1 bg-slate-900 p-10 rounded-[60px] text-white shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-64 h-64 bg-[#0089D1]/10 rounded-full blur-[100px] -mr-32 -mt-32" />
 <div className="flex items-center gap-4 relative z-10">
 <div className="p-4 bg-white/10 rounded-[28px] text-[#0089D1]">
 <ShieldCheck className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black tracking-tight">Biometric Security</h3>
 <p className="text-[10px] font-black text-white/30 mt-1">Identity Verification</p>
 </div>
 </div>

 <div className="space-y-6 relative z-10 mt-8">
 <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[32px]">
 <p className="text-sm font-bold">Face Verification</p>
 <button
 onClick={() => setFaceVerification(!faceVerification)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 faceVerification ? "bg-[#0089D1] justify-end" : "bg-white/10 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>

 <div className="space-y-4">
 <p className="text-[10px] font-black text-white/30 ml-1">Initiation Triggers</p>
 <div className="space-y-3">
 {[
 { label: 'During Sign-Up', icon: UserCheck },
 { label: 'Trigger At Intervals', icon: RefreshCw },
 { label: 'When Switching To Online', icon: Activity }
 ].map((trigger, i) => (
 <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer">
 <trigger.icon className="w-4 h-4 text-white/20 group-hover:text-[#0089D1] transition-colors" />
 <span className="text-[11px] font-bold text-white/60 group-hover:text-white transition-colors">{trigger.label}</span>
 <div className="ml-auto w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">
 {i === 0 && <div className="w-2 h-2 rounded-full bg-[#0089D1]" />}
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>

 </div>
 );

 const renderCustomer = () => (
 <div className="space-y-8 animate-in mt-2 fade-in slide-in-from-bottom-4 duration-700 pb-20">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* 1. Customer Verification */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-sky-50 rounded-[28px] text-sky-500">
 <ShieldCheck className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Identity Gate</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Status & Security</p>
 </div>
 </div>

 <div className="space-y-6 flex-1">
 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px]">
 <div>
 <p className="text-sm font-black text-slate-900 leading-none">Strict Verification</p>
 <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-tighter">OTP / ID Required</p>
 </div>
 <button
 onClick={() => setCustomerVerification(!customerVerification)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 customerVerification ? "bg-sky-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 <p className="text-[11px] font-bold text-slate-400 px-2 leading-relaxed italic">
 Prevents fake accounts and reduces platform fraud significantly.
 </p>
 </div>
 </div>

 {/* 2. Customer Review System */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-amber-50 rounded-[28px] text-amber-500">
 <Star className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Post-Trip Review</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Ratings & Feedback</p>
 </div>
 </div>

 <div className="space-y-6 flex-1">
 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px]">
 <div>
 <p className="text-sm font-black text-slate-900 leading-none">Driver Reviews</p>
 <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-tighter">Stars & Feedback</p>
 </div>
 <button
 onClick={() => setCustomerReviewSystem(!customerReviewSystem)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 customerReviewSystem ? "bg-amber-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 <p className="text-[11px] font-bold text-slate-400 px-2 leading-relaxed">
 Ensures trust and service quality by holding drivers accountable.
 </p>
 </div>
 </div>

 {/* 3. Customer Level (Gamification) */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-indigo-50 rounded-[28px] text-indigo-500">
 <Trophy className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Customer Levels</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Tiers & Retention</p>
 </div>
 </div>

 <div className="space-y-6 flex-1">
 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px]">
 <div>
 <p className="text-sm font-black text-slate-900 leading-none">Active Tiers</p>
 <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-tighter">Bronze, Silver, Gold</p>
 </div>
 <button
 onClick={() => setCustomerLevelFeature(!customerLevelFeature)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 customerLevelFeature ? "bg-indigo-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 <p className="text-[11px] font-bold text-slate-400 px-2 leading-relaxed italic">
 Reward VIP frequent riders with exclusive benefits or priority booking.
 </p>
 </div>
 </div>

 {/* 4. Customer Loyalty Points */}
 <div className="bg-slate-900 p-12 rounded-[80px] text-white shadow-2xl relative overflow-hidden group lg:col-span-2">
 <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
 <div className="flex items-center gap-6 mb-10">
 <div className="p-5 bg-white/10 rounded-[32px] text-emerald-400">
 <Gift className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-2xl font-black tracking-tight">Loyalty Rewards Logic</h3>
 <p className="text-[10px] font-black text-emerald-400/50 tracking-[0.2em] mt-1">Earnings & Redemption</p>
 </div>
 <div className="ml-auto">
 <button
 onClick={() => setCustomerLoyaltyPoints(!customerLoyaltyPoints)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 customerLoyaltyPoints ? "bg-emerald-500 justify-end" : "bg-white/10 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-white/30 ml-1">$1.00 Equivalent To Points</label>
 <input type="number" defaultValue="10" className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[28px] text-sm font-black text-white focus:bg-white/10 outline-none transition-all" />
 </div>
 <div className="p-6 bg-white/5 border border-white/10 rounded-[32px]">
 <p className="text-[10px] font-black text-white/40 mb-3 leading-relaxed">System automatically converts spending based on this ratio for trips and payments.</p>
 </div>
 </div>
 </div>

 {/* 5. Wallet System */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-emerald-50 rounded-[28px] text-emerald-500">
 <CreditCard className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Wallet Setup</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Prepaid Controls</p>
 </div>
 <div className="ml-auto">
 <button
 onClick={() => setCustomerWalletSystem(!customerWalletSystem)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 customerWalletSystem ? "bg-emerald-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 </div>

 <div className="space-y-6 flex-1">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">Minimum Add Amount ($)</label>
 <input type="number" defaultValue="10" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black text-slate-900" />
 </div>
 <p className="text-[11px] font-bold text-slate-400 px-2 leading-relaxed">
 Faster checkout and reduced payment failures through pre-funded balances.
 </p>
 </div>
 </div>
 </div>

 </div>
 );

 const renderFarePenalty = () => (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
 {/* 1. Idle Fee */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-amber-50 rounded-[28px] text-amber-500">
 <Clock className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Idle Fee</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Stops & Standstills</p>
 </div>
 </div>
 <div className="space-y-6 flex-1">
 <p className="text-[11px] font-bold text-slate-400 px-2 leading-relaxed">
 Applied when the driver pauses an ongoing trip or the vehicle is not moving during active booking.
 </p>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">Start Count Idle Fee After (Min)</label>
 <input type="number" defaultValue="5" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black text-slate-900 focus:bg-white transition-all outline-none" />
 </div>
 </div>
 </div>

 {/* 2. Delay Fee */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-rose-50 rounded-[28px] text-rose-500">
 <AlertTriangle className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Delay Fee</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Extended Duration</p>
 </div>
 </div>
 <div className="space-y-6 flex-1">
 <p className="text-[11px] font-bold text-slate-400 px-2 leading-relaxed">
 Applied when a trip is delayed beyond the estimated trip time due to traffic or route changes.
 </p>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">Start Count Delay Fee After (Min)</label>
 <input type="number" defaultValue="5" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black text-slate-900 focus:bg-white transition-all outline-none" />
 </div>
 </div>
 </div>

 {/* Cancellation Logic */}
 <div className="bg-slate-900 p-12 rounded-[80px] text-white shadow-2xl relative overflow-hidden group">
 <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px]" />
 <div className="flex items-center gap-6 mb-10">
 <div className="p-5 bg-white/10 rounded-[32px] text-rose-400">
 <Undo2 className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-2xl font-black tracking-tight">Cancellation Policy</h3>
 <p className="text-[10px] font-black text-rose-400/50 tracking-[0.2em] mt-1">Penalty Orchestration</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-white/30 ml-1">Cancellation Fee (NGN)</label>
 <input type="number" defaultValue="800" className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[28px] text-sm font-black text-white focus:bg-white/10 outline-none transition-all" />
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-white/30 ml-1">Free Window (Minutes)</label>
 <input type="number" defaultValue="3" className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[28px] text-sm font-black text-white focus:bg-white/10 outline-none transition-all" />
 </div>
 </div>
 </div>

 </div>
 );

 const renderTrips = () => (
 <div className="space-y-8 animate-in mt-2 fade-in slide-in-from-bottom-4 duration-700 pb-20">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* 1. Route Option (Extra Stops) */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-sky-50 rounded-[28px] text-sky-500">
 <Navigation className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Route Flexibility</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Multi-Stop Settings</p>
 </div>
 </div>

 <div className="space-y-6 flex-1">
 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px]">
 <div>
 <p className="text-sm font-black text-slate-900 leading-none">Extra Stops</p>
 <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-tighter">Multi-Destination</p>
 </div>
 <button
 onClick={() => setExtraStops(!extraStops)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 extraStops ? "bg-sky-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 <p className="text-[11px] font-bold text-slate-400 px-2 leading-relaxed">
 Allows customers to add extra stops during booking. Fare increases dynamically.
 </p>
 </div>
 </div>

 {/* 2. Request Timeout & 3. OTP Security */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-amber-50 rounded-[28px] text-amber-500">
 <Clock className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Dispatch & Safety</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Timeouts & Security</p>
 </div>
 </div>

 <div className="space-y-6 flex-1">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">Request Active Time (Min)</label>
 <input type="number" defaultValue="5" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black text-slate-900" />
 </div>
 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px]">
 <div>
 <p className="text-sm font-black text-slate-900 leading-none">OTP Verification</p>
 <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-tighter">Start Trip Securely</p>
 </div>
 <button
 onClick={() => setDriverOtpConfirmation(!driverOtpConfirmation)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 driverOtpConfirmation ? "bg-amber-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 </div>
 </div>

 {/* 4 & 5. Scheduling Engine */}
 <div className="bg-slate-900 p-12 rounded-[80px] text-white shadow-2xl relative overflow-hidden group lg:col-span-1">
 <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
 <div className="flex items-center gap-6 mb-10">
 <div className="p-5 bg-white/10 rounded-[32px] text-purple-400">
 <Calendar className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-2xl font-black tracking-tight">Scheduling</h3>
 <p className="text-[10px] font-black text-purple-400/50 tracking-[0.2em] mt-1">Advanced Bookings</p>
 </div>
 <div className="ml-auto">
 <button
 onClick={() => setScheduleTrip(!scheduleTrip)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 scheduleTrip ? "bg-purple-500 justify-end" : "bg-white/10 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 </div>

 <div className="space-y-6">
 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-white/30 ml-1">Min Lead (Min)</label>
 <input type="number" defaultValue="5" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-[24px] text-sm font-black text-white focus:bg-white/10 outline-none transition-all" />
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-white/30 ml-1">Max Advance (Days)</label>
 <input type="number" defaultValue="7" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-[24px] text-sm font-black text-white focus:bg-white/10 outline-none transition-all" />
 </div>
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-white/30 ml-1">Driver Notify Lead (Min)</label>
 <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-[28px]">
 <Bell className="w-5 h-5 text-purple-400" />
 <input type="number" defaultValue="4" className="bg-transparent border-none text-sm font-black text-white w-full outline-none" />
 </div>
 </div>
 </div>
 </div>

 {/* 6. Fare Increase (Surge Logic) */}
 <div className="bg-emerald-900 p-12 rounded-[80px] text-white shadow-2xl relative overflow-hidden group lg:col-span-2">
 <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
 <div className="flex items-center gap-6 mb-10">
 <div className="p-5 bg-white/10 rounded-[32px] text-emerald-400">
 <TrendingUp className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-2xl font-black tracking-tight">Scheduled Surge</h3>
 <p className="text-[10px] font-black text-emerald-400/50 tracking-[0.2em] mt-1">Dynamic Pricing</p>
 </div>
 <div className="ml-auto">
 <button
 onClick={() => setIncreaseFareRate(!increaseFareRate)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 increaseFareRate ? "bg-emerald-500 justify-end" : "bg-white/10 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-white/30 ml-1">Increase Fare Rate (%)</label>
 <div className="relative">
 <input type="number" defaultValue="50" className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[28px] text-3xl font-black text-white focus:bg-white/10 outline-none transition-all" />
 <span className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl font-black text-white/20">%</span>
 </div>
 </div>
 <div className="p-8 bg-white/5 border border-white/10 rounded-[40px]">
 <p className="text-xs font-bold text-white/60 leading-relaxed">
 Compensates drivers for reserved time slots. Scheduled rides will cost 50% more than instant bookings.
 </p>
 </div>
 </div>
 </div>

 {/* 7. Cancellation Messages Management */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col lg:col-span-3">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-rose-50 rounded-[28px] text-rose-500">
 <XCircle className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Trip Cancellation Console</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Dispute & Operational Insights</p>
 </div>
 </div>
 <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full text-xs font-black hover:scale-105 active:scale-95 transition-all">
 <Plus className="w-4 h-4" />
 Add Reason
 </button>
 </div>

 <div className="overflow-hidden border border-slate-100 rounded-[40px]">
 <table className="w-full text-left">
 <thead className="bg-slate-50 border-b border-slate-100">
 <tr>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 ">Cancellation Reason</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 ">Type</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 ">User</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {[
 { reason: "Couldn't find or contact customer", type: "Before Pickup", user: "Driver" },
 { reason: "Customer changed mind", type: "Before Pickup", user: "Customer" },
 { reason: "Vehicle mechanical issue", type: "Ongoing Ride", user: "Driver" },
 ].map((item, idx) => (
 <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
 <td className="px-8 py-6">
 <p className="text-sm font-bold text-slate-900">{item.reason}</p>
 </td>
 <td className="px-8 py-6">
 <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 tracking-tight">{item.type}</span>
 </td>
 <td className="px-8 py-6">
 <span className="flex items-center gap-2 text-sm font-bold text-slate-600">
 <Users className="w-4 h-4 opacity-40" />
 {item.user}
 </span>
 </td>
 <td className="px-8 py-6 text-right">
 <button className="p-3 text-slate-300 hover:text-rose-500 transition-colors">
 <XCircle className="w-5 h-5" />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>

 </div>
 );

 const renderParcel = () => (
 <div className="space-y-8 animate-in mt-2 fade-in slide-in-from-bottom-4 duration-700 pb-20">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* 1. Tracking Link */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-sky-50 rounded-[28px] text-sky-500">
 <Link className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Tracking Link</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Customer Visibility</p>
 </div>
 </div>

 <div className="space-y-6 flex-1">
 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px]">
 <div>
 <p className="text-sm font-black text-slate-900 leading-none">SMS Tracking</p>
 <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-tighter">Live Link Auto-Send</p>
 </div>
 <button
 onClick={() => setParcelTrackingLink(!parcelTrackingLink)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 parcelTrackingLink ? "bg-sky-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 <p className="text-[11px] font-bold text-slate-400 px-2 leading-relaxed italic">
 Improves transparency and reduces support calls by enabling real-time parcel tracking.
 </p>
 </div>
 </div>

 {/* 2. Parcel Return Module */}
 <div className="bg-slate-900 p-12 rounded-[80px] text-white shadow-2xl relative overflow-hidden group lg:col-span-2">
 <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px]" />
 <div className="flex items-center gap-6 mb-10">
 <div className="p-5 bg-white/10 rounded-[32px] text-rose-400">
 <ArrowLeftRight className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-2xl font-black tracking-tight">Return Management</h3>
 <p className="text-[10px] font-black text-rose-400/50 tracking-[0.2em] mt-1">Failed Delivery Logic</p>
 </div>
 <div className="ml-auto">
 <button
 onClick={() => setParcelReturnModule(!parcelReturnModule)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 parcelReturnModule ? "bg-rose-500 justify-end" : "bg-white/10 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
 <div className="space-y-6">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-white/30 ml-1">Limit Return Time For Driver</label>
 <div className="flex gap-4">
 <input type="number" defaultValue="2" className="flex-1 px-8 py-5 bg-white/5 border border-white/10 rounded-[28px] text-sm font-black text-white outline-none" />
 <select className="px-8 py-5 bg-white/5 border border-white/10 rounded-[28px] text-sm font-black text-white outline-none appearance-none">
 <option className="bg-slate-900">Days</option>
 <option className="bg-slate-900">Hours</option>
 </select>
 </div>
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-white/30 ml-1">Late Return Penalty ($)</label>
 <input type="number" defaultValue="500" className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[28px] text-sm font-black text-white outline-none" />
 </div>
 </div>
 <div className="space-y-6">
 <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-between">
 <div className="pr-4">
 <p className="text-sm font-bold leading-tight">No Return Fee on Driver Cancel</p>
 <p className="text-[10px] text-white/30 mt-1">Protects customer from driver fault</p>
 </div>
 <button
 onClick={() => setNoChargeOnDriverCancel(!noChargeOnDriverCancel)}
 className={cn(
 "w-12 h-6 rounded-full p-1 transition-all duration-300 flex items-center",
 noChargeOnDriverCancel ? "bg-emerald-500 justify-end" : "bg-white/10 justify-start"
 )}
 >
 <div className="w-4 h-4 bg-white rounded-full" />
 </button>
 </div>
 <p className="text-[11px] font-bold text-white/30 leading-relaxed px-2">
 Prevents drivers from holding parcels and protects business liability while ensuring operational discipline.
 </p>
 </div>
 </div>
 </div>

 {/* 3 & 4. Weight Units & Limits */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-emerald-50 rounded-[28px] text-emerald-500">
 <Scale className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Weight Enforcement</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Limits & Units</p>
 </div>
 </div>

 <div className="space-y-6 flex-1">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">System Weight Unit</label>
 <select className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black text-slate-900 outline-none appearance-none cursor-pointer">
 <option>Kg (Kilograms)</option>
 <option>Lb (Pounds)</option>
 </select>
 </div>
 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px]">
 <div>
 <p className="text-sm font-black text-slate-900 leading-none">Weight Limit</p>
 <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-tighter">Enforce Max Limit</p>
 </div>
 <button
 onClick={() => setParcelWeightLimitEnable(!parcelWeightLimitEnable)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 parcelWeightLimitEnable ? "bg-emerald-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">Max Parcel Weight (Kg)</label>
 <input type="number" defaultValue="100" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black text-slate-900" />
 </div>
 </div>
 </div>

 {/* 5, 6, 7. Parcel Cancellation Reason Management */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col lg:col-span-3">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-orange-50 rounded-[28px] text-orange-500">
 <XCircle className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Logistics Cancellation Hub</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Return & Return Logic Analytics</p>
 </div>
 </div>
 <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full text-xs font-black hover:scale-105 active:scale-95 transition-all">
 <Plus className="w-4 h-4" />
 Add Parcel Reason
 </button>
 </div>

 <div className="overflow-hidden border border-slate-100 rounded-[40px]">
 <table className="w-full text-left">
 <thead className="bg-slate-50 border-b border-slate-100">
 <tr>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 ">SL</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 ">Cancellation Reason</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 ">Type</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 ">User</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 ">Status</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 text-right">Action</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {[
 { reason: "Couldn't reach destination due to heavy jam", type: "Ongoing", user: "Driver", status: true },
 { reason: "Driver wants extra fare", type: "Before Pickup", user: "Customer", status: true },
 { reason: "Driver asked me to cancel", type: "Before Pickup", user: "Customer", status: true },
 { reason: "Couldn't find or contact customer", type: "Before Pickup", user: "Driver", status: true },
 ].map((item, idx) => (
 <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
 <td className="px-8 py-6 text-sm font-black text-slate-400">{idx + 1}</td>
 <td className="px-8 py-6">
 <p className="text-sm font-bold text-slate-900">{item.reason}</p>
 </td>
 <td className="px-8 py-6">
 <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 tracking-tight">{item.type}</span>
 </td>
 <td className="px-8 py-6">
 <span className="flex items-center gap-2 text-sm font-bold text-slate-600">
 <Users className="w-4 h-4 opacity-40" />
 {item.user}
 </span>
 </td>
 <td className="px-8 py-6">
 <div className="w-10 h-5 bg-emerald-500 rounded-full p-1 flex items-center justify-end">
 <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
 </div>
 </td>
 <td className="px-8 py-6 text-right">
 <div className="flex items-center justify-end gap-2">
 <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
 <FileText className="w-4 h-4" />
 </button>
 <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
 <XCircle className="w-4 h-4" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>

 </div>
 );

 const renderMart = () => (
 <div className="space-y-12 animate-in mt-2 fade-in slide-in-from-bottom-4 duration-700 pb-20">
 {/* Row 1: Status, Delivery Charges, Min Order */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* 1. Mart Delivery Feature (Status Toggle) */}
 <div className="bg-emerald-600 p-10 rounded-[60px] text-white shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32" />
 <div className="flex items-center gap-6 mb-10 relative z-10">
 <div className="p-4 bg-white/10 rounded-[28px] text-emerald-100">
 <Store className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-xl font-black tracking-tight ">Feature Status</h3>
 <p className="text-[10px] font-black text-emerald-200/50 tracking-[0.2em] mt-1">Global Engine</p>
 </div>
 </div>
 <div className="space-y-6 relative z-10">
 <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[32px]">
 <div>
 <p className="text-sm font-bold">Mart Service</p>
 <p className="text-[10px] text-emerald-100/30 mt-1 ">Instant Delivery On/Off</p>
 </div>
 <button
 onClick={() => setMartOn(!martOn)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center shadow-lg",
 martOn ? "bg-emerald-400 justify-end" : "bg-white/10 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 </div>
 </div>

 {/* 2. Delivery Charge Setup */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 lg:col-span-2">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-emerald-50 rounded-[24px] text-emerald-500">
 <CreditCard className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Delivery Charge Setup</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Base & Distance Rules</p>
 </div>
 </div>
 <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-full border border-slate-100">
 <span className="text-[10px] font-black text-slate-500 ">Surge Mode</span>
 <button
 onClick={() => setMartSurgeCharge(!martSurgeCharge)}
 className={cn(
 "w-10 h-5 rounded-full p-0.5 transition-all duration-500 flex items-center",
 martSurgeCharge ? "bg-amber-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-4 h-4 bg-white rounded-full" />
 </button>
 </div>
 </div>
 <div className="grid grid-cols-2 gap-8">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">Base Delivery Charge ($)</label>
 <input
 type="number"
 value={martBaseCharge}
 onChange={(e) => setMartBaseCharge(parseInt(e.target.value))}
 className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black text-slate-900 outline-none"
 />
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">Extra Fee Per KM ($)</label>
 <input
 type="number"
 value={martDistanceFee}
 onChange={(e) => setMartDistanceFee(parseInt(e.target.value))}
 className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black text-slate-900 outline-none"
 />
 </div>
 </div>
 </div>
 </div>

 {/* Row 2: Min Order, Scheduling, Radius */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* 3. Minimum Order Amount */}
 <div className="bg-slate-900 p-10 rounded-[60px] text-white shadow-2xl space-y-8 flex flex-col justify-center relative overflow-hidden">
 <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl opacity-50" />
 <div className="flex items-center gap-4 mb-2">
 <div className="p-4 bg-white/10 rounded-[24px] text-emerald-400">
 <Zap className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black tracking-tight italic">Minimum Order</h3>
 <p className="text-[10px] font-black text-white/30 tracking-[0.2em] mt-1">Value Gate</p>
 </div>
 </div>
 <div className="relative">
 <input
 type="number"
 value={martMinOrderAmount}
 onChange={(e) => setMartMinOrderAmount(parseInt(e.target.value))}
 className="bg-transparent text-5xl font-black text-white w-full outline-none focus:text-emerald-400 transition-colors"
 />
 <span className="absolute right-0 bottom-2 text-sm font-black text-white/20 ">NGN / USD</span>
 </div>
 <p className="text-[10px] font-bold text-white/20 leading-relaxed">
 Prevents small orders that are not cost-effective for instant grocery delivery.
 </p>
 </div>

 {/* 4. Delivery Time & Scheduling */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-orange-50 rounded-[24px] text-orange-500">
 <Clock className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Time & Scheduling</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">SLA Planning</p>
 </div>
 </div>
 <div className="space-y-6">
 <div className="grid grid-cols-2 gap-4">
 <div className="p-5 bg-slate-50 rounded-[28px] border border-slate-100">
 <p className="text-[10px] font-black text-slate-400 tracking-tighter mb-2">Est. Delivery (Min)</p>
 <input
 type="number"
 value={martEstDeliveryTime}
 onChange={(e) => setMartEstDeliveryTime(parseInt(e.target.value))}
 className="bg-transparent text-xl font-black text-slate-900 outline-none w-full"
 />
 </div>
 <div className="p-5 bg-slate-50 rounded-[28px] border border-slate-100">
 <p className="text-[10px] font-black text-slate-400 tracking-tighter mb-2">Prep Time (Min)</p>
 <input
 type="number"
 value={martPrepTime}
 onChange={(e) => setMartPrepTime(parseInt(e.target.value))}
 className="bg-transparent text-xl font-black text-slate-900 outline-none w-full"
 />
 </div>
 </div>
 <div className="flex items-center justify-between px-6 py-4 bg-slate-900 rounded-[24px] text-white">
 <span className="text-[10px] font-black ">Scheduled Orders</span>
 <button
 onClick={() => setMartScheduledDelivery(!martScheduledDelivery)}
 className={cn(
 "w-10 h-5 rounded-full p-0.5 transition-all duration-500 flex items-center",
 martScheduledDelivery ? "bg-emerald-500 justify-end" : "bg-white/20 justify-start"
 )}
 >
 <div className="w-4 h-4 bg-white rounded-full" />
 </button>
 </div>
 </div>
 </div>

 {/* 5. Delivery Radius / Zone Settings */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-emerald-50 rounded-[24px] text-emerald-500">
 <Navigation className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Radius & Zones</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Geo Coverage</p>
 </div>
 </div>
 <div className="space-y-8 flex-1 flex flex-col justify-center">
 <div className="space-y-4">
 <div className="flex justify-between items-end">
 <label className="text-[10px] font-black text-slate-400 ml-1">Service Radius (KM)</label>
 <span className="text-xl font-black text-emerald-500">{martDeliveryRadius}</span>
 </div>
 <input
 type="range"
 min="1"
 max="50"
 value={martDeliveryRadius}
 onChange={(e) => setMartDeliveryRadius(parseInt(e.target.value))}
 className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
 />
 </div>
 <div className="p-6 bg-slate-50 rounded-[32px] border border-dashed border-slate-200 text-center">
 <p className="text-[10px] font-bold text-slate-400 leading-relaxed font-mono">
 ZONE-BASED RESTRICTIONS: ACTIVE
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* Row 3: Driver Assignment, Order Handling, Cancellation */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* 6. Driver Assignment Logic */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-slate-900 rounded-[24px] text-white">
 <Truck className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Driver Logic</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Allocation Engine</p>
 </div>
 </div>
 <div className="space-y-4">
 <div className="flex gap-2 p-2 bg-slate-50 rounded-[32px]">
 {['Auto', 'Manual'].map((mode) => (
 <button
 key={mode}
 onClick={() => setMartDriverAssignLogic(mode)}
 className={cn(
 "flex-1 py-4 rounded-[24px] text-[10px] font-black transition-all",
 martDriverAssignLogic === mode ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
 )}
 >
 {mode} Assignment
 </button>
 ))}
 </div>
 <div className="p-6 bg-slate-50 rounded-[32px] flex items-center justify-between">
 <div>
 <p className="text-xs font-black text-slate-900">Batch Delivery</p>
 <p className="text-[10px] font-bold text-slate-400 ">Support Multiple Orders</p>
 </div>
 <button
 onClick={() => setMartBatchDelivery(!martBatchDelivery)}
 className={cn(
 "w-12 h-6 rounded-full p-1 transition-all duration-500 flex items-center",
 martBatchDelivery ? "bg-emerald-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-4 h-4 bg-white rounded-full" />
 </button>
 </div>
 </div>
 </div>

 {/* 7. Order Handling Settings */}
 <div className="bg-emerald-50 p-10 rounded-[60px] border border-emerald-100 shadow-sm space-y-8 relative overflow-hidden">
 <div className="absolute top-0 right-0 p-8 text-emerald-100">
 <ClipboardList className="w-20 h-20" />
 </div>
 <div className="flex items-center gap-4 relative z-10">
 <div className="p-4 bg-emerald-500 rounded-[24px] text-white shadow-lg shadow-emerald-200">
 <Layers className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-emerald-900 tracking-tight">Order Lifecycle</h3>
 <p className="text-[10px] font-black text-emerald-600 mt-1">Confirmation Rules</p>
 </div>
 </div>
 <div className="space-y-4 relative z-10">
 <div className="p-6 bg-white rounded-[32px] border border-emerald-100 space-y-4 shadow-sm">
 <p className="text-[10px] font-black text-emerald-900 ">Confirmation Mode</p>
 <div className="flex gap-2">
 {['Auto', 'Manual'].map((mode) => (
 <button
 key={mode}
 onClick={() => setMartOrderConfirmation(mode)}
 className={cn(
 "flex-1 py-3 rounded-xl text-[10px] font-black transition-all",
 martOrderConfirmation === mode ? "bg-emerald-900 text-white shadow-lg" : "bg-emerald-50 text-emerald-400 border border-emerald-100"
 )}
 >
 {mode}-Accept
 </button>
 ))}
 </div>
 </div>
 <p className="text-[10px] font-bold text-emerald-600/60 text-center px-4 leading-relaxed">
 Structured workflow from placement to "Out-for-delivery" status.
 </p>
 </div>
 </div>

 {/* 8. Cancellation & Refund Policy */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-rose-50 rounded-[24px] text-rose-500">
 <ShieldAlert className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Refund Policy</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Limits & Charges</p>
 </div>
 </div>
 <div className="space-y-6">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">Time Limit (Min)</label>
 <input
 type="number"
 value={martCancelLimit}
 onChange={(e) => setMartCancelLimit(parseInt(e.target.value))}
 className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[24px] text-sm font-black text-slate-900"
 />
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">Cancellation Fee ($)</label>
 <input
 type="number"
 value={martCancelCharge}
 onChange={(e) => setMartCancelCharge(parseInt(e.target.value))}
 className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[24px] text-sm font-black text-slate-900"
 />
 </div>
 </div>
 </div>
 </div>

 {/* Row 4: Payments, Weight/Items, Notifications */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* 9. Payment Method Configuration */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-slate-900 rounded-[24px] text-white">
 <CreditCard className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Payments</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Flexible Gateways</p>
 </div>
 </div>
 <div className="space-y-3">
 {[
 { label: 'Cash on Delivery', state: martPaymentCOD, setter: setMartPaymentCOD },
 { label: 'Wallet Payment', state: martPaymentWallet, setter: setMartPaymentWallet },
 { label: 'Online Gateway', state: martPaymentOnline, setter: setMartPaymentOnline }
 ].map((pay, i) => (
 <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-[24px] border border-slate-100">
 <span className="text-[10px] font-black text-slate-900 tracking-tighter">{pay.label}</span>
 <button
 onClick={() => pay.setter(!pay.state)}
 className={cn(
 "w-10 h-5 rounded-full p-0.5 transition-all duration-500",
 pay.state ? "bg-emerald-500 flex justify-end" : "bg-slate-200 flex justify-start"
 )}
 >
 <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
 </button>
 </div>
 ))}
 </div>
 </div>

 {/* 10. Product Weight / Item Handling */}
 <div className="bg-slate-900 p-10 rounded-[60px] text-white shadow-2xl space-y-8 relative overflow-hidden group">
 <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
 <div className="flex items-center gap-4 relative z-10">
 <div className="p-4 bg-white/10 rounded-[24px] text-emerald-400">
 <Box className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black tracking-tight">Weight & Handling</h3>
 <p className="text-[10px] font-black text-white/30 tracking-[0.2em] mt-1">Bulk Logistics</p>
 </div>
 </div>
 <div className="space-y-6 relative z-10">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-white/40 ">Cart Weight Limit (KG)</label>
 <input
 type="number"
 value={martMaxWeight}
 onChange={(e) => setMartMaxWeight(parseInt(e.target.value))}
 className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-[24px] text-sm font-black text-white"
 />
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-white/40 ">Heavy Handling Fee ($)</label>
 <input
 type="number"
 value={martHandlingCharge}
 onChange={(e) => setMartHandlingCharge(parseInt(e.target.value))}
 className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-[24px] text-sm font-black text-white"
 />
 </div>
 </div>
 </div>

 {/* 11. Notifications & Alerts */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-emerald-50 rounded-[24px] text-emerald-500">
 <Bell className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Alert Hub</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Multi-Channel Config</p>
 </div>
 </div>
 <div className="space-y-4">
 <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
 <p className="text-[10px] font-black text-slate-900 ">Active Channels</p>
 <div className="grid grid-cols-2 gap-3">
 <button
 onClick={() => setMartNotifySMS(!martNotifySMS)}
 className={cn(
 "py-4 rounded-2xl text-[10px] font-black transition-all",
 martNotifySMS ? "bg-emerald-500 text-white shadow-lg" : "bg-white text-slate-300 border border-slate-100"
 )}
 >
 SMS Alerts
 </button>
 <button
 onClick={() => setMartNotifyPush(!martNotifyPush)}
 className={cn(
 "py-4 rounded-2xl text-[10px] font-black transition-all",
 martNotifyPush ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-300 border border-slate-100"
 )}
 >
 Push Notify
 </button>
 </div>
 </div>
 <p className="text-[10px] font-bold text-slate-400 text-center tracking-tighter">
 Triggered on: Paid, Confirmed, Packed, Dispatch
 </p>
 </div>
 </div>
 </div>

 </div>
 );

 const renderMerchantDelivery = (type: string, theme: string, icon: any) => (
 <div className="space-y-8 animate-in mt-2 fade-in slide-in-from-bottom-4 duration-700 pb-20">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* 1. Core Service Config */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
 <div className="flex items-center gap-4">
 <div className={cn("p-4 rounded-[28px]", theme)}>
 {icon}
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">{type} Engine</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">SLA & Commissions</p>
 </div>
 </div>

 <div className="space-y-6 flex-1">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">Avg. Preparation Time (Min)</label>
 <input type="number" defaultValue="25" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black text-slate-900 outline-none" />
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">Merchant Commission (%)</label>
 <div className="relative">
 <input type="number" defaultValue="15" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black text-slate-900 outline-none" />
 <span className="absolute right-8 top-1/2 -translate-y-1/2 text-sm font-black text-slate-300">%</span>
 </div>
 </div>
 </div>
 </div>

 {/* 2. Packaging & Handling */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-slate-50 rounded-[28px] text-slate-400">
 <Package className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Packaging Hub</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Fees & Materials</p>
 </div>
 </div>

 <div className="space-y-6 flex-1">
 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px]">
 <div>
 <p className="text-sm font-black text-slate-900 leading-none">Packaging Fee</p>
 <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-tighter">Auto-add to checkout</p>
 </div>
 <div className="w-16 h-8 rounded-full bg-emerald-500 p-1 flex flex-row-reverse items-center transition-all duration-500">
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </div>
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">Default Base Fee (NGN)</label>
 <input type="number" defaultValue="150" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black text-slate-900 outline-none" />
 </div>
 </div>
 </div>

 {/* 3. Operational Limits */}
 <div className="bg-slate-900 p-12 rounded-[80px] text-white shadow-2xl relative overflow-hidden group">
 <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
 <div className="flex items-center gap-6 mb-10">
 <div className="p-5 bg-white/10 rounded-[32px] text-white/60">
 <Navigation className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-2xl font-black tracking-tight">Logistics Gate</h3>
 <p className="text-[10px] font-black text-white/30 tracking-[0.2em] mt-1">Radius & Capacity</p>
 </div>
 </div>

 <div className="space-y-6">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-white/30 ml-1">Delivery Radius (KM)</label>
 <input type="number" defaultValue="10" className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[28px] text-sm font-black text-white outline-none" />
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-white/30 ml-1">Min. Order Value (NGN)</label>
 <input type="number" defaultValue="2000" className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[28px] text-sm font-black text-white outline-none" />
 </div>
 </div>
 </div>
 </div>

 </div>
 );

 const renderRefund = () => (
 <div className="space-y-8 animate-in mt-2 fade-in slide-in-from-bottom-4 duration-700 pb-20">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* 1. Global Refund Orchestration */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col lg:col-span-2">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-rose-50 rounded-[28px] text-rose-500">
 <Undo2 className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Post-Service Refund Engine</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Cross-Service Eligibility & Automation</p>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-6">
 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px]">
 <div>
 <p className="text-sm font-black text-slate-900 leading-none">Automatic Refunds</p>
 <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-tighter">Small Order Instance Approval</p>
 </div>
 <button
 onClick={() => setAutoRefundSmallOrders(!autoRefundSmallOrders)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 autoRefundSmallOrders ? "bg-emerald-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">Auto-Refund Threshold (NGN)</label>
 <input type="number" defaultValue="2000" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black text-slate-900 outline-none" />
 </div>
 </div>
 <div className="space-y-6">
 <div className="flex items-center justify-between p-6 bg-slate-100 rounded-[32px]">
 <div>
 <p className="text-sm font-black text-slate-900 leading-none">Validity Setup</p>
 <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-tighter">Refund Request Window</p>
 </div>
 <div className="p-3 bg-white rounded-2xl text-amber-500 shadow-sm">
 <Timer className="w-5 h-5" />
 </div>
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">Period (Hours)</label>
 <input type="number" defaultValue="24" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
 <p className="text-[11px] font-bold text-slate-400 px-2 leading-relaxed">
 Set the time period during which customers can request a refund for their parcel after completing an order.
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* 2. Service-Specific Eligibility Gates */}
 <div className="bg-slate-900 p-12 rounded-[80px] text-white shadow-2xl relative overflow-hidden group">
 <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px]" />
 <div className="flex items-center gap-6 mb-10">
 <div className="p-5 bg-white/10 rounded-[32px] text-rose-400">
 <FileCheck className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-2xl font-black tracking-tight">Eligibility Gates</h3>
 <p className="text-[10px] font-black text-rose-400/50 tracking-[0.2em] mt-1">Service Specific Toggles</p>
 </div>
 </div>

 <div className="space-y-4">
 {[
 { label: "Parcel Logistics", state: refundParcel, setter: setRefundParcel, icon: <Package className="w-4 h-4" /> },
 { label: "Food Delivery", state: refundFood, setter: setRefundFood, icon: <Utensils className="w-4 h-4" /> },
 { label: "Mart / Grocery", state: refundMart, setter: setRefundMart, icon: <Store className="w-4 h-4" /> },
 { label: "Personal Shopping", state: refundShopping, setter: setRefundShopping, icon: <ShoppingBag className="w-4 h-4" /> },
 ].map((service, i) => (
 <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-[28px]">
 <div className="flex items-center gap-3">
 <div className="text-white/40">{service.icon}</div>
 <p className="text-sm font-bold">{service.label}</p>
 </div>
 <button
 onClick={() => service.setter(!service.state)}
 className={cn(
 "w-12 h-6 rounded-full p-1 transition-all duration-300 flex items-center",
 service.state ? "bg-rose-500 justify-end" : "bg-white/10 justify-start"
 )}
 >
 <div className="w-4 h-4 bg-white rounded-full shadow-md" />
 </button>
 </div>
 ))}
 </div>
 </div>

 {/* 3. Refund Reasons Management */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col lg:col-span-3">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-amber-50 rounded-[28px] text-amber-500">
 <History className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Refund Reason Repository</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Predefined Dispute Justifications</p>
 </div>
 </div>
 <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full text-xs font-black hover:scale-105 active:scale-95 transition-all">
 <Plus className="w-4 h-4" />
 Add Reason
 </button>
 </div>

 <div className="overflow-hidden border border-slate-100 rounded-[40px]">
 <table className="w-full text-left">
 <thead className="bg-slate-50 border-b border-slate-100">
 <tr>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 ">Justification</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 ">Primary Service</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 ">Automation Pool</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 text-right">Action</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {[
 { reason: "Items arrived damaged or leaking", service: "All", pool: "High Priority" },
 { reason: "Missing items from order", service: "Food/Mart", pool: "Auto-Verify" },
 { reason: "Incorrect parcel weight billed", service: "Parcel", pool: "Manual Review" },
 { reason: "Shopping list mismatch", service: "Shopping", pool: "Merchant Dispute" },
 ].map((item, idx) => (
 <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
 <td className="px-8 py-6">
 <p className="text-sm font-bold text-slate-900">{item.reason}</p>
 </td>
 <td className="px-8 py-6">
 <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 tracking-tight">{item.service}</span>
 </td>
 <td className="px-8 py-6">
 <span className="flex items-center gap-2 text-sm font-bold text-slate-600">
 <FileSearch className="w-4 h-4 opacity-40 text-sky-500" />
 {item.pool}
 </span>
 </td>
 <td className="px-8 py-6 text-right">
 <div className="flex items-center justify-end gap-2 text-slate-300">
 <button className="p-2 hover:text-slate-900 transition-colors"><FileText className="w-4 h-4" /></button>
 <button className="p-2 hover:text-rose-500 transition-colors"><Ban className="w-4 h-4" /></button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>

 </div>
 );

 const renderSafety = () => (
 <div className="space-y-12 animate-in mt-2 fade-in slide-in-from-bottom-4 duration-700 pb-20">
 {/* 1. Safety Alert (Master System & Automation) */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="bg-rose-900 p-12 rounded-[80px] text-white shadow-2xl relative overflow-hidden group">
 <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
 <div className="flex items-center gap-6 mb-10">
 <div className="p-5 bg-white/10 rounded-[32px] text-rose-400">
 <Shield className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-2xl font-black tracking-tight">Master Shield</h3>
 <p className="text-[10px] font-black text-rose-400/50 tracking-[0.2em] mt-1">Core Safety Engine</p>
 </div>
 </div>

 <div className="space-y-6">
 <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[32px]">
 <div>
 <p className="text-sm font-bold">Safety Feature</p>
 <p className="text-[10px] text-white/30 mt-1 ">Master In-App Alert</p>
 </div>
 <button
 onClick={() => setSafetyFeatureOn(!safetyFeatureOn)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 safetyFeatureOn ? "bg-rose-500 justify-end" : "bg-white/10 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 <p className="text-[11px] font-bold text-white/40 px-2 leading-relaxed italic">
 Enables SOS/Safety button in both Driver & Customer apps for real-time incident monitoring.
 </p>
 </div>
 </div>

 {/* Automation Gates */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col lg:col-span-2">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-slate-50 rounded-[28px] text-slate-900">
 <Activity className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Automation Gates</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Delay & Post-Trip Windows</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-4">
 <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
 <label className="text-[10px] font-black text-slate-400 block mb-4">Min. Trip Delay (Mins)</label>
 <div className="flex items-center gap-6">
 <input
 type="number"
 value={tripDelayMins}
 onChange={(e) => setTripDelayMins(parseInt(e.target.value))}
 className="bg-transparent text-3xl font-black text-slate-900 w-24 outline-none"
 />
 <div className="flex-1 text-[11px] font-bold text-slate-400 leading-tight">
 Triggers safety alert if trip exceeds ETA by this period.
 </div>
 </div>
 </div>
 </div>
 <div className="space-y-4">
 <div className="p-6 bg-slate-900 rounded-[32px] text-white border border-slate-800 shadow-xl">
 <label className="text-[10px] font-black text-white/30 block mb-4">Post-Trip Window (Mins)</label>
 <div className="flex items-center gap-6">
 <input
 type="number"
 value={afterTripWindowMins}
 onChange={(e) => setAfterTripWindowMins(parseInt(e.target.value))}
 className="bg-transparent text-3xl font-black text-white w-24 outline-none"
 />
 <div className="flex-1 text-[11px] font-bold text-white/30 leading-tight">
 Safety button remains active after trip completion.
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* 2. Emergency Infrastructure (Hotline & Contacts) */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-sky-50 rounded-[28px] text-sky-500">
 <Phone className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Emergency Hub</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Direct Hotline Setup</p>
 </div>
 </div>

 <div className="space-y-6">
 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px]">
 <p className="text-sm font-black">Enable Call Feature</p>
 <button
 onClick={() => setEmergencyCallOn(!emergencyCallOn)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 emergencyCallOn ? "bg-sky-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">Number Type</label>
 <div className="flex gap-2">
 {['Phone', 'Telephone', 'Hotline'].map(type => (
 <button
 key={type}
 onClick={() => setEmergencyNumberType(type)}
 className={cn(
 "flex-1 py-3 rounded-2xl text-[10px] font-black tracking-tight transition-all",
 emergencyNumberType === type ? "bg-slate-900 text-white shadow-lg" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
 )}
 >
 {type}
 </button>
 ))}
 </div>
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">Hotline Number</label>
 <input
 type="text"
 value={hotlineNum}
 onChange={(e) => setHotlineNum(e.target.value)}
 className="w-full px-8 py-5 bg-slate-900 text-white rounded-[28px] text-sm font-black outline-none shadow-2xl"
 />
 </div>
 </div>
 </div>

 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 lg:col-span-2">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-emerald-50 rounded-[28px] text-emerald-500">
 <Users className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Custom Call Directory</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Multi-Response Escalation</p>
 </div>
 </div>
 <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full text-xs font-black hover:scale-105 active:scale-95 transition-all">
 <Plus className="w-4 h-4" />
 Add Contact
 </button>
 </div>

 <div className="overflow-hidden border border-slate-50 rounded-[40px]">
 <table className="w-full text-left">
 <thead className="bg-slate-50/50">
 <tr>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 ">Department</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 ">Phone Number</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 text-right">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {emergencyContacts.map((contact, idx) => (
 <tr key={idx} className="group hover:bg-slate-50/30 transition-colors">
 <td className="px-8 py-6">
 <p className="text-sm font-black text-slate-900">{contact.title}</p>
 </td>
 <td className="px-8 py-6">
 <p className="text-sm font-bold text-slate-500 tracking-tight font-mono">{contact.phone}</p>
 </td>
 <td className="px-8 py-6 text-right">
 <button className="w-10 h-6 rounded-full bg-emerald-500 p-1 flex flex-row-reverse items-center"><div className="w-4 h-4 bg-white rounded-full shadow-sm" /></button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>

 {/* 3. Safety Alert Reasons (Structured Reporting) */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-10">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-amber-50 rounded-[28px] text-amber-500">
 <Zap className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Structured Incident Library</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Predefined Alert Categories</p>
 </div>
 </div>
 <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full text-xs font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200">
 <Plus className="w-5 h-5" />
 New Reason
 </button>
 </div>

 <div className="overflow-hidden border border-slate-100 rounded-[50px]">
 <table className="w-full text-left">
 <thead className="bg-slate-900 text-white">
 <tr>
 <th className="px-10 py-6 text-[10px] font-black opacity-40">SL</th>
 <th className="px-10 py-6 text-[10px] font-black ">Incident Category</th>
 <th className="px-10 py-6 text-[10px] font-black ">Actor Type</th>
 <th className="px-10 py-6 text-[10px] font-black ">Status</th>
 <th className="px-10 py-6 text-[10px] font-black text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {safetyReasons.map((item, idx) => (
 <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
 <td className="px-10 py-8 text-xs font-black text-slate-300">{idx + 1}</td>
 <td className="px-10 py-8">
 <p className="text-sm font-bold text-slate-900 max-w-sm leading-relaxed">{item.reason}</p>
 </td>
 <td className="px-10 py-8">
 <span className={cn(
 "px-4 py-1.5 rounded-full text-[10px] font-black tracking-tight",
 item.forWhom === 'Customer' ? "bg-sky-50 text-sky-600" : "bg-indigo-50 text-indigo-600"
 )}>
 {item.forWhom}
 </span>
 </td>
 <td className="px-10 py-8">
 <div className="flex items-center gap-2">
 <div className="w-2 h-2 rounded-full bg-emerald-500" />
 <span className="text-[10px] font-black text-slate-400 ">Active</span>
 </div>
 </td>
 <td className="px-10 py-8 text-right">
 <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
 <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 hover:shadow-lg transition-all"><Edit className="w-4 h-4" /></button>
 <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 hover:shadow-lg transition-all"><Trash2 className="w-4 h-4" /></button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* 4. Safety Precautions (Policy Guidelines) */}
 <div className="bg-slate-50 p-12 rounded-[80px] border border-slate-200/50 space-y-10">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-white rounded-[28px] text-emerald-500 shadow-sm">
 <ShieldCheck className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Policy Precautions</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">In-App Safety Guidelines</p>
 </div>
 </div>
 <button className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-full text-xs font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-100">
 <Plus className="w-5 h-5" />
 Add Precaution
 </button>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {safetyPrecautions.map((prec, i) => (
 <div key={i} className="group bg-white p-8 rounded-[50px] border border-slate-100 shadow-sm hover:shadow-2xl hover:scale-[1.01] transition-all">
 <div className="flex items-start justify-between mb-6">
 <div className="space-y-1">
 <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[9px] font-black ">
 For: {prec.target}
 </span>
 <h4 className="text-lg font-black text-slate-900 mt-3">{prec.title}</h4>
 </div>
 <div className="flex items-center gap-2">
 <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><Edit className="w-4 h-4" /></button>
 <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
 </div>
 </div>
 <p className="text-sm font-bold text-slate-400 leading-relaxed mb-8">
 {prec.description}
 </p>
 <div className="flex items-center justify-between pt-6 border-t border-slate-50">
 <span className="text-[10px] font-black text-slate-300 ">Guideline Status</span>
 <button className="w-14 h-7 rounded-full bg-emerald-500 p-1 flex flex-row-reverse items-center">
 <div className="w-5 h-5 bg-white rounded-full shadow-md" />
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>

 </div>
 );

 const renderReferral = () => (
 <div className="space-y-12 animate-in mt-2 fade-in slide-in-from-bottom-4 duration-700 pb-20">
 {/* 1. Customer Referral Earning */}
 <div className="bg-white p-12 rounded-[80px] border border-slate-100 shadow-sm space-y-10 relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50 rounded-full blur-[100px] -mr-48 -mt-48 opacity-50" />

 <div className="flex items-center justify-between relative z-10">
 <div className="flex items-center gap-6">
 <div className="p-5 bg-sky-100 rounded-[32px] text-sky-600">
 <Users className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Customer Referral Earning</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Acquisition & Growth Engine</p>
 </div>
 </div>
 <div className="flex items-center gap-4 px-6 py-3 bg-slate-50 rounded-full border border-slate-100">
 <span className="text-[10px] font-black text-slate-400 ">System Status</span>
 <button
 onClick={() => setCustomerReferralOn(!customerReferralOn)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 customerReferralOn ? "bg-emerald-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
 {/* Who Share the Code */}
 <div className="space-y-8 p-10 bg-slate-50 rounded-[60px] border border-slate-100/50">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-white rounded-2xl shadow-sm text-sky-500">
 <Plus className="w-5 h-5" />
 </div>
 <h4 className="text-lg font-black text-slate-900">Who Share the Code</h4>
 </div>
 <div className="space-y-4">
 <label className="text-[10px] font-black text-slate-400 ml-1">Earnings To Each Referral ($)</label>
 <div className="relative">
 <span className="absolute left-8 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">$</span>
 <input
 type="number"
 value={customerReferrerReward}
 onChange={(e) => setCustomerReferrerReward(parseInt(e.target.value))}
 className="w-full pl-14 pr-8 py-6 bg-white border border-slate-100 rounded-[32px] text-2xl font-black text-slate-900 outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
 />
 </div>
 <p className="text-[11px] font-bold text-slate-400 px-2">Reward for existing customers who invite others.</p>
 </div>
 </div>

 {/* Who Use the Code */}
 <div className="space-y-8 p-10 bg-slate-900 rounded-[60px] text-white shadow-2xl">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-white/10 rounded-2xl text-emerald-400">
 <Zap className="w-5 h-5" />
 </div>
 <h4 className="text-lg font-black">Who Use the Code</h4>
 </div>
 <button
 onClick={() => setCustomerRefereeDiscountOn(!customerRefereeDiscountOn)}
 className={cn(
 "w-14 h-7 rounded-full p-1 transition-all duration-500 flex items-center",
 customerRefereeDiscountOn ? "bg-emerald-500 justify-end" : "bg-white/10 justify-start"
 )}
 >
 <div className="w-5 h-5 bg-white rounded-full shadow-lg" />
 </button>
 </div>

 <div className="grid grid-cols-2 gap-6">
 <div className="space-y-4">
 <label className="text-[10px] font-black text-white/30 ml-1">Discount (%)</label>
 <div className="relative">
 <input
 type="number"
 value={customerRefereeDiscountPercent}
 onChange={(e) => setCustomerRefereeDiscountPercent(parseInt(e.target.value))}
 className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[24px] text-xl font-black text-white outline-none"
 />
 <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-white/20">%</span>
 </div>
 </div>
 <div className="space-y-4">
 <label className="text-[10px] font-black text-white/30 ml-1">Validity (Days)</label>
 <input
 type="number"
 value={customerRefereeValidity}
 onChange={(e) => setCustomerRefereeValidity(parseInt(e.target.value))}
 className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[24px] text-xl font-black text-white outline-none"
 />
 </div>
 </div>
 <p className="text-[11px] font-bold text-white/30 px-2">First ride discount for newly signed-up users.</p>
 </div>
 </div>

 </div>

 {/* 2. Setup Driver Referral Earning */}
 <div className="bg-slate-900 p-12 rounded-[80px] text-white shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />

 <div className="flex items-center justify-between relative z-10 mb-12">
 <div className="flex items-center gap-6">
 <div className="p-5 bg-white/10 rounded-[32px] text-indigo-400">
 <Truck className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-2xl font-black tracking-tight">Setup Driver Referral Earning</h3>
 <p className="text-[10px] font-black text-indigo-400/50 tracking-[0.2em] mt-1">Partner Network Expansion</p>
 </div>
 </div>
 <button
 onClick={() => setDriverReferralOn(!driverReferralOn)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 driverReferralOn ? "bg-indigo-500 justify-end" : "bg-white/10 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
 {/* Who Share the Code */}
 <div className="space-y-8 p-10 bg-white/5 border border-white/10 rounded-[60px]">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
 <Users className="w-5 h-5" />
 </div>
 <h4 className="text-lg font-black">Who Share the Code</h4>
 </div>
 <div className="space-y-4">
 <label className="text-[10px] font-black text-white/30 ml-1">Earnings To Each Referral ($)</label>
 <div className="relative">
 <span className="absolute left-8 top-1/2 -translate-y-1/2 text-2xl font-black text-indigo-400/50">$</span>
 <input
 type="number"
 value={driverReferrerReward}
 onChange={(e) => setDriverReferrerReward(parseInt(e.target.value))}
 className="w-full pl-14 pr-8 py-6 bg-white/5 border border-white/10 rounded-[32px] text-2xl font-black text-white outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all"
 />
 </div>
 <p className="text-[11px] font-bold text-white/20 px-2">Reward for drivers who onboard new colleagues.</p>
 </div>
 </div>

 {/* Who Use the Code */}
 <div className="space-y-8 p-10 bg-indigo-500 rounded-[60px] text-white shadow-2xl relative overflow-hidden">
 <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
 <div className="flex items-center gap-4 relative z-10">
 <div className="p-3 bg-white/20 rounded-2xl">
 <Banknote className="w-5 h-5" />
 </div>
 <h4 className="text-lg font-black">Who Use the Code</h4>
 </div>
 <div className="space-y-4 relative z-10">
 <label className="text-[10px] font-black text-white/50 ml-1">Bonus In Wallet ($)</label>
 <div className="relative">
 <span className="absolute left-8 top-1/2 -translate-y-1/2 text-2xl font-black text-white/30">$</span>
 <input
 type="number"
 value={driverRefereeBonus}
 onChange={(e) => setDriverRefereeBonus(parseInt(e.target.value))}
 className="w-full pl-14 pr-8 py-6 bg-white/10 border border-white/20 rounded-[32px] text-2xl font-black text-white outline-none focus:ring-4 focus:ring-white/10 transition-all placeholder:text-white/20"
 />
 </div>
 <p className="text-[11px] font-bold text-white/50 px-2">Instant credit for the new driver partner.</p>
 </div>
 </div>
 </div>

 </div>
 </div>
 );

 const renderShopping = () => (
 <div className="space-y-12 animate-in mt-2 fade-in slide-in-from-bottom-4 duration-700 pb-20">
 {/* 1. Marketplace Master & Store Config */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="bg-indigo-600 p-12 rounded-[80px] text-white shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48" />
 <div className="flex items-center gap-6 mb-10 relative z-10">
 <div className="p-5 bg-white/10 rounded-[32px] text-indigo-100">
 <ShoppingBag className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-2xl font-black tracking-tight">Shopping Master</h3>
 <p className="text-[10px] font-black text-indigo-200/50 tracking-[0.2em] mt-1">Marketplace Gate</p>
 </div>
 </div>

 <div className="space-y-6 relative z-10">
 <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[32px]">
 <div>
 <p className="text-sm font-bold">Shopping Service</p>
 <p className="text-[10px] text-indigo-100/30 mt-1 ">Master Switch</p>
 </div>
 <button
 onClick={() => setShoppingOn(!shoppingOn)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 shoppingOn ? "bg-emerald-500 justify-end" : "bg-white/10 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 <p className="text-[11px] font-bold text-indigo-100/40 px-2 leading-relaxed">
 Activating this enables the global eCommerce marketplace for all users and vendors.
 </p>
 </div>
 </div>

 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col lg:col-span-2">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-indigo-50 rounded-[28px] text-indigo-500">
 <Store className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Store Management</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Vendor Onboarding & Commissions</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
 <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[40px] border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer group">
 <div className="flex items-center gap-5">
 <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-indigo-500 transition-colors">
 <ShieldCheck className="w-5 h-5" />
 </div>
 <div>
 <p className="text-sm font-black text-slate-900">Auto-Approval</p>
 <p className="text-[10px] font-bold text-slate-400 tracking-tighter">Skip manual store review</p>
 </div>
 </div>
 <button
 onClick={() => setShoppingVendorAutoApproval(!shoppingVendorAutoApproval)}
 className={cn(
 "w-14 h-7 rounded-full p-1 transition-all duration-500 flex items-center",
 shoppingVendorAutoApproval ? "bg-emerald-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
 </button>
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-black text-slate-400 ml-1">Marketplace Commission (%)</label>
 <div className="relative">
 <input
 type="number"
 value={shoppingCommission}
 onChange={(e) => setShoppingCommission(parseInt(e.target.value))}
 className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-xl font-black text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
 />
 <Percent className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* 2. Inventory & Logistics Matrix */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Product & Inventory Rules */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-slate-900 rounded-[28px] text-white">
 <Boxes className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Catalog Rules</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Inventory Control</p>
 </div>
 </div>

 <div className="space-y-6">
 <div className="p-6 bg-slate-50 rounded-[32px] space-y-4">
 <p className="text-[10px] font-black text-slate-400 ">Stock Management</p>
 <div className="flex gap-2">
 {['Manual', 'Automatic'].map((mode) => (
 <button
 key={mode}
 onClick={() => setShoppingStockMode(mode)}
 className={cn(
 "flex-1 py-3 rounded-xl text-[10px] font-black transition-all",
 shoppingStockMode === mode ? "bg-slate-900 text-white" : "bg-white text-slate-400 border border-slate-100"
 )}
 >
 {mode}
 </button>
 ))}
 </div>
 </div>
 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100">
 <div>
 <p className="text-xs font-black text-slate-900">Variant Support</p>
 <p className="text-[9px] font-bold text-slate-400">Size, Color, etc.</p>
 </div>
 <div className="w-10 h-5 rounded-full bg-emerald-500 p-0.5 flex flex-row-reverse items-center">
 <div className="w-4 h-4 bg-white rounded-full" />
 </div>
 </div>
 </div>
 </div>

 {/* Logistics & Timing SLAs */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col lg:col-span-2">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-sky-50 rounded-[28px] text-sky-500">
 <Truck className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Logistics SLAs</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Delivery Pricing & Timing</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-slate-400 ml-1">Delivery Charge Logic</label>
 <select
 value={shoppingDeliveryChargeType}
 onChange={(e) => setShoppingDeliveryChargeType(e.target.value)}
 className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black text-slate-900 outline-none appearance-none cursor-pointer"
 >
 <option>Fixed delivery fee</option>
 <option>Distance-based</option>
 <option>Zone-wise pricing</option>
 </select>
 </div>
 <div className="space-y-4">
 <label className="text-[10px] font-black text-slate-400 ml-1">Prep & Packaging SLA (Mins)</label>
 <div className="relative">
 <input
 type="number"
 value={shoppingPrepTime}
 onChange={(e) => setShoppingPrepTime(parseInt(e.target.value))}
 className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-xl font-black text-slate-900 outline-none"
 />
 <Clock className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* 3. Advanced Matching & Financial Limits */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="bg-slate-900 p-12 rounded-[80px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
 <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
 <div className="space-y-8 relative z-10">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-white/10 rounded-2xl text-indigo-400">
 <Layers className="w-6 h-6" />
 </div>
 <h4 className="text-lg font-black">Delivery Matching</h4>
 </div>
 <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[32px]">
 <div>
 <p className="text-sm font-bold">Batch Delivery</p>
 <p className="text-[10px] text-white/30 ">Multiple drops per trip</p>
 </div>
 <button
 onClick={() => setShoppingBatchDelivery(!shoppingBatchDelivery)}
 className={cn(
 "w-12 h-6 rounded-full p-1 transition-all duration-500 flex items-center",
 shoppingBatchDelivery ? "bg-indigo-500 justify-end" : "bg-white/10 justify-start"
 )}
 >
 <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 </div>
 <p className="text-[10px] font-bold text-white/20 px-2 mt-8">Optimizes efficiency by allowing drivers to handle multiple nearby shopping orders.</p>
 </div>

 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col lg:col-span-2">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-emerald-50 rounded-[28px] text-emerald-500">
 <CreditCard className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Checkout Constraints</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Payment & Value Gates</p>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <p className="text-[10px] font-black text-slate-400 ">COD Support</p>
 <button
 onClick={() => setShoppingPaymentCOD(!shoppingPaymentCOD)}
 className={cn(
 "w-14 h-7 rounded-full p-1 transition-all duration-500 flex items-center",
 shoppingPaymentCOD ? "bg-emerald-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
 </button>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-8 flex-1">
 <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-4">
 <label className="text-[10px] font-black text-slate-400 ">Min Cart Value ($)</label>
 <input
 type="number"
 value={shoppingMinOrder}
 onChange={(e) => setShoppingMinOrder(parseInt(e.target.value))}
 className="w-full px-8 py-5 bg-white border border-slate-100 rounded-[32px] text-2xl font-black text-slate-900 outline-none"
 />
 </div>
 <div className="p-8 bg-emerald-50 rounded-[40px] border border-emerald-100 flex items-center justify-between">
 <div>
 <p className="text-[10px] font-black text-emerald-600 ">Incentive Gate</p>
 <p className="text-sm font-bold text-slate-900 mt-1">Free delivery above $100</p>
 </div>
 <div className="p-4 bg-white rounded-2xl text-emerald-500 shadow-sm">
 <Trophy className="w-6 h-6" />
 </div>
 </div>
 </div>
 </div>
 </div>

 </div>
 );

 const renderFoodDelivery = () => (
 <div className="space-y-12 animate-in mt-2 fade-in slide-in-from-bottom-4 duration-700 pb-20">
 {/* 1. Food Delivery Feature & Vendor Config */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="bg-orange-600 p-12 rounded-[80px] text-white shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48" />
 <div className="flex items-center gap-6 mb-10 relative z-10">
 <div className="p-5 bg-white/10 rounded-[32px] text-orange-100">
 <Utensils className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-2xl font-black tracking-tight">Food Master</h3>
 <p className="text-[10px] font-black text-orange-200/50 tracking-[0.2em] mt-1">Culinary Ops Gate</p>
 </div>
 </div>

 <div className="space-y-6 relative z-10">
 <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[32px]">
 <div>
 <p className="text-sm font-bold">Food Service</p>
 <p className="text-[10px] text-orange-100/30 mt-1 ">Master Switch</p>
 </div>
 <button
 onClick={() => setFoodDeliveryOn(!foodDeliveryOn)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 foodDeliveryOn ? "bg-emerald-500 justify-end" : "bg-white/10 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 <p className="text-[11px] font-bold text-orange-100/40 px-2 leading-relaxed">
 Activating this enables the entire food delivery ecosystem for customers and restaurants.
 </p>
 </div>
 </div>

 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col lg:col-span-2">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-orange-50 rounded-[28px] text-orange-500">
 <ChefHat className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Vendor Configuration</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Restaurant Onboarding & Fees</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
 <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[40px] border border-slate-100 hover:border-orange-200 transition-colors cursor-pointer group">
 <div className="flex items-center gap-5">
 <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-orange-500 transition-colors">
 <ShieldCheck className="w-5 h-5" />
 </div>
 <div>
 <p className="text-sm font-black text-slate-900">Auto-Approval</p>
 <p className="text-[10px] font-bold text-slate-400 tracking-tighter">Manual review skip</p>
 </div>
 </div>
 <button
 onClick={() => setVendorAutoApproval(!vendorAutoApproval)}
 className={cn(
 "w-14 h-7 rounded-full p-1 transition-all duration-500 flex items-center",
 vendorAutoApproval ? "bg-emerald-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
 </button>
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-black text-slate-400 ml-1">Default Commission (%)</label>
 <div className="relative">
 <input
 type="number"
 value={foodCommission}
 onChange={(e) => setFoodCommission(parseInt(e.target.value))}
 className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-xl font-black text-slate-900 outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
 />
 <Percent className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* 2. Logistics & Prep Hub */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col lg:col-span-2">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-sky-50 rounded-[28px] text-sky-500">
 <Bike className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Logistics & Prep Hub</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Delivery Charges & SLAs</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-2">
 <label className="text-[10px] font-black text-slate-400 ml-1">Delivery Charge Logic</label>
 <select
 value={foodDeliveryChargeType}
 onChange={(e) => setFoodDeliveryChargeType(e.target.value)}
 className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black text-slate-900 outline-none appearance-none cursor-pointer"
 >
 <option>Fixed delivery fee</option>
 <option>Distance-based</option>
 <option>Zone-based pricing</option>
 <option>Surge delivery fee</option>
 </select>
 </div>
 <div className="space-y-4">
 <label className="text-[10px] font-black text-slate-400 ml-1">Mean Prep Time (Mins)</label>
 <div className="relative">
 <input
 type="number"
 value={foodDefaultPrepTime}
 onChange={(e) => setFoodDefaultPrepTime(parseInt(e.target.value))}
 className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] text-xl font-black text-slate-900 outline-none"
 />
 <Clock className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
 </div>
 </div>
 </div>
 </div>

 <div className="bg-slate-900 p-10 rounded-[60px] text-white shadow-2xl flex flex-col justify-between">
 <div className="space-y-6">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-white/10 rounded-[28px] text-orange-400">
 <Zap className="w-6 h-6" />
 </div>
 <h4 className="text-lg font-black tracking-tight">Driver Assign Mode</h4>
 </div>
 <div className="space-y-3">
 {['Auto-assign nearest', 'Manual (Admin)', 'Priority matching'].map((mode) => (
 <button
 key={mode}
 onClick={() => setFoodAssignmentMode(mode)}
 className={cn(
 "w-full px-6 py-4 rounded-2xl text-xs font-bold transition-all text-left flex items-center justify-between",
 foodAssignmentMode === mode
 ? "bg-orange-500 text-white shadow-lg"
 : "bg-white/5 text-white/40 hover:bg-white/10"
 )}
 >
 {mode}
 {foodAssignmentMode === mode && <CheckCircle2 className="w-4 h-4" />}
 </button>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* 3. Operational Constraints & Payments */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-emerald-50 rounded-[28px] text-emerald-500">
 <CreditCard className="w-6 h-6" />
 </div>
 <h3 className="text-xl font-black text-slate-900">Payment Rules</h3>
 </div>
 <div className="space-y-4">
 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px]">
 <p className="text-sm font-bold">Cash on Delivery</p>
 <button
 onClick={() => setFoodPaymentCOD(!foodPaymentCOD)}
 className={cn(
 "w-12 h-6 rounded-full p-1 transition-all duration-500 flex items-center",
 foodPaymentCOD ? "bg-emerald-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-4 h-4 bg-white rounded-full" />
 </button>
 </div>
 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] opacity-50">
 <p className="text-sm font-bold">In-App Wallet</p>
 <div className="w-12 h-6 rounded-full p-1 bg-emerald-500 flex flex-row-reverse items-center">
 <div className="w-4 h-4 bg-white rounded-full" />
 </div>
 </div>
 </div>
 </div>

 <div className="bg-slate-50 p-10 rounded-[60px] border border-slate-200/50 lg:col-span-2 space-y-8">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-white rounded-[28px] text-slate-400 shadow-sm">
 <Scale className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Financial Constraints</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Order Limits & Thresholds</p>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-8">
 <div className="space-y-4">
 <label className="text-[10px] font-black text-slate-400 ml-1">Min Order Amount ($)</label>
 <input
 type="number"
 value={foodMinOrderValue}
 onChange={(e) => setFoodMinOrderValue(parseInt(e.target.value))}
 className="w-full px-8 py-5 bg-white border border-slate-100 rounded-[32px] text-xl font-black text-slate-900 outline-none"
 />
 </div>
 <div className="p-8 bg-white rounded-[40px] border border-slate-100 flex items-center justify-between">
 <div>
 <p className="text-[10px] font-black text-slate-400 ">Free Delivery</p>
 <p className="text-sm font-bold text-slate-900 mt-1">Available above $50</p>
 </div>
 <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-500">
 <Gift className="w-6 h-6" />
 </div>
 </div>
 </div>
 </div>
 </div>

 </div>
 );

 const renderChatting = () => (
 <div className="space-y-12 animate-in mt-2 fade-in slide-in-from-bottom-4 duration-700 pb-20">
 {/* 1. Master Communication Control */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="bg-slate-900 p-12 rounded-[80px] text-white shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-48 -mt-48" />
 <div className="flex items-center gap-6 mb-10 relative z-10">
 <div className="p-5 bg-white/10 rounded-[32px] text-sky-400">
 <MessageSquare className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-2xl font-black tracking-tight">Messaging Master</h3>
 <p className="text-[10px] font-black text-sky-400/50 tracking-[0.2em] mt-1">Global Comms Gate</p>
 </div>
 </div>

 <div className="space-y-6 relative z-10">
 <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[32px]">
 <div>
 <p className="text-sm font-bold">Chatting Feature</p>
 <p className="text-[10px] text-white/30 mt-1 ">Master Switch</p>
 </div>
 <button
 onClick={() => setChattingFeatureOn(!chattingFeatureOn)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 chattingFeatureOn ? "bg-sky-500 justify-end" : "bg-white/10 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>
 <p className="text-[11px] font-bold text-white/40 px-2 leading-relaxed">
 Activating this enables real-time messaging across the platform for all supported roles.
 </p>
 </div>
 </div>

 {/* 2. Communication Matrix (Who Can Chat) */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col lg:col-span-2">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-slate-50 rounded-[28px] text-slate-900">
 <Users className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Communication Matrix</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Inter-Role Messaging Perms</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
 <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[40px] border border-slate-100 hover:border-sky-200 transition-colors cursor-pointer group">
 <div className="flex items-center gap-5">
 <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-sky-500 transition-colors">
 <ArrowLeftRight className="w-5 h-5" />
 </div>
 <div>
 <p className="text-sm font-black text-slate-900">Customer ↔ Driver</p>
 <p className="text-[10px] font-bold text-slate-400 ">Trip Coordination</p>
 </div>
 </div>
 <button
 onClick={() => setCanChatCustomerDriver(!canChatCustomerDriver)}
 className={cn(
 "w-14 h-7 rounded-full p-1 transition-all duration-500 flex items-center",
 canChatCustomerDriver ? "bg-emerald-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
 </button>
 </div>

 <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[40px] border border-slate-100 hover:border-sky-200 transition-colors cursor-pointer group">
 <div className="flex items-center gap-5">
 <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-indigo-500 transition-colors">
 <ShieldCheck className="w-5 h-5" />
 </div>
 <div>
 <p className="text-sm font-black text-slate-900">Admin Support</p>
 <p className="text-[10px] font-bold text-slate-400 ">Conflict Resolution</p>
 </div>
 </div>
 <button
 onClick={() => setCanChatAdminSupport(!canChatAdminSupport)}
 className={cn(
 "w-14 h-7 rounded-full p-1 transition-all duration-500 flex items-center",
 canChatAdminSupport ? "bg-indigo-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* 3. Availability Timing & Media Config */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Chat Availability Timing */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 flex flex-col lg:col-span-2">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-orange-50 rounded-[28px] text-orange-500">
 <Clock3 className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Chat Timing</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Lifecycle Boundaries</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {[
 { label: 'Before Trip', desc: 'Pre-dispatch queries', state: chatTimingBefore, setter: setChatTimingBefore },
 { label: 'During Trip', desc: 'Live coordination', state: chatTimingDuring, setter: setChatTimingDuring },
 { label: 'After Trip', desc: 'Post-completion window', state: chatTimingAfter, setter: setChatTimingAfter }
 ].map((item, i) => (
 <div key={i} className="p-6 bg-slate-50 rounded-[40px] border border-slate-100 space-y-4">
 <div className="flex items-center justify-between">
 <p className="text-xs font-black text-slate-900 ">{item.label}</p>
 <button
 onClick={() => item.setter(!item.state)}
 className={cn(
 "w-10 h-5 rounded-full p-0.5 transition-all duration-500 flex items-center",
 item.state ? "bg-orange-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-4 h-4 bg-white rounded-full shadow-xs" />
 </button>
 </div>
 <p className="text-[10px] font-bold text-slate-400 leading-tight">{item.desc}</p>
 </div>
 ))}
 </div>

 {chatTimingAfter && (
 <div className="p-8 bg-slate-900 rounded-[40px] text-white flex items-center justify-between">
 <div className="flex items-center gap-6">
 <div className="p-4 bg-white/10 rounded-2xl text-orange-400">
 <History className="w-6 h-6" />
 </div>
 <div>
 <p className="text-sm font-black">Post-Trip Access Window</p>
 <p className="text-[10px] text-white/40 ">Minutes after completion</p>
 </div>
 </div>
 <input
 type="number"
 value={chatAfterWindowMins}
 onChange={(e) => setChatAfterWindowMins(parseInt(e.target.value))}
 className="w-24 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-black text-center text-white outline-none focus:ring-2 focus:ring-orange-500/50"
 />
 </div>
 )}
 </div>

 {/* File & Media Sharing */}
 <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-indigo-50 rounded-[28px] text-indigo-500">
 <ImageIcon className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Media Payload</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Content Config</p>
 </div>
 </div>

 <div className="space-y-4">
 {[
 { label: 'Image Sharing', icon: ImageIcon, state: mediaSharingImages, setter: setMediaSharingImages, color: 'sky' },
 { label: 'File Attachments', icon: FileText, state: mediaSharingFiles, setter: setMediaSharingFiles, color: 'indigo' },
 { label: 'Voice Messages', icon: Mic, state: mediaSharingVoice, setter: setMediaSharingVoice, color: 'emerald' }
 ].map((media, i) => (
 <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-[32px] border border-slate-100">
 <div className="flex items-center gap-4">
 <div className={cn("p-3 bg-white rounded-xl shadow-xs", media.state ? `text-${media.color}-500` : "text-slate-300")}>
 <media.icon className="w-4 h-4" />
 </div>
 <p className="text-xs font-bold text-slate-900">{media.label}</p>
 </div>
 <button
 onClick={() => media.setter(!media.state)}
 className={cn(
 "w-12 h-6 rounded-full p-1 transition-all duration-500 flex items-center",
 media.state ? `bg-${media.color}-500 justify-end` : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
 </button>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* 4. Monitoring & Safety Notifications */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 bg-rose-50 p-10 rounded-[60px] border border-rose-100 space-y-8 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
 <div className="flex items-center justify-between relative z-10">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-white rounded-[28px] text-rose-500 shadow-sm">
 <Monitor className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Communication Audit</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Safety Monitoring</p>
 </div>
 </div>
 <button
 onClick={() => setChatMonitoringOn(!chatMonitoringOn)}
 className={cn(
 "w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center",
 chatMonitoringOn ? "bg-rose-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
 </button>
 </div>

 <div className="grid grid-cols-3 gap-6 relative z-10">
 <div className="p-6 bg-white/40 backdrop-blur-md rounded-[40px] border border-white/60 text-center space-y-2">
 <ShieldAlert className="w-6 h-6 mx-auto text-rose-500" />
 <p className="text-[10px] font-black text-slate-900 ">Profanity</p>
 <p className="text-[9px] font-bold text-slate-400">Auto-block</p>
 </div>
 <div className="p-6 bg-white/40 backdrop-blur-md rounded-[40px] border border-white/60 text-center space-y-2">
 <FileSearch className="w-6 h-6 mx-auto text-amber-500" />
 <p className="text-[10px] font-black text-slate-900 ">Audit</p>
 <p className="text-[9px] font-bold text-slate-400">Oversight</p>
 </div>
 <div className="p-6 bg-white/40 backdrop-blur-md rounded-[40px] border border-white/60 text-center space-y-2">
 <History className="w-6 h-6 mx-auto text-sky-500" />
 <p className="text-[10px] font-black text-slate-900 ">Archival</p>
 <p className="text-[9px] font-bold text-slate-400">Logs</p>
 </div>
 </div>
 </div>

 <div className="bg-slate-50 p-10 rounded-[60px] border border-slate-200 space-y-8">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-white rounded-[28px] text-amber-500 shadow-sm">
 <BellRing className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Push & Alerts</h3>
 <p className="text-[10px] font-black text-slate-400 mt-1">Notification Config</p>
 </div>
 </div>

 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-black text-slate-900">Push Notifications</p>
 <p className="text-[10px] font-bold text-slate-400">Background</p>
 </div>
 <button
 onClick={() => setChatPushNotifications(!chatPushNotifications)}
 className={cn(
 "w-12 h-6 rounded-full p-1 transition-all duration-500 flex items-center",
 chatPushNotifications ? "bg-emerald-500 justify-end" : "bg-slate-200 justify-start"
 )}
 >
 <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
 </button>
 </div>
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-black text-slate-900">Audio Alerts</p>
 <p className="text-[10px] font-bold text-slate-400">Sound pings</p>
 </div>
 <button className="w-12 h-6 rounded-full p-1 bg-emerald-500 flex flex-row-reverse items-center">
 <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
 </button>
 </div>
 </div>
 </div>
 </div>

 </div>
 );

 return (
 <div className="max-w-[1700px] mx-auto space-y-10 pb-20">
 {/* Header Area */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4">
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg">
 <Shield className="w-6 h-6" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-black text-slate-400 tracking-[0.2em]">Enterprise</span>
 <div className="w-1 h-1 rounded-full bg-slate-200" />
 <span className="text-[10px] font-black text-[#0089D1] tracking-[0.2em]">Governance</span>
 </div>
 <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mt-1">Business Setup</h1>
 </div>
 </div>
 <p className="text-base font-medium text-slate-500 max-w-lg leading-relaxed">
 Precision configuration of your global multi-industry operations and platform behavior.
 </p>
 </div>

 <div className="flex items-center gap-4">
 <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-[24px] text-xs font-black hover:bg-slate-50 hover:text-slate-600 transition-all">
 <RotateCcw className="w-5 h-5" /> Reset
 </button>
 <button className="flex items-center gap-3 px-10 py-4 bg-[#0089D1] text-white rounded-[24px] text-xs font-black hover:bg-[#007AB8] transition-all shadow-xl shadow-[#0089D1]/20">
 <Save className="w-5 h-5" /> Persist Changes
 </button>
 </div>
 </div>

 {/* Dynamic Content */}
 <div className="px-1 min-h-[60vh]">
 {activeTab === 'Business Info' && renderBusinessInfo()}
 {activeTab === 'Operations' && renderOperations()}
 {activeTab === 'Driver' && renderDriver()}
 {activeTab === 'Customer' && renderCustomer()}
 {activeTab === 'Fare & Penalty' && renderFarePenalty()}
 {activeTab === 'Trips' && renderTrips()}
 {activeTab === 'Parcel' && renderParcel()}
 {activeTab === 'Mart' && renderMart()}
 {activeTab === 'Shopping' && renderShopping()}
 {activeTab === 'Food' && renderFoodDelivery()}
 {activeTab === 'Refund' && renderRefund()}
 {activeTab === 'Safety' && renderSafety()}
 {activeTab === 'Referral' && renderReferral()}
 {activeTab === 'Chatting' && renderChatting()}

 {activeTab === 'Localization' && (
 <div className="h-[60vh] bg-white rounded-[80px] border border-slate-100 flex flex-col items-center justify-center animate-in zoom-in-95 duration-700">
 <Globe className="w-40 h-40 text-slate-100 mb-8" />
 <h2 className="text-3xl font-black text-slate-900 tracking-tight">Localization Registry</h2>
 <p className="text-slate-400 mt-2">Mapping linguistic & regional constraints...</p>
 </div>
 )}
 </div>

 </div >
 );
};
