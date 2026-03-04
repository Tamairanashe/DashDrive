import { Smartphone, Send, Clock, Target, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Card, Typography, Button, Input, Select } from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;

export function Promotions() {
    const [title, setTitle] = useState('Weekend Discount');
    const [message, setMessage] = useState('Get 20% off burgers today!');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Form Side */}
            <div className="space-y-8">
                <div>
                    <Title level={2} style={{ margin: 0, fontWeight: 900, letterSpacing: '-0.02em' }}>Direct Promotions</Title>
                    <Text type="secondary" style={{ fontWeight: 500 }}>Reach your customers directly via mobile push notifications</Text>
                </div>

                <Card bordered={false} className="shadow-sm rounded-[40px]" bodyStyle={{ padding: 32 }}>
                    <div className="space-y-4 mb-8">
                        <Text type="secondary" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', paddingLeft: 4 }}>Campaign Title</Text>
                        <Input
                            size="large"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Early Bird Special"
                            style={{ borderRadius: 16, backgroundColor: '#f9fafb', border: 'none', padding: '16px 24px', fontWeight: 700 }}
                        />
                    </div>

                    <div className="space-y-4 mb-8">
                        <Text type="secondary" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', paddingLeft: 4 }}>Message Body</Text>
                        <TextArea
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="What do you want to say?"
                            style={{ borderRadius: 16, backgroundColor: '#f9fafb', border: 'none', padding: '16px 24px', fontWeight: 700, resize: 'none' }}
                        />
                        <div className="text-right">
                            <Text type="secondary" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{message.length}/160 characters</Text>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <Text type="secondary" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', paddingLeft: 4 }}>Target Audience</Text>
                            <Select
                                size="large"
                                defaultValue="All Customers"
                                style={{ width: '100%', fontWeight: 700 }}
                                className="custom-select"
                                suffixIcon={<Target size={18} className="text-gray-400" />}
                                options={[
                                    { value: 'All Customers', label: 'All Customers' },
                                    { value: 'Recent Customers', label: 'Recent Customers' },
                                    { value: 'Lapsed Customers', label: 'Lapsed Customers' },
                                    { value: 'High Spenders', label: 'High Spenders' },
                                ]}
                            />
                        </div>
                        <div className="space-y-4">
                            <Text type="secondary" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', paddingLeft: 4 }}>Schedule</Text>
                            <Select
                                size="large"
                                defaultValue="Send Immediately"
                                style={{ width: '100%', fontWeight: 700 }}
                                className="custom-select"
                                suffixIcon={<Clock size={18} className="text-gray-400" />}
                                options={[
                                    { value: 'Send Immediately', label: 'Send Immediately' },
                                    { value: 'Schedule for later', label: 'Schedule for later' },
                                ]}
                            />
                        </div>
                    </div>

                    <Button type="primary" block size="large" icon={<Send size={18} />} style={{ backgroundColor: '#18181b', borderRadius: 24, height: 56, fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }} className="shadow-xl shadow-zinc-200">
                        Launch Promotion
                    </Button>
                </Card>

                <div className="bg-emerald-50 rounded-[32px] p-6 border border-emerald-100/50 flex items-start gap-4">
                    <CheckCircle2 className="text-emerald-500 mt-1 shrink-0" size={20} />
                    <div>
                        <Text strong style={{ color: '#064e3b', display: 'block', fontSize: '12px', marginBottom: 4 }}>Pro Tip: Timing is everything</Text>
                        <Text style={{ color: '#047857', fontSize: '10px', fontWeight: 500, lineHeight: 1.5 }}>Send dinner promotions between 4:00 PM and 5:30 PM for maximum conversion.</Text>
                    </div>
                </div>
            </div>

            {/* Preview Side */}
            <div className="space-y-8 lg:mt-24">
                <div className="flex flex-col items-center">
                    <div className="relative w-[300px] h-[600px] bg-zinc-900 rounded-[50px] border-[8px] border-zinc-800 shadow-2xl p-4">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-2xl z-20" />

                        {/* Status Bar */}
                        <div className="flex justify-between px-4 mt-2">
                            <span className="text-[10px] text-white font-black">9:41</span>
                            <div className="flex gap-1">
                                <div className="size-2 bg-white rounded-full opacity-50" />
                                <div className="size-2 bg-white rounded-full opacity-50" />
                            </div>
                        </div>

                        {/* Notification Preview */}
                        <div className="mt-8 space-y-4">
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl animate-in zoom-in-95 duration-500 shadow-2xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="size-5 bg-blue-600 rounded flex items-center justify-center">
                                        <Smartphone size={10} className="text-white" />
                                    </div>
                                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">DashDrive Mart</span>
                                    <span className="text-[10px] text-white/30 ml-auto font-black">now</span>
                                </div>
                                <h5 className="text-xs font-black text-white mb-0.5">{title || 'Message Title'}</h5>
                                <p className="text-[11px] text-white/70 font-medium leading-relaxed">{message || 'Your promotion message will appear here...'}</p>
                            </div>
                        </div>

                        {/* App Icon Grid Placeholder */}
                        <div className="grid grid-cols-4 gap-4 px-2 mt-auto mb-8 opacity-20 absolute bottom-4 w-full left-0">
                            {[...Array(16)].map((_, i) => (
                                <div key={i} className="aspect-square bg-white/20 rounded-xl" />
                            ))}
                        </div>
                    </div>
                    <Text type="secondary" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 24, display: 'block' }}>Real-time Push Preview</Text>
                </div>
            </div>
        </div>
    );
}
