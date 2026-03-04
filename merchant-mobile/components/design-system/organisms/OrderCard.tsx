import React from 'react';
import { View, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Package, Clock, User, ChevronRight } from 'lucide-react-native';
import { Title, Body, Caption } from '../atoms/Typography';
import { Badge } from '../atoms/Badge';
import { Card } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { format } from 'date-fns';

interface OrderItem {
    id: string;
    customerName: string;
    total: number;
    status: string;
    itemCount: number;
    createdAt: string;
}

interface OrderCardProps {
    order: OrderItem;
    onPress: () => void;
}

export const OrderCard = ({ order, onPress }: OrderCardProps) => {
    const colorScheme = (useColorScheme() ?? 'dark') as 'light' | 'dark';
    const themeColors = Colors[colorScheme];

    const getStatusVariant = () => {
        switch (order.status) {
            case 'PENDING': return 'warning';
            case 'PREPARING': return 'primary';
            case 'READY': return 'success';
            case 'CANCELLED': return 'error';
            default: return 'gray';
        }
    };

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <Card style={styles.card}>
                <View style={styles.header}>
                    <View style={styles.orderIdGroup}>
                        <Package size={18} color={themeColors.primary} />
                        <Title style={styles.orderId}>Order #{order.id.slice(-4).toUpperCase()}</Title>
                    </View>
                    <Badge label={order.status} variant={getStatusVariant() as any} />
                </View>

                <View style={styles.customerRow}>
                    <User size={16} color="#64748B" />
                    <Body style={styles.customerName}>{order.customerName}</Body>
                    <View style={styles.dot} />
                    <Caption>{order.itemCount} items</Caption>
                </View>

                <View style={styles.footer}>
                    <View style={styles.timeGroup}>
                        <Clock size={16} color="#64748B" />
                        <Caption style={styles.time}>{format(new Date(order.createdAt), 'HH:mm')}</Caption>
                    </View>
                    <View style={styles.priceGroup}>
                        <Title style={styles.total}>${order.total.toFixed(2)}</Title>
                        <ChevronRight size={20} color="#64748B" />
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        marginBottom: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: 'transparent',
    },
    orderIdGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'transparent',
    },
    orderId: {
        fontSize: 16,
    },
    customerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
    customerName: {
        fontSize: 14,
        fontWeight: '600',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#64748B',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    timeGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'transparent',
    },
    time: {
        fontSize: 13,
    },
    priceGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'transparent',
    },
    total: {
        fontSize: 18,
        color: '#10B981',
    },
});
