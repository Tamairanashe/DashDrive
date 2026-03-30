import { useState } from 'react';
import { Typography, Input, Button, Form, ConfigProvider, Checkbox, message } from 'antd';
import { Utensils } from 'lucide-react';
import { api } from '../api';

const { Title, Text } = Typography;

interface FoodLoginProps {
    onLogin: () => void;
    onSwitchToSignup: () => void;
    onForgotPassword: () => void;
}

interface LoginValues {
    email: string;
    password: string;
}

interface AuthError {
    message?: string;
}

export function FoodLogin({ onLogin, onSwitchToSignup, onForgotPassword }: FoodLoginProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    const handleLogin = async (values: LoginValues) => {
        setIsLoading(true);
        try {
            const result = await api.auth.login({
                email: values.email,
                password: values.password
            });
            if (result.access_token) {
                localStorage.setItem('merchant_token', result.access_token);
                onLogin();
            }
        } catch (error: any) {
            const err = error as AuthError;
            console.error('Food login failed:', err);
            message.error(err.message || 'Login failed. Please check your credentials.');
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
                {/* Left Side: Imagery (Uber Eats Style) */}
                <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col justify-end">
                    <img
                        src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1600&q=80"
                        alt="Restaurant Food Prep"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />

                    <div className="absolute top-8 left-10 flex items-center gap-3">
                        <div className="size-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <Utensils size={24} className="text-[#06C167]" />
                        </div>
                        <span className="text-white font-black text-2xl tracking-tight">DashDrive<span className="text-[#06C167]">Food</span></span>
                    </div>

                    <div className="relative z-10 p-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <h1 className="text-[56px] font-bold text-white leading-[1.1] mb-6 tracking-tight">
                            Manage your menus <br />
                            Grow your restaurant
                        </h1>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-20 bg-white relative overflow-y-auto h-screen">
                    {/* Mobile Header */}
                    <div className="lg:hidden absolute top-8 left-8 flex flex-col justify-start w-full">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="size-8 bg-black rounded-lg flex items-center justify-center">
                                <Utensils size={18} className="text-[#06C167]" />
                            </div>
                            <span className="text-black font-black text-lg tracking-tight">DashDrive<span className="text-[#06C167]">Food</span></span>
                        </div>
                    </div>

                    <div className="w-full max-w-[440px] mx-auto animate-in fade-in zoom-in-95 duration-500 mt-16 lg:mt-0">
                        <div className="mb-10">
                            <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '32px', letterSpacing: '-0.02em', color: '#000000' }}>
                                Sign in to DashDrive Food
                            </Title>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleLogin}
                            requiredMark={false}
                            className="uber-styled-form"
                        >
                            <Form.Item
                                name="email"
                                label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Email</Text>}
                                rules={[
                                    { required: true, message: 'Email is required' },
                                    { type: 'email', message: 'Please enter a valid email' }
                                ]}
                            >
                                <Input
                                    size="large"
                                    type="email"
                                    autoFocus
                                    placeholder="restaurant@example.com"
                                    className="custom-filled-input border focus:border-[#06C167] border-transparent"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Password</Text>}
                                rules={[
                                    { required: true, message: 'Password is required' },
                                    { min: 8, message: 'Password must be at least 8 characters' }
                                ]}
                                style={{ marginBottom: '12px' }}
                            >
                                <Input.Password
                                    size="large"
                                    className="custom-filled-input border focus:border-black border-transparent"
                                />
                            </Form.Item>

                            <div className="flex items-center justify-between mb-8">
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox className="font-medium text-sm text-[#545454]">Keep me signed in</Checkbox>
                                </Form.Item>
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); onForgotPassword(); }}
                                    className="font-semibold text-[14px] text-black hover:underline decoration-1 underline-offset-4"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            <Form.Item style={{ margin: 0 }}>
                                <Form.Item shouldUpdate className="m-0">
                                    {() => (
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            block
                                            size="large"
                                            loading={isLoading}
                                            disabled={
                                                !form.isFieldsTouched(true) ||
                                                !!form.getFieldsError().filter(({ errors }) => errors.length).length
                                            }
                                            style={{
                                                backgroundColor: (
                                                    !form.isFieldsTouched(true) ||
                                                    !!form.getFieldsError().filter(({ errors }) => errors.length).length
                                                ) ? '#e5e5e5' : '#000000',
                                                color: (
                                                    !form.isFieldsTouched(true) ||
                                                    !!form.getFieldsError().filter(({ errors }) => errors.length).length
                                                ) ? '#a3a3a3' : '#ffffff',
                                                height: '56px',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                fontWeight: 600
                                            }}
                                            className="transition-colors border-none disabled:!bg-[#e5e5e5] disabled:!text-[#a3a3a3]"
                                        >
                                            {isLoading ? 'Signing in...' : 'Sign In'}
                                        </Button>
                                    )}
                                </Form.Item>
                            </Form.Item>

                            {/* Sign Up Link */}
                            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-2">
                                <Text style={{ fontSize: '15px', color: '#545454' }}>Restaurant not on DashDrive Food?</Text>
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); onSwitchToSignup(); }}
                                    className="text-black hover:bg-gray-50 flex items-center justify-center font-bold text-[16px] h-[56px] rounded-lg bg-[#f3f3f3] transition-colors"
                                >
                                    Become a Partner
                                </a>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>

            <style>{`
                /* Uber Eats Form Inputs Styling */
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
