import { useState } from 'react';
import { Typography, Input, Button, Form, ConfigProvider, Select } from 'antd';
import { Leaf } from 'lucide-react';
import { api } from '../api';

const { Title, Text } = Typography;

interface SignUpProps {
    onSignup: () => void;
    onSwitchToLogin: () => void;
}

export function SignUp({ onSignup, onSwitchToLogin }: SignUpProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    const handleSignup = async (values: any) => {
        setIsLoading(true);
        try {
            await api.auth.register({
                storeName: values.storeName,
                email: values.email,
                password: values.password,
                countryCode: values.countryCode || 'ZW',
                type: values.businessType || 'MART'
            });
            onSignup();
        } catch (error: any) {
            console.error('Signup failed:', error);
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
            <div className="font-sans w-full bg-white leading-normal selection:bg-emerald-500/30">

                {/* Hero Split Section */}
                <div className="flex flex-col lg:flex-row w-full relative z-10 bg-white">
                    {/* Left Side: Sticky Imagery */}
                    <div className="hidden lg:flex flex-1 relative flex-col justify-end lg:sticky lg:top-0 lg:h-screen overflow-hidden">
                        <img
                            src="/hero-merchant.jpg"
                            alt="Merchant"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40" />

                        <div className="absolute top-8 left-10 flex items-center gap-3">
                            <div className="size-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                <Leaf size={24} className="text-emerald-500" />
                            </div>
                            <span className="text-white font-black text-2xl tracking-tight">DashDrive<span className="text-emerald-400">Mart</span></span>
                        </div>

                        <div className="relative z-10 p-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            <h1 className="text-[56px] font-bold text-white leading-[1.1] mb-6 tracking-tight">
                                Flexible delivery <br />
                                built for the way <br />
                                you do business
                            </h1>
                            <p className="text-white/90 text-xl font-normal leading-relaxed max-w-lg mb-8">
                                Whether you're scaling up, simplifying fulfillment, or expanding your reach, our platform is designed to meet your delivery goals—today and as you grow.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Signup Form */}
                    <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-20 bg-white relative lg:min-h-screen">
                        <div className="lg:hidden absolute top-8 left-8 flex flex-col justify-start w-full">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="size-8 bg-black rounded-lg flex items-center justify-center">
                                    <Leaf size={18} className="text-emerald-400" />
                                </div>
                                <span className="text-black font-black text-lg tracking-tight">DashDrive<span className="text-emerald-500">Mart</span></span>
                            </div>
                        </div>

                        <div className="w-full max-w-[520px] mx-auto animate-in fade-in zoom-in-95 duration-500 mt-16 lg:mt-0">
                            <div className="mb-10">
                                <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '36px', letterSpacing: '-0.02em', color: '#000000' }}>Get started</Title>
                                <div className="mt-4">
                                    <a
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}
                                        className="text-black hover:underline font-medium text-[16px] underline decoration-1 underline-offset-4"
                                    >
                                        Already have an account?
                                    </a>
                                </div>
                            </div>

                            <Form form={form} layout="vertical" onFinish={handleSignup} requiredMark={false} className="uber-styled-form">
                                <Form.Item name="businessType" label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Business Type</Text>} initialValue="MART">
                                    <Select size="large" className="custom-filled-select" options={[{ value: 'MART', label: 'Retail / Mart' }, { value: 'FOOD', label: 'Restaurant / Food' }]} />
                                </Form.Item>

                                <Form.Item name="storeName" label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Store name</Text>} rules={[{ required: true, message: 'Store name is required' }]}>
                                    <Input size="large" className="custom-filled-input" />
                                </Form.Item>

                                <Form.Item name="email" label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Email</Text>} rules={[{ required: true, message: 'Email is required' }, { type: 'email', message: 'Invalid email' }]}>
                                    <Input size="large" className="custom-filled-input" />
                                </Form.Item>

                                <Form.Item name="phone" label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Mobile phone number</Text>} rules={[{ required: true, message: 'Phone is required' }]}>
                                    <div className="flex gap-2">
                                        <Form.Item name="countryCode" noStyle initialValue="ZW">
                                            <Select size="large" style={{ width: 100 }} className="custom-filled-select" options={[{ value: 'ZW', label: 'ZW' }, { value: 'KE', label: 'KE' }, { value: 'NG', label: 'NG' }]} />
                                        </Form.Item>
                                        <Input size="large" placeholder="+263" className="custom-filled-input flex-1" />
                                    </div>
                                </Form.Item>

                                <Form.Item name="password" label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Password</Text>} rules={[{ required: true, message: 'Password is required' }, { min: 8, message: 'Minimum 8 characters' }]}>
                                    <Input.Password size="large" className="custom-filled-input" />
                                </Form.Item>

                                <div className="mb-6 mt-8">
                                    <Text style={{ color: '#545454', fontSize: '13px', lineHeight: 1.5 }}>
                                        By clicking "Submit", you agree to <a href="#" className="underline text-[#545454]">DashDrive Mart Merchant Terms and Conditions</a> and acknowledge you have read the <a href="#" className="underline text-[#545454]">Privacy Notice</a>.
                                    </Text>
                                </div>

                                <Form.Item style={{ margin: 0 }}>
                                    <Button type="primary" htmlType="submit" block size="large" loading={isLoading} style={{ backgroundColor: '#000000', height: '56px', borderRadius: '8px', fontSize: '16px', fontWeight: 600 }} className="hover:!bg-[#222222] border-none">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>

                        <div className="mt-8 text-center text-gray-500 text-sm">
                            <Text style={{ color: '#545454', fontSize: '13px', lineHeight: 1.5 }}>
                                This site is protected by reCAPTCHA and the Google <a href="#" className="underline text-[#545454]">Privacy Policy</a> and <a href="#" className="underline text-[#545454]">Terms of Service</a> apply.
                            </Text>
                        </div>
                    </div>
                </div>

            </div>

            <style>{`
                /* Uber Eats Form Inputs Styling */
                .uber-styled-form .ant-form-item-label {
                    padding-bottom: 4px;
                }
                .uber-styled-form .ant-form-item {
                    margin-bottom: 20px;
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
                .custom-filled-select .ant-select-selector {
                    background-color: #f3f3f3 !important;
                    border: none !important;
                    border-radius: 8px !important;
                    height: 52px !important;
                    padding: 0 16px !important;
                    display: flex;
                    align-items: center;
                    font-size: 15px;
                }
                .custom-filled-select .ant-select-selector:hover, .custom-filled-select.ant-select-open .ant-select-selector {
                    background-color: #ebebeb !important;
                }
            `}</style>
        </ConfigProvider>
    );
}
