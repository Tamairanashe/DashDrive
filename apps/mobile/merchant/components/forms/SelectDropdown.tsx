import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Dimensions,
    ViewStyle
} from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { Text } from '../ui/Text';
import { BottomSheet } from '../overlays/BottomSheet';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';
import { Radius } from '../../constants/Radius';
import { Divider } from '../ui/Divider';

export interface SelectOption {
    label: string;
    value: string | number;
}

export interface SelectDropdownProps {
    label?: string;
    placeholder?: string;
    options: SelectOption[];
    value?: string | number;
    onSelect: (value: string | number) => void;
    error?: string;
    containerStyle?: ViewStyle;
}

export const SelectDropdown = ({
    label,
    placeholder = 'Select an option',
    options,
    value,
    onSelect,
    error,
    containerStyle,
}: SelectDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    const selectedOption = options.find(opt => opt.value === value);

    const handleSelect = (val: string | number) => {
        onSelect(val);
        setIsOpen(false);
    };

    return (
        <View style={[styles.wrapper, containerStyle]}>
            {label && (
                <Text variant="bodySmall" style={[styles.label, { color: colors.text }]}>
                    {label}
                </Text>
            )}

            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsOpen(true)}
                style={[
                    styles.container,
                    {
                        backgroundColor: colors.card,
                        borderColor: error ? colors.error : colors.border
                    }
                ]}
            >
                <Text
                    variant="bodyMedium"
                    style={{
                        color: selectedOption ? colors.text : (theme === 'light' ? '#94A3B8' : '#475569'),
                        flex: 1
                    }}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <ChevronDown size={20} color={colors.text} />
            </TouchableOpacity>

            <BottomSheet
                visible={isOpen}
                onClose={() => setIsOpen(false)}
                title={label || placeholder}
            >
                <FlatList
                    data={options}
                    keyExtractor={(item) => item.value.toString()}
                    ItemSeparatorComponent={() => <Divider marginVertical="none" />}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handleSelect(item.value)}
                        >
                            <Text
                                variant="bodyMedium"
                                style={{
                                    color: item.value === value ? colors.primary : colors.text,
                                    fontWeight: item.value === value ? '600' : '400',
                                    flex: 1
                                }}
                            >
                                {item.label}
                            </Text>
                            {item.value === value && <Check size={20} color={colors.primary} />}
                        </TouchableOpacity>
                    )}
                    style={styles.list}
                    contentContainerStyle={{ paddingBottom: Spacing.xl }}
                />
            </BottomSheet>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: Spacing.md,
    },
    label: {
        marginBottom: Spacing.xs,
        fontWeight: '600',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: Radius.md,
        height: 48,
        paddingHorizontal: Spacing.md,
    },
    list: {
        flexGrow: 0,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.lg,
    },
});
