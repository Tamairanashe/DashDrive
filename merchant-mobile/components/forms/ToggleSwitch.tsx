import React, { useEffect, useRef } from 'react';
import {
    TouchableOpacity,
    Animated,
    StyleSheet,
    View,
    ViewStyle
} from 'react-native';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';
import { Radius } from '../../constants/Radius';
import { Text } from '../ui/Text';

export interface ToggleSwitchProps {
    label?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    containerStyle?: ViewStyle;
}

export const ToggleSwitch = ({
    label,
    value,
    onValueChange,
    containerStyle,
}: ToggleSwitchProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    const moveAnimation = useRef(new Animated.Value(value ? 22 : 2)).current;

    useEffect(() => {
        Animated.spring(moveAnimation, {
            toValue: value ? 22 : 2,
            useNativeDriver: true,
            tension: 40,
            friction: 7,
        }).start();
    }, [value, moveAnimation]);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onValueChange(!value)}
            style={[styles.wrapper, containerStyle]}
        >
            {label && (
                <Text variant="bodyMedium" style={[styles.label, { color: colors.text }]}>
                    {label}
                </Text>
            )}
            <View
                style={[
                    styles.track,
                    { backgroundColor: value ? colors.primary : (theme === 'light' ? '#E2E8F0' : '#334155') }
                ]}
            >
                <Animated.View
                    style={[
                        styles.thumb,
                        {
                            backgroundColor: '#FFFFFF',
                            transform: [{ translateX: moveAnimation }]
                        }
                    ]}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.sm,
    },
    label: {
        flex: 1,
        fontWeight: '500',
    },
    track: {
        width: 48,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
    },
    thumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        position: 'absolute',
        // Shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
});
