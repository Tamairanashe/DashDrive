import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Text } from '../ui/Text';
import { Row } from '../layout/Row';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

export interface StatsCardProps {
    label: string;
    value: string | number;
    trend?: number;
    icon?: React.ReactNode;
    onPress?: () => void;
}

export const StatsCard = ({
    label,
    value,
    trend,
    icon,
    onPress,
}: StatsCardProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    const isPositive = trend && trend > 0;

    return (
        <Card onPress={onPress}>
            <Row justify="space-between" align="flex-start">
                <View style={styles.textContainer}>
                    <Text variant="caption" color="text" style={styles.label}>
                        {label}
                    </Text>
                    <Text variant="title2" style={styles.value}>
                        {value}
                    </Text>
                </View>
                {icon && (
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                        {icon}
                    </View>
                )}
            </Row>

            {trend !== undefined && (
                <Row style={styles.trendRow} gap="xxs">
                    {isPositive ? (
                        <TrendingUp size={14} color={colors.success} />
                    ) : (
                        <TrendingDown size={14} color={colors.error} />
                    )}
                    <Text
                        variant="bodySmall"
                        style={{
                            color: isPositive ? colors.success : colors.error,
                            fontWeight: '600'
                        }}
                    >
                        {isPositive ? '+' : ''}{trend}%
                    </Text>
                    <Text variant="bodySmall" color="tabIconDefault">
                        vs last week
                    </Text>
                </Row>
            )}
        </Card>
    );
};

const styles = StyleSheet.create({
    textContainer: {
        flex: 1,
    },
    label: {
        marginBottom: Spacing.xs,
        opacity: 0.7,
    },
    value: {
        fontWeight: '700',
    },
    iconContainer: {
        padding: Spacing.sm,
        borderRadius: 12,
    },
    trendRow: {
        marginTop: Spacing.md,
    },
});
