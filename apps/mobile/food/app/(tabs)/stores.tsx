import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Switch, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../src/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/useAuthStore';
import { storeService } from '../../src/services/storeService';
import MenuManagementModal from '../../src/components/MenuManagementModal';

interface Store {
    id: string;
    name: string;
    location: string;
    status: 'open' | 'closed' | 'busy';
    acceptance_mode: 'manual' | 'auto';
    sla_warning_minutes: number;
    sla_breach_minutes: number;
    escalation_enabled: boolean;
    escalation_roles: string[];
}

export default function StoresScreen() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [menuModalVisible, setMenuModalVisible] = useState(false);
    const [selectedStore, setSelectedStore] = useState<{ id: string, name: string } | null>(null);
    const { hasRole } = useAuthStore();

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const { data, error } = await supabase
                .from('stores')
                .select('*');

            if (error) throw error;
            setStores(data || []);
        } catch (error) {
            console.error('Error fetching stores:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStoreStatus = async (storeId: string, currentStatus: string) => {
        const nextStatus = currentStatus === 'open' ? 'closed' : 'open';
        try {
            const { error } = await supabase
                .from('stores')
                .update({ status: nextStatus })
                .eq('id', storeId);

            if (error) throw error;
            setStores(stores.map(s => s.id === storeId ? { ...s, status: nextStatus as any } : s));
        } catch (error) {
            console.error('Error toggling store status:', error);
        }
    };

    const toggleAcceptanceMode = async (storeId: string, currentMode: 'manual' | 'auto') => {
        const nextMode = currentMode === 'manual' ? 'auto' : 'manual';
        const result = await storeService.updateStoreSettings(storeId, { acceptance_mode: nextMode });

        if (result.success) {
            setStores(stores.map(s => s.id === storeId ? { ...s, acceptance_mode: nextMode } : s));
        }
    };

    const updateSLASettings = async (storeId: string, type: 'warning' | 'breach', value: string) => {
        const minutes = parseInt(value);
        if (isNaN(minutes)) return;

        const updates = type === 'warning'
            ? { sla_warning_minutes: minutes }
            : { sla_breach_minutes: minutes };

        const result = await storeService.updateStoreSettings(storeId, updates);

        if (result.success) {
            setStores(stores.map(s => s.id === storeId ? {
                ...s,
                [type === 'warning' ? 'sla_warning_minutes' : 'sla_breach_minutes']: minutes
            } : s));
        }
    };

    const toggleEscalation = async (storeId: string, enabled: boolean) => {
        const result = await storeService.updateStoreSettings(storeId, { escalation_enabled: enabled });
        if (result.success) {
            setStores(stores.map(s => s.id === storeId ? { ...s, escalation_enabled: enabled } : s));
        }
    };

    const toggleRole = async (storeId: string, roles: string[], role: string) => {
        const newRoles = roles.includes(role)
            ? roles.filter(r => r !== role)
            : [...roles, role];

        const result = await storeService.updateStoreSettings(storeId, { escalation_roles: newRoles });
        if (result.success) {
            setStores(stores.map(s => s.id === storeId ? { ...s, escalation_roles: newRoles } : s));
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>My Stores</Text>
                <Text style={styles.subtitle}>Manage your restaurant locations</Text>
            </View>

            <FlatList
                data={stores}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.storeCard}>
                        <View style={styles.storeInfo}>
                            <Text style={styles.storeName}>{item.name}</Text>
                            <Text style={styles.storeLocation}>{item.location}</Text>

                            <View style={styles.settingRow}>
                                <Ionicons name="flash-outline" size={16} color={item.acceptance_mode === 'auto' ? '#00ff90' : '#8E8E93'} />
                                <Text style={[styles.settingLabel, { color: item.acceptance_mode === 'auto' ? '#00ff90' : '#8E8E93' }]}>
                                    {item.acceptance_mode === 'auto' ? 'Auto-Accept On' : 'Manual Accept'}
                                </Text>
                                <Switch
                                    value={item.acceptance_mode === 'auto'}
                                    onValueChange={() => toggleAcceptanceMode(item.id, item.acceptance_mode)}
                                    disabled={!hasRole(['manager', 'owner'])}
                                    trackColor={{ false: '#3A3A3C', true: '#00ff90' }}
                                    thumbColor="#f4f3f4"
                                    style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                                />
                            </View>

                            <View style={styles.slaContainer}>
                                <View style={styles.slaInputGroup}>
                                    <Text style={styles.slaLabel}>Warn (min)</Text>
                                    <View style={styles.slaInputWrapper}>
                                        <Text style={styles.slaValue}>{item.sla_warning_minutes || 10}</Text>
                                        <Pressable
                                            onPress={() => {
                                                const val = prompt("Set Warning Threshold (minutes)", (item.sla_warning_minutes || 10).toString());
                                                if (val) updateSLASettings(item.id, 'warning', val);
                                            }}
                                            style={styles.editIcon}
                                        >
                                            <Ionicons name="pencil-outline" size={12} color="#8E8E93" />
                                        </Pressable>
                                    </View>
                                </View>
                                <View style={styles.slaInputGroup}>
                                    <Text style={styles.slaLabel}>Late (min)</Text>
                                    <View style={styles.slaInputWrapper}>
                                        <Text style={styles.slaValue}>{item.sla_breach_minutes || 20}</Text>
                                        <Pressable
                                            onPress={() => {
                                                const val = prompt("Set Breach Threshold (minutes)", (item.sla_breach_minutes || 20).toString());
                                                if (val) updateSLASettings(item.id, 'breach', val);
                                            }}
                                            style={styles.editIcon}
                                        >
                                            <Ionicons name="pencil-outline" size={12} color="#8E8E93" />
                                        </Pressable>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.escalationSettings}>
                                <View style={styles.escalationHeader}>
                                    <View style={styles.escalationTitleRow}>
                                        <Ionicons name="notifications-circle-outline" size={16} color={item.escalation_enabled ? '#FFD60A' : '#8E8E93'} />
                                        <Text style={[styles.escalationTitle, { color: item.escalation_enabled ? '#FFD60A' : '#8E8E93' }]}>
                                            Roles to Escalate
                                        </Text>
                                    </View>
                                    <Switch
                                        value={item.escalation_enabled}
                                        onValueChange={(v) => toggleEscalation(item.id, v)}
                                        disabled={!hasRole(['manager', 'owner'])}
                                        trackColor={{ false: '#3A3A3C', true: '#FFD60A' }}
                                        thumbColor="#f4f3f4"
                                        style={{ transform: [{ scaleX: .7 }, { scaleY: .7 }] }}
                                    />
                                </View>

                                {item.escalation_enabled && (
                                    <View style={styles.roleChips}>
                                        {['manager', 'owner', 'staff'].map((role) => (
                                            <Pressable
                                                key={role}
                                                style={[
                                                    styles.roleChip,
                                                    item.escalation_roles?.includes(role) && styles.roleChipActive
                                                ]}
                                                onPress={() => toggleRole(item.id, item.escalation_roles || [], role)}
                                                disabled={!hasRole(['manager', 'owner'])}
                                            >
                                                <Text style={[
                                                    styles.roleChipText,
                                                    item.escalation_roles?.includes(role) && styles.roleChipTextActive
                                                ]}>
                                                    {role.toUpperCase()}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                )}
                            </View>
                        </View>
                        <View style={styles.storeActions}>
                            <View style={styles.statusLabelContainer}>
                                <View style={[
                                    styles.statusIndicator,
                                    { backgroundColor: item.status === 'open' ? '#4CAF50' : '#F44336' }
                                ]} />
                                <Text style={styles.statusLabel}>
                                    {item.status.toUpperCase()}
                                </Text>
                            </View>
                            <Switch
                                value={item.status === 'open'}
                                onValueChange={() => toggleStoreStatus(item.id, item.status)}
                                disabled={!hasRole(['manager', 'owner'])}
                                trackColor={{ false: '#767577', true: '#4CAF50' }}
                                thumbColor="#f4f3f4"
                            />
                            <Pressable
                                style={styles.menuButton}
                                onPress={() => {
                                    setSelectedStore({ id: item.id, name: item.name });
                                    setMenuModalVisible(true);
                                }}
                            >
                                <Ionicons name="restaurant-outline" size={18} color="#00ff90" />
                                <Text style={styles.menuButtonText}>Menu</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>{loading ? 'Loading stores...' : 'No stores found'}</Text>
                    </View>
                }
                contentContainerStyle={styles.listContent}
            />
            <MenuManagementModal
                visible={menuModalVisible}
                onClose={() => setMenuModalVisible(false)}
                storeId={selectedStore?.id || ''}
                storeName={selectedStore?.name || ''}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 24,
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#8E8E93',
        fontWeight: '500',
        marginTop: 6,
    },
    storeCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    storeInfo: {
        flex: 1,
    },
    storeName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    storeLocation: {
        fontSize: 14,
        color: '#8E8E93',
        marginTop: 4,
        fontWeight: '500',
    },
    storeActions: {
        alignItems: 'flex-end',
        marginLeft: 16,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    settingLabel: {
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 6,
        marginRight: 4,
    },
    slaContainer: {
        flexDirection: 'row',
        marginTop: 16,
        gap: 12,
    },
    slaInputGroup: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 12,
    },
    slaLabel: {
        fontSize: 10,
        color: '#8E8E93',
        fontWeight: '800',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    slaInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    slaValue: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    editIcon: {
        padding: 4,
    },
    escalationSettings: {
        marginTop: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 12,
        padding: 12,
    },
    escalationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    escalationTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    escalationTitle: {
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
        marginLeft: 6,
    },
    roleChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    roleChip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    roleChipActive: {
        backgroundColor: 'rgba(255, 214, 10, 0.15)',
        borderColor: '#FFD60A',
    },
    roleChipText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#8E8E93',
    },
    roleChipTextActive: {
        color: '#FFD60A',
    },
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 255, 144, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        marginTop: 12,
    },
    menuButtonText: {
        color: '#00ff90',
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 6,
    },
    statusLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    statusLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    listContent: {
        padding: 24,
        paddingBottom: 40,
    },
    emptyContainer: {
        marginTop: 120,
        alignItems: 'center',
    },
    emptyText: {
        color: '#8E8E93',
        fontSize: 17,
        fontWeight: '600',
    },
});
