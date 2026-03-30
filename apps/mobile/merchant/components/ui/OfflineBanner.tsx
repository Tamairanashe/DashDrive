import React from 'react';
import { StyleSheet, Animated, View as RNView } from 'react-native';
import { Text } from '../Themed';
import { WifiOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface OfflineBannerProps {
    visible: boolean;
}

export function OfflineBanner({ visible }: OfflineBannerProps) {
    const insets = useSafeAreaInsets();

    if (!visible) return null;

    return (
        <RNView style={[styles.container, { paddingTop: insets.top }]}>
            <RNView style={styles.content}>
                <WifiOff size={16} color="#fff" />
                <Text style={styles.text}>You're currently offline. Actions are disabled.</Text>
            </RNView>
        </RNView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#EF4444',
        zIndex: 9999,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        gap: 8,
    },
    text: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
