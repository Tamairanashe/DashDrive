import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Radius } from '../../constants/Radius';

export interface SkeletonProps {
    width?: number | string;
    height?: number | string;
    circle?: boolean;
    radius?: keyof typeof Radius;
    style?: ViewStyle;
}

export const Skeleton = ({
    width = '100%',
    height = 20,
    circle = false,
    radius = 'sm',
    style,
}: SkeletonProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
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
        );

        animation.start();

        return () => animation.stop();
    }, [opacity]);

    const borderRadiusValue = circle
        ? (typeof width === 'number' ? width / 2 : 999)
        : Radius[radius];

    const skeletonStyle = {
        width,
        height,
        borderRadius: borderRadiusValue,
        backgroundColor: theme === 'light' ? '#E2E8F0' : '#334155',
        opacity,
    } as any;

    return (
        <Animated.View
            style={[
                styles.skeleton,
                skeletonStyle,
                style,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    skeleton: {
        overflow: 'hidden',
    },
});
