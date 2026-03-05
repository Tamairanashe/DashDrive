import { useState, useEffect } from 'react';
import { Card, Typography, Tag, Steps, Spin, Button, Divider, Alert } from 'antd';
import { Truck, Phone, ShieldCheck, Navigation } from 'lucide-react';

const { Title, Text } = Typography;

export function PublicTracking() {
    const [trackingData, setTrackingData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // In a real app, this would parse the ID from the URL and fetch from /api/v1/deliveries/public/:id
    useEffect(() => {
        const timer = setTimeout(() => {
            setTrackingData({
                id: 'DEL-882194',
                status: 'IN_TRANSIT',
                orderNumber: 'EXT-ZW99A',
                estimatedArrival: '12 mins',
                rider: {
                    name: 'Takunda M.',
                    phone: '+263 77 123 4567',
                    vehicle: 'Honda CG125 (Black)',
                    lat: -17.8248,
                    lng: 31.0530
                },
                logs: [
                    { status: 'Order Created', time: '10:30 AM' },
                    { status: 'Rider Assigned', time: '10:35 AM' },
                    { status: 'Picked Up', time: '10:42 AM' },
                ]
            });
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
                <Spin size="large" />
                <Text className="mt-4 text-gray-500 font-medium">Fetching delivery status...</Text>
            </div>
        );
    }

    const currentStep = trackingData.status === 'DELIVERED' ? 3 :
        trackingData.status === 'IN_TRANSIT' ? 2 :
            trackingData.status === 'PICKED_UP' ? 2 : 1;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6">
            <div className="w-full max-w-xl">
                {/* Brand Header */}
                <div className="flex items-center gap-3 mb-8 justify-center">
                    <div className="size-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
                        <Truck size={20} className="text-emerald-400" />
                    </div>
                    <span className="text-black font-black text-2xl tracking-tight leading-none">DashDrive<span className="text-emerald-500">Direct</span></span>
                </div>

                <Card className="shadow-xl border-0 rounded-3xl overflow-hidden mb-6">
                    <div className="p-6 sm:p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <Text type="secondary" className="uppercase text-[10px] font-bold tracking-widest block mb-1">Live Tracking</Text>
                                <Title level={2} style={{ margin: 0 }}>{trackingData.id}</Title>
                            </div>
                            <Tag color="processing" className="m-0 rounded-full px-4 py-1 border-0 font-bold bg-emerald-100 text-emerald-700 capitalize">
                                {trackingData.status.replace('_', ' ')}
                            </Tag>
                        </div>

                        {/* Map Placeholder */}
                        <div className="aspect-video bg-gray-100 rounded-2xl mb-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 group hover:border-emerald-300 transition-colors cursor-pointer">
                            <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                <Navigation className="text-emerald-500" size={24} />
                            </div>
                            <Text className="text-gray-400 text-sm font-medium">Map view is being initialized...</Text>
                            <Text className="text-[10px] text-gray-300 mt-1 uppercase tracking-tighter">Lat: {trackingData.rider.lat}, Lng: {trackingData.rider.lng}</Text>
                        </div>

                        <div className="bg-emerald-50 rounded-2xl p-5 mb-8 flex items-center justify-between border border-emerald-100">
                            <div>
                                <Text className="text-emerald-800 text-xs font-bold uppercase block mb-0.5">Estimated Arrival</Text>
                                <Title level={3} style={{ margin: 0, color: '#064e3b' }}>{trackingData.estimatedArrival}</Title>
                            </div>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 rounded-xl h-12 px-6 font-bold shadow-md flex items-center gap-2">
                                <Phone size={18} />
                                Call Rider
                            </Button>
                        </div>

                        <Divider />

                        <div className="flex items-center gap-4 mb-8">
                            <div className="size-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden relative border border-gray-100">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(trackingData.rider.name)}&background=10b981&color=fff&bold=true`} alt="Rider" />
                            </div>
                            <div className="flex-1">
                                <Text className="block font-bold text-gray-900 text-lg leading-tight">{trackingData.rider.name}</Text>
                                <Text type="secondary" className="text-sm">{trackingData.rider.vehicle}</Text>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1 text-amber-500 font-bold justify-end mb-0.5">
                                    <span>★</span> 4.9
                                </div>
                                <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">DashPartner</Text>
                            </div>
                        </div>

                        <Steps
                            direction="vertical"
                            current={currentStep}
                            size="small"
                            className="status-steps"
                            items={[
                                { title: <span className="font-bold text-gray-900">Order Confirmed</span>, description: <Text type="secondary" className="text-xs">Merchant is preparing your package</Text> },
                                { title: <span className="font-bold text-gray-900">Rider Assigned</span>, description: <Text type="secondary" className="text-xs">Takunda M. is heading to the pickup</Text> },
                                { title: <span className="font-bold text-gray-900">In Transit</span>, description: <Text type="secondary" className="text-xs">Your delivery is on its way</Text> },
                                { title: <span className="font-bold text-gray-900">Delivered</span>, description: <Text type="secondary" className="text-xs">Package dropped off safely</Text> },
                            ]}
                        />
                    </div>
                </Card>

                <Alert
                    message={<span className="font-bold">Privacy Note</span>}
                    description="This tracking link is public. Share it only with people you trust."
                    type="info"
                    showIcon
                    icon={<ShieldCheck className="text-blue-500" />}
                    className="rounded-2xl bg-white border-blue-50 shadow-sm mb-12"
                />

                <div className="text-center opacity-40 hover:opacity-100 transition-opacity">
                    <Text className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em]">Powered by DashDrive Direct Logistics</Text>
                </div>
            </div>

            <style>{`
                .status-steps .ant-steps-item-title { line-height: 1.2 !important; margin-bottom: 2px; }
                .status-steps .ant-steps-item-process .ant-steps-icon { background: #10b981 !important; }
                .status-steps .ant-steps-item-finish .ant-steps-icon { background: #10b981 !important; color: white !important; }
                .status-steps .ant-steps-item-finish .ant-steps-item-tail::after { background-color: #10b981 !important; }
            `}</style>
        </div>
    );
}
