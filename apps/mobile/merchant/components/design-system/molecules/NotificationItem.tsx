import React from 'react';
import { View, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react-native';
import { Body, Caption } from '../atoms/Typography';
import Colors from '@/constants/Colors';

type NotificationType = 'info' | 'warning' | 'success' | 'order';

interface NotificationItemProps {
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    read?: boolean;
    onPress?: () => void;
}

export const NotificationItem = ({
    type,
    title,
    message,
    time,
    read = false,
    onPress,
}: NotificationItemProps) => {
    const colorScheme = (useColorScheme() ?? 'dark') as 'light' | 'dark';
    const themeColors = Colors[colorScheme];

    const getIcon = () => {
        switch (type) {
            case 'info': return <Info size={20} color={themeColors.primary} />;
            case 'warning': return <AlertTriangle size={20} color="#F59E0B" />;
            case 'success': return <CheckCircle size={20} color="#10B981" />;
            case 'order': return <Bell size={20} color={themeColors.primary} />;
            default: return <Bell size={20} color={themeColors.primary} />;
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={[
                styles.container,
                { backgroundColor: themeColors.card, borderColor: themeColors.border },
                !read && { borderLeftWidth: 4, borderLeftColor: themeColors.primary },
            ]}
        >
            <View style={[styles.iconContainer, { backgroundColor: themeColors.primary + '10' }]}>
                {getIcon()}
            </View>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Body style={[styles.title, !read ? { fontWeight: '700' } : {}]}>{title}</Body>
                    <Caption style={styles.time}>{time}</Caption>
                </View>
                <Caption numberOfLines={2} style={styles.message}>{message}</Caption>
            </View>
            {!read && <View style={[styles.unreadDot, { backgroundColor: themeColors.primary }]} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    content: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 15,
    },
    time: {
        fontSize: 11,
    },
    message: {
        fontSize: 13,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 8,
    },
});
