import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { ChevronLeft, Store, CheckCircle2, XCircle, MapPin, User } from 'lucide-react-native';
import axios from 'axios';

interface Store {
  id: string;
  name: string;
  address: string;
  ownerName?: string;
  email?: string;
  status: string;
  createdAt: string;
}

export default function MerchantApprovalsScreen({ onBack }: { onBack: () => void }) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3002';

  const fetchPendingStores = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/admin/stores/list?status=PENDING`);
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching pending stores:', error);
      // Mock data for UI development if backend fails
      setStores([
        { id: '1', name: 'Gourmet Burger Kitchen', address: '123 Main St, London', ownerName: 'John Doe', status: 'PENDING', createdAt: new Date().toISOString() },
        { id: '2', name: 'Sushi Zen', address: '456 High St, Manchester', ownerName: 'Jane Smith', status: 'PENDING', createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingStores();
  }, []);

  const handleAction = async (id: string, approve: boolean) => {
    try {
      setActioning(id);
      // In a real app, hit the patch endpoint
      await axios.patch(`${BACKEND_URL}/admin/stores/toggle-status/${id}`, {
        is_active: approve
      });
      
      Alert.alert('Success', `Merchant ${approve ? 'approved' : 'rejected'} successfully.`);
      setStores(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error actioning merchant:', error);
      Alert.alert('Error', 'Failed to update merchant status.');
    } finally {
      setActioning(null);
    }
  };

  const renderItem = ({ item }: { item: Store }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.storeAvatar}>
          <Store size={24} color="#00FF90" />
        </View>
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{item.name}</Text>
          <View style={styles.row}>
            <MapPin size={12} color="#8E8E93" />
            <Text style={styles.storeAddress}>{item.address}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <User size={14} color="#8E8E93" />
          <Text style={styles.detailText}>{item.ownerName || 'Unknown Owner'}</Text>
        </View>
        <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.rejectBtn]}
          onPress={() => handleAction(item.id, false)}
          disabled={actioning === item.id}
        >
          <XCircle size={18} color="#FF453A" />
          <Text style={styles.rejectText}>Reject</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.approveBtn]}
          onPress={() => handleAction(item.id, true)}
          disabled={actioning === item.id}
        >
          {actioning === item.id ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <>
              <CheckCircle2 size={18} color="#000000" />
              <Text style={styles.approveText}>Approve</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Merchant Approvals</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00FF90" />
        </View>
      ) : (
        <FlatList
          data={stores}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <CheckCircle2 size={48} color="#3A3A3C" />
              <Text style={styles.emptyText}>No pending applications</Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchPendingStores} tintColor="#00FF90" />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  list: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  storeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 255, 144, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  storeAddress: {
    fontSize: 13,
    color: '#8E8E93',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#2C2C2E',
    marginVertical: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  dateText: {
    fontSize: 12,
    color: '#48484A',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  rejectBtn: {
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.2)',
  },
  rejectText: {
    color: '#FF453A',
    fontSize: 14,
    fontWeight: '700',
  },
  approveBtn: {
    backgroundColor: '#00FF90',
  },
  approveText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
});
