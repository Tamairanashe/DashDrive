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
  AlertTriangle,
  ShieldAlert,
  ChevronRight,
  TrendingDown,
  XCircle,
  Eye,
} from 'lucide-react-native';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface RiskEvent {
  id: string;
  eventType: string;
  riskScore: number;
  decision: string;
  reasons: any;
  createdAt: string;
}

export default function AlertsScreen() {
  const { session } = useAuth();
  const [alerts, setAlerts] = useState<RiskEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3002';

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/alerts`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAlerts();
  };

  const getAlertColor = (score: number) => {
    if (score >= 80) return '#FF453A';
    if (score >= 50) return '#FF9F0A';
    return '#FFD60A';
  };

  const renderAlert = ({ item }: { item: RiskEvent }) => (
    <View style={styles.alertCard}>
      <View style={styles.alertHeader}>
        <View style={[styles.alertIcon, { backgroundColor: getAlertColor(item.riskScore) + '15' }]}>
          <ShieldAlert size={20} color={getAlertColor(item.riskScore)} />
        </View>
        <View style={styles.alertHeaderText}>
          <Text style={styles.alertType}>{item.eventType.replace(/_/g, ' ')}</Text>
          <Text style={styles.alertTime}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: getAlertColor(item.riskScore) }]}>
          <Text style={styles.scoreText}>{item.riskScore.toFixed(0)}</Text>
        </View>
      </View>

      <Text style={styles.alertReason} numberOfLines={2}>
        {item.reasons ? JSON.stringify(item.reasons).replace(/["{}]/g, '') : 'No detailed reason provided.'}
      </Text>

      <View style={styles.alertActions}>
        <TouchableOpacity style={styles.investigateBtn}>
          <Eye size={16} color="#00FF90" />
          <Text style={styles.investigateText}>Investigate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dismissBtn}>
          <XCircle size={16} color="#8E8E93" />
          <Text style={styles.dismissText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Risk Alerts</Text>
        <View style={styles.summaryBox}>
          <AlertTriangle size={18} color="#FF9F0A" />
          <Text style={styles.summaryText}>{alerts.length} active platform risks detected</Text>
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00FF90" />
        </View>
      ) : (
        <FlatList
          data={alerts}
          renderItem={renderAlert}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00FF90" />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <ShieldAlert size={48} color="#1C1C1E" />
              <Text style={styles.emptyTitle}>Platform is Secure</Text>
              <Text style={styles.emptySub}>No critical risk events detected.</Text>
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
    marginBottom: 8,
  },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 159, 10, 0.05)',
    padding: 10,
    borderRadius: 10,
  },
  summaryText: {
    fontSize: 13,
    color: '#FF9F0A',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  alertCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  alertType: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  alertTime: {
    fontSize: 11,
    color: '#48484A',
    marginTop: 2,
  },
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
  },
  alertReason: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
    marginBottom: 16,
  },
  alertActions: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 12,
  },
  investigateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 36,
    backgroundColor: 'rgba(0, 255, 144, 0.1)',
    borderRadius: 10,
  },
  investigateText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00FF90',
  },
  dismissBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
  },
  dismissText: {
    fontSize: 13,
    fontWeight: '700',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
  },
  emptySub: {
    fontSize: 14,
    color: '#48484A',
    marginTop: 8,
  },
});
