import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View as RNView, Switch } from 'react-native';
import { Text, View, Card } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { User, Store, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
    const { merchant, store, signOut } = useAuth();
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    const SettingItem = ({ icon: Icon, title, subtitle, onPress, isDestructive, hasSwitch }: any) => (
        <TouchableOpacity style={styles.item} onPress={onPress}>
            <RNView style={[styles.iconContainer, isDestructive && { backgroundColor: '#EF444410' }]}>
                <Icon size={20} color={isDestructive ? '#EF4444' : colors.primary} />
            </RNView>
            <RNView style={styles.itemContent}>
                <Text style={[styles.itemTitle, isDestructive && { color: '#EF4444' }]}>{title}</Text>
                {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
            </RNView>
            {hasSwitch ? (
                <Switch
                    value={true}
                    trackColor={{ false: '#334155', true: '#10B98120' }}
                    thumbColor={'#10B981'}
                />
            ) : (
                <ChevronRight size={20} color="#94A3B8" />
            )}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <RNView style={styles.profileSection}>
                <RNView style={[styles.avatar, { backgroundColor: colors.primary }]}>
                    <Text style={styles.avatarText}>{merchant?.storeName?.charAt(0)}</Text>
                </RNView>
                <Text style={styles.profileName}>{merchant?.storeName}</Text>
                <Text style={styles.profileEmail}>{merchant?.email}</Text>
            </RNView>

            <RNView style={styles.section}>
                <Text style={styles.sectionTitle}>Store Configuration</Text>
                <Card style={styles.card}>
                    <SettingItem icon={Store} title="Business Profile" subtitle="Name, address, contact info" />
                    <RNView style={styles.separator} />
                    <SettingItem icon={Bell} title="Notifications" subtitle="Push alerts and sound settings" hasSwitch />
                </Card>
            </RNView>

            <RNView style={styles.section}>
                <Text style={styles.sectionTitle}>Account & Security</Text>
                <Card style={styles.card}>
                    <SettingItem icon={User} title="Staff Management" subtitle="Manage employee access" />
                    <RNView style={styles.separator} />
                    <SettingItem icon={Shield} title="Security" subtitle="Password and authentication" />
                </Card>
            </RNView>

            <RNView style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>
                <Card style={styles.card}>
                    <SettingItem icon={HelpCircle} title="Help Center" subtitle="FAQs and customer support" />
                </Card>
            </RNView>

            <RNView style={styles.section}>
                <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
                    <LogOut size={20} color="#EF4444" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </RNView>

            <RNView style={styles.footer}>
                <Text style={styles.versionText}>DashDrive Mart Partner v1.0.0</Text>
            </RNView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profileSection: {
        alignItems: 'center',
        padding: 32,
        backgroundColor: 'transparent',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileEmail: {
        fontSize: 14,
        color: '#94A3B8',
        marginTop: 4,
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        marginLeft: 4,
    },
    card: {
        padding: 4,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    itemSubtitle: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 2,
    },
    separator: {
        height: 1,
        backgroundColor: '#334155',
        marginLeft: 68,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EF444410',
        padding: 16,
        borderRadius: 16,
        gap: 10,
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    versionText: {
        color: '#475569',
        fontSize: 12,
    },
});
