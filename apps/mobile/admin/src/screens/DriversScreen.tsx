import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bike,
  Search,
  ChevronRight,
  Star,
  Circle,
  Phone,
  MessageSquare,
} from 'lucide-react-native';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Rider {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  isOnline: boolean;
  isActive: boolean;
  rating: number;
  totalDeliveries: number;
}

export default function DriversScreen() {
  const { session } = useAuth();
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3002';

  const fetchRiders = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/riders`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      setRiders(response.data);
    } catch (error) {
      console.error('Error fetching riders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRiders();
  };

  const filteredRiders = riders.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.phone.includes(search)
  );

  const renderRider = ({ item }: { item: Rider }) => (
    <TouchableOpacity style={styles.riderCard}>
      <View style={styles.riderHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Bike size={24} color="#00FF90" />
          </View>
          <View style={[styles.statusIndicator, { backgroundColor: item.isOnline ? '#34C759' : '#8E8E93' }]} />
        </View>
        
        <View style={styles.riderMainInfo}>
          <Text style={styles.riderName}>{item.name}</Text>
          <Text style={styles.riderVehicle}>{item.vehicleType} • {item.phone}</Text>
          <View style={styles.ratingRow}>
            <Star size={12} color="#FFD60A" fill="#FFD60A" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            <Text style={styles.deliveryCount}>• {item.totalDeliveries} deliveries</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.actionBtn}>
          <ChevronRight size={20} color="#3A3A3C" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.footerAction}>
          <Phone size={16} color="#8E8E93" />
          <Text style={styles.footerActionText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerAction}>
          <MessageSquare size={16} color="#8E8E93" />
          <Text style={styles.footerActionText}>Message</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fleet Management</Text>
        <View style={styles.searchBar}>
          <Search size={18} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search drivers..."
            placeholderTextColor="#48484A"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00FF90" />
        </View>
      ) : (
        <FlatList
          data={filteredRiders}
          renderItem={renderRider}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00FF90" />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Bike size={48} color="#1C1C1E" />
              <Text style={styles.emptyTitle}>No Drivers Found</Text>
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
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    marginLeft: 8,
  },
  list: {
    padding: 16,
  },
  riderCard: {
    backgroundColor: '#0A0A0A',
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  riderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#0A0A0A',
  },
  riderMainInfo: {
    flex: 1,
    marginLeft: 16,
  },
  riderName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  riderVehicle: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  deliveryCount: {
    fontSize: 12,
    color: '#48484A',
  },
  actionBtn: {
    padding: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  footerAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
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
