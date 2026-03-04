import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Radius } from '../../constants/Radius';
import { Spacing } from '../../constants/Spacing';
import { Shadows } from '../../constants/Shadows';

export interface CardProps {
    children: React.ReactNode;
    padding?: keyof typeof Spacing;
    radius?: keyof typeof Radius;
    shadow?: keyof typeof Shadows;
    onPress?: () => void;
    style?: ViewStyle;
}

export const Card = ({
    children,
    padding = 'md',
    radius = 'lg',
    shadow = 'sm',
    onPress,
    style,
}: CardProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            activeOpacity={0.8}
            onPress={onPress}
            style={[
                styles.card,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: Radius[radius],
                    padding: Spacing[padding],
                    ...Shadows[shadow],
                },
                style,
            ]}
        >
            {children}
        </Container>
    );
};

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
    },
});
