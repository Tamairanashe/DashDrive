import { useState } from 'react';
import { Button, ConfigProvider, Form, Input } from 'antd';
import { Leaf, Lightbulb, BookOpen, Headphones, ArrowLeft, ArrowRight as ArrowRightIcon, X } from 'lucide-react';
import { CarOutlined, CoffeeOutlined, ShopOutlined } from '@ant-design/icons';

interface LandingPageProps {
    onSignIn: () => void;
    onDirectSignIn: () => void;
    onFoodSignIn: () => void;
    onSignUp: () => void;
}

export function LandingPage({ onSignIn, onDirectSignIn, onFoodSignIn, onSignUp }: LandingPageProps) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: "'Uber Move Text', 'Inter', system-ui, sans-serif",
                    colorPrimary: '#000000',
                }
            }}
        >
            <div className="min-h-screen bg-white font-sans flex flex-col">

                {/* Selection Modal Overlay */}
                {isLoginModalOpen && (
                    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">

                        {/* Click outside to close */}
                        <div className="absolute inset-0" onClick={() => setIsLoginModalOpen(false)}></div>

                        {/* Modal Card */}
                        <div className="relative z-50 w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col mx-4 animate-in zoom-in-95 duration-200">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100">
                                <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight">Select a dashboard</h2>
                                <button
                                    onClick={() => setIsLoginModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                                >
                                    <X size={24} className="text-gray-500 hover:text-black" />
                                </button>
                            </div>

                            {/* Options */}
                            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">

                                {/* DashDrive Direct */}
                                <div
                                    className="flex-1 bg-white border border-gray-200 hover:border-[#06C167] rounded-xl p-6 cursor-pointer group hover:shadow-lg transition-all duration-300"
                                    onClick={() => { setIsLoginModalOpen(false); onDirectSignIn(); }}
                                >
                                    <div className="size-12 bg-gray-50 group-hover:bg-[#06C167]/10 rounded-lg flex items-center justify-center mb-6 transition-colors">
                                        <CarOutlined style={{ fontSize: '24px' }} className="text-gray-600 group-hover:text-[#06C167] transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold text-black mb-2">DashDrive Direct</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                        Manage your own fleet and deliveries using the DashDrive enterprise API.
                                    </p>
                                    <div className="flex items-center text-[#06C167] font-semibold text-sm">
                                        <span>Go to Direct</span>
                                        <ArrowRightIcon size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                {/* DashDrive Food */}
                                <div
                                    className="flex-1 bg-white border border-gray-200 hover:border-[#06C167] rounded-xl p-6 cursor-pointer group hover:shadow-lg transition-all duration-300 flex flex-col"
                                    onClick={() => { setIsLoginModalOpen(false); onFoodSignIn(); }}
                                >
                                    <div className="size-12 bg-gray-50 group-hover:bg-[#06C167]/10 rounded-lg flex items-center justify-center mb-6 transition-colors">
                                        <CoffeeOutlined style={{ fontSize: '24px' }} className="text-gray-600 group-hover:text-[#06C167] transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold text-black mb-2">DashDrive Food</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                                        Manage your restaurant, menus, and food delivery orders.
                                    </p>
                                    <div className="flex items-center text-[#06C167] font-semibold text-sm mt-auto">
                                        <span>Go to Food Portal</span>
                                        <ArrowRightIcon size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                {/* DashDrive Mart Manager */}
                                <div
                                    className="flex-1 bg-white border border-gray-200 hover:border-[#06C167] rounded-xl p-6 cursor-pointer group hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col"
                                    onClick={() => { setIsLoginModalOpen(false); onSignIn(); }}
                                >
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-[#06C167]/10 text-[#06C167] text-xs font-bold px-2 py-1 rounded">Popular</div>
                                    </div>
                                    <div className="size-12 bg-[#06C167]/10 rounded-lg flex items-center justify-center mb-6 transition-colors">
                                        <ShopOutlined style={{ fontSize: '24px' }} className="text-[#06C167] transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold text-black mb-2">DashDrive Mart</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 mt-2 flex-1">
                                        Manage your marketplace store, orders, inventory, and promotions.
                                    </p>
                                    <div className="flex items-center text-[#06C167] font-semibold text-sm mt-auto">
                                        <span>Go to Manager</span>
                                        <ArrowRightIcon size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Bar */}
                <header className="bg-black px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <div className="size-8 bg-white rounded-lg flex items-center justify-center">
                                <Leaf size={18} className="text-black" />
                            </div>
                            <span className="text-white font-bold text-xl tracking-tight hidden sm:block">DashDrive<span className="text-[#06C167]">Mart</span></span>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <span className="text-[15px] font-medium text-white hover:text-gray-300 cursor-pointer">Why DashDrive</span>
                            <span className="text-[15px] font-medium text-white hover:text-gray-300 cursor-pointer">Solutions</span>
                            <span className="text-[15px] font-medium text-white hover:text-gray-300 cursor-pointer">Business types</span>
                            <span className="text-[15px] font-medium text-white hover:text-gray-300 cursor-pointer">Resources</span>
                            <span className="text-[15px] font-medium text-white hover:text-gray-300 cursor-pointer">Pricing</span>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            type="text"
                            className="font-medium text-white border border-white/20 hover:border-white/40 hover:!bg-white/10 hover:!text-white hidden sm:inline-flex px-6 rounded-full h-10 flex items-center transition-all"
                            onClick={() => setIsLoginModalOpen(true)}
                        >
                            Log in
                        </Button>
                        <Button
                            type="primary"
                            className="bg-white hover:!bg-gray-200 font-medium px-4 md:px-6 border-none text-black rounded-full shadow-none h-10"
                            onClick={onSignUp}
                        >
                            Get started
                        </Button>
                    </div>
                </header>

                {/* Section 1: Hero Split (Image + Signup Card) */}
                <section className="relative w-full min-h-[600px] flex flex-col lg:flex-row bg-[#111111]">
                    {/* Background Image / Left Content */}
                    <div className="flex-1 relative flex flex-col justify-center p-8 md:p-16 lg:p-24 overflow-hidden">
                        <img
                            src="/hero-merchant-bg.jpg"
                            alt="Merchant"
                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                        />
                        <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
                        <div className="relative z-10 max-w-xl">
                            <h1 className="text-5xl md:text-[64px] lg:text-[72px] font-bold text-white leading-[1.1] mb-6 tracking-tight">
                                Flexible delivery <br className="hidden md:block" /> built for the way <br className="hidden md:block" /> you do business
                            </h1>
                            <p className="text-lg md:text-xl text-white font-medium max-w-md leading-relaxed">
                                Whether you're scaling up, simplifying fulfillment, or expanding your reach, our platform is designed to meet your delivery goals—today and as you grow.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Signup Form Card */}
                    <div className="w-full lg:w-[540px] xl:w-[600px] bg-white p-8 md:p-12 lg:px-16 lg:py-16 flex flex-col justify-center shrink-0">
                        <div className="w-full mx-auto">
                            <h2 className="text-[32px] md:text-[36px] font-bold text-black mb-2 tracking-tight">Get started</h2>
                            <div className="mb-8 flex items-center gap-2">
                                <span className="text-[15px] text-gray-600">Already have an account?</span>
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); setIsLoginModalOpen(true); }}
                                    className="text-black font-bold text-[15px] hover:text-[#06C167] transition-colors underline underline-offset-4"
                                >
                                    Log in
                                </a>
                            </div>

                            <Form layout="vertical" onFinish={onSignUp} requiredMark={false} className="landing-signup-form">
                                <style>{`
                                    .landing-signup-form .ant-form-item-label { padding-bottom: 4px; }
                                    .landing-signup-form .ant-form-item { margin-bottom: 20px; }
                                    .custom-filled-input { background-color: #f3f3f3 !important; border: none !important; border-radius: 8px !important; height: 52px; padding: 0 16px; font-size: 15px; }
                                    .custom-filled-input:focus, .custom-filled-input:hover { background-color: #ebebeb !important; }
                                `}</style>

                                <Form.Item name="storeName" label={<span className="font-semibold text-[14px]">Store name</span>} rules={[{ required: true, message: '' }]}>
                                    <Input size="large" className="custom-filled-input" />
                                </Form.Item>

                                <Form.Item name="email" label={<span className="font-semibold text-[14px]">Email</span>} rules={[{ required: true, message: '' }]}>
                                    <Input size="large" className="custom-filled-input" />
                                </Form.Item>

                                <Form.Item name="phone" label={<span className="font-semibold text-[14px]">Mobile phone number</span>} rules={[{ required: true, message: '' }]}>
                                    <div className="flex gap-2">
                                        <Input disabled defaultValue="ZA" size="large" className="w-[80px] text-center shrink-0 !bg-[#ebebeb] !text-black !border-none rounded-lg h-[52px] text-[15px]" />
                                        <Input size="large" placeholder="+27" className="custom-filled-input flex-1" />
                                    </div>
                                </Form.Item>

                                <Form.Item name="password" label={<span className="font-semibold text-[14px]">Password</span>} rules={[{ required: true, message: '' }]}>
                                    <Input.Password size="large" className="custom-filled-input" />
                                </Form.Item>

                                <div className="mb-6 mt-6">
                                    <span className="text-[13px] text-[#545454] leading-relaxed block">
                                        By clicking "Submit", you agree to <a href="#" className="underline text-[#545454]">DashDrive Mart Merchant Terms and Conditions</a> and acknowledge you have read the <a href="#" className="underline text-[#545454]">Privacy Notice</a>.
                                    </span>
                                </div>

                                <Form.Item className="mb-0">
                                    <Button type="primary" htmlType="submit" block size="large" className="bg-black hover:!bg-[#222222] border-none h-[56px] rounded-lg text-base font-bold text-white shadow-none">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </section>

                {/* Section 2: Three Column Features */}
                <section className="bg-white px-6 py-20 md:py-28">
                    <div className="max-w-[1000px] mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-black leading-tight mb-20 max-w-3xl mx-auto tracking-tight">
                            From day one to peak demand—DashDrive helps you deliver with confidence
                        </h2>

                        <div className="grid md:grid-cols-3 gap-12 text-left mb-16">
                            <div>
                                <div className="text-[#06C167] mb-6">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm-1 19c0 .55.45 1 1 1s1-.45 1-1v-1h-2v1z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-black leading-snug">Make smarter decisions with global and local insights</h3>
                            </div>
                            <div>
                                <div className="text-[#06C167] mb-6">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                        <path d="M21 10.5h-4.58c.2-.66.33-1.37.33-2.12 0-3.52-2.73-3.88-4.25-3.88v2c.75 0 2.25.1 2.25 1.88 0 .82-.45 1.5-1.13 1.86l-1.63.85V11H7v9h12.55c.66 0 1.25-.4 1.5-1l2-7c.18-.63-.3-1.5-2.05-1.5zM4 11H2v9h2v-9z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-black leading-snug">Build stronger customer connections</h3>
                            </div>
                            <div>
                                <div className="text-[#06C167] mb-6">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                        <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-black leading-snug">Move faster with flexible, easy-to-integrate tools</h3>
                            </div>
                        </div>

                        <Button
                            type="primary"
                            className="bg-[#2A2A2A] hover:bg-black font-medium px-6 py-6 border-none text-white rounded-lg shadow-none text-base"
                            onClick={onSignUp}
                        >
                            Check out the DashDrive advantage
                        </Button>
                    </div>
                </section>

                {/* Section 3: Yellow Split Screen */}
                <section className="bg-[#FFDF52] py-20 md:py-0">
                    <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center">
                        <div className="flex-1 p-8 md:p-16 lg:p-20 text-left">
                            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-black leading-tight mb-6 tracking-tight">
                                Discover how businesses are delivering with DashDrive
                            </h2>
                            <p className="text-lg md:text-xl text-[#2A2A2A] mb-10 leading-relaxed max-w-md font-medium">
                                From big chains to local favorites, businesses across industries and sizes trust DashDrive to help them serve customers and scale delivery—on their own terms.
                            </p>
                            <Button
                                type="primary"
                                className="bg-black hover:bg-gray-800 font-medium px-6 py-6 border-none text-white rounded-lg shadow-none text-base"
                            >
                                Explore all success stories
                            </Button>
                        </div>
                        <div className="flex-1 w-full h-full md:p-8">
                            <div className="w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-sm">
                                <img
                                    src="https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=1000&q=80"
                                    alt="Healthy Food Delivery"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 4: Vertical Cards Segment */}
                <section className="bg-white px-6 py-20 md:py-28">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="text-center mb-16 relative">
                            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-tight">
                                Built for every kind of business
                            </h2>
                            <p className="text-xl text-[#2A2A2A] font-medium max-w-3xl mx-auto">
                                No matter what you sell or how you operate, DashDrive has solutions that make delivery work for you.
                            </p>

                            <div className="hidden md:flex absolute top-0 right-0 gap-2">
                                <Button type="default" shape="circle" icon={<ArrowLeft size={20} />} className="size-12 bg-gray-100 border-none hover:bg-gray-200 flex items-center justify-center text-black" />
                                <Button type="default" shape="circle" icon={<ArrowRightIcon size={20} />} className="size-12 bg-gray-100 border-none hover:bg-gray-200 flex items-center justify-center text-black" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { title: 'Restaurants', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80' },
                                { title: 'Grocery Stores', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80' },
                                { title: 'Retail', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80' },
                            ].map((item, i) => (
                                <div key={i} className="relative h-[450px] md:h-[550px] rounded-2xl overflow-hidden group cursor-pointer bg-black">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Gradient overlay for text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                                        <h3 className="text-2xl font-bold text-white tracking-tight">{item.title}</h3>
                                        <ArrowRightIcon className="text-white transform group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section 5: Partner Footer Block */}
                <section className="bg-[#F7F7F7] px-6 py-20 md:py-28">
                    <div className="max-w-[1000px] mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-tight leading-tight">
                            More than a platform—a <br className="hidden sm:block" /> partner
                        </h2>
                        <p className="text-lg md:text-xl text-[#545454] font-medium max-w-3xl mx-auto mb-20 leading-relaxed">
                            With delivery insights, support tools, and resources built for merchants, DashDrive helps you deliver smarter, adapt faster, and keep your business moving forward.
                        </p>

                        <div className="grid sm:grid-cols-3 gap-12 text-left">
                            <div className="flex flex-col">
                                <BookOpen size={24} className="text-black mb-6" strokeWidth={2.5} />
                                <h3 className="text-lg font-bold text-black mb-2">Resource Library</h3>
                                <a href="#" className="text-md text-black font-medium underline underline-offset-4 decoration-black/30 hover:decoration-black transition-colors">
                                    Browse tools and tips
                                </a>
                            </div>
                            <div className="flex flex-col">
                                <Headphones size={24} className="text-black mb-6" strokeWidth={2.5} />
                                <h3 className="text-lg font-bold text-black mb-2">Merchant Support</h3>
                                <a href="#" className="text-md text-black font-medium underline underline-offset-4 decoration-black/30 hover:decoration-black transition-colors">
                                    Contact our team for help
                                </a>
                            </div>
                            <div className="flex flex-col">
                                <Lightbulb size={24} className="text-black mb-6" strokeWidth={2.5} />
                                <h3 className="text-lg font-bold text-black mb-2">Insights Hub</h3>
                                <a href="#" className="text-md text-black font-medium underline underline-offset-4 decoration-black/30 hover:decoration-black transition-colors">
                                    Explore marketing strategies
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 6: Global Footer */}
                <footer className="bg-black text-white px-6 py-20 pb-24">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="flex gap-4 mb-20">
                            <Leaf size={24} className="text-[#06C167]" />
                            <span className="font-bold text-xl tracking-tight">DashDrive</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-sm">
                            <div className="flex flex-col gap-6 font-medium text-[#b3b3b3]">
                                <h3 className="text-lg font-medium text-white mb-2">Solutions</h3>
                                <a href="#" className="hover:text-white transition-colors">Marketplace</a>
                                <a href="#" className="hover:text-white transition-colors">DashDrive Direct</a>
                                <a href="#" className="hover:text-white transition-colors">Online ordering</a>
                            </div>
                            <div className="flex flex-col gap-6 font-medium text-[#b3b3b3]">
                                <h3 className="text-lg font-medium text-white mb-2">Business types</h3>
                                <a href="#" className="hover:text-white transition-colors">Restaurants</a>
                                <a href="#" className="hover:text-white transition-colors">Grocery stores</a>
                                <a href="#" className="hover:text-white transition-colors">Retail stores</a>
                            </div>
                            <div className="flex flex-col gap-6 font-medium text-[#b3b3b3]">
                                <h3 className="text-lg font-medium text-white mb-2">More options</h3>
                                <a href="#" className="hover:text-white transition-colors">Sign up to deliver</a>
                                <a href="#" className="hover:text-white transition-colors">FAQ</a>
                                <a href="#" className="hover:text-white transition-colors">Gift cards</a>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        </ConfigProvider>
    );
}
