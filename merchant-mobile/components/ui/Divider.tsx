import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';

export interface DividerProps {
    marginVertical?: keyof typeof Spacing;
    color?: string;
    style?: ViewStyle;
}

export const Divider = ({
    marginVertical = 'md',
    color,
    style,
}: DividerProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    return (
        <View
            style={[
                styles.divider,
                {
                    marginVertical: Spacing[marginVertical],
                    backgroundColor: color || colors.border,
                },
                style,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    divider: {
        height: 1,
        width: '100%',
    },
});
