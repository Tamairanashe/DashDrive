import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RouteInputProps {
    from: string;
    to: string;
    onFromChange?: (text: string) => void;
    onToChange?: (text: string) => void;
    editable?: boolean;
}

export const RouteInput: React.FC<RouteInputProps> = ({ from, to, onFromChange, onToChange, editable = true }) => {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={[styles.dot, { backgroundColor: '#3b82f6' }]} />
                <TextInput 
                    value={from}
                    onChangeText={onFromChange}
                    placeholder="Origin City"
                    editable={editable}
                    style={styles.input}
                />
            </View>
            <View style={styles.line} />
            <View style={styles.row}>
                <View style={[styles.dot, { backgroundColor: '#000' }]} />
                <TextInput 
                    value={to}
                    onChangeText={onToChange}
                    placeholder="Destination City"
                    editable={editable}
                    style={styles.input}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: '#f9fafb', padding: 24, borderRadius: 32, borderWidth: 1, borderColor: '#f3f4f6' },
    row: { flexDirection: 'row', alignItems: 'center' },
    dot: { height: 8, width: 8, borderRadius: 4, marginRight: 16 },
    input: { flex: 1, fontSize: 18, fontWeight: '600', color: '#111827' },
    line: { height: 1, backgroundColor: '#e5e7eb', marginLeft: 24, marginVertical: 16 }
});
