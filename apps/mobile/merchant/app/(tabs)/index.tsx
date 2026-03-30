import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, ScrollView, RefreshControl, TouchableOpacity, FlatList, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { DashboardStats } from '@/types/analytics';
import { DollarSign, Package, AlertCircle, Clock, ChevronRight } from 'lucide-react-native';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { Skeleton, LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function DashboardScreen() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { merchant } = useAuth();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const router = useRouter();

  const fetchDashboardData = useCallback(async () => {
    try {
      setError(false);
      const response = await api.get('/analytics/mobile/today');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, icon: Icon, color, loading: cardLoading }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Icon size={20} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      {cardLoading ? (
        <Skeleton height={24} width={80} style={{ marginTop: 4 }} />
      ) : (
        <Text style={styles.statValue}>{value}</Text>
      )}
    </View>
  );

  if (error && !stats) {
    return <ErrorState onRetry={fetchDashboardData} />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors[colorScheme].primary} />}
    >
      <RNView style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.merchantName}>{merchant?.storeName}</Text>
        </View>
        <RNView style={styles.statusBadge}>
          <RNView style={[styles.statusDot, { backgroundColor: Colors[colorScheme as 'light' | 'dark'].primary }]} />
          <Text style={styles.statusText}>Live</Text>
        </RNView>
      </RNView>

      <RNView style={styles.statsGrid}>
        <StatCard
          title="Revenue"
          value={`$${stats?.revenue.toFixed(2) || '0.00'}`}
          icon={DollarSign}
          color={Colors[colorScheme].primary}
          loading={loading}
        />
        <StatCard
          title="Orders"
          value={stats?.todayOrders || 0}
          icon={Package}
          color={Colors[colorScheme].info}
          loading={loading}
        />
        <StatCard
          title="Pending"
          value={stats?.pendingOrders || 0}
          icon={Clock}
          color={Colors[colorScheme].warning}
          loading={loading}
        />
        <StatCard
          title="Low Stock"
          value={stats?.lowStockAlerts || 0}
          icon={AlertCircle}
          color={Colors[colorScheme].error}
          loading={loading}
        />
      </RNView>

      <RNView style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Live Orders</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/orders')}>
          <Text style={[styles.viewAll, { color: Colors[colorScheme as 'light' | 'dark'].primary }]}>View All</Text>
        </TouchableOpacity>
      </RNView>

      {loading ? (
        [1, 2, 3].map((i) => (
          <RNView key={i} style={[styles.orderCard, { backgroundColor: Colors[colorScheme as 'light' | 'dark'].card, marginBottom: 12 }]}>
            <Skeleton height={60} />
          </RNView>
        ))
      ) : stats?.recentOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No live orders"
          description="New orders from customers will appear here in real-time."
          actionLabel="Refresh Now"
          onAction={onRefresh}
        />
      ) : (
        stats?.recentOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderCard}
            onPress={() => router.push({ pathname: '/order/[id]', params: { id: order.id } })}
          >
            <RNView style={styles.orderMain}>
              <RNView style={styles.orderInfo}>
                <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
                <Text style={styles.orderItems}>
                  {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </Text>
              </RNView>
              <RNView style={styles.orderMeta}>
                <Text style={styles.orderPrice}>${order.totalAmount.toFixed(2)}</Text>
                <Text style={styles.orderTime}>{format(new Date(order.createdAt), 'HH:mm')}</Text>
              </RNView>
            </RNView>
            <RNView style={styles.orderFooter}>
              <StatusBadge status={order.status} />
              <ChevronRight size={20} color="#94A3B8" />
            </RNView>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  welcomeContainer: {
    backgroundColor: 'transparent',
  },
  greeting: {
    fontSize: 16,
    color: '#94A3B8',
  },
  merchantName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: '#10B981',
    fontWeight: '600',
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    // Note: Theme context might be needed for card bg if not inherited
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  statTitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    // Add border/background if needed, though they inherit from Theme
  },
  orderMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  orderInfo: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 14,
    color: '#94A3B8',
  },
  orderMeta: {
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 16,
  },
});
