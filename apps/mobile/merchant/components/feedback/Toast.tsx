import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react-native';
import { Text } from '../ui/Text';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';
import { Radius } from '../../constants/Radius';
import { Shadows } from '../../constants/Shadows';
import { IconButton } from '../ui/IconButton';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
    message: string;
    type?: ToastType;
    onClose?: () => void;
    style?: ViewStyle;
}

export const Toast = ({
    message,
    type = 'success',
    onClose,
    style,
}: ToastProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(opacity, {
            toValue: 1,
            useNativeDriver: true,
            tension: 40,
            friction: 7,
        }).start();
    }, [opacity]);

    const getVariantConfig = () => {
        switch (type) {
            case 'success':
                return { bg: colors.success, icon: CheckCircle };
            case 'error':
                return { bg: colors.error, icon: AlertCircle };
            case 'warning':
                return { bg: colors.warning, icon: AlertCircle };
            case 'info':
                return { bg: colors.info, icon: Info };
            default:
                return { bg: colors.primary, icon: Info };
        }
    };

    const { bg, icon: Icon } = getVariantConfig();

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor: bg,
                    opacity,
                    transform: [
                        {
                            translateY: opacity.interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0]
                            })
                        }
                    ]
                },
                style,
            ]}
        >
            <Icon size={20} color="#FFFFFF" strokeWidth={2.5} />
            <Text variant="bodyMedium" style={styles.text}>
                {message}
            </Text>
            {onClose && (
                <IconButton
                    icon={<X size={16} color="#FFFFFF" />}
                    size="sm"
                    onPress={onClose}
                    variant="ghost"
                />
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: Radius.md,
        marginBottom: Spacing.sm,
        ...Shadows.md,
    },
    text: {
        color: '#FFFFFF',
        fontWeight: '600',
        flex: 1,
        marginLeft: Spacing.sm,
    },
});
