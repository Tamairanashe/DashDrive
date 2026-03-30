import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { Body, Heading, Caption } from '../atoms/Typography';
import { Card } from '@/components/Themed';
import Colors from '@/constants/Colors';

interface StatItem {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: string;
        isPositive: boolean;
    };
}

interface StatsGridProps {
    stats: StatItem[];
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
    const colorScheme = (useColorScheme() ?? 'dark') as 'light' | 'dark';
    const themeColors = Colors[colorScheme];

    return (
        <View style={styles.grid}>
            {stats.map((stat, index) => (
                <Card key={index} style={styles.statCard}>
                    <View style={styles.statHeader}>
                        <View style={[styles.iconContainer, { backgroundColor: themeColors.primary + '15' }]}>
                            {stat.icon}
                        </View>
                        {stat.trend && (
                            <Caption style={{ color: stat.trend.isPositive ? '#10B981' : '#EF4444' }}>
                                {stat.trend.value}
                            </Caption>
                        )}
                    </View>
                    <View style={styles.statBody}>
                        <Heading style={styles.statValue}>{stat.value}</Heading>
                        <Caption style={styles.statLabel}>{stat.label}</Caption>
                    </View>
                </Card>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        padding: 16,
        backgroundColor: 'transparent',
    },
    statCard: {
        width: '48%', // Rough half-width
        padding: 16,
        flexGrow: 1,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
        backgroundColor: 'transparent',
    },
    iconContainer: {
        padding: 8,
        borderRadius: 10,
    },
    statBody: {
        backgroundColor: 'transparent',
    },
    statValue: {
        fontSize: 22,
        marginBottom: 2,
    },
    statLabel: {
        fontWeight: '600',
    },
});
