import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { Text } from '@/components/Themed';
import { useOrderStore, Order } from '../../store/useOrderStore';
import OrderCard from '../../components/OrderCard';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

const TABS = [
    { id: 'new', label: 'NEW' },
    { id: 'in_progress', label: 'PREP' },
    { id: 'ready', label: 'READY' },
    { id: 'completed', label: 'HISTORY' },
    { id: 'unfulfilled', label: 'ISSUES' },
];

interface PhoneOrdersListProps {
    activeStoreId?: string;
}

export default function PhoneOrdersList({ activeStoreId }: PhoneOrdersListProps) {
    const [activeTab, setActiveTab] = useState('new');
    const { orders } = useOrderStore();

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesTab = order.status === activeTab;
            const matchesStore = !activeStoreId || order.store_id === activeStoreId;
            return matchesTab && matchesStore;
        });
    }, [orders, activeTab, activeStoreId]);

    return (
        <View style={styles.container}>
            <View style={styles.tabBarContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
                    {TABS.map((tab) => (
                        <Pressable
                            key={tab.id}
                            onPress={() => setActiveTab(tab.id)}
                            style={[
                                styles.tab,
                                activeTab === tab.id && styles.activeTab
                            ]}
                        >
                            <Text style={[
                                styles.tabLabel,
                                activeTab === tab.id && styles.activeTabLabel
                            ]}>
                                {tab.label}
                            </Text>
                            {orders.filter((o: Order) => o.status === tab.id).length > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        {orders.filter((o: Order) => o.status === tab.id).length}
                                    </Text>
                                </View>
                            )}
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            <FlashList
                data={filteredOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }: { item: Order }) => <OrderCard order={item} />}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No {activeTab.replace('_', ' ')} orders found</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabBarContainer: {
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        marginBottom: 8,
    },
    tabBar: {
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginRight: 12,
        borderRadius: 8,
        backgroundColor: Colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    activeTab: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    tabLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: Colors.textSecondary,
        letterSpacing: 0.5,
    },
    activeTabLabel: {
        color: '#000',
    },
    badge: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        marginLeft: 8,
    },
    badgeText: {
        color: Colors.textPrimary,
        fontSize: 11,
        fontWeight: '900',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 40,
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        color: Colors.textSecondary,
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
});
