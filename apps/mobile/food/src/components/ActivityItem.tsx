import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../../components/Themed';
import { Ionicons } from '@expo/vector-icons';

interface ActivityItemProps {
    type: 'order' | 'issue' | 'system';
    title: string;
    time: string;
    description: string;
}

const TYPE_CONFIG = {
    order: { icon: 'receipt-outline', color: '#4CAF50' },
    issue: { icon: 'alert-circle-outline', color: '#F44336' },
    system: { icon: 'settings-outline', color: '#2196F3' },
};

export default function ActivityItem({ type, title, time, description }: ActivityItemProps) {
    const config = TYPE_CONFIG[type];

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: `${config.color}15` }]}>
                <Ionicons name={config.icon as any} size={20} color={config.color} />
            </View>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.time}>{time}</Text>
                </View>
                <Text style={styles.description}>{description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.03)',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    time: {
        fontSize: 12,
        color: '#8E8E93',
    },
    description: {
        fontSize: 14,
        color: '#8E8E93',
        lineHeight: 18,
    },
});
