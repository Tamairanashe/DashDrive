import React from 'react';
import { Tabs, Typography } from 'antd';
import { MarketingOverview } from '../components/marketing/MarketingOverview';
import { Campaigns } from '../components/marketing/Campaigns';
import { Offers } from '../components/marketing/Offers';
import { FeaturedProducts } from '../components/marketing/FeaturedProducts';
import { Promotions } from '../components/marketing/Promotions';
import { MarketingPackages } from '../components/marketing/MarketingPackages';
import { AudienceTargeting } from '../components/marketing/AudienceTargeting';
import { MarketingAnalytics } from '../components/marketing/MarketingAnalytics';
import { MarketingSettings } from '../components/marketing/MarketingSettings';
import { InsurancePromotion } from '../components/marketing/InsurancePromotion';
import { SoundOutlined, AppstoreOutlined, PieChartOutlined, TeamOutlined, SettingOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { Title } = Typography;

export const MarketingPage: React.FC = () => {
    const token = "mock-token"; // Not really used in our mock API

    const items = [
        {
            key: 'overview',
            label: 'Overview',
            children: <MarketingOverview token={token} />,
        },
        {
            key: 'packages',
            label: <span><AppstoreOutlined /> Packages</span>,
            children: <MarketingPackages />,
        },
        {
            key: 'campaigns',
            label: 'Campaigns',
            children: <Campaigns token={token} />,
        },
        {
            key: 'offers',
            label: 'Coupons/Offers',
            children: <Offers token={token} />,
        },
        {
            key: 'featured',
            label: 'Featured Products',
            children: <FeaturedProducts token={token} />,
        },
        {
            key: 'promotions',
            label: 'Push Promotions',
            children: <Promotions token={token} />,
        },
        {
            key: 'audience',
            label: <span><TeamOutlined /> Audience Targeting</span>,
            children: <AudienceTargeting token={token} />,
        },
        {
            key: 'analytics',
            label: <span><PieChartOutlined /> Campaign Analytics</span>,
            children: <MarketingAnalytics token={token} />,
        },
        {
            key: 'growth',
            label: <span><ThunderboltOutlined /> Insurance Promotions</span>,
            children: <InsurancePromotion />,
        },
        {
            key: 'settings',
            label: <span><SettingOutlined /> Settings</span>,
            children: <MarketingSettings token={token} />,
        },
    ];

    return (
        <div className="p-6">
            <Title level={4} style={{ marginBottom: 24 }}>
                <SoundOutlined style={{ marginRight: 12 }} />
                Marketing Center
            </Title>
            <Tabs defaultActiveKey="overview" items={items} />
        </div>
    );
};
