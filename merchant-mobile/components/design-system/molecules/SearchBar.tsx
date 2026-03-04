import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Input } from '../atoms/Input';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onClear?: () => void;
    placeholder?: string;
}

export const SearchBar = ({
    value,
    onChangeText,
    onClear,
    placeholder = "Search..."
}: SearchBarProps) => {
    return (
        <View style={styles.container}>
            <Input
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                icon={<Search size={20} color="#64748B" />}
                style={styles.input}
                rightElement={
                    value.length > 0 ? (
                        <TouchableOpacity onPress={onClear}>
                            <X size={20} color="#64748B" />
                        </TouchableOpacity>
                    ) : null
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'transparent',
    },
    input: {
        marginBottom: 0,
    },
});
