import React from 'react';
import {
    TouchableOpacity,
    View,
    StyleSheet,
    ViewStyle
} from 'react-native';
import { Check } from 'lucide-react-native';
import { Text } from '../ui/Text';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';
import { Radius } from '../../constants/Radius';

export interface CheckboxProps {
    label?: string;
    checked: boolean;
    onPress: () => void;
    error?: string;
    containerStyle?: ViewStyle;
}

export const Checkbox = ({
    label,
    checked,
    onPress,
    error,
    containerStyle,
}: CheckboxProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={[styles.container, containerStyle]}
        >
            <View
                style={[
                    styles.box,
                    {
                        borderColor: error ? colors.error : (checked ? colors.primary : colors.border),
                        backgroundColor: checked ? colors.primary : 'transparent'
                    }
                ]}
            >
                {checked && <Check size={16} color="#FFFFFF" strokeWidth={3} />}
            </View>
            {label && (
                <Text
                    variant="bodyMedium"
                    style={[styles.label, { color: colors.text }]}
                >
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.xs,
    },
    box: {
        width: 24,
        height: 24,
        borderRadius: Radius.xs,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        marginLeft: Spacing.sm,
        fontWeight: '500',
    },
});
