import React from 'react';
import { Text as RNText, StyleSheet, TextStyle, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

interface TypographyProps {
    children: React.ReactNode;
    style?: TextStyle | TextStyle[];
    color?: string;
    numberOfLines?: number;
    textAlign?: 'left' | 'center' | 'right';
}

const getBaseStyle = (colorScheme: 'light' | 'dark', color?: string, textAlign?: 'left' | 'center' | 'right'): TextStyle => ({
    color: color || Colors[colorScheme].text,
    textAlign: textAlign || 'left',
});

export const Heading = ({ children, style, color, textAlign, ...props }: TypographyProps) => {
    const colorScheme = useColorScheme() ?? 'dark';
    return (
        <RNText
            style={[getBaseStyle(colorScheme as 'light' | 'dark', color, textAlign), styles.heading, style]}
            {...props}
        >
            {children}
        </RNText>
    );
};

export const Title = ({ children, style, color, textAlign, ...props }: TypographyProps) => {
    const colorScheme = useColorScheme() ?? 'dark';
    return (
        <RNText
            style={[getBaseStyle(colorScheme as 'light' | 'dark', color, textAlign), styles.title, style]}
            {...props}
        >
            {children}
        </RNText>
    );
};

export const Subtitle = ({ children, style, color, textAlign, ...props }: TypographyProps) => {
    const colorScheme = useColorScheme() ?? 'dark';
    return (
        <RNText
            style={[getBaseStyle(colorScheme as 'light' | 'dark', color, textAlign), styles.subtitle, style]}
            {...props}
        >
            {children}
        </RNText>
    );
};

export const Body = ({ children, style, color, textAlign, ...props }: TypographyProps) => {
    const colorScheme = useColorScheme() ?? 'dark';
    return (
        <RNText
            style={[getBaseStyle(colorScheme as 'light' | 'dark', color, textAlign), styles.body, style]}
            {...props}
        >
            {children}
        </RNText>
    );
};

export const Caption = ({ children, style, color, textAlign, ...props }: TypographyProps) => {
    const colorScheme = useColorScheme() ?? 'dark';
    return (
        <RNText
            style={[getBaseStyle(colorScheme as 'light' | 'dark', color, textAlign), styles.caption, style]}
            {...props}
        >
            {children}
        </RNText>
    );
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: -0.5,
        lineHeight: 34,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        letterSpacing: -0.3,
        lineHeight: 28,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 24,
    },
    body: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 22,
    },
    caption: {
        fontSize: 13,
        fontWeight: '500',
        color: '#94A3B8', // Default muted color
        lineHeight: 18,
    },
});
