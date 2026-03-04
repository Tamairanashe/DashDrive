import React, { useEffect, useRef } from 'react';
import { StyleSheet, ActivityIndicator, Animated, View as RNView, ViewProps, useColorScheme } from 'react-native';
import { Text, View } from '../Themed';
import Colors from '@/constants/Colors';

interface LoadingStateProps {
    message?: string;
    fullScreen?: boolean;
}

export function LoadingState({ message = 'Loading...', fullScreen = false }: LoadingStateProps) {
    const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';

    const content = (
        <RNView style={styles.center}>
            <ActivityIndicator size="large" color={Colors[colorScheme].primary} />
            {message && <Text style={styles.loadingText}>{message}</Text>}
        </RNView>
    );

    if (fullScreen) {
        return <View style={styles.fullScreen}>{content}</View>;
    }

    return content;
}

export function Skeleton({ width, height, borderRadius = 8, style }: { width?: any; height: any; borderRadius?: number; style?: any }) {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={[
                {
                    width: width || '100%',
                    height,
                    borderRadius,
                    backgroundColor: Colors[colorScheme as 'light' | 'dark'].card === '#FFFFFF' ? '#E2E8F0' : '#1E293B',
                    opacity,
                },
                style,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        color: '#94A3B8',
        fontSize: 14,
        fontWeight: '500',
    },
});
