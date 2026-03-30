import { useState } from 'react';
import { Typography, Button, ConfigProvider } from 'antd';
import { Leaf, Mail } from 'lucide-react';

const { Title } = Typography;

interface EmailVerificationProps {
    email?: string;
    onVerified: () => void;
}

export function EmailVerification({ email = "merchant@email.com", onVerified }: EmailVerificationProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isResent, setIsResent] = useState(false);

    const handleResend = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsResent(true);
        }, 1500);
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: "'Inter', system-ui, sans-serif",
                    colorPrimary: '#000000',
                    colorInfo: '#000000',
                    borderRadius: 8,
                }
            }}
        >
            <div className="min-h-screen bg-white flex w-full font-sans">
                {/* Left Side: Imagery */}
                <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col justify-end">
                    <img
                        src="/hero-merchant.jpg"
                        alt="Merchant Store"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />

                    <div className="absolute top-8 left-10 flex items-center gap-3">
                        <div className="size-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <Leaf size={24} className="text-emerald-500" />
                        </div>
                        <span className="text-white font-black text-2xl tracking-tight">DashDrive<span className="text-emerald-400">Mart</span></span>
                    </div>
                </div>

                {/* Right Side: Verification Message */}
                <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-20 bg-white relative overflow-y-auto h-screen">
                    <div className="lg:hidden absolute top-8 left-8 flex flex-col justify-start w-full">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="size-8 bg-black rounded-lg flex items-center justify-center">
                                <Leaf size={18} className="text-emerald-400" />
                            </div>
                            <span className="text-black font-black text-lg tracking-tight">DashDrive<span className="text-emerald-500">Mart</span></span>
                        </div>
                    </div>

                    <div className="w-full max-w-[440px] mx-auto animate-in fade-in zoom-in-95 duration-500 mt-16 lg:mt-0 flex flex-col items-center text-center">
                        <div className="size-16 bg-[#f3f3f3] rounded-full flex items-center justify-center mb-8">
                            <Mail size={32} className="text-black" />
                        </div>

                        <div className="mb-10">
                            <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '36px', letterSpacing: '-0.02em', color: '#000000', marginBottom: 16 }}>
                                Verify your email
                            </Title>
                            <div className="text-[16px] text-gray-600 leading-relaxed font-medium">
                                We sent a verification link to<br />
                                <span className="text-black font-bold">{email}</span>
                            </div>
                            <div className="mt-4 text-[16px] text-gray-600 leading-relaxed">
                                Check your inbox to continue organizing your new DashDrive Mart store.
                            </div>
                        </div>

                        <Button
                            type="default"
                            block
                            size="large"
                            onClick={handleResend}
                            loading={isLoading}
                            style={{
                                height: '56px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 600,
                                marginBottom: 24
                            }}
                            className="border-gray-300 hover:!border-black hover:!text-black transition-colors"
                        >
                            {isResent ? 'Email Resent' : 'Resend Email'}
                        </Button>

                        <div className="mt-12 p-6 bg-gray-50 rounded-xl w-full border border-gray-100 text-left">
                            <p className="text-sm text-gray-500 font-medium mb-2 uppercase tracking-wider text-xs">For Demo Purposes Only</p>
                            <Button
                                type="primary"
                                block
                                size="large"
                                onClick={onVerified}
                                style={{
                                    backgroundColor: '#06C167',
                                    height: '48px',
                                    borderRadius: '8px',
                                    fontSize: '15px',
                                    fontWeight: 600
                                }}
                                className="hover:!bg-[#05a055] transition-colors border-none"
                            >
                                Simulate Verification Success
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
}
