import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, Switch, View as RNView, RefreshControl } from 'react-native';
import { Text, View, Card } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { Plus, Search, Filter } from 'lucide-react-native';

import { Skeleton, LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useFeedback } from '@/contexts/FeedbackContext';
import { Box } from 'lucide-react-native';

export default function ProductsScreen() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
    const { store } = useAuth();
    const { showToast } = useFeedback();

    const fetchProducts = useCallback(async () => {
        try {
            setError(false);
            const response = await api.get('/products', {
                params: { storeId: store?.id }
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [store]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const toggleAvailability = async (productId: string, currentStatus: boolean) => {
        try {
            await api.patch(`/products/${productId}`, { isActive: !currentStatus });
            setProducts(products.map((p: any) =>
                p.id === productId ? { ...p, isActive: !currentStatus } : p
            ));
            showToast(`Product ${!currentStatus ? 'activated' : 'deactivated'} successfully`, 'success');
        } catch (error) {
            console.error('Failed to toggle product status', error);
            showToast('Unable to update product status', 'error');
        }
    };

    const renderProduct = ({ item }: any) => (
        <Card style={styles.productCard}>
            <RNView style={styles.productLeft}>
                <Image
                    source={{ uri: item.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop' }}
                    style={styles.productImage}
                />
                <RNView style={styles.productInfo}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>${item.basePrice.toFixed(2)}</Text>
                    <Text style={[styles.stockLevel, { color: item.stock < 5 ? '#EF4444' : '#94A3B8' }]}>
                        Stock: {item.stock}
                    </Text>
                </RNView>
            </RNView>
            <RNView style={styles.productRight}>
                <Switch
                    value={item.isActive}
                    onValueChange={() => toggleAvailability(item.id, item.isActive)}
                    trackColor={{ false: '#334155', true: '#10B98120' }}
                    thumbColor={item.isActive ? '#10B981' : '#64748B'}
                />
            </RNView>
        </Card>
    );

    if (error && !products.length) {
        return <ErrorState onRetry={fetchProducts} />;
    }

    return (
        <View style={styles.container}>
            <RNView style={styles.searchRow}>
                <RNView style={styles.searchBar}>
                    <Search size={20} color="#94A3B8" />
                    <Text style={styles.placeholder}>Search items...</Text>
                </RNView>
                <TouchableOpacity style={styles.filterBtn}>
                    <Filter size={20} color={Colors[colorScheme as 'light' | 'dark'].text} />
                </TouchableOpacity>
            </RNView>

            {loading ? (
                <FlatList
                    data={[1, 2, 3, 4, 5]}
                    renderItem={() => (
                        <RNView style={[styles.productCard, { marginHorizontal: 16, marginBottom: 12, backgroundColor: Colors[colorScheme].card }]}>
                            <Skeleton height={80} />
                        </RNView>
                    )}
                    keyExtractor={(id) => id.toString()}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={(item: any) => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchProducts} tintColor={Colors[colorScheme].primary} />}
                    ListEmptyComponent={
                        <EmptyState
                            icon={Box}
                            title="No products yet"
                            description="Add your first product to start selling on DashDrive Mart."
                            actionLabel="Add Product"
                            onAction={() => console.log('Add product modal')}
                        />
                    }
                />
            )}

            <TouchableOpacity style={[styles.fab, { backgroundColor: Colors[colorScheme].primary }]}>
                <Plus size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchRow: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E293B',
        padding: 12,
        borderRadius: 12,
        gap: 10,
    },
    placeholder: {
        color: '#94A3B8',
        fontSize: 14,
    },
    filterBtn: {
        backgroundColor: '#1E293B',
        width: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    productCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        marginBottom: 12,
    },
    productLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        gap: 12,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    productInfo: {
        backgroundColor: 'transparent',
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 14,
        color: '#10B981',
        fontWeight: 'bold',
        marginVertical: 2,
    },
    stockLevel: {
        fontSize: 12,
    },
    productRight: {
        backgroundColor: 'transparent',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    empty: {
        padding: 60,
        alignItems: 'center',
    },
    emptyText: {
        color: '#94A3B8',
        marginBottom: 20,
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 8,
    },
    addBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    }
});
