import { theme, type ThemeConfig } from 'antd';

export const dashTheme: ThemeConfig = {
  token: {
    colorPrimary: '#ffcc00', // Dash Premium Yellow
    borderRadius: 16,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    colorBgBase: '#000000',
    colorTextBase: '#ffffff',
  },
  algorithm: theme.darkAlgorithm,
  components: {
    Layout: {
      headerBg: '#141414',
      bodyBg: '#000000',
      headerHeight: 72,
    },
    Button: {
      borderRadius: 12,
      controlHeight: 40,
      fontWeight: 600,
    },
    Card: {
      borderRadiusLG: 24,
      colorBgContainer: '#141414',
    },
    Input: {
      borderRadius: 12,
      controlHeight: 48,
      colorBgContainer: '#262626',
      colorBorder: 'transparent',
    },
  },
};
