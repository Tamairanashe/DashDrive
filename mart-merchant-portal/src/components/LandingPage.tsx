import { useState } from 'react';
import { Button, ConfigProvider, Collapse, Typography } from 'antd';
import { Leaf, ArrowRight, CheckCircle2, TrendingUp, Users, Smartphone, Globe, Package, Check, ChevronDown } from 'lucide-react';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface LandingPageProps {
    onSignIn: () => void;
    onSignUp: () => void;
}

export function LandingPage({ onSignIn, onSignUp }: LandingPageProps) {
    const faqItems = [
        {
            key: '1',
            label: <span className="text-lg font-semibold text-gray-900">How much does DashDrive cost?</span>,
            children: <p className="text-gray-600 text-base leading-relaxed">DashDrive offers flexible pricing depending on whether you use DashDrive Mart or DashDrive Direct. We charge a small commission on marketplace orders, and a flat delivery fee for direct deliveries.</p>,
        },
        {
            key: '2',
            label: <span className="text-lg font-semibold text-gray-900">What businesses can join?</span>,
            children: <p className="text-gray-600 text-base leading-relaxed">We support a wide range of businesses including restaurants, grocery stores, pharmacies, retail shops, and convenience stores. If you have products to sell, DashDrive can help you deliver them.</p>,
        },
        {
            key: '3',
            label: <span className="text-lg font-semibold text-gray-900">How do payouts work?</span>,
            children: <p className="text-gray-600 text-base leading-relaxed">Earnings are securely transferred to your connected bank account. You can choose to receive payouts on a daily or weekly schedule from your merchant dashboard.</p>,
        },
        {
            key: '4',
            label: <span className="text-lg font-semibold text-gray-900">Can I manage multiple stores?</span>,
            children: <p className="text-gray-600 text-base leading-relaxed">Yes! Our merchant portal is built to scale. You can manage multiple locations, assign different staff permissions, and view aggregated or store-specific analytics all from one account.</p>,
        },
    ];

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
            <div className="min-h-screen bg-white font-sans flex flex-col">

                {/* 1. Top Navigation Bar */}
                <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <div className="size-8 bg-black rounded-lg flex items-center justify-center">
                                <Leaf size={18} className="text-emerald-400" />
                            </div>
                            <span className="text-black font-black text-xl tracking-tight hidden sm:block">DashDrive<span className="text-emerald-500">Mart</span></span>
                        </div>

                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#products" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors">Products</a>
                            <a href="#how-it-works" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors">How it Works</a>
                            <a href="#features" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors">Features</a>
                            <a href="#faq" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors">FAQ</a>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            type="text"
                            className="font-semibold text-black hover:bg-gray-100 hidden sm:inline-flex px-4"
                            size="large"
                            onClick={onSignIn}
                        >
                            Sign In
                        </Button>
                        <Button
                            type="primary"
                            className="bg-black hover:bg-gray-800 font-semibold px-6 border-none text-white rounded-lg shadow-sm"
                            size="large"
                            onClick={onSignUp}
                        >
                            Start Selling
                        </Button>
                    </div>
                </header>

                {/* 2. Hero Section */}
                <section className="relative bg-[#f8f9fa] overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 lg:py-32 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="flex-1 z-10">
                            <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold text-black leading-[1.05] tracking-tight mb-6">
                                Grow your business with on-demand delivery
                            </h1>
                            <p className="text-xl text-gray-600 mb-10 max-w-xl leading-relaxed">
                                Sell your products on the DashDrive marketplace, or use our delivery network to fulfill orders straight from your own website.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    type="primary"
                                    size="large"
                                    className="h-14 px-8 text-lg font-semibold bg-black hover:bg-gray-800 border-none rounded-xl shadow-md w-full sm:w-auto"
                                    onClick={onSignUp}
                                >
                                    Start Selling
                                </Button>
                                <Button
                                    size="large"
                                    className="h-14 px-8 text-lg font-semibold bg-white border-2 border-black text-black hover:bg-gray-50 rounded-xl w-full sm:w-auto"
                                    onClick={onSignUp}
                                >
                                    Use DashDrive Delivery
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1 relative w-full aspect-square lg:aspect-auto min-h-[400px] lg:min-h-[600px] rounded-3xl overflow-hidden shadow-2xl z-10 hidden md:block">
                            <img
                                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80"
                                alt="Merchant Dashboard"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* Overlay UI elements to simulate dashboard */}
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl flex items-center justify-between border border-white/40">
                                <div>
                                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider block mb-1">Today's Revenue</span>
                                    <span className="text-3xl font-black text-black">$4,280.50</span>
                                </div>
                                <div className="size-16 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <TrendingUp size={28} className="text-[#06C167]" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[140%] bg-emerald-50 rounded-full blur-3xl opacity-50 -z-0"></div>
                </section>

                {/* 3. Product Options */}
                <section id="products" className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black mb-4">
                                Choose how you want to use DashDrive
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Two powerful ways to reach customers and fulfill orders.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {/* DashDrive Mart Card */}
                            <div className="bg-gray-50 rounded-[32px] p-10 lg:p-12 hover:shadow-lg transition-all border border-gray-100 flex flex-col h-full group">
                                <div className="size-16 bg-black rounded-2xl flex items-center justify-center mb-8 group-hover:scale-105 transition-transform">
                                    <Leaf size={32} className="text-emerald-400" />
                                </div>
                                <h3 className="text-3xl font-bold text-black mb-4">DashDrive Mart</h3>
                                <p className="text-lg text-gray-600 mb-10 flex-1 leading-relaxed">
                                    List your store on the DashDrive app. Let thousands of local customers discover your products and order instantly. We handle the marketplace and the delivery.
                                </p>
                                <Button
                                    className="h-14 w-full text-lg font-semibold bg-black text-white hover:bg-gray-800 border-none rounded-xl"
                                    onClick={onSignUp}
                                >
                                    Start Selling on Mart
                                </Button>
                            </div>

                            {/* DashDrive Direct Card */}
                            <div className="bg-emerald-50 rounded-[32px] p-10 lg:p-12 hover:shadow-lg transition-all border border-emerald-100 flex flex-col h-full group">
                                <div className="size-16 bg-[#06C167] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-105 transition-transform">
                                    <Package size={32} className="text-white" />
                                </div>
                                <h3 className="text-3xl font-bold text-black mb-4">DashDrive Direct</h3>
                                <p className="text-lg text-gray-600 mb-10 flex-1 leading-relaxed">
                                    Already have your own app or website? Simply plug into our API or use our portal to dispatch DashDrive riders for your own direct deliveries.
                                </p>
                                <Button
                                    className="h-14 w-full text-lg font-semibold bg-white text-black border-2 border-black hover:bg-gray-50 hover:text-black rounded-xl"
                                    onClick={onSignUp}
                                >
                                    Start Using Direct
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. How It Works */}
                <section id="how-it-works" className="py-24 px-6 bg-black text-white overflow-hidden relative">
                    <div className="max-w-7xl mx-auto relative z-10">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-16 text-center">
                            How it works
                        </h2>

                        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
                            {/* Marketplace Flow */}
                            <div>
                                <h3 className="text-2xl font-bold mb-8 text-emerald-400 border-b border-gray-800 pb-4">DashDrive Mart</h3>
                                <div className="space-y-8">
                                    <div className="flex gap-6">
                                        <div className="size-12 rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold shrink-0">1</div>
                                        <div>
                                            <h4 className="text-xl font-semibold mb-2">Sign up</h4>
                                            <p className="text-gray-400 leading-relaxed text-lg">Create your merchant account and set up your store profile in minutes.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="size-12 rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold shrink-0">2</div>
                                        <div>
                                            <h4 className="text-xl font-semibold mb-2">Add your products</h4>
                                            <p className="text-gray-400 leading-relaxed text-lg">Upload your menu or catalog, set prices, and manage inventory.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="size-12 rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold shrink-0">3</div>
                                        <div>
                                            <h4 className="text-xl font-semibold mb-2">Customers order</h4>
                                            <p className="text-gray-400 leading-relaxed text-lg">Local users find your store on the DashDrive app and place orders.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="size-12 rounded-full bg-[#06C167] text-black flex items-center justify-center text-xl font-bold shrink-0">4</div>
                                        <div>
                                            <h4 className="text-xl font-semibold mb-2 text-white">Riders deliver</h4>
                                            <p className="text-gray-400 leading-relaxed text-lg">You prep the order, and a DashDrive rider picks it up and delivers it fast.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Direct Flow */}
                            <div>
                                <h3 className="text-2xl font-bold mb-8 text-[#06C167] border-b border-gray-800 pb-4">DashDrive Direct</h3>
                                <div className="space-y-8">
                                    <div className="flex gap-6">
                                        <div className="size-12 rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold shrink-0">1</div>
                                        <div>
                                            <h4 className="text-xl font-semibold mb-2">Connect your store</h4>
                                            <p className="text-gray-400 leading-relaxed text-lg">Link your existing POS, website, or manually input requests in our portal.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="size-12 rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold shrink-0">2</div>
                                        <div>
                                            <h4 className="text-xl font-semibold mb-2">Create delivery requests</h4>
                                            <p className="text-gray-400 leading-relaxed text-lg">When a customer buys directly from you, simply ping us for a rider.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="size-12 rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold shrink-0">3</div>
                                        <div>
                                            <h4 className="text-xl font-semibold mb-2">Dashdrive dispatches</h4>
                                            <p className="text-gray-400 leading-relaxed text-lg">Our system automatically finds the closest rider to your location.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="size-12 rounded-full bg-[#06C167] text-black flex items-center justify-center text-xl font-bold shrink-0">4</div>
                                        <div>
                                            <h4 className="text-xl font-semibold mb-2 text-white">Track in real-time</h4>
                                            <p className="text-gray-400 leading-relaxed text-lg">Both you and your customer get a live tracking link for peace of mind.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Dark subtle pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
                </section>

                {/* 5. Benefits Section */}
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black mb-10">
                                    Why sell with DashDrive?
                                </h2>
                                <div className="space-y-6">
                                    {[
                                        { title: 'Reach thousands of new customers instantly' },
                                        { title: 'Real-time order management & live tracking' },
                                        { title: 'Built-in marketing tools to boost your sales' },
                                        { title: 'Access to a blazing fast delivery fleet' },
                                        { title: 'Secure, reliable payments and daily payouts' },
                                    ].map((benefit, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="size-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                                <Check size={18} className="text-[#06C167]" strokeWidth={3} />
                                            </div>
                                            <span className="text-xl font-medium text-gray-800">{benefit.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative rounded-[32px] overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80"
                                    alt="Happy Merchant"
                                    className="w-full h-auto object-cover aspect-[4/3]"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. Features Section */}
                <section id="features" className="py-24 px-6 bg-gray-50">
                    <div className="max-w-7xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black mb-4">
                            Powerful tools to run your business
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16">
                            Everything you need in one unified, world-class merchant portal.
                        </p>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { icon: <Package />, title: 'Orders Management', desc: 'Accept, prep, and dispatch orders with a single tap in real-time.' },
                                { icon: <Leaf />, title: 'Product & Inventory', desc: 'Manage your entire catalog, handle out-of-stock items, and update prices.' },
                                { icon: <TrendingUp />, title: 'Marketing Campaigns', desc: 'Run flash sales, offer coupons, and boost listings to the top of the app.' },
                                { icon: <Users />, title: 'Customer Insights', desc: 'Understand your audience, manage reviews, and build loyalty programs.' },
                                { icon: <Globe />, title: 'Sales Analytics', desc: 'Deep dive into your revenue, top-selling items, and peak hours.' },
                                { icon: <Smartphone />, title: 'Multi-Device Support', desc: 'Access your portal from a desktop, tablet, or our dedicated merchant app.' },
                            ].map((feature, i) => (
                                <div key={i} className="bg-white p-8 rounded-[24px] shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-left">
                                    <div className="size-14 bg-gray-50 rounded-xl flex items-center justify-center text-black mb-6">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 7. Merchant Testimonials */}
                <section className="py-24 px-6 bg-white border-t border-gray-100">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-10">Trusted by local businesses</h2>
                        <blockquote className="text-3xl md:text-4xl font-medium text-black leading-tight mb-8">
                            "DashDrive helped us increase our organic orders by 40% in the first month. The portal is incredibly easy for our kitchen staff to use."
                        </blockquote>
                        <div className="flex items-center justify-center gap-4">
                            <div className="size-12 bg-gray-200 rounded-full overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&q=80" alt="Burger House" className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-lg text-black">Burger House</div>
                                <div className="text-gray-500 text-sm">Downtown Location</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 8. FAQ Section */}
                <section id="faq" className="py-24 px-6 bg-gray-50">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black">
                                Frequently Asked Questions
                            </h2>
                        </div>

                        <Collapse
                            accordion
                            ghost
                            expandIconPosition="end"
                            expandIcon={({ isActive }) => <ChevronDown size={20} className={`text-gray-400 transition-transform ${isActive ? 'rotate-180' : ''}`} />}
                            items={faqItems}
                            className="text-lg bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                        />
                    </div>
                </section>

                {/* 9. Final Call-To-Action */}
                <section className="py-24 md:py-32 px-6 bg-black text-center relative overflow-hidden">
                    <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
                            Ready to grow your business?
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-400 mb-12 font-medium">
                            Join DashDrive today and reach more customers.
                        </p>
                        <Button
                            className="bg-[#06C167] text-black border-none h-16 px-10 rounded-xl text-xl font-bold hover:bg-[#05a659] transition-colors shadow-lg shadow-[#06C167]/20"
                            onClick={onSignUp}
                            icon={<ArrowRight />}
                            iconPosition="end"
                        >
                            Create Merchant Account
                        </Button>
                    </div>
                    {/* Cool background curves */}
                    <div className="absolute -top-[50%] -left-[10%] w-[50%] h-[200%] bg-emerald-600 rounded-[100%] blur-[120px] opacity-20 -z-0"></div>
                </section>

                {/* Simple Footer */}
                <footer className="bg-white border-t border-gray-200 py-12 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Leaf size={20} className="text-black" />
                            <span className="font-bold text-xl tracking-tight">DashDrive</span>
                        </div>
                        <div className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} DashDrive Technologies Inc.
                        </div>
                    </div>
                </footer>
            </div>
        </ConfigProvider>
    );
}
