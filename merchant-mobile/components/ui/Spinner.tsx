import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps, StyleSheet, View } from 'react-native';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';

export interface SpinnerProps extends ActivityIndicatorProps {
    variant?: 'primary' | 'white' | 'gray';
}

export const Spinner = ({
    variant = 'primary',
    size = 'small',
    style,
    ...props
}: SpinnerProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    const getColor = () => {
        switch (variant) {
            case 'white': return '#FFFFFF';
            case 'gray': return theme === 'light' ? '#64748B' : '#94A3B8';
            default: return colors.primary;
        }
    };

    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator
                color={getColor()}
                size={size}
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
});
