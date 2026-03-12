import { theme, ThemeConfig } from 'antd';

export const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#10b981', // Emerald Green
    borderRadius: 8,
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f8fafc',
    colorTextHeading: '#0f172a',
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
    },
    Button: {
      borderRadius: 6,
      fontWeight: 600,
    },
  },
};

