import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { ChevronLeft, Settings, Save, AlertCircle, RefreshCw } from 'lucide-react-native';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Config {
  id: string;
  key: string;
  value: any;
  description?: string;
}

export default function SystemConfigScreen({ onBack }: { onBack: () => void }) {
  const { session, profile } = useAuth();
  const [configs, setConfigs] = useState<Config[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3002';

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/platform-config`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      setConfigs(response.data.data);
    } catch (error) {
      console.error('Error fetching configs:', error);
      // Mock data for UI development
      const mockConfigs = [
        { id: '1', key: 'MAINTENANCE_MODE', value: false, description: 'Disable customer app features during system updates' },
        { id: '2', key: 'AUTO_APPROVE_STORES', value: true, description: 'Automatically approve new merchant store applications' },
        { id: '3', key: 'PUSH_ALERTS_ADMIN', value: true, description: 'Send push notifications to admins for critical failures' },
      ];
      setConfigs(mockConfigs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleToggle = async (key: string, currentValue: boolean) => {
    try {
      setSaving(key);
      const newValue = !currentValue;
      
      await axios.post(`${BACKEND_URL}/platform-config/${key}`, {
        value: newValue
      }, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      setConfigs(prev => prev.map(c => c.key === key ? { ...c, value: newValue } : c));
    } catch (error) {
      console.error('Error updating config:', error);
      Alert.alert('Error', 'Failed to update system configuration.');
    } finally {
      setSaving(null);
    }
  };

  const renderConfigItem = (item: Config) => (
    <View key={item.id} style={styles.configItem}>
      <View style={styles.configInfo}>
        <Text style={styles.configKey}>{item.key.replace(/_/g, ' ')}</Text>
        <Text style={styles.configDesc}>{item.description}</Text>
      </View>
      {typeof item.value === 'boolean' ? (
        <View style={styles.actionArea}>
          {saving === item.key ? (
            <ActivityIndicator size="small" color="#00FF90" />
          ) : (
            <Switch
              value={item.value}
              onValueChange={() => handleToggle(item.key, item.value)}
              trackColor={{ false: '#2C2C2E', true: '#00FF90' }}
              thumbColor={item.value ? '#FFFFFF' : '#8E8E93'}
            />
          )}
        </View>
      ) : (
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>System Configuration</Text>
        <TouchableOpacity onPress={fetchConfigs} style={styles.backBtn}>
          <RefreshCw size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {profile?.role !== 'SUPER_ADMIN' ? (
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color="#FF453A" />
          <Text style={styles.errorTitle}>Restricted Access</Text>
          <Text style={styles.errorText}>Only Super Administrators can modify global system parameters.</Text>
          <TouchableOpacity style={styles.returnBtn} onPress={onBack}>
            <Text style={styles.returnText}>Return to Dashboard</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00FF90" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Global Parameters</Text>
            <View style={styles.configCard}>
              {configs.map(renderConfigItem)}
              {configs.length === 0 && (
                <Text style={styles.emptyText}>No configurations available.</Text>
              )}
            </View>
          </View>

          <View style={styles.warningBox}>
            <AlertCircle size={18} color="#FF9F0A" />
            <Text style={styles.warningText}>
              Changes made here affect all users and services across the entire DashDrive platform immediately.
            </Text>
          </View>
        </ScrollView>
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
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    marginLeft: 4,
  },
  configCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  configItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  configInfo: {
    flex: 1,
    marginRight: 16,
  },
  configKey: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  configDesc: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
  },
  actionArea: {
    width: 50,
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editText: {
    color: '#00FF90',
    fontSize: 13,
    fontWeight: '600',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 159, 10, 0.05)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 159, 10, 0.1)',
    gap: 12,
  },
  warningText: {
    flex: 1,
    color: '#FF9F0A',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#3A3A3C',
    textAlign: 'center',
    padding: 24,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  returnBtn: {
    backgroundColor: '#00FF90',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  returnText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 15,
  },
});
