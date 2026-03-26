import React from 'react';
import { ProviderDashboard } from '../components/ProviderPortal/ProviderDashboard';

export const ProviderPortalPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <ProviderDashboard />
    </div>
  );
};
