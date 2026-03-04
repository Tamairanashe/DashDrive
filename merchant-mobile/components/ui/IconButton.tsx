import React from 'react';
import {
    TouchableOpacity,
    TouchableOpacityProps,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';
import { Radius } from '../../constants/Radius';

export interface IconButtonProps extends TouchableOpacityProps {
    icon: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    rounded?: boolean;
}

export const IconButton = ({
    icon,
    variant = 'ghost',
    size = 'md',
    loading = false,
    rounded = true,
    style,
    disabled,
    ...props
}: IconButtonProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return { backgroundColor: colors.primary, color: '#FFFFFF' };
            case 'secondary':
                return { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, color: colors.text };
            case 'outline':
                return { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary, color: colors.primary };
            case 'ghost':
                return { backgroundColor: 'transparent', color: colors.text };
            case 'danger':
                return { backgroundColor: colors.error, color: '#FFFFFF' };
            default:
                return { backgroundColor: 'transparent', color: colors.text };
        }
    };

    const getSize = () => {
        switch (size) {
            case 'sm': return 32;
            case 'lg': return 48;
            default: return 40;
        }
    };

    const variantStyles = getVariantStyles();
    const dimension = getSize();

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            disabled={disabled || loading}
            style={[
                styles.container,
                {
                    width: dimension,
                    height: dimension,
                    borderRadius: rounded ? dimension / 2 : Radius.md,
                    backgroundColor: variantStyles.backgroundColor,
                    borderWidth: variantStyles.borderWidth,
                    borderColor: variantStyles.borderColor,
                },
                (disabled || loading) && styles.disabled,
                style,
            ]}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={variantStyles.color} size="small" />
            ) : (
                icon
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabled: {
        opacity: 0.5,
    },
});
