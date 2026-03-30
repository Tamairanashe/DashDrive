import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View as RNView, RefreshControl } from 'react-native';
import { Text, View, Card } from '@/components/Themed';
import api from '@/services/api';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { TrendingUp, TrendingDown, ArrowUpRight, DollarSign } from 'lucide-react-native';
import { format } from 'date-fns';

import { Skeleton, LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export default function WalletScreen() {
    const [wallet, setWallet] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';

    const fetchWallet = useCallback(async () => {
        try {
            setError(false);
            const response = await api.get('/wallet/summary');
            setWallet(response.data);
        } catch (error) {
            console.error('Failed to fetch wallet summary', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWallet();
    }, [fetchWallet]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchWallet();
        setRefreshing(false);
    };

    if (error && !wallet) {
        return <ErrorState onRetry={fetchWallet} />;
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors[colorScheme].primary} />}
        >
            <Card style={[styles.balanceCard, { backgroundColor: Colors[colorScheme].primary }]}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                {loading ? (
                    <Skeleton height={44} width={150} borderRadius={8} style={{ backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 20 }} />
                ) : (
                    <Text style={styles.balanceAmount}>${wallet?.balance.toFixed(2) || '0.00'}</Text>
                )}
                <RNView style={styles.balanceFooter}>
                    <Text style={styles.currencyCode}>{wallet?.currency || 'USD'}</Text>
                    <TouchableOpacity style={styles.withdrawBtn}>
                        <Text style={[styles.withdrawText, { color: Colors[colorScheme].primary }]}>Withdraw</Text>
                    </TouchableOpacity>
                </RNView>
            </Card>

            <RNView style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
            </RNView>

            {loading ? (
                [1, 2, 3].map((i) => (
                    <Card key={i} style={[styles.txCard, { height: 80, marginBottom: 12 }]}>
                        <Skeleton height={50} />
                    </Card>
                ))
            ) : wallet?.recentTransactions.length === 0 ? (
                <EmptyState
                    icon={DollarSign}
                    title="No transactions"
                    description="Your earnings and payouts will appear here."
                    actionLabel="Refresh Wallet"
                    onAction={onRefresh}
                />
            ) : (
                wallet?.recentTransactions.map((tx: any) => (
                    <Card key={tx.id} style={styles.txCard}>
                        <RNView style={styles.txIcon}>
                            {tx.type === 'CREDIT' ? (
                                <TrendingUp size={20} color="#10B981" />
                            ) : (
                                <TrendingDown size={20} color="#EF4444" />
                            )}
                        </RNView>
                        <RNView style={styles.txInfo}>
                            <Text style={styles.txDesc}>{tx.description || 'Order Payment'}</Text>
                            <Text style={styles.txDate}>{format(new Date(tx.createdAt), 'MMM d, HH:mm')}</Text>
                        </RNView>
                        <RNView style={styles.txAmountContainer}>
                            <Text style={[styles.txAmount, { color: tx.type === 'CREDIT' ? '#10B981' : '#EF4444' }]}>
                                {tx.type === 'CREDIT' ? '+' : '-'}${tx.amount.toFixed(2)}
                            </Text>
                            <Text style={styles.txStatus}>Success</Text>
                        </RNView>
                    </Card>
                ))
            )}
            <RNView style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    balanceCard: {
        padding: 24,
        borderRadius: 24,
        marginBottom: 32,
        borderWidth: 0,
    },
    balanceLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginBottom: 8,
    },
    balanceAmount: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    balanceFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    currencyCode: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    withdrawBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    withdrawText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    txCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
    },
    txIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    txInfo: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    txDesc: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    txDate: {
        fontSize: 12,
        color: '#94A3B8',
    },
    txAmountContainer: {
        alignItems: 'flex-end',
        backgroundColor: 'transparent',
    },
    txAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    txStatus: {
        fontSize: 11,
        color: '#94A3B8',
    },
    empty: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#94A3B8',
    }
});
