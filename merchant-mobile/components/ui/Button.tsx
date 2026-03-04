import React from 'react';
import {
    TouchableOpacity,
    TouchableOpacityProps,
    StyleSheet,
    ActivityIndicator,
    View,
} from 'react-native';
import { Text } from './Text';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';
import { Radius } from '../../constants/Radius';
import { Typography } from '../../constants/Typography';

export interface ButtonProps extends TouchableOpacityProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    label: string;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

export const Button = ({
    variant = 'primary',
    size = 'md',
    label,
    loading = false,
    icon,
    iconPosition = 'left',
    style,
    disabled,
    ...props
}: ButtonProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return {
                    container: { backgroundColor: colors.primary },
                    text: { color: '#FFFFFF' },
                };
            case 'secondary':
                return {
                    container: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
                    text: { color: colors.text },
                };
            case 'outline':
                return {
                    container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary },
                    text: { color: colors.primary },
                };
            case 'ghost':
                return {
                    container: { backgroundColor: 'transparent' },
                    text: { color: colors.primary },
                };
            case 'danger':
                return {
                    container: { backgroundColor: colors.error },
                    text: { color: '#FFFFFF' },
                };
            default:
                return {
                    container: { backgroundColor: colors.primary },
                    text: { color: '#FFFFFF' },
                };
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return {
                    container: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md },
                    text: Typography.bodySmall,
                };
            case 'lg':
                return {
                    container: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xxl },
                    text: Typography.title3,
                };
            default:
                return {
                    container: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg },
                    text: Typography.buttonText,
                };
        }
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            disabled={disabled || loading}
            style={[
                styles.container,
                variantStyles.container,
                sizeStyles.container,
                (disabled || loading) && styles.disabled,
                style,
            ]}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={variantStyles.text.color} size="small" />
            ) : (
                <View style={styles.content}>
                    {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
                    <Text style={[variantStyles.text, sizeStyles.text, styles.text]}>
                        {label}
                    </Text>
                    {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: '600',
    },
    disabled: {
        opacity: 0.5,
    },
    iconLeft: {
        marginRight: Spacing.xs,
    },
    iconRight: {
        marginLeft: Spacing.xs,
    },
});
