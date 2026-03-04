import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View as RNView, RefreshControl } from 'react-native';
import { Text, View, Card } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { Package, Clock, CheckCircle, Search } from 'lucide-react-native';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';

import { Skeleton, LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { StatusBadge } from '@/components/ui/StatusBadge';

const STAGES = [
    { label: 'All', value: 'ALL', icon: Package },
    { label: 'Pending', value: 'PENDING', icon: Clock },
    { label: 'Preparing', value: 'PREPARING', icon: Clock },
    { label: 'Ready', value: 'READY', icon: CheckCircle },
];

export default function OrdersScreen() {
    const [activeStage, setActiveStage] = useState('ALL');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
    const { store } = useAuth();
    const router = useRouter();

    const fetchOrders = useCallback(async () => {
        if (!store) return;
        try {
            setError(false);
            const response = await api.get(`/orders/store/${store.id}`);
            let filtered = response.data;
            if (activeStage !== 'ALL') {
                filtered = filtered.filter((o: any) => o.status.toUpperCase() === activeStage);
            }
            setOrders(filtered);
        } catch (error) {
            console.error('Failed to fetch orders', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [activeStage, store]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchOrders();
        setRefreshing(false);
    };

    const renderOrder = ({ item }: any) => (
        <TouchableOpacity onPress={() => router.push({ pathname: '/order/[id]', params: { id: item.id } })}>
            <Card style={styles.orderCard}>
                <RNView style={styles.orderHeader}>
                    <Text style={styles.orderId}>Order #{item.orderNumber}</Text>
                    <Text style={[styles.orderPrice, { color: Colors[colorScheme].primary }]}>
                        ${item.totalAmount.toFixed(2)}
                    </Text>
                </RNView>

                <Text style={styles.customerName}>{item.customerName || 'Guest Customer'}</Text>

                <RNView style={styles.orderFooter}>
                    <Text style={styles.orderTime}>{format(new Date(item.createdAt), 'MMM d, HH:mm')}</Text>
                    <StatusBadge status={item.status} />
                </RNView>
            </Card>
        </TouchableOpacity>
    );

    if (error && !orders.length) {
        return <ErrorState onRetry={fetchOrders} />;
    }

    return (
        <View style={styles.container}>
            <RNView style={styles.searchBar}>
                <Search size={20} color="#94A3B8" />
                <Text style={styles.placeholder}>Search order ID or customer...</Text>
            </RNView>

            <RNView style={styles.tabsScroll}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={STAGES}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => setActiveStage(item.value)}
                            style={[
                                styles.tab,
                                activeStage === item.value && { borderBottomColor: Colors[colorScheme].primary, borderBottomWidth: 2 }
                            ]}
                        >
                            <Text style={[
                                styles.tabText,
                                activeStage === item.value && { color: Colors[colorScheme].primary, fontWeight: 'bold' }
                            ]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </RNView>

            {loading ? (
                <FlatList
                    data={[1, 2, 3, 4]}
                    renderItem={() => (
                        <RNView style={[styles.orderCard, { marginHorizontal: 16, marginBottom: 12, backgroundColor: Colors[colorScheme].card }]}>
                            <Skeleton height={80} />
                        </RNView>
                    )}
                    keyExtractor={(id) => id.toString()}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrder}
                    keyExtractor={(item: any) => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors[colorScheme].primary} />}
                    ListEmptyComponent={
                        <EmptyState
                            icon={Package}
                            title="No orders found"
                            description={activeStage === 'ALL' ? "Orders from customers will appear here." : `No orders in the ${activeStage.toLowerCase()} stage.`}
                            actionLabel="Refresh List"
                            onAction={onRefresh}
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E293B',
        margin: 16,
        padding: 12,
        borderRadius: 12,
        gap: 10,
    },
    placeholder: {
        color: '#94A3B8',
        fontSize: 14,
    },
    tabsScroll: {
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    tabText: {
        fontSize: 14,
        color: '#94A3B8',
    },
    listContent: {
        padding: 16,
    },
    orderCard: {
        padding: 16,
        marginBottom: 16,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        backgroundColor: 'transparent',
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    customerName: {
        fontSize: 14,
        color: '#94A3B8',
        marginBottom: 12,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    orderTime: {
        fontSize: 12,
        color: '#94A3B8',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    empty: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#94A3B8',
    }
});
