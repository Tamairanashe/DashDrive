import { Text as DefaultText, useColorScheme, View as DefaultView } from 'react-native';
import Colors from '../constants/Colors';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme as 'light' | 'dark'];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme as 'light' | 'dark'][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Card(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'card');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'border');

  return (
    <DefaultView
      style={[{ backgroundColor, borderColor, borderWidth: 1, borderRadius: 16 }, style]}
      {...otherProps}
    />
  );
}
