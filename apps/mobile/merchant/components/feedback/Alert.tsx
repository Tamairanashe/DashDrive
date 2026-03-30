import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react-native';
import { Text } from '../ui/Text';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';
import { Radius } from '../../constants/Radius';

export interface AlertProps {
    title?: string;
    message: string;
    variant?: 'success' | 'error' | 'warning' | 'info';
    style?: ViewStyle;
}

export const Alert = ({
    title,
    message,
    variant = 'info',
    style,
}: AlertProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    const getVariantConfig = () => {
        switch (variant) {
            case 'success': return { color: colors.success, icon: CheckCircle };
            case 'error': return { color: colors.error, icon: AlertCircle };
            case 'warning': return { color: colors.warning, icon: AlertTriangle };
            case 'info': return { color: colors.info, icon: Info };
            default: return { color: colors.info, icon: Info };
        }
    };

    const { color, icon: Icon } = getVariantConfig();

    return (
        <View style={[styles.container, { backgroundColor: color + '15', borderColor: color }, style]}>
            <Icon size={20} color={color} style={styles.icon} />
            <View style={styles.content}>
                {title && (
                    <Text variant="title3" style={{ color, marginBottom: Spacing.xxs }}>
                        {title}
                    </Text>
                )}
                <Text variant="bodySmall" style={{ color }}>
                    {message}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: Spacing.md,
        borderRadius: Radius.md,
        borderWidth: 1,
    },
    icon: {
        marginTop: 2,
    },
    content: {
        flex: 1,
        marginLeft: Spacing.sm,
    },
});
