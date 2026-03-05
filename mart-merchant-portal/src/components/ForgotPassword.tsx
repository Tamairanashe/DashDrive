import { useState } from 'react';
import { Typography, Input, Button, Form, ConfigProvider, notification } from 'antd';
import { Leaf, ArrowLeft, AlertCircle } from 'lucide-react';
import { api } from '../api';

const { Title, Text } = Typography;

interface ForgotPasswordProps {
    onBackToLogin: () => void;
}

export function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleReset = async (values: any) => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            await api.auth.forgotPassword(values.email);
            setIsSent(true);
        } catch (error: any) {
            console.error('Forgot password error:', error);
            // If the error contains our specific role restriction message, show it explicitly
            if (error.message?.includes('contact your Store Owner')) {
                setErrorMessage(error.message);
            } else {
                notification.error({
                    message: 'Reset Failed',
                    description: error.message || 'Something went wrong. Please try again later.',
                    placement: 'top'
                });
            }
        } finally {
            setIsLoading(false);
        }
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

                {/* Right Side: Form */}
                <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-20 bg-white relative overflow-y-auto h-screen">
                    <div className="lg:hidden absolute top-8 left-8 flex flex-col justify-start w-full">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="size-8 bg-black rounded-lg flex items-center justify-center">
                                <Leaf size={18} className="text-emerald-400" />
                            </div>
                            <span className="text-black font-black text-lg tracking-tight">DashDrive<span className="text-emerald-500">Mart</span></span>
                        </div>
                    </div>

                    <div className="w-full max-w-[440px] mx-auto animate-in fade-in zoom-in-95 duration-500 mt-16 lg:mt-0">
                        <button
                            onClick={onBackToLogin}
                            className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors"
                        >
                            <ArrowLeft size={18} />
                            <span className="font-semibold text-sm">Back to login</span>
                        </button>

                        <div className="mb-10">
                            <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '36px', letterSpacing: '-0.02em', color: '#000000' }}>
                                {isSent ? 'Check your email' : 'Reset Password'}
                            </Title>
                            <div className="mt-4 text-[16px] text-gray-600 leading-relaxed">
                                {isSent
                                    ? "We've sent a password reset link to your email address. Please check your inbox and spam folder."
                                    : "Enter the email associated with your account and we'll send you a link to reset your password."
                                }
                            </div>
                        </div>

                        {!isSent ? (
                            <Form layout="vertical" onFinish={handleReset} requiredMark={false} className="uber-styled-form">
                                {errorMessage && (
                                    <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <div className="text-sm font-medium text-red-800">
                                            {errorMessage}
                                        </div>
                                    </div>
                                )}
                                <Form.Item
                                    name="email"
                                    label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Email address</Text>}
                                    rules={[
                                        { required: true, message: 'Please enter your email' },
                                        { type: 'email', message: 'Please enter a valid email' }
                                    ]}
                                >
                                    <Input
                                        size="large"
                                        className="custom-filled-input"
                                    />
                                </Form.Item>

                                <Form.Item style={{ margin: 0, marginTop: 32 }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        block
                                        size="large"
                                        loading={isLoading}
                                        style={{
                                            backgroundColor: '#000000',
                                            height: '56px',
                                            borderRadius: '8px',
                                            fontSize: '16px',
                                            fontWeight: 600
                                        }}
                                        className="hover:!bg-[#222222] transition-colors border-none"
                                    >
                                        Send Reset Link
                                    </Button>
                                </Form.Item>
                            </Form>
                        ) : (
                            <Button
                                type="primary"
                                block
                                size="large"
                                onClick={onBackToLogin}
                                style={{
                                    backgroundColor: '#000000',
                                    height: '56px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    marginTop: 32
                                }}
                                className="hover:!bg-[#222222] transition-colors border-none"
                            >
                                Return to Login
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .uber-styled-form .ant-form-item-label {
                    padding-bottom: 4px;
                }
                .uber-styled-form .ant-form-item {
                    margin-bottom: 24px;
                }
                .custom-filled-input {
                    background-color: #f3f3f3 !important;
                    border: none !important;
                    border-radius: 8px !important;
                    height: 52px;
                    padding: 0 16px;
                    font-size: 15px;
                }
                .custom-filled-input:focus, .custom-filled-input:hover {
                    background-color: #ebebeb !important;
                }
                .custom-filled-input .ant-input {
                    background-color: transparent !important;
                }
            `}</style>
        </ConfigProvider>
    );
}
