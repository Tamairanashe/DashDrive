import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    View as RNView,
    useColorScheme
} from 'react-native';
import Colors from '@/constants/Colors';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
    label: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle | TextStyle[];
}

export const Button = ({
    label,
    onPress,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    icon,
    style,
    textStyle,
}: ButtonProps) => {
    const colorScheme = (useColorScheme() ?? 'dark') as 'light' | 'dark';
    const themeColors = Colors[colorScheme];

    const getVariantStyle = (): ViewStyle => {
        switch (variant) {
            case 'primary':
                return { backgroundColor: themeColors.primary };
            case 'secondary':
                return { backgroundColor: themeColors.card, borderWidth: 1, borderColor: themeColors.border };
            case 'outline':
                return { backgroundColor: 'transparent', borderWidth: 1, borderColor: themeColors.primary };
            case 'ghost':
                return { backgroundColor: 'transparent' };
            case 'danger':
                return { backgroundColor: themeColors.error };
            default:
                return { backgroundColor: themeColors.primary };
        }
    };

    const getTextColor = (): string => {
        if (disabled) return '#94A3B8';
        switch (variant) {
            case 'primary':
            case 'danger':
                return '#FFFFFF';
            case 'outline':
            case 'ghost':
                return themeColors.primary;
            case 'secondary':
                return themeColors.text;
            default:
                return '#FFFFFF';
        }
    };

    const getSizeStyle = (): ViewStyle => {
        switch (size) {
            case 'small':
                return { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 };
            case 'medium':
                return { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 };
            case 'large':
                return { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 16 };
            default:
                return { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 };
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.base,
                getVariantStyle(),
                getSizeStyle(),
                (disabled || loading) && { opacity: 0.5 },
                style,
            ]}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} size="small" />
            ) : (
                <>
                    {icon && <RNView style={styles.iconContainer}>{icon}</RNView>}
                    <Text style={[
                        styles.text,
                        { color: getTextColor() },
                        size === 'small' && { fontSize: 13 },
                        size === 'large' && { fontSize: 18 },
                        textStyle
                    ]}>
                        {label}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: '700',
        fontSize: 15,
    },
    iconContainer: {
        marginRight: 8,
        backgroundColor: 'transparent',
    },
});
