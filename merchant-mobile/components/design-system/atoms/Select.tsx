import React from 'react';
import { View, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Body, Caption } from '../atoms/Typography';
import Colors from '@/constants/Colors';

interface SelectOption {
    label: string;
    value: any;
}

interface SelectProps {
    label?: string;
    value: any;
    options: SelectOption[];
    onSelect: (value: any) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
}

export const Select = ({
    label,
    value,
    options,
    onSelect,
    placeholder = "Select an option",
    error,
    disabled = false,
}: SelectProps) => {
    const colorScheme = (useColorScheme() ?? 'dark') as 'light' | 'dark';
    const themeColors = Colors[colorScheme];

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <View style={styles.container}>
            {label && <Caption style={[styles.label, { color: themeColors.text }]}>{label}</Caption>}
            <TouchableOpacity
                activeOpacity={0.7}
                disabled={disabled}
                onPress={() => console.log('Open Selection Overlay')} // Placeholder for ActionSheet trigger
                style={[
                    styles.selectWrapper,
                    {
                        backgroundColor: themeColors.card,
                        borderColor: error ? themeColors.error : themeColors.border,
                        borderWidth: 1.5,
                    },
                    disabled && { opacity: 0.5 }
                ]}
            >
                <Body style={{ color: selectedOption ? themeColors.text : '#64748B' }}>
                    {selectedOption ? selectedOption.label : placeholder}
                </Body>
                <ChevronDown size={20} color="#64748B" />
            </TouchableOpacity>
            {error && <Caption style={{ color: themeColors.error, marginTop: 4, marginLeft: 4 }}>{error}</Caption>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    selectWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 14,
        paddingHorizontal: 16,
        height: 56,
    },
});
