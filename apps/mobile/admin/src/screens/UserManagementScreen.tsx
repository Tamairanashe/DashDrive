import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { ChevronLeft, User, Mail, Shield, Search, MoreVertical } from 'lucide-react-native';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  lastLogin?: string;
  createdAt: string;
}

export default function UserManagementScreen({ onBack }: { onBack: () => void }) {
  const { session } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3002';

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/users`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      setUsers(response.data.data);
      setFilteredUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Mock data for UI development
      const mockUsers = [
        { id: '1', name: 'Super Admin', email: 'admin@dashdrive.com', role: 'SUPER_ADMIN', createdAt: new Date().toISOString() },
        { id: '2', name: 'Fleet Master', email: 'fleet@dashdrive.com', role: 'FLEET_MANAGER', createdAt: new Date().toISOString() },
        { id: '3', name: 'Support Ace', email: 'support@dashdrive.com', role: 'SUPPORT_AGENT', createdAt: new Date().toISOString() },
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        u => 
          u.name.toLowerCase().includes(text.toLowerCase()) || 
          u.email.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return '#00FF90';
      case 'FLEET_MANAGER': return '#0A84FF';
      case 'SUPPORT_AGENT': return '#BF5AF2';
      default: return '#8E8E93';
    }
  };

  const renderItem = ({ item }: { item: AdminUser }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={[styles.avatar, { backgroundColor: '#1C1C1E' }]}>
          <User size={24} color={getRoleColor(item.role)} />
        </View>
        <View style={styles.info}>
          <Text style={styles.userName}>{item.name}</Text>
          <View style={styles.row}>
            <Mail size={12} color="#8E8E93" />
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
          <View style={[styles.roleBadge, { borderColor: getRoleColor(item.role) + '40' }]}>
            <Shield size={10} color={getRoleColor(item.role)} />
            <Text style={[styles.roleText, { color: getRoleColor(item.role) }]}>{item.role.replace('_', ' ')}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <MoreVertical size={20} color="#3A3A3C" />
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
        <Text style={styles.headerTitle}>User Directory</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Search size={18} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor="#48484A"
            value={search}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00FF90" />
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00FF90" />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <User size={48} color="#1C1C1E" />
              <Text style={styles.emptyText}>No users found</Text>
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
  searchContainer: {
    padding: 16,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    marginLeft: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#0A0A0A',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 13,
    color: '#8E8E93',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  moreBtn: {
    padding: 8,
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
    color: '#3A3A3C',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
});
