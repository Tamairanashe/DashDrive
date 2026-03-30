import { theme, ThemeConfig } from 'antd';

export const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#10b981', // Emerald Green (Success/Safe)
    colorInfo: '#0089D1',    // DashDrive Blue
    colorWarning: '#f59e0b', // Amber/Yellow (SAP Fiori Warning)
    colorError: '#ef4444',   // Red (Critical)
    colorSuccess: '#10b981',
    borderRadius: 8,
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f8fafc',
    colorTextHeading: '#0f172a',
    
    // Interaction States (Material Design inspired)
    controlOutline: 'rgba(16, 185, 129, 0.2)',
    controlOutlineWidth: 2,
  },
  components: {
    Layout: {
      headerPadding: '0 24px',
      siderBg: '#ffffff',
    },
    Menu: {
      itemSelectedBg: '#f1f5f9',
      itemSelectedColor: '#10b981',
      activeBarBorderWidth: 0,
      itemHoverBg: '#f8fafc',
    },
    Card: {
      boxShadowTertiary: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      borderRadiusLG: 12,
    },
    Button: {
      borderRadius: 6,
      fontWeight: 600,
      controlHeight: 40,
      // Transition logic is handled by Ant Design, but we can set specific color overrides for states
      colorPrimaryHover: '#059669',
      colorPrimaryActive: '#047857',
    },
    Input: {
      controlHeight: 42,
      borderRadius: 8,
      activeBorderColor: '#10b981',
      hoverBorderColor: '#10b981',
    },
    Select: {
      controlHeight: 42,
      borderRadius: 8,
    },
    Table: {
      headerBg: '#f8fafc',
      headerColor: '#64748b',
    },
  },
};

