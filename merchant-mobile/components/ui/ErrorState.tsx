import React from 'react';
import { StyleSheet, TouchableOpacity, View as RNView } from 'react-native';
import { Text, View } from '../Themed';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface ErrorStateProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
}

export function ErrorState({
    title = 'Oops! Something went wrong',
    description = 'We were unable to load the data. Please check your connection and try again.',
    onRetry
}: ErrorStateProps) {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            <RNView style={styles.iconContainer}>
                <AlertTriangle size={48} color={colors.error} />
            </RNView>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>

            {onRetry && (
                <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
                    <RefreshCw size={18} color={colors.primary} />
                    <Text style={[styles.retryText, { color: colors.primary }]}>Try Again</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    iconContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
    },
    retryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 12,
    },
    retryText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
