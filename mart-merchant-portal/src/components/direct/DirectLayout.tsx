import { Layout as AntdLayout } from 'antd';
import { DirectSidebar } from './DirectSidebar';
import { Header } from '../Header';

const { Content } = AntdLayout;

interface DirectLayoutProps {
    children?: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout?: () => void;
    merchant: any;
}

export function DirectLayout({ children, activeTab, setActiveTab, onLogout, merchant }: DirectLayoutProps) {
    const titles: Record<string, { title: string; subtitle: string }> = {
        overview: { title: 'Dispatch Overview', subtitle: "Real-time look at your active fleet and historical deliveries" },
        deliveries: { title: 'All Deliveries', subtitle: 'View constraints and history of your requested dispatches' },
        'create-delivery': { title: 'Create Delivery', subtitle: 'Manually request a DashDrive API dispatch' },
        tracking: { title: 'Live Tracking', subtitle: 'Real-time location and status of an active rider' },
        billing: { title: 'Billing & Invoices', subtitle: 'Review your total delivery costs and enterprise invoices' },
        settings: { title: 'API & Webhooks', subtitle: 'Manage your DashDrive Direct API keys and configurations' },
    };

    const { title, subtitle } = titles[activeTab] || titles.overview;

    return (
        <AntdLayout style={{ minHeight: '100vh' }}>
            <DirectSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
            <AntdLayout>
                <Header title={title} subtitle={subtitle} merchant={merchant} />
                <Content className="bg-white" style={{ padding: '32px', paddingBottom: '48px', overflowY: 'auto' }}>
                    {children ? children : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-400">DashDrive Direct {activeTab} incoming...</p>
                        </div>
                    )}
                </Content>
            </AntdLayout>
        </AntdLayout>
    );
}
