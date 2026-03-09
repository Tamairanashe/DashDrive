import React, { useState } from 'react';
import { Card, Tabs, Typography } from 'antd';
import { ShoppingVendors } from '../components/ShoppingVendors';
import { ShoppingProducts } from '../components/ShoppingProducts';
import { ShoppingOrders } from '../components/ShoppingOrders';
import { ShoppingServiceRules } from '../components/ShoppingServiceRules';
import { SettingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const ShoppingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('vendors');

  const tabItems = [
    {
      key: 'vendors',
      label: 'Merchant Ecosystem',
      children: <ShoppingVendors />,
    },
    {
      key: 'catalog',
      label: 'Product Catalog',
      children: <ShoppingProducts />,
    },
    {
      key: 'orders',
      label: 'Fulfillment & Orders',
      children: <ShoppingOrders />,
    },
    {
      key: 'settings',
      label: 'Service Rules',
      children: <ShoppingServiceRules />,
    },
  ];

  return (
    <div style={{ maxWidth: 1600, margin: '0 auto', paddingBottom: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>
          Marketplace Operations
        </Title>
        <Text type="secondary" style={{ fontSize: 15 }}>
          Global management of multi-vendor shopping, product approvals, and logistics cycles.
        </Text>
      </div>

      <Card 
        bordered={false} 
        style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)' }}
        styles={{ body: { padding: 0 } }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
          tabBarStyle={{ 
            padding: '16px 24px 0 24px', 
            margin: 0, 
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0'
          }}
          className="ant-tabs-custom"
        />
      </Card>

      <style>{`
        .ant-tabs-custom .ant-tabs-nav::before {
            border-bottom: none !important;
        }
        .ant-tabs-custom .ant-tabs-tab {
            margin-right: 32px !important;
            padding: 12px 0 16px 0 !important;
        }
        .ant-tabs-custom .ant-tabs-tab-btn {
            font-weight: 600 !important;
            color: #64748b !important;
        }
        .ant-tabs-custom .ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #1677ff !important;
        }
        .ant-tabs-custom .ant-tabs-content-holder {
            padding: 24px !important;
            min-height: calc(100vh - 280px);
        }
      `}</style>
    </div>
  );
};
