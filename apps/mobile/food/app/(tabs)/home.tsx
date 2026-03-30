import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Modal, FlatList } from 'react-native';
import { Text } from '../../components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import KPIWidget from '../../src/components/KPIWidget';
import ActivityItem from '../../src/components/ActivityItem';
import { useStoreContext } from '../../src/store/useStoreContext';
import { supabase } from '../../src/lib/supabase';
import { orderService } from '../../src/services/orderService';
import { useKitchenLoadPredictor } from '../../src/hooks/useKitchenLoadPredictor';
import { useReadyShelfMonitor } from '../../src/hooks/useReadyShelfMonitor';
import KitchenLoadCard from '../../src/components/KitchenLoadCard';
import ReadyShelfCard from '../../src/components/ReadyShelfCard';

export default function HomeScreen() {
    const { activeStoreId, setActiveStoreId } = useStoreContext();
    const [stores, setStores] = useState<any[]>([]);
    const [showSelector, setShowSelector] = useState(false);
    const [metrics, setMetrics] = useState({
        orders_today: 0,
        total_revenue: 0,
        avg_prep_min: 0,
        live_issues: 0,
        new_count: 0,
        in_progress_count: 0,
        ready_count: 0,
        avg_ready_wait_min: 0
    });

    const prediction = useKitchenLoadPredictor(metrics);
    const monitor = useReadyShelfMonitor(metrics);

    useEffect(() => {
        fetchStores();
    }, []);

    useEffect(() => {
        if (activeStoreId) {
            fetchMetrics();
        }
    }, [activeStoreId]);

    const fetchStores = async () => {
        const { data } = await supabase.from('stores').select('id, name');
        setStores(data || []);
        if (data && data.length > 0 && !activeStoreId) {
            setActiveStoreId(data[0].id);
        }
    };

    const fetchMetrics = async () => {
        if (!activeStoreId) return;
        try {
            const data = await orderService.fetchStoreMetrics(activeStoreId);
            if (data) setMetrics(data);
        } catch (error) {
            console.error("Error fetching metrics:", error);
        }
    };

    const activeStore = stores.find(s => s.id === activeStoreId);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.title}>Dashboard</Text>
                        <Pressable style={styles.storeSelector} onPress={() => setShowSelector(true)}>
                            <Text style={styles.storeName}>{activeStore?.name || 'All Stores'}</Text>
                            <Ionicons name="chevron-down" size={16} color="#00ff90" style={{ marginLeft: 4 }} />
                        </Pressable>
                    </View>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={24} color="#8E8E93" />
                    </View>
                </View>

                {/* 🍳 Kitchen Load Predictor Card */}
                <KitchenLoadCard prediction={prediction} />

                {/* 🧺 Ready Shelf Monitor Card */}
                <ReadyShelfCard monitor={monitor} />

                <Modal visible={showSelector} transparent animationType="slide">
                    <Pressable style={styles.modalOverlay} onPress={() => setShowSelector(false)}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Select Location</Text>
                            <FlatList
                                data={[{ id: null, name: 'All Stores' }, ...stores]}
                                keyExtractor={(item) => (item.id || 'all')}
                                renderItem={({ item }) => (
                                    <Pressable
                                        style={styles.storeOption}
                                        onPress={() => {
                                            setActiveStoreId(item.id);
                                            setShowSelector(false);
                                        }}
                                    >
                                        <Text style={[styles.storeOptionText, activeStoreId === item.id && styles.activeStoreOption]}>
                                            {item.name}
                                        </Text>
                                        {activeStoreId === item.id && <Ionicons name="checkmark-circle" size={24} color="#00ff90" />}
                                    </Pressable>
                                )}
                            />
                        </View>
                    </Pressable>
                </Modal>

                <View style={styles.kpiGrid}>
                    <KPIWidget
                        label="Orders Today"
                        value={metrics.orders_today.toString()}
                        trend="+15%"
                        icon="receipt"
                        color="#34C759"
                    />
                    <KPIWidget
                        label="Net Revenue"
                        value={`$${metrics.total_revenue.toLocaleString()}`}
                        trend="+12%"
                        icon="stats-chart"
                        color="#00ff90"
                    />
                    <KPIWidget
                        label="Avg Prep"
                        value={`${metrics.avg_prep_min}m`}
                        trend="-3m"
                        icon="timer"
                        color="#FF9500"
                    />
                    <KPIWidget
                        label="Live Issues"
                        value={metrics.live_issues.toString()}
                        trend="0"
                        icon="warning"
                        color="#FF3B30"
                    />
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                    </View>
                    <View style={styles.quickActionsGrid}>
                        <Pressable style={styles.quickAction}>
                            <View style={[styles.actionIcon, { backgroundColor: 'rgba(255, 59, 48, 0.15)' }]}>
                                <Ionicons name="pause" size={26} color="#FF3B30" />
                            </View>
                            <Text style={styles.actionLabel}>Break</Text>
                        </Pressable>
                        <Pressable style={styles.quickAction}>
                            <View style={[styles.actionIcon, { backgroundColor: 'rgba(255, 149, 0, 0.15)' }]}>
                                <Ionicons name="restaurant" size={26} color="#FF9500" />
                            </View>
                            <Text style={styles.actionLabel}>Stock</Text>
                        </Pressable>
                        <Pressable style={styles.quickAction}>
                            <View style={[styles.actionIcon, { backgroundColor: 'rgba(0, 255, 144, 0.15)' }]}>
                                <Ionicons name="headset" size={26} color="#00ff90" />
                            </View>
                            <Text style={styles.actionLabel}>Help</Text>
                        </Pressable>
                        <Pressable style={styles.quickAction}>
                            <View style={[styles.actionIcon, { backgroundColor: 'rgba(52, 199, 89, 0.15)' }]}>
                                <Ionicons name="grid" size={26} color="#34C759" />
                            </View>
                            <Text style={styles.actionLabel}>More</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Live Activity</Text>
                        <Pressable><Text style={styles.sectionLink}>View All</Text></Pressable>
                    </View>
                    <View style={styles.activityCard}>
                        <ActivityItem
                            type="order"
                            title="Accepted Order #F23A"
                            time="Now"
                            description="Main St. Kitchen • $42.00"
                        />
                        <ActivityItem
                            type="issue"
                            title="Operational Alert"
                            time="15m"
                            description="Late Delivery: Order #B192"
                        />
                        <ActivityItem
                            type="system"
                            title="Payout Processed"
                            time="2h"
                            description="Weekly disbursement initiated"
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        marginBottom: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerLeft: {
        flex: 1,
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    storeSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        backgroundColor: 'rgba(0, 255, 144, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    storeName: {
        fontSize: 15,
        color: '#00ff90',
        fontWeight: '700',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#1C1C1E',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#1C1C1E',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        maxHeight: '80%',
        paddingBottom: 40,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 24,
        textAlign: 'center',
    },
    storeOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    storeOptionText: {
        fontSize: 18,
        color: '#FFFFFF',
        opacity: 0.7,
    },
    activeStoreOption: {
        color: '#00ff90',
        fontWeight: '800',
        opacity: 1,
    },
    kpiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    section: {
        marginTop: 24,
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    sectionLink: {
        fontSize: 14,
        color: '#00ff90',
        fontWeight: '600',
    },
    quickActionsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quickAction: {
        width: '22%',
        alignItems: 'center',
    },
    actionIcon: {
        width: 64,
        height: 64,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    actionLabel: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        color: '#8E8E93',
    },
    activityCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 24,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
});

