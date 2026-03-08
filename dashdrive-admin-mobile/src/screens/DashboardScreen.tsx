import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import {
  Users,
  Package,
  Bike,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  DollarSign,
  Map as MapIcon,
} from 'lucide-react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { profile, session } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    activeDrivers: 0,
    activeOrders: 0,
    pendingRequests: 0,
    revenueToday: 0,
    systemStatus: 'Optimal',
  });
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3002';

  const fetchData = async () => {
    try {
      if (!session?.access_token) return;
      
      const [statsRes, alertsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/admin/dashboard/stats`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        }),
        axios.get(`${BACKEND_URL}/admin/dashboard/alerts`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        })
      ]);
      setStats(prev => ({ ...prev, ...statsRes.data }));
      setRecentAlerts(alertsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00FF90" />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Operations Hub</Text>
            <Text style={styles.userName}>Live Overview</Text>
          </View>
          <View style={styles.citySelector}>
            <MapIcon size={16} color="#00FF90" />
            <Text style={styles.cityName}>Global View</Text>
          </View>
        </View>

        <View style={styles.mainStats}>
          <View style={styles.statRow}>
            <View style={styles.mainStatCard}>
              <Text style={styles.mainStatValue}>{stats.activeDrivers}</Text>
              <Text style={styles.mainStatLabel}>Active Drivers</Text>
              <View style={[styles.trendBadge, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
                <TrendingUp size={12} color="#34C759" />
                <Text style={styles.trendText}>+12%</Text>
              </View>
            </View>
            <View style={styles.mainStatCard}>
              <Text style={styles.mainStatValue}>{stats.activeOrders}</Text>
              <Text style={styles.mainStatLabel}>Active Orders</Text>
              <View style={[styles.trendBadge, { backgroundColor: 'rgba(0, 122, 255, 0.1)' }]}>
                <Package size={12} color="#007AFF" />
                <Text style={[styles.trendText, { color: '#007AFF' }]}>Steady</Text>
              </View>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.mainStatCard}>
              <Text style={styles.mainStatValue}>{stats.pendingRequests}</Text>
              <Text style={styles.mainStatLabel}>Pending Tasks</Text>
            </View>
            <View style={styles.mainStatCard}>
              <Text style={styles.mainStatValue}>${stats.revenueToday.toLocaleString()}</Text>
              <Text style={styles.mainStatLabel}>Revenue Today</Text>
              <DollarSign size={16} color="#FFD60A" style={styles.statIconTop} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Real-time Health</Text>
            <View style={styles.statusBadge}>
              <ShieldCheck size={14} color="#00FF90" />
              <Text style={styles.statusText}>{stats.systemStatus}</Text>
            </View>
          </View>
          
          <View style={styles.healthCard}>
            <View style={styles.healthItem}>
              <Text style={styles.healthLabel}>API Latency</Text>
              <Text style={styles.healthValue}>42ms</Text>
            </View>
            <View style={styles.healthDivider} />
            <View style={styles.healthItem}>
              <Text style={styles.healthLabel}>Success Rate</Text>
              <Text style={styles.healthValue}>99.9%</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentAlerts.length > 0 ? (
            recentAlerts.map((alert, index) => (
              <View key={index} style={styles.alertItem}>
                <View style={[styles.alertIndicator, { backgroundColor: alert.riskScore > 70 ? '#FF453A' : '#FF9F0A' }]} />
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>{alert.eventType.replace(/_/g, ' ')}</Text>
                  <Text style={styles.alertSub}>{alert.reasons ? JSON.stringify(alert.reasons).substring(0, 40) : 'Potential anomaly detected'}</Text>
                </View>
                <Text style={styles.alertTime}>{new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyAlerts}>
              <ShieldCheck size={24} color="#1C1C1E" />
              <Text style={styles.emptyAlertsText}>No active alerts found</Text>
            </View>
          )}
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  citySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cityName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  mainStats: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  mainStatCard: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
    minHeight: 120,
    justifyContent: 'center',
  },
  mainStatValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  mainStatLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '600',
  },
  statIconTop: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  trendBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '800',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 144, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusText: {
    color: '#00FF90',
    fontSize: 12,
    fontWeight: '700',
  },
  healthCard: {
    flexDirection: 'row',
    backgroundColor: '#0A0A0A',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  healthItem: {
    flex: 1,
    alignItems: 'center',
  },
  healthLabel: {
    fontSize: 12,
    color: '#48484A',
    marginBottom: 4,
  },
  healthValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  healthDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    height: '100%',
  },
  seeAll: {
    fontSize: 14,
    color: '#00FF90',
    fontWeight: '700',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 16,
  },
  alertIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  alertSub: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  alertTime: {
    fontSize: 11,
    color: '#48484A',
  },
  emptyAlerts: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#0A0A0A',
    borderRadius: 20,
    gap: 12,
  },
  emptyAlertsText: {
    color: '#3A3A3C',
    fontSize: 14,
    fontWeight: '600',
  },
});
