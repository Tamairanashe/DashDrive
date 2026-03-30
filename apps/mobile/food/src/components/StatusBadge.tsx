import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../../components/Themed';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    new: { label: 'New', color: '#2196F3', bg: 'rgba(33, 150, 243, 0.1)' },
    in_progress: { label: 'In Progress', color: '#FF9800', bg: 'rgba(255, 152, 0, 0.1)' },
    ready: { label: 'Ready', color: '#4CAF50', bg: 'rgba(76, 175, 80, 0.1)' },
    completed: { label: 'Completed', color: '#9E9E9E', bg: 'rgba(158, 158, 158, 0.1)' },
    unfulfilled: { label: 'Unfulfilled', color: '#F44336', bg: 'rgba(244, 67, 54, 0.1)' },
};

export default function StatusBadge({ status }: { status: string }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.new;

    return (
        <View style={[styles.container, { backgroundColor: config.bg }]}>
            <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    text: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
});
