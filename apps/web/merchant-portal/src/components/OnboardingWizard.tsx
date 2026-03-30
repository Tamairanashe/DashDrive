import { useState } from 'react';
import { Typography, Input, Button, Form, ConfigProvider, Select, TimePicker, App } from 'antd';
import { Leaf, Check, ArrowRight, ArrowLeft, Upload, MapPin, AlertCircle } from 'lucide-react';
import { api } from '../api';

const { Title, Text } = Typography;
const { RangePicker } = TimePicker;

interface OnboardingWizardProps {
    token: string | null;
    merchant: any;
    onComplete: () => void;
}

export function OnboardingWizard({ token, onComplete }: Omit<OnboardingWizardProps, 'merchant'>) {
    const { message } = App.useApp();
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const steps = [
        { title: 'Store Info', id: 1 },
        { title: 'Location', id: 2 },
        { title: 'Details', id: 3 },
        { title: 'Products', id: 4 },
        { title: 'Documents', id: 5 },
        { title: 'Payments', id: 6 },
        { title: 'Go Live', id: 7 },
    ];

    const [formData] = useState<any>({});

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsLoading(true);
            try {
                // Submit onboarding data to backend for admin approval
                if (token) {
                    await api.onboarding.submit(token, formData);
                    console.log('Onboarding submitted for review');
                }
                onComplete();
            } catch (error: any) {
                console.error('Onboarding failed:', error);
                message.error('Failed to submit onboarding. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
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
            <div className="min-h-screen bg-[#f3f3f3] flex flex-col font-sans">
                {/* Header Navbar */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-2">
                        <div className="size-8 bg-black rounded-lg flex items-center justify-center">
                            <Leaf size={18} className="text-emerald-400" />
                        </div>
                        <span className="text-black font-black text-lg tracking-tight">DashDrive<span className="text-emerald-500">Mart</span></span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-500">
                        Need help? <a href="#" className="text-black underline">Contact Support</a>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 py-8 sm:py-12">
                    {/* Progress indicator */}
                    <div className="flex items-center justify-between mb-12 px-2 sm:px-0">
                        {steps.map((step, index) => {
                            const isActive = index === currentStep;
                            const isPast = index < currentStep;
                            return (
                                <div key={step.id} className="flex flex-col items-center relative flex-1">
                                    <div className={`size-8 sm:size-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-colors z-10 ${isActive
                                        ? 'bg-black text-white border-black'
                                        : isPast
                                            ? 'bg-[#06C167] text-white border-[#06C167]'
                                            : 'bg-white text-gray-400 border-gray-200'
                                        }`}>
                                        {isPast ? <Check size={16} strokeWidth={3} /> : step.id}
                                    </div>
                                    <span className={`mt-2 sm:mt-3 text-[10px] sm:text-xs font-semibold text-center leading-tight transition-colors ${isActive ? 'text-black' : isPast ? 'text-[#06C167]' : 'text-gray-400'
                                        }`}>
                                        {step.title}
                                    </span>
                                    {/* Line connecting nodes */}
                                    {index < steps.length - 1 && (
                                        <div className={`absolute top-4 sm:top-5 left-[50%] right-[-50%] h-[2px] transition-colors ${isPast ? 'bg-[#06C167]' : 'bg-gray-200'
                                            }`} style={{ zIndex: 0 }} />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Form Container */}
                    <div className="bg-white rounded-2xl p-6 sm:p-12 shadow-sm border border-gray-100 flex-1 animate-in fade-in zoom-in-95 duration-500">
                        {currentStep === 0 && (
                            <div className="animate-in slide-in-from-right-8 duration-300">
                                <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '32px', letterSpacing: '-0.02em', color: '#000000', marginBottom: 8 }}>
                                    Tell us about your store
                                </Title>
                                <Text style={{ fontSize: '16px', color: '#545454', display: 'block', marginBottom: 32 }}>
                                    Basic information to display to customers.
                                </Text>

                                <Form layout="vertical" requiredMark={false} className="uber-styled-form">
                                    <Form.Item label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Store Name</Text>} rules={[{ required: true }]}>
                                        <Input size="large" placeholder="E.g. Sam's Pizza" className="custom-filled-input" />
                                    </Form.Item>

                                    <Form.Item label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Store Category</Text>} rules={[{ required: true }]}>
                                        <Select size="large" defaultValue="restaurant" className="custom-filled-select">
                                            <Select.Option value="restaurant">Restaurant</Select.Option>
                                            <Select.Option value="grocery">Grocery</Select.Option>
                                            <Select.Option value="pharmacy">Pharmacy</Select.Option>
                                            <Select.Option value="convenience">Convenience</Select.Option>
                                            <Select.Option value="retail">Retail</Select.Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Store Logo</Text>} rules={[{ required: true }]}>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                                            <div className="size-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                <Upload size={24} className="text-gray-500" />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">Click to upload image</span>
                                            <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                                        </div>
                                    </Form.Item>
                                </Form>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="animate-in slide-in-from-right-8 duration-300">
                                <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '32px', letterSpacing: '-0.02em', color: '#000000', marginBottom: 8 }}>
                                    Where is your store located?
                                </Title>
                                <Text style={{ fontSize: '16px', color: '#545454', display: 'block', marginBottom: 32 }}>
                                    Location is critical for delivery routing.
                                </Text>

                                <Form layout="vertical" requiredMark={false} className="uber-styled-form">
                                    <Form.Item label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Address</Text>} rules={[{ required: true }]}>
                                        <Input size="large" placeholder="123 Main St" className="custom-filled-input" />
                                    </Form.Item>

                                    <Form.Item label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>City</Text>} rules={[{ required: true }]}>
                                        <Input size="large" placeholder="New York" className="custom-filled-input" />
                                    </Form.Item>

                                    <div className="mt-6 mb-2">
                                        <Text style={{ fontWeight: 600, fontSize: '14px' }}>Map Preview</Text>
                                    </div>
                                    <div className="w-full h-[200px] bg-[#e5e7eb] rounded-xl flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(#9ca3af 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                                        <MapPin size={40} className="text-red-500 relative z-10 drop-shadow-md" />
                                    </div>
                                </Form>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="animate-in slide-in-from-right-8 duration-300">
                                <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '32px', letterSpacing: '-0.02em', color: '#000000', marginBottom: 8 }}>
                                    Business Details
                                </Title>
                                <Text style={{ fontSize: '16px', color: '#545454', display: 'block', marginBottom: 32 }}>
                                    Operational information for the platform.
                                </Text>

                                <Form layout="vertical" requiredMark={false} className="uber-styled-form">
                                    <Form.Item label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Contact Phone</Text>} rules={[{ required: true }]}>
                                        <Input size="large" placeholder="+1..." className="custom-filled-input" />
                                    </Form.Item>

                                    <Form.Item label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Business Hours</Text>} rules={[{ required: true }]}>
                                        <RangePicker size="large" className="custom-filled-input w-full" format="HH:mm" />
                                    </Form.Item>

                                    <Form.Item label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Tax ID (Optional)</Text>}>
                                        <Input size="large" className="custom-filled-input" />
                                    </Form.Item>
                                </Form>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="animate-in slide-in-from-right-8 duration-300">
                                <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '32px', letterSpacing: '-0.02em', color: '#000000', marginBottom: 8 }}>
                                    Add your first product
                                </Title>
                                <Text style={{ fontSize: '16px', color: '#545454', display: 'block', marginBottom: 32 }}>
                                    You can start selling immediately after finishing.
                                </Text>

                                <Form layout="vertical" requiredMark={false} className="uber-styled-form">
                                    <Form.Item label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Product Name</Text>} rules={[{ required: true }]}>
                                        <Input size="large" placeholder="E.g. Cheese Burger" className="custom-filled-input" />
                                    </Form.Item>

                                    <div className="flex flex-col sm:flex-row gap-0 sm:gap-4">
                                        <Form.Item label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Price ($)</Text>} rules={[{ required: true }]} className="flex-1">
                                            <Input size="large" placeholder="6.50" type="number" className="custom-filled-input" />
                                        </Form.Item>

                                        <Form.Item label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Stock</Text>} rules={[{ required: true }]} className="flex-1">
                                            <Input size="large" placeholder="20" type="number" className="custom-filled-input" />
                                        </Form.Item>
                                    </div>

                                    <Form.Item label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Upload Image</Text>} rules={[{ required: true }]}>
                                        <div className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors text-center sm:text-left">
                                            <div className="size-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                <Upload size={18} className="text-gray-500" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-900 block">Upload Product Image</span>
                                                <span className="text-xs text-gray-500">Max 2MB</span>
                                            </div>
                                        </div>
                                    </Form.Item>
                                </Form>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="animate-in slide-in-from-right-8 duration-300">
                                <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '32px', letterSpacing: '-0.02em', color: '#000000', marginBottom: 8 }}>
                                    Verification Documents
                                </Title>
                                <Text style={{ fontSize: '16px', color: '#545454', display: 'block', marginBottom: 32 }}>
                                    Required for legal and compliance checks.
                                </Text>

                                <div className="space-y-6">
                                    <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-black transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                                <Upload size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">Business License / Permit</h4>
                                                <p className="text-sm text-gray-500">Official registration document or trade license.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-black transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                                <Upload size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">National ID / Passport</h4>
                                                <p className="text-sm text-gray-500">Copy of owner's identification document.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 border border-amber-100 bg-amber-50/50 rounded-2xl">
                                        <div className="flex gap-3">
                                            <AlertCircle size={20} className="text-amber-600 shrink-0" />
                                            <Text style={{ fontSize: '13px', color: '#92400e' }}>
                                                Documents are securely stored and used only for business verification purposes according to our privacy policy.
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 5 && (
                            <div className="animate-in slide-in-from-right-8 duration-300">
                                <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '32px', letterSpacing: '-0.02em', color: '#000000', marginBottom: 8 }}>
                                    Set up payouts
                                </Title>
                                <Text style={{ fontSize: '16px', color: '#545454', display: 'block', marginBottom: 32 }}>
                                    Where should we send your earnings?
                                </Text>

                                <Form layout="vertical" requiredMark={false} className="uber-styled-form">
                                    <Form.Item label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Bank Name</Text>} rules={[{ required: true }]}>
                                        <Input size="large" className="custom-filled-input" />
                                    </Form.Item>

                                    <Form.Item label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Account Holder Name</Text>} rules={[{ required: true }]}>
                                        <Input size="large" className="custom-filled-input" />
                                    </Form.Item>

                                    <Form.Item label={<Text style={{ fontWeight: 600, fontSize: '14px' }}>Account Number</Text>} rules={[{ required: true }]}>
                                        <Input size="large" type="password" className="custom-filled-input" />
                                    </Form.Item>
                                </Form>
                            </div>
                        )}

                        {currentStep === 6 && (
                            <div className="animate-in slide-in-from-right-8 duration-300 flex flex-col items-center text-center py-8">
                                <div className="size-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                                    <Check size={40} className="text-[#06C167]" strokeWidth={3} />
                                </div>
                                <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '36px', letterSpacing: '-0.02em', color: '#000000', marginBottom: 12 }}>
                                    Wait for verification 🎉
                                </Title>
                                <Text style={{ fontSize: '18px', color: '#545454', display: 'block', marginBottom: 8 }}>
                                    Your store is now successfully submitted.
                                </Text>
                                <Text style={{ fontSize: '16px', color: '#545454', display: 'block' }}>
                                    Our team will verify your documents within 24-48 hours.
                                </Text>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        {currentStep !== 6 && (
                            <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
                                <Button
                                    type="text"
                                    size="large"
                                    onClick={handleBack}
                                    disabled={currentStep === 0}
                                    icon={<ArrowLeft size={18} />}
                                    style={{
                                        height: '52px',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        visibility: currentStep === 0 ? 'hidden' : 'visible'
                                    }}
                                    className="text-gray-600 hover:!bg-gray-100"
                                >
                                    Back
                                </Button>

                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={handleNext}
                                    loading={isLoading}
                                    icon={currentStep === steps.length - 1 ? <Check size={18} /> : <ArrowRight size={18} />}
                                    iconPlacement="end"
                                    style={{
                                        backgroundColor: currentStep === steps.length - 1 ? '#06C167' : '#000000',
                                        height: '52px',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        padding: '0 32px'
                                    }}
                                    className="hover:opacity-90 transition-opacity border-none shadow-md"
                                >
                                    {currentStep === steps.length - 1 ? 'Finish Registration' : 'Next'}
                                </Button>
                            </div>
                        )}

                        {currentStep === 6 && (
                            <div className="flex items-center justify-center mt-12">
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={handleNext}
                                    loading={isLoading}
                                    style={{
                                        backgroundColor: '#06C167',
                                        height: '56px',
                                        borderRadius: '8px',
                                        fontSize: '18px',
                                        fontWeight: 600,
                                        padding: '0 48px'
                                    }}
                                    className="hover:opacity-90 transition-opacity border-none shadow-lg shadow-emerald-500/20"
                                >
                                    Go to Dashboard
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .uber-styled-form .ant-form-item-label {
                    padding-bottom: 6px;
                }
                .uber-styled-form .ant-form-item {
                    margin-bottom: 24px;
                }
                .custom-filled-input {
                    background-color: #f8f8f8 !important;
                    border: 1px solid transparent !important;
                    border-radius: 8px !important;
                    height: 52px;
                    padding: 0 16px;
                    font-size: 15px;
                    transition: all 0.2s;
                }
                .custom-filled-input:focus, .custom-filled-input:hover {
                    background-color: #ffffff !important;
                    border-color: #000000 !important;
                    outline: 2px solid rgba(0,0,0,0.1);
                }
                
                .custom-filled-select .ant-select-selector {
                    background-color: #f8f8f8 !important;
                    border: 1px solid transparent !important;
                    border-radius: 8px !important;
                    height: 52px !important;
                    padding: 0 16px !important;
                    display: flex;
                    align-items: center;
                    font-size: 15px;
                    transition: all 0.2s;
                }
                .custom-filled-select:hover .ant-select-selector, .custom-filled-select.ant-select-focused .ant-select-selector {
                    background-color: #ffffff !important;
                    border-color: #000000 !important;
                }
            `}</style>
        </ConfigProvider>
    );
}
