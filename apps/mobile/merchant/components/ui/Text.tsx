import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

export interface TextProps extends RNTextProps {
    variant?: keyof typeof Typography;
    color?: keyof typeof Colors.light;
    align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    lightColor?: string;
    darkColor?: string;
}

export const Text = ({
    variant = 'bodyMedium',
    color = 'text',
    align = 'left',
    style,
    lightColor,
    darkColor,
    ...props
}: TextProps) => {
    const theme = useColorScheme() ?? 'light';

    const textColor = theme === 'light'
        ? (lightColor || Colors.light[color])
        : (darkColor || Colors.dark[color]);

    return (
        <RNText
            style={[
                Typography[variant],
                { color: textColor, textAlign: align },
                style,
            ]}
            {...props}
        />
    );
};
