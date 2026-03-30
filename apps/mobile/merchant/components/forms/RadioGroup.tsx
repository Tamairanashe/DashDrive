import React from 'react';
import {
    TouchableOpacity,
    View,
    StyleSheet,
    ViewStyle
} from 'react-native';
import { Text } from '../ui/Text';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';

export interface RadioOption {
    label: string;
    value: string | number;
}

export interface RadioGroupProps {
    label?: string;
    options: RadioOption[];
    value: string | number;
    onSelect: (value: string | number) => void;
    containerStyle?: ViewStyle;
}

export const RadioGroup = ({
    label,
    options,
    value,
    onSelect,
    containerStyle,
}: RadioGroupProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    return (
        <View style={[styles.wrapper, containerStyle]}>
            {label && (
                <Text variant="bodySmall" style={[styles.label, { color: colors.text }]}>
                    {label}
                </Text>
            )}
            {options.map((option) => {
                const isSelected = option.value === value;
                return (
                    <TouchableOpacity
                        key={option.value}
                        activeOpacity={0.7}
                        onPress={() => onSelect(option.value)}
                        style={styles.container}
                    >
                        <View
                            style={[
                                styles.outerCircle,
                                { borderColor: isSelected ? colors.primary : colors.border }
                            ]}
                        >
                            {isSelected && (
                                <View style={[styles.innerCircle, { backgroundColor: colors.primary }]} />
                            )}
                        </View>
                        <Text
                            variant="bodyMedium"
                            style={[styles.optionLabel, { color: colors.text }]}
                        >
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: Spacing.md,
    },
    label: {
        marginBottom: Spacing.sm,
        fontWeight: '600',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
    },
    outerCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    optionLabel: {
        marginLeft: Spacing.sm,
        fontWeight: '500',
    },
});
