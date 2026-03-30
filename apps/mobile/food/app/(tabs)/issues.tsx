import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { Text } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/src/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import IssueCard, { Issue } from '../../src/components/IssueCard';

import { useAuthStore } from '@/src/store/useAuthStore';
import { socketService } from '@/src/lib/socket';

export default function IssuesScreen() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    useEffect(() => {
        if (!user?.store_id) return;

        fetchIssues();

        // Realtime Escaltion Feed
        socketService.on('newIssue', (issue: Issue) => {
            console.log("Realtime (Socket): New Issue received", issue.id);
            setIssues(prev => [issue, ...prev]);
        });

        return () => {
            socketService.off('newIssue');
        };
    }, [user?.store_id]);

    const fetchIssues = async () => {
        try {
            const { data, error } = await supabase
                .from('issues')
                .select(`
          *,
          orders (
            customer_name,
            total_amount
          )
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setIssues(data || []);
        } catch (error) {
            console.error('Error fetching issues:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Issues</Text>
                    <Text style={styles.subtitle}>Track disputes and losses</Text>
                </View>
                <Pressable style={styles.filterButton}>
                    <Ionicons name="filter-outline" size={24} color="#fff" />
                </Pressable>
            </View>

            <FlashList
                data={issues}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item }) => <IssueCard issue={item} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="shield-checkmark-outline" size={64} color="rgba(150, 150, 150, 0.2)" />
                        <Text style={styles.emptyText}>All clear! No active issues found.</Text>
                    </View>
                }
                contentContainerStyle={styles.listContent}
                refreshing={loading}
                onRefresh={fetchIssues}
            />
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
        paddingTop: 20,
        paddingBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#8E8E93',
        fontWeight: '500',
        marginTop: 6,
    },
    filterButton: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#1C1C1E',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    listContent: {
        padding: 24,
        paddingBottom: 40,
    },
    emptyContainer: {
        marginTop: 120,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        color: '#8E8E93',
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 20,
        lineHeight: 24,
    },
});
