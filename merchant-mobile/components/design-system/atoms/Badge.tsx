import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'gray';

interface BadgeProps {
    label: string | number;
    variant?: BadgeVariant;
    style?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle | TextStyle[];
}

export const Badge = ({ label, variant = 'primary', style, textStyle }: BadgeProps) => {
    const colorScheme = (useColorScheme() ?? 'dark') as 'light' | 'dark';
    const themeColors = Colors[colorScheme];

    const getVariantStyles = () => {
        switch (variant) {
            case 'primary': return { bg: themeColors.primary + '20', text: themeColors.primary };
            case 'success': return { bg: '#10B98120', text: '#10B981' };
            case 'warning': return { bg: '#F59E0B20', text: '#F59E0B' };
            case 'error': return { bg: '#EF444420', text: '#EF4444' };
            case 'gray': return { bg: '#64748B20', text: '#94A3B8' };
            default: return { bg: themeColors.primary + '20', text: themeColors.primary };
        }
    };

    const colors = getVariantStyles();

    return (
        <View style={[styles.badge, { backgroundColor: colors.bg }, style]}>
            <Text style={[styles.badgeText, { color: colors.text }, textStyle]}>
                {label}
            </Text>
        </View>
    );
};

export const Tag = ({ label, variant = 'gray', style, textStyle }: BadgeProps) => {
    const colorScheme = (useColorScheme() ?? 'dark') as 'light' | 'dark';
    const themeColors = Colors[colorScheme];

    const getVariantStyles = () => {
        switch (variant) {
            case 'primary': return { bg: themeColors.primary, text: '#FFFFFF' };
            case 'success': return { bg: '#10B981', text: '#FFFFFF' };
            case 'gray': return { bg: themeColors.card, text: themeColors.text, border: themeColors.border };
            default: return { bg: themeColors.card, text: themeColors.text };
        }
    };

    const colors = getVariantStyles();

    return (
        <View style={[
            styles.tag,
            { backgroundColor: colors.bg, borderColor: (colors as any).border || 'transparent', borderWidth: (colors as any).border ? 1 : 0 },
            style
        ]}>
            <Text style={[styles.tagText, { color: colors.text }, textStyle]}>
                {label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    tagText: {
        fontSize: 13,
        fontWeight: '600',
    },
});
