import React from 'react';
import {
    Switch as RNSwitch,
    TouchableOpacity,
    View,
    StyleSheet,
    useColorScheme
} from 'react-native';
import { Check } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface SwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
}

export const Switch = ({ value, onValueChange, disabled = false }: SwitchProps) => {
    const colorScheme = (useColorScheme() ?? 'dark') as 'light' | 'dark';
    const themeColors = Colors[colorScheme];

    return (
        <RNSwitch
            value={value}
            onValueChange={onValueChange}
            disabled={disabled}
            trackColor={{ false: '#334155', true: themeColors.primary + '30' }}
            thumbColor={value ? themeColors.primary : '#64748B'}
            ios_backgroundColor="#334155"
        />
    );
};

interface CheckBoxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export const CheckBox = ({ checked, onChange, disabled = false }: CheckBoxProps) => {
    const colorScheme = (useColorScheme() ?? 'dark') as 'light' | 'dark';
    const themeColors = Colors[colorScheme];

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onChange(!checked)}
            disabled={disabled}
            style={[
                styles.checkbox,
                {
                    borderColor: checked ? themeColors.primary : themeColors.border,
                    backgroundColor: checked ? themeColors.primary : 'transparent',
                },
                disabled && { opacity: 0.5 }
            ]}
        >
            {checked && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
