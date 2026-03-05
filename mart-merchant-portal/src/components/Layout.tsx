import { Layout as AntdLayout } from 'antd';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const { Content } = AntdLayout;

interface LayoutProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout?: () => void;
}

export function Layout({ children, activeTab, setActiveTab, onLogout }: LayoutProps) {
    const titles: Record<string, { title: string; subtitle: string }> = {
        dashboard: { title: 'Dashboard Overview', subtitle: "Welcome back! Your grocery store's performance view" },
        orders: { title: 'Order Management', subtitle: 'Track and manage all grocery orders in real time.' },
        inventory: { title: 'Inventory Management', subtitle: 'Manage your stock and products.' },
        customers: { title: 'Customer Insights & Reviews', subtitle: 'Understand your audience and manage feedback.' },
        performance: { title: 'Performance Reports & Analytics', subtitle: 'Performance metrics and insights.' },
        addProduct: { title: 'Add Product', subtitle: 'Home > Add Product' },
        financials: { title: 'Financials & Payouts', subtitle: 'Track your earnings and payout schedule.' },
        stores: { title: 'Store Management', subtitle: 'Overview of all your locations and their real-time status.' },
        'store-hours': { title: 'Trading Hours', subtitle: 'Manage standard weekly operating hours for your stores.' },
        'holiday-hours': { title: 'Holiday Exceptions', subtitle: 'Set special operating hours for holidays and events.' },
        'marketing-overview': { title: 'Marketing Dashboard', subtitle: 'Track the performance of your growth campaigns.' },
        offers: { title: 'Coupons & Offers', subtitle: 'Manage your active discount codes and customer incentives.' },
        campaigns: { title: 'Marketing Campaigns', subtitle: 'Run flash sales, seasonal bundles, and limited promos.' },
        'featured-products': { title: 'Featured Products', subtitle: 'Boost your products to appear higher in search results.' },
        promotions: { title: 'Push Promotions', subtitle: 'Send direct notifications to your customer base.' },
    };

    const { title, subtitle } = titles[activeTab] || titles.dashboard;

    return (
        <AntdLayout style={{ minHeight: '100vh' }}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
            <AntdLayout>
                <Header title={title} subtitle={subtitle} />
                <Content style={{ padding: '32px', paddingBottom: '48px', overflowY: 'auto' }}>
                    {children}
                </Content>
            </AntdLayout>
        </AntdLayout>
    );
}
