import { Card, Typography, Steps, Button, Tag, Divider } from 'antd';
import { MapPin, Navigation, Phone, MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react';

const { Title, Text } = Typography;

export function DirectTracking() {
    return (
        <div className="max-w-5xl mx-auto flex flex-col xl:flex-row gap-6 h-[calc(100vh-160px)]">
            {/* Tracking Info Panel */}
            <div className="w-full xl:w-96 flex flex-col gap-6 overflow-y-auto pr-2">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Title level={4} style={{ margin: 0 }}>DEL-1201</Title>
                        <Tag color="processing" className="m-0 rounded-md font-medium border-blue-500 bg-blue-50 text-blue-600">IN TRANSIT</Tag>
                    </div>
                    <Text className="text-gray-500">Expected arrival: 14:45 PM</Text>
                </div>

                <Card className="shadow-sm border-gray-100 rounded-2xl p-2">
                    <Steps
                        direction="vertical"
                        current={2}
                        items={[
                            {
                                title: <span className="font-semibold text-gray-900">Request Accepted</span>,
                                description: '14:20 PM - Rider Michael assigned',
                            },
                            {
                                title: <span className="font-semibold text-gray-900">Picked Up</span>,
                                description: '14:32 PM - Package secured at Store A',
                            },
                            {
                                title: <span className="font-semibold text-gray-900">Heading to Dropoff</span>,
                                description: '14:33 PM - Rider is 1.2km away from Customer A',
                            },
                            {
                                title: <span className="text-gray-400">Delivered</span>,
                                description: '',
                            },
                        ]}
                        className="[&_.ant-steps-item-title]:text-sm"
                    />
                </Card>

                <Card className="shadow-sm border-gray-100 rounded-2xl">
                    <Text className="text-xs font-bold tracking-wider uppercase text-gray-500 mb-4 block">Rider details</Text>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" alt="Rider" className="size-12 rounded-full bg-gray-100 border border-gray-200" />
                            <div>
                                <Text strong className="block text-base">Michael T.</Text>
                                <div className="flex items-center gap-1 text-gray-500 font-medium text-sm">
                                    <ShieldCheck size={14} className="text-emerald-500" />
                                    4.9 Rating • 2k+ Deliveries
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button icon={<Phone size={16} />} className="flex-1 rounded-lg h-10 font-medium hover:text-emerald-600 hover:border-emerald-600">Call</Button>
                        <Button icon={<MessageSquare size={16} />} className="flex-1 rounded-lg h-10 font-medium hover:text-emerald-600 hover:border-emerald-600">Message</Button>
                    </div>
                </Card>

                <Card className="shadow-sm border-gray-100 rounded-2xl">
                    <Text className="text-xs font-bold tracking-wider uppercase text-gray-500 mb-4 block">Customer details</Text>
                    <div className="mb-4">
                        <Text strong className="block text-base">John Doe</Text>
                        <Text className="text-gray-500">+1 (555) 123-4567</Text>
                    </div>
                    <Divider className="my-3" />
                    <div>
                        <Text strong className="block mb-1">Dropoff Address</Text>
                        <Text className="text-gray-500 flex items-start gap-2">
                            <MapPin size={16} className="mt-0.5 shrink-0" />
                            456 Oak Avenue, Apt 4B, New York, NY 10001
                        </Text>
                    </div>
                </Card>
            </div>

            {/* Map Area */}
            <div className="flex-1 bg-gray-100 rounded-2xl border border-gray-200 relative overflow-hidden min-h-[400px]">
                {/* Mock Map Background */}
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'grayscale(100%) contrast(120%)'
                    }}
                />

                {/* Mock UI Overlay for Map */}
                <div className="absolute inset-0 bg-blue-50/20 mix-blend-multiply" />

                {/* Map Pins */}
                <div className="absolute top-[30%] left-[40%] flex flex-col items-center">
                    <div className="bg-black text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-lg mb-2 relative">
                        Store A
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black transform rotate-45" />
                    </div>
                    <div className="size-4 bg-black rounded-full border-2 border-white shadow-md relative z-10" />
                </div>

                <div className="absolute top-[60%] left-[65%] flex flex-col items-center">
                    <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-lg mb-2 relative">
                        Dropoff
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-500 transform rotate-45" />
                    </div>
                    <div className="size-4 bg-emerald-500 rounded-full border-2 border-white shadow-md relative z-10" />
                </div>

                {/* Simulated route line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                    <path
                        d="M 40% 30% Q 50% 35% 55% 50% T 65% 60%"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="4"
                        strokeDasharray="8 6"
                        className="opacity-70"
                    />
                </svg>

                {/* Active Rider Pin */}
                <div className="absolute top-[48%] left-[53%] flex flex-col items-center z-20 animate-bounce">
                    <div className="size-10 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-blue-500 relative">
                        <Navigation size={20} className="text-blue-500 -ml-0.5 fill-blue-500" />
                        <div className="absolute -bottom-1 -right-1 size-3 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                </div>

                {/* Floating controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button
                        icon={<ExternalLink size={16} />}
                        className="bg-white/90 backdrop-blur shadow-sm rounded-lg font-medium tracking-tight"
                    >
                        Share Tracking Link
                    </Button>
                </div>
            </div>
        </div>
    );
}
