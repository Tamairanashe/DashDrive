import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from '../../components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStoreContext } from '../../src/store/useStoreContext';
import { Ionicons } from '@expo/vector-icons';
import NewOrderPopup from '../../src/components/NewOrderPopup';
import { useDeviceType } from '../../src/hooks/useDeviceType';
import { Colors } from '../../src/theme/colors';
import { useDashFoodRealtime } from '../../src/hooks/useDashFoodRealtime';
import TabletKanbanBoard from '../../src/features/orders/TabletKanbanBoard';
import PhoneOrdersList from '../../src/features/orders/PhoneOrdersList';

export default function OrdersScreen() {
    const { isTablet } = useDeviceType();
    const { activeStoreId } = useStoreContext();

    // 🔥 Unified Realtime Data Orchestrator
    useDashFoodRealtime(activeStoreId || undefined);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>{isTablet ? 'Command Center' : 'Orders'}</Text>
                    <View style={styles.liveIndicatorContainer}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>
                            {isTablet ? 'READY FOR BUSINESS' : 'REAL-TIME LIVE'}
                        </Text>
                    </View>
                </View>
                <Pressable style={styles.muteButton}>
                    <Ionicons
                        name="volume-medium-outline"
                        size={24}
                        color={isTablet ? Colors.primary : Colors.textMuted}
                    />
                </Pressable>
            </View>

            {isTablet ? (
                <TabletKanbanBoard />
            ) : (
                <PhoneOrdersList activeStoreId={activeStoreId || undefined} />
            )}

            <NewOrderPopup />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    liveIndicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        marginRight: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 6,
    },
    liveText: {
        fontSize: 11,
        fontWeight: '900',
        color: Colors.primary,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
    },
    muteButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.textPrimary,
        letterSpacing: -0.5,
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
