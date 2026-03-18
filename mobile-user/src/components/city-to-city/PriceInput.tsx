import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface PriceInputProps {
    value: string;
    onChangeText: (text: string) => void;
    recommendedRange?: string;
}

export const PriceInput: React.FC<PriceInputProps> = ({ value, onChangeText, recommendedRange }) => {
    return (
        <View style={styles.container}>
            {recommendedRange && (
                <Text style={styles.label}>Recommended: {recommendedRange}</Text>
            )}
            <View style={styles.inputWrapper}>
                <Text style={styles.currency}>$</Text>
                <TextInput 
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType="numeric"
                    style={styles.input}
                    placeholder="0"
                />
            </View>
            <Text style={styles.helper}>Suggested based on route demand</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: 'rgba(59, 130, 246, 0.05)', padding: 32, borderRadius: 32, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.1)' },
    label: { color: '#3b82f6', fontWeight: '800', textAlign: 'center', marginBottom: 16 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    currency: { fontSize: 40, fontWeight: '800', marginRight: 8, color: '#18181b' },
    input: { fontSize: 56, fontWeight: '800', color: '#18181b', textAlign: 'center', minWidth: 100 },
    helper: { color: '#a1a1aa', fontWeight: '500', textAlign: 'center', marginTop: 16 }
});
