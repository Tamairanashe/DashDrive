import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from './Text';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';
import { Radius } from '../../constants/Radius';

export interface BadgeProps {
    label: string;
    variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'gray';
    size?: 'sm' | 'md';
    outline?: boolean;
    style?: ViewStyle;
}

export const Badge = ({
    label,
    variant = 'primary',
    size = 'md',
    outline = false,
    style,
}: BadgeProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    const getVariantStyles = () => {
        const colorMap = {
            primary: colors.primary,
            success: colors.success,
            warning: colors.warning,
            error: colors.error,
            info: colors.info,
            gray: theme === 'light' ? '#64748B' : '#94A3B8',
        };

        const bgColor = colorMap[variant];

        if (outline) {
            return {
                container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: bgColor },
                text: { color: bgColor },
            };
        }

        return {
            container: { backgroundColor: bgColor },
            text: { color: '#FFFFFF' },
        };
    };

    const variantStyles = getVariantStyles();

    return (
        <View
            style={[
                styles.container,
                size === 'sm' ? styles.sm : styles.md,
                variantStyles.container,
                style,
            ]}
        >
            <Text
                variant={size === 'sm' ? 'bodySmall' : 'caption'}
                style={[styles.text, variantStyles.text]}
            >
                {label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
        borderRadius: Radius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sm: {
        paddingHorizontal: Spacing.xs,
        paddingVertical: 1,
    },
    md: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
    },
    text: {
        fontWeight: '700',
        textTransform: 'uppercase',
    },
});
