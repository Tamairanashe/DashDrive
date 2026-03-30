import React from 'react';
import { StyleSheet, View, Pressable, ScrollView, Image } from 'react-native';
import { Text } from '../../components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/lib/supabase';

export default function AccountScreen() {
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarPlaceholder}>
                        <Ionicons name="person" size={40} color="#fff" />
                    </View>
                    <Text style={styles.userName}>Restaurant Manager</Text>
                    <Text style={styles.userRole}>Store Owner • DashFood Enterprise</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    <Pressable style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.menuIconContainer, { backgroundColor: '#2196F320' }]}>
                                <Ionicons name="notifications-outline" size={20} color="#2196F3" />
                            </View>
                            <Text style={styles.menuItemLabel}>Notifications</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#888" />
                    </Pressable>

                    <Pressable style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.menuIconContainer, { backgroundColor: '#4CAF5020' }]}>
                                <Ionicons name="shield-outline" size={20} color="#4CAF50" />
                            </View>
                            <Text style={styles.menuItemLabel}>Security</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#888" />
                    </Pressable>

                    <Pressable style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.menuIconContainer, { backgroundColor: '#FF980020' }]}>
                                <Ionicons name="key-outline" size={20} color="#FF9800" />
                            </View>
                            <Text style={styles.menuItemLabel}>API Keys</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#888" />
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <Pressable style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.menuIconContainer, { backgroundColor: '#9C27B020' }]}>
                                <Ionicons name="help-circle-outline" size={20} color="#9C27B0" />
                            </View>
                            <Text style={styles.menuItemLabel}>Help Center</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#888" />
                    </Pressable>

                    <Pressable style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.menuIconContainer, { backgroundColor: '#607D8B20' }]}>
                                <Ionicons name="document-text-outline" size={20} color="#607D8B" />
                            </View>
                            <Text style={styles.menuItemLabel}>Terms of Service</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#888" />
                    </Pressable>
                </View>

                <Pressable style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#F44336" />
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                </Pressable>

                <Text style={styles.versionText}>dashFood Mobile v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollContent: {
        padding: 24,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1C1C1E',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
    },
    userName: {
        fontSize: 26,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    userRole: {
        fontSize: 15,
        color: '#8E8E93',
        fontWeight: '600',
        marginTop: 6,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#8E8E93',
        textTransform: 'uppercase',
        marginBottom: 16,
        marginLeft: 4,
        letterSpacing: 1.2,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        padding: 16,
        borderRadius: 18,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    menuItemLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 69, 58, 0.2)',
        marginTop: 20,
    },
    logoutButtonText: {
        color: '#FF453A',
        fontSize: 17,
        fontWeight: '700',
        marginLeft: 10,
    },
    versionText: {
        textAlign: 'center',
        color: '#48484A',
        fontSize: 13,
        fontWeight: '500',
        marginTop: 40,
        marginBottom: 60,
    },
});
