import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Modal, Pressable, ScrollView, ActivityIndicator, Switch } from 'react-native';
import { Text } from '../../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { supabase } from '../lib/supabase';

interface MenuItem {
    id: string;
    name: string;
    price: number;
    category: string;
    is_available: boolean;
}

interface MenuManagementModalProps {
    visible: boolean;
    onClose: () => void;
    storeId: string;
    storeName: string;
}

export default function MenuManagementModal({ visible, onClose, storeId, storeName }: MenuManagementModalProps) {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (visible && storeId) {
            fetchMenu();
        }
    }, [visible, storeId]);

    const fetchMenu = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('menu_items')
                .select('*')
                .eq('store_id', storeId)
                .order('category', { ascending: true });

            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error('Error fetching menu:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleAvailability = async (itemId: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('menu_items')
                .update({ is_available: !currentStatus })
                .eq('id', itemId);

            if (error) throw error;
            setItems(items.map(item =>
                item.id === itemId ? { ...item, is_available: !currentStatus } : item
            ));
        } catch (error) {
            console.error('Error toggling availability:', error);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>Menu Management</Text>
                            <Text style={styles.subtitle}>{storeName}</Text>
                        </View>
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={24} color="#8E8E93" />
                        </Pressable>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {loading ? (
                            <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
                        ) : items.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="restaurant-outline" size={48} color="rgba(255,255,255,0.1)" />
                                <Text style={styles.emptyText}>No menu items found. Add items via the Dashboard.</Text>
                            </View>
                        ) : (
                            items.map((item) => (
                                <View key={item.id} style={styles.itemRow}>
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemCategory}>{item.category} • ${item.price.toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.itemActions}>
                                        <Text style={[styles.statusLabel, { color: item.is_available ? Colors.primary : Colors.rejected }]}>
                                            {item.is_available ? 'In Stock' : 'Out of Stock'}
                                        </Text>
                                        <Switch
                                            value={item.is_available}
                                            onValueChange={() => toggleAvailability(item.id, item.is_available)}
                                            trackColor={{ false: Colors.border, true: Colors.primarySoft }}
                                            thumbColor="#000000"
                                        />
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>

                    <Pressable style={styles.doneButton} onPress={onClose}>
                        <Text style={styles.doneButtonText}>Done</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: Colors.surface,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        maxHeight: '85%',
        minHeight: '50%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.textPrimary,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: Colors.textSecondary,
        fontWeight: '600',
        marginTop: 4,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingBottom: 24,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
    itemCategory: {
        color: '#8E8E93',
        fontSize: 13,
        fontWeight: '600',
        marginTop: 4,
    },
    itemActions: {
        alignItems: 'flex-end',
        marginLeft: 16,
    },
    statusLabel: {
        fontSize: 11,
        fontWeight: '800',
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    doneButton: {
        backgroundColor: Colors.primary,
        padding: 18,
        borderRadius: 18,
        alignItems: 'center',
        marginTop: 12,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    doneButtonText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: '700',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        color: '#48484A',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
        marginTop: 16,
        paddingHorizontal: 40,
    },
});
