import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Switch,
} from 'react-native';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Shield,
  Bell,
  Lock,
  LogOut,
  ChevronRight,
  Settings,
  HelpCircle,
} from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();
  const [pushEnabled, setPushEnabled] = React.useState(true);

  const menuItems = [
    { icon: <Shield size={20} color="#00FF90" />, title: 'Security & 2FA', sub: 'Protect your admin account' },
    { icon: <Bell size={20} color="#0A84FF" />, title: 'Notifications', sub: 'Manage operational alerts' },
    { icon: <Settings size={20} color="#BF5AF2" />, title: 'Preferences', sub: 'Dark mode and language' },
    { icon: <HelpCircle size={20} color="#8E8E93" />, title: 'Support Hub', sub: 'Contact system engineers' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile?.name?.charAt(0) || 'A'}</Text>
          </View>
          <Text style={styles.userName}>{profile?.name || 'Admin'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{profile?.role?.replace(/_/g, ' ') || 'SUPPORT AGENT'}</Text>
          </View>
          <Text style={styles.userEmail}>{profile?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={[styles.menuItem, index === menuItems.length - 1 && styles.noBorder]}>
                <View style={styles.menuLeft}>
                  <View style={styles.menuIconContainer}>{item.icon}</View>
                  <View>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSub}>{item.sub}</Text>
                  </View>
                </View>
                <ChevronRight size={18} color="#3A3A3C" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Toggles</Text>
          <View style={styles.menuCard}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleText}>
                <Text style={styles.menuTitle}>Live Dashboard</Text>
                <Text style={styles.menuSub}>Auto-refresh metrics every 30s</Text>
              </View>
              <Switch 
                value={pushEnabled} 
                onValueChange={setPushEnabled}
                trackColor={{ false: '#3A3A3C', true: '#00FF90' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
          <LogOut size={20} color="#FF453A" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>DashDrive Admin v2.1.0 • Stable Build</Text>
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
    alignItems: 'center',
    paddingVertical: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#00FF90',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: 'rgba(0, 255, 144, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00FF90',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  userEmail: {
    fontSize: 14,
    color: '#8E8E93',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: '#0A0A0A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  menuSub: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  toggleText: {
    flex: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.2)',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF453A',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#48484A',
    marginTop: 32,
  },
});
