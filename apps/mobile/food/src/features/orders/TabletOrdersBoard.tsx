import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from '../../../components/Themed';
import { useOrderStore } from '../../store/useOrderStore';
import OrderCard from '../../components/OrderCard';
import { useKeepAwake } from 'expo-keep-awake';
import { Ionicons } from '@expo/vector-icons';

/**
 * Uber Eats Merchant-style Operational Dashboard (Style A)
 * Optimized for high-density kitchen environments.
 */

import { Colors } from '../../theme/colors';

const COLORS = Colors;

export default function TabletOrdersBoard() {
    useKeepAwake();
    const { orders } = useOrderStore();

    const newOrders = orders.filter(o => o.status === 'new');
    const preparingOrders = orders.filter(o => o.status === 'in_progress');
    const readyOrders = orders.filter(o => o.status === 'ready');

    const ColumnHeader = ({ title, count, color }: { title: string, count: number, color: string }) => (
        <View style={[styles.columnHeader, { borderBottomColor: color }]}>
            <Text style={styles.columnTitle}>{title}</Text>
            <View style={[styles.badge, { backgroundColor: color }]}>
                <Text style={styles.badgeText}>{count}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.column}>
                <ColumnHeader title="NEW ORDERS" count={newOrders.length} color={COLORS.primary} />
                <ScrollView contentContainerStyle={styles.columnContent} showsVerticalScrollIndicator={false}>
                    {newOrders.map(order => (
                        <OrderCard key={order.id} order={order} isTablet={true} />
                    ))}
                </ScrollView>
            </View>

            <View style={styles.column}>
                <ColumnHeader title="PREPARING" count={preparingOrders.length} color={COLORS.preparing} />
                <ScrollView contentContainerStyle={styles.columnContent} showsVerticalScrollIndicator={false}>
                    {preparingOrders.map(order => (
                        <OrderCard key={order.id} order={order} isTablet={true} />
                    ))}
                </ScrollView>
            </View>

            <View style={styles.column}>
                <ColumnHeader title="READY FOR PICKUP" count={readyOrders.length} color={COLORS.ready} />
                <ScrollView contentContainerStyle={styles.columnContent} showsVerticalScrollIndicator={false}>
                    {readyOrders.map(order => (
                        <OrderCard key={order.id} order={order} isTablet={true} />
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: COLORS.background,
    },
    column: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: COLORS.border,
    },
    columnHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 18,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 3,
    },
    columnTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.textPrimary,
        letterSpacing: 1,
    },
    badge: {
        minWidth: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    badgeText: {
        fontSize: 13,
        fontWeight: '900',
        color: '#000',
    },
    columnContent: {
        padding: 12,
        paddingBottom: 40,
        gap: 12,
    },
});
