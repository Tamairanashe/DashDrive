import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Package,
  Bike,
  Utensils,
  ShoppingBag,
  ChevronRight,
  User,
  Clock,
  MapPin,
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
    Merchant: {
      type: string;
    };
  };
  Delivery?: {
    Rider?: {
      name: string;
    };
  };
}

export default function OperationsScreen() {
  const { session } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3002';

  const fetchLiveOrders = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/operations/live-orders`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching live orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLiveOrders();
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'FOOD': return <Utensils size={20} color="#FF9F0A" />;
      case 'MART': return <ShoppingBag size={20} color="#0A84FF" />;
      case 'SHOPPING': return <Package size={20} color="#BF5AF2" />;
      default: return <Bike size={20} color="#00FF90" />;
    }
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderId}>{item.orderNumber}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status.replace(/_/g, ' ')}</Text>
          </View>
        </View>
        <Text style={styles.orderPrice}>{item.currency} {item.totalAmount.toFixed(2)}</Text>
      </View>

      <View style={styles.orderInfo}>
        <View style={styles.infoRow}>
          {getServiceIcon(item.Store.Merchant.type)}
          <Text style={styles.storeName}>{item.Store.name}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <User size={14} color="#8E8E93" />
          <Text style={styles.riderName}>{item.Delivery?.Rider?.name || 'Searching for rider...'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Clock size={14} color="#8E8E93" />
          <Text style={styles.timeText}>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionText}>Manage</Text>
          <ChevronRight size={16} color="#00FF90" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Operations</Text>
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
              <Text style={styles.emptyTitle}>No Live Orders</Text>
              <Text style={styles.emptySub}>Platform activity is currently minimal.</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  list: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusBadge: {
    backgroundColor: 'rgba(0, 255, 144, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00FF90',
    textTransform: 'uppercase',
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  orderInfo: {
    gap: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  riderName: {
    fontSize: 13,
    color: '#8E8E93',
  },
  timeText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  cardActions: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 12,
    alignItems: 'flex-end',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00FF90',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
  },
  emptySub: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
  },
});
