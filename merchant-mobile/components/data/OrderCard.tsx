import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import { Row } from '../layout/Row';
import { Stack } from '../layout/Stack';
import { Divider } from '../ui/Divider';
import { Spacing } from '../../constants/Spacing';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Clock } from 'lucide-react-native';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface OrderCardProps {
    orderId: string;
    customerName: string;
    items: number;
    total: string;
    status: OrderStatus;
    time: string;
    onPress?: () => void;
}

export const OrderCard = ({
    orderId,
    customerName,
    items,
    total,
    status,
    time,
    onPress,
}: OrderCardProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    const getStatusConfig = (s: OrderStatus) => {
        switch (s) {
            case 'pending': return { label: 'Pending', variant: 'warning' } as const;
            case 'preparing': return { label: 'Preparing', variant: 'info' } as const;
            case 'ready': return { label: 'Ready', variant: 'primary' } as const;
            case 'delivered': return { label: 'Delivered', variant: 'success' } as const;
            case 'cancelled': return { label: 'Cancelled', variant: 'error' } as const;
            default: return { label: s, variant: 'gray' } as const;
        }
    };

    const statusConfig = getStatusConfig(status);

    return (
        <Card onPress={onPress} style={styles.card}>
            <Row justify="space-between">
                <Text variant="title3" style={styles.orderId}>#{orderId}</Text>
                <Badge label={statusConfig.label} variant={statusConfig.variant} />
            </Row>

            <Divider marginVertical="md" />

            <Stack gap="xs">
                <Text variant="bodyLarge" style={{ fontWeight: '600' }}>{customerName}</Text>
                <Text variant="bodyMedium" color="tabIconDefault">
                    {items} {items === 1 ? 'item' : 'items'} • {total}
                </Text>
            </Stack>

            <Row style={styles.footer} gap="xs">
                <Clock size={14} color={colors.tabIconDefault} />
                <Text variant="bodySmall" color="tabIconDefault">
                    Ordered {time}
                </Text>
            </Row>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: Spacing.md,
    },
    orderId: {
        fontWeight: '700',
    },
    footer: {
        marginTop: Spacing.md,
        opacity: 0.8,
    },
});
