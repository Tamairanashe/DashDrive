import React from 'react';
import { StyleSheet, TouchableOpacity, View as RNView } from 'react-native';
import { Text, View } from '../Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { LucideIcon } from 'lucide-react-native';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    return (
        <View style={styles.container}>
            <RNView style={styles.iconCircle}>
                <Icon size={40} color={colors.primary} />
            </RNView>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>

            {actionLabel && onAction && (
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={onAction}
                >
                    <Text style={styles.buttonText}>{actionLabel}</Text>
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
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
