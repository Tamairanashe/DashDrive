import { useState } from 'react';

import { Card as AntCard, Typography as AntTypography, Form as AntForm, Input as AntInput, Button as AntButton, Radio as AntRadio, Divider as AntDivider, Alert as AntAlert } from 'antd';
import { MapPin, Box, DollarSign, Send } from 'lucide-react';

const { Title, Text } = AntTypography;

export function DirectCreateDelivery() {
    const [form] = AntForm.useForm();
    const [quote, setQuote] = useState<{ price: string; eta: string } | null>(null);
    const [isLoadingQuote, setIsLoadingQuote] = useState(false);
    const [isDispatching, setIsDispatching] = useState(false);

    const handleGetQuote = () => {
        setIsLoadingQuote(true);
        // Simulate quoting engine hit
        setTimeout(() => {
            setQuote({ price: '$6.50', eta: '12 mins' });
            setIsLoadingQuote(false);
        }, 1200);
    };

    const handleDispatch = () => {
        setIsDispatching(true);
        setTimeout(() => {
            setIsDispatching(false);
            form.resetFields();
            setQuote(null);
            // Simulate redirect to tracking
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="mb-8">
                <Title level={3} style={{ margin: 0 }}>Create Manual Delivery</Title>
                <Text className="text-gray-500 mt-1 block">Request a DashDrive rider instantly to deliver a package.</Text>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Column */}
                <div className="lg:col-span-2">
                    <AntCard className="shadow-sm border-gray-100 rounded-2xl">
                        <AntForm
                            form={form}
                            layout="vertical"
                            requiredMark={false}
                            className="[&_.ant-form-item-label_label]:font-semibold [&_.ant-form-item-label_label]:text-gray-700"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-gray-100 rounded-md"><MapPin size={16} className="text-gray-600" /></div>
                                <Text strong className="text-base uppercase tracking-wider text-gray-500">Routing</Text>
                            </div>

                            <AntForm.Item name="pickup" label="Pickup Address" rules={[{ required: true }]}>
                                <AntInput size="large" placeholder="E.g. 123 Main St, Store 2" className="rounded-lg bg-gray-50 border-gray-200" />
                            </AntForm.Item>

                            <AntForm.Item name="dropoff" label="Dropoff Address" rules={[{ required: true }]}>
                                <AntInput size="large" placeholder="E.g. 456 Oak Avenue, Apt 4B" className="rounded-lg bg-gray-50 border-gray-200" />
                            </AntForm.Item>

                            <AntDivider />

                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-gray-100 rounded-md"><Box size={16} className="text-gray-600" /></div>
                                <Text strong className="text-base uppercase tracking-wider text-gray-500">Package Details</Text>
                            </div>

                            <AntForm.Item name="size" label="Package Size" initialValue="small">
                                <AntRadio.Group className="w-full flex gap-4">
                                    <AntRadio.Button value="small" className="flex-1 text-center h-12 flex items-center justify-center rounded-lg">Small (Fits in backpack)</AntRadio.Button>
                                    <AntRadio.Button value="medium" className="flex-1 text-center h-12 flex items-center justify-center rounded-lg">Medium (Car trunk)</AntRadio.Button>
                                    <AntRadio.Button value="large" className="flex-1 text-center h-12 flex items-center justify-center rounded-lg">Large (SUV/Van)</AntRadio.Button>
                                </AntRadio.Group>
                            </AntForm.Item>

                            <div className="grid grid-cols-2 gap-4">
                                <AntForm.Item name="customerName" label="Customer Name" rules={[{ required: true }]}>
                                    <AntInput size="large" placeholder="John Doe" className="rounded-lg bg-gray-50 border-gray-200" />
                                </AntForm.Item>
                                <AntForm.Item name="customerPhone" label="Customer Phone" rules={[{ required: true }]}>
                                    <AntInput size="large" placeholder="+1 (555) 000-0000" className="rounded-lg bg-gray-50 border-gray-200" />
                                </AntForm.Item>
                            </div>

                            <AntForm.Item name="instructions" label="Dropoff Instructions (Optional)">
                                <AntInput.TextArea rows={3} placeholder="Leave at the front desk..." className="rounded-xl bg-gray-50 border-gray-200" />
                            </AntForm.Item>
                        </AntForm>
                    </AntCard>
                </div>

                {/* Quoting Column */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <AntCard className="shadow-md border-gray-100 rounded-2xl bg-gray-50/50">
                            <Title level={4} style={{ margin: '0 0 24px 0' }}>Dispatch Quote</Title>

                            {!quote ? (
                                <div className="text-center py-6">
                                    <DollarSign size={40} className="mx-auto text-gray-300 mb-4" />
                                    <Text className="text-gray-500 mb-6 block">Fill out routing details to generate a real-time price quote.</Text>
                                    <AntButton
                                        type="primary"
                                        size="large"
                                        block
                                        onClick={handleGetQuote}
                                        loading={isLoadingQuote}
                                        className="bg-black text-white hover:bg-gray-800 h-12 rounded-xl font-semibold"
                                    >
                                        Get Price Quote
                                    </AntButton>
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm mb-6">
                                        <Text className="text-gray-500 font-medium uppercase tracking-wider text-xs block mb-1">Guaranteed Price</Text>
                                        <div className="flex items-end gap-2 mb-4">
                                            <span className="text-4xl font-black text-emerald-600 tracking-tighter">{quote.price}</span>
                                        </div>

                                        <div className="flex justify-between items-center py-3 border-t border-gray-100">
                                            <Text className="text-gray-500">Estimated ETA</Text>
                                            <Text strong>{quote.eta}</Text>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <Text className="text-gray-500">Distance</Text>
                                            <Text strong>4.2 km</Text>
                                        </div>
                                    </div>

                                    <AntAlert
                                        message="Surge Pricing Active"
                                        description="Demand is high right now. Quote includes a 1.2x multiplier."
                                        type="warning"
                                        showIcon
                                        className="mb-6 rounded-xl border-amber-200 bg-amber-50"
                                    />

                                    <AntButton
                                        type="primary"
                                        size="large"
                                        block
                                        onClick={handleDispatch}
                                        loading={isDispatching}
                                        icon={<Send size={18} />}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white border-none h-14 rounded-xl font-bold text-lg shadow-emerald-500/20 shadow-lg transition-transform active:scale-95"
                                    >
                                        Request Rider Now
                                    </AntButton>
                                </div>
                            )}
                        </AntCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
