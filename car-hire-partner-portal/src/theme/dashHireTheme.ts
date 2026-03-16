import { theme, type ThemeConfig } from 'antd';

export const dashHireTheme: ThemeConfig = {
  token: {
    colorPrimary: '#0066ff', // Premium Royal Blue
    borderRadius: 14,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    colorBgLayout: '#f8faff',
    colorBgContainer: '#ffffff',
  },
  algorithm: theme.defaultAlgorithm,
  components: {
    Layout: {
      headerBg: 'rgba(255, 255, 255, 0.75)', // For glass header
      siderBg: '#001529', // Dark Sider for contrast
    },
    Menu: {
      itemBorderRadius: 10,
      itemSelectedBg: 'rgba(0, 102, 255, 0.1)',
      itemSelectedColor: '#0066ff',
    },
    Card: {
      borderRadiusLG: 20,
      boxShadowTertiary: '0 10px 30px rgba(0, 0, 0, 0.05)',
    },
    Button: {
      borderRadius: 10,
      fontWeight: 600,
      controlHeight: 40,
    },
    Table: {
      borderRadius: 16,
      headerBg: '#fafbfc',
    },
    Tag: {
      borderRadiusSM: 6,
    }
  },
};
