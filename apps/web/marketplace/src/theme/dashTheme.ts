import { theme, type ThemeConfig } from 'antd';

export const dashTheme: ThemeConfig = {
  token: {
    colorPrimary: '#ff385c', // Airbnb Coral
    borderRadius: 12,
    fontFamily: "'Lexend', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    colorBgBase: '#ffffff',
    colorTextBase: '#222222',
    colorLink: '#222222',
  },
  algorithm: theme.defaultAlgorithm,
  components: {
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#ffffff',
      headerHeight: 80,
    },
    Button: {
      borderRadius: 8,
      controlHeight: 48,
      fontWeight: 600,
      primaryShadow: 'none',
    },
    Card: {
      borderRadiusLG: 12,
      colorBgContainer: '#ffffff',
    },
    Input: {
      borderRadius: 8,
      controlHeight: 48,
      colorBgContainer: '#ffffff',
      colorBorder: '#dddddd',
    },
    Divider: {
      marginLG: 24,
      colorSplit: '#ebebeb',
    }
  },
};
