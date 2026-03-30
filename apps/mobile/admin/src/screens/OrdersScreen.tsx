import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  SegmentedControlIOS,
} from 'react-native';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Filter,
  Package,
  Bike,
  Clock,
  ChevronRight,
} from 'lucide-react-native';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
  Store: {
    name: string;
  };
}

export default function OrdersScreen() {
  const { session } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3002';

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/stores/list?status=CONFIRMED`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.cardMain}>
        <View style={styles.orderHead}>
          <Text style={styles.orderNum}>{item.orderNumber}</Text>
          <Text style={styles.orderPrice}>{item.currency} {item.totalAmount.toFixed(2)}</Text>
        </View>
        <Text style={styles.storeName}>{item.Store.name}</Text>
        <View style={styles.orderMeta}>
          <View style={styles.metaItem}>
            <Clock size={12} color="#8E8E93" />
            <Text style={styles.metaText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
          <View style={[styles.statusTag, { backgroundColor: item.status === 'DELIVERED' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 159, 10, 0.1)' }]}>
            <Text style={[styles.statusText, { color: item.status === 'DELIVERED' ? '#34C759' : '#FF9F0A' }]}>{item.status}</Text>
          </View>
        </View>
      </View>
      <ChevronRight size={20} color="#3A3A3C" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order Audit</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Filter size={20} color="#00FF90" />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00FF90" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00FF90" />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Package size={48} color="#1C1C1E" />
              <Text style={styles.emptyTitle}>Order History is Empty</Text>
            </View>
          }
        />
      )}
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
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 16,
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardMain: {
    flex: 1,
  },
  orderHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    marginRight: 12,
  },
  orderNum: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  orderPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00FF90',
  },
  storeName: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 12,
  },
  orderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#48484A',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3A3A3C',
    marginTop: 16,
  },
});
